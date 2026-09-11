# Security and Governance

GPT-GlassOnion is designed for authorized civilian decision support and research.

## Reporting

Do not publish credentials, customer data, precise private-person location data, or security-sensitive deployment details in a public issue. Report suspected vulnerabilities privately to the repository owner through GitHub's supported security-reporting channel when available.

## Controls

- Public or explicitly authorized data sources only.
- Least-privilege access for service identities.
- Source citations, confidence, and provenance retained with findings.
- Tamper-evident SHA-256 audit events.
- Human approval for consequential actions.
- No weapon targeting, covert surveillance, facial tracking, credential bypass, or autonomous physical-force decisions.
- No secrets or customer data committed to the registry.

## Deployment verification

Before promotion, run `npm test`, confirm the audit chain verifies, validate all connected Ontology permissions, and inspect every configured source for an appropriate rights basis.
