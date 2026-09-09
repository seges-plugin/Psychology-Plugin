---
name: psychology
version: "1.2.6"
description: Mandatory front door for every @Psychology request. Check whether callable Psychology MCP tools are visible before any generic exercise, assessment, or account claim; when they are absent, offer secure Codex connection or an explicitly chosen session-only alternative.
triggers:
  - "@Psychology"
  - "help me choose a non-clinical self-reflection exercise"
  - "psychology assessment"
  - "use Psychology"
---

# Psychology front door

Run this router for every `@Psychology` request before selecting another Psychology skill. It exists because
an installed plugin and a callable Noesis MCP connection are separate states. Never let a generic reflection,
assessment recommendation, or claim about saved Psychology data appear before that distinction is visible.

## 1. Check the current task, not plugin metadata

Inspect the tools actually visible in the current Codex task. A plugin card, an MCP URL in a manifest, or a
previous successful connection in another task does not prove a callable capability now.

- **No `psychology_...` tool is visible:** the first substantive reply must be exactly this short
  connection interstitial; do not emit a generic preface or a reflection exercise before it:

  > **Psychology MCP is not connected in this Codex task yet.** The plugin guidance is available, but no
  > `psychology_*` tool can be called, so I cannot use Noesis instruments, consent, or saved sources here.
  > Would you like to connect it now? The secure Codex flow opens an official Noesis browser sign-in; it
  > does not ask you to paste a password, token, header, or authorization URL. If you prefer not to connect,
  > say **session-only reflection** and I can help using only what you write in this chat.

  Stop there until they choose. Do not start an exercise just to be helpful. Do not send a Codex user to
  ChatGPT Developer mode, ChatGPT Plugin Management, or a Claude connector page.
- **At least one `psychology_...` tool is visible:** follow
  `../00-session-bootstrap/SKILL.md`. Start from the current conversation; use
  `psychology_get_consent_status` only when an account source would materially help, then require a
  current-session source choice before any private-data read.

No route may ask for a password, client ID, redirect URI, token, header, authorization code, or callback URL.
No route may claim that connection itself reads, saves, or authorizes access to profile, journal, result, or
imported-memory data.

## 2. Route only after the connection verdict

| Person's chosen goal | Next skill |
|---|---|
| Choose, administer, or interpret one instrument | `../assessment-guide/SKILL.md` |
| Understand visible context without turning it into answers | `../l00-context-delegate/SKILL.md` |
| Review a deliberately supplied memory export | `../memory-distillation/SKILL.md` |
| Practical non-clinical support after choosing session-only reflection | `../coaching/SKILL.md` |
| Immediate danger or urgent safety concern | `../crisis-support/SKILL.md` |

`memory-distillation` and session-only coaching remain available without the connector only when the person
expressly chooses that path. They are never evidence that the MCP is connected and never substitute for a
published assessment or an account-backed tool.
