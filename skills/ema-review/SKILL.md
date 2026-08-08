---
name: ema-review
description: This skill should be used when the user asks to review daily check-ins, mood trends, or ecological momentary assessment (EMA) data. It exists to give an honest, immediate answer that this capability is not implemented in Noesis today, rather than pretending to have data that doesn't exist, and to redirect toward what the platform can actually do. Activate when the user says phrases like "review my check-ins", "how have I been doing", "my daily data", "ema trends", "mood trends", "how was my month", or asks about sleep, energy, mood, or stress patterns over time.
triggers:
  - "review my check-ins"
  - "how have I been doing"
  - "my daily data"
  - "ema trends"
  - "mood trends"
  - "how was my month"
  - "sleep patterns"
  - "energy levels"
  - "check-in data"
---

# EMA Review Guide

> **Corrected 2026-08-01.** This skill was stale since 2026-07-25 — noesis-mcp has since grown from 2 to
> 16 public scored instruments. Item 1 in "What Noesis can actually offer instead" below now also names
> `score_swls` (Satisfaction With Life Scale — a real, if quick, well-being snapshot) and
> `score_wellness_tracking` (Epworth Sleepiness Scale + medication-adherence self-tracking) alongside the
> original Big Five/values pair, since both are closer in spirit to "how have I been doing" than a
> personality/values screen is. Each has its own strength-framed, non-diagnostic interpretation reference
> file at `skills/interpretation/references/swls-interpretation.md` and
> `skills/interpretation/references/wellness-tracking-interpretation.md` respectively — hand off to those,
> never improvise. Still true from before: there is no check-in collection mechanism, no EMA data store,
> and no trend-analysis tool — nothing below changes that.

> **Corrected 2026-07-25.** This skill previously described a full ecological-momentary-assessment
> (EMA) feature — daily mood/energy/sleep/stress/social-connection/flow/sensory-comfort check-ins,
> trend analysis, and correlation with the user's OCEAN profile — and instructed calling
> `noesis.ema.get_data`, `noesis.ema.get_trends`, and `noesis.user.get_profile`. **None of this
> exists anywhere in the Noesis codebase.** There is no check-in collection mechanism, no EMA data
> store, and no trend-analysis tool. This was aspirational content, not a real, partially-built
> feature — it has been rewritten to say so honestly rather than to quietly scope it down, because
> there is nothing real to scope down to.

## What to do when this skill activates

Tell the user plainly and warmly that this isn't available yet — don't simulate, estimate, or
hallucinate mood/energy/sleep trend data to make the conversation feel complete.

**Say something like:**

"I don't actually have a daily check-in or mood-tracking feature right now — there's no place in
Noesis today where check-ins get collected or stored, so I have no trend data to show you. I know
that's probably not what you were hoping to hear. Here's what I *can* actually do for you instead:"

## What Noesis can actually offer instead

1. **A snapshot, not a trend.** If the user wants to understand their current patterns, offer the
   assessment-guide skill: `score_big_five` (10-item Big Five quick screen — not the published TIPI) or `score_pvq_rr` (22-item
   values survey) give a real, scored snapshot of personality/values right now — not a mood trend
   over time, but genuine, validated data. Two more instruments are closer to what someone asking about
   "how have I been doing" usually means, even though neither is a trend: `score_swls` (5-item
   Satisfaction With Life Scale — a quick, real, scored life-satisfaction snapshot; see
   `skills/interpretation/references/swls-interpretation.md`) and `score_wellness_tracking` (20-item
   sleepiness + medication-adherence self-tracking battery — a personal self-tracking tool, not a medical
   diagnosis; see `skills/interpretation/references/wellness-tracking-interpretation.md`). Same caveat as
   the others: a single-point-in-time snapshot, not a trend over time.
2. **Manual, user-driven comparison.** If the user has taken an assessment before and remembers, has
   saved their old scores (see the `local-persistence` skill, added 2026-07-26 — a local JSON file the
   user controls, not anything Noesis stores server-side), or pastes them back in, you can compare that
   against a fresh `score_big_five`/`score_pvq_rr` result, or combine both into one profile with
   `battery_aggregate`/`battery_aggregate_json` — this still depends entirely on the user (or a file
   they previously chose to save) supplying the historical numbers; Noesis itself stores nothing for
   them server-side.
3. **In-conversation reflection.** Within a single ongoing conversation, you can genuinely notice and
   reflect back patterns the user describes ("You've mentioned feeling more drained on days you have
   back-to-back meetings — does that match how it feels?") — this is real, useful support, just not
   the systematic, multi-week EMA analysis the old version of this skill implied.
4. **Coaching.** If what they actually want is support working through how they've been feeling
   lately, hand off to the coaching skill — it doesn't need stored check-in data to be useful.
5. **Finding a therapist for ongoing mood tracking.** If the user specifically wants structured daily
   mood tracking as part of working with a professional, `find_counselors(location, focus,
   max_results)` can help them find one nearby (a live Google Places lookup, not a vetted directory —
   always relay its `disclaimer` and `crisis_line_note` fields). **Availability note (updated
   2026-08-08)**: this tool is available to every signed-in user — no Premium gate — limited to 20
   searches/week and 40 searches/month per user since it calls a real, paid external API; check it is
   actually in your tool list before offering it.

## If the user pushes back or seems disappointed

Stay warm and direct — this is exactly the kind of moment where over-promising would do real harm:

- "I hear that — it would genuinely be useful to have that kind of tracking. It's just not built yet.
  I'd rather tell you that clearly than make up data that isn't real."
- If they want to track it themselves, you can help them think through *what* to track (mood, energy,
  sleep, stress, social connection, flow, sensory comfort are all reasonable dimensions) even without
  a tool to store it — e.g. suggesting a simple daily note or spreadsheet, and offering to help
  interpret it manually if they paste their own data back into a future conversation.
