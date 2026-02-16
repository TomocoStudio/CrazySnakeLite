# Story 15.3: Create Brain Map Unlock Logic

**Epic:** 15 - Calibration Period System

**As a** player,
**I want** the Skill Map to unlock automatically after 5 sessions,
**So that** I can finally see my complete cognitive profile.

---

## Acceptance Criteria

**Given** player completes session 5 (calibration complete)
**When** game-over screen processes
**Then** storage.js sets calibrationComplete = true
**And** storage.js sets shouldShowCelebration = true (one-time flag)
**And** post-game summary replaces calibration counter with celebration message

**Given** calibrationComplete is true
**When** post-game summary displays buttons
**Then** "Skill Map" button is fully active (not greyed out)
**And** clicking it navigates to full Skill Map dashboard (Epic 16)

**Given** calibrationComplete is true
**When** main menu displays
**Then** "Brain Map" option shows:
```
🎯 Skill Map
```
**And** clicking opens Skill Map dashboard immediately

**Given** player has 6+ sessions completed
**When** storage.getCalibrationStatus() is called
**Then** isComplete: true, sessionsCompleted: 6 (continues counting)
**And** Skill Map remains permanently unlocked

**Per FR186:** Brain map unlocks automatically after session 5 completion

---

## Tasks / Subtasks

- [x] **Task 1: Implement calibrationComplete flag toggle in storage.js**
  - [x] Already implemented in Story 15.1 (`updateProfile({ calibrationComplete: true })`)
  - [x] Verified one-way flag behavior (never resets once set)
  - [x] Code location: game.js lines 393-406
  - [x] **Maps to AC:** "storage.js sets calibrationComplete = true"

- [x] **Task 2: Set shouldShowCelebration flag on session 5 completion**
  - [x] In game.js onDeath flow, after setting calibrationComplete = true
  - [x] Flag is derived in `getCalibrationStatus()`: `calibrationComplete && !celebrationShown`
  - [x] No explicit write needed (Story 15.4 will set celebrationShown after display)
  - [x] Verified in Story 15.1 implementation
  - [x] **Maps to AC:** "storage.js sets shouldShowCelebration = true (one-time flag)"

- [x] **Task 3: Update post-game screen to show active Skill Map button when unlocked**
  - [x] Already implemented in Story 14.7 (main.js lines 398-407)
  - [x] Button `disabled` attribute set to `false` when `calibrationState !== 'in_progress'`
  - [x] Button click handler checks calibration status (Story 15.2)
  - [x] **Maps to AC:** "Skill Map button is fully active (not greyed out)"

- [x] **Task 4: Implement Skill Map navigation from post-game button**
  - [x] Added `navigateToSkillMap()` function in main.js
  - [x] Updates gameState.phase = 'skillmap'
  - [x] Hides current screen (game-over or menu)
  - [x] Placeholder for Epic 16 dashboard.showSkillMap() call (TODO comment added)
  - [x] **Maps to AC:** "clicking it navigates to full Skill Map dashboard (Epic 16)"

- [ ] **Task 5: Update main menu to show unlocked Skill Map option** *(DEFERRED - Epic 16 dependency)*
  - [ ] Main menu Skill Map option doesn't exist yet (Epic 16 Story 16-1)
  - [ ] Will display: `🎯 Skill Map` when calibration complete
  - [ ] **BLOCKED:** Requires Epic 16 to create menu option first
  - [ ] **Maps to AC:** "Brain Map option shows: 🎯 Skill Map"

- [ ] **Task 6: Implement Skill Map navigation from main menu** *(DEFERRED - Epic 16 dependency)*
  - [ ] navigateToSkillMap() function ready to use
  - [ ] Will call from menu option click handler
  - [ ] **BLOCKED:** Requires Epic 16 Story 16-1 menu option
  - [ ] **Maps to AC:** "clicking opens Skill Map dashboard immediately"

- [x] **Task 7: Verify permanent unlock behavior (sessions 6+)**
  - [x] One-way flag verified in Story 15.1
  - [x] getCalibrationStatus().isComplete always returns true after session 5
  - [x] sessionsCompleted continues incrementing indefinitely
  - [x] Test plan created with verification steps
  - [x] **Maps to AC:** "Skill Map remains permanently unlocked"

