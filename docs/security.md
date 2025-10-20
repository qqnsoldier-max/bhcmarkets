# Security (Draft)

- Secrets: use env vars and secret managers; never commit .env with real values.
- Auth: short-lived access tokens, refresh rotation, device-bound sessions.
- Passwords: strong hashing (argon2/bcrypt), rate limiting on login.
- Data: least privilege DB roles, parameterized queries, migrate with audit.
- Transport: HTTPS-only, HSTS, secure cookies.
- Input: strict validation with allowlist schemas; reject unknown fields.
- Logging: structured logs, redact sensitive fields, per-request correlation IDs.
- Compliance: consider KYC/AML requirements and data retention policies.
