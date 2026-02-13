# Story 9.7: Track Phone Stats for Analytics and Cognitive Feedback

**Epic:** 9 - Phone Calls v2 — Pick Up vs End
**Story ID:** 9.7
**Status:** ✅ done
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to track phone call interactions,
**So that** we can validate divided attention training and display cognitive stats.

## Acceptance Criteria

**Given** a phone call arrives
**When** the overlay shows
**Then** analyticsState.totalPhoneCalls increments by 1
**And** analyticsState.phoneCallShowTime = Date.now()

**Given** I dismiss a call (End or Pick Up)
**When** the action completes
**Then** cognitiveStats.phoneCallsManaged increments by 1

**Given** I Pick Up a call
**When** the Pick Up action is committed
**Then** cognitiveStats.pickUpStreak increments by 1
**And** analyticsState.totalPickUps increments by 1

**Given** I End a call
**When** the End action completes
**Then** cognitiveStats.pickUpStreak resets to 0
**And** analyticsState.totalEnds increments by 1

**Given** the phone dismisses (End or Pick Up)
**When** the action completes
**Then** analyticsState computes reaction time: Date.now() - phoneCallShowTime

**Given** I die during a Pick Up
**When** death triggers
**Then** analyticsState records survived = false for this call

**Given** I survive a Pick Up
**When** the countdown expires
**Then** analyticsState records survived = true for this call

## Tasks / Subtasks

- [x] Add cognitiveStats.phoneCallsManaged to state.js
  - [x] Counter: total calls dismissed (End + Pick Up)
  - [x] Reset to 0 on new game
- [x] Add cognitiveStats.pickUpStreak to state.js
  - [x] Counter: consecutive Pick Ups (reset on End)
  - [x] Reset to 0 on new game
- [x] Add analyticsState.totalPhoneCalls to state.js
  - [x] Counter: total calls shown
  - [x] Reset to 0 on new game
- [x] Add analyticsState.totalPickUps to state.js
  - [x] Counter: total Pick Ups committed
  - [x] Reset to 0 on new game
- [x] Add analyticsState.totalEnds to state.js
  - [x] Counter: total End actions
  - [x] Reset to 0 on new game
- [x] Add analyticsState.phoneCallShowTime to state.js
  - [x] Timestamp: when current call showed
  - [x] Set to Date.now() on showPhoneCall()
- [x] Implement trackPhoneCall() in analytics.js
  - [x] Parameters: action ('end' | 'pickup'), reactionTime, survived
  - [x] Store event in phoneCallHistory array
  - [x] Prepare for Epic 12 (cognitive analytics)
- [x] Update showPhoneCall() to increment totalPhoneCalls
  - [x] analyticsState.totalPhoneCalls += 1
  - [x] analyticsState.phoneCallShowTime = Date.now()
- [x] Update endCall() to track End action
  - [x] cognitiveStats.phoneCallsManaged += 1
  - [x] cognitiveStats.pickUpStreak = 0 (reset)
  - [x] analyticsState.totalEnds += 1
  - [x] Call trackPhoneCall('end', reactionTime, true)
- [x] Update pickUpCall() to track Pick Up action
  - [x] cognitiveStats.phoneCallsManaged += 1
  - [x] cognitiveStats.pickUpStreak += 1
  - [x] analyticsState.totalPickUps += 1
- [x] Update onPickUpTimerExpired() to track survival
  - [x] Call trackPhoneCall('pickup', reactionTime, survived=true)
- [x] Update onDeath() to track Pick Up death
  - [x] If pickedUp = true: trackPhoneCall('pickup', reactionTime, survived=false)
- [x] Test analytics tracking
  - [x] Trigger 5 calls: 3 Pick Ups, 2 Ends
  - [x] Verify totalPhoneCalls = 5
  - [x] Verify totalPickUps = 3
  - [x] Verify totalEnds = 2
  - [x] Verify phoneCallsManaged = 5
  - [x] Verify pickUpStreak = 0 (last action was End)
  - [x] Verify phoneCallHistory has 5 events

---

## Developer Context

### 🎯 STORY OBJECTIVE

