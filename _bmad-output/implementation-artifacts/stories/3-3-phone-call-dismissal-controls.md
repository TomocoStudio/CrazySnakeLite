# Story 3.3: Phone Call Dismissal Controls

**Epic:** 3 - Phone Call Interruption
**Story ID:** 3.3
**Status:** done
**Created:** 2026-01-27

---

## Story

**As a** player,
**I want** to quickly dismiss phone calls with Space bar or tapping End,
**So that** I can return focus to the game before I crash.

## Acceptance Criteria

**Given** the phone call overlay is displayed on desktop
**When** the player presses the Space bar
**Then** the phone call overlay disappears immediately
**And** the blur effect on the game canvas is removed
**And** the game continues normally without interruption

**Given** the phone call overlay is displayed on mobile
**When** the player taps the "End" button
**Then** the phone call overlay disappears immediately
**And** the blur effect on the game canvas is removed
**And** the game continues normally without interruption

**Given** the player dismisses a phone call
**When** measuring response time
**Then** the overlay is removed within 100 milliseconds

**Given** a phone call is dismissed
**When** scheduling the next call
**Then** a new random interval (5-15 seconds) is calculated
**And** the timer begins counting from the dismissal moment

**Given** the phone call overlay is active
**When** the player presses any movement key (arrows, WASD, etc.)
**Then** the snake direction changes as normal (game is still running)
**And** the phone call is NOT dismissed by movement keys

**Given** the phone call is dismissed
**When** checking game state
**Then** gameState.phoneCall.active is set to false
**And** gameState.phoneCall.caller is cleared
**And** the game canvas blur is removed

**Given** the player dies while phone call is active
**When** the game transitions to 'gameover' phase
**Then** the phone call overlay is automatically dismissed
**And** the game over screen is displayed normally

## Tasks / Subtasks

- [x] Add Space bar dismissal to input.js (AC: Space bar dismisses)
  - [x] Check if phone call is active in input handler
  - [x] On Space key, call dismissPhoneCall() and scheduleNextCall()
  - [x] Ensure Space doesn't affect snake movement
- [x] Add End button click handler in phone.js (AC: End button dismisses)
  - [x] Get End button DOM element
  - [x] Add click event listener
  - [x] Call dismissPhoneCall() and scheduleNextCall() on click
- [x] Update dismissPhoneCall() in phone.js (AC: State cleared)
  - [x] Set gameState.phoneCall.active = false
  - [x] Set gameState.phoneCall.caller = null
  - [x] Remove .hidden class from overlay
  - [x] Remove .blurred class from canvas
- [x] Add handlePhoneDismiss() wrapper function (AC: Schedule next call)
  - [x] Call dismissPhoneCall() to hide overlay
  - [x] Call scheduleNextCall() with current time
  - [x] Update gameState appropriately
- [x] Auto-dismiss on game over (AC: Auto-dismiss on death)
  - [x] In game.js, check for phase transition to 'gameover'
  - [x] If phoneCall.active, call dismissPhoneCall()
  - [x] Clear phone state on game over
- [x] Test dismissal timing and state (AC: < 100ms response)
  - [x] Measure overlay removal time (should be < 100ms)
  - [x] Verify blur removed immediately
  - [x] Verify next call scheduled after dismissal

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story completes the **Phone Call Interruption Mechanic** by implementing dismissal controls. Your job is to:

1. **Add Space bar handler** to dismiss phone on desktop
2. **Add End button click handler** to dismiss phone on mobile
3. **Update dismissPhoneCall()** to clear phone state
4. **Schedule next call** immediately after dismissal
5. **Auto-dismiss on game over** when player dies

**CRITICAL SUCCESS FACTORS:**
- Space bar MUST dismiss phone on desktop
- End button MUST dismiss phone on mobile (tap target 44x44px minimum)
- Dismissal MUST be instant (< 100ms)
- Next call MUST be scheduled after dismissal (15-45s random interval)
- Movement keys MUST NOT dismiss phone (only Space or End button)
- Phone MUST auto-dismiss on game over

**WHY THIS MATTERS:**
- Completes the split-attention gameplay mechanic
- Fast dismissal is critical for maintaining tension
- Auto-dismiss prevents phone staying on game over screen
- Scheduling next call creates recurring tension

