# OpenAI submission preparation

Checked: 2026-10-22. Source candidate: 1.4.2. Source preparation, host acceptance,
Portal upload, scans, review and publication are separate states.

The selected public release is the explicit `portal-mcp` variant described in [package variants](package-variants.md). The full source/manual variants below are separate artifacts; their skills and hooks are not public MCP-only components.

## Source and package checks

- One portable plugin with root `plugin.json`, `mcp.json`, 16 skills and referenced
  assets. Product display name is Psychology Plugin; hosted connector is Psychology MCP.
- Ongoing personal-change routing, selected-source distillation, exact destination
  selection, owner review and receipt-only saves are specified in
  [activation and memory](activation-and-memory.md). The local memory envelope
  preserves source, memory, summary, valid-time and server-observation clocks;
  it neither migrates a database nor supplies an MCP payload.
- The **runtime** variant includes two executable routing hooks. They require
  Node and the host's approval of their exact definitions. They never open files,
  transcripts or accounts and never persist anything.
- The **Portal** variant excludes the entire `hooks/` directory. OpenAI's public
  directory currently does not accept plugins containing lifecycle hooks.
  Skills remain eligible for host selection; installation cannot guarantee
  selection on every relevant turn.
- `tools/package-plugin.py` builds these variants from exact Git commit blobs,
  rejects app bindings, unsupported file modes and remaining Portal hook
  declarations, verifies ZIP readback and emits a file-hash receipt. A source
  archive is not automatically the correct Portal submission archive.
- Synthetic routing, JSON Schema, skill YAML and package-variant regressions
  run in CI. Passing them is source evidence, not authenticated MCP acceptance.
- Attribution metadata is omitted. The marketplace compatibility label contains
  only the product name. See [naming](naming.md).

## Required host, backend and Portal acceptance

- Refresh the installed version, inspect the discovered skill descriptions,
  reconnect when necessary and approve runtime hooks through the host's normal
  trust flow. Do not programmatically bypass that approval.
- Verify authenticated `tools/list`, current schemas, boolean tool annotations
  and the complete prepare → owner approval → receipt-only save flow with a
  dedicated authorized test account. Rehearsal and catalog counts do not prove it.
- Deploy and read back any separately reviewed server metadata corrections.
  Connector consent is not permission for unsolicited journal writes or
  automatic account-history reads. Legacy save schemas must not bypass current review.
- Selected imported context stays in its permitted retention store; current
  user statements use their own destinations. Relationship, finance and task
  records require the separate Today workspace authority. No general workspace
  writer is invented by this plugin, and no private backend migration is asserted.
- Confirm target organization, project, verified public identity, current
  listing URLs, permitted country targeting and the directory's naming guidance.
  ZIP metadata cannot override hosted policy content or verified publisher identity.
- Supply a reviewer-accessible demo recording with verified playback and a
  dedicated reviewer login meeting Portal access requirements. Keep credentials
  out of Git and ZIPs. Do not fabricate missing demo, identity or targeting fields.
- Upload the exact Portal variant, read back its saved listing/components,
  connect MCP and run all required scans and saved-version review cases.
- An authorized developer completes applicable policy attestations. A draft
  must not be described as submitted, approved or published without evidence.

## Official references

- [Build plugins and hook packaging](https://developers.openai.com/plugins/build/plugins)
- [Skill invocation policy](https://developers.openai.com/plugins/build/skills)
- [Hook trust and events](https://learn.chatgpt.com/docs/hooks)
- [Submission](https://developers.openai.com/plugins/deploy/submission)
- [Guidelines](https://developers.openai.com/plugins/plugin-guidelines)
- [Submission errors](https://developers.openai.com/plugins/deploy/submission-errors)

The official Plugin Creator workflow guides source preparation. Local validation
is not a substitute for Portal scans or OpenAI review.
