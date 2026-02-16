# Story 20.1: Define CSS Tier System with 6 Score Thresholds

**Epic:** 20 - Progressive Arcade Transformation (Neon Noir)
**Story ID:** 20.1
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## Story

**As a** developer implementing visual progression,
**I want** CSS classes for 6 distinct score-based visual tiers,
**So that** the playfield transforms from daylight to Neon Noir as players achieve higher scores.

---

## Acceptance Criteria

**Given** the visual transformation requires 6 progressive tiers
**When** defining CSS classes in style.css
**Then** 6 tier classes exist: tier-0 (0-14), tier-1 (15-29), tier-2 (30-49), tier-3 (50-74), tier-4 (75-99), tier-5 (100+)

**And** each tier defines background-color value: tier-0 #e8e8e8 (light grey), tier-1 #d0d0d0, tier-2 #b8b8b8, tier-3 #808080, tier-4 #505050, tier-5 #1a1a1a (near-black)
**And** each tier includes transition: background-color 2s ease-in-out for smooth shifts
**And** tier thresholds are defined in config.js PROGRESSION.backgroundColor array

**Given** emotional progression mapping (bright=safety, dark=danger)
**When** reviewing tier sequence
**Then** tier-0/1 feel "safe daylight", tier-2/3 feel "building intensity", tier-4/5 feel "serious arcade/Neon Noir"

---

## Tasks / Subtasks

- [ ] Define BACKGROUND_PROGRESSION in config.js
  - [ ] Array of 6 score thresholds: [0, 15, 30, 50, 75, 100]
  - [ ] Array of 6 hex colors: ['#e8e8e8', '#d0d0d0', '#b8b8b8', '#808080', '#505050', '#1a1a1a']
- [ ] Add CSS tier classes to style.css
  - [ ] Create .tier-0 through .tier-5 classes
  - [ ] Each class sets background-color to corresponding hex value
  - [ ] Add transition: background-color 2s ease-in-out to #game-canvas base rule
- [ ] Visual validation
  - [ ] Verify color progression matches emotional arc
  - [ ] Test smooth 2-second transitions between tiers

---

## Developer Context

### 🎯 STORY OBJECTIVE

Create the CSS foundation and config data for the 6-tier progressive darkening system. This is the visual bedrock of Epic 20 — the playfield starts bright (safe) and progressively darkens to near-black Neon Noir as score increases, creating mounting cinematic tension.

**CRITICAL SUCCESS FACTORS:**
- 6 distinct tiers with score thresholds matching Sally's UX spec
- GPU-composited CSS transitions (NOT canvas fillRect)
- Emotional progression: bright → slight tension → building intensity → Neon Noir
- Smooth 2-second transitions feel earned, not jarring

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `css/style.css` — Add tier classes and canvas transition rule
- `js/config.js` — Define BACKGROUND_PROGRESSION section

**Module Boundaries:**
- `config.js` owns tier threshold data
- `style.css` owns visual styling (colors, transitions)
- `progression.js` will resolve score → tier (Story 20.2)
- `game.js` will apply tier classes (Story 20.4)

**Data Flow:**
```
config.js: BACKGROUND_PROGRESSION → progression.js: getState(score).background → game.js: canvas.style.backgroundColor
CSS transition animates the change automatically
```

---

### 📦 CONFIG.JS UPDATES

**Add new section:**

```javascript
// V4: Progressive Visual Transformation (Epic 20)
BACKGROUND_PROGRESSION: {
  // 6 score thresholds for background color tiers
  thresholds: [0, 15, 30, 50, 75, 100],

  // 6 background colors (light grey → near-black)
  colors: [
    '#e8e8e8',  // tier-0 (0-14): Safe daylight
    '#d0d0d0',  // tier-1 (15-29): Slight tension
    '#b8b8b8',  // tier-2 (30-49): Warm-up complete
    '#808080',  // tier-3 (50-74): Building intensity
    '#505050',  // tier-4 (75-99): Serious arcade
    '#1a1a1a'   // tier-5 (100+): Full Neon Noir
  ]
},
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. config.js — Add BACKGROUND_PROGRESSION section:**

Place after existing PROGRESSION object (V2 blink/combo probabilities):

```javascript
// js/config.js
export const CONFIG = {
  // ... existing config ...

  // V4: Progressive Visual Transformation
  BACKGROUND_PROGRESSION: {
    thresholds: [0, 15, 30, 50, 75, 100],
    colors: ['#e8e8e8', '#d0d0d0', '#b8b8b8', '#808080', '#505050', '#1a1a1a']
  },
};
```

**2. style.css — Add canvas transition rule:**

Update the existing `#game-canvas` rule:

```css
/* css/style.css */
#game-canvas {
  background-color: #e8e8e8;  /* tier-0 default */
  border: 6px solid #9D4EDD;  /* Existing purple border */

  /* V4: Smooth background transitions */
  transition: background-color 2000ms ease-in-out;
}
```

**Why this works:**
- CSS handles color interpolation automatically (no manual lerp math)
- GPU-composited (browser native, zero CPU cost)
- `transition: background-color` applies to ALL background color changes via JS
- 2000ms = 2 seconds (matches UX spec)

**3. No tier classes needed in CSS:**

