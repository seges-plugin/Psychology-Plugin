<div align="center">

<img src="assets/readme/banner.jpg" alt="Noesis wordmark" width="100%" />

# Noesis

Non-clinical, source-aware self-reflection through a hosted MCP connector.

[Website](https://noesis.seges.ai) · [Connector endpoint](https://noesis.seges.ai/mcp) · [License](LICENSE)

</div>

## Release status

This repository is a public integration kit, not a claim that a marketplace listing or a particular
host integration is available. A host is supported only when its exact product version has completed
and recorded the acceptance sequence in [Host acceptance](#host-acceptance).

Noesis uses an OAuth authorization-code flow with mandatory S256 PKCE. The live endpoint and
discovery metadata demonstrate the connection protocol; they do not prove that an individual host has
implemented that protocol correctly.

## What Noesis is

Noesis helps adults explore how they think, decide, and learn through published or clearly labelled
psychometric instruments, source and limit cards, and plain-language reflection. It is not therapy,
diagnosis, treatment, or emergency care.

This repository contains portable skills, agents, package metadata, and a pointer to the hosted MCP
endpoint. It intentionally does not contain scoring implementation, item banks, user data, OAuth
secrets, static access tokens, or private server code.

Referral results, when available, are informational leads. Users independently verify a provider's
credentials, availability, scope, jurisdiction, and suitability before relying on a referral.

## Connect a host

The connector endpoint is:

    https://noesis.seges.ai/mcp

Use it only in a host that provides a remote Streamable HTTP MCP connector and can complete its own
browser OAuth authorization-code flow with S256 PKCE.

1. Add the endpoint in the host's remote MCP connector settings.
2. Let the host discover the OAuth metadata and start its browser authorization flow.
3. Complete sign-in and review the scope at noesis.seges.ai.
4. Return to the host and confirm that it can use the authenticated connector.

Do not paste a static bearer token, password, personal access token, or authorization header into a
configuration file. Noesis public MCP access is OAuth-only. If a host cannot complete the browser flow,
there is no supported credential workaround.

Before an installation guide, marketplace listing, or support claim names a host, that host and exact
version must have a passed acceptance record. Until then, describe it only as an unverified evaluation
target.

## Consent and storage

Noesis does not load stored results, profiles, or journal content by default. In every relevant session,
the assistant must:

1. Call `noesisget_consent_status` before account-data reads.
2. Show the currently authorized source choices.
3. Ask the person to make an explicit per-session choice.
4. Read only the minimum selected and authorized source.

`noesisjournal_view_memory` is permitted only after the applicable journal consent and the person's explicit
per-session source choice. No MCP tool grants consent. Consent is completed in the signed-in website
experience, and a refused or unavailable source must not be retried or bypassed.

The complete user-need-to-skill-to-MCP flow, including session-only context distillation, minimum source
reads, adaptive assessment gaps, and canonical gateway tool names, is in
[MCP-ROUTING-CONTRACT.md](MCP-ROUTING-CONTRACT.md).

## Safe use

- Treat results as structured reflection, not a clinical conclusion.
- Explain what an instrument does and does not establish before interpreting it.
- Do not infer, retain, or reuse personal context without the required consent and current-session choice.
- For urgent safety concerns, contact local emergency or crisis services. Noesis does not replace them.

## Host acceptance

Record an immutable acceptance result for the exact host, host version, plugin commit, and test date.
The minimum acceptance sequence is:

1. OAuth discovery and browser authorization-code flow with S256 PKCE.
2. Clear sign-in and consent experience.
3. Authenticated tools/list.
4. One harmless read-only MCP call.
5. A consent check before any stored-data read.
6. An explicit per-session source choice before any stored-data read.
7. Refresh, revocation, reconnect, and replay-rejection checks where the host exposes those paths.
8. Desktop and mobile behavior when both are offered by the host.

The acceptance record is the evidence for a support claim. A successful build, public endpoint, tool
catalog, or login screen is not a substitute.

## Repository layout

- .mcp.json is the canonical hosted MCP declaration.
- .codex-plugin and .claude-plugin contain host metadata only.
- skills and agents contain portable instruction contracts.
- hooks/hooks.json intentionally contains no executable lifecycle hook.
- scripts/verify-plugin-contract.mjs verifies the public package contract.

## Validate a change

Run the repository contract check before submitting a change:

    node scripts/verify-plugin-contract.mjs

Review the changed manifest fields, documentation, and remote endpoint. Never commit credentials,
private user data, OAuth client secrets, personal access tokens, or private implementation.

## License

[MIT](LICENSE)
