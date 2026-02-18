# Epic 14: Enhanced Post-Game Summary ("Recap")

**Status:** 🟢 COMPLETED
**Created:** 2026-02-15
**Completed:** 2026-02-16

---

## Overview

Transform the game-over screen from "I failed" into "look what my brain just did." Replace the basic "Your Brain Today" stats with a dynamic, comedy-integrated post-game summary that celebrates cognitive achievements using data from Epic 13. Show 2-3 personalized highlights selected via priority algorithm (Personal Best > Improvement > Notable Event > Growth Edge), accompany with contextual tech-pun caller quotes, display calibration progress or streak counter, and enforce variety (never the same pattern twice). This is the **hot moment** — player just died, adrenaline high, working memory depleted — so keep it glanceable, celebratory, and motivating for one more game.

**FRs covered:** FR161-FR170 (Dynamic highlights, priority selection, caller quotes, variety enforcement, Play Again/Dashboard buttons, streak counter, calibration state)

**NFRs covered:** NFR51 (renders within 300ms), NFR65 (celebratory tone validation)

**Value:** First visible dashboard feature. Instant cognitive validation. Answers "did my brain do something impressive?" within 3 seconds of death. Drives "Play Again" impulse by celebrating achievement, not dwelling on failure. Uses metrics from Epic 13 to tell a personalized story every session.

**Dependencies:** Requires Epic 13 (metrics.js provides session data for highlight selection)

---

## Stories

### Story 14.1: Implement Highlight Selection Algorithm

**As a** player,
**I want** the post-game summary to show my most impressive cognitive achievements from the session,
**So that** I feel validated and motivated to play again.

**Acceptance Criteria:**

**Given** a game session ends
**When** game-over screen appears
**Then** cognitive-feedback.js queries metrics.js for current session data
**And** runs highlight selection algorithm with 4-tier priority:

**Priority 1: Personal Best (Highest)**
```javascript
if (sessionMetric > allTimeHighForMetric) {
  highlights.push({
    type: 'personal_best',
    metric: metricName,
    value: sessionMetric,
    text: `${metricDisplayName}: NEW PERSONAL BEST!`,
    icon: '🎯'
  })
}
```

**Priority 2: Biggest Improvement**
```javascript
delta = sessionMetric - rollingAverage
if (delta > 0.15 * rollingAverage) {  // 15%+ improvement
  highlights.push({
    type: 'improvement',
    metric: metricName,
    delta: percentageChange,
    text: `${metricDisplayName} up ${delta}% this session`,
    icon: '⬆'
  })
}
```

**Priority 3: Notable Event**
```javascript
if (cognitiveStats.rcSurvived >= 3) {
  highlights.push({
    type: 'notable',
    metric: 'cognitiveFlexibility',
    value: cognitiveStats.rcSurvived,
    text: `Survived ${count} Reverse Controls — brain on fire`,
    icon: '🔥'
  })
}
// Similar checks for: first combo, 5+ phone calls managed, 10+ mystery foods, etc.
```

**Priority 4: Growth Opportunity**
```javascript
lowestMetric = findLowestRollingAverage()
if (sessionEngagedWithLowestMetric) {  // Player encountered that challenge
  highlights.push({
    type: 'growth',
    metric: lowestMetric,
    text: `${metricDisplayName} — time to level up`,
    icon: '↑'
  })
}
```

**Then** select top 2-3 highlights by priority
**And** enforce variety: if last session pattern was [P1, P2], this session must include at least one different priority (per FR163)

**Per FR162:** Highlight selection priority: Personal Best > Biggest Improvement > Notable Event > Growth Opportunity

---

### Story 14.2: Create Post-Game Highlights UI

**As a** player,
**I want** to see my cognitive highlights in a clear, celebratory format,
**So that** I immediately understand what my brain accomplished.

**Acceptance Criteria:**

**Given** highlights are selected
**When** game-over screen renders
**Then** display structure:
```
┌─────────────────────────────────────┐
│          YOUR SCORE                 │
│              67                     │  ← 64px hero number, neon white
│       ★ NEW HIGH SCORE ★           │  ← gold, conditional
│ ─────────── RECAP ─────────────── │  ← 12px label, top border rule
│ 🎯 Reaction Time: NEW PERSONAL BEST!│  ← left-aligned
│ ⬆ Spatial Awareness up 15%         │  ← left-aligned
│ 🔥 Survived 3 Reverse Controls      │  ← left-aligned
│ ┌──────────────────────────────┐   │
│ │ "Your prefrontal cortex just │   │  ← quote card (border-left)
│ │  bench-pressed a truck."     │   │
│ │ [portrait] — Kernel Sanders  │   │  ← 32px portrait, left-aligned
│ └──────────────────────────────┘   │
│  Session 4/5 — Warming up...        │  ← calibration footer (when active)
│  ┌────────────┐  ┌────────────┐    │
│  │ PLAY AGAIN │  │ SKILL MAP  │    │  ← appear immediately (no delay)
│  └────────────┘  └────────────┘    │
└─────────────────────────────────────┘
```

