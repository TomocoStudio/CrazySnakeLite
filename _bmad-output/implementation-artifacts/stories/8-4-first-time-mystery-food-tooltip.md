# Story 8.4: Implement First-Time Mystery Food Tooltip

**Epic:** 8 - Progressive Blinking Food System
**Story ID:** 8.4
**Status:** ❌ rejected - user feedback
**Created:** 2026-02-08

---

## Story

**As a** player encountering blinking food for the first time,
**I want** a brief explanation,
**So that** I understand what mystery food means.

## Acceptance Criteria

**Given** my score reaches 15 for the first time
**When** the first blinking food spawns
**Then** a tooltip appears at the center of the screen:
- Content: "Mystery Food! Effect hidden until consumed"
- Background: rgba(0, 0, 0, 0.9) with 4px purple border
- Font: Jersey20, 20px, white text
- Border-radius: 8px
**And** the tooltip auto-dismisses after 3 seconds
**And** the game continues running (no pause)

**Given** the tooltip is visible
**When** I press any key
**Then** the tooltip dismisses immediately

**Given** I start a new game
**When** I reach score 15 again
**Then** the tooltip does NOT reappear (shown once per browser session)

**Given** the tooltip appears
**When** 3 seconds elapse
**Then** the tooltip fades out smoothly (500ms fade)
**And** the DOM element is removed after fade completes

## Tasks / Subtasks

- [x] Add mysteryFoodTooltipShown flag to UI state
  - [x] Add to state.js: ui.mysteryFoodTooltipShown = false
  - [x] Check sessionStorage on game init to restore flag
- [x] Create tooltip trigger logic in game.js
  - [x] When score >= 15 AND first blinking food spawns AND !ui.mysteryFoodTooltipShown
  - [x] Call showMysteryFoodTooltip()
  - [x] Set ui.mysteryFoodTooltipShown = true
  - [x] Store in sessionStorage
- [x] Implement showMysteryFoodTooltip() in UI module
  - [x] Create tooltip DOM element dynamically
  - [x] Style: background rgba(0, 0, 0, 0.9), 4px purple border, border-radius 8px
  - [x] Text: "Mystery Food! Effect hidden until consumed"
  - [x] Font: Jersey20, 20px, white
  - [x] Position: center of screen (fixed positioning)
- [x] Implement auto-dismiss after 3 seconds
  - [x] setTimeout(3000) → trigger fade-out
  - [x] Fade-out animation (500ms)
  - [x] Remove DOM element after fade completes
- [x] Implement manual dismiss on keypress
  - [x] Add event listener for any key press
  - [x] Trigger fade-out immediately
  - [x] Remove event listener after dismiss
- [x] Create CSS fade animation
  - [x] 0% → 100% opacity (fade in, 300ms)
  - [x] Hold at 100% (3000ms)
  - [x] 100% → 0% opacity (fade out, 500ms)
- [x] Test tooltip behavior
  - [x] Verify tooltip appears at score 15 (first blinking food)
  - [x] Verify auto-dismiss after 3s
  - [x] Verify manual dismiss on keypress
  - [x] Verify tooltip does not reappear in same session
  - [x] Verify game continues running (no pause)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Provide just-in-time learning by showing a brief tooltip when players first encounter blinking (mystery) food. The tooltip must be non-intrusive (auto-dismisses, game continues), informative (explains concept), and session-persistent (only shown once). This follows cognitive load theory: teach new mechanics at the moment of first encounter, not earlier.

