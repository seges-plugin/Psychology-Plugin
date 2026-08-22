import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const failures = [];

const RELEASE_VERSION = "1.0.1";
const PUBLIC_OWNER = "seges-plugin";
const PUBLIC_OWNER_URL = "https://github.com/seges-plugin";
const PRODUCT_BRAND = "Noesis";
const REPOSITORY_URL = "https://github.com/seges-plugin/Psychology-Plugin";
const MCP_ENDPOINT = "https://noesis.seges.ai/mcp";
const OAUTH_ISSUER = "https://noesis.seges.ai/noesis";
const PROTECTED_RESOURCE_METADATA = "https://noesis.seges.ai/.well-known/oauth-protected-resource/mcp";
const AUTHORIZATION_SERVER_METADATA = "https://noesis.seges.ai/.well-known/oauth-authorization-server/noesis";
const LIVE_CATALOG = "https://noesis.seges.ai/noesis/info";
const REMOTE_TIMEOUT_MS = 8_000;

// The verifier is scanned for credentials, email addresses, and private paths too.
// Only the vocabulary rules skip this file because its bracketed policy patterns
// are implementation text rather than user-visible product content.
const SELF_VERIFIER_PATH = "scripts/verify-plugin-contract.mjs";
const PROHIBITED_PUBLIC_VOCABULARY = [
  { label: "restricted public vocabulary", pattern: /\bki[n]k\b/iu },
  { label: "restricted public vocabulary", pattern: /\bfe[t]ish\b/iu },
  { label: "restricted public vocabulary", pattern: /\bse[x](?:ual(?:ity|ly)?|y)?\b/iu },
  { label: "restricted public vocabulary", pattern: /\bori[e]ntations?\b/iu },
  { label: "restricted public vocabulary", pattern: /\brel[a]tionships?\b/iu },
  { label: "private owner identifier", pattern: /\bz[e]reo(?:0317)?\b/iu },
  { label: "private owner identifier", pattern: /\bc[o]nnact\b/iu },
];

const ALLOWED_PUBLIC_EMAIL = "seges-plugin@users.noreply.github.com";

function fail(message) {
  failures.push(message);
}

function absolute(relativePath) {
  return resolve(root, relativePath);
}

function requirePath(relativePath) {
  const path = absolute(relativePath);
  if (!existsSync(path)) fail(`Missing required path: ${relativePath}`);
  return path;
}

function read(relativePath) {
  const path = requirePath(relativePath);
  return existsSync(path) ? readFileSync(path, "utf8").replaceAll("\r\n", "\n") : "";
}

