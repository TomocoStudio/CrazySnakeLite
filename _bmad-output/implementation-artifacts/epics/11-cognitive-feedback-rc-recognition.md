# Epic 11: Cognitive Feedback & RC Recognition

**Status:** ✅ COMPLETE
**Created:** 2026-02-08
**Completed:** 2026-02-14

---

## Overview

Transform the death screen from "I failed" into "look what my brain just did" by displaying 2-3 cognitive achievement stats before the Play Again button appears. Track 6 stats during gameplay (rcSurvived, phoneCallsManaged, mysteryFoodsEaten, comboMultipliers, pickUpStreak, peakComboScore) and show the most impressive ones. Add "RC SURVIVED" flash when the player successfully navigates Reverse Controls without dying. This is metacognitive feedback (Flavell, 1979) — awareness of one's own cognitive processes improves learning and motivation. The Brain Gym identity is complete: the game tells the player what their brain accomplished.

**FRs covered:** FR70-FR72 (RC SURVIVED flash), FR75-FR80 (Post-game cognitive feedback)

**Value:** The "brain gym" payoff. Players see concrete evidence that their brain did hard cognitive work. Transforms death from frustration into achievement recognition.

---

## Stories

### Story 11.1: Implement "RC SURVIVED" Flash

**As a** player,
**I want** to receive immediate recognition when I survive Reverse Controls,
**So that** I feel acknowledged for completing the hardest cognitive challenge.

**Acceptance Criteria:**

**Given** I eat a Reverse Controls food (+8)
**When** the effect activates
**Then** my controls are reversed (up → down, left → right)

**Given** I am navigating with Reverse Controls active
**When** I successfully eat the next food without dying
**Then** a "RC SURVIVED" text flash appears:
- Content: "RC SURVIVED" (uppercase, orange text — matches RC food color)
- Font: Jersey20, 48px, extra bold (900 weight)
- Position: 20px below the +8 score popup
- Animation: 2500ms fade-up and fade-out (long enough to register during gameplay)
- Appears 200ms after the +8 popup (stagger rule)

**Given** the "RC SURVIVED" flash appears
**When** the animation plays
**Then** the flash does not obstruct gameplay
**And** the flash auto-removes after 2500ms

**Given** I eat Reverse Controls but die before eating the next food
**When** death occurs
**Then** no "RC SURVIVED" flash appears
**And** cognitiveStats.rcSurvived does NOT increment

**Technical Notes:**
- Track effects.reverseControlsActive flag
- On food consumption after RC: if reverseControlsActive && !died → survived
- Call spawnFlash("RC SURVIVED", x, y) from score-popup.js
- Position 20px below +8 popup using same x coordinate
- Use .rc-survived-flash CSS class with 2500ms fade animation
- Increment cognitiveStats.rcSurvived ONLY on successful survival

**FRs:** FR70-FR72

---

### Story 11.2: Track 6 Cognitive Stats During Gameplay

**As a** developer,
**I want** to track cognitive achievements during each game,
**So that** I can display meaningful feedback on the death screen.

**Acceptance Criteria:**

**Given** I start a new game
**When** the game initializes
**Then** all cognitive stats reset to 0:
- cognitiveStats.rcSurvived = 0
- cognitiveStats.phoneCallsManaged = 0
- cognitiveStats.mysteryFoodsEaten = 0
- cognitiveStats.comboMultipliers = 0
- cognitiveStats.pickUpStreak = 0
- cognitiveStats.peakComboScore = 0

**Given** I survive Reverse Controls (eat next food after RC without dying)
**When** the survival is confirmed
**Then** cognitiveStats.rcSurvived increments by 1

**Given** I dismiss any phone call (End or Pick Up)
**When** the call is dismissed
**Then** cognitiveStats.phoneCallsManaged increments by 1

**Given** I eat a blinking food
**When** the food is consumed
**Then** cognitiveStats.mysteryFoodsEaten increments by 1

**Given** I complete a combo (eat Effect B)
**When** the multiplicative score is awarded
**Then** cognitiveStats.comboMultipliers increments by 1

**Given** I Pick Up a call
**When** the Pick Up action completes
**Then** cognitiveStats.pickUpStreak increments by 1

