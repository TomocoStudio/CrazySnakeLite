---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-01-23'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
workflowType: 'architecture'
project_name: 'CrazySnakeLite'
user_name: 'Tomoco'
date: '2026-01-23'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
99 requirements across 10 domains:
- Core Gameplay (FR1-FR8): Snake movement, collision, death conditions
- Food System (FR10-FR24): 6 food types, probability spawning, effect duration rules
- Phone Call Mechanic (FR25-FR34): Overlay UI, game continues underneath, dismissal controls
- Session Flow (FR35-FR40): Start, death, restart cycle
- Scoring System (FR41-FR45): Score = snake length, visual counter
- User Interface (FR46-FR72): Retro aesthetic, snake-as-status-display, menu screens
- Input Controls (FR73-FR80): Multi-keyboard layout support + mobile touch
- Sound Design (FR81-FR89): State-based movement sounds, game over melody
- Platform Support (FR90-FR94): Cross-browser, responsive, < 3s load
- Analytics (FR95-FR99): Session, food, phone call tracking

**Non-Functional Requirements:**
46 requirements across 5 categories:
- Performance (NFR1-NFR13): 60 FPS always, < 50ms input lag, < 100MB memory
- Browser Compatibility (NFR14-NFR25): Chrome/Firefox/Safari/Edge, graceful degradation
- Reliability (NFR26-NFR35): No crashes, consistent mechanics, accurate collision
- Usability (NFR36-NFR40): Learn through play, error tolerance
- Maintainability (NFR41-NFR46): Modular code, configurable parameters, testable

**Scale & Complexity:**

- Primary domain: Browser-based game (Canvas SPA)
- Complexity level: Low
- Estimated architectural components: 8-10 modules

### Technical Constraints & Dependencies

**Hard Constraints:**
- Client-side only (no backend for MVP)
- Static hosting deployment (Netlify/Vercel/GitHub Pages)
- 60 FPS during phone call overlay (game continues running)
- < 3 second load time
- Cross-browser Canvas API compatibility
- No experimental browser features

**Technology Signals from PRD:**
- "Vanilla JavaScript or lightweight framework"
- "HTML5 Canvas for rendering"
- "RequestAnimationFrame for smooth 60 FPS"
- "Fixed time step for game logic"
- "Simple client-side state (no Redux needed)"

### Deployment & Distribution Requirement

**User Need:** Share game with colleagues across different offices/locations via simple URL.

**Architectural Implication:**
- Single deployable artifact (HTML + JS + CSS bundle)
- Zero server dependencies (pure static hosting)
- Instant shareability (no login, no setup, just a link)
- Preferred hosting: GitHub Pages (free, simple) or Netlify/Vercel (free tier)
- No CORS issues (self-contained, no external API calls for MVP)

**Simplest deployment path:** Push to GitHub repo with Pages enabled → share URL → done.

### Cross-Cutting Concerns Identified

1. **Game Loop Architecture** - Separation of update logic (fixed timestep) from render loop (RAF)
2. **State Management** - Snake state, active effects, food, score, game phase
3. **Input Abstraction** - Unified handling for keyboard (4 layouts) + touch
4. **Effect System** - Duration tracking, visual indicators, stacking rules
5. **Audio Integration** - Web Audio API, state-driven alternating sounds, decoupled from game loop
6. **Analytics Layer** - Non-blocking event capture without affecting performance
7. **Configuration System** - Tunable parameters (probabilities, timing, speeds)

## Starter Template Evaluation

### Primary Technology Domain

Browser-based Canvas game (SPA) - Client-side only, static hosting

### Starter Options Considered

| Option | Evaluation |
|--------|------------|
| **Plain HTML/JS/CSS** | Matches PRD guidance ("no build tool required"), simplest deployment, zero dependencies |
| **Vite (vanilla)** | Modern DX with hot reload, but adds Node.js dependency - unnecessary for MVP scope |
| **Vite + TypeScript** | Type safety benefits, but adds complexity without clear value for small game codebase |
| **Game frameworks (Phaser, etc.)** | Overkill - CrazySnakeLite's mechanics are simple enough for vanilla Canvas API |

### Selected Approach: Plain HTML/JS/CSS (No Starter)

**Rationale for Selection:**
- PRD explicitly states "No build tool required for MVP"
- Deployment requirement is "simplest possible" (GitHub Pages)
- Game mechanics are well-defined and don't require framework abstractions
- Faster iteration: edit file → refresh browser → test
- Zero external dependencies = zero supply chain concerns
- Matches the retro aesthetic philosophy of the game itself

