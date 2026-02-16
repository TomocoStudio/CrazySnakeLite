# Story 15.1: Implement Calibration State Management

**Epic:** 15 - Calibration Period System

**As a** developer,
**I want** centralized calibration state logic in storage.js,
**So that** all dashboard features can check calibration status consistently.

---

## Acceptance Criteria

**Given** game initializes for first-ever player
**When** storage.js loads
**Then** initialize calibration state in localStorage:
```javascript
{
  calibrationComplete: false,
  sessionsCompleted: 0,
  calibrationStartDate: timestamp,
  celebrationShown: false
}
```

**Given** a game session completes
**When** metrics are saved to IndexedDB
**Then** increment sessionsCompleted counter
**And** save updated count to localStorage (persistent across sessions)

**Given** sessionsCompleted reaches 5
**When** checking calibration status
**Then** storage.getCalibrationStatus() returns:
```javascript
{
  isComplete: true,
  sessionsCompleted: 5,
  shouldShowCelebration: !celebrationShown
}
```
**And** set calibrationComplete flag to true permanently

**Given** calibrationComplete is true
**When** storage.getCalibrationStatus() is called
**Then** always return isComplete: true (never resets)
**And** sessionsCompleted continues incrementing (used for total session count display)

**Per FR183:** First 3-5 sessions function as calibration period before brain map unlocks

---

## Tasks / Subtasks

- [ ] **Task 1: Add calibration state initialization to storage.js**
  - [ ] Extend `getProfile()` to include calibration fields in default profile object
  - [ ] Add `calibrationStartDate` timestamp field (set once on first initialization)
  - [ ] Add `celebrationShown` boolean field (defaults to false)
  - [ ] **Maps to AC:** "initialize calibration state in localStorage"

- [ ] **Task 2: Create `getCalibrationStatus()` function in storage.js**
  - [ ] Read current profile from localStorage
  - [ ] Calculate `isComplete` boolean (calibrationComplete === true)
  - [ ] Calculate `shouldShowCelebration` (!celebrationShown && isComplete)
  - [ ] Return object with `{ isComplete, sessionsCompleted, shouldShowCelebration }`
  - [ ] **Maps to AC:** "storage.getCalibrationStatus() returns"

- [ ] **Task 3: Implement calibration threshold check (5 sessions)**
  - [ ] In `updateProfile()`, check if sessionsCompleted reaches 5
  - [ ] If true, set calibrationComplete = true permanently
  - [ ] Never reset calibrationComplete once set (one-way flag)
  - [ ] **Maps to AC:** "set calibrationComplete flag to true permanently"

- [ ] **Task 4: Integrate session counter increment in game.js onDeath flow**
  - [ ] After `saveSessionMetrics(gameState)` completes in game.js
  - [ ] Read current profile: `const profile = storage.getProfile()`
  - [ ] Increment sessionsCompleted: `profile.sessionsCompleted + 1`
  - [ ] Call `storage.updateProfile({ sessionsCompleted: newCount })`
  - [ ] Check if newCount === 5, trigger calibrationComplete logic
  - [ ] **Maps to AC:** "increment sessionsCompleted counter"

- [ ] **Task 5: Add celebrationShown state management**
  - [ ] Add `setCelebrationShown()` helper function in storage.js
  - [ ] Call from post-game screen after celebration displays
  - [ ] Update profile: `updateProfile({ celebrationShown: true })`
  - [ ] **Maps to AC:** "shouldShowCelebration: !celebrationShown"

---

## Dev Notes

### File Locations
- **Primary file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/storage.js`
- **Integration point:** `/Users/anthonysalvi/code/CrazySnakeLite/js/game.js` (onDeath flow at line ~329)
- **Consumer files (read-only):** `js/cognitive-feedback.js`, `js/dashboard.js` (will use `getCalibrationStatus()`)

### Existing Storage.js Functions to Extend

**Profile Management (lines 180-197):**
```javascript
export function getProfile() {
  const stored = localStorage.getItem('crazysnakeLite_profile');
  return stored ? JSON.parse(stored) : {
    calibrationComplete: false,
    sessionsCompleted: 0,
    lastPlayedDate: null
  };
}

