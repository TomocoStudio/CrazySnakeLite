---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
v3CompletedAt: '2026-02-15'
v3StartedAt: '2026-02-15'
v3UpdateNotes: 'V3 Evolution: Cognitive Dashboard MVP — 6 core features (metrics engine, post-game highlights, Skill Map, calibration, streaks, comedy integration). 4 new modules, storage layer expansion (IndexedDB), new skillmap phase, local-first with cloud-ready abstraction.'
v2CompletedAt: '2026-02-08'
v1CompletedAt: '2026-01-23'
v2StartedAt: '2026-02-07'
v2UpdatedAt: '2026-02-08'
v2UpdateNotes: 'Added Decision 9 (Cognitive Feedback System), cognitiveStats in gameState, cognitive-feedback.js module, RC SURVIVED flash. Added Decision 10 (Two-Tier Cognitive Tracking & Analytics), analyticsState in gameState, analytics.js module using Plausible custom events API. Aligned thresholds with PRD v2.0 (phone grace score 3, blink start 15, blink cap 60%).'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md'
  - '_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-02-15.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/ux-design-cognitive-dashboard.md'
  - '_bmad-output/planning-artifacts/game-design-food-v2.md'
  - '_bmad-output/planning-artifacts/game-design-phone-calls-v2.md'
  - '_bmad-output/planning-artifacts/game-ux-principles.md'
  - '_bmad-output/planning-artifacts/cognitive-analytics-requirements.md'
  - '_bmad-output/planning-artifacts/dataviz-principles.md'
  - '_bmad-output/planning-artifacts/project-context.md'
workflowType: 'architecture'
project_name: 'CrazySnakeLite'
user_name: 'Tomoco'
date: '2026-02-15'
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
- Scoring System (FR41-FR45): Score = foods eaten (changed from snake length post-release), visual counter
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
- Zero runtime dependencies (Plausible is the sole external script — async, non-blocking)
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
- Unified design system matching all other menus
- Show/hide with class toggle
- Button handles click/tap natively

