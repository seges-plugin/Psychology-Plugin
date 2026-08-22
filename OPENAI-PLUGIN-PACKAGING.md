# Noesis packaging contract

The package has one canonical source tree: this repository root. Only plugin.json belongs inside
.codex-plugin. Skills, .mcp.json, assets, hooks, and public acceptance material remain at the root.

## Runtime boundary

- skills is the only portable skill tree.
- .mcp.json is the only Codex MCP declaration and points to https://noesis.seges.ai/mcp.
- hooks/hooks.json deliberately contains no executable lifecycle handler.
- This package contains no OAuth secret, static bearer token, personal access token, user data, or
  private server implementation.

## Support rule

Do not describe Noesis as supported, installed, approved, or available in a named host or marketplace
until that exact host and version have a recorded named-client/version acceptance record.

The result must show browser OAuth authorization-code flow with S256 PKCE, visible consent,
authenticated tools/list, a harmless read-only call, consent before account-data reads, explicit
per-session source choice, and the applicable refresh, revoke, reconnect, replay, and client-surface
checks. A successful build or public endpoint is not an acceptance result.

Stored results, profiles, and journal data are never loaded by default. A signed-in storage read
requires the applicable consent and an explicit per-session source choice.

## Preflight

1. Run:

       node scripts/verify-plugin-contract.mjs

2. Run the host acceptance scenarios in OPENAI-PLUGIN-TEST-CASES.md against one exact host version.
3. Create one private record from [HOST-ACCEPTANCE-RECEIPT-TEMPLATE.md](HOST-ACCEPTANCE-RECEIPT-TEMPLATE.md)
   for the host, version, commit, date, test trace, and outcome; do not turn it into a public listing
   claim.
4. Re-read the target platform's current requirements before opening a submission.

Do not add alternate package trees, executable hooks, secret-bearing environment files, or private
backend source to make a host appear compatible.
