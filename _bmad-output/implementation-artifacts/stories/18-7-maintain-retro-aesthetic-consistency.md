# Story 18.7: Maintain Retro Aesthetic Consistency

**Epic:** 18 - Dashboard Comedy Integration

**As a** player,
**I want** all dashboard screens to match CrazySnake's retro pixel art style,
**So that** the cognitive mirror feels like part of the game, not a corporate analytics tool.

---

## Acceptance Criteria

**Given** any dashboard screen renders
**When** applying visual styling
**Then** follow retro 8-bit aesthetic:
- Jersey20 font throughout (no modern sans-serif)
- Pixel art caller portraits (32x32px or 64x64px, crisp edges)
- Solid flat colors (no gradients)
- Sharp or minimally rounded borders (8px or 12px border-radius max)
- Purple theme color rgb(157, 178, 221) for accents
- Dark overlays with structural borders (double-border pattern)

**Given** Skill Map block bars render
**When** displaying 6 domains
**Then** use square pixel blocks (16x16px, no rounded corners per UX audit)
**And** filled blocks: solid purple (no gradient)
**And** empty blocks: dark grey with 1px border (pixel-perfect alignment)

**Given** caller portraits display
**When** rendering quotes
**Then** use `image-rendering: pixelated` CSS property
**And** maintain crisp pixel edges (no anti-aliasing blur)
**And** consistent portrait size: 32x32px on post-game/Skill Map

**Given** animations run on dashboard
**When** elements transition or pulse
**Then** keep animations simple and retro-authentic:
- Simple fades (opacity changes)
- Scale pulses (1.0 → 1.05 → 1.0)
- No easing curves that feel "smooth/modern" (use linear or ease-out only)

**Given** user compares dashboard to game board
**When** visual consistency check runs
**Then** dashboard feels like "menu screen" (same aesthetic family as main menu, game over screen)
**And** does NOT feel like "external analytics dashboard" (modern, clinical, corporate)

**Per FR205:** Dashboard maintains CrazySnake's retro pixel art and Jersey20 font aesthetic

---

## Development

### Files to Create/Modify

- **`_bmad-output/implementation-artifacts/validation/18-7-retro-aesthetic-audit.md`** - NEW - Visual consistency audit report
- **VISUAL REVIEW** - Dashboard screens compared against retro aesthetic guidelines

### Validation Scope

**Screens to Audit:**
- Post-game highlights overlay (Epic 14 + Story 18.3)
- Skill Map dashboard (Epic 16 + Story 18.4)
- Calibration complete celebration (Epic 15 + Story 18.5)

**Reference Documents:**
- `_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade.md` - V4 retro specifications
- `_bmad-output/planning-artifacts/ux-design-cognitive-dashboard.md` - V3 dashboard UX design
- Sally's UX design authority (MEMORY.md)

### Retro Aesthetic Checklist

**✅ REQUIRED VISUAL ELEMENTS:**

| Element | Specification |
|---------|---------------|
| **Font** | Jersey20 throughout (NO modern sans-serif) |
| **Portraits** | 32x32px or 64x64px, `image-rendering: pixelated` |
| **Colors** | Solid flat colors (NO gradients) |
| **Borders** | Sharp or minimal radius (8px or 12px max) |
| **Theme Color** | Purple `rgb(157, 178, 221)` for accents |
| **Overlays** | Dark backgrounds with structural borders |
| **Block Bars** | Square 16x16px pixel blocks (NO rounded corners) |
| **Animations** | Simple fades/pulses (NO smooth easing curves) |

### Font Validation

```css
/* Verify all dashboard text uses Jersey20 */

/* ✅ CORRECT */
.quote-text {
  font-family: 'Jersey20', monospace;
}

.domain-label {
  font-family: 'Jersey20', monospace;
}

/* ❌ WRONG */
.quote-text {
  font-family: 'Arial', sans-serif;  /* Modern font not allowed */
}

.domain-label {
  font-family: 'Helvetica', sans-serif;  /* Not retro */
}
```

