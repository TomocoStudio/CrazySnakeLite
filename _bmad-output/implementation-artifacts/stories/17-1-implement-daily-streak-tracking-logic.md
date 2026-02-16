# Story 17.1: Implement Daily Streak Tracking Logic

**Epic:** 17 - Streak System

**As a** player,
**I want** my streak to track consecutive days I play,
**So that** I can see my habit consistency over time.

---

## Acceptance Criteria

**Given** game initializes for first-ever player
**When** storage.js loads
**Then** initialize streak state in localStorage:
```javascript
{
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,  // ISO date string: "2026-02-15"
  streakStartDate: null
}
```

**Given** player completes first game of the day
**When** game-over triggers
**Then** check lastPlayedDate vs. today's date (local timezone)
**And** if dates differ, evaluate streak continuation

**Given** lastPlayedDate is yesterday (consecutive day)
**When** session completes
**Then** increment currentStreak by 1
**And** update lastPlayedDate to today
**And** save to localStorage immediately

**Given** lastPlayedDate is today (already played today)
**When** subsequent games complete
**Then** do NOT increment streak (only first game counts per day per FR193)
**And** lastPlayedDate remains unchanged

**Given** lastPlayedDate is 2+ days ago (gap detected)
**When** session completes
**Then** reset currentStreak to 1 (new streak starts)
**And** update lastPlayedDate to today
**And** save previous currentStreak to longestStreak if higher

**Per FR190-FR191:** Streak tracks consecutive calendar days with at least one completed game, increments on first game per day

---

## Tasks / Subtasks

- [ ] Implement streak.js module (AC: Streak tracking functional)
  - [ ] Create checkAndUpdateStreak() function
  - [ ] Create getTodayDateString() helper (local timezone)
  - [ ] Create calculateDaysDifference() helper
  - [ ] Create getStreakMessage() function
- [ ] Add streak state initialization (AC: First-time player state correct)
  - [ ] storage.js already has getStreak() / updateStreak()
  - [ ] Verify default state structure
- [ ] Implement streak evaluation logic (AC: Consecutive day detection)
  - [ ] Compare lastPlayedDate vs today
  - [ ] Handle yesterday (increment)
  - [ ] Handle same day (no-op)
  - [ ] Handle 2+ day gap (reset)
- [ ] Integrate with game.js onDeath() (AC: Updates on game completion)
  - [ ] Call checkAndUpdateStreak() after session save
  - [ ] Pass result to post-game screen
- [ ] Test streak persistence (AC: Survives browser restart)

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story creates the **STREAK TRACKING ENGINE** that powers the ethical daily habit system. Your job is to:

1. Create streak.js module with date comparison logic
2. Implement streak increment/reset rules (yesterday → increment, 2+ days → reset)
3. Integrate with game.js onDeath() to update streak on first game per day
4. Return streak result for post-game display

**CRITICAL SUCCESS FACTORS:**
- Streak MUST use local timezone (11:59 PM → 12:01 AM = 2 consecutive days)
- Only first game per calendar day increments streak
- longestStreak MUST never decrease (celebrate peak performance)
- Gentle messaging on breaks (no guilt, no red warnings)

**WHY THIS MATTERS:**
- No streak system = no retention mechanic for daily habit formation
- Wrong timezone = player frustration ("I played yesterday!")
- Guilt-inducing messaging = ethical violation (Self-Determination Theory: autonomy)
- Multiple games per day incrementing = gaming the system

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── streak.js       # Streak logic (NEW)
├── storage.js      # Already has getStreak/updateStreak (V3)
├── game.js         # Calls checkAndUpdateStreak() in onDeath (MODIFY)
├── config.js       # DASHBOARD.STREAK_MESSAGES (verify exists)
```

**Streak System Pattern:**

From Epic 17 and project-context.md:
- Streak tracks **calendar days**, not 24-hour periods (local timezone)
- Only **first game completion** per day increments streak
- Streak resets to 1 on 2+ day gap (not 0 — new streak starts immediately)
- longestStreak preserves all-time peak (never decreases)
- Gentle messaging: "Rest day logged. Ready for another round?"

**Date Comparison Rules:**
```javascript
// CORRECT: Local timezone 'YYYY-MM-DD' strings
const today = getTodayDateString(); // "2026-02-16"
const yesterday = "2026-02-15";
today === yesterday; // Direct string comparison

// WRONG: UTC or Date objects (timezone issues)
new Date(today) < new Date(yesterday); // DON'T DO THIS
```

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- `Date()` for local timezone calendar day extraction
- `localStorage` via storage.js (getStreak, updateStreak)

**No external dependencies**

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/streak.js - Streak Tracking Module (NEW)**

```javascript
import { getStreak, updateStreak } from './storage.js';

