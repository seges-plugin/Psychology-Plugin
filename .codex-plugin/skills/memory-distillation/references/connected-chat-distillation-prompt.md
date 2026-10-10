# Start with what your AI already knows

Copy this into the ChatGPT or Claude chat where you have connected the Psychology plugin/MCP. Replace the goal
with what you want help with. It uses relevant context the current assistant can actually access; it does not
claim to search chats that are unavailable to it.

```text
I connected Psychology/Noesis because I want to understand my strengths and use them for this goal: [MY GOAL].

Start with the relevant memories and past conversations about me that you can actually access in this account
and current chat. Do not make me repeat useful context that is already available. If you cannot access past-chat
history or a particular memory source, say what you can and cannot see in one short sentence; do not pretend you
searched it. I can choose and paste specific chats if needed.

First give me a concise, useful draft with:
1. Strengths, preferences, constraints, and recurring ways I approach work or decisions that relate to my goal.
2. Likely wording or candidate answers that may fit my goal, grounded in specific examples from context you can
   see. Mark interpretations as hypotheses and show the example or source that supports each one.
3. Important contradictions or genuinely missing details that could change the next step.
4. One practical next step that uses the strengths I already show.

Use what is already clear before asking me anything. Then ask at most three short questions, and only if my answer
could change the draft or next step. Let me correct, reject, or skip any candidate. Do not turn guesses into facts.

If I ask you to complete a named self-report assessment using my context, do not make me start from a blank page.
After retrieving its current items, preserve each exact item wording and response scale. For each subjective
self-report item, you may suggest one clearly labelled, source-linked candidate response grounded in context you
can actually access and that I selected for this session. Show the specific example, platform/source label, stable
source reference or link when available, and timeframe that support it; state uncertainty and let me confirm it as
my answer, edit it, reject it, or skip it. Never invent a source link or date. A candidate remains pending;
silence, prior answers, repeated summaries, or my request to use context do not confirm it. Only my explicit,
item-specific confirmation or edited answer in this administration can enter formal scoring. If the session exposes
`psychology_prepare_conversational_estimate_review`, use it for unconfirmed estimates with `validated_score: false`
and `persist: false`; follow its live schema and do not call it unless it is actually visible. It is a session-only
review receipt, never a score or save. Do not call an assessment scoring tool until every required response is
user-endorsed and I separately confirm scoring.

For objective performance, knowledge, or ability-test items, never infer, draft, rank, or hint at an answer from
conversation history. Show the exact item and let me respond. Do not reveal an answer key. Do not infer a score or
diagnosis from conversation history. For ordinary forms, applications, planning, or reflection, you may suggest
draft wording based on my context and let me edit it.

Use Psychology MCP tools only when they add something needed for my stated goal. Call only exact psychology_*
tool names visible in this chat. Before reading any saved Psychology account source, check its consent status and
ask me to choose the source for this session. Do not save, update, or grant access to anything unless I separately
ask and confirm it.
```

If the connected assistant says it cannot access the relevant past chats, use the separate
[cross-platform export prompt](cross-platform-memory-export-prompt.md) in the source assistant, then paste that
result here. For large archives, select a few relevant conversations instead of pasting a full account export.
