---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
v2CompletedAt: '2026-02-07'
status: 'in-progress'
v1CompletedAt: '2026-01-23'
v2StartedAt: '2026-02-07'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/game-design-food-v2.md'
  - '_bmad-output/planning-artifacts/game-design-phone-calls-v2.md'
  - '_bmad-output/planning-artifacts/ux-design-food-phone-v2.md'
workflowType: 'architecture'
project_name: 'CrazySnakeLite'
user_name: 'Tomoco'
date: '2026-02-07'
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

---

# V2 Architecture Evolution — Food v2 + Phone Calls v2

_This section extends the v1 architecture with decisions for the three new game systems: Fibonacci Scoring & Progressive Complexity (Food v2), Phone Call Pick Up vs End Enhancement (Phone Calls v2), and their unified UX specification._

_V2 evolution started: 2026-02-07_

---

## V2 Project Context Analysis

### New Design Inputs

Three new design documents drive this architecture evolution:

1. **game-design-food-v2.md** — Fibonacci scoring (0 to +8 per food type), progressive blinking food (score 20+), combo mode with multiplicative scoring (score 40+)
2. **game-design-phone-calls-v2.md** — Two-button phone overlay (End vs Pick Up), Fibonacci Pick Up bonus escalation (+2 to +34), score-based call frequency tiers, caller portraits + one-liners, variable Pick Up timer (1-3s)
3. **ux-design-food-phone-v2.md** — Pixel-perfect UX specifications for all v2 visual systems: score popups, blinking food, combo mode visuals, phone overlay redesign, cross-system interaction rules, accessibility/reduced motion

### New Functional Requirements Summary

**Food v2 System:**
- Fibonacci scoring: Invincibility=0, Growing=+1, SpeedDecrease=+2, WallPhase=+1/+3 (conditional), SpeedBoost=+5, ReverseControls=+8
- Score popup system: 5 visual tiers with escalating salience (size, color, bounce, glow, particles, screen shake)
- Progressive blinking food: 0% at score 0-19, escalating to 80% at score 120+
- Color cycling animation: 200ms per color through all 6 food colors, effect locked at spawn but hidden
- Food shadow system: 2px drop shadow for spatial anchoring during color cycling
- First-time tooltip: "Mystery Food!" at score 20
- Combo mode: Probability-based activation (10% at score 40, capping at 50% at score 120+)
- Canvas background color transitions: 500ms fade to random dark color (4 options)
- Striped snake rendering: Alternating segment colors for Effect A / Effect B
- Conditional segment borders: 1px black when adjacent colors are similar
- Multiplicative scoring: Effect A score × Effect B score
- Combo lifecycle: Activate → eat food B (stripe + multiply) → eat food C (exit combo)

**Phone Calls v2 System:**
- Two-button overlay: End (Space, +1 flat) and Pick Up (Enter, Fibonacci bonus)
- Fibonacci Pick Up bonus: [+2, +3, +5, +8, +13, +21, +34] per consecutive pickup per game, capped at +34
- Score-based grace period: No calls until score >= 5
- Score-based call frequency: 5 tiers from relaxed (12-20s at score 5) to relentless (4-8s at score 100+)
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
| **Dependencies** | Zero external | **Confirmed** — no runtime dependencies added |

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

**All 8 Critical Decisions — Made:**

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

