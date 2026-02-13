# Story 9.3: Implement Variable Pick Up Timer (1-3s with Countdown Bar)

**Epic:** 9 - Phone Calls v2 — Pick Up vs End
**Story ID:** 9.3
**Status:** ✅ done
**Created:** 2026-02-08
**Completed:** 2026-02-13

---

## Story

**As a** player,
**I want** Pick Up to last an unpredictable duration,
**So that** I cannot optimize the mechanic and must adapt each time.

## Acceptance Criteria

**Given** I press Pick Up
**When** the button is activated
**Then** both buttons hide immediately
**And** a countdown bar appears in their place
**And** the bar displays at 100% width (green to gold gradient)

**Given** the countdown bar appears
**When** time progresses
**Then** the bar shrinks linearly from 100% to 0%
**And** the shrink duration is random between 1000ms and 3000ms

**Given** the countdown bar is active
**When** the game runs underneath
**Then** the canvas remains blurred (4px)
**And** the snake continues moving at normal speed
**And** I cannot see the game board clearly

**Given** the countdown bar reaches 0%
**When** the timer expires
**Then** the phone overlay dismisses automatically
**And** the Fibonacci bonus is awarded
**And** a score popup appears: "+N CALL BONUS" (gold text)
**And** the canvas blur removes smoothly (200ms transition)

**Given** I die during an active Pick Up timer
**When** death triggers
**Then** the countdown bar stops
**And** the Fibonacci bonus is STILL awarded (consolation reward)
**And** the death state proceeds normally

**Given** I press Pick Up
**When** the action is committed
**Then** I cannot End the call anymore (irreversible decision)
**And** the End button does not reappear

## Tasks / Subtasks

- [x] Add phoneCall.pickedUp and phoneCall.pickUpEndTime to state.js
  - [x] pickedUp: boolean (false by default) - Already added in Story 9.2
  - [x] pickUpEndTime: timestamp (null by default) - Already added in Story 9.2
- [x] Create countdown bar HTML element
  - [x] Add #phone-countdown-bar to index.html
  - [x] Hidden by default, shown when Pick Up activated
- [x] Implement pickUpCall() in phone.js
  - [x] Hide both buttons
  - [x] Show countdown bar at 100% width
  - [x] Calculate random duration: 1000 + Math.random() * 2000
  - [x] Set pickUpEndTime = Date.now() + duration
  - [x] Set pickedUp = true
  - [x] Store pickUpBonus (effect-based from Story 9.2)
- [x] Animate countdown bar shrink
  - [x] Use CSS transition with calculated duration
  - [x] Width shrinks from 100% to 0% linearly
- [x] Check timer expiration in game loop (game.js)
  - [x] If pickedUp && Date.now() >= pickUpEndTime
  - [x] Award pickUpBonus
  - [x] Increment pickUpCount
  - [x] Spawn phone bonus popup with 'CALL BONUS' label
  - [x] Dismiss phone overlay
  - [x] Remove canvas blur (200ms smooth transition)
- [x] Handle death during Pick Up
  - [x] If pickedUp = true when death triggers
  - [x] Award pickUpBonus (consolation reward)
  - [x] Increment pickUpCount
  - [x] Dismiss phone overlay
  - [x] Proceed to death state
- [x] Test variable duration
  - [x] Pick Up multiple times
  - [x] Verify durations vary between 1s and 3s (random)
  - [x] Verify countdown bar shrinks at different speeds

---

## Developer Context

### 🎯 STORY OBJECTIVE

Implement the core risk mechanic of Pick Up: a random 1-3 second blur period where the player cannot see the game clearly. The unpredictable duration prevents optimization and forces adaptation. Consolation reward (bonus awarded even on death) reduces frustration and encourages risk-taking.

