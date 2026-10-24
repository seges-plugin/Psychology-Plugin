---
name: psychology
version: "1.3.0"
description: Use proactively for personal decisions, commitments, reminders, rescheduling, completion, corrected goals, career or relationship changes, habits, wellbeing, learning progress, financial context and selected memories, even without Psychology or remember keywords. Technical subject matter does not exclude a personal commitment. Route to memory-updates; verify the exact store and capability before persistence.
triggers:
  - "@psychology"
  - "help me choose a non-clinical self-reflection exercise"
  - "Psychology assessment"
  - "use Psychology"
  - "help me understand my recurring relationship patterns"
  - "幫我整理最近的煩惱和人生目標"
  - "記下我選擇分享的回憶與近況"
  - "save these selected goals or financial records to my Noesis workspace"
---

# Psychology front door

## Audience and privacy

This skill is for ages 13+. Use teen-appropriate, non-graphic language when age is unknown. For a person
known to be under 13, offer only general information or immediate safety support; do not collect personal
history, read account data, prepare personal candidates or save anything. Follow the audience boundary in
`../00-session-bootstrap/SKILL.md` and respect the actual service's age restrictions.

## Answer first, retain in the requested flow, close the action

Use the established goal and sources to give one to three useful next actions or the requested deliverable
now. Reuse established answers and ask only for a consequential missing detail. If the user asked to
distil and save, carry the eligible sourced draft into `../memory-updates/SKILL.md` and the correct review
path instead of re-asking whether to save. A write blocker is not a reason to withhold the answer.

Carry an agreed task into the actually callable Life workflow, or give the ready-to-use Today draft and
one concrete missing permission. Use the exact schema and action authorization; do not invent dates,
receipts or broader grants. Outreach can continue as an unexecuted message/shortlist from independently
chosen business sources. Keep private Noesis psychological, health, journal and import content out of
Kairos or commercial targeting; this plugin does not send messages.

Run this router for every `@psychology` request and relevant personal reflection or selected-memory request,
including natural-language requests that do not name the plugin. Do not ask the person to repeat the request
with an invocation name. Skill selection depends on the host; installation does not guarantee activation in
every conversation. Do not divert unrelated work, general medical questions, or investment advice into this
workflow. Respond to the stated need using available context; source access and persistence require their own
applicable authorization.

An installed plugin and a callable Noesis MCP connection are separate states. Make the distinction clear
when the requested result depends on a tool; do not turn it into a prerequisite for useful help from the
current conversation. Never claim that a reflection, assessment recommendation or saved-data result is
tool-backed unless the corresponding tool actually ran.

## Ongoing activation, not just first use

After urgent-safety routing, run `../memory-updates/SKILL.md` on each meaningful new personal signal,
including a decision, correction, milestone, pattern or request to build on selected context. Do not wait
for an explicit memory request, another @mention, a complete assessment or the end of the conversation.
The bootstrap establishes connection/source state; it does not mark later updates as already handled.
Reuse still-applicable choices and avoid duplicate calls for unchanged facts. Continue the user's task
while candidates await review. Meaningful changes start distillation, not unapproved account writes.
General commitments and learning milestones count even when they mention code, SQL or an API. Distinguish
them from requests to edit code, quoted examples, translation, other people's facts and hypotheticals.
Reminders, rescheduling and "done" may refer to a selected task; never infer its identity or mutate every task.

## 0. Safety before connection or source choice

If the current message signals immediate danger, self-harm, abuse, or an urgent safety concern,
route immediately to `../crisis-support/SKILL.md` before checking the connector, offering a connection
interstitial, collecting context, or following a save request. Crisis support is available without MCP.
Do not wait for connection, consent, or a source choice before offering immediate safety support.
Do not read account data, continue an assessment, or attempt a save to respond to the urgent situation.

## 1. Check the current task, not plugin metadata

For an explicit request to save personal goals, relationship/contact records, or manual financial records
in the Noesis workspace, use section 3. The website handoff does not require an MCP connection in this chat.

Inspect the tools actually visible in the current host session. A plugin card, an MCP URL in a manifest, or a
previous successful connection in another task does not prove a callable capability now.

- **No `psychology_...` tool is visible:** never imply that a Psychology tool ran or account data was read.
  If the person explicitly asks to distil memories, past chats, or selected/pasted material for this session,
  route directly to `../memory-distillation/SKILL.md` and proceed with context the host can actually access.
  Keep the result session-only, disclose unavailable history, and do not make connection or another choice
  a prerequisite. Offer MCP setup only when the person asks to use Noesis tools or account-backed data.

  A request to clarify a personal goal, make a plan or reflect on visible chosen context already selects
  that non-tool help; do not require another choice of a session-only fallback. An explicit session-only
  goal or commitment review also routes directly to
  `../goal-review/SKILL.md` with visible or user-selected material. It needs no connector;
  disclose that no account source was read and keep the review in the conversation.

  After urgent-safety routing, for any other tool-dependent request, the first substantive reply must be this short connection interstitial;
  do not emit a generic preface or reflection exercise before it:

  > **Psychology tools are not callable in this session yet.** The plugin guidance is available, but no
  > `psychology_*` tool can be called, so I cannot use Noesis instruments, consent, or saved sources here.
  > Would you like to connect it here? Use this host's native connection interface and official Noesis browser sign-in; it
  > does not ask you to paste a password, token, header, or authorization URL. Session-only memory distillation
  > can still use context this host can access or material you choose to paste.

  Stop that tool-dependent branch until the person chooses the required setup; do not start a tool-dependent
  exercise or invent its result. Continue any already requested, eligible answer or action draft from visible
  context. An existing explicit setup instruction need not be asked again.
  - **If the current host is Codex:** follow the Codex desktop and CLI section in
    `../onboarding/SKILL.md`. Do not send a Codex user to ChatGPT Developer mode,
    ChatGPT Plugin Management, or a Claude connector page.
  - **For any other host:** use that host's native connection interface and the matching section in
    `../onboarding/SKILL.md`; do not give Codex commands or another platform's setup directions.
    If no supported connection flow is available, disclose that limit and keep eligible work session-only.