### Portrait Rendering Validation

```css
/* Verify pixelated rendering for all caller portraits */

/* ✅ CORRECT */
.quote-portrait {
  width: 32px;  /* or 64px for calibration */
  height: 32px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* ❌ WRONG */
.quote-portrait {
  width: 32px;
  height: 32px;
  /* Missing image-rendering - will be blurry */
}

.quote-portrait {
  image-rendering: auto;  /* Smooth anti-aliasing not retro */
}
```

### Color Palette Validation

```css
/* Verify flat colors, no gradients */

/* ✅ CORRECT */
.skill-bar-filled {
  background: rgb(157, 178, 221);  /* Solid purple */
}

.overlay-background {
  background: rgba(0, 0, 0, 0.8);  /* Solid dark with opacity */
}

/* ❌ WRONG */
.skill-bar-filled {
  background: linear-gradient(90deg, #9DB2DD, #7A9BCC);  /* Gradient not allowed */
}

.overlay-background {
  background: radial-gradient(circle, rgba(0,0,0,0.9), rgba(0,0,0,0.7));  /* No gradients */
}
```

### Border Radius Validation

```css
/* Verify minimal/sharp borders */

/* ✅ CORRECT */
.skill-map-quote {
  border-radius: 8px;  /* Minimal rounding OK */
}

.calibration-quote {
  border-radius: 12px;  /* Max 12px for special moments */
}

.pixel-block {
  border-radius: 0;  /* Sharp corners for pixel blocks */
}

/* ❌ WRONG */
.skill-map-quote {
  border-radius: 24px;  /* Too rounded, feels modern */
}

.domain-bar {
  border-radius: 50%;  /* Circular not retro */
}
```

### Block Bar Pixel Accuracy

```css
/* Verify 16x16px square blocks */

/* ✅ CORRECT */
.domain-block {
  width: 16px;
  height: 16px;
  border-radius: 0;  /* Sharp corners */
  margin: 1px;  /* Pixel-perfect spacing */
}

/* ❌ WRONG */
.domain-block {
  width: 16px;
  height: 16px;
  border-radius: 4px;  /* Rounded corners not pixel-accurate */
}

.domain-block {
  width: 20px;  /* Wrong size */
  height: 15px;  /* Not square */
}
```

### Animation Simplicity

```css
/* Verify retro-authentic animations */

/* ✅ CORRECT */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Use linear or ease-out timing */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* ❌ WRONG */
@keyframes smoothSlide {
  from { transform: translateY(-20px); opacity: 0; filter: blur(5px); }
  to { transform: translateY(0); opacity: 1; filter: blur(0); }
}

/* Smooth cubic-bezier feels modern, not retro */
.smooth-animation {
  animation: smoothSlide 1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
```

### Visual Consistency Test

**Compare Dashboard to Game Board:**

```javascript
// Manual visual test procedure

1. Open game → note color palette, font, border style
2. Play session → die → view post-game highlights
3. Check:
   - Does post-game overlay match main menu aesthetic?
   - Same font family (Jersey20)?
   - Same color palette (purple accents, dark backgrounds)?
   - Same border style (sharp or minimal radius)?

4. Open Skill Map → compare to post-game
5. Check:
   - Consistent visual vocabulary?
   - Feels like "menu screen" not "analytics dashboard"?
   - Portrait rendering matches game board portraits?

6. Complete calibration (session 5) → view celebration
7. Check:
   - Celebration overlay matches visual family?
   - No modern/smooth design elements?
```

### Automated Visual Regression Tests

```javascript
// test/visual-regression.test.js (Optional: Puppeteer/Playwright)

// Take screenshots of dashboard screens
// Compare against baseline images
// Flag any visual regressions

const screenshots = [
  'post-game-highlights.png',
  'skill-map-dashboard.png',
  'calibration-complete.png'
];

// Compare against baselines (pixel-perfect or threshold)
// Ensure no unintended visual changes
```

### Audit Report Template

