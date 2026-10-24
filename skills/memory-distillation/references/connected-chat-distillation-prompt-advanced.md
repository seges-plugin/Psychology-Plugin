# Advanced bitemporal distillation prompt
For a person known to be under 13, do not request personal history, produce a personal-context export,
prepare personal candidates or save anything. Offer only general information or immediate safety help.
For ages 13–17 or an unknown age, keep examples non-graphic and suitable for teens; do not solicit intimate
details or infer sensitive identity or health traits. Do not ask for a birth date or identity document.


Use this detailed version when a changing claim's history needs careful review, when the short prompt leaves a
material gap, or when working through selected Noesis imports. For ordinary first use, use the shorter
[connected-chat prompt](connected-chat-distillation-prompt.md).

Copy this into a ChatGPT, Claude, or Codex chat where the Psychology plugin/MCP is connected and its tools are
callable. Replace the goal with what you want help with. The prompt cannot grant access to past chats: each host
can use only memories and conversations it actually makes available in that session.

```text
I connected Psychology/Noesis because I want to understand my strengths and use them for this goal: [MY GOAL].

Start with the relevant memories and past conversations about me that you can access in this account and current
chat. Actively use any built-in memory or past-chat retrieval this assistant exposes for this purpose; do not treat
the current chat or the Noesis guide as a search of my history. Do not make me repeat useful context that is
already available, and do not ask me to paste history before trying available retrieval. Do not imply you searched
a source you cannot see; if a requested memory or past-chat source is unavailable, say so briefly and continue
with what is available.
If I want to use older conversations that you cannot access, offer two simple options: I can paste a few selected
conversations here, or run the selected-memory summary prompt in the source AI chat and paste its result here. Do not
ask me to upload a full account archive.

Codex boundary: when this prompt is used in Codex, use the current task conversation and only Codex excerpts or
summaries I explicitly select or paste. Do not search or claim access to other Codex tasks, chats, saved memories,
workspace files, or account history. A Codex summary is for session-only use unless the connected Noesis service
explicitly exposes and accepts Codex as a selected-import source.

Call `psychology_get_profile_distillation_guide` once before drafting and use its guidance to shape this distillation.
Do not only check whether the tool exists. Use only exact `psychology_*` tool names visible here. If the guide tool
is unavailable or the call fails, say so briefly and continue from accessible context without inventing tool output.

For this ordinary memory-first draft, do not call any other Noesis tool or read or change stored Noesis data.
Do not describe or claim that you checked permissions, consent, account data, imports, or saved results unless I
directly asked for that operation and you actually made the corresponding tool call. Do not open with a process,
permission, or data-status summary.

First give me a concise, useful answer and draft for my goal. Reuse the goal, source choices and answers
already established. Continue the substantive answer while any storage step waits:

- Strengths, preferences, and recurring patterns, grounded in specific examples from accessible memories or chats.
- Likely wording or candidate answers that fit my goal, with the examples behind them; label interpretations as
  candidates rather than facts.
- For each pattern or candidate, include a compact, traceable source note: platform and source type, plus a
  visible conversation title, stable reference, or link when available. Name the supporting example. Show the
  source event/statement time when known. For a changing claim, keep any available memory saved/updated time,
  summary-generation time, and claim applicability period separate; include Noesis receipt time only for a
  reviewed selection that actually has one. Mark unavailable details as unknown and never invent a quote,
  source reference, or date.
- Only contradictions or missing details that could change what we do next.
- One practical next step that builds on strengths already shown.

For goals, roles, preferences, and plans that can change over time, separate (1) when the source says the event or statement occurred, (2) when that source memory was saved or updated, (3) when its summary was generated, (4) the valid-time period when the claim applied, and (5) when Noesis received a reviewed selection. A recent summary date does not make an old goal current; neither does a source-generated `temporal_status: current`. Never substitute one time for another or infer when a claim began or ended from a source event date or memory update. Apply direct statements and corrections from this current conversation before deciding whether an old claim is unresolved. A direct current correction resolves that claim for this conversation: keep the older claim historical or superseded, use the correction as current evidence, and do not ask the person to confirm the same point again or recommend a direction based on the old claim. The correction does not establish when the prior claim stopped applying; leave an unstated historical valid-time boundary unknown and do not backdate it. Only when the current status remains unresolved after applying all current-session evidence, label it historical/unknown or conflicting and ask whether it still applies if the answer could change the next step.

Keep the first response to at most five relevant patterns or candidate answers. Do not add routine
disclaimers about formal tests, psychological measurement, diagnosis, scoring, or validity unless I ask about a
named instrument, its scoring, diagnosis, or validity. Do not expand into a long plan or roadmap unless I ask.

Use what is already clear before asking me anything. Ask at most three short questions, only when each answer could
change the draft or next step. Let me correct, reject, or skip a candidate. Do not turn guesses into facts.

If I directly ask to use selected Noesis imports, follow the existing consent and exact-scope grant checks before
any read. Show the eligible sourced delta with the useful answer. If I explicitly requested distillation and
retention, continue that same intent through the dedicated selected-import review; do not ask whether to save
again. Collect only missing item decisions, current purpose consent or final authorization required by that
actual flow. Without a retention request, offer it once when useful. If the path is unavailable or blocked,
report the exact blocker, keep the draft session-only and continue answering.

Keep sensitive or third-party content out of this general import. Never call `psychology_save_my_profile` for
imported material. A separately requested profile or trajectory write uses only eligible direct current-session
statements and the exact owner-reviewed protocol in assessment-guide: discover matching prepare and receipt-only
save schemas, obtain explicit temporary-draft permission and current purpose consent, prepare the exact draft,
and wait for human approval in signed-in Noesis. After approval, use only that server-issued review_id and a
fresh authorization check. Reuse an existing explicit instruction to finish saving that exact draft; never
approve for me or send content to a legacy direct-save schema. A successful authoritative save receipt is
required before saying saved. Use only the supported same-request status/readback on uncertainty; do not create
a duplicate draft or write. A guide, preview, approval or page link alone is not persistence evidence.

Carry an already agreed next action into the actually available Today workflow with its separate delegation
and exact schema, or show the ready-to-use draft and single blocker. Reuse known task fields and never invent
start/deadline times. Outreach remains an unexecuted draft from independently selected business sources,
without private psychological, health, journal or selected-import data, and without sending anything.
For another AI's memories or chats, use a purpose-limited memory summary made with the selected-memory summary
prompt or selected conversations that I choose to share; never ask me to upload a full account archive or imply
access to another account's archive.
```

If the connected assistant says it cannot access the relevant past chats, use a source-specific fallback:
ChatGPT, Claude, or Kimi may run the [v2 selected-memory summary prompt](selected-memory-summary-prompt.md) in that
source assistant and paste the purpose-limited result here. In Codex, use the [v3 Codex-only prompt]
(selected-memory-summary-prompt-v3.md) only for excerpts selected or pasted into the current task, or paste selected
excerpts directly. Do not export or paste a full account archive.
