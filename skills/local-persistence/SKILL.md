---
name: local-persistence
description: This skill should be used when a user in a local coding-agent session (Claude Code or an equivalent local session with real filesystem tool access) wants to save a completed assessment result so they can pick it back up in a future session, or wants to load a previously saved result back in. It documents a client-side-only convention -- writing a JSON file via the assistant's own Write/Read/Edit tools to a path the user controls -- because noesis_mcp has no shared, per-caller-isolated server-side storage of any kind (see "Why this is local-only" below). Activate when the user says phrases like "save my results", "can I save this for later", "save this so I don't lose it", "load my previous results", "where are my old scores", "remember this for next time", or "pick up where I left off" -- and also proactively, right after any score_* tool call completes in a local session (offer it; don't wait to be asked, and never save without the user agreeing).
triggers:
  - "save my results"
  - "save this for later"
  - "save this so I don't lose it"
  - "load my previous results"
  - "my old scores"
  - "remember this for next time"
  - "pick up where I left off"
  - "come back to this later"
---

# Local Persistence

> **Added 2026-07-26.** Closes a real gap: a returning user in a local coding-agent session (Claude Code
> or an equivalent) had no way
> to carry a *completed* `score_*` result into a future session without re-pasting everything (this is
> distinct from assessment-guide's existing "No resume tool" limit, which is about a battery
> interrupted *mid-administration* -- that gap is still real and this skill does not close it; see
> Honest Limits below). The original scoping for this gap proposed a new shared, sqlite-backed MCP
> tool. That would have been a real vulnerability if built -- see "Why this is local-only, not a new
> tool" below -- so this skill documents a client-side workflow convention instead. **No new
> `@mcp.tool()` was added to `server.py`, and no shared datastore of any kind was created.**

## What this is

A convention for a local coding-agent session (Claude Code, or an equivalent local session) -- i.e. the
assistant running with real `Write`/`Read`/`Edit` tool access to the user's own filesystem (see the
scoping note below) -- not a new MCP tool. When a
`score_*` tool call completes, offer to save the result to a JSON file at a path the user names, or in
an existing project's own data directory. If the user agrees, write it with `Write`. To add another
result later, `Read` the existing file first and then `Edit`/rewrite it. To resume in a future session,
`Read` the file back and treat its contents as already-known context -- no tool call needs to be
re-run, and the user doesn't need to re-paste anything.

This is opt-in and user-controlled, every time:
- **Always offer, never save silently.** A completed score is meaningful personal information; writing
  it to disk without asking is not this skill's call to make.
- **Ask the user to confirm (or name) the file path.** Don't silently default to a path they didn't
  pick, and don't touch any file the user hasn't specified or approved.
- **The file belongs to the user, not to Noesis.** There is no copy anywhere else and no way to read it
  back except by the user opening a future session in the same place and asking the assistant to load it.

## Scoping note: when this applies

This convention is for the assistant running **as a coding agent with local filesystem tools** -- Claude
Code, or an equivalent local session with real `Write`/`Read`/`Edit` access -- which is exactly the situation
this `noesis-system` plugin is built for. It does **not** apply, and has no mechanism to apply, when a
caller reaches `noesis_mcp`'s tools purely over the network -- e.g. through the public MCP endpoint at
`service-system`'s `/mcp/public/noesis/*` (see below). A bare MCP client hitting that HTTP endpoint has
no filesystem of its own to write to in the first place; this skill's guidance is simply inapplicable
there, not disabled or gated -- there was never anything to gate.

## Why this is local-only, not a new tool

The original ask behind this gap was framed as a new shared MCP tool -- something like
`save_to_context_store` / `get_from_context_store`, backed by a sqlite file living alongside
`noesis_mcp`'s other modules. **That would have been a real vulnerability, not just an architecture
preference**, for one specific, verifiable reason:

