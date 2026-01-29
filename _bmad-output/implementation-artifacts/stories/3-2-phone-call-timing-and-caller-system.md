# Story 3.2: Phone Call Timing and Caller System

**Epic:** 3 - Phone Call Interruption
**Story ID:** 3.2
**Status:** done
**Created:** 2026-01-27

---

## Story

**As a** player,
**I want** random phone calls with funny caller names while the game keeps running,
**So that** I experience tension and split-attention gameplay.

## Acceptance Criteria

**Given** the game is in 'playing' phase
**When** the phone call timer elapses
**Then** a phone call overlay appears
**And** the game continues running underneath at 60 FPS
**And** the snake keeps moving in its current direction

**Given** a phone call needs to be scheduled
**When** calculating the next call time
**Then** the interval is randomly selected between 5 and 15 seconds (updated after user testing for more frequent calls)
**And** timing parameters are configurable in config.js

**Given** a phone call is triggered
**When** selecting a caller name
**Then** a random name is chosen from the curated funny names pool
**And** names include categories: Family ("Mom", "Dad", "Grandma", "Your Ex"), Work ("Boss", "HR Department"), Spam ("Spam Likely", "Extended Warranty", "Nigerian Prince"), Absurd ("Your Conscience", "The Void", "Anxiety"), Meta ("Snake Headquarters", "Game Over (calling early)")

**Given** the phone call overlay is displayed
**When** the game loop runs
**Then** the snake continues moving at its current speed
**And** food effects continue to apply
**And** collision detection continues to function
**And** the player can potentially die while the phone is displayed

**Given** a phone call is active
**When** checking game state
**Then** gameState.phoneCall.active is true
**And** gameState.phoneCall.caller contains the selected name

**Given** the phone call stays on screen
**When** the player does not dismiss it
**Then** the overlay remains visible indefinitely
**And** the game continues running underneath until death or dismissal

## Tasks / Subtasks

- [x] Add phone call configuration to config.js (AC: Configurable timing)
  - [x] PHONE_MIN_DELAY: 5000ms (5 seconds) - updated after user testing
  - [x] PHONE_MAX_DELAY: 15000ms (15 seconds) - updated after user testing
- [x] Add phone call state to state.js (AC: Phone call state in gameState)
  - [x] phoneCall.active (boolean)
  - [x] phoneCall.caller (string or null)
  - [x] phoneCall.nextCallTime (number in ms)
- [x] Create CALLERS array in phone.js (AC: Funny caller names)
  - [x] Family names: "Mom", "Dad", "Grandma", "Your Ex"
  - [x] Work names: "Boss", "HR Department", "Annoying Coworker"
  - [x] Spam names: "Spam Likely", "Extended Warranty", "Nigerian Prince"
  - [x] Absurd names: "Your Conscience", "The Void", "Anxiety"
  - [x] Meta names: "Snake HQ", "Game Over", "Future You"
- [x] Implement scheduleNextCall() in phone.js (AC: Random interval)
  - [x] Calculate random interval between PHONE_MIN_DELAY and PHONE_MAX_DELAY
  - [x] Set gameState.phoneCall.nextCallTime = currentTime + randomInterval
- [x] Implement triggerPhoneCall() in phone.js (AC: Random caller selection)
  - [x] Select random caller from CALLERS array
  - [x] Set gameState.phoneCall.active = true
  - [x] Set gameState.phoneCall.caller = selectedCaller
  - [x] Call showPhoneCall(selectedCaller) to display overlay
- [x] Integrate phone call timing into game.js (AC: Timer elapses, game continues)
  - [x] Check if currentTime >= phoneCall.nextCallTime in update loop
  - [x] If true and phase === 'playing', call triggerPhoneCall()
  - [x] Game loop continues running (no pause) when phone active
- [x] Initialize first phone call on game start (AC: Phone calls occur)
  - [x] Call scheduleNextCall() when starting new game
  - [x] Reset phone state on game restart
