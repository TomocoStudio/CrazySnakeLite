# UX Design: Run Summary Bar (Post-Game Food Counter)
**Author:** Sally (UX Designer) + Celia (Neuro-Game Designer)
**Date:** 2026-02-19
**Status:** ✅ Spec complete — ready for PM story creation

---

## Overview

A compact post-game badge strip showing what the player actually did during a run: how many of each food type they ate, and whether they managed any phone calls. Displayed on the **Game Over screen** between the score display and the quote card.

**Design intent:** Retroactive competence feedback. The run becomes a story, not just a number.

---

## Design Principles Applied

### Five-Question Filter (game-ux-principles.md)

| Question | Answer |
|---|---|
| **Working memory safe?** | Yes — post-death only, zero active cognitive demand at this moment |
| **Competence feedback?** | Core purpose — player sees their behavioral choices reflected back |
| **Clarity?** | Icon-only (no labels) + animated count. Each glyph maps 1:1 to in-game food shape |
| **Flow preservation?** | Does not interrupt play state — appears only after death |
| **Emotional impact?** | Count-up animation creates a savoring / celebration moment (fiero) |

### Neuro-Psych Justification (Celia)

1. **SDT Competence Feedback** — Naming what the player did (6 Reverse Controls, 3 Pick-Ups) activates pride-in-achievement (fiero). Score alone says *how much*; the summary says *what kind of player you are*.
2. **Retrospective consolidation window** — Post-death is the brain's natural debrief moment. Cognitive load is zero. This is when learning encodes most effectively (Ebbinghaus).
3. **Anticipatory dopamine via count-up** — Each tick of the counter is a micro-reward beat. The brain releases dopamine *in anticipation* of the final number, extending the positive emotional response across the full animation duration.
4. **Narrative closure (Zeigarnik)** — Each run is an open loop in the player's mind. The summary bar closes it: "Here is the run you just lived." Closed loops drive replay.

---

## Content Rules

### What to show

| Badge | Condition to display | Count value |
|---|---|---|
| Growing food glyph | `foodsEaten.growing > 0` | `foodsEaten.growing` |
| Speed Decrease glyph | `foodsEaten.speedDecrease > 0` | `foodsEaten.speedDecrease` |
| Wall Phase glyph | `foodsEaten.wallPhase > 0` | `foodsEaten.wallPhase` |
| Speed Boost glyph | `foodsEaten.speedBoost > 0` | `foodsEaten.speedBoost` |
| Reverse Controls glyph | `foodsEaten.reverseControls > 0` | `foodsEaten.reverseControls` |
| Invincibility glyph | `foodsEaten.invincibility > 0` | `foodsEaten.invincibility` |
| Phone glyph | `phoneCallsManaged > 0` | `phoneCallsManaged` |

**Zero suppression is absolute.** If a food type was not eaten, its badge does not appear — not even greyed out. No empty slots. No placeholders.

### Badge order (left to right)

Fixed display order regardless of which are visible:
`Growing → Speed Decrease → Wall Phase → Speed Boost → Reverse Controls → Invincibility → Phone`

