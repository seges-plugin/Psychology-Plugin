---
name: psychology
version: "1.2.6"
description: Mandatory front door for every @Psychology request. Check whether callable Psychology MCP tools are visible before tool-dependent assessment or account actions; explicit session-only memory distillation can start without a connector.
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

- **No `psychology_...` tool is visible:** never imply that a Psychology tool ran or account data was read.
  If the person explicitly asks to distil memories, past chats, or selected/pasted material for this session,
  route directly to `../memory-distillation/SKILL.md` and proceed with context the host can actually access.
  Keep the result session-only, disclose unavailable history, and do not make connection or another choice
  a prerequisite. Offer MCP setup only when the person asks to use Noesis tools or account-backed data.

  For any other tool-dependent request, the first substantive reply must be this short connection interstitial;
  do not emit a generic preface or reflection exercise before it:

  > **Psychology MCP is not connected in this Codex task yet.** The plugin guidance is available, but no
  > `psychology_*` tool can be called, so I cannot use Noesis instruments, consent, or saved sources here.
  > Would you like to connect it now? The secure Codex flow opens an official Noesis browser sign-in; it
  > does not ask you to paste a password, token, header, or authorization URL. Session-only memory distillation
  > can still use context this host can access or material you choose to paste.

  Stop there until they choose. Do not start a tool-dependent exercise just to be helpful. Do not send a Codex
  user to ChatGPT Developer mode, ChatGPT Plugin Management, or a Claude connector page.
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
| Use selected ChatGPT, Claude, or Kimi memories and past chats to distil a goal or likely answer | `../memory-distillation/SKILL.md` |
| Practical non-clinical support after choosing session-only reflection | `../coaching/SKILL.md` |
| Immediate danger or urgent safety concern | `../crisis-support/SKILL.md` |

`memory-distillation` remains available without the connector whenever the person asks for a session-only
distillation; coaching remains available when explicitly chosen. Neither is evidence that the MCP is connected
or a substitute for a published assessment or account-backed tool.