**CRITICAL SUCCESS FACTORS:**
- Tooltip appears exactly once per browser session
- Tooltip appears when first blinking food spawns (not before)
- Tooltip does not pause the game
- Tooltip auto-dismisses after 3s (or immediately on keypress)
- Tooltip is visually distinct (purple border matches mystery food theme)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/state.js` — Add ui.mysteryFoodTooltipShown flag
- `js/game.js` — Trigger tooltip when first blinking food spawns
- `js/ui.js` — Implement showMysteryFoodTooltip() function
- `css/style.css` — Add .mystery-food-tooltip styles and fade animation

**Module Boundaries:**
- `state.js` owns state structure (ui flags)
- `game.js` owns game loop and event triggers
- `ui.js` owns DOM manipulation (create/remove tooltip)
- `style.css` owns visual styling (colors, fonts, animations)

**Data Flow:**
```
1. game.js: score >= 15 → spawnFood() → food.isBlinking = true
2. game.js: check ui.mysteryFoodTooltipShown === false
3. ui.js: showMysteryFoodTooltip() → create DOM element
4. ui.js: add fade-in animation (300ms)
5. ui.js: setTimeout(3000) → trigger fade-out
6. ui.js: remove DOM element after fade completes
7. state.js: ui.mysteryFoodTooltipShown = true
8. sessionStorage: store flag (persist for browser session)
```

---

### 📦 CONFIG.JS UPDATES

Add tooltip configuration (optional, for easy tuning):

```javascript
export const CONFIG = {
  // ... existing config ...

  // Mystery Food Tooltip (v2 - Epic 8)
  TOOLTIP: {
    text: 'Mystery Food! Effect hidden until consumed',
    duration: 3000,           // Auto-dismiss after 3s
    fadeInDuration: 300,      // Fade in over 300ms
    fadeOutDuration: 500      // Fade out over 500ms
  }
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. state.js — Add tooltip flag:**

```javascript
export function createInitialState() {
  // Check sessionStorage for tooltip flag
  const tooltipShown = sessionStorage.getItem('mysteryFoodTooltipShown') === 'true';

  return {
    // ... existing state ...
    ui: {
      mysteryFoodTooltipShown: tooltipShown,
      // ... other UI state ...
    }
  };
}
```

**2. game.js — Trigger tooltip on first blinking food:**

```javascript
import { showMysteryFoodTooltip } from './ui.js';

function onFoodSpawned(food, gameState) {
  // Check if this is the first blinking food (score >= 15, tooltip not shown yet)
  if (food.isBlinking && !gameState.ui.mysteryFoodTooltipShown) {
    showMysteryFoodTooltip();
    gameState.ui.mysteryFoodTooltipShown = true;
    sessionStorage.setItem('mysteryFoodTooltipShown', 'true');
  }
}
```

**3. ui.js — Implement tooltip display:**

```javascript
import { CONFIG } from './config.js';

export function showMysteryFoodTooltip() {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'mystery-food-tooltip';
  tooltip.textContent = CONFIG.TOOLTIP.text;

  // Add to DOM
  document.body.appendChild(tooltip);

  // Auto-dismiss after 3 seconds
  const dismissTimeout = setTimeout(() => {
    dismissTooltip(tooltip);
  }, CONFIG.TOOLTIP.duration);

  // Manual dismiss on any keypress
  const keypressHandler = (e) => {
    clearTimeout(dismissTimeout);
    dismissTooltip(tooltip);
    document.removeEventListener('keydown', keypressHandler);
  };
  document.addEventListener('keydown', keypressHandler);
}

function dismissTooltip(tooltip) {
  // Add fade-out class
  tooltip.classList.add('fade-out');

  // Remove from DOM after fade completes
  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }
  }, CONFIG.TOOLTIP.fadeOutDuration);
}
```

**4. style.css — Add tooltip styles:**

```css
/* Mystery Food Tooltip */
.mystery-food-tooltip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: rgba(0, 0, 0, 0.9);
  border: 4px solid purple;
  border-radius: 8px;
  padding: 16px 24px;

  font-family: 'Jersey20', sans-serif;
  font-size: 20px;
  color: white;
  text-align: center;

  z-index: 1000;

  /* Fade-in animation */
  animation: tooltipFadeIn 300ms ease-out;
}

.mystery-food-tooltip.fade-out {
  animation: tooltipFadeOut 500ms ease-out forwards;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes tooltipFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Tooltip Appears at Score 15:**
   - Start new game (clear sessionStorage first)
   - Eat food until score reaches 15
   - Verify tooltip appears when first blinking food spawns
   - Verify tooltip text: "Mystery Food! Effect hidden until consumed"

2. **Tooltip Auto-Dismisses After 3s:**
   - Wait (do not press any key)
   - Verify tooltip fades out after 3 seconds
   - Verify fade-out animation is smooth (500ms)
   - Verify tooltip is removed from DOM after fade completes

3. **Tooltip Manual Dismiss on Keypress:**
   - Trigger tooltip again (clear sessionStorage, restart game)
   - Press any key while tooltip is visible
   - Verify tooltip dismisses immediately (fade-out starts)
   - Verify no error if multiple keys pressed

4. **Tooltip Only Shows Once Per Session:**
   - After tooltip dismissed, continue playing
   - Reach score 15 again (die and restart game)
   - Verify tooltip does NOT reappear
   - Close browser tab, reopen game
   - Verify tooltip DOES reappear (new session)

5. **Game Continues Running:**
   - Observe tooltip appearing
   - Verify game loop continues (snake keeps moving)
   - Verify no pause or freeze
   - Verify player can still control snake while tooltip visible

**Edge Cases:**
- Tooltip triggered while player is moving (game continues)
- Multiple keypresses while tooltip visible (only dismisses once)
- Browser loses focus during tooltip (auto-dismiss still works on regain)
- sessionStorage disabled (tooltip shows every time, no error)

---

### 📚 CRITICAL DATA FORMATS

**sessionStorage API:**
```javascript
sessionStorage.setItem('mysteryFoodTooltipShown', 'true');  // CORRECT
sessionStorage.mysteryFoodTooltipShown = true;              // LESS RELIABLE

const shown = sessionStorage.getItem('key') === 'true';     // CORRECT (convert to boolean)
const shown = sessionStorage.getItem('key');                // WRONG (returns string 'true', not boolean)
```

**setTimeout cleanup:**
```javascript
const timeout = setTimeout(() => { }, 3000);
clearTimeout(timeout);                      // CORRECT (cleanup on manual dismiss)
// Not clearing timeout = both auto and manual dismiss fire // WRONG
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Just-in-time learning, cognitive load theory
- `_bmad-output/planning-artifacts/prd.md` — FR35 (first-time tooltip requirement)

**Key UX Principles:**
- **Just-in-time learning:** Teach mechanics at the moment of first encounter
- **Progressive disclosure:** Don't overwhelm players with information upfront
- **Non-intrusive feedback:** Tooltip does not pause game or block interaction
- **Session persistence:** Only show once (prevents tutorial fatigue)

---

### 📋 FRs COVERED

FR35 (First-time mystery food tooltip)

**Detailed FR Mapping:**
- FR35: Tooltip appears at score 15 when first blinking food spawns, auto-dismisses after 3s → Core implementation

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] state.js has ui.mysteryFoodTooltipShown flag
- [ ] sessionStorage persists tooltip flag across games (same session)
- [ ] game.js triggers tooltip when score >= 15 AND first blinking food spawns
- [ ] ui.js showMysteryFoodTooltip() creates DOM element dynamically
- [ ] Tooltip text: "Mystery Food! Effect hidden until consumed"
- [ ] Tooltip style: rgba(0, 0, 0, 0.9) background, 4px purple border, 8px border-radius
- [ ] Tooltip font: Jersey20, 20px, white
- [ ] Tooltip position: center of screen (fixed)
- [ ] Tooltip auto-dismisses after 3 seconds
- [ ] Tooltip dismisses immediately on keypress
- [ ] Fade-in animation (300ms)
- [ ] Fade-out animation (500ms)
- [ ] DOM element removed after fade-out completes
- [ ] Game continues running (no pause)
- [ ] Tooltip only appears once per browser session
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (multiple keypresses, browser focus loss, sessionStorage disabled)

