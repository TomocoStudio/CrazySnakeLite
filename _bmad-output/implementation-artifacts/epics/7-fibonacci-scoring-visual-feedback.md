# Epic 7: Fibonacci Scoring & Visual Feedback System

**Status:** 🟢 COMPLETED
**Created:** 2026-02-08
**Completed:** 2026-02-16

---

## Overview

Transform flat scoring into a Fibonacci-based reward system with proportional visual salience. Each food type earns points matching its cognitive difficulty (0, +1, +2, +3, +5, +8), accompanied by escalating visual feedback: simple fade for +1, triumphant celebration with particles and screen shake for +8. This establishes the foundation for the Brain Gym identity — "difficulty is the product."

**FRs covered:** FR19-FR22 (Score popup system), FR81-FR84 (Fibonacci audio), FR10-FR17 (Updated food scoring values)

**Value:** Players FEEL the difference between easy and hard challenges. Proportional reward prediction error creates motivation to chase high-value foods.

---

## Stories

### Story 7.1: Update Food Scoring to Fibonacci Values

**As a** player,
**I want** food to reward points proportional to their difficulty,
**So that** I feel appropriately rewarded for challenging choices.

**Acceptance Criteria:**

**Given** the game is running
**When** I eat any food type
**Then** the score increases by its Fibonacci value:
- Growing (green): +1 point
- Speed Decrease (cyan): +2 points
- Wall Phase (purple): +1 point default, +3 points if wall interaction occurs
- Speed Boost (red): +5 points
- Reverse Controls (orange): +8 points
- Invincibility (yellow): 0 points

**Given** I eat a Wall Phase food
**When** I pass through a wall boundary while the effect is active
**Then** I receive +3 points (Wall Phase bonus)
**And** if I don't interact with a wall before eating the next food, I only received +1 point

**Technical Notes:**
- Update CONFIG.SCORING with new Fibonacci values
- Implement wallPhaseUsed flag in effects.js
- Update scoring.js to check wallPhaseUsed for conditional +3 vs +1
- Wall Phase scoring: default +1 on consumption, additional +2 if wall interaction detected before next food

**FRs:** FR10-FR17, FR33-FR34

---

### Story 7.2: Implement Score Popup System (+1, +2, +3)

**As a** player,
**I want** to see score popups when I eat food,
**So that** I get immediate feedback on my point gain.

**Acceptance Criteria:**

**Given** I eat a food item
**When** the food is consumed
**Then** a score popup appears at the collision point within 200ms
**And** the popup displays the point value ("+1", "+2", "+3")
**And** the popup animation matches the point value:
- +1: 16px white text, simple fade-up, 500ms duration
- +2: 16px light green text, slightly longer float, 600ms duration
- +3: 20px gold text, slight bounce animation, 700ms duration

**Given** a score popup appears
**When** the animation completes
**Then** the DOM element is automatically removed
**And** no memory leak occurs during extended play

**Technical Notes:**
- Create score-popup.js module with spawnPopup(value, x, y)
- Implement CSS animations for .score-popup-1, .score-popup-2, .score-popup-3
- Use translateY for float effect, keyframes for bounce
- Auto-cleanup with animation event listeners

**FRs:** FR19, FR21

---

### Story 7.3: Implement High-Value Score Popups (+5, +8)

**As a** player,
**I want** high-value foods to create impressive visual celebrations,
**So that** I feel the achievement of completing difficult challenges.

**Acceptance Criteria:**

**Given** I eat a Speed Boost food (+5)
**When** the food is consumed
**Then** a popup appears with:
- 28px orange text
- Pronounced bounce animation
- Subtle orange glow (text-shadow)
- 800ms duration

**Given** I eat a Reverse Controls food (+8)
**When** the food is consumed
**Then** a popup appears with:
- 40px red-orange text
- Dramatic bounce with rotation wiggle (-5° to +5°)
- Dual glow (gold inner, red outer)
- 1000ms duration
**And** 5-7 star particles explode from the collision point
**And** the canvas container shakes horizontally (3px, 200ms)

**Given** particles spawn
**When** they animate
**Then** each particle travels outward in a random direction
**And** particles fade out and shrink over 600ms
**And** particles auto-remove after animation

**Given** screen shake triggers
**When** the canvas shakes
**Then** the shake is subtle (3px horizontal displacement)
**And** the shake completes in 200ms
**And** the canvas returns to normal position

**Technical Notes:**
- Extend score-popup.js with particle system
- Add spawnParticles(count, x, y) function
- Implement triggerScreenShake() function
- CSS @keyframes for particle-explode and screen-shake
- Use CSS custom properties (--particle-x, --particle-y) for random vectors

**FRs:** FR19-FR22

---

