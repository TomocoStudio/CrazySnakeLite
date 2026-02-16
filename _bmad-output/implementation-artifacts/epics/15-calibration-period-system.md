# Epic 15: Calibration Period System

**Status:** 🟢 COMPLETED
**Created:** 2026-02-15
**Completed:** 2026-02-16

---

## Overview

Build player trust in cognitive metrics by implementing a 5-session calibration period that establishes personal baselines before revealing the full Skill Map. During sessions 1-5, collect metrics silently (Epic 13), show immediate post-game highlights (Epic 14), but gate access to the full brain map until calibration completes. Display "Session 3/5 — Warming up..." counter to set expectations. On session 5 completion, trigger a one-time celebration moment with pixel-art fanfare and unlock message: "Your Skill Map is ready!" This prevents showing volatile early data that could undermine trust, creates anticipation (Lens of Curiosity from Schell), and transforms the unlock into a motivational event.

**FRs covered:** FR183-FR189 (Calibration counter, session tracking, brain map unlock, celebration moment, baseline building)

**NFRs covered:** NFR64 (calibration progress sets clear expectations), NFR65 (celebration validates)

**Value:** Trust building. Early sessions have high variance — showing a brain map after game 1 would display meaningless data. Calibration creates stability, sets player expectations, and makes the unlock feel earned. The counter creates forward momentum: "I'm 3/5 of the way to seeing my full profile." Psychology: deferred gratification increases perceived value.

**Dependencies:** Requires Epic 13 (session tracking in storage.js), Epic 14 (calibration counter display in post-game)

---

## Stories

### Story 15.1: Implement Calibration State Management

**As a** developer,
**I want** centralized calibration state logic in storage.js,
**So that** all dashboard features can check calibration status consistently.

**Acceptance Criteria:**

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

### Story 15.2: Add Session Counter and Progress Tracking

**As a** player during calibration,
**I want** to see my progress toward unlock,
**So that** I know how many sessions remain before the full Skill Map appears.

**Acceptance Criteria:**

**Given** player completes session 1
**When** post-game summary displays
**Then** show calibration counter:
```
Session 1/5 — Warming up...
```
**And** text in 12px Jersey20, light grey #B0B0B0

**Given** player completes session 3
**When** post-game summary displays
**Then** show:
```
Session 3/5 — Warming up...
```
**And** subtle pulsing animation (opacity 0.7 → 1.0 → 0.7, 2s cycle per UX design)

**Given** player tries to access "Skill Map" button during calibration
**When** button is clicked (if shown)
**Then** display tooltip:
```
Complete 5 sessions to unlock your Skill Map
Currently: Session 3/5
```
**And** button appears greyed out or disabled

**Given** player navigates to main menu during calibration
**When** menu displays
**Then** "Brain Map" option shows:
```
🔒 Skill Map (Session 3/5)
```
**And** clicking it shows same tooltip message

**Per FR184:** Calibration state displays "Calibrating your brain..." with session progress counter (Session 1/5, 2/5, 3/5...)

---

### Story 15.3: Create Brain Map Unlock Logic

**As a** player,
**I want** the Skill Map to unlock automatically after 5 sessions,
**So that** I can finally see my complete cognitive profile.

**Acceptance Criteria:**

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

### Story 15.4: Implement Calibration Complete Celebration

**As a** player,
**I want** a satisfying celebration when I complete calibration,
**So that** unlocking the Skill Map feels like an achievement.

**Acceptance Criteria:**

**Given** player completes session 5
**When** post-game summary displays
**Then** replace calibration counter with celebration message:
```
Your Skill Map is ready! 🎉
```
**And** text in 18px Jersey20, gold color #FFD700
**And** brief pixel-art fanfare animation:
- Canvas flash (100ms white overlay at 30% opacity)
- 5-7 confetti particles spawn and fall (gold/purple colors)
- Confetti animation duration: 1.5 seconds

