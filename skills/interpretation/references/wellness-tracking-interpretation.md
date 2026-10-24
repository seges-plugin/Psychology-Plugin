# Wellness Tracking Interpretation, Daytime Sleepiness & Medication Adherence

> The raw result-schema ID `score_wellness_tracking` identifies a returned record; it is not a public MCP
> invocation. The record covers a **two-part** self-tracking battery. Part (a) is the Epworth Sleepiness
> Scale (Johns, M. W., 1991. A new method for measuring daytime sleepiness. *Sleep*, 14(6), 540-545), an
> 8-item, 0-3 scale, total 0-24. Part (b) is the Adherence to Refills and Medications Scale (ARMS;
> Kripalani, S., et al., 2009. *Value in Health*, 12(1), 118-123), a 12-item, 1-4 scale, total 12-48. **This
> is a personal self-tracking tool. It is not a medical diagnosis, not a substitute for a sleep study or
> medication review, and not treatment advice.** Say this directly, every time, before discussing either
> component. This file does not reproduce either instrument's item text, call `psychology_get_item_bank`
> for the exact administered wording and `psychology_score_wellness_tracking` for the authoritative
> subscale totals.

## Two unrelated things bundled into one tracker

Sleepiness and medication adherence have nothing to do with each other conceptually, they're bundled here
purely as a practical self-tracking pair, not because one predicts the other. Treat them as two completely
separate reports.

## Part (a): Daytime sleepiness (Epworth Sleepiness Scale)

The items ask how likely you'd be to doze off in ordinary low-stimulation, everyday situations. This
measures a **general propensity toward daytime sleepiness across everyday situations**, not how tired you
feel on any one given day.

Johns' own published 5-band scheme:

| Total (0-24) | Band |
|---|---|
| 0-5 | Lower Normal Daytime Sleepiness |
| 6-10 | Higher Normal Daytime Sleepiness |
| 11-12 | Mild Excessive Daytime Sleepiness |
| 13-15 | Moderate Excessive Daytime Sleepiness |
| 16-24 | Severe Excessive Daytime Sleepiness |

**Lower/Higher Normal (0-10):** Within the range Johns' own normal-sample data associates with typical
daytime alertness, individual variation within this range is ordinary and not a concern.

**Mild/Moderate/Severe Excessive (11-24):** This is real, useful, actionable signal, frame it as
information worth acting on, not alarming. Excessive daytime sleepiness has many common, treatable causes:
insufficient sleep duration, sleep-disordered breathing, medication side effects, shift-work schedule
mismatch, and others. The band itself doesn't tell you which, that's exactly what makes a physician or
sleep-specialist conversation useful, especially at Moderate or Severe. Say directly: *"This score doesn't
diagnose anything on its own, but it's a strong enough signal that it's worth bringing to a doctor,
especially if it's new or has been getting worse."*

**A brief, careful ND note:** Both ADHD and autism are associated in the broader literature with sleep
differences (delayed sleep onset, irregular sleep-wake patterns, sensory factors affecting sleep quality),
this is general background, not something this specific scale measures or adjusts for. No
neurodivergence-specific norm exists here; don't imply this score has been calibrated for ND-specific sleep
patterns.

## Part (b): Medication adherence (ARMS)

**Read the direction carefully before saying anything about a score: on this component, a HIGHER total
means WORSE adherence**, the opposite polarity from sleepiness, from SWLS, and from most other instruments
in this product. Getting this backwards would invert the entire interpretation, so state the direction
explicitly whenever discussing a result.

ARMS has two subscales, one covering the mechanics of actually taking medication as directed
(forgetting doses, adjusting or skipping doses on your own), and one covering keeping the prescription
supplied (getting refills before running out, cost as a barrier to refilling). Call
`psychology_get_item_bank` for the exact item wording within each subscale.

**Strength-frame this as a systems problem, not a character problem, because that's what the actual item
content describes.** These are logistics-and-friction questions, not willpower or care questions. A higher
score here is far more usefully read as "the current system around taking/refilling this medication has
more friction than it needs" than as "this person doesn't care about their health." Concrete, non-shaming
next steps by subscale: a pill organizer or phone reminders for medication-taking friction; pharmacy
auto-refill or a calendar reminder for refill friction; and, specifically where cost is the barrier to
refilling, a direct conversation with a pharmacist or prescriber about lower-cost alternatives, since that's
describing a real financial barrier, not a motivation problem.

No published categorical band or cutoff exists for ARMS (unlike the Epworth Sleepiness Scale above), it's
used in the adherence-research literature as a continuous score or in study-specific comparisons, and this
file does not invent a cutoff that doesn't exist. Report and discuss the subscale/total numbers directly
rather than trying to sort them into an invented "good/bad" band.

## The disclaimer that matters most here

**Never suggest changing, starting, or stopping any medication based on this tool alone.** If a medication
regimen feels genuinely hard to sustain, that's a real conversation for a physician (regimen or health
concerns) or a pharmacist (medication-specific questions, cost, timing, interactions), this tool can help
someone notice and name a pattern, but it has no role in deciding what to do about the medication itself.

## What this file does not tell you

- **Not a sleep-disorder or medical diagnosis.** Nothing here substitutes for a sleep study, a medication
  review, or any clinical evaluation.
- **No ARMS cutoff/band exists.** Only Epworth (sleepiness) has a published categorical scheme; adherence
  is continuous only.
- **No item text is reproduced here for either component.** Item wording lives only in the live
  `psychology_get_item_bank` tool result, never in this file, treat any reconstruction from memory as
  unreliable.
- **No neurodivergence-specific norm exists for either component**, the ND note on sleep above is general
  background, not a validated adjustment.
