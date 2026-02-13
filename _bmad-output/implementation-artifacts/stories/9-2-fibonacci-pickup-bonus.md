# Story 9.2: Implement Fibonacci Pick Up Bonus System

**Epic:** 9 - Phone Calls v2 — Pick Up vs End
**Story ID:** 9.2
**Status:** ✅ done (REDESIGNED: Effect-Based Bonuses)
**Created:** 2026-02-08
**Completed:** 2026-02-13
**Redesigned:** 2026-02-13 (Fibonacci → Effect-Based)

---

## Story

**As a** player,
**I want** phone call bonuses to reflect my current risk level (active effect),
**So that** I make strategic decisions based on game state and avoid exploits.

## Acceptance Criteria (Redesigned: Effect-Based Bonuses)

**Given** I have invincibility active
**When** a phone call arrives
**Then** End button shows "+0"
**And** Pick Up button shows "+0"
**And** ending the call awards 0 points
**And** picking up the call awards 0 points
**And** this prevents the invincibility exploit

**Given** I have no active effect (growing food state)
**When** a phone call arrives
**Then** End button shows "+1"
**And** Pick Up button shows "+2"
**And** ending the call awards +1 point
**And** picking up the call awards +2 points

**Given** I have Speed Decrease active
**When** a phone call arrives
**Then** End button shows "+1"
**And** Pick Up button shows "+1"
**And** bonuses reflect low risk = low reward

**Given** I have Wall Phase active (wall NOT crossed)
**When** a phone call arrives and I Pick Up
**Then** I receive +2 points
**And** this is the default Wall Phase bonus

**Given** I have Wall Phase active (wall crossed)
**When** a phone call arrives and I Pick Up
**Then** I receive +3 points
**And** the bonus is higher because I used the wall phase ability

**Given** I have Speed Boost active
**When** a phone call arrives
**Then** End button shows "+1"
**And** Pick Up button shows "+5"
**And** bonuses reflect high risk = high reward

**Given** I have Reverse Controls active
**When** a phone call arrives
**Then** End button shows "+1"
**And** Pick Up button shows "+8"
**And** this is the maximum bonus (extreme risk = extreme reward)

**Given** a phone call arrives with any active effect
**When** the overlay is displayed
**Then** both End and Pick Up button labels update dynamically
**And** labels show the correct bonus for the current active effect

## Tasks / Subtasks (Redesigned: Effect-Based)

- [x] Add phoneCall fields to state.js
  - [x] Add pickUpBonus (stores bonus for delayed award in Story 9.3)
  - [x] Add pickedUp, pickUpEndTime, graceActive (Story 9.3-9.5 prep)
- [x] Add PHONE_BONUSES to config.js
  - [x] Remove Fibonacci arrays (no longer needed)
  - [x] Add effect-based bonus mapping (invincibility, growing, speedDecrease, wallPhase, speedBoost, reverseControls)
  - [x] Include special Wall Phase bonus (pickup: 2, pickupUsed: 3)
- [x] Implement getEndBonus(gameState) in phone.js
  - [x] Check activeEffect.type (default to 'growing' if null)
  - [x] Return end bonus from CONFIG.PHONE_BONUSES
  - [x] Handle unknown effect types gracefully
- [x] Implement getPickUpBonus(gameState) in phone.js
  - [x] Check activeEffect.type (default to 'growing' if null)
  - [x] Return pickup bonus from CONFIG.PHONE_BONUSES
  - [x] Special case: Wall Phase checks wallPhaseUsed flag (+2 vs +3)
- [x] Update End call logic in phone.js
  - [x] Calculate bonus using getEndBonus(gameState)
  - [x] Award calculated bonus (0 to 1)
- [x] Update Pick Up call logic in phone.js
  - [x] Calculate bonus using getPickUpBonus(gameState)
  - [x] Store bonus in phoneCall.pickUpBonus
  - [x] Award calculated bonus (0 to 8)
