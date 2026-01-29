# Story 1.2: Game Loop and Snake Rendering

**Epic:** 1 - Playable Snake Foundation
**Story ID:** 1.2
**Status:** done
**Created:** 2026-01-25

---

## Story

**As a** player,
**I want** to see a snake on the game board,
**So that** I know the game is ready to play.

## Acceptance Criteria

**Given** the game canvas is loaded
**When** the game initializes
**Then** a snake appears in the bottom-left area of the grid
**And** the snake has 5 segments rendered as black blocky pixels
**And** the snake head is visually distinguishable from body segments
**And** the game maintains 60 FPS rendering
**And** the game loop uses fixed timestep (125ms) for logic updates

## Tasks / Subtasks

- [x] Implement state.js with createInitialState() function (AC: State structure matches architecture)
  - [x] Define gameState object with all required fields
  - [x] Implement createInitialState() for new games
  - [x] Implement resetGame() for Play Again functionality
- [x] Implement game.js with RAF loop + fixed timestep accumulator (AC: 60 FPS maintained)
  - [x] Create gameLoop() function using requestAnimationFrame
  - [x] Implement fixed timestep accumulator (125ms ticks)
  - [x] Separate update() and render() calls
  - [x] Handle delta time correctly
- [x] Implement render.js with renderSnake() and renderGrid() (AC: Visual output matches specs)
  - [x] Create renderGrid() for subtle grid lines
  - [x] Create renderSnake() with head/body distinction
  - [x] Implement clear-render cycle
  - [x] Ensure 60 FPS performance