`noesis_mcp/server.py` is not only run locally -- the exact same `server.py` is also copied into
`service-system` (the shared, multi-tenant fleet) and exposed at a public, unauthenticated HTTP
endpoint (`service_system/webhooks/mcp_noesis_public_router.py`, mounted at
`/mcp/public/noesis/{sse,messages,mcp}`). That router's own module docstring states the trade-off
explicitly: every tool on this server is public specifically *because* today's tools are "pure,
stateless, deterministic computation -- no external API calls (no cost), no side effects, no
server-side data persistence." Confirmed by reading the router directly: as of 2026-07-30 it maintains a narrow, explicit,
deliberately-named `_PUBLIC_EXCLUDED_TOOLS` set that keeps a small number of sensitive tools out of the
public surface entirely -- `_noesis_tools_list()` filters those names out of its result, and
`_call_noesis_tool()` short-circuits with a clean in-band error before the proxy is ever touched for
them. This is a real, deliberate access-control decision, not the "no allowlist at all" absolute this
section used to describe -- but the core risk below is unchanged: everything NOT on that exclusion list
-- literally every other tool registered on the live FastMCP server instance, present today or added
tomorrow -- is returned by `_noesis_tools_list()` and dispatched by `_call_noesis_tool()` with no auth
check, no caller identity, and no per-caller isolation of any kind. A brand-new tool defaults to fully
public the instant it's added to `server.py`; it would need to be deliberately, individually added to
`_PUBLIC_EXCLUDED_TOOLS` to NOT be public, and nothing enforces that happening automatically. Only
`find_counselors` gets any extra *runtime* gating (a per-IP rate limit + result cache), which exists to
bound *Google Places API spend* -- a cost control, not an access control. The other 25 tools reachable
through this endpoint are deliberately, explicitly left completely unlimited. (Corrected 2026-08-07 from
23 -- the public surface grew from 24 to 26 tools on 2026-08-01 [`get_verify_product_recommendations` and
`check_cognitive_wellness_referral`, not folded into this count until now], so 26 minus `find_counselors`
is 25.)

