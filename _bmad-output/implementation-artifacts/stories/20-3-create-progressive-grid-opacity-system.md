# Story 20.3: Create Progressive Grid Opacity System

**Epic:** 20 - Progressive Arcade Transformation (Neon Noir)
**Story ID:** 20.3
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## Story

**As a** player,
**I want** the grid to progressively fade as my score increases,
**So that** the game becomes more challenging at high scores, requiring stronger spatial awareness.

---

## Acceptance Criteria

**Given** grid provides spatial scaffolding at low scores
**When** score increases across tiers
**Then** grid opacity progressively decreases: tier-0 0.9, tier-1 0.75, tier-2 0.6, tier-3 0.5, tier-4 0.4, tier-5 0.3

**And** grid remains minimally visible at tier-5 (0.3 opacity ensures WCAG compliance, NFR-V3-3)
**And** opacity is resolved via progression.js getState().gridOpacity
**And** grid rendering in render.js applies current tier opacity via ctx.globalAlpha

**Given** a player reaches tier-5 (score 100+)
**When** grid renders at 0.3 opacity on near-black background
**Then** grid is still perceptible but forces reliance on internal spatial model
**And** this intentional difficulty increase aligns with working memory training goals

---

## Tasks / Subtasks

- [ ] Add GRID_OPACITY_PROGRESSION to config.js
  - [ ] Reuse BACKGROUND_PROGRESSION.thresholds (same 6 tiers)
  - [ ] Define opacity values: [0.9, 0.75, 0.6, 0.5, 0.4, 0.3]
- [ ] Extend progression.js getState() to return gridOpacity
  - [ ] Add gridOpacity resolution logic
  - [ ] Return float value from GRID_OPACITY_PROGRESSION.values
- [ ] Update render.js renderGrid() to apply opacity
  - [ ] Set ctx.globalAlpha = gridOpacity before drawing lines
  - [ ] Reset ctx.globalAlpha = 1.0 after grid rendering
- [ ] Validate grid visibility at tier-5
  - [ ] Visual inspection: grid at 0.3 opacity on #1a1a1a background
  - [ ] Verify grid still perceptible (WCAG compliance)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Implement progressive grid opacity dimming synchronized with the background darkening system. As the playfield transitions from bright to Neon Noir, the grid fades from strong scaffolding (0.9 opacity) to ghost lines (0.3 opacity), forcing players to rely on internal spatial models at high scores. This is intentional cognitive training — scaffolding removal increases working memory demand.

**CRITICAL SUCCESS FACTORS:**
- 6 opacity tiers aligned with background tiers (same score thresholds)
- Grid remains minimally visible at tier-5 (0.3 opacity, WCAG compliance)
- Opacity applied via ctx.globalAlpha (standard Canvas API pattern)
- Grid fading feels gradual and natural, not jarring

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/config.js` — Add GRID_OPACITY_PROGRESSION section
- `js/progression.js` — Extend getState() to return gridOpacity field
- `js/render.js` — Update renderGrid() to apply opacity

**Module Boundaries:**
- `config.js` owns opacity threshold data
- `progression.js` resolves score → opacity value (pure function)
- `render.js` applies opacity during grid rendering (Canvas API)

**Data Flow:**
```
1. render.js: const { gridOpacity } = progression.getState(score)
2. render.js: ctx.globalAlpha = gridOpacity
3. render.js: draw grid lines (all affected by globalAlpha)
4. render.js: ctx.globalAlpha = 1.0 (reset for other rendering)
```

---

### 📦 CONFIG.JS UPDATES

**Add new section:**

```javascript
// V4: Progressive Visual Transformation (Epic 20)
GRID_OPACITY_PROGRESSION: {
  // Reuse BACKGROUND_PROGRESSION thresholds (same 6 tiers)
  thresholds: [0, 15, 30, 50, 75, 100],

  // 6 opacity values (strong → ghost)
  values: [
    0.9,   // tier-0 (0-14): Strong scaffolding
    0.75,  // tier-1 (15-29): Slight fade
    0.6,   // tier-2 (30-49): Moderate fade
    0.5,   // tier-3 (50-74): Half opacity
    0.4,   // tier-4 (75-99): Faint
    0.3    // tier-5 (100+): Ghost lines (WCAG minimum)
  ]
},
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. config.js — Add GRID_OPACITY_PROGRESSION section:**

