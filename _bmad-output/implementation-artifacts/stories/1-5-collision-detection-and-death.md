# Story 1.5: Collision Detection and Death

**Epic:** 1 - Playable Snake Foundation
**Story ID:** 1.5
**Status:** done
**Created:** 2026-01-25

---

## Story

**As a** player,
**I want** the game to end when I crash,
**So that** I understand the game's challenge and boundaries.

## Acceptance Criteria

**Given** the snake is moving
**When** the snake's head hits any wall boundary
**Then** the snake dies
**And** the game transitions to 'gameover' phase

**Given** the snake is moving
**When** the snake's head collides with any of its own body segments
**Then** the snake dies
**And** the game transitions to 'gameover' phase

**Given** the snake dies
**When** the game over state is triggered
**Then** the game loop continues running (for future overlay support)
**And** the snake stops moving
**And** no further input affects snake movement

**Given** the game board is rendered
**When** viewing the boundaries
**Then** the walls are clearly visible with the purple glow border

## Tasks / Subtasks

- [x] Implement checkWallCollision() in collision.js (AC: Wall collision detected correctly)
  - [x] Check if head.x < 0 or head.x >= GRID_WIDTH
  - [x] Check if head.y < 0 or head.y >= GRID_HEIGHT
  - [x] Return true if any boundary exceeded
- [x] Implement checkSelfCollision() in collision.js (AC: Self collision detected correctly)
  - [x] Get snake head position
  - [x] Check if head matches any body segment position
  - [x] Exclude head from comparison (check segments 0 to length-2)
  - [x] Return true if collision found
- [x] Update game.js to handle death (AC: Phase transitions to gameover)
  - [x] Call checkWallCollision() and checkSelfCollision() after movement
  - [x] Set gameState.phase = 'gameover' on collision
  - [x] Game loop continues running (don't stop RAF)
  - [x] Update stops processing when phase is 'gameover'
- [x] Validate collision detection accuracy (AC: No false positives/negatives) - User validated
- [x] Validate game loop continues during gameover (AC: Critical for future phone overlay) - User validated
- [x] Validate input stops affecting movement after death (AC: Snake doesn't move in gameover) - User validated

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story implements the FAIL STATE - when the player crashes. Your job is to:

1. Detect wall collisions (head outside grid boundaries)
2. Detect self-collisions (head hits body segment)
3. Transition game to 'gameover' phase
4. Keep game loop running (critical for future phone call overlay in Epic 3)

**CRITICAL SUCCESS FACTORS:**
- Collision detection MUST be exact (no false positives/negatives)
- Phase transition MUST happen immediately on collision
- Game loop MUST continue running after death (for phone overlay support)
- Input MUST stop affecting snake after death

**WHY THIS MATTERS:**
- Inaccurate collision = frustrating false deaths or impossible gameplay
- Wrong phase handling = broken game state, bugs in restart
- Stopping game loop = breaks phone overlay mechanic (Epic 3 requirement)
- Input still working after death = confusing, broken UX

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── collision.js    # Add checkWallCollision(), checkSelfCollision() (MODIFY)
├── game.js         # Handle death in update() (MODIFY)
├── state.js        # Already has phase field
├── snake.js        # Already has movement logic
├── render.js       # Already exists
├── config.js       # Already exists
└── main.js         # Already exists
```

**Collision Detection Pattern:**

From architecture.md:
- Collision checks happen AFTER snake movement
- Wall collision: head position outside grid boundaries
- Self collision: head position matches any body segment
- Both trigger phase transition to 'gameover'
- Game loop continues (RAF keeps running)
- Update() returns early if phase !== 'playing'

**Why Game Loop Continues:**
- Epic 3 requires game to keep running during phone call overlay
- Game over screen needs to render (can't render if loop stopped)
- Consistent architecture: loop always runs, phase controls behavior

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- None (pure JavaScript logic)
- No external dependencies

**Collision Detection:**
- Grid-based position comparison
- No pixel-based collision detection
- Simple boundary checks and position matching

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/collision.js - Complete Collision Module**

```javascript
import { CONFIG } from './config.js';

/**
 * Check if snake head collides with food
 * (Already implemented in Story 1.4)
 */
export function checkFoodCollision(gameState) {
  const head = gameState.snake.segments[gameState.snake.segments.length - 1];
  const food = gameState.food.position;

  if (!food) {
    return false;
  }

  return head.x === food.x && head.y === food.y;
}

/**
 * Check if snake head hits wall boundaries
 * NEW in Story 1.5
 */
export function checkWallCollision(gameState) {
  const head = gameState.snake.segments[gameState.snake.segments.length - 1];

  // Check all four boundaries
  if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH) {
    return true;
  }

  if (head.y < 0 || head.y >= CONFIG.GRID_HEIGHT) {
    return true;
  }

  return false;
}

/**
 * Check if snake head collides with its own body
 * NEW in Story 1.5
 */
export function checkSelfCollision(gameState) {
  const segments = gameState.snake.segments;
  const head = segments[segments.length - 1];

  // Check if head matches any body segment (exclude head itself)
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }

  return false;
}
```

**js/game.js - Updated with Death Handling**

```javascript
import { CONFIG } from './config.js';
import { render } from './render.js';
import { moveSnake, growSnake } from './snake.js';
import { checkFoodCollision, checkWallCollision, checkSelfCollision } from './collision.js';
import { spawnFood } from './food.js';