**Project Structure:**

```
CrazySnakeLite/
├── index.html          # Entry point, game container
├── css/
│   └── style.css       # Retro styling, game board, overlays
├── js/
│   ├── main.js         # Entry point, game initialization
│   ├── game.js         # Game loop, state management
│   ├── snake.js        # Snake entity, movement, effects
│   ├── food.js         # Food spawning, types, probabilities
│   ├── phone.js        # Phone call overlay mechanic
│   ├── input.js        # Keyboard/touch input abstraction
│   ├── audio.js        # Sound system
│   ├── render.js       # Canvas rendering
│   └── config.js       # Tunable game parameters
├── assets/
│   └── sounds/         # 8-bit audio files
└── README.md           # Setup instructions
```

**Architectural Decisions Made by This Choice:**

| Aspect | Decision |
|--------|----------|
| **Language** | Vanilla JavaScript (ES6+) |
| **Modules** | ES6 modules with `type="module"` in script tag |
| **Styling** | Plain CSS (no preprocessor) |
| **Build** | None - direct file serving |
| **Testing** | Manual browser testing for MVP |
| **Deployment** | Copy files to any static host |

**Development Workflow:**

1. Edit files in any editor
2. Open `index.html` in browser (or use simple local server like `python -m http.server`)
3. Refresh to see changes
4. Deploy by pushing to GitHub Pages or uploading to Netlify/Vercel

**Note:** ES6 modules require a local server (not `file://` protocol). Use `python -m http.server 8000` or VS Code Live Server extension.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Made):**
1. Game Loop Architecture
2. State Management Pattern
3. Canvas Rendering Strategy
4. Phone Overlay Implementation
5. Input Handling Architecture

**Deferred Decisions (Post-MVP):**
- Analytics implementation details
- Service worker for offline play
- Advanced audio features (spatial audio, dynamic mixing)

### Game Loop Architecture

**Decision:** Fixed Timestep + RequestAnimationFrame

**Pattern:**
- Game logic updates at fixed intervals (125ms = 8 moves/second per PRD)
- Rendering runs at 60 FPS via requestAnimationFrame
- Delta time accumulated, logic ticks when threshold reached

**Rationale:**
- Snake movement is consistent across all devices
- Frame rate drops don't affect gameplay speed
- Smooth rendering independent of game tick rate

**Implementation:**
```javascript
const TICK_RATE = 125; // ms (8 moves/second)
let lastTime = 0;
let accumulator = 0;

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  while (accumulator >= TICK_RATE) {
    update(); // Fixed timestep game logic
    accumulator -= TICK_RATE;
  }

  render(); // Every frame at 60 FPS
  requestAnimationFrame(gameLoop);
}
```

### State Management

**Decision:** Single State Object with Phase Field

**Pattern:**
- One `gameState` object holds all game data
- `phase` field acts as simple state machine (menu, playing, gameover)
- Easy to reset on "Play Again", easy to inspect/debug

**Structure:**
```javascript
const gameState = {
  phase: 'menu',  // 'menu' | 'playing' | 'gameover'
  snake: {
    segments: [{x, y}, ...],
    direction: 'right',
    nextDirection: 'right',
    color: '#000000'
  },
  food: {
    position: {x, y},
    type: 'growing'
  },
  activeEffect: null,  // { type: 'invincibility' } or null
  score: 0,
  highScore: 0,  // persisted to localStorage
  phoneCall: {
    active: false,
    caller: null,
    nextCallTime: 0
  },
  config: { /* tunable parameters */ }
};
```

**Rationale:**
- Single source of truth
- Reset is trivial: reassign to initial state
- No coordination between modules needed

### Canvas Rendering Strategy

**Decision:** Layered Canvases with CSS Blur

**Pattern:**
- Game canvas (bottom): Always renders at 60 FPS
- Phone overlay (top): DOM elements positioned above canvas
- Blur effect: CSS `filter: blur()` on game canvas when phone active

**Structure:**
```html
<div id="game-container">
  <canvas id="game-canvas"></canvas>
  <div id="phone-overlay" class="hidden">...</div>
</div>
```

**Rationale:**
- Game loop stays simple (always render game)
- CSS blur is GPU-accelerated, no manual pixel work
- Phone overlay is independent, easy to style
- Maintains 60 FPS during phone call (critical requirement)

