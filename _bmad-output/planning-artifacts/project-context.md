---
project_name: 'CrazySnakeLite'
user_name: 'Tomoco'
date: '2026-02-16'
v1_date: '2026-01-23'
v2_date: '2026-02-07'
v3_date: '2026-02-15'
v4_date: '2026-02-16'
sections_completed: ['technology_stack', 'implementation_rules', 'anti_patterns', 'architecture_rules', 'file_responsibilities', 'testing']
status: 'complete'
v2_update: true
v3_update: true
v4_update: true
optimized_for_llm: true
---

# Project Context for AI Agents

_Critical rules and patterns for implementing CrazySnakeLite. Read this before writing any code._
_Updated for v2: Food v2 (Fibonacci scoring, blinking food, combo mode) + Phone Calls v2 (Pick Up vs End, caller portraits)._
_Updated for v3: Cognitive Dashboard MVP (metrics engine, Skill Map dashboard, enhanced highlights, streak system, async storage layer)._
_Updated for v4: Retro Graphic Upgrade (progressive dark playfield, food shapes + glow, defensive rendering patterns, CSS/Canvas hybrid, performance budgets)._

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
| **Storage (V3)** | IndexedDB (session history) + localStorage (profile, streak, highlights) — all browser-native |

**Local Development:** Requires local server for ES6 modules (use `python -m http.server 8000` or VS Code Live Server)

---

## UX Design Authority (MANDATORY FOR ALL FRONTEND WORK)

**🚨 CRITICAL: Before ANY frontend, visual, or UI decision:**

All agents (Dev, Architect, PM, etc.) working on visual systems, UI components, or user-facing features **MUST** read and follow Sally's UX design specifications:

### Required UX Documents (Read BEFORE Implementation)

1. **`game-ux-principles.md`** — Cognitive science foundation (Hodent, 2018)
   - Five-Question Filter for all design decisions
   - 7 non-negotiable design axioms
   - Cognitive foundations (perception, memory, attention, motivation, emotion, learning)
   - **READ THIS FIRST** before proposing any game mechanic or visual change

2. **`dataviz-principles.md`** — Data visualization baseline (Tufte, Knaflic, McCandless, Rosling)
   - **MANDATORY for Cognitive Dashboard work**
   - 5 universal tenets, operational design rules
   - Chart selection guide, color rules, 12-point design checklist

3. **`ux-design-retro-graphic-upgrade.md`** — V4 visual enhancement specifications
   - 8 enhancements with pixel-perfect specs
   - 80s arcade design principles
   - Validated against Five-Question Filter

4. **`ux-design-retro-graphic-upgrade-technical-addendum.md`** — V4 implementation patterns
   - Code-level specifications for all 8 enhancements
   - Performance validation procedures
   - Integration checklists

5. **`ux-design-cognitive-dashboard.md`** — V3 Skill Map & dashboard UX
   - Pixel block bar specifications (0.1 precision with horizontal fills)
   - Calibration experience design
   - Comedy integration patterns

### UX Design Compliance Rules

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

### Visual Coherence Checklist

Before shipping any visual change:
- [ ] Aligns with 80s retro aesthetic (neon colors, pixel art, CRT simulation)
- [ ] Passes Five-Question Filter (working memory, competence feedback, clarity, flow, emotional impact)
- [ ] Maintains score-based progression (never time-based)
- [ ] Preserves comedy integration (tech puns, retro humor, celebratory tone)
- [ ] Matches existing visual vocabulary (colors, fonts, shapes, spacing)
- [ ] Documented in Sally's UX specs OR approved by UX Designer agent

**Bottom line:** Sally's UX work is the **visual design bible** for CrazySnake. Treat it with the same authority as project-context.md and architecture.md.

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

// Canvas combo state: grid inversion via render.js clearCanvas()
// render.js checks isComboActive() and uses CONFIG.COLORS.comboBackground
ctx.fillStyle = isComboActive(gameState) ? CONFIG.COLORS.comboBackground : CONFIG.COLORS.background; // CORRECT
canvas.style.backgroundColor = '#4A148C';               // WRONG — use canvas fillRect in render.js

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
// combo.isComboActive() returns raw active state — pause is handled by guard clause in game.js
export function isComboActive(gameState) {
  return gameState.combo.active; // CORRECT — pause enforced by phoneCall.active check in game.js
}

