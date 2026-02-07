---
project_name: 'CrazySnakeLite'
user_name: 'Tomoco'
date: '2026-02-07'
v1_date: '2026-01-23'
sections_completed: ['technology_stack', 'implementation_rules', 'anti_patterns', 'architecture_rules', 'file_responsibilities', 'testing']
status: 'complete'
v2_update: true
optimized_for_llm: true
---

# Project Context for AI Agents

_Critical rules and patterns for implementing CrazySnakeLite. Read this before writing any code._
_Updated for v2: Food v2 (Fibonacci scoring, blinking food, combo mode) + Phone Calls v2 (Pick Up vs End, caller portraits)._

---

## Technology Stack

| Technology | Details |
|------------|---------|
| **Language** | Vanilla JavaScript (ES6+) |
| **Rendering** | HTML5 Canvas API |
| **Modules** | ES6 modules (`type="module"` in script tag) |
| **Styling** | Plain CSS |
| **Build** | None - direct file serving |
| **Dependencies** | Zero external dependencies |

**Local Development:** Requires local server for ES6 modules (use `python -m http.server 8000` or VS Code Live Server)

---

## Critical Implementation Rules

### Data Formats (MUST follow exactly)

```javascript
// Positions: ALWAYS use { x, y } objects
const position = { x: 5, y: 10 };     // CORRECT
const position = [5, 10];              // WRONG

// Colors: ALWAYS use hex strings
const color = '#FF0000';               // CORRECT
const color = [255, 0, 0];             // WRONG

// Time: ALWAYS use milliseconds
const delay = 15000;                   // CORRECT (15 seconds)
const delay = 15;                      // WRONG

// Directions: ALWAYS use string literals
const dir = 'up';                      // CORRECT
const dir = 0;                         // WRONG
```

### Module Patterns (MUST follow exactly)

```javascript
// ALWAYS use named exports
export function update(gameState) {}   // CORRECT
export default update;                 // WRONG

// ALWAYS import only what's needed
import { update } from './game.js';    // CORRECT
import * as game from './game.js';     // AVOID

// ALWAYS pass gameState explicitly
export function moveSnake(gameState) { // CORRECT
  gameState.snake.segments.unshift(newHead);
}
// NEVER use global state access
```

### V2 Data Formats (MUST follow exactly)

```javascript
// Effect data crossing module boundaries: ALWAYS include scoreValue
const effect = { type: 'speedBoost', scoreValue: 5 };  // CORRECT
const effect = 'speedBoost';                            // WRONG

// Popup labels: consistent convention
scorePopup.spawnPopup(5, x, y, '');              // Food (no label)
scorePopup.spawnPopup(24, x, y, 'COMBO');        // Combo multiplier
scorePopup.spawnPopup(13, x, y, 'CALL BONUS');   // Phone bonus
```

### V2 DOM & CSS Patterns (MUST follow exactly)

```javascript
// DOM popup cleanup: ALWAYS use animationend
el.addEventListener('animationend', () => el.remove()); // CORRECT
setTimeout(() => el.remove(), 800);                     // WRONG

// Visual state changes: ALWAYS use CSS classes
overlay.classList.add('picked-up');                      // CORRECT
endBtn.style.display = 'none';                          // WRONG

// Canvas state: CSS class + custom property
canvas.classList.add('combo-active');                    // CORRECT
canvas.style.setProperty('--combo-color', '#4A148C');   // For dynamic value
canvas.style.backgroundColor = '#4A148C';               // WRONG

// Reduced motion: read CONFIG flag (detected once in main.js)
if (CONFIG.REDUCED_MOTION) { /* ... */ }                // CORRECT
if (window.matchMedia('(prefers-reduced-motion)').matches) // WRONG
```

### V2 Module Patterns (MUST follow exactly)

```javascript
// Progression: call getState() once per context, destructure
const { blinkProbability, comboProbability } = progression.getState(score); // CORRECT

// WRONG: redundant calls in same scope
const a = progression.getState(score).blinkProbability;  // WRONG
const b = progression.getState(score).comboProbability;   // WRONG
```

