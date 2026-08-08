---
name: assessment-guide
description: This skill should be used when the user wants to take a psychometric assessment or personality test. It guides instrument selection across the 16 public instruments noesis-mcp scores, identifies which traits/values/facets the agent already has confident signal on from conversation context, asks the user only targeted questions to close the remaining gaps, retrieves real item text from noesis-mcp's prompts, administers items conversationally with chunking and breaks, and scores the complete response set. Activate when the user says phrases like "take an assessment", "what test should I take", "start assessment", "personality test", "self-assessment", "I want to understand myself better", or "values assessment".
triggers:
  - "take an assessment"
  - "start assessment"
  - "which instrument"
  - "personality test"
  - "self-assessment"
  - "understand myself better"
  - "what test should I take"
  - "begin assessment"
  - "assessment options"
  - "values assessment"
---

# Assessment Guide

Guide users through the complete assessment lifecycle: selection → gap analysis → targeted
administration → scoring → handoff.

> **Rewritten 2026-07-26.** Two changes since the last version: (1) noesis-mcp grew from 2 scored
> instruments to 8 (added CAT-Q, ASRS Part A, ECR-R, SWLS, IPIP-VIA-R, IPIP-NEO-120) and fixed two
> mislabeled instruments (the "TIPI-10" quick screen is actually IPIP-derived, not the real TIPI; the
> "PVQ-RR-22" values tool actually implements Schwartz's original 10-value theory, not the 2012
> refined 19-value PVQ-RR — see each tool's own docstring for the full finding); (2) this skill now
> implements the **hybrid inference policy** below, replacing pure "ask every item" administration.
> Still true from before: there is no assessment-session-persistence tool and no user-preferences
> tool — see "Honest Limits."

> **Extended 2026-07-27.** noesis-mcp grew from 8 to 10 scored instruments: added Financial
> Forecasting & Management Ability (`score_financial_calibration`) and Wellness Self-Tracking
> (`score_wellness_tracking`). Both follow the pattern above — real, cited item content, no
> psychometrician review of this product's own integration choices (see Honest Limits). One shape
> difference: `score_financial_calibration`'s `responses` argument is a two-part dict ("big_three" +
> "calibration" keys), not one flat ordered list like every other instrument on this page — see Step 5
> below before assembling its response set.

> **Extended 2026-08-01.** Two new, non-scoring MCP tools were registered on the base server:
> `get_verify_product_recommendations` and `check_cognitive_wellness_referral`. Neither is a 17th
> instrument — they don't administer or score anything. Both are pure, local, read-only functions
> that take a `profile_summary` dict (keyed by instrument name, mapping to that instrument's own
> already-computed result — e.g. assembled from `battery_aggregate`'s `instrument_summaries`, or one
> or more individual `score_*` outputs the caller already has in hand) and return a category-level
> "you might find X useful" suggestion. See "Local, Non-Clinical Referral Suggestions" below before
> using either.

> **Extended 2026-08-06.** A new, general-purpose MCP prompt, `personalized_intake_prompt`, was
> registered on the base server. It is not a 17th instrument and not a per-instrument item-text prompt
> like `big_five_prompt`/`charisma_prompt`/etc. -- it returns intake guidance for administering ANY
> instrument to a user who has (optionally) shared background context about themselves, so the
> administration protocol below fetches it once per administration, before Step -1. See the new "Step
> -2" under "Administration Protocol — hybrid inference" below before starting a battery.

## The 16 Real Public Instruments

**Corrected 2026-07-29**: noesis-mcp grew from 10 to 15 scored instruments (added Cross-Cultural
Adaptability, Research & Analysis Ability, Reasoning Style, Self-Regulated Learning, and
Charisma/Self-Presentation — see the 5 new rows below). Noesis MCP currently scores exactly 15
validated/original instruments — nothing else. Do not invent one, and do not imply a larger catalog exists.

**Corrected 2026-07-30**: noesis-mcp grew from 15 to **16** *public* scored instruments (added Reasoning
Ability, `score_reasoning_ability` — see the new row below). This table covers the 16 instruments
reachable through the default, anonymous connector this skill actually uses.

