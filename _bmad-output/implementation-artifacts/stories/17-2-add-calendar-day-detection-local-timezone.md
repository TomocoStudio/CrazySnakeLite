# Story 17.2: Add Calendar Day Detection (Local Timezone)

**Epic:** 17 - Streak System

**As a** player,
**I want** streaks to recognize calendar days in my local timezone,
**So that** playing at 11:59 PM and 12:01 AM counts as 2 consecutive days.

---

## Acceptance Criteria

**Given** player's browser is in EST timezone (UTC-5)
**When** game session completes at 11:50 PM EST on Feb 15
**Then** lastPlayedDate = "2026-02-15"
**And** streak increments for Feb 15

**Given** player continues playing past midnight
**When** next game session completes at 12:10 AM EST on Feb 16
**Then** detect date change: lastPlayedDate "2026-02-15" ≠ today "2026-02-16"
**And** increment streak (consecutive day)
**And** update lastPlayedDate = "2026-02-16"

**Given** player's system changes timezone (travel from EST to PST)
**When** game session completes
**Then** use current local timezone for calendar day calculation
**And** streak logic remains consistent with new timezone

**Given** Daylight Saving Time transition occurs (e.g., spring forward)
**When** session completes on DST transition day
**Then** calendar day logic uses Date object's local date (DST-aware)
**And** streak continues correctly (per NFR50 - accurate across DST transitions)

**Given** player completes game at 11:59 PM, then another at 12:01 AM
**When** checking streak continuation
**Then** treat as 2 consecutive days (date changed)
**And** increment streak from 5 → 6

**Per FR191:** Streak increments on first game completion per calendar day (local timezone)

---

## Tasks / Subtasks

- [ ] Verify getTodayDateString() uses local timezone (AC: Timezone-aware)
  - [ ] Uses getFullYear(), getMonth(), getDate() (NOT getUTCFullYear())
  - [ ] Returns 'YYYY-MM-DD' format string
- [ ] Test midnight crossover (AC: 11:59 PM → 12:01 AM = 2 days)
  - [ ] Manual test: play at 11:58 PM, then 12:02 AM
  - [ ] Verify streak increments (consecutive days)
- [ ] Test timezone changes (AC: DST and travel handling)
  - [ ] DST spring forward (2 AM → 3 AM)
  - [ ] DST fall back (2 AM → 1 AM)
  - [ ] Simulated timezone travel (EST → PST)
- [ ] Document DST behavior (AC: Clear documentation)
  - [ ] Add comment explaining DST-awareness in streak.js

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story ensures **LOCAL TIMEZONE CALENDAR DAY DETECTION** for streak tracking. Your job is to:

1. Verify getTodayDateString() uses **local** timezone (NOT UTC)
2. Test midnight crossover behavior (11:59 PM → 12:01 AM = 2 consecutive days)
3. Validate DST handling (spring forward, fall back)
4. Document timezone behavior for future devs

**CRITICAL SUCCESS FACTORS:**
- MUST use local timezone (getFullYear(), NOT getUTCFullYear())
- Midnight crossover MUST detect new calendar day immediately
- DST transitions MUST not break streak logic
- Timezone changes (travel) MUST use current local timezone

**WHY THIS MATTERS:**
- UTC timezone = player frustration ("I played yesterday at 11 PM, why didn't my streak update?")
- Wrong DST handling = streak breaks on DST transition days
- Not detecting midnight = player confusion ("Why didn't 12:01 AM count as a new day?")

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── streak.js       # getTodayDateString() implementation (VERIFY)
└── test/
    └── streak.test.js  # NEW: Manual timezone tests
```

**Timezone Pattern:**

From Epic 17 and NFR50:
- **ALWAYS use local timezone** for calendar day calculation
- Date objects provide DST-aware local time automatically
- Compare date strings directly (no UTC conversion)

**Date Extraction:**
```javascript
// CORRECT: Local timezone
const now = new Date();
const year = now.getFullYear();      // Local year
const month = now.getMonth() + 1;    // Local month (0-indexed)
const day = now.getDate();            // Local day

