# Public Benefits Navigator — deployment checklist

## Selected host
- Primary: https://benefits.radiantmotivenavigator.com/
- Medicaid hub: https://benefits.radiantmotivenavigator.com/medicaid/
- Optional alias: https://medicaid.radiantmotivenavigator.com (redirects to the Medicaid hub once assigned in Netlify).

## Keep the two products separate
Create a **new Netlify site** connected to the existing GitHub repository. Do not edit the current FQHC site's Netlify project or production settings.

## Netlify build settings
- Repository: `rondamccullough/medicaid-navigator-demo`
- Production branch: `public-medicaid-ad-revenue-mvp-2026-11`
- Base directory: repository root (blank/default)
- Build command: blank
- Publish directory: `public-medicaid`
- This is a static site; no Node build, database, server, or patient-data service is required.

Deploy first to the temporary `.netlify.app` URL and test all pages and tools. Then add `benefits.radiantmotivenavigator.com` in the new site's Domain management screen. Netlify will show the exact DNS record to use.

## DNS setup
For an externally managed domain, add the custom domain in Netlify first, then create the CNAME record for host `benefits` using the exact target shown in Netlify. If you add the optional `medicaid` alias, add it as a domain alias on the same site and create its CNAME using the exact target shown. Do not alter existing mail-related MX/TXT records.

## Pre-launch tests
- Open the homepage, Medicaid hub, guides, each tool page, About, Editorial Standards, Privacy, and Terms.
- Test the state selector and next-step builder.
- Test the hours planner, renewal checklist, and deadline calculator on mobile and desktop.
- Confirm that state data and official links are current.
- Confirm HTTPS works for the primary domain and optional alias.
- Check `/robots.txt` and `/sitemap.xml`.
- Verify the primary domain in Google Search Console and submit the sitemap.
- Update the social workflow repository variable `PUBLIC_MEDICAID_SITE_URL` if needed.

## Monetization gate
No AdSense script, publisher ID, consent configuration, or live ads are included. Complete the owner-side setup in `ADSENSE-SETUP.md` only after the domain is live and content has been tested. Approval and revenue are not guaranteed.
