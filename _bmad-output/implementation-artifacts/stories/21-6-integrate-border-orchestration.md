# Story 21.6: Integrate Border Orchestration Across Game Events

**Epic:** 21 - Immersive Arcade Polish (Authenticity & Personality)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** developer completing the border state system
**I want** all game modules to emit border state events to the central orchestrator
**So that** border color accurately reflects game state via priority cascade

---

## Acceptance Criteria

**Given** the reactive border system from Story 21.4 exists
**When** integrating border orchestration
**Then** game.js death handler triggers borderState.set('death', priority: 7)

**And** phone.js ring event triggers borderState.set('phoneRing', priority: 6)
**And** phone.js answer event triggers borderState.set('phoneAnswer', priority: 5)
**And** combo.js start/end events trigger borderState.set('combo', priority: 4) / clear()
**And** effects.js activation triggers borderState.set('effectRC', priority: 3) or borderState.set('effectOther', priority: 2)
**And** default state resolves to score-based default (purple <50, cyan 50+, priority: 1)

**Given** multiple simultaneous states exist (e.g., combo + phone ring)
**When** border state resolves
**Then** highest priority state wins (phone ring priority 6 > combo priority 4)

**Given** a timed state expires (e.g., death flash 0.3s)
**When** state duration completes
**Then** border state manager automatically clears expired state and re-resolves to next highest priority

---

## Technical Notes

- Module: `game.js` (border state manager + orchestration), all event-emitting modules
- Pattern: Border State Orchestration (Pattern 13)
- Dependencies: Stories 20.5 (foundation), 21.4 (7 states)
- State manager API: set(stateName, priority), clear(stateName), resolve() → currentState
- Event-driven design: ~5 border updates per game (NOT 60/sec per-frame polling)
- Reference: Sally's technical addendum - "Border State Orchestration", Winston's Decision 15
- Validation: Play session with all event types, verify priority cascade, measure update frequency

---

## Tasks / Subtasks

### Task 1: Create updateBorderState() Function with Priority Cascade
- [ ] Add `updateBorderState(gameState)` function to `game.js` (after helper functions, before main game loop)
- [ ] Implement priority cascade logic: death (7) > phone ring (6) > phone pickup (5) > combo (4) > RC effect (3) > invincibility (2) > default (1)
- [ ] Clear all border classes first: remove `border-death`, `border-phone-ring`, `border-phone-pickup`, `border-combo`, `border-reverse`, `border-invincibility`
- [ ] Check `gameState.justDied` flag: if true, add `border-death` class, setTimeout to clear after 500ms, return early
- [ ] Check phone states: if `phoneCall.active && !pickedUp`, add `border-phone-ring`, return
- [ ] Check phone pickup: if `phoneCall.pickedUp && pickUpEndTime > Date.now()`, add `border-phone-pickup`, return
- [ ] Check combo: if `combo.active`, add `border-combo` class + set inline `borderColor` to `combo.canvasColor`, return
- [ ] Check effects: if `activeEffect.type === 'reverseControls'`, add `border-reverse`, return
- [ ] Check effects: if `activeEffect.type === 'invincibility'`, add `border-invincibility`, return
- [ ] Default: clear inline `borderColor` style (let CSS default purple take over)
- **Maps to ACs:** "Then border displays 7 colors based on priority", "And state priority cascade ensures highest priority wins"

### Task 2: Add gameState.justDied Flag for Death Flash
- [ ] Add `justDied: false` to initial game state in `state.js` (under `gameState` object)
- [ ] Set `gameState.justDied = true` in `onDeath()` handler in `game.js` (before calling `updateBorderState()`)
- [ ] Add setTimeout in `updateBorderState()` death check: after 500ms, set `justDied = false` and call `updateBorderState()` again
- [ ] Verify death flash duration uses `CONFIG.BORDER_DEATH_FLASH_DURATION` (500ms)
- **Maps to ACs:** "Then border flashes red for 0.3s against dark void"