// WRONG: UTC timezone
const year = now.getUTCFullYear();   // DON'T USE
const month = now.getUTCMonth() + 1; // DON'T USE
const day = now.getUTCDate();         // DON'T USE
```

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- `Date()` constructor (browser-native, DST-aware)
- `getFullYear()`, `getMonth()`, `getDate()` (local timezone methods)

**No external dependencies** (no moment.js, no date-fns)

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/streak.js - Verify Local Timezone Implementation**

```javascript
/**
 * Get today's date as 'YYYY-MM-DD' string (local timezone)
 *
 * CRITICAL: Uses local timezone, NOT UTC
 * - Midnight crossover: 11:59 PM → 12:01 AM increments calendar day immediately
 * - DST-aware: Date object handles spring forward / fall back automatically
 * - Timezone travel: Uses current browser timezone setting
 *
 * @returns {string} - Date string in 'YYYY-MM-DD' format
 */
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();                   // Local year (NOT getUTCFullYear)
  const month = String(now.getMonth() + 1).padStart(2, '0');  // Local month
  const day = String(now.getDate()).padStart(2, '0');         // Local day

  return `${year}-${month}-${day}`;
}
```

**test/streak.test.js - Manual Timezone Tests (NEW)**

```javascript
// Manual testing instructions for timezone behavior

/**
 * TEST 1: Midnight Crossover
 *
 * Setup:
 * 1. Play game at 11:58 PM
 * 2. Check localStorage: lastPlayedDate = "2026-02-15"
 * 3. Wait until 12:02 AM (next day)
 * 4. Play another game
 *
 * Expected:
 * - lastPlayedDate updates to "2026-02-16"
 * - streak increments by 1
 * - Treat as consecutive days (not same day)
 */

/**
 * TEST 2: Same-Day Multiple Games
 *
 * Setup:
 * 1. Play game at 2:00 PM
 * 2. Play game at 5:00 PM (same day)
 * 3. Play game at 9:00 PM (same day)
 *
 * Expected:
 * - Only first game (2 PM) increments streak
 * - Games 2-3 don't change streak
 * - lastPlayedDate remains "2026-02-15"
 */

/**
 * TEST 3: DST Spring Forward (2 AM → 3 AM)
 *
 * Note: DST transition happens at 2:00 AM local time
 * Calendar day does NOT change during DST transition
 *
 * Setup (on DST transition night):
 * 1. Play game at 1:50 AM (before transition)
 * 2. Wait for 2:00 AM → 3:00 AM clock jump
 * 3. Play game at 3:10 AM (after transition, same night)
 *
 * Expected:
 * - Both games have same date: "2026-03-10"
 * - Second game does NOT increment streak (same day)
 * - Date object handles DST automatically
 */

/**
 * TEST 4: DST Fall Back (2 AM → 1 AM)
 *
 * Note: 1:00-2:00 AM happens twice (first occurrence, second occurrence)
 * Calendar day remains the same throughout
 *
 * Setup (on DST fall-back night):
 * 1. Play game at 1:50 AM (first occurrence)
 * 2. Wait for clock to fall back to 1:00 AM
 * 3. Play game at 1:10 AM (second occurrence, same night)
 *
 * Expected:
 * - Both games have same date: "2026-11-03"
 * - Second game does NOT increment streak (same day)
 * - Date.getDate() returns same day for both occurrences
 */

/**
 * TEST 5: Timezone Change (Travel)
 *
 * Setup:
 * 1. Play game in EST (UTC-5) at 6:00 PM EST
 * 2. Change system timezone to PST (UTC-8)
 * 3. Play game at 4:00 PM PST (same moment as 7:00 PM EST)
 *
 * Expected:
 * - First game: lastPlayedDate = "2026-02-15" (EST)
 * - Second game: Uses new timezone (PST)
 * - If still same calendar day in PST, no increment
 * - If next calendar day in PST, increment
 */