```markdown
# Retro Aesthetic Audit Report
**Story:** 18.7
**Date:** [Date]
**Auditor:** [Name]

## Visual Elements Checklist

### Font
- [ ] All text uses Jersey20 throughout
- [ ] No modern sans-serif fonts detected

### Portraits
- [ ] 32x32px (post-game, Skill Map) or 64x64px (calibration)
- [ ] `image-rendering: pixelated` applied
- [ ] Crisp pixel edges (no blur)

### Colors
- [ ] Solid flat colors only (no gradients)
- [ ] Purple theme color `rgb(157, 178, 221)` used for accents
- [ ] Dark overlays with opacity (no gradient backgrounds)

### Borders
- [ ] Sharp corners (0px) or minimal radius (8-12px max)
- [ ] Double-border pattern where appropriate
- [ ] No overly rounded modern borders

### Block Bars
- [ ] 16x16px square pixel blocks
- [ ] Sharp corners (0px border-radius)
- [ ] Filled blocks: solid purple, Empty blocks: dark grey with 1px border

### Animations
- [ ] Simple fades (opacity changes)
- [ ] Scale pulses (1.0 → 1.05)
- [ ] Linear or ease-out timing (NO smooth cubic-bezier)

## Screen-by-Screen Review

### Post-Game Highlights
- Font: ✅ Jersey20
- Portrait: ✅ 32px pixelated
- Colors: ✅ Flat purple accents
- Borders: ✅ 8px radius
- Animation: ✅ Simple fade-in

### Skill Map
- Font: ✅ Jersey20
- Block bars: ✅ 16x16px square blocks
- Portrait: ✅ 32px pixelated
- Colors: ✅ Solid purple fill
- Borders: ✅ Sharp corners on blocks

### Calibration Complete
- Font: ✅ Jersey20
- Portrait: ✅ 64px pixelated
- Colors: ✅ Purple border
- Borders: ✅ 12px radius (celebration)
- Animation: ✅ Button pulse

## Issues Found
[List any violations]

## Visual Coherence Assessment
- [ ] Dashboard feels like part of CrazySnake (same aesthetic family)
- [ ] Does NOT feel like external analytics dashboard
- [ ] Matches main menu, game board, game-over screen styling

## Sign-Off
- [ ] All dashboard screens audited
- [ ] Retro pixel aesthetic maintained throughout
- [ ] Visual coherence validated
```

### Test Strategy

**Manual Tests:**
1. View post-game highlights → verify Jersey20 font, purple accents, pixelated portraits
2. Open Skill Map → verify 16x16px square blocks, no rounded corners
3. Complete calibration → verify 64px portrait, 12px border radius
4. Compare all screens side-by-side → verify consistent visual vocabulary
5. Compare to main menu → verify dashboard feels like "part of the game"
6. Compare to Lumosity UI → verify CrazySnake does NOT look clinical/corporate

**Automated Tests (Optional):**
1. CSS lint check for forbidden properties (gradients, smooth animations)
2. Screenshot regression tests (compare against baselines)
3. Font family validation (grep CSS for non-Jersey20 fonts)

### Dependencies

**BEFORE this story:**
- Story 18.1-18.5 (all dashboard visuals implemented)
- Sally's UX design documents (`ux-design-retro-graphic-upgrade.md`, `ux-design-cognitive-dashboard.md`)

**AFTER this story:**
- BLOCKING for Epic 18 sign-off (visual consistency required before shipping)

### Implementation Notes

1. **Visual coherence is critical** - Dashboard must feel like CrazySnake, not external tool
2. **Reference Sally's specs** - All visual decisions validated against UX design documents
3. **Pixel-perfect matters** - 16x16px blocks, 32x32px portraits, exact purple `rgb(157, 178, 221)`
4. **No modern UI patterns** - Avoid smooth animations, gradients, rounded corners > 12px
5. **80s arcade visual language** - Think Pac-Man, Space Invaders, Galaga menus
6. **Consistency over novelty** - Reuse existing visual patterns from game board/menu
7. **Test on multiple browsers** - `image-rendering: pixelated` may need vendor prefixes