**DEPENDENCIES:**
- Story 3.1 MUST be complete (phone overlay UI, dismissPhoneCall())
- Story 3.2 MUST be complete (phone timing, scheduleNextCall())

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── phone.js          # Update dismissPhoneCall, add End button listener (MODIFY)
├── input.js          # Add Space bar handler for phone dismissal (MODIFY)
├── game.js           # Add auto-dismiss on game over (MODIFY)
└── (other modules)   # No changes needed
```

**Phone Dismissal Pattern:**

From architecture.md and FR32-FR34:
- Space bar dismisses on desktop
- End button tap dismisses on mobile
- Dismissal is instant (< 100ms)
- Next call scheduled immediately after dismissal
- Movement keys do NOT dismiss (game continues running)

**Critical Architectural Decision:**
- **Input Priority:** Space bar checked BEFORE movement keys when phone active
- **Event Handling:** End button uses native DOM click event (not canvas)
- **State Management:** dismissPhoneCall() updates gameState and DOM

**Integration Points:**
- input.js checks isPhoneCallActive() before handling Space
- phone.js exports dismissPhoneCall() used by input.js and game.js
- game.js auto-dismisses on phase transition to 'gameover'

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- Keyboard event (Space bar) via existing input.js system
- DOM click event for End button
- classList API for show/hide and blur toggle
- No external dependencies

**Event Handling:**
- Space bar: Keyboard event in input.js
- End button: Click event on DOM button element
- Both trigger same dismissal logic

**Performance Considerations:**
- Event handlers are lightweight (< 100ms response)
- DOM manipulation is minimal (2 classList toggles)
- Dismissal is instant, no animations needed

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/phone.js - Update Dismissal and Add Button Listener (MODIFY)**

```javascript
// Update dismissPhoneCall to clear state
export function dismissPhoneCall(gameState) {
  const overlay = document.getElementById('phone-overlay');
  const canvas = document.getElementById('game-canvas');

  if (!overlay || !canvas) {
    console.error('[Phone] Required DOM elements not found');
    return;
  }

  // Hide overlay
  overlay.classList.add('hidden');

  // Remove blur from canvas
  canvas.classList.remove('blurred');

  // Clear phone state (Story 3.3)
  if (gameState) {
    gameState.phoneCall.active = false;
    gameState.phoneCall.caller = null;
  }

  console.log('[Phone] Call dismissed');
}

/**
 * Handle phone call dismissal and schedule next call
 * @param {Object} gameState - Game state object
 * @param {number} currentTime - Current timestamp in milliseconds
 */
export function handlePhoneDismiss(gameState, currentTime) {
  dismissPhoneCall(gameState);
  scheduleNextCall(gameState, currentTime);
}

/**
 * Initialize phone call system - add End button listener
 * Call this once during game initialization
 * @param {Object} gameState - Game state object
 * @param {Function} getCurrentTime - Function to get current timestamp
 */
export function initPhoneSystem(gameState, getCurrentTime) {
  const endButton = document.querySelector('.end-button');

  if (!endButton) {
    console.error('[Phone] End button not found');
    return;
  }

  // Add click handler to End button
  endButton.addEventListener('click', () => {
    if (gameState.phoneCall.active) {
      handlePhoneDismiss(gameState, getCurrentTime());
    }
  });

  console.log('[Phone] System initialized');
}
```

**js/input.js - Add Space Bar Handler (MODIFY)**

```javascript
import { isPhoneCallActive, handlePhoneDismiss } from './phone.js';

// In your keyboard input handler
export function handleKeyDown(event, gameState, getCurrentTime) {
  const key = event.key;

  // Handle phone dismissal first (highest priority)
  if (key === ' ' || key === 'Spacebar') {
    if (isPhoneCallActive()) {
      event.preventDefault();  // Prevent page scroll
      handlePhoneDismiss(gameState, getCurrentTime());
      return;  // Don't process other inputs
    }
  }

  // ... rest of input handling (movement keys, etc.) ...
}
```

**js/game.js - Auto-Dismiss on Game Over (MODIFY)**

```javascript
import { dismissPhoneCall } from './phone.js';

// When handling death/game over
export function handleGameOver(gameState) {
  // Auto-dismiss phone if active (Story 3.3)
  if (gameState.phoneCall.active) {
    dismissPhoneCall(gameState);
  }

  // Transition to game over phase
  gameState.phase = 'gameover';

  // ... rest of game over logic ...
}
```

**js/main.js - Initialize Phone System (MODIFY)**

```javascript
import { initPhoneSystem } from './phone.js';

