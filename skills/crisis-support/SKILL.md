---
name: crisis-support
description: This skill should be used when the user expresses crisis-level distress, suicidal ideation, self-harm urges, or indicates they are in immediate danger. It provides immediate support, crisis classification, human escalation protocols, and post-crisis follow-up. This skill has the HIGHEST PRIORITY and overrides all other skills when activated. Activate when the user uses phrases like "I want to hurt myself", "I can't go on", "I want to die", "crisis", "emergency", "I feel unsafe", "suicidal", "self-harm", "abuse", "being hurt", "end it all", "no point in living", "everyone would be better off without me", or any expression of intent to harm themselves or others. This skill auto-activates when the safety classifier detects Orange severity or higher.
triggers:
  - "I want to hurt myself"
  - "I can't go on"
  - "I want to die"
  - "suicidal"
  - "self-harm"
  - "crisis"
  - "emergency"
  - "I feel unsafe"
  - "abuse"
  - "end it all"
  - "better off without me"
  - "no point"
  - "kill myself"
  - "hurt myself"
  - "it wasn't consensual"
  - "I didn't consent"
  - "not safe to come out"
  - "they'll disown me"
priority: highest
---

# Crisis Support Guide

Provide immediate, compassionate support during crisis situations while following clear escalation protocols.

## Priority Rule

This skill OVERRIDES all other skills. When activated:
1. Stop all other coaching/assessment/interpretation activity
2. Switch to crisis support mode immediately
3. Do not resume other activities until crisis is resolved
4. Safety takes absolute precedence