### Task 3: Integrate Border Updates into Game Event Handlers
- [ ] Add `updateBorderState(gameState)` call in `onDeath()` handler (after setting `justDied = true`)
- [ ] Add `updateBorderState(gameState)` call in `onPhoneCallShow()` handler (after phone state change)
- [ ] Add `updateBorderState(gameState)` call in `onPhoneCallDismiss()` handler (after clearing phone state)
- [ ] Add `updateBorderState(gameState)` call in `onFoodEaten()` handler (after effect changes: `applyEffect()` or `clearEffect()`)
- [ ] Add `updateBorderState(gameState)` call in combo activation handler (after `activateCombo()`)
- [ ] Add `updateBorderState(gameState)` call in combo exit handler (after `exitCombo()`)
- [ ] Add `updateBorderState(gameState)` call in main `update()` loop (for pickup timer expiration check)
- **Maps to ACs:** "Then all game modules emit border events", "And event-driven design achieves ~5 updates/game"

### Task 4: Add CSS Border State Classes
- [ ] Verify CSS file has all 6 border state classes: `.border-death`, `.border-phone-ring`, `.border-phone-pickup`, `.border-combo`, `.border-reverse`, `.border-invincibility`
- [ ] Verify default border: `#game-canvas { border: 8px solid #800080; }`
- [ ] Verify transition rule: `border-color 300ms ease-in-out` (except death: 100ms)
- [ ] Add border color values from `CONFIG.BORDER_COLORS` (if not already present)
- [ ] Verify death flash uses faster transition: `border-color 100ms ease-in`
- **Maps to ACs:** CSS styling for border states, smooth transitions

### Task 5: Add Config Values for Border System
- [ ] Add `BORDER_COLORS` object to `config.js` with 7 color values: `default`, `phoneRing`, `phonePickup`, `invincibility`, `reverseControls`, `death`, `combo` (dynamic)
- [ ] Add `BORDER_DEATH_FLASH_DURATION: 500` to `config.js` (milliseconds)
- [ ] Verify all color values match UX spec: purple `#800080`, gold `#FFD700`, green `#28a745`, yellow `#FFFF00`, orange `#FFA500`, red `#FF0000`
- **Maps to ACs:** Config-driven border colors, death flash duration

### Task 6: Test Border Priority Cascade Scenarios
- [ ] Test normal play → default purple border
- [ ] Test phone ring → gold border (overrides default)
- [ ] Test phone pickup → green border (overrides default)
- [ ] Test combo active + phone ring → gold border wins (priority 6 > 4)
- [ ] Test RC effect + phone ring → gold border wins (priority 6 > 3)
- [ ] Test death during combo → red flash (priority 7), then returns to combo after 500ms
- [ ] Test death during phone pickup → red flash, then returns to green pickup
- [ ] Verify border updates are event-driven: ~5-10 updates per game, NOT 60/sec
- **Maps to ACs:** "Then highest priority state wins", "And event-driven design achieves ~5 updates/game"

---

## Dev Notes

### File Locations
- **Primary file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/game.js`
  - Add `updateBorderState(gameState)` function (around line 200, after helper functions)
  - Update event handlers: `onDeath()`, `onPhoneCallShow()`, `onPhoneCallDismiss()`, `onFoodEaten()`, combo handlers
  - Add `updateBorderState()` call in main `update()` loop (for pickup timer check)
- **State file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/state.js`
  - Add `justDied: false` flag to `gameState` object (under death-related flags)