function parseJson(relativePath) {
  const content = read(relativePath);
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch (error) {
    fail(`${relativePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function requireContains(relativePath, fragment) {
  if (!read(relativePath).includes(fragment)) {
    fail(`${relativePath} is missing required contract text: ${fragment}`);
  }
}

function requireExcludes(relativePath, fragment) {
  if (read(relativePath).includes(fragment)) {
    fail(`${relativePath} must not contain stale package path: ${fragment}`);
  }
}

function requireOrder(relativePath, first, second) {
  const text = read(relativePath);
  if (text.indexOf(first) === -1 || text.indexOf(second) === -1 || text.indexOf(first) >= text.indexOf(second)) {
    fail(`${relativePath} must place ${first} before ${second}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label} must be ${JSON.stringify(expected)}; received ${JSON.stringify(actual)}.`);
}

function assertArrayIncludes(actual, expected, label) {
  if (!Array.isArray(actual) || !actual.includes(expected)) {
    fail(`${label} must include ${JSON.stringify(expected)}.`);
  }
}

function assertNoCredentialFields(value, label) {
  if (!value || typeof value !== "object") return;

  for (const [key, nested] of Object.entries(value)) {
    if (/^(?:access_?token|api_?key|authorization|client_?secret|headers?|password|private_?key|refresh_?token|secret|token)$/iu.test(key)) {
      fail(`${label} must not contain a credential-bearing field: ${key}.`);
    }
    assertNoCredentialFields(nested, `${label}.${key}`);
  }
}

function assertManifestIdentity(manifest, label, { author, owner, version = true, homepage = true, repository = true } = {}) {
  if (!manifest) return;
  if (version) assertEqual(manifest.version, RELEASE_VERSION, `${label}.version`);
  if (homepage) assertEqual(manifest.homepage, "https://noesis.seges.ai", `${label}.homepage`);
  if (repository) assertEqual(manifest.repository, REPOSITORY_URL, `${label}.repository`);

  if (author) {
    if (typeof manifest.author === "string") {
      assertEqual(manifest.author, PUBLIC_OWNER, `${label}.author`);
    } else {
      assertEqual(manifest.author?.name, PUBLIC_OWNER, `${label}.author.name`);
      assertEqual(manifest.author?.url, PUBLIC_OWNER_URL, `${label}.author.url`);
    }
  }

  if (owner) {
    assertEqual(manifest.owner?.name, PUBLIC_OWNER, `${label}.owner.name`);
    assertEqual(manifest.owner?.url, PUBLIC_OWNER_URL, `${label}.owner.url`);
  }

  assertNoCredentialFields(manifest, label);
}

function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
      .split("\0")
      .filter(Boolean);
  } catch (error) {
    fail(`Unable to enumerate tracked files for the public-content scan: ${error.message}`);
    return [];
  }
}

function matches(pattern, content) {
  pattern.lastIndex = 0;
  const matched = pattern.test(content);
  pattern.lastIndex = 0;
  return matched;
}

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu;
const SECRET_PATTERNS = [
  { label: "OpenAI-style key", pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{16,}\b/gu },
  { label: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/gu },
  { label: "GitHub token", pattern: /\b(?:gh[pous]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{20,})\b/gu },
  { label: "Slack token", pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/gu },
  { label: "Google API key", pattern: /\bAIza[0-9A-Za-z_-]{30,}\b/gu },
  { label: "private key block", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/gu },
  { label: "JWT", pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/gu },
  { label: "Bearer credential", pattern: /\bBearer\s+[A-Za-z0-9._-]{16,}\b/giu },
  {
    label: "assigned credential",
    pattern: /\b(?:api[_-]?key|client[_-]?secret|password|private[_-]?key|secret)\s*[=:]\s*["']?[A-Za-z0-9._-]{8,}/giu,
  },
];
const PRIVATE_PATH_PATTERNS = [
  /(?:^|[^A-Za-z0-9_])[A-Za-z]:[\\/](?:Users|home)[\\/]/giu,
  /(?:^|[^A-Za-z0-9_])\/(?:Users|home)\/[A-Za-z0-9._-]+/gu,
  /(?:^|\s)~(?=[\\/]|\s|$)/gu,
  /(?:^|\s)[$]H[O]M[E](?=[\\/]|\s|$)/gu,
];
const HOST_NAME_PATTERN = "(?:Claude(?:\\s+Code)?|Codex|ChatGPT|OpenAI|Kimi|OpenClaw|ClawHub)";
const HOST_CALLBACK_DOMAIN_PATTERN = "(?:claude\\.ai|chatgpt\\.com|openai\\.com|openclaw\\.ai|moonshot\\.cn)";
const UNREVIEWED_HOST_CLAIM_PATTERNS = [
  {
    label: "an unreviewed universal-client support claim",
    pattern: /\b(?:any|all|every)\s+(?:MCP\s+)?clients?\b[^.!?\n]{0,160}\b(?:can|connect(?:s|ed)?|compatible|supports?|works?)\b/iu,
  },
  {
    label: "an unreviewed named-host support claim",
    pattern: new RegExp(`\\b${HOST_NAME_PATTERN}\\b\\s+(?:(?:is|are|has|have|now|officially)\\s+)?(?:supported|compatible|available|live|integrated|approved)\\b`, "iu"),
  },
  {
    label: "an unreviewed named-host support claim",
    pattern: new RegExp(`\\b(?:supports?|compatible with|available on)\\s+${HOST_NAME_PATTERN}\\b`, "iu"),
  },
  { label: "an MCP compatibility badge or claim", pattern: /\bMCP[-\s]compatible\b/iu },
  { label: "an unreviewed Claude plugin claim", pattern: /\bClaude(?:%20|\s+)Code[-\s]Plugin\b/iu },
];
const NAMED_HOST_OAUTH_CONFIGURATION_PATTERNS = [
  {
    label: "a named-host OAuth configuration assertion",
    pattern: new RegExp(`\\b${HOST_NAME_PATTERN}\\b[^.!?\\n]{0,160}\\b(?:client[ _-]?id|client[ _-]?secret|redirect[ _-]?uri|auth(?:entication)?[ _-]?callback|callback[ _-]?url)\\b`, "iu"),
  },
  {
    label: "a named-host OAuth configuration assertion",
    pattern: new RegExp(`\\b(?:client[ _-]?id|client[ _-]?secret|redirect[ _-]?uri|auth(?:entication)?[ _-]?callback|callback[ _-]?url)\\b[^.!?\\n]{0,160}\\b${HOST_NAME_PATTERN}\\b`, "iu"),
  },
  {
    label: "a named-host OAuth configuration identifier",
    pattern: /\bnoesis-[A-Za-z0-9-]*(?:claude|codex|chatgpt|openclaw|kimi)[A-Za-z0-9-]*\b/iu,
  },
  {
    label: "a named-host OAuth callback URL",
    pattern: new RegExp(`https?://[^\\s]*${HOST_CALLBACK_DOMAIN_PATTERN}[^\\s]*(?:callback|oauth|auth[_/-])[^\\s]*`, "iu"),
  },
];
const PRIVATE_SOURCE_REFERENCE_PATTERNS = [
  { label: "a private recovery path", pattern: /_recovered-from-[A-Za-z0-9_-]+/iu },
  { label: "a private implementation reference", pattern: /\bnoesis[_-]mcp(?:\b|_)/iu },
];
const STATIC_CATALOG_COUNT_PATTERN = /\b(?:[2-9]|[1-9]\d+)\s+(?:(?:validated|public|live|MCP|current|real|hosted|available|native)\s+){0,4}(?:(?:MCP\s+)?(?:tools?|prompts?|skills?|agents?|hooks?)|(?:public\s+)?instruments?)\b/iu;
const EMPTY_HOOK_RUNTIME_CLAIM_PATTERNS = [
  {
    label: "an active named lifecycle-hook claim",
    pattern: /\b(?:SessionStart|UserPromptSubmit)\b(?:(?![.!?\n]).){0,160}\b(?:runs?|performs?|injects?|enforces?|executes?|fires?|triggers?|delivers?|monitors?|detects?|activates?)\b/iu,
  },
  {
    label: "an active named lifecycle-hook claim",
    pattern: /\b(?:runs?|performs?|injects?|enforces?|executes?|fires?|triggers?|delivers?|monitors?|detects?|activates?)\b(?:(?![.!?\n]).){0,160}\b(?:SessionStart|UserPromptSubmit)\b/iu,
  },
  {
    label: "an active named lifecycle-hook claim",
    pattern: /\b(?:SessionStart|UserPromptSubmit)\b(?:(?![.!?\n]).){0,160}\bdoes\s+on\s+(?:every|each)\s+(?:message|session)\b/iu,
  },
  {
    label: "an active named lifecycle-hook claim",
    pattern: /\b(?:SessionStart|UserPromptSubmit)\b(?:(?![.!?\n]).){0,160}\b(?:standing|automatic|always[- ]running)\s+(?:behavio(?:u)?r|check|monitor(?:ing)?)\b/iu,
  },
  {
    label: "an active generic lifecycle-hook claim",
    pattern: /\b(?:the|this|an?|each)\s+(?:executable\s+)?(?:lifecycle\s+)?hooks?\b\s+(?:(?:is|are)\s+)?(?:runs?|performs?|injects?|enforces?|executes?|fires?|triggers?|delivers?|monitors?|detects?|activates?)\b/iu,
  },
];

