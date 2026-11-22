# Radiant Motive Navigator
## Security and privacy facts for clinic evaluation

**Document status:** Current public-preview description. This is a factual description of the present preview, not a security certification, legal opinion, HIPAA determination or promise about future releases.

### 1. Current product architecture

The current Maryland preview is a public, browser-based guided-information application hosted on Netlify. It is not connected to a clinic EHR, Maryland Health Connection account, claims system or patient registry.

The current preview has:
- No user login or role-based access.
- No patient account creation.
- No name, Medicaid ID, diagnosis or free-text health-information fields.
- No document-upload feature.
- No patient-document repository.
- No submission or write-back to Maryland systems.
- No patient-level analytics or clinic reporting enabled.
- No EHR integration or automated SMS delivery.

Checkbox selections and navigation state are used in the browser to display guidance. The public preview does not transmit those selections as patient-level reporting events.

### 2. Technical information

A browser must connect to the website host to load the application. The hosting provider may process standard technical information such as IP address, browser/device details, request timestamps and security logs. The exact log fields and retention periods are governed by the hosting provider's current terms and configuration and must be confirmed before a clinic deployment.

The application does not make a representation that no cookies, network logs or hosting metadata exist. Clinics should review the applicable hosting and privacy documentation.

### 3. Analytics and reporting status

Patient-level analytics and clinic reporting are disabled in the public preview. The Netlify reporting function currently returns HTTP 410 and does not forward event data.

A future reporting feature must not be enabled until the following are designed, documented and reviewed:
- Authenticated clinic access and tenant authorization.
- Rate limiting and abuse controls.
- Data minimization and event-schema review.
- Retention and deletion rules.
- Secure reporting destination and access controls.
- Clinic authorization, contract terms and privacy/security approval.
- Appropriate incident-response and support procedures.

### 4. HIPAA and Business Associate Agreement considerations

The preview is designed not to request or transmit patient-entered identifiers or clinical details. That design choice can reduce data exposure, but **it does not by itself establish that HIPAA is inapplicable or that a Business Associate Agreement is unnecessary**.

Whether Radiant Motive is acting as a business associate depends on the actual services, relationship, data flows and whether protected health information is created, received, maintained or transmitted on behalf of a covered entity. Each prospective clinic should make that determination with its privacy officer and counsel before live use. HHS guidance on online tracking technologies is relevant when assessing technical data flows and potential disclosures.

### 5. Clinic branding and tenant separation

Clinic names in the preview are display labels for demonstrations. They do not create a private clinic workspace, authenticate clinic staff, restrict access or establish a production tenant boundary. A clinic-branded preview must be labeled as an independent demonstration unless and until the clinic authorizes a production deployment.

### 6. Security controls not currently represented as available

The current preview does not claim:
- SOC 2, HITRUST or other security certification.
- Penetration-test completion.
- A formal security audit.
- Role-based access control or single sign-on.
- A production incident-response SLA.
- A BAA or executed data-processing agreement.
- A patient-level reporting dashboard or audited analytics.

These items require separate implementation, review and documentation before enterprise production commitments.

### 7. Appropriate use during evaluation

Use the current preview only for general education, workflow evaluation and referral navigation. Do not enter or send patient information, medical records, member IDs or documents. Do not use the preview to make or record clinical, eligibility or exemption decisions.

**Contact:** Contact@radiantmotivenavigator.com

**Official reference:** HHS, [Use of Online Tracking Technologies by HIPAA Covered Entities and Business Associates](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html).
