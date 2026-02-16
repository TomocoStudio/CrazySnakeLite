---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - '_bmad-output/planning-artifacts/research/market-player-cognitive-progress-tracking-research-2026-02-15.md'
  - '_bmad-output/planning-artifacts/cognitive-dashboard-party-mode-summary-2026-02-15.md'
  - '_bmad-output/planning-artifacts/cognitive-analytics-requirements.md'
  - '_bmad-output/planning-artifacts/analytics-requirements.md'
  - '_bmad-output/planning-artifacts/project-context.md'
  - '_bmad-output/planning-artifacts/game-ux-principles.md'
  - '_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md'
date: 2026-02-15
author: Tomoco
analyst: Mary
---

# Product Brief: CrazySnake Cognitive Dashboard

## Executive Summary

The CrazySnake Cognitive Dashboard is a **player-facing progress tracking system** that transforms raw gameplay data into a personal "cognitive mirror" — letting players see, understand, and share their cognitive growth over time.

CrazySnake already functions as a cognitive fitness tool disguised as an arcade game, training six cognitive faculties through gameplay mechanics: reaction time, spatial awareness, cognitive flexibility, divided attention, impulse control, and working memory. But today, players feel the workout without seeing their growth. The existing post-game stats ("Your Brain Today") provide single-session snapshots, not a longitudinal picture. Players who can't see their improvement eventually churn — research identifies this as the critical drop-off point between habit formation and sustained engagement.

The Cognitive Dashboard closes this gap with a dual-moment architecture: a **post-game celebration** (2-3 dynamic highlights with comedy) that reinforces the immediate experience, and a **between-session brain map** (radar chart, trends, streaks) that motivates return visits. Six metrics are derived from actual gameplay — not abstract puzzles — giving the dashboard scientific substance without clinical claims.

In a $9.76B market (2025) growing at 19% CAGR, competitors either paywall progress tracking (Lumosity, $14.99/mo) or present it clinically (BrainHQ, CogniFit). No player in the market combines fun, free, transparent cognitive tracking with comedy-driven engagement. The Cognitive Dashboard positions CrazySnake as the **"Duolingo of casual brain training"** — borrowing proven gamification mechanics (streaks, visual progress, social sharing) and applying them to genuine cognitive training through arcade gameplay.

**Product:** Player-facing Cognitive Dashboard with six gameplay-derived cognitive metrics
**Platform:** Web browser (localStorage/IndexedDB, no server required)
**Positioning:** Free, fun, transparent cognitive progress tracking — the anti-Lumosity
**Core Innovation:** Real cognitive metrics from real gameplay, presented with comedy and arcade personality

---

## Core Vision

### Problem Statement

CrazySnake trains the player's brain through five layered cognitive challenge systems — but **the player has no way to see their own cognitive growth over time.** The current "Your Brain Today" post-game display shows single-session stats (RC survived, phone calls managed, mystery foods decoded), but these are isolated snapshots. There is no longitudinal tracking, no trend visualization, no way for a player to answer: *"Am I actually getting better?"*

This creates a retention gap. Market research confirms that the critical player drop-off happens between **habit formation** and **progress awareness** — players who play daily but can't see their improvement eventually churn. The cognitive dashboard fills this gap by giving players a persistent, visual record of their cognitive growth.

### Problem Impact

