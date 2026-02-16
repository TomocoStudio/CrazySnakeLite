# Calibration State Persistence - Manual Test Suite

**Epic:** 15 - Calibration Period System
**Story:** 15.7 - Test Calibration State Persistence
**Purpose:** Validate that calibration state persists correctly across browser sessions
**Date:** 2026-02-16

---

## Overview

This test suite validates the persistence behavior of the calibration system implemented in Stories 15.1-15.6. The calibration state must survive browser restarts, handle storage failures gracefully, and maintain independence between localStorage (profile) and IndexedDB (session history).

### Storage Architecture

**localStorage** (Profile State):
- Key: `crazysnakeLite_profile`
- Contains: calibrationComplete, sessionsCompleted, celebrationShown, baselineMetrics
- Persists: Indefinitely (durable storage)

**IndexedDB** (Session History):
- Database: `CrazySnakeMetrics`
- Store: `sessions`
- Contains: Full session records with metrics and raw events
- Persists: Up to 100 sessions (pruned automatically)

---

## Test Scenarios

### Scenario 1: Cross-Session Persistence (Browser Restart)

**Objective:** Verify calibration progress persists across browser restarts

**Prerequisites:**
- Fresh browser session (no existing game data)
- Browser: Chrome, Firefox, Safari, or Edge

**Steps:**

1. **Start Initial Session**
   - Open game in browser
   - Click "New Game"
   - Play until death (Session 1)
   - Verify post-game counter shows: **"Session 1/5 — Warming up..."**

2. **Continue Calibration**
   - Click "Play Again"
   - Play until death (Session 2)
   - Verify post-game counter shows: **"Session 2/5 — Warming up..."**

3. **Close Browser**
   - Close browser tab completely (Cmd+W / Ctrl+W or X button)
   - Wait 5 seconds

4. **Reopen Browser**
   - Open new browser tab
   - Navigate to game URL
   - Click "New Game"
   - Play until death (Session 3)

5. **Verify Persistence**
   - Post-game counter should show: **"Session 3/5 — Warming up..."**
   - Counter should NOT reset to "Session 1/5"

**Verification Steps:**

```javascript
// Open DevTools (F12) → Console
// Check localStorage
const profile = JSON.parse(localStorage.getItem('crazysnakeLite_profile'));
console.log('sessionsCompleted:', profile.sessionsCompleted); // Should be 3
console.log('calibrationComplete:', profile.calibrationComplete); // Should be false
```

**Expected Result:** ✅ PASS if counter shows "Session 3/5" after browser restart

**Common Issues:**
- Counter resets to 1/5: localStorage not persisting (check browser settings)
- No counter displayed: calibration system not initializing (check console errors)

---

### Scenario 2: Calibration Complete Persistence

**Objective:** Verify calibration unlock persists after session 5

**Prerequisites:**
- Fresh browser session or continue from Scenario 1 (at session 3/5)

**Steps:**

1. **Complete Calibration**
   - Continue playing until session 4 complete
   - Verify counter: **"Session 4/5 — Warming up..."**
   - Play session 5 until death
   - Verify celebration message: **"🎉 Your Skill Map is ready! 🎉"**
   - Verify Skill Map button is enabled (not greyed out)

2. **Close Without Clicking Skill Map**
   - Do NOT click the "Skill Map" button
   - Stay on game-over screen
   - Close browser tab completely
   - Wait 5 seconds

3. **Reopen Browser**
   - Open new browser tab
   - Navigate to game URL
   - Check main menu screen

4. **Verify Unlock Persisted**
   - Menu button shows: **"🎯 Skill Map"** (no lock icon)
   - Button is clickable (not greyed out)
   - Skill Map button accessible

5. **Verify Celebration Not Repeated**
   - Click "New Game"
   - Play until death (Session 6)
   - Post-game footer shows: **Streak counter** (NOT celebration)
   - Celebration does NOT display again

**Verification Steps:**

```javascript
// Open DevTools (F12) → Console
// Check calibration state
const profile = JSON.parse(localStorage.getItem('crazysnakeLite_profile'));
console.log('calibrationComplete:', profile.calibrationComplete); // Should be true
console.log('sessionsCompleted:', profile.sessionsCompleted); // Should be 5 or 6
console.log('celebrationShown:', profile.celebrationShown); // Should be true
console.log('baselineMetrics:', profile.baselineMetrics); // Should be object with 6 domains
```

**Expected Results:**
- ✅ calibrationComplete = true persists
- ✅ Skill Map unlocked in menu
- ✅ Celebration does NOT repeat on session 6

**Common Issues:**
- Lock icon still shows: calibrationComplete flag not set (check game.js onDeath flow)
- Celebration repeats: celebrationShown flag not persisting (check Story 15.4)

---

### Scenario 3: localStorage Wipe Recovery