> **Precise scope of "no server-side data persistence," added 2026-08-07 to resolve an apparent
> conflict with `assessment-guide/SKILL.md`'s provenance-collection language:** that phrase describes
> the `score_*` tools' own computation, not a claim that the `provenance` data those tools accept goes
> nowhere useful. Confirmed directly in `server.py`'s `_attach_provenance()` docstring: passing
> `provenance` to a `score_*` call is "pure pass-through: no storage, no effect on scoring, no shape
> ever rejected, nothing silently dropped" -- the call itself never writes to a database or has any
> side effect; it echoes `provenance` back in that one call's response and does nothing further.
> `assessment-guide/SKILL.md`'s Step 3, describing a populated `provenance` field as "the raw material
> for a real dataset the product can use to understand and improve its own assessments over time," is
> also true and describes a separate, later step: that data only becomes a retained, analyzable dataset once the
> scored result (provenance included) is itself persisted somewhere -- by the calling agent's choice,
> via this skill's own local-file convention, or via the native, consent-gated `save_assessment_result`
> account-storage tool (see `assessment-guide/SKILL.md`'s "Returning-User Continuity and Persistence
> Tools" section). Stateless computation and optionally-persisted-elsewhere metadata are not in
> tension: the `score_*` call is exactly as stateless as this section says, and the value of
> populating `provenance` carefully on every call comes entirely from what happens to that response
> *after* it returns -- never from the tool itself storing anything.

> **Accuracy note, 2026-08-04:** the endpoint described above is no longer unauthenticated. Since
> 2026-08-01 every call carries a Noesis personal access token (see `README.md`'s Authentication
> section), so "unauthenticated" in this section is a dated description of how things stood when the
> reasoning was written. The recommendation is unchanged and this skill still applies as written: the
> argument that mattered is *per-caller isolation on MCP tools*, and a token at the edge is not the
> same thing as an authorization check inside each tool. Do not read the token requirement as a reason
> to add a shared server-side storage tool.

> **Corrected 2026-08-06: that caution was specifically about a naive, unauthorized shared tool — and
> 11 real, authorized ones now exist.** `get_consent_status`, `save_assessment_result`,
> `list_my_assessments`, `save_my_profile`, `get_my_profile`, and six `journal_*` tools (see
> `skills/assessment-guide/SKILL.md`'s own section on them, and `README.md`'s "Account, Consent, and
> Journal Tools") were added to the connector the same day this note was written. Every one of them is
> described, in how it behaves, as scoped to "the caller's own" data — consistent with deriving caller
> identity from the validated personal access token inside each tool, exactly the per-caller
> authorization this section said a shared storage tool would need and didn't have. **This file has not
> independently verified that server-side implementation** — `service_system/webhooks/
> mcp_noesis_public_router.py` and whatever backs these 11 tools live in the `service-system` repo,
> outside what this repo can inspect — so treat "these 11 appear to do per-caller isolation correctly"
> as a reasonable read of their documented behavior, not a security audit this file has performed. What
> this does change with confidence: the flat claim two paragraphs below, that no real cross-session
> account-storage option exists, is no longer true — see the correction to Honest Limits at the bottom
> of this file. What it does NOT change: the general architectural point above (a naive, non-isolated
> shared tool added without this kind of authorization would still be exactly the vulnerability
> described) remains correct reasoning, now with a real counter-example of how to do it safely instead.
>
> **Same-day correction:** the batch above shipped with a 12th tool, `grant_consent`, pulled a few
> hours later on an explicit founder/legal decision -- every consent grant must be traceable to a real
> website session, not an MCP tool call with a much thinner audit trail. `get_consent_status` (read-only)
> is unaffected. The count and tool list above are corrected to 11; consent is now granted only at
> https://noesis.seges.ai (see `skills/assessment-guide/SKILL.md`'s own section on these tools).

Concretely: adding **any** new `@mcp.tool()` to `server.py` -- including a storage tool meant only for
one user's own local persistence -- makes it automatically reachable through that same public
endpoint, with zero additional code change required on the router's side. A shared
`save_to_context_store(key, value)` / `get_from_context_store(key)` pair would let any internet caller
read or overwrite *any other caller's* stored data (an IDOR-shaped vulnerability: no `user_id`
verification exists anywhere on that endpoint, and even a caller-supplied `user_id` field would be
exactly that -- caller-supplied, not authenticated, and trivially guessable/overridable by anyone
else). It would also quietly break the router's own stated justification for having no auth at all,
since "no server-side data persistence" is the load-bearing claim in that docstring.

None of this means the underlying gap is fake -- returning users losing completed results is a real
usability problem. It means the fix has to live somewhere the public endpoint can't reach: the calling
agent's own local filesystem, which is exactly what this skill uses instead.

## How to use it

**Immediately after any `score_*` tool call completes, in a local session:**

1. Offer, don't assume: *"Want me to save this result to a file so you can pick it back up later? I
   can write it as JSON -- just tell me a path, or I can suggest one in this project."*
2. If the user agrees, confirm a path. A reasonable default to suggest (never applied without
   confirmation): a `noesis-results/` folder relative to the current project, either one file per
   session or one growing file holding a list of records -- ask which the user prefers if it isn't
   obvious from context.
3. `Read` the target file first if it might already exist (so you append rather than clobber it), then
   `Write` (new file) or `Edit`/rewrite (existing file) using the record shape below.
4. Confirm what was written and where, in plain language.

**At the start of a session, if the user wants to resume:**

1. Ask for (or confirm) the path they saved to previously.
2. `Read` the file.
3. Treat its contents as already-known -- e.g. hand a prior result straight to
   `battery_aggregate`/`battery_aggregate_json` alongside a freshly scored instrument, or simply
   summarize it back to the user -- without re-running any scoring tool call.

## Record shape (documentation only -- not code that ships anywhere)

This mirrors the real fields `score_*` tools already return (see `noesis-mcp/noesis_mcp/server.py`)
plus the `provenance`/`reference_frame` pass-through fields those tools already support -- it is not a
new schema invented for this skill, just the tools' existing real output, written to disk as-is.

**Every value below is a synthetic placeholder for illustration only.** Never copy a real user's actual
results into this documentation, and never invent a "realistic-looking" example drawn from any real
person's data, conversation, or history. When this convention is actually used, generate the record
purely from that session's own real tool output.

```json
{
  "record_version": 1,
  "saved_at": "2026-07-26T00:00:00Z",
  "user_id": "anonymous",
  "results": [
    {
      "tool": "score_big_five",
      "version": "2.0",
      "scored_at": "2026-07-26T00:00:00Z",
      "scores": {
        "Openness": 62.5,
        "Conscientiousness": 40.0,
        "Extraversion": 55.0,
        "Agreeableness": 70.0,
        "Neuroticism": 35.0
      },
      "population_norms": "not available for this quick screen -- see score_ipip_neo120",
      "confidence": "medium",
      "flags": [],
      "provenance": [
        {"tier": "asked", "source": "self-report"},
        {"tier": "inferred", "source": "conversation context"}
      ]
    },
    {
      "tool": "score_ecr_r",
      "version": "2.0",
      "scored_at": "2026-07-26T00:10:00Z",
      "reference_frame": "romantic partners in general",
      "subscale_scores": {
        "Anxiety": 3.1,
        "Avoidance": 2.4
      }
    }
  ]
}
```

Notes on the shape:
- **This is trimmed for brevity, not a complete field list.** Every real `score_*` result also carries
  a `crisis_line_note` string, and `score_ecr_r`'s real output additionally includes
  `reference_norms`/`reference_norms_source`/`note`/`attribution` (see `ecr_r.py`). Don't hand-trim
  fields when actually persisting a result -- write the tool's full real output object, unmodified.
- `user_id` mirrors `battery_aggregate`'s own default (`"anonymous"`) -- this file has no login and no
  account, and needs none. It's just a label the user can change if they're keeping more than one
  person's results apart (e.g. their own vs. someone they're helping) -- never inferred or assumed by
  the assistant, only ever set to what the user actually tells you.
