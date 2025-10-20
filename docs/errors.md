# Error Handling (Draft)

- Standard response shape: { error: { code: string, message: string, details?: unknown } }
- Common codes: validation_error, unauthorized, forbidden, not_found, conflict, rate_limited, internal_error
- Use idempotency to avoid duplicate side effects (orders, deposits)
- Log correlation IDs and redact sensitive fields