Original plan was to create `.tier-0` through `.tier-5` classes, but **we don't need them**. Story 20.4 will directly set `canvas.style.backgroundColor = background` using the hex value from config.

CSS transition applies to inline style changes automatically.

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Config Data Integrity:**
   - Open browser console
   - Import CONFIG from config.js
   - Verify `CONFIG.BACKGROUND_PROGRESSION.thresholds.length === 6`
   - Verify `CONFIG.BACKGROUND_PROGRESSION.colors.length === 6`
   - Verify colors are valid hex strings

2. **CSS Transition Setup:**
   - Inspect #game-canvas in DevTools
   - Verify `transition: background-color 2000ms ease-in-out` is applied
   - Verify default background-color is `#e8e8e8`

3. **Visual Progression (after Stories 20.2-20.4 implemented):**
   - Play game from score 0 → 150
   - Verify background darkens progressively
   - Verify tier-0 (0-14) is light grey
   - Verify tier-5 (100+) is near-black
   - Verify transitions are smooth (2 seconds), not instant

4. **Emotional Arc Validation:**
   - tier-0/1: Should feel "safe daylight" (bright, comfortable)
   - tier-2/3: Should feel "building intensity" (medium grey, escalating)
   - tier-4/5: Should feel "Neon Noir / final boss arena" (dark, stark)

**Edge Cases:**
- Score jumps multiple tiers at once (combo multiplier) — CSS handles smoothly
- Rapid score changes — CSS transition queues properly, no flashing
- Browser refresh at high score — starts at tier-0 (expected, score resets)

---

### 📚 CRITICAL DATA FORMATS

**Threshold array MUST match color array length:**
```javascript
thresholds: [0, 15, 30, 50, 75, 100],  // 6 values
colors: ['#e8e8e8', ..., '#1a1a1a']     // 6 values
// CORRECT — arrays aligned

thresholds: [0, 15, 30, 50, 75, 100],  // 6 values
colors: ['#e8e8e8', ..., '#808080']     // 5 values
// WRONG — mismatched lengths break tier resolution
```

**Color format MUST be hex strings:**
```javascript
colors: ['#e8e8e8', '#d0d0d0']  // CORRECT
colors: ['rgb(232,232,232)']     // WRONG — use hex for CSS compatibility
colors: [0xe8e8e8]               // WRONG — use strings, not numbers
```

**Transition property syntax:**
```css
transition: background-color 2000ms ease-in-out;  /* CORRECT */
transition: background 2s;                         /* WRONG — too broad */
transition: 2s;                                    /* WRONG — missing property */
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade.md` — Enhancement 1 (Progressive Dark Playfield)
- `_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade-technical-addendum.md` — Pattern 1 (Canvas Background Color Management)
- `_bmad-output/planning-artifacts/project-context.md` — V4 CSS/Canvas Hybrid Pattern (line 347)

**Key Design Principles:**
- **Score-based, never time-based** — tier changes only when score crosses thresholds
- **GPU-composited transitions** — CSS background-color, NOT canvas fillRect
- **Emotional progression** — brightness maps to safety/danger (RPG color psychology)
- **Earned transformation** — player controls the pace by achieving higher scores

---

### 📋 FRs COVERED

FR-V3-1 (Progressive Dark Playfield with 6 score tiers)

**Detailed FR Mapping:**
- 6 distinct visual tiers → `BACKGROUND_PROGRESSION.thresholds` array
- Score-based triggers → tier resolution in Story 20.2
- Smooth transitions → CSS `transition: background-color 2s`
- Emotional arc (bright → dark) → `colors` array progression

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] config.js contains BACKGROUND_PROGRESSION object
- [ ] BACKGROUND_PROGRESSION.thresholds = [0, 15, 30, 50, 75, 100] (6 values)
- [ ] BACKGROUND_PROGRESSION.colors = ['#e8e8e8', '#d0d0d0', '#b8b8b8', '#808080', '#505050', '#1a1a1a'] (6 hex strings)
- [ ] thresholds and colors arrays have equal length (6)
- [ ] #game-canvas CSS rule includes `transition: background-color 2000ms ease-in-out`
- [ ] Default background-color is `#e8e8e8` (tier-0)
- [ ] Colors progress from light grey to near-black (visual inspection)
- [ ] All hex colors are valid CSS color strings
- [ ] Config data loads without errors in browser console
- [ ] CSS transition rule applies to #game-canvas element (DevTools inspection)

**Common Mistakes to Avoid:**
- ❌ Creating `.tier-0` through `.tier-5` CSS classes (not needed — inline styles used)
- ❌ Using canvas fillRect for background (breaks GPU optimization, no transitions)
- ❌ Mismatched array lengths (thresholds vs colors)
- ❌ Using rgb() or rgba() instead of hex strings
- ❌ Setting transition duration in CSS class instead of base #game-canvas rule
- ❌ Forgetting to export CONFIG in config.js

---

## Dev Agent Record

### Agent Model Used

_To be filled by Dev agent_

### Debug Log References

_To be filled by Dev agent_

### Completion Notes List

_To be filled by Dev agent_

### File List

- js/config.js (modified - add BACKGROUND_PROGRESSION section)
- css/style.css (modified - add transition rule to #game-canvas)