Rationale: ordered by ascending cognitive difficulty (matches the game's cognitive training arc).

### Row wrapping

- **≤4 badges:** single row, centered
- **5-7 badges:** wrap to two rows, each row centered independently
- Maximum possible: 7 badges (6 food types + phone) — always fits in 2 rows

---

## Visual Design

### Badge anatomy

```
  ■  6
```

- **Glyph:** Exact in-game food shape, rendered in CSS (same shapes as canvas — square, hollow square, ring, cross, X, star, retro phone)
- **Glyph size:** 14×14px
- **Gap between glyph and number:** 5px
- **Number:** 18px, Jersey20 font, color matches food's canonical neon color, with matching glow
- **No label. No border. No background pill.**
- Badge-to-badge spacing: 20px horizontal gap

### Colors (all from existing CONFIG.COLORS — zero new colors)

| Food | Glyph + Number color | Glow |
|---|---|---|
| Growing | `#00FF00` green | `0 0 8px rgba(0,255,0,0.8)` |
| Speed Decrease | `#00CED1` dark turquoise | `0 0 8px rgba(0,206,209,0.8)` |
| Wall Phase | `#800080` purple | `0 0 8px rgba(128,0,128,0.8)` |
| Speed Boost | `#FF0000` red | `0 0 8px rgba(255,0,0,0.8)` |
| Reverse Controls | `#FF8C00` orange | `0 0 8px rgba(255,140,0,0.8)` |
| Invincibility | `#FFFF00` yellow | `0 0 8px rgba(255,255,0,0.8)` |
| Phone (calls managed) | `#FFD700` gold | `0 0 8px rgba(255,215,0,0.8)` |

### Glyph rendering

Rendered in CSS/HTML (not canvas) as inline SVG or CSS shapes — consistent with the DOM overlay approach used for phone and skill map screens.

| Food | Shape |
|---|---|
| Growing | Filled square |
| Speed Decrease | Hollow square (2px stroke) |
| Wall Phase | Hollow circle / ring (2px stroke) |
| Speed Boost | Plus/cross shape |
| Reverse Controls | X shape (diagonal cross) |
| Invincibility | 4-point star |
| Phone | Retro handset icon (Unicode `☎` or inline SVG) |

---

## Placement on Game Over Screen

```
┌──────────────────────────────────────────────┐
│                                              │
│              GAME OVER                       │
│                                              │
│              Score: 47                       │
│           High Score: 63                     │
│                                              │
│   ◯ ×3   ✚ ×2   ✕ ×6   ☎ ×4               │  ← RUN SUMMARY BAR (new)
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ [portrait] "quote text..."           │   │  ← existing quote card
│  │            — Caller Name             │   │
│  └──────────────────────────────────────┘   │
│                                              │
│      [PLAY AGAIN]      [SKILL MAP]           │
│                                              │
└──────────────────────────────────────────────┘
```

- Vertical spacing: 16px margin above and below the summary bar
- The summary bar does not replace any existing element — it inserts between score area and quote card

---

## Count-Up Animation

### Sequence

```
t = 0ms       Badges appear (staggered left-to-right, 80ms offset each)
              Entry: fade-in + scale from 0.7 → 1.0, 150ms ease-out

t = 300ms     All visible counters begin counting simultaneously
              Count from 0 → final value

t = 300ms     Duration: max(count × 120ms, 600ms), capped at 2000ms
  to          Easing: ease-out (fast start, decelerates into final number)
  ~2300ms

t = landing   On reaching final number: brief brightness flash
              Same treatment as `.milestone-blink` — 1 white flash, 200ms
```

### Implementation notes

- Counter animation driven by `requestAnimationFrame` loop in the game-over rendering function
- Each badge tracks its own `currentDisplay` value, incremented per frame based on elapsed time
- Easing formula: `currentDisplay = Math.round(easeOut(elapsed / duration) * finalValue)`
- All counters share the same `startTime` (simultaneous)
- If `finalValue === 1`, skip animation — display `1` immediately (no point animating a single tick)

---

## Data Requirements

### New state fields required

`cognitiveStats` in `gameState` needs a new sub-object:

```javascript
cognitiveStats: {
  // EXISTING (unchanged)
  rcSurvived: 0,
  phoneCallsManaged: 0,
  mysteryFoodsEaten: 0,
  comboMultipliers: 0,
  pickUpStreak: 0,
  peakComboScore: 0,

  // NEW — per-food-type eat counts
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

### Where to increment

In `game.js` → `onFoodEaten()` handler, after the food type is resolved:

```javascript
// Increment per-food-type counter
gameState.cognitiveStats.foodsEaten[foodType]++;
```

- `foodType` values match existing string literals: `'growing'`, `'speedBoost'`, `'speedDecrease'`, `'wallPhase'`, `'invincibility'`, `'reverseControls'`
- Phone calls: `phoneCallsManaged` already incremented in existing phone dismiss logic — no change needed

### Reset on new game

`foodsEaten` object must be reset to all zeros in `state.js` `resetGameState()` — consistent with all other `cognitiveStats` fields.

---

## Module Responsibilities

| Task | Module |
|---|---|
| Track `foodsEaten` counts | `game.js` (`onFoodEaten`) |
| Reset `foodsEaten` on new game | `state.js` |
| Render badge strip DOM | `main.js` or new `run-summary.js` (Dev to decide) |
| Count-up animation loop | same module as render |
| Read `cognitiveStats` for display | existing post-game render path |

**DOM access rule:** Badge strip is DOM-rendered (not canvas) — consistent with existing overlays. Only `main.js` or a dedicated display module may touch DOM.

---

## What This Is NOT

- **Not an in-game HUD** — zero display during active play
- **Not a performance judgment** — no "good/bad" framing, no comparisons, no benchmarks
- **Not a replacement for the Skill Map** — this is run-level color; Skill Map shows session-level trends
- **Not labeled** — glyphs only, no text labels beneath icons

---

## UX Warnings (Celia)

1. **Never show zero values** — a `0` in a run summary reads as failure, not neutrality. Strict zero-suppression is non-negotiable.
2. **Phone badge is neutral** — `phoneCallsManaged` counts both Pick-Up and End. Do not distinguish between them here. Both are valid choices. No judgment on which was "better."
3. **Animation must not feel slow** — if the count-up drags, it becomes anxiety instead of celebration. Cap at 1200ms total. If it feels too slow in testing, reduce `count × 80ms` multiplier.
4. **Do not add this to the Skill Map screen** — the Skill Map already has its own data density. The summary bar lives on Game Over only.

---

## Checklist for Dev Handoff

- [ ] `cognitiveStats.foodsEaten` object added to `state.js`
- [ ] `onFoodEaten()` in `game.js` increments correct food key
- [ ] `resetGameState()` in `state.js` zeros out `foodsEaten`
- [ ] Badge strip DOM rendered on game-over phase transition
- [ ] Zero-suppression logic: only render badges where count > 0
- [ ] Badge order fixed: growing → speedDecrease → wallPhase → speedBoost → reverseControls → invincibility → phone
- [ ] Phone badge driven by `phoneCallsManaged`, not `pickUpStreak`
- [ ] Count-up animation: simultaneous start, ease-out, capped 1200ms
- [ ] Final-number flash: 1 white pulse on landing
- [ ] `finalValue === 1` skips animation, renders immediately
- [ ] Placement: between score area and quote card on Game Over screen
- [ ] Row wrap: ≤4 badges single row, 5-7 badges two rows
- [ ] Colors sourced from `CONFIG.COLORS` — no hardcoded hex in render module
- [ ] Jersey20 font for all count numbers
- [ ] No labels rendered anywhere near badges
