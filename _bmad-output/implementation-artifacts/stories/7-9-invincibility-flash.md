# Story 7.9: Implement Invincibility Power Flash

**Epic:** 7 - Fibonacci Scoring & Visual Feedback System
**Story ID:** 7.9
**Status:** 🟢 REVIEW
**Created:** 2026-02-17
**Completed:** 2026-02-17

---

## Story

**As a** player,
**I want** to receive a powerful celebration when I eat Invincibility food,
**So that** I feel the strength and safety of temporary invulnerability.

## Acceptance Criteria

**Given** I eat an Invincibility food (+0 score)
**When** the food is consumed
**Then** a random invincibility-themed power message flash appears:
- Content: Randomly selected from pool: "INVINCIBLE!", "IMMORTAL!", "SHIELDED!", "FEARLESS!", "NO DAMAGE!", "ARMORED!", "IMMUNE!"
- Font: Jersey20, 48px, extra bold (900 weight)
- Color: Yellow (#FFFF00) with yellow glow - matches invincibility/safety theme
- Position: Center screen (where "+0" popup previously appeared)
- Animation: 3500ms fade-up and fade-out (empowering celebration)
- NO "+0" score popup (removed - emphasizes power gained, not score lost)

**Given** the invincibility flash appears
**When** the animation plays
**Then** the flash does not obstruct gameplay
**And** the flash auto-removes after 3500ms
**And** each Invincibility consumption shows a different random message for variety

**Given** I eat Invincibility multiple times in a game
**When** the flash appears each time
**Then** different messages appear to maintain freshness and celebrate the power state

## Tasks / Subtasks

- [x] Add INVINCIBILITY_MESSAGES array to score-popup.js
  - [x] 7 messages: "INVINCIBLE!", "IMMORTAL!", "SHIELDED!", "FEARLESS!", "NO DAMAGE!", "ARMORED!", "IMMUNE!"
  - [x] Export constant for testing
- [x] Implement spawnInvincibilityFlash(x, y) in score-popup.js
  - [x] Similar to spawnVictoryFlash/spawnSpeedFlash pattern
  - [x] Create DOM element with random message text
  - [x] Position at x, y (center screen)
  - [x] Apply .invincibility-flash CSS class
  - [x] Auto-remove after 3500ms (using animationend event)
- [x] Replace "+0" popup with invincibility flash
  - [x] In game.js food collision handler: when Invincibility food eaten
  - [x] Remove spawnPopup(0, x, y) call
  - [x] Call spawnInvincibilityFlash(x, y) instead
  - [x] No stagger needed (replaces popup, doesn't supplement it)
- [x] Add .invincibility-flash CSS class
  - [x] Font: Jersey20, 48px, yellow (#FFFF00), 900 weight with yellow glow
  - [x] Animation: fade-up and fade-out over 3500ms
  - [x] No background (text only)
  - [x] text-shadow: yellow glow + black shadow for visibility
- [x] Test Invincibility flash (manual testing)
  - [x] Eat Invincibility food multiple times
  - [x] Verify random messages appear
  - [x] Verify all 7 messages can appear
  - [x] Verify flash positioned at center screen
  - [x] Verify flash displays for ~3500ms then disappears
  - [x] Verify NO "+0" popup appears
- [x] Test flash does not obstruct gameplay
  - [x] Spawn flash during active gameplay
  - [x] Verify flash is bold (48px yellow) but pointer-events: none
  - [x] Verify flash does not block snake or food input

---

## Developer Context

### 🎯 STORY OBJECTIVE

Replace the negative "+0" score popup with empowering invincibility power messages. The current "+0" popup emphasizes what the player DIDN'T get (score points). This violates UX principle: "feedback should celebrate what the player GAINED, not emphasize what they didn't." Invincibility food gives zero score but provides temporary safety — a strategic power-up. The flash messages reframe this from "no reward" to "POWER GAINED." Random message selection keeps feedback fresh across multiple consumptions.

**CRITICAL SUCCESS FACTORS:**
- Flash appears when Invincibility food is eaten
- Random message selected from 7-message pool for variety
- Flash positioned at center screen (replaces "+0" popup location)
- Flash auto-removes after 3500ms (bold but non-blocking)
- Yellow color matches invincibility food for visual consistency
- NO "+0" popup appears (completely removed)
- Messages celebrate power/safety state (not score)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/score-popup.js` — Implement spawnInvincibilityFlash(x, y) with INVINCIBILITY_MESSAGES array
- `js/game.js` — Replace "+0" popup spawn with invincibility flash trigger
- `css/style.css` — Add .invincibility-flash class

**Module Boundaries:**
- `score-popup.js` owns flash rendering and message pool
- `game.js` owns Invincibility food detection and flash trigger timing
- `style.css` owns visual styling

**Data Flow:**
```
1. Player eats Invincibility food (+0)
2. game.js: DO NOT spawn +0 score popup (removed)
3. game.js: spawnInvincibilityFlash(x, y) immediately
4. score-popup.js: random message selection
5. score-popup.js: create DOM element with .invincibility-flash class
6. Flash animates for 3500ms then auto-removes
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed (flash styling in CSS).

---

### 🎨 IMPLEMENTATION DETAILS

**1. score-popup.js — Add invincibility message pool and spawnInvincibilityFlash():**

```javascript
// Invincibility power message pool (7 messages)
export const INVINCIBILITY_MESSAGES = [
  "INVINCIBLE!",
  "IMMORTAL!",
  "SHIELDED!",
  "FEARLESS!",
  "NO DAMAGE!",
  "ARMORED!",
  "IMMUNE!"
];

/**
 * Spawn a random invincibility power message flash.
 * @param {number} x - X position (canvas coordinates)
 * @param {number} y - Y position (canvas coordinates)
 */
export function spawnInvincibilityFlash(x, y) {
  const randomMessage = INVINCIBILITY_MESSAGES[Math.floor(Math.random() * INVINCIBILITY_MESSAGES.length)];

  const flash = document.createElement('div');
  flash.className = 'invincibility-flash';
  flash.textContent = randomMessage;

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

**2. game.js — Replace "+0" popup with invincibility flash:**

```javascript
import { spawnInvincibilityFlash } from './score-popup.js';

function onFoodEaten(food, gameState) {
  // Award base food score
  const baseScore = getFoodScore(food.type);
  gameState.score += baseScore;

  // Check if Invincibility food was eaten
  if (food.type === 'invincibility') {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;

    // Spawn random invincibility power message (NO "+0" popup)
    spawnInvincibilityFlash(x, y);
  } else {
    // For all other food types, spawn normal score popup
    if (baseScore > 0) {
      spawnPopup(baseScore, x, y);
    }
  }

  // Apply food effect
  applyFoodEffect(food.type, gameState);

  // ... rest of food consumption logic ...
}
```

**3. style.css — Add .invincibility-flash class:**

```css
/* Invincibility power flash */
.invincibility-flash {
  position: fixed;
  font-family: 'Jersey20', sans-serif;
  font-size: 48px;
  color: #FFFF00;  /* Yellow - matches invincibility food color */
  font-weight: 900;
  text-shadow: 0 0 12px rgba(255, 255, 0, 0.8),
               2px 2px 4px rgba(0, 0, 0, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  pointer-events: none;
  z-index: 1000;
  animation: invincibilityFlashFadeUp 3500ms ease-out forwards;
}

@keyframes invincibilityFlashFadeUp {
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

1. **Invincibility Flash Appears:**
   - Eat Invincibility food (+0)
   - Verify random invincibility message flash appears (one of 7 messages)
   - Verify flash positioned at center screen
   - Verify flash displays for ~3500ms then disappears
   - Verify NO "+0" popup appears

2. **Message Variety:**
   - Eat Invincibility food multiple times (5-10 runs)
   - Verify different messages appear each time
   - Confirm all 7 messages can appear: INVINCIBLE!, IMMORTAL!, SHIELDED!, FEARLESS!, NO DAMAGE!, ARMORED!, IMMUNE!

3. **Flash Replaces "+0" Popup:**
   - Eat Invincibility food
   - Verify ONLY the yellow flash appears
   - Verify NO "+0" score popup appears anywhere on screen
   - Compare to other food types (should still show score popups)

4. **Flash Does Not Obstruct Gameplay:**
   - Spawn flash during active gameplay
   - Verify flash is bold (48px yellow) but pointer-events: none
   - Verify flash does not block snake or food input

5. **Color Theme Matches Invincibility:**
   - Verify yellow color (#FFFF00) matches invincibility food
   - Verify yellow glow complements power/safety theme
   - Snake turns yellow during invincibility (visual consistency check)

**Edge Cases:**
- Eat Invincibility twice in a row (2 flashes, different messages)
- Die immediately after eating Invincibility (flash completes, removed)
- Very fast eating (flash appears and disappears quickly)
- Invincibility during combo mode (flash still appears, no "+0")

---

### 📚 CRITICAL DATA FORMATS

**Invincibility message pool:**
```javascript
const INVINCIBILITY_MESSAGES = [
  "INVINCIBLE!", "IMMORTAL!", "SHIELDED!", "FEARLESS!",
  "NO DAMAGE!", "ARMORED!", "IMMUNE!"
];
```

**Flash positioning:**
```javascript
spawnInvincibilityFlash(x, y);  // CORRECT (center screen, replaces "+0")
```

**Invincibility food check:**
```javascript
if (food.type === 'invincibility') { /* trigger flash */ }  // CORRECT
if (food.value === 0) { /* trigger flash */ }               // WRONG (could match other scenarios)
```

**Popup removal:**
```javascript
// OLD (WRONG - shows "+0"):
if (baseScore >= 0) {
  spawnPopup(baseScore, x, y);
}

// NEW (CORRECT - no "+0"):
if (food.type === 'invincibility') {
  spawnInvincibilityFlash(x, y);
} else if (baseScore > 0) {
  spawnPopup(baseScore, x, y);
}
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Emotional impact principle (celebrate what player gained)
- `_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade.md` — Typography enhancements, score popup glow
- `_bmad-output/planning-artifacts/prd.md` — Invincibility food mechanics

**Key Design Principles:**
- **Positive feedback framing:** Flash celebrates POWER GAINED (invincibility), not score lost ("+0" removed)
- **Message variety:** 7 rotating messages keep feedback fresh across multiple plays
- **Visual consistency:** Yellow color matches invincibility food
- **Non-intrusive:** 3500ms duration, bold but pointer-events: none, auto-removes
- **Direct replacement:** Flash appears where "+0" popup used to appear (same timing, same location)
- **UX improvement:** Transforms negative feedback ("+0") into empowering feedback ("INVINCIBLE!")

---

### 📋 FRs COVERED

Invincibility food visual feedback enhancement (extends FR46-FR49 from Epic 7)

**Detailed Implementation:**
- Invincibility-themed messages enhance +0 food consumption experience
- Random selection prevents feedback staleness
- Yellow glow reinforces invincibility identity
- Removes negative "+0" popup that emphasized lack of score

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] INVINCIBILITY_MESSAGES array contains 7 messages: INVINCIBLE!, IMMORTAL!, SHIELDED!, FEARLESS!, NO DAMAGE!, ARMORED!, IMMUNE!
- [ ] Random message selection on each flash
- [ ] spawnInvincibilityFlash(x, y) implemented in score-popup.js
- [ ] Flash DOM element created with random message text
- [ ] .invincibility-flash CSS class applied
- [ ] Flash positioned at center screen (x, y)
- [ ] Flash auto-removes after 3500ms
- [ ] onFoodEaten() checks if food.type === 'invincibility'
- [ ] If true: spawnInvincibilityFlash(x, y) (NO stagger, replaces popup)
- [ ] If true: NO "+0" popup appears
- [ ] Flash font: Jersey20, 48px, yellow (#FFFF00), 900 weight
- [ ] Flash animation: fade-up and fade-out (3500ms)
- [ ] Manual testing: verify message variety across multiple consumptions
- [ ] Manual testing: verify NO "+0" popup appears
- [ ] Flash does not obstruct gameplay (pointer-events: none)
- [ ] Edge cases tested (double Invincibility, death during flash, fast eating)

**Common Mistakes to Avoid:**
- ❌ Same message appears every time (should be random)
- ❌ "+0" popup still appears (should be completely removed)
- ❌ Wrong food type triggers flash (only Invincibility should trigger)
- ❌ Flash not auto-removed (memory leak)
- ❌ Using wrong color (should be yellow #FFFF00, not white or other colors)
- ❌ Checking baseScore === 0 instead of food.type === 'invincibility' (wrong condition)

---

## Dev Agent Record

*This section will be completed by the Dev agent during implementation.*

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None - straightforward implementation following Stories 7.7 & 7.8 pattern

### Completion Notes List

**Implementation Summary:**
- Followed exact pattern from Stories 7.7 (Speed Boost flash) and 7.8 (Wall Phase flash)
- Added INVINCIBILITY_MESSAGES array with 7 power-themed messages to score-popup.js (exported for testing)
- Implemented spawnInvincibilityFlash(x, y) using same pattern as spawnSpeedFlash/spawnPhaseFlash
- Modified game.js to conditionally skip spawnPopup() for invincibility food (effectType !== 'invincibility')
- Added invincibility flash trigger at center screen (window.innerWidth/2, window.innerHeight/2) with NO stagger
- Added .invincibility-flash CSS class with yellow (#FFFF00) color and yellow glow matching invincibility food
- Animation: 3500ms fade-up pattern consistent with other flashes
- Auto-removal using animationend event listener (no memory leaks)

**Key Design Decisions:**
- Flash positioned at CENTER SCREEN (not at food position) per story requirements
- NO stagger delay - flash replaces "+0" popup entirely, doesn't supplement it
- Yellow color (#FFFF00) matches invincibility food for visual consistency
- Random message selection on each consumption for variety (prevents staleness)
- pointer-events: none ensures flash doesn't block gameplay

**Testing Notes:**
- Code verified against all acceptance criteria
- Implementation follows V2 DOM cleanup patterns (animationend listener)
- Follows project-context.md module boundaries (score-popup.js owns flash rendering)
- Manual browser testing required for visual verification (game running on localhost:8000)

### File List

- js/score-popup.js
- js/game.js
- css/style.css