// game.js combo progression guard — this is where pause is enforced:
if (wasComboActive) {
  if (CONFIG.COMBO_PAUSE_ON_PHONE && gameState.phoneCall.active) {
    return; // PAUSED — skip combo progression, foodCount unchanged
  }
  // ... normal combo progression
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

### V3 Async Storage Patterns (MUST follow exactly)

```javascript
// ALWAYS await storage calls — even localStorage wrappers return Promises
const sessions = await storage.getSessions(10);  // CORRECT
const sessions = storage.getSessions(10);         // WRONG — returns Promise, not data

// ONLY 3 files call storage.js directly:
//   game.js (orchestrator), dashboard.js (reads for rendering), streak.js (reads/writes)
// Pure modules (metrics.js, highlights.js) NEVER import storage.js
import { getSessions } from './storage.js';       // WRONG in metrics.js or highlights.js
// Instead: pass data as function arguments
const scores = calculateDomainScores(sessions);   // CORRECT — data received as arg
```

### V3 Null Metric Propagation (MUST follow exactly)

```javascript
// null means "not applicable" — NEVER coerce to 0
// metrics.js skips null sessions in weighted average
if (val !== null && val !== undefined) {           // CORRECT — explicit null check
  valueSum += val * weights[i];
}
const avg = sessions.reduce((sum, s) =>
  sum + (s.metrics[key] || 0), 0) / sessions.length; // WRONG — inflates denominators
```

### V3 Date Comparison (MUST follow exactly)

```javascript
// Streaks: ALWAYS use local timezone 'YYYY-MM-DD' strings
function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
// Compare date strings directly — NEVER use Date objects or UTC
dateA === dateB                                    // CORRECT
new Date(dateA) < new Date(dateB)                  // WRONG — timezone issues
```

### V3 DOM Rendering Patterns (MUST follow exactly)

```javascript
// Dashboard/Skill Map: static containers in index.html, dynamic content via JS
barsContainer.innerHTML = '';                       // Clear previous render
const row = document.createElement('div');          // CORRECT — createElement
barsContainer.appendChild(row);                     // CORRECT — appendChild

// Screen visibility: ALWAYS use .hidden class
screen.classList.remove('hidden');                   // CORRECT
screen.style.display = 'block';                     // WRONG

// Block bars: 5 blocks per row with 0.1 precision (partial fills via horizontal bars)
// Each block can be: filled (100%), partial (1-99% horizontal fill), or empty (0%)
if (score >= blockValue) {
  block.className = 'block filled';  // CORRECT
} else if (score > i && score < blockValue) {
  block.className = 'block partial';  // Partial fill
  const fill = document.createElement('div');
  fill.className = 'block-fill';
  fill.style.width = `${(score - i) * 100}%`;  // Proportional horizontal fill
  block.appendChild(fill);
} else {
  block.className = 'block empty';  // CORRECT
}
block.style.backgroundColor = '#9DB2DD';  // WRONG — use CSS classes
```

### V3 Highlight Output Contract (MUST follow exactly)

```javascript
// selectHighlights() returns array of 2-3 objects, ALWAYS this shape:
const highlight = {
  type: 'personal_best',    // 'personal_best' | 'improvement' | 'notable_event' | 'growth_opportunity'
  stat: 'rcSurvived',       // Which stat
  value: 5,                 // Numeric value
  text: 'New record!',      // Pre-formatted display text
  icon: '★',                // Display icon
  isPersonalBest: true       // Boolean
};
// ALL 6 fields required. type from the 4-value enum only.
```

### V3 Calibration State (MUST follow exactly)

```javascript
// calibrationComplete is a boolean in stored profile — set once during onDeath
// ALL UI reads the stored boolean, NEVER recalculates from session count
if (profile?.calibrationComplete) { /* full bars */ }     // CORRECT
if (profile?.totalSessions >= 5) { /* full bars */ }      // WRONG — recalculating

// calibrationComplete lives in storage, NOT in gameState (persistent, not per-game)
```

### V4 Defensive Rendering Patterns (MUST follow exactly)

```javascript
// Canvas shadow state: ALWAYS use withShadow() helper to prevent state leak
function withShadow(ctx, shadowConfig, drawFn) {
  const { color, blur } = shadowConfig;
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  drawFn(ctx);
  // GUARANTEED cleanup
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// Usage — CORRECT
withShadow(ctx, { color: foodColor, blur: glowIntensity }, (ctx) => {
  renderFoodShape(ctx, x, y, type, color, outlineColor);
});

// WRONG — manual shadow cleanup (easy to forget)
ctx.shadowBlur = 8;
renderFoodShape(...);
ctx.shadowBlur = 0;  // If forgotten, glow bleeds onto other renders!
```

### V4 Progression State Pattern (MUST follow exactly)

```javascript
// progression.getState() returns 8 fields — call ONCE per frame, destructure all
const progressionState = progression.getState(gameState.score);
const { background, gridLine, glowIntensity, lineOpacity, dotOpacity } = progressionState;

// WRONG — multiple calls per frame
const bg = progression.getState(score).background;           // Redundant call
const glow = progression.getState(score).glowIntensity;     // Redundant call
```

### V4 CSS/Canvas Hybrid Pattern (MUST follow exactly)

```javascript
// Canvas background: use CSS background-color, NOT canvas fillRect
const canvas = document.getElementById('game-canvas');
canvas.style.backgroundColor = background;  // CORRECT — GPU-composited transition

// CSS transition handles the 2s fade automatically
// #game-canvas { transition: background-color 2000ms ease-in-out; }

// WRONG — canvas fillRect for background
ctx.fillStyle = background;
ctx.fillRect(0, 0, canvas.width, canvas.height);  // WRONG — no transition support
```

### V4 Border State Pattern (MUST follow exactly)

```javascript
// Border updates: event-driven ONLY, NEVER poll in game loop
function updateBorderState(gameState) {
  // Priority cascade: death > phone > combo > effects > default
  if (gameState.justDied) { /* ... */ return; }
  if (gameState.phoneCall.active) { /* ... */ return; }
  // ... etc
}

// Call ONLY when state changes
function onPhoneShow(gameState) {
  updateBorderState(gameState);  // CORRECT — state changed
}

// WRONG — polling in game loop
function update(gameState) {
  updateBorderState(gameState);  // WRONG — called 60x/sec!
}
```

### V4 Performance Pattern (MUST follow exactly)

```javascript
// Offscreen canvas caching for > 100 canvas ops per frame
let gridDotsCache = null;

function renderGridDots(ctx, gameState) {
  const { gridLine, dotOpacity } = progression.getState(gameState.score);

  // Invalidate cache only when tier changes
  if (!gridDotsCache || gridDotsCache.opacity !== dotOpacity) {
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');

    // Render all 525 dots ONCE to offscreen
    // ... render dots ...

    gridDotsCache = { canvas: offscreen, opacity: dotOpacity };
  }

  // Stamp cached result (1 op instead of 1,050)
  ctx.drawImage(gridDotsCache.canvas, 0, 0);
}
```

### Configuration Rules

**ALL tunable values MUST be in config.js:**
- Grid dimensions, unit size
- Snake starting parameters
- Speed values and modifiers
- Food probabilities
- Phone call timing
- All colors
- V2: Fibonacci score values, blink/combo/phone threshold tables, combo canvas colors, popup tier specs, phone pickup Fibonacci sequence, phone grace score (3), cognitive stats tracking
- V3: DASHBOARD section (calibration threshold, rolling window size, recency weights, metric normalization ranges, block scale mapping, domain labels, comedy quote pools)
- V4: BACKGROUND_PROGRESSION (constant dark #1a1a1a), GRID_LINE_THRESHOLDS (white→black inverse progression), FOOD_GLOW (constant blur 8), GRID_OPACITY_PROGRESSION (6 opacity tiers), BORDER_COLORS (6 border states - wall safety focus + multi-layer glow), food outline colors (6 types), snake glow (constant blur 8), CRT scanline toggle/opacity, grid dot radius

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
| **DOM** | Only in `main.js` (setup), `phone.js` (overlay), `score-popup.js` (popups), `cognitive-feedback.js` (post-game), **V3: +`dashboard.js`** (Skill Map) |
| **Canvas** | Only in `render.js` |
| **Scoring Logic** | Only in `scoring.js` — pure calculation, no side effects |
| **Threshold Data** | Only in `config.js` — `progression.js` reads, never owns |
| **Tier Resolution** | Only in `progression.js` — consumers call `getState()` once, destructure |
| **Combo Logic** | Only in `combo.js` — `game.js` delegates, never manipulates combo fields directly |
| **Storage (all)** | Only in `storage.js` — wraps IndexedDB + localStorage |
| **Storage callers** | V3: Only `game.js`, `dashboard.js`, `streak.js` call storage.js. **Pure modules (`metrics.js`, `highlights.js`) NEVER call storage.** |
| **Metric Calculation** | V3: Only in `metrics.js` — pure functions, no DOM, no storage |
| **Highlight Selection** | V3: Only in `highlights.js` — pure functions, no DOM, no storage |
| **Streak Logic** | V3: Only in `streak.js` — date comparison + storage read/write |
| **Quote Data** | V3: Only in `config.js` (DASHBOARD.QUOTES) — never embed quote text in rendering code |
| **Audio** | Only in `audio.js` (v2: includes priority system) |
| **Config** | Import `CONFIG` from `config.js` everywhere |
| **Visual Progression** | V4: Only in `progression.js` — extends `getState()` to return 8 fields (3 existing + 5 new visual) |
| **Defensive Rendering** | V4: Only in `render.js` — `withShadow()`, `withOpacity()` helpers prevent canvas state leak |
| **Canvas Background** | V4: Only in `game.js` — `updateCanvasBackground()` uses CSS `background-color`, NOT canvas fillRect |
| **Border Orchestration** | V4: Only in `game.js` — `updateBorderState()` priority cascade, event-driven calls in handlers |
| **Offscreen Caching** | V4: Only in `render.js` — grid dots cached to offscreen canvas, invalidated on tier change |

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
| `canvas.style.backgroundColor = color` for combo | Grid inversion via `ctx.fillRect` in `render.js clearCanvas()` using `CONFIG.COLORS.comboBackground` |
| `endBtn.style.display = 'none'` for phone states | `overlay.classList.add('picked-up')` with CSS rules |
| `progression.getState(score)` called multiple times in one function | Call once, destructure: `const { a, b } = getState(score)` |
| `window.matchMedia(...)` in individual modules | Read `CONFIG.REDUCED_MOTION` (detected once in main.js) |
| Scoring math in game.js or combo.js | All scoring calculations in `scoring.js` only |
| V3: `storage.getSessions(10)` without `await` | `const sessions = await storage.getSessions(10)` |
| V3: `import { getSessions } from './storage.js'` in metrics.js | Pass sessions array as function argument |
| V3: `session.metrics.rcSurvivalRate \|\| 0` | Check for `null` explicitly, skip in weighted average |
| V3: `element.style.display = 'none'` for screens | `element.classList.add('hidden')` |
| V3: `new Date('2026-02-15')` for streak comparison | `getTodayDateString()` local timezone string comparison |
| V3: Hard-coded quote text in dashboard.js | `CONFIG.DASHBOARD.QUOTES.celebration[i]` |
| V3: `if (totalSessions >= 5)` in UI code | `if (profile.calibrationComplete)` — read the stored boolean |
| V4: `ctx.shadowBlur = 8; renderFood(); ctx.shadowBlur = 0;` | `withShadow(ctx, {color, blur}, (ctx) => renderFood())` |
| V4: `progression.getState(score).background` called 3+ times/frame | Call once: `const {background, gridLine, glowIntensity} = getState(score)` |
| V4: `canvas.style.backgroundColor = bg` every frame | Cache tier: `if (bg !== lastBg) { canvas.style.backgroundColor = bg; }` |
| V4: `updateBorderState(gameState)` in game loop | Event-driven only: call in `onPhoneShow()`, `onDeath()`, etc. |
| V4: Canvas `fillRect()` for background color | CSS `canvas.style.backgroundColor` with transition |
| V4: 525 grid dots rendered every frame without cache | Offscreen canvas: render once to cache, `drawImage()` per frame |

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
  phase: 'menu',  // 'menu' | 'playing' | 'gameover' | 'skillmap' (V3)
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
    active: false,           // Is combo mode currently active?
    effectA: null,           // { type, points } — first food effect
    effectB: null,           // { type, points } — second food effect
    canvasColor: null,       // Stored but unused for rendering (grid inversion used instead)
    foodCount: 0             // Foods eaten during combo (1=activated, 2=effectB, 3=exit)
  },

  effects: {
    wallPhaseUsed: false     // V2: true if wall phased through (for +1/+3 conditional scoring)
  },

  ui: {
    mysteryFoodTooltipShown: false,  // V2: first-time "Mystery Food!" tooltip
    lastPopupTime: 0                 // V2: for 300ms popup stagger
  },

  // V2: Cognitive feedback stats (displayed post-game)
  cognitiveStats: {
    rcSurvived: 0,           // Food eaten while reverse controls active
    phoneCallsManaged: 0,    // End or Pick Up completed
    mysteryFoodsEaten: 0,    // Blinking food consumed
    comboMultipliers: 0,     // Combo food B eaten (multiplier triggered)
    pickUpStreak: 0,         // Consecutive Pick Ups this game (mirrors pickUpCount)
    peakComboScore: 0        // Highest single combo score this game
  },

  // V3: Session tracking (for building session record at death)
  session: {
    startTime: 0,              // Date.now() at game start
    inputTimestamps: [],       // For reaction time proxy
    rcPeriods: [],             // [{startTick, endTick, survived}]
    comboPeriods: [],          // [{startTick, endTick, score}]
    phonePeriods: []           // [{showTime, dismissTime, action}]
  }
};
```

**Reset Rules:** On new game / Play Again: ALL fields reset. `phoneCall.pickUpCount` → 0. `combo` → inactive. `ui.mysteryFoodTooltipShown` → false. `cognitiveStats` → all 0. V3: `session` → all reset. **Dashboard persistent data (profile, streak, calibration) lives in storage, NOT in gameState — survives game resets.**

### Effect Duration Rule

ALL timed effects (invincibility, wall phase, speed boost, speed decrease, reverse controls) end when the NEXT food is eaten. Not time-based.

### V2 Scoring Pipeline

**Score-based, NOT time-based** — all game systems use score thresholds to gate progression. CrazySnakeLite is a cognitive fitness tool disguised as an arcade game (see `game-ux-principles.md` for the full vision).

```
scoring.js (pure calc) → game.js (orchestrate) → score-popup.js (display)
```

**Fibonacci Food Scores:**

| Food Type | Score | Condition | Cognitive Training |
|-----------|-------|-----------|-------------------|
| Invincibility | 0 | Always | Impulse control (resist safe option) |
| Growing | +1 | Always | Baseline motor |
| Speed Decrease | +2 | Always | Cognitive breathing room |
| Wall Phase | +1 / +3 | +1 default, +3 if wall actively phased through | Spatial reasoning |
| Speed Boost | +5 | Always | Reflex + motor control |
| Reverse Controls | +8 | Always | Executive function override (crown jewel) |

**Combo:** Effect A score × Effect B score (multiplicative). Cap at 40% probability at score 120+.
**Phone:** End = +1 flat. Pick Up = Fibonacci sequence [+2, +3, +5, +8, +13, +21, +34] per consecutive pickup. Grace period at score 3.

### V2 Combo State Machine

```
foodCount: 0 (inactive) → 1 (activated/effectA) → 2 (effectB/striped) → 3 (exit) → 0
```

- Probability-based activation (10% at score 30, up to 40% at score 120+)
- Canvas uses grid inversion: background #E6E6E6→#505050, gridLine #505050→#E6E6E6 (instant, per-frame)
- Snake renders with alternating stripe pattern (Effect A / Effect B colors) when foodCount=2
- 3-food lifecycle: activate → eat food B (stripe + multiply) → eat food C (exit)
- Pauses when phone overlay active (guard clause in game.js checks `phoneCall.active`), resumes when dismissed

### V2 Phone Call Mechanic

- Game CONTINUES running during phone overlay (critical requirement)
- CSS `filter: blur()` applied to game canvas
- Phone UI is DOM elements, not canvas-rendered
- 60 FPS must be maintained during overlay
- V2: Two buttons — End (Space, +1) and Pick Up (Enter, Fibonacci bonus)
- V2: Pick Up starts 1-3s blur timer with countdown bar, reveals caller one-liner
- V2: Pick Up is irreversible — cannot End once committed
- V2: Consolation reward — Pick Up bonus awarded even on death during blur
- V2: Score-based call frequency (5 tiers from relaxed to relentless, starting at score 3)
- V2: Grace period — no calls until score >= 3 (brain gym: short comfort zone)
- V2: 21 callers with tech pun names, 64x64 pixel portraits, funny one-liners

### V2 Cross-System Orchestration

**Rules live in game.js as guard clauses (NOT event bus):**

| Rule | Implementation |
|------|---------------|
| Combo pauses during phone | Guard clause in game.js: `if (CONFIG.COMBO_PAUSE_ON_PHONE && phoneCall.active)` skips combo progression |
| Combo grid inversion instant | render.js `clearCanvas()` checks `isComboActive()` per frame |
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

### V3 Session Lifecycle (onDeath flow)

```
game.js onDeath() — V3 enhanced:
1. Existing: Award death bonuses (combo + phone consolation)
2. Existing: Update high score
3. NEW: buildSessionRecord(gameState) → session record
4. NEW: await storage.saveSession(record)
5. NEW: sessions = await storage.getSessions(10)
6. NEW: domainScores = metrics.calculateDomainScores(sessions)
7. NEW: await storage.updateProfile({ domainScores, totalSessions, calibrationComplete })
8. NEW: streakResult = await streak.checkAndUpdateStreak()
9. NEW: highlights = highlights.selectHighlights(record, sessions, lastPattern)
10. NEW: await cognitiveFeedback.showPostGameScreen(highlights, streakResult, profile)
11. gameState.phase = 'gameover'
```

**Session records built ONCE, in ONE place (game.js), before any storage writes.**

### V3 Phase Navigation

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

**ESC from skillmap → menu (consistent with ESC from gameover → menu).**

### V3 Skill Map Dashboard

- DOM overlay at z-index 350 (between tooltips 300 and phone 400)
- Pixel block bars: 5 blocks per row, 16×16px, 2px gap, 0.1 precision (0.0-5.0 scale)
- Filled: `#9DB2DD`, Partial: horizontal purple fill bar, Empty: `#3A3A3A` with 1px border `#555555`
- Rating text: "3.7/5" format (one decimal place)
- Growth indicators: ▲ green `#81C784` (improved), ▽ amber `#FFB74D` (declined)
- Two render paths: calibrating (empty bars + "Warming up...") vs unlocked (full bars + callouts)
- Reads storage, never calculates — dashboard.js is a display module only

