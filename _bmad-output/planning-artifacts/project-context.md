# CrazySnakeLite - Project Context

> **Critical Implementation Rules for AI Agents**
> This document contains the non-negotiable patterns and specifications that MUST be followed when implementing code for CrazySnakeLite.

---

## Technology Stack

- **Language:** Vanilla JavaScript (ES6+)
- **Rendering:** HTML5 Canvas API (2D context)
- **Modules:** ES6 modules (`type="module"`)
- **Styling:** Plain CSS (no preprocessor)
- **Build System:** None - direct file serving
- **Dependencies:** Zero external dependencies
- **Deployment:** Static hosting (GitHub Pages, Netlify, Vercel)

---

## Data Format Rules

### MANDATORY: All implementations MUST follow these exact data structures

#### Positions
```javascript
// CORRECT: Always use { x, y } objects
const position = { x: 5, y: 10 };
const snakeHead = gameState.snake.segments[0]; // { x, y }

// WRONG: Never use arrays for positions
const position = [5, 10]; // ❌ FORBIDDEN
```

#### Colors
```javascript
// CORRECT: Always use hex strings
const color = '#FF0000';
gameState.snake.color = '#00FF00';

// WRONG: Never use RGB arrays or other formats
const color = [255, 0, 0]; // ❌ FORBIDDEN
const color = 'rgb(255, 0, 0)'; // ❌ FORBIDDEN
```

#### Time Values
```javascript
// CORRECT: Always use milliseconds
const tickRate = 125; // ms
const phoneDelay = 5000; // ms
const duration = performance.now(); // ms

// WRONG: Never use seconds
const tickRate = 0.125; // ❌ FORBIDDEN
```

#### Directions
```javascript
// CORRECT: Always use string literals
const direction = 'up'; // 'up' | 'down' | 'left' | 'right'

// WRONG: Never use numbers or objects
const direction = 0; // ❌ FORBIDDEN
const direction = { dx: 0, dy: -1 }; // ❌ FORBIDDEN
```

#### Food Types
```javascript
// CORRECT: String identifiers
const foodType = 'growing'; // 'growing' | 'invincibility' | 'wallPhase' | 'speedBoost' | 'speedDecrease' | 'reverseControls'

// WRONG: Never use numbers or abbreviations
const foodType = 0; // ❌ FORBIDDEN
const foodType = 'inv'; // ❌ FORBIDDEN
```

---

## Audio Implementation Rules

### API: Web Audio API (NOT HTML5 Audio)

**MANDATORY:** Use Web Audio API (`AudioContext` + `AudioBufferSourceNode`), NOT HTML5 Audio (`HTMLAudioElement`).

HTML5 Audio causes game freezes and sync issues at 8 sounds/second due to:
- `currentTime = 0` seek operations blocking the main thread
- `play()` promises scheduling microtasks
- Audio pipeline re-initialization on rapid calls

### File Format Specifications

**Format:** MP3 (.mp3)
- Sample Rate: 44.1 kHz
- Bit Depth: 16-bit
- Channels: Mono
- Target File Size: < 50KB per sound

### Required Audio Files (14 Alternating Sounds)

All audio files MUST be placed in `assets/sounds/`:

```
assets/sounds/
├── move-default-1.mp3 & move-default-2.mp3           # Neutral blips (black snake)
├── move-growing-1.mp3 & move-growing-2.mp3           # Pleasant tones (green snake)
├── move-invicibility-1.mp3 & move-invicibility-2.mp3 # Powerful tones (yellow snake)
├── move-wallphase-1.mp3 & move-wallphase-2.mp3       # Ethereal tones (purple snake)
├── move-speedboost-1.mp3 & move-speedboost-2.mp3     # Energetic, high pitch (red snake)
├── move-speeddecrease-1.mp3 & move-speeddecrease-2.mp3 # Slow, low pitch (cyan snake)
└── move-reverse-1.mp3 & move-reverse-2.mp3           # Dissonant tones (orange snake)
```

**Alternation Pattern:** Sound 1 -> Sound 2 -> Sound 1 -> Sound 2...
**State Change Reset:** When state changes, alternation resets to Sound 1.

### Effect-to-Sound State Mapping

**MANDATORY:** Active effects take priority over snake color:

```javascript
// Effect types map to sound state names
const EFFECT_SOUND_MAP = {
  'invincibility': 'invicibility',  // Note: typo in filenames
  'wallPhase': 'wallphase',
  'speedBoost': 'speedboost',
  'speedDecrease': 'speeddecrease',
  'reverseControls': 'reverse'
};

// Fallback: snake color maps to sound state
const COLOR_SOUND_MAP = {
  '#00FF00': 'growing',   // Green (growing food)
  '#000000': 'default'    // Black (neutral state)
};
```

### Audio Playback Rules

1. **Initialization:** Call `initAudio()` on first user interaction (creates AudioContext + fetches/decodes all MP3s)
2. **Resume:** Call `resumeAudio()` on user interaction (resumes AudioContext if suspended by browser)
3. **Movement Sounds:** Play ONCE per frame after the while accumulator loop, NOT inside `update()`
4. **Sound Selection:** Based on `gameState.activeEffect` (priority) then `gameState.snake.color`
5. **Error Handling:** Wrap in try/catch, never let audio errors break the game loop
6. **NEVER** call `playMoveSound()` inside the fixed-timestep `while` loop -- this causes multiple sounds per visual frame

### Audio Module Pattern

```javascript
// js/audio.js - MANDATORY STRUCTURE (Web Audio API)

let audioContext = null;
const audioBuffers = {};
let audioInitialized = false;
let currentAlternator = 0;
let previousState = null;

export async function initAudio() {
  if (audioInitialized) return;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Fetch and decode all 14 MP3s into AudioBuffers (parallel)
  const states = ['default', 'growing', 'invicibility', 'wallphase',
                  'speedboost', 'speeddecrease', 'reverse'];
  const promises = [];
  states.forEach(state => {
    for (const num of [1, 2]) {
      const key = `${state}-${num}`;
      promises.push(
        fetch(`assets/sounds/move-${state}-${num}.mp3`)
          .then(r => r.arrayBuffer())
          .then(buf => audioContext.decodeAudioData(buf))
          .then(decoded => { audioBuffers[key] = decoded; })
          .catch(() => {})
      );
    }
  });
  await Promise.all(promises);
  audioInitialized = true;
}

export function resumeAudio() {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

export function playMoveSound(gameState) {
  if (!audioInitialized || !audioContext || audioContext.state === 'suspended') return;

  const currentState = getCurrentState(gameState);
  if (currentState !== previousState) {
    currentAlternator = 0;  // Reset to Sound 1 on state change
    previousState = currentState;
  }

  const buffer = audioBuffers[`${currentState}-${currentAlternator + 1}`];
  if (buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);  // Near-zero latency, non-blocking
  }
  currentAlternator = 1 - currentAlternator;
}
```

### Game Loop Integration (CRITICAL)

```javascript
// js/game.js - Sound DECOUPLED from while loop
let tickedThisFrame = false;
while (accumulator >= currentTickRate) {
  update(gameState);       // Game logic only, NO sound here
  accumulator -= currentTickRate;
  tickedThisFrame = true;
}
// Sound ONCE per frame, after all updates settle
if (tickedThisFrame && gameState.phase === 'playing') {
  playMoveSound(gameState);
}
render(ctx, gameState);
```

---

## Module Organization

### File Responsibilities

| Module | Responsibility | MUST NOT Do |
|--------|---------------|-------------|
| **main.js** | Entry point, initialization, wiring | Game logic, rendering |
| **config.js** | ALL tunable parameters (CONFIG object) | Computation, logic |
| **state.js** | State structure, createInitialState(), resetGame() | Game logic updates |
| **game.js** | Game loop, update orchestration | Direct rendering |
| **snake.js** | Snake movement, growth, effect application | Collision detection |
| **food.js** | Food spawning, type selection | Effect application |
| **collision.js** | All collision detection | Movement logic |
| **effects.js** | Effect application, duration tracking | Rendering |
| **phone.js** | Phone call timing, overlay control | Game state updates |
| **input.js** | Keyboard + touch → action mapping | Game logic |
| **render.js** | Canvas drawing ONLY | State mutation |
| **audio.js** | Web Audio API: sound loading, decoding, playback | Game logic |

### Module Boundaries

**CRITICAL RULE:** Modules MUST NOT cross their responsibility boundaries.

