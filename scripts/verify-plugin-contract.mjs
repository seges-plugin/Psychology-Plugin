import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join, posix, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const offline = process.argv.includes("--offline");
const failures = [];
const notes = [];

function fail(message) {
  failures.push(message);
}

function note(message) {
  notes.push(message);
}

function repoPath(path) {
  return path.split("/").join(sep);
}

function text(path) {
  return readFileSync(join(root, repoPath(path)), "utf8");
}

function json(path) {
  try {
    return JSON.parse(text(path));
  } catch (error) {
    fail(`${path}: invalid JSON (${error.message})`);
    return {};
  }
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function walk(base) {
  const absolute = join(root, repoPath(base));
  const files = [];
  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    const candidate = join(absolute, entry.name);
    if (entry.isDirectory()) {
      for (const nested of walk(relative(root, candidate).split(sep).join("/"))) files.push(nested);
    } else if (entry.isFile()) {
      files.push(relative(root, candidate).split(sep).join("/"));
    }
  }
  return files.sort();
}

function trackableFiles() {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: root, encoding: "utf8" },
  );
  return output.split("\0").filter(Boolean).map((path) => path.split("\\").join("/"));
}

function indexBlob(path) {
  try {
    return execFileSync("git", ["show", `:${path}`], { cwd: root, encoding: "buffer", maxBuffer: 10 * 1024 * 1024 });
  } catch {
    return readFileSync(join(root, repoPath(path)));
  }
}

const packageJson = json("package.json");
const codexPlugin = json(".codex-plugin/plugin.json");
const claudePlugin = json(".claude-plugin/plugin.json");
const marketplace = json(".claude-plugin/marketplace.json");
const kimiPlugin = json("kimi.plugin.json");
const openclawPlugin = json("openclaw.plugin.json");
const rootMcp = json(".mcp.json");
const codexMcp = json(".codex-plugin/mcp.json");
const hooks = json("hooks/hooks.json");

const versions = new Map([
  ["package.json", packageJson.version],
  [".codex-plugin/plugin.json", codexPlugin.version],
  [".claude-plugin/plugin.json", claudePlugin.version],
  [".claude-plugin/marketplace.json", marketplace.plugins?.[0]?.version],
  ["kimi.plugin.json", kimiPlugin.version],
  ["openclaw.plugin.json", openclawPlugin.version],
]);
for (const [path, version] of versions) {
  if (version !== packageJson.version) fail(`${path}: version ${version ?? "missing"} != ${packageJson.version}`);
}

if (JSON.stringify(canonical(rootMcp)) !== JSON.stringify(canonical(codexMcp))) {
  fail(".mcp.json and .codex-plugin/mcp.json differ");
}

const rootSkills = walk("skills").map((path) => path.slice("skills/".length));
const codexSkills = walk(".codex-plugin/skills").map((path) => path.slice(".codex-plugin/skills/".length));
if (JSON.stringify(rootSkills) !== JSON.stringify(codexSkills)) {
  fail("skills/ and .codex-plugin/skills/ have different file lists");
} else {
  for (const skillPath of rootSkills) {
    const rootContent = text(`skills/${skillPath}`).replaceAll("\r\n", "\n");
    const codexContent = text(`.codex-plugin/skills/${skillPath}`).replaceAll("\r\n", "\n");
    if (rootContent !== codexContent) fail(`skill mirror differs: ${skillPath}`);
    const rootIndexBlob = indexBlob(`skills/${skillPath}`);
    const codexIndexBlob = indexBlob(`.codex-plugin/skills/${skillPath}`);
    if (!rootIndexBlob.equals(codexIndexBlob)) fail(`skill mirror Git blobs differ byte-for-byte: ${skillPath}`);
  }
}

for (const base of ["skills", ".codex-plugin/skills"]) {
  for (const skillFile of walk(base).filter((path) => path.endsWith("/SKILL.md"))) {
    const expectedName = posix.basename(posix.dirname(skillFile));
    const match = text(skillFile).match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) {
      fail(`${skillFile}: missing YAML frontmatter`);
      continue;
    }
    const name = match[1].match(/^name:\s*["']?([^\n"']+)["']?\s*$/m)?.[1]?.trim();
    if (name !== expectedName) fail(`${skillFile}: frontmatter name ${name ?? "missing"} != ${expectedName}`);
  }
}