### V3 Streak System

- Calendar-day tracking, local timezone `'YYYY-MM-DD'` strings
- Ethical guardrails: no red on break, no guilt language, no push notifications
- Break message: "Rest day logged. Ready for another round?"
- Milestones at 7, 14, 30, 60 days

### Visual Specifications

**Grid Styling:**
- Background: `#E8E8E8` (light grey)
- Grid lines: `#A0A0A0` (darker grey)
- Grid line width: `0.5px`
- Grid opacity: Progressive fade (0.9 → 0.3 as score increases)
- Unit size: `20px` (canvas 500x400)

**Canvas Background (V4.1 - Constant Neon Noir):**
- Background color: `#1a1a1a` (constant dark throughout, no progression)
- Grid lines: White `#FFFFFF` → Black `#000000` (progressive darkening as mastery increases)
  - Score 0-14: `#FFFFFF` (full white, max scaffolding)
  - Score 15-29: `#CCCCCC`
  - Score 30-49: `#999999`
  - Score 50-79: `#666666`
  - Score 80-99: `#333333`
  - Score 100+: `#000000` (full black, mastery void)

**Object Glow (V4.1 - Constant Maximum Intensity):**
- All game objects (food + snake) render with constant glow (blur 8)
- No score-based progression — maximum neon from game start
- Glow color matches object color (CRT phosphor effect)

