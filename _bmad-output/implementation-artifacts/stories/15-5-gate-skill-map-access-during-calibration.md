# Story 15.5: Gate Skill Map Access During Calibration

**Epic:** 15 - Calibration Period System

**As a** system,
**I want** to prevent access to Skill Map before calibration completes,
**So that** players don't see volatile, unreliable early data.

---

## Acceptance Criteria

**Given** player is in calibration period (sessions < 5)
**When** main menu displays
**Then** "Brain Map" menu option shows lock icon:
```
🔒 Skill Map (Session 3/5)
```
**And** clicking it displays modal:
```
Complete 5 sessions to unlock your Skill Map

Currently: Session 3/5 — Warming up...

[Close]
```

**Given** player navigates directly to /skillmap URL during calibration
**When** route loads
**Then** display calibration gate screen:
```
Your brain map is building...

Complete 5 sessions to see your cognitive profile.
Progress: Session 3/5

[Back to Menu]
```
**And** prevent Skill Map rendering

**Given** Epic 16 (Skill Map) components attempt to render during calibration
**When** skillmap.js checks calibration status
**Then** storage.getCalibrationStatus().isComplete === false
**And** component shows calibration message instead of radar chart

**Given** calibrationComplete === true
**When** any Skill Map access is attempted
**Then** full dashboard renders without restrictions
**And** all 6 cognitive metrics displayed using 5-session baseline

**Per FR182:** Brain Map unavailable during calibration period (shows calibration state instead)

---

## Tasks / Subtasks

### Task 1: Add `getCalibrationStatus()` method to storage.js
- [ ] Implement function that reads profile from localStorage (AC: check calibration status)
- [ ] Return object with `{ isComplete: boolean, sessionsCompleted: number, shouldShowCelebration: boolean }`
- [ ] Derive `isComplete` from `profile.calibrationComplete` boolean (never recalculate from session count)
- [ ] Derive `shouldShowCelebration` from `!profile.celebrationShown` (one-time flag)
- [ ] Handle null profile gracefully (return defaults: false, 0, false)

**Maps to AC:** "storage.getCalibrationStatus().isComplete === false"

### Task 2: Gate Skill Map button on menu screen
- [ ] In `main.js` (or menu rendering logic), call `storage.getCalibrationStatus()`
- [ ] If `isComplete === false`, render button with lock icon: `🔒 Skill Map (Session ${sessionsCompleted}/5)`
- [ ] Add click handler that displays modal instead of navigating to Skill Map
- [ ] Modal text: "Complete 5 sessions to unlock your Skill Map\n\nCurrently: Session X/5 — Warming up...\n\n[Close]"
- [ ] If `isComplete === true`, render normal button: `🎯 Skill Map` (navigation enabled)

**Maps to AC:** Menu displays lock icon + modal during calibration

### Task 3: Gate direct navigation to Skill Map URL/phase
- [ ] In `game.js` (or phase transition logic), add calibration check before `phase = 'skillmap'`
- [ ] If player attempts to navigate to Skill Map during calibration (e.g., via button on game-over screen), show calibration gate screen
- [ ] Create calibration gate screen DOM overlay (z-index 350, matches Skill Map layer)
- [ ] Gate screen text: "Your brain map is building...\n\nComplete 5 sessions to see your cognitive profile.\nProgress: Session X/5\n\n[Back to Menu]"
- [ ] [Back to Menu] button navigates to `phase = 'menu'`

**Maps to AC:** Direct navigation shows calibration gate screen

### Task 4: Add calibration check to dashboard.js rendering
- [ ] In `dashboard.js`, at start of `renderSkillMap()` (or equivalent render function)
- [ ] Call `storage.getCalibrationStatus()`
- [ ] If `isComplete === false`, render calibration placeholder instead of full dashboard
- [ ] Placeholder displays session counter (read from `sessionsCompleted`), warm-up message
- [ ] If `isComplete === true`, render full Skill Map with block bars (all 6 domains)

**Maps to AC:** Epic 16 components show calibration message instead of radar chart

### Task 5: Test calibration gate across all entry points
- [ ] Verify menu button shows lock icon during sessions 1-4
- [ ] Verify post-game "Skill Map" button (if present) triggers gate modal
- [ ] Verify direct URL navigation (if supported) shows gate screen
- [ ] Verify dashboard.js placeholder renders correctly when `calibrationComplete: false`
- [ ] Verify all gates unlock simultaneously when session 5 completes

**Maps to AC:** All access attempts gated consistently

---

## Dev Notes

### File Locations
- **storage.js** (`/Users/anthonysalvi/code/CrazySnakeLite/js/storage.js`): Add `getCalibrationStatus()` method
  - Reads `localStorage.getItem('crazysnakeLite_profile')` (existing pattern from `getProfile()`)
  - Returns derived status object (never modifies stored data)
  - Pattern: Pure read function, no side effects

- **main.js** (menu rendering): Add calibration check for menu button
  - Import `getCalibrationStatus` from storage.js
  - Conditional rendering: lock icon vs normal icon
  - Modal overlay creation (similar to phone overlay pattern, but lighter weight)

- **game.js** (phase navigation): Add calibration check before `gameState.phase = 'skillmap'`
  - Guard clause pattern: `if (!calibrationStatus.isComplete) { showGateScreen(); return; }`
  - Event-driven check (only on navigation attempt, not polled)

