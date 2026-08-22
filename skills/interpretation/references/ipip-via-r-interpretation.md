# IPIP-VIA-R Interpretation, Core Strengths (3 Global Dimensions)

> Source: Bluemke, M., Partsch, M. V., Saucier, G., & Lechner, C. M. (2021). Human Character in the IPIP.
> PsyArXiv. Partsch, M. V., Bluemke, M., & Lechner, C. M. (2022). Revisiting the hierarchical structure of
> the 24 VIA character strengths: Three global dimensions may suffice to capture their essence. *European
> Journal of Personality*, 36(5), 825-845. Partsch, M. V., Olaru, G., & Lechner, C. M. (2024). Measuring
> Global Character Dimensions. *Journal of Personality Assessment*, 106(5), 665-680. Scored by
> `score_ipip_via_r` (hosted connector): **18 items, 1-5 scale, three dimensions**, Positivity, Dependability,
> Mastery, reported as dimension means. Public domain (ipip.ori.org). **Not affiliated with, produced by,
> or endorsed by the VIA Institute on Character.**

## Read this correction first, what this tool measures is narrower than "24 strengths"

The full published VIA classification (Peterson & Seligman, 2004) organizes 24 character strengths under 6
virtue clusters (Wisdom, Courage, Humanity, Justice, Temperance, Transcendence). **That is not what
`score_ipip_via_r` scores.** This tool implements the *compact, 18-item "Core Strengths" form*, purpose-
built via Ant Colony Optimization specifically to capture the **3 broad global dimensions** the research
found the 24-strength hierarchy collapses into at its highest level (Positivity, Dependability, Mastery),
using far fewer items than the full 96-item, 24-scale instrument would require. If someone (or an earlier
version of this product's own documentation) describes this tool as measuring "24 character strengths
across 6 virtue clusters," that description is describing a *different, unimplemented* instrument, correct
it. Noesis currently offers **dimension-level resolution only** (3 numbers), not strength-level resolution
(it cannot tell you your standing on "curiosity" vs. "kindness" vs. "gratitude" individually). Adding the
full 24-scale pool is a legitimate future expansion, not something available today.

Each dimension is a mean of 6 items (1-5 scale, "Does not apply at all" to "Applies completely"). No
population-normed cutoff exists for this compact form; every level below is described relative to the 1-5
scale itself, not a percentile.

## The three dimensions

### Positivity, hope, gratitude, and felt connection

Items ask about remaining hopeful despite challenges, looking forward to each day, feeling genuinely cared
for by people in your life, and (reverse-scored) finding little to be grateful for, struggling to forgive,
or having difficulty accepting love. Read at the item level, this dimension clusters around what the full
VIA taxonomy calls **Transcendence** (hope, gratitude) and **Humanity** (capacity to love and be loved),
that mapping is this file's own reading of the item content, not a claim the source papers make explicitly.

**Toward the high end:** An focus toward the future and toward connection that holds up under
difficulty, not naive optimism, but a durable sense that things can work out and that you're genuinely
cared for. This is a real psychological resource, strongly associated in the broader wellbeing literature
with resilience during hard periods.

**Toward the low end:** A more guarded social context with hope, gratitude, or felt connection right now.
Frame this honestly rather than glossing it: if the low end reflects real difficulty trusting that things
will improve or that care is genuinely available, that's worth exploring directly, not just relabeling as
a "realistic" personality style. It can also simply reflect a hard current season rather than a fixed
disposition, Positivity, like mood-adjacent constructs generally, moves with circumstance.

### Dependability, integrity, fairness, and reliability

Items ask about making careful choices, not being described as arrogant, believing everyone's rights matter
equally, and (reverse-scored) lying to get out of trouble, getting impatient with others' problems, or
taking advantage of others. This clusters around VIA's **Justice** (fairness) and **Temperance**
(humility, self-regulation) virtues.

**Toward the high end:** A consistent, other-regarding integrity, careful decisions, fairness as a
default, patience with people who are struggling, and a track record others can rely on. This is the
dimension most directly tied to being someone others trust with responsibility.

**Toward the low end:** Be honest about what these items actually ask, rather than reflexively softening
every low score into a positive reframe. Lower Dependability describes more agreement with items about
bending rules for personal convenience, impatience with others' problems, or prioritizing self-interest in
the moment. Where a strength-frame is genuinely warranted: this can reflect flexibility rather than
rigidity about rules, or a more results-focused (less rule-bound) style, particularly for people whose
lived experience has made rigid systems feel unsafe or unfair rather than protective. Where it's not
warranted: if this pattern doesn't feel intentional or aligned with someone's own values, that's worth
sitting with honestly rather than being talked out of via a reframe. Don't manufacture a positive spin this
dimension doesn't support.

### Mastery, independent judgment, perspective, and social effectiveness

Items ask about being an original thinker, having a mature view on life, being valued by friends for good
judgment, and (reverse-scored) not standing up for your beliefs, having trouble guessing how others will
react, or having difficulty getting others to work together. This clusters around VIA's **Wisdom**
(creativity, judgment, perspective) with elements of **Justice**/leadership (getting others to work
together) and **Courage** (standing up for beliefs).

**Toward the high end:** Independent, well-regarded judgment combined with real social effectiveness,
original thinking that other people actually trust and follow, not just novelty for its own sake. This
dimension is the closest of the three to "wisdom" in the everyday sense: knowing what matters and being
able to act on it in ways that bring others along.

**Toward the low end:** Less confidence standing up for your own views, or more difficulty reading how
others will react and coordinating group effort. **A specific, careful note here:** two of this dimension's
reverse-scored items, predicting others' reactions and getting people to work together, touch directly
on social-cognition and coordination, areas where autistic adults commonly score differently for reasons
related to the double empathy problem (a two-way mismatch in social prediction between autistic and
non-autistic people, not a one-sided deficit) rather than a genuine lack of judgment or wisdom. If someone's
lower Mastery score is concentrated in these specific social-prediction items rather than "original
thinker" or "mature view," say so explicitly, the item-level story matters more than the single dimension
mean here.

## Reading the three together

- **High Positivity + high Mastery, lower Dependability**: hopeful, socially effective, independent-minded,
  and comparatively unbound by convention, a profile common among people who create real change but who
  may also chafe against rule-bound systems.
- **High Dependability + high Mastery, lower Positivity**: reliable, fair, and effective, without much
  buoyant optimism carrying it, a steady, competent profile that may benefit from more deliberate attention
  to gratitude and connection rather than assuming they'll take care of themselves.
- **High Positivity + high Dependability, lower Mastery**: warm, hopeful, and trustworthy, with less
  confidence asserting independent judgment or coordinating others, a profile where the person's actual
  good judgment may be under-recognized (by themselves or others) relative to their real reliability and
  warmth.
- **All three high or all three low**: less a "spiky" profile and more a general elevation or dampening
  across everything this compact form measures, worth naming as a current overall state rather than
  necessarily three independent findings.

## What this file does not tell you

- **No per-strength resolution.** This tool cannot tell you your standing on any of the 24 individual VIA
  strengths (curiosity, kindness, gratitude, bravery, etc.), only these 3 broader dimensions.
- **Not affiliated with the VIA Institute on Character.** Results are not official VIA scores or reports;
  say this directly if asked.
- **No established percentile or clinical cutoff** for this compact 18-item form, every description above
  is relative to the 1-5 scale, not a population comparison.
- **No neurodivergence-adjusted norm**, the Mastery note above describes a plausible mechanism from the
  broader double-empathy-problem literature, not something this specific instrument's own validation data
  confirms.
