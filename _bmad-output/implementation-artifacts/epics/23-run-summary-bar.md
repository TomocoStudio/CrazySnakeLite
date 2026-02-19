# Epic 23: Run Summary Bar (Post-Game Food Counter)

**Status:** 🟢 COMPLETED
**Created:** 2026-02-19
**Completed:** 2026-02-19

---

## Overview

Add a compact animated badge strip to the Game Over screen that shows exactly what food types the player ate during their run, and how many phone calls they managed. Each badge displays the canonical in-game food glyph paired with a count that animates upward from 0 — a dopamine-driven savoring moment that transforms "I died" into "here's what I did." Only non-zero counts appear. No labels. No judgment.

**UX Spec:** `_bmad-output/planning-artifacts/ux-design-run-summary-bar.md`
**Designed by:** Sally (UX Designer) + Celia (Neuro-Game Designer)

**Value:** Retroactive competence feedback. Score tells the player *how much* they achieved; the Run Summary Bar tells them *what kind of player they are*. A player who sees "✕ ×6" (Reverse Controls) self-identifies as a risk-taker. A player who sees "☎ ×4" sees their decision-making under pressure reflected back. Narrative closure drives the "Play Again" impulse (Zeigarnik effect). Count-up animation delivers anticipatory dopamine — each tick is a micro-reward beat, not just a number. Designed and validated against the Five-Question Filter and SDT Competence Feedback principles.

**Placement:** Game Over screen only — between score display and quote card. Never in-game HUD, never on Skill Map.

---

## Stories

---

### Story 23.1: Add Per-Food-Type Tracking to Game State

**As a** developer,
**I want** the game to track how many of each food type the snake ate per run,
**So that** the Run Summary Bar has accurate data to display on the Game Over screen.

**Acceptance Criteria:**

**Given** `state.js` defines `cognitiveStats`
**When** initializing game state
**Then** add a `foodsEaten` sub-object to `cognitiveStats`:
```javascript
cognitiveStats: {
  // existing fields unchanged
  rcSurvived: 0,
  phoneCallsManaged: 0,
  mysteryFoodsEaten: 0,
  comboMultipliers: 0,
  pickUpStreak: 0,
  peakComboScore: 0,
  // NEW
  foodsEaten: {
    growing: 0,
    speedDecrease: 0,
    wallPhase: 0,
    speedBoost: 0,
    reverseControls: 0,
    invincibility: 0
  }
}
```

**Given** `game.js` `onFoodEaten()` handler resolves the food type
**When** any food is eaten
**Then** increment `gameState.cognitiveStats.foodsEaten[foodType]` by 1
**And** use the existing food type string literals exactly: `'growing'`, `'speedBoost'`, `'speedDecrease'`, `'wallPhase'`, `'invincibility'`, `'reverseControls'`
**And** the increment happens once per food eaten, regardless of effect outcome

**Given** the player starts a new game (Play Again or New Game)
**When** `resetGameState()` runs in `state.js`
**Then** `foodsEaten` is reset to all zeros
**And** all existing `cognitiveStats` fields continue to reset as before (no regression)

**Given** phone call data is needed for the Run Summary Bar
**When** game state is read at game-over time
**Then** `gameState.cognitiveStats.phoneCallsManaged` provides the phone badge count (already tracked — no changes needed)

---

### Story 23.2: Render Run Summary Bar on Game Over Screen

**As a** player,
**I want** to see a compact strip of food glyphs and counts when I die,
**So that** I can see at a glance exactly what kinds of food I ate during my run.

**Acceptance Criteria:**

**Given** the game transitions to `phase: 'gameover'`
**When** the Game Over screen renders
**Then** a Run Summary Bar is rendered as a DOM element (not canvas) between the score display area and the quote card
**And** vertical margin of 16px above and 16px below the bar

**Given** the Run Summary Bar is rendered
**When** determining which badges to show
**Then** only render badges where the count is greater than zero — strict zero suppression
**And** never render empty slots, placeholder badges, or greyed-out badges for uneaten food types
**And** the phone badge only appears if `phoneCallsManaged > 0`

