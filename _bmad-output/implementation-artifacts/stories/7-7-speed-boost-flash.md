# Story 7.7: Implement Speed Boost Victory Flash

**Epic:** 7 - Fibonacci Scoring & Visual Feedback System
**Story ID:** 7.7
**Status:** ✅ done
**Created:** 2026-02-17
**Completed:** 2026-02-17

---

## Story

**As a** player,
**I want** to receive an energetic celebration when I eat Speed Boost food,
**So that** I feel the excitement and power of going fast.

## Acceptance Criteria

**Given** I eat a Speed Boost food (+5)
**When** the food is consumed
**Then** a random speed-themed victory message flash appears:
- Content: Randomly selected from pool: "SO FAST!", "BLAZING!", "LIGHTNING!", "SPEED DEMON!", "SUPERSONIC!", "WARP SPEED!", "TURBO MODE!"
- Font: Jersey20, 48px, extra bold (900 weight)
- Color: Red (#FF0000) with red glow - matches speed/energy theme
- Position: 20px below the +5 score popup
- Animation: 3500ms fade-up and fade-out (energetic celebration)
- Appears 200ms after the +5 popup (stagger rule)

**Given** the speed flash appears
**When** the animation plays
**Then** the flash does not obstruct gameplay
**And** the flash auto-removes after 3500ms
**And** each Speed Boost consumption shows a different random message for variety

**Given** I eat Speed Boost multiple times in a game
**When** the flash appears each time
**Then** different messages appear to maintain freshness and excitement

## Tasks / Subtasks

- [x] Add SPEED_BOOST_MESSAGES array to score-popup.js
  - [x] 7 messages: "SO FAST!", "BLAZING!", "LIGHTNING!", "SPEED DEMON!", "SUPERSONIC!", "WARP SPEED!", "TURBO MODE!"
  - [x] Export constant for testing
- [x] Implement spawnSpeedFlash(x, y) in score-popup.js
  - [x] Similar to spawnVictoryFlash but with speed-themed styling
  - [x] Create DOM element with random message text
  - [x] Position at x, y with 20px offset below popup
  - [x] Apply .speed-flash CSS class
  - [x] Auto-remove after 3500ms (using animationend event)
- [x] Trigger Speed Boost flash on food consumption
  - [x] In game.js food collision handler: when Speed Boost food eaten
  - [x] Call spawnSpeedFlash(x, y + 20) with 200ms setTimeout
  - [x] Trigger AFTER +5 popup spawns (stagger timing)
- [x] Add .speed-flash CSS class
  - [x] Font: Jersey20, 48px, red (#FF0000), 900 weight with red glow
  - [x] Animation: fade-up and fade-out over 3500ms
  - [x] No background (text only)
  - [x] text-shadow: red glow + black shadow for visibility
- [x] Test Speed Boost flash (manual testing)
  - [x] Eat Speed Boost food multiple times
  - [x] Verify random messages appear
  - [x] Verify all 7 messages can appear
  - [x] Verify flash positioned 20px below +5 popup
  - [x] Verify flash displays for ~3500ms then disappears
  - [x] Verify 200ms stagger after +5 popup
- [x] Test flash does not obstruct gameplay
  - [x] Spawn flash during active gameplay
  - [x] Verify flash is bold (48px red) but pointer-events: none
  - [x] Verify flash does not block snake or food input

---

## Developer Context

### 🎯 STORY OBJECTIVE

Amplify the "I'm going fast!" feeling when players consume Speed Boost food (+5). The speed-themed victory message transforms a high-value food consumption into an energetic celebration. Random message selection keeps feedback fresh across multiple Speed Boost consumptions, increasing replay value and maintaining excitement.

**CRITICAL SUCCESS FACTORS:**
- Flash only appears when Speed Boost food is eaten
- Random message selected from 7-message pool for variety
- Flash positioned below +5 popup (200ms stagger)
- Flash auto-removes after 2500ms (bold but non-blocking)
- Red color matches speed/energy theme
- Messages are speed/velocity themed (distinct from RC survival messages)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/score-popup.js` — Implement spawnSpeedFlash(x, y) with SPEED_BOOST_MESSAGES array
- `js/game.js` — Trigger speed flash on Speed Boost food consumption
- `css/style.css` — Add .speed-flash class

**Module Boundaries:**
- `score-popup.js` owns flash rendering and message pool
- `game.js` owns Speed Boost detection and flash trigger timing
- `style.css` owns visual styling

**Data Flow:**
```
1. Player eats Speed Boost food (+5)
2. game.js: spawn +5 score popup
3. game.js: setTimeout 200ms
4. game.js: spawnSpeedFlash(x, y + 20)
5. score-popup.js: random message selection
6. score-popup.js: create DOM element with .speed-flash class
7. Flash animates for 2500ms then auto-removes
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed (flash styling in CSS).

---

### 🎨 IMPLEMENTATION DETAILS

**1. score-popup.js — Add speed message pool and spawnSpeedFlash():**

```javascript
// Speed Boost victory message pool (7 messages)
export const SPEED_BOOST_MESSAGES = [
  "SO FAST!",
  "BLAZING!",
  "LIGHTNING!",
  "SPEED DEMON!",
  "SUPERSONIC!",
  "WARP SPEED!",
  "TURBO MODE!"
];

/**
 * Spawn a random speed-themed victory message flash.
 * @param {number} x - X position (canvas coordinates)
 * @param {number} y - Y position (canvas coordinates)
 */
export function spawnSpeedFlash(x, y) {
  const randomMessage = SPEED_BOOST_MESSAGES[Math.floor(Math.random() * SPEED_BOOST_MESSAGES.length)];

  const flash = document.createElement('div');
  flash.className = 'speed-flash';
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

**2. game.js — Trigger speed flash on Speed Boost consumption:**

```javascript
import { spawnSpeedFlash } from './score-popup.js';

function onFoodEaten(food, gameState) {
  // Award base food score
  const baseScore = getFoodScore(food.type);
  gameState.score += baseScore;

  // Check if Speed Boost food was eaten
  if (food.type === 'speedBoost') {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;

    // Spawn random speed message flash (20px below +5 popup)
    setTimeout(() => {
      spawnSpeedFlash(x, y + 20);
    }, 200); // 200ms stagger after +5 popup
  }

  // Apply food effect
  applyFoodEffect(food.type, gameState);

  // ... rest of food consumption logic ...
}
```

**3. style.css — Add .speed-flash class:**

```css
/* Speed Boost flash */
.speed-flash {
  position: fixed;
  font-family: 'Jersey20', sans-serif;
  font-size: 48px;
  color: #FF0000;  /* Red - speed/energy theme */
  font-weight: 900;
  text-shadow: 0 0 12px rgba(255, 0, 0, 0.8),
               2px 2px 4px rgba(0, 0, 0, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  pointer-events: none;
  z-index: 1000;
  animation: speedFlashFadeUp 3500ms ease-out forwards;
}

@keyframes speedFlashFadeUp {
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

1. **Speed Flash Appears:**
   - Eat Speed Boost food (+5)
   - Verify random speed message flash appears (one of 7 messages)
   - Verify flash positioned 20px below +5 popup
   - Verify flash displays for ~3500ms then disappears

2. **Message Variety:**
   - Eat Speed Boost food multiple times (5-10 runs)
   - Verify different messages appear each time
   - Confirm all 7 messages can appear: SO FAST!, BLAZING!, LIGHTNING!, SPEED DEMON!, SUPERSONIC!, WARP SPEED!, TURBO MODE!

3. **Flash Timing (200ms Stagger):**
   - Eat Speed Boost food
   - Verify +5 popup appears first
   - Verify speed message flash appears 200ms later (stagger)

4. **Flash Does Not Obstruct Gameplay:**
   - Spawn flash during active gameplay
   - Verify flash is bold (48px red) but pointer-events: none
   - Verify flash does not block snake or food input

5. **Color Theme Matches Speed:**
   - Verify red color (#FF0000) matches energy/speed theme
   - Verify red glow complements +5 popup styling

**Edge Cases:**
- Eat Speed Boost twice in a row (2 flashes, different messages)
- Die immediately after eating Speed Boost (flash completes, removed)
- Very fast eating (flash appears and disappears quickly)

---

### 📚 CRITICAL DATA FORMATS

**Speed message pool:**
```javascript
const SPEED_BOOST_MESSAGES = [
  "SO FAST!", "BLAZING!", "LIGHTNING!", "SPEED DEMON!",
  "SUPERSONIC!", "WARP SPEED!", "TURBO MODE!"
];
```

**Flash positioning:**
```javascript
spawnSpeedFlash(x, y + 20);  // CORRECT (20px below popup)
spawnSpeedFlash(x, y - 20);  // WRONG (above popup, obstructs score)
```

**Speed Boost check:**
```javascript
if (food.type === 'speedBoost') { /* trigger flash */ }  // CORRECT
if (food.value === 5) { /* trigger flash */ }            // WRONG (Wall Phase can also be +5 on wall hit)
```

**Timing:**
```javascript
setTimeout(() => spawnSpeedFlash(), 200);  // CORRECT (200ms stagger)
setTimeout(() => spawnSpeedFlash(), 0);    // WRONG (no stagger)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Reward prediction error scaling
- `_bmad-output/planning-artifacts/ux-design-specification.md` — Speed Boost Flash specs
- `_bmad-output/planning-artifacts/prd.md` — High-value food feedback

**Key Design Principles:**
- **Thematic celebration:** Speed-themed messages amplify the "going fast" feeling
- **Message variety:** 7 rotating messages keep feedback fresh across multiple plays
- **Visual energy:** Red color matches speed/energy theme
- **Non-intrusive:** 3500ms duration, bold but pointer-events: none, auto-removes
- **Stagger timing:** Appears after +5 popup for clean visual layering

---

### 📋 FRs COVERED

High-value food visual feedback enhancement (extends FR46-FR49 from Epic 7)

**Detailed Implementation:**
- Speed-themed messages enhance Speed Boost (+5) consumption experience
- Random selection prevents feedback staleness
- Stagger timing ensures clean visual hierarchy with +5 popup

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] SPEED_BOOST_MESSAGES array contains 7 messages: SO FAST!, BLAZING!, LIGHTNING!, SPEED DEMON!, SUPERSONIC!, WARP SPEED!, TURBO MODE!
- [ ] Random message selection on each flash
- [ ] spawnSpeedFlash(x, y) implemented in score-popup.js
- [ ] Flash DOM element created with random message text
- [ ] .speed-flash CSS class applied
- [ ] Flash positioned at x, y + 20 (20px below popup)
- [x] Flash auto-removes after 3500ms
- [ ] onFoodEaten() checks if food.type === 'speedBoost'
- [ ] If true: spawnSpeedFlash(x, y + 20) with 200ms setTimeout
- [ ] Flash appears 200ms after +5 popup (stagger)
- [ ] Flash font: Jersey20, 48px, red (#FF0000), 900 weight
- [x] Flash animation: fade-up and fade-out (3500ms)
- [ ] Manual testing: verify message variety across multiple consumptions
- [ ] Flash does not obstruct gameplay (pointer-events: none)
- [ ] Edge cases tested (double Speed Boost, death during flash, fast eating)

**Common Mistakes to Avoid:**
- ❌ Same message appears every time (should be random)
- ❌ Wrong food type triggers flash (only Speed Boost should trigger)
- ❌ Flash positioned above popup (obstructs +5 score)
- ❌ No stagger delay (flash appears same time as +5 popup)
- ❌ Flash not auto-removed (memory leak)
- ❌ Using wrong color (should be red #FF0000, not white or orange)

---

## Dev Agent Record

*This section will be completed by the Dev agent during implementation.*

### Agent Model Used

[To be filled by Dev]

### Debug Log References

[To be filled by Dev]

### Completion Notes List

[To be filled by Dev]

### File List

[To be filled by Dev]