**CRITICAL SUCCESS FACTORS:**
- Duration is truly random (1-3s), not constant
- Blur remains active during countdown (4px blur on canvas)
- Bonus awarded even if player dies during countdown (consolation)
- Decision is irreversible (no switching to End after Pick Up)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/state.js` — Add phoneCall.pickedUp, phoneCall.pickUpEndTime
- `phone.html` — Add #phone-countdown-bar element
- `css/style.css` — Countdown bar styling, CSS transition
- `js/phone.js` — Implement pickUpCall(), countdown bar animation
- `js/game.js` — Check timer expiration in game loop, handle death during Pick Up

**Module Boundaries:**
- `state.js` owns state structure (pickedUp, pickUpEndTime)
- `phone.js` owns Pick Up logic (show countdown, start timer)
- `game.js` owns game loop (check timer expiration, award bonus)
- `render.js` owns canvas rendering (blur effect)

**Data Flow:**
```
1. Player clicks Pick Up
2. phone.js: hide buttons, show countdown bar
3. phone.js: calculate duration (1000-3000ms), set pickUpEndTime
4. phone.js: set pickedUp = true, store pickUpBonus
5. Game loop continues, canvas remains blurred
6. game.js: check Date.now() >= pickUpEndTime
7. If true:
   a. Award pickUpBonus points
   b. Increment pickUpCount
   c. Spawn phone bonus popup
   d. Dismiss phone overlay, remove blur
8. If player dies during timer:
   a. Award pickUpBonus (consolation)
   b. Proceed to death state