**Given** I End a call
**When** the End action completes
**Then** cognitiveStats.pickUpStreak resets to 0

**Given** I earn a combo score
**When** checking the peak
**Then** cognitiveStats.peakComboScore = max(current peak, new score)

**Technical Notes:**
- Add cognitiveStats object to gameState
- Track in game.js event handlers:
  - RC survival: onFoodEaten() when reverseControlsActive
  - Phone managed: onPhoneDismiss()
  - Mystery eaten: onFoodEaten() when food.isBlinking
  - Combo multiplier: onFoodEaten() when combo.effectB consumed
  - Pick Up streak: onPhoneDismiss(action)
  - Peak combo: onFoodEaten() when combo scoring

**FRs:** FR76

---

### Story 11.3: Implement "Your Brain Today" Post-Game Display

**As a** player,
**I want** to see what my brain accomplished after I die,
**So that** I feel proud of my cognitive achievements.

**Acceptance Criteria:**

**Given** I die
**When** the game over screen appears
**Then** the screen displays:
- "GAME OVER" text
- Final score
- High score
- "Your Brain Today" header (purple theme color, uppercase, 14px)
- 2-3 cognitive stat lines (see selection logic below)

**Given** the "Your Brain Today" section appears
**When** the stats render
**Then** the header appears first
**And** each stat line staggers in at 300ms intervals
**And** the stats use white text, 16px, with subtle shadow

**Given** cognitiveStats has multiple non-zero values
**When** selecting stats to display
**Then** the top 2-3 stats with highest values are shown
**And** zero-value stats are never displayed

**Given** cognitiveStats.rcSurvived = 4
**When** the stat is selected
**Then** the display text is: "Reverse Controls survived: 4"

**Given** cognitiveStats.phoneCallsManaged = 7
**When** the stat is selected
**Then** the display text is: "Phone calls managed: 7"

**Given** cognitiveStats.mysteryFoodsEaten = 12
**When** the stat is selected
**Then** the display text is: "Mystery foods decoded: 12"

**Given** cognitiveStats.comboMultipliers = 3
**When** the stat is selected
**Then** the display text is: "Combo multipliers earned: 3"

**Given** cognitiveStats.pickUpStreak = 5
**When** the stat is selected
**Then** the display text is: "Pick Up streak: 5"

**Given** cognitiveStats.peakComboScore = 24
**When** the stat is selected
**Then** the display text is: "Best combo: ×24"

**Technical Notes:**
- Add .cognitive-stats container to game over screen HTML
- Add .cognitive-stats-header with "Your Brain Today"
- Generate stat lines dynamically from cognitiveStats
- Selection logic: sort by value descending, take top 3, filter zeros
- Priority if tied: rcSurvived > comboMultipliers > pickUpStreak > mysteryFoodsEaten > phoneCallsManaged > peakComboScore
- Use CSS nth-child delays for stagger: 300ms, 600ms, 900ms

**FRs:** FR75-FR78

---

### Story 11.4: Implement Stat Display Timing and Play Again Delay

**As a** player,
**I want** cognitive stats to appear briefly before the Play Again button,
**So that** I have time to absorb my achievements.

**Acceptance Criteria:**

**Given** I die
**When** the death animation completes
**Then** the following sequence occurs:
1. Game Over text + score appears immediately
2. 300ms delay
3. "Your Brain Today" header fades in
4. First stat line fades in
5. 300ms delay
6. Second stat line fades in (if exists)
7. 300ms delay
8. Third stat line fades in (if exists)
9. Stats hold visible for 2.5 seconds
10. Stats fade out (500ms)
11. Play Again button appears

**Given** the cognitive stats are visible
**When** 2.5 seconds elapse
**Then** the stats fade out smoothly (500ms fade)
**And** the Play Again button appears after the fade completes

**Given** the total delay before Play Again
**When** calculating time
**Then** the delay is approximately 3.3 seconds:
- 300ms initial delay
- 900ms stagger (3 lines × 300ms, worst case)
- 2500ms hold
- 500ms fade out
- Total ≈ 4200ms, but Play Again appears after fade starts (~3700ms)

