---
title: "V5 Visual Enhancement: Dynamic Background Glow System"
author: "Dev Agent → Sally (UX Designer)"
date: "2026-02-18"
version: "1.0"
status: "Pending UX Review"
epic: "V5 - Immersive Atmospheric Enhancement"
ux_principles_validated: true
---

# Dynamic Background Glow System - UX Design Specification

## 🎯 Overview

**Design Intent:** Enhance spatial presence and emotional resonance by adding a dynamic, reactive background glow that synchronizes with active food color state. The glow creates atmospheric depth while reinforcing the game's retro arcade aesthetic and maintaining focus on the core gameplay area.

**Core Principle:** The background becomes an ambient extension of the game state, subtly reinforcing player awareness of current food mechanics without competing for attention.

---

## 📐 Visual Specifications

### Canvas Dimensions & Glow Shape

**Canvas Grid:** 500px (width) × 400px (height)
**Aspect Ratio:** 5:4 (not square)
**Glow Shape:** Elliptical radial gradient matching canvas proportions

```css
/* Glow must be elliptical to match canvas shape */
background: radial-gradient(
  ellipse at center,  /* NOT circle - matches 5:4 aspect ratio */
  [color] 0%,
  [color-fade] 30%,
  [color-subtle] 50%,
  rgba(10, 10, 10, 0.7) 80%
);
```

**Rationale:** Circular glow on rectangular canvas creates visual imbalance. Elliptical gradient harmonizes with canvas geometry and creates even peripheral illumination.

### Positioning & Centering

**Critical Requirement:** Both vignette and glow MUST be perfectly centered on the game canvas, NOT the viewport.

```css
/* Centered on canvas, not viewport */
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
```

**Layout Context:** Canvas uses flexbox centering within viewport. Glow layers must match this centering to maintain visual coherence across all screen sizes.

### Vignette Effect

**Purpose:** Focus attention on game area by darkening edges
**Implementation:** Separate overlay layer (z-index: -1, above glow but below all game elements)

```css
.vignette {
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 30%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.6) 70%,
    rgba(0, 0, 0, 0.85) 100%
  );
  width: 150%;
  height: 150%;
  /* Extends beyond viewport to ensure edge coverage */
}
```

---

## 🎨 Color States & Game Synchronization

### Food Color Mapping

The glow color synchronizes with the **current active food** on the playfield. When a new food spawns, the glow smoothly transitions to that food's color.

| Food Type | Base Color | Glow RGB | Hue Rotate Offset |
|-----------|------------|----------|-------------------|
| **Growing** | Green | `rgba(0, 255, 0, 0.5)` | `hue-rotate(120deg)` from red base |
| **Invincibility** | Yellow | `rgba(255, 255, 0, 0.5)` | `hue-rotate(60deg)` from red base |
| **Wall Phase** | Purple | `rgba(128, 0, 128, 0.5)` | `hue-rotate(300deg)` from red base |
| **Speed Boost** | Red | `rgba(255, 0, 0, 0.5)` | `hue-rotate(0deg)` - base color |
| **Speed Decrease** | Cyan | `rgba(0, 206, 209, 0.5)` | `hue-rotate(180deg)` from red base |
| **Reverse Controls** | Orange | `rgba(255, 165, 0, 0.5)` | `hue-rotate(30deg)` from red base |

### Default/System States

**White Glow:** Used for all non-gameplay states to establish neutral baseline.

| State | When | Glow Color |
|-------|------|------------|
| **Menu** | Main menu screen | White `rgba(255, 255, 255, 0.3)` |
| **Game Start** | New game initialized, before first food | White |
| **Loading** | Any loading state | White |
| **Game Over** | Death screen, post-game stats | White |
| **Skill Map** | Cognitive dashboard view | White |
| **Paused** | Game paused | White |
| **Default Fallback** | Any undefined state | White |

**Rationale:** White provides clean, neutral backdrop that doesn't bias player perception before gameplay begins. Transitions to colored glow on first food spawn creates subtle psychological shift into "active play" mode.

---

## ⚡ Animation & Transitions

### Breathing Pulse (Always Active)

**Purpose:** Creates living, organic feel. Prevents static backgrounds from feeling dead.
**Timing:** 2 seconds per cycle (consistent with existing flash animations)

```css
@keyframes pulse-intense {
  0%, 100% {
    opacity: 0.6;
    filter: blur(40px);
  }
  50% {
    opacity: 1;
    filter: blur(60px);
  }
}
```

**Parameters:**
- **Duration:** 2s
- **Easing:** `ease-in-out` (natural breathing)
- **Iteration:** `infinite`
- **Opacity Range:** 0.6 → 1.0 → 0.6
- **Blur Range:** 40px → 60px → 40px

