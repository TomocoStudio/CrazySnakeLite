# Story 10.2: Implement Canvas Background Color Transition

**Epic:** 10 - Combo Mode System
**Story ID:** 10.2
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** player,
**I want** the game canvas to change color during combo mode,
**So that** I immediately recognize I'm in a special state.

## Acceptance Criteria

**Given** combo mode activates
**When** the trigger occurs
**Then** the canvas background color transitions from light grey (#E8E8E8) to a dark color
**And** the transition is a smooth 500ms fade
**And** the dark color is randomly selected from:
  - Dark purple: #4A148C
  - Dark blue: #0D47A1
  - Dark red: #B71C1C
  - Dark green: #1B5E20

**Given** combo mode exits (third food eaten)
**When** the exit triggers
**Then** the canvas background transitions back to light grey (#E8E8E8)
**And** the transition is a smooth 500ms fade

**Given** a phone call arrives during active combo
**When** the phone overlay shows
**Then** the dark combo canvas color remains visible underneath the blur
**And** the canvas uses both: combo color + 4px blur

**Given** the canvas is dark during combo
**When** rendering the snake and food
**Then** the light colors remain clearly visible against the dark background
**And** contrast is sufficient for gameplay

## Tasks / Subtasks

- [ ] Add COMBO_CANVAS_COLORS to config.js
  - [ ] Array: ['#4A148C', '#0D47A1', '#B71C1C', '#1B5E20']
  - [ ] Dark purple, blue, red, green
- [ ] Add combo.canvasColor to state.js (done in Story 10.1)
  - [ ] String field for selected color
  - [ ] Null by default
- [ ] Update activateCombo() to select random color
  - [ ] Random index: Math.floor(Math.random() * 4)
  - [ ] Store in combo.canvasColor
- [ ] Apply canvas color transition in activateCombo()
  - [ ] Get canvas element
  - [ ] Set CSS transition: 'background-color 500ms ease-in-out'
  - [ ] Set backgroundColor to combo.canvasColor
- [ ] Implement exitCombo() in combo.js
  - [ ] Transition canvas back to #E8E8E8
  - [ ] Reset combo.canvasColor = null
  - [ ] Reset combo state (active, effectA, effectB, foodCount)
- [ ] Test color transition smoothness
  - [ ] Verify 500ms fade (not instant)
  - [ ] Verify smooth animation (no flicker)
- [ ] Test phone call + combo interaction
  - [ ] Activate combo (dark canvas)
  - [ ] Trigger phone call
  - [ ] Verify dark color visible under blur
  - [ ] Dismiss phone, verify dark color persists
- [ ] Test visual contrast
  - [ ] Render snake (green, yellow, red, etc.) on all 4 dark colors
  - [ ] Verify all colors have sufficient contrast

---

## Developer Context

### 🎯 STORY OBJECTIVE

Transform the canvas background to a dark color during combo mode to create a clear visual signal that the player is in a special state. The 500ms smooth transition feels premium and reduces jarring changes. Four dark colors add variety and replayability. The dark background must not reduce visibility or contrast.

**CRITICAL SUCCESS FACTORS:**
- Smooth 500ms transition (not instant)
- Random color selection from 4 dark colors
- Sufficient contrast for all snake/food colors
- Dark color persists during phone call blur

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/config.js` — Add COMBO_CANVAS_COLORS
- `js/combo.js` — Apply color transition in activateCombo(), reset in exitCombo()
- `css/style.css` — Ensure canvas transition property exists

**Module Boundaries:**
- `config.js` owns configuration (dark color palette)
- `combo.js` owns combo state transitions (activate, exit)
- `render.js` unchanged (snake/food colors work on any background)

**Data Flow:**
```
1. Combo activates
2. combo.js: select random color from COMBO_CANVAS_COLORS
3. combo.js: store in combo.canvasColor
4. combo.js: apply CSS transition to canvas element
5. Canvas background fades from #E8E8E8 to dark color (500ms)
6. Combo exits (third food eaten)
7. combo.js: transition canvas back to #E8E8E8
8. Canvas background fades back to light grey (500ms)
```

---

### 📦 CONFIG.JS UPDATES

Add combo canvas colors:

```javascript
export const CONFIG = {
  // ... existing config ...

  // Combo Mode Canvas Colors (v2 - Epic 10)
  COMBO_CANVAS_COLORS: [
    '#4A148C',  // Dark purple
    '#0D47A1',  // Dark blue
    '#B71C1C',  // Dark red
    '#1B5E20'   // Dark green
  ],

  // Default canvas color (light grey)
  DEFAULT_CANVAS_COLOR: '#E8E8E8'
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. combo.js — Update activateCombo() with color transition:**

```javascript
import { CONFIG } from './config.js';

export function activateCombo(food, gameState) {
  // Set combo active
  gameState.combo.active = true;

  // Store Effect A
  gameState.combo.effectA = {
    type: food.type,
    points: getFoodPoints(food.type)
  };

  // Reset food count
  gameState.combo.foodCount = 1;

  // Select random canvas color
  const colors = CONFIG.COMBO_CANVAS_COLORS;
  gameState.combo.canvasColor = colors[Math.floor(Math.random() * colors.length)];

  // Apply canvas color transition
  const canvas = document.getElementById('game-canvas');
  canvas.style.transition = 'background-color 500ms ease-in-out';
  canvas.style.backgroundColor = gameState.combo.canvasColor;

  console.log(`Combo activated! Canvas color: ${gameState.combo.canvasColor}`);
}
```

**2. combo.js — Implement exitCombo():**

```javascript
export function exitCombo(gameState) {
  // Transition canvas back to default color
  const canvas = document.getElementById('game-canvas');
  canvas.style.transition = 'background-color 500ms ease-in-out';
  canvas.style.backgroundColor = CONFIG.DEFAULT_CANVAS_COLOR;

  // Reset combo state
  gameState.combo.active = false;
  gameState.combo.effectA = null;
  gameState.combo.effectB = null;
  gameState.combo.canvasColor = null;
  gameState.combo.foodCount = 0;

  console.log('Combo exited. Canvas returned to default color.');
}
```

**3. style.css — Ensure canvas has transition property:**

```css
/* Game canvas */
#game-canvas {
  background-color: #E8E8E8; /* Default light grey */
  transition: background-color 500ms ease-in-out; /* Smooth color transitions */
}
```

**4. Phone call + combo interaction (no changes needed):**

```javascript
// Phone overlay blur is applied to canvas via CSS
// Combo color persists underneath blur automatically
// No additional code needed — CSS handles stacking
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Smooth Color Transition on Activation:**
   - Reach score 40
   - Trigger combo
   - Observe canvas background
   - Verify smooth 500ms fade from light grey to dark color
   - Verify transition is not instant or jarring

2. **Random Color Selection:**
   - Trigger 10 combos
   - Track which colors appear
   - Verify multiple different colors (purple, blue, red, green)
   - Verify randomness (not always the same color)

3. **All 4 Dark Colors:**
   - Trigger combos until all 4 colors have appeared
   - Verify each color:
     - Dark purple (#4A148C)
     - Dark blue (#0D47A1)
     - Dark red (#B71C1C)
     - Dark green (#1B5E20)

4. **Canvas Returns to Light Grey on Exit:**
   - Activate combo (dark canvas)
   - Eat third food (exit combo)
   - Verify smooth 500ms fade back to light grey (#E8E8E8)

5. **Phone Call + Combo Color Interaction:**
   - Activate combo (dark canvas)
   - Trigger phone call
   - Verify dark combo color visible under 4px blur
   - Verify both effects stack correctly (dark + blur)
   - Dismiss phone call
   - Verify dark combo color persists (no reset)

6. **Visual Contrast (All Colors on Dark Background):**
   - Activate combo with dark purple background
   - Render snake with all food colors:
     - Green (growing)
     - Yellow (invincibility)
     - Red (speed boost)
     - Cyan (speed decrease)
     - Orange (reverse controls)
     - Purple (wall phase)
   - Verify all colors have sufficient contrast
   - Repeat for all 4 dark backgrounds

**Edge Cases:**
- Combo activates then exits rapidly (color transitions overlap)
- Multiple combos in a row (color changes each time)
- Phone call arrives exactly when combo exits (no color conflict)

---

### 📚 CRITICAL DATA FORMATS

**Canvas color hex codes:**
```javascript
canvas.style.backgroundColor = '#4A148C';  // CORRECT (hex with #)
canvas.style.backgroundColor = '4A148C';   // WRONG (missing #)
```

**Random color selection:**
```javascript
const color = colors[Math.floor(Math.random() * colors.length)];  // CORRECT
const color = colors[Math.random() * colors.length];              // WRONG (not integer index)
```

**CSS transition syntax:**
```javascript
canvas.style.transition = 'background-color 500ms ease-in-out';  // CORRECT
canvas.style.transition = 'background-color 500 ease-in-out';    // WRONG (missing 'ms' unit)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Visual feedback, perceptual load
- `_bmad-output/planning-artifacts/prd.md` — FR42-FR43 (canvas color transition requirements)

**Key Design Principles:**
- **Clear signaling:** Dark canvas immediately communicates "special state"
- **Smooth transitions:** 500ms fade feels premium, reduces jarring changes
- **Variety:** 4 dark colors add replayability and visual interest
- **Contrast:** Light snake/food colors remain visible on dark backgrounds

---

### 📋 FRs COVERED

FR42-FR43 (Canvas background color transition)

**Detailed FR Mapping:**
- FR42: Canvas transitions to dark color on combo activation → activateCombo() applies background color
- FR43: Canvas transitions back to light grey on combo exit → exitCombo() resets background color

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] CONFIG.COMBO_CANVAS_COLORS defined with 4 colors
- [ ] CONFIG.DEFAULT_CANVAS_COLOR = '#E8E8E8'
- [ ] combo.canvasColor added to state.js
- [ ] activateCombo() selects random color from array
- [ ] activateCombo() applies CSS transition to canvas
- [ ] Canvas background color set to combo.canvasColor
- [ ] exitCombo() transitions canvas back to #E8E8E8
- [ ] exitCombo() resets combo.canvasColor = null
- [ ] CSS transition property on #game-canvas
- [ ] Transition duration is 500ms
- [ ] Transition easing is ease-in-out
- [ ] Smooth fade on activation (not instant)
- [ ] Smooth fade on exit (not instant)
- [ ] All 4 dark colors appear (verified)
- [ ] Random color selection (not always same color)
- [ ] Phone call + combo: dark color visible under blur
- [ ] Visual contrast sufficient for all snake/food colors on all 4 backgrounds
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (rapid exit, multiple combos, phone overlap)

**Common Mistakes to Avoid:**
- ❌ Instant color change instead of 500ms fade
- ❌ Always selecting same color (not random)
- ❌ Missing # in hex color codes
- ❌ Resetting canvas color during phone call (should persist)
- ❌ Poor contrast (snake not visible on dark background)
- ❌ Not using ease-in-out easing (transition feels abrupt)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/config.js (modified - add COMBO_CANVAS_COLORS, DEFAULT_CANVAS_COLOR)
- js/combo.js (modified - apply color transition in activateCombo, reset in exitCombo)
- css/style.css (modified - ensure canvas transition property exists)
