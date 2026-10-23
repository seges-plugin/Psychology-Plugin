# Source and distribution variants

Version 1.5.0 is an unreleased source candidate. It keeps **portal-mcp** as the selected MCP-only public review package and
adds **portal-workflows** as a separate full-workflows application source proposal.
Both display **Psychology** and connect the same **Psychology** server,
key `Psychology`, endpoint `https://noesis.seges.ai/mcp`, with the existing
Streamable HTTP and OAuth/DCR configuration. Their machine identities are distinct;
creating this source profile does not create or approve a second Portal application.

| Variant | Machine identity | Intended contents |
|---|---|---|
| `portal-mcp` | `psychology-plugin` | Eight files: portable manifest, MCP configurations, listing assets, license and focused MCP README. No skills, agents, hooks, onboarding entry, workflow schema or alternate host manifest. |
| `portal-workflows` | `psychology-plugin-workflows` | Separate application source profile with all 16 skills, every supporting skill file, three skill-local `agents/openai.yaml` metadata files, memory working schema, documentation, MCP configurations and assets. No root agent bundles, lifecycle hooks, app bindings or alternate host manifests. |
| `portal` | `psychology-plugin` | Legacy full portable workflow package, excluding lifecycle hooks. Separate artifact, not the selected MCP-only release or the new workflows application identity. |
| `runtime` | `psychology-plugin` | Full manual package with 16 skills, agent instructions and optional trusted local hooks. Host trust and Node remain required. |

The workflows profile uses the same **1.5.0** candidate version as the root and MCP-only
profiles. Their distinct machine identities are unchanged. Its committed manifest and
README live in `packaging/portal-workflows/`; the source mapping is explicit, with
no hidden ZIP-time name transformation. Skill-local `agents/openai.yaml` is supported
skill UI/policy metadata, distinct from an excluded root `agents/` bundle.

`python tools/package-plugin.py --variant portal-mcp --ref <reviewed-commit> --out <external-folder>`
builds the selected public variant. The builder maps the committed
`packaging/portal-mcp/plugin.json` and `packaging/portal-mcp/README.md` blobs to the
archive root. The remaining six files are the exact canonical MCP configurations,
three listing assets and license. Each receipt records the source commit, source
path and SHA-256 of every archive member. No manifest text is silently rewritten
during packaging. Profile source directories themselves are excluded from archives;
only their explicitly mapped root files are included.

After review, build the separate workflows source from its exact reviewed commit:
`python tools/package-plugin.py --variant portal-workflows --ref <reviewed-commit> --out <external-folder>`.
Its strict allowlist contains 50 files, including all 35 skill files, the Life
workflow guide and contract, and the connected-object guide and contract used by those skills. A missing
reference, metadata file or schema, or an unreviewed new skill resource, stops the
build instead of silently dropping it. Archive receipts identify each exact source
blob. Host invocation and saved component inventory still require actual acceptance.

For **portal-mcp**, use the existing **With MCP** submission flow and preserve its configured
connection. Do not use a Skills-only upload or assume a zero-skill ZIP is accepted
in every Portal flow. Read back the saved component inventory and MCP connection
after import; local archive validation does not establish import acceptance.
For **portal-workflows**, use a separate With MCP application and inspect all 16
saved skills, onboarding and its MCP connection. Never overwrite the existing
MCP-only draft with the full workflows ZIP. Neither a source definition nor a
successful upload establishes eligibility, approval or publication.

Public descriptions and starters name narrow user-requested operations. Relevant
use is based on that request and the connected host's actual schemas; there is no
claim of guaranteed implicit selection, automatic history retrieval or automatic
account writes. The workflows skills may match relevant requests in a compatible
host; the presence of implicit-invocation metadata does not guarantee a call.
Removing local workflows does not remove or conceal the connected MCP's scoring,
health-related context, professional-listing or account-write capabilities. The
complete actual tool surface and annotations still require review and acceptance.
Separating applications or changing a machine identity does not resolve existing
healthcare-eligibility, privacy or other scan findings. The workflows profile retains
the same review cases, capability disclosures and consent/owner-review boundaries.

Official references: [package components](https://developers.openai.com/plugins/build/plugins)
and [respect for user intent and tool metadata](https://developers.openai.com/plugins/plugin-guidelines).
Source checks, archive validation, Portal scans and publication are separate gates.