### Phone Overlay Implementation

**Decision:** DOM Elements with CSS Styling

**Pattern:**
- Phone UI built with HTML/CSS (not canvas-rendered)
- Retro Nokia aesthetic via CSS
- Show/hide with class toggle
- Button handles click/tap natively

**Rationale:**
- Native text rendering (crisp caller names)
- Easy responsive scaling for mobile
- Built-in accessibility (button is focusable)
- CSS handles the retro look without pixel-by-pixel drawing

### Input Handling Architecture

**Decision:** Input Abstraction Layer

**Pattern:**
- Single `input.js` module handles all input sources
- Maps keyboard (4 layouts) + touch to game actions
- Game code receives normalized actions, not raw events

**Supported Mappings:**

| Action | Arrow | WASD | ZQSD | Numpad | Touch |
|--------|-------|------|------|--------|-------|
| up | ↑ | W | Z | 8 | Swipe up |
| down | ↓ | S | S | 2 | Swipe down |
| left | ← | A | Q | 4 | Swipe left |
| right | → | D | D | 6 | Swipe right |
| dismiss | Space | Space | Space | Space | Tap End |
| select | Enter | Enter | Enter | Enter | Tap |
| menu | Esc | Esc | Esc | Esc | — |

**Rationale:**
- Game code is input-agnostic
- Adding new input methods (gamepad?) is localized
- Touch swipe detection in one place
- Testable: can simulate actions without real input

### Audio System Architecture

**Decision:** Web Audio API with Decoupled Playback + State-Based Alternating Sounds

**Pattern:**
- Single `audio.js` module manages all game sounds via Web Audio API
- `AudioContext` created on first user interaction (browser autoplay policy compliance)
- All sound files fetched and pre-decoded into `AudioBuffer` objects at init
- Playback via lightweight, disposable `AudioBufferSourceNode` (near-zero latency, non-blocking)
- Sound playback decoupled from game loop accumulator -- called once per frame, not per tick
- 14 alternating sounds (7 states x 2 variations) with state-change reset
- Graceful degradation if audio blocked or unavailable

**Why Web Audio API (not HTML5 Audio):**

HTML5 Audio (`HTMLAudioElement`) was initially used but caused game freezes and sync issues:
- `currentTime = 0` reset performs a seek operation (main thread blocking)
- `play()` returns a Promise that schedules microtasks
- Multiple rapid `play()` calls cause audio pipeline re-initialization
- Not designed for rapid-fire game sound effects at 8 sounds/second

Web Audio API resolves all these issues:
- Pre-decoded `AudioBuffer` objects require zero decode work at play time
- `AudioBufferSourceNode.start()` is non-blocking (no promises, no seeks)
- Designed specifically for interactive audio (games, instruments)

**File Format Specifications:**

| Aspect | Specification | Rationale |
|--------|--------------|-----------|
| **Format** | MP3 (.mp3) | Universal browser compatibility including Safari |
| **Sample Rate** | 44.1 kHz | Standard audio quality, widely supported |
| **Bit Depth** | 16-bit | Adequate quality with good performance |
| **Channels** | Mono | Sufficient for 8-bit sound effects, reduces file size |
| **File Size Target** | < 50KB per sound | Fast loading, minimal bandwidth impact |

**Audio Assets Inventory (14 alternating sounds):**

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

**Alternation Pattern:**
- Each state has 2 sounds that alternate: Sound 1 -> Sound 2 -> Sound 1 -> Sound 2...
- When state changes (e.g., eat special food), alternation resets to Sound 1
- Provides dynamic audio variation without repetitive single-sound fatigue

**Implementation Pattern:**

```javascript
// js/audio.js - Web Audio API with alternating sounds
let audioContext = null;
const audioBuffers = {};
let audioInitialized = false;
let currentAlternator = 0;
let previousState = null;

export async function initAudio() {
  if (audioInitialized) return;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const states = ['default', 'growing', 'invicibility', 'wallphase',
                  'speedboost', 'speeddecrease', 'reverse'];

  // Fetch and decode all 14 sounds in parallel
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
  currentAlternator = 1 - currentAlternator;  // Toggle: 0->1->0->1
}
```

**Integration Points:**