- **Config file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/config.js`
  - Add `BORDER_COLORS` object with 7 color values
  - Add `BORDER_DEATH_FLASH_DURATION: 500` constant
- **CSS file:** `/Users/anthonysalvi/code/CrazySnakeLite/css/style.css`
  - Add/verify 6 border state classes (`.border-death`, `.border-phone-ring`, etc.)
  - Verify default border + transition rules

### Border State Orchestration Pattern (Event-Driven, NOT Polling)

**Critical design principle:** Border updates are ONLY called when game state changes, NOT every frame.

**Why event-driven matters:**
- Per-frame polling: 60 calls/second (3,600 calls/minute) — unnecessary CPU overhead
- Event-driven: ~5-10 calls/game (only when state changes) — 360x efficiency gain
- Border color changes are rare events: death, phone ring, effect activation, combo entry/exit
- CSS handles the smooth transition animation (300ms), no need for frame-by-frame updates

**Event trigger points (exhaustive list):**
1. **Death:** `onDeath()` handler sets `justDied = true`, calls `updateBorderState()`
2. **Phone ring:** `onPhoneCallShow()` handler sets `phoneCall.active = true`, calls `updateBorderState()`
3. **Phone pickup:** `onPhonePickup()` handler sets `phoneCall.pickedUp = true`, calls `updateBorderState()`
4. **Phone dismiss:** `onPhoneCallDismiss()` handler clears phone state, calls `updateBorderState()`
5. **Combo activation:** `onComboActivate()` handler sets `combo.active = true`, calls `updateBorderState()`
6. **Combo exit:** `onComboExit()` handler sets `combo.active = false`, calls `updateBorderState()`
7. **Effect applied:** `onFoodEaten()` handler calls `applyEffect()`, then `updateBorderState()`
8. **Effect cleared:** `onFoodEaten()` handler calls `clearEffect()`, then `updateBorderState()`
9. **Pickup timer expiration:** Main `update()` loop checks `pickUpEndTime < Date.now()`, calls `updateBorderState()`

**Implementation pattern:**
```javascript
// game.js — Border state orchestration function
function updateBorderState(gameState) {
  const canvas = document.getElementById('game-canvas');

  // Clear all border classes first
  canvas.classList.remove(
    'border-death',
    'border-phone-ring',
    'border-phone-pickup',
    'border-combo',
    'border-reverse',
    'border-invincibility'
  );

  // Priority cascade (highest to lowest)

  // Priority 7: Death flash (temporary override, 500ms)
  if (gameState.justDied) {
    canvas.classList.add('border-death');
    setTimeout(() => {
      gameState.justDied = false;
      updateBorderState(gameState); // Re-evaluate after flash
    }, CONFIG.BORDER_DEATH_FLASH_DURATION);
    return; // Stop evaluation, death wins
  }

  // Priority 6: Phone ring (time-critical decision point)
  if (gameState.phoneCall.active && !gameState.phoneCall.pickedUp) {
    canvas.classList.add('border-phone-ring');
    return;
  }

  // Priority 5: Phone pickup (committed state)
  if (gameState.phoneCall.pickedUp && gameState.phoneCall.pickUpEndTime > Date.now()) {
    canvas.classList.add('border-phone-pickup');
    return;
  }

  // Priority 4: Combo (ambient state)
  if (gameState.combo.active) {
    canvas.classList.add('border-combo');
    // Dynamic color from combo system (matches canvas color)
    canvas.style.borderColor = gameState.combo.canvasColor;
    return;
  }

  // Priority 3: Reverse Controls (danger warning)
  if (gameState.activeEffect?.type === 'reverseControls') {
    canvas.classList.add('border-reverse');
    return;
  }

  // Priority 2: Invincibility (safe state)
  if (gameState.activeEffect?.type === 'invincibility') {
    canvas.classList.add('border-invincibility');
    return;
  }

  // Priority 1: Default purple
  canvas.style.borderColor = ''; // Clear inline style, let CSS default take over
}
```

### Priority Cascade Rationale (from Sally's UX Spec)

**Priority 7 — Death (red `#FF0000`):**
- Most important feedback: visceral, immediate, unmistakable
- Temporary override: flashes red for 500ms, then returns to underlying state
- Visual impact: red flash against dark void (score 100+) is *dramatic*
- Cognitive purpose: unambiguous failure signal, triggers "what went wrong?" reflection

**Priority 6 — Phone ring (gold `#FFD700`):**
- Time-critical decision: player must choose End or Pick Up
- Gold = reward opportunity (Pick Up Fibonacci bonus)
- Peripheral attention grab: "something requires your decision NOW"
- Overrides combo/effects because phone is an active interrupt, not ambient state

**Priority 5 — Phone pickup (green `#28a745`):**
- Committed state: player chose Pick Up, now in blur timer
- Green = "go" signal, matches Pick Up button color (consistent color vocabulary)
- Feedback: "you're committed, focus on survival during blur"
- Overrides combo/effects during the 1-3s blur period

**Priority 4 — Combo (dynamic: purple/blue/red/green):**
- Ambient state: combo can last 3-5 foods (longer duration than phone)
- Border syncs with canvas color for total immersion
- Lower priority than phone because combo doesn't require immediate decision
- Visual coherence: border + canvas both use combo color (unified aesthetic)

**Priority 3 — Reverse Controls (orange `#FFA500`):**
- Danger warning: controls are inverted, cognitive override active
- Orange = universal danger/warning color
- Peripheral reinforcement: player doesn't need to check UI, border screams "RC active"
- Higher priority than invincibility because RC is a challenge, not a safe state

**Priority 2 — Invincibility (yellow `#FFFF00`):**
- Safe state: temporary god mode, no death risk
- Yellow = caution/neutral, not as urgent as orange danger
- Lowest effect priority because invincibility is the "safe" option (Axiom: impulse control training)