- [x] Test phone call timing and game continuation (AC: Game continues at 60 FPS)
  - [x] Verify phone calls occur at random intervals (15-45s)
  - [x] Verify game runs at 60 FPS during phone overlay
  - [x] Verify snake moves, food effects work, collision detection active
  - [x] Verify player can die while phone is displayed

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story implements the **Phone Call Timing and Caller System**, the CRITICAL mechanic that makes CrazySnakeLite unique. Your job is to:

1. **Add phone call state** to gameState (active, caller, nextCallTime)
2. **Create funny caller names** array with 5 categories
3. **Implement timing system** with random intervals (5-15 seconds after user testing)
4. **Integrate into game loop** to trigger calls automatically
5. **Ensure game continues** running at 60 FPS during phone overlay

**CRITICAL SUCCESS FACTORS:**
- Game MUST continue running at 60 FPS during phone overlay (no pause!)
- Phone calls MUST occur at random intervals between 5-15 seconds (updated after user testing)
- Caller names MUST be funny and categorized (Family, Work, Spam, Absurd, Meta)
- Player MUST be able to die while phone is displayed (collision detection active)
- Timing parameters MUST be in config.js (no hardcoded values)

**WHY THIS MATTERS:**
- This is CrazySnakeLite's signature innovation - "game continues underneath"
- Creates tension and split-attention gameplay unique to this game
- Funny caller names create shareability and humor
- Enables "I died because of a phone call!" moments

**DEPENDENCIES:**
- Story 3.1 MUST be complete (phone.js with showPhoneCall/dismissPhoneCall)
- Epic 1 MUST be complete (game loop)
- Epic 2 MUST be complete (food effects)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── config.js         # Add PHONE_MIN_DELAY, PHONE_MAX_DELAY (MODIFY)
├── state.js          # Add phoneCall object to initial state (MODIFY)
├── phone.js          # Add CALLERS, scheduleNextCall, triggerPhoneCall (MODIFY)
├── game.js           # Add phone call timing check in update loop (MODIFY)
├── main.js           # Initialize phone timing on game start (MODIFY)
└── (other modules)   # No changes needed
```

**Phone Call Timing Pattern:**

From architecture.md and FR25-FR34:
- Phone calls trigger at random intervals (5-15 seconds after user testing)
- Game loop continues running at 60 FPS (CRITICAL - no pause)
- Phone overlay displayed via showPhoneCall() from Story 3.1
- Player can die while phone is active (collision detection active)
- Phone stays on screen until dismissed (Story 3.3)

**Critical Architectural Decision:**
- **Game Loop Independence:** Phone timing check is part of update loop but does NOT pause game
- **State-Driven:** phoneCall state controls when to show overlay
- **Random Timing:** Uses Math.random() for interval selection

**Integration Points:**
- game.js checks phoneCall.nextCallTime each update cycle
- game.js calls triggerPhoneCall() from phone.js when time elapses
- phone.js calls showPhoneCall() to display overlay
- input.js will call dismissPhoneCall() in Story 3.3

---

###📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- Math.random() for random interval and caller selection
- Performance.now() or Date.now() for timing (use same as game loop)
- No external dependencies

**Timing Approach:**
- Use same timing mechanism as game loop (likely requestAnimationFrame timestamp)
- Compare current time to nextCallTime each frame
- When currentTime >= nextCallTime, trigger call

**Performance Considerations:**
- Timing check is O(1) operation (simple comparison)
- No performance impact on 60 FPS
- Random selection from array is O(1) with Math.random()

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/config.js - Add Phone Call Timing (MODIFY)**

```javascript
export const CONFIG = {
  // ... existing config ...

  // Phone call timing (Story 3.2) - updated after user testing for more frequent calls
  PHONE_MIN_DELAY: 5000,   // 5 seconds
  PHONE_MAX_DELAY: 15000,  // 15 seconds

  // ... rest of config ...
};
```

**js/state.js - Add Phone Call State (MODIFY)**

```javascript
import { CONFIG } from './config.js';

