# Safety Guidelines — Crisis Response and Professional Referral

> This document provides detailed protocols for crisis response, human professional referral, and safety monitoring during coaching and assessment interactions. It is referenced by the coaching, crisis-support, and safety-monitor skills.
>
> **Corrected 2026-07-25, counts refreshed 2026-07-30, 2026-08-07**: earlier text on this page called
> `noesis.safety.classify`, `noesis.safety.escalate`, and `noesis.coaching.log_session` — none exist on
> the noesis-mcp server (its 26 real public tools, corrected 2026-08-07 from 24 — two more,
> `get_verify_product_recommendations` and `check_cognitive_wellness_referral`, were added 2026-08-01 but
> not folded into this count until now — score 16 instruments plus domain-filtering, aggregation, norm
> description, instrument-naming consistency checks, item-bank/instrument-catalog discovery, referral
> suggestions, and counselor lookup — none of them classify safety; separately, 11 more native connector
> tools for consent/results/profile/journaling, added 2026-08-06, also don't classify safety — see
> `skills/assessment-guide/SKILL.md`'s section on them).
> Severity classification is always
> your own reasoning against the rubric below, never a tool call — this matches
> `hooks/hooks.json`'s UserPromptSubmit hook, which performs the same reasoning-only check on every
> message. When you want to help the user find real, local professional support, use
> `find_counselors(location, focus, max_results)` (a live Google Places lookup, not a vetted
> directory — always relay its `disclaimer` and `crisis_line_note` fields) alongside the directories
> listed below. **Availability note, updated 2026-08-08**: the Premium gate described in an earlier
> 2026-08-07 note here has been removed — `find_counselors` is available to every signed-in user, no
> paywall. It's limited to 20 searches/week and 40 searches/month per user (a per-user,
> database-backed usage cap, not a billing gate) because it calls a real, paid external API (Google
> Places) on the user's behalf. Always relay its own `disclaimer` and `crisis_line_note` fields
> regardless. If a user hits the weekly/monthly limit, the tool returns a clear in-band error
> explaining the cap — never a silent failure, and never a Premium-upgrade pitch.
>
> **Expanded 2026-07-30**: this page previously had only 4 US hotlines inline in prose (988, Crisis Text
> Line, Samaritans UK, Trevor Project + Trans Lifeline), with no Domestic Violence, Sexual Assault, or
> general mental-health-information line, and only one non-US country represented — a real,
> currently-live safety-coverage gap despite this rubric already naming domestic violence/abuse as a
> trigger category below. Closed by merging in (and independently re-verifying, not trusting verbatim) a
> recovered draft, `_recovered-from-kimi-zip/noesis-plugin-extra/references/crisis-protocol.md` — see
> the new **Crisis & Support Hotline Directory** section below.
>
> **Expanded 2026-08-07 (closes gaps.html finding S1, CRITICAL)**: even after the 2026-07-30 expansion
> above, this directory still had zero Taiwan coverage — a real, live gap given Noesis is a
> Taiwan-headquartered, bilingual zh-TW/English product. Added 1925, 1995, 113 (in both the Domestic
> Violence and Sexual Assault tables), 110/119/112 emergency numbers, and 1980 (Mental-Health-Information
> table, since it is not 24hr) — see the dated verification note under the Hotline Directory below for
> sourcing.

---

## 5-Level Severity Classification

### 🟢 Green — Mild Distress
**Indicators**: 
- Vague statements about stress or feeling down
- General expressions of frustration
- Low mood but with clear capacity for coping

**Response**:
- Empathetic acknowledgment
- Normalizing the experience
- Offering evidence-based coping strategies
- Suggesting self-care resources

**Escalation**: None required

**Example**: "Work has been really stressful lately."
→ "I'm sorry to hear work has been stressful. That's really hard, and it makes sense that you'd feel that way. Would you like to explore some strategies for managing work stress, or is there something else that would be helpful right now?"

---

### 🟡 Yellow — Moderate Distress
**Indicators**:
- Explicit statements of sadness, anxiety, or overwhelm
- Difficulty coping but still engaged
- Expressions of feeling stuck or trapped
- Mild hopelessness ("I don't know what to do")
- Sleep or appetite disruption mentioned