**Objective:** Verify game handles localStorage deletion gracefully

**Prerequisites:**
- Calibration in progress (sessions 1-3 complete)
- Browser DevTools access

**Steps:**

1. **Complete Partial Calibration**
   - Play and complete sessions 1, 2, 3
   - Verify counter shows: **"Session 3/5 — Warming up..."**

2. **Check localStorage**
   - Open DevTools (F12)
   - Navigate to: Application → Storage → Local Storage
   - Find domain (e.g., `http://localhost:5173`)
   - Locate key: `crazysnakeLite_profile`
   - Verify value shows `"sessionsCompleted": 3`

3. **Delete localStorage Profile**
   - Right-click `crazysnakeLite_profile`
   - Select "Delete"
   - Confirm deletion

4. **Refresh Page**
   - Press Cmd+R / Ctrl+R or F5
   - Game should reload

5. **Verify Fresh State**
   - Click "New Game"
   - Play until death
   - Verify counter shows: **"Session 1/5 — Warming up..."** (reset to 1)

6. **Check IndexedDB Independence**
   - DevTools → Application → IndexedDB
   - Expand `CrazySnakeMetrics` → `sessions` store
   - Verify: Old session records still exist (sessions 1-3 from before)

**Verification Steps:**

```javascript
// After deletion and new session 1:
const profile = JSON.parse(localStorage.getItem('crazysnakeLite_profile'));
console.log('sessionsCompleted:', profile.sessionsCompleted); // Should be 1 (reset)
console.log('calibrationComplete:', profile.calibrationComplete); // Should be false

// Check IndexedDB separately (manual inspection in DevTools)
// Should show 4 sessions: old (1-3) + new (1)
```

**Expected Results:**
- ✅ Profile resets to session 1/5
- ✅ Calibration starts over
- ✅ IndexedDB sessions persist (separate storage)

**Common Issues:**
- Game crashes: Missing null checks in getProfile() (check storage.js)
- IndexedDB also cleared: User cleared all site data (expected behavior)

---

### Scenario 4: Private Browsing Fallback (Optional Enhancement)

**Objective:** Verify game behavior in private/incognito mode

**Prerequisites:**
- Browser supports private browsing (Chrome Incognito, Firefox Private, Safari Private)

**Steps:**

1. **Open Private Browsing Window**
   - Chrome: Cmd+Shift+N (macOS) or Ctrl+Shift+N (Windows)
   - Firefox: Cmd+Shift+P (macOS) or Ctrl+Shift+P (Windows)
   - Safari: Cmd+Shift+N
   - Navigate to game URL

2. **Play Session 1**
   - Click "New Game"
   - Play until death
   - Verify counter shows: **"Session 1/5 — Warming up..."**

3. **Check for Warning (If Implemented)**
   - Look for warning banner or message
   - Expected (if implemented): **"Private browsing: calibration progress not saved across sessions"**

4. **Continue to Session 2**
   - Click "Play Again"
   - Play until death
   - Verify counter shows: **"Session 2/5"** (persists within same private window)

5. **Close Private Window**
   - Close private browsing window completely
   - Wait 5 seconds

6. **Open NEW Private Window**
   - Open new private/incognito window
   - Navigate to game URL
   - Click "New Game"
   - Play until death

7. **Verify Reset**
   - Counter should show: **"Session 1/5"** (reset, no persistence across private windows)

**Verification Steps:**

```javascript
// In private browsing console:
// Check if localStorage is available
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage: AVAILABLE');
} catch (e) {
  console.log('localStorage: BLOCKED (Safari Private)');
}

// Check storage type used
const profile = JSON.parse(localStorage.getItem('crazysnakeLite_profile') || sessionStorage.getItem('crazysnakeLite_profile'));
console.log('Profile:', profile);
```

**Expected Results:**
- ✅ Chrome/Firefox: localStorage works in private mode, cleared on window close
- ✅ Safari: localStorage throws error, should fallback to sessionStorage
- ⚠️ **Optional**: Warning message displayed (not required for MVP)

**Browser-Specific Behaviors:**
- **Chrome Incognito:** localStorage available, cleared on last private tab close
- **Firefox Private:** localStorage available, cleared on private window close
- **Safari Private:** localStorage disabled entirely (throws SecurityError)
- **Edge InPrivate:** localStorage available, cleared on window close

**Common Issues:**
- Safari crashes: localStorage.setItem() throws, needs try/catch (check storage.js)
- Warning not showing: Optional enhancement, not implemented yet (expected)

---

### Scenario 5: IndexedDB + localStorage Independence

**Objective:** Verify IndexedDB and localStorage operate independently

**Prerequisites:**
- Calibration complete (session 5 finished)
- Browser DevTools access

**Steps:**