1. **Initialization** (main.js): Call `initAudio()` + `resumeAudio()` on first user interaction (click/keydown)
2. **Movement Sound** (game.js): Call `playMoveSound(gameState)` ONCE per frame after the while accumulator loop settles, NOT inside `update()`
3. **Game Over Sound** (game.js): Call `playGameOverSound()` when snake dies (Story 4.6)

**Critical: Sound Decoupled from Game Loop Accumulator:**

```javascript
// game.js - Sound called once per frame, not per tick
let tickedThisFrame = false;
while (accumulator >= currentTickRate) {
  update(gameState);       // Game logic only, NO sound
  accumulator -= currentTickRate;
  tickedThisFrame = true;
}
// Sound ONCE per frame after all updates settle
if (tickedThisFrame && gameState.phase === 'playing') {
  playMoveSound(gameState);
}
render(ctx, gameState);
```

This guarantees exactly one sound per visual movement frame, even when the while loop runs multiple catch-up ticks.

**Performance Considerations:**

- Audio playback frequency: 8 sounds/second (matches snake movement at 125ms tick rate)
- Pre-decoded AudioBuffers in memory (zero decode latency at play time)
- AudioBufferSourceNode is lightweight and disposable (no GC pressure)
- Non-blocking: `source.start(0)` does not involve promises or main thread work
- Sound decoupled from accumulator loop prevents multiple sounds per frame

**Browser Compatibility:**

- Web Audio API: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (all target browsers)
- `webkitAudioContext` fallback for older Safari versions
- AudioContext resume on user interaction handles autoplay policy
- Graceful degradation: Game playable with audio disabled/blocked

**Rationale:**

- Web Audio API designed for interactive audio (games, instruments) -- correct tool for the job
- Pre-decoded buffers eliminate decode latency and main thread blocking
- Disposable AudioBufferSourceNode avoids seek operations and play() promise chains
- Decoupled playback guarantees 1:1 sound-to-visual-movement sync
- Alternating sounds provide dynamic variation matching retro game aesthetics
- State-driven sound selection with effect priority is explicit and maintainable

### Decision Impact Analysis

**Implementation Sequence:**
1. Project setup (index.html, file structure)
2. Game loop foundation (RAF + fixed timestep)
3. State object + config
4. Canvas setup (game canvas)
5. Input abstraction layer
6. Snake rendering + movement
7. Food system
8. Collision detection
9. Effect system
10. Phone overlay (DOM + CSS blur)
11. Audio system
12. Menu screens
13. Polish + testing

**Cross-Component Dependencies:**
- Game loop drives everything (must be solid first)
- State object is shared across all modules
- Input layer feeds into game loop update
- Render layer reads from state object
- Phone overlay interacts with state (sets blur, pauses input processing for game)

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Addressed:** 5 categories where inconsistency could cause issues

### Naming Patterns

**JavaScript Naming:**

| Element | Convention | Examples |
|---------|------------|----------|
| Variables | camelCase | `snakeHead`, `foodPosition`, `activeEffect` |
| Functions | camelCase | `getSnakeHead()`, `spawnFood()`, `handleInput()` |
| Constants | SCREAMING_SNAKE_CASE | `TICK_RATE`, `GRID_WIDTH`, `FOOD_TYPES` |
| Classes (if any) | PascalCase | `Snake`, `Food` (unlikely needed) |

**File Naming:**

| Type | Convention | Examples |
|------|------------|----------|
| JS modules | kebab-case.js | `game-loop.js`, `phone-overlay.js`, `input-handler.js` |
| CSS files | kebab-case.css | `style.css`, `phone-overlay.css` |
| HTML files | kebab-case.html | `index.html` |

**CSS Naming:**

| Element | Convention | Examples |
|---------|------------|----------|
| Classes | kebab-case | `.game-container`, `.phone-overlay`, `.score-display` |
| IDs | kebab-case | `#game-canvas`, `#phone-overlay` |
| CSS variables | kebab-case with -- prefix | `--snake-color`, `--grid-size` |

### Data Format Patterns

**Position Data:**
```javascript
// CORRECT: Object with named properties
const position = { x: 5, y: 10 };
const segments = [{ x: 0, y: 0 }, { x: 1, y: 0 }];

// WRONG: Array-based positions
const position = [5, 10];  // Don't do this
```

**Color Values:**
```javascript
// CORRECT: Hex strings (matches CSS)
const SNAKE_COLORS = {
  default: '#000000',
  growing: '#00FF00',
  invincibility: '#FFFF00',
  wallPhase: '#800080',
  speedBoost: '#FF0000',
  speedDecrease: '#00FFFF',
  reverseControls: '#FFA500'
};

// WRONG: RGB arrays or objects
const color = [255, 0, 0];  // Don't do this
```

