# Start with what your AI already knows

Copy this into the ChatGPT or Claude chat where you have connected the Psychology plugin/MCP. Replace the goal
with what you want help with.

```text
I connected Psychology/Noesis because I want to understand my strengths and use them for this goal: [MY GOAL].

Start with the relevant memories and past conversations about me that you can access in this account and current
chat. Do not make me repeat useful context that is already available. Do not imply you searched a source you cannot
see; if a requested memory or past-chat source is unavailable, say so briefly and continue with what is available.

If the exact tool `psychology_get_profile_distillation_guide` is visible in this chat, call it and use its guidance
to shape this distillation. Use only exact `psychology_*` tool names visible here. If that tool is not visible or
the call fails, say so briefly and continue from accessible context without inventing tool output.

First give me a concise, useful draft for my goal:
- Strengths, preferences, and recurring patterns, grounded in specific examples from accessible memories or chats.
- Likely wording or candidate answers that fit my goal, with the examples behind them; label interpretations as
  candidates rather than facts.
- Only contradictions or missing details that could change what we do next.
- One practical next step that builds on strengths already shown.

Use what is already clear before asking me anything. Ask at most three short questions, only when each answer could
change the draft or next step. Let me correct, reject, or skip a candidate. Do not turn guesses into facts.

Do not read saved Psychology account data unless I ask. Before any such read, check the current consent status and
ask me to choose a source for this session. Do not save or update anything unless I separately ask and confirm it.
For another AI's memories or chats, use its available export or selected conversations that I choose to share; do
not imply access to another account's archive.
```

If the connected assistant says it cannot access the relevant past chats, use the separate
[cross-platform export prompt](cross-platform-memory-export-prompt.md) in the source assistant, then paste that
result here. For large archives, select a few relevant conversations instead of pasting a full account export.
