# Radiant Motive Social Content Bot (MVP)

This is an approval-first social content generator for the public Medicaid Access Guide.

## What it does
- Reads the same state-status JSON file used by the public website.
- Creates state-specific draft posts for Facebook, Instagram, LinkedIn, and X.
- Adds the source URL and the public state-guide URL.
- Exports a CSV review queue.
- Labels every post as requiring human review.

## Run it
Requires Python 3.9+ and no third-party packages.

```bash
python3 generate_posts.py --state MD --site-url https://YOUR-PUBLISHED-SITE-URL
python3 generate_posts.py --state NC --platform x --site-url https://YOUR-PUBLISHED-SITE-URL
python3 generate_posts.py --site-url https://YOUR-PUBLISHED-SITE-URL --output weekly-queue.csv
```

Omit `--state` to create a post for every state and DC. This creates a large batch; review before using.

## Important publishing boundary
This MVP generates drafts; it does not log in to or publish to social networks. Automatic publishing requires the relevant platform developer applications, account permissions, access tokens, and secure secret storage. Some networks restrict publishing APIs or require review. Do not paste API tokens into source files or commit them to GitHub.

## Editorial safety
- Do not say a state has CMS approval unless that approval is verified.
- Do not say a state declined the hold-harmless option unless a reliable source supports it.
- Do not imply every Medicaid member is subject to the federal requirement.
- Do not tell people they are exempt or eligible.
- Verify the source, status, date, and state-specific details before approving a post.
- Avoid collecting or publishing personal beneficiary information.

## Next automation stage
A scheduled Cloudflare Worker can later check approved official source feeds, compare state records, and add proposed posts to a review queue. Human approval should remain required before publication until the source-monitoring and correction process has been tested.
