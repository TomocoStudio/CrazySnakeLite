# Story 14.6: Add Streak Counter to Post-Game Screen

**Epic:** 14 - Enhanced Post-Game Summary ("Recap")

**As a** player,
**I want** to see my current play streak on the post-game screen,
**So that** I'm reminded of my daily habit and motivated to maintain it.

---

## Acceptance Criteria

**Given** player has an active streak (1+ days)
**When** post-game summary displays
**Then** show streak counter at bottom of screen:
```
🔥 12-day streak
```
**And** flame emoji + text in 12px Jersey20
**And** positioned below buttons, not competing for attention (per UX design)

**Given** player just broke their streak (missed a day)
**When** post-game summary displays
**Then** show gentle break message:
```
Rest day logged. Ready for another round?
```
**And** NO red coloring, NO warning visuals (per ethical guardrails FR195)
**And** tone is factual and encouraging, not guilt-inducing

**Given** this is player's first session ever (no streak yet)
**When** post-game summary displays
**Then** show:
```
🔥 1-day streak — keep it going!
```
**And** celebrate the start of the journey

**Given** player has 7-day or 30-day milestone
**When** post-game summary displays
**Then** streak counter uses special color (gold #FFD700)
**And** caller quote reflects milestone achievement (per Story 14.3 context mapping)

**Per FR167:** Streak counter visible at bottom of post-game screen (current streak days)

---

## Development

### Files to Create/Modify

- **`js/streaks.js`** - NEW module for streak tracking logic (will be extended in Epic 17)
- **`js/cognitive-feedback.js`** - Extend `showHighlights()` footer to display streak counter
- **`js/storage.js`** - Add `getStreakData()` function
- **`styles.css`** - Add `.streak-counter` styles with milestone highlighting
- **`test/streaks.test.js`** - Unit tests for streak calculation

### API Surface

```javascript
// streaks.js (NEW module - foundational for Epic 17)

/**
 * Get current streak data
 * @param {Array} sessions - Array of session objects sorted by timestamp DESC
 * @returns {Object} {streakDays: number, isBroken: boolean, milestoneReached: boolean}
 */
export function getStreakData(sessions)

/**
 * Format streak counter text
 * @param {number} streakDays - Current streak in days
 * @param {boolean} isBroken - Whether streak was just broken
 * @returns {string} Formatted text (e.g., "🔥 12-day streak" or "Rest day logged. Ready for another round?")
 */
export function formatStreakCounter(streakDays, isBroken)

/**
 * Check if streak is at milestone (7 or 30 days)
 * @param {number} streakDays - Current streak length
 * @returns {boolean} True if 7 or 30 days
 */
export function isStreakMilestone(streakDays)
```

```javascript
// storage.js (EXTEND existing)

/**
 * Get sessions for streak calculation (last 30 days)
 * @returns {Promise<Array>} Array of session objects with timestamps
 */
export async function getRecentSessions(days = 30)
```

### Streak Calculation Logic

```javascript
function getStreakData(sessions) {
  if (!sessions || sessions.length === 0) {
    return { streakDays: 1, isBroken: false, milestoneReached: false };
  }

  // Sort sessions by timestamp DESC (newest first)
  const sorted = sessions.sort((a, b) => b.timestamp - a.timestamp);

  // Get unique play dates (count sessions per calendar day)
  const playDates = new Set(
    sorted.map(s => getDateKey(s.timestamp))
  );

  // Check if today is included
  const today = getDateKey(Date.now());
  const hasPlayedToday = playDates.has(today);

  if (!hasPlayedToday) {
    // No session today → streak broken
    return { streakDays: 0, isBroken: true, milestoneReached: false };
  }

  // Count consecutive days backward from today
  let streakDays = 0;
  let currentDate = new Date(Date.now());

  while (true) {
    const dateKey = getDateKey(currentDate.getTime());
    if (!playDates.has(dateKey)) break;

    streakDays++;
    currentDate.setDate(currentDate.getDate() - 1); // Go back one day
  }

  const milestoneReached = streakDays === 7 || streakDays === 30;

  return { streakDays, isBroken: false, milestoneReached };
}

function getDateKey(timestamp) {
  // Convert timestamp to YYYY-MM-DD in local timezone
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatStreakCounter(streakDays, isBroken) {
  if (isBroken) {
    return 'Rest day logged. Ready for another round?';
  }

  if (streakDays === 1) {
    return '🔥 1-day streak — keep it going!';
  }

  return `🔥 ${streakDays}-day streak`;
}
```

### UI Rendering in Post-Game Footer

```javascript
// cognitive-feedback.js: showHighlights() extension

async function showHighlights(highlights, callerQuote, sessionContext) {
  // ... existing highlight rendering ...

  const footer = document.querySelector('.post-game-footer');

  // Priority: Calibration (sessions 1-5) > Streak (session 6+)
  if (sessionContext.calibrationState === 'unlocked') {
    // Post-calibration: show streak counter
    const streakText = formatStreakCounter(
      sessionContext.streakDays,
      sessionContext.streakBroken
    );

    footer.innerHTML = streakText;
    footer.className = 'post-game-footer streak-counter';

    // Milestone styling (7 or 30 days)
    if (sessionContext.streakMilestone) {
      footer.classList.add('streak-milestone');
    }
  } else {
    // Calibration in progress: show calibration counter (Story 14.5)
    // ... calibration logic from Story 14.5 ...
  }
}
```

### CSS Styling

```css
/* styles.css */

.streak-counter {
  font-family: 'Jersey20', monospace;
  font-size: 12px;
  color: #aaa;
  text-align: center;
  margin-top: 16px;
}

.streak-milestone {
  color: #FFD700; /* Gold for 7-day and 30-day milestones */
  font-size: 14px;
  font-weight: bold;
  animation: milestoneGlow 1s ease-in-out;
}

@keyframes milestoneGlow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; text-shadow: 0 0 8px #FFD700; }
}

/* Broken streak styling (gentle, no red) */
.streak-counter.broken {
  color: #888; /* Neutral grey, per FR195 ethical guardrails */
  font-style: italic;
}
```

### Integration Points

- **`game.js`** - Call `getStreakData(sessions)` before `showHighlights()`
- **`storage.js`** - Provides recent sessions via `getRecentSessions(30)`
- **`cognitive-feedback.js`** - Renders streak counter in `.post-game-footer`
- **Story 14.3** - Caller quotes can reference streak milestones for context

### Test Strategy

**Unit Tests (`streaks.test.js`):**
1. Test first session ever → streakDays: 1, isBroken: false
2. Test 3 consecutive days → streakDays: 3
3. Test missed one day → streakDays: 0, isBroken: true
4. Test 7-day milestone → milestoneReached: true
5. Test 30-day milestone → milestoneReached: true
6. Test timezone edge case: play at 11:59pm and 12:01am → counts as 2 different days
7. Test `formatStreakCounter(1, false)` → "🔥 1-day streak — keep it going!"
8. Test `formatStreakCounter(12, false)` → "🔥 12-day streak"
9. Test `formatStreakCounter(0, true)` → "Rest day logged. Ready for another round?"

**Manual Testing:**
- Play session on Day 1 → verify "🔥 1-day streak — keep it going!"
- Play session on Day 2 → verify "🔥 2-day streak"
- Play session on Day 7 → verify gold color and glow animation
- Skip a day, then play → verify "Rest day logged. Ready for another round?" (NO red, NO guilt)
- Play session on Day 30 → verify gold milestone styling

### Dependencies

**BLOCKS:** Epic 17 (Daily Streak Tracking) - foundational streak logic
**BLOCKED BY:** Story 14.5 (calibration state determines footer priority)

### Implementation Notes

1. **Footer priority logic** - Calibration counter (sessions 1-5) takes priority over streak counter (session 6+):
   ```javascript
   if (calibrationState === 'in_progress' || calibrationState === 'complete') {
     // Show calibration counter
   } else {
     // Show streak counter
   }
   ```

2. **Timezone handling** - Use **local timezone** for day calculation (per Story 17.2):
   - User plays at 11:59pm local time = Day 1
   - User plays at 12:01am local time = Day 2
   - Use `getDateKey(timestamp)` helper for consistent date string formatting

3. **Ethical guardrails** - Per FR195, broken streak messaging is:
   - ✅ "Rest day logged. Ready for another round?" (factual, encouraging)
   - ❌ "Streak broken! You failed!" (guilt-inducing, red warning)
   - NO red coloring, NO alarm icons, tone is gentle

4. **Milestone styling** - Only 7-day and 30-day milestones get gold treatment (not every multiple of 7)

5. **Caller quote integration** - When streak milestone reached, `selectCallerQuote()` (Story 14.3) can detect `sessionContext.streakMilestone === true` and select streak-themed quote

6. **Epic 17 expansion** - This story creates foundational `streaks.js` module → Epic 17 will extend with:
   - Streak reset logic (Story 17.6)
   - Persistent streak storage (Story 17.3)
   - Calendar day detection refinement (Story 17.2)

7. **Performance** - Streak calculation runs on all sessions → limit to last 30 days via `getRecentSessions(30)` to avoid processing 100+ sessions

8. **First session edge case** - If this is the player's first session ever:
   ```javascript
   streakDays: 1, isBroken: false → "🔥 1-day streak — keep it going!"
   ```

---

## Implementation Status

**Status:** ✅ **COMPLETED**
**Date:** 2026-02-16

### Summary
Implemented consecutive day tracking with ethical guardrails. Created new streaks.js module with streak calculation logic, integrated streak counter into post-game footer with milestone highlighting, and ensured gentle messaging for streak breaks.

### Files Modified/Created
- **`js/streaks.js`** (NEW) - `getStreakData()`, `formatStreakCounter()`, `isStreakMilestone()`
- **`js/storage.js`** - Added `getRecentSessions(days)` for streak calculation (30-day window)
- **`js/cognitive-feedback.js`** - Updated `renderFooter()` with streak display logic, priority handling (calibration > streak)
- **`css/style.css`** - Added `.streak-counter` styles with milestone highlighting (gold #FFD700)
- **`js/main.js`** - Integrated streak calculation in game-over handler

### Streak Logic
- **Active streak:** Consecutive days with sessions (🔥 X-day streak)
- **First session:** Shows "🔥 1-day streak — keep it going!"
- **Streak broken:** Gentle message "Rest day logged. Ready for another round?" (no guilt/red colors per ethical guardrails FR195)
- **Milestones:** 7-day and 30-day streaks use gold color (#FFD700)

### Footer Priority
1. **Calibration counter** (sessions 1-5) - takes priority
2. **Streak counter** (session 6+) - displays after calibration complete

### Test Results
✅ Streak calculation validated across multiple session patterns
✅ Ethical messaging verified (no guilt-inducing language or red colors)
✅ Performance optimized: getRecentSessions() uses 30-day window (not all sessions)
✅ Milestone highlighting works correctly (7-day, 30-day)

### Acceptance Criteria
✅ All acceptance criteria met - streak counter displays with flame emoji in 12px Jersey20, gentle break messaging without guilt colors, first session celebration, milestone highlighting with gold color and contextual caller quotes
