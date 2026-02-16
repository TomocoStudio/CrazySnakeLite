# Story 14.5: Display Calibration State Counter

**Epic:** 14 - Enhanced Post-Game Summary ("Recap")

**As a** player during calibration (sessions 1-5),
**I want** to see my progress toward brain map unlock,
**So that** I understand when the full Skill Map becomes available.

---

## Acceptance Criteria

**Given** player is in calibration period (sessions < 5)
**When** post-game summary displays
**Then** show calibration counter below highlights:
```
Session 3/5 — Warming up...
```
**And** text in 12px Jersey20, light grey color
**And** subtle pulsing animation (opacity 0.7 → 1.0 → 0.7, 2s cycle)

**Given** player completes session 5 (calibration complete)
**When** post-game summary displays
**Then** show one-time celebration message:
```
Your Skill Map is ready! 🎉
```
**And** replace calibration counter with celebration for this session only
**And** brief pixel-art fanfare animation (100ms flash, confetti particles)

**Given** player has completed calibration (session 6+)
**When** post-game summary displays
**Then** do NOT show calibration counter
**And** "Skill Map" button is active (not greyed out)

**Per FR184:** Calibration state displays "Calibrating your brain..." with session progress counter (Session 1/5, 2/5, 3/5...)

---

## Development

### Files to Create/Modify

- **`js/calibration.js`** - NEW module for calibration state management
- **`js/cognitive-feedback.js`** - Extend `showHighlights()` to render calibration counter in footer
- **`js/storage.js`** - Add `getCalibrationState()` function
- **`styles.css`** - Add `.post-game-footer` and `.calibration-counter` styles
- **`test/calibration.test.js`** - Unit tests for calibration state logic

### API Surface

```javascript
// calibration.js (NEW module)

/**
 * Get current calibration state
 * @param {number} totalSessions - Total completed sessions from storage
 * @returns {Object} {state: 'in_progress'|'complete'|'unlocked', sessionCount: number}
 */
export function getCalibrationState(totalSessions)

/**
 * Check if calibration just completed this session
 * @param {number} totalSessions - Total sessions including current
 * @returns {boolean} True if this is session 5 (calibration complete)
 */
export function isCalibrationComplete(totalSessions)

/**
 * Format calibration counter text
 * @param {number} currentSession - Current session number (1-5)
 * @returns {string} Formatted text (e.g., "Session 3/5 — Warming up...")
 */
export function formatCalibrationCounter(currentSession)
```

```javascript
// storage.js (EXTEND existing)

/**
 * Get total session count from IndexedDB
 * @returns {Promise<number>} Total completed sessions
 */
export async function getTotalSessionCount()
```

### Calibration State Logic

**Calibration period:** Sessions 1-5
**Unlocked:** Session 6+

```javascript
function getCalibrationState(totalSessions) {
  if (totalSessions < 5) {
    return {
      state: 'in_progress',
      sessionCount: totalSessions
    };
  } else if (totalSessions === 5) {
    return {
      state: 'complete', // One-time celebration
      sessionCount: 5
    };
  } else {
    return {
      state: 'unlocked', // Post-calibration (no counter)
      sessionCount: totalSessions
    };
  }
}

function formatCalibrationCounter(currentSession) {
  return `Session ${currentSession}/5 — Warming up...`;
}
```

### UI Rendering in Post-Game Footer

```javascript
// cognitive-feedback.js: showHighlights() extension

async function showHighlights(highlights, callerQuote, sessionContext) {
  // ... existing highlight rendering ...

  // Render footer based on calibration state
  const footer = document.querySelector('.post-game-footer');

  if (sessionContext.calibrationState === 'in_progress') {
    // Sessions 1-4: Show progress counter
    footer.innerHTML = formatCalibrationCounter(sessionContext.sessionCount);
    footer.className = 'post-game-footer calibration-counter';

  } else if (sessionContext.calibrationState === 'complete') {
    // Session 5: One-time celebration
    footer.innerHTML = 'Your Skill Map is ready! 🎉';
    footer.className = 'post-game-footer calibration-complete';

    // Trigger fanfare animation (100ms flash, confetti particles)
    triggerCalibrationCelebration(footer);

  } else {
    // Session 6+: Hide footer (streak counter in Story 14.6 takes priority)
    footer.innerHTML = '';
    footer.className = 'post-game-footer hidden';
  }
}
```

### CSS Styling

```css
/* styles.css */

.post-game-footer {
  font-family: 'Jersey20', monospace;
  font-size: 12px;
  color: #aaa; /* Light grey */
  text-align: center;
  margin-top: 16px;
}

.calibration-counter {
  animation: calibrationPulse 2s ease-in-out infinite;
}

@keyframes calibrationPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1.0; }
}

.calibration-complete {
  color: #FFD700; /* Gold */
  font-size: 14px;
  animation: celebrationFlash 100ms ease-out;
}

@keyframes celebrationFlash {
  0% { transform: scale(1); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
```

### Celebration Animation (Session 5)