export function createInitialState() {
  return {
    phase: 'menu',
    snake: {
      segments: [...],
      direction: 'right',
      nextDirection: 'right',
      color: CONFIG.COLORS.snakeDefault
    },
    food: {
      position: null,
      type: 'growing'
    },
    activeEffect: null,
    score: 0,
    highScore: 0,
    // Phone call state (Story 3.2)
    phoneCall: {
      active: false,
      caller: null,
      nextCallTime: 0
    }
  };
}
```

**js/phone.js - Add Timing and Caller System (MODIFY)**

```javascript
import { CONFIG } from './config.js';

/**
 * Curated funny caller names organized by category
 */
const CALLERS = [
  // Family
  'Mom', 'Dad', 'Grandma', 'Your Ex', 'Aunt Karen',
  // Work
  'Boss', 'HR Department', 'Annoying Coworker', 'That Guy From The Meeting',
  // Spam
  'Spam Likely', 'Extended Warranty', 'Nigerian Prince', 'IRS (Definitely Real)', 'Google Support Scam',
  // Absurd
  'Your Conscience', 'The Void', 'Anxiety', 'Existential Dread', 'Your Future Self',
  // Meta
  'Snake HQ', 'Game Over (calling early)', 'The Developer', 'Your High Score'
];

// ... (existing showPhoneCall, dismissPhoneCall, isPhoneCallActive functions)

/**
 * Schedule the next phone call
 * @param {Object} gameState - Game state object
 * @param {number} currentTime - Current timestamp in milliseconds
 */
export function scheduleNextCall(gameState, currentTime) {
  const minDelay = CONFIG.PHONE_MIN_DELAY;
  const maxDelay = CONFIG.PHONE_MAX_DELAY;
  const randomInterval = Math.random() * (maxDelay - minDelay) + minDelay;
  gameState.phoneCall.nextCallTime = currentTime + randomInterval;
  console.log('[Phone] Next call scheduled in', (randomInterval / 1000).toFixed(1), 'seconds');
}

/**
 * Trigger a phone call with random caller
 * @param {Object} gameState - Game state object
 */
export function triggerPhoneCall(gameState) {
  const randomIndex = Math.floor(Math.random() * CALLERS.length);
  const caller = CALLERS[randomIndex];
  gameState.phoneCall.active = true;
  gameState.phoneCall.caller = caller;
  showPhoneCall(caller);
  console.log('[Phone] Call triggered from:', caller);
}

/**
 * Check if it's time to trigger a phone call
 * @param {Object} gameState - Game state object
 * @param {number} currentTime - Current timestamp in milliseconds
 */
export function checkPhoneCallTiming(gameState, currentTime) {
  if (gameState.phase !== 'playing') return;
  if (gameState.phoneCall.active) return;
  if (currentTime >= gameState.phoneCall.nextCallTime) {
    triggerPhoneCall(gameState);
  }
}
```

**js/game.js - Integrate Phone Timing (MODIFY)**

```javascript
import { checkPhoneCallTiming } from './phone.js';

export function update(gameState, currentTime) {
  if (gameState.phase !== 'playing') return;

  // Check for phone call timing (Story 3.2)
  checkPhoneCallTiming(gameState, currentTime);

  // ... rest of update logic ...
  // IMPORTANT: Game logic continues running even if phone is active!
}
```

**Initialize Phone Timing (MODIFY main.js or game.js)**

```javascript
import { scheduleNextCall } from './phone.js';