**Priority 1 — Default (purple `#800080`):**
- Baseline state: normal play, no active systems
- Purple = matches wall phase food color (visual anchor)
- Always present when no higher priority state is active

### Integration with Existing Game Event Handlers

**Handler 1: onDeath() — Death border flash**
```javascript
function onDeath(gameState) {
  // ... existing death logic (award bonuses, update high score) ...

  // NEW: Trigger death border flash
  gameState.justDied = true;
  updateBorderState(gameState);

  // ... existing logic (build session record, save to storage, show post-game screen) ...
}
```

**Handler 2: onPhoneCallShow() — Phone ring border**
```javascript
function onPhoneCallShow(gameState) {
  // ... existing phone show logic (set active, display overlay) ...

  // NEW: Update border to gold ring
  updateBorderState(gameState);
}
```

**Handler 3: onPhoneCallDismiss() — Return to default/effect border**
```javascript
function onPhoneCallDismiss(gameState) {
  // ... existing phone dismiss logic (clear phone state, hide overlay) ...

  // NEW: Border returns to underlying state (combo/effect/default)
  updateBorderState(gameState);
}
```

**Handler 4: onFoodEaten() — Effect border change**
```javascript
function onFoodEaten(gameState) {
  // ... existing food eaten logic (grow snake, calculate score) ...

  // Track if effect changed
  const effectChanged = (
    (gameState.activeEffect === null && newEffect !== null) ||
    (gameState.activeEffect !== null && newEffect === null) ||
    (gameState.activeEffect?.type !== newEffect?.type)
  );

  // Apply or clear effect
  if (newEffect) {
    applyEffect(gameState, newEffect.type);
  } else {
    clearEffect(gameState);
  }

  // NEW: Update border if effect changed
  if (effectChanged) {
    updateBorderState(gameState);
  }

  // ... existing logic (check combo, spawn food) ...
}
```

**Handler 5: Main update() loop — Pickup timer expiration**
```javascript
function update(gameState) {
  if (gameState.phase !== 'playing') return;

  // ... existing update logic (move snake, check collisions) ...

  // Check pickup timer expiration (border should change from green to default)
  if (gameState.phoneCall.pickedUp && gameState.phoneCall.pickUpEndTime <= Date.now()) {
    // Timer expired, border should revert
    updateBorderState(gameState);
  }
}
```

### CSS Border State Classes

**Required CSS rules (add to `style.css`):**
```css
/* Default border (always present as fallback) */
#game-canvas {
  border: 8px solid #800080;  /* Purple default */
  transition:
    background-color 2000ms ease-in-out,  /* From Story 20.3 */
    border-color 300ms ease-in-out;        /* NEW: border transition */
}

/* Border state classes (priority order 7 → 2) */
#game-canvas.border-death {
  border-color: #FF0000;  /* Red */
  transition: border-color 100ms ease-in;  /* Fast snap for visceral impact */
}

#game-canvas.border-phone-ring {
  border-color: #FFD700;  /* Gold */
}

#game-canvas.border-phone-pickup {
  border-color: #28a745;  /* Green */
}

#game-canvas.border-combo {
  /* border-color set dynamically via JS: gameState.combo.canvasColor */
  /* Transition still applies (300ms) */
}

#game-canvas.border-reverse {
  border-color: #FFA500;  /* Orange */
}

#game-canvas.border-invincibility {
  border-color: #FFFF00;  /* Yellow */
}
```

### Gotchas and Edge Cases

**Gotcha 1: Death flash must return to correct state**
- Problem: After 500ms death flash, border should return to the state that was active when player died (not default purple)
- Solution: `updateBorderState()` is called again after setTimeout, which re-evaluates the priority cascade
- Example: If player dies during phone pickup, border flashes red → then returns to green (pickup state preserved during death animation)

**Gotcha 2: Combo border uses dynamic color**
- Problem: Combo border color is not static — it matches `gameState.combo.canvasColor` (purple/blue/red/green)
- Solution: Set inline `style.borderColor` in addition to adding `.border-combo` class
- CSS transition still applies to inline style changes (300ms smooth fade)

**Gotcha 3: Pickup timer expiration needs border update**
- Problem: Pickup timer expires silently (no explicit event handler), border stuck on green
- Solution: Check `pickUpEndTime` in main `update()` loop, call `updateBorderState()` when timer expires
- This is the ONE case where `update()` loop checks border state (but only when timer is active, not every frame)

