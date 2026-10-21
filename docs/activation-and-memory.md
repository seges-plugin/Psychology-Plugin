# Activation and structured memory

The selected v1.4.2 public `portal-mcp` distribution does not contain the local loop described below. These instructions apply to the separate full source/manual packages; see [package variants](package-variants.md). The public MCP connection uses contextual user-requested operations instead of bundled per-turn routing.

Psychology checks meaningful personal changes throughout a conversation: decisions, corrected goals,
career and relationship events, habits, wellbeing, learning and financial context. An explicit memory
command or @mention is not required to start working from visible or already selected context. Unrelated
technical work remains on its own task. Urgent safety takes priority over memory capture.

## What happens after a meaningful change

1. The front-door and memory-updates skills compare the new statement with the current brief, apply
   corrections and distil the smallest source-linked delta. Repeated facts do not generate repeated calls.
2. Available host retrieval is used only for the chosen goal/source; inaccessible past chats remain
   inaccessible. Codex processing stays within the current task and deliberately selected excerpts.
3. The guide and optional non-persisting candidate-preview MCP support structured review. Missing preview
   tools do not stop useful session work. Account reads need a relevant source choice and matching grants.
4. Candidates route to the actual logical store: owner-reviewed profile or trait trajectory, selected-context
   import, explicitly requested journal entry, or separately scoped Today workspace records. A life update
   does not default to journal, and a working journal tool is not relationship/finance workspace access.
5. The assistant continues to the supported next step within the user's authorization, reports the real
   receipt or blocker, and revisits pending candidates when a correction or review result arrives.

`schemas/memory-update.schema.json` is a local working envelope, not a server payload or database migration.
It separates evidence, destination, status and clocks. Source event, source-memory record, summary generation,
claim valid time and server observation are different facts. Unknown times remain unknown; the server alone
assigns transaction/observation times. The backend, not a client-supplied table/owner identifier, selects its
database tables. The plugin does not grant SQL access or add missing remote write capabilities.

## Two activation mechanisms and package variants

**Portable directory package:** implicit skill matching through concise descriptions and
`agents/openai.yaml` with `allow_implicit_invocation: true`. Setup is discoverable through
`extensions.com.openai.onboardingSkill`. This improves matching but does not guarantee model selection.

**Manual runtime package:** includes `hooks/hooks.json` and `hooks/intent-router.cjs`. On supported Codex,
ChatGPT Work or Claude Code runtimes, SessionStart reminds the host about the loop and UserPromptSubmit
emits bounded routing context for matching personal signals. The script uses only its JSON stdin, emits
fixed guidance rather than copying the prompt into developer context, and performs no network request,
transcript/file/account read, credential access or persistence. It does not approve tools or replace source
selection. Node.js must be available in the execution environment and the exact hook definition must be
reviewed and trusted through the host. An installed plugin, passing script test or trusted hook is not an
authenticated MCP acceptance result. The heuristic is a routing aid, not a clinical classifier.

Current OpenAI public-directory rules exclude plugins containing lifecycle hooks. Therefore the Portal
builder excludes the entire hooks directory and hook references. The runtime builder retains it. Do not
upload the runtime archive as the directory package or describe the directory version as having executable
hooks. Installing on a web surface does not deploy scripts into another execution environment.

## Permission and completion without repeated intake

Reuse the user's still-applicable goal/source choices in the conversation. If the person asked for an
exact authorized action, carry it forward instead of asking again. Temporary stored profile/trajectory
drafts still need explicit permission; only human approval of the exact draft in Noesis enables its matching
receipt-only save. Imported summaries use their dedicated retention path. No generic consent, inferred
confirmation, model-generated boolean or hook event substitutes for these requirements.

Use the states session_only, awaiting_source, awaiting_permission, awaiting_owner_review, saved, blocked
and unknown_result. A preview, guide call, link or pending draft cannot mean saved. An uncertain additive
write is not automatically retried. A correction in chat takes effect for current assistance immediately,
but it is not evidence that a database record was changed.

## Host acceptance checklist

- Confirm the exact installed version and archive variant; refresh the supported host through its own flow.
- For runtime installs, review/trust the exact hooks and verify both events in that host; test a matching
  personal update, unrelated technical request, decline, reconnect and new-session/compaction behavior.
- Record authenticated tool discovery per integration. Test old direct-profile schemas and absent prepare
  tools stop writes; never transfer a receipt between integrations.
- Use synthetic account data for source selection, candidate review, owner-approved save, receipt readback,
  rejection/expiry/revocation and timeout handling. A useful brief is not durable-save acceptance.
- Verify destination separation and temporal history with the actual backend; local contract tests do not
  establish a database migration, source authenticity or platform-wide recall.

References: [OpenAI package and bundled-hook rules](https://developers.openai.com/plugins/build/plugins),
[OpenAI skills](https://developers.openai.com/plugins/build/skills),
[Codex hook events and trust](https://learn.chatgpt.com/docs/hooks),
[Claude Code hooks](https://code.claude.com/docs/en/hooks).
