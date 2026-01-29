# Story 1.3: Snake Movement and Input Controls

**Epic:** 1 - Playable Snake Foundation
**Story ID:** 1.3
**Status:** done
**Created:** 2026-01-25

---

## Story

**As a** player,
**I want** to control the snake's direction using my keyboard or touch,
**So that** I can navigate the snake around the board.

## Acceptance Criteria

**Given** the game is running
**When** the player presses an arrow key (Up/Down/Left/Right)
**Then** the snake changes direction accordingly
**And** the snake moves automatically at 8 moves per second

**Given** the game is running
**When** the player presses WASD keys
**Then** the snake changes direction (W=Up, A=Left, S=Down, D=Right)

**Given** the game is running
**When** the player presses ZQSD keys (French layout)
**Then** the snake changes direction (Z=Up, Q=Left, S=Down, D=Right)

**Given** the game is running
**When** the player presses Numpad keys
**Then** the snake changes direction (8=Up, 4=Left, 2=Down, 6=Right)

**Given** the game is running on mobile
**When** the player swipes in a direction
**Then** the snake changes to that direction

**Given** the player presses a direction key
**When** the input is processed
**Then** the snake responds within 50ms

**Given** the snake is moving right
**When** the player presses left (opposite direction)
**Then** the input is ignored (snake cannot reverse into itself)

## Tasks / Subtasks

- [x] Implement input.js with keyboard and touch abstraction (AC: All 4 layouts + touch work)
  - [x] Create input event listeners for keyboard
  - [x] Map Arrow, WASD, ZQSD, Numpad to directions
  - [x] Implement touch swipe detection for mobile
  - [x] Normalize all inputs to direction strings
- [x] Implement snake.js with moveSnake() function (AC: Movement works correctly)
  - [x] Create moveSnake() to update snake position
  - [x] Implement direction validation (no 180° turns)
  - [x] Use nextDirection queue for input buffering
  - [x] Handle snake growth (prepend head, keep tail)
- [x] Update game.js update() to call moveSnake() (AC: Snake moves at 8 moves/sec)
  - [x] Call moveSnake() in fixed timestep update loop
  - [x] Ensure movement happens at 125ms intervals
- [x] Validate input latency < 50ms (AC: NFR8 requirement met) - User validated
- [x] Validate all keyboard layouts work correctly (AC: Cross-layout support) - User validated
- [x] Validate touch swipe detection on mobile (AC: Touch controls functional) - User validated

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story brings the snake to LIFE with movement and player control. Your job is to:

1. Create input abstraction layer supporting 4 keyboard layouts + touch
2. Implement snake movement logic with growth mechanics
3. Ensure <50ms input latency (NFR8 requirement)
4. Prevent invalid moves (no reversing into yourself)

**CRITICAL SUCCESS FACTORS:**
- Input abstraction MUST normalize all input sources to direction strings
- Snake movement MUST prevent 180° reversal
- Input latency MUST be <50ms (validated with DevTools)
- All 4 keyboard layouts + touch MUST work

**WHY THIS MATTERS:**
- Bad input abstraction = nightmare to add gamepad/other inputs later
- Missing reversal prevention = instant death bug
- High input latency = frustrating, unresponsive gameplay
- Missing keyboard layouts = excludes French/international users

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── input.js        # Input abstraction layer (NEW)
├── snake.js        # Snake movement logic (NEW)
├── game.js         # Update update() to call moveSnake() (MODIFY)
├── state.js        # Already exists from Story 1.2
├── render.js       # Already exists from Story 1.2
├── config.js       # Already exists from Story 1.1
└── main.js         # Wire up input listeners (MODIFY)
```

**Input Abstraction Pattern (from architecture.md):**

From architecture.md:
- Single `input.js` module handles all input sources
- Maps keyboard (4 layouts) + touch to game actions
- Game code receives normalized actions, not raw events
- Testable: can simulate actions without real input

**Supported Input Mappings:**

| Action | Arrow | WASD | ZQSD | Numpad | Touch |
|--------|-------|------|------|--------|-------|
| up     | ↑     | W    | Z    | 8      | Swipe up |
| down   | ↓     | S    | S    | 2      | Swipe down |
| left   | ←     | A    | Q    | 4      | Swipe left |
| right  | →     | D    | D    | 6      | Swipe right |

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- `addEventListener('keydown')` - Keyboard input
- `addEventListener('touchstart')` - Touch start position
- `addEventListener('touchend')` - Touch end position, swipe detection
- Standard DOM event handling (no libraries)

**NO external dependencies** - Pure browser APIs.

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/input.js - Input Abstraction Layer**

```javascript
import { CONFIG } from './config.js';