const TICK_RATE = CONFIG.TICK_RATE;

let lastTime = 0;
let accumulator = 0;

export function gameLoop(currentTime, ctx, gameState) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  // Fixed timestep updates
  while (accumulator >= TICK_RATE) {
    update(gameState);
    accumulator -= TICK_RATE;
  }

  // Render every frame (60 FPS) - ALWAYS render, even in gameover
  render(ctx, gameState);

  // Continue loop - NEVER stop (critical for phone overlay in Epic 3)
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}

/**
 * Game logic update (fixed timestep)
 * NEW: Collision detection and death handling
 */
function update(gameState) {
  // Only update if playing (not menu or gameover)
  if (gameState.phase !== 'playing') {
    return;
  }

  // Move snake
  moveSnake(gameState);

  // Check food collision
  if (checkFoodCollision(gameState)) {
    growSnake(gameState);
    gameState.score = gameState.snake.segments.length;
    spawnFood(gameState);
  }

  // Check death conditions (NEW in Story 1.5)
  if (checkWallCollision(gameState) || checkSelfCollision(gameState)) {
    gameState.phase = 'gameover';
    // Game loop continues running, but update() will return early next tick
  }
}

export function startGameLoop(ctx, gameState) {
  lastTime = performance.now();
  accumulator = 0;
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}
```

**js/state.js - No Changes Needed**

State already has `phase` field with 'playing' | 'menu' | 'gameover' values.

**Testing Helper (Optional - for debugging):**

```javascript
// Add to main.js temporarily for testing
window.debugGameState = gameState;  // Access in console: debugGameState.phase
```

---

### 🎨 VISUAL SPECIFICATIONS

**Boundary Visibility:**
- Walls are defined by grid boundaries (0 to GRID_WIDTH-1, 0 to GRID_HEIGHT-1)
- Purple neon glow border (from Story 1.1) makes walls visually clear
- No additional visual changes needed for collision detection

**Death Behavior:**
- Snake stops moving immediately (update() returns early)
- Snake remains visible on screen (render continues)
- No visual feedback yet (game over screen in Story 1.6)
- Game loop continues running at 60 FPS

**Collision Zones:**
- Wall collision: head.x < 0 or >= 25, head.y < 0 or >= 20
- Self collision: head matches any body segment (segments[0] to segments[length-2])

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Wall Collision - Top:**
   - Move snake to top edge (y = 0)
   - Move up one more step
   - Verify game transitions to 'gameover'
   - Verify snake stops moving
   - Check console: gameState.phase === 'gameover'

2. **Wall Collision - Bottom:**
   - Move snake to bottom edge (y = 19)
   - Move down one more step
   - Verify death occurs

3. **Wall Collision - Left:**
   - Move snake to left edge (x = 0)
   - Move left one more step
   - Verify death occurs

4. **Wall Collision - Right:**
   - Move snake to right edge (x = 24)
   - Move right one more step
   - Verify death occurs

5. **Self Collision:**
   - Grow snake to length 10+ (eat several foods)
   - Navigate snake to create a loop
   - Crash head into body segment
   - Verify death occurs

6. **Game Loop Continuation:**
   - Trigger death (any collision)
   - Open DevTools Performance tab
   - Verify FPS stays at 60 (game loop still running)
   - Verify render() still being called

7. **Input After Death:**
   - Trigger death
   - Press arrow keys
   - Verify snake does NOT move
   - Verify input doesn't cause errors

8. **No False Positives:**
   - Move snake around entire grid without crashing
   - Eat 20+ foods without false death
   - Verify collision only triggers when actually hitting wall/self

**Common Issues:**
- ❌ Off-by-one error in wall bounds (>= vs >)
- ❌ Self collision includes head (should exclude segments[length-1])
- ❌ Game loop stops on death (should continue running)
- ❌ Input still moves snake after death (should return early)
- ❌ False positives near walls (boundary check wrong)

---

### 📚 CRITICAL DATA FORMATS

**Head Position Extraction:**
```javascript
// CORRECT: Head is LAST element in segments array
const head = segments[segments.length - 1];

// WRONG: Don't use first element
const head = segments[0];  // This is the tail!
```

**Boundary Checks:**
```javascript
// CORRECT: Inclusive checks
if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH)  // 0 to 24 valid