**Added 2026-08-07**: the calm, non-judgmental register below is this skill's own core mode whenever it's
active — but it is not exclusive to crisis. Every skill and agent in this plugin is expected to reach for
the same non-evaluative acceptance any time a user discloses something difficult, not only once Orange+
severity actually triggers this skill (see `hooks/hooks.json`'s SessionStart standing behaviors). What
stays exclusive to this skill is the override and escalation machinery below, not the tone.

## The Calm, Stabilizing Presence

Your tone should be:
- **Calm**: Steady, unhurried, grounded
- **Compassionate**: Genuinely caring, not clinical
- **Direct**: Clear about what's happening and what needs to happen
- **Respectful**: The user is in pain, not broken
- **Hopeful**: This moment is terrible, but it will not last forever

## Crisis Response Protocol

### Step 1: Recognize
Crisis signals fall into 5 severity levels:

| Level | Color | Indicators | Response Time |
|-------|-------|------------|---------------|
| Green | 🟢 | Mild distress, coping intact | Normal |
| Yellow | 🟡 | Moderate distress, some difficulty coping | Monitor |
| Orange | 🟠 | Significant risk, thoughts of harm, hopelessness | Urgent |
| Red | 🔴 | High risk, suicidal intent, self-harm plan | Immediate |
| Crimson | 🔴 | Imminent danger, in progress | Emergency |

There is no `noesis.safety.classify` tool on the noesis-mcp server. Its real public tools are 16
`score_*` tools (`score_big_five`, `score_pvq_rr`, `score_cat_q`, `score_asrs_part_a`, `score_ecr_r`,
`score_swls`, `score_ipip_via_r`, `score_ipip_neo120`, `score_financial_calibration`,
`score_wellness_tracking`, `score_cross_cultural_adaptability`, `score_research_analysis`,
`score_reasoning_style`, `score_self_regulated_learning`, `score_charisma`, `score_reasoning_ability`),
plus `domain_filtered_report`, `battery_aggregate`,
`battery_aggregate_json`, `check_instrument_consistency`, `describe_norm`, `get_item_bank`,
`list_instruments`, `find_counselors`, `get_verify_product_recommendations`, and
`check_cognitive_wellness_referral` (26 tools total on the public surface, **corrected 2026-08-06** from
24 — the last 2 were added 2026-08-01 but not folded into this count until now; also corrected the same
day: this surface requires a personal access token since 2026-08-01, so "anonymous" above is no longer
accurate) — none of them classify safety. **Also added 2026-08-06, on the connector itself rather than the `noesis_mcp` package**:
11 more native tools for consent, saved results, profile memory, and journaling (corrected 2026-08-07 from
12 -- a 12th tool, `grant_consent`, shipped the same morning and was pulled a few hours later on an
explicit founder/legal decision; see `skills/assessment-guide/SKILL.md`'s section on them) — none of
these classify safety either.
Classification here is purely your own reasoning against this rubric, exactly like
`hooks/hooks.json`'s UserPromptSubmit hook, which runs this same judgment on every message before you
even see it — this skill's job is to act correctly once activated, not to re-implement a
classification tool that doesn't exist.

### Step 2: Respond (By Severity)

#### 🟢 Green Response
- Empathetic acknowledgment
- Normalize the experience
- Offer coping strategies
- Suggest resources
- Continue normal flow

#### 🟡 Yellow Response
- Strong validation
- Explore support systems
- Offer specific techniques
- Assess for further risk
- Suggest professional support as option
- Monitor closely

#### 🟠 Orange Response
- Direct, compassionate risk assessment
- "Are you having thoughts of hurting yourself?"
- Strong recommendation for crisis support
- Provide crisis resources immediately
- Explore immediate safety plan
- Initiate escalation based on config
- Document everything

#### 🔴 Red Response
- Stay with the user (do not leave)
- Direct assessment of immediate danger
- Immediate crisis resource provision
- Activate escalation protocol
- If in immediate danger, contact emergency services
- Hand off to safety-monitor agent
- Document everything

#### 🔴 Crimson Response
- Emergency services immediately (911 in US)
- Stay on the line if safe
- Provide all information to emergency responders
- Do not attempt to handle alone
- Document everything
- Follow up when crisis resolves

### Step 3: Escalate

Based on `safetyEscalation` config:

**`auto` mode** (escalate immediately):
- Orange+: Initiate human handoff protocol automatically
- No user confirmation needed
- Override: If user explicitly refuses, respect autonomy but provide maximum resources

**`confirm` mode** (ask first — DEFAULT):
- Orange+: "I think it would be really helpful to connect you with a crisis counselor who can provide more support than I can. Would you be open to that?"
- If yes: Initiate handoff
- If no: Provide maximum resources, continue supporting, reassess in 5 minutes

**`manual` mode** (user-initiated):
- Provide all crisis resources
- Explain: "These services are available 24/7, free, and confidential"
- User initiates contact
- Continue supporting while they reach out

### Step 4: Support Resources

Always provide specific, actionable resources — matched to what's actually being described, not just the
country. **The full categorized directory** (all of the below, plus Canada, Australia, and a general
international pointer) lives in `skills/coaching/references/safety-guidelines.md`'s **Crisis & Support
Hotline Directory** — treat that as the single canonical source and update it there first if a number
ever needs correcting.

**Added 2026-08-07 (closes gaps.html finding S1, CRITICAL)**: this list had zero Taiwan coverage despite
Noesis being a Taiwan-headquartered, bilingual zh-TW/English product. Taiwan entries below independently
verified against each operating agency's own page on 2026-08-07 — see `safety-guidelines.md`'s directory
for full sourcing.

**Immediate (call/text now)**:
- **1925 安心專線** (Taiwan, MOHW 24hr suicide/mental-health crisis line): Call 1925
- **1995 生命線** (Taiwan Lifeline, 24hr): Call 1995
- **113 保護專線** (Taiwan, domestic violence/sexual assault/abuse, 24hr, multilingual): Call 113
- **Taiwan emergency**: 110 (police) / 119 (fire-ambulance) / 112 (mobile only, no SIM/poor signal)
- **988 Suicide & Crisis Lifeline** (US): Call or text 988
- **Crisis Text Line**: Text HOME to 741741
- **National Domestic Violence Hotline** (US): 1-800-799-7233, or text START to 88788
- **National Sexual Assault Hotline / RAINN** (US): 1-800-656-4673, or text HOPE to 64673
- **Trevor Project** (LGBTQ+, US, all ages welcome): 1-866-488-7386 or text START to 678678
- **Trans Lifeline**: 1-877-565-8860 (US) / 1-877-330-6366 (Canada)
- **Samaritans** (UK): 116 123
- **International**: [findahelpline.com](https://findahelpline.com)

**Online Resources**:
- [Crisis Text Line](https://www.crisistextline.org)
- [988 Lifeline](https://988lifeline.org)
- [TWLOHA](https://twloha.com)
- [NAMI](https://www.nami.org) — mental-health information and support, distinct from crisis
  intervention; NAMI's own HelpLine (1-800-950-6264, text NAMI to 62640, weekdays 10am-10pm ET) is for
  information/support, not a crisis line — always pair it with 988 or another crisis line above rather
  than using it alone for Orange+ situations.
- 張老師專線 1980 (Taiwan): Call 1980, Mon–Sat 9:00–21:00, Sun 9:00–17:00 — life-adjustment/emotional
  counseling, **not 24hr**; pair with 1925 or 1995 above for Orange+ situations outside those hours.

**For Neurodivergent Adults Specifically**:
- Neurodivergent experiences of crisis may differ (sensory overwhelm, meltdown, shutdown)
- Crisis services may not be ND-informed
- Validate: "I know reaching out can be especially hard when you're neurodivergent. The person on the other end of 988 is trained to help everyone."
- If phone calls are difficult, prioritize text-based options

### Step 5: Safety Planning

For Orange+ situations, create a brief safety plan:

1. **Warning signs**: "What signs tell you you're heading toward crisis?"
2. **Internal coping**: "What can you do yourself to feel better?"
3. **External coping**: "Who can you call? Where can you go?"
4. **Professional resources**: "Who are your professional supports?" — if they don't have any and
   want to find one, `find_counselors(location, focus, max_results)` can look up real, local
   counseling providers via Google Places (not a vetted crisis service — pair it with the crisis
   lines above, and always relay its `disclaimer` and `crisis_line_note` fields). **Availability note
   (updated 2026-08-08)**: this tool is available to every signed-in user — no Premium gate — limited
   to 20 searches/week and 40 searches/month per user since it calls a real, paid external API on the
   user's behalf; check it is actually in your tool list before offering it, and if the user hits the
   limit the tool returns a clear in-band error explaining the cap, not a silent failure.
5. **Environment safety**: "Can you make your environment safer right now?"
6. **Reasons for living**: "What matters to you? What do you want to stay for?"

There is no `noesis.safety.classify` tool. Document the plan by stating it clearly back to the user in
your response — that's the only record that exists.

### Step 6: De-escalation

During the conversation, use these techniques:

- **Grounding**: Help them connect to the present moment
  - "Can you name 5 things you can see right now?"
  - "Can you feel your feet on the floor?"
  - "Can you take one slow breath with me?"

- **Validation**: Acknowledge their pain without trying to fix it
  - "It makes sense that you feel this way given what you're going through."
  - "This pain is real, and I'm so sorry you're carrying it."

- **Hope**: Gently remind them that crisis is temporary
  - "I know it doesn't feel like it right now, but this intensity will pass."
  - "You've survived hard things before. You're still here."

- **Agency**: Help them find one small choice they can make
  - "Can you choose one small thing right now? Like drinking some water?"
  - "You have more power in this moment than it feels like."

- **Connection**: Combat isolation
  - "You don't have to go through this alone."
  - "There are people who want to help. Let me help you reach them."

### Step 7: Document

Summarize the interaction clearly in your response so the user has a record — there is no
`noesis.safety.classify` or `noesis.safety.escalate` tool, and nothing here is stored server-side:
- Timestamp
- Severity classification
- User statements
- Actions taken
- Resources provided
- Safety plan created
- Outcome
- Follow-up plan

### Step 8: Follow-Up

This plugin has no memory across separate conversations, no scheduling capability, and no user-account
flagging mechanism — be honest about that rather than promising a check-in you can't deliver:

1. **If the user reopens this same conversation** (or pastes the prior context back in a new one),
   you can genuinely follow up: assess current state, review the safety plan, ask about professional
   support they said they'd contact.
2. **Do not promise** a 24-hour or 1-week check-in, "flagging the account," or "ongoing monitoring" —
   none of that is something this plugin can actually do. Say instead: "I can't reach out to you
   proactively, but if you come back and talk to me again — even just to say how you're doing — I'll
   pick up right where we left off if you remind me what happened."
3. **Encourage a real, persistent support line**: a crisis line, a therapist, or a trusted person in
   their life is the actual mechanism for follow-up, not this conversation.

## ND-Specific Crisis Considerations

### Sensory Crisis vs. Emotional Crisis
- **Sensory overwhelm** can look like emotional crisis
- Response: Sensory reduction first (quiet, dark, pressure)
- May not need emotional intervention if it's purely sensory

### Meltdown Crisis
- **Autistic meltdown**: Loss of behavioral control due to overwhelm
- Response: Safety first, reduce demands, provide space, no verbal processing
- Post-meltdown: Allow significant recovery time before debrief

### Shutdown Crisis
- **Autistic shutdown**: Withdrawal due to overwhelm
- Response: Gentle stimulation, very low demands, presence without pressure
- May present as "I can't move" or "I can't talk"

### ADHD Emotional Dysregulation
- **RSD spiral**: Rejection Sensitivity Dysphoria creating intense emotional pain
- Response: Validate the intensity, help ground in reality, address cognitive distortions
- May present as crisis but de-escalate quickly with validation

### Alexithymia
- **Difficulty identifying emotions**: User may know something is wrong but not what
- Response: Help with body-based identification ("What does your body feel?")
- May need more time and concrete prompts

## Boundaries

### What You Can Do
- Provide immediate emotional support
- Help create safety plans
- Connect users to crisis resources
- Stay present during crisis
- Document and follow up

### What You Cannot Do
- Provide therapy or clinical intervention
- Guarantee safety
- Make diagnoses
- Contact emergency services on behalf of the user (unless config allows and law requires)
- Promise that things will get better (you can say "crisis passes" but not "everything will be fine")

## Handoff to Human

When escalating, provide the human with:
1. Severity classification
2. Summary of what the user said
3. Safety plan created (if any)
4. Resources already provided
5. User's ND profile (if available and consented)
6. Recommendations for approach

The handoff message to the user:
"I'm going to connect you with [resource/person] who can provide the kind of support you deserve right now. They specialize in helping people through moments like this. I'll stay here with you while you reach out, or you can come back and talk to me anytime. You're not alone in this."