**Given** only 1 stat qualifies for display
**When** the stats render
**Then** only 1 line appears (no padding with empty lines)
**And** the Play Again button still waits for the full sequence

**Technical Notes:**
- Use setTimeout chain for sequencing
- Fade-in: opacity 0 → 1 over 300ms
- Hold: visible for 2500ms
- Fade-out: opacity 1 → 0 over 500ms
- Show Play Again button after fade completes (or after 3.3s minimum)

**FRs:** FR79

---

### Story 11.5: Reset Cognitive Stats on New Game

**As a** player,
**I want** cognitive stats to reset when I start a new game,
**So that** each game session is tracked independently.

**Acceptance Criteria:**

**Given** I die and see cognitive stats
**When** I click "Play Again"
**Then** all cognitive stats reset to 0:
- rcSurvived = 0
- phoneCallsManaged = 0
- mysteryFoodsEaten = 0
- comboMultipliers = 0
- pickUpStreak = 0
- peakComboScore = 0

**Given** I start a new game
**When** the game initializes
**Then** cognitiveStats is a fresh object with all zeros

**Given** I achieve stats in game 1, die, and start game 2
**When** I achieve new stats in game 2
**Then** the stats displayed after game 2 death are ONLY from game 2
**And** game 1 stats are not carried over

**Technical Notes:**
- In state.js resetGame() or createInitialState()
- Reset all cognitiveStats fields to 0
- No persistence across games (session-based only)

**FRs:** FR80

---

### Story 11.6: Implement Reduced Motion Mode for Cognitive Stats

**As a** player with motion sensitivity,
**I want** cognitive stats to appear instantly without stagger,
**So that** I can play without discomfort.

**Acceptance Criteria:**

**Given** my browser has prefers-reduced-motion enabled
**When** the cognitive stats appear
**Then** all stat lines appear instantly (no 300ms stagger)
**And** the stats are immediately visible
**And** the Play Again button appears after 2.5s hold (no fade animations)

**Given** reduced motion mode is active
**When** the stats fade out
**Then** the fade is disabled (instant disappearance or very fast 100ms fade)

**Technical Notes:**
- Detect prefers-reduced-motion
- If active: remove animation delays, use instant opacity changes
- Maintain 2.5s hold time for readability

**FRs:** Accessibility requirement

---

## Technical Architecture

**New Modules:**
- `js/cognitive-feedback.js` — showCognitiveStats(), hideCognitiveStats(), selectTopStats()

**Modified Modules:**
- `js/state.js` — Add cognitiveStats object
- `js/game.js` — Track stats in event handlers, call cognitive-feedback.js on death
- `js/score-popup.js` — Add spawnFlash() for RC SURVIVED
- `js/effects.js` — Track reverseControlsActive flag
- `index.html` — Add .cognitive-stats container to game over screen

**CSS:**
- `.cognitive-stats` container styling
- `.cognitive-stats-header` purple theme
- `.cognitive-stat-line` with fade-in animation
- `.rc-survived-flash` with 2500ms fade animation

---

## Definition of Done

- [x] All 6 stories complete with passing acceptance criteria
- [x] "RC SURVIVED" flash appears on successful RC survival
- [x] Flash positioned 20px below +8 popup with 200ms stagger
- [x] Flash duration 2500ms with auto-cleanup
- [x] 6 cognitive stats tracked during gameplay
- [x] cognitiveStats resets on new game
- [x] "Your Brain Today" display implemented
- [x] Top 2-3 stats selected and displayed
- [x] Zero-value stats never shown
- [x] Stat lines stagger at 300ms intervals
- [x] Stats hold for 2.5 seconds before fade-out
- [x] Play Again button appears ~3.3s after death
- [x] Reduced motion mode functional (instant appearance, no stagger)
- [x] Stat display text matches exact format specified
- [x] Purple theme color used for "Your Brain Today" header
- [x] Code reviewed and merged

---

**Epic Owner:** John (Dev)
**Estimated Effort:** 1.5 weeks
**Priority:** HIGH — Brain Gym identity payoff
**Dependencies:** Epic 7 (RC effect), Epic 8 (blinking food), Epic 9 (phone calls), Epic 10 (combo mode)