```

---

### 📦 CONFIG.JS UPDATES

Add Pick Up timer configuration:

```javascript
export const CONFIG = {
  // ... existing config ...

  // Pick Up Timer (Epic 9 - Story 9.3)
  PICKUP_TIMER: {
    min: 1000,    // 1 second minimum
    max: 3000     // 3 seconds maximum
  }
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. phone.html — Add countdown bar:**

```html
<div id="phone-overlay" class="hidden">
  <div id="phone-content">
    <img id="phone-portrait" src="assets/PhoneIcone01_256px.png" alt="Caller" />
    <p id="phone-status-text">Incoming call...</p>

    <!-- Buttons (shown initially) -->
    <div id="phone-buttons">
      <button id="phone-btn-end" class="phone-btn">
        <span class="btn-label">End</span>
        <span class="btn-points">+1</span>
      </button>
      <button id="phone-btn-pickup" class="phone-btn phone-btn-pickup">
        <span class="btn-label">Pick Up</span>
        <span class="btn-bonus">+2</span>
      </button>
    </div>

    <!-- Countdown bar (shown after Pick Up) -->
    <div id="phone-countdown-bar" class="hidden">
      <div id="countdown-bar-fill"></div>
    </div>
  </div>
</div>
```

**2. style.css — Countdown bar styling:**

```css
/* Countdown bar container */
#phone-countdown-bar {
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 20px;
}

/* Countdown bar fill (shrinks from 100% to 0%) */
#countdown-bar-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #28a745, #FFD700); /* Green to gold */
  border-radius: 10px;
  transition: width linear; /* Duration set dynamically via JS */
}
```

**3. phone.js — Implement pickUpCall():**

```javascript
import { CONFIG } from './config.js';
import { spawnPhoneBonusPopup } from './score-popup.js'; // Story 9.6

export function pickUpCall(gameState) {
  // Calculate Fibonacci bonus (from Story 9.2)
  const bonus = getPickUpBonus(gameState.phoneCall.pickUpCount);
  gameState.phoneCall.pickUpBonus = bonus;

  // Calculate random duration (1-3 seconds)
  const duration = CONFIG.PICKUP_TIMER.min +
                   Math.random() * (CONFIG.PICKUP_TIMER.max - CONFIG.PICKUP_TIMER.min);

  // Set timer end time
  gameState.phoneCall.pickUpEndTime = Date.now() + duration;
  gameState.phoneCall.pickedUp = true;

  // Hide buttons, show countdown bar
  document.getElementById('phone-buttons').classList.add('hidden');
  const countdownBar = document.getElementById('phone-countdown-bar');
  countdownBar.classList.remove('hidden');

  // Animate countdown bar shrink
  const fill = document.getElementById('countdown-bar-fill');
  fill.style.transition = `width ${duration}ms linear`;
  // Force reflow to ensure transition works
  fill.offsetWidth;
  fill.style.width = '0%';

  // Canvas blur is already active from showPhoneCall() (4px blur)
}
```

**4. game.js — Check timer expiration in game loop:**

```javascript
function gameLoop(gameState) {
  // ... existing game loop logic ...

  // Check if Pick Up timer expired
  if (gameState.phoneCall.pickedUp && Date.now() >= gameState.phoneCall.pickUpEndTime) {
    onPickUpTimerExpired(gameState);
  }

  // ... continue game loop ...
}

function onPickUpTimerExpired(gameState) {
  // Award Fibonacci bonus
  gameState.score += gameState.phoneCall.pickUpBonus;

  // Increment pickUpCount (for next call's bonus)
  gameState.phoneCall.pickUpCount += 1;

  // Spawn phone bonus popup (Story 9.6)
  spawnPhoneBonusPopup(gameState.phoneCall.pickUpBonus, 300, 200);

  // Dismiss phone overlay
  dismissPhoneOverlay(gameState);

  // Remove canvas blur (200ms smooth transition)
  const canvas = document.getElementById('game-canvas');
  canvas.style.transition = 'filter 200ms ease-out';
  canvas.style.filter = 'none';

  // Reset Pick Up state
  gameState.phoneCall.pickedUp = false;
  gameState.phoneCall.pickUpEndTime = null;
  gameState.phoneCall.pickUpBonus = 0;

  // Schedule next call (Story 9.5)
  scheduleNextCall(gameState);
}

function dismissPhoneOverlay(gameState) {
  const overlay = document.getElementById('phone-overlay');
  overlay.classList.add('hidden');
  gameState.phoneCall.active = false;

  // Reset UI elements
  document.getElementById('phone-buttons').classList.remove('hidden');
  document.getElementById('phone-countdown-bar').classList.add('hidden');
  document.getElementById('countdown-bar-fill').style.width = '100%';
}
```

**5. game.js — Handle death during Pick Up:**

```javascript
function onDeath(gameState) {
  // If Pick Up timer is active, award consolation bonus
  if (gameState.phoneCall.pickedUp) {
    gameState.score += gameState.phoneCall.pickUpBonus;
    gameState.phoneCall.pickUpCount += 1;

    // Spawn phone bonus popup (consolation reward)
    spawnPhoneBonusPopup(gameState.phoneCall.pickUpBonus, 300, 250);
  }

  // Dismiss phone overlay if active
  if (gameState.phoneCall.active) {
    dismissPhoneOverlay(gameState);
  }

  // Proceed to death state
  gameState.gameOver = true;
  showGameOverScreen(gameState);
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Variable Duration (1-3s):**
   - Pick Up 10 phone calls in a row
   - Observe countdown bar shrink speed
   - Verify durations vary (some fast ~1s, some slow ~3s)
   - Verify no two consecutive calls have identical duration

2. **Countdown Bar Animation:**
   - Pick Up call
   - Verify both buttons hide immediately
   - Verify countdown bar appears at 100% width
   - Verify bar shrinks linearly from 100% to 0%
   - Verify green-to-gold gradient visible

3. **Canvas Blur During Pick Up:**
   - Pick Up call
   - Observe game canvas
   - Verify 4px blur active (game not clearly visible)
   - Verify snake continues moving at normal speed
   - Verify countdown expires
   - Verify blur removes smoothly (200ms fade)

4. **Bonus Awarded on Timer Expiry:**
   - Note current score (e.g., 10)
   - Pick Up call (bonus = +2)
   - Wait for countdown to expire
   - Verify score increases by +2 (score = 12)
   - Verify phone bonus popup appears: "+2 CALL BONUS"

5. **Consolation Reward on Death:**
   - Reach score 5 (pickUpCount = 0, next bonus = +2)
   - Pick Up call
   - During countdown, deliberately die (hit wall)
   - Verify score still increases by +2 (consolation)
   - Verify phone bonus popup appears
   - Verify death screen proceeds normally

6. **Irreversible Decision:**
   - Pick Up call
   - Verify End button disappears
   - Verify no way to cancel Pick Up
   - Verify countdown must complete or player dies

**Edge Cases:**
- Pick Up call, die immediately (bonus still awarded)
- Pick Up call, countdown expires at exact moment of death (bonus awarded once)
- Multiple Pick Ups in a row (durations vary)
- Pause game during Pick Up (timer continues? or pauses? — design decision)

---

### 📚 CRITICAL DATA FORMATS

**Random duration calculation:**
```javascript
const duration = 1000 + Math.random() * 2000;  // CORRECT (1000-3000ms)
const duration = Math.random() * 3000;         // WRONG (0-3000ms, includes too-short durations)
```

**CSS transition syntax:**
```javascript
fill.style.transition = `width ${duration}ms linear`;  // CORRECT
fill.style.transition = `width ${duration} linear`;    // WRONG (missing 'ms' unit)
```

**Timer expiration check:**
```javascript
if (pickedUp && Date.now() >= pickUpEndTime) { }  // CORRECT
if (pickedUp && Date.now() > pickUpEndTime) { }   // LESS RELIABLE (misses exact match)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Uncertainty tolerance, risk/reward training
- `_bmad-output/planning-artifacts/prd.md` — FR55, FR58-FR60 (Pick Up timer requirements)

**Key Design Principles:**
- **Unpredictability:** Variable duration prevents optimization (player cannot "learn" the timing)
- **Consolation reward:** Reduces frustration, encourages risk-taking (you get the bonus even if you die)
- **Irreversible commitment:** Once Pick Up chosen, no backing out (trains commitment to risky decisions)
- **Blur maintains challenge:** Player navigates blind, tests spatial memory and prediction

---

### 📋 FRs COVERED

FR55, FR58-FR60 (Variable Pick Up timer, countdown bar, consolation reward)

**Detailed FR Mapping:**
- FR55: Pick Up timer is random 1-3 seconds → PICKUP_TIMER.min/max
- FR58: Countdown bar displays and shrinks → CSS transition
- FR59: Bonus awarded on timer expiry → onPickUpTimerExpired()
- FR60: Consolation reward if death during Pick Up → onDeath() check

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] phoneCall.pickedUp added to state.js
- [ ] phoneCall.pickUpEndTime added to state.js
- [ ] phone-countdown-bar element added to phone.html
- [ ] Countdown bar CSS styling (green-to-gold gradient)
- [ ] pickUpCall() hides buttons, shows countdown bar
- [ ] Random duration calculated: 1000 + Math.random() * 2000
- [ ] pickUpEndTime set to Date.now() + duration
- [ ] pickedUp set to true
- [ ] pickUpBonus stored in state
- [ ] Countdown bar shrinks from 100% to 0% using CSS transition
- [ ] game.js checks Date.now() >= pickUpEndTime in game loop
- [ ] onPickUpTimerExpired() awards bonus, increments pickUpCount
- [ ] Phone bonus popup spawns on timer expiry
- [ ] Canvas blur removed smoothly (200ms transition)
- [ ] Phone overlay dismissed after timer expires
- [ ] onDeath() awards consolation bonus if pickedUp = true
- [ ] Consolation bonus only awarded once (not duplicated)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (death during countdown, multiple Pick Ups)