const trackable = trackableFiles();
const trackableSet = new Set(trackable);
const markdownFiles = trackable.filter((path) => path.toLowerCase().endsWith(".md"));
for (const markdownFile of markdownFiles) {
  const body = text(markdownFile);
  if (body.includes("MCP-ROUTING-CONTRACT.md")) {
    fail(`${markdownFile}: references an unpublished maintainer-only routing document`);
  }
  const linkPattern = /!?(?:\[[^\]]*\])\(([^)]+)\)/g;
  for (const match of body.matchAll(linkPattern)) {
    let target = match[1].trim();
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    if (!target || /^(?:https?:|mailto:|#)/i.test(target)) continue;
    target = decodeURIComponent(target.split("#", 1)[0].split("?", 1)[0]).replaceAll("\\", "/");
    const direct = posix.normalize(posix.join(posix.dirname(markdownFile), target));
    const rootRelative = posix.normalize(target.replace(/^\.\//, ""));
    const candidates = [direct, rootRelative];
    const exists = candidates.some(
      (candidate) => trackableSet.has(candidate) || trackable.some((path) => path.startsWith(`${candidate}/`)),
    );
    if (!exists) fail(`${markdownFile}: relative link is not repo-tracked: ${match[1]}`);
  }
}

const coaching = text("skills/coaching/SKILL.md");
if (!coaching.includes("references/coaching-protocols.md")) {
  fail("skills/coaching/SKILL.md: missing references/ prefix for coaching protocols");
}
if (/\bsee coaching-protocols\.md\b/.test(coaching)) {
  fail("skills/coaching/SKILL.md: contains an unscoped coaching-protocols.md reference");
}

const textExtensions = new Set([".json", ".md", ".mjs", ".js", ".ts", ".yml", ".yaml", ".toml", ".txt"]);
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bAIza[0-9A-Za-z_-]{30,}\b/,
];
for (const path of trackable) {
  const extension = posix.extname(path).toLowerCase();
  if (!textExtensions.has(extension)) continue;
  const body = text(path);
  if (/\b[A-Za-z]:[\\/]/.test(body)) fail(`${path}: contains a Windows absolute path`);
  for (const pattern of secretPatterns) {
    if (pattern.test(body)) fail(`${path}: contains a potential secret (${pattern})`);
  }
}

if (Object.keys(hooks).some((key) => !["description", "hooks"].includes(key))) {
  fail("hooks/hooks.json: unexpected top-level executable hook configuration");
}
if (!hooks.description || !hooks.hooks || Object.keys(hooks.hooks).length !== 0) {
  fail("hooks/hooks.json must remain description-only with an empty hooks object");
}

const intimacyPath = "skills/intimacy-self-understanding/SKILL.md";
const intimacy = text(intimacyPath);
const intimacyRequired = [
  "adult-only",
  "Permission",
  "Limited Information",
  "Specific Suggestion",
  "Intensive Therapy",
  "Desire triggers",
  "Sensory preferences",
  "Desired companionship",
  "Roles",
  "Boundaries",
  "session-only",
  "Durable saving is unavailable",
  "special-category conversational-persistence consent gate",
  "minor or minor-suggestive",
  "non-consent",
  "loss of control",
  "crisis-support",
  "Continue only when the person explicitly initiates this topic",
  "If intimacy is merely adjacent to another topic, ask one neutral opt-in question",
  "If adulthood is not already explicit, ask only",
  "Are you 18 or older?",
  "Record only what the person states directly",
  "Never infer a field",
  "No explicit descriptions, erotic stories, sexual roleplay, or content designed for arousal",
  "No therapy claims, clinical labels, treatment plans",
  "non-consent, coercion, ongoing abuse, exploitation, or immediate danger",
  "clinically severe distress, self-harm, suicidal thinking, or danger to another person",
  "Specific Suggestion** is allowed only as neutral communication framing",
  "Do not route these fields through a journal, profile, memory, local-persistence, export, or any other workaround",
];
const intimacyCompact = intimacy.replace(/\s+/g, " ");
for (const phrase of intimacyRequired) {
  if (!intimacyCompact.toLowerCase().includes(phrase.toLowerCase())) fail(`${intimacyPath}: missing invariant: ${phrase}`);
}
if (/\bpsychology_[a-z0-9_]+\b/i.test(intimacy)) {
  fail(`${intimacyPath}: session-only intimacy reflection must not reference any Psychology tool`);
}
if (/\]\([^)]*(?:journal|profile|memory|local-persistence|export)[^)]*\)/i.test(intimacy)) {
  fail(`${intimacyPath}: must not link to a persistence route`);
}

async function verifyLiveCatalog() {
  const response = await fetch("https://noesis.seges.ai/info", { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`/info returned ${response.status}`);
  const info = await response.json();
  if (info.status !== "ok" || info.service !== "psychology") fail("live /info does not identify the psychology service as ok");
  if (!Array.isArray(info.tool_names) || info.tools !== info.tool_names.length) fail("live /info tool count is inconsistent");
  if (!Array.isArray(info.prompt_names) || info.prompts !== info.prompt_names.length) fail("live /info prompt count is inconsistent");
  const liveTools = new Set(info.tool_names ?? []);
  const livePrompts = new Set(info.prompt_names ?? []);
  for (const toolName of liveTools) {
    if (!toolName.startsWith("psychology_")) fail(`live catalog exposes an unprefixed tool: ${toolName}`);
  }
  for (const required of ["psychology_find_counselors", "psychology_find_professional_support"]) {
    if (!liveTools.has(required)) fail(`live catalog is missing required public tool: ${required}`);
  }

  const documented = new Set();
  for (const path of trackable.filter((path) => /\.(?:md|json)$/i.test(path))) {
    for (const match of text(path).matchAll(/\bpsychology_[a-z0-9_]+\b/g)) documented.add(match[0]);
  }
  const allowedDataOnly = new Set(["psychology_score_asrs_part_a", "psychology_score_wellness_tracking"]);
  for (const id of [...documented].sort()) {
    if (id === "psychology_" || id.endsWith("_")) continue;
    if (!liveTools.has(id) && !livePrompts.has(id) && !allowedDataOnly.has(id)) {
      fail(`documented psychology identifier is absent from the live catalog: ${id}`);
    }
  }

  for (const legacyPath of ["/noesis/info", "/noesis/mcp"]) {
    const legacy = await fetch(`https://noesis.seges.ai${legacyPath}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    });
    if (legacy.status !== 410) fail(`retired ${legacyPath} returned ${legacy.status}, expected 410`);
  }
  note(`live catalog: ${liveTools.size} prefixed tools, ${livePrompts.size} prompts; retired routes return 410`);
}

if (offline) {
  note("live catalog checks skipped by --offline");
} else {
  try {
    await verifyLiveCatalog();
  } catch (error) {
    fail(`live catalog verification failed: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`Plugin contract verification FAILED (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Plugin contract verification passed (${trackable.length} public files, ${rootSkills.length} mirrored skill files).`);
for (const message of notes) console.log(`- ${message}`);
