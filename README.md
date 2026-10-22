# Psychology Plugin

**Think it through. Then take the next step.**

For people who use AI to sort through ideas and want to act on what they decide.
Reflect on experiences you choose, review useful suggestions, and track a next step in Today.

**[Install in your AI](#install-in-your-ai)** · [Try Today first](https://noesis.seges.ai/en/today/)

Free, noncommercial reflection tools. Not diagnosis or treatment.

| Start with | Get help to | Choose what happens next |
|---|---|---|
| A question or goal | Find useful patterns and examples in context you select | Correct, skip or explore a suggestion |
| A self-reflection exercise | Understand the returned questions and results | Answer in your own words |
| One next step | Track a task on the separate Today website | Add dates or reminders when useful |

## Install in your AI

### Add to Claude.ai

<a id="add-to-claude-ai"></a>

1. Open [Claude Plugins](https://claude.ai/new#settings/customize-plugins).
2. Choose **Add → Add marketplace → Add from a repository**.
3. Paste `https://github.com/seges-plugin/Psychology-Plugin`, sync, and install Psychology.
4. Connect Psychology MCP and finish the Noesis browser sign-in. If asked, choose **No client ID**.

[Detailed Claude setup](docs/setup-and-contract.md#add-to-claude-ai)
includes the optional connector shortcut and account-specific requirements.
The plugin is installed from GitHub; it is not listed in the official Plugin Store.

### Use Psychology Plugin in ChatGPT

<a id="use-psychology-in-chatgpt"></a>

For an available custom MCP connection, use `https://noesis.seges.ai/mcp` and finish
the Noesis browser authorization. Availability depends on your account and workspace.
This repository is not a claim of an approved ChatGPT listing.

[ChatGPT setup and package options](docs/setup-and-contract.md#use-psychology-in-chatgpt)

<details>
<summary>Codex, Claude Code, Kimi Code and other setup paths</summary>

These are separate evaluation/setup paths, not newly accepted hosts:

- [Codex](docs/setup-and-contract.md#use-psychology-plugin-in-codex)
- [Claude Code](docs/setup-and-contract.md#use-psychology-plugin-in-claude-code)
- [Kimi Code](docs/setup-and-contract.md#use-psychology-plugin-in-kimi-code)
- [Other MCP hosts](docs/setup-and-contract.md#connect-a-host)

</details>

## Your first conversation

1. Tell your AI what you want to work out. Choose relevant context it can actually access.
2. Use the [starting prompt](skills/memory-distillation/references/connected-chat-distillation-prompt.md), then review its examples and suggestions.
3. Pick one next step. Use [Today](https://noesis.seges.ai/en/today/) if you want to track it.

A chat draft can stay in the conversation. Saving to Noesis is a separate choice with
the appropriate permission and review; installation never reads or saves your account automatically.

## Choose the package you need

The public **MCP-only** package connects the tools and bundles no skills or hooks.
The full manual/runtime distribution retains **16 skills**. The separate workflows
application source profile is still a distinct proposal, not an approved listing.
See [package variants](docs/package-variants.md) and the
[workflows profile](packaging/portal-workflows/README.md).

## Availability and account controls

Use the [supported-client record](https://noesis.seges.ai/ai/supported-clients.json)
for the exact recorded host coverage. A connection in one account does not establish support everywhere.
Today is a separate website flow, not automatic MCP workspace management.
Manage permissions, request a data copy or request deletion in your [Noesis account](https://noesis.seges.ai/en/account/).

Source package **v1.4.3**. GitHub releases and host acceptance are separate.
Check [source releases](https://github.com/seges-plugin/Psychology-Plugin/releases/latest)
and the [public records](https://noesis.seges.ai/ai/release-records.json) for current status.
An installed host does not automatically pick up a source change.

## More setup, contracts and history

[Full setup and source contracts](docs/setup-and-contract.md) retain the detailed host,
source-selection, owner-review, psychometric and storage rules.
[Privacy](https://noesis.seges.ai/privacy/) · [Terms](https://noesis.seges.ai/terms/) ·
[Support](https://noesis.seges.ai/support/) · [MIT license](LICENSE)

<details>
<summary>Existing section links and historical release notes</summary>

- <a id="first-session-start-from-what-youve-already-told-your-ai"></a> [First session: start from what you've already told your AI](docs/setup-and-contract.md#first-session-start-from-what-youve-already-told-your-ai)
- <a id="host-availability"></a> [Host availability](docs/setup-and-contract.md#host-availability)
- <a id="what-the-source-ai-can-retrieve"></a> [What the source AI can retrieve](docs/setup-and-contract.md#what-the-source-ai-can-retrieve)
- <a id="what-psychology-is"></a> [What Psychology is](docs/setup-and-contract.md#what-psychology-is)
- <a id="public-claims"></a> [Public claims](docs/setup-and-contract.md#public-claims)
- <a id="self-assessment-and-conversational-reflection"></a> [Self-assessment and conversational reflection](docs/setup-and-contract.md#self-assessment-and-conversational-reflection)
- <a id="what-psychology-helps-with"></a> [What Psychology helps with](docs/setup-and-contract.md#what-psychology-helps-with)
- <a id="use-psychology-plugin-in-codex"></a> [Use Psychology Plugin in Codex](docs/setup-and-contract.md#use-psychology-plugin-in-codex)
- <a id="use-psychology-plugin-in-claude-code"></a> [Use Psychology Plugin in Claude Code](docs/setup-and-contract.md#use-psychology-plugin-in-claude-code)
- <a id="use-psychology-plugin-in-kimi-code"></a> [Use Psychology Plugin in Kimi Code](docs/setup-and-contract.md#use-psychology-plugin-in-kimi-code)
- <a id="connect-a-host"></a> [Connect a host](docs/setup-and-contract.md#connect-a-host)
- <a id="public-mcp-only-distribution"></a> [Public MCP-only distribution](docs/setup-and-contract.md#public-mcp-only-distribution)
- <a id="personal-workspace-and-natural-language-requests"></a> [Personal workspace and natural-language requests](docs/setup-and-contract.md#personal-workspace-and-natural-language-requests)
- <a id="consent-and-storage"></a> [Consent and storage](docs/setup-and-contract.md#consent-and-storage)
- <a id="safe-use"></a> [Safe use](docs/setup-and-contract.md#safe-use)
- <a id="host-acceptance"></a> [Host acceptance](docs/setup-and-contract.md#host-acceptance)
- <a id="repository-layout"></a> [Repository layout](docs/setup-and-contract.md#repository-layout)
- <a id="support"></a> [Support](docs/setup-and-contract.md#support)
- <a id="license"></a> [License](docs/setup-and-contract.md#license)
- <a id="historical-source-and-verification-notes"></a> [Historical source and verification notes](docs/setup-and-contract.md#historical-source-and-verification-notes)
- <a id="source-package-v130-review-candidate-2026-10-20"></a> [Source package v1.3.0 review candidate (2026-10-20)](docs/setup-and-contract.md#source-package-v130-review-candidate-2026-10-20)
- <a id="previous-source-package-v1223-candidate"></a> [Previous source package v1.2.23 candidate](docs/setup-and-contract.md#previous-source-package-v1223-candidate)
- <a id="source-package-v1221-submission-candidate-2026-10-16"></a> [Source package v1.2.21 submission candidate (2026-10-16)](docs/setup-and-contract.md#source-package-v1221-submission-candidate-2026-10-16)
- <a id="local-contract-re-verification-2026-10-16"></a> [Local contract re-verification (2026-10-16)](docs/setup-and-contract.md#local-contract-re-verification-2026-10-16)
- <a id="source-package-v1222-candidate-2026-10-16"></a> [Source package v1.2.22 candidate (2026-10-16)](docs/setup-and-contract.md#source-package-v1222-candidate-2026-10-16)
- <a id="source-package-v1220-2026-10-16"></a> [Source package v1.2.20 (2026-10-16)](docs/setup-and-contract.md#source-package-v1220-2026-10-16)
- <a id="explicit-selected-context-distillation-2026-10-13"></a> [Explicit selected-context distillation (2026-10-13)](docs/setup-and-contract.md#explicit-selected-context-distillation-2026-10-13)
- <a id="selected-context-session-timing-alignment-2026-10-16"></a> [Selected-context session timing alignment (2026-10-16)](docs/setup-and-contract.md#selected-context-session-timing-alignment-2026-10-16)
- <a id="candidate-evidence-citations-source-release-v1214"></a> [Candidate evidence citations (source release v1.2.14)](docs/setup-and-contract.md#candidate-evidence-citations-source-release-v1214)
- <a id="distillation-onboarding-and-schema-clarification-2026-10-14"></a> [Distillation onboarding and schema clarification (2026-10-14)](docs/setup-and-contract.md#distillation-onboarding-and-schema-clarification-2026-10-14)
- <a id="bounded-selected-memory-continuation-source-release-v1216"></a> [Bounded selected-memory continuation (source release v1.2.16)](docs/setup-and-contract.md#bounded-selected-memory-continuation-source-release-v1216)
- <a id="current-and-historical-memory-clocks-source-release-v1215"></a> [Current and historical memory clocks (source release v1.2.15)](docs/setup-and-contract.md#current-and-historical-memory-clocks-source-release-v1215)
- <a id="consent-safe-tool-guidance-source-release-v1218"></a> [Consent-safe tool guidance (source release v1.2.18)](docs/setup-and-contract.md#consent-safe-tool-guidance-source-release-v1218)
- <a id="canonical-oauth-resource-contract-source-release-v1219"></a> [Canonical OAuth resource contract (source release v1.2.19)](docs/setup-and-contract.md#canonical-oauth-resource-contract-source-release-v1219)
- <a id="consequential-only-follow-up-questions-source-release-v1217"></a> [Consequential-only follow-up questions (source release v1.2.17)](docs/setup-and-contract.md#consequential-only-follow-up-questions-source-release-v1217)
- <a id="distillation-workflow-audit-refresh-2026-10-15"></a> [Distillation workflow audit refresh (2026-10-15)](docs/setup-and-contract.md#distillation-workflow-audit-refresh-2026-10-15)
- <a id="plugin-prompt-contract-verification-2026-10-15"></a> [Plugin prompt contract verification (2026-10-15)](docs/setup-and-contract.md#plugin-prompt-contract-verification-2026-10-15)
</details>
