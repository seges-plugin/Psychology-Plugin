# Source and distribution variants

Version 1.4.2 selects **portal-mcp** for public review. The plugin display name
remains Psychology Plugin and the connection name remains Psychology MCP.

| Variant | Intended contents |
|---|---|
| `portal-mcp` | Root portable manifest, MCP configurations, listing assets, license and a focused MCP README. No skills, agents, hooks, onboarding entry, workflow schema or alternate host manifest. |
| `portal` | The existing full portable workflow package, excluding lifecycle hooks. This is a separate artifact, not the selected MCP-only release. |
| `runtime` | Full manual package with 16 skills, agent instructions and optional trusted local hooks. Host trust and Node remain required. |

`python tools/package-plugin.py --variant portal-mcp --ref <reviewed-commit> --out <external-folder>`
builds the selected public variant. The builder maps the committed
`packaging/portal-mcp/plugin.json` and `packaging/portal-mcp/README.md` blobs to the
archive root. The remaining six files are the exact canonical MCP configurations,
three listing assets and license. Each receipt records the source commit, source
path and SHA-256 of every archive member. No manifest text is silently rewritten
during packaging. Other variants exclude the packaging source directory.

Use the existing **With MCP** submission flow and preserve its configured
connection. Do not use a Skills-only upload or assume a zero-skill ZIP is accepted
in every Portal flow. Read back the saved component inventory and MCP connection
after import; local archive validation does not establish import acceptance.

Public descriptions and starters name narrow user-requested operations. Relevant
use is based on that request and the connected host's actual schemas; there is no
claim of per-turn capture, automatic history retrieval or automatic account writes.
Removing local workflows does not remove or conceal the connected MCP's scoring,
health-related context, professional-listing or account-write capabilities. The
complete actual tool surface and annotations still require review and acceptance.

Official references: [package components](https://developers.openai.com/plugins/build/plugins)
and [respect for user intent and tool metadata](https://developers.openai.com/plugins/plugin-guidelines).
Source checks, archive validation, Portal scans and publication are separate gates.