| Instrument | Tool | Items | Scale | Time | Licensing note |
|---|---|---|---|---|---|
| **Big Five quick screen** | `score_big_five` | 10 | 1-5 | ~3-5 min | Public domain (IPIP-derived). NOT the published TIPI. No population norms of its own — and IPIP-NEO-120 doesn't have any either (see Honest Limits); this server has no population-normed Big Five comparison at all. |
| **Values questionnaire** | `score_pvq_rr` | 22 | 1-6 | ~8-10 min | Commercial-use licensing UNRESOLVED (Schwartz author lineage) — fine for personal/non-commercial use. NOT the 2012 PVQ-RR. |
| **CAT-Q** (autistic camouflaging — Compensation/Masking/Assimilation subscales) | `score_cat_q` | 25 | 1-7 | ~8-10 min | CC BY 4.0 — cleanly licensed for any use. |
| **ASRS v1.1 Part A** (ADHD screener) | `score_asrs_part_a` | 6 | 0-4 | ~2-3 min | Free incl. commercial use, with attribution. Screener, not diagnostic. |
| **ECR-R** (attachment — Anxiety/Avoidance dimensions, no categorical style label computed) | `score_ecr_r` | 36 | 1-7 | ~10-12 min | Commercial-use licensing UNRESOLVED — fine for personal/non-commercial use. |
| **SWLS** (life satisfaction) | `score_swls` | 5 | 1-7 | ~1-2 min | Non-commercial use only per current terms — fine for personal use, do not use commercially without permission. |
| **IPIP-VIA-R Core Strengths** (3 global dimensions — Positivity/Dependability/Mastery — NOT the full 24-strength/6-virtue-cluster VIA classification) | `score_ipip_via_r` | 18 | 1-5 | ~5-7 min | Public domain. NOT affiliated with the VIA Institute on Character — say so if asked. |
| **IPIP-NEO-120** (full facet profile) | `score_ipip_neo120` | 120 | 1-5 | ~15-20 min | Public domain. Facet-level (30-facet) Big Five upgrade. No population-normed comparison available (see Honest Limits). Offer as an optional deep-dive, not a default. |
| **Financial Forecasting & Management Ability** | `score_financial_calibration` | 10 (3 + 7) | multiple-choice + numeric [low, high] range | ~5-8 min | Big Three (3 items): no explicit license notice found for this exact wording — confirm with GFLEC/Lusardi before commercial use. Calibration quiz (7 items): this module's own original content, not a published instrument. |
| **Wellness Self-Tracking** (sleepiness + medication adherence) | `score_wellness_tracking` | 20 (8 + 12) | 0-3 (sleepiness); 1-4 (adherence) — heterogeneous, not one shared scale | ~5-7 min | Epworth Sleepiness Scale (8 items): COPYRIGHTED, a license IS required for any use. ARMS (12 items): academic/nonprofit use now, contact Emory for commercial use. Personal self-tracking tool, NOT a medical diagnosis. |
| **Cross-Cultural Adaptability** (Metacognitive/Cognitive/Motivational/Behavioral subscales) | `score_cross_cultural_adaptability` | 16 | — | ~5-7 min | This module's own original item set, inspired by (but not a reproduction of) the licensed Cultural Intelligence Scale. NOT independently validated — say so if asked. |
| **Research & Analysis Ability** (Source Verification/First-Principles Decomposition/Solution-Space Breadth) | `score_research_analysis` | 18 | — | ~6-8 min | An original composite, not a published or independently validated instrument. |
| **Reasoning Style (REI-40)** | `score_reasoning_style` | 40 | — | ~10-12 min | A real, published self-report reasoning-STYLE scale (Rational vs. Experiential) — NOT a graded logical-reasoning ability test. Verify current licensing terms before commercial use, same discipline as the other published instruments above. |
| **Self-Regulated Learning** (Goal-Setting/Self-Monitoring/Strategy-Adjustment/Feedback-Seeking) | `score_self_regulated_learning` | 16 | — | ~5-7 min | This module's own item set, distinct from `score_ipip_via_r`'s Mastery dimension. NOT independently validated. |
| **Charisma / Self-Presentation** | `score_charisma` | 16 | — | ~5-7 min | An original adaptation inspired by the General Charisma Inventory and the Warmth/Competence stereotype-content model. Self-report text only, no image/photo input. NOT independently validated. |
| **Reasoning Ability** (GSM8K-style multi-step arithmetic + BIG-Bench-Hard-style structured logic — a graded PERFORMANCE test, not a self-report style scale; complementary to Reasoning Style above, never merged with it) | `score_reasoning_ability` | 19 | free-text final-answer per item, graded by normalized exact-match against a fixed answer key (not a Likert scale) | ~15-20 min | This module's own original items — only the item TYPES and exact-match grading METHODOLOGY are inspired by GSM8K (Cobbe et al., 2021) and BIG-Bench-Hard (Suzgun et al., 2022), neither of which is reproduced. NOT independently validated. No matching MCP prompt exists yet — see Step 1 below. |

All licensing notes above describe *product* commercial-use status, not whether an individual may take
the assessment for themselves — that's always fine. Mention the commercial-use caveat only if the user
asks about licensing, redistribution, or building on top of Noesis themselves.

**Handing off to interpretation:** once any instrument is scored, hand off to the `interpretation`
skill. 7 of the 14 non-Big-Five/IPIP-NEO-120 public instruments (CAT-Q, ASRS Part A, ECR-R, SWLS,
IPIP-VIA-R, Financial Forecasting & Management Ability, Wellness Self-Tracking) have a matching
strength-framed, non-diagnostic reference file (`skills/interpretation/references/<instrument>-
interpretation.md` — see that skill's "Interpreting the Other 7 Instruments" section). The 6 newest
(Cross-Cultural Adaptability, Research & Analysis Ability, Reasoning Style, Self-Regulated Learning,
Charisma/Self-Presentation, and Reasoning Ability) do **not** have a dedicated reference file yet — say so
plainly if asked to interpret one of these six rather than improvising one; `interpretation` works from
the tool's own `validation_status`/`disclaimer` output for these six instead (see that skill's own section
on them). Don't improvise interpretation for any of these 13 non-OCEAN public instruments from general
knowledge of the published instrument regardless — several are narrower or differently-scoped than their
name suggests (e.g. IPIP-VIA-R here is the 3-dimension compact form, not the full 24-strength
classification).

## Selection Conversation

1. **Open with goals**: "What would you most like to understand about yourself right now?" Map the
   answer:
   - General personality style / how you operate → Big Five quick screen (or IPIP-NEO-120 for a
     deeper facet-level pass)
   - Values and priorities / what matters to you → Values questionnaire
   - Autistic masking/camouflaging → CAT-Q
   - ADHD symptoms → ASRS Part A (screener, say so explicitly)
   - Relationship/attachment patterns → ECR-R
   - Overall life satisfaction → SWLS (quick, 5 items)
   - Character strengths → IPIP-VIA-R Core Strengths
   - Financial literacy and forecasting/calibration ability → Financial Forecasting & Management Ability
   - Sleep/daytime sleepiness or medication-adherence self-tracking → Wellness Self-Tracking
   - Adapting/operating across different cultures → Cross-Cultural Adaptability
   - How rigorously you verify sources, decompose problems, or generate options → Research & Analysis Ability
   - Rational vs. experiential/intuitive reasoning style (not a graded ability test) → Reasoning Style (REI-40)
   - Goal-setting, self-monitoring, and adjusting your own learning process → Self-Regulated Learning
   - Charisma, influence, or how you come across to others → Charisma / Self-Presentation
   - Multi-step arithmetic / structured-logic reasoning ABILITY, objectively graded (not a style
     preference) → Reasoning Ability
2. **Set expectations honestly**: "This is a short screening instrument, not a comprehensive clinical
   battery — think of it as a well-validated snapshot, not the last word on who you are." For ASRS
   Part A specifically, always say up front it's a screener, not a diagnosis.
3. **Multiple instruments** are complementary and can be offered in sequence. If you (or a downstream
   consumer) plan to combine results across instruments — e.g. via `battery_aggregate` — call
   `check_instrument_consistency` first to confirm your assumption about what each instrument
   measures matches what this server actually implements. Several instrument names here are close
   to, but not identical to, a differently-scoped published instrument (see the "NOT the..." notes in
   the table above, e.g. the values questionnaire is NOT the 2012 PVQ-RR) — mixing two genuinely
   different constructs under one colliding key would otherwise happen silently.

## Local, Non-Clinical Referral Suggestions (new 2026-08-01)

Two tools on the base server compute a category-level "you might find X useful" suggestion from a
`profile_summary` you already have in hand — never a new instrument, never a new question set:

- **`get_verify_product_recommendations(profile_summary)`** — reads instruments like
  `financial_calibration`, `wellness_tracking`, `self_regulated_learning` and returns 0+
  `{category, rationale}` suggestions (e.g. "structured financial-literacy tools"), plus a
  `disclaimer` and an `integration_status` field.
