# Epic 2: Chaos Food Effects

**Status:** ✅ COMPLETE
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Overview

Players experience the strategic chaos through 5 additional food types with unique effects - invincibility, wall-phase, speed boost, speed decrease, and reverse controls. This is the core innovation that makes CrazySnakeLite different from regular Snake.

**FRs covered:** FR13-FR20, FR22, FR51-FR53, FR57

---

## Stories

### Story 2.1: Effect System Foundation

**As a** player,
**I want** food effects to apply immediately and last until I eat the next food,
**So that** I can strategically plan which foods to pursue.

**Acceptance Criteria:**

**Given** the snake eats any special food (not growing)
**When** the food is consumed
**Then** the effect is applied immediately
**And** the effect is stored in gameState.activeEffect

**Given** the snake has an active effect
**When** the snake eats any food (including growing)
**Then** the previous effect is cleared immediately
**And** the new effect (if any) is applied

**Given** the snake has an active effect
**When** checking the effect state
**Then** the effect type is accessible for collision, movement, and rendering logic

**Given** the effects system is implemented
**When** multiple games are played
**Then** effects trigger reliably 100% of the time when the corresponding food is consumed

**Technical Notes:**
- Implement effects.js with applyEffect(), clearEffect(), isEffectActive()
- activeEffect structure: `{ type: 'invincibility' }` or `null`
- Update game.js to clear effect before applying new one on food consumption
- Effect types: 'invincibility', 'wallPhase', 'speedBoost', 'speedDecrease', 'reverseControls'

**FRs:** FR20

---

### Story 2.2: Invincibility Food

**As a** player,
**I want** to eat yellow food and become temporarily invincible,
**So that** I can survive risky situations and play aggressively.

**Acceptance Criteria:**

**Given** yellow star-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the invincibility effect is applied
**And** the snake displays a rapid strobe/blinking yellow visual

**Given** the snake has invincibility active
**When** the snake's head hits a wall
**Then** the snake does NOT die
**And** the snake bounces off or stops at the wall boundary

**Given** the snake has invincibility active
**When** the snake's head collides with its own body
**Then** the snake does NOT die
**And** gameplay continues normally

**Given** the snake has invincibility active
**When** the snake eats any other food
**Then** the invincibility effect ends immediately
**And** the strobe visual stops
**And** normal collision rules apply again

**Given** the invincibility strobe is active
**When** rendering the snake
**Then** the snake rapidly alternates between yellow and its base color
**And** the strobe rate is visually clear as a "power-up" indicator

**Technical Notes:**
- Yellow food shape: 4-point star
- Strobe effect: alternate colors every few frames (e.g., every 100ms)
- Update collision.js to check for invincibility before triggering death

**FRs:** FR13, FR14, FR53

---

### Story 2.3: Wall-Phase Food

**As a** player,
**I want** to eat purple food and phase through one wall,
**So that** I can escape tight corners or take shortcuts.

**Acceptance Criteria:**

**Given** purple ring/donut-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the wall-phase effect is applied
**And** the snake turns purple

**Given** the snake has wall-phase active
**When** the snake's head moves past a wall boundary
**Then** the snake passes through the wall
**And** the snake head appears on the opposite side of the board
**And** the wall-phase effect is consumed (single-use)

**Given** the snake has wall-phase active
**When** the snake eats another food before hitting a wall
**Then** the wall-phase effect is cleared (unused)
**And** the new food's effect (if any) is applied

**Given** wall-phase is triggered
**When** the snake passes through the wall
**Then** only the head wraps; body segments follow naturally through subsequent moves