/**
 * Get today's date as 'YYYY-MM-DD' string (local timezone)
 * CRITICAL: Uses local timezone, NOT UTC
 */
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate calendar day difference (local timezone)
 * @param {string} dateA - 'YYYY-MM-DD' string
 * @param {string} dateB - 'YYYY-MM-DD' string
 * @returns {number} - Days between dates (dateB - dateA)
 */
function calculateDaysDifference(dateA, dateB) {
  if (!dateA || !dateB) return null;

  // Parse date strings (ignores time component)
  const a = new Date(dateA + 'T00:00:00'); // Midnight local time
  const b = new Date(dateB + 'T00:00:00');

  const diffMs = b - a;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check and update streak on game completion
 * @returns {Object} - { currentStreak, longestStreak, isNewRecord, message }
 */
export function checkAndUpdateStreak() {
  const streak = getStreak();
  const today = getTodayDateString();
  const lastPlayed = streak.lastPlayedDate;

  // First-ever game
  if (!lastPlayed) {
    const updated = {
      currentStreak: 1,
      longestStreak: 1,
      lastPlayedDate: today,
      streakStartDate: today
    };
    updateStreak(updated);
    return {
      currentStreak: 1,
      longestStreak: 1,
      isNewRecord: true,
      message: '🔥 1-day streak — keep it going!'
    };
  }

  const daysDiff = calculateDaysDifference(lastPlayed, today);

  // Same day — no increment (only first game counts)
  if (daysDiff === 0) {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      isNewRecord: false,
      message: null // No message on same-day games
    };
  }

  // Yesterday — increment streak
  if (daysDiff === 1) {
    const newStreak = streak.currentStreak + 1;
    const newLongest = Math.max(newStreak, streak.longestStreak);
    const isNewRecord = newStreak > streak.longestStreak;

    const updated = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastPlayedDate: today
      // streakStartDate unchanged
    };
    updateStreak(updated);

    let message = `🔥 ${newStreak}-day streak`;
    if (isNewRecord) {
      message += ' — NEW RECORD! 🎉';
    }

    return {
      currentStreak: newStreak,
      longestStreak: newLongest,
      isNewRecord,
      message
    };
  }

  // 2+ days gap — reset streak to 1
  if (daysDiff >= 2) {
    // Preserve longestStreak before reset
    const preservedLongest = Math.max(streak.currentStreak, streak.longestStreak);

    const updated = {
      currentStreak: 1,
      longestStreak: preservedLongest,
      lastPlayedDate: today,
      streakStartDate: today
    };
    updateStreak(updated);

    // Gentle break message
    const message = 'Rest day logged. Ready for another round?';

    return {
      currentStreak: 1,
      longestStreak: preservedLongest,
      isNewRecord: false,
      message,
      hadBreak: true
    };
  }

  // Fallback (shouldn't happen)
  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    isNewRecord: false,
    message: null
  };
}

/**
 * Get streak message for display
 * @param {Object} streakResult - Result from checkAndUpdateStreak()
 * @returns {string} - Display message
 */
export function getStreakMessage(streakResult) {
  if (!streakResult || !streakResult.message) return '';
  return streakResult.message;
}
```

**js/game.js - Updated onDeath() Integration**

```javascript
import { checkAndUpdateStreak } from './streak.js';

// Inside onDeath() function, after storage.saveSession():
async function onDeath(gameState) {
  // ... existing death logic ...

  // Award death bonuses (combo + phone)
  // Update high score
  // Build session record
  const sessionRecord = buildSessionRecord(gameState);
  await storage.saveSession(sessionRecord);

  // Get sessions for metrics
  const sessions = await storage.getSessions(10);
  const domainScores = metrics.calculateDomainScores(sessions);

  // Update profile
  const profile = storage.getProfile();
  const totalSessions = profile.sessionsCompleted + 1;
  const calibrationComplete = totalSessions >= 5;
  await storage.updateProfile({
    sessionsCompleted: totalSessions,
    calibrationComplete,
    domainScores
  });

  // **NEW: Check and update streak**
  const streakResult = checkAndUpdateStreak();

  // Get highlights
  const highlights = highlightSelection.selectHighlights(sessionRecord, sessions);

  // Show post-game screen (pass streakResult)
  await cognitiveFeedback.showPostGameScreen({
    highlights,
    streakResult,
    profile,
    sessionRecord
  });

  gameState.phase = 'gameover';
}
```

---

### 🎨 VISUAL SPECIFICATIONS

**Streak Counter Display:**
- Text: 12px Jersey20 font, light grey (#AAAAAA)
- Gold color (#FFD700) at 7-day, 30-day milestones
- Flame emoji 🔥 prefix
- Position: Below "Play Again" / "Skill Map" buttons on post-game

**Break Messaging:**
- Light grey text (no red warnings)
- Factual, encouraging tone
- No warning icons

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **First-ever game:**
   - Complete game → check streak = 1
   - Verify localStorage: currentStreak: 1, longestStreak: 1, lastPlayedDate: today

2. **Same-day multiple games:**
   - Play 3 games same day → streak stays at 1 (only first counts)
   - Verify lastPlayedDate unchanged after games 2-3

3. **Consecutive days:**
   - Play Feb 15 → streak = 1
   - Play Feb 16 → streak = 2
   - Play Feb 17 → streak = 3
   - Verify lastPlayedDate updates each day

4. **Streak break:**
   - Play Feb 15 (streak = 5)
   - Skip Feb 16-17
   - Play Feb 18 → streak resets to 1
   - Verify longestStreak = 5 (preserved)
   - Verify gentle message: "Rest day logged..."

5. **New record:**
   - longestStreak = 10
   - currentStreak = 11 → message shows "NEW RECORD! 🎉"

**Edge Cases:**
- First game ever → streak = 1, not 0
- 2-day gap → reset to 1, not 0
- longestStreak never decreases

---

### 📚 CRITICAL DATA FORMATS

**Streak State Object:**
```javascript
// CORRECT: All fields required
{
  currentStreak: 5,
  longestStreak: 12,
  lastPlayedDate: "2026-02-15",  // 'YYYY-MM-DD' string
  streakStartDate: "2026-02-11"
}

