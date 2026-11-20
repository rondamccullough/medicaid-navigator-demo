#!/usr/bin/env python3
"""Monthly clinic summary from anonymous event exports (CSV or JSON-lines).
Usage: python3 monthly_report.py events.csv [YYYY-MM]
Columns/keys expected: date, clinicId, eventName, pathway, lang  (no personal data exists in them)."""
import csv, json, sys, collections

path = sys.argv[1]
month = sys.argv[2] if len(sys.argv) > 2 else None
rows = []
with open(path, encoding='utf-8') as fh:
    if path.endswith('.csv'):
        rows = list(csv.DictReader(fh))
    else:
        rows = [json.loads(l) for l in fh if l.strip()]

stats = collections.defaultdict(lambda: collections.Counter())
langs = collections.defaultdict(lambda: collections.Counter())
for r in rows:
    if month and not str(r.get('date', '')).startswith(month):
        continue
    c = r.get('clinicId') or 'unknown'
    e = r.get('eventName')
    stats[c][e] += 1
    if e == 'session_started':
        langs[c][r.get('lang', 'en')] += 1

print(f"Radiant Motive Navigator - usage summary{' for ' + month if month else ''}")
for c in sorted(stats):
    s = stats[c]
    print(f"\n{c}")
    print(f"  Patient sessions started:        {s['session_started']}")
    print(f"  Reached exemptions checklist:    {s['exemptions_viewed']}")
    print(f"  Finished the guided path:        {s['path_completed']}")
    print(f"  Language switches:               {s['language_change']}")
    top = ', '.join(f'{k}: {v}' for k, v in langs[c].most_common())
    print(f"  Session language mix:            {top or 'n/a'}")
print("\nAnonymous counts only. 'Reached exemptions checklist' is a view count, not a determination of anyone's eligibility.")