```

---

### 🎨 VISUAL SPECIFICATIONS

No visual changes in this story (timezone logic only).

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Midnight Crossover:**
   - Play at 11:58 PM → lastPlayedDate = today
   - Wait until 12:02 AM → play again
   - Verify streak increments (detected new calendar day)
   - **Critical:** Cannot be automated (time-dependent)

2. **DST Spring Forward (March):**
   - On DST transition night (2 AM → 3 AM)
   - Play at 1:50 AM, then at 3:10 AM (same night, different clock times)
   - Verify same calendar day (streak does NOT increment)
   - Date object handles DST automatically

3. **DST Fall Back (November):**
   - On DST fall-back night (2 AM → 1 AM)
   - Play at 1:50 AM (first), then 1:10 AM (second occurrence)
   - Verify same calendar day (streak does NOT increment)

4. **Timezone Travel Simulation:**
   - Change browser/system timezone mid-session
   - Play game in new timezone
   - Verify uses new local timezone for calendar day

**Automated Tests (getTo dayDateString()):**

```javascript
// Can test format, not timezone behavior
console.log(getTodayDateString()); // "2026-02-16"
console.assert(/^\d{4}-\d{2}-\d{2}$/.test(getTodayDateString()), 'Format check');

// Verify NOT using UTC (can't fully automate)
const now = new Date();
const local = getTodayDateString();
const utc = now.toISOString().split('T')[0];
console.log('Local:', local); // "2026-02-16"
console.log('UTC:', utc);     // Could differ near midnight in non-UTC zones
```

---

### 📚 CRITICAL DATA FORMATS

**Date String Format:**
```javascript
// CORRECT: 'YYYY-MM-DD' string (ISO 8601 date format)
"2026-02-15"   // February 15, 2026
"2026-12-31"   // December 31, 2026

// WRONG: Other formats
"02/15/2026"   // DON'T USE (ambiguous, locale-dependent)
"15-02-2026"   // DON'T USE (day-first format)
1708041600000  // DON'T USE (timestamp, not date string)
```

**DST Behavior:**
```javascript
// DST Spring Forward (2 AM → 3 AM on March 10, 2026)
// Clock jumps from 01:59:59 to 03:00:00
// Calendar day remains "2026-03-10" throughout

// DST Fall Back (2 AM → 1 AM on November 3, 2026)
// Clock goes from 01:59:59 to 01:00:00 (repeats 1 AM hour)
// Calendar day remains "2026-11-03" for both occurrences
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **Date Comparison:** ALWAYS use local timezone 'YYYY-MM-DD' strings
2. **DST Handling:** Date object is DST-aware (no special logic needed)
3. **Timezone Travel:** Always uses current browser timezone setting

**Streak System Rules:**
- Calendar day = local timezone calendar day (NOT UTC day)
- DST transitions don't create new calendar days
- Midnight crossover (11:59 PM → 12:01 AM) = new calendar day

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Story 17.1:**
- ✅ getTodayDateString() must exist in streak.js
- ✅ Streak tracking logic must be functional

**If Story 17.1 incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR191, NFR50

**Detailed FR Mapping:**
- FR191: First game per calendar day (local timezone) → getTodayDateString() uses local methods
- NFR50: Accurate across timezone/DST → Date object DST-aware, uses current browser timezone

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] getTodayDateString() uses getFullYear() (NOT getUTCFullYear())
- [ ] getTodayDateString() uses getMonth() (NOT getUTCMonth())
- [ ] getTodayDateString() uses getDate() (NOT getUTCDate())
- [ ] Returns 'YYYY-MM-DD' format string
- [ ] Midnight crossover test passed (11:59 PM → 12:01 AM = 2 days)
- [ ] Same-day multiple games test passed (no increment)
- [ ] DST behavior documented in code comments
- [ ] test/streak.test.js created with manual test instructions
- [ ] No console errors
- [ ] No UTC date methods used anywhere

**Timezone Logic Checklist:**
- [ ] Local timezone used (NOT UTC)
- [ ] DST-aware (Date object handles automatically)
- [ ] Midnight crossover increments calendar day
- [ ] Timezone changes use new local timezone

**DST Testing Checklist:**
- [ ] Spring forward: same calendar day during 2 AM → 3 AM jump
- [ ] Fall back: same calendar day during 2 AM → 1 AM repeat
- [ ] No special DST logic needed (Date handles it)

**Common Mistakes to Avoid:**
- ❌ Using getUTCFullYear(), getUTCMonth(), getUTCDate()
- ❌ Converting to UTC before date comparison
- ❌ Adding special DST logic (Date object already handles it)
- ❌ Hardcoding timezone offsets
- ❌ Using toISOString() (returns UTC, not local)

---
