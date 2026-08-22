# Noesis submission readiness

This is a non-submission checklist. It is not proof of a listing, review approval, or host support.
Re-read the target platform's current form and policy before using any of
this material.

## Public connector facts to verify at submission time

- Product name: Noesis.
- Public repository: https://github.com/seges-plugin/Psychology-Plugin
- Hosted MCP endpoint: https://noesis.seges.ai/mcp
- Transport: Streamable HTTP.
- Authentication: browser OAuth authorization-code flow with mandatory S256 PKCE.
- Public connector access: no static bearer token, password, personal access token, or client secret
  is supplied to a user.
- Storage boundary: account-data reads require the applicable consent and the person's explicit
  per-session source choice. No tool grants consent.

Verify the current protected-resource and authorization-server discovery documents, redirect behavior,
and authenticated connector behavior immediately before a submission. Do not rely on an old test date
or claim that dynamic registration, a particular host UI, or a directory workflow is accepted unless it
has just been tested for that exact host version.

## Required evidence before a host-specific submission

1. A recorded acceptance result for the exact host and version.
2. OAuth authorization-code flow with S256 PKCE and visible consent.
3. Authenticated tools/list and one harmless read-only tool call.
4. Consent check and explicit per-session source choice before an account-data read.
5. Refresh, revoke, reconnect, and replay-rejection evidence where the host exposes those paths.
6. Current privacy, age, data-handling, and platform-policy review by the responsible submitter.

Noesis is non-clinical self-reflection, not therapy, diagnosis, or treatment. Referral results are
informational leads; users independently verify credentials, availability, scope, jurisdiction, and
suitability.

Run node scripts/verify-plugin-contract.mjs before packaging, then execute
OPENAI-PLUGIN-TEST-CASES.md for the exact host version. Do not submit or market the connector until
the required evidence exists.