**Deferred Decisions:**
- Test runner upgrade (deferred to Test Architect workflow)
- Color-blind shape coding for food (post-launch enhancement)
- Haptic feedback on mobile (post-launch enhancement)

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

  ui: {
    mysteryFoodTooltipShown: false,
    lastPopupTime: 0
  }
};
```

**Reset Rules (state.js):**
- On new game: ALL v2 fields reset. `phoneCall.pickUpCount` → 0. `combo` → inactive. `ui.mysteryFoodTooltipShown` → false.
- On Play Again: Same full reset.

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
  // ... game over flow
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
// Blinking food probability by score
BLINK_THRESHOLDS: [
  { minScore: 0, probability: 0 },
  { minScore: 20, probability: 0.1 },
  { minScore: 25, probability: 0.2 },
  { minScore: 30, probability: 0.3 },
  { minScore: 40, probability: 0.4 },
  { minScore: 60, probability: 0.5 },
  { minScore: 80, probability: 0.6 },
  { minScore: 100, probability: 0.7 },
  { minScore: 120, probability: 0.8 }
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
  { minScore: 5, minDelay: 12000, maxDelay: 20000 },
  { minScore: 20, minDelay: 8000, maxDelay: 15000 },
  { minScore: 40, minDelay: 6000, maxDelay: 12000 },
  { minScore: 60, minDelay: 5000, maxDelay: 10000 },
  { minScore: 100, minDelay: 4000, maxDelay: 8000 }
],

PHONE_GRACE_SCORE: 5
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
  ├─→ score-popup.js (display)
  ├─→ combo.js (delegate when active)
  ├─→ phone.js (schedule, show, dismiss)
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
│   └── score-popup.js            # NEW: DOM popup lifecycle — spawnPopup(), spawnParticles(), triggerScreenShake()
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

**Total: 18 JS modules (14 v1 + 4 new) · 49 asset files (27 audio + 21 portraits + 1 fallback)**

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
| **score-popup.js** _(NEW)_ | DOM popup lifecycle — create, animate, queue, cleanup | `spawnPopup()`, `spawnParticles()`, `triggerScreenShake()` |

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
    │  Self-cleaning via animationend         │
    └────────────────────────────────────────┘
```

**V2 Boundary Rules (extends v1):**

| Boundary | Rule | V2 Additions |
|----------|------|-------------|
| **State Access** | Only through passed `gameState` parameter | All 4 new modules follow same pattern |
| **DOM Access** | `main.js` (setup), `phone.js` (overlay), `score-popup.js` (popups) | score-popup.js is a new DOM-accessing module |
| **Canvas Access** | Only `render.js` draws to canvas | render.js reads combo.canvasColor for background |
| **Scoring Logic** | Only `scoring.js` calculates score values | No scoring math anywhere else |
| **Threshold Data** | Only `config.js` holds threshold tables | progression.js reads, never owns thresholds |
| **Tier Resolution** | Only `progression.js` resolves score → tier | Consumers call getState() once, destructure |
| **Combo Logic** | Only `combo.js` manages combo state machine | game.js delegates, never manipulates combo fields directly |
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
4. Game over screen shows final score
5. On restart: state.js resets ALL v2 fields (combo, phone.pickUpCount, ui)
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
  <div id="gameover-screen" class="hidden"><!-- unchanged --></div>
</div>
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

/* === V2: Mystery Tooltip === */
/* #mystery-tooltip positioning and fade animation */

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
All 8 v2 architectural decisions work together without conflicts:
- `scoring.js` (pure calculation) → `game.js` (orchestrator) → `score-popup.js` (pure UI) — clean unidirectional flow
- `progression.js` (pure lookup) feeds thresholds to food.js, game.js, phone.js — single source of truth, no circular dependencies
- `combo.js` (state machine) delegates scoring to `scoring.js`, canvas visuals to CSS classes — proper separation of concerns
- `phone.js` (self-contained) queries `progression.js` for scheduling, `scoring.js` for bonuses — no ownership conflicts
- Guard clause orchestration in `game.js` keeps cross-system rules explicit and co-located

**Pattern Consistency:**
All v2 patterns extend v1 without contradiction:
- 4 new modules follow named exports, camelCase, explicit gameState passing — identical to v1
- `{ type, scoreValue }` effect data format is consistent across combo↔scoring↔game boundaries
- DOM lifecycle pattern (`animationend` cleanup) is uniform for all ephemeral elements
- CSS class-based state management applies uniformly (phone overlay states, combo canvas)
- Asset path naming follows single convention: `assets/sounds/{cat}-{desc}.mp3`, `assets/callers/{name}.png`

**Structure Alignment:**
V2 project structure directly supports all architectural decisions:
- 18 modules map to responsibilities with no overlaps
- 4 new modules have single, well-defined purposes
- Boundary rules are explicit and non-conflicting
- Data flow diagrams show clean producer→consumer paths

### Requirements Coverage Validation ✅