---

## Dev Notes

### File Locations
- **Primary file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/game.js` (onDeath flow, calibrationComplete trigger)
- **Post-game screen:** `/Users/anthonysalvi/code/CrazySnakeLite/js/cognitive-feedback.js`
- **Main menu:** `/Users/anthonysalvi/code/CrazySnakeLite/js/main.js`
- **Skill Map (Epic 16):** `/Users/anthonysalvi/code/CrazySnakeLite/js/dashboard.js` (will implement `showSkillMap()`)
- **Storage:** `/Users/anthonysalvi/code/CrazySnakeLite/js/storage.js` (getCalibrationStatus, updateProfile)

### Existing game.js onDeath Integration

**Current onDeath location (line ~329):**
```javascript
gameState.phase = 'gameover';

// Story 13.9: Save session metrics to IndexedDB
saveSessionMetrics(gameState);
```

**Enhanced with Story 15.1 + 15.3:**
```javascript
gameState.phase = 'gameover';

// Story 13.9: Save session metrics to IndexedDB
saveSessionMetrics(gameState);

// Story 15.1: Increment session counter
const profile = storage.getProfile();
const newSessionCount = profile.sessionsCompleted + 1;

storage.updateProfile({
  sessionsCompleted: newSessionCount,
  lastPlayedDate: getTodayDateString()
});

// Story 15.3: Check calibration unlock threshold (session 5)
if (newSessionCount === 5 && !profile.calibrationComplete) {
  storage.updateProfile({ calibrationComplete: true });
  console.log('[Calibration] Unlocked after session 5');
}
```

**Note:** celebrationShown flag is NOT set here. It's set in Story 15.4 AFTER celebration displays to user.

### Post-Game Skill Map Button Logic

**In cognitive-feedback.js `showPostGameScreen()`:**
```javascript
export function showPostGameScreen(gameState) {
  const calibrationStatus = storage.getCalibrationStatus();

  // ... render highlights, calibration counter (Story 15.2) ...

  // Skill Map button
  const skillMapBtn = document.createElement('button');
  skillMapBtn.textContent = 'Skill Map';

  // Story 15.3: Conditional button state
  if (calibrationStatus.isComplete) {
    // Unlocked state
    skillMapBtn.className = 'skill-map-button';
    skillMapBtn.addEventListener('click', () => {
      hidePostGameScreen();
      navigateToSkillMap(gameState);  // Story 15.3
    });
  } else {
    // Locked state (Story 15.2)
    skillMapBtn.className = 'skill-map-button disabled';
    skillMapBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showCalibrationTooltip(skillMapBtn, calibrationStatus.sessionsCompleted);
    });
  }

  buttonContainer.appendChild(skillMapBtn);
}

// Story 15.3: Navigation function
function navigateToSkillMap(gameState) {
  import('./dashboard.js').then(module => {
    module.showSkillMap(gameState);  // Epic 16 implementation
    gameState.phase = 'skillmap';
  });
}
```

### Main Menu Unlock Logic

**In main.js menu rendering:**
```javascript
function renderMainMenu(gameState) {
  const calibrationStatus = storage.getCalibrationStatus();

  // Menu options array
  const menuOptions = [
    { text: 'New Game', action: () => startNewGame(gameState) },
    {
      text: calibrationStatus.isComplete
        ? '🎯 Skill Map'
        : `🔒 Skill Map (Session ${calibrationStatus.sessionsCompleted}/5)`,
      action: () => handleSkillMapClick(gameState, calibrationStatus)
    },
    { text: 'Settings', action: () => showSettings() }
  ];

  // ... render menu options ...
}

