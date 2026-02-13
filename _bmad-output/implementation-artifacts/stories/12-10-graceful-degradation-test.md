# Story 12.10: Test Graceful Degradation and Performance

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.10
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to verify analytics never blocks gameplay,
**So that** players have a flawless experience even if tracking fails.

## Acceptance Criteria

**Given** Plausible script is blocked by ad-blocker
**When** the game runs
**Then** no console errors appear
**And** the game plays at 60 FPS
**And** all gameplay features work normally

**Given** CONFIG.ANALYTICS_ENABLED = false
**When** any analytics function is called
**Then** the function returns immediately (no-op)
**And** no events are sent

**Given** analytics events fire during gameplay
**When** the game is running
**Then** frame rate remains at 60 FPS
**And** no perceptible lag occurs

**Given** trackGameOver() is called with a full state snapshot
**When** the event fires
**Then** the event completes in < 5ms (non-blocking)

## Tasks / Subtasks

- [ ] Test Plausible script blocked
  - [ ] Open DevTools → Network tab
  - [ ] Block plausible.io domain
  - [ ] Reload game
  - [ ] Verify no console errors
  - [ ] Play game for 60 seconds
  - [ ] Verify 60 FPS maintained
  - [ ] Verify all features work (food, phone, effects, combo)
- [ ] Test CONFIG.ANALYTICS_ENABLED = false
  - [ ] Set CONFIG.ANALYTICS_ENABLED = false in config.js
  - [ ] Play game
  - [ ] Check DevTools → Network tab
  - [ ] Verify no events sent to Plausible
  - [ ] Verify no console errors
  - [ ] Verify game works normally
- [ ] Test analytics performance (non-blocking)
  - [ ] Add console.time() around trackGameOver() call
  - [ ] Play game, die
  - [ ] Check console for timing
  - [ ] Verify trackGameOver() completes in < 5ms
- [ ] Test frame rate with analytics active
  - [ ] Enable FPS counter (browser DevTools → Rendering)
  - [ ] Play game with analytics enabled
  - [ ] Eat 20 foods (20 trackFoodEaten events)
  - [ ] Answer 5 phone calls (5 trackPhoneCall events)
  - [ ] Verify FPS stays at 60 (no drops)
- [ ] Test graceful degradation scenarios
  - [ ] Network offline (Plausible unreachable)
  - [ ] Plausible domain blocked by ad-blocker
  - [ ] Plausible script fails to load (404)
  - [ ] sessionStorage disabled (privacy mode)
  - [ ] window.plausible undefined
- [ ] Document graceful degradation behavior
  - [ ] List all failure modes tested
  - [ ] Confirm game works in all scenarios
  - [ ] Note acceptable trade-offs (events lost, acceptable)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Validate that analytics NEVER breaks the game. This story is pure QA — test every failure mode, every edge case, every performance concern. The game MUST run at 60 FPS even if Plausible is blocked, disabled, offline, or broken. Analytics is a "nice to have" — the game is the "must have". If analytics fails, the player should never know. No console errors, no lag, no visible impact. This story is CRITICAL for production readiness.

**CRITICAL SUCCESS FACTORS:**
- Game works perfectly when Plausible blocked
- No console errors in any failure scenario
- 60 FPS maintained with analytics active
- trackGameOver() completes in < 5ms (non-blocking)
- CONFIG.ANALYTICS_ENABLED = false disables all tracking
- All gameplay features work regardless of analytics state

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Test:**
- `js/analytics.js` — All track functions
- `js/config.js` — CONFIG.ANALYTICS_ENABLED toggle
- `index.html` — Plausible script loading

**Testing Strategy:**
- **Blackbox testing:** Test from player perspective
- **Performance testing:** FPS counter, console.time()
- **Failure injection:** Block domains, disable features, break scripts
- **Edge case testing:** sessionStorage disabled, network offline, ad-blockers

---

### 📦 CONFIG.JS UPDATES

No config changes needed (CONFIG.ANALYTICS_ENABLED already exists).

---

### 🎨 IMPLEMENTATION DETAILS

**1. Testing Plausible Script Blocked:**

**Steps:**
1. Open browser DevTools → Network tab
2. Right-click → Block Request Domain → `plausible.io`
3. Reload game
4. Play for 60 seconds
5. Check console for errors
6. Check FPS counter (should be 60)
7. Test all features: food, phone, effects, combo

**Expected Behavior:**
- No console errors
- Game runs at 60 FPS
- All features work normally
- No analytics events sent (expected, acceptable)

---

**2. Testing CONFIG.ANALYTICS_ENABLED = false:**

**Steps:**
1. Edit `config.js`: `ANALYTICS_ENABLED: false`
2. Reload game
3. Play game
4. Check DevTools → Network tab → Filter by `plausible`
5. Verify no requests to Plausible

**Expected Behavior:**
- No events sent to Plausible
- No console errors
- Game works normally
- track() functions return immediately (no-op)

---

**3. Testing Analytics Performance:**

Add timing code to `game.js`:

```javascript
function onDeath(gameState) {
  // ... capture death context ...

  // Measure trackGameOver() performance
  console.time('trackGameOver');
  trackGameOver(gameState);
  console.timeEnd('trackGameOver');  // Should be < 5ms

  // ... rest of death logic ...
}
```

**Expected Behavior:**
- `trackGameOver: 2.3ms` (or similar, < 5ms)
- No perceptible lag
- Game continues immediately after death

---

