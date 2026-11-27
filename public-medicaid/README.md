# Public Medicaid Access Guide — MVP

This folder is a separate public-facing resource site intended to be distinct from the branded FQHC Clinic Track.

## Files
- `index.html`: public state selector and general navigation tool
- `state-status.json`: state status records, source links, and review dates
- `app.js` / `styles.css`: client-side functionality and responsive design
- `guides.html`: original educational content for search users
- `about.html`, `editorial-policy.html`, `privacy.html`, `terms.html`: trust, disclosure, and policy pages
- `ADSENSE-SETUP.md`: prerequisites before enabling advertising

## Preview
From the existing Netlify deployment, the folder is intended to be available at `/public-medicaid/` once this branch is deployed. The exact preview URL depends on the Netlify branch-deploy configuration.

## Initial status coverage\nThe first seed dataset includes official state announcements for Connecticut, Maryland, Massachusetts, North Carolina, and Oregon, plus California's announced intent to use the option. This is a partial initial dataset, not a complete state election tracker. All other states are deliberately marked unverified rather than incorrectly labeled as having declined or as having a confirmed enforcement decision.\n\n## State status data model
Each state record uses:
- `status`: `announced`, `intent`, `declined`, or `unverified`
- `announcement_date`: date of public state announcement, if verified
- `source_url`: source supporting the status, if verified
- `summary`: plain-language state summary
- `reviewed_on`: date this record was reviewed

Do not change a state to `announced` or `declined` without a reliable source. An announced state election is not the same as verified CMS approval. The page explains that distinction.

## Advertising
No AdSense code is active. Do not add ads until the final domain, content, privacy disclosures, consent approach, and AdSense approval are in place. See `ADSENSE-SETUP.md`.

## Public tool boundaries
The state selector and checklists run in the visitor's browser. This MVP does not ask for patient information, store answers, upload documents, submit forms, or make eligibility decisions.

## Important next work
1. Verify every state's election and implementation status from official state sources and CMS updates.
2. Expand state-specific guidance only after verifying local notices, application/renewal steps, and official contacts.
3. Add the final domain and canonical URLs, sitemap, and search console.
4. Complete privacy/cookie and ad consent disclosures before turning on AdSense.
5. Test mobile, keyboard accessibility, screen readers, and browser behavior.
6. Connect social platform publishing APIs only after the owner selects platforms and authorizes secure account connections.