### V2 Behavioral Invariants (MUST follow exactly)

```javascript
// combo.isActive() MUST check paused state — paused combo is NOT active for food eating
export function isActive(gameState) {
  return gameState.combo.active && !gameState.combo.paused; // CORRECT
  // return gameState.combo.active;                         // WRONG — ignores pause
}

// Wall Phase scoring reset sequence — STRICT ORDER, never reorder:
// 1. READ wallPhaseUsed  2. SCORE  3. CLEAR effect  4. RESET boolean  5. APPLY new effect
const wallPhaseUsed = gameState.effects.wallPhaseUsed;     // 1. Read FIRST
const value = scoring.calculateFoodScore(type, wallPhaseUsed); // 2. Score
effects.clearEffect(gameState);                             // 3. Clear
gameState.effects.wallPhaseUsed = false;                    // 4. Reset
effects.applyEffect(gameState, newType);                    // 5. Apply new

// score-popup.js gridToPixel — MUST use getBoundingClientRect()
function gridToPixel(gridX, gridY) {
  const rect = canvas.getBoundingClientRect();              // CORRECT — dynamic
  return {
    x: rect.left + (gridX * CONFIG.UNIT_SIZE) + (CONFIG.UNIT_SIZE / 2),
    y: rect.top + (gridY * CONFIG.UNIT_SIZE) + (CONFIG.UNIT_SIZE / 2)
  };
  // const x = gridX * CONFIG.UNIT_SIZE;                    // WRONG — ignores layout
}

// game.js orchestration — named handlers, thin loop body
function onFoodEaten(gameState) { /* all food logic here */ }     // CORRECT
function onPhoneCallShow(gameState) { /* all show logic here */ } // CORRECT
function onPhoneCallDismiss(gameState) { /* all dismiss logic */ } // CORRECT
function onDeath(gameState) { /* all death logic here */ }        // CORRECT
// Inline if-else chains in the game loop body                    // WRONG
```

### Configuration Rules

**ALL tunable values MUST be in config.js:**
- Grid dimensions, unit size
- Snake starting parameters
- Speed values and modifiers
- Food probabilities
- Phone call timing
- All colors
- V2: Fibonacci score values, blink/combo/phone threshold tables, combo canvas colors, popup tier specs, phone pickup Fibonacci sequence, phone grace score

**NEVER hardcode magic numbers in other files.**

### V2 Asset Path Rules

```javascript
// Sound files: assets/sounds/{category}-{descriptor}.mp3
'assets/sounds/score-5.mp3'
'assets/sounds/combo-entrance.mp3'
'assets/sounds/phone-ring.mp3'

// Portrait files: assets/callers/{kebab-case-name}.png
'assets/callers/al-gorithm.png'
'assets/callers/floppy-phil.png'
```

All paths relative to project root. All filenames kebab-case.

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `snakeHead`, `foodPosition` |
| Functions | camelCase | `getSnakeHead()`, `spawnFood()` |
| Constants | SCREAMING_SNAKE_CASE | `TICK_RATE`, `GRID_WIDTH` |
| Files | kebab-case | `game-loop.js`, `phone-overlay.js` |
| CSS classes | kebab-case | `.game-container`, `.phone-overlay` |
| CSS IDs | kebab-case | `#game-canvas`, `#phone-overlay` |

### Code Style

- 2-space indentation
- Single quotes for strings: `'hello'` not `"hello"`
- Semicolons required
- One blank line between functions

### Module Boundaries