**And** caller quote for this session is celebration-themed:
```
"Five sessions complete! Your brain map just rendered. Check it out!"
— Git Committer
```

**Given** celebration message displays
**When** "Skill Map" button appears
**Then** button pulses gently (scale 1.0 → 1.05 → 1.0, 1s cycle)
**And** visual cue directs attention to newly unlocked feature

**Given** player sees celebration message
**When** they click "Skill Map" button
**Then** navigate to Skill Map dashboard (Epic 16)
**And** set celebrationShown = true (never show celebration again)

**Given** player returns for session 6+
**When** post-game summary displays
**Then** do NOT show celebration message (one-time only)
**And** calibration counter is permanently removed

**Per FR187-FR188:** Calibration complete message displayed with celebration moment (visual fanfare, caller quote)

---

### Story 15.5: Gate Skill Map Access During Calibration

**As a** system,
**I want** to prevent access to Skill Map before calibration completes,
**So that** players don't see volatile, unreliable early data.

**Acceptance Criteria:**

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

### Story 15.6: Implement Baseline Data Collection

**As a** system,
**I want** to use calibration period data to establish stable baselines,
**So that** subsequent metric displays are meaningful and trustworthy.

**Acceptance Criteria:**

**Given** player completes sessions 1-5
**When** each session saves to IndexedDB
**Then** metrics.js calculates raw session metrics
**And** storage.js accumulates data for baseline establishment

**Given** calibrationComplete === true (session 5 finished)
**When** Skill Map first displays
**Then** calculate baseline rolling averages using all 5 calibration sessions:
```javascript
baselineMetrics = {
  reactionTime: avg(sessions[0-4].reactionTime),
  spatialAwareness: avg(sessions[0-4].spatialAwareness),
  cognitiveFlexibility: avg(sessions[0-4].cognitiveFlexibility),
  dividedAttention: avg(sessions[0-4].dividedAttention),
  impulseControl: avg(sessions[0-4].impulseControl),
  workingMemory: avg(sessions[0-4].workingMemory)
}
```
**And** use these as reference points for improvement tracking

**Given** player completes session 6+ (post-calibration)
**When** rolling averages are calculated
**Then** include all sessions (1-N) with recency weighting (per Epic 13 Story 13.8)
**And** baseline provides stable reference for improvement deltas

**Given** calibration data shows high variance in a metric (e.g., player never encountered RC in 5 sessions)
**When** Skill Map displays
**Then** flag that metric as "insufficient data" with icon
**And** show tooltip: "Play more sessions to improve accuracy for this domain"

**Per FR189:** Calibration state prevents volatile early data from populating brain map (builds baseline first)

---

### Story 15.7: Test Calibration State Persistence

**As a** developer,
**I want** calibration state to persist correctly across browser sessions,
**So that** players don't lose progress toward unlock.

**Acceptance Criteria:**

**Given** player completes session 2, then closes browser
**When** player reopens game and completes session 3
**Then** calibration counter shows "Session 3/5" (not reset to 1/5)
**And** localStorage persists sessionsCompleted correctly

**Given** player completes session 5 and sees celebration
**When** player closes browser before clicking Skill Map
**Then** reopening game shows calibrationComplete === true
**And** Skill Map is accessible from menu
**And** celebration does NOT show again (celebrationShown === true)

**Given** player clears browser data (localStorage wiped)
**When** game reinitializes
**Then** calibration state resets to:
```javascript
{
  calibrationComplete: false,
  sessionsCompleted: 0
}
```
**And** player must complete 5 new sessions
**And** IndexedDB session history may still exist (separate storage)

**Given** player uses private browsing mode
**When** calibration state saves
**Then** use sessionStorage as fallback (lasts for tab session)
**And** warn player: "Private browsing: calibration progress not saved across sessions"

**Per NFR58:** Data persists across browser restarts and OS updates (durable storage)

---