**Common Mistakes to Avoid:**
- ❌ Constant duration instead of random (breaks unpredictability)
- ❌ Not awarding consolation bonus on death (frustration)
- ❌ Allowing End after Pick Up committed (breaks irreversibility)
- ❌ Not removing blur after countdown expires (game stays blurred)
- ❌ Awarding bonus twice if death coincides with timer expiry

---

## Senior Developer Review (AI)

**Reviewer:** Tomoco (via adversarial code review workflow)
**Date:** 2026-02-13
**Outcome:** APPROVED with fixes applied

**Findings Fixed:**
1. [HIGH] Space key breaks irreversibility during countdown → Fixed in input.js (same as 9.1)
2. [MEDIUM] checkPickUpTimerExpiration duplicated hidePhoneOverlay logic → Fixed in game.js: now calls exported hidePhoneOverlay()
3. [MEDIUM] 0-value popup on timer expiry suppressed → Fixed in game.js

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- Timer duration logged to console with DEBUG flag
- Bonus award logged on timer expiration
- Consolation bonus logged on death during Pick Up

**🐛 BUGFIX:** Timer mismatch - was using `Date.now()` to set timer but game loop uses `performance.now()`. Fixed to use `performance.now()` consistently. Phone overlay now dismisses correctly when countdown expires.

