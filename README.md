# Radiant Motive Navigator — Maryland Medicaid Preview

A browser-based, non-clinical navigation guide for Maryland Medicaid members, applicants, clinics and community helpers.

## Product purpose

Radiant Motive Navigator organizes public program information into guided pathways so people can:
- Understand common Medicaid notices and upcoming policy changes.
- Review possible state-listed exception pathways without receiving an eligibility determination.
- Understand how to follow official proof and renewal instructions.
- Find Maryland Health Connection and local enrollment assistance.
- Locate Maryland Medicaid appeal information.

The product is designed as a reusable navigation layer: a stable guided-workflow experience with program-specific content that can be reviewed and updated as official rules change.

## Current preview scope

- English, Spanish, Chinese, Korean and Vietnamese language controls. Detailed content is not fully translated in every language; the interface displays a notice when a language is selected.
- Guided member, clinic/provider and employer pathways.
- Maryland county assistance directory.
- Clinic-branded preview routes for configured demonstration organizations.
- Clinic branding is a display-only preview, not an endorsement, authenticated tenant, or private workspace.
- Public patient-level analytics and clinic reporting are disabled.
- No login, EHR integration, automated SMS delivery, document upload, eligibility transaction or state submission.

## Preview routes

Configured clinic aliases can be used as a query parameter:
- `?clinic=bmsi` or `?clinic=Baltimore+Medical+System`
- `?clinic=chase-brexton`
- `?clinic=cci-health`
- `?clinic=total-health-care`
- `?clinic=choptank-health`

An optional `clinic_name` parameter changes the display label only when a configured clinic ID is present. Example:
`?clinic=bmsi&clinic_name=Sample%20Clinic`

The `?debug=true` parameter displays the simulated developer panel. It does not enable patient-level analytics.

## Privacy and use boundaries

The preview does not request names, Medicaid IDs, diagnoses, health details or document uploads. The website host may process standard technical information such as IP address, browser/device details and request timestamps. Do not enter patient information.

The reporting function intentionally returns HTTP 410 and does not forward events. Do not reactivate it until authenticated access, rate limiting, retention controls, a documented data flow and clinic approval are in place.

The absence of patient-entered identifiers does not establish that HIPAA does not apply or that a Business Associate Agreement is unnecessary. Each clinic must assess the intended use and data flow with its privacy/security team and counsel.

## Policy maintenance

Policy content is general information, not legal advice or an eligibility determination. Maryland Health Connection and Maryland Medicaid are authoritative for individual eligibility, notices and deadlines. Review official guidance before each release and record the content review date.

## Go-to-market materials

- [Clinic one-pager](CLINIC-ONE-PAGER.md)
- [Security and privacy fact sheet](SECURITY-AND-PRIVACY-FACT-SHEET.md)
- [30-day pilot plan](30-DAY-PILOT-PLAN.md)
- [Go-to-market plan](GO-TO-MARKET-PLAN.md)

## Deployment

The project is configured for Netlify static hosting. The production branch is `main`; feature branches should be reviewed and tested before merging. A published Netlify deployment confirms publication, not end-to-end browser QA or procurement readiness.