const ROUTING_CONTRACT_PATH = "MCP-ROUTING-CONTRACT.md";
const BARE_ACCOUNT_TOOL_NAMES = [
  "get_consent_status",
  "get_my_profile",
  "journal_get_recent",
  "journal_search",
  "journal_view_memory",
  "list_my_assessments",
  "save_assessment_result",
  "save_assessment_results_batch",
  "save_my_profile",
  "journal_write_entry",
  "journal_grant_access",
  "journal_revoke_access",
  "find_counselors",
  "list_instruments",
  "get_item_bank",
  "check_instrument_consistency",
  "check_cognitive_wellness_referral",
  "battery_aggregate",
  "battery_aggregate_json",
  "domain_filtered_report",
  "describe_norm",
];

function publicContentFindings(relativePath, content) {
  const findings = [];

  if (relativePath !== SELF_VERIFIER_PATH) {
    for (const rule of PROHIBITED_PUBLIC_VOCABULARY) {
      if (matches(rule.pattern, content)) findings.push(`${relativePath} contains ${rule.label}.`);
    }
  }

  for (const pattern of PRIVATE_PATH_PATTERNS) {
    if (matches(pattern, content)) findings.push(`${relativePath} contains a private filesystem path.`);
  }

  for (const rule of PRIVATE_SOURCE_REFERENCE_PATTERNS) {
    if (matches(rule.pattern, content)) findings.push(`${relativePath} contains ${rule.label}.`);
  }

  if (matches(STATIC_CATALOG_COUNT_PATTERN, content)) {
    findings.push(`${relativePath} contains a static catalog-count claim; link to ${LIVE_CATALOG} or use nonnumeric wording.`);
  }

  for (const rule of SECRET_PATTERNS) {
    if (matches(rule.pattern, content)) findings.push(`${relativePath} appears to contain ${rule.label}.`);
  }

  EMAIL_PATTERN.lastIndex = 0;
  for (const email of content.matchAll(EMAIL_PATTERN)) {
    if (email[0].toLowerCase() !== ALLOWED_PUBLIC_EMAIL) {
      findings.push(`${relativePath} contains an unapproved public email address: ${email[0]}.`);
    }
  }
  EMAIL_PATTERN.lastIndex = 0;

  return findings;
}

