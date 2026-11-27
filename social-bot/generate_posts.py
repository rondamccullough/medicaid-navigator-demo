#!/usr/bin/env python3
"""Approval-first social content generator for Radiant Motive's Public Benefits Navigator.

Creates state-specific Medicaid updates plus evergreen educational posts for
Facebook, Instagram, LinkedIn, Pinterest, and X. It never logs in or publishes.
"""
import argparse
import csv
import json
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parents[1]
STATUS_FILE = ROOT / "public-medicaid" / "state-status.json"
PLATFORMS = ("facebook", "instagram", "linkedin", "pinterest", "x")
CMS_GUIDE = "https://www.medicaid.gov/renew-info"
CMS_COMMUNITY = "https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement"
CMS_HOLD = "https://www.medicaid.gov/Federal-Policy-Guidance/Downloads/smd26006.pdf"

EVERGREEN = [
    {
        "topic": "80-hour activity planner",
        "title": "Medicaid 2027: Organize Your Monthly Activity Hours",
        "body": "If the new Medicaid community-engagement requirement applies to you, CMS describes an 80-hour monthly activity pathway. Qualifying activities and verification rules matter, and not every Medicaid member is subject to the requirement. Use a planning tool, then confirm the rules with your state.",
        "path": "#medicaid-tools",
        "source_url": CMS_GUIDE,
        "hashtags": "#Medicaid #MedicaidUpdates #BenefitsNavigation"
    },
    {
        "topic": "Medicaid eligibility scope",
        "title": "Does the 2027 Medicaid Change Apply to Everyone?",
        "body": "No. The federal community-engagement requirement applies to defined Medicaid groups and includes exclusions and exceptions. Do not assume it applies to every member. Check your coverage group and your state's official instructions.",
        "path": "guides.html#who-may-be-affected",
        "source_url": CMS_COMMUNITY,
        "hashtags": "#Medicaid #HealthCoverage #KnowYourBenefits"
    },
    {
        "topic": "Renewal preparation",
        "title": "Medicaid Renewal: Five Steps to Prepare",
        "body": "Keep your contact information current. Read every notice. Note response dates. Use your state's official portal. Keep submission confirmations. A policy change does not remove other renewal responsibilities.",
        "path": "guides.html#renewals",
        "source_url": CMS_GUIDE,
        "hashtags": "#MedicaidRenewal #HealthCoverage #BenefitsHelp"
    },
    {
        "topic": "Medicaid notices",
        "title": "Received a Medicaid Notice? Start Here.",
        "body": "Read the full notice, identify exactly what the agency is asking for, note the response deadline, and use the contact information on the notice. Different notices can concern different eligibility issues. Follow the instructions in your own notice.",
        "path": "guides.html#notices",
        "source_url": "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip",
        "hashtags": "#Medicaid #BenefitsNavigation #CommunityResources"
    },
    {
        "topic": "Hold-harmless explanation",
        "title": "What Does Medicaid's Optional Hold-Harmless Period Mean?",
        "body": "The optional state hold-harmless period is not a blanket pause on Medicaid rules. It concerns certain coverage denials or disenrollments based solely on community-engagement noncompliance during an approved period. Other rules and deadlines still matter.",
        "path": "guides.html#hold-harmless",
        "source_url": CMS_HOLD,
        "hashtags": "#MedicaidPolicy #MedicaidUpdates #PublicBenefits"
    },
    {
        "topic": "State information",
        "title": "Medicaid 2027 Changes: Start With Your State",
        "body": "State implementation details matter. Check the latest state-specific CMS information and your state Medicaid agency. An announcement of intent is not the same as CMS approval, and an unverified status is not proof a state declined.",
        "path": "#medicaid-tools",
        "source_url": CMS_GUIDE,
        "hashtags": "#Medicaid #StateUpdates #BenefitsNavigation"
    }
]


def shorten(text, limit):
    if len(text) <= limit:
        return text
    return text[:limit - 1].rsplit(" ", 1)[0].rstrip() + "…"


