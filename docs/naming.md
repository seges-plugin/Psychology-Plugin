# Psychology naming

## Names by schema role

| Role | Canonical value |
| --- | --- |
| Plugin display name | `Psychology` |
| Package, Claude marketplace/plugin, and OpenClaw plugin ID | `psychology-plugin` |
| Hosted connector display name | `Psychology` |
| MCP configuration key on every packaged harness | `Psychology` |
| Public MCP tool and prompt namespace | `psychology_` |
| MCP endpoint and protected resource | `https://noesis.seges.ai/mcp` |

Plugin manifests require a lowercase machine identifier. The plugin package ID
therefore remains `psychology-plugin`, while its display name is `Psychology`.
The separate workflow package keeps `psychology-plugin-workflows`. MCP server
keys accept `Psychology`, so all packaged harnesses use that exact key rather
than adding an unsupported display-name field. Provider schema URLs, JSON Schema
versions, API field names, skill slugs,
instrument IDs, and the deployed `psychology_` tool namespace are protocol
identifiers, not product labels, and must not be changed by a text replacement.
The product's site and stored-data service are called Noesis; that name does
not introduce a second plugin or authorize cross-product data access.

The package does not override the MCP server's runtime handshake name. That
value is owned by the separately deployed server. A harness may display its
local configuration key; use `Psychology` for editable connector names.

## Current display-name and MCP-key update

The plugin and connector are both named `Psychology`. Current source manifests,
package profiles, setup examples and naming checks agree on that label. The
previous connector key was `psychology_mcp`; update or replace that entry when
loading the revised configuration. Do not keep both keys active, which can
duplicate the same server's tools. A host may require selecting the renamed
connection or authorizing it again; the rename itself neither transfers saved
credentials nor adds permissions. The endpoint, OAuth resource and tool namespace
remain unchanged.

This source update does not rename an already installed host entry, a submitted
Portal draft, or the separately deployed server's runtime handshake metadata.
Those surfaces require their own update and acceptance evidence.

## Historical migration from versions through 1.2.23

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

Review the linked privacy and terms pages before submission, including their retention,
geographic availability, consent, and data-rights disclosures. Source-package changes do not
update hosted pages or establish platform approval.

The plugin is free and noncommercial. It does not offer diagnosis, treatment,
paid subscriptions, data sales, or commercial health referrals. Skills are
host-cooperated instructions. The manual/runtime variant adds trusted local
`SessionStart` and `UserPromptSubmit` routing hooks, requiring Node and host
approval of the exact hook definitions. The Portal variant excludes the whole
`hooks/` directory because lifecycle hooks are ineligible for public directory
submission. Installation never authorizes silent account reads. See
[activation and memory](activation-and-memory.md) for the variant and trust boundaries.