// During game initialization
function init() {
  const gameState = createInitialState();

  // Initialize phone system (Story 3.3)
  initPhoneSystem(gameState, () => performance.now());

  // ... rest of initialization ...
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Space Bar Dismissal:**
   - Start game, wait for phone call
   - Press Space bar
   - Verify overlay disappears instantly
   - Verify blur removed from canvas
   - Verify game continues running
   - Verify next call scheduled (check console)

2. **End Button Dismissal:**
   - Start game, wait for phone call
   - Click End button with mouse
   - Verify overlay disappears instantly
   - Verify blur removed from canvas
   - Test on mobile (DevTools device mode)
   - Verify button is tappable (44x44px minimum)

3. **Dismissal Timing:**
   - Use DevTools Performance tab
   - Record during dismissal
   - Measure time from Space press to overlay hidden
   - Should be < 100ms

4. **Movement Keys Don't Dismiss:**
   - During phone call, press arrow keys
   - Verify snake direction changes
   - Verify phone stays on screen
   - Verify only Space or End button dismisses

5. **Next Call Scheduling:**
   - Dismiss phone call
   - Check console for "Next call scheduled" message
   - Wait 15-45 seconds
   - Verify another call triggers

6. **Auto-Dismiss on Death:**
   - Let phone call display
   - Crash into wall or self
   - Verify phone overlay disappears
   - Verify game over screen displays normally
   - Verify no phone overlay on game over screen

**Browser Console Test:**

```javascript
// Test dismissal and scheduling
import { handlePhoneDismiss } from './js/phone.js';
const gameState = { phoneCall: { active: true, caller: 'Test', nextCallTime: 0 } };
handlePhoneDismiss(gameState, Date.now());
console.log('Active?', gameState.phoneCall.active);  // Should be false
console.log('Next call:', gameState.phoneCall.nextCallTime);  // Should be > now
```

**Common Issues:**

- ❌ Space bar scrolls page → Add event.preventDefault()
- ❌ Movement keys dismiss phone → Check input handler priority
- ❌ Button not clickable → Check z-index and pointer-events
- ❌ Dismissal feels slow → Check for animations or delays
- ❌ Next call not scheduled → Check handlePhoneDismiss() calls scheduleNextCall()
- ❌ Phone stays on game over → Check auto-dismiss in handleGameOver()

---

### 📚 CRITICAL DATA FORMATS

**Phone State After Dismissal (MUST match):**

```javascript
// CORRECT: State after dismissal
gameState.phoneCall = {
  active: false,        // Must be false
  caller: null,         // Must be null
  nextCallTime: <future_timestamp>  // Must be > current time
};

// WRONG: Not clearing state
gameState.phoneCall.active = false
// But caller still set - WRONG, must be null
```

**Event Handling (Space bar):**

```javascript
// CORRECT: Check phone active first
if (key === ' ' && isPhoneCallActive()) {
  event.preventDefault();
  handlePhoneDismiss(gameState, getCurrentTime());
  return;  // Stop processing
}

// WRONG: Processing Space as movement
if (key === ' ') {
  // Movement logic - WRONG, should dismiss phone first
}
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **Module Boundaries:** phone.js handles phone DOM manipulation exclusively
2. **Input Priority:** Phone dismissal checked before movement keys
3. **Named Exports:** Use named exports (not default exports)
4. **Time Values:** Use milliseconds for all timing

**Phone Call Rules:**
- Only Space bar and End button dismiss phone
- Movement keys do NOT dismiss phone (game continues running)
- Dismissal must be instant (< 100ms)
- Next call scheduled immediately after dismissal

**Input Handling:**
- input.js abstracts all input sources
- Phone dismissal has highest priority in input handling
- Event.preventDefault() prevents unwanted browser behavior

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Story 3.1 (This Epic):**
- ✅ phone.js must exist with dismissPhoneCall() function
- ✅ Phone overlay DOM must exist with .end-button
- ✅ CSS blur effect must be working

**Depends on Story 3.2 (This Epic):**
- ✅ scheduleNextCall() must exist in phone.js
- ✅ Phone timing system must be working
- ✅ gameState.phoneCall state must be defined

**Depends on Epic 1 (Done):**
- ✅ input.js must exist with keyboard handling
- ✅ Game loop and phase management must be working

**If Stories 3.1 or 3.2 incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR32, FR33, FR34, FR78, FR79

**Detailed FR Mapping:**
- FR32: Players dismiss phone calls by pressing Space bar on desktop
- FR33: Players dismiss phone calls by tapping "End" button on mobile
- FR34: Phone call overlay disappears immediately upon dismissal
- FR78: Space bar dismisses phone calls on desktop
- FR79: Tap on "End" button dismisses phone calls on mobile

**NFRs Covered:**
- NFR9: Phone call dismissal (Space/tap) removes overlay within 100 milliseconds

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

**Phone Module (phone.js):**
- [ ] dismissPhoneCall() updated to clear gameState
- [ ] handlePhoneDismiss() function created
- [ ] initPhoneSystem() function created
- [ ] End button click handler added
- [ ] Dismissal clears active and caller state

**Input Module (input.js):**
- [ ] Space bar handler added
- [ ] Phone active check before handling Space
- [ ] event.preventDefault() on Space when phone active
- [ ] handlePhoneDismiss() called on Space press
- [ ] Movement keys do NOT dismiss phone

**Game Module (game.js):**
- [ ] Auto-dismiss added to game over handler
- [ ] Phone state checked on phase transition
- [ ] dismissPhoneCall() called if phone active

**Initialization (main.js):**
- [ ] initPhoneSystem() called during setup
- [ ] getCurrentTime function passed correctly

**Testing:**
- [ ] Space bar dismisses phone (desktop)
- [ ] End button dismisses phone (mobile)
- [ ] Dismissal < 100ms (measured in DevTools)
- [ ] Next call scheduled after dismissal
- [ ] Movement keys don't dismiss phone
- [ ] Auto-dismiss works on game over
- [ ] No console errors

**Code Quality:**
- [ ] All exports are named exports
- [ ] Comments explain key functions
- [ ] Consistent with project-context.md rules

**Common Mistakes to Avoid:**
- ❌ Not clearing phone state on dismissal
- ❌ Space bar scrolls page (missing preventDefault)
- ❌ Movement keys dismiss phone
- ❌ Not scheduling next call after dismissal
- ❌ Forgetting auto-dismiss on game over
- ❌ End button not clickable (z-index issue)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (create-story workflow, dev-story workflow)

### Completion Notes

**Implementation Complete (2026-01-28):**
- ✅ Updated dismissPhoneCall() to accept optional gameState parameter and clear phone state
- ✅ Created handlePhoneDismiss() wrapper function to dismiss and schedule next call
- ✅ Created initPhoneSystem() to initialize End button click listener
- ✅ Added Space bar handler in input.js with highest priority (checked before other inputs)
- ✅ Added event.preventDefault() to prevent page scroll on Space press
- ✅ Added auto-dismiss logic in game.js when transitioning to gameover phase
- ✅ Initialized phone system in main.js during game setup
- ✅ Created comprehensive automated tests in test/phone-dismissal.test.js
- ✅ All acceptance criteria satisfied

**Technical Decisions:**
- dismissPhoneCall() accepts optional gameState parameter for backward compatibility (Stories 3.1 tests)
- Space bar handler has HIGHEST priority in input.js (checked before movement keys)
- event.preventDefault() prevents default Space bar behavior (page scroll)
- handlePhoneDismiss() encapsulates dismissal + scheduling logic for reuse
- initPhoneSystem() called once during game initialization, sets up End button click listener
- End button click only triggers dismissal if phone is active (prevents unnecessary calls)
- Auto-dismiss on game over ensures phone overlay never stays on game over screen
- performance.now() used for getCurrentTime callback consistency
- Dismissal is instant (< 100ms) - simple DOM classList toggles with no animations

**State Management:**
- dismissPhoneCall() sets phoneCall.active = false
- dismissPhoneCall() sets phoneCall.caller = null
- handlePhoneDismiss() calls scheduleNextCall() to set nextCallTime for next call
- Auto-dismiss clears state before transitioning to gameover phase

**Input Priority:**
1. Space bar (if phone active) - dismisses phone
2. Enter/R (if gameover) - restart game
3. Movement keys (if playing) - change snake direction

**Testing:**
- Created automated tests for dismissPhoneCall() state clearing
- Created automated tests for handlePhoneDismiss() dismissal + scheduling
- Created automated tests for initPhoneSystem() End button functionality
- Validated blur effect removal on dismissal
- Validated overlay visibility toggle on dismissal
- Validated next call scheduling after dismissal (15-45s range)
- Manual testing: Press Space bar or click End button to dismiss, verify instant response
- Manual testing: Die during phone call, verify auto-dismiss and game over screen display

**Integration Notes:**
- input.js imports isPhoneCallActive and handlePhoneDismiss from phone.js
- game.js imports dismissPhoneCall from phone.js
- main.js imports initPhoneSystem from phone.js
- Space bar handler uses performance.now() for currentTime (matches game loop)
- End button listener uses getCurrentTime callback (closure over performance.now())

### File List

Files modified/created:
- js/phone.js (modified - updated dismissPhoneCall() signature, added handlePhoneDismiss(), initPhoneSystem())
- js/input.js (modified - added Space bar handler with highest priority, imports from phone.js)
- js/game.js (modified - added auto-dismiss on game over, imports dismissPhoneCall)
- js/main.js (modified - added initPhoneSystem() call during initialization, updated console log to Epic 3)
- test/phone-dismissal.test.js (created - automated tests for dismissal system)
- test/index.html (modified - added phone-dismissal.test.js to test suite)

**Code Review Fixes (2026-01-28):**
- Updated test/phone-dismissal.test.js to use correct 5-15 second timing values (was 15-45)
- Added missing auto-dismiss on game over test case (was not tested)
- Added TODO comment in state.js for menu phase (Epic 4 dependency)
- Updated main.js console log from "Epic 2" to "Epic 3"
- Updated project-context.md to document phone.js state management

