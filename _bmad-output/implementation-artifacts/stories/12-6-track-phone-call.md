# Story 12.6: Fire trackPhoneCall() on Phone Dismissal

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.6
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to track phone call interactions,
**So that** I can validate divided attention training and Pick Up risk/reward balance.

## Acceptance Criteria

**Given** I dismiss a phone call (End or Pick Up)
**When** the dismissal completes
**Then** analytics.trackPhoneCall(gameState, action) is called
**And** the event includes:
- action ('end' | 'pickup')
- caller_name
- reaction_time_ms (Date.now() - analyticsState.phoneCallShowTime)
- pickup_bonus (Fibonacci value if Pick Up, null if End)
- call_sequence_number (analyticsState.totalPhoneCalls)
- combo_active_during_call (boolean)
- score_at_call

**Given** I Pick Up a call
**When** the countdown expires
**Then** the event records pickup_bonus with the Fibonacci value

**Given** I End a call
**When** the dismissal completes
**Then** the event records action: 'end', pickup_bonus: null

**Given** a phone call occurs during combo mode
**When** the event fires
**Then** combo_active_during_call = true

## Tasks / Subtasks

- [ ] Import trackPhoneCall from analytics.js in game.js
- [ ] Call trackPhoneCall() in phone dismissal handler
  - [ ] Call when Pick Up completes (after countdown)
  - [ ] Call when End completes (immediate)
  - [ ] Pass action ('end' or 'pickup')
- [ ] Verify analyticsState.phoneCallShowTime set
  - [ ] Already implemented in Story 12.2
  - [ ] Set in onPhoneShow()
- [ ] Verify phone properties available
  - [ ] gameState.phone.callerName
  - [ ] gameState.phone.pickupBonus (Fibonacci value)
  - [ ] gameState.score
  - [ ] gameState.combo.active
  - [ ] analyticsState.totalPhoneCalls
- [ ] Test trackPhoneCall() fires on End
  - [ ] Receive phone call
  - [ ] Press End button
  - [ ] Check DevTools → Network tab
  - [ ] Verify 'phone_call' event sent
  - [ ] Verify action = 'end', pickup_bonus = null
- [ ] Test trackPhoneCall() fires on Pick Up
  - [ ] Receive phone call
  - [ ] Press Pick Up button
  - [ ] Wait for countdown to expire
  - [ ] Check DevTools → Network tab
  - [ ] Verify 'phone_call' event sent
  - [ ] Verify action = 'pickup', pickup_bonus = Fibonacci value
- [ ] Test reaction_time_ms calculation
  - [ ] Receive phone call
  - [ ] Wait 2 seconds, press End
  - [ ] Verify reaction_time_ms ~2000ms
- [ ] Test combo_active_during_call flag
  - [ ] Trigger combo mode
  - [ ] Receive phone call during combo
  - [ ] Dismiss call
  - [ ] Verify combo_active_during_call = true

---

## Developer Context

### 🎯 STORY OBJECTIVE

Fire trackPhoneCall() event when the player dismisses a phone call (Pick Up or End). This story captures the core divided attention metric: does the player choose the risky Pick Up (Fibonacci bonus, prolonged distraction) or the safe End (quick dismissal, +1 point)? The reaction_time_ms measures how fast the player dismisses the call — slow reactions indicate attention overwhelm. This event is the foundation for answering "Is the phone system training divided attention?" (Q2).

**CRITICAL SUCCESS FACTORS:**
- trackPhoneCall() fires on BOTH Pick Up and End
- action parameter captures player choice ('end' or 'pickup')
- reaction_time_ms computed from analyticsState.phoneCallShowTime
- pickup_bonus captures Fibonacci value (Pick Up) or null (End)
- combo_active_during_call tracks overlap with combo mode

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/game.js` (or `js/phone.js`) — Call trackPhoneCall() in dismissal handler

**Module Dependencies:**
- `analytics.js` → trackPhoneCall()
- `state.js` → analyticsState.phoneCallShowTime, phone.callerName, phone.pickupBonus, combo.active

**Data Flow:**
```
1. Phone rings → onPhoneShow() sets analyticsState.phoneCallShowTime
2. Player dismisses call (Pick Up or End)
3. game.js/phone.js: onPhoneDismiss(action) called
4. game.js/phone.js: Call trackPhoneCall(gameState, action)
5. analytics.js: Compute reaction_time_ms (Date.now() - phoneCallShowTime)
6. analytics.js: Fire 'phone_call' event with {session_id, action, caller_name, reaction_time_ms, pickup_bonus, call_sequence_number, combo_active_during_call, score_at_call}
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed.

---

### 🎨 IMPLEMENTATION DETAILS

**1. game.js or phone.js — Call trackPhoneCall() in dismissal handler:**

```javascript
import { trackPhoneCall } from './analytics.js';

/**
 * Handle phone dismissal (End or Pick Up).
 * Called when player presses End or Pick Up completes countdown.
 */
function onPhoneDismiss(action, gameState) {
  // Update analyticsState (already implemented in Story 12.2)
  if (action === 'pickup') {
    gameState.analyticsState.totalPickUps += 1;
  } else if (action === 'end') {
    gameState.analyticsState.totalEnds += 1;
  }

  // Track phone call interaction
  trackPhoneCall(gameState, action);

  // Hide phone overlay
  hidePhoneOverlay();

  // Resume game
  gameState.phone.active = false;

  // ... rest of dismissal logic ...
}
```

**2. analytics.js — trackPhoneCall() implementation (from Story 12.3):**

Already implemented in Story 12.3. For reference:

