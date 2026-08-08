# ECR-R Interpretation — Experiences in Close Relationships-Revised

> Source: Fraley, R. C., Waller, N. G., & Brennan, K. A. (2000). An item-response theory analysis of
> self-report measures of adult attachment. *Journal of Personality and Social Psychology*, 78(2), 350-365.
> Scored by `score_ecr_r` (noesis-mcp): 36 items, 1-7 scale, two continuous dimensions — **Anxiety** (18
> items) and **Avoidance** (18 items) — reported as subscale means, plus an optional `reference_frame`
> naming which relationship the responses were actually about.

## What ECR-R measures — and the one thing it deliberately does not compute

Adult attachment theory describes two largely independent dimensions of how people relate in close
relationships: how much you worry about a partner's commitment and availability (**Anxiety**), and how
comfortable you are depending on a partner and letting them depend on you (**Avoidance**). Both are
continuous — everyone has *some* position on each, and neither dimension is inherently better or worse to
be higher or lower on.

**`score_ecr_r` reports the two continuous means and nothing else — it does not label a person "secure,"
"anxious," "avoidant," or "fearful."** This is a deliberate design choice, following Fraley's own explicit
guidance that categorizing people from continuous scores loses real information and that if a category is
genuinely needed, the only defensible method is a median split computed on your own sample — not a
universal cutoff. Do not manufacture a category the tool didn't return. What follows below explains the
four-region *concept* from attachment theory generally, purely so you can describe a joint pattern in
plain language — never present it as something this tool calculated or labeled.

## Reference norms — read the caveat, not just the numbers

Fraley's own online sample (N > 17,000, ~73% female, mean age 27) gives Anxiety a mean of 3.56 (SD 1.12)
and Avoidance a mean of 2.92 (SD 1.19). Fraley's own stated caveat: **"these norms should be taken with a
grain of salt"** — it's a general internet-convenience sample, not demographically representative and not
neurodivergence-specific. Use these numbers only as a rough sense of where "typical" sits on this
particular 1-7 scale, never as a validated population percentile.

## The Anxiety dimension

Items ask about fear of losing a partner's love, worry that a partner doesn't really care or will lose
interest, wishing a partner's feelings matched your own intensity, and (reverse-scored) rarely worrying
about abandonment.

**Toward the high end:** You invest deeply in closeness and stay attuned to any sign that it might be at
risk — a kind of relational vigilance that, in its constructive form, shows up as genuine care, attention
to a partner's emotional state, and motivation to repair things quickly when something feels off. The
trade-off is that this attunement can tip into reading threat into ordinary, ambiguous moments (a slow
reply, a distracted partner) and needing more frequent reassurance to settle back down.

**Toward the low end:** You carry a settled, low-worry baseline about whether a partner is committed and
available — you're not scanning for signs of withdrawal, and ordinary relational ambiguity doesn't read as
threatening. This is a real asset for relational stability, though at the very low end paired with high
Avoidance, low anxiety can also reflect genuine emotional distance rather than security (see combinations
below).

## The Avoidance dimension

Items ask about discomfort opening up or depending on a partner, preferring not to show how you feel
"deep down," and (reverse-scored) comfort sharing private thoughts, easily depending on a partner, and
finding it easy to be close or affectionate.

**Toward the high end:** You place a high value on self-sufficiency and maintain a clear sense of self
that doesn't get absorbed into a relationship — independence that can be a genuine strength, especially in
situations that call for functioning well without needing constant relational support. The trade-off is
difficulty leaning on a partner even when support is genuinely available, and discomfort with the
vulnerability that deep closeness requires.

**Toward the low end:** You're comfortable depending on a partner and having them depend on you — sharing
your inner world doesn't feel risky, and closeness itself doesn't trigger a need for distance. This
supports deep interdependence, though at the very low end it can also mean identity feels less separable
from the relationship, which has its own trade-offs during conflict or separation.

## Reading the two dimensions together

These four joint patterns are standard attachment-theory language, not something the tool labels for you —
introduce them explicitly as a *lens for describing the pattern*, never as a diagnosis-style category:

- **Lower Anxiety + lower Avoidance** ("security-leaning"): comfortable both depending on a partner and
  being depended on, without much relational worry. The most common pattern associated with stable,
  satisfying relationships in the research literature — but still a *pattern*, not a personal achievement
  or a moral high ground, and not immune to relationship difficulty from other causes.
- **Higher Anxiety + lower Avoidance** ("anxious/preoccupied-leaning"): deeply values closeness and stays
  engaged in pursuing it, while carrying real worry about whether it's reciprocated equally.
- **Lower Anxiety + higher Avoidance** ("dismissing-avoidant-leaning"): comfortable with independence and
  not prone to relational worry, with less pull toward deep interdependence — self-reliance is the
  organizing strength here.
- **Higher Anxiety + higher Avoidance** ("fearful-avoidant-leaning"): wants closeness and finds it
  threatening at the same time — often the most internally effortful pattern to hold, because the two pulls
  point in opposite directions simultaneously. Naming this tension explicitly (rather than treating it as
  a contradiction to resolve immediately) is usually more useful than picking a side.

**Attachment patterns are not fixed traits.** The research literature on "earned security" is real and
well-established: patterns measured here reflect current relational experience and expectations, and they
do shift — through new relationships, therapy, or deliberate relational work. Never frame a score as a
permanent verdict on how someone is capable of relating.

## Reading `reference_frame`

If the person answered with a specific relationship in mind ("my relationship with my partner of 3
years") rather than "romantic partners in general," say so explicitly when presenting results, and note
that the same person can genuinely score differently about different relationships or life stages. A score
about one specific relationship is not the same thing as a general disposition, and treating it as
interchangeable with a "romantic partners in general" score would misrepresent what was actually measured.

## A note on emotional weight

Attachment questions can surface real pain about a current or past relationship. If that happens, treat it
as a conversation, not just a score to report — a coach, a couples or individual therapist, or a trusted
person may be more useful right now than the number itself. If distress rises to hopelessness, isolation,
or anything resembling the Yellow/Orange indicators in `skills/coaching/references/safety-guidelines.md`,
follow that skill's protocol rather than continuing the assessment framing.

## What this file does not tell you

- **No categorical attachment style.** Never assign "secure," "anxious," "avoidant," or "fearful" as if the
  tool computed it — it didn't, deliberately, per Fraley's own guidance.
- **No neurodivergence-specific norm.** Emerging research specifically studies attachment measures in
  autistic adults, but this is an active, unsettled research area, not something this instrument's existing
  norms account for.
- **Doesn't evaluate a relationship's health or a partner's behavior** — it describes this respondent's own
  reported patterns, not a verdict on anyone else or on the relationship as a whole.
- **Commercial-use licensing for this instrument is unresolved** (fine for personal/non-commercial use;
  contact Fraley directly before any commercial use) — mention only if asked about licensing/redistribution.
