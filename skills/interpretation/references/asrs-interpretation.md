# ASRS v1.1 Part A Interpretation, Adult ADHD Self-Report Screener

> Source: Kessler, R. C., et al. (2005). The World Health Organization Adult ADHD Self-Report Scale
> (ASRS): a short screening scale for use in the general population. *Psychological Medicine*, 35(2),
> 245-256. The raw result-schema ID `score_asrs_part_a` identifies a returned record; it is not a public
> MCP invocation. The record covers 6 items, 0-4 frequency scale ("Never" to "Very
> Often," over the past 6 months), each with its own positive-response threshold (not a uniform cutoff).
> ASRS-V1.1 Screener © 2023 New York University and President and Fellows of Harvard College.

## Read this paragraph first, every time

**ASRS Part A is a screener. It is not a diagnosis, and this file will not treat it as one.** Kessler et
al.'s own validation data reports **68.7% sensitivity and 99.5% specificity** for the "4 or more of 6"
threshold this tool uses, against blind clinical ratings. In plain terms: among people who would actually
meet criteria for adult ADHD on full clinical evaluation, this screener catches roughly 7 in 10, meaning
close to a third are missed by a negative screen. And a positive screen describes **a pattern of
attention, organization, and activity-level tendencies that is worth a closer look**, it is not, on its
own, evidence that the person has ADHD. Only a clinical evaluation can establish that. Say this plainly
whenever a score is discussed, not as a footnote at the end.

## What the 6 items actually cover

The six items span two symptom clusters that show up throughout the ADHD literature, four items track
**inattentive-type** patterns, two track **hyperactive/impulsive-type** patterns. The returned record with
raw schema ID `score_asrs_part_a` does not compute separate subscores for these two clusters (it returns one combined `positive_count` across all
6), so treat this grouping as background for *your own* understanding of what's being asked, not as a
breakdown the tool itself hands back:

**Inattentive-type items (1-4):**
1. Trouble wrapping up the final details of a project once the hard parts are done
2. Difficulty getting things in order for a task that requires organization
3. Problems remembering appointments or obligations
4. Avoiding or delaying tasks that require a lot of thought

**Hyperactive/impulsive-type items (5-6):**
5. Fidgeting or squirming when required to sit for a long time
6. Feeling overly active, "driven by a motor"

Each item has its own positive-response threshold, not a shared one, items 1-3 count as positive at
"Sometimes" or above; items 4-6 require "Often" or above. This asymmetry is Kessler et al.'s own design
choice, tuned to minimize the gap between false positives and false negatives against real clinical
ratings, it is not an error to explain away if someone notices their "Sometimes" answers on the first
three items counted differently than their "Sometimes" answers on the last three.

## Strength-framing each pattern, honestly

These six patterns describe real trade-offs, not just deficits, and describing only the downside would
be its own kind of inaccuracy:

- **Difficulty finishing final details (item 1):** often paired with strong initial energy and idea
  generation, the harder part (the interesting part) got done; what's left is frequently the most
  tedious 10%. This is a genuine, common pattern, not laziness.
- **Difficulty with organizational tasks (item 2):** frequently coexists with strong big-picture or
  associative thinking, systems that require rigid, linear organization can feel like a mismatch for a
  mind that naturally works in networks rather than lists.
- **Trouble remembering appointments/obligations (item 3):** working memory for schedule-type information
  specifically, not memory in general, many people with this pattern have excellent memory for content
  that actually interests them.
- **Avoiding/delaying effortful tasks (item 4):** task-initiation difficulty is one of the best-documented
  executive-function patterns in ADHD research, and it responds well to external structure
  (body-doubling, externalized deadlines, breaking a task into a concrete first step), this is a
  environment-and-tooling problem far more than a willpower problem.
- **Fidgeting/restlessness (item 5):** for many people this is a genuine regulation strategy, not a
  problem to solve away, movement can be exactly what helps sustain attention on a task, not a
  distraction from it.
- **Feeling "driven by a motor" (item 6):** often the flip side of high energy, enthusiasm, and rapid
  idea generation, the same internal drive that makes stillness hard can make someone genuinely
  energizing to be around and highly productive on the right task.

## What a positive screen (4 or more of 6) means, and doesn't

A positive screen means: on this 6-item snapshot, this person's answers land in the range Kessler et
al.'s research associates with adults who, on further clinical evaluation, are likely to meet criteria for
ADHD. It is an invitation to get clarity, not a conclusion. Useful, honest language: *"Your pattern here is
worth exploring further with a professional if you want a clearer picture, this screener is designed to
flag who should look closer, not to tell you what's actually going on."* If the person wants that next
step, `psychology_find_counselors(location, focus, max_results)` can return local directory listings for a
formal-evaluation conversation. Treat each listing as unverified information, relay any disclaimer or
limit the tool returns, and do not present it as a referral, availability guarantee, or emergency option.

## What a negative screen (fewer than 4 of 6) means, and doesn't

A negative screen means the pattern here didn't cross this screener's threshold, it does **not** mean
"you don't have ADHD." Three things commonly produce a negative screen despite real, present symptoms:

- **Inattentive-presentation-only ADHD**, if someone's difficulty concentrates in items 1-4 without much
  of items 5-6 (or vice versa), can sit right at the edge of the 4-of-6 line depending on exactly which
  items cross threshold.
- **Compensation and masking** (see `cat-q-interpretation.md` for the general concept), years of
  developed workarounds can genuinely reduce how often symptoms surface as described in the items, without
  the underlying attentional pattern having changed.
- **Context-dependence**, six months is a long recall window, and someone in an unusually
  well-structured period of life (or answering with a specific easier context in mind) may underreport
  relative to their harder periods.

If someone strongly suspects ADHD despite a negative screen, that suspicion is itself worth taking to a
professional rather than treating the screen as the final word.

## What this file does not tell you

- **Not a diagnosis under any circumstance**, positive or negative.
- **Not the full ASRS.** This is Part A only (the 6-item screener), not the 18-item Part A+B Symptom
  Checklist and not ASRS-5, which are different instruments with a different licensing posture.
- **Doesn't distinguish presentation type formally.** The inattentive/hyperactive grouping above is
  provided for understanding, not computed by the tool as a subscore.
- **No neurodivergence-adjusted norm exists**, this screener was validated against clinical ratings in
  the general population, not against an ADHD-specific or 2e-specific comparison sample.