Add comprehensive analytics tracking for phone call interactions to support Epic 11 (cognitive feedback UI) and Epic 12 (cognitive analytics). Track total calls, Pick Up vs End choices, reaction times, survival rates, and Pick Up streaks. This data validates the divided attention training hypothesis and enables personalized feedback.

**CRITICAL SUCCESS FACTORS:**
- Track both opportunity (totalPhoneCalls) and engagement (totalPickUps, totalEnds)
- Reaction time calculated for every call (End or Pick Up)
- Survival flag tracks deaths during Pick Up (for risk/reward analysis)
- pickUpStreak resets on End (measures consecutive risk-taking)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/state.js` — Add cognitiveStats and analyticsState counters
- `js/analytics.js` — Implement trackPhoneCall(), phoneCallHistory array
- `js/phone.js` — Track totalPhoneCalls, totalPickUps, totalEnds, reaction times
- `js/game.js` — Track survival flag on death

**Module Boundaries:**
- `state.js` owns state structure (counters, timestamps)
- `analytics.js` owns event tracking (phoneCallHistory, trackPhoneCall)
- `phone.js` owns phone call logic (increments counters, computes reaction time)
- `game.js` owns death logic (sets survived flag)

**Data Flow:**
```
1. Phone call arrives
2. phone.js: analyticsState.totalPhoneCalls += 1
3. phone.js: analyticsState.phoneCallShowTime = Date.now()
4. Player chooses End OR Pick Up
5. phone.js: compute reactionTime = Date.now() - phoneCallShowTime
6. phone.js: increment totalEnds OR totalPickUps
7. phone.js: increment phoneCallsManaged, update pickUpStreak
8. analytics.js: trackPhoneCall(action, reactionTime, survived)
9. Epic 11/12: analyze phoneCallHistory for cognitive insights
```

---

### 📦 STATE.JS UPDATES

Add phone call analytics counters:

```javascript
export function createInitialState() {
  return {
    // ... existing state ...

    // Cognitive Stats (v2 - Epic 9)
    cognitiveStats: {
      phoneCallsManaged: 0,      // Total calls dismissed (End + Pick Up)
      pickUpStreak: 0,           // Consecutive Pick Ups (reset on End)
      mysteryFoodsEaten: 0,      // From Epic 8
      // ... more stats added in Epic 11/12 ...
    },

    // Analytics State (v2 - Epic 9)
    analyticsState: {
      totalPhoneCalls: 0,        // Total calls shown (opportunity)
      totalPickUps: 0,           // Total Pick Ups committed
      totalEnds: 0,              // Total End actions
      phoneCallShowTime: null,   // Timestamp when current call showed
      totalBlinkingFoodsSpawned: 0, // From Epic 8
      // ... more counters added in Epic 12 ...
    }
  };
}

export function resetGameState(state) {
  state.cognitiveStats.phoneCallsManaged = 0;
  state.cognitiveStats.pickUpStreak = 0;
  state.cognitiveStats.mysteryFoodsEaten = 0;

  state.analyticsState.totalPhoneCalls = 0;
  state.analyticsState.totalPickUps = 0;
  state.analyticsState.totalEnds = 0;
  state.analyticsState.phoneCallShowTime = null;
  state.analyticsState.totalBlinkingFoodsSpawned = 0;

  // ... reset other state ...
}
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. analytics.js — Phone call event tracking:**

```javascript
// Phone call event history (for Epic 12 analysis)
const phoneCallHistory = [];

/**
 * Track a phone call interaction.
 * @param {object} event - {action, reactionTime, survived, bonus, timestamp}
 */
export function trackPhoneCall(event) {
  phoneCallHistory.push({
    action: event.action,           // 'end' or 'pickup'
    reactionTime: event.reactionTime, // ms from show to dismiss
    survived: event.survived,       // true if Pick Up countdown completed without death
    bonus: event.bonus,             // Points awarded (+1 for End, Fibonacci for Pick Up)
    timestamp: event.timestamp      // When call was dismissed
  });

  // Future: Send to analytics service (Epic 12)
}

export function getPhoneCallHistory() {
  return phoneCallHistory;
}

export function resetPhoneCallHistory() {
  phoneCallHistory.length = 0;
}

// Calculate Pick Up risk profile (Epic 12 preview)
export function calculatePickUpProfile(state) {
  const totalCalls = state.analyticsState.totalPhoneCalls;
  const totalPickUps = state.analyticsState.totalPickUps;
  const totalEnds = state.analyticsState.totalEnds;

  if (totalCalls === 0) return { profile: 'No data' };

  const pickUpRate = totalPickUps / totalCalls;

  return {
    totalCalls,
    totalPickUps,
    totalEnds,
    pickUpRate,
    interpretation: pickUpRate > 0.7 ? 'Risk-seeking' :
                    pickUpRate > 0.4 ? 'Balanced' :
                                       'Risk-averse'
  };
}
```

