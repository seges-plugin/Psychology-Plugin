# Start with what your AI already knows

Copy this into the ChatGPT or Claude chat where you have connected the Psychology plugin/MCP. Replace the goal
with what you want help with.

```text
I connected Psychology/Noesis because I want to understand my strengths and use them for this goal: [MY GOAL].

Start with the relevant memories and past conversations about me that you can access in this account and current
chat. Do not make me repeat useful context that is already available. Do not imply you searched a source you cannot
see; if a requested memory or past-chat source is unavailable, say so briefly and continue with what is available.

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

For goals, roles, preferences, and plans that can change over time, distinguish when a source or summary was created from when the underlying statement applied. A recent summary date does not make an old goal current. Treat explicit corrections as current evidence; if a past goal's current status is unknown, label it historical or unknown and ask whether it still applies before using it to recommend a current direction.

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