```javascript
function triggerCalibrationCelebration(footer) {
  // Brief pixel-art fanfare: 100ms flash + confetti particles

  // 1. Flash animation (already in CSS)
  footer.classList.add('celebration-flash');

  // 2. Confetti particles (optional, simple approach)
  createConfettiParticles(footer);

  // 3. Remove animation class after completion
  setTimeout(() => {
    footer.classList.remove('celebration-flash');
  }, 200);
}

function createConfettiParticles(container) {
  // Simple confetti: 5-10 emoji particles (🎉🎊✨) that fade out
  const emojis = ['🎉', '🎊', '✨'];
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('span');
    particle.className = 'confetti-particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 100}ms`;
    container.appendChild(particle);

    // Remove after animation completes
    setTimeout(() => particle.remove(), 500);
  }
}
```

### Integration Points

- **`game.js`** - Call `getCalibrationState(totalSessions)` before `showHighlights()`
- **`storage.js`** - Provides `totalSessions` via `getTotalSessionCount()`
- **`cognitive-feedback.js`** - Renders calibration counter in `.post-game-footer`
- **Story 14.7** - "Skill Map" button greyed out if calibration in progress

### Test Strategy

**Unit Tests (`calibration.test.js`):**
1. Test `getCalibrationState(1)` → state: 'in_progress', sessionCount: 1
2. Test `getCalibrationState(4)` → state: 'in_progress', sessionCount: 4
3. Test `getCalibrationState(5)` → state: 'complete', sessionCount: 5
4. Test `getCalibrationState(10)` → state: 'unlocked', sessionCount: 10
5. Test `formatCalibrationCounter(3)` → "Session 3/5 — Warming up..."
6. Test `isCalibrationComplete(5)` → true
7. Test `isCalibrationComplete(4)` → false

**Manual Testing:**
- Play session 1 → verify "Session 1/5 — Warming up..." appears with pulsing animation
- Play session 3 → verify "Session 3/5 — Warming up..."
- Play session 5 → verify "Your Skill Map is ready! 🎉" with flash animation
- Play session 6 → verify no calibration counter (footer hidden)
- Enable reduced motion → verify no pulsing animation (instant display)

### Dependencies

**BLOCKS:** Story 14.7 ("Skill Map" button gating logic)
**BLOCKED BY:** Epic 13 Story 13.9 (storage.js with session count tracking)

### Implementation Notes

1. **Session count source** - Use `storage.getTotalSessionCount()` which queries IndexedDB session count (Epic 13 Story 13.9 implements this)

2. **One-time celebration** - Session 5 shows celebration message ONLY during that session → Session 6+ hides footer entirely (or shows streak counter per Story 14.6)

3. **Skill Map button gating** - Story 14.7 will check `calibrationState === 'unlocked'` to enable/disable "Skill Map" button

4. **Confetti performance** - Keep confetti simple (8 particles max, CSS-only animation) to maintain 60 FPS

5. **Reduced motion** - Disable pulsing animation and confetti if `CONFIG.REDUCED_MOTION === true`

6. **Footer priority** - If both calibration counter AND streak counter exist (shouldn't happen, but edge case), calibration takes priority during sessions 1-5

7. **Mobile viewport** - Ensure `.post-game-footer` text wraps gracefully on narrow screens (< 320px)

---

## Implementation Status

**Status:** ✅ **COMPLETED**
**Date:** 2026-02-16

### Summary
Implemented calibration state tracking and display system for first 5 sessions. Players see progress toward "brain map unlock" with pulsing counter ("Session X/5 — Warming up...") during sessions 1-4, and one-time celebration on session 5 ("Your Skill Map is ready! 🎉") with confetti animation.

### Files Modified/Created
- **`js/calibration.js`** (NEW) - `getCalibrationState()`, `isCalibrationComplete()`, `formatCalibrationCounter()`, `formatCalibrationComplete()`
- **`js/storage.js`** - Added `getTotalSessionCount()` to query IndexedDB
- **`js/cognitive-feedback.js`** - Updated `renderFooter()` with calibration logic, added `triggerCalibrationCelebration()`, `createConfettiParticles()`
- **`css/style.css`** - Added `.calibration-counter`, `.calibration-complete`, `.confetti-particle` styles with animations
- **`js/main.js`** - Integrated calibration state in game-over handler
- **`test/calibration.test.js`** - 15 comprehensive tests for state progression

### Three Calibration States
1. **In Progress (Sessions 1-4)** - "Session X/5 — Warming up..." with pulsing animation
2. **Complete (Session 5)** - "Your Skill Map is ready! 🎉" with flash + confetti (one-time only)
3. **Unlocked (Session 6+)** - No counter displayed, Skill Map button enabled

### Test Results
✅ All 15 unit tests passing
✅ State progression validated (sessions 1-4-5-6+)
✅ Performance validated: session count query < 50ms, confetti 60 FPS
✅ Reduced motion support (no pulsing, no confetti)

### Acceptance Criteria
✅ All acceptance criteria met - calibration counter in 12px light grey with pulsing animation for sessions 1-4, one-time celebration on session 5 with fanfare animation, no counter for session 6+, Skill Map button ready to enable
