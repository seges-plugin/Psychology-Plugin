# Psychology: reflection workflows

This is the source-defined **portal-workflows** distribution of Psychology, version 1.5.0 (unreleased source candidate). Its machine identifier is `psychology-plugin-workflows`. It is a separate application proposal from the MCP-only package (`psychology-plugin`); it must not replace that application's existing draft. The connected server remains **Psychology**, key `Psychology`, endpoint `https://noesis.seges.ai/mcp`, Streamable HTTP with OAuth/DCR.

## Included workflow components

The package contains all 16 canonical skills and every tracked file under those skill directories: bootstrap, assessment guidance, coaching, context sessions, crisis support, EMA review, goal review, interpretation, intimacy self-understanding, context delegation, local persistence guidance, memory distillation, memory updates, onboarding, the Psychology entry skill and site research. Their reference materials, the local working memory schema, activation/distribution documentation, MCP configurations, license and listing assets are included.

Three skill-local `skills/<name>/agents/openai.yaml` files are retained. These provide the supported skill UI and implicit-invocation policy metadata; they are not root agent bundles or executable hooks. Relevant natural-language requests may match these skills in hosts that support them. Availability and model selection still need exact host/version testing. There is no all-turn activation guarantee.

Root agent bundles, lifecycle hooks, app bindings and alternate host manifests are absent. Conditional references to an optional safety-monitor agent do not make it available here: follow the bundled crisis-support skill directly. Instructions about trusted hooks or other distributions describe separate manual installations; this public workflows package does not install or execute them. The package's own onboarding entry is `skills/onboarding/SKILL.md`.

## Context, consent and review

Work from current visible or deliberately selected context. The host may have limited memory or past-chat retrieval; do not claim access to an unavailable account archive. New decisions and corrections can produce source-linked session-only candidates. Reading stored Noesis records requires the relevant current consent and an explicit source choice. Persistence requires the actual supported destination, review and authorization workflow; an inferred claim, local draft or successful guide call is not a saved record. Imported context, profile/trajectory, journal and separately scoped workspace records remain distinct. The local `schemas/memory-update.schema.json` is a working envelope, not a server payload or a migration.

Psychometric tools support non-clinical reflection, not diagnosis or treatment. Exact item wording, permitted scope, user-endorsed answers and instrument-specific rights remain required. Professional listings are unverified leads, not vetted clinical referrals. Urgent safety takes precedence over ordinary reflection and memory work. Today remains a separate website and a fallback when compatible tools are unavailable. When exposed, connected tools use the matching permissions and owner-review flow; this package does not supply or approve backend access.

## Separate application review

This profile retains the actual health-related, psychometric, professional-listing and account-write surface. A different package identifier or skill distribution does not resolve existing healthcare-eligibility, privacy or other scan findings. Both applications and their shared MCP still need the applicable review; this source proposal is not an approval, a passed Portal scan or a published listing.

The source profile is committed at `packaging/portal-workflows/plugin.json` and this README. The builder maps these exact Git blobs to the archive root, with an explicit supporting-file allowlist. It never renames or rewrites manifest text inside a ZIP. Each future receipt records the immutable source revision, source path and raw SHA-256 of each member.

After source review, build the separate profile from the reviewed commit with `python tools/package-plugin.py --variant portal-workflows --ref <reviewed-commit> --out <external-folder>`. Use a separate **With MCP** application flow. Do not reupload this package over the existing MCP-only draft. After import, inspect all 16 saved skills, all three optional skill metadata files where surfaced, the onboarding entry and the authorized MCP connection. Local validation does not establish import, authentication, tool-call, model invocation or publication acceptance. Complete applicable demo/reviewer access, cases, scans and attestations separately; put private reviewer credentials only in secure dashboard fields.

Official references: [Build skills](https://developers.openai.com/plugins/build/skills), [Package your plugin](https://developers.openai.com/plugins/build/plugins), and [Submission](https://developers.openai.com/plugins/deploy/submission).

## Connected objects in this candidate

The 50-file source package includes the three-language connected-object guide and its 20-tool contract: 12 domain tools, six typed-object tools and two exact Task tools. It preserves the original Life/profile workflow and 16 skills. Natural-language hints help find relevant tools; they do not approve or save a change. Backend deployment, activated features and matching authenticated discovery are still required.