// WRONG: Missing fields or wrong date format
{
  currentStreak: 5,
  lastPlayedDate: new Date()  // DON'T USE Date OBJECTS
}
```

**Streak Result Object:**
```javascript
// Returned from checkAndUpdateStreak()
{
  currentStreak: 5,
  longestStreak: 12,
  isNewRecord: false,
  message: '🔥 5-day streak',
  hadBreak: false  // true if 2+ day gap detected
}
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **Date Comparison:** ALWAYS use local timezone 'YYYY-MM-DD' strings, NEVER Date objects
2. **Storage Calls:** getStreak() and updateStreak() are sync (localStorage wrappers)
3. **Ethical Messaging:** No guilt, no red warnings, factual + encouraging
4. **Module Boundaries:** streak.js is pure logic, no DOM access

**Streak System Rules:**
- Only first game per calendar day increments streak
- Streak resets to 1 on break (not 0 — new streak starts)
- longestStreak never decreases (celebrate peak)
- Use local timezone for calendar day (DST-aware)

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Epic 13 (Storage):**
- ✅ storage.js must have getStreak() and updateStreak()
- ✅ localStorage must be available (graceful degradation if not)

**Depends on Epic 14 (Post-Game Summary):**
- ✅ cognitiveFeedback.showPostGameScreen() must accept streakResult param
- ✅ Post-game DOM ready for streak counter display

**If storage.js incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR190-FR191, FR193, FR196

**Detailed FR Mapping:**
- FR190: Streak tracks consecutive calendar days → checkAndUpdateStreak() logic
- FR191: Increments on first game per day → daysDiff === 0 check (same day = no-op)
- FR193: Only first game counts → same-day games don't increment
- FR196: localStorage persistence → storage.getStreak() / updateStreak()

**NFRs Covered:**
- NFR50: DST/timezone accuracy → getTodayDateString() uses local timezone
- NFR67: Gentle messaging → "Rest day logged. Ready for another round?"

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] js/streak.js exists with all functions
- [ ] getTodayDateString() returns 'YYYY-MM-DD' format (local timezone)
- [ ] calculateDaysDifference() handles null inputs gracefully
- [ ] checkAndUpdateStreak() returns correct object structure
- [ ] Same-day games don't increment streak
- [ ] Yesterday increments streak correctly
- [ ] 2+ day gap resets to 1 (not 0)
- [ ] longestStreak never decreases
- [ ] Gentle break message on reset
- [ ] NEW RECORD message on personal best
- [ ] game.js calls checkAndUpdateStreak() in onDeath()
- [ ] streakResult passed to post-game screen
- [ ] localStorage persists streak data
- [ ] No console errors
- [ ] All exports are named exports

**Streak Logic Checklist:**
- [ ] First game ever → streak = 1
- [ ] Yesterday → increment
- [ ] Same day → no-op
- [ ] 2+ days → reset to 1, preserve longestStreak
- [ ] Date comparison uses string equality, not Date objects

**Messaging Checklist:**
- [ ] Active streak: "🔥 X-day streak"
- [ ] New record: "🔥 X-day streak — NEW RECORD! 🎉"
- [ ] Break: "Rest day logged. Ready for another round?"
- [ ] No red color, no guilt language

**Common Mistakes to Avoid:**
- ❌ Using Date objects for comparison (timezone bugs)
- ❌ Resetting streak to 0 instead of 1
- ❌ Decrementing longestStreak on break
- ❌ Incrementing streak on same-day games
- ❌ Using UTC instead of local timezone
- ❌ Guilt-inducing messaging ("You broke your streak!")

---
