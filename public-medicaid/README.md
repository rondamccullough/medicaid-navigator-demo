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
The initial state dataset is a partial research tracker. It distinguishes announced participation, announced intent, no election verified, a state-reported decision not to participate, and a current CMS state-page statement that the requirement does not apply. It is not a complete CMS approval database or a determination that the requirement applies to every Medicaid member in a state. Each record includes a CMS state-specific page URL. Always open that official page and the state agency's instructions. Never convert an unverified record to another status without a reliable official source and a new review date.

## Privacy and product boundaries
- Do not add patient names, Medicaid IDs, Social Security numbers, diagnoses, detailed income records, benefit documents, or other sensitive personal data.
- Do not add document uploads, eligibility determinations, application submissions, or patient accounts to this public MVP.
- The public utility site is not the FQHC Clinic Track and does not contain the paid clinic subscription flow.
- Official government websites remain the place for applications, notices, decisions, and submissions.

## Production domain and deployment

**Selected primary address:** https://benefits.radiantmotivenavigator.com/  
**Medicaid hub:** https://benefits.radiantmotivenavigator.com/medicaid/  
**Optional Medicaid-only alias:** `https://medicaid.radiantmotivenavigator.com` → redirects to the Medicaid hub after it is added as a domain alias in Netlify and its DNS is configured.

This public-benefits website is a separate Netlify site/deployment. Do not change the existing FQHC site's Netlify project, production branch, domain, or build settings.

### Create the separate Netlify site
1. In Netlify, choose **Add new project / Import an existing project** and connect the GitHub repository `rondamccullough/medicaid-navigator-demo`.
2. Select production branch `public-medicaid-ad-revenue-mvp-2026-11`. Do not select `main`.
3. Keep the repository root as the base directory; leave the build command blank (this is a static HTML/CSS/JS site).
4. Set the publish directory to `public-medicaid`.
5. Deploy. Netlify will provide a temporary `.netlify.app` address. Test that address before attaching the custom domain.
6. In the new site's **Domain management**, add `benefits.radiantmotivenavigator.com` as the primary custom domain. Use the exact DNS record Netlify displays for this site.
7. If you later want the Medicaid-only alias, add `medicaid.radiantmotivenavigator.com` to the same Netlify site as a domain alias. The included `_redirects` file sends both HTTP and HTTPS requests for that alias to the Medicaid hub.

### DNS safety
- Add the custom domain in Netlify first; then copy the exact CNAME target Netlify provides into the DNS provider for the `benefits` host.
- Do not guess the CNAME target and do not delete or change existing MX, TXT, or other records used by company email.
- DNS changes can take time to propagate. Netlify's external-DNS guide explains the subdomain CNAME process: https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/
- The custom domain is configured in this codebase but is not live until the separate Netlify site, domain assignment, DNS, and HTTPS verification are completed.

### Search readiness
- `sitemap.xml` and `robots.txt` use the selected benefits subdomain.
- HTML pages include canonical URLs for the selected host.
- After the custom domain works, verify it in Google Search Console and submit `https://benefits.radiantmotivenavigator.com/sitemap.xml`.
- The social-draft workflow now uses the benefits subdomain as its fallback site URL. Set the repository variable `PUBLIC_MEDICAID_SITE_URL` to the same URL if you want to override it.

## Social distribution
The social generator is approval-first. It creates drafts from the state dataset; it does not authenticate to, or publish on, Facebook, Instagram, LinkedIn, Pinterest, or X. Platform publishing requires separate authorized developer apps, tokens, account permissions, and secure secret handling.
