---
name: onboarding
description: Guide a user through a browser-authorized Psychology connection without collecting credentials or overstating host support.
version: "1.2.4"
---

# Psychology connection guide

## Audience and privacy

This skill is for ages 13+. Use teen-appropriate, non-graphic language when age is unknown. For a person
known to be under 13, offer only general information or immediate safety support; do not collect personal
history, read account data, prepare personal candidates or save anything. Follow the audience boundary in
`../00-session-bootstrap/SKILL.md` and respect the actual service's age restrictions.

## Setup serves the original task

Reuse the goal, source choice and setup permission already established. Give any useful answer possible
from visible chosen context while
only the tool-dependent branch waits for connection. A successful setup returns to that original task;
it is not a reason to stop at a connection verdict or ask whether an already requested save is wanted.
Continue that save only through the exact eligible preparation, purpose and owner-review workflow.
Neither setup nor a browser sign-in grants private-source access, retention or a Today delegation.

## After installation: enable the useful loop

Explain that `../psychology/SKILL.md` and `../memory-updates/SKILL.md` match relevant natural-language
personal decisions and corrections without an invocation name. Ask for the current goal only if absent;
begin with visible or already selected context immediately. Show which retention destinations are actually
available, rather than requiring a complete profile or questionnaire. Connection and storage remain separate.

For a manual local runtime install, check whether the host exposes the bundled SessionStart/UserPromptSubmit
hooks, Node.js and an exact-definition trust review. Let the person review and trust the hook themselves;
never bypass hook trust. Use the host's reported hook availability.
Public OpenAI directory packages exclude hooks and rely on implicit skills instead. See
`../../docs/activation-and-memory.md` for the available variants.

## Use the lowest-friction path that matches the person's goal

If the person only wants Psychology to use context they deliberately paste now, a connector is not required.
Offer the session-only fast prompt in
`skills/memory-distillation/references/selected-memory-summary-prompt.md`, then return to the
memory-distillation flow. Claude's native direct-memory export may help inspect stored-memory scope, but the
Psychology website has no verified parser contract for that native format; treat it only as a session-only selected
paste unless the exact prompt converts it to a valid `noesis.platform-memory-summary.v2` part. Historical v1
parts remain readable only with unknown valid-time bounds and unknown applicability basis.
Stored Memory, past-chat context, and account-data export are separate capabilities on Claude and ChatGPT;
availability may vary by plan, region, managed workspace, and administrator policy. Do not turn optional account
connection or persistence into an intake toll gate, and never call an unavailable or unknown scope complete.

When a host supports portable plugins, install the Psychology plugin first so its safety and workflow skills
are visible before adding the connector. A plugin installation and a connector authorization are separate:
neither one proves the other succeeded, and neither authorizes an account-data read.

### Codex desktop and CLI

When the person is in Codex, do not redirect them to ChatGPT Developer mode, ChatGPT Plugin Management, or
a Claude connector page. First inspect the current task's tool list. If no `psychology_...` tool is visible
and the person explicitly asks to distil memory or past-chat context for this session, use
`skills/memory-distillation/SKILL.md` immediately with context the current task can actually access. Keep it
session-only and disclose any unavailable history; do not require MCP setup or another choice.

For tool-dependent requests without a callable `psychology_...` tool, say the MCP is not connected in this
task and offer the secure setup path. Do not claim an account read or begin a tool-dependent exercise before
the connector is available.

The deterministic Codex setup path uses no copied credential. If an existing Noesis server already appears
in Codex MCP settings, reconnect that existing server rather than creating a duplicate. Otherwise, after the
person agrees to make the local configuration change, add the stable server name and start the normal OAuth
flow:

```powershell
codex mcp add Psychology --url https://noesis.seges.ai/mcp --oauth-resource https://noesis.seges.ai/mcp
codex mcp login Psychology --oauth-client-registration dcr
```

