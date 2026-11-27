# Radiant Motive Public Benefits Navigator

A public-facing utility website separate from the paid FQHC Clinic Track. Medicaid is the first interactive program module. The program registry is configuration-driven so SNAP, Housing Choice Vouchers (Section 8), veterans' benefits, and additional public programs can be added over time.

## Current architecture
- index.html: responsive public utility homepage, guided next-step builder, state selector, activity planner, deadline calculator, and program directory.
- programs.json: program registry, official resource links, and rollout status. Add future programs here without rebuilding the homepage layout.
- state-status.json: state-level Medicaid announcement records, source links, summaries, and review dates.
- app.js: homepage rendering and Medicaid next-step builder. No backend, user account, or patient data store.
- tool-pages.js: shared browser-only logic for focused activity-hour, renewal-checklist, and deadline-calculator pages.
- medicaid-80-hour-tracker.html, medicaid-renewal-checklist.html, medicaid-notice-deadline-calculator.html: focused search landing pages with dedicated interactive tools.
- styles.css and components.css: responsive visual system, accessible controls, and print layout.
- guides.html: original Medicaid educational content and official references.
- about.html, editorial-policy.html, privacy.html, terms.html: trust, source, privacy, and use disclosures.
- ADSENSE-SETUP.md: owner-side AdSense setup sequence based on the video transcript.
- ../social-bot/: approval-first social post generator; it creates draft content and does not publish to social networks.

## Utility tools in the current Medicaid module
1. State status lookup: shows the independent tracker's status, source links, review date, CMS state-specific page, and official Medicaid agency directory.
2. Next-step builder: creates a general checklist for preparation, notices, renewals, applications, or questions about applicability.
3. Monthly activity planner: totals user-entered hours across activity categories and displays the 80-hour planning reference. It also displays the $580 monthly earnings pathway and half-time education route currently described in CMS public guidance.
4. Deadline calculator: counts calendar days until a date entered by the visitor.

The planner and calculator run only in the visitor's browser. The values are not transmitted to Radiant Motive or stored on a server. They are not eligibility, compliance, or deadline determinations.

## Program expansion
The programs.json registry currently contains:
- Medicaid — interactive module.
- SNAP — official USDA links; interactive module planned.
- Housing Choice Vouchers / Section 8 — official HUD links; interactive module planned.
- Veterans' benefits — official VA links; interactive module planned.

For each additional module, add a program record and its own verified content, source hierarchy, state/local routing, and tools. Do not reuse Medicaid rules or data fields for SNAP, housing, or veterans' programs.

## Medicaid state data
The initial state dataset is a partial research tracker. It includes a small number of public state announcements and labels other records unverified where no announcement was confirmed in the source set. It is not a complete CMS approval database. An announced state plan is not the same as CMS approval. Never convert an unverified record to announced or declined without a reliable official source and a new review date.

## Privacy and product boundaries
- Do not add patient names, Medicaid IDs, Social Security numbers, diagnoses, detailed income records, benefit documents, or other sensitive personal data.
- Do not add document uploads, eligibility determinations, application submissions, or patient accounts to this public MVP.
- The public utility site is not the FQHC Clinic Track and does not contain the paid clinic subscription flow.
- Official government websites remain the place for applications, notices, decisions, and submissions.

## Preview and deployment
This branch is isolated: public-medicaid-ad-revenue-mvp-2026-11. It has not been merged or deployed. Once deployed through the configured host, the folder should be available at /public-medicaid/; confirm the exact branch-deploy URL before sharing it publicly.

Before production:
1. Run functional and mobile tests on the deployed preview.
2. Verify state records and every official link.
3. Choose the final domain/subdomain and set canonical URLs.
4. Add a valid sitemap and robots configuration for that domain.
5. Set up Google Search Console and a privacy-appropriate analytics approach.
6. Complete the owner-side AdSense steps in ADSENSE-SETUP.md; never commit private account or payment details.
7. Add the exact publisher script only after the owner's AdSense account supplies it, then request review.
8. Update privacy and consent disclosures before activating advertising.

## Social distribution
The social generator is approval-first. It creates drafts from the state dataset; it does not authenticate to, or publish on, Facebook, Instagram, LinkedIn, Pinterest, or X. Platform publishing requires separate authorized developer apps, tokens, account permissions, and secure secret handling.