```javascript
// js/config.js
export const CONFIG = {
  // ... existing config ...

  // V4: Progressive Visual Transformation
  BACKGROUND_PROGRESSION: {
    thresholds: [0, 15, 30, 50, 75, 100],
    colors: ['#e8e8e8', '#d0d0d0', '#b8b8b8', '#808080', '#505050', '#1a1a1a']
  },

  // V4: Grid opacity dimming (same thresholds as background)
  GRID_OPACITY_PROGRESSION: {
    thresholds: [0, 15, 30, 50, 75, 100],
    values: [0.9, 0.75, 0.6, 0.5, 0.4, 0.3]
  },
};
```

**2. progression.js — Extend getState() to return gridOpacity:**

```javascript
// js/progression.js
export function getState(score) {
  // V2: Existing fields
  const blinkProbability = resolveThreshold(score, CONFIG.PROGRESSION.blinkProbabilities);
  const comboProbability = resolveThreshold(score, CONFIG.PROGRESSION.comboProbabilities);
  const phoneTier = resolveThreshold(score, CONFIG.PROGRESSION.phoneTiers);

  // V4: Background color tier (Story 20.2)
  const background = resolveThreshold(score, CONFIG.BACKGROUND_PROGRESSION);

  // V4: NEW - Grid opacity tier
  const gridOpacity = resolveThreshold(score, CONFIG.GRID_OPACITY_PROGRESSION);

  return {
    blinkProbability,
    comboProbability,
    phoneTier,
    background,
    gridOpacity  // NEW: float 0.3-0.9
  };
}

// Helper function (supports both colors and values arrays)
function resolveThreshold(score, config) {
  const { thresholds, colors, values } = config;
  const dataArray = colors || values;  // Support both color and value configs

  let tierIndex = 0;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (score >= thresholds[i]) {
      tierIndex = i;
      break;
    }
  }

  return dataArray[tierIndex];
}
```

**3. render.js — Update renderGrid() to apply opacity:**

```javascript
// js/render.js
import { getState as getProgressionState } from './progression.js';

function renderGrid(ctx, gameState) {
  const { gridOpacity } = getProgressionState(gameState.score);

  // Apply opacity (affects all drawing operations until reset)
  ctx.globalAlpha = gridOpacity;

  // Existing grid rendering code
  ctx.strokeStyle = CONFIG.GRID_LINE_COLOR || '#A0A0A0';
  ctx.lineWidth = CONFIG.GRID_LINE_WIDTH || 0.5;

  // Vertical lines
  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CONFIG.UNIT_SIZE, 0);
    ctx.lineTo(x * CONFIG.UNIT_SIZE, canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CONFIG.UNIT_SIZE);
    ctx.lineTo(canvas.width, y * CONFIG.UNIT_SIZE);
    ctx.stroke();
  }

  // CRITICAL: Reset globalAlpha for other rendering
  ctx.globalAlpha = 1.0;
}
```

**Why reset ctx.globalAlpha?**
- Canvas context state persists across draw calls
- If not reset, opacity affects snake, food, everything rendered after
- Reset ensures grid opacity is isolated

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Opacity Resolution Logic:**
   - Open browser console
   - `import { getState } from './js/progression.js'`
   - `getState(0).gridOpacity` → 0.9 (tier-0)
   - `getState(15).gridOpacity` → 0.75 (tier-1)
   - `getState(50).gridOpacity` → 0.5 (tier-3)
   - `getState(100).gridOpacity` → 0.3 (tier-5)

2. **Visual Progression:**
   - Play game from score 0 → 150
   - Observe grid fading progressively
   - tier-0 (0-14): Strong grid, high contrast
   - tier-2 (30-49): Moderate fade, still clear
   - tier-4 (75-99): Faint but visible
   - tier-5 (100+): Ghost lines, minimal but perceptible

3. **WCAG Compliance (tier-5):**
   - Reach score 100+ (tier-5)
   - Grid color: #A0A0A0 at 0.3 opacity on #1a1a1a background
   - Effective color: ~#4D4D4D (approximate)
   - Visual inspection: Grid should be just barely visible
   - Should still provide spatial reference (not invisible)

4. **Canvas State Isolation:**
   - Verify snake, food, effects render at full opacity
   - Add console.log in render.js after each major render function
   - `console.log('After grid:', ctx.globalAlpha)` → should be 1.0
   - `console.log('After snake:', ctx.globalAlpha)` → should be 1.0
   - Verify no opacity bleed between rendering passes