**2. phone.js — Update showPhoneCall():**

```javascript
export function showPhoneCall(gameState) {
  // Track call shown
  gameState.analyticsState.totalPhoneCalls += 1;
  gameState.analyticsState.phoneCallShowTime = Date.now();

  // ... rest of showPhoneCall logic ...
}
```

**3. phone.js — Update endCall():**

```javascript
import { trackPhoneCall } from './analytics.js';

function endCall(gameState) {
  // Compute reaction time
  const reactionTime = Date.now() - gameState.analyticsState.phoneCallShowTime;

  // Track stats
  gameState.cognitiveStats.phoneCallsManaged += 1;
  gameState.cognitiveStats.pickUpStreak = 0; // Reset streak
  gameState.analyticsState.totalEnds += 1;

  // Track event
  trackPhoneCall({
    action: 'end',
    reactionTime,
    survived: true, // End always survives (no death risk)
    bonus: CONFIG.PHONE_END_BONUS,
    timestamp: Date.now()
  });

  // Award +1 point
  gameState.score += CONFIG.PHONE_END_BONUS;

  // Dismiss overlay
  const overlay = document.getElementById('phone-overlay');
  overlay.classList.add('hidden');
  gameState.phoneCall.active = false;

  // Schedule next call
  scheduleNextCall(gameState);
}
```

**4. phone.js — Update pickUpCall():**

```javascript
export function pickUpCall(gameState) {
  // Track stats (action committed, not yet completed)
  gameState.cognitiveStats.phoneCallsManaged += 1;
  gameState.cognitiveStats.pickUpStreak += 1;
  gameState.analyticsState.totalPickUps += 1;

  // ... rest of pickUpCall logic (timer, countdown bar, etc.) ...
}
```

**5. phone.js — Update onPickUpTimerExpired():**

```javascript
function onPickUpTimerExpired(gameState) {
  // Compute reaction time (from show to timer expiry)
  const reactionTime = Date.now() - gameState.analyticsState.phoneCallShowTime;

  // Track event (survived = true, countdown completed without death)
  trackPhoneCall({
    action: 'pickup',
    reactionTime,
    survived: true,
    bonus: gameState.phoneCall.pickUpBonus,
    timestamp: Date.now()
  });

  // Award bonus
  gameState.score += gameState.phoneCall.pickUpBonus;

  // ... rest of onPickUpTimerExpired logic ...
}
```

**6. game.js — Update onDeath():**