**Time Values:**
```javascript
// CORRECT: Milliseconds (matches RAF and setTimeout)
const TICK_RATE = 125;        // 8 moves per second
const PHONE_MIN_DELAY = 15000; // 15 seconds
const PHONE_MAX_DELAY = 45000; // 45 seconds

// WRONG: Seconds or other units without conversion
const tickRate = 0.125;  // Don't do this
```

**Direction Values:**
```javascript
// CORRECT: String literals
type Direction = 'up' | 'down' | 'left' | 'right';
const direction = 'up';

// WRONG: Numbers or abbreviations
const direction = 0;   // Don't do this
const direction = 'u'; // Don't do this
```

**Food Types:**
```javascript
// CORRECT: String identifiers matching display names
const FOOD_TYPES = {
  GROWING: 'growing',
  INVINCIBILITY: 'invincibility',
  WALL_PHASE: 'wallPhase',
  SPEED_BOOST: 'speedBoost',
  SPEED_DECREASE: 'speedDecrease',
  REVERSE_CONTROLS: 'reverseControls'
};
```

### Module Patterns

**Export Style:**
```javascript
// CORRECT: Named exports (explicit, trackable)
export function update(gameState) { /* ... */ }
export function render(ctx, gameState) { /* ... */ }
export const TICK_RATE = 125;

// WRONG: Default exports (harder to track)
export default { update, render };  // Don't do this
```

**Import Style:**
```javascript
// CORRECT: Import only what's needed
import { update, render } from './game.js';
import { TICK_RATE, GRID_WIDTH } from './config.js';

// WRONG: Import everything
import * as game from './game.js';  // Avoid unless necessary
```

**Module Communication:**
```javascript
// CORRECT: Pass state explicitly
export function update(gameState) {
  // Operate on passed state
  gameState.snake.segments.push(newSegment);
}

// WRONG: Reach into other modules' internals
import { internalState } from './other-module.js';  // Don't do this
```

### Configuration Pattern

**All tunable values in config.js:**
```javascript
// config.js - Single source of truth for all game parameters
export const CONFIG = {
  // Grid
  GRID_WIDTH: 25,
  GRID_HEIGHT: 20,
  UNIT_SIZE: 10,

  // Snake
  STARTING_LENGTH: 5,
  STARTING_DIRECTION: 'right',
  BASE_SPEED: 8, // moves per second

  // Speed modifiers
  SPEED_BOOST_MIN: 1.5,
  SPEED_BOOST_MAX: 2.0,
  SPEED_DECREASE_MIN: 0.3,
  SPEED_DECREASE_MAX: 0.5,

  // Food probabilities (must sum to 100)
  FOOD_PROBABILITIES: {
    growing: 40,
    invincibility: 10,
    wallPhase: 10,
    speedBoost: 15,
    speedDecrease: 15,
    reverseControls: 10
  },

  // Phone calls
  PHONE_MIN_DELAY: 15000,
  PHONE_MAX_DELAY: 45000,

  // Colors
  COLORS: {
    background: '#E8E8E8',
    grid: '#D0D0D0',
    border: '#800080',
    snake: { /* ... */ },
    food: { /* ... */ }
  }
};
```

### Code Style Patterns

**Formatting Rules:**
- 2-space indentation
- Single quotes for strings: `'hello'` not `"hello"`
- Semicolons required at end of statements
- One blank line between functions
- No trailing whitespace

**Function Style:**
```javascript
// CORRECT: Clear, single-purpose functions
export function moveSnake(gameState) {
  const head = getSnakeHead(gameState);
  const newHead = calculateNewHead(head, gameState.snake.direction);
  gameState.snake.segments.unshift(newHead);
}

// WRONG: Functions doing too many things
export function updateEverything(state) { /* ... */ }  // Too vague
```

### State Access Patterns

**Reading State:**
```javascript
// CORRECT: Access through passed reference
function render(ctx, gameState) {
  const { snake, food, score } = gameState;
  // Use destructured values
}
```

**Modifying State:**
```javascript
// CORRECT: Direct mutation of passed state object (simple, matches our architecture)
function eatFood(gameState) {
  gameState.score += 1;
  gameState.snake.segments.push(newSegment);
  gameState.activeEffect = { type: food.type };
}

// Note: We chose single state object for simplicity -
// mutation is acceptable and expected in this architecture
```