The second command opens the browser authorization flow. Immediately before it starts, state that the
destination is the official `noesis.seges.ai` sign-in/consent page and that only the OAuth authorization
request is being sent. The person reviews and completes Google sign-in and the displayed consent there.
Never ask them to paste a password, client ID, redirect URI, token, header, authorization code, or browser
callback URL. Then begin a new Codex task, confirm at least one callable `psychology_...` tool, and use
`psychology_get_consent_status` as the smallest safe read-only check. Connection alone does not read a
profile, note, result, or imported memory.

- **Claude.ai:** open its Plugins page, add the public repository marketplace, review and install Psychology,
  then use the prefilled custom-connector form documented in the repository README. When offered the supported
  DCR choice, use **No client ID** with automatic registration.
- **ChatGPT:** a private custom-app/connector evaluation may require the account or workspace to expose
  Developer mode. The person must review and enable that host-controlled setting themselves, then use the exact
  public MCP URL in the host's private draft. Developer mode, a created draft, or a successful tool scan is not
  a public listing or permission to read private sources.
- **Kimi.ai:** use a native integration only when this session actually exposes it. The copy-paste memory
  prompt remains available without such an integration.

## Promise before action

Tell the user what they will get: a browser-authorized connection to Psychology, with a clear choice before any account-linked result is stored. Explain that a successful page load is not proof that their particular host is supported.

## Safe flow

1. Confirm that the host can use Streamable HTTP and browser authorization.
2. Add `https://noesis.seges.ai/mcp` through the host's normal MCP settings.
3. If the host cannot complete automatic registration, stop at the host's normal setup screen; do not enter an identifier, redirect URI, header, or workaround from this public package.
4. Complete sign-in only in the official browser window opened by Psychology.
5. Read the presented scope and consent choices before confirming.
6. Verify the connection with the smallest available read-only action.
7. If connection, recovery, or disconnect behaviour is unclear, stop and use the public Psychology site at `https://noesis.seges.ai/` to report the exact host version and visible error.

After a connected host really exposes `psychology_get_consent_status`, return to the person's original request and
follow `skills/00-session-bootstrap/SKILL.md` for the first Psychology-relevant request. That is a
host-cooperated instruction, not an automatic lifecycle event. It begins with a session-only working
context brief and a current-session source choice; connection success must not silently read a profile,
results, or notes. A successful browser page or a visible connector setting is not proof that tools are
available, and it does not authorize a broad private-data read.

Do not request a platform-memory export, selected conversation, or account archive during OAuth. Finish and
verify connection first, return to the person's original purpose, and continue any already selected
memory-distillation or retention request through its actual gates. Offer a source choice only if one
is genuinely missing; do not restart intake or re-ask an established desire to retain.

## Registration and redirects

Psychology publishes standards-based discovery and dynamic registration metadata. A host that implements those
paths can register itself and continue its browser authorization flow without a person copying settings
from this repository.

If a host requires a manually supplied identifier or redirect, use only its current official setup
instructions. If reviewed values are unavailable, stop that setup branch and explain the limitation.
Never guess identifiers, redirects or authorization settings.

If authorization fails, do not try alternate identifiers or redirect values. Record only the host name,
version, and visible error, then use the public Psychology site at `https://noesis.seges.ai/` to request
review. Never include an authorization code, browser URL, token, password, or account content.

## Never do these things

- Do not ask for passwords, cookies, tokens, screenshots containing credentials, or copied authorization URLs.
- Do not suggest a raw infrastructure address, a manual header, or an unofficial bypass.
- Do not call a host supported merely because it can display an MCP settings page.
- Do not store a user's account data in this repository or in a chat transcript without their clear approval.


## Separate permission for Life tasks

After normal OAuth connection, only if matching Life tools are actually exposed and available, explain:
"Approve this AI connection for Life tasks and reminder preferences in Account." Use the matching short
language for the current person and the exact connected tool schema; follow
`../../docs/workspace-mcp.md`. Present a concrete single-purpose owner review, not a multi-scope grid.
Do not accept the checkbox for the user, or treat login/terms as permission. Reminder enablement needs
its separate exact-settings confirmation. If capability is absent, keep the published Today handoff.
This permission does not install or connect another service.