function unreviewedHostFindings(relativePath, content) {
  if (relativePath === SELF_VERIFIER_PATH) return [];

  const findings = [];
  for (const rule of [...UNREVIEWED_HOST_CLAIM_PATTERNS, ...NAMED_HOST_OAUTH_CONFIGURATION_PATTERNS]) {
    if (matches(rule.pattern, content)) {
      findings.push(`${relativePath} contains ${rule.label}; publish an acceptance receipt before making it.`);
    }
  }
  return findings;
}

function emptyHookRuntimeFindings(relativePath, content) {
  if (relativePath === SELF_VERIFIER_PATH) return [];

  const findings = [];
  for (const rule of EMPTY_HOOK_RUNTIME_CLAIM_PATTERNS) {
    if (matches(rule.pattern, content)) {
      findings.push(`${relativePath} contains ${rule.label} although hooks/hooks.json is empty.`);
    }
  }
  return findings;
}

function scanPublicContent() {

  for (const relativePath of trackedFiles()) {
    const path = absolute(relativePath);
    if (!existsSync(path)) continue;
    let content;
    try {
      const bytes = readFileSync(path);
      if (bytes.includes(0)) continue;
      content = bytes.toString("utf8");
    } catch (error) {
      fail(`Unable to read ${relativePath} during public-content scan: ${error.message}`);
      continue;
    }

    for (const finding of [...publicContentFindings(relativePath, content), ...unreviewedHostFindings(relativePath, content)]) {
      fail(finding);
    }
  }
}

function scanEmptyHookRuntimeClaims() {
  for (const relativePath of trackedFiles()) {
    const path = absolute(relativePath);
    if (!existsSync(path)) continue;

    try {
      const bytes = readFileSync(path);
      if (bytes.includes(0)) continue;
      for (const finding of emptyHookRuntimeFindings(relativePath, bytes.toString("utf8"))) {
        fail(finding);
      }
    } catch (error) {
      fail(`Unable to read ${relativePath} during empty-hook claim scan: ${error.message}`);
    }
  }
}

function bareAccountToolFindings(relativePath, content) {
  if (relativePath === SELF_VERIFIER_PATH || relativePath === ROUTING_CONTRACT_PATH) return [];

  const findings = [];
  for (const bareName of BARE_ACCOUNT_TOOL_NAMES) {
    const pattern = new RegExp("`" + bareName + "(?:\\([^`]*\\))?`", "u");
    if (pattern.test(content)) {
      findings.push(`${relativePath} names bare MCP tool ${bareName}; use the canonical noesis-prefixed tool name or describe the semantic capability without a call syntax.`);
    }
  }
  return findings;
}

function scanBareAccountToolNames() {
  for (const relativePath of trackedFiles()) {
    const path = absolute(relativePath);
    if (!existsSync(path)) continue;

    try {
      const bytes = readFileSync(path);
      if (bytes.includes(0)) continue;
      for (const finding of bareAccountToolFindings(relativePath, bytes.toString("utf8"))) fail(finding);
    } catch (error) {
      fail(`Unable to read ${relativePath} during MCP-name scan: ${error.message}`);
    }
  }
}