**Gotcha 4: Multiple simultaneous states**
- Problem: Combo + phone ring + RC effect all active — which border wins?
- Solution: Priority cascade with early returns — first match wins, stops evaluation
- Example: Phone ring (priority 6) beats combo (priority 4) and RC (priority 3)

**Gotcha 5: Border transition timing**
- Death flash: 100ms transition (fast snap for visceral impact)
- All others: 300ms transition (smooth, not jarring)
- CSS handles transition interpolation automatically, no manual color lerp needed

### Visual Design Notes (from Sally's UX Spec)

**Aesthetic rationale:**
- Reactive border = arcade cabinet bezel (part of game's visual identity, not just a frame)
- Peripheral feedback channel: border communicates state without requiring direct attention
- Color semantics: gold = reward, green = committed, orange = danger, red = death, yellow = safe
- Visual coherence: border colors match existing game vocabulary (gold = high score, orange = RC food, etc.)

**Emotional impact per state:**
- **Death red flash:** Visceral. Against dark void (score 100+), red border flash in absolute darkness is *dramatic*
- **Phone gold pulse:** Excitement. Gold = jackpot opportunity (Fibonacci bonus awaits)
- **Pickup green:** Commitment. "You chose Pick Up, now prove you can survive the blur"
- **Combo sync:** Immersion. Border + canvas both in deep purple/blue/red = total environmental transformation
- **RC orange:** Anxiety. Peripheral warning = "controls are wrong, stay alert"
- **Invincibility yellow:** Relief. Safe haven, temporary respite

**Five-Question Filter validation (from UX spec):**
1. **Working Memory:** Near-zero WM cost — border is peripheral, processed preattentively
2. **Competence Feedback:** Border reacting to events = "the game is responding to me"
3. **Clarity:** Each color is maximally distinct and semantically consistent
4. **Flow Preservation:** Peripheral signals reduce need to check UI (orange border = RC active, no need to look away)
5. **Emotional Impact:** Death flash is the biggest punch — instant, unmistakable, visceral

---

## References

### UX Design Specifications
- **Primary source:** `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade.md`
  - Enhancement 7: Reactive Arcade Bezel Border (lines 671-780)
  - Border State Table: 7 states with rationale (lines 693-706)
  - Priority Resolution: death > phone > combo > effects > default (lines 767-771)
  - Five-Question Filter validation (lines 773-780)

- **Technical implementation:** `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade-technical-addendum.md`
  - Pattern 2: Border State Orchestration (lines 60-170)
  - CSS setup: border state classes + transitions (lines 135-170)
  - Gotcha 3: Border Priority During Death Flash (lines 1158-1173)
  - Module integration: game.js event handler updates (lines 569-617)

### Project Context V4 Patterns
- **Architecture reference:** `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/project-context.md`
  - V4 Border State Pattern (lines 362-382): Event-driven ONLY, NEVER poll in game loop
  - Priority cascade pattern: death > phone > combo > effects > default
  - Module boundaries: Border orchestration in game.js (line 481)

### Functional Requirements
- **FR-V3-7:** Reactive Border 7 States — border color reflects game state via priority cascade (death red, phone gold/green, combo sync, effects orange/yellow, default purple)
- **FR-V3-12:** Event-Driven Border — border updates triggered by game events (~5-10/game), NOT per-frame polling (60/sec)
- **NFR-V3-5:** Visual Coherence — border colors match existing game vocabulary (gold = reward, orange = danger, etc.)

### Code References
- **Existing game handlers:** `/Users/anthonysalvi/code/CrazySnakeLite/js/game.js`
  - `onDeath()` handler (around line 300): death bonus awarding
  - `onPhoneCallShow()` handler: phone ring display logic
  - `onPhoneCallDismiss()` handler: phone dismiss cleanup
  - `onFoodEaten()` handler (around line 150): effect application
  - Main `update()` loop (around line 80): game state updates
- **Existing config:** `/Users/anthonysalvi/code/CrazySnakeLite/js/config.js`
  - Pattern: add `BORDER_COLORS` object with 7 color values
  - Pattern: add `BORDER_DEATH_FLASH_DURATION: 500` constant
- **Existing CSS:** `/Users/anthonysalvi/code/CrazySnakeLite/css/style.css`
  - Canvas border: already exists at `border: 8px solid #800080`
  - Transition: needs addition of `border-color 300ms ease-in-out`
