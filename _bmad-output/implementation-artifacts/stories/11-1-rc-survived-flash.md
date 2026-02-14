# Story 11.1: Implement "RC SURVIVED" Flash

**Epic:** 11 - Cognitive Feedback & RC Recognition
**Story ID:** 11.1
**Status:** ✅ review
**Created:** 2026-02-08
**Completed:** 2026-02-14

---

## Story

**As a** player,
**I want** to receive immediate recognition when I survive Reverse Controls,
**So that** I feel acknowledged for completing the hardest cognitive challenge.

## Acceptance Criteria

**Given** I eat a Reverse Controls food (+8)
**When** the effect activates
**Then** my controls are reversed (up → down, left → right)

**Given** I am navigating with Reverse Controls active
**When** I successfully eat the next food without dying
**Then** a "RC SURVIVED" text flash appears:
- Content: "RC SURVIVED" (uppercase, orange text — matches RC food color)
- Font: Jersey20, 48px, extra bold (900 weight)
- Position: 20px below the +8 score popup
- Animation: 2500ms fade-up and fade-out (long enough to register during gameplay)
- Appears 200ms after the +8 popup (stagger rule)

**Given** the "RC SURVIVED" flash appears
**When** the animation plays
**Then** the flash does not obstruct gameplay
**And** the flash auto-removes after 2500ms

**Given** I eat Reverse Controls but die before eating the next food
**When** death occurs
**Then** no "RC SURVIVED" flash appears
**And** cognitiveStats.rcSurvived does NOT increment

## Tasks / Subtasks

- [x] Track effects.reverseControlsActive flag in state.js
  - [x] Boolean flag (false by default)
  - [x] Set to true when Reverse Controls activates
  - [x] Set to false when effect ends (next food eaten or death)
- [x] Implement spawnFlash(text, x, y) in score-popup.js
  - [x] Similar to spawnComboPopup but bold, high-visibility
  - [x] Create DOM element with text
  - [x] Position at x, y with 20px offset below popup
  - [x] Apply .rc-survived-flash CSS class
  - [x] Auto-remove after 2500ms (using animationend event)
- [x] Check RC survival on food consumption
  - [x] In game.js food collision handler: if reverseControlsActive && !died
  - [x] Call spawnFlash("RC SURVIVED", x, y + 20)
  - [x] Increment cognitiveStats.rcSurvived
  - [x] Deactivate reverseControlsActive flag (via clearEffect/applyEffect)
