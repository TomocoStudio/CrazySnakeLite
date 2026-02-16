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

- [ ] **Task 1: Implement calibrationComplete flag toggle in storage.js**
  - [ ] Already implemented in Story 15.1 (`updateProfile({ calibrationComplete: true })`)
  - [ ] Verify one-way flag behavior (never resets once set)
  - [ ] **Maps to AC:** "storage.js sets calibrationComplete = true"

- [ ] **Task 2: Set shouldShowCelebration flag on session 5 completion**
  - [ ] In game.js onDeath flow, after setting calibrationComplete = true
  - [ ] Flag is derived in `getCalibrationStatus()`: `calibrationComplete && !celebrationShown`
  - [ ] No explicit write needed (Story 15.4 will set celebrationShown after display)
  - [ ] **Maps to AC:** "storage.js sets shouldShowCelebration = true (one-time flag)"

- [ ] **Task 3: Update post-game screen to show active Skill Map button when unlocked**
  - [ ] In cognitive-feedback.js `showPostGameScreen()`, check `calibrationStatus.isComplete`
  - [ ] If true, remove `.disabled` class from Skill Map button
  - [ ] Enable button click handler to navigate to Skill Map (Epic 16)
  - [ ] **Maps to AC:** "Skill Map button is fully active (not greyed out)"

- [ ] **Task 4: Implement Skill Map navigation from post-game button**
  - [ ] Add click handler to Skill Map button when unlocked
  - [ ] Call `hidePostGameScreen()` to dismiss current screen
  - [ ] Call `showSkillMap()` from dashboard.js (Epic 16 implementation)
  - [ ] Update gameState.phase = 'skillmap'
  - [ ] **Maps to AC:** "clicking it navigates to full Skill Map dashboard (Epic 16)"

- [ ] **Task 5: Update main menu to show unlocked Skill Map option**
  - [ ] In main.js menu rendering, check `calibrationStatus.isComplete`
  - [ ] If true, display: `🎯 Skill Map` (remove lock icon + session counter)
  - [ ] Enable menu option click to navigate to Skill Map
  - [ ] **Maps to AC:** "Brain Map option shows: 🎯 Skill Map"

- [ ] **Task 6: Implement Skill Map navigation from main menu**
  - [ ] Add click handler for unlocked Skill Map menu option
  - [ ] Call `showSkillMap()` from dashboard.js
  - [ ] Update gameState.phase = 'skillmap'
  - [ ] Hide main menu screen
  - [ ] **Maps to AC:** "clicking opens Skill Map dashboard immediately"

- [ ] **Task 7: Verify permanent unlock behavior (sessions 6+)**
  - [ ] Test session 6, 7, 8+ completion
  - [ ] Verify `getCalibrationStatus().isComplete` always returns true
  - [ ] Verify sessionsCompleted continues incrementing (used for total session count display)
  - [ ] **Maps to AC:** "Skill Map remains permanently unlocked"

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
