// Offline release consistency only. No host, network, OAuth or account actions.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
const root=resolve(import.meta.dirname,'..');
const text=(name)=>readFileSync(resolve(root,name),'utf8');
const json=(name)=>JSON.parse(text(name));
const manifests=['package.json','plugin.json','.codex-plugin/plugin.json','.claude-plugin/plugin.json','.claude-plugin/marketplace.json','kimi.plugin.json','openclaw.plugin.json','packaging/portal-mcp/plugin.json','packaging/portal-workflows/plugin.json'];
const profiles=['plugin.json','packaging/portal-mcp/plugin.json','packaging/portal-workflows/plugin.json'];

test('Psychology display names and MCP server key agree across tracked JSON including hidden manifests',()=>{
 for(const name of profiles)assert.equal(json(name).extensions['com.openai'].interface.displayName,'Psychology',name);
 for(const name of ['.codex-plugin/plugin.json','kimi.plugin.json'])assert.equal(json(name).interface.displayName,'Psychology',name);
 assert.equal(json('openclaw.plugin.json').name,'Psychology');
 assert.deepEqual(json('.claude-plugin/marketplace.json').owner,{name:'Psychology'});
 for(const name of ['mcp.json','.mcp.json','.claude-plugin/plugin.json','kimi.plugin.json','openclaw.plugin.json']){
  const servers=json(name).mcpServers;assert.deepEqual(Object.keys(servers),['Psychology'],name);
  assert.equal(servers.Psychology.url,'https://noesis.seges.ai/mcp',name);
 }
 for(const name of ['package.json','plugin.json','.codex-plugin/plugin.json','.claude-plugin/plugin.json','kimi.plugin.json'])assert.equal(json(name).name,'psychology-plugin',name);
 assert.equal(json('packaging/portal-workflows/plugin.json').name,'psychology-plugin-workflows');
 const tracked=execFileSync('git',['ls-files','-z','--','*.json'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
 assert.ok(tracked.includes('.mcp.json')&&tracked.includes('.claude-plugin/plugin.json'));
 for(const name of tracked)assert.doesNotMatch(JSON.stringify(json(name)),/\bPsychology (?:Plugin|MCP)\b/,name);
});

test('all nine source and distribution versions agree on unreleased 1.4.4',()=>{
 for(const name of manifests){const value=json(name);assert.equal(name.endsWith('marketplace.json')?value.plugins[0].version:value.version,'1.4.4',name);}
 for(const name of profiles){const notes=json(name).extensions['com.openai'].publication.release_notes;assert.match(notes,/v1\.4\.4 candidate:/);assert.doesNotMatch(notes,/\b(?:published|approved) (?:release|listing|host)\b/i);}
 assert.match(text('README.md'),/Source package \*\*v1\.4\.4\*\*, unreleased candidate/);
 assert.match(text('CHANGELOG.md'),/current published package remains 1\.4\.3/);
});
test('source candidate separates artifact review, deployment and actual host discovery',()=>{
 const c=json('schemas/workspace-mcp-journey.contract.json');
 assert.equal(c.status,'SOURCE_CANDIDATE_NOT_LIVE_OR_RELEASE_ACCEPTANCE');
 assert.equal(c.candidate_package_version,'1.4.4');
 assert.equal(c.backend_deployment_verified,false);assert.equal(c.authenticated_host_discovery_verified,false);
 assert.deepEqual(c.catalog_target,{public_tools:46,new_workspace_tools:9,new_review_status_tools:1,prompts:18,instruments:16});
 assert.equal(Object.keys(c.tools).length,9);assert.equal(c.review_status.tool,'psychology_get_profile_write_review_status');
 assert.match(text('CHANGELOG.md'),/domain-MCP candidates are not included/);
});
test('new guide and journey contract are explicit workflow resources while MCP stays eight files',()=>{
 const p=text('tools/package-plugin.py');const start=p.indexOf('WORKFLOW_COMPONENTS = (');const end=p.indexOf('\n)',start);const closure=p.slice(start,end);
 for(const name of ['docs/workspace-mcp.md','schemas/workspace-mcp-journey.contract.json'])assert.ok(closure.includes("'"+name+"'"),name);
 const mcp=json('packaging/portal-mcp/plugin.json');const ai=mcp.extensions['com.openai'];
 assert.equal(mcp.name,'psychology-plugin');for(const field of ['skills','agents','hooks','onboardingSkill'])assert.equal(ai[field],undefined);
 assert.match(text('docs/package-variants.md'),/48 files/);
 assert.equal(readdirSync(resolve(root,'skills'),{withFileTypes:true}).filter(x=>x.isDirectory()).length,16);
});
test('ten added public tool names are exact and no caller identity is an input',()=>{
 const c=json('schemas/workspace-mcp-journey.contract.json');const guide=text('docs/workspace-mcp.md');
 const names=[...Object.keys(c.tools),c.review_status.tool];assert.equal(new Set(names).size,10);
 for(const name of names){assert.match(name,/^psychology_/);assert.ok(guide.includes('`'+name+'`'));}
 for(const value of Object.values(c.tools))assert.ok(![...value.required,...value.optional].some(k=>/^(owner_id|user_id|client_id|connection_id|__verified_)/.test(k)));
 assert.deepEqual(c.review_status.exactly_one,['review_id','request_id']);
 assert.equal(c.prepare_recovery.no_new_key_on_unknown,true);assert.equal(c.access.assistant_approval_forbidden,true);
});
test('all three localized paths retain explicit review and one-task unknown-result fallback',()=>{
 const c=json('schemas/workspace-mcp-journey.contract.json');
 assert.deepEqual(Object.keys(c.locales).sort(),['en','zh-CN','zh-TW'].sort());
 for(const [locale,copy] of Object.entries(c.locales)){assert.ok(copy.review.length>5&&copy.unknown.length>5);assert.match(c.Today[locale],/^https:\/\/noesis\.seges\.ai\/(?:en|zh-tw|zh-cn)\/today\/$/);}
 assert.equal(c.reminders.enable_requires_separate_signed_in_exact_settings_review,true);
 assert.equal(c.task.start_and_deadline_independently_optional,true);
 assert.equal(c.task.unknown_write,'read_and_reconcile_before_any_new_write');
 for(const name of ['README.md','docs/workspace-mcp.md','CHANGELOG.md'])assert.ok(!text(name).includes('\u2014'),name);
});