- **dashboard.js** (`/Users/anthonysalvi/code/CrazySnakeLite/js/dashboard.js`): Add calibration check in render function
  - Import `getCalibrationStatus` from storage.js
  - Two render paths: calibration placeholder vs full dashboard
  - Placeholder uses same DOM container, different content

### UI Gating Logic

**Three gating mechanisms (all must be consistent):**

1. **Menu Button Gating** (preventive)
   - Visual indicator: lock icon + session counter
   - Click handler: show modal, no navigation
   - User never reaches Skill Map phase

2. **Phase Navigation Gating** (defensive)
   - Guard clause in phase transition logic
   - Catches programmatic navigation attempts
   - Shows full-screen gate overlay

3. **Dashboard Render Gating** (fallback)
   - Checked at render time in dashboard.js
   - Prevents rendering pixel block bars with insufficient data
   - Shows placeholder content in same container

**All three checks use same source of truth:** `storage.getCalibrationStatus().isComplete`

### localStorage Persistence Pattern

**Calibration state stored in profile object:**

```javascript
// Written by Story 15.1 during session save
{
  calibrationComplete: false,       // Boolean flag, set once at session 5
  sessionsCompleted: 3,             // Counter, increments every session
  celebrationShown: false,          // One-time flag for Story 15.4
  lastPlayedDate: '2026-02-16'      // For streak system (Epic 17)
}
```

**Read pattern (V3 anti-pattern avoidance):**
- ✅ `if (profile.calibrationComplete)` — read stored boolean
- ❌ `if (profile.sessionsCompleted >= 5)` — recalculating, violates pattern

**Why this matters:** `sessionsCompleted` continues counting after calibration (used for total session display). `calibrationComplete` is the **persistent unlock flag** — once true, always true.

### Modal Overlay Pattern

**Lightweight modal (not full phone overlay):**
- Z-index: 360 (above Skill Map 350, below phone 400)
- Centered modal box: 400px width, auto height
- Backdrop: semi-transparent black (#000000 @ 60% opacity)
- Close button: ESC key + [Close] button
- No game loop interaction (pure UI blocker)

**CSS class pattern:**
```css
.calibration-gate-modal {
  /* Similar to .phone-overlay but simpler */
  display: none; /* Toggle with .show class */
}
.calibration-gate-modal.show {
  display: flex;
}
```

### Test Scenarios

**Manual test checklist for Story 15.5:**

1. **Session 1-4 (calibrating):**
   - Menu button shows `🔒 Skill Map (Session X/5)`
   - Clicking menu button shows modal with counter
   - Post-game "Skill Map" button (if present) also shows modal
   - Modal [Close] button returns to current screen (no navigation)

2. **Session 5 completion:**
   - After game-over, `calibrationComplete` flag set to true
   - All gates unlock simultaneously
   - Menu button changes to `🎯 Skill Map` (no lock icon)
   - Clicking menu button navigates to full dashboard

3. **Session 6+ (post-calibration):**
   - All Skill Map access points work normally
   - No gate screens or modals appear
   - Dashboard renders full pixel block bars

4. **Edge case: Direct URL manipulation:**
   - If game supports URL routing (unlikely for Canvas game, but defensive)
   - Navigating to `#skillmap` during calibration shows gate screen
   - [Back to Menu] button navigates to menu phase

### Integration with Other Stories

**Dependencies (must be complete first):**
- **Story 15.1:** `calibrationComplete` flag and `sessionsCompleted` counter exist in storage
- **Story 13.9:** Session save increments `sessionsCompleted` counter

**Dependents (rely on this story):**
- **Story 15.4:** Celebration screen appears after unlock (checks `shouldShowCelebration`)
- **Story 16.1:** Skill Map screen reads calibration status for full rendering

**Data flow:**
```
Session completes (game.js)
  → Story 15.1 increments sessionsCompleted (storage.js)
  → Story 15.5 checks calibrationComplete flag (UI gating)
  → Story 15.4 shows celebration if session === 5 (one-time)
  → Story 16.1 renders full dashboard if complete (full unlock)
```

---

## References

**Project Context (V3 patterns):**
- `project-context.md` lines 297-305: Calibration state is boolean in stored profile, UI reads stored value (never recalculates)
- `project-context.md` lines 273-280: Dashboard render pattern (static containers, dynamic content, `.hidden` class for visibility)
- `project-context.md` lines 227-238: Async storage patterns (even localStorage wrappers for consistency)

**Architecture Document:**
- `architecture.md` Decision 11 (V3 Storage Layer): localStorage for profile/calibration, IndexedDB for sessions
- Profile schema: `{ calibrationComplete, sessionsCompleted, lastPlayedDate }`

**UX Design Authority:**
- `ux-design-cognitive-dashboard.md`: Calibration period creates trust by preventing volatile early data display
- Calibration counter visual spec: 12px Jersey20, light grey #B0B0B0, pulsing animation (opacity 0.7 → 1.0)

**Epic 15 Context:**
- Epic 15 Story 15.1: Defines calibration state management (storage.js methods)
- Epic 15 overview: 5-session calibration builds baseline, unlock feels earned (deferred gratification)
