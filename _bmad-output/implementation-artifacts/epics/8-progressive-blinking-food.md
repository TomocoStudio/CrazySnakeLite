# Epic 8: Progressive Blinking Food System

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-08
**Completed:** —

---

## Overview

Introduce progressive uncertainty training by having food items cycle through colors at score 15+, hiding their effect type until consumed. Blinking percentage increases gradually from 10% at score 15 to 60% (cap) at score 80+. This trains decision-making under incomplete information — the cognitive faculty most eroded by AI dependency. Players must learn to act with ambiguity, assess risk with partial data, and develop uncertainty tolerance.

**FRs covered:** FR30-FR36 (Progressive blinking food system)

**Value:** First new cognitive layer in v2. Transforms pattern memorization into real-time risk assessment. Creates replayability through escalating unpredictability.

---

## Stories

### Story 8.1: Implement Color Cycling Animation (200ms per Color)

**As a** player,
**I want** mystery food to cycle through colors rapidly,
**So that** I cannot rely on color alone to identify the food type.

**Acceptance Criteria:**

**Given** a food item is marked as blinking
**When** the food is rendered
**Then** the food cycles through all 6 colors in sequence:
- Green → Yellow → Purple → Red → Cyan → Orange → repeat
**And** each color displays for 200ms (5 colors/second)
**And** the cycling continues until the food is consumed

**Given** a blinking food spawns
**When** the effect type is determined
**Then** the effect type is locked at spawn time
**And** the effect type remains hidden from the player
**And** consuming the food reveals and applies the locked effect

**Given** the game is running at 60 FPS
**When** blinking food is rendered
**Then** the frame rate remains at 60 FPS
**And** the color cycling does not cause performance degradation

**Technical Notes:**
- Add isBlinking flag to food state
- Add hiddenType field to store locked effect type
- Implement color cycling in render.js with time-based index calculation
- BLINK_SEQUENCE array: ['green', 'yellow', 'purple', 'red', 'cyan', 'orange']
- Calculate current color: BLINK_SEQUENCE[Math.floor(Date.now() / 200) % 6]
- Effect type assigned at spawn, never changes

**FRs:** FR30-FR32

---

### Story 8.2: Implement Score-Based Blinking Percentage Curve

**As a** player,
**I want** blinking food to appear gradually as my score increases,
**So that** I experience a smooth difficulty curve.

**Acceptance Criteria:**

**Given** my score is between 0-14
**When** new food spawns
**Then** no food blinks (0% blinking)
**And** all food colors are visible and predictable

**Given** my score is between 15-19
**When** new food spawns
**Then** 10% of food spawns as blinking

**Given** my score is between 20-29
**When** new food spawns
**Then** 20% of food spawns as blinking

**Given** my score is between 30-39
**When** new food spawns
**Then** 30% of food spawns as blinking

**Given** my score is between 40-59
**When** new food spawns
**Then** 40% of food spawns as blinking

**Given** my score is between 60-79
**When** new food spawns
**Then** 50% of food spawns as blinking

**Given** my score is 80 or above
**When** new food spawns
**Then** 60% of food spawns as blinking (capped)
**And** the blinking percentage never exceeds 60%

**Given** food spawns as blinking
**When** determining the effect type
**Then** the effect type uses the same probability distribution as visible food
- Growing: 40%
- Invincibility: 10%
- Wall Phase: 10%
- Speed Boost: 15%
- Speed Decrease: 15%
- Reverse Controls: 10%

**Technical Notes:**
- Create progression.js module with getBlinkingProbability(score)
- Return percentage based on score thresholds
- Update food.js spawnFood() to check blinking probability
- If RNG < blinkingProbability, set isBlinking: true
- Effect type determined by separate RNG using standard probabilities

**FRs:** FR33-FR35

---

### Story 8.3: Add Drop Shadow for Spatial Anchoring

**As a** player,
**I want** blinking food to have a persistent shadow,
**So that** I can track its position while colors cycle rapidly.

**Acceptance Criteria:**

**Given** a blinking food is rendered
**When** the color cycles
**Then** a 2px drop shadow is visible beneath the food
**And** the shadow position remains constant regardless of color
**And** the shadow color is rgba(0, 0, 0, 0.5) (50% black)

**Given** I am tracking a blinking food
**When** the colors cycle at 200ms per color
**Then** I can still locate the food position using the shadow
**And** the shadow provides spatial anchoring for magnocellular pathway processing

**Given** a non-blinking food is rendered
**When** the food is drawn
**Then** no shadow is applied (blinking food only)

**Technical Notes:**
- In render.js, before drawing blinking food:
  - Set ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
  - Set ctx.shadowBlur = 0
  - Set ctx.shadowOffsetX = 2
  - Set ctx.shadowOffsetY = 2
- Reset shadow after drawing food (ctx.shadowColor = 'transparent')
- Shadow applies to blinking food only

**FRs:** FR36

---

### Story 8.4: Implement First-Time Mystery Food Tooltip

**As a** player encountering blinking food for the first time,
**I want** a brief explanation,
**So that** I understand what mystery food means.

**Acceptance Criteria:**