// Key mappings for different keyboard layouts
const KEY_MAPPINGS = {
  // Arrow keys
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',

  // WASD (US layout)
  'w': 'up',
  'W': 'up',
  's': 'down',
  'S': 'down',
  'a': 'left',
  'A': 'left',
  'd': 'right',
  'D': 'right',

  // ZQSD (French AZERTY layout)
  'z': 'up',
  'Z': 'up',
  'q': 'left',
  'Q': 'left',

  // Numpad
  '8': 'up',
  '2': 'down',
  '4': 'left',
  '6': 'right'
};

let touchStartX = null;
let touchStartY = null;

/**
 * Initialize input listeners
 */
export function initInput(gameState) {
  // Keyboard input
  document.addEventListener('keydown', (e) => {
    handleKeyboardInput(e, gameState);
  });

  // Touch input (mobile)
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', (e) => {
    handleTouchEnd(e, gameState);
  });
}

/**
 * Handle keyboard input
 */
function handleKeyboardInput(event, gameState) {
  const direction = KEY_MAPPINGS[event.key];

  if (direction && gameState.phase === 'playing') {
    event.preventDefault();  // Prevent arrow key scrolling
    setDirection(gameState, direction);
  }
}

/**
 * Handle touch start
 */
function handleTouchStart(event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

/**
 * Handle touch end and detect swipe
 */
function handleTouchEnd(event, gameState) {
  if (touchStartX === null || touchStartY === null) {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  // Minimum swipe distance (30px)
  const MIN_SWIPE_DISTANCE = 30;

  if (absX < MIN_SWIPE_DISTANCE && absY < MIN_SWIPE_DISTANCE) {
    // Not a swipe, too small
    touchStartX = null;
    touchStartY = null;
    return;
  }

  let direction;
  if (absX > absY) {
    // Horizontal swipe
    direction = deltaX > 0 ? 'right' : 'left';
  } else {
    // Vertical swipe
    direction = deltaY > 0 ? 'down' : 'up';
  }

  if (gameState.phase === 'playing') {
    setDirection(gameState, direction);
  }

  touchStartX = null;
  touchStartY = null;
}

/**
 * Set snake direction with validation
 * Prevents 180° reversal
 */
function setDirection(gameState, newDirection) {
  const currentDirection = gameState.snake.direction;

  // Prevent 180° reversal
  const opposites = {
    'up': 'down',
    'down': 'up',
    'left': 'right',
    'right': 'left'
  };

  if (opposites[currentDirection] === newDirection) {
    // Ignore opposite direction input
    return;
  }

  // Set next direction (will be applied on next game tick)
  gameState.snake.nextDirection = newDirection;
}
```

**js/snake.js - Snake Movement Logic**

```javascript
import { CONFIG } from './config.js';

/**
 * Move snake one step in current direction
 * Called every game tick (125ms)
 */
export function moveSnake(gameState) {
  const snake = gameState.snake;

  // Apply queued direction change
  snake.direction = snake.nextDirection;

  // Calculate new head position
  const head = snake.segments[snake.segments.length - 1];
  const newHead = getNewHeadPosition(head, snake.direction);

  // Add new head
  snake.segments.push(newHead);

  // Remove tail (unless growing - handled in food collision story)
  // For now, always remove tail (constant length)
  snake.segments.shift();
}

/**
 * Calculate new head position based on direction
 */
function getNewHeadPosition(head, direction) {
  const newHead = { x: head.x, y: head.y };

  switch (direction) {
    case 'up':
      newHead.y -= 1;
      break;
    case 'down':
      newHead.y += 1;
      break;
    case 'left':
      newHead.x -= 1;
      break;
    case 'right':
      newHead.x += 1;
      break;
  }

  return newHead;
}

/**
 * Get snake head position
 */
export function getSnakeHead(snake) {
  return snake.segments[snake.segments.length - 1];
}

/**
 * Grow snake by one segment
 * Called when food is eaten (Story 1.4)
 */
export function growSnake(gameState) {
  // Growth: don't remove tail on next move
  // Implementation: add a flag or duplicate tail segment
  const tail = gameState.snake.segments[0];
  gameState.snake.segments.unshift({ x: tail.x, y: tail.y });
}
```

**js/game.js - Updated with Snake Movement**

```javascript
import { CONFIG } from './config.js';
import { render } from './render.js';
import { moveSnake } from './snake.js';

const TICK_RATE = CONFIG.TICK_RATE;  // 125ms

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

  // Render every frame (60 FPS)
  render(ctx, gameState);

  // Continue loop
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}

/**
 * Game logic update (fixed timestep)
 */
function update(gameState) {
  if (gameState.phase !== 'playing') {
    return;
  }

  // Move snake
  moveSnake(gameState);

  // Story 1.4: Check food collision
  // Story 1.5: Check wall/self collision
}

export function startGameLoop(ctx, gameState) {
  lastTime = performance.now();
  accumulator = 0;
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}
```

**js/main.js - Wire Up Input**

```javascript
import { CONFIG } from './config.js';
import { createInitialState } from './state.js';
import { startGameLoop } from './game.js';
import { initInput } from './input.js';

// Initialize canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size from config
canvas.width = CONFIG.GRID_WIDTH * CONFIG.UNIT_SIZE;
canvas.height = CONFIG.GRID_HEIGHT * CONFIG.UNIT_SIZE;

// Create initial game state
const gameState = createInitialState();

// Initialize input listeners
initInput(gameState);

// Start game loop
startGameLoop(ctx, gameState);

console.log('CrazySnakeLite game started - use arrow keys or WASD to control');
```

---

### 🎨 VISUAL SPECIFICATIONS

**Movement Behavior:**
- Snake moves at 8 moves per second (125ms per move)
- Movement is grid-aligned (jumps one grid unit at a time)
- Snake head is always the LAST segment in array
- Snake grows from head, tail follows naturally

**Direction Change Timing:**
- Input is queued in `nextDirection`
- Direction change applied at START of next game tick
- Multiple rapid inputs: only last one before tick matters
- This prevents "eating yourself" bugs from double-tapping

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Arrow Key Testing:**
   - Press Up arrow → snake moves up
   - Press Down arrow → snake moves down
   - Press Left arrow → snake moves left
   - Press Right arrow → snake moves right
   - Press arrow keys rapidly → direction changes smoothly

2. **WASD Testing:**
   - W → up, S → down, A → left, D → right
   - Verify same behavior as arrow keys

3. **ZQSD Testing (French layout):**
   - Z → up, S → down, Q → left, D → right
   - Test on French keyboard or simulate

4. **Numpad Testing:**
   - 8 → up, 2 → down, 4 → left, 6 → right
   - NumLock must be ON

5. **Touch Testing (Mobile):**
   - Swipe up → snake moves up
   - Swipe down → snake moves down
   - Swipe left → snake moves left
   - Swipe right → snake moves right
   - Small taps ignored (not swipes)

6. **Reversal Prevention:**
   - Snake moving right, press left → NO CHANGE (ignored)
   - Snake moving up, press down → NO CHANGE (ignored)
   - Snake moving left, press right → NO CHANGE (ignored)
   - Snake moving down, press up → NO CHANGE (ignored)

7. **Input Latency:**
   - Open DevTools Performance tab
   - Record input event to direction change
   - Verify latency <50ms (NFR8)

**Common Issues:**
- ❌ Snake reverses into itself → Missing opposite direction check
- ❌ Arrow keys scroll page → Missing preventDefault()
- ❌ Swipe detection too sensitive → Increase MIN_SWIPE_DISTANCE
- ❌ Double-tap causes weird movement → nextDirection queue not working

---

### 📚 CRITICAL DATA FORMATS

**Direction Values:**
```javascript
// CORRECT: String literals (from project-context.md)
direction: 'up'     // 'up' | 'down' | 'left' | 'right'
direction: 'down'
direction: 'left'
direction: 'right'

// WRONG: Numbers, abbreviations, or mixed case
direction: 0        // DON'T DO THIS
direction: 'U'      // DON'T DO THIS
direction: 'UP'     // DON'T DO THIS (must be lowercase)
```

**Position Updates:**
```javascript
// CORRECT: Create new position object
const newHead = { x: head.x, y: head.y };
newHead.y -= 1;  // Modify copy

// WRONG: Mutate existing segment
head.y -= 1;  // DON'T DO THIS (mutates array element)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **Direction Format:** ALWAYS use string literals ('up', 'down', 'left', 'right')
2. **Position Format:** ALWAYS use { x, y } objects
3. **Module Boundaries:** Pass gameState to functions, don't access globals
4. **Naming:** camelCase functions (moveSnake, setDirection, initInput)

**Input Handling Rules:**
- Normalize all inputs to direction strings
- Validate direction changes (prevent 180° reversal)
- Queue direction changes with nextDirection
- Apply queued direction at start of game tick

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Story 1.2:**
- ✅ gameState must exist with snake.direction and snake.nextDirection
- ✅ gameState.phase must exist ('playing' | 'menu' | 'gameover')
- ✅ game.js update() function must exist
- ✅ snake.segments array must exist with head at end

**Depends on Story 1.1:**
- ✅ CONFIG must have all required values
- ✅ Canvas must be set up for touch event capture

**If Stories 1.1 or 1.2 are incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR1, FR2, FR73-FR77, FR80

**Detailed FR Mapping:**
- FR1: Players control snake in four directions → input.js maps all inputs to directions
- FR2: Snake moves automatically at consistent speed → moveSnake() called every 125ms tick
- FR73: Arrow keys work → KEY_MAPPINGS includes ArrowUp/Down/Left/Right
- FR74: Numpad works → KEY_MAPPINGS includes 8/2/4/6
- FR75: WASD works → KEY_MAPPINGS includes W/A/S/D
- FR76: ZQSD works → KEY_MAPPINGS includes Z/Q/S/D (French layout)
- FR77: Touch swipe works → handleTouchStart/End with swipe detection
- FR80: Input latency <50ms → Direct event handling, no delays

**NFRs Covered:**
- NFR8: Input lag < 50ms → Immediate direction queuing on keydown
- NFR36: Controls learnable in 30 seconds → Standard arrow/WASD keys
- NFR39: Rapid inputs don't cause erratic behavior → nextDirection queue prevents issues

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] js/input.js exists with initInput(), keyboard mappings, touch detection
- [ ] js/snake.js exists with moveSnake(), getNewHeadPosition(), growSnake()
- [ ] js/game.js update() calls moveSnake() when phase is 'playing'
- [ ] js/main.js calls initInput(gameState)
- [ ] Snake moves continuously at 8 moves per second (125ms per move)
- [ ] Arrow keys change snake direction
- [ ] WASD keys change snake direction
- [ ] ZQSD keys change snake direction (French layout)
- [ ] Numpad 8/2/4/6 change snake direction
- [ ] Touch swipe gestures work on mobile
- [ ] 180° reversal is prevented (snake can't turn back into itself)
- [ ] Arrow keys don't scroll the page (preventDefault works)
- [ ] Input latency < 50ms (validated in DevTools)
- [ ] No console errors
- [ ] All exports are named exports
- [ ] Direction values use string literals ('up', 'down', 'left', 'right')

**Input Testing Checklist:**
- [ ] All 4 keyboard layouts tested and working
- [ ] Touch swipe detection tested on actual mobile device or emulator
- [ ] Rapid key presses don't cause bugs
- [ ] Small touch movements don't trigger direction changes
- [ ] Direction changes happen on next game tick (smooth)

**Common Mistakes to Avoid:**
- ❌ Forgetting preventDefault() on arrow keys (page scrolls)
- ❌ Not validating opposite direction (snake can reverse)
- ❌ Mutating head position directly (causes bugs)
- ❌ Using numbers for directions instead of strings
- ❌ Applying direction change immediately (should wait for next tick)
- ❌ MIN_SWIPE_DISTANCE too low (accidental direction changes)
- ❌ Not resetting touchStart coordinates after swipe

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - No issues encountered

### Completion Notes List

**2026-01-26: Implementation Complete**
- Created js/input.js with keyboard (Arrow, WASD, ZQSD, Numpad) and touch swipe support
- Created js/snake.js with moveSnake(), getSnakeHead(), growSnake()
- Updated js/game.js update() to call moveSnake() in fixed timestep loop
- Updated js/main.js to initialize input listeners
- 180° reversal prevention implemented via OPPOSITES check
- Touch swipe detection with configurable MIN_SWIPE_DISTANCE
- All 4 keyboard layouts working correctly

### File List

- js/input.js (new)
- js/snake.js (new)
- js/game.js (updated)
- js/main.js (updated)
- js/config.js (updated - added MIN_SWIPE_DISTANCE)