**Border Styling (Reactive Border System - V4 Enhancement 7 + V4.1 Glow):**
- **Primary Function:** Wall safety communication (black = danger, color = safe)
- Default: `#000000` (black) — hitting wall = death
- Border width: `8px`
- **Multi-Layer Neon Glow:** 3-4 layers of CSS box-shadow per state
  - Inner layer (20px blur, full opacity): Bright core
  - Middle layer (40px blur, 0.8-0.9 opacity): Strong radiance
  - Outer layer (60px blur, 0.6-0.7 opacity): Soft halo
  - Invincibility extra layer (80px blur): Maximum power visual
- **Reactive States:**
  - Wall Phase active: `#800080` (purple) + purple glow — safe to cross walls
  - Invincibility active: `#FFFF00` (yellow) + intense yellow glow + 400ms blink animation
  - Phone ringing: `#FFD700` (gold) + gold glow — reward opportunity
  - Phone picked up: `#28a745` (green) + green glow — committed state
  - Combo active: matches `COMBO_CANVAS_COLORS[i]` (dynamic)
- Priority cascade: Phone > Combo > Invincibility > Wall Phase > Default
- Transition: `border-color 300ms, box-shadow 300ms` (smooth color + glow shifts)

**Snake Visual (V4.1 - Crisp Neon):**
- All segments: Constant glow (blur 8) + crisp 1px black border
- Border style matches combo mode aesthetic (clean definition)
- Glow color matches snake state color (black/yellow/purple/red/cyan/orange)

