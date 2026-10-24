# Installation and account access

Connect **Psychology** at `https://noesis.seges.ai/mcp`. Complete Noesis authorization in the browser. Use your host's current connection interface; account and workspace settings determine which options are available.

## Add to Claude.ai

Open [Claude Plugins](https://claude.ai/new#settings/customize-plugins), choose the option to add a marketplace from a repository and use `https://github.com/seges-plugin/Psychology-Plugin`. Install **Psychology**, connect its MCP server and complete Noesis sign-in. If the host asks for a client ID for dynamic registration, choose its no-client-ID option.

## Use Psychology in ChatGPT

<a id="use-Psychology-plugin-in-chatgpt"></a>

When custom MCP connections are available, add a connection named **Psychology** with server URL `https://noesis.seges.ai/mcp`. Follow the host's OAuth connection flow and sign in to Noesis. Select the intended app or connection for your request.

## Use Psychology in Codex

<a id="use-Psychology-plugin-in-codex"></a>

Use the Codex MCP settings or the supported CLI flow:

```shell
codex mcp add Psychology --url https://noesis.seges.ai/mcp --oauth-resource https://noesis.seges.ai/mcp
codex mcp login Psychology --oauth-client-registration dcr
```

Follow the browser authorization prompt. If your installed client uses different options, follow its current MCP interface rather than supplying credentials in chat.

## Use Psychology in Claude Code

<a id="use-Psychology-plugin-in-claude-code"></a>

Add the repository marketplace and install `psychology@psychology` through Claude Code's plugin interface. Open `/mcp` to authorize the exact server shown by the host. Installed plugins may use a scoped server name.

## Use Psychology in Kimi Code

<a id="use-Psychology-plugin-in-kimi-code"></a>

Use Kimi Code's supported plugin or MCP configuration interface. The package includes its connection settings. Complete OAuth in the browser when prompted.

## Connect a host

Other compatible hosts can use the endpoint above and the packaged MCP configuration. Component support varies. A manual package may include optional local hooks; trust only the hook definitions you intend to run.

## Age and availability

Psychology is intended for people aged 13 and older. It is not for children under 13 and is unavailable in the EU, EEA and UK. Follow your AI host's age and parent or legal guardian permission requirements. Use only features permitted by your current account controls. Do not work around an age or regional refusal. Documentation does not override account permissions.

## Choose account permissions

A connection does not authorize every account operation. Choose the relevant source and grant only the permissions needed for your request. Some changes require reviewing an exact draft in signed-in [Account](https://noesis.seges.ai/en/account/). Your assistant cannot approve it for you.

Do not paste a password, token, authorization code or client secret into a conversation. Complete sign-in only in the trusted browser flow. You can manage or disconnect a connection through the host and Noesis account settings.

## If something is unavailable

Check that the intended connection is selected and authorized. Use [Today](https://noesis.seges.ai/en/today/) for task entry or continue with a conversation-only draft while you resolve access. If a save response is unclear, inspect the original operation before trying another write.

[Package options](package-variants.md) · [Privacy](https://noesis.seges.ai/privacy) · [Support](https://noesis.seges.ai/support/)

For help, email [contact@noesis.seges.ai](mailto:contact@noesis.seges.ai).