**Given** my score reaches 15 for the first time
**When** the first blinking food spawns
**Then** a tooltip appears at the center of the screen:
- Content: "Mystery Food! Effect hidden until consumed"
- Background: rgba(0, 0, 0, 0.9) with 4px purple border
- Font: Jersey20, 20px, white text
- Border-radius: 8px
**And** the tooltip auto-dismisses after 3 seconds
**And** the game continues running (no pause)

**Given** the tooltip is visible
**When** I press any key
**Then** the tooltip dismisses immediately

**Given** I start a new game
**When** I reach score 15 again
**Then** the tooltip does NOT reappear (shown once per browser session)

**Given** the tooltip appears
**When** 3 seconds elapse
**Then** the tooltip fades out smoothly (500ms fade)
**And** the DOM element is removed after fade completes

**Technical Notes:**
- Track mysteryFoodTooltipShown in UI state (ui.mysteryFoodTooltipShown)
- Trigger tooltip when: score >= 15 AND first blinking food spawns AND !ui.mysteryFoodTooltipShown
- Create tooltip DOM element dynamically
- Use CSS fade animation (0% → 100% → 100% → 0%)
- Auto-dismiss with setTimeout(3000)
- Store in sessionStorage to prevent reappearance

**FRs:** FR35

---

### Story 8.5: Implement Reduced Motion Mode for Blinking Food

**As a** player with motion sensitivity,
**I want** blinking food to cycle more slowly or use alpha pulsing,
**So that** I can play without discomfort.

**Acceptance Criteria:**

**Given** my browser has prefers-reduced-motion enabled
**When** blinking food is rendered
**Then** the color cycling speed is reduced to 500ms per color (2 colors/second)
**Or** the food uses alpha pulsing instead of color cycling
**And** the effect type remains hidden until consumed

**Given** reduced motion mode uses alpha pulsing
**When** a blinking food is rendered
**Then** the food displays its hidden color at varying opacity
**And** the opacity oscillates smoothly between 50% and 100%
**And** the oscillation cycle is 1 second (2 Hz frequency)

**Given** reduced motion mode is active
**When** checking performance
**Then** the game maintains 60 FPS
**And** the reduced speed cycling does not impact gameplay

**Technical Notes:**
- Detect prefers-reduced-motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
- Store in CONFIG.REDUCED_MOTION
- If reduced motion:
  - Option A: Change cycle speed to 500ms
  - Option B: Use alpha pulse: ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 500)
- Recommend alpha pulse for better UX (less jarring than slow color shifts)

**FRs:** Accessibility requirement

---

### Story 8.6: Track Blinking Food Stats for Analytics

**As a** developer,
**I want** to track blinking food interactions,
**So that** we can validate uncertainty tolerance training.

**Acceptance Criteria:**

**Given** a blinking food spawns
**When** the food is created
**Then** analyticsState.totalBlinkingFoodsSpawned increments by 1

**Given** I eat a blinking food
**When** the food is consumed
**Then** cognitiveStats.mysteryFoodsEaten increments by 1
**And** analyticsState tracks the food was blinking (isBlinking flag)

**Given** I die without eating an available blinking food
**When** death triggers
**Then** analyticsState can determine avoidance behavior

**Technical Notes:**
- Add analyticsState.totalBlinkingFoodsSpawned counter
- Increment in food.js spawnFood() when isBlinking = true
- Track cognitiveStats.mysteryFoodsEaten in game.js food handler
- Pass isBlinking flag to analytics.js trackFoodEaten()
- This prepares for Epic 12 (Analytics)

**FRs:** Prepares for Epic 12

---

## Technical Architecture

**New Modules:**
- `js/progression.js` — getBlinkingProbability(score), getDifficultyTier(score)

**Modified Modules:**
- `js/food.js` — Add isBlinking, hiddenType fields; spawn logic
- `js/render.js` — Color cycling animation, drop shadow rendering
- `js/config.js` — Add BLINKING_THRESHOLDS, BLINK_SEQUENCE, REDUCED_MOTION
- `js/state.js` — Add ui.mysteryFoodTooltipShown
- `js/game.js` — Trigger tooltip at score 15, track mysteryFoodsEaten

**CSS:**
- `.mystery-food-tooltip` with fade animation

---

## Definition of Done

- [ ] All 6 stories complete with passing acceptance criteria
- [ ] Color cycling animation renders at 200ms per color
- [ ] Blinking probability curve matches spec (0% at 0-14, 10% at 15-19, ... 60% cap at 80+)
- [ ] Drop shadow provides spatial anchoring during cycling
- [ ] First-time tooltip appears at score 15, auto-dismisses after 3s
- [ ] Tooltip only appears once per session
- [ ] Reduced motion mode functional (500ms cycle or alpha pulse)
- [ ] Effect type locked at spawn, revealed on consumption
- [ ] Blinking food uses same probability distribution as visible food
- [ ] Game maintains 60 FPS with multiple blinking foods on screen
- [ ] cognitiveStats.mysteryFoodsEaten tracks correctly
- [ ] analyticsState.totalBlinkingFoodsSpawned tracks correctly
- [ ] Code reviewed and merged

---

**Epic Owner:** John (Dev)
**Estimated Effort:** 1.5 weeks
**Priority:** HIGH — First cognitive training layer in v2
**Dependencies:** Epic 7 (food rendering foundation)
