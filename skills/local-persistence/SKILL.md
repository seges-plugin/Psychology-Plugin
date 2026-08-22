---
name: local-persistence
version: "0.2.0"
description: Offer a user-controlled local export of a completed Noesis result when the current session has approved filesystem access. This is an optional fallback alongside consent-controlled hosted storage, never a substitute for OAuth or host acceptance.
triggers:
  - "export a local file"
  - "download my result as JSON"
  - "open a local Noesis export"
  - "import a file I choose"
---

# Local export fallback

Noesis can provide consent-controlled hosted storage for a connected person only after the applicable
account consent and current-session source choice. This skill is a separate, optional local export for a
person who wants a portable file they directly control, is not connected, or does not want account
storage. It does not prove that any particular host supports the connector.

## When to offer it

Offer this only after a completed result exists in the current conversation, and only when both are true:

1. The person explicitly asks to export a local file, download a result, or open a file they choose.
2. The current environment actually provides user-approved filesystem tools.

Do not offer it as an automatic background action. Do not claim that a browser-only or remote MCP host
can write a local file unless that exact host and version has an acceptance record proving the capability.

## Safe export flow

1. Summarize the exact result that would be exported, including its limits and any uncertainty.
2. Ask whether the person wants a local file, hosted account storage, or neither. Do not treat a choice
   of one as consent for the other.
3. If they choose local export, ask for a user-chosen filename and directory. Never choose a private
   directory, infer a filesystem location, or overwrite an existing file without confirmation.
4. Write a readable JSON file containing only the agreed result and minimal provenance needed to
   understand it later.
5. Confirm the saved location without echoing private content into logs, chat history, or a public issue.
6. To reload, read only the file the person explicitly selects, show a short summary, and ask before
   using it as context.

## Suggested record shape

Use a transparent, portable shape. Omit fields that were not part of the completed result.

```json
{
  "format": "noesis-local-export/v1",
  "saved_at": "ISO-8601 timestamp",
  "instrument": "instrument identifier",
  "result": {
    "scores": {},
    "interpretation": "plain-language summary",
    "limits": ["what this result does not establish"]
  },
  "provenance": {
    "source": "person-confirmed current-session input",
    "notes": "optional person-approved context"
  }
}
```

Never place an OAuth authorization code, browser callback URL, access token, refresh token, password,
cookie, or account identifier in an export.

## Hosted storage remains separate

When the current, accepted host exposes Noesis account tools, begin with
`noesisget_consent_status`, show the available sources, and ask for an explicit current-session source choice
before any stored-data read. A local file does not grant hosted-storage consent, and hosted-storage
consent does not authorize reading a local file.

If the host is not accepted or the connector is unavailable, keep the result in the current conversation
or offer this local export only when filesystem access is genuinely available. Do not invent a connection
step, credential, or alternate endpoint.

## Never do these things

- Do not save anything without a direct, informed request.
- Do not silently load a previous export.
- Do not merge old and current results without showing the person what will be used.
- Do not present a local export as encrypted, synchronized, backed up, or recoverable unless the current
  environment independently proves that property.
- Do not use local files to bypass consent, OAuth, revocation, or host-acceptance requirements.