| Module | Allowed Access |
|--------|---------------|
| **State** | Only through passed `gameState` parameter |
| **DOM** | Only in `main.js` (setup), `phone.js` (overlay), `score-popup.js` (popups) |
| **Canvas** | Only in `render.js` |
| **Scoring Logic** | Only in `scoring.js` — pure calculation, no side effects |
| **Threshold Data** | Only in `config.js` — `progression.js` reads, never owns |
| **Tier Resolution** | Only in `progression.js` — consumers call `getState()` once, destructure |
| **Combo Logic** | Only in `combo.js` — `game.js` delegates, never manipulates combo fields directly |
| **localStorage** | Only in `storage.js` |
| **Audio** | Only in `audio.js` (v2: includes priority system) |
| **Config** | Import `CONFIG` from `config.js` everywhere |

---

## Anti-Patterns to AVOID

| DO NOT | DO INSTEAD |
|--------|------------|
| Use arrays for positions `[x, y]` | Use objects `{ x, y }` |
| Use default exports | Use named exports |
| Hardcode numbers in files | Put in `config.js` |
| Use double quotes `"string"` | Use single quotes `'string'` |
| Access global state | Pass `gameState` to functions |
| Manipulate DOM in game logic | Keep DOM access in designated modules |
| `{ type: 'speedBoost' }` crossing modules without scoreValue | `{ type: 'speedBoost', scoreValue: 5 }` |
| `setTimeout(() => popup.remove(), 800)` | `popup.addEventListener('animationend', () => popup.remove())` |
| `canvas.style.backgroundColor = color` | `canvas.classList.add('combo-active')` + CSS custom property |
| `endBtn.style.display = 'none'` for phone states | `overlay.classList.add('picked-up')` with CSS rules |
| `progression.getState(score)` called multiple times in one function | Call once, destructure: `const { a, b } = getState(score)` |
| `window.matchMedia(...)` in individual modules | Read `CONFIG.REDUCED_MOTION` (detected once in main.js) |
| Scoring math in game.js or combo.js | All scoring calculations in `scoring.js` only |

---

## Game Architecture Rules

### Game Loop

```javascript
// Fixed timestep (125ms = 8 moves/sec) + RAF (60 FPS render)
const TICK_RATE = 125;
let accumulator = 0;

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  while (accumulator >= TICK_RATE) {
    update(gameState);  // Fixed timestep
    accumulator -= TICK_RATE;
  }

  render(ctx, gameState);  // Every frame
  requestAnimationFrame(gameLoop);
}
```

### State Structure (V2)

```javascript
const gameState = {
  phase: 'menu',  // 'menu' | 'playing' | 'gameover'
  isPaused: false,

  snake: {
    segments: [{ x, y }, ...],
    direction: 'right',
    nextDirection: 'right',
    color: '#000000'    // Combo stripe colors derived at render time, NOT stored here
  },

  food: {
    position: { x, y },
    type: 'growing',
    isBlinking: false,       // V2: true if mystery food
    hiddenType: null,        // V2: actual type when blinking
    blinkCycleIndex: 0       // V2: current color in cycle (0-5), updated by game.js each frame
  },

  activeEffect: null,  // { type: 'invincibility' } or null
  score: 0,
  highScore: 0,

  phoneCall: {
    active: false,
    caller: null,
    callerData: null,        // V2: { name, portrait, line }
    nextCallTime: 0,
    pickedUp: false,         // V2: true after Pick Up pressed
    pickUpEndTime: 0,        // V2: when blur timer expires
    pickUpBonus: 0,          // V2: Fibonacci bonus value
    pickUpCount: 0,          // V2: consecutive pickups this game (resets on new game)
    graceActive: true        // V2: no calls until score >= PHONE_GRACE_SCORE
  },

  // V2 NEW
  combo: {
    active: false,
    phase: 'inactive',       // 'inactive' | 'waitingForB' | 'waitingForExit'
    effectA: null,           // { type, scoreValue }
    effectB: null,           // { type, scoreValue }
    canvasColor: null,       // '#4A148C', '#0D47A1', '#B71C1C', or '#1B5E20'
    paused: false            // true when phone overlay active
  },

  effects: {
    wallPhaseUsed: false     // V2: true if wall phased through (for +1/+3 conditional scoring)
  },

  ui: {
    mysteryFoodTooltipShown: false,  // V2: first-time "Mystery Food!" tooltip
    lastPopupTime: 0                 // V2: for 300ms popup stagger
  }
};
```