**And** "RECAP" header uses 12px letter-spaced label with CSS border-top rule (rgb(157, 178, 221))
**And** highlights use Jersey20 font, 19px, left-aligned white text
**And** caller quote uses card treatment: `rgba` fill + border-left accent, 32px portrait, left-aligned attribution
**And** timing per FR168 (V5 — buttons no longer delayed):
- t=0.0s: Score hero + buttons appear immediately
- t=0.3s: "RECAP" header fades in
- t=0.6s: Highlight 1 fades in (300ms stagger)
- t=0.9s: Highlight 2 fades in
- t=1.2s: Highlight 3 fades in (if 3 highlights)
- t=1.5s: Caller quote fades in
- t=1.8s: Footer (calibration) fades in if applicable
- ~~t=3.3s: Buttons appear~~ — **REMOVED: buttons visible from t=0.0s**
- **Streak counter removed from game-over screen**

**And** no clinical metrics or numbers except achievements (per FR165 - simple language only)

**Per FR161:** Post-game screen displays 2-3 dynamic highlights selected from cognitive performance

---

### Story 14.3: Integrate Caller Quotes with Performance Context

**As a** player,
**I want** tech-pun callers to comment on my performance with humor,
**So that** cognitive feedback feels like CrazySnake, not Lumosity.

**Acceptance Criteria:**

**Given** highlights are displayed
**When** selecting a caller quote
**Then** match quote to performance context:

**High score session (score > 80):**
- "Your neurons are doing the Electric Slide. Keep it up!" — DJ Algorithm
- "Five sessions in and your prefrontal cortex is filing pull requests like a boss." — Git Committer

**Death during Reverse Controls:**
- "Orange food got you? That's executive function boot camp. You'll get it." — Kernel Sanders
- "Reverse Controls: where good snakes go to humble themselves." — Floppy Phil

**Streak milestone (7+ days, 30+ days):**
- "12 days straight? Your brain is now officially a gym rat." — Cache Money
- "That streak is hotter than a CPU at 95°C." — Ray Tracer

**First combo survived:**
- "First combo survived! Welcome to the big leagues." — Array Jay
- "Multiplicative scoring unlocked. Your working memory thanks you." — Lambda Calculus

**And** rotate caller portrait (32x32px) with quote
**And** caller name right-aligned in 14px Jersey20
**And** quote text indented, italicized, 16px
**And** quote selection uses performance-contextual mapping (per FR164, FR201)

**Per FR164:** Each highlight includes comedy caller quote contextual to performance (21 callers available, performance-based selection)

---

### Story 14.4: Add Variety Enforcement to Prevent Repetition

**As a** player,
**I want** each post-game summary to feel fresh and different,
**So that** highlights never feel templated or predictable.

**Acceptance Criteria:**

**Given** previous session used highlight pattern [Personal Best, Notable Event]
**When** current session selects highlights
**Then** current pattern MUST include at least one different priority type
**And** valid patterns: [Personal Best, Improvement], [Personal Best, Growth], [Improvement, Notable Event], etc.
**And** invalid pattern: [Personal Best, Notable Event] (exact repeat)

**Given** highlight selection algorithm runs
**When** top priorities are determined
**Then** check last session pattern from storage
**And** if current pattern matches last pattern exactly, replace lowest-priority highlight with next-best alternative priority

**Given** only 1 qualifying highlight exists (edge case)
**When** enforcing variety
**Then** show that single highlight (do not artificially add low-quality highlights)
**And** variety check skipped when insufficient highlights

**Given** player plays 5 consecutive sessions
**When** reviewing all post-game summaries
**Then** no two consecutive sessions show identical priority patterns
**And** player experiences diverse celebration types (PB, Improvement, Notable, Growth all represented)

**Per FR163:** Highlight selection algorithm ensures no repeated pattern in consecutive sessions (variety enforcement)

---

### Story 14.5: Display Calibration State Counter

**As a** player during calibration (sessions 1-5),
**I want** to see my progress toward brain map unlock,
**So that** I understand when the full Skill Map becomes available.

**Acceptance Criteria:**

**Given** player is in calibration period (sessions < 5)
**When** post-game summary displays
**Then** show calibration counter below highlights:
```
Session 3/5 — Warming up...
```
**And** text in 12px Jersey20, light grey color
**And** subtle pulsing animation (opacity 0.7 → 1.0 → 0.7, 2s cycle)

