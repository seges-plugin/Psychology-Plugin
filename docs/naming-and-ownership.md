# Psychology Plugin naming and ownership

Psychology Plugin is independently maintained by **吳遠佛界**. The public GitHub
publisher account is `seges-plugin`. No company registration, registered address,
corporate affiliation, or OpenAI endorsement is asserted by this repository.

## Names by schema role

| Role | Canonical value |
| --- | --- |
| Plugin display name | `Psychology Plugin` |
| Package, Claude marketplace/plugin, and OpenClaw plugin ID | `psychology-plugin` |
| Hosted connector display name | `Psychology MCP` |
| MCP configuration key on every packaged harness | `psychology_mcp` |
| Public MCP tool and prompt namespace | `psychology_` |
| MCP endpoint and protected resource | `https://noesis.seges.ai/mcp` |
| Owner / author | `吳遠佛界` |
| Source publisher / repository | `seges-plugin/Psychology-Plugin` |

Plugin manifests require a lowercase machine identifier; Codex MCP server IDs
cannot contain spaces. These IDs therefore differ deliberately from display
names. Provider schema URLs, JSON Schema versions, API field names, skill slugs,
instrument IDs, and the deployed `psychology_` tool namespace are protocol
identifiers, not product labels, and must not be changed by a text replacement.
The product's site and stored-data service are called Noesis; that name does
not introduce a second plugin or authorize cross-product data access.

The package does not override the MCP server's runtime handshake name. That
value is owned by the separately deployed server. A harness may display its
local configuration key; use `Psychology MCP` for editable connector names.

## Migration from versions through 1.2.23

Version 1.3.0 changes the package/marketplace ID from `psychology` to
`psychology-plugin` and the MCP configuration key from `psychology` to
`psychology_mcp`. Existing installations may need to select the renamed plugin
and reconnect their existing connector. Avoid keeping duplicate active server
entries. The endpoint, OAuth resource, and tool namespace remain the same.
No user data, OAuth permissions, or processing consent is migrated or expanded
by renaming the package.

If a host prefixes an installed plugin's server key, use the exact server name
shown by that host's MCP list rather than guessing a composed name. An install,
visible configuration, or renamed entry does not prove OAuth or tool acceptance.

## Policy and release boundary

The hosted service's privacy and terms URLs in the manifests must identify the
same independent operator before an OpenAI submission. A repository owner label
does not correct a stale deployed policy. Review the current published pages and
their retention, geographic availability, consent, and data-rights disclosures.
Never invent a legal entity, address, retention deadline, or compliance claim to
fill a submission field.

The plugin is free and noncommercial. It does not offer diagnosis, treatment,
paid subscriptions, data sales, or commercial health referrals. Skills are
host-cooperated instructions; `hooks/hooks.json` intentionally declares no
executable lifecycle action. Installation never authorizes silent account reads.

An OpenAI verified developer identity is selected separately in the submission
portal. `author.name` and listing metadata do not establish that verification or
guarantee which name the portal publishes.
