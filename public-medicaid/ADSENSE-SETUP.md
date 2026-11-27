# Google AdSense launch checklist — not yet activated

The public-benefits site is being prepared for AdSense Auto Ads. No publisher ID, AdSense script, live ad unit, or ad account approval is configured in this branch. Do not publish a placeholder publisher ID or copy someone else's code.

## Build and content readiness
- Publish the site on its final public domain or subdomain.
- Test every tool, navigation link, and official resource link on desktop and mobile.
- Complete original, useful content and the About, Privacy, Terms, and Editorial Standards pages.
- Confirm that state-status records have current source links and review dates.
- Keep government links visually separate from advertisements. Ads must never look like official application, renewal, or Medicaid contact buttons.
- Update the privacy notice and consent approach to match the actual advertising configuration.

## Owner steps in Google AdSense
1. Sign in to the owner's Google account at https://adsense.google.com/ and start the site onboarding process.
2. Add the final public website URL and complete the account information requested by Google.
3. Enter the publisher payment information in the AdSense account.
4. Open the AdSense site setup / ads area and use the preview experience to inspect the site, starting with mobile.
5. Choose Get code and copy the publisher script supplied for this exact account.
6. Add that script inside the head section on every page that should be monetized. The code must be the actual owner-issued code; never commit account credentials or private payment information to GitHub.
7. Publish the updated site and return to AdSense.
8. Enable Auto Ads, preview placements on mobile and desktop, exclude any intrusive or confusing placements, then apply and save the settings.
9. Complete site verification using the installed code and request Google's site review.
10. Configure the consent message and privacy disclosures required for the actual ad configuration and visitor locations.
11. Monitor the AdSense Sites area and respond to any review feedback. Do not represent the site as approved until Google confirms approval.
12. If Google requires an ads.txt file, create it using the exact publisher record supplied in the AdSense account and publish it at the required root location.

## Important distinction
The website can be prepared for monetization from launch, but AdSense approval and revenue are not guaranteed on launch day. Google reviews the site, and advertising revenue depends on eligible traffic, visitor geography, advertiser demand, viewability, policy compliance, and account status. The transcript's setup process makes the site ready to request monetization; it does not guarantee immediate approval, visitors, or earnings.

## Current implementation status
- Responsive public-benefits utility homepage: built on the isolated GitHub branch.
- Program registry: Medicaid active; SNAP, Housing Choice Vouchers, and veterans' benefits have official resource entry points and are marked as future interactive modules.
- AdSense publisher script: not installed.
- Auto Ads: not enabled.
- Site verification / review request: not submitted.
- Consent message: not configured.
- Final domain, Search Console, analytics, and sitemap: pending owner selection and deployment.