### Error Handling Pattern

**Defensive Checks:**
```javascript
// CORRECT: Guard clauses for edge cases
function getSnakeHead(gameState) {
  if (!gameState.snake.segments.length) {
    console.error('Snake has no segments');
    return { x: 0, y: 0 };
  }
  return gameState.snake.segments[0];
}
```

**Console Logging:**
```javascript
// Development logging (can be stripped for production)
console.log('[Game]', 'Food spawned:', food.type);
console.warn('[Input]', 'Unknown key pressed:', key);
console.error('[Collision]', 'Invalid state detected');
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. Follow naming conventions exactly (camelCase functions, SCREAMING_SNAKE_CASE constants)
2. Use `{ x, y }` objects for all position data
3. Place ALL tunable values in config.js, never hardcode magic numbers
4. Use named exports, not default exports
5. Pass gameState explicitly to functions that need it

**Anti-Patterns to Avoid:**

| Don't | Do Instead |
|-------|------------|
| `const pos = [5, 10]` | `const pos = { x: 5, y: 10 }` |
| `export default update` | `export function update()` |
| `const speed = 8` in random file | `CONFIG.BASE_SPEED` from config.js |
| `"double quotes"` | `'single quotes'` |
| Global variables | Pass state to functions |

## Project Structure & Boundaries

### Complete Project Directory Structure

```
CrazySnakeLite/
├── index.html                    # Entry point, game container, DOM structure
├── css/
│   └── style.css                 # All styling: game board, phone overlay, menus, retro aesthetic
├── js/
│   ├── main.js                   # Entry point: init canvas, start game loop, wire up modules
│   ├── config.js                 # CONFIG object: all tunable parameters
│   ├── state.js                  # gameState object, createInitialState(), resetGame()
│   ├── game.js                   # Game loop (RAF + fixed timestep), update orchestration
│   ├── snake.js                  # moveSnake(), growSnake(), applyEffect(), getSnakeHead()
│   ├── food.js                   # spawnFood(), selectFoodType(), FOOD_TYPES
│   ├── collision.js              # checkWallCollision(), checkSelfCollision(), checkFoodCollision()
│   ├── effects.js                # applyEffect(), clearEffect(), isEffectActive()
│   ├── phone.js                  # scheduleNextCall(), showPhoneCall(), dismissPhoneCall(), CALLERS
│   ├── input.js                  # initInput(), onAction(), KEY_MAPPINGS
│   ├── render.js                 # renderGame(), renderSnake(), renderFood(), renderGrid(), renderScore()
│   ├── audio.js                  # Web Audio API: initAudio(), playMoveSound(), resumeAudio()
│   └── storage.js                # loadHighScore(), saveHighScore()
├── assets/
│   └── sounds/                   # 14 alternating MP3s (7 states × 2 sounds)
│       ├── move-default-1.mp3 & move-default-2.mp3
│       ├── move-growing-1.mp3 & move-growing-2.mp3
│       ├── move-invicibility-1.mp3 & move-invicibility-2.mp3
│       ├── move-wallphase-1.mp3 & move-wallphase-2.mp3
│       ├── move-speedboost-1.mp3 & move-speedboost-2.mp3
│       ├── move-speeddecrease-1.mp3 & move-speeddecrease-2.mp3
│       └── move-reverse-1.mp3 & move-reverse-2.mp3
└── README.md                     # Setup instructions, local server commands
```

### Module Responsibilities & FR Mapping

| Module | Responsibility | Functional Requirements |
|--------|---------------|------------------------|
| **main.js** | Entry point, initialization, wiring | — |
| **config.js** | All tunable parameters (CONFIG object) | Supports all FRs (no magic numbers) |
| **state.js** | Game state structure, initial state, reset | FR35-FR40 (Session Flow) |
| **game.js** | Game loop, update orchestration, phase transitions | FR1-FR8 (Core Gameplay) |
| **snake.js** | Snake movement, growth, direction changes | FR1-FR3, FR6 |
| **food.js** | Food spawning, type selection, probabilities | FR10-FR24 (Food System) |
| **collision.js** | Wall collision, self collision, food collision | FR4-FR5, FR7, FR11 |
| **effects.js** | Effect application, duration (ends on next food), clearing | FR13-FR20 |
| **phone.js** | Phone call timing, caller selection, overlay control | FR25-FR34 (Phone Mechanic) |
| **input.js** | Keyboard (4 layouts) + touch → actions | FR73-FR80 (Input Controls) |
| **render.js** | Canvas rendering: grid, snake, food, score | FR46-FR58 (UI/Visuals) |
| **audio.js** | Web Audio API: state-based alternating movement sounds, game over melody | FR81-FR89 (Sound Design) |
| **storage.js** | localStorage for high score | FR61 (Top Score) |

### Architectural Boundaries

**Module Communication Flow:**

```
                    ┌─────────────┐
                    │   main.js   │  ← Entry point
                    └──────┬──────┘
                           │ initializes
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ input.js │    │ game.js  │    │ audio.js │
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         │ actions       │ orchestrates  │ sounds
         ▼               ▼               ▼
    ┌─────────────────────────────────────────┐
    │              gameState                   │  ← Single source of truth
    │  (defined in state.js, passed around)   │
    └─────────────────────────────────────────┘
         ▲               ▲               ▲
         │               │               │
    ┌────┴─────┐    ┌────┴─────┐    ┌────┴─────┐
    │ snake.js │    │ food.js  │    │ phone.js │
    └──────────┘    └──────────┘    └──────────┘
         │               │               │
         └───────────────┼───────────────┘
                         ▼
                  ┌──────────┐
                  │render.js │  ← Reads state, draws canvas
                  └──────────┘