- [x] Initialize snake at bottom-left, facing right (AC: Starting position correct)
  - [x] Snake starts at position {x: 2, y: 18} per config
  - [x] Snake has 5 segments initially
  - [x] Snake direction is 'right'
  - [x] Snake color is black (#000000)
- [x] Validate performance (AC: 60 FPS steady, no frame drops) - User validated

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story establishes the **CORE GAME ENGINE**. Everything else (food, collision, effects) plugs into this foundation. Your job is to:

1. Create the game loop architecture with Fixed Timestep + RAF
2. Implement state management (single state object pattern)
3. Render the snake and grid with retro pixel aesthetic
4. Achieve rock-solid 60 FPS performance

**CRITICAL SUCCESS FACTORS:**
- Game loop MUST separate logic (fixed 125ms) from rendering (60 FPS)
- State structure MUST match architecture document exactly
- Snake rendering MUST be visually clear (head vs body)
- Performance MUST be 60 FPS (validated in DevTools)

**WHY THIS MATTERS:**
- Poor game loop = inconsistent movement speed across devices
- Wrong state structure = refactoring hell in later stories
- Bad rendering performance = fails NFR1 (60 FPS requirement)
- Missing head distinction = usability issues (players can't tell direction)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── state.js        # State creation/reset (NEW)
├── game.js         # Game loop with RAF + fixed timestep (NEW)
├── render.js       # Canvas rendering (NEW)
├── config.js       # Already created in Story 1.1
└── main.js         # Update to start game loop
```

**Architectural Pattern: Fixed Timestep + RequestAnimationFrame**

From architecture.md:
- Game logic updates at **fixed intervals (125ms = 8 moves/second)**
- Rendering runs at **60 FPS via requestAnimationFrame**
- Delta time accumulated, logic ticks when threshold reached
- Smooth rendering independent of game tick rate

**Why Fixed Timestep?**
- Snake movement consistent across all devices
- Frame rate drops don't affect gameplay speed
- Predictable, reproducible behavior
- Testing is deterministic

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- `requestAnimationFrame()` - 60 FPS rendering loop
- `Canvas 2D Context` - Drawing snake and grid
- `performance.now()` - High-precision timing for delta calculation

**NO external dependencies** - Everything is native browser APIs.

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/state.js - State Management Module**

```javascript
import { CONFIG } from './config.js';

/**
 * Creates initial game state
 * Called on: game start, Play Again
 */
export function createInitialState() {
  return {
    phase: 'playing',  // 'menu' | 'playing' | 'gameover'

    snake: {
      segments: createInitialSnake(),
      direction: CONFIG.STARTING_DIRECTION,  // 'right'
      nextDirection: CONFIG.STARTING_DIRECTION,
      color: CONFIG.COLORS.snakeDefault  // '#000000'
    },

    food: {
      position: null,  // Set in Story 1.4
      type: 'growing'
    },

    activeEffect: null,  // { type: 'invincibility' } or null

    score: 0,
    highScore: 0,  // Loaded from localStorage in Epic 4

    phoneCall: {
      active: false,
      caller: null,
      nextCallTime: 0
    }
  };
}

/**
 * Creates initial snake segments
 * Snake starts at bottom-left, facing right
 */
function createInitialSnake() {
  const segments = [];
  const startX = CONFIG.STARTING_POSITION.x;
  const startY = CONFIG.STARTING_POSITION.y;

  for (let i = 0; i < CONFIG.STARTING_LENGTH; i++) {
    segments.push({
      x: startX + i,
      y: startY
    });
  }

  return segments;
}

/**
 * Resets game state for Play Again
 * Preserves high score
 */
export function resetGame(gameState) {
  const newState = createInitialState();
  newState.highScore = gameState.highScore;

  // Copy all properties to existing state object
  Object.assign(gameState, newState);
}
```

**js/game.js - Game Loop Module**

```javascript
import { CONFIG } from './config.js';
import { render } from './render.js';

const TICK_RATE = CONFIG.TICK_RATE;  // 125ms

let lastTime = 0;
let accumulator = 0;

/**
 * Main game loop - Fixed timestep + RAF
 * Logic updates at 125ms intervals
 * Rendering at 60 FPS
 */
export function gameLoop(currentTime, ctx, gameState) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  // Fixed timestep updates
  while (accumulator >= TICK_RATE) {
    update(gameState);
    accumulator -= TICK_RATE;
  }

  // Render every frame (60 FPS)
  render(ctx, gameState);

  // Continue loop
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}

/**
 * Game logic update (fixed timestep)
 * For now, just a placeholder - movement comes in Story 1.3
 */
function update(gameState) {
  // Story 1.3: Snake movement
  // Story 1.4: Food collision
  // Story 1.5: Wall/self collision
}

/**
 * Starts the game loop
 */
export function startGameLoop(ctx, gameState) {
  lastTime = performance.now();
  accumulator = 0;
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}
```

**js/render.js - Rendering Module**

```javascript
import { CONFIG } from './config.js';

/**
 * Main render function - called every frame (60 FPS)
 */
export function render(ctx, gameState) {
  clearCanvas(ctx);
  renderGrid(ctx);
  renderSnake(ctx, gameState.snake);
  // Story 1.4: renderFood()
  // Epic 4: renderScore()
}

/**
 * Clears the canvas
 */
function clearCanvas(ctx) {
  ctx.fillStyle = CONFIG.COLORS.background;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Renders subtle grid lines
 */
function renderGrid(ctx) {
  ctx.strokeStyle = CONFIG.COLORS.gridLine;
  ctx.lineWidth = CONFIG.GRID_LINE_WIDTH;
  ctx.globalAlpha = CONFIG.GRID_LINE_OPACITY;

  // Vertical lines
  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    const xPos = x * CONFIG.UNIT_SIZE;
    ctx.beginPath();
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, ctx.canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
    const yPos = y * CONFIG.UNIT_SIZE;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(ctx.canvas.width, yPos);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;  // Reset alpha
}

/**
 * Renders the snake with head/body distinction
 */
function renderSnake(ctx, snake) {
  ctx.fillStyle = snake.color;

  snake.segments.forEach((segment, index) => {
    const x = segment.x * CONFIG.UNIT_SIZE;
    const y = segment.y * CONFIG.UNIT_SIZE;

    // Draw segment
    ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

    // Head distinction: lighter border
    if (index === snake.segments.length - 1) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
    }
  });
}
```

**js/main.js - Updated Entry Point**

```javascript
import { CONFIG } from './config.js';
import { createInitialState } from './state.js';
import { startGameLoop } from './game.js';

// Initialize canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size from config
canvas.width = CONFIG.GRID_WIDTH * CONFIG.UNIT_SIZE;
canvas.height = CONFIG.GRID_HEIGHT * CONFIG.UNIT_SIZE;

// Create initial game state
const gameState = createInitialState();

// Start game loop
startGameLoop(ctx, gameState);

console.log('CrazySnakeLite game loop started');
```

---

### 🎨 VISUAL SPECIFICATIONS

**Grid Rendering:**
- Grid lines: #D0D0D0 (subtle grey)
- Line width: 0.5px
- Opacity: 0.3
- Lines drawn at every grid unit boundary

**Snake Rendering:**
- Body segments: Filled rectangles (10x10 px each)
- Color: #000000 (black) initially
- Head distinction: White border (1px) around head segment
- Head is LAST element in segments array (segments grow from front)

**Performance Requirements:**
- Render loop: 60 FPS (validated in DevTools Performance tab)
- No frame drops during rendering
- Clear-render cycle efficient (no unnecessary redraws)

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Game Loop Validation:**
   - Open DevTools Performance tab
   - Record 10 seconds of gameplay
   - Verify FPS averages 59-60 (allow for minor variance)
   - Check that logic updates happen at 125ms intervals (8 times per second)

2. **Visual Validation:**
   - Snake appears at bottom-left area of grid
   - Snake has exactly 5 segments
   - Snake segments are blocky pixels (10x10 px each)
   - Snake head has white border distinguishing it from body
   - Grid lines are subtle and visible
   - Background is light grey (#E8E8E8)

3. **State Validation:**
   - Open DevTools Console
   - Inspect `gameState` object (you may need to expose it for debugging)
   - Verify structure matches architecture spec
   - Check snake.segments array has 5 elements
   - Verify snake.direction is 'right'
   - Confirm snake.color is '#000000'

4. **Performance Validation:**
   - Game maintains 60 FPS for extended period (2+ minutes)
   - No memory leaks (check DevTools Memory tab)
   - CPU usage reasonable (<20% on modern hardware)

**Common Issues to Check:**
- ❌ Frame rate drops below 55 FPS → Optimize render loop
- ❌ Snake segments not aligned to grid → Check position multiplication by UNIT_SIZE
- ❌ Grid lines too dark/light → Verify opacity and color values
- ❌ Head not distinguishable → Check if white border renders correctly

---

### 📚 CRITICAL DATA FORMATS

**Snake Segments Array:**
```javascript
// CORRECT: Array of {x, y} position objects
segments: [
  { x: 2, y: 18 },  // Tail (oldest)
  { x: 3, y: 18 },
  { x: 4, y: 18 },
  { x: 5, y: 18 },
  { x: 6, y: 18 }   // Head (newest)
]

// WRONG: Don't use arrays for positions
segments: [[2, 18], [3, 18], ...]  // DON'T DO THIS
```

**Direction Values:**
```javascript
// CORRECT: String literals
direction: 'right'  // 'up' | 'down' | 'left' | 'right'

// WRONG: Numbers or abbreviations
direction: 0    // DON'T DO THIS
direction: 'r'  // DON'T DO THIS
```

**Time Values:**
```javascript
// CORRECT: Milliseconds
TICK_RATE: 125  // 125ms = 8 moves per second

// WRONG: Seconds or other units
TICK_RATE: 0.125  // DON'T DO THIS
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **Module Boundaries:** State access only through passed `gameState` parameter
2. **Naming:** camelCase functions (createInitialState, renderSnake, gameLoop)
3. **Exports:** Named exports only (export function, export const)
4. **No Magic Numbers:** All values from CONFIG (TICK_RATE, UNIT_SIZE, colors)

**Game Loop Architecture Rule:**
- Fixed timestep (125ms) for logic
- RequestAnimationFrame (60 FPS) for rendering
- Delta time accumulator pattern
- Separate update() and render() functions

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Story 1.1:**
- ✅ config.js must exist with all parameters
- ✅ Canvas element must be set up in HTML
- ✅ Canvas context (ctx) must be accessible
- ✅ CONFIG.GRID_WIDTH, CONFIG.GRID_HEIGHT, CONFIG.UNIT_SIZE must be defined
- ✅ All color values must be in CONFIG.COLORS

**If Story 1.1 is incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR6, FR50

**Detailed FR Mapping:**
- FR6: Players can see the snake's current position and length on the game board → renderSnake() displays all segments
- FR50: Snake uses classic blocky pixel segments → 10x10 px rectangles aligned to grid

**NFRs Covered:**
- NFR1: 60 FPS during normal gameplay → Game loop with RAF
- NFR3: No frame drops during snake growth → Efficient rendering
- NFR41: Game logic modular and separate from rendering → state.js, game.js, render.js separation

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] js/state.js exists with createInitialState() and resetGame()
- [ ] js/game.js exists with gameLoop() and fixed timestep accumulator
- [ ] js/render.js exists with render(), renderGrid(), renderSnake()
- [ ] js/main.js updated to start game loop
- [ ] Snake appears at bottom-left area (position ~{x:2, y:18})
- [ ] Snake has exactly 5 segments
- [ ] Snake segments are black (#000000)
- [ ] Snake head has white border (visually distinct from body)
- [ ] Grid lines render with correct opacity (0.3) and color (#D0D0D0)
- [ ] Game maintains 60 FPS (validated in DevTools Performance tab)
- [ ] No console errors
- [ ] State structure matches architecture document
- [ ] All exports are named exports (no default exports)
- [ ] No hardcoded magic numbers (all from CONFIG)

**Performance Checklist:**
- [ ] FPS stays at 59-60 consistently
- [ ] No frame drops during rendering
- [ ] Logic updates at 125ms intervals (8 times per second)
- [ ] Memory usage stable (no leaks)

**Common Mistakes to Avoid:**
- ❌ Using default exports instead of named exports
- ❌ Hardcoding timing values instead of using CONFIG.TICK_RATE
- ❌ Accessing global state instead of passing gameState
- ❌ Using arrays [x,y] instead of objects {x, y} for positions
- ❌ Forgetting to reset accumulator when starting game loop
- ❌ Not distinguishing snake head from body visually
- ❌ Rendering grid lines too dark (check opacity!)

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - No issues encountered

### Completion Notes List

**2026-01-26: Implementation Complete**
- Created js/state.js with createInitialState() and resetGame()
- Created js/game.js with fixed timestep (125ms) + RAF game loop
- Created js/render.js with renderGrid(), renderSnake(), clearCanvas()
- Updated js/main.js to initialize state and start game loop
- Snake renders at bottom-left with 5 segments, head has white border
- Grid lines render with configurable opacity and color

**User-requested modifications (backported to specs):**
- Grid line opacity: 0.3 → 0.9
- Grid line color: #D0D0D0 → #A0A0A0 (darker)

**Code Review Fixes Applied (2026-01-26):**
- Updated render.js to use CONFIG.HEAD_BORDER_COLOR and CONFIG.HEAD_BORDER_WIDTH instead of hardcoded values

### File List

- js/state.js (new)
- js/game.js (new)
- js/render.js (new)
- js/main.js (updated)
