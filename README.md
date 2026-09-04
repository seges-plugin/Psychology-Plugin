<div align="center">

<img src="assets/readme/banner.jpg" alt="Psychology wordmark" width="100%" />

# Psychology

Non-clinical, source-aware self-reflection through a hosted MCP connector.

[Website](https://noesis.seges.ai) · [Public release records](https://noesis.seges.ai/ai/release-records.json) · [Connector endpoint](https://noesis.seges.ai/mcp) · [License](LICENSE)

[![License](https://img.shields.io/github/license/seges-plugin/Psychology-Plugin)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/seges-plugin/Psychology-Plugin)](https://github.com/seges-plugin/Psychology-Plugin/stargazers)
[![Protocol: MCP](https://img.shields.io/badge/protocol-MCP-4b8bbe.svg)](.mcp.json)

</div>

## Release status

This repository is a public integration kit, not a claim that a marketplace listing or a particular
host integration is available. A host is supported only when its exact product version has completed
and recorded the acceptance sequence in [Host acceptance](#host-acceptance).

Psychology uses an OAuth authorization-code flow with mandatory S256 PKCE. The live endpoint and
discovery metadata demonstrate the connection protocol; they do not prove that an individual host has
implemented that protocol correctly.

## Public-claim records

The public claims made by this integration kit are governed by the versioned [Psychology public release
records](https://noesis.seges.ai/ai/release-records.json). The relevant record IDs are:

- `claim.product.non-clinical-boundary.v1`
- `claim.product.source-and-limit-boundary.v1`
- `claim.connection.no-named-host-support.v1`
- `claim.integration-kit.protocol-boundary.v1`
- `claim.integration-kit.context-selection-boundary.v1`

Each record publishes its status, source pointers, limitation, and review date. An acceptance receipt,
browser trace, user content, OAuth artifact, or unannounced host evidence is never added to this public
repository or registry.

## What Psychology is

<div align="center">
<img src="assets/readme/hero.jpg" alt="Illustrated silhouette of a person in quiet reflection, an inner archway of light suggesting self-exploration" width="72%" />
</div>

Psychology helps adults explore how they think, decide, and learn through published or clearly labelled
psychometric instruments, source and limit cards, and plain-language reflection. It is not therapy,
diagnosis, treatment, or emergency care.

## Two-track self-understanding contract

Psychology deliberately keeps two different outputs separate:

1. A **standardized self-report score** comes only from a named instrument when the person directly
   supplies or explicitly confirms every scored response in the current administration. Conversation,
   profile, journal, prior result, tone, and model judgement never fill an item or become score input.
2. An **AI-assisted conversational estimate** exists only when the person explicitly initiates that
   non-instrument reflection. It is not a standardized score and is never equivalent to, a replacement
   for, or validation of a standardized self-report result.

For a conversational estimate, Psychology must first show the person the proposed basis: the permitted
current-session material actually used, the relevant time frame, and its uncertainty. It must then present
each proposed estimate point separately so the person can **confirm, revise, or reject** it. The person can
opt out or stop at any point; stopping produces no score and does not require them to complete an instrument.
The resulting session receipt must preserve its provenance — the stated basis, source categories actually
used, and each point's confirmation state — and must retain the exact label **AI-assisted conversational
estimate**.

Before **G2 execution, independent review, and release**, a conversational estimate must not be scored,
stored, exported, or presented as a standardized score. It must not be routed into an assessment-result,
profile, journal, memory, or other persistence path as a workaround. The current public contract therefore
keeps it session-only and does not claim that it is validated.

This repository contains portable skills, agents, package metadata, and a pointer to the hosted MCP
endpoint. It intentionally does not contain scoring implementation, item banks, user data, OAuth
secrets, static access tokens, or private server code.

Referral results, when available, are informational leads. Users independently verify a provider's
credentials, availability, scope, jurisdiction, and suitability before relying on a referral.

## What Psychology helps with

<table>
<tr>
<td align="center" width="25%">
<img src="assets/readme/icon-assessment.svg" width="64" height="64" alt="Clipboard with a checkmark, representing self-assessment" /><br />
<b>Self-assessment</b><br />
<sub>Published, source-aware psychometric instruments</sub>
</td>
<td align="center" width="25%">
<img src="assets/readme/icon-coaching.svg" width="64" height="64" alt="Ascending bar chart, representing coaching and growth" /><br />
<b>Coaching &amp; growth</b><br />
<sub>Plain-language reflection on how you think, decide, and learn</sub>
</td>
<td align="center" width="25%">
<img src="assets/readme/icon-counselor-match.svg" width="64" height="64" alt="A person inside a locket-like frame, representing counselor matching" /><br />
<b>Counselor matching</b><br />
<sub>Informational referral leads you verify independently</sub>
</td>
<td align="center" width="25%">
<img src="assets/readme/icon-crisis-safety.svg" width="64" height="64" alt="Compass-like crosshair, representing a crisis safety net" /><br />
<b>Crisis safety net</b><br />
<sub>Clear signposting to local emergency and crisis services</sub>
</td>
</tr>
</table>

<div align="center">
<img src="assets/readme/divider.svg" alt="" width="100%" />
</div>

## Add to Claude.ai

Use the plugin first so Claude can load Psychology's portable skills and safety instructions:

1. Open [Claude.ai Customize → Plugins](https://claude.ai/new#settings/customize-plugins).
2. Choose **Add → Add marketplace → Add from a repository**.
3. Paste `https://github.com/seges-plugin/Psychology-Plugin` into the repository URL field and
   choose **Sync**.
4. Open the synced marketplace and review the Psychology plugin before choosing to install it.

Claude.ai does not currently document a public plugin-marketplace deep link that can prefill the
repository URL. The link above opens the Plugins page only; it does not sync or install anything.

After installing the plugin, add its hosted connector if Claude has not already asked you to do so.
You can open the
[prefilled custom-connector form](https://claude.ai/new?modal=add-custom-connector&connectorName=Psychology&connectorUrl=https%3A%2F%2Fnoesis.seges.ai%2Fmcp#settings/customize-connectors)
or enter `https://noesis.seges.ai/mcp` yourself. Review the displayed name and URL before continuing.
When Claude asks which OAuth client to use, choose **No client ID — register one automatically**.
Noesis intentionally supports Dynamic Client Registration (DCR) for this flow and does not support
Client ID Metadata Documents (CIMD).

These links and steps are setup conveniences, not evidence of sync, installation, connection, OAuth
completion, or Claude.ai host acceptance. Support still requires a passed acceptance receipt for the
exact host version and plugin commit as described in [Host acceptance](#host-acceptance).

## Connect a host

The connector endpoint is:

    https://noesis.seges.ai/mcp

The protected MCP resource is `https://noesis.seges.ai/psychology/mcp`, and the public catalog is
`https://noesis.seges.ai/info`. Every actual tool or prompt call must use the exact visible
`psychology_…` name supplied by authenticated `tools/list`; names in a returned score record or internal
schema are data identifiers, not callable aliases.

Use it only in a host that provides a remote Streamable HTTP MCP connector and can complete its own
browser OAuth authorization-code flow with S256 PKCE.

1. Add the endpoint in the host's remote MCP connector settings.
2. Let the host discover the OAuth metadata and start its browser authorization flow.
3. Complete sign-in and review the scope at noesis.seges.ai.
4. Return to the host and confirm that it can use the authenticated connector.

Do not paste a static bearer token, password, personal access token, or authorization header into a
configuration file. Psychology public MCP access is OAuth-only. If a host cannot complete the browser flow,
there is no supported credential workaround.

**OpenClaw (an unverified evaluation target, not a supported host):** OpenClaw has no passed
acceptance record, so the steps below are published as evaluation notes only. They are not a
statement that the connection works, is supported, or will keep working, and the rule at the end of
this section applies to them in full.

This repo's own `openclaw.plugin.json` cannot auto-wire the connector — OpenClaw's
plugin manifest has no field for declaring an MCP server as of the current release. Add the entry
yourself under `mcpServers` in your own `~/.openclaw/openclaw.json`:

```json
{
  "mcpServers": {
    "psychology": {
      "transport": "streamable-http",
      "url": "https://noesis.seges.ai/mcp"
    }
  }
}
```

Then run `openclaw mcp login psychology` to complete the same browser OAuth flow described above —
OpenClaw has its own built-in OAuth client for exactly this case.

Before an installation guide, marketplace listing, or support claim names a host, that host and exact
version must have a passed acceptance record. Until then, describe it only as an unverified evaluation
target.

## Consent and storage

Psychology does not load stored results, profiles, or journal content by default. In every relevant session,
the assistant must:

1. Call `psychology_get_consent_status` before account-data reads.
2. Show the currently authorized source choices.
3. Ask the person to make an explicit per-session choice.
4. Read only the minimum selected and authorized source.

`psychology_journal_view_memory` is permitted only after the applicable journal consent and the person's explicit
per-session source choice. No MCP tool grants consent. Consent is completed in the signed-in website
experience, and a refused or unavailable source must not be retried or bypassed.

The portable user-need-to-skill-to-MCP flow is published with the plugin itself: start with the
[session bootstrap](skills/00-session-bootstrap/SKILL.md), use the
[context-session contract](skills/context-session/SKILL.md) for source-bounded context, and follow the
[assessment guide](skills/assessment-guide/SKILL.md) or [coaching guide](skills/coaching/SKILL.md) for
the requested workflow. These tracked files define session-only context distillation, minimum source
reads, adaptive assessment gaps, and exact visible public tool names without relying on an unpublished
maintainer document.

<div align="center">
<img src="assets/readme/reflection-contours.png" alt="Abstract layered contour art in warm and cool tones, symbolizing depth of reflection" width="55%" />
</div>

## Safe use

- Treat results as structured reflection, not a clinical conclusion.
- Explain what an instrument does and does not establish before interpreting it.
- Do not infer, retain, or reuse personal context without the required consent and current-session choice.
- For urgent safety concerns, contact local emergency or crisis services. Psychology does not replace them.

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

## Support

Found a problem, have a question, or want to report a security or privacy concern? Contact
**problems@noesis.seges.ai**. We do not currently offer a guaranteed response time. For questions
about the Terms of Service or data processing specifically, use the same address. Full reporting
guidance, including what not to send by email and what to do in an emergency, is published at
https://noesis.seges.ai/support/.
## License

[MIT](LICENSE)