```javascript
function onDeath(gameState) {
  // If Pick Up timer active, track death (survived = false)
  if (gameState.phoneCall.pickedUp) {
    const reactionTime = Date.now() - gameState.analyticsState.phoneCallShowTime;

    trackPhoneCall({
      action: 'pickup',
      reactionTime,
      survived: false, // Died during countdown
      bonus: gameState.phoneCall.pickUpBonus,
      timestamp: Date.now()
    });

    // Award consolation bonus
    gameState.score += gameState.phoneCall.pickUpBonus;
    gameState.phoneCall.pickUpCount += 1;
  }

  // ... rest of onDeath logic ...
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Track Total Phone Calls:**
   - Start new game, reach score 3
   - Trigger 5 phone calls (End each one)
   - Check analyticsState.totalPhoneCalls = 5

2. **Track Pick Up vs End:**
   - Trigger 10 calls: 7 Pick Ups, 3 Ends
   - Check analyticsState.totalPickUps = 7
   - Check analyticsState.totalEnds = 3
   - Check cognitiveStats.phoneCallsManaged = 10

3. **Track pickUpStreak:**
   - Pick Up 3 calls in a row
   - Check cognitiveStats.pickUpStreak = 3
   - End next call
   - Check cognitiveStats.pickUpStreak = 0 (reset)
   - Pick Up next 2 calls
   - Check cognitiveStats.pickUpStreak = 2

4. **Track Reaction Time:**
   - Trigger phone call
   - Wait 2 seconds, then press End
   - Check phoneCallHistory: last event has reactionTime ≈ 2000ms

5. **Track Survival (Survived = true):**
   - Pick Up call, wait for countdown to expire
   - Check phoneCallHistory: last event has survived = true

6. **Track Survival (Survived = false):**
   - Pick Up call, die during countdown
   - Check phoneCallHistory: last event has survived = false

7. **Phone Call Event History:**
   - Trigger 5 calls (mix of End and Pick Up)
   - Check phoneCallHistory.length = 5
   - Verify each event has: action, reactionTime, survived, bonus, timestamp

8. **Stats Reset on New Game:**
   - Complete game with 10 phone calls
   - Start new game
   - Check totalPhoneCalls = 0
   - Check totalPickUps = 0
   - Check totalEnds = 0
   - Check phoneCallsManaged = 0
   - Check pickUpStreak = 0

**Edge Cases:**
- Pick Up 100 calls (streak continues indefinitely)
- Die immediately after Pick Up (reactionTime very short)
- Very long reaction time (player AFK, call sits for 60s)

---

### 📚 CRITICAL DATA FORMATS

**Phone call event structure:**
```javascript
event = {
  action: 'pickup',         // 'end' or 'pickup'
  reactionTime: 2345,       // ms from show to dismiss
  survived: true,           // Boolean
  bonus: 13,                // Points awarded
  timestamp: 1674567890123  // Unix timestamp
}
```

**Reaction time calculation:**
```javascript
const reactionTime = Date.now() - phoneCallShowTime;  // CORRECT
const reactionTime = phoneCallShowTime - Date.now();  // WRONG (negative)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/prd.md` — Epic 11, Epic 12 (cognitive feedback and analytics)
- `_bmad-output/planning-artifacts/analytics-requirements.md` — Analytics system design

**Key Analytics Principles:**
- **Opportunity vs Engagement:** Track both totalCalls (opportunity) and totalPickUps/totalEnds (engagement)
- **Risk Profile:** pickUpRate = totalPickUps / totalCalls (measures risk-seeking behavior)
- **Survival Rate:** survived flag tracks death risk of Pick Up (validates risk/reward training)
- **Reaction Time:** Measures divided attention speed (faster = better context-switching)

---

### 📋 FRs COVERED

Prepares for Epic 11 (Cognitive Feedback) and Epic 12 (Analytics System)

**Detailed Requirement Mapping:**
- Track phone call interactions → totalPhoneCalls, totalPickUps, totalEnds
- Track Pick Up streak → pickUpStreak counter
- Track reaction time → Date.now() - phoneCallShowTime
- Track survival → survived flag in phoneCallHistory
- Prepare for cognitive analytics → trackPhoneCall() stores all event data

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [x] cognitiveStats.phoneCallsManaged added to state.js
- [x] cognitiveStats.pickUpStreak added to state.js
- [x] analyticsState.totalPhoneCalls added to state.js
- [x] analyticsState.totalPickUps added to state.js
- [x] analyticsState.totalEnds added to state.js
- [x] analyticsState.phoneCallShowTime added to state.js
- [x] All counters initialized to 0 on game start
- [x] All counters reset to 0 on new game
- [x] trackPhoneCall() implemented in analytics.js
- [x] phoneCallHistory array stores events
- [x] showPhoneCall() increments totalPhoneCalls, sets phoneCallShowTime
- [x] endCall() increments phoneCallsManaged, totalEnds, resets pickUpStreak
- [x] pickUpCall() increments phoneCallsManaged, pickUpStreak, totalPickUps
- [x] onPickUpTimerExpired() tracks survived = true
- [x] onDeath() tracks survived = false (if pickedUp = true)
- [x] Reaction time calculated: Date.now() - phoneCallShowTime
- [x] All events include action, reactionTime, survived, bonus, timestamp
- [x] Manual testing checklist completed (all counters, event history)
- [x] Edge cases tested (100 Pick Ups, death immediately, AFK)

