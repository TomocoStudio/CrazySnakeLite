---
project_name: 'CrazySnakeLite'
user_name: 'Tomoco'
date: '2026-01-23'
sections_completed: ['technology_stack', 'implementation_rules', 'anti_patterns', 'architecture_rules', 'file_responsibilities', 'testing']
status: 'complete'
---

# Project Context for AI Agents

_Critical rules and patterns for implementing CrazySnakeLite. Read this before writing any code._

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

### Configuration Rules

**ALL tunable values MUST be in config.js:**
- Grid dimensions, unit size
- Snake starting parameters
- Speed values and modifiers
- Food probabilities
- Phone call timing
- All colors

**NEVER hardcode magic numbers in other files.**

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
| **DOM** | Only in `main.js` (setup) and `phone.js` (overlay) |
| **Canvas** | Only in `render.js` |
| **localStorage** | Only in `storage.js` |
| **Audio** | Only in `audio.js` |
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

### State Structure

```javascript
const gameState = {
  phase: 'menu',  // 'menu' | 'playing' | 'gameover'
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
  activeEffect: null,  // { type: 'invincibility' } or null
  score: 0,
  highScore: 0,
  phoneCall: {
    active: false,
    caller: null,
    nextCallTime: 0
  }
};
```

### Effect Duration Rule

ALL timed effects (invincibility, wall phase, speed boost, speed decrease, reverse controls) end when the NEXT food is eaten. Not time-based.

### Phone Call Mechanic

- Game CONTINUES running during phone overlay (critical requirement)
- CSS `filter: blur()` applied to game canvas
- Phone UI is DOM elements, not canvas-rendered
- 60 FPS must be maintained during overlay

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
| `config.js` | Define all parameters | Contain logic |
| `state.js` | Create/reset state | Modify state during gameplay |
| `game.js` | Orchestrate update loop | Render anything |
| `render.js` | Draw to canvas | Modify state |
| `input.js` | Emit actions | Process game logic |
| `phone.js` | Control overlay DOM, manage phoneCall state | Modify snake/food/score state |
| `audio.js` | Play sounds | Access game logic |
| `storage.js` | localStorage access | Contain game logic |

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

**Performance Validation:**
- Load time: Use DevTools Network tab → verify DOMContentLoaded < 3 seconds
- FPS: Use DevTools Performance tab → record 10-second gameplay, verify 60 FPS avg
- Phone overlay FPS: Record during active phone call, verify no frame drops

---

**Architecture Reference:** `_bmad-output/planning-artifacts/architecture.md`