**Reset Rules:** On new game / Play Again: ALL fields reset. `phoneCall.pickUpCount` → 0. `combo` → inactive. `ui.mysteryFoodTooltipShown` → false.

### Effect Duration Rule

ALL timed effects (invincibility, wall phase, speed boost, speed decrease, reverse controls) end when the NEXT food is eaten. Not time-based.

### V2 Scoring Pipeline

**Score-based, NOT time-based** — all game systems use score thresholds to gate progression.

```
scoring.js (pure calc) → game.js (orchestrate) → score-popup.js (display)
```

**Fibonacci Food Scores:**

| Food Type | Score | Condition |
|-----------|-------|-----------|
| Invincibility | 0 | Always |
| Growing | +1 | Always |
| Speed Decrease | +2 | Always |
| Wall Phase | +1 / +3 | +1 default, +3 if wall actively phased through |
| Speed Boost | +5 | Always |
| Reverse Controls | +8 | Always |

**Combo:** Effect A score × Effect B score (multiplicative)
**Phone:** End = +1 flat. Pick Up = Fibonacci sequence [+2, +3, +5, +8, +13, +21, +34] per consecutive pickup.

### V2 Combo State Machine

```
inactive → waitingForB → waitingForExit → inactive
```

- Probability-based activation (10% at score 40, up to 50% at score 120+)
- Canvas transitions to random dark color (500ms fade)
- Snake renders with alternating stripe pattern (Effect A / Effect B colors)
- 3-food lifecycle: activate → eat food B (stripe + multiply) → eat food C (exit)
- Pauses when phone overlay active, resumes when dismissed

### V2 Phone Call Mechanic

- Game CONTINUES running during phone overlay (critical requirement)
- CSS `filter: blur()` applied to game canvas
- Phone UI is DOM elements, not canvas-rendered
- 60 FPS must be maintained during overlay
- V2: Two buttons — End (Space, +1) and Pick Up (Enter, Fibonacci bonus)
- V2: Pick Up starts 1-3s blur timer with countdown bar, reveals caller one-liner
- V2: Pick Up is irreversible — cannot End once committed
- V2: Consolation reward — Pick Up bonus awarded even on death during blur
- V2: Score-based call frequency (5 tiers from relaxed to relentless)
- V2: Grace period — no calls until score >= 5
- V2: 21 callers with tech pun names, 64x64 pixel portraits, funny one-liners

### V2 Cross-System Orchestration

**Rules live in game.js as guard clauses (NOT event bus):**

| Rule | Implementation |
|------|---------------|
| Combo pauses during phone | `combo.pause()` on phone show, `combo.resume()` on dismiss |
| Combo transition delays 200ms when phone active | Guard clause in combo.js |
| Popup stagger 300ms | score-popup.js checks `lastPopupTime` |
| Phone bonus labeled "CALL BONUS" | Label param passed to spawnPopup() |
| Death awards both combo + phone | game.js onDeath() checks both states |

### V2 Progression Engine

All systems query `progression.getState(score)` for score-based thresholds:
- `blinkProbability` — food.js at spawn time
- `comboProbability` — game.js after food eaten
- `phoneTier` — phone.js when scheduling next call
- `phoneGraceActive` — phone.js before scheduling

Threshold tables live in `config.js`. Resolution logic in `progression.js`.

### Visual Specifications

**Grid Styling:**
- Background: `#E8E8E8` (light grey)
- Grid lines: `#A0A0A0` (darker grey)
- Grid line width: `0.5px`
- Grid opacity: `0.9`
- Unit size: `20px` (canvas 500x400)

**Border Styling:**
- Border color: `#9D4EDD` (purple)
- Border width: `6px`
- No glow effect (solid border only)

