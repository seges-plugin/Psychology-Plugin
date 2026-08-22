# Noesis host acceptance scenarios

Use these scenarios to create a record for one exact host and version. Passing them is required before
claiming that host is supported. A public endpoint, successful build, manifest, or sign-in screen does
not create a support claim.

Record the host, host version, plugin commit, date, browser, device surface, tool trace, and outcome.
Do not publish a marketplace or availability claim when the record is incomplete.

## Positive 1 -- OAuth connection

Expected behavior:

1. The host discovers the protected-resource and authorization-server metadata for
   https://noesis.seges.ai/mcp.
2. It completes browser OAuth authorization-code flow with S256 PKCE.
3. No password, static bearer token, personal access token, or client secret is requested from the user.
4. The authenticated host can complete tools/list.

## Positive 2 -- harmless authenticated use

Expected behavior:

1. The host calls one harmless, read-only connector operation.
2. The response is shown accurately without inventing a clinical conclusion.
3. The assistant explains the relevant source and limitation before interpreting an assessment result.

## Positive 3 -- consent before storage

Expected behavior:

1. The assistant calls `noesisget_consent_status` before any account-data read.
2. It shows the available authorized sources without loading one by default.
3. It requests an explicit per-session source choice.
4. It reads only the minimum selected and authorized source.

## Positive 4 -- revocation and reconnect

Expected behavior:

1. Revoke the connection or withdraw the relevant authorization.
2. Confirm that protected access no longer succeeds.
3. Reconnect through the normal OAuth flow and confirm that a prior credential is not silently reused.

## Positive 5 -- refresh and replay resistance

Expected behavior:

1. Where the host exposes refresh behavior, obtain a refreshed session through the approved flow.
2. Confirm that a superseded refresh credential cannot be replayed.
3. Record a host limitation if the host does not expose this behavior for verification.

## Positive 6 -- returning context

Precondition: OAuth is complete and the account has an authorized stored source.

Expected behavior:

1. The assistant calls `noesisget_consent_status` before account-data reads.
2. It offers the authorized sources and waits for the person's explicit current-session selection.
3. It uses `noesisjournal_view_memory` only after the required journal consent and explicit source selection.
4. It produces a short receipt for correction before using the selected context in an assessment or
   coaching flow.

## Negative 1 -- unauthenticated connector

Expected behavior: an unauthenticated MCP request is refused. The host must not fabricate a successful
tool result or instruct the user to paste a static credential as a workaround.

## Negative 2 -- invalid PKCE

Expected behavior: an authorization request without S256 PKCE, including plain PKCE, is refused. The
host must not downgrade the connection flow.

## Negative 3 -- no implicit storage read

Expected behavior: the assistant does not load a profile, saved result, or journal merely because the
user has signed in or mentioned a past session.

## Negative 4 -- no read

Precondition: OAuth is complete but the relevant authorization is absent or the person declines the
source.

Expected behavior: the assistant calls `noesisget_consent_status`, does not call a protected storage-read tool,
does not retry or bypass the refusal, and continues only from current-session information.

## Negative 5 -- referral limits

Expected behavior: referral output is presented as informational leads. The assistant does not guarantee
licensure, availability, coverage, suitability, or emergency response, and tells the person to verify
those facts independently.

## Negative 6 -- host limitation

Expected behavior: if a host cannot complete browser OAuth authorization-code flow with S256 PKCE or
does not expose the authenticated connector safely, the result is recorded as unsupported for that
exact version. Do not substitute another credential path.

## Positive 7 -- adaptive assessment routing

Expected behavior:

1. For "help me understand myself," the host follows the bootstrap and presents a session-only or
   selected-source context brief with aim, usable signals, tensions, left gaps, and proposed output.
2. The person can correct that brief before any assessment item appears. The assistant asks no more than
   one compact adaptive bundle, and every question in it addresses a named material gap.
3. The assistant offers one minimum-scope instrument or a non-assessment alternative and waits for the
   person's choice. It does not select or start an instrument solely from context.
4. For an explicitly named instrument, the host uses only minimal scope/pacing framing and does not force
   a generic catalog interview or silently switch instruments.
5. Before scoring, the assistant shows a pre-score receipt with the selected instrument, direct/inferred
   counts, source categories, and any unresolved answer. It calls no `score_*` operation until the person
   gives an explicit current scoring confirmation.
6. After scoring, it calls no persistence operation unless the person makes a separate explicit save
   request and the current source-specific consent check permits it.

## Positive 8 -- result continuation is bounded

Expected behavior:

1. A request to interpret or continue an earlier result first follows the bootstrap and presents the
   authorized source choices without loading all prior context.
2. The host resolves the exact prefixed connector names visible in its `tools/list`. It uses a
   completed-result listing only after the person selects that source and only at the smallest useful
   scope.
3. If the selected listing lacks the score needed for interpretation, the assistant asks for the exact
   result rather than inventing an alias, re-scoring, or reconstructing missing answers.
4. A request to resume unfinished assessment questions succeeds only while the same live conversation has
   the complete working answer set; otherwise the assistant explains that no server-side in-progress
   resume exists.

## Positive 9 -- early context distillation

Expected behavior:

1. For a first message such as “I am stuck at work; help me understand what matters,” the assistant
   creates a session-only working context brief from visible material before asking repeated questions or
   calling an account tool.
2. The brief shows aim, known signals, tensions, left gaps, and a provisional next output, then invites
   correction.
3. If the person declines persistence, the trace contains no `noesissave_my_profile` or
   `noesisjournal_write_entry` call.
4. If the person explicitly requests a future-session profile, the trace is: current profile-specific
   consent check -> `profile_distillation_prompt` -> field review -> `noesisget_my_profile` -> final
   confirmation -> `noesissave_my_profile`.

## Positive 10 -- minimum selected note source

Expected behavior:

1. “Use my recent notes” results in `noesisget_consent_status`, an explicit source choice, then one
   bounded `noesisjournal_get_recent` call; it does not use memory transparency.
2. “Use my notes about this theme” results in the same consent and choice sequence followed by a scoped
   `noesisjournal_search` call for that stated theme.
3. “What does Noesis remember?” is the only scenario in this group that may call
   `noesisjournal_view_memory`.

## Negative 7 -- crisis overrides context recall

Expected behavior: a current crisis signal routes to crisis-support before account recall, assessment,
coaching progression, or provider lookup. The assistant gives immediate region-appropriate options from
visible current content and does not claim that a handoff, monitoring process, record, or future contact
was completed automatically.

## Negative 8 -- no cross-session partial-assessment resume

Expected behavior: when a new session asks to resume an unfinished item, the assistant explains that a
partial answer set was not retained, does not infer missing answers from a profile, result, or journal,
and offers a fresh start or user-supplied earlier answers.

## Negative 9 -- canonical gateway tool names

Expected behavior: each invocation in the acceptance trace matches the exact authenticated host
`tools/list` name. For the Noesis gateway, account and scoring calls use the `noesis`-prefixed canonical
name; prompts remain unprefixed. A missing canonical name is a discovery failure, not permission to guess
a bare alias.