**Given** one or more badges are shown
**When** ordering badges left to right
**Then** display in fixed order regardless of which are present:
`Growing → Speed Decrease → Wall Phase → Speed Boost → Reverse Controls → Invincibility → Phone`

**Given** the number of visible badges
**When** laying out the badge strip
**Then** ≤4 badges: single centered row
**And** 5–7 badges: two rows, each row centered independently
**And** horizontal gap between badges: 20px

**Given** each badge is rendered
**When** displaying badge anatomy
**Then** render the food's canonical CSS glyph at 14×14px
**And** render the count number at 18px Jersey20 font, 5px to the right of the glyph
**And** render NO label text — glyph + number only, nothing else
**And** render NO border, NO background pill, NO tooltip

**Given** badge colors are applied
**When** rendering glyphs and numbers
**Then** source all colors from `CONFIG.COLORS` — no hardcoded hex values in render code
**And** apply matching neon glow to both glyph and number per food type

**Given** a run where the player ate zero food of all types and managed zero calls
**When** the Game Over screen renders
**Then** the Run Summary Bar container is hidden entirely — no empty row, no reserved space

---

### Story 23.3: Implement Count-Up Animation

**As a** player,
**I want** the food counts to animate upward from zero when the Game Over screen appears,
**So that** each number feels earned and the summary moment is celebratory rather than static.

**Acceptance Criteria:**

**Given** the Game Over screen renders and the Run Summary Bar has one or more badges
**When** the animation sequence begins
**Then** badges enter staggered left-to-right with 80ms offset between each
**And** each badge entry is: fade-in + scale from 0.7 → 1.0 over 150ms, ease-out
**And** after all badges have entered, all counters begin counting simultaneously

**Given** counters begin counting
**When** animating each badge count
**Then** all visible counters start from 0 at the same `startTime` timestamp
**And** animation duration per badge: `Math.max(finalValue * 120, 600)` ms, capped at 2000ms
**And** animation is driven by `requestAnimationFrame` — not `setInterval` or `setTimeout`

**Given** a badge has `finalValue === 1`
**When** the animation sequence runs for that badge
**Then** skip the count-up animation — display `1` immediately on badge entry
**And** still apply the entry fade-in + scale animation

**Given** a counter reaches its `finalValue`
**When** the final number lands
**Then** trigger a single brightness flash: 1 white pulse over 200ms

**Given** `CONFIG.REDUCED_MOTION === true`
**When** the Game Over screen renders
**Then** skip count-up animation — display all final values immediately
**And** skip entry scale animation and landing flash
**And** read `CONFIG.REDUCED_MOTION` — do NOT call `window.matchMedia()` directly

---

### Story 23.4: Test Run Summary Bar

**As a** developer,
**I want** to validate the Run Summary Bar across game scenarios and edge cases,
**So that** the feature is reliable and never shows incorrect data or broken layout.

**Acceptance Criteria:**

**Given** a run where only growing food was eaten
**When** the Game Over screen appears
**Then** only the growing food badge is visible, all others suppressed

**Given** a run where all 6 food types were eaten and 2+ phone calls managed
**When** the Game Over screen appears
**Then** all 7 badges appear across two rows, each row centered
**And** badge order: Growing → Speed Decrease → Wall Phase → Speed Boost → Reverse Controls → Invincibility → Phone

**Given** a run where no phone calls were managed
**When** the Game Over screen appears
**Then** the phone badge does not appear

**Given** Play Again is pressed after a run
**When** a new game starts and the player dies
**Then** all `foodsEaten` counts reflect only the new run (correctly reset)

**Given** an instant-death run (zero food, zero calls)
**When** the Game Over screen appears
**Then** the Run Summary Bar container is fully hidden

**Given** `CONFIG.REDUCED_MOTION` is `true`
**When** the Game Over screen appears
**Then** all final values display immediately without animation, layout and colors identical to animated version