**4. Testing Frame Rate:**

**Steps:**
1. Open DevTools → More Tools → Rendering
2. Enable "Frame Rendering Stats" (shows FPS)
3. Play game with analytics enabled
4. Eat 20 foods rapidly (fire 20 trackFoodEaten events)
5. Answer 5 phone calls (fire 5 trackPhoneCall events)
6. Monitor FPS counter

**Expected Behavior:**
- FPS stays at 60 (±2) throughout
- No FPS drops when events fire
- No visible lag or stutter

---

**5. Graceful Degradation Scenarios:**

Test these failure modes:

| Scenario | Test Method | Expected Behavior |
|----------|-------------|-------------------|
| Plausible blocked by ad-blocker | Block domain in DevTools | Game works, no errors |
| Network offline | DevTools → Network → Offline | Game works, events buffered then lost |
| Plausible script 404 | Modify script URL to invalid | Game works, no errors |
| sessionStorage disabled | Private browsing mode | New UUID each call, game works |
| window.plausible undefined | Block script, call track() | Returns immediately, no errors |
| CONFIG.ANALYTICS_ENABLED = false | Set flag to false | No events sent, game works |

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Plausible Script Blocked:**
   - [ ] Block plausible.io in DevTools
   - [ ] Reload game
   - [ ] No console errors
   - [ ] Game plays normally
   - [ ] 60 FPS maintained
   - [ ] All features work (food, phone, effects, combo)

2. **CONFIG.ANALYTICS_ENABLED = false:**
   - [ ] Set flag to false in config.js
   - [ ] Reload game
   - [ ] No events sent (check Network tab)
   - [ ] No console errors
   - [ ] Game works normally

3. **Analytics Performance (Non-Blocking):**
   - [ ] Add console.time() around trackGameOver()
   - [ ] Die
   - [ ] Check timing: < 5ms
   - [ ] No perceptible lag

4. **Frame Rate (60 FPS):**
   - [ ] Enable FPS counter
   - [ ] Play game, eat 20 foods
   - [ ] FPS stays at 60 (±2)
   - [ ] No drops when events fire

5. **Graceful Degradation Scenarios:**
   - [ ] Network offline → Game works
   - [ ] Plausible 404 → Game works
   - [ ] sessionStorage disabled → Game works (new UUID each call)
   - [ ] window.plausible undefined → Game works
   - [ ] All scenarios: No console errors

6. **Load Time Impact:**
   - [ ] Measure page load time with analytics (DevTools → Performance)
   - [ ] Measure page load time without analytics
   - [ ] Verify difference < 100ms (async script)

**Edge Cases:**
- Rapid event firing (20 foods in 10 seconds)
- Large state snapshot (trackGameOver with 100+ foods eaten)
- Multiple tabs open (each has separate session)
- Browser tab in background (events may be throttled, acceptable)

---

### 📚 CRITICAL DATA FORMATS

**Guard clauses in track():**

```javascript
// CORRECT (graceful degradation)
function track(eventName, props) {
  if (!CONFIG.ANALYTICS_ENABLED) return;  // Check config first
  if (typeof window.plausible === 'undefined') return;  // Check Plausible loaded
  window.plausible(eventName, { props });  // Fire event
}

// WRONG (throws errors)
function track(eventName, props) {
  window.plausible(eventName, { props });  // ERROR if Plausible not loaded
}
```

**Performance target:**
```javascript
console.time('trackGameOver');
trackGameOver(gameState);
console.timeEnd('trackGameOver');
// Output: "trackGameOver: 2.3ms" (< 5ms = PASS)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/analytics-requirements.md` — Non-blocking requirement
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — Graceful degradation spec

**Key Design Principles:**
- **Game first, analytics second:** Analytics is optional, gameplay is mandatory
- **Fire-and-forget:** No awaits, no blocking, no error handling
- **Graceful degradation:** Fail silently, never crash
- **Performance:** < 5ms per event, 60 FPS maintained

---

### 📋 FRs COVERED

NFR (Non-Functional Requirement): Non-blocking, graceful degradation, performance

**Detailed FR Mapping:**
- NFR: Analytics never blocks gameplay → Guard clauses, fire-and-forget, async script

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] Plausible blocked test: Game works, no errors, 60 FPS
- [ ] CONFIG.ANALYTICS_ENABLED = false test: No events sent, game works
- [ ] Performance test: trackGameOver() < 5ms
- [ ] Frame rate test: 60 FPS with analytics active
- [ ] Network offline test: Game works
- [ ] Plausible 404 test: Game works
- [ ] sessionStorage disabled test: Game works (new UUID each call)
- [ ] window.plausible undefined test: Game works
- [ ] All scenarios: No console errors
- [ ] Load time impact: < 100ms difference
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (rapid events, large snapshot, multiple tabs)
- [ ] Documentation: List of tested failure modes

**Common Mistakes to Avoid:**
- ❌ Not testing with ad-blocker (most common real-world failure)
- ❌ Not testing CONFIG.ANALYTICS_ENABLED = false (dev mode critical)
- ❌ Not measuring performance (trackGameOver() could be slow)
- ❌ Not checking FPS counter (analytics could cause frame drops)
- ❌ Assuming analytics always works (must test all failure modes)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/analytics.js (tested - all track functions, guard clauses)
- js/config.js (tested - ANALYTICS_ENABLED toggle)
- index.html (tested - Plausible script loading)
- js/game.js (tested - trackGameOver() performance)