**Common Mistakes to Avoid:**
- ❌ Tooltip pauses game (must continue running)
- ❌ Tooltip appears before score 15 (too early)
- ❌ Tooltip appears every game (must persist in sessionStorage)
- ❌ Tooltip not removed from DOM after dismiss (memory leak)
- ❌ Not clearing timeout on manual dismiss (fires twice)
- ❌ Not removing keypress event listener (memory leak)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Clean implementation, no debugging required

### Completion Notes List

**❌ FEATURE REJECTED BY USER (Tomoco) - 2026-02-12**

**Implementation was completed and then reverted per user feedback.**

**User Feedback:**
> "no need for tooltip, please revert and udpate the specs."

**What Was Implemented (then reverted):**
- ✅ Created ui.js module with showMysteryFoodTooltip() function
- ✅ Added TOOLTIP configuration to config.js
- ✅ Added ui.mysteryFoodTooltipShown flag to state.js with sessionStorage persistence
- ✅ Added tooltip trigger logic in game.js
- ✅ Added CSS styles and animations to style.css
- ✅ All tasks completed, feature functionally working

**Reason for Rejection:**
- User preference: No need for tutorial/tooltip
- Blinking food is self-explanatory through gameplay
- Players will discover mystery food mechanic organically

**Code Reverted:**
- config.js: Removed TOOLTIP configuration
- state.js: Removed ui.mysteryFoodTooltipShown flag and sessionStorage check
- game.js: Removed tooltip trigger logic and import
- ui.js: Deleted entire module
- style.css: Removed .mystery-food-tooltip styles and animations

**Design Implications:**
- Players will learn about blinking food through discovery (no tutorial)
- Mystery food mechanic relies on intrinsic curiosity and exploration
- Simpler codebase without tutorial system
- Fits minimalist aesthetic better

**Recommendation:**
- Mark this story as "rejected" or "backlog" in sprint status
- Skip to Story 8.5 (Reduced Motion Mode) or 8.6 (Blinking Food Stats)
- Consider if any other tutorial/onboarding features are needed (likely not, based on user preference)

### File List

- js/config.js (modified - add TOOLTIP configuration)
- js/state.js (modified - add ui.mysteryFoodTooltipShown flag, sessionStorage check)
- js/game.js (modified - trigger tooltip on first blinking food spawn)
- js/ui.js (new - tooltip UI module with showMysteryFoodTooltip function)
- css/style.css (modified - add .mystery-food-tooltip styles and animations)