- [x] Add .rc-survived-flash CSS class
  - [x] Font: Jersey20, 48px, orange (#FFA500), 900 weight with orange glow
  - [x] Animation: fade-up and fade-out over 2500ms
  - [x] No background (text only)
- [x] Test RC survival (unit tests created)
  - [x] Unit test: reverseControlsActive flag tracking
  - [x] Unit test: spawnFlash function exists
  - [x] Unit test: cognitiveStats.rcSurvived stat exists
  - [x] Manual test: Pending browser verification
- [x] Test RC death (no flash) (unit tests created)
  - [x] Logic verified: flag check happens before death
  - [x] Manual test: Pending browser verification

---

## Developer Context

### 🎯 STORY OBJECTIVE

Provide immediate metacognitive feedback when players successfully navigate Reverse Controls — the hardest cognitive challenge in the game. The "RC SURVIVED" flash transforms a difficult moment into an achievement, reinforcing that the player's brain did hard work. This is the first real-time cognitive feedback (more coming in death screen).

**CRITICAL SUCCESS FACTORS:**
- Flash only appears on successful survival (not on death)
- Flash positioned below +8 popup (200ms stagger)
- Flash auto-removes after 2500ms (bold but non-blocking)
- cognitiveStats.rcSurvived tracks successful survivals only

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/state.js` — Add effects.reverseControlsActive flag
- `js/score-popup.js` — Implement spawnFlash(text, x, y)
- `js/game.js` — Check RC survival on food consumption
- `css/style.css` — Add .rc-survived-flash class

**Module Boundaries:**
- `state.js` owns state structure (reverseControlsActive flag)
- `score-popup.js` owns flash rendering
- `game.js` owns RC survival detection
- `style.css` owns visual styling

**Data Flow:**
```
1. Player eats Reverse Controls food
2. effects.js: set reverseControlsActive = true
3. Player navigates with reversed controls
4. Player eats next food (survived)
5. game.js: check reverseControlsActive = true
6. game.js: spawnFlash("RC SURVIVED", x, y + 20)
7. game.js: cognitiveStats.rcSurvived += 1
8. effects.js: reverseControlsActive = false
9. Flash animates for 2500ms then auto-removes
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed (flash styling in CSS).

---

### 🎨 IMPLEMENTATION DETAILS

**1. state.js — Add reverseControlsActive flag:**

```javascript
export function createInitialState() {
  return {
    // ... existing state ...

    effects: {
      // ... existing effect fields ...
      reverseControlsActive: false  // NEW: Track if Reverse Controls currently active
    }
  };
}
```

**2. effects.js — Set flag when Reverse Controls activates:**

```javascript
export function applyFoodEffect(foodType, gameState) {
  // Deactivate previous effects
  deactivateAllEffects(gameState.effects);

  // Apply new effect
  switch (foodType) {
    case 'reverseControls':
      gameState.effects.reverseControlsActive = true;
      console.log('Reverse Controls activated');
      break;
    // ... other effect cases ...
  }
}

function deactivateAllEffects(effects) {
  effects.reverseControlsActive = false;
  // ... deactivate other effects ...
}
```

**3. score-popup.js — Implement spawnFlash():**

```javascript
/**
 * Spawn a text flash (e.g., "RC SURVIVED").
 * @param {string} text - Flash text
 * @param {number} x - X position (canvas coordinates)
 * @param {number} y - Y position (canvas coordinates)
 */
export function spawnFlash(text, x, y) {
  const flash = document.createElement('div');
  flash.className = 'rc-survived-flash';
  flash.textContent = text;

  // Position flash
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;

  // Add to DOM
  document.body.appendChild(flash);

  // Auto-remove after animation completes (using animationend event)
  flash.addEventListener('animationend', () => {
    flash.remove();
  });
}
```

**4. game.js — Check RC survival on food consumption:**

```javascript
import { spawnFlash } from './score-popup.js';

function onFoodEaten(food, gameState) {
  // Award base food score
  const baseScore = getFoodScore(food.type);
  gameState.score += baseScore;

  // Check if player survived Reverse Controls
  if (gameState.effects.reverseControlsActive) {
    // Player successfully navigated RC and ate next food
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;

    // Spawn "RC SURVIVED" flash (20px below +8 popup)
    setTimeout(() => {
      spawnFlash('RC SURVIVED', x, y + 20);
    }, 200); // 200ms stagger after +8 popup

    // Track survival
    gameState.cognitiveStats.rcSurvived += 1;

    console.log(`RC survived! Total: ${gameState.cognitiveStats.rcSurvived}`);
  }

  // Apply food effect (deactivates reverseControlsActive)
  applyFoodEffect(food.type, gameState);

  // ... rest of food consumption logic ...
}
```

**5. style.css — Add .rc-survived-flash class:**

```css
/* RC SURVIVED flash */
.rc-survived-flash {
  position: fixed;
  font-family: 'Jersey20', sans-serif;
  font-size: 48px;
  color: #FFA500;  /* Orange - matches RC food color */
  font-weight: 900;
  text-shadow: 0 0 12px rgba(255, 165, 0, 0.9),
               2px 2px 4px rgba(0, 0, 0, 1);
  pointer-events: none;
  z-index: 1000;
  animation: rcFlashFadeUp 2500ms ease-out forwards;
}

@keyframes rcFlashFadeUp {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-15px);
  }
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **RC Survival Flash Appears:**
   - Eat Reverse Controls food
   - Navigate with reversed controls (up→down, left→right)
   - Eat next food successfully
   - Verify "RC SURVIVED" flash appears
   - Verify flash positioned 20px below +8 popup
   - Verify flash displays for ~2500ms then disappears

2. **Flash Timing (200ms Stagger):**
   - Eat Reverse Controls food
   - Eat next food
   - Verify +8 popup appears first
   - Verify "RC SURVIVED" flash appears 200ms later (stagger)

3. **cognitiveStats.rcSurvived Increments:**
   - Survive Reverse Controls 3 times
   - Check cognitiveStats.rcSurvived
   - Verify value = 3

4. **No Flash on Death:**
   - Eat Reverse Controls food
   - Deliberately die before eating next food (hit wall)
   - Verify NO flash appears
   - Verify cognitiveStats.rcSurvived does NOT increment

5. **reverseControlsActive Resets:**
   - Eat Reverse Controls food (reverseControlsActive = true)
   - Eat next food (survived)
   - Verify reverseControlsActive = false (deactivated)

6. **Flash Does Not Obstruct Gameplay:**
   - Spawn flash during active gameplay
   - Verify flash is bold (48px orange) but pointer-events: none
   - Verify flash does not block snake or food input

**Edge Cases:**
- Eat Reverse Controls twice in a row (2 flashes, 2 survivals)
- Die exactly when flash is animating (flash completes, removed)
- Very fast eating (flash appears and disappears quickly)

---

### 📚 CRITICAL DATA FORMATS

**Flash positioning:**
```javascript
spawnFlash('RC SURVIVED', x, y + 20);  // CORRECT (20px below popup)
spawnFlash('RC SURVIVED', x, y - 20);  // WRONG (above popup, obstructs score)
```

**RC survival check:**
```javascript
if (effects.reverseControlsActive) { /* survived */ }  // CORRECT
if (effects.reverseControls) { /* survived */ }        // WRONG (different field name)
```

**Timing:**
```javascript
setTimeout(() => spawnFlash(), 200);  // CORRECT (200ms stagger)
setTimeout(() => spawnFlash(), 0);    // WRONG (no stagger)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Metacognitive feedback (Flavell, 1979)
- `_bmad-output/planning-artifacts/prd.md` — FR70-FR72 (RC SURVIVED flash)

**Key Design Principles:**
- **Metacognitive feedback:** Make players aware of their cognitive accomplishments
- **Immediate recognition:** Flash appears right when survival confirmed
- **Non-intrusive:** 2500ms duration, bold but pointer-events: none, auto-removes
- **Achievement framing:** Transforms hard moment into recognized accomplishment

---

### 📋 FRs COVERED

FR70-FR72 (RC SURVIVED flash on successful navigation)

**Detailed FR Mapping:**
- FR70: Flash appears when player survives Reverse Controls → onFoodEaten() check
- FR71: Flash positioned below +8 popup with 200ms stagger → setTimeout + y + 20
- FR72: Flash auto-removes after 2500ms → animationend cleanup

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] effects.reverseControlsActive flag added to state.js
- [ ] reverseControlsActive set to true when Reverse Controls activates
- [ ] reverseControlsActive set to false when effect deactivated
- [ ] spawnFlash(text, x, y) implemented in score-popup.js
- [ ] Flash DOM element created with text content
- [ ] .rc-survived-flash CSS class applied
- [ ] Flash positioned at x, y + 20 (20px below popup)
- [ ] Flash auto-removes after 2500ms
- [ ] onFoodEaten() checks if reverseControlsActive = true
- [ ] If true: spawnFlash("RC SURVIVED", x, y + 20)
- [ ] If true: cognitiveStats.rcSurvived += 1
- [ ] Flash appears 200ms after +8 popup (stagger)
- [ ] Flash font: Jersey20, 48px, orange (#FFA500), 900 weight
- [ ] Flash animation: fade-up and fade-out (2500ms)
- [ ] No flash appears on death before next food
- [ ] cognitiveStats.rcSurvived does NOT increment on death
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (double RC, death during flash, fast eating)

**Common Mistakes to Avoid:**
- ❌ Flash appears even when player dies (should only appear on survival)
- ❌ Incrementing rcSurvived on RC activation (should increment on survival)
- ❌ Flash positioned above popup (obstructs +8 score)
- ❌ No stagger delay (flash appears same time as +8 popup)
- ❌ Flash not auto-removed (memory leak)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- js/state.js:56 - effects.reverseControlsActive flag added
- js/state.js:93 - cognitiveStats.rcSurvived stat added
- js/effects.js:52-54 - reverseControlsActive set to true on RC activation
- js/effects.js:68 - reverseControlsActive cleared on effect end
- js/score-popup.js:42-62 - spawnFlash() function implementation
- js/game.js:9 - spawnFlash import added
- js/game.js:193-207 - RC survival check before effects applied/cleared
- css/style.css:1152-1182 - .rc-survived-flash class and animation
- test/rc-survived.test.js - Unit tests for RC survival logic

### Completion Notes List

✅ **Implementation Complete (2026-02-14)**

**Core Functionality:**
- `effects.reverseControlsActive` flag tracks RC active state
- Flag set to `true` when RC activates, `false` when cleared
- `spawnFlash(text, x, y)` creates DOM flash element with 2500ms fade-up animation
- RC survival check in `game.js` food collision handler (before effect changes)
- Flash spawned at food position + 20px vertical offset with 200ms stagger delay
- `cognitiveStats.rcSurvived` increments on successful survival

**Technical Decisions:**
- Used `animationend` event for flash cleanup (consistent with popup pattern)
- Check happens BEFORE `applyEffect()`/`clearEffect()` to preserve flag state
- Flash uses pixel coordinates (converted from grid coords via `gridToPixel()`)
- 200ms setTimeout for stagger timing (matches +8 popup timing)

**Test Coverage:**
- Unit tests: Flag tracking, stat initialization, function existence
- Manual tests: Pending browser verification for visual flash and gameplay flow

**Files Modified:**
- js/state.js - Added flag + stat to initial state
- js/effects.js - Set/clear flag on RC lifecycle
- js/score-popup.js - Implemented spawnFlash() function
- js/game.js - RC survival detection + flash trigger
- css/style.css - Flash styling and animation
- test/rc-survived.test.js - Unit test suite (NEW)
- test/index.html - Added rc-survived.test.js import

### File List

- js/state.js (modified - add effects.reverseControlsActive flag + cognitiveStats.rcSurvived)
- js/effects.js (modified - set/clear reverseControlsActive on RC activation/deactivation)
- js/score-popup.js (modified - implement spawnFlash function)
- js/game.js (modified - import spawnFlash, check RC survival on food consumption)
- css/style.css (modified - add .rc-survived-flash class and animation)
- test/rc-survived.test.js (new - unit tests for RC survival logic)
- test/index.html (modified - import rc-survived.test.js)
