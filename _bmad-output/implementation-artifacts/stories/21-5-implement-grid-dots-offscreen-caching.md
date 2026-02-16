# Story 21.5: Implement Grid Intersection Dots with Offscreen Caching

**Epic:** 21 - Immersive Arcade Polish (Authenticity & Personality)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** player
**I want** subtle dots at grid intersections creating a circuit-board aesthetic
**So that** the playfield has refined spatial texture without performance cost

---

## Acceptance Criteria

**Given** the grid has 25x21 cells (26x22 intersections = 572 dots, but borders excluded leaves ~525 dots)
**When** rendering grid intersection dots
**Then** each intersection displays a 1.5px radius circle in grid line color

**And** dots use the same progressive opacity as grid lines (0.9 → 0.3 across tiers)
**And** dots are rendered via offscreen canvas caching pattern

**Given** offscreen canvas caching is implemented
**When** initializing the game
**Then** dots are pre-rendered once to an offscreen canvas (525 arc operations)

**And** each frame copies the cached offscreen canvas to main canvas (1 drawImage operation)
**And** cache is invalidated ONLY when grid opacity tier changes (event-driven)

**Given** performance measurement
**When** comparing cached vs non-cached rendering
**Then** cached version reduces operations from 1,050 ops/frame (525 dots × 2 ops) to 1 op/frame
**And** this achieves ~1000x performance gain (FR-V3-13)

---

## Technical Notes

- Module: `render.js` (grid rendering with offscreen canvas)
- Pattern: Offscreen Canvas Caching (Decision 14, Pattern 13)
- Implementation: Create offscreen canvas, render dots once, drawImage() to main canvas each frame
- Cache invalidation: Regenerate offscreen canvas when grid opacity tier changes
- Grid size: 25 cols × 21 rows = 26×22 intersections (exclude borders = ~525 interior dots)
- Reference: FR-V3-8 (Grid Intersection Dots), FR-V3-13 (Offscreen Canvas Caching), NFR-V3-1 (Performance Budget)
- Validation: FPS test with/without caching, visual inspection, measure frame time contribution

---

## Tasks / Subtasks

### Task 1: Create renderGridDots() Function with Offscreen Canvas Caching
- [ ] Add `renderGridDots()` function to `render.js` after `renderGrid()`
- [ ] Implement cache state variables: `gridDotsCache = null`, `lastDotOpacity = -1`
- [ ] Add nested loop: 26×22 grid intersections (0 to GRID_WIDTH × 0 to GRID_HEIGHT)
- [ ] Cache invalidation: check if `dotOpacity !== lastDotOpacity`, regenerate if needed
- [ ] Offscreen canvas creation: `document.createElement('canvas')`, set width/height to match main canvas
- [ ] Render 525 dots to offscreen canvas context (arc operations with GRID_DOT_RADIUS)
- [ ] Store cached result: `{ canvas: offscreenCanvas, opacity: dotOpacity }`
- [ ] Main canvas stamp: `ctx.drawImage(gridDotsCache.canvas, 0, 0)`
- **Maps to ACs:** "Then each intersection displays a 1.5px radius circle", "Then dots are pre-rendered once to offscreen canvas", "And cache is invalidated ONLY when grid opacity tier changes"

### Task 2: Integrate Dot Rendering into Main Render Pipeline
- [ ] Update `render()` function call chain in `render.js`
- [ ] Add `renderGridDots(ctx, gameState)` call AFTER `renderGrid()`, BEFORE `renderFood()`
- [ ] Verify rendering order: clearCanvas → renderGrid (lines) → renderGridDots (dots on top) → renderFood → renderSnake
- [ ] Pass `gameState` to `renderGridDots()` for progression state access
- **Maps to ACs:** "When rendering grid intersection dots", rendering order for visual layering