```javascript
// CORRECT: Clear separation
// In game.js
import { moveSnake } from './snake.js';
import { checkCollision } from './collision.js';
import { playMoveSound } from './audio.js';

// update() handles game logic ONLY (no sound)
function update(gameState) {
  moveSnake(gameState);
  if (checkCollision(gameState)) handleDeath(gameState);
}
// playMoveSound() called ONCE per frame in gameLoop(), outside the while loop

// WRONG: Mixing responsibilities
// In snake.js (DO NOT DO THIS)
function moveSnake(gameState) {
  // Move logic...
  checkCollision(gameState); // ❌ Collision detection doesn't belong in snake.js
  playSound(); // ❌ Audio doesn't belong in snake.js
}
```

---

## Naming Conventions

### MANDATORY Naming Rules

```javascript
// Functions: camelCase, verb-first
export function moveSnake(gameState) { }
export function checkWallCollision(position) { }
export function playMoveSound(color) { }

// Constants: SCREAMING_SNAKE_CASE
const GRID_WIDTH = 25;
const TICK_RATE = 125;
const FOOD_PROBABILITIES = { /* ... */ };

// Variables: camelCase
let gameState = createInitialState();
const snakeHead = getSnakeHead(gameState);

// File names: kebab-case (if multi-word, but prefer single word)
// snake.js, food.js, game.js (PREFERRED)
// phone-call.js (ACCEPTABLE if needed)
```

---

## Configuration Pattern

### ALL Tunable Values MUST Live in config.js

```javascript
// CORRECT: In config.js
export const CONFIG = {
  GRID_WIDTH: 25,
  GRID_HEIGHT: 20,
  UNIT_SIZE: 20,
  BASE_SPEED: 8,
  TICK_RATE: 125,

  SNAKE_COLORS: {
    DEFAULT: '#000000',
    GROWING: '#00FF00',
    INVINCIBILITY: '#FFFF00',
    WALL_PHASE: '#800080',
    SPEED_BOOST: '#FF0000',
    SPEED_DECREASE: '#00CED1',
    REVERSE: '#FFA500'
  },

  // Audio: 14 alternating MP3s managed by Web Audio API in audio.js
  // Sound states: default, growing, invicibility, wallphase, speedboost, speeddecrease, reverse
  // Each state has 2 alternating sounds: move-{state}-1.mp3 & move-{state}-2.mp3
  // Files located in: assets/sounds/
};

// WRONG: Magic numbers in code
function moveSnake() {
  if (position.x > 25) { /* ... */ } // ❌ Use CONFIG.GRID_WIDTH
  setTimeout(tick, 125); // ❌ Use CONFIG.TICK_RATE
}
```

---

## State Management

### Single State Object Pattern

```javascript
// Defined in state.js, passed to all functions that need it
const gameState = {
  phase: 'playing',  // 'menu' | 'playing' | 'gameover'
  snake: {
    segments: [{ x, y }, ...],
    direction: 'right',
    nextDirection: 'right',
    color: '#000000'
  },
  food: {
    position: { x, y },
    type: 'growing'
  },
  activeEffect: null,  // { type: 'invincibility', speedMultiplier: 1.0 } or null
  score: 0,
  highScore: 0,
  phoneCall: {
    active: false,
    caller: null,
    nextCallTime: 0
  }
};
```

### State Access Rules

```javascript
// CORRECT: Pass state explicitly
function moveSnake(gameState) {
  const head = gameState.snake.segments[0];
  // ...
}

// WRONG: Access global state
let globalState; // ❌ FORBIDDEN
function moveSnake() {
  const head = globalState.snake.segments[0]; // ❌ FORBIDDEN
}
```

---

## Performance Requirements

### Non-Negotiable Performance Targets

- **Frame Rate:** 60 FPS ALWAYS (even during phone call overlay)
- **Input Lag:** < 50ms from key press to state update
- **Memory Usage:** < 100MB total
- **Audio Latency:** < 100ms from movement to sound playback
- **Load Time:** < 3 seconds (including all assets)

### Performance Validation

```javascript
// Game loop MUST maintain 60 FPS
function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;

  // Fixed timestep for consistent gameplay
  accumulator += deltaTime;
  while (accumulator >= TICK_RATE) {
    update(gameState);  // MUST complete in < 16ms
    accumulator -= TICK_RATE;
  }

  render(ctx, gameState);  // MUST complete in < 16ms
  requestAnimationFrame(gameLoop);
}
```

---

## Testing Requirements

### Required Test Coverage

