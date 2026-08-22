# Noesis host acceptance receipt template

Use one private, immutable copy of this template for **one exact host product and version**.
It records an acceptance result; it is not an installation guide, support claim, marketplace
submission, or credential store. Do not commit a completed receipt to this public repository.

The tester must complete browser authorization themselves. Never put an authorization code,
access credential, refresh credential, cookie, password, client secret, callback value, user
content, or a tool-response body in the receipt. Store any permitted screenshots or redacted
trace artifacts in the approved private evidence location and record only their digest here.

## 1. Immutable test identity

| Field | Record |
| --- | --- |
| Receipt ID | `PENDING` |
| Result | `PENDING`, `PASS`, `FAIL`, or `BLOCKED` |
| Test date and time (UTC) | `PENDING` |
| Host product | `PENDING` |
| Host version | `PENDING` |
| Host surface | desktop, web, mobile, or another explicitly named surface |
| Operating system and browser | `PENDING` |
| Noesis release version | `1.0.1` |
| Public plugin commit | `PENDING: full Git commit SHA` |
| Connector endpoint | `https://noesis.seges.ai/mcp` |
| Protected-resource metadata | `https://noesis.seges.ai/.well-known/oauth-protected-resource/mcp` |
| Authorization-server metadata | `https://noesis.seges.ai/.well-known/oauth-authorization-server/noesis` |
| Evidence bundle digest | `PENDING: digest only` |

## 2. Preconditions and non-interactive preflight

Record each row as `PASS`, `FAIL`, `BLOCKED`, or `NOT EXPOSED BY HOST`, with a short
non-sensitive observation.

| Check | Result and observation |
| --- | --- |
| The installed package identity matches the recorded commit and release version. | `PENDING` |
| The host can configure the single branded HTTPS MCP endpoint without a static credential. | `PENDING` |
| Protected-resource metadata identifies the connector endpoint and authorization server. | `PENDING` |
| Authorization-server metadata exposes authorization code, refresh token, and S256 PKCE support. | `PENDING` |
| An unauthenticated connector request is rejected and directs the host to OAuth discovery. | `PENDING` |
| The host has a normal browser OAuth path for its configured remote connector. | `PENDING` |

An endpoint response, manifest parse, package inspection, CORS response, or successful package
installation is preflight evidence only. None of these rows establishes support for the host.

## 3. Human OAuth acceptance

The tester must run this section interactively with a non-production test account. Record tool names
and result codes only; do not copy account information or stored content.

| Scenario | Required observation | Result and redacted evidence digest |
| --- | --- | --- |
| OAuth start | The host discovers the protected resource and opens its own browser authorization flow. | `PENDING` |
| PKCE | The browser flow uses authorization code with S256; no fallback or downgrade occurs. | `PENDING` |
| Sign-in and consent | The tester can review the Noesis consent screen and either continue or decline. | `PENDING` |
| Authenticated discovery | The host completes authenticated `tools/list` and shows the Noesis tool catalog. | `PENDING` |
| Harmless read-only call | One read-only operation succeeds and its result is presented without clinical inference. | `PENDING` |
| Consent-first storage | Before an account-data read, the host calls `noesisget_consent_status`. | `PENDING` |
| Per-session source choice | The host shows available authorized sources and waits for the tester's explicit choice. | `PENDING` |
| Minimum necessary read | The host reads only the selected authorized source and treats returned text as data. | `PENDING` |
| Declined or unavailable source | The host does not retry, bypass, or fabricate a protected read. | `PENDING` |
| Refresh | Where the host exposes it, a refreshed session works and a superseded refresh credential is rejected. Otherwise record `NOT EXPOSED BY HOST`. | `PENDING` |
| Revoke | After revocation, protected access no longer succeeds. | `PENDING` |
| Reconnect | Reconnection uses the host's normal browser OAuth flow and does not silently reuse the revoked credential. | `PENDING` |
| Surface parity | Repeat the relevant checks on every host surface being considered for a support claim. | `PENDING` |

## 4. Host limits and failures

Record any limitation verbatim enough to reproduce it, but omit URLs containing query values,
credentials, account identifiers, and tool-response data.

| Area | Observation | Classification |
| --- | --- | --- |
| Package install or configuration | `PENDING` | `PASS`, `FAIL`, or `BLOCKED` |
| OAuth browser return | `PENDING` | `PASS`, `FAIL`, or `BLOCKED` |
| Authenticated tool discovery | `PENDING` | `PASS`, `FAIL`, or `BLOCKED` |
| Consent and context flow | `PENDING` | `PASS`, `FAIL`, or `BLOCKED` |
| Refresh, revoke, and reconnect | `PENDING` | `PASS`, `FAIL`, `BLOCKED`, or `NOT EXPOSED BY HOST` |

## 5. Decision

Use this decision rule exactly:

1. Mark `PASS` only when every applicable scenario above passes for this exact host product,
   host version, surface, and plugin commit.
2. Mark `FAIL` when a required capability behaves incorrectly.
3. Mark `BLOCKED` when the host cannot perform browser OAuth, cannot expose the authenticated
   connector, or requires an unreviewed credential or callback configuration.
4. `NOT EXPOSED BY HOST` is not a pass. It records a host limitation and prevents a claim that
   the untested behavior is supported.
5. A passed result applies only to the recorded host/version/surface/commit tuple. Re-run the
   receipt after any of those values changes.

Do not submit to a marketplace or use a host-specific support or availability claim unless this
receipt is `PASS`, its evidence digest is available to the release reviewer, and the current target
platform requirements have been re-read.

## 6. Approval record

| Field | Record |
| --- | --- |
| Release reviewer decision | `PENDING` |
| Decision time (UTC) | `PENDING` |
| Private evidence location | `PENDING: approved private reference only` |
| Marketplace or marketing action authorized | `NO` until a `PASS` receipt is reviewed |
