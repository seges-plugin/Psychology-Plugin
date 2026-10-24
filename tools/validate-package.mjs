import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const pkg = readJson("package.json");
const paths = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean);
assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
assert.equal(pkg.name, "psychology");
for (const path of paths.filter((p) => p.endsWith(".json"))) readJson(path);
for (const path of ["plugin.json", ".codex-plugin/plugin.json", ".claude-plugin/plugin.json", "kimi.plugin.json", "openclaw.plugin.json", "packaging/portal-mcp/plugin.json", "packaging/portal-workflows/plugin.json"]) {
  const manifest = readJson(path);
  assert.equal(manifest.version, pkg.version, path);
  assert.equal(manifest.id ?? manifest.name, path.includes("portal-workflows") ? "psychology-workflows" : "psychology", path);
  const ui = manifest.interface ?? manifest.extensions?.["com.openai"]?.interface;
  if (ui) assert.equal(ui.displayName, "Psychology", path);
}
const marketplace = readJson(".claude-plugin/marketplace.json");
assert.equal(marketplace.name, "psychology");
assert.equal(marketplace.plugins[0].name, "psychology");
assert.equal(marketplace.plugins[0].version, pkg.version);
for (const path of ["mcp.json", ".mcp.json", ".claude-plugin/plugin.json", "kimi.plugin.json", "openclaw.plugin.json"]) {
  const data = readJson(path);
  if (!data.mcpServers) continue;
  assert.deepEqual(Object.keys(data.mcpServers), ["Psychology"], path);
  assert.equal(data.mcpServers.Psychology.url, "https://noesis.seges.ai/mcp", path);
}
for (const path of paths.filter((p) => p.endsWith(".md"))) {
  const source = readFileSync(resolve(root, path), "utf8");
  for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].replace(/^<|>$/g, "").split("#")[0];
    if (!target || /^(https?:|mailto:|#)/.test(target)) continue;
    assert.ok(existsSync(resolve(dirname(resolve(root, path)), target)), `${path}: ${target}`);
  }
}
console.log(`Package ${pkg.name} ${pkg.version} is consistent.`);