```

**Data Flow:**

1. **Input** → `input.js` captures keyboard/touch → emits action
2. **Update** → `game.js` receives action, calls snake/food/collision/effects/phone modules
3. **State** → Modules mutate `gameState` (passed explicitly)
4. **Render** → `render.js` reads `gameState`, draws to canvas
5. **Audio** → `audio.js` plays sound based on snake state

**Boundaries:**

| Boundary | Rule |
|----------|------|
| **State Access** | Only through passed `gameState` parameter |
| **DOM Access** | Only in `main.js` (setup) and `render.js` (canvas) |
| **Phone Overlay** | DOM manipulation only in `phone.js` |
| **localStorage** | Only in `storage.js` |
| **Audio** | Only in `audio.js` |
| **Configuration** | Only in `config.js` (import CONFIG elsewhere) |

### File Contents Overview

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CrazySnakeLite</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="game-container">
    <canvas id="game-canvas"></canvas>
    <div id="score-display"></div>
    <div id="phone-overlay" class="hidden">
      <div class="phone-screen">
        <p class="caller-name"></p>
        <button class="end-button">End</button>
      </div>
    </div>
    <div id="menu-screen">
      <h1>CrazySnakeLite</h1>
      <button id="new-game-btn">New Game</button>
      <button id="high-score-btn">Top Score</button>
    </div>
    <div id="gameover-screen" class="hidden">
      <h2>GAME OVER!</h2>
      <p class="final-score"></p>
      <button id="play-again-btn" class="selected">Play Again</button>
      <button id="menu-btn">Menu</button>
    </div>
  </div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

**style.css sections:**
- Game container layout (centered, responsive)
- Canvas styling (border with purple glow)
- Phone overlay (Nokia aesthetic, blur backdrop)
- Menu screens (retro styling)
- Score display
- Responsive breakpoints for mobile

### Integration Points

**Internal:**
- All modules import from `config.js` for parameters
- All modules receive `gameState` as parameter (no global access)
- `game.js` orchestrates update cycle, calling other modules in sequence
- `render.js` is read-only (never modifies state)

**External (MVP):**
- None (pure client-side, no API calls)

**External (Post-MVP):**
- Analytics service (non-blocking, lazy loaded)

### Development Workflow

**Local Development:**
```bash
# Option 1: Python
cd CrazySnakeLite
python -m http.server 8000
# Open http://localhost:8000

# Option 2: VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