**Score Popup Visual (V4.1 - CRT Phosphor Glow):**
- **Multi-layer text-shadow pattern:** All food score popups use 3-layer glow
  - Black outline: `2px 2px 4px rgba(0, 0, 0, 1)` — crisp definition
  - Inner glow: `0 0 10px rgba(color, 1)` — bright core at full opacity
  - Outer glow: `0 0 20px rgba(color, 0.8)` — soft halo at 80% opacity
- **Color matching:** Glow color matches food type color exactly
  - Growing (+1): Green `rgba(0, 255, 0, ...)`
  - Speed decrease (+2): Cyan `rgba(0, 206, 209, ...)`
  - Wall phase (+1): Purple `rgba(128, 0, 128, ...)`
  - Speed boost (+5): Red `rgba(255, 0, 0, ...)`
  - Invincibility (+0): Yellow `rgba(255, 255, 0, ...)`
  - Reverse controls (+8): Orange/gold (multi-layer)
  - Phone/combo bonuses: Gold/magenta/red (multi-layer)
- **Size consistency:** All food popups 44-48px font-size for visual balance
- **Performance:** CSS-only effect (zero canvas rendering cost)
- **Effect:** Numbers appear to glow *off* the screen with CRT phosphor luminosity

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
| `storage.js` | V3: Async storage abstraction — IndexedDB (sessions) + localStorage (profile, streak, highlights, high score). initStorage(), saveSession(), getSessions(), getProfile(), updateProfile(), getStreak(), updateStreak() | Contain game logic. Existing loadHighScore/saveHighScore remain sync. |
| `scoring.js` | Calculate food/combo/phone score values (pure functions) | Trigger popups, modify state, access DOM |
| `progression.js` | Resolve score → tier (blink, combo, phone probabilities/tiers) | Own threshold data (that's config.js), hold state |
| `combo.js` | Manage combo state machine (activate, lifecycle, pause/resume) | Calculate scores (delegates to scoring.js), render |
| `score-popup.js` | Spawn/animate/cleanup DOM popups, particles, screen shake | Contain game logic, calculate scores |
| `metrics.js` | V3: Pure domain score calculation — sessions → normalized 0-1 → 0.0-5.0 scale (0.1 precision). calculateDomainScores(), toBlockScale(), calculateGrowthIndicators() | Import storage.js, access DOM, hold state. Only imports config.js. |
| `highlights.js` | V3: Pure highlight selection — priority algorithm, variety enforcement, comedy quote context. selectHighlights(), selectPerformanceQuote() | Import storage.js, access DOM, hold state. Only imports config.js. |
| `dashboard.js` | V3: Skill Map DOM rendering — block bars with partial fills (0.1 precision), callouts, calibration placeholder, navigation. renderSkillMap(), hideSkillMap() | Calculate metrics (reads stored profile only), hold game state |
| `streak.js` | V3: Calendar-day streak logic — date comparison, streak state, ethical messaging. checkAndUpdateStreak(), getStreakMessage() | Access DOM, hold game state, use UTC dates |

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
- Coverage target: Core game logic modules (state, snake, food, collision, effects), V3: +metrics.js, +highlights.js, +streak.js (all pure, highly testable)

**Manual Testing Checklist:**
- Cross-browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- All 6 food types spawn and apply effects correctly
- All 4 keyboard layouts work (Arrow, WASD, ZQSD, Numpad) + mobile touch
- Phone call dismissal with Space bar (desktop) and End button (mobile)
- 60 FPS maintained during phone overlay
- V2: Blinking food cycles colors correctly at score 15+
- V2: Combo mode activates/deactivates with canvas color transition
- V2: Striped snake renders correctly during combo
- V2: Phone Pick Up (Enter key) starts timer with countdown bar
- V2: Phone End (Space) and Pick Up both award correct bonuses
- V2: Score popups display with correct tier visuals
- V2: Combo pauses during phone overlay, resumes after
- V2: Death during combo + phone awards both bonuses
- V2: Caller portraits display (fallback icon if missing)
- V2: Reduced motion mode respects `prefers-reduced-motion`
- V3: Skill Map renders block bars correctly (5 blocks with 0.1 precision, filled/partial/empty states, horizontal fill bars, growth indicators, decimal text "3.7/5")
- V3: Partial blocks show proportional horizontal fills (e.g., score 3.7 shows 3 full blocks + 4th block at 70% fill)
- V3: Calibration placeholder shows during sessions 1-4, full Skill Map after session 5
- V3: Streak increments on first game per calendar day, resets on 2+ day gap
- V3: Post-game "RECAP" shows highlights, comedy quote, streak counter
- V3: Navigation: Skill Map button on menu + game-over, ESC from Skill Map → menu
- V3: Storage: IndexedDB persists sessions across browser restarts
- V3: Null metrics handled gracefully (0 filled blocks, no growth indicator)

**Performance Validation:**
- Load time: Use DevTools Network tab → verify DOMContentLoaded < 3 seconds
- FPS: Use DevTools Performance tab → record 10-second gameplay, verify 60 FPS avg
- Phone overlay FPS: Record during active phone call, verify no frame drops
- V2: Verify DOM popup cleanup (no orphaned elements after popups animate out)
- V2: Audio priority system — no sound mud during combo + phone + score overlap
- V3: Async storage operations complete without errors (IndexedDB write + read cycle)
- V3: Graceful degradation if IndexedDB unavailable (game still playable, dashboard shows calibration indefinitely)

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- **MANDATORY: Read `_bmad-output/planning-artifacts/game-ux-principles.md` before any game design decision.** This is the cognitive science and UX baseline for the project. All new mechanics, system changes, and feature proposals must pass the Five-Question Filter and comply with the 7 Design Axioms defined there.
- Follow ALL rules exactly as documented — v1, v2, and v3 sections
- When in doubt, prefer the more restrictive option
- Architecture reference for full details: `_bmad-output/planning-artifacts/architecture.md`

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack or patterns change
- Remove rules that become obvious over time

Last Updated: 2026-02-15