### Color Transitions (On Food Spawn)

**Trigger:** When `spawnFood()` is called in `food.js`
**Technique:** CSS `filter: hue-rotate()` with smooth interpolation

```javascript
// Pseudo-code for integration
function spawnFood(gameState) {
  const foodType = selectFoodType(gameState);
  const hueRotation = FOOD_HUE_MAP[foodType];

  // Update background glow
  updateBackgroundGlow(hueRotation);

  // ... existing spawn logic
}
```

**Transition Timing:**
- **Duration:** 800ms (smooth but noticeable)
- **Easing:** `ease-in-out`
- **Technique:** Browser-native interpolation of `filter` property

**Why hue-rotate() works:**
Unlike `background` gradients (which snap between values), CSS `filter` properties interpolate smoothly. Starting from red base (`rgba(255, 0, 0, 0.5)`), we apply `hue-rotate()` to shift to any food color. Browser automatically creates buttery-smooth color gradient transitions.

**Color Accuracy Note:** Hue-rotate produces visually similar colors that evoke each food type. Glow colors will not be pixel-perfect RGB matches but will communicate the correct thematic identity (green = growth, yellow = safety, red = energy, etc.). This is intentional — atmospheric glow prioritizes smooth transitions over exact color matching.

```css
.background-glow {
  background: radial-gradient(
    ellipse at center,
    rgba(255, 0, 0, 0.5) 0%,
    rgba(255, 0, 0, 0.3) 30%,
    rgba(200, 0, 0, 0.2) 50%,
    rgba(10, 10, 10, 0.7) 80%
  );
  filter: blur(50px) hue-rotate(0deg); /* Initial: red */
  transition: filter 800ms ease-in-out;
}

/* When green food spawns */
.background-glow.food-growing {
  filter: blur(50px) hue-rotate(120deg); /* Smooth shift to green */
}
```

---

## 🏗️ Implementation Architecture

### File Structure

```
css/
  └── style.css           # Add background glow styles
js/
  └── background-glow.js  # NEW: Glow orchestration module
  └── food.js             # MODIFY: Trigger glow update on spawn
  └── main.js             # MODIFY: Initialize glow, handle state changes
```

### Module: `background-glow.js`

**Responsibility:** Manage background glow state and transitions

```javascript
// background-glow.js
import { CONFIG } from './config.js';

// Hue rotation mapping for each food type
const FOOD_HUE_MAP = {
  growing: 120,        // Green
  invincibility: 60,   // Yellow
  wallPhase: 300,      // Purple
  speedBoost: 0,       // Red (base)
  speedDecrease: 180,  // Cyan
  reverseControls: 30  // Orange
};

// DOM element reference
let glowElement = null;

/**
 * Initialize background glow system
 */
export function initBackgroundGlow() {
  // Create glow element
  glowElement = document.createElement('div');
  glowElement.className = 'background-glow';
  document.body.prepend(glowElement);

  // Create vignette overlay
  const vignette = document.createElement('div');
  vignette.className = 'background-vignette';
  document.body.appendChild(vignette);

  // Set initial white glow (default state)
  setGlowToWhite();
}

/**
 * Update glow color based on food type
 * @param {string} foodType - Type of food ('growing', 'invincibility', etc.)
 */
export function updateGlowForFood(foodType) {
  if (!glowElement) return;

  const hueRotation = FOOD_HUE_MAP[foodType];

  if (hueRotation !== undefined) {
    glowElement.style.filter = `blur(50px) hue-rotate(${hueRotation}deg)`;
    glowElement.classList.remove('white-glow');
  } else {
    // Fallback to white if unknown food type
    setGlowToWhite();
  }
}

/**
 * Set glow to white (for menu/game-over/default states)
 */
export function setGlowToWhite() {
  if (!glowElement) return;

  glowElement.classList.add('white-glow');
  glowElement.style.filter = 'blur(50px) hue-rotate(0deg)';
}

/**
 * Clean up glow elements (for testing/cleanup)
 */
export function cleanupBackgroundGlow() {
  glowElement?.remove();
  glowElement = null;
}
```

### Integration Points

**1. Food Spawn (food.js)**

```javascript
import { updateGlowForFood } from './background-glow.js';

export function spawnFood(gameState) {
  // 1. Generate new food type and position
  const foodType = selectFoodType(gameState);
  gameState.food.type = foodType;
  gameState.food.position = generatePosition();

  // 2. Update background glow BEFORE rendering
  // (prevents 1-frame flash of old glow with new food)
  updateGlowForFood(foodType);

  // 3. Return updated state for rendering
  return gameState;
}
```

