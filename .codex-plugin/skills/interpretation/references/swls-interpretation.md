# SWLS Interpretation, Satisfaction With Life Scale

> Source: Diener, E., Emmons, R. A., Larsen, R. J., & Griffin, S. (1985). The satisfaction with life
> scale. *Journal of Personality Assessment*, 49(1), 71-75. The raw result-schema ID `score_swls` identifies a
> returned record; it is not a public MCP invocation. The record covers 5 items,
> 1-7 scale, summed to a single total (range 5-35), reported against Diener's own published interpretive
> bands, real bands, not invented ones, and not population percentiles.

## What SWLS actually measures

SWLS asks about **life as a whole, judged against standards the respondent sets for themselves**, not
momentary mood, not how today went, and not a comparison to anyone else's life. This is a *cognitive,
evaluative* judgment ("is my life close to what I want it to be"), distinct from *hedonic* wellbeing (how
much positive vs. negative emotion someone feels day to day). A person can have a rough week emotionally
and still report high life satisfaction because their life, overall, matches what they want from it, or
the reverse. Say this distinction plainly if a score surprises someone: SWLS is not asking "how do you
feel right now."

Because SWLS is only 5 items producing one overall number, there are no subscales to separate here, the
whole interpretive task is reading the single total honestly, at whichever band it lands in.

## Diener's published bands, read honestly

| Total | Band |
|---|---|
| 31-35 | Extremely satisfied |
| 26-30 | Satisfied |
| 21-25 | Slightly satisfied |
| 20 | Neutral |
| 15-19 | Slightly dissatisfied |
| 10-14 | Dissatisfied |
| 5-9 | Extremely dissatisfied |

**Extremely satisfied / Satisfied (26-35):** This describes someone who feels their life, on the whole,
matches what they want from it, not that everything is perfect, but that the balance is genuinely good by
their own standard. Worth naming as real and earned, not luck or denial. One honest caution at the very
top of the range: a ceiling-level score can sometimes reflect a habit of rounding up rather than a fully
examined judgment, if it's useful, it's fine to ask "what would make it even better," not to imply the
number itself is suspect.

**Slightly satisfied (21-25):** A genuinely positive-leaning judgment with real room named alongside it,
this is an extremely common, healthy band, not a "should try harder" signal. Useful framing: "more good
than not, with some specific things you'd still want to change", worth naming what those specific things
are, since a vague global score doesn't tell you.

**Neutral (20):** Exactly balanced between satisfaction and dissatisfaction by this respondent's own
standards. Neither a red flag nor a triumph, a genuinely ambivalent or transitional read on life as a
whole, often worth exploring what's driving the ambivalence rather than trying to round it either
direction.

**Slightly dissatisfied (15-19):** More dissatisfaction than satisfaction, but not extreme, this is
common during genuine life transitions (a hard job market, a recent move, a social context ending) and
doesn't by itself indicate anything clinical. Worth asking directly what specifically feels off, since this
band covers a wide range of very different underlying situations.

**Dissatisfied / Extremely dissatisfied (5-14):** Take this seriously and say so directly, this describes
a real, present-tense judgment that life as a whole isn't working for this person right now, by their own
standard. **Do not soften this into false positivity** ("but look at all you have!"), that response
reliably lands as dismissive to someone who has just told you something true and difficult. The right
response is to ask what's driving it, validate that the dissatisfaction is real, and, because this range
of SWLS overlaps with (though is not identical to) the kind of hopelessness named as an Orange-level
indicator in `skills/coaching/references/safety-guidelines.md` ("statements suggesting life lacks meaning
or purpose"), check in directly on mood and safety rather than treating this purely as an assessment
result. SWLS is not a depression or crisis screener and must never be presented as diagnosing either, but
a very low score is real information worth pairing with a direct, caring check-in, not just a number to
report and move past.

## What this file does not tell you

- **Not a depression, anxiety, or crisis screener.** SWLS measures the cognitive/evaluative judgment of
  life satisfaction specifically, it correlates with mood and mental health in the research literature,
  but it is not a diagnostic instrument for any of them, and this file does not treat it as one.
- **Doesn't explain *why*.** The total score carries no information about which life domains (work,
  social contexts, health, purpose) are driving satisfaction up or down, only a conversation surfaces that.
- **Not a comparison to anyone else's life**, and the bands are not population percentiles, they are
  Diener's own published descriptive labels for the raw 5-35 sum.
- **No neurodivergence-specific norm exists.** SWLS was validated on general-population and student
  samples; nothing here adjusts for ND-specific life circumstances.
