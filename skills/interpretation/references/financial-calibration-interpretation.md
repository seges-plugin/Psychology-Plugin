# Financial Calibration Interpretation, Financial Forecasting & Management Ability

> The raw result-schema ID `score_financial_calibration` identifies a returned record; it is not a public
> MCP invocation. The record covers a **two-part** self-assessment. Part (a) is Lusardi, A., & Mitchell, O.
> S. (2011). Financial literacy around the world: An overview. *Journal of Pension Economics and Finance*,
> 10(4), 497-508, the real, widely-published "Big Three" financial-literacy quiz. Part (b) is an
> interval-estimation calibration quiz. **Part (b) is this module's own original design, not a published or
> independently validated psychometric instrument**, never describe it to a user as "the Tetlock test," a
> validated calibration scale, or any named published instrument. Say this distinction every time both
> parts are discussed. This file does not reproduce Part (b)'s items or its scoring thresholds, call
> `psychology_get_item_bank` for exact item wording and `psychology_score_financial_calibration` for the
> authoritative interpretation of a given hit rate, that scoring logic is this product's own and is not
> published anywhere else.

## Two genuinely different things bundled into one score

This assessment measures two separate skills that don't always travel together:

1. **Financial literacy** (the Big Three), do you know three specific, well-established financial
   concepts (compound interest, inflation's effect on purchasing power, risk diversification)? This is
   knowledge, and knowledge is learnable.
2. **Calibration** (the interval quiz), when you're uncertain, do you *know how uncertain you are*? This
   is a distinct, general reasoning skill (stating a range wide enough to genuinely capture your
   uncertainty, but not so wide it's useless), studied broadly in judgment-and-decision-making research
   (e.g., Tetlock's forecasting work), though this specific quiz is Psychology's own, unvalidated
   instantiation of that general methodology.

Treat them as two separate stories. A person can be highly financially literate and poorly calibrated, or
the reverse, and the combined read matters more than either number alone.

## Literacy sub-score, the Big Three

The three questions test compound interest/numeracy, inflation's effect on real purchasing power, and
whether a single stock or a diversified fund carries less risk. This is real, externally grounded
information: in the 2021 National Financial Capability Study, **fewer than 30% of US adults answered all
three correctly.**

- **All three correct:** This is genuinely strong performance by national benchmarks, not just "fine",
  worth naming as such directly, since most adults don't reach this level.
- **Two of three correct:** Above the typical US adult result, with one specific core concept still
  missing. Name *which* one (numeracy/compound interest, inflation, or risk diversification) rather than
  leaving it vague, each is independently useful and independently learnable in isolation.
- **One or zero correct:** Frame this as **specific, nameable, learnable gaps**, not a verdict on
  intelligence or general capability. These are three discrete facts and one piece of reasoning, not a
  broad aptitude; each can be picked up directly (a single good explanation of compound interest closes
  that gap completely, unlike, say, a personality trait). Say which concepts are still open and that
  closing them is a matter of specific learning, not general improvement.

## Calibration sub-score, reading direction, not just the number

For each interval item, the person gave a range they were asked to be confident contained the true answer.
**The exact scoring thresholds that turn a hit rate into "underconfident" / "well-calibrated" /
"overconfident" are this product's own internal logic and live only in
`psychology_score_financial_calibration`'s return value, never restate or approximate them here.** With
only a handful of items, small differences in hit rate carry real sampling noise, so treat whatever
direction the tool reports as the signal, not the precise percentage.

Read whichever direction the tool returns as follows:

- **Underconfident:** The stated ranges were wider than needed. Strength-frame this honestly: this is a
  genuine, useful form of epistemic humility, better to know the edges of your own uncertainty than to
  pretend to more precision than you have. The corresponding growth edge: ranges this wide are sometimes too
  wide to actually act on, if every estimate spans an enormous range, it may be worth practicing narrower,
  still-honest ranges for decisions that require a real number to act on.
- **Overconfident:** True values fell outside the stated ranges more often than a well-calibrated respondent
  should allow, the ranges were narrower than the actual uncertainty warranted. This is worth naming
  plainly rather than softening, because overconfidence in forecasting has real downstream costs (see
  combined pattern below), but frame the *skill* (stating a range at all, engaging seriously with an
  uncertain question) as the strength to build from, with "make the range a little wider than feels natural"
  as the concrete, learnable adjustment.
- **Well-calibrated:** No strong over- or under-confidence signal. This is the pattern most useful for real
  forecasting and planning tasks: confidence that actually tracks accuracy.

## Reading the two together

The module's own combined interpretation logic is worth preserving honestly, not softening into
meaninglessness:

- **High literacy + well-calibrated:** The strongest combined pattern for financial forecasting and
  planning tasks specifically, correct core knowledge paired with honest, accurate uncertainty.
- **High literacy + overconfident:** Knows the concepts but states ranges narrower than the real
  uncertainty warrants, a common and specific pattern where technical knowledge outpaces humility about
  estimation error. Worth naming directly: confidence and correctness aren't the same thing, and this
  pattern is exactly where the gap between them shows up.
- **High literacy + underconfident:** Knows the concepts but hedges wider than necessary, accurate, but
  potentially less decision-useful if the ranges are too wide to act on.
- **Gaps in literacy + overconfident:** Say this one plainly, because the module's own design treats it as
  the pattern most worth flagging: incomplete grasp of the core concepts *combined with* forecast ranges
  stated with unwarranted narrowness is the combination most likely to lead to poor financial decisions
  made with real, unearned certainty. This is not a moral failing and both halves are independently
  fixable, but don't dilute this specific combination into a generic "you're doing great" message. Name it,
  then point at the two concrete, separate fixes (the missing concept(s); wider ranges next time).
- **Mixed / doesn't fit a clean pattern:** Report the two sub-scores individually rather than forcing a
  single combined narrative, the module's own scoring logic explicitly declines to synthesize a combined
  story when the two don't point the same direction, and neither should you.

## What this file does not tell you

- **The calibration quiz is not a published or independently validated instrument.** It uses a real,
  well-established general methodology (interval-estimation calibration testing), but this specific set has
  no external reliability/validity study. Say this whenever discussing it.
- **No exact scoring thresholds are reproduced here.** The hit-rate cutoffs that separate underconfident /
  well-calibrated / overconfident are internal to `psychology_score_financial_calibration` and are not
  published or restated in this file.
- **Not investment advice, and not a financial-capability diagnosis.** This is a self-assessment of
  specific knowledge and a general reasoning skill, it must never be the sole basis for an actual financial
  decision, and it says nothing about someone's real-world financial behavior or outcomes.
- **Small-sample calibration noise.** With only a handful of calibration items, achievable hit rates move
  in large increments, treat the direction as the signal, the exact percentage as approximate.
- **No neurodivergence-specific norm** exists for either sub-instrument.
