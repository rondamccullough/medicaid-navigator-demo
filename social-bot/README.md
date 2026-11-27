# Radiant Motive Social Content Bot

Approval-first social content generator for the Public Benefits Navigator.

## What it creates
- State-specific Medicaid update drafts from the same state-status JSON used by the website.
- Evergreen educational drafts about the 80-hour planner, hours conversion, pay-frequency conversion, renewal preparation, notice response, call preparation, hold-harmless, and state updates.
- Drafts formatted for Facebook, Instagram, LinkedIn, Pinterest, and X.
- A CSV review queue with post title, copy, landing URL, official source, human-review flag, and draft status.

## Run it
Requires Python 3.9+ and no third-party packages.

python3 generate_posts.py
python3 generate_posts.py --state MD
python3 generate_posts.py --platform pinterest
python3 generate_posts.py --no-evergreen

By default, the generator creates state drafts for records labeled announced, intent, declined, or not_applicable, plus evergreen educational posts. Use --all-states to include unverified records; those drafts must never imply the state declined or opted in. Use --no-evergreen to create only state updates.

## Scheduled draft workflow
A GitHub Actions workflow is included at .github/workflows/social-draft-queue.yml. After this branch is merged into the repository's default branch, it can generate a draft queue three times per week and save it as a downloadable workflow artifact. Set the repository variable PUBLIC_MEDICAID_SITE_URL to the final public site URL. The workflow does not publish posts.

## Publishing boundary
This MVP generates drafts; it does not log in to or publish to social networks. Automatic publishing requires the relevant platform developer applications, account permissions, access tokens, and secure secret storage. Some networks restrict publishing APIs or require review. Do not paste API tokens into source files or commit them to GitHub.

## Editorial safety
- Do not say a state has CMS approval unless that approval is verified.
- Do not say a state declined the hold-harmless option unless a reliable source supports it.
- Do not imply every Medicaid member is subject to the federal requirement.
- Do not tell people they are exempt or eligible.
- Verify the source, status, date, and state-specific details before approving a post.
- Do not collect or publish personal beneficiary information.

## Next automation stage
A scheduled source-monitoring job can later check official source feeds, compare state records, and propose updates to the review queue. Human approval should remain required before publication until source monitoring and corrections have been tested.
