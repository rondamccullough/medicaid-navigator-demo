#!/usr/bin/env python3
"""Approval-first social content generator for Radiant Motive's public Medicaid guide.

Reads the same state status data used by the public site and writes ready-to-review
posts. It does not log in to social networks or publish automatically.
"""
import argparse, csv, json
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parents[1]
STATUS_FILE = ROOT / "public-medicaid" / "state-status.json"
PLATFORMS = ("facebook", "instagram", "linkedin", "x")

def shorten(text, limit):
    if len(text) <= limit:
        return text
    return text[:limit-1].rsplit(" ", 1)[0].rstrip() + "…"

def post_for(state, platform, site_url):
    name, code, status = state["name"], state["code"], state["status"]
    source = state.get("source_url") or "https://www.medicaid.gov/Federal-Policy-Guidance/Downloads/smd26006.pdf"
    if status == "announced":
        core = (f"{name} has publicly announced that it plans to use the optional Medicaid hold-harmless period. "
                "Important: this is not a pause on all implementation. The state still assesses whether applicable people meet the requirement "
                "or qualify for an exclusion or exception. Coverage denials or disenrollments based solely on community-engagement noncompliance "
                "may be paused during the approved period. Check official notices.")
    elif status == "intent":
        core = (f"{name} has announced an intent to use the optional Medicaid hold-harmless period. "
                "The state's plan and CMS approval status should be checked before relying on the protection. "
                "The federal January 1, 2027 implementation date remains important; state assessments may still occur.")
    elif status == "declined":
        core = (f"{name} has announced it will not use the optional Medicaid hold-harmless period. "
                "The January 1, 2027 federal start remains relevant for applicable people. Not every Medicaid member is subject to the requirement; "
                "check the state's official instructions.")
    else:
        core = (f"Medicaid's 2027 community-engagement changes are state-specific. We have not verified a public hold-harmless election for {name} in our current guide. "
                "That does not mean the state has declined. Check official state notices and confirm whether the rule applies to your coverage group.")
    if platform == "x":
        text = f"{core} State guide: {site_url}?state={code} CMS: {source}"
        return shorten(text, 280)
    if platform == "instagram":
        return (f"{core}\n\nStart with your state. Read official notices. Keep your contact information current. "
                f"Use our free state guide: {site_url}?state={code}\n\n#Medicaid #HealthCoverage #MedicaidUpdates #RadiantMotive")
    if platform == "linkedin":
        return (f"STATE UPDATE: {name}\n\n{core}\n\n"
                f"Radiant Motive's public Medicaid Access Guide organizes state announcements and practical next steps. "
                f"This is general educational information, not an eligibility determination.\n"
                f"State guide: {site_url}?state={code}\nSource: {source}")
    return (f"{core}\n\nFind your state's information in the free Radiant Motive Medicaid Access Guide: "
            f"{site_url}?state={code}\nOfficial source: {source}\n\n"
            "This is general information. Follow your state Medicaid agency's notices and deadlines.")

def main():
    parser = argparse.ArgumentParser(description="Generate review-ready Medicaid social posts.")
    parser.add_argument("--state", help="Two-letter state code; omit to generate for every state.")
    parser.add_argument("--platform", choices=PLATFORMS, help="Generate for one platform; default is all four.")
    parser.add_argument("--site-url", default="https://YOUR-PUBLIC-MEDICAID-SITE-URL", help="Published public guide URL.")
    parser.add_argument("--all-states", action="store_true", help="Include states without a verified public announcement.")\n    parser.add_argument("--output", default="social-post-queue.csv", help="CSV output filename.")
    args = parser.parse_args()
    data = json.loads(STATUS_FILE.read_text(encoding="utf-8"))
    states = data["states"]
    if args.state:
        states = [s for s in states if s["code"].upper() == args.state.upper()]
        if not states:
            raise SystemExit(f"Unknown state code: {args.state}")
    platforms = [args.platform] if args.platform else list(PLATFORMS)
    rows = []
    for state in states:
        for platform in platforms:
            rows.append({
                "created_on": date.today().isoformat(),
                "state": state["name"],
                "state_code": state["code"],
                "status": state["status"],
                "platform": platform,
                "post_text": post_for(state, platform, args.site_url),
                "source_url": state.get("source_url", ""),
                "human_review_required": "YES",
                "publishing_status": "DRAFT"
            })
    output = Path(args.output)
    with output.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} draft posts to {output.resolve()}")
    print("Nothing was published. Review every claim, source, link, and platform character limit before posting.")

if __name__ == "__main__":
    main()