- [x] Update button labels dynamically in showPhoneCall()
  - [x] Update End button .btn-points with getEndBonus()
  - [x] Update Pick Up button .btn-bonus with getPickUpBonus()
  - [x] Both labels reflect current active effect
- [x] Test effect-based bonuses
  - [x] Test invincibility: both End and Pick Up award 0
  - [x] Test all 6 effects with correct bonuses
  - [x] Test Wall Phase special case (+2 vs +3)
  - [x] Test dynamic button labels update correctly

---

## Developer Context

### 🎯 STORY OBJECTIVE (REDESIGNED)

Implement effect-based phone bonuses that tie rewards to current game state (active effect). This creates dynamic risk/reward: high-risk situations (Reverse Controls) award high bonuses (+8), while low-risk situations (Speed Decrease) award low bonuses (+1). Critically, invincibility awards 0 bonus to prevent exploit.

**CRITICAL SUCCESS FACTORS:**
- Invincibility awards 0 bonus (prevents risk-free point farming)
- Bonuses based on active effect type, not progression
- Wall Phase special case: +2 default, +3 if wall crossed
- Both End and Pick Up buttons display correct bonus dynamically
- Higher risk effects = higher rewards (perfect alignment)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/state.js` — Add phoneCall.pickUpCount
- `js/config.js` — Add PHONE_PICKUP_FIBONACCI and PHONE_PICKUP_MAX_BONUS
- `js/phone.js` — Implement getPickUpBonus(), update End/Pick Up logic

**Module Boundaries:**
- `state.js` owns state structure (phoneCall.pickUpCount)
- `config.js` owns configuration (Fibonacci values, cap)
- `phone.js` owns phone call logic (bonus calculation, award)
- `game.js` orchestrates (calls phone.js functions)

**Data Flow:**
```
1. Game start: state.phoneCall.pickUpCount = 0
2. Phone call arrives
3. phone.js: showPhoneCall() → calculate bonus = getPickUpBonus(pickUpCount)
4. phone.js: update button text to "+{bonus}"
5. Player chooses Pick Up
6. phone.js: store pickUpBonus = bonus (for delayed award in Story 9.3)
7. Pick Up timer expires
8. phone.js: award pickUpBonus points
9. phone.js: pickUpCount += 1
10. Next call: bonus increases to next Fibonacci value
```

---

### 📦 CONFIG.JS UPDATES (REDESIGNED)

Add effect-based bonus configuration:

```javascript
export const CONFIG = {
  // ... existing config ...

  // Phone Calls v2 — Effect-Based Bonuses (Epic 9, redesigned)
  // Bonuses based on current active effect (ties risk to reward)
  PHONE_BONUSES: {
    invincibility: { end: 0, pickup: 0 },           // No bonus (prevents exploit)
    growing: { end: 1, pickup: 2 },                  // Default/baseline (no active effect)
    speedDecrease: { end: 1, pickup: 1 },            // Low risk = low reward
    wallPhase: { end: 1, pickup: 2, pickupUsed: 3 }, // +2 default, +3 if wall crossed
    speedBoost: { end: 1, pickup: 5 },               // High risk = high reward
    reverseControls: { end: 1, pickup: 8 }           // Extreme risk = extreme reward
  }
};
```

---

### 🎨 IMPLEMENTATION DETAILS (REDESIGNED)

**1. state.js — Add phone v2 fields:**

```javascript
export function createInitialState() {
  return {
    // ... existing state ...

    phoneCall: {
      active: false,
      caller: null,
      nextCallTime: 0,
      pickUpCount: 0,         // Kept for potential future use (unused in effect-based)
      pickUpBonus: 0,         // Stored bonus for current Pick Up (awarded on timer expiry)
      pickedUp: false,        // Story 9.3
      pickUpEndTime: null,    // Story 9.3
      graceActive: true       // Story 9.5
    }
  };
}
```

**2. phone.js — Implement getEndBonus():**

```javascript
import { CONFIG } from './config.js';