5. **Synchronization with Background:**
   - Observe tier transitions (score 49 → 50)
   - Background darkens AND grid fades simultaneously
   - Both systems use same score thresholds
   - Visual harmony: darker background + fainter grid = cohesive effect

**Edge Cases:**
- Score 0 (new game) — grid at 0.9 opacity (strong)
- Rapid score increase (combo) — grid opacity matches final tier
- Multiple tier crossings in one frame — progression.getState() returns correct tier

---

### 📚 CRITICAL DATA FORMATS

**Opacity values MUST be floats 0.0-1.0:**
```javascript
values: [0.9, 0.75, 0.6, 0.5, 0.4, 0.3]  // CORRECT
values: [90, 75, 60, 50, 40, 30]          // WRONG — use 0-1 range
values: ['0.9', '0.75']                   // WRONG — use numbers, not strings
```

**globalAlpha MUST be reset after grid rendering:**
```javascript
ctx.globalAlpha = gridOpacity;
renderGridLines();
ctx.globalAlpha = 1.0;  // CORRECT — reset for other rendering

ctx.globalAlpha = gridOpacity;
renderGridLines();
// WRONG — forgot to reset, opacity affects snake/food!
```

**progression.getState() return value:**
```javascript
const { gridOpacity } = getState(50);
typeof gridOpacity === 'number'  // CORRECT
gridOpacity >= 0.3 && gridOpacity <= 0.9  // CORRECT range
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade.md` — Enhancement 8 (Grid Progressive Dimming)
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Scaffolding removal (cognitive training mechanism)
- `_bmad-output/planning-artifacts/prd.md` — NFR-V3-3 (Grid Visibility at 0.3 minimum)

**Key Design Principles:**
- **Cognitive training via scaffolding removal** — grid fading forces spatial awareness
- **WCAG compliance** — 0.3 opacity minimum ensures accessibility
- **Synchronized with background** — same thresholds, cohesive visual progression
- **Gradual difficulty increase** — working memory demand rises as visual cues recede

---

### 📋 FRs COVERED

FR-V3-8 (Grid Progressive Dimming)
NFR-V3-3 (Grid Visibility at 0.3 minimum)

**Detailed FR Mapping:**
- 6 opacity tiers → `GRID_OPACITY_PROGRESSION.values` array
- Score-based triggers → tier resolution in progression.js
- WCAG compliance → 0.3 opacity minimum at tier-5
- Cognitive training → intentional difficulty increase via scaffolding removal

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] config.js contains GRID_OPACITY_PROGRESSION object
- [ ] GRID_OPACITY_PROGRESSION.thresholds = [0, 15, 30, 50, 75, 100]
- [ ] GRID_OPACITY_PROGRESSION.values = [0.9, 0.75, 0.6, 0.5, 0.4, 0.3]
- [ ] thresholds and values arrays have equal length (6)
- [ ] progression.js getState() returns gridOpacity field
- [ ] gridOpacity is a float between 0.3 and 0.9
- [ ] render.js renderGrid() sets ctx.globalAlpha = gridOpacity
- [ ] render.js renderGrid() resets ctx.globalAlpha = 1.0 after grid
- [ ] Grid opacity changes as score crosses thresholds
- [ ] Grid at tier-5 (0.3 opacity) is still perceptible on dark background
- [ ] Snake, food, effects render at full opacity (no bleed from grid opacity)
- [ ] Visual progression feels gradual (strong → ghost)
- [ ] No canvas state leaks (globalAlpha reset verified)

**Common Mistakes to Avoid:**
- ❌ Using 0-100 scale instead of 0.0-1.0 for opacity values
- ❌ Forgetting to reset ctx.globalAlpha after grid rendering (opacity affects everything)
- ❌ Using different thresholds than BACKGROUND_PROGRESSION (breaks synchronization)
- ❌ Setting opacity below 0.3 (violates WCAG compliance, NFR-V3-3)
- ❌ Applying opacity to individual grid lines (inefficient, use globalAlpha instead)
- ❌ Not testing grid visibility at tier-5 (dark bg + low opacity = potential invisibility)

---

## Dev Agent Record

### Agent Model Used

_To be filled by Dev agent_

### Debug Log References

_To be filled by Dev agent_

### Completion Notes List

_To be filled by Dev agent_

### File List

- js/config.js (modified - add GRID_OPACITY_PROGRESSION section)
- js/progression.js (modified - extend getState() to return gridOpacity field)
- js/render.js (modified - update renderGrid() to apply opacity via ctx.globalAlpha)
