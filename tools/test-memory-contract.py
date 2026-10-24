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
    def test_p4_reviews_own_metadata_with_optional_storage_off_and_empty_history(self):
        cases = []
        for path in ["plugin.json", "packaging/portal-mcp/plugin.json", "packaging/portal-workflows/plugin.json"]:
            value = json.loads((ROOT / path).read_text(encoding="utf-8"))
            review = value["extensions"]["com.openai"]["review"]["test_cases"]
            self.assertEqual(len(review["positive"]), 5)
            self.assertEqual(len(review["negative"]), 3)
            case = review["positive"][3]
            self.assertEqual(case["tools_triggered"], "psychology_get_consent_status, psychology_list_my_assessments")
            self.assertIn("current-policy core agreement and adult confirmation", case["description"])
            self.assertIn("leave all optional storage purposes off", case["description"])
            self.assertIn("create no assessment records", case["description"])
            self.assertIn("my own Noesis assessment history", case["prompt"])
            self.assertIn("this account's assessment metadata", case["prompt"])
            behavior = case["expected_behavior"]
            for boundary in ["get_consent_status first", "connected authenticated owner", "store_results=false and storage_authorized=false",
                             "not this own-metadata read", "count=0 with assessments=[]", "connection or core authorization is absent or refused",
                             "Do not enable optional grants, create or save an assessment", "fetch another owner's records", "invent scores",
                             "metadata as full scored results"]:
                self.assertIn(boundary, behavior, (path, boundary))
            self.assertNotIn("saved-results permission is not active, do not read", behavior)
            cases.append(case)
        self.assertEqual(cases[0], cases[1])
        self.assertEqual(cases[0], cases[2])

    def test_actual_public_mcp_profile_is_contextual_and_separate_from_manual(self):
        profile = json.loads((ROOT / "packaging/portal-mcp/plugin.json").read_text(encoding="utf-8"))
        canonical = json.loads((ROOT / "plugin.json").read_text(encoding="utf-8"))
        self.assertEqual(profile["$schema"], "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json")
        self.assertEqual(profile["name"], canonical["name"])
        self.assertEqual(profile["version"], canonical["version"])
        self.assertEqual(set(profile), {"$schema", "name", "version", "description", "homepage", "repository", "license", "keywords", "extensions"})
        ui = profile["extensions"]["com.openai"]["interface"]
        self.assertEqual(ui["displayName"], "Psychology")
        self.assertLessEqual(len(ui["shortDescription"]), 30)
        self.assertEqual(len(ui["defaultPrompt"]), 3)
        for prompt in ui["defaultPrompt"]:
            self.assertLessEqual(len(prompt), 128)
        self.assertIn("user-requested", profile["description"])
        self.assertIn("explicit source choice", ui["longDescription"])
        self.assertIn("not diagnosis or treatment", ui["longDescription"])
        self.assertIn("unverified leads", ui["longDescription"])
        self.assertNotIn("onboardingSkill", profile["extensions"]["com.openai"])
        self.assertIn("onboardingSkill", canonical["extensions"]["com.openai"])
        self.assertIn("psychometric-scoring", ui["capabilities"])
        self.assertIn("referral-leads", ui["capabilities"])

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
        profile = json.loads((ROOT / "packaging/portal-mcp/plugin.json").read_text(encoding="utf-8"))
        self.write("plugin.json", json.dumps({"$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", "name": profile["name"], "version": profile["version"]}))
        for target, source in PACKAGER.MCP_ONLY_SOURCES.items():
            if target == "plugin.json":
                value = json.dumps(profile)
            elif source.endswith(".json") or source.endswith(".md") or source == "LICENSE":
                value = (ROOT / source).read_text(encoding="utf-8")
            else:
                value = "TEST-only asset bytes"
            self.write(source, value)
        for alternate in [".codex-plugin/plugin.json", ".claude-plugin/plugin.json", "kimi.plugin.json", "openclaw.plugin.json"]:
            self.write(alternate, '{"skills":"./skills/","agents":"./agents/","extensions":{"com.openai":{"onboardingSkill":"./skills/setup/SKILL.md"}}}')
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
        for alternate in [".codex-plugin/plugin.json", ".claude-plugin/plugin.json", "kimi.plugin.json", "openclaw.plugin.json"]:
            self.write(alternate, '{}')
        self.write("extra.json", '{"apps":{"private":"binding"}}')
        self.commit()
        with self.assertRaisesRegex(ValueError, "app binding"):
            PACKAGER.build(self.repo, "HEAD", "portal")
        self.write("extra.json", '{"hooks":"./hooks/hooks.json"}')
        self.commit()
        with self.assertRaisesRegex(ValueError, "Hook declaration"):
            PACKAGER.build(self.repo, "HEAD", "portal")

    def test_mcp_only_archive_has_exact_members_source_receipts_and_no_alternate_discovery(self):
        result, receipt = PACKAGER.build(self.repo, "HEAD", "portal-mcp")
        again, _ = PACKAGER.build(self.repo, "HEAD", "portal-mcp")
        self.assertEqual(result, again)
        self.assertEqual(receipt["skillCount"], 0)
        self.assertFalse(receipt["hooksIncluded"])
        self.assertIn("With MCP", receipt["portalFlow"])
        with zipfile.ZipFile(io.BytesIO(result)) as archive:
            self.assertEqual(set(archive.namelist()), set(PACKAGER.MCP_ONLY_SOURCES))
            for item in receipt["files"]:
                self.assertEqual(item["sourcePath"], PACKAGER.MCP_ONLY_SOURCES[item["path"]])
                committed = subprocess.check_output(["git", "-C", str(self.repo), "show", f"HEAD:{item['sourcePath']}"])
                self.assertEqual(archive.read(item["path"]), committed)
        self.write("packaging/portal-mcp/README.md", "UNCOMMITTED MUST NOT LEAK")
        unchanged, _ = PACKAGER.build(self.repo, "HEAD", "portal-mcp")
        self.assertEqual(result, unchanged)

    def test_mcp_profile_rejects_nested_activation_and_component_references(self):
        original = json.loads((self.repo / "packaging/portal-mcp/plugin.json").read_text())
        for field in ["skills", "agents", "hooks", "onboardingSkill", "sessionStart", "skillInstructions"]:
            with self.subTest(field=field):
                value = json.loads(json.dumps(original))
                value["extensions"]["com.openai"][field] = "./skills/setup/SKILL.md"
                self.write("packaging/portal-mcp/plugin.json", json.dumps(value))
                self.commit()
                with self.assertRaisesRegex(ValueError, "Non-MCP activation|Non-MCP component|Hook declaration"):
                    PACKAGER.build(self.repo, "HEAD", "portal-mcp")
        value = json.loads(json.dumps(original))
        value["description"] = "Load skills/hidden/SKILL.md"
        self.write("packaging/portal-mcp/plugin.json", json.dumps(value))
        self.commit()
        with self.assertRaisesRegex(ValueError, "Non-MCP component reference"):
            PACKAGER.build(self.repo, "HEAD", "portal-mcp")
        self.write("packaging/portal-mcp/plugin.json", json.dumps(original))
        self.write("packaging/portal-mcp/README.md", "Read skills/setup/SKILL.md")
        self.commit()
        with self.assertRaisesRegex(ValueError, "Non-MCP component reference in README"):
            PACKAGER.build(self.repo, "HEAD", "portal-mcp")

    def test_mcp_profile_version_and_required_files_cannot_drift(self):
        profile = json.loads((self.repo / "packaging/portal-mcp/plugin.json").read_text())
        profile["version"] = "0.0.0"
        self.write("packaging/portal-mcp/plugin.json", json.dumps(profile))
        self.commit()
        with self.assertRaisesRegex(ValueError, "identity/version"):
            PACKAGER.build(self.repo, "HEAD", "portal-mcp")
        (self.repo / "assets/icon.png").unlink()
        self.commit()
        with self.assertRaisesRegex(ValueError, "source profile or referenced asset missing"):
            PACKAGER.build(self.repo, "HEAD", "portal-mcp")


if __name__ == "__main__":
    unittest.main(verbosity=2)
