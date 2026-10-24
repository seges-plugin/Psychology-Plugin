# Package options

Choose the package that fits your host and the way you want to use Psychology. All options connect to `https://noesis.seges.ai/mcp` and use the name **Psychology**.

| Option | Contents |
| --- | --- |
| `portal-mcp` | MCP connection settings, listing assets and basic help. No bundled skills or local hooks. |
| `portal-workflows` | Guided reflection workflows and their supporting references, plus the MCP connection. Its package identifier is `psychology-workflows`. No root agents or local hooks. |
| `portal` | Portable workflows without local hooks, for compatible manual installations. |
| `runtime` | Manual workflows with optional local hooks and agent instructions for hosts that support them. |

The workflows package and MCP-only package have different identifiers. Choose the intended package rather than installing duplicate connections. Package availability and supported components vary by host; follow that host's installation interface.

Workflows can help your assistant handle relevant requests, but they do not grant account permissions. Reading private records and saving changes still require their applicable consent, source selection and review. Optional local hooks require your host's trust decision.

[Installation](setup-and-contract.md) · [Context and memory](activation-and-memory.md) · [Support](https://noesis.seges.ai/support/)
