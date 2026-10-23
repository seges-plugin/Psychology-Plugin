# Connected objects and domain tools

**Version 1.5.0 source candidate.** The current server has 46 public tools. This candidate describes the next 66-tool contract only; it is not deployed or host-accepted. Keep the existing Life/profile journey unchanged. Discover matching names and schemas in the same authenticated connection before use.

## 繁體中文

想記下偏好、整理聯絡人或修改一項待辦時，先確認要處理的對象與欄位。能用的工具依當前連線顯示；沒提供就保留草稿，不假裝已讀取或儲存。

Life 待辦、關係、財務、學習、成果及各類個人物件各有獨立用途。只在需要時到 Account 核准該連線及本次內容，不因登入或已有 Life 權限而替你開啟其他用途。文化、宗教與健康自述只接受你明確提供的內容及另外確認，不從談話推定。

準備變更只建立待審內容。由你在登入後的 Account 檢查、核准或拒絕；AI 不代按核准。結果不明先用原操作識別查回，不換 key 重複新增。私人聯絡人的敘述不是雙方帳號關係；本流程不把私人資料傳到 Kairos，也不寄信或連接銀行。

## 简体中文

想记录偏好、整理联系人或修改一项待办时，先确认对象和字段。只用当前连接实际提供的工具；不可用就保留草稿。Life、关系、财务、学习、成果和各类个人对象分别授权。文化、宗教与健康自述仅来自你明确提供并另外确认的内容。

准备变更是待审核，不是已保存。请在登录后的 Account 检查、批准或拒绝，AI 不代为批准。结果不明确时先查询原操作，不换 key 重复新增；不自动分享私人图谱、寄信或操作银行。

## English

Choose the exact object and fields, then use only tools actually exposed by this connection. If unavailable, keep a draft. Life, each domain and each typed-object purpose need their own current authorization; signing in does not grant them.

A prepared change waits for your review in signed-in Account. The assistant cannot approve it for you. Reconcile an unknown result with the same operation identity before trying another write. Culture, religion and health self-reports need your explicit statements and separate confirmation. Private contact assertions do not create mutual account links, send messages, operate banks or share a private graph with Kairos.

## Exact supported surface

The machine-readable [contract](../schemas/connected-object-journey.contract.json) contains all 20 exact public names and source-derived schemas. The schema is a candidate reference, not permission to call unavailable tools.

| Tools | Use |
|---|---|
| `psychology_get_domain_workspace_capabilities` | domain availability |
| `psychology_get_my_domain_operation_status` | exact operation status |
| `psychology_get_my_finance_records` | private domain read:finance |
| `psychology_get_my_learning_records` | private domain read:learning |
| `psychology_get_my_outcome_records` | private domain read:outcomes |
| `psychology_get_my_relationship_records` | private domain read:relationships |
| `psychology_get_my_task_object` | exact existing life task read |
| `psychology_get_my_typed_object` | private typed read |
| `psychology_get_my_typed_object_change_status` | exact typed review status |
| `psychology_get_my_typed_object_edge` | private edge read |
| `psychology_get_my_typed_object_history` | bounded typed history |
| `psychology_patch_my_task_object` | explicit existing life task patch |
| `psychology_prepare_domain_workspace_access` | pending domain delegation |
| `psychology_prepare_my_finance_operation` | pending domain operation:finance |
| `psychology_prepare_my_learning_operation` | pending domain operation:learning |
| `psychology_prepare_my_local_render_operation` | pending domain operation:orchestrator |
| `psychology_prepare_my_outcome_operation` | pending domain operation:outcomes |
| `psychology_prepare_my_relationship_operation` | pending domain operation:relationships |
| `psychology_prepare_my_typed_object_change` | pending typed change |
| `psychology_prepare_my_typed_object_edge` | pending private edge change |

## Objects and review boundaries

The eight new stored kinds are `Culture`, `Expertise`, `HealthSelfReport`, `Interest`, `Motivation`, `Preference`, `Religion`, `TimeBlock`. Their exact-purpose approvals do not enable general profile, Contact, Task, Goal, Project or Journal CRUD. Those legacy objects retain their existing services and permissions. Only private `related_to` edges are exposed here; no mutual-user connection or automatic account matching is available.

`psychology_get_my_task_object` reads one original Life Task. `psychology_patch_my_task_object` supplies only the fields the user wants to change, the current `expected_version`, the original delegation and a stable operation key. Omission means unchanged; do not copy unknown fields into a full update or invent a start, midnight or timezone. The original create/update/delete tools remain available if actually exposed.

For domain tools, first discover capabilities, then prepare the exact-domain access review. After the owner approves, read bounded records or prepare one typed operation. `psychology_get_my_domain_operation_status` reconciles an exact operation ID or the exact delegation/request key; it does not approve or renew it. Finance is local records only, and local render is local output only.

Typed changes and edges require existing exact authorities. These tools do not issue a grant or approval. Read only the selected object/history/edge with the applicable authorities, and use `psychology_get_my_typed_object_change_status` for that pending review. In Account, the owner can inspect purpose/authority state, review, reject or revoke; those signed-in controls are not additional public MCP approval tools.

Keep known, unknown and cleared field states distinct. Preserve source provenance, valid-time precision and observed time; a date is not an invented instant. Corrections reference the original version, and tombstones are not a promise of whole-account erasure. Central account export/deletion remains in Account, including when processing features are off.

## Release checks before publication

Root must accept the new immutable build and its source/supply/runtime evidence, explicit schema, genuine business PG checks, feature activation and final authenticated discovery. Confirm 51 native / 66 public tools, 18 prompts and 16 instrument IDs from that same deployment. Source tests or a catalog fixture cannot satisfy these checks. Confirm owner-review UI journeys and package/host behavior separately; no Portal or installed-host acceptance is implied.
