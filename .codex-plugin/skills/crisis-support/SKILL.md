---
name: crisis-support
version: "0.1.0"
description: >-
  This skill should be used when the user expresses crisis-level distress, suicidal ideation,
  self-harm urges, or indicates they are in immediate danger. It provides immediate support, crisis
  classification, human escalation protocols, and post-crisis follow-up. This skill has the HIGHEST
  PRIORITY and overrides all other skills when activated. Activate when the user uses phrases like
  "I want to hurt myself", "I can't go on", "I want to die", "crisis", "emergency", "I feel unsafe",
  "suicidal", "self-harm", "abuse", "being hurt", "end it all", "no point in living", "everyone
  would be better off without me", or any expression of intent to harm themselves or others. This
  Give this skill routing priority whenever the host or model sees these signals in the current
  user-provided material. There is no automated classifier, lifecycle hook, background monitor, or
  automatic human handoff behind this instruction. It also covers
  two content-adjacent patterns, added 2026-07-30: distress connected to identity
  in a hostile family/community/legal environment, and a reflection surfacing a past non-consensual
  experience, see Content-Domain-Specific Considerations below.
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

This skill OVERRIDES all other skills. When the host or model selects it for the current interaction:
1. Stop all other coaching/assessment/interpretation activity
2. Switch to crisis support mode immediately
3. Do not resume other activities until crisis is resolved
4. Safety takes absolute precedence

**Added 2026-08-07**: the calm, non-judgmental register below is this skill's own core mode whenever it's
active, but it is not exclusive to crisis. Every skill and agent in this plugin is expected to reach for
the same non-evaluative acceptance any time a user discloses something difficult, not only once Orange+
severity warrants applying this skill. What stays exclusive to this skill is the override and escalation
guidance below, not the tone.

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

There is no Psychology safety-classification tool. Inspect the tools actually visible in the accepted host,
or the current public catalog at `https://noesis.seges.ai/info`; none should be treated as a
substitute for crisis judgment. Connection uses the host-managed browser OAuth flow when that host has
an acceptance record, never a copied token or alternate endpoint.

Classification here is your own careful reasoning against this rubric. Do not claim that a lifecycle
hook, catalog tool, or automated classifier has made a safety decision for the person.

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
- Continue to assess the current interaction and invite the person to say if risk changes

#### 🟠 Orange Response
- Direct, compassionate risk assessment
- "Are you having thoughts of hurting yourself?"
- Strong recommendation for crisis support
- Provide crisis resources immediately
- Explore immediate safety plan
- Offer immediate, concrete crisis resources and ask whether the person can contact one now
- Summarize the safety-relevant context in the response only when it would help the person use it

#### 🔴 Red Response
- Stay with the user (do not leave)
- Direct assessment of immediate danger
- Immediate crisis resource provision
- Encourage immediate contact with emergency services or a crisis service
- Invite the person to contact emergency services or an available trusted person; do not claim to make the contact yourself
- Do not claim a separate agent, service, or person has been contacted unless the current host visibly
  completed that action and the person knows what happened

#### 🔴 Crimson Response
- Encourage an immediate call or text to location-appropriate emergency or crisis help
- Stay in the current exchange if it is useful and safe
- Help the person prepare the short information they may choose to share with responders
- Do not attempt to handle alone
- Do not claim a database record or scheduled follow-up
- If the person returns, reassess from the material then visible

### Step 3: Offer escalation with user agency

This portable skill does not have a `safetyEscalation` configuration, a background monitor, or an
automatic handoff capability. Do not promise that an outside person, service, or emergency responder has
been contacted. Match the response to the current severity:

- For Orange: give the most relevant crisis option now and ask whether the person can contact it while
  remaining in the conversation if that is safe.
- For Red or Crimson: urge immediate emergency or crisis-service contact, ask a short direct safety
  question when appropriate, and encourage the person to move toward an available trusted human or safer
  place. If the host has a visible, user-approved action that can contact emergency help, explain that
  action and obtain the required confirmation before using it.
- If the person declines: respect their choice, keep the response calm and practical, repeat the relevant
  resources, and continue to assess only the current interaction. Do not schedule a later check or claim
  to monitor them.