**Deployment:**
```bash
# GitHub Pages
git push origin main
# Enable Pages in repo settings → serves from root

# Netlify/Vercel
# Connect repo → auto-deploys on push
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All architectural decisions work together without conflicts:
- Vanilla JS + ES6 modules provide clean module system
- Single state object + fixed timestep = predictable game behavior
- Layered canvas + DOM overlay = phone mechanic works without affecting game loop
- Input abstraction + game loop = clean separation of concerns

**Pattern Consistency:**
Implementation patterns fully support architectural decisions:
- camelCase naming matches JavaScript conventions
- Named exports enable explicit dependency tracking
- `{ x, y }` position format is consistent across all modules
- CONFIG object centralizes all tunable parameters

**Structure Alignment:**
Project structure directly supports all architectural decisions:
- Each decision maps to specific modules
- Boundaries are clear (state access, DOM access, audio)
- Integration points are well-defined

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
- 99 FRs across 10 categories → All architecturally supported
- FR95-FR99 (Analytics) explicitly deferred to post-MVP

**Non-Functional Requirements Coverage:**
- 46 NFRs across 5 categories → All architecturally supported
- Performance: Fixed timestep + CSS blur ensures 60 FPS
- Browser compatibility: Vanilla JS, no experimental features
- Maintainability: Modular code, configuration-driven

### Implementation Readiness Validation ✅

**Decision Completeness:**
- 5 critical decisions documented with rationale and code examples
- Technology choices are clear (vanilla JS, Canvas, ES6 modules)
- No version management needed (zero dependencies)

**Structure Completeness:**
- 13 JavaScript modules defined with responsibilities
- FR mapping shows which module handles which requirements
- Boundaries table clarifies access rules

**Pattern Completeness:**
- Naming conventions cover JS, CSS, files
- Data formats cover positions, colors, time, directions, food types
- Module patterns cover exports, imports, communication
- Error handling and logging patterns defined

### Gap Analysis Results

**Critical Gaps:** None

**Deferred to Post-MVP:**
- Analytics implementation (FR95-FR99)
- Advanced audio features (spatial audio, dynamic mixing)
- Service worker for offline play

**Implementation-Time Decisions (Resolved):**
- Web Audio API selected over HTML5 Audio for game sound effects (HTML5 Audio caused freezes and sync issues at 8 sounds/second)

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Low)
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped (7 concerns)

**✅ Architectural Decisions**
- [x] Critical decisions documented (5 decisions)
- [x] Technology stack fully specified (vanilla JS, Canvas, ES6)
- [x] Integration patterns defined
- [x] Performance considerations addressed (60 FPS, fixed timestep)

**✅ Implementation Patterns**
- [x] Naming conventions established (JS, CSS, files)
- [x] Data format patterns defined (positions, colors, time, directions)
- [x] Module patterns specified (named exports, explicit state passing)
- [x] Process patterns documented (error handling, logging)

**✅ Project Structure**
- [x] Complete directory structure defined (13 modules)
- [x] Component boundaries established (6 boundaries)
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Zero external dependencies = no supply chain risk, no version conflicts
- Simple, proven patterns = easy for any AI agent to implement consistently
- Complete FR-to-module mapping = clear implementation path
- Fixed timestep + RAF = guaranteed consistent gameplay

**Areas for Future Enhancement:**
- Analytics layer (when ready to gather data)
- Advanced audio features (spatial audio, dynamic mixing via existing Web Audio API foundation)
- PWA/Service Worker (if offline play becomes important)

### Implementation Handoff

**AI Agent Guidelines:**
1. Follow all architectural decisions exactly as documented
2. Use implementation patterns consistently across all components
3. Respect project structure and boundaries
4. Place ALL tunable values in config.js
5. Pass gameState explicitly to functions
6. Use named exports, not default exports

**First Implementation Priority:**
1. Create project file structure (index.html, css/, js/, assets/)
2. Implement config.js with all CONFIG parameters
3. Implement state.js with createInitialState()
4. Implement game.js with game loop (RAF + fixed timestep)
5. Build incrementally: snake → food → collision → effects → phone → audio → menus

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-23
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**Complete Architecture Document**
- All architectural decisions documented with rationale
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**Implementation Ready Foundation**
- 5 core architectural decisions made
- 5 implementation pattern categories defined
- 13 JavaScript modules specified
- 99 functional requirements + 46 non-functional requirements supported

**AI Agent Implementation Guide**
- Technology stack: Vanilla JS, ES6 modules, HTML5 Canvas
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Data format patterns (positions, colors, time, directions)

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible (zero dependencies)
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Code examples are provided for clarity

### Project Success Factors

**Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring consistent understanding of the architectural direction.

**Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**Complete Coverage**
All project requirements are architecturally supported, with clear mapping from PRD requirements to technical implementation.

**Solid Foundation**
Plain HTML/JS/CSS approach provides a simple, dependency-free foundation with zero supply chain risk.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

