"""Isolated workflow-profile package checks. No account, upload or real ZIP output."""
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
import zipfile

import yaml

ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location('workflow_packager',ROOT/'tools/package-plugin.py')
P=importlib.util.module_from_spec(SPEC);SPEC.loader.exec_module(P)

class WorkflowProfile(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='psychology-workflows-fixture-')
        self.repo=Path(self.temp.name).resolve()
        self.git('init','-q');self.git('config','core.hooksPath',str(self.repo/'NO-HOOKS'))
        paths=set(P.MCP_ONLY_SOURCES.values())|set(P.WORKFLOW_SOURCES.values())|{'plugin.json','hooks/hooks.json','hooks/intent-router.cjs','agents/safety-monitor.md','.codex-plugin/plugin.json','.claude-plugin/plugin.json','kimi.plugin.json','openclaw.plugin.json','.app.json'}
        for path in sorted(paths):
            source=ROOT/path
            if source.is_file():self.write(path,source.read_bytes())
            elif path=='.app.json':self.write(path,b'{"apps":{"private":"binding-must-not-ship"}}')
            else:self.write(path,b'TEST excluded fixture')
        self.commit()
    def tearDown(self):self.temp.cleanup()
    def git(self,*args):return subprocess.check_output(['git','-C',str(self.repo),*args],stderr=subprocess.PIPE)
    def write(self,path,value):
        target=self.repo/path;target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(value if isinstance(value,bytes) else value.encode())
    def commit(self):
        self.git('add','--all') # Disposable synthetic fixture only.
        self.git('-c','user.name=Psychology Plugin','-c','user.email=noreply@users.noreply.github.com','commit','-qm','synthetic profile fixture')
    def profile(self):return json.loads((self.repo/'packaging/portal-workflows/plugin.json').read_bytes())
    def rewrite_profile(self,value):self.write('packaging/portal-workflows/plugin.json',json.dumps(value));self.commit()
    def build(self):return P.build(self.repo,'HEAD','portal-workflows')
    def test_distinct_profile_identity_same_display_version_and_review_scope(self):
        value=self.profile();canonical=json.loads((ROOT/'plugin.json').read_bytes());mcp=json.loads((ROOT/'packaging/portal-mcp/plugin.json').read_bytes())
        self.assertEqual(value['name'],'psychology-plugin-workflows');self.assertNotEqual(value['name'],mcp['name'])
        self.assertEqual(value['version'],canonical['version']);ai=value['extensions']['com.openai'];ui=ai['interface']
        self.assertEqual(ui['displayName'],'Psychology');self.assertLessEqual(len(ui['shortDescription']),30)
        self.assertEqual(len(set(ui['defaultPrompt'])),3);self.assertTrue(all(0<len(p)<=128 for p in ui['defaultPrompt']))
        self.assertEqual(ai['review'],canonical['extensions']['com.openai']['review'])
        self.assertEqual(ui['capabilities'],canonical['extensions']['com.openai']['interface']['capabilities'])
        for text in ('not diagnosis or treatment','unverified leads','explicit source choice','does not guarantee'):self.assertIn(text,ui['longDescription'])
    def test_exact_48_members_16_skills_three_skill_metadata_files_and_all_references(self):
        raw,receipt=self.build();self.assertEqual(len(receipt['files']),50);self.assertEqual(receipt['skillCount'],16);self.assertFalse(receipt['hooksIncluded'])
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            self.assertEqual(set(z.namelist()),set(P.WORKFLOW_SOURCES))
            metadata=[name for name in z.namelist() if name.endswith('/agents/openai.yaml')];self.assertEqual(len(metadata),3)
            for name in metadata:
                v=yaml.safe_load(z.read(name));self.assertIs(v['policy']['allow_implicit_invocation'],True);self.assertTrue(v['interface']['display_name']);self.assertTrue(v['interface']['short_description'])
            for name in P.WORKFLOW_COMPONENTS:self.assertEqual(z.read(name),self.git('show','HEAD:'+name))
            self.assertIn('schemas/memory-update.schema.json',z.namelist());self.assertIn('docs/activation-and-memory.md',z.namelist())
    def test_no_root_agents_hooks_apps_or_alternate_manifests_are_discovered(self):
        raw,_=self.build()
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            self.assertFalse(any(name.startswith(('agents/','hooks/','.codex-plugin/','.claude-plugin/')) for name in z.namelist()))
            self.assertTrue({'.app.json','kimi.plugin.json','openclaw.plugin.json'}.isdisjoint(z.namelist()))
            value=json.loads(z.read('plugin.json'));self.assertEqual(value['extensions']['com.openai']['onboardingSkill'],'./skills/onboarding/SKILL.md')
    def test_mcp_endpoint_auth_key_and_bytes_preserved_in_both_profiles(self):
        workflows,_=self.build();minimal,receipt=P.build(self.repo,'HEAD','portal-mcp')
        self.assertEqual(receipt['skillCount'],0)
        with zipfile.ZipFile(io.BytesIO(workflows)) as a,zipfile.ZipFile(io.BytesIO(minimal)) as b:
            self.assertEqual(len(b.namelist()),8)
            for name in ('mcp.json','.mcp.json'):self.assertEqual(a.read(name),b.read(name));self.assertEqual(a.read(name),subprocess.check_output(['git','-C',str(ROOT),'show','HEAD:'+name]))
            server=json.loads(a.read('mcp.json'))['mcpServers'];self.assertEqual(set(server),{'Psychology'})
            self.assertEqual(server['Psychology']['url'],'https://noesis.seges.ai/mcp');self.assertEqual(server['Psychology']['extensions']['com.openai']['auth'],{'type':'oauth','client':{'mode':'dcr'}})
    def test_receipt_maps_exact_committed_source_without_hidden_identity_rewrite(self):
        raw,receipt=self.build();again,_=self.build();self.assertEqual(raw,again)
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            for entry in receipt['files']:
                self.assertEqual(entry['sourcePath'],P.WORKFLOW_SOURCES[entry['path']]);self.assertEqual(z.read(entry['path']),self.git('show','HEAD:'+entry['sourcePath']))
            self.assertEqual(json.loads(z.read('plugin.json'))['name'],'psychology-plugin-workflows')
        self.write('packaging/portal-workflows/plugin.json','UNCOMMITTED MUST NOT LEAK');unchanged,_=self.build();self.assertEqual(raw,unchanged)
    def test_mcp_former_key_and_aliases_are_refused_in_both_public_profiles(self):
        original=json.loads((self.repo/'mcp.json').read_bytes())
        connection=original['mcpServers']['Psychology']
        for keys in (('psychology_mcp',),('Psychology MCP',),('Psychology','psychology_mcp')):
            value=json.loads(json.dumps(original));value['mcpServers']={key:connection for key in keys}
            self.write('mcp.json',json.dumps(value));self.commit()
            for variant in ('portal-mcp','portal-workflows'):
                with self.subTest(keys=keys,variant=variant),self.assertRaisesRegex(ValueError,'MCP server naming'):
                    P.build(self.repo,'HEAD',variant)
    def test_profile_identity_version_and_onboarding_drift_refused(self):
        original=self.profile()
        for field in ('name','version','display','former-plugin-display','former-mcp-display','onboarding'):
            v=json.loads(json.dumps(original))
            if field=='name':v['name']='psychology-plugin'
            if field=='version':v['version']='9.9.9'
            if field=='display':v['extensions']['com.openai']['interface']['displayName']='unreviewed'
            if field=='former-plugin-display':v['extensions']['com.openai']['interface']['displayName']='Psychology Plugin'
            if field=='former-mcp-display':v['extensions']['com.openai']['interface']['displayName']='Psychology MCP'
            if field=='onboarding':v['extensions']['com.openai']['onboardingSkill']='./agents/unsafe.md'
            self.rewrite_profile(v)
            with self.subTest(field=field),self.assertRaisesRegex(ValueError,'identity|display name|onboarding'):self.build()
    def test_missing_supporting_reference_schema_or_metadata_fails_closed(self):
        for name in ('skills/psychology/agents/openai.yaml','skills/interpretation/references/asrs-interpretation.md','schemas/memory-update.schema.json','docs/activation-and-memory.md','docs/workspace-mcp.md','schemas/workspace-mcp-journey.contract.json','docs/connected-objects.md','schemas/connected-object-journey.contract.json'):
            original=(self.repo/name).read_bytes();(self.repo/name).unlink();self.commit()
            with self.subTest(name=name),self.assertRaisesRegex(ValueError,'closure changed|required supporting file missing'):self.build()
            self.write(name,original);self.commit()
    def test_unreviewed_new_skill_resource_cannot_be_silently_omitted(self):
        self.write('skills/memory-updates/references/unreviewed.md','TEST unreviewed');self.commit()
        with self.assertRaisesRegex(ValueError,'closure changed'):self.build()
    def test_app_hooks_and_attribution_fail_instead_of_silent_stripping(self):
        original=self.profile()
        for field in ('apps','hooks','agents','nested-hooks','author','developerName'):
            v=json.loads(json.dumps(original))
            if field in ('apps','hooks','agents'):v['extensions']['com.openai'][field]='./forbidden.json'
            elif field=='nested-hooks':v['extensions']['com.openai']['nested']={'hooks':'./forbidden.json'}
            elif field=='author':v[field]={'name':'TEST attribution'}
            else:v['extensions']['com.openai']['interface'][field]='TEST attribution'
            self.rewrite_profile(v)
            with self.subTest(field=field),self.assertRaisesRegex(ValueError,'app binding|hook declaration|Hook declaration|Attribution metadata'):self.build()
    def test_bundled_skill_links_and_ui_metadata_resolve(self):
        # Explicit ../ and ../../ references must stay inside the allowlisted package.
        import posixpath,re
        names=set(P.WORKFLOW_SOURCES)
        for name in P.WORKFLOW_COMPONENTS:
            if not name.endswith('.md'):continue
            text=(ROOT/name).read_text(encoding='utf-8')
            for reference in re.findall(r'`((?:\.\./)+[^`\s]+)`',text):
                target=posixpath.normpath(posixpath.join(posixpath.dirname(name),reference))
                self.assertIn(target,names,(name,reference,target))
        for name in names:
            if name.endswith('/agents/openai.yaml'):
                value=yaml.safe_load((ROOT/name).read_text());self.assertFalse({'author','authors','publisher','developerName'} & set(value))

class Documentation(unittest.TestCase):
    def test_four_variants_and_separate_identities_are_documented_without_import_claims(self):
        readme=(ROOT/'README.md').read_text(encoding='utf-8')
        self.assertIn('docs/setup-and-contract.md',readme)
        advanced=ROOT/'docs/setup-and-contract.md'
        self.assertTrue(advanced.is_file())
        contract=readme+'\n'+advanced.read_text(encoding='utf-8')
        variants=(ROOT/'docs/package-variants.md').read_text(encoding='utf-8')
        for name in ('portal-mcp','portal-workflows','portal','runtime'):
            self.assertIn('| `'+name+'` |',variants)
        for text in ('psychology-plugin-workflows','Psychology'):
            self.assertIn(text,contract);self.assertIn(text,variants)
        self.assertIn('packaging/portal-workflows/README.md',readme)
        self.assertIn('do not upload it over the existing MCP-only draft',contract)
        self.assertIn('does not establish import acceptance',variants)
        self.assertIn('does not resolve existing',variants)
        self.assertIn('separate full-workflows application source proposal',variants)


if __name__=='__main__':unittest.main(verbosity=2)
