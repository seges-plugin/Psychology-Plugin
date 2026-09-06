# ASRS v1.1 Part A Interpretation, Adult ADHD Self-Report Screener

> Source: Kessler, R. C., et al. (2005). The World Health Organization Adult ADHD Self-Report Scale
> (ASRS): a short screening scale for use in the general population. *Psychological Medicine*, 35(2),
> 245-256. The raw result-schema ID `score_asrs_part_a` identifies a returned record; it is not a public
> MCP invocation. The record covers a 6-item, 0-4 frequency scale ("Never" to "Very Often," over the past
> 6 months), scored against the instrument's own published positive-screen rule. ASRS-V1.1 Screener ©
> 2023 New York University and President and Fellows of Harvard College. This file describes how to talk
> about a returned result; it does not reproduce the item text, the per-item scoring rule, or the
> instrument's validation statistics, call `psychology_get_item_bank` for the exact administered wording
> and `psychology_score_asrs_part_a` for the authoritative scoring and threshold logic.

## Read this paragraph first, every time

**ASRS Part A is a screener. It is not a diagnosis, and this file will not treat it as one.** The
instrument's own published validation work (Kessler et al., 2005) reports a screener that, against blind
clinical ratings, catches a majority but not all adults who would meet criteria for ADHD on full clinical
evaluation, meaning a real fraction are missed by a negative screen. A positive screen describes **a
pattern of attention, organization, and activity-level tendencies that is worth a closer look**, it is not,
on its own, evidence that the person has ADHD. Only a clinical evaluation can establish that. Say this
plainly whenever a score is discussed, not as a footnote at the end.

## What the items broadly cover

The six items span two symptom clusters that show up throughout the ADHD literature: an **inattentive-type**
cluster (task follow-through, organization, remembering obligations, avoiding effortful tasks) and a
**hyperactive/impulsive-type** cluster (restlessness, feeling internally "driven"). The returned record
does not compute separate subscores for these two clusters, it returns one combined positive-item count, so
treat this grouping as background for your own understanding of what's being asked, not as a breakdown the
tool itself hands back. For the exact item wording and which items belong to which cluster, call
`psychology_get_item_bank`, do not paraphrase or reconstruct items from memory.

## Strength-framing the pattern, honestly

Whatever the specific items surface, describe the underlying trade-offs honestly rather than only the
downside:

- **Difficulty finishing final details of a task:** often paired with strong initial energy and idea
  generation, the harder part (the interesting part) got done; what's left is frequently the most tedious
  10%. This is a genuine, common pattern, not laziness.
- **Difficulty with organizational tasks:** frequently coexists with strong big-picture or associative
  thinking, systems that require rigid, linear organization can feel like a mismatch for a mind that
  naturally works in networks rather than lists.
- **Trouble remembering appointments/obligations:** working memory for schedule-type information
  specifically, not memory in general, many people with this pattern have excellent memory for content that
  actually interests them.
- **Avoiding/delaying effortful tasks:** task-initiation difficulty is one of the best-documented
  executive-function patterns in ADHD research, and it responds well to external structure (body-doubling,
  externalized deadlines, breaking a task into a concrete first step), this is an environment-and-tooling
  problem far more than a willpower problem.
- **Fidgeting/restlessness:** for many people this is a genuine regulation strategy, not a problem to solve
  away, movement can be exactly what helps sustain attention on a task, not a distraction from it.
- **Feeling internally "driven":** often the flip side of high energy, enthusiasm, and rapid idea
  generation, the same internal drive that makes stillness hard can make someone genuinely energizing to be
  around and highly productive on the right task.

## What a positive screen means, and doesn't

A positive screen (per `psychology_score_asrs_part_a`'s own threshold logic, do not restate or approximate
that logic here) means: on this snapshot, this person's answers land in the range the instrument's
validation research associates with adults who, on further clinical evaluation, are likely to meet criteria
for ADHD. It is an invitation to get clarity, not a conclusion. Useful, honest language: *"Your pattern here
is worth exploring further with a professional if you want a clearer picture, this screener is designed to
flag who should look closer, not to tell you what's actually going on."* If the person wants that next step,
`psychology_find_counselors(location, focus, max_results)` can return local directory listings for a
formal-evaluation conversation. Treat each listing as unverified information, relay any disclaimer or limit
the tool returns, and do not present it as a referral, availability guarantee, or emergency option.

## What a negative screen means, and doesn't

A negative screen means the pattern here didn't cross this screener's threshold, it does **not** mean "you
don't have ADHD." Several things commonly produce a negative screen despite real, present symptoms:

- **Inattentive-presentation-only ADHD** (or the reverse), if someone's difficulty concentrates in one
  cluster without much of the other, they can sit right at the edge of the screening line depending on
  exactly which items cross threshold.
- **Compensation and masking** (see `cat-q-interpretation.md` for the general concept), years of developed
  workarounds can genuinely reduce how often symptoms surface as described in the items, without the
  underlying attentional pattern having changed.
- **Context-dependence**, six months is a long recall window, and someone in an unusually well-structured
  period of life (or answering with a specific easier context in mind) may underreport relative to their
  harder periods.

If someone strongly suspects ADHD despite a negative screen, that suspicion is itself worth taking to a
professional rather than treating the screen as the final word.

## What this file does not tell you

- **Not a diagnosis under any circumstance**, positive or negative.
- **Not the full ASRS.** This is Part A only (the short screener), not the longer Part A+B Symptom
  Checklist and not ASRS-5, which are different instruments with a different licensing posture.
- **Doesn't distinguish presentation type formally.** The inattentive/hyperactive grouping above is
  provided for understanding, not computed by the tool as a subscore.
- **No neurodivergence-adjusted norm exists**, this screener was validated against clinical ratings in the
  general population, not against an ADHD-specific or 2e-specific comparison sample.
- **No item text, per-item thresholds, or validation statistics are reproduced here.** Those live only in
  the instrument's own licensed materials and in the live `psychology_get_item_bank` /
  `psychology_score_asrs_part_a` tool results, never in this file.