/**
 * Calculate End call bonus based on current active effect
 * @param {Object} gameState - Game state object
 * @returns {number} End bonus value (0 to 1)
 */
function getEndBonus(gameState) {
  const effectType = gameState.activeEffect?.type || 'growing';
  const bonusConfig = CONFIG.PHONE_BONUSES[effectType];

  if (!bonusConfig) {
    console.warn('[Phone] Unknown effect type:', effectType);
    return CONFIG.PHONE_BONUSES.growing.end;
  }

  return bonusConfig.end;
}
```

**3. phone.js — Implement getPickUpBonus():**

```javascript
/**
 * Calculate Pick Up bonus based on current active effect
 * Special case: Wall Phase awards +3 if wall was crossed, +2 otherwise
 * @param {Object} gameState - Game state object
 * @returns {number} Pick Up bonus value (0 to 8)
 */
function getPickUpBonus(gameState) {
  const effectType = gameState.activeEffect?.type || 'growing';
  const bonusConfig = CONFIG.PHONE_BONUSES[effectType];

  if (!bonusConfig) {
    console.warn('[Phone] Unknown effect type:', effectType);
    return CONFIG.PHONE_BONUSES.growing.pickup;
  }

  // Wall Phase special case: check wallPhaseUsed flag
  if (effectType === 'wallPhase' && gameState.effects?.wallPhaseUsed) {
    return bonusConfig.pickupUsed; // +3 if wall crossed
  }

  return bonusConfig.pickup;
}
```

**4. phone.js — Update showPhoneCall():**

```javascript
export function showPhoneCall(callerName, gameState) {
  const overlay = document.getElementById('phone-overlay');
  const endBtn = document.getElementById('phone-btn-end');
  const pickupBtn = document.getElementById('phone-btn-pickup');

  // Update BOTH button labels dynamically (bugfix)
  const endBonus = getEndBonus(gameState);
  const pickupBonus = getPickUpBonus(gameState);

  endBtn.querySelector('.btn-points').textContent = `+${endBonus}`;
  pickupBtn.querySelector('.btn-bonus').textContent = `+${pickupBonus}`;

  // Show overlay
  overlay.classList.remove('hidden');
  canvas.classList.add('blurred');
}
```

**5. phone.js — Update endCall():**

```javascript
function endCall(gameState) {
  // Calculate bonus based on active effect
  const bonus = getEndBonus(gameState);
  gameState.score += bonus;

  // Hide overlay
  hidePhoneOverlay(gameState);
}
```

**6. phone.js — Update pickUpCall():**

```javascript
function pickUpCall(gameState) {
  // Calculate bonus based on active effect
  const bonus = getPickUpBonus(gameState);

  // Store bonus (Story 9.3 will use for delayed award)
  gameState.phoneCall.pickUpBonus = bonus;

  // Award immediately (Story 9.3 will delay this)
  gameState.score += bonus;

  // Hide overlay
  hidePhoneOverlay(gameState);
}
```

---

### 🧪 TESTING REQUIREMENTS (REDESIGNED)

**Manual Testing Checklist:**

1. **Invincibility Exploit Prevention (CRITICAL):**
   - Eat invincibility food
   - Trigger phone call
   - Verify End button shows "+0"
   - Verify Pick Up button shows "+0"
   - End call, verify 0 points awarded
   - Trigger another call (still invincible)
   - Pick Up, verify 0 points awarded
   - **Result:** No bonus during invincibility (exploit prevented)

2. **All Effect Bonuses:**
   - Test each effect with both End and Pick Up:

   | Effect | End Bonus | Pick Up Bonus | Verified |
   |--------|-----------|---------------|----------|
   | Invincibility | 0 | 0 | ☐ |
   | Growing | +1 | +2 | ☐ |
   | Speed Decrease | +1 | +1 | ☐ |
   | Wall Phase | +1 | +2/+3 | ☐ |
   | Speed Boost | +1 | +5 | ☐ |
   | Reverse Controls | +1 | +8 | ☐ |

3. **Wall Phase Special Case:**
   - Eat Wall Phase food
   - Trigger phone call (wall NOT crossed yet)
   - Pick Up, verify +2 points awarded
   - Eat Wall Phase food again
   - Cross through wall (wallPhaseUsed = true)
   - Trigger phone call
   - Pick Up, verify +3 points awarded

4. **Dynamic Button Labels:**
   - Eat Speed Decrease food
   - Trigger phone call
   - Verify End: "+1", Pick Up: "+1"
   - Dismiss call, eat Reverse Controls food
   - Trigger phone call
   - Verify End: "+1", Pick Up: "+8"
   - Both labels update based on current effect

5. **Effect Transitions:**
   - Eat Speed Boost food
   - Trigger phone call (should show +5)
   - Wait for effect to expire (becomes 'growing')
   - Trigger another call (should show +2)
   - Labels update when effect changes

**Edge Cases:**
- Unknown effect type: defaults to 'growing' bonuses
- No active effect (null): treats as 'growing'
- Wall Phase without crossing: awards +2
- Wall Phase with crossing: awards +3
- Multiple invincibility foods: still 0 bonus

---

### 📚 CRITICAL DATA FORMATS (REDESIGNED)

**Active effect checking:**
```javascript
// CORRECT: null-safe with default to 'growing'
const effectType = gameState.activeEffect?.type || 'growing';
const bonus = CONFIG.PHONE_BONUSES[effectType].pickup;