**Response**:
- Validate feelings strongly
- Explore coping resources and support systems
- Offer specific, evidence-based techniques
- Gently assess for further risk
- Suggest professional support as option (not requirement)

**Escalation**: None immediate, but monitor for change

**Example**: "I feel like I'm drowning. Nothing I do helps."
→ "It sounds like you're carrying an enormous weight right now, and I'm really sorry you're feeling this way. The fact that you're reaching out tells me there's still a part of you that wants things to be different, and that part matters. Let's take this one step at a time. Can you tell me more about what 'drowning' feels like for you right now? And do you have anyone in your life you can talk to about this?"

---

### 🟠 Orange — Significant Risk
**Indicators**:
- Expressions of significant hopelessness
- Statements suggesting life lacks meaning or purpose
- Mention of self-harm thoughts without intent or plan
- Indirect references to suicide ("I wish I wouldn't wake up")
- Expressions of being a burden to others
- Severe isolation described
- Indications of abuse or unsafe living situation
- Substance abuse as coping mechanism

**Response**:
- Directly but compassionately assess risk
- Strong recommendation for professional support
- Provide crisis resources (hotlines, text lines)
- Explore immediate safety plan
- Do NOT leave the conversation without a safety plan
- Document by summarizing the classification, statements, and plan in your response — there is no
  `noesis.safety.classify` or `noesis.safety.escalate` tool; nothing is persisted server-side. This
  is LLM reasoning against the rubric below, the same reasoning-only approach used by
  `hooks/hooks.json`'s UserPromptSubmit hook.

**Escalation**: Based on `safetyEscalation` config:
- `auto`: Initiate escalation protocol immediately
- `confirm`: Ask user's permission to connect them with crisis support
- `manual`: Provide all resources, let user initiate

**Example**: "Sometimes I think everyone would be better off without me."
→ "I'm really concerned to hear you say that. It sounds like you're in tremendous pain right now. Can you tell me — are you having thoughts of hurting yourself? I want to understand what you're going through so I can help you get the right support. There are people who specialize in helping with these feelings, and I want to make sure you can reach them."

---

### 🔴 Red — High Risk
**Indicators**:
- Explicit suicidal ideation with intent
- Specific method mentioned without immediate plan
- Recent self-harm behavior
- Severe dissociation or psychosis
- Active domestic violence
- Child or elder abuse disclosed
- Substance use to the point of danger

**Response**:
- Stay with the user (do not end conversation)
- Direct, compassionate assessment of immediate danger
- Immediate crisis resource provision
- Activate escalation protocol (regardless of config setting)
- If user is in immediate danger, contact emergency services
- Document everything
- Hand off to safety-monitor agent

**Escalation**: Immediate. Override user preferences if necessary.

**Crisis Resources to Provide**: at minimum, US 988 (call or text) or Crisis Text Line (Text HOME to
741741) — see the **Crisis & Support Hotline Directory** section below for the complete, categorized
list (domestic violence, sexual assault, mental-health-information, LGBTQ+, and non-US/international
coverage). Match the resource to what's actually being described, not just the country — e.g. lead with
the Domestic Violence or Sexual Assault line, not only the general crisis line, when that's what the
disclosure is actually about.

**Example**: "I've been thinking about ending it. I have pills."
→ "I'm really glad you told me this. It takes courage to share something this heavy. Your life matters, and I want to help you stay safe right now. Can we get you to a place where you're not alone? I'm going to give you the number for the Suicide & Crisis Lifeline — they have trained counselors who can talk with you right now: 988. You can call or text. Would you be willing to reach out to them? I can stay here with you while you do."

---

### 🔴 Crimson — Imminent Danger
**Indicators**:
- Suicide in progress or imminent (minutes to hours)
- Specific plan, means, and timeframe stated
- Goodbye messages or giving away possessions
- Psychosis with command hallucinations
- Immediate physical danger (violence in progress)
- Severe intoxication with suicidal intent

**Response**:
- **EMERGENCY**: Contact emergency services immediately (911 in US)
- Stay on the line if safe to do so
- Do NOT attempt to handle alone
- Provide all information to emergency responders
- Document everything
- Follow up when crisis resolves

**Escalation**: Automatic emergency response. User preference is overridden.

---

## Crisis & Support Hotline Directory