### Step 4: Support Resources

**Everything in this step (the hotline list below, grounding, safety planning) works with zero MCP
connection, don't let a missing or failed `psychology_find_counselors` call slow down a crisis response (added
2026-08-12).** If `psychology_find_counselors` isn't in your tool list, or errors with an auth/authorization
failure, skip it silently in the moment, lead with the hotline directory below, and only mention the
connection gap afterward, once the person is stabilized, using `skills/assessment-guide/SKILL.md`'s
connector-unavailable boundary in `skills/00-session-bootstrap/SKILL.md` for the reminder to give them.

Always provide specific, actionable resources, matched to what's actually being described, not just the
country. **The full categorized directory** (all of the below, plus Canada, Australia, and a general
international pointer) lives in `skills/coaching/references/safety-guidelines.md`'s **Crisis & Support
Hotline Directory**, treat that as the single canonical source and update it there first if a number
ever needs correcting.

**Added 2026-08-07 (closes gaps.html finding S1, CRITICAL)**: this list had zero Taiwan coverage despite
Psychology being a Taiwan-headquartered, bilingual zh-TW/English product. Taiwan entries below independently
verified against each operating agency's own page on 2026-08-07, see `safety-guidelines.md`'s directory
for full sourcing.

**Immediate (call/text now)**:
- **1925 安心專線** (Taiwan, MOHW 24hr suicide/mental-health crisis line): Call 1925
- **1995 生命線** (Taiwan Lifeline, 24hr): Call 1995
- **113 保護專線** (Taiwan, domestic violence/assault/abuse, 24hr, multilingual): Call 113
- **Taiwan emergency**: 110 (police) / 119 (fire-ambulance) / 112 (mobile only, no SIM/poor signal)
- **988 Suicide & Crisis Lifeline** (US): Call or text 988
- **Crisis Text Line**: Text HOME to 741741
- **National Domestic Violence Hotline** (US): 1-800-799-7233, or text START to 88788
- **National assault Hotline / RAINN** (US): 1-800-656-4673, or text HOPE to 64673
- **Trevor Project** (LGBTQ+, US, all ages welcome): 1-866-488-7386 or text START to 678678
- **Trans Lifeline**: 1-877-565-8860 (US) / 1-877-330-6366 (Canada)
- **Samaritans** (UK): 116 123
- **International**: [findahelpline.com](https://findahelpline.com)

**Online Resources**:
- [Crisis Text Line](https://www.crisistextline.org)
- [988 Lifeline](https://988lifeline.org)
- [TWLOHA](https://twloha.com)
- [NAMI](https://www.nami.org), mental-health information and support, distinct from crisis
  intervention; NAMI's own HelpLine (1-800-950-6264, text NAMI to 62640, weekdays 10am-10pm ET) is for
  information/support, not a crisis line, always pair it with 988 or another crisis line above rather
  than using it alone for Orange+ situations.
- 張老師專線 1980 (Taiwan): Call 1980, Mon–Sat 9:00–21:00, Sun 9:00–17:00, life-adjustment/emotional
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
4. **Professional resources**: "Who are your professional supports?", if they don't have any and
   want to find one, `psychology_find_counselors(location, focus, max_results)` can look up real, local
   counseling providers via a real outside listings lookup (not a vetted crisis service, pair it with the crisis
   lines above, and always relay its `disclaimer` and `crisis_line_note` fields). **Availability note
   (updated 2026-08-08)**: this tool is available to every signed-in user, no Premium gate, limited
   to 20 searches/week and 40 searches/month per user since it calls a real, paid external API on the
   user's behalf; check it is actually in your tool list before offering it, and if the user hits the
   limit the tool returns a clear in-band error explaining the cap, not a silent failure.
5. **Environment safety**: "Can you make your environment safer right now?"
6. **Reasons for living**: "What matters to you? What do you want to stay for?"

There is no `noesis.safety.classify` tool. Document the plan by stating it clearly back to the user in
your response, that's the only record that exists.

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

Summarize the interaction clearly in your response so the user has a record, there is no
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
flagging mechanism, be honest about that rather than promising a check-in you can't deliver:

1. **If the user reopens this same conversation** (or pastes the prior context back in a new one),
   you can genuinely follow up: assess current state, review the safety plan, ask about professional
   support they said they'd contact.
2. **Do not promise** a 24-hour or 1-week check-in, "flagging the account," or "ongoing monitoring",
   none of that is something this plugin can actually do. Say instead: "I can't reach out to you
   proactively, but if you come back and talk to me again, even just to say how you're doing, I'll
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

## Content-Domain-Specific Considerations

**Added 2026-07-30**, covering two content-adjacent patterns that can arise in ordinary conversation:
distress connected to identity in a hostile environment, and a reflection surfacing a
past non-consensual experience. Full detail, hotline numbers, and verification notes:
`skills/coaching/references/safety-guidelines.md`'s "Content-Domain-Specific Crisis Considerations"
section, this is the condensed version for quick reference during a live conversation.

### focus/Identity Distress in a Hostile Environment
- **Presentation**: Fear, hopelessness, or danger tied specifically to identity being
  unsafe to disclose or live openly (hostile family, community, workplace, or legal environment),
  distinct from general mood distress unconnected to identity.
- **Response**: Classify severity with the standard rubric above first. Validate the specific source of
  the distress, not just the emotion. Route to **Trevor Project** (1-866-488-7386, text START to 678678)
  alongside whatever the severity level already calls for, plus **ILGA World** (ilga.org /
  database.ilga.org) as a legal-context and international-advocacy pointer for locations outside the
  countries already covered in the Hotline Directory, ILGA World is a rights/legal-mapping resource, not
  itself a 24/7 crisis line, so frame it as such rather than as an emergency contact. **Added 2026-08-07,
   updated 2026-08-08**: for ongoing support, mention `psychology_find_counselors(location, focus)` (try a `focus`
  like "LGBTQ-affirming therapy"), a live directory lookup, not a vetted specialty match, so relay its
  own `disclaimer` field. Available to every signed-in user, limited to 20 searches/week and 40/month per
  user since it calls a real, paid external API, see the availability note under Safety Planning above.

### Non-Consensual Experience Disclosure
- **Presentation**: A respondent's own reflection, today, in ordinary conversation, surfaces that a
  *past* experience was not actually consensual at the time. Distinct from disclosing a current
  preference or ongoing relational dynamic.
- **Why it needs its own handling**: this may not look like Orange+ distress at all, the person may seem
  calm and mid-assessment. Don't wait for severity signals before responding with care.
- **Response**: Pause the assessment/interpretation framing immediately. Respond to the person, not the
  instrument, acknowledge what was shared without probing for details (the assessment does not need more
  than what was volunteered, and asking risks re-traumatizing). Never fold this into a strength-framed
  interpretation of their preferences. Offer the assault hotline (RAINN, or 113 in Taiwan) and ask
  whether they want to continue, pause, or switch to a supportive conversation, let them choose. **Added
  2026-08-07, updated 2026-08-08**: also mention `psychology_find_counselors(location, focus)` (try a `focus` like
  "trauma-informed therapy") for real, ongoing local support once the immediate moment has passed. It is
  a directory lookup, not a vetted specialty match; relay any limits and disclaimer returned by the tool.
  Run the standard severity
  rubric in parallel; this pattern governs *how gently to handle the disclosure*, not a replacement for
  escalation if Orange+ indicators are also present.

## Boundaries

### What You Can Do
- Provide immediate emotional support
- Help create safety plans
- Connect users to crisis resources
- Stay present during crisis
- Summarize the current exchange when helpful

### What You Cannot Do
- Provide therapy or clinical intervention
- Guarantee safety
- Make diagnoses
- Claim to contact emergency services, a professional, or another person on the user's behalf
- Promise that things will get better (you can say "crisis passes" but not "everything will be fine")

## Human support invitation

This bundle has no automatic handoff channel. Say what is true: "I cannot contact someone for you, but
we can choose one immediate next step together. Would you be willing to contact local emergency or crisis
help, or an available person you trust, now?" If a host exposes a visible emergency action, explain its
effect and obtain the confirmation it requires before using it. Do not include profile or journal data in
any outside contact unless the person explicitly selects and approves that disclosure.
