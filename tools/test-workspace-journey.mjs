// Source instruction/contract expectations. No live tools, network or account actions.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const text = (name) => readFileSync(resolve(root, name), "utf8");
const contract = JSON.parse(text("schemas/workspace-mcp-journey.contract.json"));
const router = createRequire(import.meta.url)(resolve(root, "hooks/intent-router.cjs"));
const names = ["get_workspace_capabilities", "prepare_workspace_access", "get_my_today", "list_my_tasks", "create_my_task", "update_my_task", "delete_my_task", "get_my_reminder_settings", "update_my_reminder_settings"].map((name) => `psychology_${name}`);

function validate(value) {
  assert.equal(value.status, "SOURCE_CANDIDATE_NOT_LIVE_OR_RELEASE_ACCEPTANCE");
  assert.equal(value.base_package_version, "1.4.3");
  assert.equal(value.release_version_changed, true);
  assert.equal(value.candidate_package_version, "1.4.4");
  assert.equal(value.backend_deployment_verified, false);
  assert.equal(value.authenticated_host_discovery_verified, false);
  assert.deepEqual(Object.keys(value.tools).sort(), names.slice().sort());
  assert.equal(value.discovery.required, true);
  assert.equal(value.discovery.same_authenticated_integration, true);
  assert.equal(value.discovery.available_must_be_true, true);
  assert.equal(value.access.oauth_is_not_delegation, true);
  assert.equal(value.access.browser_life_grant_is_not_client_delegation, true);
  assert.equal(value.access.requires_exact_owner_client_connection, true);
  assert.equal(value.access.assistant_approval_forbidden, true);
  assert.equal(value.access.owner_approval_in_signed_in_account, true);
  assert.equal(value.task.explicit_current_action_required, true);
  assert.equal(value.task.selected_id_and_version_required_for_update_delete, true);
  assert.equal(value.task.never_infer_midnight_timezone_or_reminder, true);
  assert.equal(value.reminders.enable_requires_separate_signed_in_exact_settings_review, true);
  assert.equal(value.reminders.no_send_tool, true);
  assert.equal(value.review_status.never_approve_or_save_from_status_read, true);
  assert.equal(value.review_status.consumed_means_no_second_save, true);
  assert.equal(value.prepare_recovery.no_new_key_on_unknown, true);
  assert.equal(value.prepare_recovery.same_key_changed_payload_is_conflict, true);
  assert.deepEqual(value.review_status.exactly_one, ["review_id", "request_id"]);
  assert.deepEqual(value.review_status.states.slice().sort(), ["pending", "approved", "expired", "consumed", "stale", "rejected"].sort());
  for (const item of Object.values(value.tools)) {
    assert.ok(![...item.required, ...item.optional].some((key) => /^(owner_id|user_id|client_id|connection_id|__verified_)/.test(key)));
  }
  assert.deepEqual(Object.keys(value.locales).sort(), ["en", "zh-CN", "zh-TW"].sort());
  return true;
}

// This is a finite expected instruction trace, not a callable or mock backend.
function expectedTrace(state) {
  if (state.optOut) return ["session_only"];
  if (!state.explicitAction) return ["session_only"];
  if (state.unknownWrite) return ["read_original_result", "no_new_task_in_Today"];
  if (!state.sameNamespace || !state.available) return ["keep_draft", "Today"];
  if (!state.delegationApproved) return ["psychology_get_workspace_capabilities", "psychology_prepare_workspace_access", "signed_in_owner_review", "no_task_write"];
  if (state.reminderEnable) return ["psychology_update_my_reminder_settings", "signed_in_exact_settings_review", "not_delivery"];
  return ["psychology_get_my_today", "psychology_create_my_task", "authoritative_readback"];
}

test("source candidate uses exactly nine public psychology names and strict ownership controls", () => {
  assert.equal(validate(contract), true);
  assert.equal(contract.review_status.tool, "psychology_get_profile_write_review_status");
  assert.equal(contract.prepare_recovery.tool, "psychology_prepare_profile_write");
  assert.equal(readdirSync(resolve(root, "skills"), { withFileTypes: true }).filter((row) => row.isDirectory()).length, 16);
  assert.equal(JSON.parse(text("package.json")).version, "1.4.4");
});

for (const prompt of ["幫我加一筆待辦：整理研究提案。", "请提醒我周一交 API 文档。", "Remind me to submit the application tomorrow."]) {
  test(`natural trigger starts review journey, not approval: ${prompt}`, () => {
    assert.equal(router.classify(prompt), "personal");
    const event = router.routeEvent({ hook_event_name: "UserPromptSubmit", prompt });
    assert.match(event.hookSpecificOutput.additionalContext, /not consent/);
    assert.deepEqual(expectedTrace({ explicitAction: true, sameNamespace: true, available: true, delegationApproved: false }), ["psychology_get_workspace_capabilities", "psychology_prepare_workspace_access", "signed_in_owner_review", "no_task_write"]);
  });
}