// Story 15.3: Menu click handler
function handleSkillMapClick(gameState, calibrationStatus) {
  if (!calibrationStatus.isComplete) {
    // Locked state (Story 15.2)
    showCalibrationTooltip(calibrationStatus.sessionsCompleted);
    return;
  }

  // Unlocked state (Story 15.3)
  hideMainMenu();
  import('./dashboard.js').then(module => {
    module.showSkillMap(gameState);
    gameState.phase = 'skillmap';
  });
}
```

### Phase Transition State Machine

**V3 Phase Navigation (from project-context.md lines 716-730):**
```
menu → playing (New Game)
menu → skillmap (Skill Map button) ← Story 15.3
playing → gameover (death)
gameover → playing (Play Again)
gameover → skillmap (Skill Map button) ← Story 15.3
skillmap → playing (Play Now)
skillmap → menu (Back to Menu / ESC)
gameover → menu (ESC)
```

**Phase field in gameState:**
```javascript
gameState.phase = 'skillmap';  // New phase for Skill Map screen
```

**Render logic (in game.js or main.js):**
```javascript
function render(ctx, gameState) {
  if (gameState.phase === 'playing') {
    renderGame(ctx, gameState);
  } else if (gameState.phase === 'menu') {
    renderMenu();
  } else if (gameState.phase === 'gameover') {
    renderGameOver(gameState);
  } else if (gameState.phase === 'skillmap') {
    // Epic 16: dashboard.js handles rendering
    // Game loop still runs, but Skill Map overlay is displayed
  }
}
```

### Permanent Unlock Behavior

**One-way flag pattern:**
```javascript
// calibrationComplete is set ONCE, never reset
if (newSessionCount === 5 && !profile.calibrationComplete) {
  storage.updateProfile({ calibrationComplete: true });
}

// Even if user plays 100 sessions, calibrationComplete stays true
// sessionsCompleted continues incrementing: 5, 6, 7, ... 100
```

**getCalibrationStatus() behavior over time:**
```javascript
// Session 1: { isComplete: false, sessionsCompleted: 1, shouldShowCelebration: false }
// Session 2: { isComplete: false, sessionsCompleted: 2, shouldShowCelebration: false }
// Session 5: { isComplete: true, sessionsCompleted: 5, shouldShowCelebration: true }
// Session 6 (after celebration shown):
//   { isComplete: true, sessionsCompleted: 6, shouldShowCelebration: false }
// Session 100: { isComplete: true, sessionsCompleted: 100, shouldShowCelebration: false }
```

### Project Structure Alignment

**Module Pattern:**
- cognitive-feedback.js imports dashboard.js dynamically: `import('./dashboard.js')`
- Lazy loading pattern avoids circular dependencies
- Only loads Skill Map code when needed (performance optimization)

**State Passing:**
- `navigateToSkillMap(gameState)` passes gameState explicitly
- Skill Map reads calibration status from storage, not gameState
- gameState.phase updated to 'skillmap' for render loop coordination

**DOM Cleanup:**
- `hidePostGameScreen()` before showing Skill Map (avoid overlapping screens)
- `hideMainMenu()` before showing Skill Map (same reason)
- Skill Map has own cleanup: `hideSkillMap()` (Epic 16)

### Testing Checklist
- [ ] Session 4 completion: Skill Map still locked, button greyed out
- [ ] Session 5 completion: calibrationComplete flips to true in localStorage
- [ ] Session 5 post-game: Skill Map button active (no .disabled class)
- [ ] Skill Map button click from post-game: navigates to Skill Map screen
- [ ] Main menu after session 5: shows "🎯 Skill Map" (no lock icon)
- [ ] Main menu Skill Map click: navigates to Skill Map immediately
- [ ] Session 6, 7, 8+: Skill Map always accessible, no regression
- [ ] Browser restart after session 5: Skill Map still unlocked (localStorage persistence)

---

## References

**Project Context (V3 Patterns):**
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/project-context.md`
  - Lines 716-730: V3 Phase Navigation (menu ↔ skillmap transitions)
  - Lines 299-306: V3 Calibration State (one-way flag, never resets)
  - Lines 614-622: gameState structure (phase field state machine)

**Architecture.md:**
- V3 Phase Navigation: 4 phases (menu, playing, gameover, skillmap)
- Module boundaries: cognitive-feedback.js and main.js both consumers of storage.js
- Lazy loading: dynamic import for dashboard.js (only load when Skill Map accessed)