1. **Complete Calibration Fully**
   - Play and complete sessions 1-5
   - Verify: Skill Map unlocked, celebration shown
   - Verify: `calibrationComplete: true` in localStorage
   - Verify: 5 session records in IndexedDB

2. **Check Both Storage Systems**
   - DevTools → Application → Local Storage
     - Verify `crazysnakeLite_profile` exists
     - Verify `calibrationComplete: true`
   - DevTools → Application → IndexedDB → CrazySnakeMetrics → sessions
     - Verify 5 session records exist

3. **Delete ONLY localStorage**
   - Right-click `crazysnakeLite_profile` → Delete
   - Do NOT touch IndexedDB
   - Confirm localStorage key is gone

4. **Refresh Page**
   - Press Cmd+R / Ctrl+R or F5
   - Game reloads

5. **Verify Profile Reset**
   - Main menu button shows: **"🔒 Skill Map (Session 0/5)"** (lock icon returned)
   - Calibration state reset to 0/5
   - Skill Map no longer accessible

6. **Verify IndexedDB Intact**
   - DevTools → Application → IndexedDB → CrazySnakeMetrics → sessions
   - Verify: 5 session records still exist
   - Old session data NOT deleted

7. **Complete New Session**
   - Click "New Game"
   - Play until death
   - Verify counter shows: **"Session 1/5"** (starting calibration over)

8. **Check Session Count**
   - DevTools → IndexedDB → sessions
   - Verify: 6 session records total (5 old + 1 new)

**Verification Steps:**

```javascript
// After localStorage deletion:
const profile = JSON.parse(localStorage.getItem('crazysnakeLite_profile'));
console.log('calibrationComplete:', profile.calibrationComplete); // false (reset)
console.log('sessionsCompleted:', profile.sessionsCompleted); // 1 (new calibration)

// IndexedDB check (manual in DevTools Application tab):
// CrazySnakeMetrics → sessions should show 6 records
// Old sessions (1-5) + new session (1 of new calibration)
```

**Expected Results:**
- ✅ Profile resets when localStorage deleted
- ✅ IndexedDB sessions persist (separate storage)
- ✅ Player must complete 5 new calibration sessions
- ✅ Old session data still accessible (if queried)

**Implications:**
- Two storage systems have independent lifecycles
- Deleting localStorage requires re-calibration, but doesn't lose session history
- Not a typical user scenario (requires DevTools manipulation)

**Common Issues:**
- IndexedDB also cleared: User cleared all site data (check DevTools → Clear storage)
- Game crashes: Missing null checks when IndexedDB queries fail (check storage.js)

---

### Scenario 6: Baseline Metrics Persistence

**Objective:** Verify baseline metrics persist after session 5

**Prerequisites:**
- Calibration in progress (sessions 1-4 complete)

**Steps:**

1. **Complete Session 5**
   - Play until death on session 5
   - Verify celebration displays
   - Wait 2 seconds for baseline calculation

2. **Check Baseline Stored**
   - DevTools (F12) → Console
   - Look for: `[Story 15.6] Baseline established after session 5: {...}`

3. **Verify Baseline in localStorage**
   ```javascript
   const profile = JSON.parse(localStorage.getItem('crazysnakeLite_profile'));
   console.log('baselineMetrics:', profile.baselineMetrics);
   ```
   - Should show object with 6 domains
   - Each domain: number (0-1) or null (insufficient data)

4. **Close and Reopen Browser**
   - Close browser tab
   - Wait 5 seconds
   - Reopen browser, navigate to game

5. **Verify Baseline Persists**
   ```javascript
   const profile = JSON.parse(localStorage.getItem('crazysnakeLite_profile'));
   console.log('baselineMetrics:', profile.baselineMetrics);
   // Should be identical to before browser restart
   ```

6. **Play Session 6**
   - Click "New Game"
   - Play until death
   - Verify: Baseline does NOT recalculate (no console message)

7. **Verify Baseline Unchanged**
   ```javascript
   // After session 6:
   const profile = JSON.parse(localStorage.getItem('crazysnakeLite_profile'));
   console.log('baselineMetrics:', profile.baselineMetrics);
   // Should be identical to session 5 baseline (not recalculated)
   ```

**Expected Results:**
- ✅ Baseline calculated after session 5
- ✅ Baseline persists across browser restart
- ✅ Baseline NOT recalculated on sessions 6+
- ✅ Baseline values correct (simple average of 5 sessions)

**Common Issues:**
- Baseline null: Async calculation not awaited (check game.js saveSessionMetrics)
- Baseline recalculates: Missing check for existing baseline (check game.js line 399)

---

## Verification Checklists

### Pre-Test Setup

- [ ] Browser: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- [ ] DevTools enabled (F12 or right-click → Inspect)
- [ ] No existing game data (clear storage before first test)
- [ ] Console visible for logging output
- [ ] Application tab accessible for storage inspection