def state_post(state, platform, site_url):
    name, code, status = state["name"], state["code"], state["status"]
    source = state.get("source_url") or CMS_HOLD
    landing = f"{site_url}?state={code}"

    if status == "announced":
        core = (
            f"{name} has publicly announced that it plans to use the optional Medicaid hold-harmless period. "
            "This is not a pause on all implementation. The state still assesses applicable people, and "
            "an approved period may pause certain denials or disenrollments based solely on community-engagement noncompliance."
        )
    elif status == "intent":
        core = (
            f"{name} has announced an intent to use the optional Medicaid hold-harmless period. "
            "Intent is not the same as CMS approval. Check the latest state and CMS instructions before relying on the option."
        )
    elif status == "declined":
        core = (
            f"{name} has announced it will not use the optional Medicaid hold-harmless period. "
            "The federal framework remains relevant for applicable people, subject to exclusions, exceptions, and other approved relief."
        )
    elif status == "not_applicable":
        core = (
            f"CMS's current state-specific page says the new Medicaid community-engagement work requirement does not apply in {name}. "
            "This is the current CMS state-page statement; check the official page and state agency for updates."
        )
    else:
        core = (
            f"We have not verified a public hold-harmless election for {name} in the Radiant Motive tracker. "
            "That does not mean the state declined. Check official state notices and confirm whether the rule applies to your coverage group."
        )

    title = f"Medicaid 2027 state update: {name}"
    if platform == "x":
        text = f"{core} State guide: {landing} CMS: {source}"
        return title, shorten(text, 280), landing
    if platform == "instagram":
        text = (
            f"{core}\n\nStart with your state. Read official notices. Keep your contact information current. "
            f"Free state guide: {landing}\n\n#Medicaid #HealthCoverage #MedicaidUpdates #RadiantMotive"
        )
        return title, text, landing
    if platform == "linkedin":
        text = (
            f"STATE UPDATE: {name}\n\n{core}\n\n"
            "Radiant Motive's Public Benefits Navigator organizes public state information and practical next steps. "
            f"This is general educational information, not an eligibility determination.\nState guide: {landing}\nSource: {source}"
        )
        return title, text, landing
    if platform == "pinterest":
        text = (
            f"{core} Use the free state guide to check the public status, open the CMS state page, and find official Medicaid contacts. "
            f"Save this resource: {landing} Source: {source} #Medicaid #BenefitsHelp #StateResources"
        )
        return title[:100], shorten(text, 500), landing
    text = (
        f"{core}\n\nFind your state's information in the free Radiant Motive Public Benefits Navigator: {landing}\n"
        f"Official source: {source}\n\nThis is general information. Follow your state Medicaid agency's notices and deadlines."
    )
    return title, text, landing


def evergreen_post(item, platform, site_url):
    landing = site_url.rstrip("/") + "/" + item["path"] if not item["path"].startswith("#") else site_url.rstrip("/") + item["path"]
    body = item["body"]
    source = item["source_url"]
    if platform == "x":
        return item["title"], shorten(f"{body} {landing} Source: {source}", 280), landing
    if platform == "instagram":
        return item["title"], f"{body}\n\nExplore the free guide: {landing}\n\n{item['hashtags']} #RadiantMotive", landing
    if platform == "linkedin":
        return item["title"], f"{item['title']}\n\n{body}\n\nUse the free Public Benefits Navigator: {landing}\nOfficial source: {source}", landing
    if platform == "pinterest":
        description = f"{body} Find the free planning tool and official source links: {landing} Source: {source} {item['hashtags']}"
        return item["title"][:100], shorten(description, 500), landing
    return item["title"], f"{body}\n\nUse the free Radiant Motive Public Benefits Navigator: {landing}\nOfficial source: {source}\n\n{item['hashtags']}", landing


def main():
    parser = argparse.ArgumentParser(description="Generate review-ready public-benefits social drafts.")
    parser.add_argument("--state", help="Two-letter state code; omit to generate for verified announcement states.")
    parser.add_argument("--platform", choices=PLATFORMS, help="Generate for one platform; default is all five.")
    parser.add_argument("--site-url", default="https://YOUR-PUBLIC-BENEFITS-SITE-URL", help="Published public guide URL.")
    parser.add_argument("--all-states", action="store_true", help="Include states without a verified public announcement.")
    parser.add_argument("--no-evergreen", action="store_true", help="Skip evergreen educational drafts.")
    parser.add_argument("--output", default="social-post-queue.csv", help="CSV output filename.")
    args = parser.parse_args()

    data = json.loads(STATUS_FILE.read_text(encoding="utf-8"))
    states = data["states"]
    if args.state:
        states = [state for state in states if state["code"].upper() == args.state.upper()]
        if not states:
            raise SystemExit(f"Unknown state code: {args.state}")
    elif not args.all_states:
        states = [state for state in states if state.get("status") in ("announced", "intent", "declined", "not_applicable")]

    platforms = [args.platform] if args.platform else list(PLATFORMS)
    rows = []
    for state in states:
        for platform in platforms:
            title, text, landing = state_post(state, platform, args.site_url.rstrip("/"))
            rows.append({
                "created_on": date.today().isoformat(),
                "content_type": "state_update",
                "topic": f"Medicaid state update - {state['name']}",
                "state": state["name"],
                "state_code": state["code"],
                "status": state["status"],
                "platform": platform,
                "post_title": title,
                "post_text": text,
                "landing_url": landing,
                "source_url": state.get("source_url") or CMS_HOLD,
                "human_review_required": "YES",
                "publishing_status": "DRAFT"
            })

    if not args.no_evergreen:
        for item in EVERGREEN:
            for platform in platforms:
                title, text, landing = evergreen_post(item, platform, args.site_url.rstrip("/"))
                rows.append({
                    "created_on": date.today().isoformat(),
                    "content_type": "evergreen_education",
                    "topic": item["topic"],
                    "state": "",
                    "state_code": "",
                    "status": "",
                    "platform": platform,
                    "post_title": title,
                    "post_text": text,
                    "landing_url": landing,
                    "source_url": item["source_url"],
                    "human_review_required": "YES",
                    "publishing_status": "DRAFT"
                })

    if not rows:
        raise SystemExit("No drafts generated. Check the state selection and options.")

    output = Path(args.output)
    with output.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} draft posts to {output.resolve()}")
    print("Nothing was published. Review every claim, source, link, and platform limit before posting.")


if __name__ == "__main__":
    main()