**Given** the snake is phasing through a wall
**When** checking self-collision
**Then** normal self-collision rules still apply (wall-phase doesn't grant self-immunity)

**Technical Notes:**
- Purple food shape: ring/donut (hollow circle)
- Wall-phase is single-use: consumed on wall pass OR cleared on next food
- Wrap logic: if head.x < 0, head.x = GRID_WIDTH - 1 (and vice versa for all edges)

**FRs:** FR15, FR16

---

### Story 2.4: Speed Modifier Foods

**As a** player,
**I want** speed-changing foods to make the game more chaotic,
**So that** I experience varied gameplay intensity.

**Acceptance Criteria:**

**Given** red cross/plus-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the speed boost effect is applied
**And** the snake turns red
**And** the snake moves faster (1.5x to 2x base speed, randomly selected)

**Given** cyan hollow square food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the speed decrease effect is applied
**And** the snake turns cyan
**And** the snake moves slower (0.3x to 0.5x base speed, randomly selected)

**Given** the snake has speed boost active
**When** the game loop processes movement
**Then** the tick rate is reduced (snake moves more frequently)
**And** 60 FPS rendering is maintained

**Given** the snake has speed decrease active
**When** the game loop processes movement
**Then** the tick rate is increased (snake moves less frequently)
**And** the player waits noticeably longer between moves

**Given** the snake has any speed modifier active
**When** the snake eats any other food
**Then** the speed returns to normal (8 moves per second)
**And** the new food's effect (if any) is applied

**Technical Notes:**
- Red food shape: cross/plus (+)
- Cyan food shape: hollow square (outline only)
- Speed boost multiplier: random between 1.5x and 2.0x (from config.js)
- Speed decrease multiplier: random between 0.3x and 0.5x (from config.js)
- Modify TICK_RATE dynamically based on active effect

**FRs:** FR17, FR18

---

### Story 2.5: Reverse Controls Food

**As a** player,
**I want** orange food to invert my controls temporarily,
**So that** I experience chaotic, challenging gameplay.

**Acceptance Criteria:**

**Given** orange X-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the reverse controls effect is applied
**And** the snake turns orange

**Given** the snake has reverse controls active
**When** the player presses Up (or W/Z/8)
**Then** the snake moves Down

**Given** the snake has reverse controls active
**When** the player presses Down (or S/2)
**Then** the snake moves Up

**Given** the snake has reverse controls active
**When** the player presses Left (or A/Q/4)
**Then** the snake moves Right

**Given** the snake has reverse controls active
**When** the player presses Right (or D/6)
**Then** the snake moves Left

**Given** the snake has reverse controls active on mobile
**When** the player swipes in a direction
**Then** the snake moves in the opposite direction

**Given** the snake has reverse controls active
**When** the snake eats any other food
**Then** controls return to normal
**And** the new food's effect (if any) is applied

**Technical Notes:**
- Orange food shape: X shape (diagonal cross)
- Inversion logic in input.js: if reverseControls active, flip direction before applying
- The "can't reverse into yourself" rule still applies to the INTENDED direction

**FRs:** FR19

---

### Story 2.6: Probability-Based Spawning and Snake Visuals

**As a** player,
**I want** different foods to appear with varying frequencies and see my snake change color,
**So that** I can learn which effects are active and experience varied gameplay.

**Acceptance Criteria:**

**Given** food needs to spawn
**When** the food type is selected
**Then** the type is chosen based on configurable probability distribution
**And** probabilities are: Growing 40%, Invincibility 10%, Wall-Phase 10%, Speed Boost 15%, Speed Decrease 15%, Reverse Controls 10%

**Given** the probability configuration exists
**When** developers need to tune gameplay balance
**Then** all probabilities are defined in config.js
**And** probabilities can be changed without code modifications

**Given** the snake eats any food
**When** the food is consumed
**Then** the snake color changes to match the food type eaten
**And** the snake briefly blinks during the color transition

**Given** the snake changes color
**When** rendering the snake
**Then** the snake displays in the new color: black (default), green (growing), yellow (invincibility), purple (wall-phase), red (speed boost), cyan (speed decrease), orange (reverse controls)

**Given** the snake has no active effect
**When** checking the snake color
**Then** the snake maintains the color of the last food eaten (not default black)

**Given** any special food type
**When** rendering the food
**Then** each food type has a distinct shape AND color for clear identification

**Technical Notes:**
- Update food.js with selectFoodType() using weighted random selection
- Food visual shapes: green=filled square, yellow=4-point star, purple=ring, red=cross, cyan=hollow square, orange=X
- Snake color persists until next food is eaten
- Blink effect: brief flash (100-200ms) on color change

**FRs:** FR22, FR51, FR52, FR54, FR57
