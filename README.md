<div align="center">

<img src="assets/readme/banner.jpg" alt="Psychology wordmark" width="100%" />

# Psychology

Distil the memories and past chats you choose, then reflect on what matters with Psychology.

[Website](https://noesis.seges.ai) · [Plugin source release v1.2.19](https://github.com/seges-plugin/Psychology-Plugin/releases/tag/v1.2.19) · [Public release records](https://noesis.seges.ai/ai/release-records.json) · [Connector endpoint](https://noesis.seges.ai/mcp) · [License](LICENSE)

[![License](https://img.shields.io/github/license/seges-plugin/Psychology-Plugin)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/seges-plugin/Psychology-Plugin)](https://github.com/seges-plugin/Psychology-Plugin/stargazers)
[![Protocol: MCP](https://img.shields.io/badge/protocol-MCP-4b8bbe.svg)](.mcp.json)

</div>

## Start from what you've already told your AI

**AI is getting stronger. Hard to see what makes you different? Start by understanding yourself.**

Connect Psychology in a chat with callable plugin/MCP tools, then paste the
[quick-start prompt](skills/memory-distillation/references/connected-chat-distillation-prompt.md).
Jump to [Claude.ai setup](#add-to-claude-ai) or [ChatGPT connection setup (private evaluation)](#use-psychology-in-chatgpt).
The current published support record covers Claude.ai web and desktop; ChatGPT custom connectors and Codex
remain evaluation/setup paths.
It asks the assistant to first use any built-in memory or past-chat retrieval available for your goal,
then use the memories and past chats it can actually access—or conversations
you select and paste—to distil strengths, patterns, preferences, and likely answers for your goal.
It shows examples behind candidate insights and asks only about gaps that could change what comes
next. For ChatGPT, Claude, or Kimi, use the [v2 selected-memory summary prompt](skills/memory-distillation/references/selected-memory-summary-prompt.md).
For Codex, use the [v3 Codex-selected summary prompt](skills/memory-distillation/references/selected-memory-summary-prompt-v3.md): it processes only excerpts you select or paste in the current Codex task and never searches other tasks or account history. Codex is a source format here, not a claim that Codex is an accepted connected host. For detailed timestamp and selected-import cases, see the [advanced bitemporal prompt](skills/memory-distillation/references/connected-chat-distillation-prompt-advanced.md).
The quick-start prompt asks no more than three follow-up questions, and only when an answer could change the next step.
If the connected assistant cannot access older chats or finds no relevant past chats, it says so before
continuing with the context already visible or a few conversations you select; do not upload a full account archive.
Codex uses its v3 selected-excerpt prompt for current-task material; ChatGPT, Claude, and Kimi use v2. The v3 contract rejects a claimed Codex memory saved/updated timestamp because this workflow has no separate Codex memory-record clock.

For changing goals, Psychology separates when a statement happened, when it was saved, and when it applied. It
uses your current corrections and does not guess when an older goal ended. See the advanced prompt for detailed
timestamp handling.

Psychology uses the memories and past chats your assistant can actually access, plus context you choose to share,
to surface strengths, patterns, and candidate answers for your goal. It shows the examples behind suggestions and
asks only about gaps that could change what comes next. You review each self-report response; the assistant says
when a requested source is unavailable. Psychology supports reflection, not diagnosis or treatment.

### Host availability

The published host listing currently covers Claude.ai web and desktop, dated 2026-08-30; Anthropic
does not publish a host version identifier. ChatGPT custom connectors and Codex remain private evaluation/setup
paths; Claude Code, Kimi Code, Kimi.ai, and OpenClaw are evaluation/setup paths, not accepted hosts. A
manifest, installation, visible server, or login screen does not establish host acceptance or an
authenticated connection. See [host acceptance](#host-acceptance) and the [public support record](https://noesis.seges.ai/ai/supported-clients.json).

## What Psychology is

<div align="center">
<img src="assets/readme/hero.jpg" alt="Illustrated silhouette of a person in quiet reflection, an inner archway of light suggesting self-exploration" width="72%" />
</div>

Psychology combines selected conversation context, published self-assessments, and practical
reflection. It also offers plain-language interpretation and informational referral leads that users
verify independently.

### Public claims

Public product and connection claims follow the versioned [Psychology release records](https://noesis.seges.ai/ai/release-records.json)
and [supported-client record](https://noesis.seges.ai/ai/supported-clients.json). They publish status,
source, limitations, and review date; private acceptance receipts, browser traces, user content, and
OAuth artifacts are not published here.

## Self-assessment and conversational reflection

A named self-report item may receive a source-linked candidate based on context the person selected and the
assistant can actually access. Keep the exact item wording and response scale; the person can confirm, edit,
reject, or skip each candidate. Only user-endorsed responses enter formal scoring. Objective performance,
knowledge, and ability-test items are respondent-only. An AI-assisted conversational estimate is a separate,
session-only reflection, not a standardized score. Before G2 execution, independent review, and release, it must
not be scored, stored, exported, or presented as a standardized score.

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

## Use Psychology in Codex

Installing `Psychology` in Codex loads its portable workflow and safety skills. It does **not** by itself
complete the separate OAuth connection to the hosted Noesis MCP. A first-use response must make that distinction
visible: if the current task has no callable `psychology_...` tool, it must offer secure Codex connection before
offering a session-only reflection. It must not send a Codex user to ChatGPT Developer mode or a Claude setup page.
The package's `skills/psychology/SKILL.md` is the mandatory `@Psychology` front door, so this connection verdict
is not left to a later assessment or coaching skill.

If Codex already lists a Noesis MCP server, select its normal **Sign in** or **Reconnect** action instead of
creating another entry. If it was configured with a legacy protected-resource value, reconnect or replace that
one entry with the canonical root resource below; do not keep both resource variants. Otherwise, after deciding
to make this local configuration change, run:

```powershell
codex mcp add psychology --url https://noesis.seges.ai/mcp --oauth-resource https://noesis.seges.ai/mcp
codex mcp login psychology --oauth-client-registration dcr
```

The login command opens the official Noesis browser sign-in and consent flow. Do not paste a password, client ID,
redirect URI, OAuth code, token, authorization header, or callback URL into Codex. Start a new task after sign-in,
confirm a callable `psychology_...` tool is present, and make `psychology_get_consent_status` the first harmless
read-only check. A connected account does not automatically read profile, journal, result, or imported-memory data.

## Add to Claude.ai

<a id="add-to-claude-ai"></a>

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
This is a two-step setup: install the plugin, then connect the hosted MCP. When Claude asks which OAuth client to use, choose **No client ID — register one automatically**.
Noesis intentionally supports Dynamic Client Registration (DCR) for this flow and does not support
Client ID Metadata Documents (CIMD).

These links and steps are setup conveniences, not evidence of sync, installation, connection, OAuth
completion, or a particular account's connection. The public support record lists Claude.ai web and
desktop with a 2026-08-30 acceptance date; it does not cover Claude Code or Claude mobile.

## Use Psychology in Claude Code

Claude Code is a separate product from Claude.ai. In a Claude Code session, add this [Claude Code
marketplace](https://code.claude.com/docs/en/plugins/install) and install its `psychology` plugin:

```text
/plugin marketplace add seges-plugin/Psychology-Plugin
/plugin install psychology@psychology
```

Review the plugin and choose an install scope. The plugin's root `.mcp.json` declares the hosted HTTP
server. Approve it if Claude Code prompts, then run `claude mcp login psychology` or use **Sign in**
in `/mcp`. Check the result with `claude mcp get psychology`. If you install it from the shell or
add it during a session, start a new session or run `/reload-plugins` to apply it.

Claude Code and Claude.ai manage connector authorization separately. Installing this plugin in
Claude Code does not connect a Claude.ai account, and adding the Claude.ai connector does not install
this repository's plugin. The public acceptance record covers Claude.ai web and desktop only; Claude
Code remains an unverified evaluation target until it completes its own acceptance sequence.

## Use Psychology in Kimi Code

Install this repository as a custom [Kimi Code plugin](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/customization/plugins.md):

```text
/plugins install https://github.com/seges-plugin/Psychology-Plugin
```

Enable it in `/plugins`, then run `/reload` or start a new session. The `kimi.plugin.json` manifest
declares both `./skills/` and the hosted MCP server. Complete browser authorization with
`/mcp-config login psychology`; then confirm the server is connected in `/mcp` and that its tools
are available. The Kimi.ai consumer app and Kimi Code CLI have different plugin and MCP
configuration surfaces; these steps apply to Kimi Code CLI only.

Plugin installation, reload, or a visible server entry does not prove OAuth completion or host
acceptance. Kimi Code is not listed in the current public support record. Use only the authenticated
`psychology_…` tool names returned by the connected server.

## Use Psychology in ChatGPT

<a id="use-psychology-in-chatgpt"></a>

This repository includes the portable Agent Plugins package files at its root: `plugin.json` describes the
plugin and `mcp.json` declares its hosted MCP server and OAuth Dynamic Client Registration. Use an
OpenAI-supported plugin/package source in the ChatGPT Plugins Directory to install or evaluate the package;
local marketplace options and UI availability depend on the ChatGPT app, account, and workspace. See
[OpenAI's plugin packaging guide](https://developers.openai.com/plugins/build/plugins) for the supported
package and marketplace flows.

A GitHub repository URL by itself is not an MCP server URL. If you are adding a custom MCP server directly,
use `https://noesis.seges.ai/mcp` in ChatGPT's MCP connection form, not the GitHub URL. ChatGPT then discovers
the MCP tools from the hosted server and completes OAuth on Noesis pages. The repository's plugin manifests
are not read by that direct-connector flow.

If the account or workspace requires it for custom MCP connections, review [ChatGPT Security settings —
Developer mode](https://chatgpt.com/#settings/Security?section=developer-mode) and open [ChatGPT Plugin
Management](https://chatgpt.com/#settings/Plugins). Read any host warning before changing this persistent
setting; Psychology cannot enable it for you.

For either path, verify authenticated `tools/list`, one harmless read-only action, consent/source-choice
behavior, revocation, and reconnect before treating the connection as usable. A saved draft, successful scan,
or visible connector is not a public listing and does not establish ChatGPT host acceptance. UI labels and
availability can vary by account or workspace.

## Connect a host

The connector endpoint is:

    https://noesis.seges.ai/mcp

The canonical protected MCP resource is `https://noesis.seges.ai/mcp`, and the public catalog is
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

**OpenClaw (an unverified evaluation target, not a supported host):** OpenClaw's [native plugin
manifest](https://docs.openclaw.ai/plugins/manifest) and [MCP OAuth flow](https://docs.openclaw.ai/cli/mcp/transports) can
declare static MCP servers. Install this repository as a plugin from GitHub, review
and confirm the source when OpenClaw prompts, then enable `psychology`:

```sh
openclaw plugins install git:github.com/seges-plugin/Psychology-Plugin
openclaw plugins enable psychology
```

Inspect it with `openclaw plugins inspect psychology`. The manifest contributes the skills and a
remote Streamable HTTP MCP server using OpenClaw's native OAuth configuration; it does not require a
second manual server entry in `openclaw.json`.

Complete browser authorization with `openclaw mcp login psychology`. Check the saved connection
with `openclaw mcp status --verbose` and run `openclaw mcp doctor psychology --probe` to verify
reachability and tool discovery. Plugin install, enablement, or saved credentials alone do not
prove that authenticated tools work or that this host version has passed acceptance.

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
experience; journal grant creation and scope changes are managed there, not through MCP. A refused or unavailable
source must not be retried or bypassed.

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

Record an immutable acceptance result for the exact host and plugin commit. Capture the precise host
version/build/channel when the vendor exposes one. If it does not, record the acceptance date and the
version-identification limitation, as the public Claude record does. The minimum acceptance sequence is:

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

- `plugin.json` and `mcp.json` at the repository root are the portable Agent Plugins package entry point and ChatGPT-compatible MCP declaration.
- `.mcp.json` and `.codex-plugin/plugin.json` provide the Claude Code remote MCP config and Codex-compatible MCP configuration.
- `.claude-plugin` contains Claude Code marketplace metadata; Claude.ai connector setup is separate.
- `kimi.plugin.json` declares the Kimi Code CLI skills and MCP server; `openclaw.plugin.json` declares OpenClaw-native skills and OAuth MCP wiring.
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

## Local contract re-verification (2026-10-13)

`npm test` passed on the current `main` checkout: 90 public files and 28 mirrored skill files, including the historical-goal/current-correction fixture and 43 negative import fixtures. This verifies the portable package contract only; it does not establish that ChatGPT, Claude, or another host has refreshed its MCP schema or can access a user's full chat archive.

## Explicit selected-context distillation (2026-10-13)

The v1.2.13 source prompt keeps ordinary distillation limited to material available in the current assistant conversation. Only when the user directly asks to use selected Noesis imports does it check current consent, list metadata for active grants tied to that exact OAuth connection, show the scope and ask the user to choose one, and then read only with those returned purpose, categories, date bounds, and time basis. Missing, revoked, expired, or mismatched grants stop the import flow. This does not provide full-account archive access. The prompt calls selected material a purpose-limited summary, not an account export, and caps fallback follow-up questions at three consequential gaps. The production catalog exposes the matching `psychology_list_my_selected_context_grants` tool; `npm test` passes against the live 34-tool catalog. The GitHub release is source distribution and does not claim official ChatGPT or Claude marketplace acceptance.

## Candidate evidence citations (source release v1.2.14)

The first-use connected-chat prompt now asks for a compact source note beside each candidate: source platform and
type, plus a visible conversation title, stable reference, or link when available. It asks the assistant to keep
event/statement time, memory saved/updated time, summary-generation time, and claim applicability separate for
changing claims, to mark unavailable details unknown, and to include Noesis receipt time only for a reviewed
selection that actually has one. This makes the draft easier to inspect without implying a source identifier or
timestamp the host cannot expose. The same wording is included in the ChatGPT and Codex package prompts. The
manifest version 1.2.14 is published as a GitHub source release. This is not a host-acceptance claim.

## Distillation onboarding and schema clarification (2026-10-14)

The first-use connected-chat prompt is now a shorter quick-start, with the detailed bitemporal/import flow linked as an
advanced prompt. README setup links take readers directly to Claude.ai and ChatGPT instructions; ChatGPT remains a
private evaluation path, not an accepted host. ChatGPT, Claude, and Kimi generated summaries use v2; v3 remains
Codex-only for excerpts selected or pasted from the current task. Native platform memory formats remain session-only
and are not converted into Codex v3. The verifier keeps the v2 prompt's canonical digest pinned and checks this
source-to-schema mapping.

## Bounded selected-memory continuation (source release v1.2.16)

The ChatGPT/Claude/Kimi v2 selected-memory summary is capped at 32 parts (3,200 items) per chain, matching the service's import contract. If more source material remains at that limit, the prompt preserves the incomplete status and asks the user to narrow their selection; the verifier rejects a chain beyond the cap. This limits one selected-summary flow and does not imply complete access to any platform archive.

## Current and historical memory clocks (source release v1.2.15)

The quick-start now names all five relevant clocks for changing claims: source event/statement time, platform memory
saved/updated time, summary-generation time, the claim's applicability period, and Noesis receipt time only when an
actual reviewed selection has one. It also says a current correction settles the current conversation without dating
when the older claim ended. The contract verifier checks these rules and the Codex mirror. This is prompt guidance;
it does not establish that a host can access older chats or expose every timestamp.

## Consent-safe tool guidance (source release v1.2.18)

Assessment guidance now references only versioned result-save tools that are present in the authenticated
tool catalog, and only for user-requested eligible self-reports. MCP guidance no longer suggests creating
or expanding journal access grants; those choices stay in the signed-in Noesis website. The contract
verifier guards against the retired actionable tool names returning.

## Canonical OAuth resource contract (source release v1.2.19)

The canonical MCP route is `https://noesis.seges.ai/mcp` for both client configuration and the protected resource. The offline verifier compares the portable, shared, and Codex connector manifest URLs and checks this public routing statement. This documentation correction does not change OAuth server behavior or claim host acceptance.

## Consequential-only follow-up questions (source release v1.2.17)

The quick-start now asks no more than three questions, and only when each answer could change the next step. The prompt verifier protects this rule in the canonical and Codex-mirrored prompt. This is a source release; host availability and historical-chat access remain limited to each assistant's actual context.


## Distillation workflow audit refresh (2026-10-15)

The current quick-start actively asks ChatGPT, Claude, or Codex to search host-accessible memory/past chats before drafting, call the Noesis guide once, then label direct user-authored quotes separately from summary paraphrases, preserve event/save/generation/applicability/receipt clocks, and ask only consequential gaps. It explicitly says host access is not full-account access and falls back to selected/current-chat context when unavailable. Service regression tests passed, but this is prompt-contract evidence only: live host retrieval, source-message provenance, quote authorship, and model adherence have not been established. Do not describe distillation as complete across all account/host configurations until tested in those hosts.


## Plugin prompt contract verification (2026-10-15)


pm test passed locally: 94 public files and 30 mirrored skill files verified; the suite includes old-goal/current-correction temporal fixtures and the selected-memory summary negative fixtures. This validates the prompt/manifest contract only. It does not demonstrate that a connected ChatGPT, Claude, or Codex account can retrieve past sessions or that a live model follows the prompt.