**Given** player completes session 5 (calibration complete)
**When** post-game summary displays
**Then** show one-time celebration message:
```
Your Skill Map is ready! 🎉
```
**And** replace calibration counter with celebration for this session only
**And** brief pixel-art fanfare animation (100ms flash, confetti particles)

**Given** player has completed calibration (session 6+)
**When** post-game summary displays
**Then** do NOT show calibration counter
**And** "Skill Map" button is active (not greyed out)

**Per FR184:** Calibration state displays "Calibrating your brain..." with session progress counter (Session 1/5, 2/5, 3/5...)

---

### Story 14.6: Add Streak Counter to Post-Game Screen

**As a** player,
**I want** to see my current play streak on the post-game screen,
**So that** I'm reminded of my daily habit and motivated to maintain it.

**Acceptance Criteria:**

**Given** player has an active streak (1+ days)
**When** post-game summary displays
**Then** show streak counter at bottom of screen:
```
🔥 12-day streak
```
**And** flame emoji + text in 12px Jersey20
**And** positioned below buttons, not competing for attention (per UX design)

**Given** player just broke their streak (missed a day)
**When** post-game summary displays
**Then** show gentle break message:
```
Rest day logged. Ready for another round?
```
**And** NO red coloring, NO warning visuals (per ethical guardrails FR195)
**And** tone is factual and encouraging, not guilt-inducing

**Given** this is player's first session ever (no streak yet)
**When** post-game summary displays
**Then** show:
```
🔥 1-day streak — keep it going!
```
**And** celebrate the start of the journey

**Given** player has 7-day or 30-day milestone
**When** post-game summary displays
**Then** streak counter uses special color (gold #FFD700)
**And** caller quote reflects milestone achievement (per Story 14.3 context mapping)

**Per FR167:** Streak counter visible at bottom of post-game screen (current streak days)

---

### Story 14.7: Implement Play Again and Skill Map Buttons

**As a** player,
**I want** clear next actions after seeing my cognitive summary,
**So that** I can either play again immediately or explore my full Skill Map.

**Acceptance Criteria:**

**Given** game over screen shows
**When** screen renders (V5: immediately, no delay)
**Then** show two buttons side by side:
```
┌────────────┐  ┌────────────┐
│ PLAY AGAIN │  │ SKILL MAP  │
└────────────┘  └────────────┘
```
**And** "PLAY AGAIN" is default selected (per FR105)
**And** both buttons use standard button style: 8px rounded corners, purple border, Jersey20 font

**Given** player is in calibration period (session < 5)
**When** buttons display
**Then** "Skill Map" button shows as greyed out or replaced with calibration counter
**And** only "Play Again" is clickable

**Given** player has completed calibration (session 5+)
**When** buttons display
**Then** both buttons are active and clickable
**And** "Skill Map" opens full dashboard (Epic 16)
**And** "Play Again" immediately starts new game (FR89)

**Given** mobile viewport (< 768px)
**When** buttons display
**Then** stack vertically:
```
┌──────────────────┐
│   PLAY AGAIN     │
└──────────────────┘
┌──────────────────┐
│   SKILL MAP      │
└──────────────────┘
```
**And** "Play Again" on top (safe choice priority)
**And** minimum 44px touch targets

**Per FR166:** Post-game screen includes "Play Again" and "Dashboard" buttons as clear next actions

---

### Story 14.8: Test Highlight Selection Edge Cases

**As a** developer,
**I want** comprehensive tests for highlight selection logic,
**So that** edge cases are handled gracefully.

**Acceptance Criteria:**

**Given** player completes first-ever session (no history)
**When** highlight selection runs
**Then** show Notable Event highlights only (no PB or Improvement possible)
**And** gracefully handle missing rolling averages (default to session values)

**Given** player completes session with zero cognitive engagement (ate only green food, no phone calls, no RC, no combo)
**When** highlight selection runs
**Then** show generic encouragement highlight:
```
Score achieved: 15 — Every session trains your brain
```
**And** caller quote is general, not performance-specific

**Given** session has 5 qualifying highlights (all 4 priority types triggered)
**When** selection algorithm runs
**Then** select top 3 by priority ranking
**And** never show more than 3 highlights (cognitive load management)

**Given** variety enforcement triggers (last pattern repeats)
**When** replacement highlight is selected
**Then** choose next-highest priority that creates unique pattern
**And** maintain quality threshold (do not show low-value highlights just for variety)

**Given** metrics.js returns null or undefined for a metric (data collection failure)
**When** highlight selection runs
**Then** skip that metric in selection
**And** log warning to console
**And** continue with available metrics (graceful degradation)

**Per NFR51:** Post-game highlights render within 300ms of death screen (no perceptible delay)

---