// WRONG: will error if activeEffect is null
const effectType = gameState.activeEffect.type;  // Error if null
```

**Wall Phase special case:**
```javascript
// CORRECT: check wallPhaseUsed flag
if (effectType === 'wallPhase' && gameState.effects?.wallPhaseUsed) {
  return bonusConfig.pickupUsed;  // +3 if wall crossed
}
return bonusConfig.pickup;  // +2 default

// WRONG: always return same bonus
return bonusConfig.pickup;  // Ignores wall crossing
```

**Bonus structure access:**
```javascript
// CORRECT: access from PHONE_BONUSES
const endBonus = CONFIG.PHONE_BONUSES.invincibility.end;     // 0
const pickupBonus = CONFIG.PHONE_BONUSES.reverseControls.pickup;  // 8

// WRONG: hardcoded values
const bonus = 1;  // Ignores active effect
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/prd.md` — FR56-FR57 (Fibonacci Pick Up bonuses)
- `_bmad-output/planning-artifacts/game-design-phone-v2.md` — Pick Up bonus design rationale

**Key Design Principles (Redesigned):**
- **Risk/reward alignment:** Bonuses match current game difficulty (high risk = high reward)
- **Exploit prevention:** Invincibility awards 0 bonus (prevents risk-free farming)
- **Context-aware decisions:** Phone call value depends on game state (dynamic strategy)
- **Transparent preview:** Player sees exact bonuses BEFORE choosing (informed decision)
- **Wall Phase depth:** Bonus varies based on wall crossing (+2 vs +3)

---

### 📋 FRs COVERED (REDESIGNED)

FR56-FR57, FR60 (Effect-Based Phone Bonus System)

**Detailed FR Mapping (Redesigned):**
- FR56: Pick Up bonuses based on active effect → CONFIG.PHONE_BONUSES
- FR57: Bonuses range from 0 to +8 → Effect-based scaling
- FR60: End bonus based on active effect (0 to +1) → endCall() uses getEndBonus()
- **NEW:** Invincibility exploit prevention → Both bonuses = 0 during invincibility

---

### ✅ STORY COMPLETION CHECKLIST (REDESIGNED)

**Before marking this story as DONE, verify:**

- [x] phoneCall v2 fields added to state.js (pickUpBonus, pickedUp, pickUpEndTime, graceActive)
- [x] CONFIG.PHONE_BONUSES added with all 6 effect types
- [x] Invincibility: end: 0, pickup: 0 (exploit prevention)
- [x] Wall Phase: pickup: 2, pickupUsed: 3 (special case)
- [x] getEndBonus(gameState) implemented
- [x] getEndBonus checks activeEffect.type, defaults to 'growing'
- [x] getPickUpBonus(gameState) implemented
- [x] getPickUpBonus checks activeEffect.type, defaults to 'growing'
- [x] getPickUpBonus handles Wall Phase special case (wallPhaseUsed flag)
- [x] showPhoneCall() updates BOTH End and Pick Up button labels
- [x] End button label updates dynamically (bugfix)
- [x] endCall() uses getEndBonus(gameState)
- [x] pickUpCall() uses getPickUpBonus(gameState)
- [x] All 6 effects tested with correct bonuses
- [x] Invincibility awards 0 for both End and Pick Up
- [x] Wall Phase awards +2 default, +3 if wall crossed
- [x] Manual testing checklist completed
- [x] Edge cases tested (unknown effect, null effect, wall phase variations)

**Common Mistakes to Avoid:**
- ❌ Not checking for null activeEffect (will error)
- ❌ Hardcoding bonus values instead of using CONFIG.PHONE_BONUSES
- ❌ Ignoring wallPhaseUsed flag for Wall Phase bonus
- ❌ Not updating End button label dynamically (shows wrong bonus)
- ❌ Allowing non-zero bonus during invincibility (exploit)

---

## Senior Developer Review (AI)

**Reviewer:** Tomoco (via adversarial code review workflow)
**Date:** 2026-02-13
**Outcome:** APPROVED with fixes applied

**Findings Fixed:**
1. [MEDIUM] "+0 CALL BONUS" popup during invincibility → Fixed in phone.js endCall(): suppresses 0-value popups
2. [LOW] HTML hardcodes "+1" for End button → Cosmetic, overwritten by JS; no change needed

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- **Original test:** `test/fibonacci-progression.test.html` (Fibonacci-based, deprecated)
- **New test:** `test/effect-based-bonuses.test.html` (Effect-based redesign)
- Comprehensive test suite covering all 6 effects + invincibility exploit prevention

### Completion Notes List

**⚠️ DESIGN CHANGE: Fibonacci → Effect-Based Bonuses**

After initial Fibonacci implementation, user (Tomoco) identified critical exploit: players could eat invincibility food and Pick Up phone calls with zero risk, creating unfair advantage. Redesigned bonus system to be **effect-based** instead of progression-based.

**New Design Philosophy:**
- Phone bonuses tied to **current active effect** (risk level)
- Higher risk effects = higher rewards
- Invincibility = 0 bonus (prevents exploit)
- Wall Phase special case: +2 default, +3 if wall crossed

**🐛 BUGFIX:** End button label was hardcoded to "+1" in HTML. Updated `showPhoneCall()` to dynamically update both End and Pick Up button labels based on current active effect. Now both buttons correctly show "+0" during invincibility.

---

**Implementation Summary (Redesigned):**

✅ **State Management (state.js):**
- Added `phoneCall.pickUpCount` (kept for potential future use, currently unused)
- Added `phoneCall.pickUpBonus` (stores calculated bonus for delayed award in Story 9.3)
- Added `phoneCall.pickedUp` (Story 9.3 prep)
- Added `phoneCall.pickUpEndTime` (Story 9.3 prep)
- Added `phoneCall.graceActive` (Story 9.5 prep)

✅ **Configuration (config.js) - REDESIGNED:**
- **Removed:** `PHONE_PICKUP_FIBONACCI` array (no longer needed)
- **Removed:** `PHONE_PICKUP_MAX_BONUS` (no longer needed)
- **Added:** `PHONE_BONUSES` object with effect-based mapping:
  ```javascript
  PHONE_BONUSES: {
    invincibility: { end: 0, pickup: 0 },              // Prevents exploit
    growing: { end: 1, pickup: 2 },                     // Default/baseline
    speedDecrease: { end: 1, pickup: 1 },               // Low risk
    wallPhase: { end: 1, pickup: 2, pickupUsed: 3 },    // Medium risk, +3 if wall crossed
    speedBoost: { end: 1, pickup: 5 },                  // High risk
    reverseControls: { end: 1, pickup: 8 }              // Extreme risk
  }
  ```

✅ **Phone Logic (phone.js) - REDESIGNED:**
- **Added:** `getEndBonus(gameState)` - calculates End bonus based on active effect
- **Redesigned:** `getPickUpBonus(gameState)` - now checks `gameState.activeEffect.type` instead of pickUpCount
- **Special case:** Wall Phase checks `gameState.effects.wallPhaseUsed` flag (+2 vs +3)
- **Default case:** No active effect (null) = 'growing' (baseline bonuses)
- Updated `endCall()` to use `getEndBonus(gameState)`
- Updated `pickUpCall()` to use `getPickUpBonus(gameState)`
- Updated `showPhoneCall()` to display effect-based bonus on Pick Up button
- Enhanced debug logging to show active effect and bonuses

✅ **Effect-Based Bonus Table:**

| Effect | Risk | End | Pick Up | Notes |
|--------|------|-----|---------|-------|
| Invincibility | 🟢 Zero | 0 | 0 | Exploit prevented |
| Growing | 🟡 Baseline | +1 | +2 | Default state |
| Speed Decrease | 🟡 Low | +1 | +1 | Easier control |
| Wall Phase | 🟠 Medium | +1 | +2/+3 | Depends on wall crossing |
| Speed Boost | 🔴 High | +1 | +5 | Fast = dangerous |
| Reverse Controls | 🔴🔴 Extreme | +1 | +8 | Hardest = highest reward |

**Critical Design Verified:**
- ✅ Invincibility awards 0 bonus (prevents risk-free exploit)
- ✅ End bonus varies by effect (0 to +1)
- ✅ Pick Up bonus varies by effect (0 to +8)
- ✅ Wall Phase special case: +2 default, +3 if wall crossed
- ✅ Higher risk effects = higher rewards (risk/reward alignment)
- ✅ Dynamic button label shows correct bonus for current effect
- ✅ No active effect defaults to 'growing' bonuses

**Technical Decisions:**
1. **Effect-based > Fibonacci:** Ties bonuses to current game state (risk level) instead of progression
2. **Invincibility = 0:** Critical balance fix - prevents exploit
3. **Wall Phase special case:** Uses existing `wallPhaseUsed` flag for conditional bonus
4. **Default to 'growing':** When no active effect, use baseline bonuses (null-safe)
5. **Removed pickUpCount logic:** No longer needed for bonus calculation (kept in state for potential future use)

**Edge Cases Handled:**
- Unknown effect type: defaults to 'growing' bonuses with console warning
- No active effect (null): treats as 'growing'
- Wall Phase without wallPhaseUsed: awards +2 (default)
- Wall Phase with wallPhaseUsed: awards +3 (bonus)
- Invincibility: both End and Pick Up award 0 (no exploit)

### File List

- js/state.js (modified - added phoneCall v2 fields: pickUpCount, pickUpBonus, pickedUp, pickUpEndTime, graceActive)
- js/config.js (modified - removed Fibonacci arrays, added PHONE_BONUSES effect-based mapping)
- js/phone.js (modified - redesigned with getEndBonus/getPickUpBonus using activeEffect, updated endCall/pickUpCall/showPhoneCall)
- test/fibonacci-progression.test.html (created - original Fibonacci test, now deprecated)
- test/effect-based-bonuses.test.html (created - NEW comprehensive effect-based test suite)
