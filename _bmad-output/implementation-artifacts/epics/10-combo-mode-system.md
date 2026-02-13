# Epic 10: Combo Mode System

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-08
**Completed:** —

---

## Overview

Introduce combo mode at score 40+ where two consecutive food effects combine for multiplicative scoring. The canvas background transforms to a dark color (purple, blue, red, or green), the snake renders with striped segments (alternating Effect A/Effect B colors), and consuming the second food awards A × B points. Eating a third food exits combo mode. Probability increases from 10% at score 40 to 40% (cap) at score 120+. Combo timer pauses during phone calls to respect cognitive budget at the combo learning phase. This trains working memory (holding 2 effects in mind), multiplicative thinking, and strategic planning under time pressure.

**FRs covered:** FR40-FR48 (Combo mode system)

**Value:** Creates peak emotional moments and shareable stories ("I got a 40-point combo!"). Trains working memory and strategic food sequencing. The dark canvas transformation makes every combo feel like a special event.

---

## Stories

### Story 10.1: Implement Probability-Based Combo Activation

**As a** player,
**I want** combo mode to trigger occasionally at high scores,
**So that** I experience peak scoring moments without overwhelming frequency.

**Acceptance Criteria:**

**Given** my score is between 0-39
**When** I eat food
**Then** combo mode never activates (0% probability)

**Given** my score is between 40-59
**When** I eat food
**Then** combo mode has a 10% chance to activate

**Given** my score is between 60-79
**When** I eat food
**Then** combo mode has a 20% chance to activate

**Given** my score is between 80-99
**When** I eat food
**Then** combo mode has a 30% chance to activate

**Given** my score is between 100-119
**When** I eat food
**Then** combo mode has a 35% chance to activate

**Given** my score is 120 or above
**When** I eat food
**Then** combo mode has a 40% chance to activate (capped)

**Given** combo mode is already active
**When** I eat food during combo
**Then** the combo activation probability check does NOT run
**And** the existing combo continues processing

**Given** combo mode activates
**When** the trigger occurs
**Then** the currently consumed food becomes Effect A
**And** combo.active = true
**And** combo.effectA stores the food type and point value

**Technical Notes:**
- Add progression.js getComboProbability(score) function
- Return percentage based on score thresholds
- Check on every food consumption: if !combo.active && RNG < comboProbability → activate
- Store current food as Effect A: combo.effectA = {type: food.type, points: food.points}

**FRs:** FR40-FR41

---

### Story 10.2: Implement Canvas Background Color Transition

**As a** player,
**I want** the game canvas to change color during combo mode,
**So that** I immediately recognize I'm in a special state.

**Acceptance Criteria:**