- `results` is a plain list of raw `score_*` tool outputs -- feed entries straight into
  `battery_aggregate`/`battery_aggregate_json` later; no reshaping needed.
- `reference_frame` (ECR-R only) is free text the *user* supplies, per that tool's own docstring --
  never fill it in with a guess, and never write anything more specific than what the user actually
  told you. "Romantic partners in general" (ECR-R's own general-case framing, straight from its
  docstring) is always a safe default over guessing a more specific frame.
- Add a new entry to `results` for each additional completed instrument; don't overwrite prior entries.

## Honest limits

- **Not a resume-mid-assessment tool.** This persists *completed* `score_*` results only. If a battery
  is interrupted partway through, assessment-guide's existing limit still applies in full: there is no
  partial-response save, in this skill or anywhere else in this codebase.
- **Not synced, not backed up, not cross-machine.** It is one file (or folder) on the user's own
  filesystem, exactly where they told the assistant to put it. Losing that file, that machine, or that project
  directory loses the saved record -- same as any other local file the user owns.
- **Not available through the public MCP endpoint.** See "Scoping note" above -- if the only surface
  available is `/mcp/public/noesis/*` with no local filesystem attached, this convention has nothing to
  attach to.
- **Not a new tool, and not validated for longitudinal use.** Comparing two saved results over time is
  the user's (or a later `battery_aggregate` call's) job, with the same caveats as any other
  cross-instrument aggregation in this codebase -- see assessment-guide's "Honest Limits" for what
  `battery_aggregate` does and doesn't claim.
- **Corrected 2026-08-06: this local-file convention is no longer the only real cross-session option.**
  The native `save_assessment_result`/`list_my_assessments` tools (see "Why this is local-only, not a
  new tool" above and `skills/assessment-guide/SKILL.md`'s own section on them) now let a connected,
  consenting user persist completed results to their own Noesis account instead of, or alongside, a
  local file. This skill's guidance above is still fully valid for anyone who prefers a file they
  control, isn't connected, or hasn't consented to account storage -- it is simply no longer the *only*
  path. Offer both when relevant, and let the user pick.
- **Separately, still not live**: a *different*, Google-OAuth-gated sibling server (`noesis_mcp_gated`)
  has been built and unit-tested and would let results persist through a fuller login flow -- see
  `README.md`'s "Authentication" section for current status before mentioning it to a user. Don't
  confuse this with the native account-storage tools above, which are already live today.