- **Players churn without visible progress.** Duolingo data shows 7-day streakers are 3.6x more likely to stay engaged long-term. Without streak tracking and visible growth, CrazySnake loses the most powerful retention mechanic available.
- **The "brain gym" identity can't land without proof.** CrazySnake's mission is to be cognitive fitness for the age of AI. But a gym without a mirror isn't a gym — it's just exercise. Players need to *see* what their brain accomplished across sessions, not just within one game.
- **Competitors exploit this gap.** Lumosity charges $14.99/month for progress insights. Peak gates Brain Maps behind premium. Players who want to understand their cognitive growth are forced to pay — or go without. CrazySnake can democratize this.
- **No emotional connection to data.** Competitors present progress as clinical charts and opaque index scores (Lumosity's LPI). Players don't understand what the numbers mean or how they connect to real improvement. The data informs but doesn't inspire.

### Why Existing Solutions Fall Short

| Solution | What They Do | Where They Fail |
|---|---|---|
| **Lumosity Insights** | LPI score across 5 domains, trend charts | Paywalled ($14.99/mo), opaque scoring, clinical tone, no humor |
| **Peak Brain Maps** | Radar chart, AI Coach, age-group comparison | Premium-gated, complex UI, no personality |
| **BrainHQ Badges** | Post-exercise feedback, percentile ranking | Dated UI, feels medical, skews 50+ demographic |
| **CogniFit Score** | 0-800 cognitive score, cognitive age | Overwhelming 60+ game library, clinical feel |
| **Wordle Streaks** | Daily streak counter, guess distribution | Zero cognitive depth — one metric, no training |
| **Duolingo XP** | Streaks, leagues, XP, progress bars | Not cognitive training — gamification without brain science |
| **CrazySnake (current)** | "Your Brain Today" post-game stats | Single-session only, no trends, no between-session dashboard |

**The gap:** No product combines **free access**, **fun presentation** (comedy, arcade personality), **transparent metrics** (derived from real gameplay, not abstract puzzles), and **genuine cognitive substance** (six validated domains) in a single progress tracking experience.

### Proposed Solution

The CrazySnake Cognitive Dashboard — a player-facing progress tracking system built on three design pillars:

**Pillar 1: Six Gameplay-Derived Cognitive Metrics**

| Metric | Game Mechanic | Measurement |
|---|---|---|
| Reaction Time | Snake speed, food collection | Rolling avg of input response time |
| Spatial Awareness | Growing snake in confined space | Snake length at death / grid coverage |
| Cognitive Flexibility | Reverse Controls effect | Performance ratio: RC vs. normal play |
| Divided Attention | Phone calls during gameplay | Survival rate + decision speed during calls |
| Impulse Control | Pick Up vs End, Invincibility choice | Weighted decision ratio by context |
| Working Memory | Combo mode multi-variable state | Score rate during combo vs. normal |

These are real cognitive faculties exercised through actual gameplay — not abstract puzzles. The game itself IS the training.

**Pillar 2: Dual-Moment Architecture**

- **Post-Game (Hot Moment):** 2-3 dynamic highlights with caller comedy quotes. Celebrates what the brain just accomplished. Automatic, fast, emotional.
- **Between-Session (Cool Moment):** Full brain map radar chart, trend graphs, streak tracking, milestones. Player-initiated from menu. Analytical, inspiring, explorable at the player's own pace.

**Pillar 3: Comedy-Integrated, Never Clinical**

Tech pun callers comment on performance. Achievement titles use humor. No clinical language anywhere. The dashboard feels like CrazySnake — fun, irreverent, and warmly personal — not like a medical report.

**Technical approach:** Local-first storage (localStorage/IndexedDB). No account required. No server needed. Privacy by default. Optional social sharing via shareable brain map cards.

**Calibration period:** First 3-5 sessions build a baseline before the brain map unlocks — creating an anticipation event that itself drives engagement.

### Key Differentiators

1. **Free where Lumosity charges $14.99/mo.** Core progress tracking is free. Period. This is CrazySnake's biggest competitive weapon — democratizing cognitive progress insights.

2. **Fun where BrainHQ feels medical.** Comedy-integrated dashboard with caller quotes, humorous achievement titles, and pixel art personality. No clinical charts, no opaque indices.

3. **Transparent where LPI is opaque.** Six clearly labeled metrics derived from gameplay mechanics the player already understands. Instantly comprehensible.

4. **Real gameplay metrics, not abstract puzzles.** Competitors track performance on isolated exercises. CrazySnake tracks cognitive performance during actual gameplay — a fundamentally different and more authentic measurement approach.

5. **Social where competitors are isolated.** Shareable brain map cards — CrazySnake's "Wordle grid" moment. No competitor offers social cognitive profile sharing.

6. **Local-first, privacy by default.** No account, no cloud data, no tracking. In a market where competitors require sign-up and server-side storage, CrazySnake respects player privacy by design.

7. **Comedy + cognitive legitimacy.** No competitor uses humor as a core engagement driver for cognitive progress tracking. CrazySnake owns this unique positioning.

---

## Target Users

### Primary User: Alex, The Progress Seeker

**Profile:**
- **Age:** 25–44 (core sweet spot where casual gaming meets cognitive awareness)
- **Context:** Knowledge worker, increasingly reliant on AI tools daily — coding assistants, writing aids, AI search
- **Gaming:** Plays CrazySnake during breaks (5-10 min sessions, 2-3 games per session). Already past the initial hook — they've been playing for a week+
- **Cognitive Profile:** Notices their brain feels "softer" without being able to articulate why. Values mental sharpness but won't do Lumosity-style homework
- **Dashboard Motivation:** Has started wondering: *"Am I actually getting better at this?"* Wants proof that their break-time habit is doing something for their brain

**Problem Experience:**
Alex plays CrazySnake daily. They can feel the cognitive workout — Reverse Controls still trips them up, but less often than last week. Phone calls during combo mode used to kill them; now they survive most. But they have no way to verify this improvement. The "Your Brain Today" post-game stats reset every game. There's no trend line, no history, no mirror.

Without visible progress, the daily habit feels arbitrary. Alex starts to wonder if they should switch to something else — something that shows them their growth. They glance at Lumosity... but $14.99/month for clinical charts? Pass.

**Success Vision:**
Alex opens CrazySnake, sees their 12-day streak, checks their brain map before playing. Cognitive Flexibility has jumped from 2 to 4 dots this week — Reverse Controls survival is climbing. Working Memory is their weakest area. They think: "I'm going to focus on surviving combo mode today." After the game, a caller quote says: "Your prefrontal cortex just filed a pull request. Merged without conflicts." They smile, screenshot their brain map, and share it with a coworker.

The dashboard transformed CrazySnake from "that fun snake game" into "my daily brain workout with receipts."

### Secondary User: Jordan, The Competitive Sharer

**Profile:**
- **Age:** 22–35 (social-media-active, achievement-oriented)
- **Context:** Tech professional or student, competitive by nature, active on social platforms
- **Gaming:** Plays CrazySnake partly for the cognitive challenge, partly for bragging rights
- **Dashboard Motivation:** Wants their cognitive profile as a social identity marker — "I train my brain, and here's proof"

**Problem Experience:**
Jordan already shares high scores with friends, but a number without context means nothing. "I got 87" doesn't tell anyone how their brain performed. They want something shareable that's visually compelling and tells a story — like Wordle's colored grid or Spotify Wrapped.

**Success Vision:**
Jordan taps "Share Progress" and gets a beautiful brain map card — pixel art style, showing their six-domain radar chart with their username and streak count. They post it to their team Slack: "Week 3 brain map. Divided Attention is maxed. Working on that Impulse Control though..." Three coworkers download CrazySnake that afternoon.

The shareable brain map becomes CrazySnake's organic growth engine.

### Tertiary User: Sam, The Casual Returner

**Profile:**
- **Age:** 25–50 (broad range — anyone who tried CrazySnake and drifted)
- **Context:** Played CrazySnake 3-5 times, enjoyed it, but life got in the way
- **Dashboard Motivation:** The dashboard itself is the re-engagement hook — not a notification, but a pull

**Problem Experience:**
Sam hasn't played in 4 days. They open CrazySnake on a whim and see: "Your streak ended at 8 days. Start a new one?" Their brain map shows their last state — Reaction Time was climbing, Spatial Awareness was strong. A gentle message: "Your brain took a rest day. Ready to come back stronger?" No guilt. No anxiety. Just curiosity about picking up where they left off.

**Success Vision:**
Sam plays two games, sees their brain map update, and thinks: "That felt good. I should do this more." The dashboard reactivated a lapsed player without a single push notification. The data itself was the invitation.

### User Journey

**The Dashboard-Enhanced Player Journey:**

```
Discovery > First Play > Hook > Calibration > Brain Map Unlock > Habit Loop > Progress Awareness > Advocacy
                                    |              |                    |              |
                                 Sessions       "What will          Streaks +       Share brain
                                  1-4           my map             trends =         map card
                                "Calibrating    look like?"        daily pull       with friends
                                 your brain..."  (curiosity)       (retention)      (growth)
```

**Key Moments:**

| Moment | What Happens | Emotional State |
|---|---|---|
| **First Post-Game Summary** | 2-3 highlights after first death. "Your reaction speed was 340ms. Calibrating..." | Curious — "there's more to this game?" |
| **Brain Map Unlock (Session 4-5)** | Radar chart reveals for first time. All six domains visible. | Delight + curiosity — "that's ME" |
| **First Improvement** | A metric improves visibly between sessions. Post-game says "Spatial Awareness up 15%!" | Competence — SDT core need satisfied |
| **Streak Building** | 7-day streak reached. Visual counter prominent. | Investment — loss aversion kicks in |
| **First Share** | Player shares brain map card with friend/coworker | Pride + relatedness — social identity |
| **Re-engagement** | Lapsed player sees their brain map, feels pulled back | Curiosity — "where was I?" |
| **Growth Mastery** | Player sees 30-day trends, identifies weak domain, plays intentionally | Autonomy — self-directed training |

---

## Success Metrics

### User Success Indicators

**Core Question: "Is the dashboard making players feel their cognitive growth?"**

| Metric | Target | What It Validates |
|---|---|---|
| Brain Map view rate | 60%+ of sessions | Players actively check their cognitive profile between sessions |
| Post-game summary engagement | 80%+ see highlights before Play Again | Highlights resonate emotionally, not skipped |
| Calibration completion rate | 70%+ of new players reach session 5 | Calibration period creates anticipation, not churn |
| Streak adoption | 50%+ of weekly players maintain 3+ day streak | Streak mechanic successfully drives daily return |
| Trend exploration depth | 30%+ of dashboard viewers explore Layer 3 trends | Deep analytics appeal to progress-seeking players |
| Self-directed play | 20%+ of sessions show intentional domain targeting | Players use dashboard insights to guide their gameplay |

**Qualitative Success Signals:**
- Players describe CrazySnake as "my brain workout" not just "that snake game"
- Players reference specific cognitive domains in conversation
- Players share brain maps as social identity markers
- Lapsed players return after viewing their dashboard — data pulls them back without notifications

### Business Objectives

**Primary Goal:** The Cognitive Dashboard transforms CrazySnake from a fun arcade game into a cognitive fitness habit with measurable retention impact.

| Objective | Target | Timeframe | Measurement |
|---|---|---|---|
| Day-7 retention lift | +15% vs. pre-dashboard baseline | 3 months post-launch | Compare D7 retention cohorts before/after dashboard |
| Day-30 retention lift | +25% vs. pre-dashboard baseline | 6 months post-launch | Compare D30 retention cohorts before/after dashboard |
| Sessions per week (active players) | 4+ sessions/week | 3 months | Average weekly sessions for players with brain map unlocked |
| Social brain map shares | 10%+ of active players share at least once | 3 months | Share button usage tracking |
| Organic acquisition from shares | 5%+ of new players arrive via shared brain map | 6 months | Referral tracking via share card links |
| Brain gym identity adoption | 40%+ of returning players check dashboard before playing | 6 months | Dashboard-first vs. play-first session starts |

### Key Performance Indicators

**Dashboard-Specific KPIs:**

| KPI | Target | Leading/Lagging | Decision It Drives |
|---|---|---|---|
| Calibration drop-off rate | <30% quit before brain map unlock | Leading | If high: shorten calibration or add intermediate rewards |
| Streak break recovery | 60%+ restart streak within 48 hours | Leading | If low: improve re-engagement messaging tone |
| Brain Map engagement time | 15+ seconds average per view | Leading | If low: dashboard isn't compelling enough visually |
| Post-game highlight variety | No repeated pattern 2 sessions in a row | Leading | If repetitive: expand highlight selection algorithm |
| Share conversion rate | 20%+ of share recipients visit CrazySnake | Lagging | Validates brain map card as organic growth engine |
| Cross-session metric improvement | 70%+ of 10-session players improve in 3+ domains | Lagging | Validates dashboard reflects real cognitive growth |

**Cognitive Validation KPIs (from Celia's framework):**

| KPI | Target | What It Validates |
|---|---|---|
| RC survival rate improvement | 5-10% increase per session | Executive function training is measurably working |
| Metric improvement / play frequency correlation | Positive (r > 0.3) | More play = genuine cognitive improvement |
| Metric plateau detection | Players reach plateau after 30+ sessions, not <10 | Metrics have meaningful range, not quick ceiling |
| Domain balance across player base | No single domain rated 5/5 by >50% of players | Metrics differentiate — no universal easy scores |

**Anti-Metrics (what we explicitly do NOT optimize for):**

| Anti-Metric | Why We Avoid It |
|---|---|
| Time spent on dashboard | We want efficient insight, not doom-scrolling analytics |
| Notification click-through | We don't use push notifications — dashboard pulls, not pushes |
| Streak anxiety indicators | If players report stress about losing streaks, we've failed ethically |
| Dashboard-only sessions (no play) | The dashboard should drive gameplay, not replace it |

---

## Scope

### Core Features (MVP)

**1. Cognitive Metrics Data Engine**
Silent collection of all six cognitive metrics from session one. Every game generates data points for Reaction Time, Spatial Awareness, Cognitive Flexibility, Divided Attention, Impulse Control, and Working Memory. Players don't need to opt in — tracking is automatic and local.

- Storage: localStorage/IndexedDB — no server, no account, privacy by default
- Data persists across sessions on the same device/browser
- Rolling averages weighted toward recent sessions for responsive metrics
- All calculation logic follows formulas defined in Party Mode summary (Celia's framework)

**2. Enhanced Post-Game Summary (Layer 1 — Hot Moment)**
Replaces/enhances the current "Your Brain Today" with dynamic, comedy-integrated highlights:

- 2-3 highlights selected dynamically per session (never the same pattern twice in a row)
- Selection priority: Personal Best > Biggest Improvement > Notable Event > Growth Opportunity
- Comedy caller quotes comment on performance
- Up/down arrows and simple language — no clinical metrics
- "Play Again" and "Dashboard" buttons as clear next actions
- Streak counter visible at bottom

**3. Brain Map Dashboard (Layer 2 — Cool Moment)**
Player-initiated from menu — the cognitive mirror:

- Radar chart showing all 6 domains with dot-based ratings (5 dots, filled/empty)
- Strongest domain and growth area callouts
- Session count and current streak display
- "Play Now" button always visible — dashboard is a launchpad, not a dead end
- Comedy: rotating caller quote or achievement title on each visit
- Pixel art styling consistent with CrazySnake's retro aesthetic

**4. Calibration Period**
First 3-5 sessions build baseline before brain map unlocks:

- "Calibrating your brain..." state with session progress counter (Session 1/5, 2/5...)
- Post-game highlights still show during calibration (individual session data is immediate)
- Brain map unlock is a motivational event — the reveal after calibration
- Prevents volatile early data from undermining trust in metrics

**5. Streak System**
Consecutive daily play tracking:

- Visual streak counter on post-game screen and dashboard
- Streak increments on any completed game per calendar day
- Gentle messaging on streak break: "Your brain took a rest day. Ready to come back stronger?"
- No guilt, no anxiety — ethical guardrails per Celia's framework
- Streak data stored locally alongside cognitive metrics

**6. Comedy Integration**
Dashboard and post-game screens maintain CrazySnake's personality:

- Tech pun caller quotes on post-game highlights (performance-contextual)
- Rotating caller quotes on dashboard visits
- Achievement-style labels using humor, not clinical language
- No medical terminology, no clinical framing anywhere

### Out of Scope (V2 — Future)

| Feature | Why Deferred | When to Revisit |
|---|---|---|
| **Trend graphs (Layer 3)** | Core value is "am I improving?" — trends add depth but aren't essential for first answer | After MVP validates brain map engagement (60%+ view rate) |
| **Social sharing / brain map cards** | Powerful growth lever, but proving dashboard works comes first | After MVP confirms retention lift targets |
| **Milestones & achievements** | Engagement amplifier, not core value | After MVP streak adoption reaches 50%+ target |
| **Streak freeze** | Risk mitigation for streak anxiety — monitor if needed | If streak anxiety signals emerge in qualitative feedback |
| **Weekly summary reports** | Depth feature for power users | After trend exploration rate (Layer 3) can be measured |
| **Growth opportunity suggestions** | "Your weakest domain is..." nudges | After cross-session improvement validates metric accuracy |
| **Premium tier analytics** | Extended history, detailed breakdowns | After business model definition — separate product decision |
| **Cross-device sync** | Requires accounts/server infrastructure | After local-first approach is validated |
| **Leaderboards** | Social competition layer | After sharing validates social appetite |

### MVP Success Criteria

**The dashboard MVP succeeds if:**

1. **Players look at their brain map.** 60%+ of sessions include a dashboard view — proving the cognitive mirror concept resonates.
2. **Calibration creates anticipation, not churn.** 70%+ of new players complete the 3-5 session calibration — the unlock moment works as a motivational event.
3. **Retention measurably improves.** Day-7 retention lifts +15% vs. pre-dashboard baseline — the dashboard drives return visits.
4. **Post-game highlights don't get skipped.** 80%+ of players see highlights before Play Again — the hot-moment celebration lands.
5. **Streaks take hold.** 50%+ of weekly players maintain a 3+ day streak — the daily habit mechanic works.

**Go/No-Go Decision:** If 3 of 5 criteria are met within 3 months of launch, proceed to V2 (sharing, trends, milestones). If <3 are met, investigate and iterate on MVP before expanding scope.

### Future Vision

If the Cognitive Dashboard MVP validates, the full vision expands across three horizons:

**Horizon 1 — V2: Social & Depth (3-6 months post-MVP)**
- Shareable brain map cards (the "Wordle grid" moment)
- Trend graphs and Layer 3 deep analytics
- Milestones and achievement system
- Streak freeze and gentle re-engagement
- Growth opportunity suggestions per domain

**Horizon 2 — Cognitive Fitness Platform (6-12 months)**
- Targeted workout modes: "Focus Training" (phone-heavy), "Flexibility Training" (RC-heavy)
- Weekly cognitive reports with caller-narrated summaries
- Cross-device sync with optional account creation
- Leaderboards framed as cognitive fitness rankings
- "Challenge a coworker" with shared game seeds

**Horizon 3 — Ecosystem (12+ months)**
- Premium tier with extended history and personalized coaching
- Corporate wellness integration (brain breaks for teams)
- API for research partnerships (anonymized, opt-in cognitive data)
- Progressive Web App for offline play
- New game modes targeting additional cognitive faculties

**Business model exploration** fits naturally in Horizon 1-2, informed by MVP data on engagement patterns, user willingness to pay for premium features, and the organic growth rate from social sharing.

---

## Related Documents

- **Market Research:** `_bmad-output/planning-artifacts/research/market-player-cognitive-progress-tracking-research-2026-02-15.md`
- **Party Mode Summary:** `_bmad-output/planning-artifacts/cognitive-dashboard-party-mode-summary-2026-02-15.md`
- **Cognitive Analytics Requirements:** `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md`
- **Analytics Requirements:** `_bmad-output/planning-artifacts/analytics-requirements.md`
- **Game UX Principles:** `_bmad-output/planning-artifacts/game-ux-principles.md`
- **Original Product Brief:** `_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md`
- **Project Context:** `_bmad-output/planning-artifacts/project-context.md`

---

*Product brief prepared by Mary (Business Analyst) for Tomoco on 2026-02-15.*
*Input from: Celia (Neuro-Game Design), Sally (UX Design), market research, and Party Mode collaborative session.*
*"See what your brain accomplished. Come back tomorrow and do it again."*