### During Testing

- [ ] Note browser version and OS
- [ ] Check console for error messages
- [ ] Verify localStorage updates after each session
- [ ] Verify IndexedDB sessions saved correctly
- [ ] Screenshot any unexpected behavior

### Post-Test Verification

- [ ] All acceptance criteria met
- [ ] No console errors or warnings
- [ ] Storage values match expected schema
- [ ] Cross-browser compatibility verified
- [ ] Edge cases documented

---

## Browser Compatibility Matrix

| Browser | Version | localStorage | IndexedDB | Private Mode | Notes |
|---------|---------|--------------|-----------|--------------|-------|
| Chrome | 121+ | ✅ | ✅ | ✅ | localStorage cleared on incognito close |
| Firefox | 122+ | ✅ | ✅ | ✅ | localStorage cleared on private close |
| Safari | 17+ | ✅ | ✅ | ⚠️ | localStorage BLOCKED in private mode |
| Edge | 120+ | ✅ | ✅ | ✅ | localStorage cleared on InPrivate close |

---

## Common Issues & Troubleshooting

### Issue: Counter resets to 1/5 after browser restart

**Symptoms:** Calibration progress not persisting

**Possible Causes:**
1. localStorage disabled in browser settings
2. Private browsing mode (Safari)
3. Browser clearing storage on close (aggressive privacy settings)

**Resolution:**
- Check browser settings: Allow site data
- Check DevTools → Application → Local Storage (key exists?)
- Try normal browsing mode (not private)

---

### Issue: Game crashes in Safari Private mode

**Symptoms:** White screen or console error: `SecurityError: localStorage is not available`

**Possible Causes:**
- Safari blocks localStorage.setItem() in Private Browsing

**Resolution:**
- Expected behavior (Safari limitation)
- Optional: Implement sessionStorage fallback (Task 5)
- Document as known limitation

---

### Issue: IndexedDB sessions cleared with localStorage

**Symptoms:** All session history lost when profile reset

**Possible Causes:**
- User cleared all site data (not just localStorage)
- Browser "Clear browsing data" includes IndexedDB

**Resolution:**
- Expected behavior (user action)
- Not a bug (two storage systems independent, but user can clear both)

---

### Issue: Baseline not calculated after session 5

**Symptoms:** Console shows calibration complete, but no baseline message

**Possible Causes:**
- Async timing issue (getSessions() not awaited)
- Error in calculateBaselineMetrics() (check console)

**Resolution:**
- Check console for errors
- Verify saveSessionMetrics() completes before baseline calculation
- Check game.js lines 389-411 (baseline calculation logic)

---

## Test Data Reference

### Expected localStorage Schema

```javascript
{
  "calibrationComplete": false,       // Boolean (true after session 5)
  "sessionsCompleted": 3,             // Integer (0-999+)
  "celebrationShown": false,          // Boolean (true after first celebration)
  "lastPlayedDate": "2026-02-16",     // ISO date string
  "calibrationStartDate": 1708123456, // Timestamp (ms)
  "baselineMetrics": {                // Object (set after session 5)
    "reactionTime": 0.72,
    "spatialAwareness": 0.45,
    "cognitiveFlexibility": 0.68,
    "dividedAttention": 0.53,
    "impulseControl": 0.61,
    "workingMemory": null             // null if insufficient data
  }
}
```

### Expected IndexedDB Schema

```javascript
// CrazySnakeMetrics → sessions store
{
  "sessionId": "uuid-string",
  "timestamp": 1708123456789,
  "score": 42,
  "metrics": {
    "reactionTime": 0.7,
    "spatialAwareness": 0.45,
    "cognitiveFlexibility": 0.68,
    "dividedAttention": 0.5,
    "impulseControl": 0.6,
    "workingMemory": null
  },
  "rollingAverages": { ... },
  "rawEvents": [ ... ]
}
```

---

## Test Completion Checklist

- [ ] Scenario 1: Cross-session persistence (browser restart) - TESTED
- [ ] Scenario 2: Calibration complete persistence - TESTED
- [ ] Scenario 3: localStorage wipe recovery - TESTED
- [ ] Scenario 4: Private browsing fallback (optional) - TESTED or N/A
- [ ] Scenario 5: IndexedDB + localStorage independence - TESTED
- [ ] Scenario 6: Baseline metrics persistence - TESTED
- [ ] Browser compatibility verified (at least 2 browsers)
- [ ] Edge cases documented
- [ ] Test report created (see `calibration-persistence-report.md`)

---

**Test Suite Version:** 1.0
**Last Updated:** 2026-02-16
**Related Stories:** 15.1, 15.2, 15.3, 15.4, 15.5, 15.6

---

_Manual test suite for Epic 15 Calibration Period System_
