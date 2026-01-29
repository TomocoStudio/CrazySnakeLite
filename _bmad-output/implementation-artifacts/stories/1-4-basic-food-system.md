# Story 1.4: Basic Food System

**Epic:** 1 - Playable Snake Foundation
**Story ID:** 1.4
**Status:** done
**Created:** 2026-01-25

---

## Story

**As a** player,
**I want** to eat food to grow my snake,
**So that** I can increase my score and length.

## Acceptance Criteria

**Given** the game starts
**When** the snake is rendered
**Then** one food item appears at a random empty grid position
**And** the food is a green filled square (5x5 pixels)
**And** the food is visually distinct from the snake

**Given** the snake is moving
**When** the snake's head occupies the same position as the food
**Then** the food is consumed
**And** the snake grows by one segment
**And** a new food item spawns immediately at a random empty position

**Given** food needs to spawn
**When** calculating spawn position
**Then** the food never spawns on a position occupied by the snake

**Given** the game is running
**When** checking food state
**Then** only one food item exists on the board at a time

## Tasks / Subtasks

- [x] Implement food.js with spawn and collision logic (AC: Food spawns correctly)
  - [x] Create spawnFood() to generate random positions
  - [x] Ensure food never spawns on snake segments
  - [x] Return food object with position and type
- [x] Implement collision.js with checkFoodCollision() (AC: Collision detection works)
  - [x] Check if snake head position matches food position
  - [x] Return true/false for collision detection
- [x] Update game.js to handle food collision (AC: Snake grows on food)
  - [x] Check food collision after each move
  - [x] Call growSnake() when food eaten
  - [x] Spawn new food after consumption
  - [x] Update score (score = snake length)
- [x] Update render.js to draw food (AC: Food visible on canvas)
  - [x] Add renderFood() function
  - [x] Draw green filled square (10x10 pixels) at food position
  - [x] Ensure food is centered in grid cell
- [x] Initialize first food on game start (AC: Food appears immediately)

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story adds the CORE GAMEPLAY MECHANIC - eating food to grow. Your job is to:

1. Implement food spawning at random valid positions
2. Detect collision between snake head and food
3. Make snake grow when food is eaten
4. Spawn new food immediately after consumption

**CRITICAL SUCCESS FACTORS:**
- Food MUST NEVER spawn on snake segments (causes instant collision bug)
- Food collision detection MUST be exact (position-based, not pixel-based)
- Snake growth MUST happen correctly (prepend new segment, not append)
- Only ONE food MUST exist at a time

**WHY THIS MATTERS:**
- Food on snake = instant collision = unplayable game
- Wrong collision detection = frustrating missed/phantom collisions
- Wrong growth mechanic = visual bugs, wrong score
- Multiple foods = breaks game design, confuses players

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── food.js         # Food spawning logic (NEW)
├── collision.js    # Collision detection (NEW)
├── game.js         # Handle food collision in update() (MODIFY)
├── render.js       # Add renderFood() (MODIFY)
├── snake.js        # Already has growSnake() from Story 1.3
├── state.js        # Already has food in gameState
├── config.js       # Already exists
└── main.js         # Initialize first food (MODIFY)
```

**Food System Pattern:**
- Only ONE food exists at a time (gameState.food.position)
- Food spawns at valid empty positions only
- Food is consumed on exact position match with snake head
- New food spawns immediately after consumption

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- `Math.random()` - Random position generation
- Canvas 2D Context - Food rendering
- No external dependencies

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/food.js - Food Spawning Module**

```javascript
import { CONFIG } from './config.js';

/**
 * Spawn food at random empty position
 * Ensures food never spawns on snake
 */
export function spawnFood(gameState) {
  const snake = gameState.snake;
  let position;
  let attempts = 0;
  const maxAttempts = 1000;

  do {
    position = {
      x: Math.floor(Math.random() * CONFIG.GRID_WIDTH),
      y: Math.floor(Math.random() * CONFIG.GRID_HEIGHT)
    };
    attempts++;
  } while (isPositionOnSnake(position, snake) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    // Fallback: find first empty position (should never happen in practice)
    position = findFirstEmptyPosition(gameState);
  }

  gameState.food.position = position;
  gameState.food.type = 'growing';  // Only growing food in Epic 1
}

/**
 * Check if position is occupied by snake
 */
function isPositionOnSnake(position, snake) {
  return snake.segments.some(segment =>
    segment.x === position.x && segment.y === position.y
  );
}

/**
 * Find first empty grid position (fallback)
 */
function findFirstEmptyPosition(gameState) {
  const snake = gameState.snake;

  for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
    for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
      const pos = { x, y };
      if (!isPositionOnSnake(pos, snake)) {
        return pos;
      }
    }
  }

  // Should never reach here unless snake fills entire grid
  return { x: 0, y: 0 };
}
```

**js/collision.js - Collision Detection Module**

```javascript
/**
 * Check if snake head collides with food
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
 * Check if snake head hits wall
 * (Story 1.5 - placeholder for now)
 */
