# Story 19.3: Implement CRT Phosphor Glow Effect

**Epic:** 19 - Visual Clarity Enhancement (Food Recognition)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** player
**I want** food items to have a subtle CRT phosphor glow that intensifies as my score increases
**So that** food remains visible on both light backgrounds (low score) and dark backgrounds (high score)

---

## Acceptance Criteria

**Given** the player has a score within a specific tier
**When** food is rendered
**Then** the glow intensity matches the progression tier (0-14: blur 0px, 15-49: blur 3px, 50-99: blur 5px, 100+: blur 8px)

**And** glow color matches the food item's base color
**And** glow effect uses canvas shadowBlur/shadowColor
**And** glow is applied via defensive rendering pattern (auto-cleanup)

**Given** the player reaches score 100+ (Neon Noir tier)
**When** food appears on near-black background
**Then** the 8px glow ensures WCAG AA contrast ratio (4.5:1 minimum)

---

## Technical Notes

- Module: `food.js`, `render.js`, `progression.js`
- Pattern: Defensive Rendering with Auto-Cleanup (Decision 13)
- Glow config stored in `config.js` under `PROGRESSION.glowIntensity`
- Use `withShadow()` helper to prevent shadow state leaks
- Reference: NFR-V3-2 (Accessibility Contrast Ratios)
- Validation: Contrast analyzer tool + visual inspection at all 4 tiers

---

## Development

### Files to Create/Modify

- **`js/render.js`** - Update `renderFood()` to apply glow, create `withShadow()` helper (Story 19.4)
- **`js/progression.js`** - Already updated in Story 19.1 (glowIntensity field)
- **`js/config.js`** - Glow thresholds already added in Story 19.1

### API Surface

```javascript
// render.js - Updated renderFood() with glow

export function renderFood(ctx, gameState) {
  const { position, type, isBlinking, blinkCycleIndex } = gameState.food;
  const x = position.x * CONFIG.UNIT_SIZE;
  const y = position.y * CONFIG.UNIT_SIZE;

  // Get glow intensity from progression system (Story 19.1)
  const { glowIntensity } = progression.getState(gameState.score);

  // Determine color (blinking cycles, normal uses type color)
  let color, outlineColor;
  if (isBlinking) {
    const cycleType = CONFIG.BLINK_CYCLE[blinkCycleIndex];
    color = CONFIG.COLORS[`food${capitalize(cycleType)}`];
    outlineColor = CONFIG.COLORS[`food${capitalize(cycleType)}Outline`];
  } else {
    color = CONFIG.COLORS[`food${capitalize(type)}`];
    outlineColor = CONFIG.COLORS[`food${capitalize(type)}Outline`];
  }

  // APPLY glow BEFORE drawing shape
  ctx.shadowColor = color;         // Glow matches food color
  ctx.shadowBlur = glowIntensity;  // Score-based intensity
  ctx.shadowOffsetX = 0;           // Symmetrical halo
  ctx.shadowOffsetY = 0;

  // Draw the food shape (Story 19.2)
  renderFoodShape(ctx, x, y, type, color, outlineColor);

  // CRITICAL: RESET shadow immediately after
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}
```

### Glow Intensity Tiers (from Story 19.1)

```javascript
// Already in config.js from Story 19.1
export const GLOW_INTENSITY_THRESHOLDS = [
  { minScore: 0,   maxScore: 49,  blur: 3 },   // Subtle on light bg
  { minScore: 50,  maxScore: 79,  blur: 5 },   // Growing prominence
  { minScore: 80,  maxScore: Infinity, blur: 8 } // Full neon glow
];
```

### Integration Points

- **`renderFood()`** - Apply shadow before calling `renderFoodShape()`
- **`progression.getState(score)`** - Get `glowIntensity` value
- **Blinking food** - Glow color cycles with food color during blink

### Test Strategy

**Visual Testing (Manual):**
1. **Tier 1 (score 0-49):** Subtle 3px glow on light background
2. **Tier 2 (score 50-79):** 5px glow becomes more prominent as BG darkens
3. **Tier 3 (score 80+):** 8px glow creates strong halo on near-black background
4. **Blinking food:** Glow color cycles with shape color (rainbow halo effect)
5. **No shadow leaks:** Snake and grid remain shadow-free

**Accessibility Testing (WCAG AA Contrast):**
```javascript
// Test at score 100+ (darkest background #2A2A2A)
// Food with 8px glow should achieve 4.5:1 contrast minimum
// Use Chrome DevTools Color Picker or online contrast checker
```

**Performance Testing:**
```javascript
// Measure glow rendering impact
const startTime = performance.now();
for (let i = 0; i < 1000; i++) {
  ctx.shadowColor = '#FFFF00';
  ctx.shadowBlur = 8;
  ctx.fillRect(x, y, 14, 14);
  ctx.shadowBlur = 0;
}
const duration = performance.now() - startTime;
// Should be < 50ms (shadowBlur is GPU-accelerated)
```

### Dependencies

- **Story 19.1** - Progression system with `glowIntensity` field
- **Story 19.2** - Food shapes (glow applied to shapes, not just squares)

### Implementation Notes

1. **Apply BEFORE drawing** - Set shadow properties before `renderFoodShape()` call
2. **ALWAYS reset after** - Failure to reset causes shadow bleed to snake/grid
3. **Glow color = food color** - Use same color for authentic CRT phosphor effect
4. **Symmetrical halo** - `shadowOffsetX/Y = 0` creates even glow, not directional shadow
5. **GPU-accelerated** - Canvas `shadowBlur` is hardware-accelerated, negligible performance cost
6. **Blinking food synergy** - Glow color cycles with shape color = rainbow halo effect
7. **Dark background compensation** - Higher scores = darker BG = stronger glow (maintains visibility)
8. **WCAG compliance** - 8px glow ensures 4.5:1 contrast on `#2A2A2A` background
9. **Common mistake** - Forgetting `ctx.shadowBlur = 0` causes persistent shadow on all subsequent draws
10. **Defensive pattern** - Story 19.4 introduces `withShadow()` helper to guarantee cleanup