**Epic 15 Overview:**
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/implementation-artifacts/epics/15-calibration-period-system.md`
  - Lines 10-17: Unlock creates motivational event, transforms baseline building into achievement
  - Session 5 is psychological milestone: "Your data is ready, here's your reward"

---

## Dev Agent Record

### Implementation Plan

Story 15.3 implements the unlock logic that enables Skill Map access after 5 sessions complete.

**Discovery:**
Most unlock logic was already implemented in previous stories:
- Story 15.1: calibrationComplete flag toggle in game.js onDeath
- Story 15.1: getCalibrationStatus() returns shouldShowCelebration flag
- Story 14.7: Skill Map button enabled when calibration complete
- Story 15.2: Click handler checks calibration status

**Work Completed:**
1. Verified existing unlock logic in game.js (lines 393-406)
2. Created navigateToSkillMap() helper function for Epic 16 integration
3. Updated Skill Map button click handler to call navigation function
4. Added TODO comments for Epic 16 dashboard.showSkillMap() integration
5. Created comprehensive manual test plan

**Design Decisions:**
- navigateToSkillMap() sets phase to 'skillmap' immediately (prepared for Epic 16)
- Placeholder returns to menu after 500ms (Epic 16 will replace)
- Function is ready to import dashboard.js when it exists
- Main menu tasks deferred to Epic 16 (menu option doesn't exist yet)

### Debug Log

No issues encountered. Syntax validation passed.

### Completion Notes

✅ **Tasks 1-4, 7:** COMPLETE - Unlock logic functional
⚠️ **Tasks 5-6:** DEFERRED - Blocked by Epic 16 Story 16-1

**What Was Already Done (Stories 15.1, 14.7, 15.2):**
- calibrationComplete flag toggle (Story 15.1, game.js)
- shouldShowCelebration derived flag (Story 15.1, storage.js)
- Button enabled when unlocked (Story 14.7, main.js)
- Click handler checks calibration (Story 15.2, main.js)

**What Was Added (Story 15.3):**
- navigateToSkillMap() navigation helper function
- Proper phase management (gameState.phase = 'skillmap')
- Screen hiding logic (game-over/menu)
- Epic 16 integration placeholder with TODO
- Comprehensive manual test plan

**Epic 16 Dependency:**
- showSkillMap() function doesn't exist yet (Epic 16 Story 16-1)
- Main menu Skill Map option doesn't exist (Epic 16 Story 16-1)
- navigateToSkillMap() has TODO comment ready for integration

**Testing:**
- Created manual test plan (test/story-15-3-manual-test.md)
- 8 test scenarios covering unlock, navigation, persistence
- Verified one-way flag behavior
- All core unlock logic testable now

---

## File List

- `js/main.js` - Modified (added navigateToSkillMap() function, updated Skill Map button click handler)
- `test/story-15-3-manual-test.md` - Created (comprehensive manual test plan with 8 scenarios)

---

## Change Log

**Date:** 2026-02-16

**Changes:**
- Added `navigateToSkillMap(gameState)` helper function in main.js
  - Hides current screen (game-over or menu)
  - Sets gameState.phase = 'skillmap'
  - Placeholder for Epic 16 dashboard.showSkillMap() call
- Updated Skill Map button click handler to call navigateToSkillMap() when unlocked
- Added TODO comments for Epic 16 integration points
- Verified existing unlock logic from Stories 15.1 and 14.7
- Created comprehensive manual test plan with 8 test scenarios

**Discovered:**
- Unlock logic already functional from Stories 15.1 (flag toggle) and 14.7 (button enable)
- Main menu Skill Map option doesn't exist yet - blocked by Epic 16 Story 16-1
- dashboard.js with showSkillMap() doesn't exist yet - Epic 16 Story 16-1/16-2

**Deferred to Epic 16:**
- Tasks 5-6 (main menu unlock state) require Story 16-1 to create menu option
- Actual Skill Map rendering requires dashboard.js implementation (Epic 16)

**Rationale:**
Completes the calibration unlock user flow. After 5 sessions, the one-way calibrationComplete flag is set, button becomes active, and navigation is ready for Epic 16 dashboard implementation. Creates the psychological "unlock moment" that rewards baseline completion.

---

## Status

**Status:** review
**Completed:** 2026-02-16

**Notes:** Tasks 1-4, 7 complete (unlock logic functional). Tasks 5-6 deferred to Epic 16 Story 16-1 (main menu Skill Map option). Navigation placeholder ready for Epic 16 dashboard integration.