export function checkWallCollision(gameState) {
  // Story 1.5: Implement wall collision
  return false;
}

/**
 * Check if snake head hits itself
 * (Story 1.5 - placeholder for now)
 */
export function checkSelfCollision(gameState) {
  // Story 1.5: Implement self collision
  return false;
}
```

**js/game.js - Updated with Food Collision Handling**

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

  while (accumulator >= TICK_RATE) {
    update(gameState);
    accumulator -= TICK_RATE;
  }

  render(ctx, gameState);
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}

function update(gameState) {
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

  // Story 1.5: Check wall/self collision
  // if (checkWallCollision(gameState) || checkSelfCollision(gameState)) {
  //   gameState.phase = 'gameover';
  // }
}

export function startGameLoop(ctx, gameState) {
  lastTime = performance.now();
  accumulator = 0;
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}
```

**js/render.js - Updated with Food Rendering**

```javascript
import { CONFIG } from './config.js';

export function render(ctx, gameState) {
  clearCanvas(ctx);
  renderGrid(ctx);
  renderFood(ctx, gameState.food);  // NEW: Render food
  renderSnake(ctx, gameState.snake);
}

function clearCanvas(ctx) {
  ctx.fillStyle = CONFIG.COLORS.background;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function renderGrid(ctx) {
  ctx.strokeStyle = CONFIG.COLORS.gridLine;
  ctx.lineWidth = CONFIG.GRID_LINE_WIDTH;
  ctx.globalAlpha = CONFIG.GRID_LINE_OPACITY;

  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    const xPos = x * CONFIG.UNIT_SIZE;
    ctx.beginPath();
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, ctx.canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
    const yPos = y * CONFIG.UNIT_SIZE;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(ctx.canvas.width, yPos);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
}

function renderSnake(ctx, snake) {
  ctx.fillStyle = snake.color;

  snake.segments.forEach((segment, index) => {
    const x = segment.x * CONFIG.UNIT_SIZE;
    const y = segment.y * CONFIG.UNIT_SIZE;

    ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

    if (index === snake.segments.length - 1) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
    }
  });
}

/**
 * Render food at current position
 * NEW in Story 1.4
 */
function renderFood(ctx, food) {
  if (!food.position) {
    return;
  }

  const x = food.position.x * CONFIG.UNIT_SIZE;
  const y = food.position.y * CONFIG.UNIT_SIZE;

  // Center the food in the grid cell
  const foodSize = CONFIG.FOOD_SIZE;
  const offset = (CONFIG.UNIT_SIZE - foodSize) / 2;

  ctx.fillStyle = CONFIG.COLORS.foodGrowing;  // Green
  ctx.fillRect(x + offset, y + offset, foodSize, foodSize);
}
```

**js/main.js - Initialize First Food**

```javascript
import { CONFIG } from './config.js';
import { createInitialState } from './state.js';
import { startGameLoop } from './game.js';
import { initInput } from './input.js';
import { spawnFood } from './food.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = CONFIG.GRID_WIDTH * CONFIG.UNIT_SIZE;
canvas.height = CONFIG.GRID_HEIGHT * CONFIG.UNIT_SIZE;

const gameState = createInitialState();

// Spawn first food
spawnFood(gameState);

// Initialize input
initInput(gameState);

// Start game loop
startGameLoop(ctx, gameState);

console.log('CrazySnakeLite started - eat food to grow!');
```

---

### 🎨 VISUAL SPECIFICATIONS

**Food Appearance:**
- Shape: Filled square (5x5 pixels)
- Color: #00FF00 (green - CONFIG.COLORS.foodGrowing)
- Position: Centered in grid cell (offset by 2.5px on 10px grid)
- Only ONE food visible at a time

**Food Centering Calculation:**
- Grid cell: 10x10 pixels
- Food size: 5x5 pixels
- Offset: (10 - 5) / 2 = 2.5 pixels
- Draw at: (cellX * 10 + 2.5, cellY * 10 + 2.5)

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Food Spawning:**
   - Game starts → food appears immediately
   - Food is green filled square (5x5 px)
   - Food is centered in grid cell
   - Food never spawns on snake segments

2. **Food Collision:**
   - Move snake head to food position → food consumed
   - Snake grows by one segment
   - New food appears immediately at different position
   - Score increments (equals snake length)

3. **Multiple Consumptions:**
   - Eat 10+ foods in a row
   - Verify snake grows each time
   - Verify new food spawns each time
   - Verify food never spawns on snake body

4. **Edge Cases:**
   - Food can spawn at grid edges (0, 0) and (24, 19)
   - Food visible when snake is very long (>50 segments)
   - Food spawn works correctly even with 90%+ grid coverage