- **`check_cognitive_wellness_referral(profile_summary)`** — reads `reasoning_ability` and
  `ipip_neo120` and returns `referral_suggested` (bool), `rationale` (or `None`), `referral_link`
  (always `None` today), a `disclaimer`, and an `integration_status` field.

**Scope discipline — read before ever mentioning either tool to a user:**

- Both are **pure, local, read-only** computations over data you already have in this same
  conversation — neither makes an HTTP call, reads a database row, or sends anything to
  verify.seges.ai, "NCDA," or any other external system. `integration_status` says this
  unconditionally in its own output — always relay it verbatim if you surface a suggestion, don't
  paraphrase it into something that sounds more built-out than it is.
- Suggestions are **category-level only** ("structured financial-literacy tools"), never a named
  real product — this server has never been given verify.seges.ai's actual catalog, and inventing a
  specific product name would be fabrication.
- `check_cognitive_wellness_referral` **never claims to detect cognitive decline** — it's a
  performance-snapshot/personality-trait pointer, not a clinical determination. Always relay its
  `disclaimer` field verbatim (same discipline as `find_counselors`'s `disclaimer`/
  `crisis_line_note` below).
- Neither tool replaces `find_counselors` — a suggestion here is a self-help-resource-category
  pointer for the user's own results; a real clinical/mental-health concern still routes to
  `find_counselors` or, if crisis-level, to `crisis-support`.
- Build `profile_summary` yourself from results you already have (this conversation's own
  `score_*` outputs, or `battery_aggregate`'s `instrument_summaries` reshaped to a dict keyed by
  instrument name) — don't call either tool with fabricated or guessed instrument data.

## Administration Protocol — hybrid inference

There is no session-start, response-submission, progress, or resume tool. Administration state lives
only in the live conversation.

**The goal**: minimize how much the user has to explicitly "take a test" by using what you already
know about them from this conversation — without silently fabricating results or undermining what a
validated self-report score is supposed to mean. Balance those two by being **selective and
transparent** about inference, never blanket or silent about it.

### Step -2 — Check for user-shared background context, then fetch `personalized_intake_prompt` (added 2026-08-06)

Before Step -1's reflective concern-gather, check whether the user has already shared background
context about themselves earlier in this conversation -- a short self-description, or (more
specifically) a block of text they've pasted that presents itself as another AI assistant's memory or
summary of them. That second, narrower case is also the `memory-distillation` skill's activation shape
-- but that skill's job is extracting facts from the pasted block and saving them as a profile via
`save_my_profile`; this step is a different, complementary use of the same shared text, for
administering an assessment more efficiently, not a substitute for it. The two can both apply in the
same conversation without conflict.

Call the `personalized_intake_prompt` MCP prompt with `pasted_context` set to that shared text
(verbatim), or leave it empty (the default) for a standard cold-start intake if nothing has been
shared. It is a general-purpose prompt for administering ANY instrument on this server -- not tied to
one instrument like the `*_prompt()` calls in Step 1 below -- so fetch it once per administration,
before choosing an instrument, rather than once per instrument. Follow its returned guidance exactly
rather than inventing your own intake approach; it returns one of two shapes:

- **Nothing shared** (`pasted_context` empty): administer normally -- ask each item from the relevant
  `*_prompt()` output in order, record only the user's own explicit answers. No change from the rest of
  this protocol.
- **Context shared**: use it only to (1) skip generic rapport-building small talk, and (2) choose which
  follow-up or clarifying questions to ask, phrased more specifically to what you already know from that
  context. **It never authorizes answering, pre-filling, or guessing an instrument item on the user's
  behalf** -- every scored response must still be something the user explicitly typed themselves in this
  conversation, exactly as with any other respondent. This is a stricter, narrower rule than the
  hybrid-inference policy in Steps 1-2 below, which does permit inference for individual items under
  tight evidentiary conditions -- `personalized_intake_prompt` itself grants no such permission; hybrid
  inference does, separately, per item, with its own provenance record. Before scoring, briefly tell the
  user what you inferred from their shared context (about pacing and topic, not item answers) and let
  them correct anything wrong.