**Food Shapes (all 10x10 pixels at grid unit center):**
- Growing (green): Filled square
- Invincibility (yellow): 4-point star
- Wall-Phase (purple): Ring/donut (hollow circle, 2px stroke)
- Speed Boost (red): Cross/plus (+)
- Speed Decrease (dark turquoise #00CED1): Hollow square (2px stroke)
- Reverse Controls (orange): X shape (diagonal cross)

---

## File Responsibilities

| File | Does | Does NOT |
|------|------|----------|
| `config.js` | Define all parameters (v2: +thresholds, +Fibonacci values, +tiers) | Contain logic |
| `state.js` | Create/reset state (v2: +combo, +phone v2, +effects, +ui fields) | Modify state during gameplay |
| `game.js` | Orchestrate update loop (v2: +cross-system coordination, +popup triggering, +blink cycling) | Render anything, calculate scores |
| `render.js` | Draw to canvas (v2: +blink colors, +striped snake, +combo bg, +food shadows) | Modify state |
| `input.js` | Emit actions (v2: +Enter key for Pick Up) | Process game logic |
| `phone.js` | Control overlay DOM, phone state machine (v2: two-button UI, Pick Up timer, portraits, one-liners, scheduling) | Modify snake/food/score state, calculate bonuses |
| `audio.js` | Play sounds (v2: +score sounds, +combo sounds, +phone sounds, +priority system) | Access game logic |
| `storage.js` | localStorage access | Contain game logic |
| `scoring.js` | Calculate food/combo/phone score values (pure functions) | Trigger popups, modify state, access DOM |
| `progression.js` | Resolve score → tier (blink, combo, phone probabilities/tiers) | Own threshold data (that's config.js), hold state |
| `combo.js` | Manage combo state machine (activate, lifecycle, pause/resume) | Calculate scores (delegates to scoring.js), render |
| `score-popup.js` | Spawn/animate/cleanup DOM popups, particles, screen shake | Contain game logic, calculate scores |

---

## Testing Approach

**Test Strategy:**
- Unit tests for core game logic (snake movement, collision detection, food spawning, effects)
- Manual browser testing for UI/UX and cross-browser compatibility
- Performance validation using browser DevTools

**Unit Testing:**
- Test framework: None (vanilla JS, manual test functions in `/test` folder)
- Test files: Mirror structure (`test/snake.test.js` for `js/snake.js`)
- Run tests: Open `test/index.html` in browser, verify console output
- Coverage target: Core game logic modules (state, snake, food, collision, effects)

**Manual Testing Checklist:**
- Cross-browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- All 6 food types spawn and apply effects correctly
- All 4 keyboard layouts work (Arrow, WASD, ZQSD, Numpad) + mobile touch
- Phone call dismissal with Space bar (desktop) and End button (mobile)
- 60 FPS maintained during phone overlay
- V2: Blinking food cycles colors correctly at score 20+
- V2: Combo mode activates/deactivates with canvas color transition
- V2: Striped snake renders correctly during combo
- V2: Phone Pick Up (Enter key) starts timer with countdown bar
- V2: Phone End (Space) and Pick Up both award correct bonuses
- V2: Score popups display with correct tier visuals
- V2: Combo pauses during phone overlay, resumes after
- V2: Death during combo + phone awards both bonuses
- V2: Caller portraits display (fallback icon if missing)
- V2: Reduced motion mode respects `prefers-reduced-motion`

**Performance Validation:**
- Load time: Use DevTools Network tab → verify DOMContentLoaded < 3 seconds
- FPS: Use DevTools Performance tab → record 10-second gameplay, verify 60 FPS avg
- Phone overlay FPS: Record during active phone call, verify no frame drops
- V2: Verify DOM popup cleanup (no orphaned elements after popups animate out)
- V2: Audio priority system — no sound mud during combo + phone + score overlap

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented — both v1 and v2 sections
- When in doubt, prefer the more restrictive option
- Architecture reference for full details: `_bmad-output/planning-artifacts/architecture.md`

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack or patterns change
- Remove rules that become obvious over time

Last Updated: 2026-02-07