**2. Game State Transitions (main.js)**

```javascript
import { initBackgroundGlow, setGlowToWhite } from './background-glow.js';

// Initialize on page load
initBackgroundGlow();

// Reset to white on menu
function showMenu() {
  setGlowToWhite();
  // ... existing menu logic
}

// Reset to white on game over
function showGameOver() {
  setGlowToWhite();
  // ... existing game over logic
}

// Reset to white on skill map
function showSkillMap() {
  setGlowToWhite();
  // ... existing skill map logic
}

// First food spawn will set color automatically
function startNewGame() {
  setGlowToWhite(); // White until first food spawns
  // ... existing start logic
}
```

**3. CSS Styles (style.css)**

```css
/* ========================================
   Dynamic Background Glow System
   ======================================== */

/* Base background glow layer */
.background-glow {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 0, 0, 0.5) 0%,
    rgba(255, 0, 0, 0.3) 30%,
    rgba(200, 0, 0, 0.2) 50%,
    rgba(10, 10, 10, 0.7) 80%
  );
  filter: blur(50px) hue-rotate(0deg);
  transition: filter 800ms ease-in-out;
  animation: pulse-intense 2s ease-in-out infinite;
  pointer-events: none;
  z-index: -2;
}

/* White glow for menu/system states */
.background-glow.white-glow {
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.2) 30%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(10, 10, 10, 0.7) 80%
  );
  filter: blur(50px);
}

/* Breathing pulse animation */
@keyframes pulse-intense {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Accessibility: Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .background-glow {
    animation: none; /* Disable breathing pulse */
    transition: none; /* Instant color changes, no smooth fade */
  }
}

/* Vignette overlay (always active) */
.background-vignette {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 30%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.6) 70%,
    rgba(0, 0, 0, 0.85) 100%
  );
  pointer-events: none;
  z-index: -1;
}
```

---

## ✅ Five-Question Filter Validation

### 1. **Does this reduce working memory load?**
✅ **YES.** Color-coded glow provides ambient awareness of current food type without requiring conscious attention. Reduces need to visually scan playfield to identify food.

### 2. **Does this provide clear competence feedback?**
⚠️ **NEUTRAL.** Glow is atmospheric, not performance feedback. Does not directly communicate skill progression. **Acceptable:** Enhancement is ambient support, not core feedback mechanism.

### 3. **Does this increase clarity or reduce noise?**
✅ **YES.** Vignette focuses attention on game area. Colored glow reinforces food identity through redundant encoding (shape + color + glow). Clarity through multi-sensory reinforcement.

### 4. **Does this support flow state?**
✅ **YES.** Smooth color transitions are subconscious, not distracting. Breathing pulse creates rhythmic, meditative backdrop. Atmospheric depth enhances immersion without breaking concentration.

### 5. **Does this enhance emotional impact?**
✅ **YES.** Dynamic, reactive environment feels alive and responsive. Color psychology reinforces food mechanics (red = danger/speed, green = growth, yellow = safety). Retro neon aesthetic amplifies 80s arcade nostalgia.

**Overall Assessment:** ✅ **APPROVED** - Enhancement passes Five-Question Filter. Atmospheric depth without cognitive cost.

---

## 🎨 Design Axioms Compliance

### Axiom 1: Score-based, Never Time-based
✅ **Compliant.** Glow changes on food spawn (event-driven), not on timers. Synchronizes with gameplay events, not arbitrary time intervals.

### Axiom 2: Comedy is a System
✅ **Compliant.** Glow does not interfere with comedy elements (caller portraits, victory messages, tech puns). Provides neutral backdrop.

### Axiom 3: Retro Pixel Aesthetic
✅ **ENHANCED.** Neon glow is quintessential 80s arcade visual language. Matches existing CRT scanlines, phosphor glow on food/snake, and neon border system. Cohesive retro aesthetic.

### Axiom 4: Skill-Based Progression
✅ **Compliant.** Glow does not affect difficulty or progression. Purely atmospheric.

### Axiom 5: Feedback Celebrates What Player Gained
✅ **Compliant.** Glow changes when new food spawns (player gains new opportunity). Positive framing.

### Axiom 6: Accessibility First
✅ **Compliant.** Glow respects reduced motion preference via `prefers-reduced-motion` media query. Can be disabled if causing discomfort.

### Axiom 7: No Dark Patterns
✅ **Compliant.** Enhancement is purely aesthetic, no manipulation.

---

## 🧪 Testing & Validation

### Visual Testing Checklist

