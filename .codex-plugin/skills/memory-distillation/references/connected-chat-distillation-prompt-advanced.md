# Advanced bitemporal distillation prompt

Use this detailed version when a changing claim's history needs careful review, when the short prompt leaves a
material gap, or when working through selected Noesis imports. For ordinary first use, use the shorter
[connected-chat prompt](connected-chat-distillation-prompt.md).

Copy this into a ChatGPT, Claude, or Codex chat where the Psychology plugin/MCP is connected and its tools are
callable. Replace the goal with what you want help with. The prompt cannot grant access to past chats: each host
can use only memories and conversations it actually makes available in that session.

```text
I connected Psychology/Noesis because I want to understand my strengths and use them for this goal: [MY GOAL].

Start with the relevant memories and past conversations about me that you can access in this account and current
chat. Do not make me repeat useful context that is already available. Do not imply you searched a source you cannot
see; if a requested memory or past-chat source is unavailable, say so briefly and continue with what is available.
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

First give me a concise, useful draft for my goal:
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

For goals, roles, preferences, and plans that can change over time, separate (1) when the source says the event or statement occurred, (2) when that source memory was saved or updated, (3) when its summary was generated, (4) the valid-time period when the claim applied, and (5) when Noesis received a reviewed selection. A recent summary date does not make an old goal current; neither does a source-generated `temporal_status: current`. Never substitute one time for another or infer when a claim began or ended from a source event date or memory update. Apply direct statements and corrections from this current conversation before deciding whether an old claim is unresolved. A direct current correction resolves that claim for this conversation: keep the older claim historical or superseded, use the correction as current evidence, and do not ask the person to confirm the same point again or recommend a direction based on the old claim. The correction does not establish when the prior claim stopped applying; leave an unstated historical valid-time boundary unknown and do not backdate it. Only when the current status remains unresolved after applying all current-session evidence, label it historical/unknown or conflicting and ask whether it still applies if the answer could change the next step. Example: an April 2024 CEO aspiration in a memory updated today stays historical when the person says they no longer want to be CEO; do not ask again or recommend a CEO path, and do not infer the date that aspiration ended.

Keep the first response to at most five relevant patterns or candidate answers. Do not add routine
disclaimers about formal tests, psychological measurement, diagnosis, scoring, or validity unless I ask about a
named instrument, its scoring, diagnosis, or validity. Do not expand into a long plan or roadmap unless I ask.

Use what is already clear before asking me anything. Ask at most three short questions, only when each answer could
change the draft or next step. Let me correct, reject, or skip a candidate. Do not turn guesses into facts.

If I directly ask to use selected Noesis imports, follow the existing consent and exact-scope grant checks before
any read. Do not save or update anything unless I separately ask and confirm it.
Do not offer persistence or call `psychology_save_my_profile` during this first-use distillation. If I separately
ask to save a profile, use only eligible direct current-session statements through the normal profile consent and
age-gate requirements; show me the exact fields and obtain my final confirmation before calling the tool. Never
send imported memory candidates through the generic profile tool. The current tool writes an append-only snapshot
immediately; say it was saved only if the result returns `saved: true`. Never infer a save from an unrelated tool
result.
For another AI's memories or chats, use a purpose-limited memory summary made with the selected-memory summary
prompt or selected conversations that I choose to share; never ask me to upload a full account archive or imply
access to another account's archive.
```

If the connected assistant says it cannot access the relevant past chats, use the separate
[selected-memory summary prompt](selected-memory-summary-prompt.md) in the source assistant, then paste that
purpose-limited result here. Do not export or paste a full account archive.