**Given** combo mode activates
**When** the trigger occurs
**Then** the canvas background color transitions from light grey (#E8E8E8) to a dark color
**And** the transition is a smooth 500ms fade
**And** the dark color is randomly selected from:
  - Dark purple: #4A148C
  - Dark blue: #0D47A1
  - Dark red: #B71C1C
  - Dark green: #1B5E20

**Given** combo mode exits (third food eaten)
**When** the exit triggers
**Then** the canvas background transitions back to light grey (#E8E8E8)
**And** the transition is a smooth 500ms fade

**Given** a phone call arrives during active combo
**When** the phone overlay shows
**Then** the dark combo canvas color remains visible underneath the blur
**And** the canvas uses both: combo color + 4px blur

**Given** the canvas is dark during combo
**When** rendering the snake and food
**Then** the light colors remain clearly visible against the dark background
**And** contrast is sufficient for gameplay

**Technical Notes:**
- Add combo.canvasColor to state
- Random selection: COMBO_CANVAS_COLORS[Math.floor(Math.random() * 4)]
- CSS transition on canvas background-color: 500ms ease-in-out
- Apply combo color: canvas.style.backgroundColor = combo.canvasColor
- Reset on exit: canvas.style.backgroundColor = '#E8E8E8'

**FRs:** FR42-FR43

---

### Story 10.3: Implement Striped Snake Rendering

**As a** player,
**I want** the snake to display a striped pattern during combo mode,
**So that** I visually understand I'm managing two simultaneous effects.

**Acceptance Criteria:**

**Given** combo mode is active with Effect A
**When** the snake is rendered
**Then** all segments display Effect A's color (solid, pre-stripe)

**Given** I eat the second food during combo (Effect B)
**When** the food is consumed
**Then** the snake rendering switches to striped pattern:
- Head (segment 0): Effect B color
- Segment 1: Effect A color
- Segment 2: Effect B color
- Segment 3: Effect A color
- Pattern continues alternating for all segments

**Given** the snake has a striped pattern
**When** viewing the snake
**Then** the alternating colors create a clear barber-pole effect
**And** the head color (Effect B) is visually distinct

**Given** segment colors are similar (e.g., purple and red)
**When** rendering striped segments
**Then** 1px black borders are added to all segments during combo
**And** the borders ensure visual separation

**Given** combo mode exits
**When** the third food is eaten
**Then** the snake reverts to standard single-color rendering
**And** the color reflects the most recent food effect

**Technical Notes:**
- Update render.js renderSnake() with combo mode branch
- If combo.active && combo.effectB exists:
  - Render head with combo.effectB color
  - Alternate segment colors: index % 2 === 1 ? effectA : effectB
  - Add 1px black stroke to all segments during combo
- Store combo.effectB = {type, points} when second food eaten

**FRs:** FR45

---

### Story 10.4: Implement Multiplicative Scoring (A × B)

**As a** player,
**I want** the second food in combo mode to award A × B points,
**So that** I earn massive rewards for managing two simultaneous effects.

**Acceptance Criteria:**

**Given** combo mode is active with Effect A = Reverse Controls (+8)
**When** I eat Effect B = Speed Boost (+5)
**Then** I receive 8 × 5 = 40 points
**And** a large score popup displays "+40 COMBO"
**And** the popup uses the high-value style (dramatic animation)

**Given** combo mode is active with Effect A = Wall Phase (+3)
**When** I eat Effect B = Speed Decrease (+2)
**Then** I receive 3 × 2 = 6 points
**And** a score popup displays "+6 COMBO"

**Given** combo mode is active with Effect A = Growing (+1)
**When** I eat Effect B = Growing (+1)
**Then** I receive 1 × 1 = 1 point (lowest combo)

**Given** combo mode is active with Effect A = Invincibility (0)
**When** I eat Effect B = any food
**Then** I receive 0 × B = 0 points (wasted combo)
**And** the popup still appears: "+0 COMBO"

**Given** I eat a 15+ point combo
**When** the score is awarded
**Then** a special "jackpot" audio fanfare plays (600ms)

**Given** I eat a 30+ point combo
**When** the score is awarded
**Then** a "legendary" audio fanfare plays (800ms extended triumphant chord)

**Technical Notes:**
- Calculate score: combo.effectA.points × combo.effectB.points
- Display popup with "COMBO" label suffix
- Use existing popup system, but check value for special audio triggers
- combo.effectA and combo.effectB must be stored with point values

**FRs:** FR44

---

### Story 10.5: Implement Third Food Exits Combo

**As a** player,
**I want** combo mode to end after eating a third food,
**So that** I return to normal gameplay and can potentially trigger a new combo.

**Acceptance Criteria:**

**Given** combo mode is active with Effect B consumed
**When** I eat a third food
**Then** combo mode exits:
- combo.active = false
- Canvas transitions back to light grey (500ms)
- Snake reverts to single-color rendering
- Combo state clears: effectA = null, effectB = null, canvasColor = null

**Given** combo mode exits
**When** the exit triggers
**Then** a descending "deflation" audio cue plays (300ms)
**And** the audio signals return to normal mode

**Given** I die during combo mode (before third food)
**When** death triggers
**Then** combo mode does NOT naturally exit
**And** the game over screen shows the combo state (for analytics)

**Given** combo exits and I'm at score 50
**When** I eat the next food after combo
**Then** a new combo has a 20% chance to trigger (normal probability check)

**Technical Notes:**
- Track combo food count: combo.foodCount (starts at 1, increments to 2, then 3)
- On third food: trigger combo exit
- Reset all combo state fields
- Play exit audio: audio.playComboExit()
- Canvas transition back to #E8E8E8

**FRs:** FR46

---

### Story 10.6: Implement Combo Timer Pause During Phone Calls

**As a** player,
**I want** combo mode to pause while handling phone calls,
**So that** I'm not overwhelmed by simultaneous cognitive demands while learning the combo system.

**Acceptance Criteria:**

**Given** combo mode is active
**When** a phone call arrives
**Then** the combo timer pauses (foodCount does not advance until phone dismisses)
**And** combo.active remains true
**And** the dark canvas color remains visible under the blur

**Given** the phone overlay is active during combo
**When** I dismiss the call (End or Pick Up)
**Then** combo mode resumes immediately:
- Striped snake pattern remains intact
- Dark canvas color persists
- Combo foodCount continues from where it paused
- Next food eaten increments foodCount normally

**Given** combo is paused during Pick Up
**When** the Pick Up timer is running
**Then** the combo state is fully preserved
**And** eating food during Pick Up is still possible (combo resumes after dismissal)

**Given** I die during a paused combo
**When** death triggers
**Then** combo state is captured for analytics (combo was active)

**Technical Notes:**
- Add CONFIG.COMBO_PAUSE_ON_PHONE = true
- In game loop: if phoneCall.active && combo.active → do not increment combo.foodCount on food consumption
- Resume combo after phone.active = false
- Combo state (effectA, effectB, canvasColor, striped snake) persists during pause

**FRs:** FR47-FR48

---

### Story 10.7: Track Combo Stats for Analytics and Cognitive Feedback

**As a** developer,
**I want** to track combo mode interactions,
**So that** we can validate working memory training and display cognitive stats.

**Acceptance Criteria:**

**Given** combo mode activates
**When** the trigger occurs
**Then** analyticsState.totalCombosTriggered increments by 1

**Given** I complete a combo (eat Effect B)
**When** the multiplicative score is awarded
**Then** cognitiveStats.comboMultipliers increments by 1
**And** analyticsState.comboScores.push(A × B)

**Given** I earn a combo score
**When** checking the peak combo score
**Then** cognitiveStats.peakComboScore = max(current, new score)

**Given** I die during combo mode
**When** death triggers
**Then** analyticsState.combo_active = true (for game_over event)

**Given** a phone call occurs during combo
**When** the overlap happens
**Then** analyticsState.comboPhoneOverlaps increments by 1

**Given** I survive a phone call during combo
**When** the call dismisses and combo resumes
**Then** analyticsState.comboPhoneOverlapSurvived increments by 1

**Technical Notes:**
- Add cognitiveStats.comboMultipliers counter
- Add cognitiveStats.peakComboScore tracker
- Add analyticsState.totalCombosTriggered counter
- Add analyticsState.comboScores array (for distribution analysis)
- Add analyticsState.comboPhoneOverlaps and comboPhoneOverlapSurvived counters
- Track combo.active at death for analytics snapshot

**FRs:** Prepares for Epic 11 and Epic 12

---

## Technical Architecture

**New Modules:**
- `js/combo.js` — Combo state machine: activate(), handleFoodEaten(), pause(), resume(), isActive()

**Modified Modules:**
- `js/progression.js` — Add getComboProbability(score)
- `js/config.js` — Add COMBO_PROBABILITIES, COMBO_CANVAS_COLORS, COMBO_PAUSE_ON_PHONE
- `js/state.js` — Add combo state object
- `js/game.js` — Integrate combo activation check, pause/resume during phone
- `js/render.js` — Implement striped snake rendering
- `js/audio.js` — Add playComboEntrance(), playComboExit(), playJackpot(), playLegendary()
- `js/scoring.js` — Integrate combo multiplicative scoring

**CSS:**
- Canvas background-color transition (500ms ease-in-out)

---

## Definition of Done

- [ ] All 7 stories complete with passing acceptance criteria
- [ ] Combo activation probability matches spec (10% at 40, 40% cap at 120+)
- [ ] Canvas color transition functional (4 dark colors, random selection, 500ms fade)
- [ ] Striped snake rendering implemented (alternating Effect A/Effect B)
- [ ] 1px black borders on segments during combo for visual clarity
- [ ] Multiplicative scoring works (A × B)
- [ ] Combo score popup displays with "COMBO" label
- [ ] Third food exits combo mode correctly
- [ ] Canvas transitions back to light grey on exit
- [ ] Combo timer pauses during phone calls
- [ ] Combo resumes after phone dismissal with all state intact
- [ ] Audio cues functional: entrance fanfare, exit deflation, jackpot (15+), legendary (30+)
- [ ] cognitiveStats tracking: comboMultipliers, peakComboScore
- [ ] analyticsState tracking: totalCombosTriggered, comboScores, phone overlaps
- [ ] Game maintains 60 FPS during combo mode
- [ ] Combo + phone blur visual stacking works correctly
- [ ] Code reviewed and merged

---

**Epic Owner:** John (Dev)
**Estimated Effort:** 2 weeks
**Priority:** HIGH — Peak emotional moments, working memory training
**Dependencies:** Epic 7 (food/scoring), Epic 9 (phone system), progression.js
