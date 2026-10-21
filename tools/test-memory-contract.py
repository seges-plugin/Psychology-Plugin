"""Synthetic JSON Schema, skill YAML and archive-variant regressions; no account access."""
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
import zipfile

from jsonschema import Draft202012Validator, FormatChecker
import yaml

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("package_plugin", ROOT / "tools/package-plugin.py")
PACKAGER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PACKAGER)


def candidate():
    return {
        "claim": "TEST: a current goal changed", "source_kind": "current_session_user",
        "source_ref": None, "evidence_quote": "TEST: I changed my goal", "interpretation": False,
        "clocks": {**{name: {"raw": None, "precision": "unknown"} for name in
                      ["source_event", "memory_record", "summary_generation", "valid_from", "valid_until"]},
                   "server_observed_at": None},
        "destination": "trajectory", "status": "session_only", "receipt": None,
    }


class MemoryContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        schema = json.loads((ROOT / "schemas/memory-update.schema.json").read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        cls.validator = Draft202012Validator(schema, format_checker=FormatChecker())

    def errors(self, value):
        return list(self.validator.iter_errors({"schema": "psychology.memory-update.v1", "candidates": [value]}))

    def test_valid_local_candidates_and_separate_clocks(self):
        current = candidate()
        self.assertFalse(self.errors(current))
        current["clocks"]["source_event"] = {"raw": "2024-04", "precision": "month"}
        current["clocks"]["summary_generation"] = {"raw": "2026-10-22", "precision": "day"}
        self.assertFalse(self.errors(current))
        for source in ["platform_memory_summary", "selected_original_message"]:
            selected = candidate()
            selected.update(source_kind=source, destination="selected_context", status="awaiting_permission")
            self.assertFalse(self.errors(selected))

    def test_imports_cannot_be_laundered_into_other_stores(self):
        for source in ["platform_memory_summary", "selected_original_message"]:
            for destination in ["profile", "trajectory", "journal", "workspace"]:
                with self.subTest(source=source, destination=destination):
                    value = candidate()
                    value.update(source_kind=source, destination=destination)
                    self.assertTrue(self.errors(value))

    def test_saved_requires_a_receipt_and_non_save_states_cannot_claim_one(self):
        value = candidate()
        value["status"] = "saved"
        self.assertTrue(self.errors(value))
        value["receipt"] = {"tool": "TEST-tool", "reference": "TEST-receipt"}
        self.assertFalse(self.errors(value))  # Representation only; never authenticates this fixture.
        value["destination"] = "none"
        self.assertTrue(self.errors(value))
        value["destination"], value["status"] = "trajectory", "awaiting_owner_review"
        self.assertTrue(self.errors(value))

    def test_invalid_and_invented_shapes_are_rejected(self):
        mutations = [
            lambda v: v["clocks"]["valid_from"].update(precision="day"),
            lambda v: v["clocks"].pop("memory_record"),
            lambda v: v["clocks"].update(server_observed_at="invented timestamp"),
            lambda v: v.update(owner_id="caller-supplied-owner"),
            lambda v: v.pop("evidence_quote"),
            lambda v: v.update(status="automatically_approved"),
            lambda v: v["clocks"].update(transaction_at="caller-now"),
        ]
        for number, mutate in enumerate(mutations):
            with self.subTest(number=number):
                value = candidate()
                mutate(value)
                self.assertTrue(self.errors(value))
        self.assertTrue(list(self.validator.iter_errors({"schema": "psychology.memory-update.v1", "candidates": []})))
        self.assertTrue(list(self.validator.iter_errors({"schema": "unknown", "candidates": [candidate()]})))

    def test_actual_skill_and_agent_yaml_is_parseable(self):
        names = set()
        for path in sorted((ROOT / "skills").glob("*/SKILL.md")):
            frontmatter = yaml.safe_load(path.read_text(encoding="utf-8").split("---", 2)[1])
            self.assertEqual(frontmatter["name"], path.parent.name)
            self.assertTrue(isinstance(frontmatter["description"], str) and frontmatter["description"].strip())
            self.assertNotIn(frontmatter["name"], names)
            names.add(frontmatter["name"])
        self.assertIn("memory-updates", names)
        for path in (ROOT / "skills").glob("*/agents/openai.yaml"):
            data = yaml.safe_load(path.read_text(encoding="utf-8"))
            self.assertIs(data["policy"]["allow_implicit_invocation"], True)
            self.assertLessEqual(set(data["policy"]), {"products", "allow_implicit_invocation"})
            self.assertTrue(data["interface"]["display_name"])


class PackageVariants(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix="psychology-package-test-")
        self.repo = Path(self.directory.name).resolve()
        self.assertEqual(self.repo.parent, Path(tempfile.gettempdir()).resolve())
        self.git("init", "-q")
        (self.repo / "empty-hooks").mkdir()
        self.git("config", "core.hooksPath", str(self.repo / "empty-hooks"))
        self.write("plugin.json", json.dumps({"$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", "name": "psychology-plugin", "version": "1.4.0"}))
        self.write("skills/memory-updates/SKILL.md", "---\nname: memory-updates\ndescription: Test only\n---\n")
        self.write("hooks/hooks.json", '{"hooks":{}}')
        self.write("hooks/intent-router.cjs", "// TEST-only source bytes\n")
        self.write("tools/private-test.txt", "must not ship")
        self.commit()

    def tearDown(self):
        self.assertEqual(self.repo.parent, Path(tempfile.gettempdir()).resolve())
        self.directory.cleanup()

    def git(self, *args):
        subprocess.run(["git", "-C", str(self.repo), *args], check=True, capture_output=True)

    def write(self, name, value):
        path = self.repo / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(value, encoding="utf-8")

    def commit(self):
        self.git("add", "--all")  # Disposable synthetic repository only.
        self.git("-c", "user.name=Psychology Plugin", "-c", "user.email=noreply@users.noreply.github.com", "commit", "-qm", "synthetic fixture")

    def test_portal_excludes_hooks_runtime_keeps_them_and_rebuild_is_exact(self):
        portal, receipt = PACKAGER.build(self.repo, "HEAD", "portal")
        again, _ = PACKAGER.build(self.repo, "HEAD", "portal")
        self.assertEqual(portal, again)
        with zipfile.ZipFile(io.BytesIO(portal)) as archive:
            self.assertFalse(any(p.startswith(("hooks/", "tools/")) for p in archive.namelist()))
            committed = subprocess.check_output(["git", "-C", str(self.repo), "show", "HEAD:skills/memory-updates/SKILL.md"])
            self.assertEqual(archive.read("skills/memory-updates/SKILL.md"), committed)
        self.assertFalse(receipt["hooksIncluded"])
        _, receipt = PACKAGER.build(self.repo, "HEAD", "runtime")
        self.assertTrue(receipt["hooksIncluded"])

    def test_public_bindings_and_hook_references_fail_instead_of_silent_rewrite(self):
        self.write("extra.json", '{"apps":{"private":"binding"}}')
        self.commit()
        with self.assertRaisesRegex(ValueError, "app binding"):
            PACKAGER.build(self.repo, "HEAD", "portal")
        self.write("extra.json", '{"hooks":"./hooks/hooks.json"}')
        self.commit()
        with self.assertRaisesRegex(ValueError, "Hook declaration"):
            PACKAGER.build(self.repo, "HEAD", "portal")


if __name__ == "__main__":
    unittest.main(verbosity=2)