**Rationale:**
- Native text rendering (crisp caller names)
- Easy responsive scaling for mobile
- Built-in accessibility (button is focusable)
- CSS handles the unified look without pixel-by-pixel drawing

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
    uiPurpleBlue: 'rgb(157, 178, 221)',  // Single purple shade for ALL UI elements
    snake: { /* ... */ },
    food: { /* ... */ }
  },

  // UI Design System
  UI: {
    menuBorderRadius: '12px',  // All menu frames
    buttonBorderRadius: '8px',  // All buttons
    modalBackground: 'rgba(0, 0, 0, 0.6)',  // Transparent modal containers
    overlayBackground: 'rgba(0, 0, 0, 0.8)',  // 80% black overlay behind modals
    buttonInactive: '#000000',  // Black inactive state
    buttonActive: 'rgb(157, 178, 221)',  // Purple-blue active state
    textColor: '#FFFFFF'  // White text always
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
      <h2>GAME OVER</h2>
      <p class="final-score"></p>
      <button id="play-again-btn" class="selected">Play Again</button>
      <button id="menu-btn">Menu</button>
    </div>
  </div>
  <!-- Privacy-friendly analytics by Plausible -->
  <script async src="https://plausible.io/js/pa-5lDK3arREKbPzQ_2_Jhfm.js"></script>
  <script>
    window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
    plausible.init()
  </script>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

**style.css sections:**
- Game container layout (centered, responsive)
- Canvas styling (no border or glow for MVP)
- Phone overlay (unified design: 12px rounded corners, purple-blue borders, transparent bg)
- Menu screens (unified styling: 12px rounded frames, purple-blue borders)
- Score display (12px rounded corners, purple-blue border)
- Buttons (8px rounded corners, black inactive → purple-blue active, scale animations)
- Consistent double-border pattern (main border + box-shadow outer layer)
- 80% black overlays behind all modals
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
- Zero runtime dependencies (Plausible is async/non-blocking, game functions without it)
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

---

# V2 Architecture Evolution — Food v2 + Phone Calls v2

_This section extends the v1 architecture with decisions for the three new game systems: Fibonacci Scoring & Progressive Complexity (Food v2), Phone Call Pick Up vs End Enhancement (Phone Calls v2), and their unified UX specification._

_V2 evolution started: 2026-02-07_

---

## V2 Project Context Analysis

### New Design Inputs

Three new design documents drive this architecture evolution:

1. **game-design-food-v2.md** — Fibonacci scoring (0 to +8 per food type), progressive blinking food (score 15+), combo mode with multiplicative scoring (score 40+)
2. **game-design-phone-calls-v2.md** — Two-button phone overlay (End vs Pick Up), Fibonacci Pick Up bonus escalation (+2 to +34), score-based call frequency tiers, caller portraits + one-liners, variable Pick Up timer (1-3s)
3. **ux-design-food-phone-v2.md** — Pixel-perfect UX specifications for all v2 visual systems: score popups, blinking food, combo mode visuals, phone overlay redesign, cross-system interaction rules, accessibility/reduced motion

### New Functional Requirements Summary

**Food v2 System:**
- Fibonacci scoring: Invincibility=0, Growing=+1, SpeedDecrease=+2, WallPhase=+1/+3 (conditional), SpeedBoost=+5, ReverseControls=+8
- Score popup system: 5 visual tiers with escalating salience (size, color, bounce, glow, particles, screen shake)
- Progressive blinking food: 0% at score 0-14, escalating to 60% at score 80+
- Color cycling animation: 200ms per color through all 6 food colors, effect locked at spawn but hidden
- Food shadow system: 2px drop shadow for spatial anchoring during color cycling
- First-time tooltip: "Mystery Food!" at score 15
- Combo mode: Probability-based activation (10% at score 40, capping at 50% at score 120+)
- Canvas background color transitions: 500ms fade to random dark color (4 options)
- Striped snake rendering: Alternating segment colors for Effect A / Effect B
- Conditional segment borders: 1px black when adjacent colors are similar
- Multiplicative scoring: Effect A score × Effect B score
- Combo lifecycle: Activate → eat food B (stripe + multiply) → eat food C (exit combo)

**Phone Calls v2 System:**
- Two-button overlay: End (Space, +1 flat) and Pick Up (Enter, Fibonacci bonus)
- Fibonacci Pick Up bonus: [+2, +3, +5, +8, +13, +21, +34] per consecutive pickup per game, capped at +34
- Score-based grace period: No calls until score >= 3
- Score-based call frequency: 5 tiers from relaxed (12-20s at score 3) to relentless (4-8s at score 100+)
- Variable Pick Up timer: 1-3s random blur duration with countdown bar
- Caller personality: 21 callers with name, portrait (64x64 pixel art), and one-liner (revealed only on Pick Up)
- Pick Up irreversibility: Cannot End once committed to Pick Up
- Consolation reward: Pick Up bonus awarded even on death during blur
- Portrait fallback: Generic phone icon if portrait asset missing

**Cross-System Interaction Rules:**
- Combo timer pauses when phone overlay is active; resumes after dismissal with full state preserved
- Visual feedback priority: Phone overlay (z:400) > Score popups (z:200) > Tooltips (z:300) > Canvas
- Popup stagger: 300ms delay when multiple popups fire within 500ms
- Combo canvas transition delays 200ms when phone overlay is active
- Death during combo + Pick Up: Both combo multiplier and Pick Up consolation bonus awarded and stacked
- Phone bonus popup uses "CALL BONUS" label to distinguish from food/combo popups

**Accessibility:**
- Reduced motion mode: Detect `prefers-reduced-motion`, slow blinking to 500ms or use alpha pulse, disable screen shake, simplify popup animations
- Color blindness consideration: Optional shape coding for food types (post-launch enhancement)

### V2 Scale & Complexity Assessment

- **Complexity level:** Medium (up from Low in v1) — three interlocking systems with cross-system interaction rules
- **Primary domain:** Browser-based Canvas game (SPA) — unchanged
- **New/modified architectural components:** 10+ modules affected (3 new, 7+ evolved)
- **New cross-cutting concerns:**
  1. Score-based progression engine (all systems query score thresholds)
  2. Visual feedback priority queue (popup stagger, transition delays)
  3. Dual-effect state tracking (combo mode Effect A + Effect B)
  4. DOM popup lifecycle management (spawn, animate, queue, cleanup)
  5. Accessibility / reduced motion mode

### V1 Foundations That Hold

| V1 Decision | V2 Status | Notes |
|-------------|-----------|-------|
| Fixed timestep + RAF game loop | **Holds** | No change needed |
| Vanilla JS + ES6 modules | **Holds** | No change needed |
| Canvas for game + DOM for overlays | **Holds** | Popups and phone are DOM; game canvas unchanged |
| Single gameState object | **Holds, extends** | New fields for combo, phone v2, blinking food |
| Config-driven parameters | **Holds, expands massively** | Fibonacci values, thresholds, tiers, colors |
| Named exports + explicit state passing | **Holds** | Same pattern for new modules |
| camelCase functions, SCREAMING_SNAKE_CASE constants | **Holds** | Same conventions |
| { x, y } positions, hex colors, ms time values | **Holds** | Same data formats |

### What Breaks in V1

| V1 Assumption | V2 Reality | Architectural Impact |
|---------------|-----------|---------------------|
| Single active effect | Combo mode requires dual effects (A + B) | Effect system needs combo-aware extension |
| Flat +1 scoring (score = length - start) | Fibonacci scoring (0 to +8 per food) + phone bonuses + combo multipliers | Score pipeline becomes `(foodType, context) → value`, not implicit from length |
| Static food rendering | Blinking food needs frame-aware color cycling | Render.js needs time/frame awareness for food |
| Simple phone dismiss (Space → gone) | Two-button decision, Pick Up timer, countdown bar, portraits, one-liners | phone.js near-complete rewrite |
| Fixed phone call intervals (15-45s) | Score-based 5-tier frequency + grace period | Phone scheduling delegates to progression engine |
| Single snake color | Combo striped snake (alternating A/B colors) + conditional borders | Render.js snake drawing gains combo path |
| No score popups | 5-tier popup system with particles and screen shake | Entirely new DOM overlay system needed |
| No canvas background changes | Combo mode dark canvas with 500ms fade transition | Canvas background becomes dynamic state |

### New Module Map (Party Mode Consensus)

**New modules identified by team review (Winston, Sally, Amelia, Murat):**

| New Module | Responsibility | Architectural Pattern |
|------------|---------------|----------------------|
| `progression.js` | Score → tier resolution for all systems (phone tiers, blink probability, combo probability) | Pure function, no state — single source of truth for all score-based thresholds |
| `combo.js` | Combo state machine: activation, dual-effect tracking, multiplicative scoring, canvas transitions, pause/resume during phone | Owns `gameState.combo`, calls into effects.js, coordinates with game.js |
| `score-popup.js` | DOM popup lifecycle: spawn at coordinates, CSS animation, queue/stagger, particles, screen shake, cleanup | Pure UI — receives values and coordinates, no game logic |

**Significantly evolved modules:**

| Evolved Module | Key V2 Changes |
|----------------|----------------|
| `phone.js` | Near-rewrite: two-button UI, Pick Up timer + countdown bar, Fibonacci bonus calc, portrait/one-liner display, callerData objects, score-based scheduling via progression.js |
| `render.js` | Blinking food color cycling (frame-aware), striped snake rendering (combo), conditional segment borders, combo canvas background color, food drop shadows |
| `config.js` | Massive expansion: Fibonacci score values, PHONE_CALL_TIERS, PHONE_PICKUP_FIBONACCI, blinking thresholds, combo thresholds, combo canvas colors, popup specs |
| `state.js` | Extended gameState: combo object, phone v2 fields (pickedUp, pickUpEndTime, pickUpBonus, pickUpCount, graceActive), blinkingFood tracking |
| `game.js` | Cross-system orchestration: combo↔phone pause/resume coordination, popup triggering, progression state queries. **Hard rule:** all orchestration logic MUST be organized into named handler functions: `onFoodEaten()`, `onPhoneCallShow()`, `onPhoneCallDismiss()`, `onDeath()`. The game loop itself stays thin — it only calls these handlers. No inline orchestration logic in the loop body. |
| `food.js` | Blinking determination at spawn (queries progression.js), foodType → Fibonacci score value mapping, Wall Phase conditional scoring context |
| `input.js` | Enter key binding for Pick Up |
| `effects.js` | Wall Phase usage tracking (wallPhaseUsed boolean for +1/+3 conditional scoring) |
| `audio.js` | New score sounds (Fibonacci musical progression: C-D-E-G-chord), combo entrance/exit sounds, phone ring/click sounds |

### Cross-System Coordination Pattern

**Guard clause coordination (not event bus):**
- Modules expose read-only state queries: `combo.isComboActive()`, `phone.isPhoneActive()`, `phone.isPickUpActive()`
- Acting modules check guards before proceeding (e.g., check phone active before combo canvas transition)
- `game.js` orchestrates explicit coordination calls: phone activates → `combo.pauseTimer()`, phone dismisses → `combo.resumeTimer()`
- Popup system checks `lastPopupTime` before spawning (300ms stagger)

**Rationale:** Guard clauses are simpler, more testable, and more debuggable than event systems for this scale of cross-system interaction. Each coordination rule maps to one `if` check in one location.

### Combo-Paused Food Eating Semantics (Invariant)

**Rule:** When `combo.paused === true` (phone overlay is active), the combo lifecycle **freezes entirely**. If the snake eats food while combo is paused, that food scores normally (non-combo path) and does NOT advance the combo state machine.

**Implementation:** `combo.isActive(gameState)` MUST return `false` when `gameState.combo.active === true && gameState.combo.paused === true`. The check is: `return gameState.combo.active && !gameState.combo.paused`.

**Rationale:** This respects Celia's cognitive pause philosophy — at score 40-60, combos are being *learned*. Forcing the player to track combo lifecycle while managing a phone call blur exceeds working memory limits. The pause means "combo is on hold, everything else is normal until the phone resolves." After phone dismissal, `combo.resume()` restores `paused = false` and the combo lifecycle picks up where it left off.

**Edge case sequence:**
1. Player in combo `waitingForB`, phone call fires → combo pauses
2. Player picks up (1-3s blur), snake eats food during blur
3. Food scores normally via `scoring.calculateFoodScore()` (non-combo path, because `combo.isActive()` returns `false`)
4. Phone timer expires → combo resumes → next food eaten advances combo to `waitingForB` → `waitingForExit` normally

### Wall Phase Conditional Scoring (Edge Case)

Wall Phase food scores +1 by default, +3 if the player actively phases through a wall during the effect. This means the scoring pipeline is not purely `foodType → fixedValue`. It becomes `(foodType, context) → score`.

**Architectural implication:** `effects.js` tracks a `wallPhaseUsed` boolean in `gameState.effects.wallPhaseUsed`. When the next food is eaten, the scoring function checks: was Wall Phase active AND was the wall actually used? If yes → +3. If no → +1.

**Reset Sequence (Invariant):** When food is eaten, the following operations execute in this exact order:
1. **Read** `gameState.effects.wallPhaseUsed` (scoring function consumes it)
2. **Score** the food via `scoring.calculateFoodScore(foodType, wallPhaseUsed)`
3. **Clear** the current effect via `effects.clearEffect(gameState)`
4. **Reset** `gameState.effects.wallPhaseUsed = false`
5. **Apply** the new food's effect via `effects.applyEffect(gameState, newFoodType)`

This ordering guarantees the scoring function reads `wallPhaseUsed` before it resets, and the reset happens before the next effect applies. The boolean never carries over between food cycles.

---

## V2 Starter Template Evaluation

### Stack Confirmation: No Change

The v1 technology stack holds for v2. The three new design documents were explicitly designed for this stack:

| Aspect | V1 Decision | V2 Status |
|--------|------------|-----------|
| **Language** | Vanilla JavaScript (ES6+) | **Confirmed** — no framework needed |
| **Rendering** | HTML5 Canvas + DOM overlays | **Confirmed** — popups/phone are DOM, game is Canvas |
| **Styling** | Plain CSS | **Confirmed** — all v2 animations use CSS @keyframes and transitions |
| **Build** | None — direct file serving | **Confirmed** — zero-dependency deployment preserved |
| **Modules** | ES6 modules (`type="module"`) | **Confirmed** — new modules follow same pattern |
| **Dependencies** | Zero runtime | **Confirmed** — Plausible is the sole external script (async, non-blocking, graceful degradation if absent) |

**Rationale:** The v2 UX specification was designed for CSS animations (popup keyframes, canvas transitions, particle effects). The combo state machine and progression engine are pure logic. The phone overlay redesign is DOM manipulation. Nothing in v2 requires or benefits from a framework. The zero-dependency deployment story is a feature.

### CSS Organization Strategy

V2 adds ~200-300 lines of CSS (popup tiers, particles, combo effects, phone redesign, reduced motion). Organized with clear comment sections:

```css
/* === Score Popups === */
/* === Particles === */
/* === Combo Mode === */
/* === Phone v2 === */
/* === Reduced Motion === */
```

**CSS Custom Properties for Reduced Motion:**
Use CSS custom properties for animation durations (`--popup-duration`, `--transition-speed`). Override to `0ms` in `prefers-reduced-motion` media query. Keeps the motion toggle architectural rather than scattered across individual rules.

### DOM Popup Cleanup Pattern

Ephemeral DOM elements (score popups, particles) use `animationend` event listeners for cleanup instead of hardcoded `setTimeout` durations:

```javascript
popup.addEventListener('animationend', () => popup.remove());
```

This is robust against animation duration changes and prevents DOM node leaks.

### V2 Audio Architecture

**Decision: All pre-recorded MP3s. No synthesis.**

All v2 sounds are provided as MP3 asset files. The `audio.js` module extends the v1 pattern (fetch → decodeAudioData → AudioBufferSourceNode.start()) for all new sounds. Tomoco provides all sound files.

**Audio Priority System:**

V2 introduces concurrent sound sources (movement + score + combo + phone ring). An audio priority system prevents perceptual mud:

| Priority | Sound Category | Behavior |
|----------|---------------|----------|
| 1 (highest) | Combo jackpot/legendary | Suppresses movement sounds for 600-800ms |
| 2 | Score sounds (+5, +8) | Suppresses movement sounds for duration |
| 3 | Combo entrance/exit | Suppresses movement sounds briefly |
| 4 | Phone ring | Plays under everything (lower volume, ambient) |
| 5 | Score sounds (+1, +2, +3) | Plays alongside movement, brief overlap OK |
| 6 (lowest) | Movement sounds | Suppressed when higher priority sound fires |

Implementation: Simple `currentPriority` tracker in `audio.js`. When a high-priority sound fires, set a suppression window. Movement sounds check this before playing. ~15 lines of logic.

**Phone Ring Lifecycle:**
- Ring loop plays while phone overlay is visible (incoming state)
- Ring stops instantly on End or Pick Up
- No ring during Pick Up countdown (1-3s blur) — silence or ambient tension
- Ring is "incoming call" state audio; Pick Up transitions to "active call" state (no ring)

**Pre-load Strategy:**
- **All 27 audio files pre-loaded at init** (~1.3MB total at <50KB each). Same as v1 pattern. Preserves <200ms temporal contiguity for score sounds.
- **Portraits loaded on-demand** per call via `<img>` tag. `onerror` fallback to generic phone icon. No pre-loading.

**Post-launch optimization path (not required for MVP):** If mobile load times exceed the 3-second budget on slower connections, consider tiered audio loading: (1) v1 movement sounds + gameover at init (essential for first game), (2) score sounds + phone sounds lazy-loaded after first frame renders (needed by score 1 and score 5 respectively), (3) combo sounds lazy-loaded after score 30 (not needed until score 40). This preserves temporal contiguity for each sound category while reducing initial payload. The `audio.js` module's existing `fetch → decodeAudioData` pattern naturally supports deferred loading — no architectural change needed, only scheduling logic.

**Graceful Asset Degradation:**
- Missing sound file → silent skip (no crash, no error visible to player)
- Missing portrait → fallback to `assets/PhoneIcone01_256px.png` via `onerror`
- Game is always playable regardless of missing assets

### V2 Asset Directory Structure

```
assets/
├── sounds/
│   ├── move-default-1.mp3 & move-default-2.mp3       (existing v1)
│   ├── move-growing-1.mp3 & move-growing-2.mp3       (existing v1)
│   ├── move-invicibility-1.mp3 & move-invicibility-2.mp3 (existing v1)
│   ├── move-wallphase-1.mp3 & move-wallphase-2.mp3   (existing v1)
│   ├── move-speedboost-1.mp3 & move-speedboost-2.mp3 (existing v1)
│   ├── move-speeddecrease-1.mp3 & move-speeddecrease-2.mp3 (existing v1)
│   ├── move-reverse-1.mp3 & move-reverse-2.mp3       (existing v1)
│   ├── gameover.mp3                                    (existing v1)
│   ├── score-1.mp3                                     (new: Growing food)
│   ├── score-2.mp3                                     (new: Speed Decrease food)
│   ├── score-3.mp3                                     (new: Wall Phase active use)
│   ├── score-5.mp3                                     (new: Speed Boost food)
│   ├── score-8.mp3                                     (new: Reverse Controls food)
│   ├── combo-entrance.mp3                              (new: combo activates)
│   ├── combo-exit.mp3                                  (new: combo ends)
│   ├── combo-jackpot.mp3                               (new: 15+ point combo)
│   ├── combo-legendary.mp3                             (new: 30+ point combo)
│   ├── phone-ring.mp3                                  (new: incoming call loop)
│   ├── phone-pickup.mp3                                (new: Pick Up click)
│   └── phone-end.mp3                                   (new: End click)
├── callers/
│   ├── al-gorithm.png                                  (new: 64x64 pixel art)
│   ├── meg-a-byte.png
│   ├── ali-sing.png
│   ├── anna-log.png
│   ├── ray-tracing.png
│   ├── pat-ch-notes.png
│   ├── mac-address.png
│   ├── artie-ficial.png
│   ├── floppy-phil.png
│   ├── dot-matrix.png
│   ├── gia-hertz.png
│   ├── terry-byte.png
│   ├── perry-pheral.png
│   ├── cade-ridger.png
│   ├── mona-tor.png
│   ├── syd-ram.png
│   ├── bessie-ios.png
│   ├── dee-frag.png
│   ├── buffy-ring.png
│   ├── dj-snake.png
│   └── game-over.png
└── PhoneIcone01_256px.png                              (existing: portrait fallback)
```

**Total assets:** 27 audio files + 21 portrait PNGs + 1 fallback icon = **49 files**

### Test Runner Consideration (Deferred)

V2's cross-system integration complexity (combo + phone + blinking food interactions) may warrant upgrading from manual browser testing to a CLI test runner (Vitest or similar). This decision is deferred to the Test Architect workflow. The runtime architecture is unaffected — test tooling is a dev-time concern, not a deployment concern.

---

## V2 Core Architectural Decisions

### Decision Priority Analysis

**All 10 Critical Decisions — Made:**

| # | Decision | Choice | Key Principle |
|---|----------|--------|---------------|
| 1 | Scoring Pipeline Architecture | Centralized `scoring.js` — pure calculation, no side effects | Single place to audit the scoring economy |
| 2 | Combo Mode State Machine | Combo wraps normal flow — `game.js` delegates to `combo.js` | Self-contained, testable state machine |
| 3 | Phone Call v2 State Machine | `phone.js` owns everything (DOM + logic + timer) | One module, one system |
| 4 | Extended gameState Structure | Confirmed structure; `snake.color` unchanged — combo colors derived at render time | Render derives, state doesn't duplicate |
| 5 | Score Popup System | `scoring.js` returns value, `game.js` triggers popup | Scoring stays pure, orchestrator triggers UI |
| 6 | Blinking Food Integration | `game.js` updates `food.blinkCycleIndex`, render reads state | State-driven rendering, consistent with v1 |
| 7 | Cross-System Orchestration | Rules in `game.js` as orchestrator — guard clauses, not event bus | Rules live where they're enforced |
| 8 | Progression Engine | Thresholds in `config.js`, resolution logic in `progression.js` | Tunable data separated from lookup logic |
| 9 | Cognitive Feedback System | Stats tracked in `game.js` handlers, display in `cognitive-feedback.js`, RC SURVIVED flash via `score-popup.js` | Track at source, display as pure UI |
| 10 | Two-Tier Cognitive Tracking | `cognitiveStats` (player-facing achievements) + `analyticsState` (internal denominators/timestamps) → `analytics.js` | Rates need numerators AND denominators |

**Deferred Decisions:**
- Test runner upgrade (deferred to Test Architect workflow)
- Color-blind shape coding for food (post-launch enhancement)
- Haptic feedback on mobile (post-launch enhancement)
- ~~Analytics tool selection~~ — **Plausible** selected (privacy-first, cookie-free, GDPR-compliant by default)

### Decision 1: Scoring Pipeline Architecture

**Decision:** Centralized `scoring.js` module — pure calculation functions, no side effects, no DOM awareness.

**Rationale:** The scoring economy is the beating heart of Celia's game design. Three scoring sources (food Fibonacci, combo multiplier, phone bonuses) all carefully balanced. Having one module where the full economy is visible at a glance is essential for auditing and tuning.

**API Surface:**

```javascript
// scoring.js — Pure calculation, no side effects

export function calculateFoodScore(foodType, wallPhaseUsed) {
  // Returns Fibonacci value: 0, 1, 2, 1|3, 5, or 8
  // Wall Phase: returns 3 if wallPhaseUsed === true, else 1
}

export function calculateComboScore(effectA, effectB) {
  // Returns effectA.scoreValue × effectB.scoreValue
}

export function calculatePhoneBonus(action, pickUpCount) {
  // action === 'end' → returns CONFIG.PHONE_END_BONUS (1)
  // action === 'pickup' → returns CONFIG.PHONE_PICKUP_FIBONACCI[pickUpCount] (capped at 34)
}
```

**Score Values (from config.js):**

| Food Type | Fibonacci Value | Condition |
|-----------|----------------|-----------|
| Invincibility | 0 | Always |
| Growing | +1 | Always |
| Speed Decrease | +2 | Always |
| Wall Phase | +1 / +3 | +1 default, +3 if wall was actively phased through |
| Speed Boost | +5 | Always |
| Reverse Controls | +8 | Always |

**Integration:** `game.js` calls scoring functions, receives values, triggers popup via `score-popup.js`, updates `gameState.score`. Scoring has no knowledge of popups or DOM.

### Decision 2: Combo Mode State Machine

**Decision:** Combo wraps the normal food consumption flow. `game.js` checks `combo.active` — if true, delegates to `combo.handleFoodEaten()` which manages the full lifecycle internally.

**Rationale:** Combo is a meta-state that wraps around normal effect/scoring cycles. By making combo.js a self-contained state machine that game.js delegates to, the combo logic is isolated, testable, and doesn't leak into other modules.

**State Machine Phases:**

```
inactive → waitingForB → waitingForExit → inactive
```

- `inactive` → `waitingForB`: RNG triggers combo after food eaten. Effect A stored. Canvas transitions to dark color. Combo entrance audio plays.
- `waitingForB` → `waitingForExit`: Next food eaten. Effect B stored. Score = A × B (multiplicative, via scoring.js). Snake becomes striped. Combo score popup spawned by game.js.
- `waitingForExit` → `inactive`: Third food eaten. Combo exits. Canvas transitions back to #E8E8E8. Third food scores normally. Combo exit audio plays.

**Combo State:**

```javascript
gameState.combo = {
  active: false,
  phase: 'inactive',          // 'inactive' | 'waitingForB' | 'waitingForExit'
  effectA: null,               // { type, scoreValue }
  effectB: null,               // { type, scoreValue }
  canvasColor: null,           // '#4A148C', '#0D47A1', '#B71C1C', or '#1B5E20'
  paused: false                // true when phone overlay active
}
```

**API Surface:**

```javascript
// combo.js

export function handleFoodEaten(gameState, foodType) {
  // Routes to appropriate phase handler
  // Manages effectA/B storage, scoring delegation, phase transitions
  // Returns { value, label } for game.js to trigger popup
}

export function activate(gameState, effectType, scoreValue) {
  // Sets phase to 'waitingForB', stores effectA, picks canvas color
}

export function pause(gameState) {
  // Sets paused = true (called when phone overlay appears)
}

export function resume(gameState) {
  // Sets paused = false (called when phone overlay dismisses)
}

export function isActive(gameState) {
  // Returns gameState.combo.active && !gameState.combo.paused
  // IMPORTANT: A paused combo is NOT active for food-eating purposes.
  // Food eaten while combo is paused scores normally (non-combo path).
  // See "Combo-Paused Food Eating Semantics" invariant above.
}
```

**Canvas Transition:** combo.js sets `gameState.combo.canvasColor`. Render.js reads it and applies CSS transition on the canvas background. combo.js checks `phoneCall.active` before transitioning — if phone is active, delays transition by 200ms (guard clause).

### Decision 3: Phone Call v2 State Machine

**Decision:** `phone.js` owns everything — DOM manipulation, state machine logic, Pick Up timer, countdown bar, portrait display, one-liner reveal. One module, one system.

**Rationale:** The phone call experience is one cohesive system. Splitting DOM from logic would create coordination overhead between two modules for no clear benefit. phone.js is well-organized internally with grouped functions.

**State Machine Flow:**

```
Idle → Ringing → [End | Pick Up]
                    │         │
                    │         └→ PickedUp → [Timer Expires | Death]
                    │                          │              │
                    │                          ▼              ▼
                    └──────────────────→ Dismissed ←── Consolation
```

**Phone v2 State:**

```javascript
gameState.phoneCall = {
  active: false,
  caller: null,
  callerData: null,           // { name, portrait, line }
  nextCallTime: 0,
  pickedUp: false,
  pickUpEndTime: 0,
  pickUpBonus: 0,
  pickUpCount: 0,             // Resets on new game
  graceActive: true           // No calls until score >= PHONE_GRACE_SCORE
}
```

**Scheduling:** phone.js queries `progression.getState(score).phoneTier` for current `{ minDelay, maxDelay }`. No duplicate threshold logic.

**Caller Data Structure (in phone.js):**

```javascript
const CALLERS = [
  { name: 'Al Gorithm', portrait: 'callers/al-gorithm.png', line: 'Have you tried sorting your life out?' },
  // ... 21 callers total
];
```

**Internal Organization:**
- Scheduling functions: `scheduleNextCall()`, `shouldTriggerCall()`
- State machine functions: `showCall()`, `endCall()`, `pickUpCall()`, `dismissCall()`
- Timer functions: `startPickUpTimer()`, `updatePickUpTimer()`
- DOM functions: `renderOverlay()`, `showCountdownBar()`, `updatePortrait()`, `revealOneLiner()`

### Decision 4: Extended gameState Structure

**Decision:** Full v2 state structure confirmed. `snake.color` remains a single string — combo stripe colors are derived at render time from `combo.effectA/B.type`.

**Complete V2 gameState:**

```javascript
const gameState = {
  // === V1 (unchanged) ===
  phase: 'menu',
  isPaused: false,

  snake: {
    segments: [{ x, y }, ...],
    direction: 'right',
    nextDirection: 'right',
    color: '#000000'
  },

  food: {
    position: { x, y },
    type: 'growing',
    isBlinking: false,            // V2
    hiddenType: null,             // V2: actual type if blinking
    blinkCycleIndex: 0            // V2: current color in cycle (0-5)
  },

  activeEffect: null,

  score: 0,
  highScore: 0,

  // === V1 phoneCall (extended for V2) ===
  phoneCall: {
    active: false,
    caller: null,
    callerData: null,
    nextCallTime: 0,
    pickedUp: false,
    pickUpEndTime: 0,
    pickUpBonus: 0,
    pickUpCount: 0,
    graceActive: true
  },

  // === V2 NEW ===
  combo: {
    active: false,
    phase: 'inactive',
    effectA: null,
    effectB: null,
    canvasColor: null,
    paused: false
  },

  effects: {
    wallPhaseUsed: false
  },

  cognitiveStats: {
    rcSurvived: 0,            // Times player survived Reverse Controls (ate next food without dying)
    phoneCallsManaged: 0,     // Total phone calls answered (End or Pick Up)
    mysteryFoodsEaten: 0,     // Blinking food items consumed
    comboMultipliers: 0,      // Combo multiplier scores earned
    pickUpStreak: 0,          // Consecutive Pick Ups this game (resets on End)
    peakComboScore: 0         // Highest single combo multiplier result
  },

  ui: {
    mysteryFoodTooltipShown: false,
    lastPopupTime: 0
  },

  // === TIER 2: Internal analytics tracking (NOT player-facing) ===
  // Provides denominators, timestamps, and distributions for
  // Celia's 7 cognitive validation questions.
  // Only consumed by analytics.js — never displayed to player.
  analyticsState: {
    // --- Denominators (for rate calculations) ---
    totalPhoneCalls: 0,              // Q2: denominator for Pick Up rate
    totalPickUps: 0,                 // Q2: numerator for Pick Up rate
    totalEnds: 0,                    // Q2: numerator for End count
    totalBlinkingFoodsSpawned: 0,    // Q3: denominator for blink eat rate
    totalCombosTriggered: 0,         // Q4: denominator for combo completion rate
    comboPhoneOverlaps: 0,           // Q4: times phone rang during active combo
    comboPhoneOverlapSurvived: 0,    // Q4: survived phone during active combo
    totalRCFoodsEaten: 0,            // Q5: denominator for RC survival rate

    // --- Distributions (for histograms / analysis) ---
    comboScores: [],                 // Q4: all combo multiplier results this game
    milestonesReached: [],           // Q1: score milestones hit this game [3, 15, 40, 60, 100]

    // --- Timestamps (for temporal calculations at event fire) ---
    phoneCallShowTime: 0,            // Q2: when current call appeared (reaction time = dismiss - show)
    pickUpCompletionTime: 0,         // Q7: when Pick Up countdown ended (dwell = dismiss - completion)
    foodSpawnTime: 0,                // Q3: when current food spawned (time-to-eat = eat - spawn)
    rcActivationTick: 0,             // Q5: game tick when RC food was eaten (ticks survived = current - activation)
    cognitiveStatsShownTime: 0       // Q6: when "Your Brain Today" appeared (dwell = Play Again - shown)
  }
};
```

**Reset Rules (state.js):**
- On new game: ALL v2 fields reset. `phoneCall.pickUpCount` → 0. `combo` → inactive. `ui.mysteryFoodTooltipShown` → false. `cognitiveStats` → all zeros. `analyticsState` → all zeros/empty arrays.
- On Play Again: Same full reset.
- **Important:** `analytics.js` fires `trackGameOver()` with the full `analyticsState` snapshot BEFORE reset occurs.

### Decision 5: Score Popup System Architecture

**Decision:** `scoring.js` returns values (pure calculation). `game.js` triggers `score-popup.js` (orchestrator pattern). `score-popup.js` is pure UI — no game logic.

**API Surface:**

```javascript
// score-popup.js — Pure UI module

export function spawnPopup(value, gridX, gridY, label = '') {
  // Creates DOM element with appropriate CSS class for tier
  // Positions at grid coordinates (converted to pixels)
  // Applies CSS animation
  // Listens for 'animationend' → removes element
  // Checks lastPopupTime for 300ms stagger
  // label: '' for food, 'COMBO' for combo, 'CALL BONUS' for phone
}

export function spawnParticles(gridX, gridY) {
  // Creates 5-7 particle DOM elements for +8 scores
  // Radial spread pattern using CSS custom properties
  // Self-cleaning via animationend
}

export function triggerScreenShake() {
  // Applies CSS animation to #game-container
  // 3px horizontal shake, 200ms duration
  // Self-cleaning via timeout
}
```

**Popup Tier Mapping (derived from value):**

| Value | CSS Class | Visual Tier |
|-------|-----------|-------------|
| 1 | `score-popup-1` | Small white, 500ms |
| 2 | `score-popup-2` | Small green, 600ms |
| 3 | `score-popup-3` | Medium gold, bounce, 700ms |
| 5 | `score-popup-5` | Large orange, glow, 800ms |
| 8 | `score-popup-8` | XL red-gold, bounce+rotate+glow, particles+shake, 1000ms |
| Phone bonus | `score-popup-phone` | Medium gold, 800ms, "CALL BONUS" label |
| Combo result | Tier based on value | Uses standard tier for calculated value |

**Coordinate Conversion:** `score-popup.js` uses a `gridToPixel(x, y)` utility to convert grid coordinates to DOM pixel positions. Lives in `score-popup.js` as an internal helper (only this module needs it for positioning).

**Implementation rule:** `gridToPixel` MUST use `canvas.getBoundingClientRect()` at call time to determine the canvas's actual screen position, then compute: `pixelX = rect.left + (gridX * CONFIG.UNIT_SIZE) + (CONFIG.UNIT_SIZE / 2)` and equivalent for Y. Do NOT assume static canvas positioning or use hardcoded offsets — the canvas may be centered, responsive-resized, or scrolled. `getBoundingClientRect()` accounts for all CSS layout, transforms, and scroll offset automatically.

**300ms Stagger Rule:** `score-popup.js` tracks `gameState.ui.lastPopupTime`. Before spawning, checks if 300ms have elapsed since last popup. If not, delays via `setTimeout`. Prevents visual collision when combo + phone popups fire near-simultaneously.

### Decision 6: Blinking Food Integration

**Decision:** State-driven rendering. `game.js` updates `food.blinkCycleIndex` each frame. `render.js` reads the index and draws the corresponding color. Consistent with v1's "render reads state, never computes" principle.

**Spawn-Time Logic (food.js):**

```javascript
export function spawnFood(gameState) {
  // ... existing spawn logic ...
  const progression = getState(gameState.score);
  const shouldBlink = Math.random() < progression.blinkProbability;

  gameState.food.isBlinking = shouldBlink;
  gameState.food.hiddenType = shouldBlink ? gameState.food.type : null;
  gameState.food.blinkCycleIndex = 0;
}
```

**Frame Update (game.js):**

```javascript
// Each frame, if food is blinking, update cycle index
if (gameState.food.isBlinking) {
  gameState.food.blinkCycleIndex = Math.floor(Date.now() / 200) % 6;
}
```

**Render Logic (render.js):**

```javascript
function renderFood(ctx, gameState) {
  if (gameState.food.isBlinking) {
    const color = BLINK_SEQUENCE[gameState.food.blinkCycleIndex];
    // Draw with cycling color + 2px drop shadow
    drawFoodWithShadow(ctx, gameState.food.position, color);
  } else {
    // Draw with actual food type color (existing v1 logic)
    drawFood(ctx, gameState.food.position, gameState.food.type);
  }
}
```

**Reduced Motion:** If `prefers-reduced-motion` detected, cycle speed slows to 500ms (`Math.floor(Date.now() / 500) % 6`) or uses alpha pulse instead of color cycling.

### Decision 7: Cross-System Orchestration

**Decision:** Coordination rules live in `game.js` as the orchestrator. Guard clauses, not event bus. Each rule is 2-3 lines in one clear location.

**Orchestration Points in game.js:**

```javascript
// Phone call appears:
function onPhoneCallShow(gameState) {
  phone.showCall(gameState);
  if (gameState.combo.active) {
    combo.pause(gameState);
  }
}

// Phone call resolves (End or Pick Up timer expires):
function onPhoneCallDismiss(gameState, action) {
  const bonus = scoring.calculatePhoneBonus(action, gameState.phoneCall.pickUpCount);
  gameState.score += bonus;
  if (bonus > 0) {
    scorePopup.spawnPopup(bonus, /* center x */, /* center y */,
      action === 'pickup' ? 'CALL BONUS' : '');
  }
  phone.dismissCall(gameState);
  if (gameState.combo.active) {
    combo.resume(gameState);
  }
}

// Food eaten:
function onFoodEaten(gameState) {
  if (gameState.combo.active) {
    const result = combo.handleFoodEaten(gameState);
    gameState.score += result.value;
    scorePopup.spawnPopup(result.value, gameState.food.position.x,
      gameState.food.position.y, result.label);
    if (result.value >= 8) {
      scorePopup.spawnParticles(gameState.food.position.x, gameState.food.position.y);
      scorePopup.triggerScreenShake();
    }
  } else {
    const value = scoring.calculateFoodScore(gameState.food.type,
      gameState.effects.wallPhaseUsed);
    gameState.score += value;
    scorePopup.spawnPopup(value, gameState.food.position.x,
      gameState.food.position.y);
    if (value >= 8) {
      scorePopup.spawnParticles(gameState.food.position.x, gameState.food.position.y);
      scorePopup.triggerScreenShake();
    }
    // Check combo trigger
    const progression = getState(gameState.score);
    if (Math.random() < progression.comboProbability) {
      combo.activate(gameState, gameState.food.type, value);
    }
  }
}

// Death:
function onDeath(gameState) {
  let deathBonuses = [];
  if (gameState.combo.active && gameState.combo.effectB) {
    const comboValue = scoring.calculateComboScore(
      gameState.combo.effectA, gameState.combo.effectB);
    gameState.score += comboValue;
    deathBonuses.push({ value: comboValue, label: 'COMBO' });
  }
  if (gameState.phoneCall.pickedUp) {
    const phoneBonus = scoring.calculatePhoneBonus('pickup',
      gameState.phoneCall.pickUpCount);
    gameState.score += phoneBonus;
    deathBonuses.push({ value: phoneBonus, label: 'CALL BONUS' });
  }
  // Spawn stacked death reward popups
  // ... game over screen (score, high score)
  // Then: cognitive-feedback.showCognitiveStats(gameState.cognitiveStats)
  // Listen for 'cognitive-feedback-done' → show Play Again button
}
```

**Cross-System Rules Summary:**

| Rule | Location | Implementation |
|------|----------|----------------|
| Combo pauses during phone | `onPhoneCallShow()` / `onPhoneCallDismiss()` | `combo.pause()` / `combo.resume()` |
| Combo transition delays 200ms when phone active | `combo.js` internal | Guard clause: check `phoneCall.active` before canvas transition |
| Popup stagger 300ms | `score-popup.js` internal | Check `lastPopupTime` before spawn |
| Phone bonus labeled "CALL BONUS" | `onPhoneCallDismiss()` | Pass label to `scorePopup.spawnPopup()` |
| Death awards both combo + phone | `onDeath()` | Check both states, award both |

### Decision 8: Progression Engine

**Decision:** Threshold data tables in `config.js` (tunable). Resolution logic in `progression.js` (pure function).

**Config.js Threshold Tables:**

```javascript
// Blinking food probability by score (PRD: starts at 15, caps at 60% at 80+)
BLINK_THRESHOLDS: [
  { minScore: 0, probability: 0 },
  { minScore: 15, probability: 0.1 },
  { minScore: 20, probability: 0.2 },
  { minScore: 30, probability: 0.3 },
  { minScore: 40, probability: 0.4 },
  { minScore: 60, probability: 0.5 },
  { minScore: 80, probability: 0.6 }
],

// Combo probability by score
COMBO_THRESHOLDS: [
  { minScore: 0, probability: 0 },
  { minScore: 40, probability: 0.1 },
  { minScore: 60, probability: 0.2 },
  { minScore: 80, probability: 0.3 },
  { minScore: 100, probability: 0.4 },
  { minScore: 120, probability: 0.5 }
],

// Phone call frequency tiers
PHONE_CALL_TIERS: [
  { minScore: 3, minDelay: 12000, maxDelay: 20000 },
  { minScore: 15, minDelay: 8000, maxDelay: 15000 },
  { minScore: 40, minDelay: 6000, maxDelay: 12000 },
  { minScore: 60, minDelay: 5000, maxDelay: 10000 },
  { minScore: 100, minDelay: 4000, maxDelay: 8000 }
],

PHONE_GRACE_SCORE: 3
```

**Progression.js API:**

```javascript
// progression.js — Pure function, no state

export function getState(score) {
  return {
    blinkProbability: resolveThreshold(CONFIG.BLINK_THRESHOLDS, score),
    comboProbability: resolveThreshold(CONFIG.COMBO_THRESHOLDS, score),
    phoneTier: resolvePhoneTier(CONFIG.PHONE_CALL_TIERS, score),
    phoneGraceActive: score < CONFIG.PHONE_GRACE_SCORE
  };
}

// Internal helper — walks array backwards, returns first match
function resolveThreshold(thresholds, score) {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (score >= thresholds[i].minScore) {
      return thresholds[i].probability;
    }
  }
  return 0;
}

function resolvePhoneTier(tiers, score) {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (score >= tiers[i].minScore) {
      return { minDelay: tiers[i].minDelay, maxDelay: tiers[i].maxDelay };
    }
  }
  return null; // No tier = no calls (grace period)
}
```

**Consumers:**
- `food.js` → `getState(score).blinkProbability` at spawn time
- `game.js` → `getState(score).comboProbability` after food eaten
- `phone.js` → `getState(score).phoneTier` when scheduling next call
- `phone.js` → `getState(score).phoneGraceActive` before scheduling

### Decision 9: Cognitive Feedback System

**Decision:** Cognitive stat tracking distributed across `game.js` event handlers (increment at source). Post-game display owned by a new `cognitive-feedback.js` module — pure DOM/UI, no game logic. RC SURVIVED flash handled by `score-popup.js` (same ephemeral DOM lifecycle pattern).

**Rationale:** "Your Brain Today" is the brain-gym identity made visible. It transforms the death screen from failure into cognitive achievement recognition — metacognitive feedback (Flavell, 1979). Architecturally, stat tracking is naturally co-located with the events that trigger it (game.js handlers), while the display is pure UI with its own animation timeline. The RC SURVIVED flash follows the same ephemeral DOM pattern as score popups — no new pattern needed.

**Requirements Covered:** FR70-FR72 (RC SURVIVED), FR75-FR80 (Post-Game Cognitive Feedback)

**cognitiveStats Tracking Points (in game.js handlers):**

```javascript
// onFoodEaten():
//   - If activeEffect was reverseControls → gameState.cognitiveStats.rcSurvived++
//   - If food.isBlinking → gameState.cognitiveStats.mysteryFoodsEaten++
//   - If combo scored → gameState.cognitiveStats.comboMultipliers++
//   - If combo scored → gameState.cognitiveStats.peakComboScore = Math.max(peakComboScore, comboValue)

// onPhoneCallDismiss():
//   - gameState.cognitiveStats.phoneCallsManaged++
//   - If action === 'pickup' → gameState.cognitiveStats.pickUpStreak++
//   - If action === 'end' → gameState.cognitiveStats.pickUpStreak = 0

// onDeath():
//   - Pass cognitiveStats to cognitive-feedback.js for display
```

**RC SURVIVED Flash:**

```javascript
// In onFoodEaten(), after scoring:
if (previousEffect === 'reverseControls') {
  gameState.cognitiveStats.rcSurvived++;
  scorePopup.spawnFlash('RC SURVIVED', foodX, foodY + 20, 'rc-survived-flash');
}
```

- Content: `"RC SURVIVED"`
- CSS class: `.rc-survived-flash` (12px, white, 400ms fade-up, z-index: 200)
- Positioning: 20px below the +8 score popup at same x coordinate
- Appears 200ms after the +8 popup (popup stagger rule applies)
- No bonus points — the +8 already compensates. This is cognitive acknowledgment.
- Uses `score-popup.js` `spawnFlash()` — same ephemeral DOM lifecycle (`animationend` → `remove`)

**`score-popup.js` Extended API:**

```javascript
// score-popup.js — new function for text flashes (RC SURVIVED)
export function spawnFlash(text, gridX, gridY, cssClass) {
  // Creates DOM element with specified CSS class
  // Positions at grid coordinates (uses gridToPixel)
  // Self-cleaning via animationend
  // Respects 300ms stagger rule (checks lastPopupTime)
}
```

**`cognitive-feedback.js` Module (NEW):**

```javascript
// cognitive-feedback.js — Pure UI module for post-game "Your Brain Today" display

export function showCognitiveStats(cognitiveStats) {
  // 1. Select top 2-3 non-zero stats by value (priority tiebreaker below)
  // 2. Build DOM: header "Your Brain Today" + stat lines
  // 3. Animate stat lines in with 300ms stagger per line
  // 4. Hold for 2.5 seconds
  // 5. Fade out (500ms)
  // 6. Dispatch 'cognitive-feedback-done' event (game.js shows Play Again button)
}

export function hideCognitiveStats() {
  // Cleanup DOM elements (called on new game reset)
}
```

**Stat Selection Logic:**

| Internal Key | Display Text | Show When |
|---|---|---|
| `rcSurvived` | "Reverse Controls survived: N" | N > 0 |
| `phoneCallsManaged` | "Phone calls managed: N" | N > 0 |
| `mysteryFoodsEaten` | "Mystery foods decoded: N" | N > 0 |
| `comboMultipliers` | "Combo multipliers earned: N" | N > 0 |
| `pickUpStreak` | "Pick Up streak: N" | N >= 2 |
| `peakComboScore` | "Best combo: xN" | N >= 6 |

**Selection rule:** Show top 2-3 stats with highest values. Never show zero-value stats. If only 1 stat qualifies, show only 1. If none qualify (very short game), skip cognitive feedback entirely and show Play Again immediately.

**Priority (if tied):** rcSurvived > comboMultipliers > pickUpStreak > mysteryFoodsEaten > phoneCallsManaged > peakComboScore

**Timing Sequence (game.js onDeath → game over flow):**

```
1. Death animation plays
2. Game Over text + score appears
3. 300ms delay → cognitive-feedback.showCognitiveStats(cognitiveStats)
4. Stats stagger in (300ms per line, 2-3 lines = 600-900ms)
5. Stats hold for 2.5 seconds
6. Stats fade out (500ms)
7. 'cognitive-feedback-done' event → Play Again button appears
Total before Play Again: ~3.3 seconds (skipped if no qualifying stats)
```

**Reduced Motion:** If `CONFIG.REDUCED_MOTION`, stats appear instantly (no stagger, no fade-in), hold for 2.5s, then disappear instantly. Play Again button appears after hold.

**Module Boundaries:**
- `cognitive-feedback.js` is a **DOM-accessing module** (like phone.js and score-popup.js)
- It reads `cognitiveStats` from passed data — never accesses `gameState` directly
- It dispatches a DOM event when done — game.js listens and shows Play Again
- It does NOT calculate or track stats — that's game.js event handlers' job

### Decision 10: Two-Tier Cognitive Tracking & Analytics

**Decision:** Two-tier tracking model. **Tier 1** (`cognitiveStats`) is player-facing — it drives the "Your Brain Today" display and counts achievements (e.g., "Reverse Controls survived: 4"). **Tier 2** (`analyticsState`) is internal — it provides denominators, timestamps, and distributions that `analytics.js` needs to answer Celia's 7 cognitive validation questions (e.g., RC survival *rate* = `rcSurvived / totalRCFoodsEaten`). `analytics.js` is promoted from deferred to decided.

**Rationale:** Celia's cognitive analytics framework (see `cognitive-analytics-requirements.md`) requires *rates*, not just counts. A rate needs a numerator AND a denominator. `cognitiveStats` provides the numerators (achievements). `analyticsState` provides the denominators (total encounters) plus temporal data (reaction times, dwell times) and cross-system context (combo + phone overlap survival). Keeping these separate preserves the clean, celebratory design of "Your Brain Today" while giving analytics the depth it needs. The player never sees denominators — they'd make the brain gym feel clinical, not fun.

**Requirements Covered:** FR95-FR99 (Analytics), cognitive-analytics-requirements.md (Celia's 7 validation questions)

**The Two-Tier Model:**

```
┌─────────────────────────────────────────────────────────┐
│                    game.js handlers                       │
│  onFoodEaten(), onPhoneCallDismiss(), onDeath(), etc.    │
│                                                           │
│  SAME handlers populate BOTH tiers:                       │
│                                                           │
│  ┌─────────────────────┐    ┌──────────────────────────┐ │
│  │   cognitiveStats     │    │    analyticsState         │ │
│  │   (Tier 1)           │    │    (Tier 2)               │ │
│  │                      │    │                            │ │
│  │  Player-facing       │    │  Internal only             │ │
│  │  Counts achievements │    │  Denominators + timestamps │ │
│  │  Drives "Your Brain  │    │  Drives analytics.js       │ │
│  │   Today" display     │    │  Never shown to player     │ │
│  └──────────┬───────────┘    └────────────┬──────────────┘ │
│             │                              │                │
│             ▼                              ▼                │
│  cognitive-feedback.js          analytics.js                │
│  (post-game UI)                 (event tracking)            │
└─────────────────────────────────────────────────────────────┘
```

**Tracking Points (in game.js handlers):**

```javascript
// onFoodEaten():
//   TIER 1 (cognitiveStats):
//     if previousEffect === 'reverseControls' → cognitiveStats.rcSurvived++
//     if food.isBlinking → cognitiveStats.mysteryFoodsEaten++
//     if combo scored → cognitiveStats.comboMultipliers++
//     if combo scored → cognitiveStats.peakComboScore = max(peak, value)
//
//   TIER 2 (analyticsState):
//     if food.type === 'reverseControls' → analyticsState.totalRCFoodsEaten++
//     if food.type === 'reverseControls' → analyticsState.rcActivationTick = currentTick
//     Check milestones: if score crosses [3, 15, 40, 60, 100] → analyticsState.milestonesReached.push(milestone)
//     if combo triggered → analyticsState.totalCombosTriggered++
//     if combo completed → analyticsState.comboScores.push(comboValue)
//     analytics.trackFoodEaten(gameState)  ← fire event with full context

// food.spawnFood():
//   TIER 2 (analyticsState):
//     analyticsState.foodSpawnTime = Date.now()
//     if food.isBlinking → analyticsState.totalBlinkingFoodsSpawned++

// onPhoneCallShow():
//   TIER 2 (analyticsState):
//     analyticsState.totalPhoneCalls++
//     analyticsState.phoneCallShowTime = Date.now()
//     if combo.active → analyticsState.comboPhoneOverlaps++

// onPhoneCallDismiss(action):
//   TIER 1 (cognitiveStats):
//     cognitiveStats.phoneCallsManaged++
//     if action === 'pickup' → cognitiveStats.pickUpStreak++
//     if action === 'end' → cognitiveStats.pickUpStreak = 0
//
//   TIER 2 (analyticsState):
//     if action === 'pickup' → analyticsState.totalPickUps++
//     if action === 'end' → analyticsState.totalEnds++
//     if action === 'pickup' → analyticsState.pickUpCompletionTime = Date.now()
//     if combo was paused and resumed → analyticsState.comboPhoneOverlapSurvived++
//     analytics.trackPhoneCall(gameState, action)  ← fire event with reaction time

// onDeath():
//   TIER 2 (analyticsState):
//     analytics.trackGameOver(gameState)  ← fire event with FULL snapshot
//     (analytics.js reads combo.active, phoneCall.active, phoneCall.pickedUp,
//      activeEffect, food.isBlinking, score, analyticsState — all at death time)

// cognitive-feedback 'done' event:
//   TIER 2 (analyticsState):
//     analyticsState.cognitiveStatsShownTime = Date.now()
//     (Play Again click → analytics computes dwell time)
```

**`analytics.js` Module Specification:**

```javascript
// analytics.js — Non-blocking event tracking
// Consumes: gameState (including cognitiveStats + analyticsState)
// Produces: fire-and-forget events to Plausible
// Constraint: NEVER blocks game loop. NEVER affects 60 FPS.

export function init() {
  // window.plausible is always defined by inline queue snippet in <head>
  // Calls before script load are buffered in plausible.q and sent when ready
  // Generate session ID (sessionStorage)
}

// All tracking functions use Plausible custom events API:
//   window.plausible('event_name', { props: { key: value } })
// Queue pattern: calls never fail — they buffer if script hasn't loaded yet.
// Plausible is cookie-free, privacy-first, GDPR-compliant by default.
// Custom event props are limited to string/number values (no nested objects).

export function trackGameStart(gameState) {
  // Fires: game_start event
  // Includes: session_id, is_first_game, previous_score
}

export function trackFoodEaten(gameState) {
  // Fires: food_eaten event
  // Includes: food_type, is_blinking, snake_length, score,
  //           time_to_eat (Date.now() - analyticsState.foodSpawnTime),
  //           rc_active (was reverse controls the previous effect?)
}

export function trackPhoneCall(gameState, action) {
  // Fires: phone_call event
  // Includes: action ('end'|'pickup'), caller_name,
  //           reaction_time_ms (Date.now() - analyticsState.phoneCallShowTime),
  //           pickup_bonus, call_sequence_number (analyticsState.totalPhoneCalls),
  //           combo_active_during_call, score_at_call
}

export function trackScoreMilestone(milestone, gameState) {
  // Fires: score_milestone event
  // Includes: milestone (3|15|40|60|100), time_to_reach,
  //           pick_up_count_at_milestone, foods_eaten
}

export function trackGameOver(gameState) {
  // Fires: game_over event — THE comprehensive snapshot
  // Includes all of John's original fields PLUS:
  //   pick_up_count, end_count, pick_up_rate,
  //   combo_count (triggered), combo_completion_rate,
  //   combo_scores (array), combo_active_at_death,
  //   blinking_foods_spawned, blinking_foods_eaten, blink_eat_rate,
  //   rc_foods_eaten, rc_survived, rc_survival_rate, rc_active_at_death,
  //   phone_active_at_death, picked_up_at_death,
  //   milestones_reached, peak_combo_score,
  //   cognitive_stats_viewed, food_is_blinking_at_death
}

export function trackSessionEnd(sessionData) {
  // Fires: session_end event
  // Aggregated across all games in visit
  // Includes: total_games, highest_score, return indicator,
  //           aggregate pick_up_rate, aggregate rc_survival_rate
}
```

**Signal-to-Question Mapping:**

| Celia's Question | Key analyticsState Fields | Derived Signal |
|---|---|---|
| Q1: Flow curve | `milestonesReached` | Milestone reach rates across all games |
| Q2: Divided attention | `totalPhoneCalls`, `totalPickUps`, `totalEnds`, `phoneCallShowTime` | Pick Up rate, End reaction time |
| Q3: Uncertainty tolerance | `totalBlinkingFoodsSpawned`, `foodSpawnTime` | Blink eat rate, time-to-eat delta |
| Q4: Working memory | `totalCombosTriggered`, `comboScores`, `comboPhoneOverlaps`, `comboPhoneOverlapSurvived` | Combo completion rate, combo+phone survival |
| Q5: Executive function | `totalRCFoodsEaten`, `rcActivationTick` | RC survival rate, ticks survived after RC |
| Q6: Brain gym identity | `cognitiveStatsShownTime` | Stats dwell time, Play Again delay |
| Q7: Comedy engagement | `pickUpCompletionTime`, `phoneCallShowTime` | One-liner dwell time, first vs. later Pick Up rate |

**Cross-system context at death:** `analytics.js` reads existing gameState fields at death time — no duplication needed:

| Signal | Read From |
|---|---|
| Combo active at death | `gameState.combo.active` |
| Phone active at death | `gameState.phoneCall.active` |
| Picked up at death | `gameState.phoneCall.pickedUp` |
| RC active at death | `gameState.activeEffect === 'reverseControls'` |
| Blinking food at death | `gameState.food.isBlinking` |
| Score at death | `gameState.score` |

**Module Boundaries:**
- `analytics.js` is a **read-only consumer** of `gameState` — it never modifies state
- It reads `cognitiveStats` + `analyticsState` + other gameState fields at event fire time
- All calls are fire-and-forget — `if (typeof plausible !== 'undefined')` guard clause
- Game is always playable with analytics disabled/blocked
- `CONFIG.ANALYTICS_ENABLED` toggle for dev vs. production

**Graceful Degradation:**
- Tracking script fails to load → game plays normally, analytics silently skipped
- Events fail to send → no retry, no error visible to player
- `analyticsState` still populated even without analytics script (costs near-zero — just counter increments)

### Decision Dependency Chain

```
config.js (threshold tables + Fibonacci values)
  │
  ├─→ progression.js (resolves score → current tier state)
  │     │
  │     ├─→ food.js (blinking probability at spawn)
  │     ├─→ phone.js (call frequency tier + grace period)
  │     └─→ game.js (combo trigger probability)
  │
  ├─→ scoring.js (pure calculation: food score, combo multiplier, phone bonus)
  │     │
  │     └─→ game.js (calls scoring, gets values, triggers popups, updates state)
  │
  └─→ combo.js (state machine: activation, dual effects, lifecycle, canvas)
        │
        └─→ game.js (delegates food eating when combo active, pause/resume)

game.js (orchestrator)
  ├─→ scoring.js (calculate)
  ├─→ score-popup.js (display popups + RC SURVIVED flash)
  ├─→ combo.js (delegate when active)
  ├─→ phone.js (schedule, show, dismiss)
  ├─→ cognitive-feedback.js (post-game "Your Brain Today" display)
  ├─→ analytics.js (fire-and-forget event tracking — reads cognitiveStats + analyticsState)
  └─→ render.js (draw everything from state)
```

---

## V2 Implementation Patterns & Consistency Rules

### V1 Patterns Carried Forward (Unchanged)

All v1 implementation patterns remain in full effect:
- **Naming:** camelCase functions/variables, SCREAMING_SNAKE_CASE constants, kebab-case files/CSS
- **Data formats:** `{ x, y }` positions, hex color strings, millisecond time values, string directions, string food types
- **Module patterns:** Named exports, explicit `gameState` passing, import only what's needed
- **Code style:** 2-space indent, single quotes, semicolons required, one blank line between functions
- **State access:** Direct mutation of passed `gameState` object, destructuring for reads
- **Error handling:** Guard clauses, console logging with module prefix `[ModuleName]`
- **Module boundaries:** State via `gameState` param, DOM in main.js/phone.js only, canvas in render.js only, localStorage in storage.js only, audio in audio.js only, config via `CONFIG` import

### V2-Specific Patterns (New)

**8 conflict points identified** where AI agents could make divergent choices on v2 systems.

### Pattern 1: Score/Effect Data Format

When effect data crosses module boundaries (combo.js ↔ scoring.js ↔ game.js), always include score value:

```javascript
// CORRECT: Effect data with score value
const effectData = { type: 'speedBoost', scoreValue: 5 };

// WRONG: Raw type string where score value is needed
const effect = 'speedBoost'; // Consumer has to look up value separately
```

**Rule:** `combo.effectA` and `combo.effectB` always store `{ type, scoreValue }` objects, never raw strings.

### Pattern 2: Popup Label Convention

Three scoring sources produce popups. Labels distinguish the source:

```javascript
// Food popups: no label (empty string)
scorePopup.spawnPopup(5, x, y, '');

// Combo popups: 'COMBO' label
scorePopup.spawnPopup(24, x, y, 'COMBO');

// Phone popups: 'CALL BONUS' label
scorePopup.spawnPopup(13, x, y, 'CALL BONUS');
```

**Rule:** The label parameter is always a string. Empty string for food. 'COMBO' for combo multiplier results. 'CALL BONUS' for phone bonuses.

### Pattern 3: Canvas State Management

Combo mode changes canvas background. Use CSS class for state, CSS custom property for dynamic color:

```javascript
// CORRECT: Class toggles state, custom property holds color
canvas.classList.add('combo-active');
canvas.style.setProperty('--combo-color', '#4A148C');

// On combo exit:
canvas.classList.remove('combo-active');

// WRONG: Direct style manipulation
canvas.style.backgroundColor = '#4A148C'; // Don't do this
```

**CSS side:**
```css
#game-canvas {
  background-color: #E8E8E8; /* Normal */
  transition: background-color 500ms ease-in-out;
}

#game-canvas.combo-active {
  background-color: var(--combo-color);
}
```

**Rule:** Visual state changes on the canvas use CSS class toggles, never inline style overrides for `backgroundColor`. Dynamic values use CSS custom properties.

### Pattern 4: DOM Element Lifecycle (Popups/Particles)

Ephemeral DOM elements follow a strict lifecycle:

```javascript
// CORRECT: Create → class → append → animationend → remove
const el = document.createElement('div');
el.className = 'score-popup score-popup-5';
el.textContent = '+5';
container.appendChild(el);
el.addEventListener('animationend', () => el.remove());

// WRONG: setTimeout-based cleanup
setTimeout(() => el.remove(), 800); // Fragile, breaks if animation changes
```

**Rule:** ALL ephemeral DOM elements (popups, particles) self-clean via `animationend` event listener. Never use `setTimeout` for DOM cleanup.

### Pattern 5: Phone Overlay State Transitions

The phone overlay has distinct visual states. Use CSS classes, not inline style toggling:

```javascript
// State classes on #phone-overlay:
// .ringing     — initial state, both buttons visible
// .picked-up   — buttons hidden, countdown bar visible, one-liner shown
// .dismissing  — exit transition

// CORRECT: Class-based state transitions
overlay.classList.remove('ringing');
overlay.classList.add('picked-up');

// WRONG: Individual element style manipulation
endButton.style.display = 'none';
pickupButton.style.display = 'none';
countdownBar.style.display = 'block'; // Don't do this
```

**Rule:** Phone overlay visual states are managed by CSS classes on the container. Individual child element visibility is controlled by CSS rules scoped to the parent class, not by JavaScript `style.display` manipulation.

### Pattern 6: Progression State Consumption

Modules query `progression.getState()` for score-based thresholds:

```javascript
// CORRECT: Single call, destructure what you need
const { blinkProbability, comboProbability } = progression.getState(gameState.score);

// WRONG: Multiple redundant calls in same context
const blink = progression.getState(gameState.score).blinkProbability;
const combo = progression.getState(gameState.score).comboProbability;
```

**Rule:** Call `progression.getState()` once per context. Destructure the result. Never call it multiple times with the same score in the same function scope.

### Pattern 7: Asset Path References

All asset paths use consistent formatting:

```javascript
// Sound files: assets/sounds/{category}-{descriptor}.mp3
'assets/sounds/score-1.mp3'
'assets/sounds/score-8.mp3'
'assets/sounds/combo-entrance.mp3'
'assets/sounds/combo-exit.mp3'
'assets/sounds/combo-jackpot.mp3'
'assets/sounds/combo-legendary.mp3'
'assets/sounds/phone-ring.mp3'
'assets/sounds/phone-pickup.mp3'
'assets/sounds/phone-end.mp3'

// Portrait files: assets/callers/{kebab-case-name}.png
'assets/callers/al-gorithm.png'
'assets/callers/meg-a-byte.png'
'assets/callers/floppy-phil.png'
```

**Rule:** Sound files: `assets/sounds/{category}-{descriptor}.mp3`. Portrait files: `assets/callers/{kebab-case-caller-name}.png`. All paths relative to project root. All filenames kebab-case.

### Pattern 8: Reduced Motion Detection

Detect `prefers-reduced-motion` once at init, store as a readable flag:

```javascript
// CORRECT: Detect once in main.js, store in CONFIG
CONFIG.REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Modules read the flag:
if (CONFIG.REDUCED_MOTION) {
  // Use slower animation / skip particles / etc.
}

// WRONG: Each module detecting independently
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { ... }
```

**Rule:** `prefers-reduced-motion` is detected once at initialization and stored in `CONFIG.REDUCED_MOTION`. All modules read this flag. No module queries `window.matchMedia` directly.

### V2 Enforcement Guidelines

**All AI Agents MUST (in addition to v1 rules):**

1. Use `{ type, scoreValue }` objects for effect data crossing module boundaries
2. Use `animationend` event listeners for ephemeral DOM cleanup — never `setTimeout`
3. Use CSS class toggles for visual state changes — never inline style overrides for state
4. Call `progression.getState()` once per context, destructure the result
5. Follow asset path naming: `assets/sounds/{cat}-{desc}.mp3`, `assets/callers/{kebab-name}.png`
6. Read `CONFIG.REDUCED_MOTION` flag — never query `window.matchMedia` directly in modules
7. Pass popup labels consistently: `''` for food, `'COMBO'` for combo, `'CALL BONUS'` for phone
8. `combo.isActive()` returns `active && !paused` — a paused combo is NOT active for food-eating. Food eaten during combo pause scores normally via non-combo path
9. Wall Phase scoring reset sequence: read `wallPhaseUsed` → score → clear effect → reset boolean → apply new effect (strict order, never reorder)
10. `score-popup.js` `gridToPixel()` MUST use `canvas.getBoundingClientRect()` at call time — never assume static canvas positioning
11. Organize `game.js` orchestration into named handler functions (`onFoodEaten()`, `onPhoneCallShow()`, `onPhoneCallDismiss()`, `onDeath()`) — keep the game loop body thin
12. Track `cognitiveStats` at source in `game.js` handlers — never in other modules
13. `cognitive-feedback.js` receives stats as data, dispatches DOM event when done — never accesses `gameState` directly
14. RC SURVIVED flash uses `score-popup.js` `spawnFlash()` — same ephemeral DOM lifecycle as score popups

**V2 Anti-Patterns to Avoid:**

| Don't | Do Instead |
|-------|------------|
| `{ type: 'speedBoost' }` crossing modules without scoreValue | `{ type: 'speedBoost', scoreValue: 5 }` |
| `setTimeout(() => popup.remove(), 800)` | `popup.addEventListener('animationend', () => popup.remove())` |
| `canvas.style.backgroundColor = color` | `canvas.classList.add('combo-active')` + CSS custom property |
| `endBtn.style.display = 'none'` for phone states | `overlay.classList.add('picked-up')` with CSS rules |
| `progression.getState(score)` called 3 times in one function | Call once, destructure: `const { a, b } = progression.getState(score)` |
| `window.matchMedia('(prefers-reduced-motion)').matches` in render.js | Read `CONFIG.REDUCED_MOTION` |
| `combo.isActive()` returning `true` when paused | `return gameState.combo.active && !gameState.combo.paused` |
| Scoring Wall Phase after resetting `wallPhaseUsed` | Read boolean FIRST, then score, then reset — strict order |
| `gridToPixel` using hardcoded canvas offset | Use `canvas.getBoundingClientRect()` at call time |
| Inline orchestration logic in game loop body | Named handlers: `onFoodEaten()`, `onPhoneCallShow()`, etc. |

---

## V2 Project Structure & Boundaries

### Complete V2 Project Directory Structure

```
CrazySnakeLite/
├── index.html                    # Entry point, game container, DOM structure (v2: popup container, phone v2 overlay)
├── css/
│   └── style.css                 # All styling (v2: +score popups, +particles, +combo mode, +phone v2, +reduced motion)
├── js/
│   ├── main.js                   # Entry point: init canvas, start game loop, wire up modules, detect reduced motion
│   ├── config.js                 # CONFIG object: all tunable parameters (v2: +Fibonacci values, +thresholds, +tiers, +combo colors, +popup specs)
│   ├── state.js                  # gameState object, createInitialState(), resetGame() (v2: +combo, +phone v2 fields, +ui, +effects)
│   ├── game.js                   # Game loop (RAF + fixed timestep), update orchestration (v2: +cross-system orchestration, +popup triggering, +blink cycling)
│   ├── snake.js                  # moveSnake(), growSnake(), applyEffect(), getSnakeHead()
│   ├── food.js                   # spawnFood(), selectFoodType(), FOOD_TYPES (v2: +blinking determination via progression.js)
│   ├── collision.js              # checkWallCollision(), checkSelfCollision(), checkFoodCollision()
│   ├── effects.js                # applyEffect(), clearEffect(), isEffectActive() (v2: +wallPhaseUsed tracking)
│   ├── phone.js                  # Phone call system (v2: near-rewrite — two-button UI, Pick Up timer, countdown bar, portraits, one-liners, Fibonacci bonus, score-based scheduling)
│   ├── input.js                  # initInput(), onAction(), KEY_MAPPINGS (v2: +Enter key for Pick Up)
│   ├── render.js                 # renderGame(), renderSnake(), renderFood(), renderGrid(), renderScore() (v2: +blinking food color cycling, +striped snake, +combo canvas bg, +food drop shadows)
│   ├── audio.js                  # Web Audio API: initAudio(), playMoveSound(), resumeAudio() (v2: +score sounds, +combo sounds, +phone sounds, +priority system)
│   ├── storage.js                # loadHighScore(), saveHighScore()
│   ├── feedback.js               # Visual feedback utilities (existing v1 module)
│   ├── scoring.js                # NEW: Pure calculation — calculateFoodScore(), calculateComboScore(), calculatePhoneBonus()
│   ├── progression.js            # NEW: Score → tier resolution — getState(score) returns {blinkProbability, comboProbability, phoneTier, phoneGraceActive}
│   ├── combo.js                  # NEW: Combo state machine — activate(), handleFoodEaten(), pause(), resume(), isActive()
│   ├── score-popup.js            # NEW: DOM popup lifecycle — spawnPopup(), spawnParticles(), triggerScreenShake(), spawnFlash()
│   ├── cognitive-feedback.js     # NEW: Post-game "Your Brain Today" — showCognitiveStats(), hideCognitiveStats()
│   └── analytics.js              # NEW: Non-blocking cognitive analytics — trackGameStart/Over/FoodEaten/PhoneCall/Milestone/SessionEnd
├── assets/
│   ├── sounds/                   # 27 MP3 files (14 v1 + 13 v2)
│   │   ├── move-default-1.mp3 & move-default-2.mp3           (v1: neutral blips)
│   │   ├── move-growing-1.mp3 & move-growing-2.mp3           (v1: pleasant tones)
│   │   ├── move-invicibility-1.mp3 & move-invicibility-2.mp3 (v1: powerful tones)
│   │   ├── move-wallphase-1.mp3 & move-wallphase-2.mp3       (v1: ethereal tones)
│   │   ├── move-speedboost-1.mp3 & move-speedboost-2.mp3     (v1: energetic tones)
│   │   ├── move-speeddecrease-1.mp3 & move-speeddecrease-2.mp3 (v1: slow tones)
│   │   ├── move-reverse-1.mp3 & move-reverse-2.mp3           (v1: dissonant tones)
│   │   ├── gameover.mp3                                        (v1: game over melody)
│   │   ├── score-1.mp3                                         (v2: Growing food +1)
│   │   ├── score-2.mp3                                         (v2: Speed Decrease +2)
│   │   ├── score-3.mp3                                         (v2: Wall Phase active +3)
│   │   ├── score-5.mp3                                         (v2: Speed Boost +5)
│   │   ├── score-8.mp3                                         (v2: Reverse Controls +8)
│   │   ├── combo-entrance.mp3                                  (v2: combo activates)
│   │   ├── combo-exit.mp3                                      (v2: combo ends)
│   │   ├── combo-jackpot.mp3                                   (v2: 15+ point combo)
│   │   ├── combo-legendary.mp3                                 (v2: 30+ point combo)
│   │   ├── phone-ring.mp3                                      (v2: incoming call loop)
│   │   ├── phone-pickup.mp3                                    (v2: Pick Up click)
│   │   └── phone-end.mp3                                       (v2: End click)
│   ├── callers/                  # 21 portrait PNGs (v2: 64x64 pixel art)
│   │   ├── al-gorithm.png
│   │   ├── meg-a-byte.png
│   │   ├── ali-sing.png
│   │   ├── anna-log.png
│   │   ├── ray-tracing.png
│   │   ├── pat-ch-notes.png
│   │   ├── mac-address.png
│   │   ├── artie-ficial.png
│   │   ├── floppy-phil.png
│   │   ├── dot-matrix.png
│   │   ├── gia-hertz.png
│   │   ├── terry-byte.png
│   │   ├── perry-pheral.png
│   │   ├── cade-ridger.png
│   │   ├── mona-tor.png
│   │   ├── syd-ram.png
│   │   ├── bessie-ios.png
│   │   ├── dee-frag.png
│   │   ├── buffy-ring.png
│   │   ├── dj-snake.png
│   │   └── game-over.png
│   └── PhoneIcone01_256px.png    # Portrait fallback icon (existing)
└── README.md                     # Setup instructions, local server commands
```

**Total: 20 JS modules (14 v1 + 6 new) · 49 asset files (27 audio + 21 portraits + 1 fallback)**

### V2 Module Responsibilities & FR Mapping

| Module | Responsibility | V2 Functional Coverage |
|--------|---------------|----------------------|
| **main.js** | Entry point, initialization, wiring, reduced motion detection | `CONFIG.REDUCED_MOTION` init |
| **config.js** | All tunable parameters (CONFIG object) | Fibonacci score values, BLINK_THRESHOLDS, COMBO_THRESHOLDS, PHONE_CALL_TIERS, PHONE_PICKUP_FIBONACCI, combo canvas colors, popup tier specs |
| **state.js** | Game state structure, initial state, reset | V2 fields: `combo`, `phoneCall` v2 extensions, `effects.wallPhaseUsed`, `ui` |
| **game.js** | Game loop, update orchestration, cross-system coordination | Combo↔phone pause/resume, popup triggering, blink cycling, combo trigger check, death reward stacking |
| **snake.js** | Snake movement, growth, direction changes | Unchanged from v1 |
| **food.js** | Food spawning, type selection, blinking determination | Queries `progression.getState()` at spawn for blink probability |
| **collision.js** | Wall collision, self collision, food collision | Unchanged from v1 |
| **effects.js** | Effect application, duration, clearing, wall phase tracking | `wallPhaseUsed` boolean for conditional +1/+3 scoring |
| **phone.js** | Phone call system (v2: complete two-button experience) | Two-button UI, Pick Up timer + countdown bar, Fibonacci bonus, portraits, one-liners, score-based scheduling via progression.js |
| **input.js** | Keyboard (4 layouts) + touch → actions | +Enter key binding for Pick Up |
| **render.js** | Canvas rendering: all visual output | +Blinking food color cycling, +striped snake combo rendering, +combo canvas background, +food drop shadows, +conditional segment borders |
| **audio.js** | Web Audio API: all game audio | +Score sounds (Fibonacci), +combo sounds, +phone sounds, +priority system (6 levels) |
| **storage.js** | localStorage for high score | Unchanged from v1 |
| **feedback.js** | Visual feedback utilities | Existing v1 module |
| **scoring.js** _(NEW)_ | Pure scoring calculation — no side effects, no DOM | `calculateFoodScore()`, `calculateComboScore()`, `calculatePhoneBonus()` |
| **progression.js** _(NEW)_ | Score → tier resolution — pure function, no state | `getState(score)` → `{blinkProbability, comboProbability, phoneTier, phoneGraceActive}` |
| **combo.js** _(NEW)_ | Combo state machine — activation, dual-effect lifecycle, canvas, pause/resume | `activate()`, `handleFoodEaten()`, `pause()`, `resume()`, `isActive()` |
| **score-popup.js** _(NEW)_ | DOM popup lifecycle — create, animate, queue, cleanup | `spawnPopup()`, `spawnParticles()`, `triggerScreenShake()`, `spawnFlash()` (RC SURVIVED) |
| **cognitive-feedback.js** _(NEW)_ | Post-game "Your Brain Today" cognitive stats display | `showCognitiveStats()`, `hideCognitiveStats()` — pure UI, stat selection, stagger animation |
| **analytics.js** _(NEW — promoted from deferred)_ | Non-blocking event tracking for cognitive validation | `trackGameStart()`, `trackFoodEaten()`, `trackPhoneCall()`, `trackScoreMilestone()`, `trackGameOver()`, `trackSessionEnd()` — reads cognitiveStats + analyticsState, fire-and-forget |

### V2 Architectural Boundaries

**Module Communication Flow (V2):**

```
                    ┌─────────────┐
                    │   main.js   │  ← Entry point, reduced motion detect
                    └──────┬──────┘
                           │ initializes
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ input.js │    │ game.js  │    │ audio.js │
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         │ actions       │ orchestrates  │ sounds + priority
         ▼               ▼               ▼
    ┌─────────────────────────────────────────────────────┐
    │                   gameState                          │
    │  (defined in state.js, passed to all modules)       │
    │  v2: +combo, +phone v2, +effects, +ui               │
    └─────────────────────────────────────────────────────┘
       ▲         ▲         ▲         ▲         ▲
       │         │         │         │         │
  ┌────┴───┐ ┌──┴───┐ ┌───┴──┐ ┌───┴────┐ ┌──┴──────┐
  │snake.js│ │food.js│ │phone │ │combo.js│ │effects  │
  └────────┘ └──┬───┘ │ .js  │ └───┬────┘ │  .js    │
                │     └──────┘     │       └─────────┘
                │                  │
                ▼                  ▼
         ┌─────────────┐   ┌──────────────┐
         │progression.js│   │  scoring.js  │
         │(pure lookup) │   │(pure calc)   │
         └─────────────┘   └──────────────┘

    ┌────────────────────────────────────────┐
    │          render.js                      │  ← Reads state, draws canvas
    │  v2: +blink colors, +striped snake,    │     (never modifies state)
    │      +combo bg, +food shadows          │
    └────────────────────────────────────────┘

    ┌────────────────────────────────────────┐
    │       score-popup.js                    │  ← DOM overlay system
    │  Spawns popups, particles, screen shake │     (no game logic)
    │  RC SURVIVED flash via spawnFlash()     │
    │  Self-cleaning via animationend         │
    └────────────────────────────────────────┘

    ┌────────────────────────────────────────┐
    │    cognitive-feedback.js                │  ← Post-game display
    │  "Your Brain Today" stats              │     (pure UI, no game logic)
    │  Stat selection, stagger animation     │
    │  Dispatches 'cognitive-feedback-done'  │
    └────────────────────────────────────────┘
```

**V2 Boundary Rules (extends v1):**

| Boundary | Rule | V2 Additions |
|----------|------|-------------|
| **State Access** | Only through passed `gameState` parameter | All 6 new modules follow same pattern |
| **DOM Access** | `main.js` (setup), `phone.js` (overlay), `score-popup.js` (popups + RC flash), `cognitive-feedback.js` (post-game stats) | score-popup.js and cognitive-feedback.js are new DOM-accessing modules |
| **Canvas Access** | Only `render.js` draws to canvas | render.js reads combo.canvasColor for background |
| **Scoring Logic** | Only `scoring.js` calculates score values | No scoring math anywhere else |
| **Threshold Data** | Only `config.js` holds threshold tables | progression.js reads, never owns thresholds |
| **Tier Resolution** | Only `progression.js` resolves score → tier | Consumers call getState() once, destructure |
| **Combo Logic** | Only `combo.js` manages combo state machine | game.js delegates, never manipulates combo fields directly |
| **Analytics** | Only `analytics.js` fires tracking events | Read-only consumer of gameState — never modifies state |
| **Audio** | Only `audio.js` | +Priority system prevents concurrent sound mud |
| **localStorage** | Only `storage.js` | Unchanged |
| **Configuration** | Only `config.js` (import CONFIG elsewhere) | Massively expanded for v2 |

### V2 Data Flow

**Food Eating Flow (V2):**

```
1. collision.js detects food collision
2. game.js receives collision event
3. game.js checks: combo.isActive(gameState)?
   ├── YES: combo.handleFoodEaten(gameState, foodType) → returns { value, label }
   └── NO:  scoring.calculateFoodScore(foodType, wallPhaseUsed) → returns value
            Then: check progression.getState(score).comboProbability for activation
4. game.js updates gameState.score += value
5. game.js calls scorePopup.spawnPopup(value, x, y, label)
6. If value >= 8: scorePopup.spawnParticles() + triggerScreenShake()
7. food.js spawns next food (queries progression for blink probability)
8. render.js draws updated state next frame
9. audio.js plays appropriate score sound (priority-checked)
```

**Phone Call Flow (V2):**

```
1. game.js checks: time >= phoneCall.nextCallTime && !progression.getState(score).phoneGraceActive?
2. phone.showCall(gameState) — DOM overlay appears with caller portrait
3. If combo active: combo.pause(gameState)
4. Player presses:
   ├── Space (End): scoring.calculatePhoneBonus('end', pickUpCount) → +1
   └── Enter (Pick Up): phone starts timer, countdown bar, reveals one-liner
       └── Timer expires: scoring.calculatePhoneBonus('pickup', pickUpCount) → Fibonacci value
5. game.js receives bonus, updates score, spawns popup with 'CALL BONUS' label
6. phone.dismissCall(gameState) — DOM overlay hides
7. If combo was paused: combo.resume(gameState)
8. phone.scheduleNextCall(gameState) — queries progression for tier
```

**Death Flow (V2):**

```
1. collision.js detects wall/self collision (non-invincible, non-wallPhase)
2. game.js checks for stacked rewards:
   ├── combo active + effectB exists? → scoring.calculateComboScore() → award + popup
   └── phone pickedUp? → scoring.calculatePhoneBonus('pickup', count) → award + popup
3. Popups spawned with 300ms stagger
4. Game over screen shows final score + high score
5. cognitive-feedback.showCognitiveStats(cognitiveStats) → "Your Brain Today"
   ├── Top 2-3 non-zero stats displayed with 300ms stagger
   ├── Hold 2.5s → fade out 500ms
   └── Dispatch 'cognitive-feedback-done' → Play Again button appears
6. On restart: state.js resets ALL v2 fields (combo, phone.pickUpCount, ui, cognitiveStats)
```

### V2 index.html Structure

```html
<!-- V2 additions to existing index.html -->
<div id="game-container">
  <canvas id="game-canvas"></canvas>
  <div id="score-display"></div>

  <!-- V2: Score popup container (z-index: 200) -->
  <div id="popup-container"></div>

  <!-- V2: Phone overlay redesigned -->
  <div id="phone-overlay" class="hidden">
    <div class="phone-screen">
      <img class="caller-portrait" src="" alt="">
      <p class="caller-name"></p>
      <p class="caller-line hidden"></p>
      <div class="phone-buttons">
        <button class="end-button">End</button>
        <button class="pickup-button">Pick Up</button>
      </div>
      <div class="countdown-bar hidden"></div>
    </div>
  </div>

  <!-- V2: Tooltip for first mystery food -->
  <div id="mystery-tooltip" class="hidden">Mystery Food!</div>

  <div id="menu-screen"><!-- unchanged --></div>
  <div id="gameover-screen" class="hidden">
    <h2>GAME OVER</h2>
    <p class="final-score"></p>
    <p class="high-score"></p>
    <!-- V2: Cognitive feedback section -->
    <div class="cognitive-stats hidden">
      <p class="cognitive-stats-header">Your Brain Today</p>
      <!-- Stat lines injected dynamically by cognitive-feedback.js -->
    </div>
    <button id="play-again-btn" class="selected hidden">Play Again</button>
    <button id="menu-btn" class="hidden">Menu</button>
  </div>
</div>

<!-- Privacy-friendly analytics by Plausible -->
<script async src="https://plausible.io/js/pa-5lDK3arREKbPzQ_2_Jhfm.js"></script>
<script>
  window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()
</script>
```

### V2 CSS Organization

```css
/* style.css — V2 additions organized by section */

/* === Existing V1 Sections (unchanged) === */
/* Game container, canvas, menus, buttons, score display, responsive */

/* === V2: Score Popups === */
/* .score-popup base, .score-popup-1 through .score-popup-8 */
/* @keyframes popup-bounce, popup-glow */
/* Position: absolute within #popup-container */

/* === V2: Particles === */
/* .particle base, radial spread via CSS custom properties */
/* @keyframes particle-fly */

/* === V2: Screen Shake === */
/* @keyframes screen-shake on #game-container */

/* === V2: Combo Mode === */
/* #game-canvas.combo-active { background-color: var(--combo-color) } */
/* transition: background-color 500ms ease-in-out */

/* === V2: Blinking Food === */
/* Food drop shadow (2px) for spatial anchoring */

/* === V2: Phone v2 === */
/* .phone-screen redesign: portrait, one-liner, dual buttons */
/* .ringing, .picked-up, .dismissing state classes */
/* .countdown-bar with width animation */
/* .caller-portrait 64x64 sizing */

/* === V2: RC SURVIVED Flash === */
/* .rc-survived-flash: 12px white, 400ms fade-up, z-index 200 */
/* @keyframes rc-flash */

/* === V2: Mystery Tooltip === */
/* #mystery-tooltip positioning and fade animation */

/* === V2: Cognitive Feedback ("Your Brain Today") === */
/* .cognitive-stats container, .cognitive-stats-header, .cognitive-stat-line */
/* @keyframes stat-line-appear: 300ms stagger per line */
/* Play Again button hidden until 'cognitive-feedback-done' event */

/* === V2: Z-Index Hierarchy === */
/* #game-canvas: 0 */
/* #popup-container: 200 */
/* #mystery-tooltip: 300 */
/* #phone-overlay: 400 */

/* === V2: Reduced Motion === */
/* @media (prefers-reduced-motion: reduce) { */
/*   --popup-duration: 0ms; */
/*   --transition-speed: 0ms; */
/*   Disable screen shake, simplify popups, slow blink to 500ms */
/* } */
```

### V2 Integration Points

**Internal (module-to-module):**

| Producer | Consumer | Data Exchanged |
|----------|----------|---------------|
| `config.js` | All modules | CONFIG object (thresholds, values, colors, specs) |
| `progression.js` | food.js, game.js, phone.js | `{blinkProbability, comboProbability, phoneTier, phoneGraceActive}` |
| `scoring.js` | game.js, combo.js | Numeric score values (pure calculation results) |
| `combo.js` | game.js | `{ value, label }` from handleFoodEaten() |
| `game.js` | score-popup.js | Score value, grid coordinates, label string |
| `game.js` | combo.js | pause/resume calls, food eaten delegation |
| `game.js` | phone.js | show/dismiss calls, scheduling triggers |
| `game.js` | cognitive-feedback.js | `cognitiveStats` object on death |
| `cognitive-feedback.js` | game.js (via DOM event) | `'cognitive-feedback-done'` event → show Play Again |
| `game.js` | analytics.js | gameState snapshot (cognitiveStats + analyticsState + live state) at each event |
| `analytics.js` | External (Plausible) | Fire-and-forget tracking events via `plausible()` custom events — non-blocking, graceful degradation |
| `effects.js` | scoring.js (via gameState) | `wallPhaseUsed` boolean for conditional scoring |

**External (unchanged from v1):**
- None (pure client-side, no API calls)
- Analytics deferred to post-MVP

### Development Workflow (unchanged from v1)

```bash
# Local development
cd CrazySnakeLite
python -m http.server 8000
# Open http://localhost:8000

# Or VS Code Live Server: Right-click index.html → "Open with Live Server"

# Deployment: GitHub Pages or Netlify/Vercel (auto-deploy on push)
```

---

## V2 Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All 10 v2 architectural decisions work together without conflicts:
- `scoring.js` (pure calculation) → `game.js` (orchestrator) → `score-popup.js` (pure UI) — clean unidirectional flow
- `progression.js` (pure lookup) feeds thresholds to food.js, game.js, phone.js — single source of truth, no circular dependencies
- `combo.js` (state machine) delegates scoring to `scoring.js`, canvas visuals to CSS classes — proper separation of concerns
- `phone.js` (self-contained) queries `progression.js` for scheduling, `scoring.js` for bonuses — no ownership conflicts
- Guard clause orchestration in `game.js` keeps cross-system rules explicit and co-located
- `cognitive-feedback.js` (pure UI) receives stats from `game.js` (orchestrator) — same unidirectional pattern as score-popup.js
- RC SURVIVED flash reuses `score-popup.js` ephemeral DOM lifecycle — no new pattern introduced

**Pattern Consistency:**
All v2 patterns extend v1 without contradiction:
- 6 new modules follow named exports, camelCase, explicit gameState passing — identical to v1
- `{ type, scoreValue }` effect data format is consistent across combo↔scoring↔game boundaries
- DOM lifecycle pattern (`animationend` cleanup) is uniform for all ephemeral elements
- CSS class-based state management applies uniformly (phone overlay states, combo canvas)
- Asset path naming follows single convention: `assets/sounds/{cat}-{desc}.mp3`, `assets/callers/{name}.png`

**Structure Alignment:**
V2 project structure directly supports all architectural decisions:
- 20 modules map to responsibilities with no overlaps
- 6 new modules have single, well-defined purposes
- Boundary rules are explicit and non-conflicting
- Data flow diagrams show clean producer→consumer paths

### Requirements Coverage Validation ✅

**Food v2 System — All Requirements Covered:**
- Fibonacci scoring values (0/+1/+2/+1|3/+5/+8) → `scoring.js` + `config.js`
- Score popup system (5 visual tiers) → `score-popup.js` + CSS @keyframes
- Progressive blinking food (score 15+, escalating to 60% cap) → `food.js` + `progression.js` + `render.js`
- Food color cycling (200ms, 6 colors) → `game.js` updates `blinkCycleIndex`, `render.js` reads
- Food drop shadow (spatial anchoring) → `render.js`
- Mystery food tooltip (first encounter) → `game.js` + `gameState.ui.mysteryFoodTooltipShown`
- Combo mode activation (probability-based, score 40+) → `game.js` + `progression.js`
- Combo canvas transition (500ms fade to dark) → `combo.js` + CSS transition + custom property
- Striped snake rendering (alternating A/B colors) → `render.js` reads `combo.effectA/B.type`
- Multiplicative scoring (A × B) → `scoring.calculateComboScore()`
- Combo lifecycle (3-food: activate → effect B → exit) → `combo.js` state machine

**Phone Calls v2 System — All Requirements Covered:**
- Two-button overlay (End + Pick Up) → `phone.js` DOM + CSS class states
- Fibonacci Pick Up bonus (+2 to +34) → `scoring.js` + `config.js` PHONE_PICKUP_FIBONACCI
- Score-based grace period (no calls until score >= 3) → `progression.js` + `config.js` PHONE_GRACE_SCORE
- Score-based call frequency (5 tiers) → `progression.js` + `config.js` PHONE_CALL_TIERS
- Variable Pick Up timer (1-3s) + countdown bar → `phone.js` internal
- 21 callers with portraits + one-liners → `phone.js` CALLERS data + `assets/callers/`
- Pick Up irreversibility → `phone.js` state machine (ringing → pickedUp, no back)
- Consolation reward on death → `game.js` onDeath() checks `phoneCall.pickedUp`
- Portrait fallback → `<img>` onerror → `assets/PhoneIcone01_256px.png`

**Cognitive Feedback System — All Requirements Covered:**
- RC SURVIVED flash (FR70-FR72) → `game.js` onFoodEaten() detects RC survival, `score-popup.js` spawnFlash()
- Post-game cognitive stats (FR75-FR80) → `cognitiveStats` in gameState, `cognitive-feedback.js` display
- 6 cognitive stats tracked (FR76) → incremented in `game.js` event handlers
- Top 2-3 non-zero stats displayed (FR77) → `cognitive-feedback.js` stat selection logic
- Stagger animation + Play Again delay (FR78-FR79) → `cognitive-feedback.js` timing sequence
- Stats reset on new game (FR80) → `state.js` resetGame()

**Cross-System Interaction Rules — All Covered:**
- Combo pauses during phone → `game.js` orchestration: `combo.pause()` / `combo.resume()`
- Combo transition delays 200ms when phone active → `combo.js` guard clause
- Popup stagger 300ms → `score-popup.js` checks `lastPopupTime`
- Death reward stacking (combo + phone) → `game.js` onDeath()
- Phone bonus labeled "CALL BONUS" → popup label convention
- Z-index hierarchy (canvas:0, popups:200, tooltips:300, phone:400) → CSS

**Accessibility — Covered:**
- Reduced motion detection → `main.js` → `CONFIG.REDUCED_MOTION`
- CSS custom properties for animation durations
- `@media (prefers-reduced-motion)` overrides in style.css

**Non-Functional Requirements — V2 Impact Assessed:**
- Performance: Fixed timestep unchanged. DOM popups use CSS animations (GPU-composited). Audio priority prevents concurrent playback overload. Blink cycling is a single modulo per frame.
- Browser compatibility: All v2 features use standard CSS (transitions, @keyframes, custom properties) and standard DOM APIs. No experimental features.
- Maintainability: 6 new modules, each single-purpose. Scoring economy auditable in one file. Progression thresholds tunable in config.

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All 10 v2 decisions documented with rationale, code examples, and API surfaces
- Decision dependency chain mapped (config → progression → consumers; config → scoring → game → popup)
- Module boundaries explicit with producer/consumer table
- Data flow diagrams for all 3 major scenarios (food eating, phone call, death)

**Structure Completeness:**
- 20 JS modules defined with responsibilities and FR mapping
- Complete directory tree with 49 asset files enumerated
- V2 index.html structure showing new DOM elements
- CSS organization plan with section comments and z-index hierarchy

**Pattern Completeness:**
- 8 v2-specific consistency patterns with code examples
- Anti-pattern table for AI agent guidance
- V1 patterns confirmed as carried forward unchanged
- Enforcement guidelines explicit for both v1 and v2 rules

### Gap Analysis Results

**Critical Gaps:** None

**Minor Observations (implementation-time clarification, not blocking):**
1. **`feedback.js` vs `score-popup.js` vs `cognitive-feedback.js` — No overlap, no consolidation needed.** `feedback.js` is the email feedback modal system (star ratings, character counter, mailto submission). `score-popup.js` manages ephemeral game-triggered DOM popups and RC SURVIVED flashes. `cognitive-feedback.js` manages the post-game "Your Brain Today" display. All three are valid DOM-accessing modules with distinct lifecycles and purposes. No deprecation or consolidation required.
2. Phone ring audio looping strategy (Web Audio loop property vs re-trigger on interval) — implementation detail within `audio.js`
3. Exact combo canvas color selection algorithm (random from 4 vs round-robin) — implementation detail within `combo.js`

### V2 Architecture Completeness Checklist

**✅ V2 Requirements Analysis**
- [x] Three v2 design documents thoroughly analyzed
- [x] Scale reassessed (Low → Medium complexity)
- [x] V1 foundations validated (8 hold unchanged, 8 break/evolve)
- [x] Cross-system interaction rules mapped (5 coordination points)
- [x] New cross-cutting concerns identified (5 new)

**✅ V2 Architectural Decisions**
- [x] 10 critical v2 decisions documented with rationale and code examples
- [x] Decision dependency chain mapped
- [x] Deferred decisions explicitly noted (test runner, color-blind shapes, haptics)
- [x] All decisions compatible with v1 foundations

**✅ V2 Implementation Patterns**
- [x] 8 v2-specific consistency patterns defined with examples
- [x] Anti-pattern table for AI agent guidance
- [x] V1 patterns confirmed as unchanged
- [x] Enforcement guidelines updated for combined v1+v2

**✅ V2 Project Structure**
- [x] Complete v2 directory tree (20 modules, 49 assets)
- [x] Module responsibility/FR mapping table
- [x] V2 architectural boundaries and rules
- [x] V2 data flow diagrams (food, phone, death)
- [x] V2 index.html structure and CSS organization

**✅ V2 Validation**
- [x] Coherence: All decisions work together
- [x] Coverage: All v2 requirements architecturally supported
- [x] Readiness: AI agents can implement consistently
- [x] Gaps: None critical, 3 minor implementation-time notes

### V2 Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Zero-dependency stack confirmed into v2 — no supply chain risk
- Score-based progression engine centralizes all threshold logic — single tuning point for Celia's game design
- Pure scoring module makes the entire Fibonacci economy auditable in one file
- Guard clause orchestration is explicit, testable, debuggable — appropriate for 5 coordination points
- 6 new modules each have surgical, non-overlapping responsibilities
- V1 patterns hold unchanged — implementation continuity preserved
- Comedy-first design (tech pun callers, one-liners) has clear architectural support (CALLERS data, DOM reveal)

**Areas for Future Enhancement:**
- Test runner upgrade (deferred to Test Architect workflow)
- Color-blind shape coding for food types (post-launch)
- Haptic feedback on mobile (post-launch)
- `feedback.js` consolidation with `score-popup.js` (story creation time)

---

## V2 Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow V2:** COMPLETED ✅
**Total Steps Completed:** 8 (v1) + 9 (v2 evolution)
**V1 Completed:** 2026-01-23
**V2 Completed:** 2026-02-07
**V2 Updated:** 2026-02-08 (Decision 9 + threshold alignment with PRD v2.0)
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### V2 Final Architecture Deliverables

**Complete V2 Architecture Document**
- V1 architecture preserved in full (foundation)
- V2 evolution appended: context analysis, stack confirmation, 10 decisions, 8 patterns, project structure, validation
- 3 design documents fully incorporated (food-v2, phone-calls-v2, ux-design-food-phone-v2)

**V2 Implementation Ready Foundation**
- 10 v2 architectural decisions made with Tomoco
- 8 v2 implementation patterns defined (extending v1 patterns)
- 20 JavaScript modules specified (14 v1 + 6 new)
- 49 asset files enumerated (27 audio + 21 portraits + 1 fallback)
- All v2 functional requirements architecturally supported

**AI Agent Implementation Guide (V2)**
- Technology stack: Vanilla JS, ES6 modules, HTML5 Canvas + DOM overlays (unchanged)
- V2 consistency rules preventing implementation conflicts across combo/phone/scoring systems
- Complete v2 project structure with boundaries
- Data flow diagrams for all major v2 scenarios
- Cross-system orchestration rules with code examples

### V2 Implementation Handoff

**For AI Agents:**
This architecture document is the complete guide for implementing CrazySnakeLite v2. Follow ALL decisions (v1 + v2), patterns, and structures exactly as documented.

**V2 Implementation Sequence:**
1. Extend `config.js` with all v2 parameters (Fibonacci values, thresholds, tiers, colors)
2. Extend `state.js` with v2 gameState fields (combo, phone v2, effects, ui, cognitiveStats)
3. Create `scoring.js` (pure calculation module — foundation for everything)
4. Create `progression.js` (score → tier resolution — feeds food, game, phone)
5. Create `score-popup.js` (DOM popup system — CSS animations, particles, shake, RC SURVIVED flash)
6. Create `combo.js` (combo state machine — 3-phase lifecycle)
7. Create `cognitive-feedback.js` (post-game "Your Brain Today" display — stat selection, stagger animation)
8. Evolve `phone.js` (two-button UI, Pick Up timer, portraits, one-liners)
9. Evolve `food.js` (blinking determination via progression.js)
10. Evolve `effects.js` (wallPhaseUsed tracking)
11. Evolve `render.js` (blink colors, striped snake, combo canvas, food shadows)
12. Evolve `game.js` (cross-system orchestration, popup triggering, blink cycling, cognitiveStats tracking, cognitive feedback integration on death)
13. Evolve `audio.js` (v2 sounds, priority system)
14. Evolve `input.js` (Enter key for Pick Up)
15. Update `index.html` (popup container, phone v2 overlay, mystery tooltip, cognitive stats section in game over)
16. Update `style.css` (v2 sections: popups, particles, combo, phone v2, RC flash, cognitive stats, reduced motion)

### V2 Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All v2 decisions work together without conflicts
- [x] V2 decisions are compatible with v1 foundations
- [x] V2 patterns extend v1 without contradiction
- [x] V2 structure supports all architectural decisions

**✅ Requirements Coverage**
- [x] All Food v2 requirements supported
- [x] All Phone Calls v2 requirements supported
- [x] All cross-system interaction rules covered
- [x] Accessibility requirements addressed

**✅ Implementation Readiness**
- [x] Decisions are specific with code examples and API surfaces
- [x] Patterns prevent agent conflicts across v2 systems
- [x] Structure is complete with 20 modules and 49 assets
- [x] Data flow diagrams guide implementation order

---

**Architecture Status:** READY FOR V2 IMPLEMENTATION ✅

**Next Phase:** Create epics and stories from v2 architecture, then begin implementation.

**Document Maintenance:** Update this architecture when major technical decisions are made during v2 implementation.

---

# V3 Architecture Evolution — Cognitive Dashboard MVP

_This section extends the v1+v2 architecture with decisions for the Cognitive Dashboard MVP: metrics engine, enhanced post-game highlights, Skill Map dashboard, calibration period, streak system, and comedy integration. Adds 4 new modules, expands storage layer, introduces `'skillmap'` phase._

_V3 evolution started: 2026-02-15_

---

## V3 Project Context Analysis

### New Design Inputs

Three new/updated design documents drive this architecture evolution:

1. **PRD v2.1** (updated 2026-02-15) — Integrated Cognitive Dashboard MVP into V2 scope. Added 56 new FRs (FR150-205) and 25 new NFRs (NFR43-67). Updated Success Criteria, User Journeys, Innovation, Scoping, Technical Requirements.
2. **ux-design-cognitive-dashboard.md** (2026-02-15) — Sally's comprehensive UX design for three dashboard surfaces: post-game highlights (Layer 1), Skill Map (Layer 2), trends (Layer 3, future). Key decision: pixel block bars (not radar chart) for visual consistency with the game's grid-based aesthetic. Renamed "Brain Map" → "Skill Map", "Your Brain Today" → "Recap", "Calibrating your brain..." → "Warming up..."
3. **product-brief-CrazySnakeLite-2026-02-15.md** — Business case and competitive positioning for the Cognitive Dashboard. Positions CrazySnake as "Duolingo of casual brain training." MVP success criteria: 60%+ skill map view rate, 70%+ calibration completion, +15% D7 retention lift, 80%+ post-game highlights engagement, 50%+ streak adoption.

### New Functional Requirements Summary

**56 FRs (FR150-FR205) across 6 feature areas:**

| Feature Area | FRs | Architectural Impact |
|---|---|---|
| **Metrics Data Engine** | FR150-160 | New storage layer (IndexedDB), new calculation module, session-level data capture, rolling 10-session average engine |
| **Enhanced Post-Game Summary (Layer 1)** | FR161-170 | Existing `cognitive-feedback.js` evolves — priority algorithm, comedy quotes, variety enforcement, Skill Map button, streak counter |
| **Skill Map Dashboard (Layer 2)** | FR171-182 | Entirely new screen + phase. DOM-based pixel block bars, callout cards, comedy quotes, responsive layout |
| **Calibration Period** | FR183-189 | Cross-cutting state affecting post-game, Skill Map, and menu displays. 5-session threshold. Unlock celebration event. |
| **Streak System** | FR190-198 | Date-based tracking, calendar day logic, timezone handling, gentle messaging, ethical guardrails |
| **Comedy Integration** | FR199-205 | Performance-contextual quote selection, 21 callers × 3+ quotes per context, domain-specific pools |

**25 NFRs (NFR43-67) across 4 categories:**

- **Data Accuracy (NFR45-50):** Deterministic metrics, 100% event capture, 500ms post-session update, ±5% visualization accuracy, timezone-aware streaks
- **Dashboard Performance (NFR51-55):** Highlights render within 300ms, Skill Map loads within 500ms, 60 FPS animations, metric recalculation within 200ms
- **Storage & Privacy (NFR56-61):** 100+ sessions stored, < 5MB total, survives browser restarts, zero server transmission, data export/deletion accessible
- **Dashboard Usability (NFR62-67):** Comprehensible in 10 seconds, intuitive dot ratings, clear calibration UX, celebratory tone, contextual comedy, gentle streak messaging

### UX Design Decisions with Architectural Impact

Sally's UX design document made decisions that directly shape the architecture:

| UX Decision | Architectural Implication |
|---|---|
| **Pixel block bars (not radar chart)** | DOM-based rendering (like phone overlay), no Canvas needed. Consistent with existing overlay pattern. |
| **"Skill Map" vocabulary** | New phase constant `'skillmap'`, DOM IDs, button labels all use this term. Code matches player-facing vocabulary. |
| **Three surfaces** | Layer 1 (post-game, hot moment) evolves existing screen. Layer 2 (Skill Map, cool moment) is entirely new screen. Layer 3 (trends) is deferred. |
| **Skill Map replaces Menu on game-over** | Navigation flow change — ESC becomes the menu escape route from game-over |
| **Calibration placeholder on Skill Map** | Same screen, two render paths (calibrating vs. unlocked). Empty block bars shown as placeholder. |
| **5-block scale** | Normalized 0-1 metric → integer 1-5 mapping. Honest granularity matching our data confidence. |
| **Comedy quote pools** | Structured data: domain × context × caller → quote. Minimum 63 quotes (21 callers × 3 contexts). |
| **Z-index: Dashboard at 350** | Between phone overlay (400) and tooltips (300). New layer in the visual hierarchy. |

### V1+V2 Foundations That Hold

| Decision | V3 Status | Notes |
|---|---|---|
| Fixed timestep + RAF game loop | **Holds** | Dashboard is between-game, not in-game |
| Vanilla JS + ES6 modules | **Holds** | New modules follow same pattern |
| Canvas for game + DOM for overlays | **Holds** | Skill Map is DOM overlay, pixel block bars are DOM |
| Single gameState object | **Holds, extends** | New dashboard and metrics fields |
| Config-driven parameters | **Holds, expands** | Metric weights, calibration threshold, highlight priorities, quote pools |
| Named exports + explicit state passing | **Holds** | Same pattern for all new modules |
| Guard clause orchestration (not event bus) | **Holds** | Death → session save → highlight selection is sequential |
| camelCase / SCREAMING_SNAKE_CASE naming | **Holds** | Same conventions |
| { x, y } positions, hex colors, ms time | **Holds** | Same data formats |

### What Changes in V3

| V2 Reality | V3 Reality | Architectural Impact |
|---|---|---|
| `localStorage` for high score only | IndexedDB for session history + localStorage for profile/streak/calibration | Storage module becomes async, multi-backend |
| Simple stat lines + Play Again/Menu on game-over | Enhanced highlights with priority algorithm, comedy quotes, Skill Map button, streak counter, calibration progress | `cognitive-feedback.js` major evolution |
| 3 phases: menu, playing, gameover | 4 phases: +`skillmap` | Phase transitions, screen show/hide, input routing expand |
| Single "New Game" button on menu | "New Game" + "Skill Map" | Menu navigation expands from 1 to 2 buttons |
| Flat stats tracked, displayed once, discarded | Tracked → stored → aggregated → calculated → displayed over time | Entirely new data flow layer |
| High score as only between-session state | Session history, domain scores, calibration state, streak, highlight history | Significant persistent state expansion |
| `cognitiveStats` reset on new game, never persisted | `cognitiveStats` still resets per game, but session snapshot saved to IndexedDB before reset | Session lifecycle becomes a first-class concept |

### New Cross-Cutting Concerns

1. **Async Storage Abstraction** — IndexedDB is async. All storage access wrapped as async for consistency and future cloud-readiness. Consuming code uses `await`.
2. **Session Lifecycle** — A "session" is now first-class: starts on New Game, ends on death, snapshot saved to storage, feeds metrics engine. Spans game.js → storage → metrics.
3. **Calibration State** — Affects post-game screen (highlights vs. skill map button label), Skill Map screen (placeholder vs. full bars), and main menu (button label). Cross-cutting display concern read from storage.
4. **Comedy Quote System** — Structured data (domain × context × quote pool) consumed by both highlights (post-game) and dashboard (Skill Map). Shared data source in config.js or quotes.js.
5. **Metric Normalization Pipeline** — Raw gameplay events → per-session raw metrics → rolling 10-session average → normalized 0-1 → 5-block integer. Multi-stage pipeline.

### Storage Architecture Decision

**Local-first for V3 MVP, cloud-ready by design.**

- **IndexedDB** for session history (structured, queryable, 100+ sessions, < 5MB total)
- **localStorage** for aggregated profile, streak, calibration state, highlight history (fast reads for UI rendering)
- **Async interface** on all storage access — even localStorage wrapped as async. When cloud arrives in Horizon 2, swap the adapter without touching consuming code.
- **No server, no account, no data transmission.** Privacy by default is a competitive advantage.

```
Dashboard UI  →  metrics.js  →  storage.js (async interface)
                                     │
                            ┌────────┴────────┐
                            │  V3: IndexedDB  │
                            │  + localStorage │
                            └─────────────────┘
                                     │  (Horizon 2)
                            ┌────────┴────────┐
                            │  Cloud adapter  │
                            │  local + sync   │
                            └─────────────────┘
```

## V3 Starter Template Evaluation

### Stack Confirmation: No Change

The v1+v2 technology stack holds for V3. The Cognitive Dashboard features were designed to work within this stack:

| Aspect | V2 Decision | V3 Status |
|---|---|---|
| **Language** | Vanilla JavaScript (ES6+) | **Confirmed** — no framework needed |
| **Rendering** | HTML5 Canvas + DOM overlays | **Confirmed** — Skill Map and highlights are DOM overlays (pixel block bars = DOM divs, not Canvas) |
| **Styling** | Plain CSS | **Confirmed** — block bars, animations, responsive layout all via CSS |
| **Build** | None — direct file serving | **Confirmed** — zero-dependency deployment preserved |
| **Modules** | ES6 modules (`type="module"`) | **Confirmed** — 4 new modules follow same pattern |
| **Dependencies** | Zero runtime | **Confirmed** — IndexedDB is a browser API, not a dependency |
| **Storage** | localStorage only | **Expands** — IndexedDB added for session history. localStorage retained for profile/streak. Both browser-native. |

**Why no framework for the dashboard:** The Skill Map screen is ~50-60 DOM elements at most. Post-game highlights are 3-5 elements. Vanilla JS + CSS is straightforward. Adding React or similar would introduce 40KB+ of runtime for layout that changes once per game session.

**Why no external IndexedDB library (Dexie, idb):** Our usage is simple — one object store, sequential writes, range reads. A thin async wrapper in storage.js (~50 lines) covers our needs without adding CrazySnake's first runtime dependency.

**CSS Organization:** V3 adds ~150-200 lines of CSS. Organized with comment sections:

```css
/* === Skill Map Dashboard === */
/* === Block Bars === */
/* === Calibration State === */
/* === Post-Game Highlights V3 === */
/* === Streak Display === */
/* === Dashboard Responsive === */
```

---

## V3 Core Architectural Decisions

### Decision Priority Analysis

**All 6 V3 Decisions — Made:**

| # | Decision | Choice | Key Principle |
|---|---|---|---|
| 11 | Storage Layer Architecture | Async abstraction — IndexedDB for sessions, localStorage for profile/streak. Cloud-ready interface. | One interface, swap backends later |
| 12 | Metrics Calculation Engine | Pure functions. Raw session data → normalized 0-1 → 5-block scale. Rolling 10-session window with recency weighting. | Testable, tunable, honest granularity |
| 13 | Enhanced Highlight System | Priority algorithm (PB > Improvement > Notable > Growth) + variety enforcement + comedy quotes. highlights.js (pure) + cognitive-feedback.js (DOM). | Separation of selection from display |
| 14 | Skill Map Dashboard | DOM overlay. Pixel block bars. Two render paths: calibrating vs unlocked. Reads storage, never calculates. | Render from data, don't compute in UI |
| 15 | Streak System | Calendar-day tracking. Timezone-aware. Ethical messaging. localStorage-backed. | Simple, gentle, local |
| 16 | Phase System, Navigation & Extended gameState | `'skillmap'` phase. Updated button routing. Session lifecycle in onDeath. gameState extends with session tracking fields. | Extend, don't restructure |

**Deferred Decisions:**
- Trend graphs (Layer 3 analytics) — deferred to Dashboard V2
- Social sharing / brain map cards — deferred to Dashboard V2
- Cloud sync adapter — deferred to Horizon 2
- Cross-device sync — requires accounts, deferred to Horizon 2

### Decision 11: Storage Layer Architecture

**Decision:** `storage.js` evolves from simple key/value to an async storage abstraction layer. IndexedDB stores session history (structured, queryable). localStorage stores aggregated profile, streak state, calibration state, and highlight history. All public functions return Promises — even localStorage wrappers — for future cloud-readiness.

**Rationale:** IndexedDB is the right tool for session history — structured records, indexed queries, no size concerns for 100+ sessions at ~500 bytes each. localStorage is the right tool for the aggregated profile — fast synchronous reads for UI rendering, wrapped async for interface consistency. The async boundary means a Horizon 2 cloud adapter slots in without changing any consuming code.

**Requirements Covered:** FR157-158 (local storage, cross-session persistence), NFR56-61 (100+ sessions, < 5MB, durable, private)

**IndexedDB Schema:**

```javascript
// Database: 'crazysnake-cognitive', version 1
// Object store: 'sessions'
//   - keyPath: 'sessionId' (UUID string)
//   - Indexes: 'timestamp' (for range queries, ordering)

// Per-session record shape:
{
  sessionId: crypto.randomUUID(),
  timestamp: Date.now(),
  score: 67,
  snakeLength: 22,    // segments.length at death
  duration: 145000,   // ms from game start to death

  // Raw per-session metric inputs (calculated at death from cognitiveStats + analyticsState)
  metrics: {
    avgPhoneReactionTime: 1200,     // ms — avg time from phone show to End/PickUp
    spatialCoverage: 0.044,          // snakeLength / totalGridCells
    rcSurvivalRate: 0.75,            // rcSurvived / totalRCEncountered (or null if no RC)
    phoneSurvivalRate: 0.83,         // phone calls survived / total phone calls (or null)
    avgPhoneDecisionTime: 1100,      // ms — avg End/PickUp decision time
    pickUpRate: 0.67,                // totalPickUps / totalPhoneCalls (or null)
    comboCompletionRate: 0.50,       // combos completed / combos triggered (or null)
    avgComboScore: 18                // avg multiplicative combo score (or null)
  },

  // Event counts (snapshot of cognitiveStats + analyticsState at death)
  events: {
    rcSurvived: 3,
    rcEncountered: 4,
    phoneCallsManaged: 6,
    pickUps: 4,
    ends: 2,
    mysteryFoodsEaten: 5,
    comboMultipliers: 2,
    combosTriggered: 3,
    peakComboScore: 24
  }
}
```

**localStorage Keys:**

```javascript
// Aggregated profile (recalculated after each session)
'crazysnake_profile' → JSON: {
  domainScores: {
    reactionTime: 3,          // 1-5 block scale
    spatialAwareness: 4,
    cognitiveFlexibility: 3,
    dividedAttention: 4,
    impulseControl: 3,
    workingMemory: 2
  },
  previousDomainScores: {...}, // for growth indicator arrows
  totalSessions: 47,
  calibrationComplete: true
}

// Streak data (separate for fast read/write on each game)
'crazysnake_streak' → JSON: {
  currentStreak: 12,
  lastPlayedDate: '2026-02-15'  // ISO date string, local timezone
}

// Highlight history (for variety enforcement)
'crazysnake_highlights' → JSON: {
  lastPattern: ['personal_best', 'notable_event']  // priority types from last session
}

// Existing (unchanged)
'crazysnakeLite_highScore' → number
```

**storage.js Async API:**

```javascript
// storage.js — Async storage abstraction

// === Session History (IndexedDB) ===

export async function saveSession(sessionRecord) {
  // Writes session to IndexedDB 'sessions' store
  // Returns: void (fire-and-forget from caller's perspective)
}

export async function getSessions(limit = 10) {
  // Reads last N sessions ordered by timestamp descending
  // Returns: array of session records
}

export async function getSessionCount() {
  // Returns: total number of sessions stored
}

// === Aggregated Profile (localStorage, wrapped async) ===

export async function getProfile() {
  // Returns: profile object or null if no profile yet
}

export async function updateProfile(profile) {
  // Writes profile to localStorage
}

// === Streak (localStorage, wrapped async) ===

export async function getStreak() {
  // Returns: { currentStreak, lastPlayedDate } or defaults
}

export async function updateStreak(streakData) {
  // Writes streak to localStorage
}

// === Highlight History (localStorage, wrapped async) ===

export async function getHighlightHistory() {
  // Returns: { lastPattern } or defaults
}

export async function updateHighlightHistory(history) {
  // Writes highlight history to localStorage
}

// === Existing (unchanged) ===

export function loadHighScore() { /* existing sync impl */ }
export function saveHighScore(score) { /* existing sync impl */ }

// === Storage Init ===

export async function initStorage() {
  // Opens IndexedDB database, creates object stores if needed
  // Called once during app init (main.js)
  // Graceful degradation: if IndexedDB unavailable, logs warning
  //   and session save becomes no-op. Profile/streak still work via localStorage.
}
```

**Graceful Degradation:** If IndexedDB is blocked (private browsing in some browsers), `initStorage()` catches the error, logs a warning, and sets an internal flag. `saveSession()` becomes a no-op. `getSessions()` returns an empty array. The dashboard shows calibration state indefinitely (no sessions = no unlock). The game is always playable.

**Cross-Browser Isolation (Known Limitation):** IndexedDB and localStorage are sandboxed per browser engine. A player using Chrome and Firefox on the same device gets two fully separate databases — two Skill Maps, two streaks, two session histories. Same-browser-different-profiles are also isolated. This is inherent to all browser-local storage and is the industry standard for pre-account browser games (Wordle, Cookie Clicker, 2048). For V3 MVP, one browser = one player profile. The async storage interface is designed so that a Horizon 2 cloud adapter can unify cross-browser and cross-device data by swapping the backend without changing consuming code.

**Integration Points:**
- `main.js` calls `initStorage()` on app load (before first game)
- `game.js` `onDeath()` calls `saveSession()` after building the session record
- `metrics.js` calls `getSessions()` to get the rolling window
- `dashboard.js` calls `getProfile()` to render the Skill Map
- `streak.js` calls `getStreak()` / `updateStreak()`
- `highlights.js` calls `getHighlightHistory()` / `updateHighlightHistory()`

### Decision 12: Metrics Calculation Engine

**Decision:** `metrics.js` — pure function module. Takes session history array, returns 6 normalized domain scores (0-1). No DOM access, no state mutation. Configurable normalization ranges in config.js. 5-block mapping is a simple integer conversion.

**Rationale:** Separating metric calculation from display keeps metrics testable, auditable, and tunable. The normalization ranges will need calibration against real gameplay data — having them in config.js means tuning without code changes. Rolling 10-session window with recency weighting ensures metrics feel responsive to improvement without being volatile.

**Requirements Covered:** FR150-160 (metrics engine), NFR45-50 (accuracy, determinism)

**API Surface:**

```javascript
// metrics.js — Pure calculation, no DOM, no state

export function calculateDomainScores(sessions) {
  // Input: array of session records (most recent 10, from storage)
  // Output: { reactionTime, spatialAwareness, cognitiveFlexibility,
  //           dividedAttention, impulseControl, workingMemory }
  //         Each value: 0.0 to 1.0 (normalized)
  // Returns null if sessions.length === 0
}

export function toBlockScale(normalizedScore) {
  // Input: 0.0 to 1.0
  // Output: 1 to 5 (integer)
  // Mapping: 0.00-0.19→1, 0.20-0.39→2, 0.40-0.59→3, 0.60-0.79→4, 0.80-1.00→5
}

export function calculateGrowthIndicators(currentScores, previousScores) {
  // Input: two domain score objects (current vs previous session's profile)
  // Output: { reactionTime: 'improved'|'stable'|'declined', ... }
  // Rule: change >= 1 full block = indicator shown. Otherwise 'stable'.
}
```

**Domain Calculation Formulas:**

Rolling window uses recency weighting — most recent session has ~2x the influence of the oldest:

```javascript
// Recency weights for 10-session window:
const RECENCY_WEIGHTS = [1.0, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65, 0.60, 0.55];
```

| Domain | Raw Input | Normalization | Direction |
|---|---|---|---|
| **Reaction Time** | `avgPhoneReactionTime` (ms) | CONFIG range: 400ms (fast/5) to 2000ms (slow/1) | Lower = better (inverted) |
| **Spatial Awareness** | `snakeLength / totalGridCells` | CONFIG range: 0.01 (short/1) to 0.10 (long/5) | Higher = better |
| **Cognitive Flexibility** | `rcSurvivalRate` | CONFIG range: 0.0 (never/1) to 1.0 (always/5) | Higher = better |
| **Divided Attention** | `phoneSurvivalRate × 0.6 + (1 - normalizedDecisionTime) × 0.4` | Composite: survival rate + speed | Higher = better |
| **Impulse Control** | Pick Up rate mapped to bell curve (peak at 40%) | CONFIG: 0-20% or 80-100% = low, 30-50% = high | Bell curve |
| **Working Memory** | `comboCompletionRate × 0.5 + normalizedComboScore × 0.5` | Composite: completion + score quality | Higher = better |

**Impulse Control — Bell Curve Rationale:** Per Celia's framework (Q2), 30-50% Pick Up rate indicates deliberate risk assessment, not compulsive risk-taking (>60%) or reflexive safety (<20%). The normalization maps 40% Pick Up rate to 1.0 with falloff toward both extremes. This is the one domain where "more" isn't always better.

**Config.js Dashboard Parameters:**

```javascript
DASHBOARD: {
  CALIBRATION_SESSIONS: 5,
  ROLLING_WINDOW: 10,
  RECENCY_WEIGHTS: [1.0, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65, 0.60, 0.55],

  METRIC_RANGES: {
    reactionTime: { min: 400, max: 2000, inverted: true },
    spatialAwareness: { min: 0.01, max: 0.10, inverted: false },
    cognitiveFlexibility: { min: 0.0, max: 1.0, inverted: false },
    dividedAttention: { min: 0.0, max: 1.0, inverted: false },
    impulseControl: { peak: 0.4, falloff: 0.2 },
    workingMemory: { min: 0.0, max: 1.0, inverted: false }
  },

  BLOCK_SCALE: [
    { min: 0.00, max: 0.19, blocks: 1 },
    { min: 0.20, max: 0.39, blocks: 2 },
    { min: 0.40, max: 0.59, blocks: 3 },
    { min: 0.60, max: 0.79, blocks: 4 },
    { min: 0.80, max: 1.00, blocks: 5 }
  ]
}
```

**Null Handling:** Sessions where a metric input is null (e.g., no phone calls → no reaction time) are excluded from that domain's weighted average. If ALL sessions in the window lack data for a domain, that domain returns null and displays as 0 filled blocks with no growth indicator.

### Decision 13: Enhanced Highlight System

**Decision:** `highlights.js` — new module for highlight selection logic (pure functions). `cognitive-feedback.js` retains DOM rendering responsibility but calls `highlights.js` for content selection. Comedy quotes selected by context from structured data in config.js.

**Rationale:** Separating selection logic (pure, testable) from DOM rendering (side effects) follows the V2 pattern of scoring.js (pure) vs score-popup.js (DOM). Variety enforcement requires session history comparison — a pure function concern, not a display concern.

**Requirements Covered:** FR161-170 (enhanced post-game summary), NFR65 (celebratory tone), NFR66 (contextual comedy)

**highlights.js API:**

```javascript
// highlights.js — Pure selection logic, no DOM

export function selectHighlights(currentSession, sessionHistory, lastHighlightPattern) {
  // Input:
  //   currentSession: the just-completed session record
  //   sessionHistory: previous sessions for comparison
  //   lastHighlightPattern: array of highlight types from previous session
  // Output: array of 2-3 highlight objects:
  //   [{ type, stat, value, text, icon, isPersonalBest }]
  // Priority: Personal Best > Biggest Improvement > Notable Event > Growth Opportunity
  // Variety: at least one type must differ from lastHighlightPattern
}

export function selectPerformanceQuote(highlights, callerPool) {
  // Input: selected highlights + available caller quotes
  // Output: { callerName, callerPortrait, quote }
  // Context-aware: high RC → empathetic quotes, personal best → celebratory, etc.
}
```

**Highlight Priority Types:**

| Priority | Type | Trigger | Icon | Narrative Purpose |
|---|---|---|---|---|
| 1 | `personal_best` | Any tracked stat exceeds all-time high | ★ | Competence rush |
| 2 | `improvement` | Largest positive delta from rolling 10-session avg | ▲ | Growth visibility |
| 3 | `notable_event` | Threshold crossed (first combo, 5+ RC survived) | ✦ | Surprise + delight |
| 4 | `growth_opportunity` | Weakest domain that player engaged with | ↑ | Gentle forward pull |

**Variety Enforcement:** If `lastHighlightPattern` was `['personal_best', 'notable_event']`, the new selection must include at least one different type. After selecting by priority, check overlap with last pattern. If all types repeat, demote the lowest-priority repeat and promote the next available different type.

**cognitive-feedback.js Evolution:**

The existing module keeps DOM rendering but gains:
- Calls `highlights.selectHighlights()` instead of internal `selectTopStats()`
- Renders highlight icons (★, ▲, ✦, ↑) alongside text
- Renders comedy caller quote below highlights
- Renders streak counter at bottom
- Renders calibration progress during sessions 1-5
- "Skill Map" button replaces "Menu" button
- Header change: "Your Brain Today" → "RECAP"
- Updated timing sequence per UX spec

```javascript
// cognitive-feedback.js — V3 evolution
export async function showPostGameScreen(gameState, currentSession) {
  // 1. Get session history + highlight history from storage
  // 2. Call highlights.selectHighlights() for content
  // 3. Call highlights.selectPerformanceQuote() for comedy
  // 4. Get streak data from storage
  // 5. Get calibration state from storage
  // 6. Render: header → highlights → quote → buttons → streak/calibration
  // 7. Stagger animation per UX timing spec
  // 8. Resolve promise when buttons appear
}
```

### Decision 14: Skill Map Dashboard

**Decision:** `dashboard.js` — new DOM-rendering module. Renders `#skill-map-screen` overlay with pixel block bars, callout cards, session/streak info, comedy quote, and Play Now / Back to Menu buttons. Two render paths: calibrating (empty bars + progress) vs unlocked (filled bars + callouts). Reads from storage, never calculates.

**Rationale:** DOM modules render from data — consistent with phone.js, cognitive-feedback.js, score-popup.js pattern. dashboard.js reads storage, renders DOM. metrics.js calculates, storage.js stores, dashboard.js displays.

**Requirements Covered:** FR171-182 (Skill Map), FR183-189 (calibration), NFR52 (500ms load), NFR62-63 (10-second comprehension)

**dashboard.js API:**

```javascript
// dashboard.js — DOM rendering for Skill Map screen

export async function renderSkillMap() {
  // 1. Read profile from storage (domain scores, totalSessions, calibrationComplete)
  // 2. Read streak from storage
  // 3. If calibrationComplete: render full skill map (bars, callouts, stats)
  // 4. If !calibrationComplete: render calibration placeholder (empty bars, progress)
  // 5. Select and render comedy quote
  // 6. Show #skill-map-screen, wire up buttons
}

export function hideSkillMap() {
  // Hide #skill-map-screen
}
```

**DOM Structure (`#skill-map-screen`):**

```html
<div id="skill-map-screen" class="screen hidden">
  <h2 class="skill-map-title">YOUR SKILL MAP</h2>
  <div class="skill-bars">
    <!-- 6 rows generated by dashboard.js -->
    <div class="skill-row">
      <span class="skill-label">Reaction</span>
      <div class="skill-blocks">
        <div class="block filled"></div>
        <div class="block filled"></div>
        <div class="block filled"></div>
        <div class="block filled"></div>
        <div class="block empty"></div>
      </div>
      <span class="skill-rating">4/5</span>
      <span class="skill-indicator">▲</span>
    </div>
  </div>
  <div class="skill-callouts">
    <div class="callout top-skill">
      <span class="callout-icon">★</span>
      <span class="callout-text">Top Skill: Spatial Awareness</span>
      <p class="callout-quote">"Your snake navigates like it has GPS."</p>
    </div>
    <div class="callout level-up">
      <span class="callout-icon">↑</span>
      <span class="callout-text">Level Up: Working Memory</span>
      <p class="callout-quote">"Combo mode is your gym. Get in there."</p>
    </div>
  </div>
  <div class="skill-map-stats">
    <span>Sessions: 47</span>
    <span>Streak: 12 days 🔥</span>
  </div>
  <div class="skill-map-quote">
    <p class="caller-quote">"Your neurons are doing the Electric Slide."</p>
    <span class="caller-name">— DJ Algorithm</span>
  </div>
  <button id="play-now-btn" class="menu-button selected">Play Now</button>
  <button id="back-to-menu-btn" class="menu-button-secondary">← Back to Menu</button>
</div>
```

**Pixel Block Bar Specs (from UX design):**
- Block size: 16×16px, 2px gap between blocks
- Filled: `#9DB2DD` (purple theme), solid, no gradient
- Empty: `#3A3A3A` with 1px border `#555555`
- Labels: Jersey20, 14px, white, abbreviated domain names
- Rating text: "4/5" in 12px, light grey `#B0B0B0`
- Growth indicators: ▲ green `#81C784` (improved), ▽ amber `#FFB74D` (declined), none (stable)
- Top Skill: ★ gold `#FFC107`
- Z-index: 350 (above game canvas, below phone overlay)

**Calibration State Render:**
- All 6 rows show 5 empty blocks (placeholder — "these will fill up")
- "Warming up..." text with session counter
- Progress bar in purple theme color
- Encouraging text: "We're learning how you play."
- Play Now button still prominent

### Decision 15: Streak System

**Decision:** `streak.js` — small module for calendar-day streak tracking. Pure date logic + localStorage access via storage.js. Streak increments on first game completion per calendar day (local timezone). Gentle messaging on break.

**Rationale:** Streaks are a proven retention mechanic. Simple, ethical, local-only aligns with the game's values. Date logic isolated in one module handles timezone edge cases cleanly.

**Requirements Covered:** FR190-198 (streak system), NFR50 (timezone-aware), NFR67 (gentle messaging)

**streak.js API:**

```javascript
// streak.js — Calendar-day streak tracking

export async function checkAndUpdateStreak() {
  // Called after each game completion (onDeath, after session save)
  // 1. Get current streak data from storage
  // 2. Get today's date string (local timezone: YYYY-MM-DD)
  // 3. Compare with lastPlayedDate:
  //    - Same day → no change (already counted today)
  //    - Yesterday → streak continues, increment, update lastPlayedDate
  //    - 2+ days ago → streak broken, reset to 1, update lastPlayedDate
  //    - No previous data → new streak at 1
  // 4. Save updated streak to storage
  // Returns: { currentStreak, isNewDay, streakBroken, message }
}

export function getStreakMessage(streakData) {
  // If streakBroken: "Rest day logged. Ready for another round?"
  // If milestone (7, 14, 30, 60): "N-day streak! [celebratory text]"
  // Otherwise: "N-day streak"
}

export function getTodayDateString() {
  // Returns: 'YYYY-MM-DD' in local timezone
  // Handles DST by using date-only comparison
}
```

**Ethical Guardrails:**
- No red coloring on streak break (amber/neutral only)
- No guilt language ("You lost your streak!" → NEVER)
- No push notifications, no reminders
- Gentle tone: "Rest day logged. Ready for another round?"
- Streak break resets to 0, new streak starts on next game

### Decision 16: Phase System, Navigation & Extended gameState

**Decision:** Phase system extends from 3 to 4 phases with `'skillmap'`. Navigation routing updates in main.js and input.js. gameState extends with session tracking fields for metric calculation. Session lifecycle coordinates game.js → storage → metrics → UI.

**Requirements Covered:** FR171 (Skill Map from menu), FR166 (Play Again + Dashboard buttons), FR182 (calibration placeholder)

**Phase Transitions:**

```
menu → playing (New Game)
menu → skillmap (Skill Map button)
playing → gameover (death)
gameover → playing (Play Again)
gameover → skillmap (Skill Map button)
skillmap → playing (Play Now)
skillmap → menu (Back to Menu / ESC)
gameover → menu (ESC)
```

**ESC Key Behavior:**

| Phase | ESC Action |
|---|---|
| `'menu'` | No action |
| `'playing'` | Pause game (existing) |
| `'gameover'` | Return to menu (existing) |
| `'skillmap'` | Return to menu (new — consistent) |

**Updated Button Navigation:**

| Phase | Buttons | Default Selected |
|---|---|---|
| `'menu'` | [New Game, Skill Map] | New Game |
| `'gameover'` | [Play Again, Skill Map] | Play Again |
| `'skillmap'` | [Play Now, Back to Menu] | Play Now |

**Extended gameState — V3 Additions:**

```javascript
// V3 additions to gameState (alongside existing V1+V2 fields)
const gameState = {
  // ... all existing V1+V2 fields unchanged ...

  // V3: Phase now includes 'skillmap'
  phase: 'menu',  // 'menu' | 'playing' | 'gameover' | 'skillmap'

  // V3: Session tracking (for building session record at death)
  session: {
    startTime: 0,              // Date.now() at game start
    inputTimestamps: [],       // For reaction time proxy (recent N inputs)
    rcPeriods: [],             // [{startTick, endTick, survived}]
    comboPeriods: [],          // [{startTick, endTick, score}]
    phonePeriods: []           // [{showTime, dismissTime, action}]
  }
};
```

**Session Lifecycle — onDeath Flow:**

```javascript
// game.js onDeath() — V3 enhanced
async function onDeath(gameState) {
  // 1. Existing: Award death bonuses (combo + phone consolation)
  // 2. Existing: Update high score

  // 3. NEW: Build session record from cognitiveStats + analyticsState + session
  const sessionRecord = buildSessionRecord(gameState);

  // 4. NEW: Save session to IndexedDB
  await storage.saveSession(sessionRecord);

  // 5. NEW: Recalculate domain scores from rolling window
  const sessions = await storage.getSessions(CONFIG.DASHBOARD.ROLLING_WINDOW);
  const domainScores = metrics.calculateDomainScores(sessions);
  const profile = await storage.getProfile();
  const previousScores = profile?.domainScores || null;
  const newProfile = {
    domainScores: domainScores
      ? Object.fromEntries(
          Object.entries(domainScores).map(([k, v]) => [k, metrics.toBlockScale(v)])
        )
      : profile?.domainScores || null,
    previousDomainScores: previousScores,
    totalSessions: (profile?.totalSessions || 0) + 1,
    calibrationComplete: ((profile?.totalSessions || 0) + 1) >= CONFIG.DASHBOARD.CALIBRATION_SESSIONS
  };
  await storage.updateProfile(newProfile);

  // 6. NEW: Update streak
  const streakResult = await streak.checkAndUpdateStreak();

  // 7. NEW: Show enhanced post-game screen (highlights + streak + calibration)
  await cognitiveFeedback.showPostGameScreen(gameState, sessionRecord);

  // 8. Existing: Transition to gameover phase, show buttons
  gameState.phase = 'gameover';
  gameState.phaseChanged = true;

  // 9. Existing: Fire analytics
  analytics.trackGameOver(gameState);
}
```

**Reset on New Game:** All `gameState.session` fields reset. `cognitiveStats` and `analyticsState` reset (unchanged from V2). Dashboard persistent data (profile, streak, calibration) lives in storage, NOT in gameState — survives game resets.

### V3 Decision Dependency Chain

```
config.js (+ DASHBOARD parameters, METRIC_RANGES, CALIBRATION_SESSIONS)
  │
  ├─→ metrics.js (pure: sessions → domain scores)
  │     └─→ storage.js (reads session history, writes profile)
  │
  ├─→ highlights.js (pure: session + history → highlights)
  │     └─→ storage.js (reads session history + highlight history)
  │
  ├─→ streak.js (date logic + storage)
  │     └─→ storage.js (reads/writes streak data)
  │
  └─→ dashboard.js (DOM: reads profile + streak → renders Skill Map)
        └─→ storage.js (reads profile, streak)

game.js (orchestrator — V3 onDeath flow)
  ├─→ storage.saveSession() ← NEW
  ├─→ metrics.calculateDomainScores() ← NEW
  ├─→ storage.updateProfile() ← NEW
  ├─→ streak.checkAndUpdateStreak() ← NEW
  ├─→ cognitiveFeedback.showPostGameScreen() ← EVOLVED
  └─→ analytics.trackGameOver() ← existing
```

## V3 Implementation Patterns & Consistency Rules

_V1+V2 patterns (naming, data formats, modules, config, code style, state access, error handling) hold unchanged. This section defines V3-specific patterns for async storage, dashboard modules, and the metrics pipeline._

### V3 Conflict Points Identified

**10 areas where V3 introduces new consistency requirements:**

1. Async/sync boundary (V1+V2 is fully sync, V3 adds async storage)
2. Session record construction (3 data sources converging)
3. Null metric propagation (not every session has every metric)
4. Dashboard DOM rendering consistency (new screen following existing overlay patterns)
5. Block bar rendering standardization (core visual element)
6. Highlight output contract (structured object shape)
7. Date comparison for streaks (timezone sensitivity)
8. Module boundaries for pure vs DOM modules
9. Comedy quote data structure and selection
10. Calibration state as cross-cutting concern

### Pattern 1: Async Storage Access

**Rule:** Only 3 files call storage.js directly: `game.js` (orchestrator), `dashboard.js` (reads for rendering), `streak.js` (reads/writes streak). Pure modules (`metrics.js`, `highlights.js`) receive data as function arguments — they never import storage.js.

```javascript
// CORRECT: Always await storage calls, even localStorage wrappers
const sessions = await storage.getSessions(10);
const profile = await storage.getProfile();

// WRONG: Treating async storage as synchronous
const sessions = storage.getSessions(10); // Returns Promise, not data!

// CORRECT: Async boundary lives in orchestrator (game.js onDeath)
// Pure functions (metrics.js, highlights.js) receive data, never call storage

// WRONG: Pure calculation module calling storage
// metrics.js should NOT import storage.js
```

### Pattern 2: Session Record Building

**Rule:** Session records are built **once**, in **one place** (`game.js`), immediately after death, before any storage writes. The `buildSessionRecord()` function is the single point of assembly for data from `cognitiveStats`, `analyticsState`, and `gameState.session`.

```javascript
// CORRECT: Single buildSessionRecord() function in game.js
function buildSessionRecord(gameState) {
  return {
    sessionId: crypto.randomUUID(),
    timestamp: Date.now(),
    score: gameState.score,
    snakeLength: gameState.snake.segments.length,
    duration: Date.now() - gameState.session.startTime,
    metrics: {
      avgPhoneReactionTime: calculateAvgReactionTime(gameState.session.phonePeriods),
      spatialCoverage: gameState.snake.segments.length / (CONFIG.GRID_WIDTH * CONFIG.GRID_HEIGHT),
      rcSurvivalRate: safeRatio(gameState.cognitiveStats.rcSurvived, gameState.session.rcPeriods.length),
      phoneSurvivalRate: safeRatio(gameState.cognitiveStats.phoneCallsManaged, totalPhoneCalls(gameState)),
      avgPhoneDecisionTime: calculateAvgDecisionTime(gameState.session.phonePeriods),
      pickUpRate: safeRatio(gameState.cognitiveStats.pickUpStreak, totalPhoneCalls(gameState)),
      comboCompletionRate: safeRatio(completedCombos(gameState), gameState.session.comboPeriods.length),
      avgComboScore: calculateAvgComboScore(gameState.session.comboPeriods)
    },
    events: { ...gameState.cognitiveStats }
  };
}

// Helper: safe ratio returns null when denominator is 0
function safeRatio(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : null;
}
```

### Pattern 3: Metric Null Propagation

**Rule:** `null` means "not applicable" — propagate it, don't coerce to zero. Display modules show 0 filled blocks for null domains.

```javascript
// CORRECT: metrics.js skips null sessions in weighted average
function weightedAverage(sessions, metricKey, weights) {
  let weightSum = 0;
  let valueSum = 0;
  sessions.forEach((session, i) => {
    const val = session.metrics[metricKey];
    if (val !== null && val !== undefined) {
      valueSum += val * weights[i];
      weightSum += weights[i];
    }
  });
  return weightSum > 0 ? valueSum / weightSum : null;
}

// WRONG: Treating null as 0 (inflates denominators, deflates averages)
const avg = sessions.reduce((sum, s) => sum + (s.metrics[key] || 0), 0) / sessions.length;
```

### Pattern 4: Dashboard DOM Rendering

**Rule:** Static containers in `index.html`. Dynamic content via `createElement()` + `appendChild()`. Visibility via `.hidden` class. Consistent with all V1+V2 DOM modules (phone.js, cognitive-feedback.js, score-popup.js).

```javascript
// CORRECT: Follow existing overlay pattern
export async function renderSkillMap() {
  const screen = document.getElementById('skill-map-screen');
  const barsContainer = screen.querySelector('.skill-bars');

  // Clear previous render
  barsContainer.innerHTML = '';

  // Read data from storage
  const profile = await storage.getProfile();

  // Generate DOM elements
  Object.entries(profile.domainScores).forEach(([domain, score]) => {
    const row = createSkillRow(domain, score, profile.previousDomainScores?.[domain]);
    barsContainer.appendChild(row);
  });

  // Show screen
  screen.classList.remove('hidden');
}

// WRONG: Creating the entire container in JS (breaks separation)
// WRONG: Using innerHTML with template literals for complex structures
// WRONG: Direct style manipulation instead of class toggles
```

### Pattern 5: Block Bar Rendering

**Rule:** 5 blocks per row, always. `filled` / `empty` CSS classes. No inline styles for colors. All color values in CSS, all thresholds in config.js.

```javascript
// CORRECT: Standardized block bar creation
function createSkillRow(domain, blockCount, previousBlockCount) {
  const row = document.createElement('div');
  row.className = 'skill-row';

  const label = document.createElement('span');
  label.className = 'skill-label';
  label.textContent = CONFIG.DASHBOARD.DOMAIN_LABELS[domain];

  const blocksContainer = document.createElement('div');
  blocksContainer.className = 'skill-blocks';

  for (let i = 0; i < 5; i++) {
    const block = document.createElement('div');
    block.className = i < blockCount ? 'block filled' : 'block empty';
    blocksContainer.appendChild(block);
  }

  const rating = document.createElement('span');
  rating.className = 'skill-rating';
  rating.textContent = `${blockCount}/5`;

  row.appendChild(label);
  row.appendChild(blocksContainer);
  row.appendChild(rating);

  // Growth indicator (only if previous data exists and delta >= 1 full block)
  if (previousBlockCount !== null && previousBlockCount !== undefined) {
    const delta = blockCount - previousBlockCount;
    if (delta >= 1) {
      const indicator = document.createElement('span');
      indicator.className = 'skill-indicator improved';
      indicator.textContent = '▲';
      row.appendChild(indicator);
    } else if (delta <= -1) {
      const indicator = document.createElement('span');
      indicator.className = 'skill-indicator declined';
      indicator.textContent = '▽';
      row.appendChild(indicator);
    }
  }

  return row;
}
```

**CSS classes (in style.css):**

```css
.block          { width: 16px; height: 16px; margin-right: 2px; }
.block.filled   { background: #9DB2DD; }
.block.empty    { background: #3A3A3A; border: 1px solid #555555; }
.skill-indicator.improved { color: #81C784; }
.skill-indicator.declined { color: #FFB74D; }
```

### Pattern 6: Highlight Output Contract

**Rule:** Highlight objects always have all 6 fields. `type` is one of 4 enum values. Array length is 2-3. Variety check happens **after** priority selection, not before.

```javascript
// CORRECT: Highlight output shape (always this structure)
const highlight = {
  type: 'personal_best',           // 'personal_best' | 'improvement' | 'notable_event' | 'growth_opportunity'
  stat: 'rcSurvived',              // Which stat this highlight is about
  value: 5,                        // The numeric value
  text: 'New record: 5 RC survived!',  // Pre-formatted display text
  icon: '★',                       // Display icon character
  isPersonalBest: true             // Boolean flag for extra styling
};

// CORRECT: selectHighlights always returns array of 2-3 highlights
// If fewer than 2 valid highlights exist, pad with growth_opportunity type

// CORRECT: Variety enforcement order:
// 1. Score all candidates by priority
// 2. Select top 3
// 3. Check overlap with lastHighlightPattern
// 4. If all types repeat, swap lowest-priority repeat for next-best different type
```

### Pattern 7: Date Comparison (Streaks)

**Rule:** Store dates as `'YYYY-MM-DD'` local timezone strings. Compare strings, not Date objects. Build date strings with explicit year/month/day extraction.

```javascript
// CORRECT: Always use local timezone date strings
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isYesterday(dateString) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === formatDate(yesterday);
}

// WRONG: Using UTC dates (player in UTC+9 plays at 11pm, streak breaks at midnight UTC)
// WRONG: Timestamp arithmetic (fails around DST transitions)
// WRONG: new Date(dateString) for comparison (timezone-dependent parsing)
```

### Pattern 8: Module Boundary Rules — V3 Additions

| Module | Reads From | Writes To | Calls Storage? | DOM Access? |
|---|---|---|---|---|
| `metrics.js` | Function args only | Return values only | **NO** | **NO** |
| `highlights.js` | Function args only | Return values only | **NO** | **NO** |
| `dashboard.js` | storage.js (async) | DOM | **YES** (read) | **YES** |
| `streak.js` | storage.js (async) | storage.js (async) | **YES** (read+write) | **NO** |

**Pure module rule:** `metrics.js` and `highlights.js` import only `config.js` for thresholds. All data arrives as function arguments. Fully testable without mocking.

**DOM module rule:** `dashboard.js` and `cognitive-feedback.js` (evolved) are the only V3 modules that touch the DOM. They read from storage, render to DOM, wire up event listeners.

### Pattern 9: Comedy Quote Data

**Rule:** All quotes in `config.js` (or a dedicated `quotes.js` if the data exceeds ~100 lines). Grouped by context. Minimum 7 quotes per pool. Selection is random within the matched pool.

```javascript
// CORRECT: Structured in config.js under DASHBOARD.QUOTES
CONFIG.DASHBOARD.QUOTES = {
  celebration: [
    { caller: 'DJ Algorithm', quote: 'Your neurons are doing the Electric Slide.' },
    { caller: 'Cache Money', quote: 'That performance? Absolutely cached.' },
    // ... minimum 7 per pool
  ],
  encouragement: [
    { caller: 'Bluetooth Barry', quote: 'Keep pairing those brain cells.' },
    // ...
  ],
  empathy: [
    { caller: 'Kernel Panic', quote: 'Even the best processors need a reboot.' },
    // ...
  ]
};

// Context mapping: personal_best → celebration, growth_opportunity → encouragement, etc.

// WRONG: Quotes embedded directly in highlights.js or dashboard.js
// WRONG: Single flat array without context grouping
```

### Pattern 10: Calibration State

**Rule:** `calibrationComplete` is a boolean in the stored profile. Set once during `onDeath` profile update when `totalSessions >= CALIBRATION_SESSIONS`. All UI reads the stored boolean, never recalculates.

```javascript
// CORRECT: Single source of truth — profile.calibrationComplete in storage
const profile = await storage.getProfile();
if (profile?.calibrationComplete) {
  renderFullSkillMap(profile);
} else {
  renderCalibrationPlaceholder(profile?.totalSessions || 0);
}

// WRONG: Recalculating calibration state from session count each time
// WRONG: Storing calibrationComplete in gameState (it's persistent, not per-game)
```

### V3 Enforcement Guidelines

**All AI Agents MUST (V3 additions to V1+V2 rules):**

1. **Always `await` storage calls** — never use `.then()` chains or forget `await`
2. **Never import storage.js from pure modules** — `metrics.js` and `highlights.js` receive data as arguments
3. **Use `null` for absent metrics** — never coerce to 0
4. **Follow the highlight output contract** — all 6 fields, type from the 4-value enum
5. **Use local timezone `'YYYY-MM-DD'` strings for dates** — never UTC, never timestamp math
6. **Put all quotes in config.js** (or quotes.js) — never embed quote text in rendering code
7. **Use `.hidden` class for screen visibility** — never `display:none` in JS

**V3 Anti-Patterns:**

| Don't | Do Instead |
|---|---|
| `storage.getSessions(10)` without `await` | `const sessions = await storage.getSessions(10)` |
| `import { getSessions } from './storage.js'` in metrics.js | Pass sessions array as function argument |
| `session.metrics.rcSurvivalRate \|\| 0` | Check for `null` explicitly, skip in weighted average |
| `element.style.display = 'none'` | `element.classList.add('hidden')` |
| `new Date('2026-02-15')` for streak comparison | `getTodayDateString()` string comparison |
| Hard-coded `'Your neurons are...'` in dashboard.js | `CONFIG.DASHBOARD.QUOTES.celebration[i]` |
| `if (totalSessions >= 5)` in UI code | `if (profile.calibrationComplete)` |

## V3 Project Structure & Boundaries

### Complete V3 Project Directory Structure

```
CrazySnakeLite/
├── index.html                    # (v3: +skill-map-screen, +calibration elements, +Skill Map buttons on menu/gameover)
├── css/
│   └── style.css                 # (v3: +Skill Map dashboard, +block bars, +calibration state, +highlights v3, +streak, +responsive dashboard)
├── js/
│   ├── main.js                   # Entry point (v3: +initStorage() call on app load, +skillmap phase handling)
│   ├── config.js                 # CONFIG object (v3: +DASHBOARD section: calibration, rolling window, recency weights, metric ranges, block scale, domain labels, quotes)
│   ├── state.js                  # gameState (v3: +session tracking fields, +'skillmap' phase value)
│   ├── game.js                   # Game loop, orchestration (v3: +onDeath session lifecycle: buildSessionRecord → saveSession → recalculate → updateProfile → updateStreak → showPostGame)
│   ├── snake.js                  # Snake movement, growth
│   ├── food.js                   # Food spawning, blinking
│   ├── collision.js              # Collision detection
│   ├── effects.js                # Effect lifecycle
│   ├── phone.js                  # Phone call system (v2)
│   ├── input.js                  # Input handling (v3: +skillmap phase routing, +Skill Map button navigation)
│   ├── render.js                 # Canvas rendering
│   ├── audio.js                  # Audio system
│   ├── storage.js                # (v3: MAJOR EVOLUTION — async abstraction. IndexedDB for sessions, localStorage for profile/streak/highlights. initStorage(), saveSession(), getSessions(), getProfile(), updateProfile(), getStreak(), updateStreak(), getHighlightHistory(), updateHighlightHistory())
│   ├── feedback.js               # Visual feedback utilities (v1)
│   ├── scoring.js                # Pure scoring calculation (v2)
│   ├── progression.js            # Score → tier resolution (v2)
│   ├── combo.js                  # Combo state machine (v2)
│   ├── score-popup.js            # DOM popup lifecycle (v2)
│   ├── cognitive-feedback.js     # (v3: MAJOR EVOLUTION — calls highlights.js for selection, renders comedy quotes, streak counter, calibration progress, Skill Map button. Header: "RECAP")
│   ├── analytics.js              # Non-blocking cognitive analytics (v2)
│   ├── metrics.js                # NEW: Pure calculation — calculateDomainScores(), toBlockScale(), calculateGrowthIndicators(). Zero imports except config.js.
│   ├── highlights.js             # NEW: Pure selection — selectHighlights(), selectPerformanceQuote(). Priority algorithm + variety enforcement. Zero imports except config.js.
│   ├── dashboard.js              # NEW: DOM rendering — renderSkillMap(), hideSkillMap(). Pixel block bars, callouts, calibration placeholder. Reads storage, renders DOM.
│   └── streak.js                 # NEW: Date logic — checkAndUpdateStreak(), getStreakMessage(), getTodayDateString(). Reads/writes streak via storage.js.
├── assets/
│   ├── sounds/                   # 27 MP3 files (unchanged from v2)
│   │   └── [... all v1+v2 audio files unchanged ...]
│   ├── callers/                  # 21 portrait PNGs (unchanged from v2)
│   │   └── [... all v2 caller portraits unchanged ...]
│   └── PhoneIcone01_256px.png    # Portrait fallback icon
├── test/                         # Unit tests (existing + v3 additions)
│   ├── [... existing v2 test files ...]
│   ├── metrics.test.js           # (v3: domain score calculation, normalization, null handling, block scale)
│   ├── highlights.test.js        # (v3: priority selection, variety enforcement, output contract)
│   └── streak.test.js            # (v3: date comparison, streak increment/break/reset)
└── README.md
```

**Total: 24 JS modules (20 v2 + 4 new) · 49 asset files (unchanged)**

### V3 Module Responsibilities & FR Mapping

| Module | V3 Role | Functional Coverage |
|---|---|---|
| **metrics.js** _(NEW)_ | Pure domain score calculation — session history → normalized 0-1 → 5-block scale | FR150-160 (Metrics Data Engine) |
| **highlights.js** _(NEW)_ | Pure highlight selection — priority algorithm, variety enforcement, comedy quote context | FR161-170 (Enhanced Post-Game Summary) |
| **dashboard.js** _(NEW)_ | Skill Map DOM rendering — block bars, callouts, calibration placeholder, navigation | FR171-182 (Skill Map Dashboard), FR183-189 (Calibration) |
| **streak.js** _(NEW)_ | Calendar-day streak logic — date comparison, streak state, ethical messaging | FR190-198 (Streak System) |
| **storage.js** _(EVOLVED)_ | Async storage abstraction — IndexedDB for sessions, localStorage for profile/streak/highlights | FR157-158 (persistence), NFR56-61 (storage/privacy) |
| **cognitive-feedback.js** _(EVOLVED)_ | Enhanced post-game screen — highlights rendering, comedy quotes, streak, calibration, Skill Map button | FR161-170 (display), FR199-205 (comedy) |
| **game.js** _(EVOLVED)_ | Session lifecycle in onDeath — build record, save, recalculate, update profile, update streak | Orchestrates FR150-198 |
| **config.js** _(EVOLVED)_ | +DASHBOARD section — metric ranges, calibration threshold, weights, domain labels, quote pools | Supports all V3 FRs |
| **state.js** _(EVOLVED)_ | +session tracking fields, +'skillmap' phase | Supports FR150 (session tracking), FR171 (Skill Map phase) |
| **input.js** _(EVOLVED)_ | +skillmap phase routing, +Skill Map button on menu/gameover | FR166 (navigation), FR171 (Skill Map access) |

### V3 Module Communication Flow

```
                    ┌─────────────┐
                    │   main.js   │  ← +initStorage() on app load
                    └──────┬──────┘
                           │ initializes
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ input.js │    │ game.js  │    │ audio.js │
    │+skillmap │    │+onDeath  │    └──────────┘
    │ routing  │    │ session  │
    └────┬─────┘    │lifecycle │
         │          └────┬─────┘
         │               │ onDeath: build → save → recalculate → update
         ▼               ▼
    ┌─────────────────────────────────────────────────────┐
    │                   gameState                          │
    │  v3: +session{startTime, phonePeriods, rcPeriods,   │
    │       comboPeriods}, phase: +'skillmap'              │
    └─────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼──────────────────┐
         ▼               ▼                  ▼
    ┌──────────┐   ┌──────────┐    ┌───────────────┐
    │metrics.js│   │highlights│    │   streak.js   │
    │(pure     │   │   .js    │    │(date logic +  │
    │ calc)    │   │(pure     │    │ storage r/w)  │
    │          │   │ select)  │    └───────┬───────┘
    └────┬─────┘   └────┬─────┘            │
         │              │                  │
         │    data in   │    data in       │ reads/writes
         │    ← args    │    ← args        │
         │              ▼                  ▼
         │    ┌────────────────────────────────┐
         │    │  cognitive-feedback.js (v3)     │  ← Post-game "RECAP"
         │    │  Calls highlights.selectHighlights()
         │    │  Renders: highlights + quote +  │
         │    │  streak + calibration + buttons │
         │    └────────────────────────────────┘
         │
         └──→ ┌────────────────────────────────┐
              │      dashboard.js              │  ← Skill Map screen
              │  Reads storage (profile, streak)│
              │  Renders: block bars, callouts, │
              │  calibration, navigation        │
              └────────────────────────────────┘
                         │
                         ▼
              ┌────────────────────────────────┐
              │        storage.js (v3)         │  ← Async abstraction
              │  IndexedDB: sessions           │
              │  localStorage: profile, streak,│
              │  highlights, high score         │
              └────────────────────────────────┘
```

### V3 Boundary Rules (extends v1+v2)

| Boundary | Rule | V3 Additions |
|---|---|---|
| **State Access** | Only through passed `gameState` parameter | All 4 new modules follow same pattern |
| **DOM Access** | main.js, phone.js, score-popup.js, cognitive-feedback.js, **+dashboard.js** | dashboard.js is the only new DOM-accessing module |
| **Canvas Access** | Only render.js | Unchanged |
| **Storage Access** | Only storage.js wraps IndexedDB/localStorage | **game.js**, **dashboard.js**, **streak.js** call storage.js. Pure modules (metrics.js, highlights.js) **never** call storage. |
| **Metric Calculation** | Only metrics.js calculates domain scores | dashboard.js reads stored scores, never recalculates |
| **Highlight Selection** | Only highlights.js selects highlights | cognitive-feedback.js renders, never selects |
| **Streak Logic** | Only streak.js handles date comparison | Consumers read returned streak data |
| **Quote Data** | Only config.js holds quote pools | Selection logic in highlights.js, rendering in cognitive-feedback.js and dashboard.js |
| **Calibration State** | Stored in profile.calibrationComplete | All UI reads the boolean, never recalculates from session count |
| **Scoring Logic** | Only scoring.js (v2) | Unchanged |
| **Analytics** | Only analytics.js | Unchanged |

### V3 index.html DOM Additions

```html
<!-- V3: Skill Map button on menu -->
<div id="menu-screen">
  <h1>CrazySnakeLite</h1>
  <button id="new-game-btn" class="menu-button selected">New Game</button>
  <button id="skill-map-btn" class="menu-button">Skill Map</button>
</div>

<!-- V3: Updated game-over with Skill Map button -->
<div id="gameover-screen" class="hidden">
  <h2>GAME OVER</h2>
  <p class="final-score"></p>
  <div class="cognitive-stats hidden">
    <h3 class="cognitive-stats-header">RECAP</h3>
    <div class="cognitive-stats-lines"></div>
    <div class="cognitive-quote"></div>
    <div class="cognitive-streak"></div>
    <div class="cognitive-calibration"></div>
  </div>
  <button id="play-again-btn" class="menu-button selected">Play Again</button>
  <button id="skill-map-gameover-btn" class="menu-button">Skill Map</button>
</div>

<!-- V3: NEW — Skill Map screen -->
<div id="skill-map-screen" class="screen hidden">
  <h2 class="skill-map-title">YOUR SKILL MAP</h2>
  <div class="skill-bars"></div>
  <div class="skill-callouts"></div>
  <div class="skill-map-stats"></div>
  <div class="skill-map-quote"></div>
  <button id="play-now-btn" class="menu-button selected">Play Now</button>
  <button id="back-to-menu-btn" class="menu-button-secondary">← Back to Menu</button>
</div>
```

### V3 Data Flow — Session Lifecycle

```
1. main.js: initStorage() opens IndexedDB on app load
2. game.js: New Game → gameState.session.startTime = Date.now()
3. game.js: During play → session.phonePeriods, rcPeriods, comboPeriods accumulate
4. game.js: onDeath() →
   a. buildSessionRecord(gameState) → session record
   b. await storage.saveSession(record)
   c. sessions = await storage.getSessions(10)
   d. domainScores = metrics.calculateDomainScores(sessions)
   e. blockScores = map domainScores → metrics.toBlockScale()
   f. growthIndicators = metrics.calculateGrowthIndicators(blockScores, previousScores)
   g. await storage.updateProfile({ domainScores, previousScores, totalSessions, calibrationComplete })
   h. streakResult = await streak.checkAndUpdateStreak()
   i. highlights = highlights.selectHighlights(record, sessions, lastHighlightPattern)
   j. await storage.updateHighlightHistory({ lastPattern })
   k. await cognitiveFeedback.showPostGameScreen(highlights, streakResult, profile)
   l. gameState.phase = 'gameover'
5. gameover: Player clicks "Skill Map" →
   a. gameState.phase = 'skillmap'
   b. await dashboard.renderSkillMap()
6. skillmap: Player clicks "Play Now" →
   a. dashboard.hideSkillMap()
   b. Reset gameState, start new game
```

### V3 CSS Organization

New sections appended to `style.css` (estimated ~150-200 lines):

```css
/* === Skill Map Dashboard === */
/* #skill-map-screen, .skill-map-title */

/* === Block Bars === */
/* .skill-row, .skill-label, .skill-blocks, .block, .block.filled, .block.empty */
/* .skill-rating, .skill-indicator, .skill-indicator.improved, .skill-indicator.declined */

/* === Skill Map Callouts === */
/* .skill-callouts, .callout, .callout-icon, .callout-text, .callout-quote */

/* === Calibration State === */
/* .calibration-placeholder, .calibration-progress, .calibration-text */

/* === Post-Game Highlights V3 === */
/* .cognitive-quote, .cognitive-streak, .cognitive-calibration */
/* .highlight-icon, .highlight-personal-best */

/* === Streak Display === */
/* .streak-counter, .streak-message */

/* === Dashboard Responsive === */
/* @media queries for Skill Map on smaller screens */
```

### V3 Z-Index Layer Map

| Z-Index | Element | Notes |
|---|---|---|
| 0 | Game canvas | Base layer |
| 100 | Score display | Always visible during play |
| 200 | Score popups + particles | Temporary, self-cleaning |
| 250 | Game over / Menu screens | Standard overlays |
| 300 | Tooltips | Mystery food tooltip |
| **350** | **Skill Map screen** | **NEW — between tooltips and phone** |
| 400 | Phone overlay | Highest game element |

## V3 Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All 16 decisions (v1: 1-5, v2: 6-10, v3: 11-16) work together without conflicts:
- V3 decisions are additive — no v1+v2 decisions modified or contradicted
- Storage evolution (sync → async) is backward-compatible: existing `loadHighScore()`/`saveHighScore()` remain synchronous, new functions are async
- Phase system extension (3 → 4) is additive: `'skillmap'` phase added, existing phase transitions untouched
- gameState extension adds `session` sub-object without changing any v1+v2 fields
- Async onDeath flow is safe: game loop is already stopped at death, no tick pressure on await calls

**Pattern Consistency:**
V3 patterns fully support and extend v1+v2 patterns:
- V3 naming follows camelCase functions, SCREAMING_SNAKE_CASE config, kebab-case CSS consistently
- All 4 new modules use named exports (no default exports)
- V3 data formats consistent: ms for time, hex for colors, `null` for absent data
- V3 state access follows explicit passing — gameState never imported globally
- 10 V3-specific patterns + 7 enforcement guidelines + 7 anti-patterns documented

**Structure Alignment:**
V3 project structure supports all architectural decisions:
- New modules placed in flat `js/` directory (consistent with v1+v2, no sub-directories)
- Tests in `test/` directory (3 new test files for pure modules)
- CSS in single `style.css` with comment sections (7 new sections defined)
- index.html DOM structure matches dashboard.js rendering expectations
- Z-index layer map updated with Skill Map at 350

### Requirements Coverage Validation ✅

**Functional Requirements Coverage (56 V3 FRs):**

| FR Range | Feature | Covered By | Status |
|---|---|---|---|
| FR150-160 | Metrics Data Engine | Decision 12 (metrics.js) + Decision 11 (storage.js) | ✅ Covered |
| FR157-158 | Local persistence | Decision 11 (IndexedDB + localStorage) | ✅ Covered |
| FR161-170 | Enhanced Post-Game Summary | Decision 13 (highlights.js + cognitive-feedback.js) | ✅ Covered |
| FR171-182 | Skill Map Dashboard | Decision 14 (dashboard.js) + Decision 16 (phase system) | ✅ Covered |
| FR183-189 | Calibration Period | Decisions 11, 14, 16 (cross-cutting boolean in profile) | ✅ Covered |
| FR190-198 | Streak System | Decision 15 (streak.js) | ✅ Covered |
| FR199-205 | Comedy Integration | Decision 13 (quote selection + pools in config.js) | ✅ Covered |

**Non-Functional Requirements Coverage (25 V3 NFRs):**

| NFR Range | Category | Covered By | Status |
|---|---|---|---|
| NFR45-50 | Data Accuracy | metrics.js pure functions, null propagation pattern, recency weighting, timezone-aware dates (Pattern 7) | ✅ Covered |
| NFR51-55 | Dashboard Performance | DOM-based rendering (no Canvas overhead), async storage, < 5MB total | ✅ Covered |
| NFR56-61 | Storage & Privacy | IndexedDB 100+ sessions, localStorage profile, zero server transmission, graceful degradation | ✅ Covered |
| NFR62-67 | Dashboard Usability | Block bars (10-second comprehension), ethical streaks, contextual comedy, calibration UX | ✅ Covered |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- 6 V3 decisions each include rationale, code examples, API surfaces, and data schemas
- Dependency chain diagram shows implementation order
- All config parameters specified with exact keys and types
- IndexedDB schema fully defined (object store, keyPath, indexes, record shape)
- localStorage keys fully defined with JSON shapes

**Structure Completeness:**
- 24 modules defined with responsibilities (20 v2 + 4 new)
- FR mapping for all 10 V3-impacted modules
- Complete DOM structure for Skill Map screen
- Module communication flow diagram
- 11 boundary rules explicitly tabulated

**Pattern Completeness:**
- 10 V3-specific patterns covering all identified conflict points
- Module boundary table defines storage access, DOM access, purity constraints
- Highlight output contract specifies exact object shape (6 fields, 4 type values)
- Date comparison pattern prevents timezone bugs
- Calibration state pattern prevents recalculation inconsistencies

### Gap Analysis Results

**Critical Gaps:** None

**Minor Observations (not blocking):**

1. **Comedy quote content** — Architecture defines data structure and selection logic. The actual 63+ quotes (21 callers × 3 contexts) are content work to be filled during implementation. Structure is ready to receive them.

2. **Analytics extension** — V3 doesn't extend analytics.js. Skill Map view events and calibration completion events could be tracked via Plausible during implementation — small addition, not architectural.

3. **Data export/deletion** (NFR60-61) — Architecture supports via storage.js but no dedicated "clear my data" UI flow is defined. For MVP, clearing browser data handles this. A dedicated button is a post-MVP enhancement if needed.

### V3 Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] V3 context thoroughly analyzed (56 FRs, 25 NFRs, 3 design documents)
- [x] Storage architecture decision made (local-first, cloud-ready)
- [x] Cross-cutting concerns mapped (5: async storage, session lifecycle, calibration, comedy, metric pipeline)
- [x] UX vocabulary aligned ("Skill Map", "Recap", "Warming up...")
- [x] Cross-browser limitation documented with rationale

**✅ Architectural Decisions**
- [x] 6 V3 decisions documented with code examples and API surfaces
- [x] Technology stack confirmed (vanilla JS holds, IndexedDB is browser-native)
- [x] Integration patterns defined (pure modules vs DOM modules vs storage callers)
- [x] Performance considerations addressed (DOM rendering, async non-blocking)
- [x] Graceful degradation defined (IndexedDB blocked → no-op, game always playable)

**✅ Implementation Patterns**
- [x] 10 V3-specific patterns defined
- [x] Async storage access pattern documented
- [x] Null propagation pattern documented
- [x] Module boundary rules explicitly tabulated
- [x] 7 enforcement guidelines + 7 anti-patterns

**✅ Project Structure**
- [x] 24 modules defined (20 v2 + 4 new)
- [x] Module communication flow diagrammed
- [x] 11 boundary rules (v1+v2+v3)
- [x] FR-to-module mapping complete for all V3 modules
- [x] index.html DOM additions specified
- [x] CSS organization with comment sections
- [x] Z-index layer map updated

### V3 Architecture Readiness Assessment

**Overall Status:** READY FOR V3 IMPLEMENTATION ✅

**Confidence Level:** High

**Key Strengths:**
- Zero new runtime dependencies — IndexedDB is a browser API
- Clean separation: pure calculation (testable) vs DOM rendering (visual) vs storage (data)
- Async storage interface makes Horizon 2 cloud upgrade a backend swap
- V1+V2 foundations are untouched — all V3 additions are additive
- Cross-browser storage limitation documented honestly with mitigation path
- Ethical design guardrails built into streak and calibration patterns

**Areas for Future Enhancement (Post-MVP / Horizon 2):**
- Cloud sync adapter (cross-browser, cross-device unification)
- Trend graphs (Layer 3 analytics — deferred to Dashboard V2)
- Social sharing / brain map cards
- Data export/deletion UI
- Analytics extension for Skill Map engagement tracking

### V3 Implementation Sequence

1. Expand `config.js` with DASHBOARD section (weights, ranges, calibration, domain labels, quote pools)
2. Expand `state.js` with session tracking fields + `'skillmap'` phase value
3. Evolve `storage.js` (IndexedDB + async wrappers + initStorage)
4. Create `metrics.js` (pure calculation — testable first)
5. Create `highlights.js` (pure selection — testable first)
6. Create `streak.js` (date logic + storage access)
7. Evolve `cognitive-feedback.js` (enhanced post-game with highlights + comedy + streak)
8. Create `dashboard.js` (Skill Map screen rendering)
9. Evolve `game.js` (onDeath session lifecycle + buildSessionRecord)
10. Evolve `input.js` (skillmap phase routing + Skill Map button navigation)
11. Update `index.html` (Skill Map screen, menu buttons, game-over buttons)
12. Update `style.css` (block bars, dashboard, calibration, highlights v3, streak, responsive)

### V3 Implementation Handoff

**For AI Agents:**
This architecture document is the complete guide for implementing CrazySnakeLite V3 (Cognitive Dashboard MVP). Follow ALL decisions (v1 + v2 + v3), patterns, and structures exactly as documented.

**AI Agent Rules (V3 additions):**
1. Always `await` storage calls — never use `.then()` chains or forget `await`
2. Never import storage.js from pure modules (metrics.js, highlights.js)
3. Use `null` for absent metrics — never coerce to 0
4. Follow the highlight output contract — all 6 fields, type from the 4-value enum
5. Use local timezone `'YYYY-MM-DD'` strings for dates — never UTC, never timestamp math
6. Put all quotes in config.js (or quotes.js) — never embed quote text in rendering code
7. Use `.hidden` class for screen visibility — never `display:none` in JS

**Next Phase:** Create epics and stories from V3 architecture, then begin implementation.

**Document Maintenance:** Update this architecture when major technical decisions are made during V3 implementation.

---

**V3 Architecture Status:** READY FOR IMPLEMENTATION ✅

---

## V3 Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow V3:** COMPLETED ✅
**Total Steps Completed:** 8
**V3 Date Completed:** 2026-02-15
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final V3 Architecture Deliverables

**Complete Architecture Document**
- 16 total architectural decisions (v1: 5, v2: 5, v3: 6) — all documented with rationale, code examples, API surfaces, and data schemas
- 10 V3-specific implementation patterns ensuring AI agent consistency
- Complete project structure: 24 JS modules, 49 asset files, updated DOM, updated CSS
- Full FR-to-module mapping: 56 new FRs + 25 new NFRs covered
- Coherence validation confirming v1+v2+v3 decisions work together

**V3 Implementation Ready Foundation**
- 4 new modules: metrics.js, highlights.js, dashboard.js, streak.js
- 5 evolved modules: storage.js, cognitive-feedback.js, game.js, config.js, state.js, input.js
- Async storage layer (IndexedDB + localStorage) with cloud-ready interface
- Session lifecycle: build → save → recalculate → update → display
- Skill Map phase system extending 3 → 4 phases

**AI Agent Implementation Guide**
- V3 implementation sequence (12 ordered steps)
- 7 V3-specific agent rules
- 7 V3 anti-patterns with correct alternatives
- Module boundary table (pure vs DOM vs storage callers)
- Cross-browser storage limitation documented with mitigation path

### V3 Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All v3 decisions compatible with v1+v2 foundations
- [x] Async storage backward-compatible with existing sync APIs
- [x] Phase system extension is additive (no existing transitions changed)
- [x] V3 patterns extend v1+v2 patterns without contradiction

**✅ Requirements Coverage**
- [x] All 56 V3 FRs (FR150-205) architecturally supported
- [x] All 25 V3 NFRs (NFR43-67) addressed
- [x] Cross-cutting concerns mapped (async storage, session lifecycle, calibration, comedy, metric pipeline)
- [x] UX design decisions integrated (Skill Map vocabulary, pixel block bars, 3 surfaces)

**✅ Implementation Readiness**
- [x] Decisions are specific with code examples and API surfaces
- [x] Patterns prevent agent conflicts across V3 modules
- [x] Structure is complete with 24 modules and clear boundaries
- [x] Data flow diagrams guide implementation order

---

**Architecture Status:** READY FOR V3 IMPLEMENTATION ✅

**Next Phase:** Create epics and stories from V3 architecture, then begin implementation.

**Document Maintenance:** Update this architecture when major technical decisions are made during V3 implementation.

---

# V4 Evolution: Visual Enhancement System (Retro Upgrade)

**Date:** 2026-02-16
**Author:** Winston (Architect)
**Status:** Integrated
**Purpose:** Architectural decisions for the 8-enhancement retro graphic upgrade

**Input Documents:**
- `ux-design-retro-graphic-upgrade.md` (Sally, UX Designer)
- `ux-design-retro-graphic-upgrade-technical-addendum.md` (Sally, UX Designer)
- `80s Video Game Graphic Design Overview.pdf` (Tomoco research)
- `game-ux-principles.md` (cognitive science foundation)
- `architecture.md` V3 (previous state)

---

## V4 Overview

### Scope
8 visual enhancements inspired by 1980s arcade design principles:
1. Progressive dark playfield ("Neon Noir")
2. Distinctive food shapes (pixel silhouette economy)
3. CRT phosphor glow on food items
4. Snake head character enhancements
5. Typography treatments (arcade text)
6. CRT scanline overlay
7. Reactive arcade bezel border
8. Grid intersection dots + progressive dimming

### Strategic Rationale

**Why This Evolution:**
- Deepens retro authenticity (aligns with game's aesthetic identity)
- Strengthens cognitive training (dual-channel recognition, spatial progression)
- Amplifies emotional peaks (score progression creates cinematic transformation)

**Architectural Impact:**
- Extends progression engine (3 fields → 8 fields)
- Establishes CSS/Canvas hybrid rendering patterns
- Introduces defensive rendering patterns (auto-cleanup)
- Defines performance budgets for visual systems
- Creates border state orchestration system

**V1+V2+V3 Compatibility:** Fully additive. All enhancements build on existing modules without breaking changes.

---

## V4 Core Architectural Decisions

### Decision 11: Score-Gated Visual Progression System

**Decision:** All visual enhancements that vary with gameplay progress MUST use score-based thresholds resolved through the `progression.js` module.

**Pattern:**

```javascript
// progression.js — centralized tier resolution
export function getState(score) {
  return {
    // Existing V2 fields
    blinkProbability: resolveThreshold(score, CONFIG.BLINK_THRESHOLDS),
    comboProbability: resolveThreshold(score, CONFIG.COMBO_THRESHOLDS),
    phoneTier: resolveThreshold(score, CONFIG.PHONE_TIERS),

    // V4 Visual Enhancement fields
    background: resolveThreshold(score, CONFIG.BACKGROUND_PROGRESSION, 'background'),
    gridLine: resolveThreshold(score, CONFIG.BACKGROUND_PROGRESSION, 'gridLine'),
    glowIntensity: resolveThreshold(score, CONFIG.FOOD_GLOW, 'blur'),
    lineOpacity: resolveThreshold(score, CONFIG.GRID_OPACITY_PROGRESSION, 'lineOpacity'),
    dotOpacity: resolveThreshold(score, CONFIG.GRID_OPACITY_PROGRESSION, 'dotOpacity')
  };
}
```

**Rationale:**
- Single source of truth for score-tier mapping
- One call per frame in render loop (performance)
- Future visual systems extend this pattern, not create parallel resolution
- Aligns with Axiom 1: "Score-based, never time-based"

**Implementation Rule:**
- `render.js` calls `progression.getState(gameState.score)` ONCE per frame
- Destructure all 8 fields at top of render function
- Pass resolved values to sub-rendering functions
- NEVER call `getState()` multiple times in the same frame

**Anti-Pattern:**
```javascript
// WRONG — multiple calls per frame
const bg = progression.getState(score).background;
const glow = progression.getState(score).glowIntensity;
const opacity = progression.getState(score).lineOpacity;
```

**Correct Pattern:**
```javascript
// CORRECT — single call, destructure
const progressionState = progression.getState(gameState.score);
const { background, glowIntensity, lineOpacity, dotOpacity } = progressionState;
```

**Module Ownership:**
- `config.js`: Owns all threshold tables (tunable data)
- `progression.js`: Resolves score → tier (logic)
- `render.js`: Consumes resolved values (rendering)

---

### Decision 12: CSS/Canvas Hybrid Rendering Architecture

**Decision:** Visual rendering is split across two layers with clear boundaries: CSS for declarative styling/transitions, Canvas for real-time gameplay drawing.

**Rendering Boundaries:**

| Layer | Technology | Responsibilities | Examples |
|-------|------------|------------------|----------|
| **Canvas** | Canvas 2D API | Real-time 60 FPS gameplay visuals that change every frame | Food shapes, snake segments, grid lines, grid dots |
| **CSS** | Stylesheets + transitions | Declarative styling, smooth transitions, overlays | Background color, border color, text effects, scanlines |

**Canvas Background Pattern:**

Use CSS `background-color` on the canvas element, NOT canvas drawing API `fillRect()`.

```javascript
// render.js or game.js
function updateCanvasBackground(gameState) {
  const canvas = document.getElementById('game-canvas');
  const { background } = progression.getState(gameState.score);

  // CSS background-color (GPU-composited transition)
  canvas.style.backgroundColor = background;
}
```

**CSS Transition Rule:**
```css
#game-canvas {
  transition: background-color 2000ms ease-in-out;
}
```

**Why CSS for Background:**
- Browser handles color interpolation automatically (no manual lerp math)
- GPU-composited (zero CPU cost)
- Matches existing combo mode transition pattern
- Canvas drawing operations don't support CSS transitions

**Why Canvas for Food/Snake:**
- Positions change every frame (can't predefine in CSS)
- Collision detection requires pixel-perfect coordinates
- 60 FPS updates (too fast for CSS animations)

**Integration Point:**
- Call `updateCanvasBackground(gameState)` in `game.js` update loop, before `render()`
- Only update when tier changes (cache last background value to prevent redundant DOM writes)

**Caching Pattern:**
```javascript
let lastBackgroundTier = null;

function updateCanvasBackground(gameState) {
  const { background } = progression.getState(gameState.score);

  // Only touch DOM if background tier actually changed
  if (background !== lastBackgroundTier) {
    canvas.style.backgroundColor = background;
    lastBackgroundTier = background;
  }
}
```

---

### Decision 13: Defensive Rendering with Auto-Cleanup Pattern

**Decision:** Canvas rendering operations that modify context state (shadow, opacity, transform) MUST use higher-order functions that guarantee cleanup.

**Problem:**
Canvas 2D context carries implicit state across draw calls. If you forget to reset `shadowBlur`, the glow bleeds onto subsequent draws (snake, grid, everything).

**Defensive Pattern:**

```javascript
// render.js — defensive shadow pattern
function withShadow(ctx, shadowConfig, drawFn) {
  const { color, blur } = shadowConfig;

  // Apply shadow state
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Execute draw function
  drawFn(ctx);

  // GUARANTEED cleanup (even if drawFn throws)
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// Usage in renderFood()
export function renderFood(ctx, gameState) {
  const { position, type, color } = gameState.food;
  const { glowIntensity } = progression.getState(gameState.score);

  withShadow(ctx, { color: color, blur: glowIntensity }, (ctx) => {
    renderFoodShape(ctx, x, y, type, color, outlineColor);
  });

  // Shadow state is guaranteed clean here
}
```

**Extensible Pattern:**

This pattern extends to other stateful canvas operations:

```javascript
// Higher-order functions for other canvas state
function withOpacity(ctx, alpha, drawFn) {
  const prev = ctx.globalAlpha;
  ctx.globalAlpha = alpha;
  drawFn(ctx);
  ctx.globalAlpha = prev;
}

function withTransform(ctx, matrix, drawFn) {
  ctx.save();
  ctx.setTransform(...matrix);
  drawFn(ctx);
  ctx.restore();
}

function withClip(ctx, path, drawFn) {
  ctx.save();
  ctx.clip(path);
  drawFn(ctx);
  ctx.restore();
}
```

**Rationale:**
- Makes cleanup automatic and un-forgettable
- Developer can't accidentally skip reset
- Functional programming pattern (pure, composable)
- Self-documenting (the name `withShadow` signals "this handles shadow state")

**Implementation Rule:**
- ALL canvas state modifications MUST use `withX()` pattern
- NO manual `ctx.shadowBlur = 0` scattered in code
- Create the helper function once, use everywhere

**Anti-Pattern:**
```javascript
// WRONG — manual cleanup, easy to forget
ctx.shadowBlur = 8;
renderFoodShape(ctx, x, y, type, color, outlineColor);
ctx.shadowBlur = 0;  // If this line is forgotten, bug!
```

---

### Decision 14: Performance Budgets for Visual Enhancements

**Decision:** All visual enhancements MUST meet a 58 FPS minimum threshold on mid-range devices. Enhancements that fail this budget require optimization before shipping.

**Performance Budget:**

| Metric | Threshold | Test Scenario |
|--------|-----------|---------------|
| **Average FPS** | ≥ 58 FPS | 10-second gameplay recording at score 100+ (worst-case visual complexity) |
| **GPU Usage** | < 60% | Stress test with all systems active (combo + phone + max snake length) |
| **Frame Time** | < 16.67ms | 95th percentile frame time (allows 2 FPS margin) |

**Optimization Strategies:**

#### Grid Dots (525 arc calls per frame)

**Naive Implementation:**
```javascript
// 525 circles × 2 ops (arc + fill) = 1,050 canvas ops per frame
for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
  for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
    ctx.beginPath();
    ctx.arc(x * CONFIG.UNIT_SIZE, y * CONFIG.UNIT_SIZE, CONFIG.GRID_DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}
```

**Optimized Implementation (Offscreen Canvas):**
```javascript
// Render dots to offscreen canvas ONCE, stamp 60x/sec
let gridDotsCache = null;

function renderGridDots(ctx, gameState) {
  const { gridLine, dotOpacity } = progression.getState(gameState.score);

  // Invalidate cache only when opacity tier changes
  if (!gridDotsCache || gridDotsCache.opacity !== dotOpacity) {
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');

    // Render all 525 dots ONCE
    offCtx.fillStyle = gridLine;
    offCtx.globalAlpha = dotOpacity;
    for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
      for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
        offCtx.beginPath();
        offCtx.arc(x * CONFIG.UNIT_SIZE, y * CONFIG.UNIT_SIZE, CONFIG.GRID_DOT_RADIUS, 0, Math.PI * 2);
        offCtx.fill();
      }
    }

    gridDotsCache = { canvas: offscreen, opacity: dotOpacity };
  }

  // Single drawImage call (1 op instead of 1,050)
  ctx.drawImage(gridDotsCache.canvas, 0, 0);
}
```

**Performance Impact:** ~1000x reduction in canvas ops (1 drawImage vs 1,050 arc/fill calls).

**Cache Invalidation:** Only when opacity tier changes (6 times per game maximum, not 60x/sec).

**Implementation Rule:**
- Implement offscreen canvas optimization from day one, not as fallback
- Any rendering operation with > 100 canvas ops per frame requires caching review
- Profile with DevTools Performance tab before shipping

**Validation Process:**
1. Implement enhancement
2. Record 10-second gameplay at score 100+ in DevTools Performance
3. Check FPS graph for sustained 58+ FPS
4. If < 58 FPS, implement optimization strategy
5. Re-test until budget met

---

### Decision 15: Border State Orchestration Pattern

**Decision:** Multiple game systems can trigger border color changes. A priority cascade with event-driven updates (not polling) resolves conflicts.

**Priority Order (Highest to Lowest):**

1. **Death flash** (500ms red flash, then return to underlying state)
2. **Phone states** (ringing = gold, picked up = green)
3. **Combo mode** (matches canvas color)
4. **Active effects** (reverse controls = orange, invincibility = yellow)
5. **Default** (purple)

**Implementation Pattern:**

```javascript
// game.js — border state orchestration
function updateBorderState(gameState) {
  const canvas = document.getElementById('game-canvas');

  // Clear all border classes
  canvas.classList.remove(
    'border-death',
    'border-phone-ring',
    'border-phone-pickup',
    'border-combo',
    'border-reverse',
    'border-invincibility'
  );

  // Priority cascade
  if (gameState.justDied) {
    canvas.classList.add('border-death');
    setTimeout(() => {
      canvas.classList.remove('border-death');
      updateBorderState(gameState); // Re-evaluate after flash
    }, CONFIG.BORDER_DEATH_FLASH_DURATION);
    return;
  }

  if (gameState.phoneCall.active && !gameState.phoneCall.pickedUp) {
    canvas.classList.add('border-phone-ring');
    return;
  }

  if (gameState.phoneCall.pickedUp && gameState.phoneCall.pickUpEndTime > Date.now()) {
    canvas.classList.add('border-phone-pickup');
    return;
  }

  if (gameState.combo.active) {
    canvas.classList.add('border-combo');
    canvas.style.borderColor = gameState.combo.canvasColor;
    return;
  }

  if (gameState.activeEffect?.type === 'reverseControls') {
    canvas.classList.add('border-reverse');
    return;
  }

  if (gameState.activeEffect?.type === 'invincibility') {
    canvas.classList.add('border-invincibility');
    return;
  }

  // Default purple (CSS default)
  canvas.style.borderColor = '';
}
```

**Event-Driven Call Points (NOT Polling):**

```javascript
// Call updateBorderState() only when state CHANGES

// In game.js event handlers:
function onPhoneShow(gameState) {
  // ... phone logic ...
  updateBorderState(gameState);  // State changed
}

function onPhonePickup(gameState) {
  // ... pickup logic ...
  updateBorderState(gameState);  // Immediate border change

  // Timer expiration callback (one-shot, not polling)
  setTimeout(() => {
    gameState.phoneCall.pickedUp = false;
    updateBorderState(gameState);
  }, pickupDuration);
}

function onFoodEaten(gameState) {
  // ... food logic ...
  if (effectChanged) {
    updateBorderState(gameState);  // Only if effect changed
  }
}

function onDeath(gameState) {
  // ... death logic ...
  gameState.justDied = true;
  updateBorderState(gameState);
  setTimeout(() => {
    gameState.justDied = false;
  }, CONFIG.BORDER_DEATH_FLASH_DURATION);
}
```

**CSS Setup:**

```css
#game-canvas {
  border: 8px solid #800080;  /* Default purple */
  transition: border-color 300ms ease-in-out;
}

.border-phone-ring { border-color: #FFD700; }
.border-phone-pickup { border-color: #28a745; }
.border-invincibility { border-color: #FFFF00; }
.border-reverse { border-color: #FFA500; }
.border-death {
  border-color: #FF0000;
  transition: border-color 100ms ease-in;  /* Fast snap */
}
```

**Rationale:**
- Event-driven reduces border evaluation from 60x/sec to ~5x/game
- Priority cascade ensures deterministic behavior when systems overlap
- CSS classes make state transitions declarative
- `setTimeout` for timer expiration (one-shot callback, not polling)

**Implementation Rule:**
- NEVER poll border state in game loop
- ONLY call `updateBorderState()` in event handlers when state changes
- Future systems: add to priority cascade in correct order

**Anti-Pattern:**
```javascript
// WRONG — polling in game loop
function update(gameState) {
  // ... game logic ...
  updateBorderState(gameState);  // Called 60x/sec, wasteful!
}
```

---

## V4 Implementation Patterns

### Pattern 11: Progression State Destructuring

**Context:** `progression.getState()` now returns 8 fields. Calling it multiple times per frame is wasteful.

**Pattern:**

```javascript
// render.js — call once, destructure all
export function render(ctx, gameState) {
  const progressionState = progression.getState(gameState.score);
  const {
    background,
    gridLine,
    glowIntensity,
    lineOpacity,
    dotOpacity
  } = progressionState;

  clearCanvas(ctx);
  renderGrid(ctx, gridLine, lineOpacity);
  renderGridDots(ctx, gridLine, dotOpacity);
  renderFood(ctx, gameState, glowIntensity);
  renderSnake(ctx, gameState);
}
```

**Anti-Pattern:**
```javascript
// WRONG — calling getState() in each sub-function
function renderGrid(ctx, gameState) {
  const { gridLine } = progression.getState(gameState.score);  // Redundant call
  // ...
}

function renderFood(ctx, gameState) {
  const { glowIntensity } = progression.getState(gameState.score);  // Redundant call
  // ...
}
```

---

### Pattern 12: CSS Tier Caching (Prevent DOM Thrashing)

**Context:** Updating `canvas.style.backgroundColor` every frame is wasteful if the tier hasn't changed.

**Pattern:**

```javascript
let lastBackgroundTier = null;

function updateCanvasBackground(gameState) {
  const { background } = progression.getState(gameState.score);

  // Only update DOM if tier actually changed
  if (background !== lastBackgroundTier) {
    canvas.style.backgroundColor = background;
    lastBackgroundTier = background;
  }
}
```

**Rationale:**
- Background tier changes at most 6 times per game (score thresholds)
- DOM writes are expensive (trigger style recalc)
- Caching reduces DOM writes from 60x/sec to 6x/game

---

### Pattern 13: Offscreen Canvas Caching

**Context:** Rendering operations with > 100 canvas ops should be pre-rendered to an offscreen canvas and stamped.

**Pattern:**

```javascript
// Cache structure
let cache = null;

function renderExpensiveLayer(ctx, config) {
  const cacheKey = getCacheKey(config);  // e.g., opacity tier

  // Invalidate cache if config changed
  if (!cache || cache.key !== cacheKey) {
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');

    // Render expensive operation ONCE to offscreen
    renderExpensiveOperationToOffscreen(offCtx, config);

    cache = { canvas: offscreen, key: cacheKey };
  }

  // Stamp cached result (single drawImage)
  ctx.drawImage(cache.canvas, 0, 0);
}
```

**When to Use:**
- Grid dots (525 circles)
- Static background patterns
- Complex shape assemblies that don't change every frame

**When NOT to Use:**
- Food position (changes every frame when eaten)
- Snake segments (position changes every tick)
- Dynamic per-frame effects

---

## V4 Module Boundaries

### Extended Module Responsibilities

| Module | V4 Additions |
|--------|--------------|
| `config.js` | 6 new config sections: BACKGROUND_PROGRESSION, FOOD_GLOW, BORDER_COLORS, GRID_OPACITY_PROGRESSION, food outline colors, snake outline threshold |
| `progression.js` | Extended `getState()` return: 8 fields total (3 existing + 5 new) |
| `render.js` | New functions: `withShadow()`, `renderFoodShape()`, `renderGridDots()`, `renderSnakeHead()`. Updated: `renderGrid()`, `renderFood()`, `renderSnake()` |
| `game.js` | New functions: `updateCanvasBackground()`, `updateBorderState()`. Event-driven border calls in handlers. |
| `style.css` | New sections: Typography text-shadow rules, scanline pseudo-element, border state classes, high score pulse animation |

### Module Communication Flow (V4)

```
┌─────────────┐
│   game.js   │ (orchestrator)
└──────┬──────┘
       │
       ├─→ updateCanvasBackground(gameState) → canvas.style.backgroundColor
       ├─→ updateBorderState(gameState) → canvas.classList + borderColor
       │
       └─→ render(ctx, gameState)
                 │
                 ├─→ progression.getState(score) → { 8 fields }
                 │
                 ├─→ renderGrid(ctx, gridLine, lineOpacity)
                 ├─→ renderGridDots(ctx, gridLine, dotOpacity)
                 ├─→ renderFood(ctx, gameState, glowIntensity)
                 │     └─→ withShadow(ctx, config, drawFn)
                 │           └─→ renderFoodShape(ctx, x, y, type, color, outline)
                 └─→ renderSnake(ctx, gameState)
                       └─→ renderSnakeHead(ctx, x, y, direction, gameState)
```

---

## V4 Performance Profile

**Before V4:**
- Canvas ops per frame: ~150 (grid lines + snake + food)
- DOM updates per frame: 0 (all canvas)
- Average FPS: 60

**After V4 (Naive Implementation):**
- Canvas ops per frame: ~1,200 (grid + grid dots + food glow/shapes + snake)
- DOM updates per frame: 1-2 (background color check, border state check)
- Predicted FPS: 45-50 (fails budget)

**After V4 (Optimized Implementation):**
- Canvas ops per frame: ~200 (grid + grid dots cached + food glow/shapes + snake)
- DOM updates per frame: 0.1 average (cached tier checks)
- Predicted FPS: 58-60 (meets budget)

**Key Optimizations:**
1. Offscreen canvas for grid dots (1,050 ops → 1 op)
2. CSS tier caching (60 DOM writes/sec → 0.1 writes/sec)
3. Event-driven border updates (60 checks/sec → ~5 checks/game)

---

## V4 Implementation Sequence

### Phase 1: Infrastructure (Batch 0)

**Goal:** Extend config and progression without visual changes.

1. Add 6 new config sections to `config.js`
2. Extend `progression.js` `getState()` to return 8 fields
3. Add `resolveThreshold()` field parameter support
4. Test: `progression.getState(50)` returns all 8 fields correctly

**Validation:** No visual changes, but progression engine is ready.

---

### Phase 2: Neon Noir Foundation (Batch 1)

**Goal:** Deliver score-based visual transformation (light → dark).

**Implementation order:**
1. Food glow (Enhancement 3) — `withShadow()` pattern, smallest change
2. Food shapes (Enhancement 2) — `renderFoodShape()`, dual-channel recognition
3. Dark playfield (Enhancement 1) — `updateCanvasBackground()`, CSS transition
4. Typography (Enhancement 5) — CSS text-shadow rules, no JS changes

**Deliverable:** Game transforms from bright playfield to neon arcade void at high scores.

**Validation:** Visual progression at scores 0, 15, 50, 80, 100. Food items glow on dark backgrounds.

---

### Phase 3: Character & Atmosphere (Batch 2)

**Goal:** Detail layers (snake personality, grid texture, border feedback).

**Implementation order:**
1. Grid dots (Enhancement 8) — with offscreen canvas optimization from day one
2. Snake head (Enhancement 4) — pupils, highlight, outline
3. Reactive border (Enhancement 7) — event-driven `updateBorderState()`
4. Scanlines (Enhancement 6) — CSS pseudo-element

**Deliverable:** Snake has directional gaze, border communicates state, playfield has CRT texture.

**Validation:** Snake pupils track direction. Border changes color for phone/combo/effects. Scanlines visible on dark backgrounds.

---

## V4 Quality Assurance

### Architectural Coherence Checks

- [ ] All V4 patterns compatible with V1+V2+V3 foundations
- [ ] No breaking changes to existing modules
- [ ] Module boundaries respected (config, progression, render, game)
- [ ] Performance budgets met (58+ FPS worst-case)
- [ ] CSS/Canvas hybrid boundaries clear

### Implementation Readiness

- [ ] All 5 decisions documented with code examples
- [ ] All 3 patterns documented with anti-patterns
- [ ] Module responsibilities updated
- [ ] Performance optimization strategies defined
- [ ] Implementation sequence ordered with dependencies

### Risk Mitigation

- [ ] Canvas shadow state leak → `withShadow()` auto-cleanup
- [ ] Grid dot performance → offscreen canvas from day one
- [ ] Border state thrashing → event-driven, not polling
- [ ] CSS transition conflicts → tier caching prevents DOM spam

---

## V4 Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow V4:** COMPLETED ✅
**Total Decisions:** 21 (v1: 5, v2: 5, v3: 6, v4: 5)
**Total Patterns:** 23 (v1-v3: 10, v4: 3)
**V4 Date Completed:** 2026-02-16
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### V4 Deliverables

**5 New Architectural Decisions**
- Decision 11: Score-Gated Visual Progression System
- Decision 12: CSS/Canvas Hybrid Rendering Architecture
- Decision 13: Defensive Rendering with Auto-Cleanup Pattern
- Decision 14: Performance Budgets for Visual Enhancements
- Decision 15: Border State Orchestration Pattern

**3 New Implementation Patterns**
- Pattern 11: Progression State Destructuring
- Pattern 12: CSS Tier Caching
- Pattern 13: Offscreen Canvas Caching

**Module Extensions**
- 5 modules extended: config, progression, render, game, style.css
- New helper functions: `withShadow()`, `renderFoodShape()`, `renderGridDots()`, `renderSnakeHead()`, `updateCanvasBackground()`, `updateBorderState()`

**Performance Architecture**
- 58 FPS minimum budget defined
- Offscreen canvas optimization strategy documented
- Event-driven state management patterns established

---

## UX Design Authority (MANDATORY FOR ALL FRONTEND WORK)

**🚨 CRITICAL: Before ANY frontend, visual, or UI implementation:**

All agents (Dev, Architect, PM, etc.) working on visual systems, UI components, or user-facing features **MUST** read and follow Sally's UX design specifications.

**Required UX Documents (Read BEFORE Implementation):**

1. **`game-ux-principles.md`** — Cognitive science foundation (Hodent, 2018)
   - Five-Question Filter for all design decisions
   - 7 non-negotiable design axioms
   - **READ THIS FIRST** before proposing any game mechanic or visual change

2. **`dataviz-principles.md`** — Data visualization baseline
   - **MANDATORY for Cognitive Dashboard work**
   - 5 universal tenets, operational design rules, 12-point design checklist

3. **`ux-design-retro-graphic-upgrade.md`** — V4 visual enhancement specifications
   - 8 enhancements with pixel-perfect specs validated against Five-Question Filter

4. **`ux-design-retro-graphic-upgrade-technical-addendum.md`** — V4 implementation patterns
   - Code-level specifications, performance validation, integration checklists

5. **`ux-design-cognitive-dashboard.md`** — V3 Skill Map & dashboard UX
   - Pixel block bar specifications, calibration experience, comedy integration

**UX Design Compliance Rules:**

**NEVER:**
- Implement visual features without checking Sally's specs first
- Deviate from established design patterns (retro pixel aesthetic, score-based progression, comedy integration)
- Add UI elements that contradict the Five-Question Filter
- Use clinical language in dashboard UI (violates Axiom: "Comedy is a system")
- Implement time-based visual progression (violates Axiom 1: "Score-based, never time-based")

**ALWAYS:**
- Reference Sally's specifications for colors, sizes, layouts, animations
- Validate new visual ideas against game-ux-principles.md before proposing
- Maintain visual coherence across all screens (menu → playing → game-over → skill map)
- Use the retro pixel aesthetic consistently (Jersey20 font, 64x64 portraits, neon colors, CRT effects)

**Visual Coherence Checklist:**

Before shipping any visual change:
- [ ] Aligns with 80s retro aesthetic (neon colors, pixel art, CRT simulation)
- [ ] Passes Five-Question Filter (working memory, competence feedback, clarity, flow, emotional impact)
- [ ] Maintains score-based progression (never time-based)
- [ ] Preserves comedy integration (tech puns, retro humor, celebratory tone)
- [ ] Matches existing visual vocabulary (colors, fonts, shapes, spacing)
- [ ] Documented in Sally's UX specs OR approved by UX Designer agent

**Bottom line:** Sally's UX work is the **visual design bible** for CrazySnake. Treat it with the same authority as this architecture document.

---

**Architecture Status:** READY FOR V4 IMPLEMENTATION ✅

**Next Phase:** Create epics and stories from V4 architecture, then begin Phase 1 (infrastructure).

**Document Maintenance:** Update this architecture when new visual enhancements are added or performance budgets change.