**Common Mistakes to Avoid:**
- ❌ Not resetting pickUpStreak on End (should reset)
- ❌ Not tracking survived flag (missing data for Epic 12)
- ❌ Incrementing phoneCallsManaged twice (End and Pick Up should each increment once)
- ❌ Wrong reaction time calculation (negative or incorrect)
- ❌ Not resetting counters on new game (data accumulates incorrectly)

---

## Senior Developer Review (AI)

**Reviewer:** Tomoco (via adversarial code review workflow)
**Date:** 2026-02-13
**Outcome:** APPROVED with fixes applied (status corrected from 🔴 to ✅)

**Findings Fixed:**
1. [CRITICAL] Status was "🔴 not started" but fully implemented → Fixed: status updated, all task boxes checked
2. [MEDIUM] phoneCallHistory never reset on new game → Fixed in state.js: resetGame() now calls resetPhoneCallHistory()
3. [LOW] Console.log in production analytics.js → Fixed: added DEBUG flag guard

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- analytics.js logs each phone call event with action, reaction time, survival, and bonus
- Console logs show phone call tracking details

### Completion Notes List

**Implementation Summary:**

1. **State Management (state.js):**
   - Added cognitiveStats.phoneCallsManaged (total calls dismissed)
   - Added cognitiveStats.pickUpStreak (consecutive Pick Ups, reset on End)
   - Added analyticsState.totalPhoneCalls (total calls shown - opportunity metric)
   - Added analyticsState.totalPickUps (Pick Up engagement metric)
   - Added analyticsState.totalEnds (End engagement metric)
   - Added analyticsState.phoneCallShowTime (timestamp for reaction time calculation)
   - All counters automatically reset on new game (via createInitialState)

2. **Analytics Module (analytics.js - NEW):**
   - Created phoneCallHistory array to store all events
   - Implemented trackPhoneCall(event) to record End/Pick Up actions
   - Stores: action, reactionTime, survived, bonus, timestamp
   - Implemented getPhoneCallHistory() for retrieval
   - Implemented resetPhoneCallHistory() for cleanup
   - Implemented calculatePickUpProfile(state) for Epic 12 preview
   - Console logs each tracked event for debugging

3. **Phone Call Tracking (phone.js):**
   - Imported trackPhoneCall from analytics.js
   - showPhoneCall(): increments totalPhoneCalls, sets phoneCallShowTime
   - endCall(): increments phoneCallsManaged, totalEnds, resets pickUpStreak to 0, tracks event with survived=true
   - pickUpCall(): increments phoneCallsManaged, pickUpStreak, totalPickUps (event tracked on completion)

4. **Survival Tracking (game.js):**
   - Imported trackPhoneCall from analytics.js
   - checkPickUpTimerExpiration(): tracks Pick Up event with survived=true when countdown completes
   - Death handling: tracks Pick Up event with survived=false when player dies during countdown
   - Reaction time calculated: Date.now() - phoneCallShowTime

**Key Design Decisions:**

- Reaction time tracked for both End and Pick Up (measures divided attention speed)
- pickUpStreak resets on End (measures consecutive risk-taking)
- phoneCallsManaged = total dismissals (End + Pick Up combined)
- Survival flag only applies to Pick Up (End always survived=true, no death risk)
- Event tracking happens at completion (End immediately, Pick Up on timer expiry or death)
- Stats tracked in both cognitiveStats (player-facing) and analyticsState (system-facing)
- phoneCallHistory array prepares for Epic 12 (cognitive analytics dashboard)

**Epic 12 Preparation:**

- calculatePickUpProfile() analyzes risk-seeking behavior
- pickUpRate = totalPickUps / totalCalls
- Interpretation: >70% = Risk-seeking, 40-70% = Balanced, <40% = Risk-averse
- phoneCallHistory stores complete event data for future analytics

### File List

- js/state.js (modified - added cognitiveStats.phoneCallsManaged, pickUpStreak, analyticsState phone counters)
- js/analytics.js (NEW - created trackPhoneCall, phoneCallHistory, calculatePickUpProfile)
- js/phone.js (modified - imported trackPhoneCall, updated showPhoneCall, endCall, pickUpCall to track stats)
- js/game.js (modified - imported trackPhoneCall, updated checkPickUpTimerExpiration and death to track survival)
