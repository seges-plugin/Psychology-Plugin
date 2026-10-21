"""Build an exact Git revision as a Portal or manual-runtime package (stdlib only)."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import subprocess
import zipfile


def build(repo, revision, variant):
    def git(*args):
        return subprocess.check_output(["git", "-C", str(repo), *args])

    commit = git("rev-parse", f"{revision}^{{commit}}").decode().strip()
    rows = git("ls-tree", "-r", "--full-tree", commit).decode().splitlines()
    excluded = {".gitignore", "package.json", ".claude-plugin/marketplace.json", "docs/openai-submission-readiness.md"}
    contents = {}
    for row in rows:
        metadata, name = row.split("\t", 1)
        mode, kind, _ = metadata.split()
        if name in excluded or name.startswith(("tools/", ".github/")):
            continue
        if variant == "portal" and name.startswith("hooks/"):
            continue
        if kind != "blob" or mode not in {"100644", "100755"}:
            raise ValueError(f"Unsupported package entry: {name}")
        if name.startswith("/") or ".." in Path(name).parts or name == ".app.json":
            raise ValueError(f"Unsafe or non-public entry: {name}")
        contents[name] = git("show", f"{commit}:{name}")

    manifest = json.loads(contents["plugin.json"])
    version = manifest["version"]
    if manifest.get("$schema") != "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json":
        raise ValueError("Portable schema declaration missing")
    for name, value in list(contents.items()):
        if not name.endswith(".json"):
            continue
        data = json.loads(value)
        def inspect(node):
            if isinstance(node, dict):
                if "apps" in node and node["apps"] is not None:
                    raise ValueError(f"Public app binding in {name}")
                for key, item in node.items():
                    if key in {"author", "authors", "publisher", "developerName", "contributors", "maintainers", "funding"}:
                        raise ValueError(f"Attribution metadata in {name}")
                    inspect(item)
            elif isinstance(node, list):
                for item in node:
                    inspect(item)
        inspect(data)
        if variant == "portal":
            # Explicit references also disable default discovery only on some hosts;
            # a public package must have no hook declaration at all.
            if isinstance(data, dict) and ("hooks" in data or "hooks" in data.get("extensions", {}).get("com.openai", {})):
                raise ValueError(f"Hook declaration remains in Portal package: {name}")
    skill_names = sorted(name.split("/")[1] for name in contents if name.startswith("skills/") and name.count("/") == 2 and name.endswith("/SKILL.md"))
    if not skill_names or "memory-updates" not in skill_names:
        raise ValueError("Ongoing memory skill missing")
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
                    "files": [{"path": name, "sha256": hashlib.sha256(data).hexdigest()} for name, data in sorted(contents.items())],
                    "skillCount": len(skill_names), "skills": skill_names,
                    "hooksIncluded": variant == "runtime",
                    "boundary": "Exact source package; no host refresh, account write, database migration, Portal scan or publication implied."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--variant", required=True, choices=["portal", "runtime"])
    parser.add_argument("--ref", default="HEAD")
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[1]
    output = args.out.resolve()
    if output == repo or repo in output.parents:
        parser.error("Write package artifacts outside the source checkout")
    data, receipt = build(repo, args.ref, args.variant)
    output.mkdir(parents=True, exist_ok=True)
    name = f"Psychology-Plugin-{receipt['version']}-{args.variant.title()}.zip"
    (output / name).write_bytes(data)
    receipt["zip"] = str(output / name)
    (output / f"{args.variant}-receipt.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({key: value for key, value in receipt.items() if key not in {"files", "skills"}}))


if __name__ == "__main__":
    main()