- **At least one `psychology_...` tool is visible:** follow
  `../00-session-bootstrap/SKILL.md`. Start from the current conversation; use
  `psychology_get_consent_status` only when an account source would materially help, then require a
  current-session source choice before any private-data read.

No route may ask for a password, client ID, redirect URI, token, header, authorization code, or callback URL.
No route may claim that connection itself reads, saves, or authorizes access to profile, journal, result, or
imported-memory data.

## 2. Route after the connection verdict, except urgent safety

| Person's chosen goal | Next skill |
|---|---|
| New decision, corrected goal, life event or ongoing personal-context change | `../memory-updates/SKILL.md` |
| Choose, administer, or interpret one instrument | `../assessment-guide/SKILL.md` |
| Understand visible context without turning it into answers | `../l00-context-delegate/SKILL.md` |
| Use selected ChatGPT, Claude, or Kimi memories and past chats to distil a goal or likely answer | `../memory-distillation/SKILL.md` |
| Practical non-clinical support after choosing session-only reflection | `../coaching/SKILL.md` |
| Review a selected goal, commitment, or weekly progress against its sources | `../goal-review/SKILL.md` |
| Immediate danger or urgent safety concern | `../crisis-support/SKILL.md` |

`memory-distillation` remains available without the connector whenever the person asks for a session-only
distillation; coaching remains available when explicitly chosen. Neither is evidence that the MCP is connected
or a substitute for a published assessment or account-backed tool.

## 3. Personal workspace saving uses the verified destination

This distribution does not claim a live workspace MCP bridge. Before any account-backed task or reminder
action, inspect the current authenticated capability and exact input schema in the same integration namespace.
A newer package version, a Psychology profile/journal tool, or an old schema is not workspace write access.
If the required capability is absent, incompatible or refused, use the Today fallback below. Never invent a tool, construct
an authenticated REST request from a claimed owner ID, or ask for a browser token to bridge this gap.

When the person explicitly wants to retain selected information in that workspace:

1. Prepare a brief, reviewable draft in the chat using only available or selected material. Mark direct
   statements, interpretations, source references, unknown dates, and proposed corrections separately.
   Do not infer financial balances, contact verification, consent, or claim-validity bounds.
2. Offer [Noesis Today](https://noesis.seges.ai/en/today/) or, for Traditional Chinese,
   [Noesis Today](https://noesis.seges.ai/zh-tw/today/). Explain that the person signs in, chooses the applicable
   scope, reviews the exact record, and confirms the save there. Registration and MCP consent do not grant
   workspace access. The draft is still session-only until the website confirms persistence.
3. Do not silently write these candidates through profile, journal, assessment, or selected-import tools.
   Those are separate stores and purposes. If the person explicitly chooses one of those supported stores
   instead, follow its own skill, current consent, review, and actual tool-result requirements.
4. Report only the operation and destination actually confirmed. A page link, installed plugin, draft,
   database schema, or successful guide call does not prove a record was saved or a relationship graph built.

For create/change/complete/cancel/delete requests, preserve the exact selected task and current version;
ask only when the target or intended change is ambiguous. Start and deadline are independently optional:
none, date-only, or an exact time. Do not require a clock time or infer midnight/09:00. A task save is not
a reminder subscription or delivery receipt. If the callable schema cannot represent the choice, keep the
draft session-only and hand off to Today; never silently lower its precision or use another store.

This handoff enables a reviewed website workflow; it is not automatic history ingestion or an MCP-to-workspace
bridge. If future tools expose a workspace bridge, verify their actual callable schemas and authorization
contract before using them. Do not infer support from a newer version number.


## 3a. Use Life tools when available

If current authenticated discovery exposes the required `psychology_` tools with matching schemas and
`psychology_get_workspace_capabilities` returns `available:true`, follow
the exact connected tool schemas and `../../docs/workspace-mcp.md` for Life tasks only.
Do not derive availability from package version, source catalog, OAuth or browser Life consent.
`psychology_prepare_workspace_access` creates a pending client/connection-bound owner review; it never
approves itself. Use the returned exact delegation only after the person confirms it in signed-in Account.
Keep relationship, finance, Learning and assessment requests on their own currently authorized routes.
Absent/refused/incompatible tools keep section 3's Today fallback. If an earlier write is unknown, first
reconcile it; do not cause a second task by openingToday and adding the same draft again.