// WRONG: Exclusive checks
if (head.x <= 0 || head.x > CONFIG.GRID_WIDTH)  // Would allow -1!
```

**Self Collision Loop:**
```javascript
// CORRECT: Exclude head from comparison
for (let i = 0; i < segments.length - 1; i++)

// WRONG: Include head (always true!)
for (let i = 0; i < segments.length; i++)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **Position Format:** Use { x, y } objects for all positions
2. **Phase Values:** String literals ('menu', 'playing', 'gameover')
3. **Module Boundaries:** Pass gameState, access phase via gameState.phase
4. **No Magic Numbers:** Use CONFIG.GRID_WIDTH, CONFIG.GRID_HEIGHT

**Collision Detection Rules:**
- Grid-based (not pixel-based)
- Check after movement (not before)
- Exact position matching (x === x AND y === y)
- Head is last element in segments array

**Game Loop Rule (CRITICAL):**
- Game loop NEVER stops (always uses requestAnimationFrame)
- Phase controls behavior, not loop execution
- update() returns early if phase !== 'playing'
- render() always executes (60 FPS maintained)

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Story 1.4:**
- ✅ collision.js must exist with checkFoodCollision()
- ✅ game.js must have update() function
- ✅ Food collision handling must be working

**Depends on Story 1.3:**
- ✅ Snake must be moving
- ✅ snake.segments array must exist with head at end
- ✅ Input system must be working

**Depends on Story 1.2:**
- ✅ gameState.phase must exist
- ✅ Game loop must be running with RAF

**Depends on Story 1.1:**
- ✅ CONFIG.GRID_WIDTH and CONFIG.GRID_HEIGHT must be defined
- ✅ Purple border must be visible (visual wall indication)

**If previous stories incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR4, FR5, FR7, FR8, FR37

**Detailed FR Mapping:**
- FR4: Snake dies on wall collision → checkWallCollision() returns true when head outside bounds
- FR5: Snake dies on self collision → checkSelfCollision() returns true when head matches body
- FR7: Game board has boundaries that trigger death → Grid boundaries 0-24 (x), 0-19 (y)
- FR8: Game continues until death → update() processes until collision detected
- FR37: Game sessions end when snake dies → phase = 'gameover' transition

**NFRs Covered:**
- NFR26: Game doesn't crash on death → Graceful phase transition
- NFR27: Game recovers from errors → Game loop continues, clean state transition
- NFR28: No game-breaking bugs → Collision detection accurate, no false positives
- NFR31: Collision detection accurate → Exact position matching, proper boundary checks
- NFR35: Game state remains consistent → Phase transition maintains state integrity

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] collision.js has checkWallCollision() implementation
- [ ] collision.js has checkSelfCollision() implementation
- [ ] game.js calls both collision checks after moveSnake()
- [ ] game.js sets phase = 'gameover' on collision
- [ ] Wall collision works for all 4 boundaries (top, bottom, left, right)
- [ ] Self collision works correctly (head hits body = death)
- [ ] No false positives (snake doesn't die when not colliding)
- [ ] No false negatives (collision always detected)
- [ ] Game loop continues running after death (60 FPS maintained)
- [ ] Snake stops moving after death (update returns early)
- [ ] Input doesn't affect snake after death
- [ ] Purple border clearly visible (wall boundaries obvious)
- [ ] No console errors
- [ ] All collision checks use exact position matching (===)
- [ ] Head extraction correct (last element in segments array)

**Collision Detection Checklist:**
- [ ] Top wall: y < 0 triggers death
- [ ] Bottom wall: y >= 20 triggers death
- [ ] Left wall: x < 0 triggers death
- [ ] Right wall: x >= 25 triggers death
- [ ] Self collision: head matches body segment triggers death
- [ ] Self collision excludes head from comparison

**Game State Checklist:**
- [ ] Phase transition immediate (same tick as collision)
- [ ] Game loop never stops (RAF continues)
- [ ] Update stops processing when phase = 'gameover'
- [ ] Render continues working (snake visible after death)

**Common Mistakes to Avoid:**
- ❌ Using > instead of >= for wall collision (off-by-one error)
- ❌ Checking segments[0] instead of segments[length-1] for head
- ❌ Including head in self-collision loop (always returns true)
- ❌ Stopping game loop on death (breaks architecture requirement)
- ❌ Not returning early from update() when phase is 'gameover'
- ❌ Using pixel coordinates instead of grid coordinates
- ❌ Forgetting to check both x and y for self collision (must match both!)

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - No issues encountered

### Completion Notes List

**2026-01-26: Implementation Complete**
- Added checkWallCollision() to js/collision.js - checks all 4 boundaries
- Added checkSelfCollision() to js/collision.js - excludes head from comparison
- Updated js/game.js update() to check collisions after movement
- Phase transition to 'gameover' on collision
- Game loop continues running (RAF never stops)
- update() returns early when phase !== 'playing'

### File List

- js/collision.js (updated with wall and self collision)
- js/game.js (updated with death handling)