### Story 7.4: Implement Fibonacci Musical Progression Audio

**As a** player,
**I want** each food type to play a distinct musical note,
**So that** I can recognize point values by sound alone.

**Acceptance Criteria:**

**Given** I eat any food
**When** the score is awarded
**Then** a musical note plays within 50ms:
- +1: C4 (261.63 Hz), soft beep, 100ms, sine wave
- +2: D4 (293.66 Hz), soft chime, 120ms, sine wave
- +3: E4 (329.63 Hz), mid chime, 150ms, triangle wave
- +5: G4 (392.00 Hz), high chime, 180ms, triangle wave
- +8: C5-E5-G5 (523/659/784 Hz), C major chord, 250ms, 3 sine waves

**Given** the Web Audio API is unavailable
**When** the game initializes
**Then** the game plays normally without audio
**And** no errors appear in the console

**Technical Notes:**
- Extend audio.js with generateFibonacciTone(value)
- Use Web Audio API OscillatorNode for procedural generation
- Implement graceful degradation if Web Audio unsupported
- Create playScoreSound(value) helper function
- Chord = 3 oscillators played simultaneously

**FRs:** FR81-FR84

---

### Story 7.5: Implement Popup Queue System (300ms Stagger)

**As a** player,
**I want** multiple score popups to appear clearly without overlap,
**So that** I can read all score values during rapid events.

**Acceptance Criteria:**

**Given** multiple score events fire within 500ms
**When** the second popup would spawn
**Then** it waits 300ms after the first popup appeared
**And** the second popup appears 50px below the first (vertical stacking)

**Given** a combo score (+24) and phone bonus (+13) fire simultaneously
**When** both popups render
**Then** the combo popup appears first at collision coordinates
**And** the phone bonus popup appears 300ms later, 50px below
**And** both popups are visible simultaneously until they fade

**Given** the popup queue has 3+ pending popups
**When** processing the queue
**Then** each popup staggers by 300ms
**And** all popups eventually appear (no dropped events)

**Technical Notes:**
- Add popup queue to score-popup.js
- Track lastPopupTime and enforce 300ms minimum spacing
- If multiple popups in 500ms window, queue them with setTimeout
- Stack vertically: each queued popup spawns 50px below previous

**FRs:** FR22

---

### Story 7.6: Reduced Motion Mode for Score Popups

**As a** player with motion sensitivity,
**I want** score popups to use simple animations,
**So that** I can play without discomfort.

**Acceptance Criteria:**

**Given** my browser has prefers-reduced-motion enabled
**When** any score popup appears
**Then** the popup uses simplified animations:
- No bounce or rotation
- Simple fade-up only
- No screen shake (disabled entirely)
- Particles still appear but with slower, linear motion

**Given** reduced motion mode is active
**When** I eat a +8 food
**Then** I still see the large popup and particles
**But** the screen shake does not occur
**And** the rotation wiggle is removed

**Technical Notes:**
- Detect prefers-reduced-motion with window.matchMedia
- Add .reduced-motion CSS class to body if detected
- Define alternate keyframes for .reduced-motion .score-popup-*
- Disable screen shake when reduced motion active

**FRs:** NFR related (accessibility)

---

## Technical Architecture

**New Modules:**
- `js/score-popup.js` — DOM popup lifecycle, particle system, screen shake

**Modified Modules:**
- `js/config.js` — Updated SCORING values (Fibonacci)
- `js/scoring.js` — Integrate wallPhaseUsed conditional logic
- `js/audio.js` — Fibonacci musical progression
- `js/game.js` — Call spawnPopup() on food consumption
- `js/effects.js` — Track wallPhaseUsed flag

**CSS:**
- `.score-popup-1` through `.score-popup-8` with keyframes
- `.particle-star` animation
- `@keyframes screen-shake`
- Reduced motion variants

---

## Definition of Done

- [ ] All 6 stories complete with passing acceptance criteria
- [ ] Food scoring values match Fibonacci (0, +1, +2, +3, +5, +8)
- [ ] Wall Phase awards +3 on wall interaction, +1 otherwise
- [ ] 5 distinct popup animations implemented
- [ ] Particles spawn and animate for +8
- [ ] Screen shake triggers for +8
- [ ] Fibonacci musical progression audio plays for all values
- [ ] Popup queue system enforces 300ms stagger
- [ ] Reduced motion mode functional
- [ ] No memory leaks during 30-minute extended play test
- [ ] Visual feedback appears within 200ms of food consumption (temporal contiguity)
- [ ] All popups auto-cleanup after animation
- [ ] Code reviewed and merged

---

**Epic Owner:** John (Dev)
**Estimated Effort:** 2 weeks
**Priority:** HIGH — Foundation for v2 Brain Gym repositioning
