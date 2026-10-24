"""Build exact Git blobs as an MCP, workflow, legacy Portal or runtime package."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import subprocess
import zipfile

MCP_ONLY_SOURCES = {
    "plugin.json": "packaging/portal-mcp/plugin.json",
    "README.md": "packaging/portal-mcp/README.md",
    "mcp.json": "mcp.json",
    ".mcp.json": ".mcp.json",
    "LICENSE": "LICENSE",
    "assets/icon.png": "assets/icon.png",
    "assets/logo-light.svg": "assets/logo-light.svg",
    "assets/logo-dark.svg": "assets/logo-dark.svg",
}


# Reviewed workflow closure: new resources require an explicit source-profile update.
WORKFLOW_COMPONENTS = (
    'skills/00-session-bootstrap/SKILL.md',
    'skills/assessment-guide/SKILL.md',
    'skills/coaching/SKILL.md',
    'skills/coaching/references/coaching-protocols.md',
    'skills/coaching/references/safety-guidelines.md',
    'skills/context-session/SKILL.md',
    'skills/crisis-support/SKILL.md',
    'skills/ema-review/SKILL.md',
    'skills/goal-review/SKILL.md',
    'skills/interpretation/SKILL.md',
    'skills/interpretation/references/2e-archetypes.md',
    'skills/interpretation/references/asrs-interpretation.md',
    'skills/interpretation/references/cat-q-interpretation.md',
    'skills/interpretation/references/ecr-r-interpretation.md',
    'skills/interpretation/references/financial-calibration-interpretation.md',
    'skills/interpretation/references/ipip-via-r-interpretation.md',
    'skills/interpretation/references/ocean-facets.md',
    'skills/interpretation/references/strength-frames.md',
    'skills/interpretation/references/swls-interpretation.md',
    'skills/interpretation/references/wellness-tracking-interpretation.md',
    'skills/intimacy-self-understanding/SKILL.md',
    'skills/l00-context-delegate/SKILL.md',
    'skills/local-persistence/SKILL.md',
    'skills/memory-distillation/SKILL.md',
    'skills/memory-distillation/agents/openai.yaml',
    'skills/memory-distillation/references/connected-chat-distillation-prompt-advanced.md',
    'skills/memory-distillation/references/connected-chat-distillation-prompt.md',
    'skills/memory-distillation/references/selected-memory-summary-prompt-v3.md',
    'skills/memory-distillation/references/selected-memory-summary-prompt.md',
    'skills/memory-updates/SKILL.md',
    'skills/memory-updates/agents/openai.yaml',
    'skills/onboarding/SKILL.md',
    'skills/psychology/SKILL.md',
    'skills/psychology/agents/openai.yaml',
    'skills/site-research/SKILL.md',
    'schemas/memory-update.schema.json',
    'docs/activation-and-memory.md',
    'docs/package-variants.md',
    'docs/workspace-mcp.md',
    'docs/connected-objects.md',
)
WORKFLOW_SOURCES = {
    **MCP_ONLY_SOURCES,
    "plugin.json": "packaging/portal-workflows/plugin.json",
    "README.md": "packaging/portal-workflows/README.md",
    **{name: name for name in WORKFLOW_COMPONENTS},
}
WORKFLOW_ID = "psychology-workflows"


def build(repo, revision, variant):
    if variant not in {"portal", "portal-mcp", "portal-workflows", "runtime"}:
        raise ValueError("Unknown package variant")
    def git(*args):
        return subprocess.check_output(["git", "-C", str(repo), *args])

    commit = git("rev-parse", f"{revision}^{{commit}}").decode().strip()
    rows = git("ls-tree", "-r", "--full-tree", commit).decode().splitlines()
    excluded = {".gitignore", "package.json", ".claude-plugin/marketplace.json", "docs/openai-submission-readiness.md"}
    contents = {}
    source_paths = {}
    profile = {"portal-mcp": MCP_ONLY_SOURCES, "portal-workflows": WORKFLOW_SOURCES}.get(variant)
    if variant == "portal-workflows":
        tracked_skills = {row.split("\t", 1)[1] for row in rows if row.split("\t", 1)[1].startswith("skills/")}
        if tracked_skills != {name for name in WORKFLOW_COMPONENTS if name.startswith("skills/")}:
            raise ValueError("Workflow supporting-file closure changed; review the explicit allowlist")
    for row in rows:
        metadata, name = row.split("\t", 1)
        mode, kind, _ = metadata.split()
        if profile is not None:
            destinations = [target for target, source in profile.items() if source == name]
            if not destinations:
                continue
            target = destinations[0]
        else:
            target = name
        if profile is None and (name in excluded or name.startswith(("tools/", ".github/", "packaging/"))):
            continue
        if variant == "portal" and name.startswith("hooks/"):
            continue
        if kind != "blob" or mode not in {"100644", "100755"}:
            raise ValueError(f"Unsupported package entry: {name}")
        if name.startswith("/") or ".." in Path(name).parts or name == ".app.json":
            raise ValueError(f"Unsafe or non-public entry: {name}")
        contents[target] = git("show", f"{commit}:{name}")
        source_paths[target] = name

    if variant == "portal-mcp" and set(contents) != set(MCP_ONLY_SOURCES):
        raise ValueError("MCP-only source profile or referenced asset missing")

    if variant == "portal-workflows" and set(contents) != set(WORKFLOW_SOURCES):
        raise ValueError("Workflow source profile or required supporting file missing")

    manifest = json.loads(contents["plugin.json"])
    version = manifest["version"]
    if manifest.get("$schema") != "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json":
        raise ValueError("Portable schema declaration missing")
    if variant == "portal-mcp":
        canonical = json.loads(git("show", f"{commit}:plugin.json"))
        if any(manifest.get(key) != canonical.get(key) for key in ("name", "version")):
            raise ValueError("MCP-only profile identity/version differs from source release")
    if variant == "portal-workflows":
        canonical = json.loads(git("show", f"{commit}:plugin.json"))
        settings = manifest.get("extensions", {}).get("com.openai", {})
        if manifest.get("name") != WORKFLOW_ID or manifest["name"] == canonical.get("name") or manifest.get("version") != canonical.get("version"):
            raise ValueError("Workflow profile requires its distinct identity and source release version")
        if settings.get("interface", {}).get("displayName") != "Psychology" or settings.get("onboardingSkill") != "./skills/onboarding/SKILL.md":
            raise ValueError("Workflow display name or canonical onboarding entry changed")
    for name, value in list(contents.items()):
        if variant == "portal-mcp" and name.endswith((".json", ".md")):
            public_text = value.decode("utf-8").lower()
            if any(part in public_text for part in ("skills/", "agents/", "hooks/", "skill.md", "onboardingskill")):
                raise ValueError(f"Non-MCP component reference in {name}")
        if not name.endswith(".json"):
            continue
        data = json.loads(value)
        if isinstance(data, dict) and isinstance(data.get("mcpServers"), dict) and set(data["mcpServers"]) != {"Psychology"}:
            raise ValueError(f"MCP server naming must use only Psychology, without aliases: {name}")
        def inspect(node):
            if isinstance(node, dict):
                if "apps" in node and node["apps"] is not None:
                    raise ValueError(f"Public app binding in {name}")
                for key, item in node.items():
                    if variant == "portal-workflows" and key in {"agents", "hooks"}:
                        raise ValueError(f"Root agent or hook declaration in workflow profile: {name}")
                    if key in {"author", "authors", "publisher", "developerName", "contributors", "maintainers", "funding"}:
                        raise ValueError(f"Attribution metadata in {name}")
                    inspect(item)
            elif isinstance(node, list):
                for item in node:
                    inspect(item)
        inspect(data)
        if variant in {"portal", "portal-mcp", "portal-workflows"}:
            # Explicit references also disable default discovery only on some hosts;
            # a public package must have no hook declaration at all.
            if isinstance(data, dict) and ("hooks" in data or "hooks" in data.get("extensions", {}).get("com.openai", {})):
                raise ValueError(f"Hook declaration remains in Portal package: {name}")
        if variant == "portal-mcp":
            def inspect_mcp_only(node):
                if isinstance(node, dict):
                    for key, item in node.items():
                        if key.lower() in {"skills", "agents", "hooks", "onboardingskill", "sessionstart", "skillinstructions", "systemprompt", "systempromptpath"}:
                            raise ValueError(f"Non-MCP activation declaration in {name}: {key}")
                        inspect_mcp_only(item)
                elif isinstance(node, list):
                    for item in node:
                        inspect_mcp_only(item)
                elif isinstance(node, str) and any(part in node.lower() for part in ("skills/", "agents/", "hooks/", "skill.md", "onboardingskill")):
                    raise ValueError(f"Non-MCP component reference in {name}")
            inspect_mcp_only(data)
    skill_names = sorted(name.split("/")[1] for name in contents if name.startswith("skills/") and name.count("/") == 2 and name.endswith("/SKILL.md"))
    if variant != "portal-mcp" and (not skill_names or "memory-updates" not in skill_names):
        raise ValueError("Ongoing memory skill missing")
    if variant == "portal-workflows" and len(skill_names) != 16:
        raise ValueError("Workflow profile requires the reviewed 16-skill inventory")
    if variant == "runtime" and not {"hooks/hooks.json", "hooks/intent-router.cjs"} <= contents.keys():
        raise ValueError("Runtime routing hook missing")
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, data in sorted(contents.items()):
            item = zipfile.ZipInfo(name, (2026, 10, 22, 0, 0, 0))
            item.compress_type = zipfile.ZIP_DEFLATED
            item.external_attr = 0o100644 << 16
            archive.writestr(item, data)
    result = stream.getvalue()
    with zipfile.ZipFile(io.BytesIO(result)) as archive:
        if archive.testzip() is not None or set(archive.namelist()) != set(contents):
            raise ValueError("Archive readback mismatch")
        for name, data in contents.items():
            if archive.read(name) != data:
                raise ValueError(f"Changed source bytes in {name}")
    return result, {"commit": commit, "version": version, "variant": variant,
                    "bytes": len(result), "sha256": hashlib.sha256(result).hexdigest(),
                    "files": [{"path": name, "sourcePath": source_paths[name], "sha256": hashlib.sha256(data).hexdigest()} for name, data in sorted(contents.items())],
                    "skillCount": len(skill_names), "skills": skill_names,
                    "hooksIncluded": variant == "runtime",
                    "portalFlow": "existing With MCP; verify saved Portal inventory" if variant == "portal-mcp" else "separate With MCP application; verify all 16 saved skills and its connection" if variant == "portal-workflows" else None,
                    "boundary": "Exact source package; no host refresh, account write, database migration, Portal scan or publication implied."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--variant", required=True, choices=["portal", "portal-mcp", "portal-workflows", "runtime"])
    parser.add_argument("--ref", default="HEAD")
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[1]
    output = args.out.resolve()
    if output == repo or repo in output.parents:
        parser.error("Write package artifacts outside the source checkout")
    data, receipt = build(repo, args.ref, args.variant)
    output.mkdir(parents=True, exist_ok=True)
    name = f"psychology-{receipt['version']}-{args.variant}.zip"
    (output / name).write_bytes(data)
    receipt["zip"] = str(output / name)
    (output / f"{args.variant}-receipt.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({key: value for key, value in receipt.items() if key not in {"files", "skills"}}))


if __name__ == "__main__":
    main()