1. **Effect Application:** Each food type applies correct effect
2. **Effect Duration:** Effects persist until next food is eaten
3. **Invincibility:** Wall collision ignored, self-collision ignored
4. **Wall Phase:** Pass through walls to opposite side
5. **Phone Call Timing:** Triggered within min/max delay range
6. **Phone Dismissal:** Spacebar clears overlay
7. **Audio Mapping:** Correct sound plays for each snake color

### Test Pattern

```javascript
// Test files in /test directory
// Use simple assertions, no framework needed for MVP

function testInvincibility() {
  const state = createInitialState();
  applyEffect(state, 'invincibility');

  // Verify color changed
  assert(state.snake.color === '#FFFF00', 'Color should be yellow');

  // Verify wall collision ignored
  const collided = checkWallCollision(state);
  assert(!collided, 'Should ignore wall collision');
}
```

---

## Error Handling

### Graceful Degradation Rules

```javascript
// CORRECT: Non-blocking error handling (Web Audio API)
export function playMoveSound(gameState) {
  if (!audioInitialized || !audioContext || audioContext.state === 'suspended') return;

  try {
    const buffer = audioBuffers[soundKey];
    if (buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);  // Non-blocking, no promises
    }
  } catch (error) {
    console.warn('[Audio] Error:', error.message);  // Never crash the game loop
  }
}

// WRONG: Throwing errors that could crash the game
if (!sound) {
  throw new Error('Invalid color'); // ❌ FORBIDDEN: would crash game loop
}
```

---

## Code Style

### Module Exports

```javascript
// CORRECT: Named exports only
export function moveSnake(gameState) { }
export function checkCollision(position) { }

// WRONG: Default exports
export default function moveSnake(gameState) { } // ❌ FORBIDDEN
```

### Function Style

```javascript
// CORRECT: Clear, single-purpose functions
export function moveSnake(gameState) {
  const head = getSnakeHead(gameState);
  const newHead = calculateNewHead(head, gameState.snake.direction);
  gameState.snake.segments.unshift(newHead);
}

// WRONG: Functions doing too many things
export function updateEverything(state) { /* ... */ } // ❌ Too vague
```

---

## Critical Anti-Patterns

### NEVER Do These Things

```javascript
// ❌ FORBIDDEN: Positions as arrays
const position = [x, y];

// ❌ FORBIDDEN: Colors as RGB arrays
const color = [255, 0, 0];

// ❌ FORBIDDEN: Time in seconds
const delay = 0.125;

// ❌ FORBIDDEN: Direction as numbers
const direction = 0; // up

// ❌ FORBIDDEN: Magic numbers in code
if (snake.x > 25) { }

// ❌ FORBIDDEN: Global state access
let globalState;
function update() { globalState.score++; }

// ❌ FORBIDDEN: Default exports
export default something;

// ❌ FORBIDDEN: Throwing errors in game loop
throw new Error('Collision'); // Use return values or flags

// ❌ FORBIDDEN: HTML5 Audio for game sound effects
new Audio('assets/sounds/move.mp3'); // Use Web Audio API (AudioContext + AudioBufferSourceNode)

// ❌ FORBIDDEN: Sound playback inside the while accumulator loop
while (accumulator >= tickRate) {
  update(gameState);
  playMoveSound(gameState); // ❌ Causes multiple sounds per frame
}

// ❌ FORBIDDEN: Audio errors crashing the game loop
source.start(); // Always wrap in try/catch
```

---

## Implementation Checklist

Before submitting ANY code, verify:

- ✅ Positions use `{ x, y }` objects
- ✅ Colors use hex strings `'#RRGGBB'`
- ✅ Time values are in milliseconds
- ✅ Directions are string literals
- ✅ No magic numbers (all values in CONFIG)
- ✅ Named exports only
- ✅ State passed explicitly to functions
- ✅ Module stays within its responsibility boundary
- ✅ Audio uses Web Audio API (AudioContext + AudioBufferSourceNode), NOT HTML5 Audio
- ✅ Audio files are MP3 format (44.1kHz, 16-bit, mono)
- ✅ Audio playback decoupled from while loop (once per frame, not per tick)
- ✅ Audio playback has error handling (try/catch, never crash game loop)
- ✅ Code maintains 60 FPS performance

---

## Questions?

If unclear about any pattern, refer to:
1. This document (project-context.md) - FIRST
2. architecture.md - For architectural decisions
3. Existing code in the project - For implementation examples

**When in doubt:** Follow the simplest pattern that maintains these rules.
