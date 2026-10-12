# Start with what your AI already knows

Copy this into a ChatGPT, Claude, or Codex chat where the Psychology plugin/MCP is connected and its tools are
callable. Replace the goal with what you want help with. The prompt cannot grant access to past chats: each host
can use only memories and conversations it actually makes available in that session.

```text
I connected Psychology/Noesis because I want to understand my strengths and use them for this goal: [MY GOAL].

Start with the relevant memories and past conversations about me that you can access in this account and current
chat. Do not make me repeat useful context that is already available. Do not imply you searched a source you cannot
see; if a requested memory or past-chat source is unavailable, say so briefly and continue with what is available.
If I want to use older conversations that you cannot access, offer two simple options: I can paste a few selected
conversations here, or run the cross-platform export prompt in the source AI chat and paste its result here. Do not
ask me to upload a full account archive.

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
- Only contradictions or missing details that could change what we do next.
- One practical next step that builds on strengths already shown.

For goals, roles, preferences, and plans that can change over time, separate (1) when the source says the event or statement occurred, (2) when the memory/summary was saved or updated, (3) the valid-time period when the claim applied, and (4) when Noesis received a reviewed selection. A recent summary date does not make an old goal current; neither does a source-generated `temporal_status: current`. Never substitute one time for another or infer when a claim began or ended from a source event date or memory update. Apply direct statements and corrections from this current conversation before deciding whether an old claim is unresolved. A direct current correction resolves that claim for this conversation: keep the older claim historical or superseded, use the correction as current evidence, and do not ask the person to confirm the same point again or recommend a direction based on the old claim. The correction does not establish when the prior claim stopped applying; leave an unstated historical valid-time boundary unknown and do not backdate it. Only when the current status remains unresolved after applying all current-session evidence, label it historical/unknown or conflicting and ask whether it still applies if the answer could change the next step. Example: an April 2024 CEO aspiration in a memory updated today stays historical when the person says they no longer want to be CEO; do not ask again or recommend a CEO path, and do not infer the date that aspiration ended.

Keep the first response to at most five relevant patterns or candidate answers. Do not add routine
disclaimers about formal tests, psychological measurement, diagnosis, scoring, or validity unless I ask about a
named instrument, its scoring, diagnosis, or validity. Do not expand into a long plan or roadmap unless I ask.

Use what is already clear before asking me anything. Ask at most three short questions, only when each answer could
change the draft or next step. Let me correct, reject, or skip a candidate. Do not turn guesses into facts.

If I directly ask to use selected Noesis imports, follow the existing consent and exact-scope grant checks before
any read. Do not save or update anything unless I separately ask and confirm it.
For another AI's memories or chats, use its available export or selected conversations that I choose to share; do
not imply access to another account's archive.
```

If the connected assistant says it cannot access the relevant past chats, use the separate
[cross-platform export prompt](cross-platform-memory-export-prompt.md) in the source assistant, then paste that
result here. For large archives, select a few relevant conversations instead of pasting a full account export.