This prompt never reads, fetches, or stores anything itself -- it only returns instructions for you to
follow using context already present in this conversation, the same pure/local character as
`get_verify_product_recommendations`/`check_cognitive_wellness_referral` (see "Local, Non-Clinical
Referral Suggestions" above). Fetching it live, rather than improvising your own intake approach, keeps
this skill's guidance from drifting out of sync with the real prompt the moment either one is edited --
the same discipline `memory-distillation` already follows for `profile_distillation_prompt`.

### Step -1 — Open with a reflective concern-gather, not a cold start (added 2026-08-04)

**Before you name an instrument or ask a single item, find out what actually brought the person here
today.** Then say it back in your own words and let them confirm or correct you: "It sounds like what's
really on your mind is X. Is that a fair read?" Only once they've confirmed should you move to choosing
an instrument. Everything after this lands better for being anchored to something the person said they
wanted, rather than to a test they happened to click on.

**Acknowledge before advancing, every time.** After each response, asked or inferred, give one short
sentence connecting it to what you already know, then move to the next item or chunk. Never run
statement, answer, statement, answer with nothing in between. That rhythm is the single thing that
makes a conversation feel like a form.

**Calibrate your pacing, then actually use the calibration.** You may open with two or three short,
conversational questions about how much this person tends to examine their own reasoning and feelings.
Do not name an instrument or cite a scale here; this is for your own pacing, not a scored result. Then
use what you learn: someone who reads as less naturally reflective gets more concrete, example-anchored
item framing, and someone highly reflective gets more open, less-scaffolded framing. If you don't
intend to change anything based on the answer, don't ask the questions at all.

**If cultural or demographic context comes up naturally, let it shape tone and examples. Never turn it
into a mandatory intake question.** There is no user-profile or preferences storage tool (see Honest
Limits) and no consent architecture for collecting standalone demographic data, so building one is a
far larger decision than a skill file. If gender comes up, never present it as a forced binary, and
always allow skipping.

> Design note, for maintainers: every behavior above is the deliberate inverse of what a competing
> voice-based self-assessment product does. Its opening screen primes exactly this kind of reflection
> and then never returns to what the user said; its flow is stimulus and response with no
> acknowledgment between items; it collects a self-reflection signal that nothing downstream appears
> to act on; and its onboarding offers Male or Female with no alternative and no skip.

### Step 0 — Ask consent for inference, once, up front

Before the first item: "As we go through this, I'll skip asking about anything I'm already confident
I know from our conversation, and just ask you directly about the rest — I'll tell you which is which
at the end. If you'd rather answer every question yourself instead, just say so."

Respect an opt-out immediately and completely — fall back to asking every item directly (see the prior
version of this skill's Step 1-3, unchanged) with zero inference.

### Step 1 — Retrieve item meaning for YOUR reasoning, then the real item text

Call `get_item_bank(instrument)` first — it returns each item's text **and** what it measures
(trait/value/facet/subscale, reverse-scoring). This is for your own reasoning only. **Never reveal
`measures` or `reverse_scored` to the respondent** — showing what an item measures invites
demand-characteristic bias (the person answers how they think they "should," not how they actually
feel), which undermines treating the result as a genuine self-report.

Then call the matching MCP **prompt** to get the exact, validated respondent-facing wording — never
write your own items:
`big_five_prompt`, `pvq_rr_prompt`, `cat_q_prompt`, `asrs_part_a_prompt`, `ecr_r_prompt`,
`swls_prompt`, `ipip_via_r_prompt`, `ipip_neo120_prompt`, `financial_calibration_prompt`,
`wellness_tracking_prompt`, `cross_cultural_adaptability_prompt`, `research_analysis_prompt`,
`reasoning_style_prompt`, `self_regulated_learning_prompt`, `charisma_prompt`.

**Reasoning Ability is the one exception**: there is no dedicated MCP prompt for it (no
reasoning_ability_prompt exists — do not expect or invent one). Use
`get_item_bank("reasoning_ability")`'s own `text` field as the only respondent-facing item source for
this one instrument instead.

### Step 2 — Identify gaps, per trait/value/subscale/facet, not per item

Using `get_item_bank`'s `measures` field, group the instrument's items by what they measure. For each
group, ask yourself: *do I have real, specific, conversation-grounded evidence for this — not a vibe,
not a guess from tone — that lets me confidently predict how this person would answer, on this exact
scale, for this exact construct?*

- **High confidence** (multiple concrete, on-topic things they've told you, directly relevant to this
  specific construct): eligible for inference.
- **Anything less** (one offhand comment, a personality vibe, an inference from an unrelated topic,
  general politeness/agreeableness in how they talk to you): **not** eligible — ask directly instead.
  When in doubt, ask. A missed shortcut costs the user one extra question; a wrong inference costs the
  integrity of the whole score.

Never infer for CAT-Q, ASRS Part A, ECR-R, or Wellness Self-Tracking's medication-adherence items
unless you have unusually strong, explicit grounding — these touch autism-adjacent masking, ADHD
symptoms, attachment/relationship patterns, and personal health/medication behavior respectively,
where a wrong guess is more consequential than for a quick Big Five/values item.

**Construct-validity guardrail.** Before treating any piece of context as evidence for an item, check
that it actually speaks to *what that item measures* — not just the same general topic. Evidence from
a different psychological domain than the one an item's `measures` field names is not evidence for
that item, no matter how vivid or specific it is. For example:

| If the item's `measures` is... | Valid evidence | NOT valid evidence (common mistake) |
|---|---|---|
| Attachment (ECR-R: Anxiety/Avoidance) | How the person actually describes behaving/feeling in real close relationships | A general personality trait, an unrelated preference, or something from a completely different domain of the person's life (e.g. sensory, financial, cognitive) that merely co-occurs with relationships in conversation |
| Autistic masking (CAT-Q subscales) | Concrete, specific descriptions of effortful social self-monitoring | A general shyness/introversion comment, or an unrelated coping behavior |
| ADHD symptoms (ASRS Part A) | Specific, recent frequency-of-behavior statements matching the item's own wording | A one-off anecdote, a joke, or a trait inference from tone |
| Values / character strengths | Stated priorities, real choices/trade-offs the person has described making | Politeness or agreeableness toward you in this conversation |

If you can't name which specific construct your evidence actually demonstrates, or it demonstrates a
*different* construct than the item measures, treat the item as a gap and ask directly — do not stretch
adjacent-but-different evidence into an inference just because it's available.

### Step 3 — For every item, asked or inferred, build a real provenance record — never blend it in silently

Every `score_*` tool takes an optional `provenance` parameter: one entry per response item, in the same
order as `responses`. **Populate one for every single item, asked or inferred. This is a hard requirement
for every real administration — not "standard practice" you can quietly skip under time pressure, and not
an optional extra you add only when convenient.** (Corrected 2026-08-07: the language here used to stop at
"standard practice," which reads as a norm to depart from rather than a rule to follow — it's the latter.)
This is the raw material for a real dataset the product can use to understand and improve its own
assessments over time (which items draw low confidence, which kinds of context drive which values,
where inference tends to go wrong) -- but populating it here doesn't retain it anywhere by itself.
`score_*` is a pure, stateless computation that only echoes `provenance` back in that one call's
response (see `local-persistence/SKILL.md`'s "no server-side data persistence" note for the precise
scope of that statelessness). The data actually becomes a retained, analyzable dataset only once the
scored result -- provenance included -- is later persisted, e.g. via the consent-gated
`save_assessment_result` tool (see "Returning-User Continuity and Persistence Tools" below, point 2) or
the user's own `local-persistence` file. None of that later analysis is possible at all, saved or not,
if the data was never captured accurately in the first place -- which is exactly why populating it
correctly here, every time, still matters regardless of whether this particular result ends up saved.

For each item, build an entry with all four keys (see any `score_*` tool's own docstring, e.g.
`score_big_five`, for the full, authoritative definition of each):

- `tier`: `"asked"` or `"inferred"`.
- `context`: for an inferred item, the specific thing the user actually said that grounded this value —
  a short quote or paraphrase, not "conversation context" as a vague placeholder. For an asked item, a
  short note such as `"asked directly, no additional context used"`.
- `reasoning`: why you picked THIS specific number — the actual inferential step, not just a restatement
  of the context. For an asked item, this can be as simple as `"user's own stated answer"`.
- `confidence`: an integer 1-5 for THIS item specifically. An asked item where the user gave a clear,
  unambiguous answer is typically 5; an inferred item should almost never be 5 — reserve the top of the
  scale for genuine self-report, not your own best guess about someone.

Do this deliberately, not as an afterthought — you are about to submit this value to a scoring tool as
if it were genuine self-report, so treat picking it with the same care you'd want the user to apply
themselves. Keep the growing list of entries in your own working notes as you go (matching your growing
list of responses); you'll pass both, fully assembled and in the same order, in Step 5.

### Step 4 — Ask the rest directly, chunked

For every item you didn't infer, administer it the same way as before:
- Small chunks (5 at a time) for users who mention ADHD, anxiety, or fatigue
- Medium chunks (10 at a time) as a sensible default
- All at once for short instruments (SWLS, ASRS Part A) or users who prefer momentum

Number each item, show progress, offer a short break between chunks. If the user asks what an item
means, rephrase without suggesting an answer. Normalize "it depends" responses.

### Step 5 — Assemble the complete response set AND its provenance, then score it

Merge your inferred values and the user's directly-given answers into one ordered list matching the
instrument's item order exactly (see each tool's docstring for exact count/range). Assemble your Step 3
provenance entries into a second list, in the exact same order — entry *i* of `provenance` must describe
item *i* of `responses`, with no gaps and no reordering.

**Pre-flight self-check, mandatory before calling `score_*`:** confirm one `provenance` entry per response
— count `responses`, count `provenance`, and confirm the two counts match and the ordering lines up
item-for-item. If they don't match, stop and fix it before submitting; do not call the scoring tool on a
mismatched or partial pair and hope it's close enough.

Once that check passes, call the matching `score_*` tool with **both** `responses` and `provenance` in the
one call. This is a hard requirement for every real administration, not standard practice you can treat as
optional: passing `responses` alone (as this skill used to instruct) discards exactly the data this whole
step exists to collect.

All 16 public tools score a whole completed response set at once — there is no partial-submission call.
Two shape/kind exceptions on `responses` (provenance still applies the same way to both): 
`score_financial_calibration` does NOT take one flat list — its `responses` argument is a two-part dict,
`{"big_three": [...], "calibration": [...]}`, so assemble those two lists separately (3 entries, then 7)
rather than merging everything into a single ordered array; its `provenance` list still has one entry per
item, matching the combined 3+7 order. `score_reasoning_ability` differs in *kind*, not shape: its
`responses` is a list of final-answer strings (a bare int/float per item is also accepted and coerced) —
graded by exact-match against a fixed answer key, not summed or averaged like every Likert-scale
instrument above.

The only exception to the pre-flight check above: if you genuinely are not running a real administration at
all (e.g. calling a `score_*` tool directly for a quick standalone check, not the workflow this skill
describes), it is still technically safe to omit `provenance` entirely or submit a partial list — the tool
never rejects the call either way. **This exception does not apply to a real administration that follows
this skill's own protocol** — treat it as the narrow exception it is, never as a reason to skip the
pre-flight check above under time pressure.

### Step 6 — Disclose the inference split when handing off results

**This is not optional.** Before or alongside showing results: "I asked you N of the M items directly;
for the other M-N, I used what you'd already told me about [topic] rather than asking separately." List
which specific traits/values/subscales were inferred, in plain terms (not raw item numbers). If any
score seems to matter to a decision the user might make from it (e.g. "should I get evaluated for
ADHD"), say plainly that inferred answers are not the same as the person's own real-time self-report,
and offer to re-ask those specific items directly if the user wants a fully self-reported score.

**Corrected 2026-08-04**: the paragraph that used to be here claimed the scoring tools have no field
for marking which inputs were inferred vs. self-reported, and that this conversation was the only
record of it — that was wrong even when it was written (`provenance` has existed on every `score_*`
tool since before this skill's own hybrid-inference protocol did), and it is actively misleading now
that Step 3/5 above instruct you to populate and submit it on every call. The `provenance` you build in
Step 3 and submit in Step 5 IS a real field, and when the calling app persists the scored result (e.g.
`POST /noesis/assessments/score`), it is saved right alongside the scores themselves — it outlives this
conversation. That said, the verbal disclosure below is still not optional: a saved database row is not
something the user necessarily ever sees, and the whole point of Step 0's consent framing is that they
were told, in the moment, which of their answers were inferred rather than asked. Do both — submit the
structured `provenance`, and still tell the user the split in plain language. Losing track of which
items were inferred, or forgetting to disclose the split verbally, silently converts a "validated
self-report" into something the product's own population-normed framing doesn't actually support.

### Step 7 — Offer a warm handoff into coaching, don't assume it

**Added 2026-08-07.** Right after disclosing the inference split in Step 6, offer — don't assume — a
transition into coaching or growth-planning too. This is the same offer-don't-assume discipline this skill
already uses for `save_assessment_result` (point 2 below) and that `local-persistence` uses for its
local-file offer — present the option plainly, then follow the user's lead. Anchor the offer to something
specific the user actually said, not a generic prompt: "Want to talk through what this might mean for [a
goal or concern they mentioned earlier], or leave it here for now?" Accept either answer without pressure.
If they want to continue, hand off to the `coaching` skill (or the `coaching-companion` agent) with the
scored result, the disclosed inference split, and whatever goal they already named — don't make them
repeat themselves. If they decline or say nothing, leave it there; the offer itself is expected
every time, not the outcome.

## Returning-User Continuity and Persistence Tools (added 2026-08-06)

The public connector (`noesis.seges.ai/mcp`) now serves 11 native tools that did not exist when the
protocol above was written — not proxied from the base `noesis_mcp` scoring package described
throughout this file, but written directly into the connector and backed by real, per-user storage.
They require the exact same PAT authentication every `score_*` tool above already requires (nothing new
to set up for a connected user), and each returns a clean `Error: ...` text message — never a
protocol-level failure — when a consent gate isn't satisfied, naming exactly what's missing. This
section covers when and how to use them; it does not replace anything above — the hybrid-inference
protocol is still how you administer an instrument once you've decided to.

### 1. Check what's already known before starting cold

**Corrected 2026-08-07: `journal_view_memory()` is no longer optional here.** Per `hooks/hooks.json`'s
SessionStart reminder, calling it is now unconditional for any connected user (tools visible, PAT valid —
see "Account and Connector Status" below) — every connected session already opens this way, once, before
the user is asked anything and before any skill-specific trigger is needed. This section mirrors that same
instruction so the two stay consistent regardless of which skill (if any) ends up activating, rather than
this being the only place the instruction lived — which is exactly how it previously went silently unrun
for a connected user whose session never happened to hit an assessment-shaped trigger phrase.
`journal_view_memory()` is the single-call "what does Noesis currently remember about this person" view
(consent state + latest profile + recent journal entries together) — call it once, first. If it returns
real history, use it the way you'd use anything else already established in conversation — "I can see you
took the CAT-Q back in [date] — want to pick up from there, or take something new?" An empty result is not
an error and not evidence the user is new — it just means they haven't saved anything yet, so proceed
exactly as you would for a first-time user.

Beyond that mandatory call, also consider calling `list_my_assessments()` (the caller's own saved results,
most recent first, optionally filtered by instrument) and `get_my_profile()` (their own most recent saved
profile snapshot — overlaps with what `journal_view_memory()` already returned, but still worth calling
directly before a `save_my_profile()` call, see point 2 below). **These two stay a courtesy, not a
requirement** — skip them for a user who's clearly just testing the connector, or who's already told you
what they want. Like `journal_view_memory()`, they only ever surface what that specific user has
previously chosen to save — empty results from either are not an error and not evidence they're new.

`journal_get_recent()` (see point 3 below) is a further, optional way to look specifically at journal
content beyond what `journal_view_memory()`'s own "recent journal entries" already surfaced.

**What this does not give you: a cross-instrument gap analysis.** Knowing what's already been taken
(`list_my_assessments`) and what's already been distilled (`get_my_profile`,
`journal_get_recent`/`journal_view_memory`) is not the same as knowing what's still missing across the
full 16-instrument catalog, or which instrument would add the most value next — there is still no tool
for that. Reasoning about the gap is your own judgment call, exactly like every other instrument-
selection decision this skill already asks of you (see "Selection Conversation" above).

### 2. Offer to save every scored result — check consent first, never assume it

Immediately after any `score_*` tool call completes, in a session with a connected user:

1. Call `get_consent_status()` (no args — reads the caller's own current consent state) if you don't
   already know it from earlier this session.
2. If storage consent (`age_confirmed_18plus` + `store_results`) is already granted, offer to save
   plainly: "Want me to save this result to your account so it's there next time?" If they agree, call
   `save_assessment_result` with the already-scored result dict (whatever the matching `score_*` tool
   just returned). You can optionally attach `confidence_score` (1-5, for the whole assessment, not per
   item — don't confuse this with the `provenance` list's own per-item `confidence` field from Step 3
   above) and `qualitative_context` (a free-text comment) — the latter needs its own separate consent,
   so if the user wants to add a comment and hasn't granted that specific consent yet, ask for it the
   same way as step 3 below, scoped to just that capability.
3. If storage consent is missing, **explain in plain language what saving means before asking for
   agreement** — this account persists the result across sessions and devices, tied to their signed-in
   account, until they delete it; it is different from, and in addition to, the `local-persistence`
   skill's local-file convention (that one is a file the user controls on their own machine; this one is
   Noesis's own account storage). Once they agree in principle, tell them where to actually grant it:
   "head to https://noesis.seges.ai, sign in if you need to, and turn that on in your account settings;
   it only takes a moment." There is nothing further for you to do at the moment of agreement itself —
   see the correction below for why.
4. Once the user confirms they've turned it on, call `get_consent_status()` again before calling
   `save_assessment_result` (or `save_my_profile` / `journal_write_entry`, for the equivalent
   profile/journal flows below): never take the user's word for it and proceed straight to the save. If
   the re-check still shows the consent missing, say so plainly rather than assuming it was set
   correctly, and offer to walk through the website step again.

**Never save without this sequence.** This mirrors `local-persistence`'s own standing rule for the
local-file convention ("always offer, never save silently") — the account-storage path deserves the
same discipline, not a lighter one just because it's now a tool call instead of a file write.

**Corrected 2026-08-06, later the same day:** steps 3 and 4 above used to end in you calling a
`grant_consent` tool directly once the user agreed. That tool shipped this same morning and was pulled a
few hours later on an explicit founder/legal call: every consent grant has to be traceable to a real
website session (IP, session context, an actual HTTP request), not an MCP tool call that an AI agent
could invoke on a user's behalf with a much thinner audit trail (a `ToolCallEvent` row versus a real web
request). `get_consent_status` is unaffected; reading consent carries none of that concern, only
granting it does. `POST /noesis/consent` on the website is now the only sanctioned way to grant consent
-- including the `journal_consent`/`journal_age_confirmed_18plus` pair the old tool also used to cover,
relevant to the journal tools in section 3 below. If you still see a `grant_consent` tool in your tool
list, something is stale; do not call it.

After saving, `list_my_assessments()` is how the user (via you) can confirm it's there, and how a future
session picks it back up per point 1 above.

**Profile snapshots are a different thing from a saved assessment result.** `save_my_profile` and
`get_my_profile` are a separate pair from `save_assessment_result` and `list_my_assessments`. Where a
saved assessment result is one instrument's raw scored output, `save_my_profile` persists a distilled,
free-text psychological-profile snapshot built from the whole conversation so far — the same shape the
`profile_distillation_prompt` MCP prompt already describes: 9 free-text dimensions plus up to 5 verbatim
quotes. It requires its own profile-distillation consent (check and ask for it the same way as above,
before the first save) and is **append-only with no server-side merge or diff logic of any kind** — every
call creates a brand-new snapshot rather than updating the last one, so `get_my_profile` always returns
the most recent — and a shallow new snapshot can silently bury a richer prior one if you build it
carelessly. Offer this after a substantive conversation has actually produced something worth distilling —
not after every single message, and not as a substitute for saving the instrument-level result itself via
`save_assessment_result`.

**Corrected 2026-08-07 — mandatory read-before-write, added after a real overwrite risk was found.**
Before every `save_my_profile` call:
1. Call `get_my_profile()` first, unless you have already confirmed — from point 1's `journal_view_memory`
   check above, or directly earlier this conversation — that this is the user's first-ever save. Never
   skip this to save a round trip: the tool itself has no merge logic, so skipping it risks silently
   overwriting a rich prior snapshot with a shallower one built from only this conversation.
2. If a prior snapshot comes back, build the new snapshot as that prior content **plus** whatever this
   conversation has genuinely added or changed — carry forward every dimension and quote that's still
   true; don't start from a blank slate just because it's easier.
3. If `get_my_profile()` comes back empty, proceed as a genuine first save — there's nothing to preserve.

### 3. Journal tools — a separate, ongoing feature, not tied to any one assessment

`journal_write_entry`, `journal_search`, `journal_get_recent`, `journal_view_memory`,
`journal_grant_access`, and `journal_revoke_access` are a distinct capability from assessment results —
free-text life notes the user keeps across sessions, optionally tagged by category (e.g. "career",
"relationships"), independent of whether they've ever taken an instrument. Each requires its own journal
consent, separate from assessment-storage consent — check `get_consent_status()` before writing, the
same way point 2 above does for results.

- `journal_write_entry` — write a new entry (free text + optional `category_tags`). Requires its own
  journal consent (ask and explain, same discipline as point 2 above, before the first write).
- `journal_search` — search the user's own entries by keyword and/or category/date range.
- `journal_get_recent` — the user's most recent entries, for proactively resurfacing past context in a
  later session (see point 1 above) — not a write-only archive.
- `journal_view_memory` — the transparency view: consent state + latest profile + recent journal
  entries in one call. Offer this any time a user asks some version of "what do you actually know about
  me" — it's the honest, complete answer, not a partial one.
- `journal_grant_access` / `journal_revoke_access` — let the user grant (or later revoke, by grant ID) a
  specific agent or purpose access to a specific category of their journal — selective disclosure, not
  all-or-nothing.

**When to bring it up — offer, don't assume, the same spirit `local-persistence` already uses for saved
results.** There's no fixed trigger list here on purpose: the natural moment is when a user shares
something about their current life, goals, or struggles that seems worth remembering across sessions —
not something you should mine for or ask about proactively every session. A light touch is right: "Want
me to jot that down so it's there next time we talk?" is enough; don't turn an assessment conversation
into a journaling intake. If the user never brings up anything journal-worthy, that's a normal session,
not a missed opportunity.

### 4. Doing several instruments in one pass, when context is rich

Point 1 above deliberately stopped short of a real answer to one question: once you know what's
already been taken and what's already been distilled, how do you use that to cover *several*
remaining instruments efficiently, instead of always running each one as a fully separate,
sequential mini-interview? There is still no tool that computes this for you — this section is
the judgment call point 1 flagged as still yours to make, generalizing the Administration Protocol's
existing hybrid-inference discipline (above) from one instrument to several at once, not a new
mechanism.

**When this applies**: the user has expressed interest in more than one thing (directly — "I want to
understand my personality and how I handle relationships" — or implicitly, e.g. you're proposing a
short battery), *and* you're working with unusually rich context — a long prior conversation, real
history from `get_my_profile`/`journal_view_memory`, or a user who has already volunteered a lot about
themselves unprompted. With thin context, don't force this — running one instrument properly, the
normal way, is better than a shallow pass across three.

**How**:

1. **Run gap-identification for every candidate instrument first, before asking the user anything.**
   For each one, do the same Step 1-2 work the Administration Protocol already describes (call
   `get_item_bank`, decide per trait/value/subscale/facet whether you have real, specific,
   on-construct evidence or a genuine gap) — but do this as one analysis pass across all the
   instruments under consideration, not interleaved with asking.
2. **Consolidate what's left into one combined ask, grouped clearly by instrument or theme** — not
   "here are 40 questions," but something like "for your values ranking I still need three things,
   and for attachment style, two — here they are, grouped." This is still subject to every pacing rule
   the Administration Protocol already sets (chunking, offering breaks, normalizing "it depends") — a
   consolidated gap list across three instruments can easily be longer than one instrument's full item
   set, and the chunking discipline exists precisely for that case. If the combined list is long,
   offer to take it in stages rather than abandoning consolidation altogether.
3. **Score each instrument separately once its own response set is complete** — nothing changes about
   scoring itself; `score_*` still takes one instrument's whole response set per call, same as always.
   Doing the gap-analysis and asking in a consolidated pass does not mean the scoring calls merge too.
4. **Call `check_instrument_consistency` before treating any two instruments' outputs as comparable or
   combinable** — same discipline "Selection Conversation" step 3 already establishes for
   `battery_aggregate`, and just as relevant here: running instruments together in one conversational
   pass makes it easier to blur two differently-scoped constructs (e.g. Reasoning Style vs. Reasoning
   Ability) than treating them as obviously separate interviews would.
5. **Offer to save each result and, if the user wants a unified view, `battery_aggregate` them** — same
   consent-first discipline as point 2 above, applied once per instrument.

**What this still doesn't give you**: no tool tells you which remaining instrument would add the most
value next, or how "complete" a user's overall picture is — that framing is still entirely your own
read of the conversation, the same honest limit point 1 already names for single-instrument gap
analysis, just applied at the multi-instrument level too.

## Honest Limits (say these if asked)

State these plainly and without hedging when they come up. They are the reason a Noesis result is worth
anything: a tool that tells you exactly where its own numbers stop is one you can actually reason with.
Say them as facts about the instrument, not as apologies for the product, and don't volunteer the whole
list unprompted when one line answers the question.

- **No resume tool.** If the conversation is interrupted before all items are answered, there is no
  server-side saved state to resume from. If the same conversation is still open, continue from your
  own conversation memory. If it's genuinely lost, say so plainly and offer to restart. This is about
  *mid-assessment* resume specifically — once a battery is complete, see the `local-persistence` skill
  (added 2026-07-26) for how to save the finished result to a local file the user controls, so a
  *future* session doesn't need the user to re-paste it. That skill does not close this gap — there is
  still no partial-response save.
- **No preferences storage.** Chunk size, accessibility settings, inference opt-out, and coaching style
  are not read from or written to any per-user profile — they're choices made fresh each conversation.
- **No 2e-adjusted norms anywhere.** None of the 16 public instruments have neurodivergence-specific
  validation or norms — every one was normed on general-population or student/community samples (where
  normed at all). Don't imply otherwise.
- **IPIP-NEO-120 has no population comparison at all**, not even a general-population one — Johnson
  (2014)'s own paper publishes reliability coefficients but no usable descriptive-statistics table for
  4 of its 5 domains. `score_ipip_neo120`'s output says this explicitly; don't paper over it with your
  own invented percentile language.
- **Inferred answers are not real self-report.** Say this plainly if a user's decision seems to hinge
  on a score that included inferred items (see Step 6).
- **None of the 16 public instruments' integration into this product has had a dedicated psychometrician
  review** — for 11 of the 16, the underlying theory/item wording is real, published, and cited, but the
  specific choices made when building it into this server (item selection, administration, how results
  get used downstream) haven't been checked by a domain professional. The other 5 (Cross-Cultural
  Adaptability, Research & Analysis Ability, Self-Regulated Learning, Charisma, Reasoning Ability) are
  this server's own original compositions/adaptations with no single published methodology to be faithful
  to in the first place — see each one's own `validation_status` field. Reasoning Ability is additionally
  this server's only objectively-graded PERFORMANCE test rather than a self-report scale — say so if asked
  whether it's "the same kind of thing" as the others. Say so if directly asked whether this product's
  assessments are "clinically validated" — the honest answer is "most are real, published instruments;
  none of their integrations here have been independently reviewed yet, and a few are original designs
  with no published instrument behind them at all."

## Account and Connector Status (read this before saying anything about login)

**Corrected 2026-08-04.** This section used to open by stating that today's connector is anonymous by
design and instructing you to never tell a user a login is required. That was accurate when written and
is wrong now. Do not repeat it.

**Signing in is part of setup, and it has already happened by the time you get here.** Since 2026-08-01
every call on this connector carries a Noesis personal access token. The user gets one by signing in
once at https://noesis.seges.ai/connect (free, Google or phone sign-in, terms agreement, token shown
once), and their client supplies it through the `NOESIS_PAT` environment variable. Practical
consequences for you:

- If you can see and call the `score_*` tools in this session, setup is done. Nothing further is asked
  of the user, so do not interrupt an assessment to talk about tokens or accounts.
- If the tools are **not** in your available tool list, say so plainly in your first turn and point the
  user at https://noesis.seges.ai/connect and `README.md`'s Installation section. Never fabricate a
  score, and never administer a full instrument you have no way to submit.
- The connector URL is `https://noesis.seges.ai/mcp`. Never hand a user the underlying Cloud Run
  hostname instead: sign-in discovery is published only on the branded domain, so a client pointed at
  the raw host cannot complete a login and dead-ends on an unrelated service's sign-in page.

Separately, a Google-OAuth-gated sibling server (`noesis_mcp_gated`, in `service-system`, wrapping these
same 16 public scoring tools behind a full OAuth sign-in) has been built and unit-tested, but is
**not confirmed live**. Check `README.md`'s "Authentication" section (and, if you have repo access,
`service-system/noesis_mcp_gated/README.md`) for the current, authoritative status before saying anything
about this to a user — it can change independently of this file.

**Once that connector is confirmed live**, it's worth surfacing as an optional upgrade after a completed
assessment, alongside — never instead of — `local-persistence`'s local-file offer: something like "If
you'd rather your results followed you automatically across sessions instead of you saving a file, the
account you already signed in with can hold them. That's entirely optional, and everything we just did
works without it." Note the framing: the user already has a Noesis account by this point (that's how
their token was issued), so this is an offer to use it for storage, not an invitation to sign up.
If you're unsure whether the gated connector is actually live and reachable in this session, default to
not mentioning it rather than guessing, and never imply it's available today when you haven't confirmed
that.