**Food v2 System — All Requirements Covered:**
- Fibonacci scoring values (0/+1/+2/+1|3/+5/+8) → `scoring.js` + `config.js`
- Score popup system (5 visual tiers) → `score-popup.js` + CSS @keyframes
- Progressive blinking food (score 20+, escalating probability) → `food.js` + `progression.js` + `render.js`
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
- Score-based grace period (no calls until score >= 5) → `progression.js` + `config.js` PHONE_GRACE_SCORE
- Score-based call frequency (5 tiers) → `progression.js` + `config.js` PHONE_CALL_TIERS
- Variable Pick Up timer (1-3s) + countdown bar → `phone.js` internal
- 21 callers with portraits + one-liners → `phone.js` CALLERS data + `assets/callers/`
- Pick Up irreversibility → `phone.js` state machine (ringing → pickedUp, no back)
- Consolation reward on death → `game.js` onDeath() checks `phoneCall.pickedUp`
- Portrait fallback → `<img>` onerror → `assets/PhoneIcone01_256px.png`

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
- Maintainability: 4 new modules, each single-purpose. Scoring economy auditable in one file. Progression thresholds tunable in config.

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All 8 v2 decisions documented with rationale, code examples, and API surfaces
- Decision dependency chain mapped (config → progression → consumers; config → scoring → game → popup)
- Module boundaries explicit with producer/consumer table
- Data flow diagrams for all 3 major scenarios (food eating, phone call, death)

**Structure Completeness:**
- 18 JS modules defined with responsibilities and FR mapping
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
1. **`feedback.js` vs `score-popup.js` — No overlap, no consolidation needed.** `feedback.js` is the email feedback modal system (star ratings, character counter, mailto submission) — entirely unrelated to score popups. The naming may appear to suggest overlap, but the modules serve completely different purposes. `feedback.js` manages a persistent user-initiated modal; `score-popup.js` manages ephemeral game-triggered DOM popups. Both are valid DOM-accessing modules with distinct lifecycles. No deprecation or consolidation required.
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
- [x] 8 critical v2 decisions documented with rationale and code examples
- [x] Decision dependency chain mapped
- [x] Deferred decisions explicitly noted (test runner, color-blind shapes, haptics)
- [x] All decisions compatible with v1 foundations

**✅ V2 Implementation Patterns**
- [x] 8 v2-specific consistency patterns defined with examples
- [x] Anti-pattern table for AI agent guidance
- [x] V1 patterns confirmed as unchanged
- [x] Enforcement guidelines updated for combined v1+v2

**✅ V2 Project Structure**
- [x] Complete v2 directory tree (18 modules, 49 assets)
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
- 4 new modules each have surgical, non-overlapping responsibilities
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
**Total Steps Completed:** 8 (v1) + 8 (v2 evolution)
**V1 Completed:** 2026-01-23
**V2 Completed:** 2026-02-07
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### V2 Final Architecture Deliverables

**Complete V2 Architecture Document**
- V1 architecture preserved in full (foundation)
- V2 evolution appended: context analysis, stack confirmation, 8 decisions, 8 patterns, project structure, validation
- 3 design documents fully incorporated (food-v2, phone-calls-v2, ux-design-food-phone-v2)

**V2 Implementation Ready Foundation**
- 8 v2 architectural decisions made with Tomoco
- 8 v2 implementation patterns defined (extending v1 patterns)
- 18 JavaScript modules specified (14 v1 + 4 new)
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
2. Extend `state.js` with v2 gameState fields (combo, phone v2, effects, ui)
3. Create `scoring.js` (pure calculation module — foundation for everything)
4. Create `progression.js` (score → tier resolution — feeds food, game, phone)
5. Create `score-popup.js` (DOM popup system — CSS animations, particles, shake)
6. Create `combo.js` (combo state machine — 3-phase lifecycle)
7. Evolve `phone.js` (two-button UI, Pick Up timer, portraits, one-liners)
8. Evolve `food.js` (blinking determination via progression.js)
9. Evolve `effects.js` (wallPhaseUsed tracking)
10. Evolve `render.js` (blink colors, striped snake, combo canvas, food shadows)
11. Evolve `game.js` (cross-system orchestration, popup triggering, blink cycling)
12. Evolve `audio.js` (v2 sounds, priority system)
13. Evolve `input.js` (Enter key for Pick Up)
14. Update `index.html` (popup container, phone v2 overlay, mystery tooltip)
15. Update `style.css` (v2 sections: popups, particles, combo, phone v2, reduced motion)

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
- [x] Structure is complete with 18 modules and 49 assets
- [x] Data flow diagrams guide implementation order

---

**Architecture Status:** READY FOR V2 IMPLEMENTATION ✅

**Next Phase:** Create epics and stories from v2 architecture, then begin implementation.

**Document Maintenance:** Update this architecture when major technical decisions are made during v2 implementation.

