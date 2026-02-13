# Story 11.1: Implement "RC SURVIVED" Flash

**Epic:** 11 - Cognitive Feedback & RC Recognition
**Story ID:** 11.1
**Status:** 🔴 not started
**Created:** 2026-02-08

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
- Content: "RC SURVIVED" (uppercase, white text)
- Font: Jersey20, 12px
- Position: 20px below the +8 score popup
- Animation: 400ms fade-up and fade-out
- Appears 200ms after the +8 popup (stagger rule)

**Given** the "RC SURVIVED" flash appears
**When** the animation plays
**Then** the flash does not obstruct gameplay
**And** the flash auto-removes after 400ms

**Given** I eat Reverse Controls but die before eating the next food
**When** death occurs
**Then** no "RC SURVIVED" flash appears
**And** cognitiveStats.rcSurvived does NOT increment

## Tasks / Subtasks

- [ ] Track effects.reverseControlsActive flag in state.js
  - [ ] Boolean flag (false by default)
  - [ ] Set to true when Reverse Controls activates
  - [ ] Set to false when effect ends (next food eaten or death)
- [ ] Implement spawnFlash(text, x, y) in score-popup.js
  - [ ] Similar to spawnComboPopup but smaller, faster
  - [ ] Create DOM element with text
  - [ ] Position at x, y with 20px offset below popup
  - [ ] Apply .rc-survived-flash CSS class
  - [ ] Auto-remove after 400ms
- [ ] Check RC survival on food consumption
  - [ ] In game.js onFoodEaten(): if reverseControlsActive && !died
  - [ ] Call spawnFlash("RC SURVIVED", x, y + 20)
  - [ ] Increment cognitiveStats.rcSurvived
  - [ ] Deactivate reverseControlsActive flag
- [ ] Add .rc-survived-flash CSS class
  - [ ] Font: Jersey20, 12px, white text
  - [ ] Animation: fade-up and fade-out over 400ms
  - [ ] No background (text only)
- [ ] Test RC survival
  - [ ] Eat Reverse Controls food
  - [ ] Navigate with reversed controls
  - [ ] Eat next food successfully
  - [ ] Verify "RC SURVIVED" flash appears
  - [ ] Verify cognitiveStats.rcSurvived = 1
- [ ] Test RC death (no flash)
  - [ ] Eat Reverse Controls food
  - [ ] Die before eating next food
  - [ ] Verify no flash appears
  - [ ] Verify cognitiveStats.rcSurvived = 0

---

## Developer Context

### 🎯 STORY OBJECTIVE

Provide immediate metacognitive feedback when players successfully navigate Reverse Controls — the hardest cognitive challenge in the game. The "RC SURVIVED" flash transforms a difficult moment into an achievement, reinforcing that the player's brain did hard work. This is the first real-time cognitive feedback (more coming in death screen).

**CRITICAL SUCCESS FACTORS:**
- Flash only appears on successful survival (not on death)
- Flash positioned below +8 popup (200ms stagger)
- Flash auto-removes after 400ms (non-intrusive)
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
9. Flash animates for 400ms then auto-removes
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

  // Auto-remove after 400ms
  setTimeout(() => {
    if (flash.parentNode) {
      flash.parentNode.removeChild(flash);
    }
  }, 400);
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
  font-size: 12px;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  pointer-events: none;
  z-index: 1000;

  /* Fade-up animation */
  animation: rcFlashFadeUp 400ms ease-out;
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
   - Verify flash displays for ~400ms then disappears

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
   - Verify flash is small (12px font)
   - Verify flash does not block snake or food visibility

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
- **Non-intrusive:** 400ms duration, small font, auto-removes
- **Achievement framing:** Transforms hard moment into recognized accomplishment

---

### 📋 FRs COVERED

FR70-FR72 (RC SURVIVED flash on successful navigation)

**Detailed FR Mapping:**
- FR70: Flash appears when player survives Reverse Controls → onFoodEaten() check
- FR71: Flash positioned below +8 popup with 200ms stagger → setTimeout + y + 20
- FR72: Flash auto-removes after 400ms → setTimeout cleanup

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
- [ ] Flash auto-removes after 400ms
- [ ] onFoodEaten() checks if reverseControlsActive = true
- [ ] If true: spawnFlash("RC SURVIVED", x, y + 20)
- [ ] If true: cognitiveStats.rcSurvived += 1
- [ ] Flash appears 200ms after +8 popup (stagger)
- [ ] Flash font: Jersey20, 12px, white
- [ ] Flash animation: fade-up and fade-out (400ms)
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

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/state.js (modified - add effects.reverseControlsActive flag)
- js/effects.js (modified - set reverseControlsActive on activation)
- js/score-popup.js (modified - implement spawnFlash)
- js/game.js (modified - check RC survival on food consumption)
- css/style.css (modified - add .rc-survived-flash class)