### Task 3: Add Config Values for Grid Dots
- [ ] Add `GRID_DOT_RADIUS: 1.5` to `config.js` (existing pattern from UX spec)
- [ ] Verify `GRID_OPACITY_PROGRESSION` array exists with `dotOpacity` field per tier
- [ ] Validate 6 tiers: score 0-14 (0.5), 15-29 (0.45), 30-49 (0.4), 50-79 (0.3), 80-99 (0.25), 100+ (0.2)
- **Maps to ACs:** "And dots use the same progressive opacity as grid lines"

### Task 4: Update progression.js to Return dotOpacity
- [ ] Verify `progression.getState()` returns `dotOpacity` field (should exist from Story 20.3)
- [ ] If missing, add `dotOpacity: resolveThreshold(score, CONFIG.GRID_OPACITY_PROGRESSION, 'dotOpacity')` to return object
- [ ] Test progression resolution at scores: 0, 30, 60, 90, 120
- **Maps to ACs:** "And dots use the same progressive opacity as grid lines (0.9 → 0.3 across tiers)"

### Task 5: Performance Validation and Optimization
- [ ] Open Chrome DevTools → Performance tab
- [ ] Record 10-second gameplay at score 100+ (worst case: 525 dots at low opacity)
- [ ] Measure FPS: target 58+ average (NFR-V3-1 budget allows 2 FPS margin)
- [ ] Measure frame time contribution: grid dot rendering should be <0.5ms with caching
- [ ] Compare cached (1 drawImage op) vs non-cached (1,050 arc ops) in controlled test
- [ ] Document performance gain: target ~1000x reduction (1,050 ops → 1 op per frame)
- **Maps to ACs:** "Then cached version reduces operations from 1,050 ops/frame to 1 op/frame", "And this achieves ~1000x performance gain"

---

## Dev Notes

### File Locations
- **Primary file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/render.js`
  - Add `renderGridDots()` function after `renderGrid()` (around line 62)
  - Update `render()` function to add `renderGridDots()` call in render pipeline
- **Config file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/config.js`
  - Add `GRID_DOT_RADIUS: 1.5` constant
  - Verify `GRID_OPACITY_PROGRESSION` array exists with `dotOpacity` field
- **Progression file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/progression.js`
  - Verify `getState()` returns `dotOpacity` field from grid opacity progression

### Offscreen Canvas Caching Pattern (Critical for Performance)

**Why caching is essential:**
- Grid has 26×22 = 572 intersections (excluding border edges leaves ~525 dots)
- Each dot requires 2 canvas operations: `beginPath()` + `arc()` + `fill()` = ~1,050 ops/frame
- At 60 FPS: 63,000 operations per second WITHOUT caching
- WITH caching: 1 `drawImage()` operation per frame = 60 ops/second (1000x reduction)

**Implementation pattern:**
```javascript
// Module-level cache state (persistent across frames)
let gridDotsCache = null;
let lastDotOpacity = -1;

