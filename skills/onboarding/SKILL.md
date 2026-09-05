---
name: onboarding
description: Guide a user through a browser-authorized Psychology MCP connection without collecting credentials or overstating host support.
version: "0.1.0"
---

# Psychology connection guide

## Use the lowest-friction path that matches the person's goal

If the person only wants Psychology to use context they deliberately paste now, a connector is not required.
Offer the session-only fast prompt in
`skills/memory-distillation/references/cross-platform-memory-export-prompt.md`, then return to the
memory-distillation flow. When Claude exposes a direct memory export, prefer it for stored-memory scope.
Stored Memory, past-chat context, and account-data export are separate capabilities on Claude and ChatGPT;
availability may vary by plan, region, managed workspace, and administrator policy. Do not turn optional account
connection or persistence into an intake toll gate, and never call an unavailable or unknown scope complete.

When a host supports portable plugins, install the Psychology plugin first so its safety and workflow skills
are visible before adding the connector. A plugin installation and a connector authorization are separate:
neither one proves the other succeeded, and neither authorizes an account-data read.

- **Claude.ai:** open its Plugins page, add the public repository marketplace, review and install Psychology,
  then use the prefilled custom-connector form documented in the repository README. When offered the supported
  DCR choice, use **No client ID — register one automatically**.
- **ChatGPT:** a private custom-app/connector evaluation may require the account or workspace to expose
  Developer mode. The person must review and enable that host-controlled setting themselves, then use the exact
  public MCP URL in the host's private draft. Developer mode, a created draft, or a successful tool scan is not
  a public listing or a named-host acceptance result.
- **Kimi.ai:** do not claim a plugin or consumer archive integration that has not completed exact-version host
  acceptance. The copy-paste memory prompt remains available without such an integration.

## Promise before action

Tell the user what they will get: a browser-authorized connection to Psychology, with a clear choice before any account-linked result is stored. Explain that a successful page load is not proof that their particular host is supported.

## Safe flow

1. Confirm that the host can use Streamable HTTP and browser authorization.
2. Add `https://noesis.seges.ai/mcp` through the host's normal MCP settings.
3. If the host cannot complete automatic registration, stop at the host's normal setup screen; do not enter an identifier, redirect URI, header, or workaround from this public package.
4. Complete Google sign-in only in the official browser window opened by Psychology.
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
verify connection first, return to the person's original purpose, then let them choose whether the optional
memory-distillation route would reduce repetition.

## Registration and redirects

Psychology publishes standards-based discovery and dynamic registration metadata. A host that implements those
paths can register itself and continue its browser authorization flow without a person copying settings
from this repository.

If a host instead requests a manually supplied identifier or redirect, it remains an unverified evaluation
target. Do not guess, copy, or invent values. Only an immutable acceptance record for that exact host and
version may contain reviewed setup values, and that record is not published in this portable package.

If authorization fails, do not try alternate identifiers or redirect values. Record only the host name,
version, and visible error, then use the public Psychology site at `https://noesis.seges.ai/` to request
review. Never include an authorization code, browser URL, token, password, or account content.

## Never do these things

- Do not ask for passwords, cookies, tokens, screenshots containing credentials, or copied authorization URLs.
- Do not suggest a raw infrastructure address, a manual header, or an unofficial bypass.
- Do not call a host supported merely because it can display an MCP settings page.
- Do not store a user's account data in this repository or in a chat transcript without their clear approval.