function scanPrimaryPublicClaims() {
  requireContains("README.md", "exact product version");
}

async function fetchJson(url, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      redirect: "error",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    fail(`${label} is unavailable or invalid (fail closed): ${error.message}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function verifyHostedOAuthContract() {
  const [catalog, protectedResource, authorizationServer] = await Promise.all([
    fetchJson(LIVE_CATALOG, "Public catalog endpoint"),
    fetchJson(PROTECTED_RESOURCE_METADATA, "OAuth protected-resource metadata"),
    fetchJson(AUTHORIZATION_SERVER_METADATA, "OAuth authorization-server metadata"),
  ]);

  if (!catalog || typeof catalog !== "object" || Array.isArray(catalog)) {
    fail("Public catalog endpoint must return a JSON object.");
  }

  if (protectedResource) {
    assertEqual(protectedResource.resource, MCP_ENDPOINT, "Protected-resource metadata resource");
    assertArrayIncludes(protectedResource.authorization_servers, OAUTH_ISSUER, "Protected-resource metadata authorization_servers");
    assertArrayIncludes(protectedResource.bearer_methods_supported, "header", "Protected-resource metadata bearer_methods_supported");
    assertArrayIncludes(protectedResource.scopes_supported, "noesis", "Protected-resource metadata scopes_supported");
  }

  if (authorizationServer) {
    assertEqual(authorizationServer.issuer, OAUTH_ISSUER, "Authorization-server metadata issuer");
    assertEqual(authorizationServer.authorization_endpoint, `${OAUTH_ISSUER}/oauth/authorize`, "Authorization-server metadata authorization_endpoint");
    assertEqual(authorizationServer.token_endpoint, `${OAUTH_ISSUER}/oauth/token`, "Authorization-server metadata token_endpoint");
    assertEqual(authorizationServer.revocation_endpoint, `${OAUTH_ISSUER}/oauth/revoke`, "Authorization-server metadata revocation_endpoint");
    assertArrayIncludes(authorizationServer.response_types_supported, "code", "Authorization-server metadata response_types_supported");
    assertArrayIncludes(authorizationServer.grant_types_supported, "authorization_code", "Authorization-server metadata grant_types_supported");
    assertArrayIncludes(authorizationServer.grant_types_supported, "refresh_token", "Authorization-server metadata grant_types_supported");
    assertArrayIncludes(authorizationServer.code_challenge_methods_supported, "S256", "Authorization-server metadata code_challenge_methods_supported");
    if (Array.isArray(authorizationServer.code_challenge_methods_supported) && authorizationServer.code_challenge_methods_supported.includes("plain")) {
      fail("Authorization-server metadata must not advertise the insecure PKCE plain method.");
    }
    assertArrayIncludes(authorizationServer.token_endpoint_auth_methods_supported, "none", "Authorization-server metadata token_endpoint_auth_methods_supported");
  }
}

function verifyCodexManifestStructure(codexManifest) {
  if (!codexManifest) return;
  assertManifestIdentity(codexManifest, "Codex manifest", { author: true });
  assertEqual(codexManifest.name, "noesis", "Codex manifest name");
  assertEqual(codexManifest.skills, "./skills/", "Codex manifest skills");
  assertEqual(codexManifest.mcpServers, "./.mcp.json", "Codex manifest mcpServers");
  assertEqual(codexManifest.interface?.displayName, PRODUCT_BRAND, "Codex manifest interface.displayName");
  assertEqual(codexManifest.interface?.developerName, PUBLIC_OWNER, "Codex manifest interface.developerName");
  if (codexManifest.interface?.composerIcon !== "./assets/icon.png" || codexManifest.interface?.logo !== "./assets/icon.png") {
    fail("Codex manifest icons must point at the canonical root asset.");
  }

  const codexEntries = readdirSync(requirePath(".codex-plugin"));
  if (codexEntries.length !== 1 || codexEntries[0] !== "plugin.json") {
    fail(".codex-plugin must contain only plugin.json; components belong at plugin root.");
  }
}

async function main() {
  const codexManifest = parseJson(".codex-plugin/plugin.json");
  const claudeManifest = parseJson(".claude-plugin/plugin.json");
  const claudeMarketplace = parseJson(".claude-plugin/marketplace.json");
  const kimiManifest = parseJson("kimi.plugin.json");
  const mcpConfig = parseJson(".mcp.json");
  const hooks = parseJson("hooks/hooks.json");

  verifyCodexManifestStructure(codexManifest);

  if (claudeManifest) {
    assertManifestIdentity(claudeManifest, "Claude manifest", { author: true });
    assertEqual(claudeManifest.name, "noesis", "Claude manifest name");
    if (!claudeManifest.description?.includes(PRODUCT_BRAND)) fail("Claude manifest description must identify the Noesis product brand.");
  }

  if (claudeMarketplace) {
    assertManifestIdentity(claudeMarketplace, "Claude marketplace", {
      owner: true,
      version: false,
      homepage: false,
      repository: false,
    });
    assertEqual(claudeMarketplace.name, "noesis", "Claude marketplace name");
    if (!Array.isArray(claudeMarketplace.plugins) || claudeMarketplace.plugins.length !== 1) {
      fail("Claude marketplace must describe exactly one public plugin.");
    } else {
      const [plugin] = claudeMarketplace.plugins;
      assertEqual(plugin.name, "noesis", "Claude marketplace plugin.name");
      assertEqual(plugin.version, RELEASE_VERSION, "Claude marketplace plugin.version");
      assertEqual(plugin.author?.name, PUBLIC_OWNER, "Claude marketplace plugin.author.name");
      assertEqual(plugin.author?.url, PUBLIC_OWNER_URL, "Claude marketplace plugin.author.url");
      assertEqual(plugin.source, "./", "Claude marketplace plugin.source");
      assertEqual(plugin.strict, true, "Claude marketplace plugin.strict");
      if (!plugin.description?.includes(PRODUCT_BRAND)) fail("Claude marketplace plugin description must identify the Noesis product brand.");
    }
  }

  if (kimiManifest) {
    assertManifestIdentity(kimiManifest, "Kimi manifest", { author: true });
    assertEqual(kimiManifest.name, "noesis", "Kimi manifest name");
    assertEqual(kimiManifest.skills, "./skills/", "Kimi manifest skills");
    assertEqual(kimiManifest.interface?.displayName, PRODUCT_BRAND, "Kimi manifest interface.displayName");
    assertEqual(kimiManifest.interface?.developerName, PUBLIC_OWNER, "Kimi manifest interface.developerName");
    if (!kimiManifest.mcpServers || typeof kimiManifest.mcpServers !== "object" || Object.keys(kimiManifest.mcpServers).length !== 1) {
      fail("Kimi manifest must define exactly one canonical Noesis MCP server.");
    } else {
      assertEqual(kimiManifest.mcpServers.noesis?.url, MCP_ENDPOINT, "Kimi manifest mcpServers.noesis.url");
    }
  }

  if (mcpConfig) {
    const servers = mcpConfig.mcpServers;
    if (!servers || typeof servers !== "object" || Array.isArray(servers) || Object.keys(servers).length !== 1 || !servers.noesis) {
      fail(".mcp.json must define exactly one canonical Noesis MCP server.");
    } else {
      assertEqual(servers.noesis.type, "http", ".mcp.json noesis.type");
      assertEqual(servers.noesis.url, MCP_ENDPOINT, ".mcp.json noesis.url");
      assertNoCredentialFields(servers.noesis, ".mcp.json noesis");
    }
  }

  if (existsSync(absolute("openclaw.plugin.json"))) {
    fail("openclaw.plugin.json must be absent: this repository ships a compatible bundle, not a native OpenClaw runtime.");
  }

  if (!hooks || Object.keys(hooks.hooks ?? {}).length !== 0) {
    fail("No executable lifecycle hook is permitted until each host has a tested, trusted runtime contract.");
  } else {
    assertEqual(hooks.description?.includes("no executable lifecycle hook"), true, "hooks/hooks.json description");
    assertEqual(hooks.description?.includes("host-cooperated instruction"), true, "hooks/hooks.json description");
    assertEqual(hooks.description?.includes("not a guaranteed lifecycle event"), true, "hooks/hooks.json description");
    scanEmptyHookRuntimeClaims();
  }

  const bootstrap = "skills/00-session-bootstrap/SKILL.md";
  requirePath(bootstrap);
  requireOrder(bootstrap, "Call `noesisget_consent_status()", "## 4. Ask for a current-session source choice");
  requireOrder(bootstrap, "## 4. Ask for a current-session source choice", "noesisjournal_view_memory");
  requireContains(bootstrap, "session-only working context brief");
  requireContains(bootstrap, "current-session source choice");
  requireContains(bootstrap, "host-cooperated instruction");
  requireContains(bootstrap, "not a hidden runtime hook or a");
  for (const path of [
    "skills/context-session/SKILL.md",
    "skills/assessment-guide/SKILL.md",
    "skills/coaching/SKILL.md",
    "skills/interpretation/SKILL.md",
    "skills/l00-context-delegate/SKILL.md",
    "skills/onboarding/SKILL.md",
    "agents/assessment-proctor.md",
    "agents/coaching-companion.md",
    "agents/results-interpreter.md",
  ]) {
    requireContains(path, "00-session-bootstrap");
    requireContains(path, "host-cooperated instruction");
  }

  requirePath(ROUTING_CONTRACT_PATH);
  for (const fragment of [
    "noesisget_consent_status",
    "noesisjournal_get_recent",
    "noesisjournal_search",
    "noesisjournal_view_memory",
    "noesisget_item_bank",
    "noesisscore_<instrument>",
    "immediate session-only working context brief",
    "Adaptive assessment rule",
  ]) {
    requireContains(ROUTING_CONTRACT_PATH, fragment);
  }
  for (const path of ["skills/assessment-guide/SKILL.md", "OPENAI-PLUGIN-TEST-CASES.md", "README.md"]) {
    requireContains(path, "noesisget_consent_status");
    requireContains(path, "noesisjournal_view_memory");
  }

  requireContains("OPENAI-PLUGIN-TEST-CASES.md", "Positive 6 -- returning context");
  requireContains("OPENAI-PLUGIN-TEST-CASES.md", "Negative 4 -- no read");
  for (const scenario of [
    "Positive 7 -- adaptive assessment routing",
    "Positive 8 -- result continuation is bounded",
    "Positive 9 -- early context distillation",
    "Negative 7 -- crisis overrides context recall",
    "Negative 8 -- no cross-session partial-assessment resume",
  ]) {
    requireContains("OPENAI-PLUGIN-TEST-CASES.md", scenario);
  }
  requireContains("skills/memory-distillation/SKILL.md", "session-only working context brief");
  requireContains("skills/memory-distillation/SKILL.md", "every proposed dimension");
  requireContains("skills/ema-review/SKILL.md", "qualitative retrospective");
  requireExcludes("skills/crisis-support/SKILL.md", "auto-activates when the safety classifier");
  requireExcludes("skills/crisis-support/SKILL.md", "Initiate human handoff protocol automatically");
  requireExcludes("skills/crisis-support/SKILL.md", "safetyEscalation config");
  scanBareAccountToolNames();
  requireContains("OPENAI-PLUGIN-PACKAGING.md", "named-client/version acceptance record");
  requireContains("OPENAI-SUBMISSION-FORM-CONTENT.md", "node scripts/verify-plugin-contract.mjs");
  requireExcludes("OPENAI-SUBMISSION-FORM-CONTENT.md", ".codex-plugin/skills/");
  requireExcludes("OPENAI-SUBMISSION-FORM-CONTENT.md", ".codex-plugin/TEST-CASES.md");

  scanPrimaryPublicClaims();
  scanPublicContent();
  await verifyHostedOAuthContract();

  if (failures.length) {
    console.error("Plugin contract verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log("Codex manifest structural validation passed.");
  console.log("Plugin contract, public-content, and live OAuth discovery verification passed.");
}

function characters(...parts) {
  return parts.join("");
}

function requireSelfTest(condition, message) {
  if (!condition) throw new Error(`Verifier self-test failed: ${message}`);
}

function hasFinding(findings, fragment) {
  return findings.some((finding) => finding.includes(fragment));
}

function runSelfTests() {
  const restrictedFixtures = [
    { value: characters("k", "i", "n", "k"), finding: "restricted public vocabulary" },
    { value: characters("f", "e", "t", "i", "s", "h"), finding: "restricted public vocabulary" },
    { value: characters("s", "e", "x", "u", "a", "l"), finding: "restricted public vocabulary" },
    { value: characters("o", "r", "i", "e", "n", "t", "a", "t", "i", "o", "n", "s"), finding: "restricted public vocabulary" },
    { value: characters("r", "e", "l", "a", "t", "i", "o", "n", "s", "h", "i", "p", "s"), finding: "restricted public vocabulary" },
    { value: characters("Z", "e", "r", "e", "o", "0", "3", "1", "7"), finding: "private owner identifier" },
  ];

  for (const fixture of restrictedFixtures) {
    const findings = publicContentFindings("README.md", fixture.value);
    requireSelfTest(hasFinding(findings, fixture.finding), `must detect the configured ${fixture.finding} variant.`);
  }

  const selfSensitiveContent = [
    `${characters("s", "k", "-")}${"a".repeat(32)}`,
    `${characters("p", "r", "i", "v", "a", "t", "e")}@${characters("e", "x", "a", "m", "p", "l", "e")}.test`,
    characters("C", ":", "/", "Users", "/", "owner"),
    characters("$", "H", "O", "M", "E", "/", "owner"),
  ].join("\n");
  const selfFindings = publicContentFindings(SELF_VERIFIER_PATH, selfSensitiveContent);
  requireSelfTest(hasFinding(selfFindings, "OpenAI-style key"), "must scan its own content for credentials.");
  requireSelfTest(hasFinding(selfFindings, "unapproved public email"), "must scan its own content for email addresses.");
  requireSelfTest(hasFinding(selfFindings, "private filesystem path"), "must scan its own content for private paths.");
  requireSelfTest(
    publicContentFindings(SELF_VERIFIER_PATH, ALLOWED_PUBLIC_EMAIL).length === 0,
    "must allow only the documented public GitHub noreply identity.",
  );
  requireSelfTest(
    !hasFinding(publicContentFindings(SELF_VERIFIER_PATH, restrictedFixtures[0].value), "restricted public vocabulary"),
    "must exempt only its own vocabulary implementation text.",
  );
  requireSelfTest(
    hasFinding(unreviewedHostFindings("README.md", "Claude is supported."), "unreviewed named-host support claim"),
    "must reject an unreviewed named-host support claim.",
  );
  requireSelfTest(
    hasFinding(unreviewedHostFindings("README.md", "Claude Client ID: public-value"), "named-host OAuth configuration assertion"),
    "must reject a named-host OAuth configuration assertion.",
  );
  const staleHookFixtures = [
    "The SessionStart hook runs before every session.",
    "The UserPromptSubmit hook performs the safety check.",
    "The SessionStart reminder delivers this guidance.",
    "The host injects context through UserPromptSubmit.",
    "This lifecycle hook runs before every session.",
  ];
  for (const fixture of staleHookFixtures) {
    requireSelfTest(
      hasFinding(emptyHookRuntimeFindings("README.md", fixture), "active"),
      "must reject a claim that an empty hook manifest executes lifecycle behavior.",
    );
  }
  requireSelfTest(
    emptyHookRuntimeFindings("README.md", "No executable lifecycle hook is shipped; this is a host-cooperated instruction.").length === 0,
    "must permit an accurate empty-hook statement.",
  );
  requireSelfTest(
    hasFinding(bareAccountToolFindings("README.md", "Call `get_consent_status()` once."), "names bare MCP tool get_consent_status"),
    "must reject a bare account-tool invocation in any scanned public file.",
  );
  requireSelfTest(
    bareAccountToolFindings("README.md", "Call `noesisget_consent_status()` once.").length === 0,
    "must permit the canonical prefixed account-tool invocation.",
  );
  requireSelfTest(
    unreviewedHostFindings("README.md", "A person may paste an export from a named app.").length === 0,
    "must permit neutral references that do not claim host support or publish setup values.",
  );
  requireSelfTest(
    hasFinding(publicContentFindings("README.md", characters("1", "6", " ", "p", "u", "b", "l", "i", "c", " ", "i", "n", "s", "t", "r", "u", "m", "e", "n", "t", "s")), "static catalog-count claim"),
    "must reject a fixed catalog count in any public text file.",
  );
  requireSelfTest(
    hasFinding(
      publicContentFindings("README.md", characters("_", "r", "e", "c", "o", "v", "e", "r", "e", "d", "-", "f", "r", "o", "m", "-", "archive")),
      "private recovery path",
    ),
    "must reject a private recovery path.",
  );
  requireSelfTest(
    hasFinding(publicContentFindings("README.md", characters("n", "o", "e", "s", "i", "s", "_", "m", "c", "p")), "private implementation reference"),
    "must reject a private implementation reference.",
  );

  console.log("Verifier deterministic self-test passed.");
}

if (process.argv.includes("--self-test")) {
  runSelfTests();
} else {
  await main();
}