**Added 2026-07-30** — consolidates what used to be an ad hoc list embedded only in the Red-level
section above into one comprehensive, categorized directory, closing a real coverage gap: this document
previously had no dedicated Domestic Violence, Sexual Assault, or general mental-health-information line,
and only one non-US country represented in running prose. Built by merging in a recovered draft
(`_recovered-from-kimi-zip/noesis-plugin-extra/references/crisis-protocol.md`) and then independently
re-verifying every entry against the organization's own site or an equally authoritative secondary source
(2026-07-30) — this mattered in practice: the recovered draft's Canada entry had gone stale (see the note
under that table), which is exactly why nothing here was trusted verbatim.

**This is now the single canonical hotline list for this plugin.** The Red-level section above and
`skills/crisis-support/SKILL.md`'s own Step 4 both point here rather than keeping their own copies — if
a number ever needs correcting, correct it here first.

### General crisis (suicide, self-harm, immediate danger)

| Region | Service | Contact |
|---|---|---|
| Taiwan | 1925 安心專線 (Peace of Mind Line, MOHW; the number is a homophone for "still love me") | Call **1925**, free, 24/7 |
| Taiwan | 1995 生命線 (Lifeline Taiwan) | Call **1995**, free, 24/7 |
| Taiwan | Emergency — police (active/immediate physical danger) | Call **110** |
| Taiwan | Emergency — fire/ambulance | Call **119** |
| Taiwan | Emergency — mobile phones only, no SIM card or poor signal (routes to 110/119) | Call **112** |
| US | 988 Suicide & Crisis Lifeline | Call or text **988** |
| US | Crisis Text Line | Text **HOME** to **741741** |
| UK | Samaritans | Call **116 123** |
| UK | Shout Crisis Text Line | Text **SHOUT** to **85258** |
| UK | CALM (Campaign Against Living Miserably; men-focused, all welcome) | Call **0800 58 58 58** (5pm–midnight daily) |
| UK | Papyrus HOPELINE247 (age 35 and under, or concerned about someone who is) | Call **0800 068 4141**, text **HOPE** to **88247** |
| Canada | 9-8-8 Suicide Crisis Helpline | Call or text **988** (all provinces/territories except Quebec) |
| Canada (Quebec) | 1-866-APPELLE | Call **1-866-277-3553**, text **535353**, or [suicide.ca](https://suicide.ca) |
| Australia | Lifeline | Call **13 11 14**, or text **0477 13 11 14** |
| Australia | Beyond Blue | Call **1300 224 636** |
| International | [findahelpline.com](https://findahelpline.com) | Verified helpline directory, 130+ countries |
| International | [IASP Crisis Centres & Helplines](https://www.iasp.info/crisis-centres-helplines/) | International Association for Suicide Prevention's directory |
| International | [befrienders.org](https://www.befrienders.org) | Worldwide volunteer network, 32 countries |

**Correction, verified 2026-07-30**: the recovered draft this table was partly built from listed "Talk
Suicide Canada, 1-833-456-4566" as Canada's line. That service was renamed and folded into the **9-8-8
Suicide Crisis Helpline** nationwide on 2023-11-30 (confirmed against the Mental Health Commission of
Canada, CAMH, and Government of Canada sources) — the old number should no longer be given out. Quebec
runs its own separate, still-current service outside the 988 rollout (1-866-APPELLE); everywhere else in
Canada, 988 is correct. **If you are a future session updating this table, re-verify non-US/UK country
lines before trusting them** — this Canada correction is proof international crisis-line infrastructure
changes over time, not a one-off.

### Domestic violence

| Service | Contact | Notes |
|---|---|---|
| 113 保護專線 (Protection Line, Taiwan) | Call **113** | 24/7, free, covers domestic violence, sexual assault, and child/elder/disability abuse in one unified line (reporting and counseling together) — multilingual: Mandarin, Taiwanese, English, Vietnamese, Indonesian, Thai, Japanese. For an active, in-progress physical-danger situation, also call **110** (police) directly. [dep.mohw.gov.tw](https://dep.mohw.gov.tw/DOPS/cp-1183-6499-105.html) |
| National Domestic Violence Hotline (US) | Call **1-800-799-7233**, text **START** to **88788** | 24/7, free, confidential, 200+ languages via interpreter. [thehotline.org](https://www.thehotline.org) |

### Sexual assault

| Service | Contact | Notes |
|---|---|---|
| 113 保護專線 (Protection Line, Taiwan) | Call **113** | Same unified 24/7 line as the Domestic Violence entry above — Taiwan does not run a separate dedicated sexual-assault-only line the way the US (RAINN) does. |
| National Sexual Assault Hotline / RAINN (US) | Call **1-800-656-4673** (656-HOPE), text **HOPE** to **64673** | 24/7, free, confidential, English and Spanish. [rainn.org/hotline](https://rainn.org/hotline) |

### Mental-health information and support (not crisis-specific)

| Service | Contact | Notes |
|---|---|---|
| 張老師專線 1980 (Teacher Zhang Line, Taiwan) | Call **1980** | Mon–Sat 9:00–21:00, Sun 9:00–17:00. Life-adjustment and emotional counseling — **not** a 24hr crisis line, unlike every other Taiwan entry in the General Crisis table above; always pair with 1925 or 1995 for Orange+ situations, especially outside these hours. [1980.org.tw](https://www.1980.org.tw) |
| NAMI HelpLine (US) | Call **1-800-950-6264**, text **NAMI** to **62640** | Mon–Fri 10am–10pm ET. Information, resources, and emotional support — **not** a crisis line; always pair with 988 or another crisis line above, don't use alone for Orange+ situations. |

### LGBTQ+-specific

| Service | Contact | Notes |
|---|---|---|
| Trevor Project (US, LGBTQ+ youth-focused, all ages welcome) | Call **1-866-488-7386**, text **START** to **678678** | 24/7. This is Trevor Project's own independent line — cite it directly rather than a 988 sub-menu option: the federal 988 LGBTQ+-specialized routing option ("Press 3") was shut down mid-2025 and its restoration status has changed more than once since, while Trevor Project's own number has stayed stable throughout. |
| Trans Lifeline | US: **1-877-565-8860** · Canada: **1-877-330-6366** | Peer support, run by and for trans people. |

**Verification note**: every number in this directory was independently checked against the
organization's own website or an equally authoritative secondary source (e.g. a national health service)
on 2026-07-30, except the two long-standing US lines (988, Crisis Text Line) already live in this document
beforehand, which were kept as-is on the basis that both have been stable and in continuous nationwide use
for years. If you're reading this significantly later than 2026-07-30, re-verify before relaying any of
these — the same way this pass re-verified the ones it inherited rather than trusting them indefinitely.

**Added 2026-08-07 (closes gaps.html finding S1, CRITICAL)**: this directory had **zero Taiwan
coverage** despite Noesis being a Taiwan-headquartered, bilingual zh-TW/English product — a real, live
gap, not a cosmetic one, given how plausible a Taiwan-based user in crisis is. Six Taiwan entries added
above (1925, 1995, 113 in both the Domestic Violence and Sexual Assault tables, 110/119/112 emergency
services, and 1980 in the Mental-Health-Information table), each independently verified against its own
operating agency's official page on 2026-08-07, not invented or guessed: 1925's number and 24hr status
against 衛生福利部/Ministry of Health and Welfare ([mohw.gov.tw](https://www.mohw.gov.tw/cp-16-19209-1.html));
1995's number and 24hr status against 社團法人國際生命線台灣總會
([life1995.org.tw](https://www.life1995.org.tw)); 113's scope (DV + sexual assault + abuse in one line)
and multilingual support against 衛生福利部保護服務司
([dep.mohw.gov.tw/DOPS](https://dep.mohw.gov.tw/DOPS/cp-1183-6499-105.html)); 1980's number and — this
mattered enough to place it in a different table — its **non-24hr** operating hours, directly against
財團法人張老師基金會 ([1980.org.tw](https://www.1980.org.tw)); and 110/119/112's respective scopes (police /
fire-ambulance / mobile-only-no-SIM) against 內政部消防署/National Fire Agency
([nfa.gov.tw](https://www.nfa.gov.tw)). Re-verify if reading this significantly later, per this
directory's own standing convention above.

---

## Professional Referral Guidelines

### Types of Professionals

| Professional | Specialization | When to Refer |
|--------------|---------------|---------------|
| **Psychiatrist (MD/DO)** | Medication management, severe mental illness | Psychosis, severe depression, bipolar, schizophrenia, medication needs |
| **Clinical Psychologist (PhD/PsyD)** | Therapy, assessment, diagnosis | Therapy needs, formal diagnosis, complex cases |
| **Licensed Therapist (LCSW/LPC/LMFT)** | Therapy, counseling | Ongoing therapy, relationship issues, general mental health |
| **ADHD Coach** | Executive function coaching | ADHD-specific executive function support |
| **Autism Specialist** | Autism-specific support | Autism assessment, social skills, sensory needs |
| **Occupational Therapist** | Sensory integration, daily living skills | Severe sensory issues, daily living support |
| **ND-Affirming Therapist** | Understands neurodivergence | Any ND client — this should be the default preference |

### How to Make a Referral

1. **Normalize**: "Working with a professional can be really helpful for what you're describing."
2. **Be specific**: "A therapist who specializes in neurodivergent adults would be ideal."
3. **Provide options**: Give 2-3 specific resources or directories
4. **Set expectations**: "Finding the right fit might take a few tries — that's normal."
5. **Follow up**: "Can I ask how the search is going next time we talk?"

### ND-Affirming Therapy Directories
- [AANE Therapist Directory](https://www.aane.org) (US)
- [Psychology Today — Autism filter](https://www.psychologytoday.com)
- [ADDitude Magazine Directory](https://www.additudemag.com)
- [NeuroClastic Resources](https://neuroclastic.com)
- Local autism/ADHD support organizations

### ND-Affirming Therapy Characteristics
A good ND-affirming therapist:
- Uses identity-first language unless client prefers otherwise
- Understands masking and its costs
- Doesn't pathologize ND traits
- Knows the double empathy problem
- Understands sensory needs
- Recognizes that standard CBT may need adaptation for ND clients
- Understands alexithymia, interoception differences, and RSD

---

## Safety Monitoring Protocols

### During Every Session
1. **Mood check-in**: Ask how they're doing at the start
2. **Watch for changes**: Sudden drops in mood or engagement
3. **Listen for keywords**: Crisis language, hopelessness, worthlessness
4. **Monitor energy**: Exhaustion can precede crisis
5. **Track themes**: Recurring themes of death, worthlessness, giving up

### Between Sessions
There is no EMA/check-in data store and no cross-conversation memory of any kind (see the
`ema-review` skill's correction) — nothing here can review "trends" between conversations. The only
real signal is what shows up **within a single ongoing conversation**: a noticeable shift in tone,
energy, or content as the user describes their days, which you can reflect back honestly ("You've
mentioned feeling more drained lately — does that match how it feels?") without implying it came from
any stored trend data.

### Post-Crisis Follow-Up
This plugin has no scheduling capability and no memory across separate conversations (see
`crisis-support`'s Step 8) — it cannot check in after 24 hours or a week, and cannot "monitor" anyone
over time. Never promise otherwise. What's real:
1. **If the user reopens this same conversation** (or brings the context back into a new one),
   genuinely follow up: assess current state, review the safety plan, ask whether they connected
   with the professional support discussed.
2. **Say so plainly** instead of promising a check-in you can't deliver — see `crisis-support`'s
   Step 8 for exact language to use.
3. **Documentation** means summarizing the interaction in your response so the user has a record —
   nothing here is persisted server-side.

---

## Documentation Requirements

All safety-relevant interactions should be summarized in your response so the user can keep a record
if they want one:
- Timestamp of interaction
- Severity classification (Green→Crimson) — your own reasoning against the rubric above, not a tool
  call
- User statements that triggered concern
- Actions taken (resources provided, escalation initiated)
- Outcome (user status at end of interaction)
- Follow-up plan

There is no `noesis.safety.classify` or `noesis.coaching.log_session` tool — nothing described here
is stored server-side. Documentation in this plugin means "state it clearly in the conversation," not
"write it to a database."

---

## Self-Care for the AI Assistant

While AI doesn't have emotions, maintaining appropriate boundaries is important:
- Do not make promises you can't keep ("Everything will be okay")
- Do not take responsibility for user's safety beyond appropriate scope
- Do not provide therapy — coach and support, then refer
- Do not minimize or dismiss user's experience
- Do maintain calm, steady presence even in crisis
- Do follow protocols — they exist for a reason
- Do escalate when in doubt — better to over-escalate than under-escalate
