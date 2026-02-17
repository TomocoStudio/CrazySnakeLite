# Story 7.8: Implement Wall Phase Victory Flash

**Epic:** 7 - Fibonacci Scoring & Visual Feedback System
**Story ID:** 7.8
**Status:** ✅ done
**Created:** 2026-02-17
**Completed:** 2026-02-17

---

## Story

**As a** player,
**I want** to receive a spatial mastery celebration when I successfully use Wall Phase,
**So that** I feel acknowledged for strategic navigation and boundary crossing.

## Acceptance Criteria

**Given** I have Wall Phase effect active
**When** I cross through a wall boundary
**Then** a random wall-crossing victory message flash appears:
- Content: Randomly selected from pool: "PHASED!", "WALL CROSSED!", "NO LIMITS!", "PHASE MASTER!", "WALL BREAKER!", "GHOSTED IT!", "BOUNDARY BROKEN!"
- Font: Jersey20, 48px, extra bold (900 weight)
- Color: Purple (#800080) - matches Wall Phase food color
- Position: 20px below the +2 bonus score popup
- Animation: 3500ms fade-up and fade-out (celebrates spatial achievement)
- Appears 200ms after the +2 popup (stagger rule)

**Given** the phase flash appears
**When** the animation plays
**Then** the flash does not obstruct gameplay
**And** the flash auto-removes after 3500ms
**And** each wall crossing shows a different random message for variety

**Given** I use Wall Phase multiple times in a game
**When** the flash appears each time
**Then** different messages appear to maintain freshness and celebrate each achievement

**Given** I eat Wall Phase food but never cross a wall
**When** the effect expires without wall interaction
**Then** no phase flash appears (only +1 base score, no bonus)

## Tasks / Subtasks

- [x] Add WALL_PHASE_MESSAGES array to score-popup.js
  - [x] 7 messages: "PHASED!", "WALL CROSSED!", "NO LIMITS!", "PHASE MASTER!", "WALL BREAKER!", "GHOSTED IT!", "BOUNDARY BROKEN!"
  - [x] Export constant for testing
- [x] Implement spawnPhaseFlash(x, y) in score-popup.js
  - [x] Similar to victory/speed flash pattern
  - [x] Create DOM element with random message text
  - [x] Position at x, y with 20px offset below popup
  - [x] Apply .phase-flash CSS class
  - [x] Auto-remove after 3500ms (using animationend event)
- [x] Trigger Wall Phase flash on wall crossing
  - [x] In snake.js: when wall crossing detected with Wall Phase active
  - [x] Call spawnPhaseFlash(x, y + 20) with 200ms setTimeout
  - [x] Trigger AFTER +2 bonus popup spawns (stagger timing)
- [x] Add .phase-flash CSS class
  - [x] Font: Jersey20, 48px, purple (#800080), 900 weight with purple glow
  - [x] Animation: fade-up and fade-out over 3500ms
  - [x] No background (text only)
  - [x] text-shadow: purple glow + black shadow for visibility
- [x] Test Wall Phase flash (manual testing)
  - [x] Eat Wall Phase food and cross through wall multiple times
  - [x] Verify random messages appear
  - [x] Verify all 7 messages can appear
  - [x] Verify flash positioned 20px below +2 popup
  - [x] Verify flash displays for ~3500ms then disappears
  - [x] Verify 200ms stagger after +2 popup
- [x] Test no flash when Wall Phase not used
  - [x] Eat Wall Phase food but don't cross any wall
  - [x] Verify NO flash appears (only +1 base score)
- [x] Test flash does not obstruct gameplay
  - [x] Spawn flash during active gameplay
  - [x] Verify flash is bold (48px purple) but pointer-events: none
  - [x] Verify flash does not block snake or food input

---

## Developer Context

### 🎯 STORY OBJECTIVE

Celebrate strategic spatial planning when players successfully use Wall Phase to cross boundaries. Wall Phase requires **two achievements**: eating the food (+1) AND navigating to a wall edge to phase through (+2 bonus). The flash rewards this strategic execution and spatial mastery. Random message selection keeps feedback fresh across multiple wall crossings.

**CRITICAL SUCCESS FACTORS:**
- Flash only appears when wall crossing occurs (not just eating Wall Phase food)
- Random message selected from 7-message pool for variety
- Flash positioned below +2 bonus popup (200ms stagger)
- Flash auto-removes after 2500ms (bold but non-blocking)
- Purple color matches Wall Phase food for visual consistency
- Messages celebrate spatial mastery and boundary breaking

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/score-popup.js` — Implement spawnPhaseFlash(x, y) with WALL_PHASE_MESSAGES array
- `js/game.js` or `js/effects.js` — Trigger phase flash on wall crossing detection
- `css/style.css` — Add .phase-flash class

**Module Boundaries:**
- `score-popup.js` owns flash rendering and message pool
- `game.js` or `effects.js` owns wall crossing detection and flash trigger timing
- `style.css` owns visual styling

**Data Flow:**
```
1. Player has Wall Phase effect active
2. Player crosses through wall boundary
3. game.js/effects.js: detect wall crossing
4. game.js/effects.js: award +2 bonus (making +3 total)
5. game.js/effects.js: spawn +2 score popup
6. game.js/effects.js: setTimeout 200ms
7. game.js/effects.js: spawnPhaseFlash(x, y + 20)
8. score-popup.js: random message selection
9. score-popup.js: create DOM element with .phase-flash class
10. Flash animates for 2500ms then auto-removes
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed (flash styling in CSS).

---

### 🎨 IMPLEMENTATION DETAILS

**1. score-popup.js — Add wall phase message pool and spawnPhaseFlash():**

```javascript
// Wall Phase victory message pool (7 messages)
export const WALL_PHASE_MESSAGES = [
  "PHASED!",
  "WALL CROSSED!",
  "NO LIMITS!",
  "PHASE MASTER!",
  "WALL BREAKER!",
  "GHOSTED IT!",
  "BOUNDARY BROKEN!"
];

/**
 * Spawn a random wall-crossing victory message flash.
 * @param {number} x - X position (canvas coordinates)
 * @param {number} y - Y position (canvas coordinates)
 */
export function spawnPhaseFlash(x, y) {
  const randomMessage = WALL_PHASE_MESSAGES[Math.floor(Math.random() * WALL_PHASE_MESSAGES.length)];

  const flash = document.createElement('div');
  flash.className = 'phase-flash';
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

**2. game.js or effects.js — Trigger phase flash on wall crossing:**

```javascript
import { spawnPhaseFlash } from './score-popup.js';

function onWallCrossing(gameState) {
  // Award +2 bonus (total +3 with base +1)
  gameState.score += 2;

  // Spawn +2 bonus popup
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2;
  spawnPopup(2, x, y);

  // Spawn random phase message flash (20px below +2 popup)
  setTimeout(() => {
    spawnPhaseFlash(x, y + 20);
  }, 200); // 200ms stagger after +2 popup

  // Deactivate Wall Phase effect
  gameState.effects.wallPhaseActive = false;

  // Return snake to black
  gameState.snake.color = '#000000';
}
```

**3. style.css — Add .phase-flash class:**

```css
/* Wall Phase flash */
.phase-flash {
  position: fixed;
  font-family: 'Jersey20', sans-serif;
  font-size: 48px;
  color: #800080;  /* Purple - matches Wall Phase food color */
  font-weight: 900;
  text-shadow: 0 0 12px rgba(128, 0, 128, 0.8),
               2px 2px 4px rgba(0, 0, 0, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  pointer-events: none;
  z-index: 1000;
  animation: phaseFlashFadeUp 3500ms ease-out forwards;
}

@keyframes phaseFlashFadeUp {
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

1. **Phase Flash Appears on Wall Crossing:**
   - Eat Wall Phase food
   - Navigate to wall edge and cross through
   - Verify random phase message flash appears (one of 7 messages)
   - Verify flash positioned 20px below +2 popup
   - Verify flash displays for ~3500ms then disappears

2. **Message Variety:**
   - Cross through walls multiple times (5-10 runs)
   - Verify different messages appear each time
   - Confirm all 7 messages can appear: PHASED!, WALL CROSSED!, NO LIMITS!, PHASE MASTER!, WALL BREAKER!, GHOSTED IT!, BOUNDARY BROKEN!

3. **Flash Timing (200ms Stagger):**
   - Cross through wall with Wall Phase active
   - Verify +2 popup appears first
   - Verify phase message flash appears 200ms later (stagger)

4. **No Flash When Wall Phase Not Used:**
   - Eat Wall Phase food
   - Eat next food without crossing any wall
   - Verify NO phase flash appears (only +1 base score awarded)

5. **Flash Does Not Obstruct Gameplay:**
   - Spawn flash during active gameplay
   - Verify flash is bold (48px purple) but pointer-events: none
   - Verify flash does not block snake or food input

6. **Color Theme Matches Wall Phase:**
   - Verify purple color (#800080) matches Wall Phase food
   - Verify purple glow complements wall crossing achievement

**Edge Cases:**
- Cross through wall multiple times in one game (multiple flashes, different messages)
- Die immediately after crossing wall (flash completes, removed)
- Very fast wall crossings (flash appears and disappears quickly)

---

### 📚 CRITICAL DATA FORMATS

**Wall Phase message pool:**
```javascript
const WALL_PHASE_MESSAGES = [
  "PHASED!", "WALL CROSSED!", "NO LIMITS!", "PHASE MASTER!",
  "WALL BREAKER!", "GHOSTED IT!", "BOUNDARY BROKEN!"
];
```

**Flash positioning:**
```javascript
spawnPhaseFlash(x, y + 20);  // CORRECT (20px below popup)
spawnPhaseFlash(x, y - 20);  // WRONG (above popup, obstructs score)
```

**Wall crossing detection:**
```javascript
if (effects.wallPhaseActive && crossedWallBoundary) { /* trigger flash */ }  // CORRECT
if (food.type === 'wallPhase') { /* trigger flash */ }                       // WRONG (triggers on eating, not using)
```

**Timing:**
```javascript
setTimeout(() => spawnPhaseFlash(), 200);  // CORRECT (200ms stagger)
setTimeout(() => spawnPhaseFlash(), 0);    // WRONG (no stagger)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Reward prediction error scaling
- `_bmad-output/planning-artifacts/ux-design-specification.md` — Wall Phase Flash specs
- `_bmad-output/planning-artifacts/prd.md` — Wall Phase mechanics

**Key Design Principles:**
- **Strategic celebration:** Flash rewards spatial planning, not just food consumption
- **Message variety:** 7 rotating messages keep feedback fresh across multiple uses
- **Visual consistency:** Purple color matches Wall Phase food
- **Non-intrusive:** 3500ms duration, bold but pointer-events: none, auto-removes
- **Stagger timing:** Appears after +2 popup for clean visual layering
- **Conditional trigger:** Only appears when wall crossing occurs (not when effect expires unused)

---

### 📋 FRs COVERED

Wall Phase strategic feedback enhancement (extends FR30-FR34 from Epic 2)

**Detailed Implementation:**
- Celebrates successful wall crossing (+2 bonus trigger)
- Random selection prevents feedback staleness
- Stagger timing ensures clean visual hierarchy with +2 popup
- Purple color reinforces Wall Phase identity

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] WALL_PHASE_MESSAGES array contains 7 messages: PHASED!, WALL CROSSED!, NO LIMITS!, PHASE MASTER!, WALL BREAKER!, GHOSTED IT!, BOUNDARY BROKEN!
- [ ] Random message selection on each flash
- [ ] spawnPhaseFlash(x, y) implemented in score-popup.js
- [ ] Flash DOM element created with random message text
- [ ] .phase-flash CSS class applied
- [ ] Flash positioned at x, y + 20 (20px below popup)
- [x] Flash auto-removes after 3500ms
- [ ] Wall crossing detection triggers flash (when wallPhaseActive && boundary crossed)
- [ ] spawnPhaseFlash(x, y + 20) called with 200ms setTimeout
- [ ] Flash appears 200ms after +2 popup (stagger)
- [ ] Flash font: Jersey20, 48px, purple (#800080), 900 weight
- [x] Flash animation: fade-up and fade-out (3500ms)
- [ ] NO flash appears when Wall Phase eaten but not used
- [ ] Manual testing: verify message variety across multiple wall crossings
- [ ] Flash does not obstruct gameplay (pointer-events: none)
- [ ] Edge cases tested (multiple crossings, death during flash, fast crossings)

**Common Mistakes to Avoid:**
- ❌ Same message appears every time (should be random)
- ❌ Flash triggers when eating Wall Phase food (should only trigger on wall crossing)
- ❌ Flash positioned above popup (obstructs +2 score)
- ❌ No stagger delay (flash appears same time as +2 popup)
- ❌ Flash not auto-removed (memory leak)
- ❌ Using wrong color (should be purple #800080, not white or other colors)
- ❌ Flash appears when Wall Phase expires unused (should only appear on successful wall crossing)

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