function renderGridDots(ctx, gameState) {
  const { gridLine, dotOpacity } = progression.getState(gameState.score);

  // Cache invalidation: only regenerate when opacity tier changes
  if (!gridDotsCache || dotOpacity !== lastDotOpacity) {
    // Create offscreen canvas (same dimensions as main canvas)
    const offscreen = document.createElement('canvas');
    offscreen.width = ctx.canvas.width;
    offscreen.height = ctx.canvas.height;
    const offCtx = offscreen.getContext('2d');

    // Render all 525 dots ONCE to offscreen canvas
    offCtx.fillStyle = gridLine;
    offCtx.globalAlpha = dotOpacity;

    for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
      for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
        const px = x * CONFIG.UNIT_SIZE;
        const py = y * CONFIG.UNIT_SIZE;
        offCtx.beginPath();
        offCtx.arc(px, py, CONFIG.GRID_DOT_RADIUS, 0, Math.PI * 2);
        offCtx.fill();
      }
    }

    // Store cached result
    gridDotsCache = { canvas: offscreen, opacity: dotOpacity };
    lastDotOpacity = dotOpacity;
  }

  // Stamp cached dots to main canvas (1 operation)
  ctx.drawImage(gridDotsCache.canvas, 0, 0);
}
```

**Cache invalidation triggers:**
- Grid opacity tier change (score crosses tier boundary: 15, 30, 50, 80, 100)
- Occurs ~6 times per game (one per tier transition)
- Does NOT regenerate every frame (critical for performance)

**Rendering order (critical for visual layering):**
1. `clearCanvas()` — wipe surface
2. `renderGrid()` — grid lines first (underneath)
3. `renderGridDots()` — dots on top of lines (circuit board effect)
4. `renderFood()` — food above grid
5. `renderSnake()` — snake above everything

### Integration with Existing Progression System

**Grid dots inherit color and opacity from grid lines:**
- Color: `gridLine` from `progression.getState()` (matches tier background progression)
- Opacity: `dotOpacity` from `GRID_OPACITY_PROGRESSION` config table
- Both values already resolved in Story 20.3 (Progressive Dark Playfield)

**Progression tiers (from `config.js`):**
```javascript
GRID_OPACITY_PROGRESSION: [
  { minScore: 0,   maxScore: 14,  lineOpacity: 0.9, dotOpacity: 0.5 },
  { minScore: 15,  maxScore: 29,  lineOpacity: 0.8, dotOpacity: 0.45 },
  { minScore: 30,  maxScore: 49,  lineOpacity: 0.7, dotOpacity: 0.4 },
  { minScore: 50,  maxScore: 79,  lineOpacity: 0.5, dotOpacity: 0.3 },
  { minScore: 80,  maxScore: 99,  lineOpacity: 0.4, dotOpacity: 0.25 },
  { minScore: 100, maxScore: Infinity, lineOpacity: 0.3, dotOpacity: 0.2 }
]
```

Dots progressively fade in sync with grid lines as score increases (spatial awareness training lever).

### Performance Measurement Procedure

**Test scenario:** Worst-case rendering load
- Score: 100+ (darkest background, minimum dot opacity = 0.2)
- Snake length: 40+ segments (heavy snake rendering)
- Combo active: striped snake pattern (additional rendering complexity)
- Phone overlay: blur filter active (GPU stress)

**Measurement steps:**
1. Open Chrome DevTools → Performance tab
2. Click "Record" button
3. Play game for 10 seconds at score 100+
4. Stop recording
5. Analyze "FPS" graph — verify sustained 58+ FPS (target: 60, allow 2 FPS margin)
6. Check "Main" thread flamegraph — `renderGridDots()` should be <0.5ms per frame with caching
7. Compare: If non-cached implementation shows ~5-10ms, caching achieves 10-20x speedup

**Expected results:**
- **With caching:** FPS 58-60, grid dot rendering <0.5ms per frame
- **Without caching (reference):** FPS 45-50, grid dot rendering 5-10ms per frame
- **Performance gain:** ~1000x reduction in canvas operations (1,050 → 1)

### Gotchas and Edge Cases

**Gotcha 1: Canvas state leak**
- ALWAYS reset `ctx.globalAlpha = 1.0` after rendering dots
- If forgotten, alpha will bleed onto food/snake rendering (they'll be semi-transparent)
- Pattern: Set alpha → render → reset alpha (defensive rendering, V4 pattern)

**Gotcha 2: Offscreen canvas size mismatch**
- Offscreen canvas MUST match main canvas dimensions exactly
- Use `ctx.canvas.width` and `ctx.canvas.height`, NOT hardcoded values
- If mismatched, `drawImage()` will scale (distortion) or clip (missing dots)

**Gotcha 3: Cache invalidation on first frame**
- `gridDotsCache = null` initially, so first frame will regenerate (expected)
- After initial render, cache persists until tier change
- Do NOT invalidate cache on every frame (defeats entire optimization)

**Gotcha 4: Combo mode grid color change**
- Combo mode inverts grid colors (light ↔ dark)
- Dots should inherit combo grid color automatically via `gridLine` from progression
- Existing `renderGrid()` already handles combo mode, dots follow same logic

### Visual Design Notes (from Sally's UX Spec)

**Aesthetic rationale:**
- Circuit board texture: Dots at intersections create "node" pattern (80s arcade design language)
- Spatial awareness aid: Intersection markers help players construct mental coordinate system
- Tufte data-ink principle: Dots emphasize structure without adding full additional lines
- Progressive dimming: Dots fade with grid lines (0.5 → 0.2 opacity across 6 tiers), forcing reliance on internal spatial model at high scores (cognitive training lever)

**Visual feel per score tier:**
- Score 0-14: Full support grid with clear intersection dots (training wheels)
- Score 15-49: Dots slightly receding, grid becoming subtle
- Score 50-79: Ghost lines + faint dots (spatial awareness test)
- Score 80+: Near-invisible grid/dots, pure Neon Noir void (mastery stage)

**Five-Question Filter validation (from UX spec):**
1. **Working Memory:** Zero WM cost — dots are subliminal spatial aid
2. **Competence Feedback:** Fading dots = visual trust in player skill
3. **Clarity:** At minimum opacity (0.2), dots remain perceptible under inspection
4. **Flow Preservation:** Gradual dimming (6 tiers) means no single transition is jarring
5. **Emotional Impact:** At score 100+ with full Neon Noir (dark BG + ghost grid + glowing food), the transformation IS the emotional payoff

---

## References

### UX Design Specifications
- **Primary source:** `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade.md`
  - Enhancement 8: Grid Enhancement (Intersection Dots & Progressive Dimming)
  - Section: "8A: Intersection Dot Accent" (lines 804-832)
  - Config structure: `GRID_DOT_RADIUS`, `GRID_DOT_OPACITY` specifications
  - Five-Question Filter validation (lines 872-878)

- **Technical implementation:** `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade-technical-addendum.md`
  - Pattern 3: Grid Rendering with Progressive Opacity (lines 176-233)
  - Performance Pattern: Offscreen canvas caching (lines 387-409)
  - Performance Validation: Test Scenario 1 (lines 767-823)
  - Gotcha 4: Grid Dot Rendering Order (lines 1177-1191)

### Project Context V4 Patterns
- **Architecture reference:** `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/project-context.md`
  - V4 Performance Pattern (lines 387-409): Offscreen canvas caching for >100 canvas ops
  - Cache invalidation pattern: only when tier changes (event-driven, not per-frame)
  - Performance budget: NFR-V3-1 allows 17.24ms frame time (58 FPS target)

### Functional Requirements
- **FR-V3-8:** Grid Intersection Dots — 1.5px radius circles at all 26×22 grid intersections, inherit grid color, progressive opacity 0.5 → 0.2
- **FR-V3-13:** Offscreen Canvas Caching — pre-render heavy static elements (>100 ops) to offscreen canvas, stamp via drawImage() per frame
- **NFR-V3-1:** Performance Budget — maintain 58+ FPS with all V4 enhancements active, frame time <17.24ms

### Code References
- **Existing render pipeline:** `/Users/anthonysalvi/code/CrazySnakeLite/js/render.js`
  - `render()` function (line 9): main render orchestration
  - `renderGrid()` function (line 34): grid line rendering with progressive opacity
  - Module pattern: call progression.getState() once, destructure fields
- **Existing config:** `/Users/anthonysalvi/code/CrazySnakeLite/js/config.js`
  - `GRID_OPACITY_PROGRESSION` array (should exist from Story 20.3)
  - Pattern: 6-tier score-based threshold tables with minScore/maxScore/values
- **Existing progression:** `/Users/anthonysalvi/code/CrazySnakeLite/js/progression.js`
  - `getState()` function: resolves score → tier values
  - Returns 8 fields including `dotOpacity` (added in Story 20.3)
