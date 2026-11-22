# Radiant Motive Navigator
## Security & Privacy Facts — Public Clinic Preview

**Status:** Current preview description only. Not a security certification, legal opinion, HIPAA determination or production-security attestation.

### Current architecture
The Maryland preview is a public, browser-based guided-information application hosted on Netlify. It is not connected to a clinic EHR, Maryland Health Connection account, claims system or patient registry.

The preview has no user login, patient accounts, role-based access, document upload, patient-document repository, eligibility transaction, state submission, EHR integration or automated SMS delivery. It does not request patient names, Medicaid IDs, diagnoses, medical details or document contents. Navigation and exemption selections are used in the browser to display guidance.

### Data and analytics
Patient-level analytics and clinic reporting are disabled. The reporting function currently returns HTTP 410 and does not forward events.

The website host may process standard technical information needed to deliver and protect the site, such as IP address, browser/device details, request timestamps and security logs. Exact fields and retention are governed by the host's current terms and configuration and must be confirmed before clinic deployment. This preview does not represent that no cookies, logs or technical metadata exist.

### HIPAA / BAA
The design avoids asking for patient-entered identifiers or clinical details, but **that does not automatically establish that HIPAA is inapplicable or that a BAA is unnecessary**. The determination depends on the actual service relationship and whether protected health information is created, received, maintained or transmitted on behalf of a covered entity. Each clinic should review the proposed use and data flow with its privacy officer and counsel before live use.

### Important limits
- Clinic names and labels are display-only previews—not authenticated tenants, private workspaces or evidence of clinic endorsement.
- No SOC 2, HITRUST or other security certification is claimed.
- No independent penetration test or formal security audit is represented as complete.
- No SSO, role-based access, production incident-response SLA, BAA or patient-level reporting dashboard is currently offered.
- Do not enter patient information or use the preview to make clinical, eligibility or exemption decisions.

### Appropriate evaluation use
Use the preview for general education, staff workflow evaluation and referral navigation only. Maryland remains the authority for Medicaid eligibility, exceptions, notices and deadlines.

**Contact:** Contact@radiantmotivenavigator.com

**Reference:** HHS, [Use of Online Tracking Technologies by HIPAA Covered Entities and Business Associates](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html).