### Completion Notes List

**Implementation Summary:**

✅ **Config (config.js):**
- Added `PICKUP_TIMER: { min: 1000, max: 3000 }`
- Random duration between 1-3 seconds

✅ **HTML Structure (index.html):**
- Added countdown bar container (`#phone-countdown-bar`)
- Added countdown bar fill element (`#countdown-bar-fill`)
- Hidden by default, shown when Pick Up activated

✅ **CSS Styling (style.css):**
- Countdown bar container: 100% width, 20px height, dark background
- Countdown bar fill: green-to-gold gradient (`#28a745` to `#FFD700`)
- CSS transition: width animates linearly (duration set via JS)

✅ **Phone Logic (phone.js):**
- Updated `pickUpCall()` to implement countdown timer:
  1. Calculate random duration (1000-3000ms)
  2. Set `pickUpEndTime = Date.now() + duration`
  3. Set `pickedUp = true`
  4. Hide buttons, show countdown bar
  5. Animate bar from 100% to 0% width
  6. Store bonus (effect-based calculation from Story 9.2)
- Updated `hidePhoneOverlay()` to reset countdown bar state
- Canvas blur (4px) remains active during countdown

✅ **Game Loop Logic (game.js):**
- Added `checkPickUpTimerExpiration()` function:
  - Called every frame in game loop
  - Checks `pickedUp && Date.now() >= pickUpEndTime`
  - Awards bonus, increments pickUpCount
  - Spawns "+N CALL BONUS" popup
  - Removes blur smoothly (200ms transition)
  - Resets phone state
- Updated death handling:
  - Checks if Pick Up timer active (`pickedUp = true`)
  - Awards consolation bonus even on death
  - Increments pickUpCount (consolation counts)
  - Spawns bonus popup before death screen

**Design Notes:**

**Variable Duration:**
- Truly random: `CONFIG.PICKUP_TIMER.min + Math.random() * (max - min)`
- Range: 1000ms to 3000ms (1-3 seconds)
- Prevents optimization, forces adaptation

**Consolation Reward:**
- Bonus awarded even if player dies during countdown
- Reduces frustration, encourages risk-taking
- pickUpCount still increments (tracks attempts)

**Irreversible Decision:**
- Once Pick Up pressed, buttons hide permanently
- No way to switch to End
- Player commits to the risky choice

**Effect-Based Integration:**
- Bonus uses effect-based calculation (Story 9.2 redesign)
- Not Fibonacci-based (original story spec outdated)
- pickUpCount still tracked for analytics/stats

### File List

- js/config.js (modified - added PICKUP_TIMER min/max)
- index.html (modified - added countdown bar HTML elements)
- css/style.css (modified - countdown bar styling with gradient)
- js/phone.js (modified - pickUpCall implements countdown timer, hidePhoneOverlay resets bar)
- js/game.js (modified - checkPickUpTimerExpiration function, death consolation bonus)
