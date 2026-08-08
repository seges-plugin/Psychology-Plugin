---
name: interpretation
description: This skill should be used when the user wants to understand their assessment results, scores, or psychometric profile. It generates strength-framed interpretations that describe every trait as a strength (never a deficit), integrates twice-exceptional (2e) context, and creates meaningful archetype names for the user's profile. Activate when the user says phrases like "what do my results mean", "interpret my scores", "explain my profile", "strength-framed interpretation", "what does this say about me", "my IPIP results", "personality profile", or asks about any specific score, percentile, or trait.
triggers:
  - "what do my results mean"
  - "interpret my scores"
  - "explain my profile"
  - "strength-framed interpretation"
  - "what does this say about me"
  - "my results"
  - "personality profile"
  - "my scores"
  - "percentile"
  - "trait"
references:
  - path: "references/strength-frames.md"
    description: "Strength-framed descriptions for all 30 OCEAN facets — use for generating positive interpretations of any score level"
  - path: "references/ocean-facets.md"
    description: "Technical descriptions of all 30 OCEAN facets with high/low pole characteristics"
  - path: "references/2e-archetypes.md"
    description: "Common twice-exceptional profile patterns and archetype names"
  - path: "references/cat-q-interpretation.md"
    description: "Strength-framed, non-diagnostic interpretation of score_cat_q's three subscales (Compensation, Masking, Assimilation)"
  - path: "references/asrs-interpretation.md"
    description: "Strength-framed, explicitly non-diagnostic interpretation of score_asrs_part_a's 6-item ADHD screener result"
  - path: "references/ecr-r-interpretation.md"
    description: "Strength-framed interpretation of score_ecr_r's two attachment dimensions (Anxiety, Avoidance) — no categorical style label"
  - path: "references/swls-interpretation.md"
    description: "Strength-framed interpretation of score_swls's life-satisfaction bands"
  - path: "references/ipip-via-r-interpretation.md"
    description: "Strength-framed interpretation of score_ipip_via_r's 3 global dimensions (Positivity, Dependability, Mastery) — NOT the full 24-strength VIA"
  - path: "references/financial-calibration-interpretation.md"
    description: "Strength-framed interpretation of score_financial_calibration's literacy + calibration sub-scores"
  - path: "references/wellness-tracking-interpretation.md"
    description: "Strength-framed, non-diagnostic interpretation of score_wellness_tracking's sleepiness + medication-adherence components"
---

# Interpretation Guide

Generate strength-framed interpretations of psychometric results that honor neurodivergent identity and twice-exceptional experience.

## Core Principle: Strength-Framing

Every trait description must:
1. **Name the strength first** — What does this trait enable?
2. **Acknowledge the challenge** — What does it ask of the person?
3. **Provide 2e context** — How does this show up differently for gifted ND adults?
4. **Offer actionable insight** — How can they work with this trait?

