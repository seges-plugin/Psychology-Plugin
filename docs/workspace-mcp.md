# Life tasks, reminders and review recovery

**Version 1.4.4 source candidate.** The published 1.4.3 baseline does not include this new journey. The newer backend image has passed artifact review; deployment, enabled features and authenticated host discovery are still separate.
Use this path only after accepted backend deployment and actual authenticated discovery expose the same
`psychology_` names and matching schemas. Otherwise keep the existing Today handoff. A catalog or package
update is not live acceptance. The machine-readable companion is
[`workspace-mcp-journey.contract.json`](../schemas/workspace-mcp-journey.contract.json).

## 繁體中文

**把想清楚的事，接著做。**

1. 先連接Psychology；若Life工具可用，到Account核准這個AI連線管理待辦與提醒。
2. 直接說「幫我新增待辦」或選定一項改期、完成、刪除。標題即可開始；開始與截止都可留空。
3. 要開啟提醒時，在Noesis另行確認這次的模式、時間與時區。沒有寄送收據，不說信已寄出。
4. 結果不明先查回原操作，不在AI與Today兩邊各新增一次。工具缺少或拒絕時保留草稿，
   [到Today處理](https://noesis.seges.ai/zh-tw/today/)。

## 简体中文

**把想清楚的事，接着做。**

1. 先连接Psychology；若Life工具可用，到Account批准这个AI连接管理待办与提醒。
2. 直接说「帮我新增待办」或选定一项改期、完成、删除。标题即可开始；开始与截止都可留空。
3. 开启提醒时，在Noesis另行确认这次的模式、时间与时区。没有发送回执，不说邮件已发送。
4. 结果不明确先查询原操作，不在AI和Today各新增一次。工具缺少或拒绝时保留草稿，
   [到Today处理](https://noesis.seges.ai/zh-cn/today/)。

## English

**Think it through. Then take the next step.**

1. Connect Psychology. When compatible Life tools are available, approve this AI connection in Account.
2. Ask to add a task, or choose one task to reschedule, complete or delete. Start and deadline are optional.
3. Confirm enabled reminder modes, times and timezone separately in Noesis. Settings are not a delivery receipt.
4. Check an unknown result before creating anything else. If tools are unavailable or refuse, keep the draft
   and [continue in Today](https://noesis.seges.ai/en/today/).

## Exact connected workflow

- Discover `psychology_get_workspace_capabilities`; require `available:true` and matching input schemas.
- `psychology_prepare_workspace_access` creates a pending review, never approval. Preserve its idempotency
  key and explicit aware expiry within 30 days. The owner confirms this exact client/connection in signed-in
  Account using the existing Life grant. OAuth and browser Life consent alone are insufficient.
- Use `psychology_get_my_today` or `psychology_list_my_tasks` only with the exact approved delegation.
  For `psychology_create_my_task`, set `current_request_confirmed:true` only from an explicit current request.
  Updates use `psychology_update_my_task` with the selected task ID, current expected version and complete
  new fields. Deletion uses `psychology_delete_my_task`; expired processing does not erase separate
  client/object deletion authority, and the server still validates it.
- `psychology_get_my_reminder_settings` reads preferences. `psychology_update_my_reminder_settings`
  requests separate signed-in review for enabled settings; it never sends a message. Do not infer email
  eligibility from a task request, OAuth or a task deadline.
- Keep date-only precision distinct from RFC3339 instants. Do not invent midnight, 09:00, a timezone,
  event time or an extra reminder. These Life tools do not authorize finance, Learning or assessments.

## Recover one review without another write

If `psychology_get_profile_write_review_status` is actually exposed, read the exact review using `kind`
and exactly one of `review_id` or `request_id` in the same authenticated integration. It is a private,
owner/client/connection-bound status read. `pending` waits for the human;`approved` permits only the
separately authorized receipt-only save;`consumed` means no second save;`expired`,`stale`,`rejected`
stop the write. Unknown or refused results are not approval. No status call renews expiry or changes state.

For a supported `psychology_prepare_profile_write` schema, choose and retain a fresh UUID4 `request_id`
before the first permitted preparation. A lost response uses a read by that same ID and kind, or a supported
idempotent replay with that same ID and identical normalized draft after fresh authorization checks.
Never change the key or payload to escape a conflict. Legacy calls without `request_id` do not gain
unknown-ID recovery. Preparation still stores a temporary draft only after explicit permission; saving
still uses only the server-issued `review_id` after owner approval and the user's final-save instruction.

For an unknown task write, reconcile using bounded task readback and the same operation key if supported.
Do not copy the draft into Today as a second task while the first result is unresolved. Never query another
owner, connection or namespace. These are source journey expectations, not host or live-API test results.

## Inputs for the connected tools

Use the fields returned by the same authenticated host. Do not supply an owner, client or connection identity. Optional fields may be omitted; preserve date precision and current versions.

| Tool | Required inputs | Optional inputs |
|---|---|---|
| `psychology_get_workspace_capabilities` | None | None |
| `psychology_prepare_workspace_access` | `idempotency_key`, `expires_at` | None |
| `psychology_get_my_today` | `delegation_id` | `limit` |
| `psychology_list_my_tasks` | `delegation_id` | `limit` |
| `psychology_create_my_task` | `delegation_id`, `title`, `idempotency_key`, `current_request_confirmed` | `status`, `planned_start_date`, `planned_start_at`, `due_date`, `due_at`, `task_timezone` |
| `psychology_update_my_task` | `delegation_id`, `title`, `idempotency_key`, `current_request_confirmed`, `task_id`, `expected_version` | `status`, `planned_start_date`, `planned_start_at`, `due_date`, `due_at`, `task_timezone` |
| `psychology_delete_my_task` | `delegation_id`, `task_id`, `expected_version`, `idempotency_key` | None |
| `psychology_get_my_reminder_settings` | `delegation_id` | None |
| `psychology_update_my_reminder_settings` | `delegation_id`, `idempotency_key`, `settings` | None |
| `psychology_get_profile_write_review_status` | `kind`; exactly one of `review_id` or `request_id` | None |

For reminder `settings`, provide `daily_enabled`, `due_enabled` and `expected_version`; enabling a mode also needs the explicitly chosen IANA `timezone`, and daily reminders need `daily_time` in `HH:mm`. `locale` is optional. Never add a recipient, sender or URL. A pending settings review is not an enabled reminder.

The existing `psychology_prepare_profile_write` may accept optional UUID4 `request_id` only if its actual input schema exposes it. Keep all other required fields from that schema unchanged; this candidate adds no alternate save payload.

## Future object and domain extension

The next source-only extension adds separately authorized domain and typed-object journeys, plus exact Task read/partial patch. See [connected objects](connected-objects.md). It does not change the Life or profile-review protocol above, and its future 66-tool catalog is not the current 46-tool server.