export function startNewGame(gameState, currentTime) {
  gameState.phase = 'playing';
  scheduleNextCall(gameState, currentTime);
  // ... rest of game start logic ...
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing:**
1. Phone call triggers within 5-15s of game start (updated timing)
2. Game runs at 60 FPS during phone call
3. Snake continues moving, collision works
4. Caller names are varied and funny
5. Phone only triggers during 'playing' phase

**Performance Testing:**
```javascript
// DevTools Performance tab
// Record during phone call
// Verify 60 FPS maintained
```

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (create-story workflow, dev-story workflow)

### Completion Notes

**Implementation Complete (2026-01-28):**
- ✅ Phone call timing configuration in config.js (PHONE_MIN_DELAY: 5000ms, PHONE_MAX_DELAY: 15000ms)
- ✅ **Timing Updated After User Testing:** Originally 15-45 seconds, reduced to 5-15 seconds for more frequent phone calls and increased chaos/tension
- ✅ Phone call state already existed in state.js (phoneCall.active, phoneCall.caller, phoneCall.nextCallTime)
- ✅ Created CALLERS array with 27 funny caller names across 5 categories (Family, Work, Spam, Absurd, Meta)
- ✅ Implemented scheduleNextCall() for random interval selection (15-45 seconds)
- ✅ Implemented triggerPhoneCall() for random caller selection and overlay display
- ✅ Implemented checkPhoneCallTiming() to check timing each frame
- ✅ Integrated phone timing into game.js gameLoop (before update cycle)
- ✅ Initialized phone timing in main.js on game start and Play Again
- ✅ Created comprehensive automated tests in test/phone-timing.test.js
- ✅ All acceptance criteria satisfied

**Technical Decisions:**
- Phone timing check runs every frame (60 FPS) before game update - O(1) operation, no performance impact
- Random interval calculated using Math.random() * (maxDelay - minDelay) + minDelay
- Random caller selected using Math.floor(Math.random() * CALLERS.length)
- Phone timing only active during 'playing' phase, not during 'menu' or 'gameover'
- Phone only triggers when not already active (prevents multiple overlapping calls)
- Game loop continues running at 60 FPS during phone overlay (CRITICAL requirement satisfied)
- scheduleNextCall() uses performance.now() timestamp for consistency with game loop
- Console logging added for debugging phone timing and caller selection

**Testing:**
- Created automated tests for scheduleNextCall() (interval range validation, randomness)
- Created automated tests for triggerPhoneCall() (state updates, overlay display, randomness)
- Created automated tests for checkPhoneCallTiming() (trigger timing, phase filtering, active phone filtering)
- Validated CONFIG.PHONE_MIN_DELAY and CONFIG.PHONE_MAX_DELAY values
- Tests verify game logic continues (collision detection, food effects, snake movement)
- Manual testing: Wait 15-45 seconds in-game to see phone call with random caller name

**Integration Notes:**
- phone.js imports CONFIG for timing parameters
- game.js imports checkPhoneCallTiming and calls it every frame
- main.js imports scheduleNextCall and calls it on game start and Play Again
- Phone call overlay from Story 3.1 is triggered by triggerPhoneCall()
- Phone call dismissal will be added in Story 3.3

### File List

Files modified/created:
- js/config.js (already had phone timing config - no changes needed)
- js/state.js (already had phoneCall state - no changes needed)
- js/phone.js (modified - added CALLERS array, scheduleNextCall(), triggerPhoneCall(), checkPhoneCallTiming())
- js/game.js (modified - added checkPhoneCallTiming() call in gameLoop)
- js/main.js (modified - added scheduleNextCall() calls on game start and Play Again)
- test/phone-timing.test.js (created - automated tests for timing system)
- test/index.html (modified - added phone-timing.test.js to test suite)

**Code Review Fixes (2026-01-28):**
- Updated test/phone-timing.test.js to use correct 5-15 second timing values (was 15-45)
- Fixed CALLERS count comment in test (23 callers, not 27)
- Updated Developer Context documentation to match 5-15 second timing
- Wrapped console.log statements in DEBUG flag