## Planned, Not Yet Implemented

Beyond the per-instrument gaps already listed above under Honest Limits, none of the following exist
anywhere in this system — say so plainly if asked, rather than implying otherwise:

1. A safety-classification tool (crisis judgment is LLM reasoning in a hook, not a tool call — see
   `crisis-support`).
2. A session- or progress-tracking tool (no start/submit-response/get-progress/resume call — see "No
   resume tool" above).
3. Mid-assessment (partial-response) persistence — `local-persistence` only saves a *complete* finished
   result, not a battery that's partway done.
4. A user-profile/preferences storage tool (see "No preferences storage" above).
5. A real population-normed centile for the Big Five quick screen (the field was removed 2026-07-26,
   not replaced).
6. Any population-normed comparison for IPIP-NEO-120 (see above).
7. 2e/neurodivergence-adjusted norms for any of the 16 public instruments (see above).
8. Independent psychometrician review of this product's own integration choices, for any of the 16 public
   instruments (see above).
9. Full cross-instrument aggregation onto one unified profile — `battery_aggregate` gives every one of
   the 16 public instruments its own entry in the output's `instrument_summaries` field (nothing is
   silently dropped), but only `score_big_five`/`score_pvq_rr` are actually averaged onto the shared
   `unified_traits`/`value_profile` axes. This is deliberate, not a bug — the other 14 public instruments
   measure genuinely different constructs that would be artificial to force onto Big Five/Schwartz axes
   (see `battery_aggregate`'s own docstring) — but say so if a user expects every instrument they've
   taken to blend into one combined score.
10. Tool registry/introspection (noesis-mcp's registry.py exists but is dead code, unused by server.py).
11. Multi-instrument session orchestration (noesis-mcp's orchestrator.py exists but is dead code too).

## Encouragement & Tone

- **Warm, not clinical**: "You're doing great" not "Please continue the instrument"
- **Normalize difficulty**: "These questions can be hard — there's no wrong answer"
- **Celebrate completion**: "You did it! That kind of self-reflection takes real courage"
- **Acknowledge effort**: "I know that was a lot of questions. Your willingness to explore yourself is a real strength"

## Handling Common Situations

### User Is Anxious About Results
"Your results are private to this conversation. There are no 'bad' scores — every trait has strengths and challenges. We'll frame everything in terms of what makes you uniquely you."

### User Wants Multiple Instruments
"Let's start with one and see how it feels. We can do others right after if you'd like."

### User Is Stuck on an Item
"That makes sense — these questions are designed to be thought-provoking. There's no perfect answer. Go with what feels most true overall, even if it's not true 100% of the time. We can also skip it if you'd like."

### User Has Taken This Before
For a connected user, check first whether `journal_view_memory()`/`list_my_assessments()` (see
"Returning-User Continuity and Persistence Tools" point 1 above — now an unconditional, every-session
check, added 2026-08-07) already surfaced this — if so, use that real history instead of the line below.
Otherwise: "That's great — it means you have a baseline! I don't have a stored record of your last
results in this session, but if you can share what you remember or paste your previous scores, we can
compare."

### User Declines Inference Mid-Way
Respect it immediately: stop inferring for the rest of this session, ask any already-inferred items you
haven't disclosed yet directly instead of submitting your guess, and don't ask again this conversation.

### User Wants Help Finding a Counselor or Therapist
This skill administers self-assessments, not clinical referrals — but if the user wants to find local
mental-health support (during or after an assessment), use `find_counselors(location, focus,
max_results)`. It's a real outbound Google Places lookup (not a vetted clinical directory), so always
relay its `disclaimer` and `crisis_line_note` fields verbatim along with the results. **Availability
note (updated 2026-08-08)**: this tool is available to every signed-in user — no Premium gate — limited
to 20 searches/week and 40 searches/month per user since it calls a real, paid external API on the
user's behalf; check it is actually in your tool list before offering it, and relay the tool's own
in-band error if the user hits the limit.