export function updateProfile(profileData) {
  const current = getProfile();
  const updated = { ...current, ...profileData };
  localStorage.setItem('crazysnakeLite_profile', JSON.stringify(updated));
}
```

**Current Profile Schema:**
Already includes `calibrationComplete` and `sessionsCompleted` fields. Need to ADD:
- `calibrationStartDate` (timestamp, set once on first init)
- `celebrationShown` (boolean, defaults false)

### localStorage Schema for Calibration State

**Key:** `crazysnakeLite_profile`

**Extended Schema:**
```javascript
{
  calibrationComplete: false,        // Boolean, one-way flag (never resets)
  sessionsCompleted: 0,              // Number, increments every game
  lastPlayedDate: null,              // String, 'YYYY-MM-DD' format
  calibrationStartDate: 1708099200000, // Timestamp, set once on first game
  celebrationShown: false            // Boolean, set true after celebration displays
}
```

### Integration Points

**1. Game.js onDeath Flow (line ~329):**
Current code:
```javascript
gameState.phase = 'gameover';

// Story 13.9: Save session metrics to IndexedDB
saveSessionMetrics(gameState);
```

**Add AFTER saveSessionMetrics:**
```javascript
// Story 15.1: Increment session counter and check calibration
const profile = storage.getProfile();
const newSessionCount = profile.sessionsCompleted + 1;

// Update session count
storage.updateProfile({
  sessionsCompleted: newSessionCount,
  lastPlayedDate: getTodayDateString()  // From streak.js pattern
});

// Check calibration threshold (5 sessions)
if (newSessionCount === 5 && !profile.calibrationComplete) {
  storage.updateProfile({ calibrationComplete: true });
}
```

**2. New Function: getCalibrationStatus()**
Add to storage.js exports:
```javascript
/**
 * Get calibration status (Story 15.1)
 * @returns {Object} { isComplete, sessionsCompleted, shouldShowCelebration }
 */
export function getCalibrationStatus() {
  const profile = getProfile();
  return {
    isComplete: profile.calibrationComplete === true,
    sessionsCompleted: profile.sessionsCompleted || 0,
    shouldShowCelebration: profile.calibrationComplete && !profile.celebrationShown
  };
}
```

**3. New Function: setCelebrationShown()**
Helper to mark celebration as displayed:
```javascript
/**
 * Mark calibration celebration as shown (Story 15.4)
 */
export function setCelebrationShown() {
  updateProfile({ celebrationShown: true });
}
```

### Project Structure Alignment

**Module Pattern:** Named exports only (no default exports)
- `export function getCalibrationStatus() {}`
- `export function setCelebrationShown() {}`

**State Passing:**
- `getCalibrationStatus()` reads from localStorage (sync, no gameState needed)
- Called by cognitive-feedback.js and dashboard.js to check state
- NEVER recalculate calibration from session count in UI code (DRY violation)

**Null Safety:**
- Profile defaults provide safe fallback if localStorage wiped
- `profile.sessionsCompleted || 0` handles undefined/null
- `calibrationComplete === true` explicit boolean check (not truthy)

### Testing Checklist
- [ ] First-ever player: profile initializes with all calibration fields
- [ ] Session 1-4: sessionsCompleted increments, calibrationComplete stays false
- [ ] Session 5: calibrationComplete flips to true, never resets
- [ ] Session 6+: sessionsCompleted continues counting, calibrationComplete stays true
- [ ] Browser restart: calibration state persists from localStorage
- [ ] Private browsing: graceful degradation (storage.js already handles this)

---

## References

**Project Context (V3 Patterns):**
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/project-context.md`
  - Lines 299-306: V3 Calibration State pattern (calibrationComplete is boolean in stored profile, ALL UI reads stored boolean, NEVER recalculates)
  - Lines 225-239: V3 Async Storage Patterns (localStorage wrappers, profile management)
  - Lines 698-712: V3 Session Lifecycle onDeath flow (existing integration point)

**Architecture.md:**
- V3 Storage Layer: IndexedDB (sessions) + localStorage (profile, streak, calibration)
- Module boundary: Only game.js, dashboard.js, streak.js call storage.js directly
- Pure modules (metrics.js, highlights.js) receive data as arguments, never import storage.js

**Epic 15 Overview:**
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/implementation-artifacts/epics/15-calibration-period-system.md`
  - Lines 10-17: Trust-building through 5-session baseline before revealing full Skill Map
  - Deferred gratification psychology: "3/5 of the way" creates forward momentum