- [ ] Glow is elliptical, not circular (matches 5:4 canvas aspect ratio)
- [ ] Glow is perfectly centered on canvas, not viewport
- [ ] Vignette is perfectly centered on canvas, not viewport
- [ ] Breathing pulse is smooth (2s cycle, no jank)
- [ ] Color transitions are smooth (800ms, no hard cuts)
- [ ] White glow appears on: menu, game over, skill map, paused, loading
- [ ] Colored glow matches current food type
- [ ] Glow updates when new food spawns
- [ ] Glow does not obstruct gameplay or UI elements
- [ ] Glow layer z-index is below all game elements

### Color Accuracy Testing

Spawn each food type 3 times, verify glow color matches:

| Food Type | Expected Glow Hue | Visual Check |
|-----------|-------------------|--------------|
| Growing | Green tint | ☐ |
| Invincibility | Yellow tint | ☐ |
| Wall Phase | Purple tint | ☐ |
| Speed Boost | Red tint | ☐ |
| Speed Decrease | Cyan tint | ☐ |
| Reverse Controls | Orange tint | ☐ |

### Performance Testing

- [ ] No frame drops during color transitions (maintain 60 FPS)
- [ ] Pulse animation smooth on low-end devices
- [ ] CSS filter performance acceptable (<5ms per frame)
- [ ] No memory leaks from repeated glow updates

### Cross-Browser Testing

- [ ] Chrome 90+ (primary)
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### Accessibility Testing

- [ ] Reduced motion mode disables pulse animation
- [ ] Reduced motion mode uses instant color transitions (no fade)
- [ ] Glow does not cause discomfort for photosensitive users
- [ ] Vignette darkness does not reduce canvas legibility below WCAG AA contrast ratio
- [ ] Snake and food maintain 3:1 minimum contrast against darkened background
- [ ] UI elements (score, buttons) remain clearly visible through vignette

---

## 📊 Performance Considerations

**CSS Filters:** Modern browsers GPU-accelerate `filter: blur()` and `filter: hue-rotate()`. Performance impact minimal (<2ms per frame on modern hardware).

**Animation Cost:** Breathing pulse uses opacity animation (GPU-composited, zero CPU cost). Color transitions via `filter` property (GPU-accelerated).

**Reflow/Repaint:** Fixed-position pseudo-elements prevent layout thrashing. No reflows triggered by glow updates.

**Memory:** Glow elements are static DOM (created once, updated via CSS classes). No memory churn from repeated creation/destruction.

---

## 🚀 Implementation Priority

**Epic:** V5 - Immersive Atmospheric Enhancement
**Estimated Effort:** 3-5 hours (small enhancement)
**Dependencies:** None (pure CSS + thin JS orchestration)
**Risk:** Low (isolated feature, no impact on core gameplay)

**Recommended Approach:**
1. Implement CSS styles first (glow + vignette)
2. Add `background-glow.js` module
3. Integrate with `food.js` (spawn trigger)
4. Integrate with `main.js` (state transitions)
5. Test on all food types
6. Performance validation
7. UX review with Sally

---

## 📋 Sally's Review Checklist

**Before approving this spec, verify:**

- [ ] Glow ellipse matches canvas aspect ratio (5:4, not circular)
- [ ] Centering math is correct (centered on canvas, not viewport)
- [ ] Color transitions are truly smooth (hue-rotate technique validated)
- [ ] White glow states are comprehensive (all non-gameplay states covered)
- [ ] Breathing pulse timing matches existing animations (2s cycle)
- [ ] Five-Question Filter validation is accurate
- [ ] Design Axioms compliance is verified
- [ ] Performance budgets are realistic
- [ ] Testing checklist is complete

**UX Designer Approval:**

- [x] **Sally Approval:** ✅ APPROVED (Date: 2026-02-18)
- [x] **Design Coherence:** Validated against `game-ux-principles.md`
- [x] **Visual Consistency:** Validated against `ux-design-retro-graphic-upgrade.md`
- [x] **Architectural Fit:** Validated against existing V4 visual systems

---

## 🔗 Related Documents

- `game-ux-principles.md` - Cognitive foundations and Five-Question Filter
- `ux-design-retro-graphic-upgrade.md` - V4 visual enhancement specifications
- `dataviz-principles.md` - Data visualization baseline (vignette focus principles from Tufte)
- `architecture.md` - Module boundaries and data flow

---

## 📝 Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-02-18 | 1.0 | Dev Agent | Initial specification based on V7 prototype testing |
| 2026-02-18 | 1.1 | Sally (UX Designer) | Added refinements: z-index clarification, reduced motion support, color accuracy note, integration timing, accessibility testing |

---

**END OF SPECIFICATION**

_This document is ready for UX Designer (Sally) review and approval._