test("personal intent alone stays session only even with OAuth and approved delegation", () => {
  assert.deepEqual(expectedTrace({ explicitAction: false, available: true, sameNamespace: true, delegationApproved: true }), ["session_only"]);
});
test("approved exact current action writes once, then reads back", () => {
  assert.deepEqual(expectedTrace({ explicitAction: true, available: true, sameNamespace: true, delegationApproved: true }), ["psychology_get_my_today", "psychology_create_my_task", "authoritative_readback"]);
});
test("same namespace and actual capability are required; package catalog alone falls back", () => {
  for (const state of [{ sameNamespace: false, available: true }, { sameNamespace: true, available: false }]) {
    assert.deepEqual(expectedTrace({ ...state, explicitAction: true }), ["keep_draft", "Today"]);
  }
});
test("unknown write does not create again in either host or Today", () => {
  assert.deepEqual(expectedTrace({ explicitAction: true, unknownWrite: true, sameNamespace: true, available: false }), ["read_original_result", "no_new_task_in_Today"]);
  assert.equal(contract.task.unknown_write, "read_and_reconcile_before_any_new_write");
  assert.match(contract.task.Today_after_unknown, /do_not_create/);
});
test("reminder enablement has separate owner review and no delivery claim", () => {
  assert.deepEqual(expectedTrace({ explicitAction: true, available: true, sameNamespace: true, delegationApproved: true, reminderEnable: true }), ["psychology_update_my_reminder_settings", "signed_in_exact_settings_review", "not_delivery"]);
});
test("profile readback is private and cannot approve, renew or resave", () => {
  assert.equal(contract.review_status.private_owner_client_connection_read, true);
  assert.equal(contract.review_status.consumed_means_no_second_save, true);
  assert.match(contract.prepare_recovery.save_payload, /server review_id only/);
  assert.match(contract.prepare_recovery.legacy_without_request_id, /no idempotent/);
  const guide = text("docs/workspace-mcp.md");
  for (const state of contract.review_status.states) assert.ok(guide.includes(`\`${state}\``));
  assert.match(guide, /No status call renews expiry or changes state/);
});
test("three-language short setup has matching fields and fallback URLs", () => {
  const keys = ["brand", "setup", "review", "fallback", "unknown"].sort();
  for (const [locale, copy] of Object.entries(contract.locales)) {
    assert.deepEqual(Object.keys(copy).sort(), keys);
    assert.ok(Object.values(copy).every((s) => typeof s === "string" && s.length > 5));
    assert.match(contract.Today[locale], /^https:\/\/noesis\.seges\.ai\/(?:en|zh-tw|zh-cn)\/today\/$/);
  }
});
test("instructions point to one contract and do not request provider credentials", () => {
  for (const name of ["skills/psychology/SKILL.md", "skills/memory-updates/SKILL.md", "skills/onboarding/SKILL.md", "skills/assessment-guide/SKILL.md"]) {
    const body = text(name);
    assert.ok(body.includes("workspace-mcp.md"));
    assert.doesNotMatch(body.slice(body.lastIndexOf("## Source candidate") >= 0 ? body.lastIndexOf("## Source candidate") : body.indexOf("## 3a.")), /paste (?:a )?(?:password|token|authorization code)/i);
  }
  const guide = text("docs/workspace-mcp.md");
  for (const name of names) assert.ok(guide.includes(`\`${name}\``));
});
test("weakened authorizations, off-namespace tools and unknown-save policies are rejected", async (t) => {
  const mutations = [
    (v) => { v.access.oauth_is_not_delegation = false; },
    (v) => { v.access.browser_life_grant_is_not_client_delegation = false; },
    (v) => { v.access.assistant_approval_forbidden = false; },
    (v) => { v.discovery.available_must_be_true = false; },
    (v) => { v.task.explicit_current_action_required = false; },
    (v) => { v.task.selected_id_and_version_required_for_update_delete = false; },
    (v) => { v.reminders.enable_requires_separate_signed_in_exact_settings_review = false; },
    (v) => { v.review_status.consumed_means_no_second_save = false; },
    (v) => { v.prepare_recovery.no_new_key_on_unknown = false; },
    (v) => { v.tools.create_my_task = v.tools.psychology_create_my_task; delete v.tools.psychology_create_my_task; },
    (v) => { v.tools.psychology_create_my_task.required.push("owner_id"); },
  ];
  for (let i = 0; i < mutations.length; i++) await t.test(`negative ${i + 1}`, () => {
    const altered = structuredClone(contract); mutations[i](altered); assert.throws(() => validate(altered));
  });
});