**Added 2026-08-07**: strength-framing is this skill's own concrete mechanism for the plugin-wide
non-judgmental standing behavior (see `hooks/hooks.json`'s SessionStart reminder) — naming the strength
before the challenge is what keeps a trait description from ever reading as a judgment of the person who
has it, not just a stylistic preference for positive language.

**Person-first vs. identity-first language**: use whichever the user has actually used for themselves
("a person with ADHD" vs. "an autistic person"), and ask rather than assume if they haven't said. Don't
silently default to one convention across every interpretation — this is the user's own preference to
set, not a house style to impose.

### The Reframe Formula

```
[Trait] as [Strength Name]
→ "Your score in [Trait] suggests you're someone who [strength description]. 
   This means you [capability], though you may sometimes [challenge]. 
   For 2e adults, this often shows up as [2e manifestation]."
```

### Score Level Framing

| Level | Frame As | Language |
|-------|----------|----------|
| Very High (90%+) | "Distinctive strength" | "You have a particularly pronounced capacity for..." |
| High (70-89%) | "Clear strength" | "This is a meaningful strength for you..." |
| Average (30-69%) | "Flexible range" | "You have a versatile, context-dependent approach to..." |
| Low (10-29%) | "Selective focus" | "You tend to be selective about... which frees energy for..." |
| Very Low (<10%) | "Unique pattern" | "You have an uncommon pattern here that creates space for..." |

## Interpretation Workflow

> **Corrected 2026-07-25.** This step previously instructed calling `noesis.scoring.calculate`,
> `noesis.scoring.get_percentile`, and `noesis.user.get_profile` — none of these tools exist. The
> real scoring tools already return everything needed in one call; there's no separate
> percentile-lookup step, and there's no server-side user-profile store to pull 2e context or
> previous results from — gather that from the live conversation instead.

### Step 1: Retrieve Scores
The score itself already carries what you need — there's no separate "calculate" then "get percentile"
round trip:
1. If you administered the assessment yourself, you already have the result dict from
   `score_big_five` or `score_pvq_rr` (see the assessment-guide skill). If the user pastes in prior
   results instead, work from those directly.
2. For Big Five, there is no population-normed comparison at all — `score_big_five`'s own
   `population_norms` field says so explicitly ("not available for this quick screen"). An earlier
   version of this field applied the real TIPI's Gosling/Rentfrow/Swann 2003 norms to this different,
   IPIP-derived item set's raw sums; that was found to be an invalid comparison under any rescaling and
   was removed. Work only from the flat `scores` field (a linear 0-100 rescale per trait) and say so
   plainly if the user asks for a percentile — this instrument doesn't have one.
3. `describe_norm(centile, trait)` is a real tool for turning a genuine population centile into a
   plain-language level — but no `score_*` tool on this server currently hands Big Five a real centile
   to feed it (see #2 above), so don't manufacture one from the flat `scores` field.
4. For PVQ-RR, `score_pvq_rr`'s result already contains `higher_order` (the 4 higher-order value
   categories), `value_scores` (all 10 individual values), and `value_rankings` (ranked by score) —
   there's nothing further to fetch.
5. To connect Big Five results to a specific life domain (clinical, workplace, education,
   relationships, creativity, leadership), call `domain_filtered_report(big5_scores, domain)`.
6. To combine results across more than one instrument into one profile, call
   `battery_aggregate(results, user_id)` (or `battery_aggregate_json` if you're working from a JSON
   string).
7. There is no `noesis.user.get_profile` tool — 2e context, prior assessments, and stated goals are
   not stored server-side. Pull them from what the user has told you in this conversation, and ask
   directly if you need something you don't have: "Have you told me before whether you identify as
   twice-exceptional, or is this the first time we're talking about your results?"

### Step 2: Identify Key Patterns
1. **Top 3 strengths**: Highest percentiles — these define the user's profile
2. **Unique patterns**: Unusual combinations (e.g., high Openness + low Extraversion)
3. **2e signatures**: Combinations common in twice-exceptional adults
4. **Growth edges**: Areas where the user may want support (frame as "areas for growth")

### Step 3: Generate Archetype Name
Create a 3-5 word archetype name that captures the user's essence. Examples:
- "The Deeply Curious Strategist" (High Openness, High Conscientiousness, Low Extraversion)
- "The Compassionate Systems Thinker" (High Agreeableness, High Openness, High Conscientiousness)
- "The Intensely Focused Creator" (High Conscientiousness, High Openness, Low Agreeableness)
- "The Warmly Independent Explorer" (High Agreeableness, High Openness, Low Extraversion)

Use `references/2e-archetypes.md` for common patterns.

### Step 4: Write the Interpretation

Structure the interpretation as:
1. **Opening** — Warm acknowledgment, archetype name
2. **Top strengths** — 2-3 strongest traits with strength-framed descriptions
3. **Unique patterns** — What makes their profile distinctive
4. **2e context** — How this profile shows up in twice-exceptional experience
5. **Growth edges** — 1-2 areas for development, framed as opportunities
6. **Integration** — How the traits work together as a whole
7. **Next steps** — Suggested follow-up assessments or coaching focus. If the user wants to talk to
   a human professional about their results, use `find_counselors(location, focus, max_results)` — a
   real Google Places lookup, not a vetted directory — and always relay its `disclaimer` and
   `crisis_line_note` fields alongside the results. **Availability note (updated 2026-08-08)**: this
   tool is available to every signed-in user — no Premium gate — limited to 20 searches/week and 40
   searches/month per user since it calls a real, paid external API on the user's behalf; check it is
   actually in your tool list before offering it.

### Step 5: Personalize
- Connect to user's stated goals (from coaching context)
- Reference previous assessments if available
- Use the user's own language from the conversation
- Ask: "Does this resonate with how you experience yourself?"

## 2e Context Integration

Twice-exceptional adults often have profiles that look different from typical norms:

### Common 2e Patterns
- **Spiky profiles**: Very high in some traits, very low in others (not "flat")
- **High Openness + High Neuroticism**: The "tortured artist" pattern — deep curiosity with intense emotional experience
- **High Conscientiousness + ADHD**: Compensatory overwork — high effort to manage executive function challenges
- **High Agreeableness + Social Difficulty**: Caring deeply but struggling with social execution
- **Low Extraversion + High Enthusiasm**: Needs solitude but has intense passions

When you see these patterns, name them explicitly and normalize them.

## Special Populations

### AuDHD (Autistic + ADHD)
- Expect contradictory patterns (high structure need + high novelty seeking)
- Frame as "dynamic tension" rather than contradiction
- Emphasize the creativity that comes from holding opposites

### High-Masking Autistic Adults
- Scores may not reflect true preferences (masking distorts responses)
- Invite reflection: "Does this score feel true to you inside, or is this how others see you?"
- Note where masking may be affecting results

### Gifted with Learning Disabilities
- High abstract reasoning + low processing speed
- Frame the gap as "asynchronous development" — a feature, not a bug
- Emphasize the advantages of deep thinking over fast thinking

## Facet-Level Interpretation

When interpreting IPIP-NEO-120 or similar instruments, go to the facet level (not just domain level). Reference `references/ocean-facets.md` for detailed facet descriptions and `references/strength-frames.md` for strength-framed descriptions of each facet.

Always interpret the full 30-facet profile, not just the 5 domains. The facets tell the real story.

## Interpreting the Other 7 Instruments

`strength-frames.md`/`ocean-facets.md` only cover Big Five/IPIP-NEO-120 (OCEAN), and `2e-archetypes.md` is
cross-cutting. Of the remaining public instruments, 7 have their own matching reference file here,
grounded directly in that instrument's actual scoring logic (subscales, real published bands where they
exist, no invented cutoffs where they don't). Load the matching file whenever interpreting that
instrument's result — never improvise interpretation for these from general knowledge of the published
instrument, since several of them implement a narrower or differently-scoped version than their name
might suggest (see each file's own opening section):

| Instrument | Tool | Reference file |
|---|---|---|
| CAT-Q (camouflaging/masking) | `score_cat_q` | `references/cat-q-interpretation.md` |
| ASRS v1.1 Part A (ADHD screener) | `score_asrs_part_a` | `references/asrs-interpretation.md` |
| ECR-R (adult attachment) | `score_ecr_r` | `references/ecr-r-interpretation.md` |
| SWLS (life satisfaction) | `score_swls` | `references/swls-interpretation.md` |
| IPIP-VIA-R Core Strengths | `score_ipip_via_r` | `references/ipip-via-r-interpretation.md` |
| Financial Forecasting & Management Ability | `score_financial_calibration` | `references/financial-calibration-interpretation.md` |
| Wellness Self-Tracking | `score_wellness_tracking` | `references/wellness-tracking-interpretation.md` |

Every one of these files leads with an explicit non-diagnostic/non-clinical statement specific to that
instrument (e.g. ASRS: "a high score describes an attention-pattern tendency, it is NOT a diagnosis"; CAT-Q:
does not diagnose autism; wellness-tracking: "not a medical diagnosis"). Carry that framing into your own
response — don't let the strength-framing soften into an implied diagnosis.

## The 6 Newest Public Instruments Have No Reference File Yet

Cross-Cultural Adaptability (`score_cross_cultural_adaptability`), Research & Analysis Ability
(`score_research_analysis`), Reasoning Style (`score_reasoning_style`), Self-Regulated Learning
(`score_self_regulated_learning`), and Charisma / Self-Presentation (`score_charisma`) — all added
2026-07-28 — plus Reasoning Ability (`score_reasoning_ability`, added 2026-07-30) do **not** yet have a
matching `references/<instrument>-interpretation.md` file, unlike the 7 instruments above. **Say so
plainly if asked to interpret one of these six** — don't improvise a strength-framed narrative from
general knowledge of the cited source theory (Cultural Intelligence theory, lateral-reading/
critical-thinking research, REI-40, Pintrich & De Groot, the General Charisma Inventory, GSM8K/
BIG-Bench-Hard, etc.). Each of these six is either an original composite or an adaptation with no
independent validation of its own — see each tool's own `validation_status` field, which is a stronger
caveat than most of the 7 instruments above carry. (Reasoning Ability is additionally this server's only
objectively-graded PERFORMANCE test rather than a self-report scale — see its own
`distinct_from_reasoning_style` field before treating it as equivalent in kind to the other five.)

Until a dedicated reference file exists, work directly from what the tool's own result already gives
you — every one of these six carries its own `subscale_scores`/`composite_score`/`raw_score` (or
equivalent), `validation_status`, and `disclaimer` fields, so the raw material for an honest,
strength-framed interpretation is already there:
1. Lead with the mandatory `validation_status`/`disclaimer` text (paraphrased warmly, not omitted) —
   these six are original or adapted instruments with no independent validation of their own.
2. Apply the same strength-framing principles from this skill's Core Principle and Score Level Framing
   sections to each subscale/composite score — the mechanics are identical even without a dedicated file.
3. Do not invent a percentile, cutoff, or population comparison — `list_instruments`'s
   `population_norms` field says "not available" for all six, for exactly this reason.
4. If the user wants deeper interpretive nuance than this general approach can honestly provide, say
   plainly that a dedicated reference file doesn't exist for this instrument yet, rather than presenting
   an improvised interpretation with the same confidence as the 7 instruments that do have one.

## Validation

After presenting the interpretation, always ask:
- "How does this land for you?"
- "Is there anything that doesn't feel quite right?"
- "What resonates most?"

Interpretations are collaborative — the user is the expert on their own experience. The assessment data is a starting point for conversation, not a definitive statement.