```javascript
export function trackPhoneCall(gameState, action) {
  const reactionTime = Date.now() - gameState.analyticsState.phoneCallShowTime;

  const props = {
    session_id: getSessionId(),
    action: action,  // 'end' or 'pickup'
    caller_name: gameState.phone.callerName || 'Unknown',
    reaction_time_ms: reactionTime,
    pickup_bonus: action === 'pickup' ? gameState.phone.pickupBonus : null,
    call_sequence_number: gameState.analyticsState.totalPhoneCalls,
    combo_active_during_call: gameState.combo?.active || false,
    score_at_call: gameState.score
  };

  track('phone_call', props);
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **trackPhoneCall() Fires on End:**
   - Receive phone call
   - Press End button
   - Check DevTools → Network tab
   - Verify 'phone_call' event sent
   - Verify props: {action: 'end', pickup_bonus: null, reaction_time_ms, caller_name, score_at_call}

2. **trackPhoneCall() Fires on Pick Up:**
   - Receive phone call
   - Press Pick Up button
   - Wait for countdown to expire (3 seconds)
   - Check DevTools → Network tab
   - Verify 'phone_call' event sent
   - Verify props: {action: 'pickup', pickup_bonus: [Fibonacci value], reaction_time_ms, caller_name, score_at_call}

3. **reaction_time_ms Calculation:**
   - Receive phone call
   - Wait exactly 1 second, press End
   - Check reaction_time_ms value (should be ~1000ms)
   - Receive another call
   - Wait 3 seconds, press Pick Up
   - Check reaction_time_ms value (should be ~3000ms)

4. **Fibonacci pickup_bonus Tracking:**
   - Receive first phone call, Pick Up
   - Verify pickup_bonus = 2 (first Fibonacci value)
   - Receive second phone call, Pick Up
   - Verify pickup_bonus = 3 (second Fibonacci value)
   - Receive third phone call, Pick Up
   - Verify pickup_bonus = 5 (third Fibonacci value)

5. **call_sequence_number Tracking:**
   - Receive 3 phone calls
   - Pick Up 1st (call_sequence_number = 1)
   - End 2nd (call_sequence_number = 2)
   - Pick Up 3rd (call_sequence_number = 3)

6. **combo_active_during_call Flag:**
   - Trigger combo mode (10% chance per food)
   - Receive phone call during combo
   - Dismiss call (End or Pick Up)
   - Verify combo_active_during_call = true

7. **Caller Name Tracking:**
   - Receive phone call from "Null Pointerson"
   - Check caller_name prop = "Null Pointerson"
   - Receive call from "Seg Faultman"
   - Check caller_name prop = "Seg Faultman"

**Edge Cases:**
- Dismissing phone call instantly (reaction_time_ms < 100ms)
- Phone call during combo + Pick Up (both flags true)
- Multiple Pick Ups in a row (Fibonacci progression correct)
- Phone call while another effect active (tracked independently)

---

### 📚 CRITICAL DATA FORMATS

**action values:**
```javascript
'end'      // Player pressed End button (+1 point, instant dismissal)
'pickup'   // Player pressed Pick Up (Fibonacci bonus, 3s countdown)
```

**reaction_time_ms calculation:**
```javascript
reaction_time_ms = Date.now() - analyticsState.phoneCallShowTime  // Milliseconds
```

**pickup_bonus values:**
```javascript
// Fibonacci sequence (based on consecutive Pick Ups)
2, 3, 5, 8, 13, 21, 34, 55, ...

// If End pressed:
null
```

**call_sequence_number:**
```javascript
call_sequence_number = analyticsState.totalPhoneCalls  // 1, 2, 3, ...
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/analytics-requirements.md` — phone_call event spec
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — Q2 (divided attention training)
- `_bmad-output/planning-artifacts/design-decisions.md` — Phone Calls v2 (Pick Up vs End design)

**Key Design Principles:**
- **Pick Up rate = engagement metric:** Target 30-50% Pick Up rate (risk/reward balance)
- **reaction_time_ms = attention metric:** Target 800-1500ms for End (fast dismissal)
- **combo_active_during_call = cognitive load:** Phone + combo = peak attention demand
- **Fibonacci progression = reward tracking:** Does bonus increase drive Pick Up behavior?

---

### 📋 FRs COVERED

FR98 (phone_call event)

**Detailed FR Mapping:**
- FR98: Track phone call interactions → trackPhoneCall() called in onPhoneDismiss()

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] trackPhoneCall imported in game.js or phone.js
- [ ] trackPhoneCall() called in onPhoneDismiss() handler
- [ ] action parameter passed ('end' or 'pickup')
- [ ] analyticsState.phoneCallShowTime set in onPhoneShow() (Story 12.2)
- [ ] caller_name prop captured
- [ ] pickup_bonus prop captured (Fibonacci value or null)
- [ ] reaction_time_ms computed (Date.now() - phoneCallShowTime)
- [ ] call_sequence_number captured (totalPhoneCalls)
- [ ] combo_active_during_call flag captured (combo.active)
- [ ] score_at_call captured
- [ ] Event fires on End dismissal
- [ ] Event fires on Pick Up dismissal
- [ ] Fibonacci progression tested (2, 3, 5, 8, ...)
- [ ] reaction_time_ms calculation tested (wait 1s, 3s, etc.)
- [ ] combo_active_during_call tested (phone during combo)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (instant dismissal, combo + pickup, multiple pickups)

**Common Mistakes to Avoid:**
- ❌ Not calling trackPhoneCall() on End (only tracking Pick Up)
- ❌ Calling trackPhoneCall() when phone appears (should call on dismissal)
- ❌ Not computing reaction_time_ms (missing phoneCallShowTime)
- ❌ Wrong action value ('End' vs 'end', 'PickUp' vs 'pickup')
- ❌ Not setting pickup_bonus = null for End (should be null, not 0)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/game.js or js/phone.js (modified - call trackPhoneCall() in onPhoneDismiss() handler)