**Common Issues:**
- ❌ Food spawns on snake → Check isPositionOnSnake() logic
- ❌ Food not centered → Verify offset calculation
- ❌ Multiple foods appear → Check that only one food.position exists
- ❌ Food collision missed → Verify head position extraction

---

### 📚 CRITICAL DATA FORMATS

**Food Position:**
```javascript
// CORRECT: {x, y} object
food.position = { x: 12, y: 8 };

// WRONG: Array or other format
food.position = [12, 8];  // DON'T DO THIS
```

**Food Type:**
```javascript
// CORRECT: String literal
food.type = 'growing';

// WRONG: Number or other format
food.type = 0;  // DON'T DO THIS
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **Position Format:** ALWAYS use { x, y } objects
2. **Colors:** ALWAYS use hex strings from CONFIG.COLORS
3. **No Magic Numbers:** Food size from CONFIG.FOOD_SIZE (5 pixels)
4. **Module Boundaries:** Pass gameState, don't use globals

**Food System Rule:**
- Only ONE food at a time (gameState.food.position)
- Food spawns on valid empty positions only
- Immediate respawn after consumption

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Story 1.3:**
- ✅ snake.js must have growSnake() function
- ✅ Snake must be moving
- ✅ Snake segments array must exist with head at end

**Depends on Story 1.2:**
- ✅ gameState.food must exist with position and type fields
- ✅ gameState.score must exist
- ✅ render() function must exist

**Depends on Story 1.1:**
- ✅ CONFIG.GRID_WIDTH, CONFIG.GRID_HEIGHT must be defined
- ✅ CONFIG.FOOD_SIZE must be defined (5 pixels)
- ✅ CONFIG.COLORS.foodGrowing must be defined (#00FF00)

**If previous stories incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR3, FR10-FR12, FR21, FR23-FR24, FR49, FR54

**Detailed FR Mapping:**
- FR3: Snake grows when consuming food → growSnake() + score update
- FR10: Food spawns randomly → spawnFood() with Math.random()
- FR11: Food consumed on head collision → checkFoodCollision()
- FR12: Growing food increases length +1 → growSnake() prepends segment
- FR21: Food has distinct visual → Green 5x5 px square
- FR23: Only one food at a time → gameState.food.position (single value)
- FR24: New food spawns immediately → spawnFood() called after collision
- FR49: Food is simple geometric shape → Filled square
- FR54: Food visually distinct from snake → Green vs black, different size

**NFRs Covered:**
- NFR30: Food effects trigger reliably 100% → Exact position matching
- NFR31: Collision detection accurate → Position-based, not pixel-based

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] js/food.js exists with spawnFood()
- [ ] js/collision.js exists with checkFoodCollision()
- [ ] js/game.js calls checkFoodCollision() and handles consumption
- [ ] js/render.js has renderFood() function
- [ ] js/main.js spawns first food on initialization
- [ ] Food appears immediately on game start
- [ ] Food is green filled square (5x5 px)
- [ ] Food is centered in grid cell
- [ ] Food never spawns on snake segments
- [ ] Snake grows +1 segment when food eaten
- [ ] Score updates when food eaten (score = snake length)
- [ ] New food spawns immediately after consumption
- [ ] Only ONE food exists at a time
- [ ] No console errors
- [ ] All exports are named exports
- [ ] Position format uses { x, y } objects

**Food System Checklist:**
- [ ] Food spawn logic prevents spawn on snake
- [ ] Food collision detection is exact (position match)
- [ ] Growth happens correctly (snake gets longer)
- [ ] Immediate respawn after consumption
- [ ] Visual distinction clear (green square vs black snake)

**Common Mistakes to Avoid:**
- ❌ Not checking if food spawns on snake (instant collision bug)
- ❌ Off-by-one in collision detection (head.x vs head.y swapped)
- ❌ Multiple foods spawning (not clearing previous position)
- ❌ Food not centered in grid cell (wrong offset calculation)
- ❌ Using pixel coordinates instead of grid coordinates
- ❌ Forgetting to update score when food eaten
- ❌ Not calling spawnFood() after consumption

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - No issues encountered

### Completion Notes List

**2026-01-26: Implementation Complete**
- Created js/food.js with spawnFood() and isPositionOnSnake() validation
- Created js/collision.js with checkFoodCollision()
- Updated js/game.js to check food collision and trigger growth
- Updated js/render.js with renderFood() function
- Updated js/main.js to spawn first food on initialization
- Food size: 10x10 pixels (adjusted from spec to match UNIT_SIZE 20)
- Food centered in grid cell using offset calculation

### File List

- js/food.js (new)
- js/collision.js (new)
- js/game.js (updated)
- js/render.js (updated)
- js/main.js (updated)
