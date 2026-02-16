# Story 17.7: Test Streak Edge Cases and Timezone Handling

**Epic:** 17 - Streak System

**As a** developer,
**I want** comprehensive tests for streak logic edge cases,
**So that** streaks are calculated accurately across all scenarios.

---

## Acceptance Criteria

**Given** player completes 3 games in one day
**When** streak logic runs
**Then** only first game increments streak (games 2-3 ignored per FR193)
**And** lastPlayedDate remains unchanged after games 2-3

**Given** player plays at 11:58 PM, then 12:02 AM (crosses midnight)
**When** second session completes
**Then** detect new calendar day
**And** increment streak (consecutive days)

**Given** player's system clock is manually changed backward 1 day
**When** session completes
**Then** use system's current date (no tampering detection)
**And** calculate streak based on system date (player could "cheat" but unlikely)

**Given** player travels across timezones (EST → PST, 3-hour difference)
**When** session completes in new timezone
**Then** use new local timezone for calendar day calculation
**And** streak continues if calendar dates are consecutive in new timezone

**Given** Daylight Saving Time "spring forward" occurs (2 AM → 3 AM)
**When** player plays at 1:50 AM, then 3:10 AM (same night, different dates)
**Then** calendar day unchanged (still same date despite clock jump)
**And** streak does NOT increment (same day)

**Given** Daylight Saving Time "fall back" occurs (2 AM → 1 AM)
**When** player plays at 1:50 AM first occurrence, then 1:10 AM second occurrence
**Then** calendar day unchanged (Date object handles DST automatically)
**And** streak logic remains consistent

**Per NFR50:** Streak tracking accurate across browser timezone changes and daylight saving time transitions

---

## Tasks / Subtasks

- [ ] Create comprehensive test suite (AC: All edge cases covered)
  - [ ] test/streak.test.js with all scenarios
  - [ ] Manual test instructions documented
- [ ] Test multiple games per day (AC: Only first increments)
  - [ ] 3 games same day → streak stays same
  - [ ] lastPlayedDate unchanged after games 2-3
- [ ] Test midnight crossover (AC: New calendar day detected)
  - [ ] 11:58 PM → 12:02 AM = 2 consecutive days
  - [ ] Streak increments correctly
- [ ] Test DST spring forward (AC: Same calendar day)
  - [ ] 1:50 AM → 3:10 AM (after 2 AM → 3 AM jump) = same day
  - [ ] Streak does NOT increment
- [ ] Test DST fall back (AC: Same calendar day)
  - [ ] 1:50 AM (first) → 1:10 AM (second occurrence) = same day
  - [ ] Streak does NOT increment
- [ ] Test timezone changes (AC: Uses new local timezone)
  - [ ] EST → PST change
  - [ ] Streak continues if dates consecutive in new timezone
- [ ] Test system clock tampering (AC: No special handling)
  - [ ] Manual clock change backward 1 day
  - [ ] Use system date (player could "cheat" but unlikely)
- [ ] Document all edge cases (AC: Clear test documentation)

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story provides **COMPREHENSIVE EDGE CASE TESTING** for streak tracking. Your job is to:

1. Create test suite covering all edge cases (multiple games, midnight, DST, timezone)
2. Document manual test procedures (time-dependent tests can't be automated)
3. Validate timezone accuracy across all scenarios
4. Ensure streak logic is bulletproof (no silent failures)

**CRITICAL SUCCESS FACTORS:**
- ALL edge cases MUST be tested (multiple games, midnight, DST, timezone)
- Manual test instructions MUST be clear (time-dependent scenarios)
- DST behavior MUST be validated (spring forward, fall back)
- Documentation MUST help future devs understand edge cases

**WHY THIS MATTERS:**
- Untested edge cases = production bugs (player frustration)
- DST bugs = streak breaks on transition days (twice a year)
- Timezone bugs = incorrect streak tracking for travelers
- Missing documentation = future regressions

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Test Structure (THIS STORY):**

```
test/
├── streak.test.js        # Comprehensive edge case tests (NEW)
├── manual-test-plan.md   # Time-dependent test instructions (NEW)
```

**Edge Case Categories:**

From Epic 17, NFR50:
1. **Multiple Games Per Day:** Only first increments
2. **Midnight Crossover:** Detects new calendar day
3. **DST Spring Forward:** Calendar day unchanged during 2 AM → 3 AM jump
4. **DST Fall Back:** Calendar day unchanged during 2 AM → 1 AM repeat
5. **Timezone Changes:** Uses new local timezone
6. **System Clock Tampering:** No special handling (trust system clock)

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Testing APIs Used:**
- `console.assert()` for automated checks
- Manual testing for time-dependent scenarios

**No testing frameworks** (vanilla JS, manual verification)

---

### 📁 FILE STRUCTURE REQUIREMENTS

**test/streak.test.js - Comprehensive Edge Case Tests (NEW)**

```javascript
import { checkAndUpdateStreak, getTodayDateString } from '../js/streak.js';
import { getStreak, updateStreak } from '../js/storage.js';

/**
 * AUTOMATED TESTS (Run in browser console)
 */

// Test 1: Format Check
(() => {
  const today = getTodayDateString();
  console.assert(/^\d{4}-\d{2}-\d{2}$/.test(today), 'Date format: YYYY-MM-DD');
  console.log('✅ Test 1: Date format check passed');
})();

// Test 2: First Game Ever
(() => {
  localStorage.removeItem('crazysnakeLite_streak');
  const result = checkAndUpdateStreak();
  console.assert(result.currentStreak === 1, 'First game → streak = 1');
  console.assert(result.longestStreak === 1, 'First game → longest = 1');
  console.log('✅ Test 2: First game initialization passed');
})();

// Test 3: Same-Day Multiple Games (Simulated)
(() => {
  // Setup: Streak = 5, lastPlayed = today
  const today = getTodayDateString();
  updateStreak({
    currentStreak: 5,
    longestStreak: 10,
    lastPlayedDate: today,
    streakStartDate: '2026-02-11'
  });

  // Play again same day
  const result = checkAndUpdateStreak();
  console.assert(result.currentStreak === 5, 'Same day → no increment');
  console.assert(result.message === null, 'Same day → no message');
  console.log('✅ Test 3: Same-day multiple games passed');
})();

// Test 4: Consecutive Days (Simulated)
(() => {
  // Setup: lastPlayed = yesterday (manually set)
  const yesterday = '2026-02-15'; // MANUALLY UPDATE THIS DATE
  const today = getTodayDateString(); // Should be '2026-02-16'

  updateStreak({
    currentStreak: 5,
    longestStreak: 10,
    lastPlayedDate: yesterday,
    streakStartDate: '2026-02-11'
  });

  // Play today
  const result = checkAndUpdateStreak();
  console.assert(result.currentStreak === 6, 'Yesterday → increment');
  console.assert(result.longestStreak === 10, 'longestStreak preserved');
  console.log('✅ Test 4: Consecutive days passed');
})();

// Test 5: Streak Break (2+ Days)
(() => {
  // Setup: lastPlayed = 3 days ago (manually set)
  const threeDaysAgo = '2026-02-13'; // MANUALLY UPDATE THIS DATE
  const today = getTodayDateString(); // Should be '2026-02-16'

  updateStreak({
    currentStreak: 12,
    longestStreak: 12,
    lastPlayedDate: threeDaysAgo,
    streakStartDate: '2026-02-04'
  });

  // Play today
  const result = checkAndUpdateStreak();
  console.assert(result.currentStreak === 1, 'Break → reset to 1');
  console.assert(result.longestStreak === 12, 'Break → preserve longest');
  console.assert(result.hadBreak === true, 'Break → flag set');
  console.log('✅ Test 5: Streak break passed');
})();

// Test 6: New Record
(() => {
  // Setup: currentStreak about to exceed longestStreak
  const yesterday = '2026-02-15'; // MANUALLY UPDATE THIS DATE
  updateStreak({
    currentStreak: 30,
    longestStreak: 30,
    lastPlayedDate: yesterday,
    streakStartDate: '2026-01-17'
  });

  // Play today
  const result = checkAndUpdateStreak();
  console.assert(result.currentStreak === 31, 'New record → increment');
  console.assert(result.longestStreak === 31, 'New record → update longest');
  console.assert(result.isNewRecord === true, 'New record → flag set');
  console.log('✅ Test 6: New record passed');
})();

console.log('\n🎉 All automated tests passed!');
```

**test/manual-test-plan.md - Time-Dependent Test Instructions (NEW)**

```markdown
# Streak System - Manual Test Plan

## Test 1: Midnight Crossover

**Objective:** Verify midnight crossing creates new calendar day

**Steps:**
1. Play game at 11:58 PM
2. Check localStorage: `crazysnakeLite_streak`
   - Note `lastPlayedDate` (should be today's date)
3. Wait until 12:02 AM (next day)
4. Play another game
5. Check localStorage again
   - `lastPlayedDate` should update to new date
   - `currentStreak` should increment by 1

**Expected:**
- Midnight = new calendar day (detected immediately)
- Streak increments (treats as consecutive days)

**Actual:** _[Fill in after testing]_

---

## Test 2: Same-Day Multiple Games

**Objective:** Verify only first game per day increments streak

**Steps:**
1. Play game at 2:00 PM
   - Note `currentStreak` (e.g., 5)
2. Play game at 5:00 PM (same day)
   - Check `currentStreak` (should still be 5)
3. Play game at 9:00 PM (same day)
   - Check `currentStreak` (should still be 5)

**Expected:**
- Only first game increments streak
- Games 2-3 don't change streak or `lastPlayedDate`

**Actual:** _[Fill in after testing]_

---

## Test 3: DST Spring Forward (2 AM → 3 AM)

**Objective:** Verify calendar day unchanged during DST transition

**Prerequisites:** Must be run on DST transition night (e.g., March 10, 2026)

**Steps:**
1. Play game at 1:50 AM (before transition)
   - Note `lastPlayedDate` (e.g., "2026-03-10")
2. Wait for 2:00 AM → 3:00 AM clock jump (DST spring forward)
3. Play game at 3:10 AM (after transition)
   - Check `lastPlayedDate` (should still be "2026-03-10")
   - Check `currentStreak` (should NOT increment)

**Expected:**
- Both games have same date (DST doesn't create new calendar day)
- Streak does NOT increment

**Actual:** _[Fill in after testing]_

---

## Test 4: DST Fall Back (2 AM → 1 AM)

**Objective:** Verify calendar day unchanged during DST fall back

**Prerequisites:** Must be run on DST fall-back night (e.g., November 3, 2026)

**Steps:**
1. Play game at 1:50 AM (first occurrence, before fall back)
   - Note `lastPlayedDate` (e.g., "2026-11-03")
2. Wait for clock to fall back to 1:00 AM
3. Play game at 1:10 AM (second occurrence of 1 AM)
   - Check `lastPlayedDate` (should still be "2026-11-03")
   - Check `currentStreak` (should NOT increment)

**Expected:**
- Both games have same date (fall back doesn't split calendar day)
- Streak does NOT increment

**Actual:** _[Fill in after testing]_

---

## Test 5: Timezone Change (Travel)

**Objective:** Verify streak uses new local timezone after change

**Steps:**
1. Play game in EST (UTC-5) at 6:00 PM EST
   - Note `lastPlayedDate` (e.g., "2026-02-15")
2. Change system timezone to PST (UTC-8)
3. Play game at 4:00 PM PST (same moment as 7:00 PM EST)
   - Check `lastPlayedDate` (should use new timezone)
   - If still same calendar day in PST, no increment
   - If next calendar day in PST, increment

**Expected:**
- Uses current browser timezone for calendar day
- Streak logic continues with new timezone

**Actual:** _[Fill in after testing]_

---

## Test 6: System Clock Tampering

**Objective:** Verify no special tampering detection (uses system date)

**Steps:**
1. Play game (note `currentStreak`)
2. Manually change system clock backward 1 day
3. Play game
   - Check `lastPlayedDate` (uses system's current date)
   - Streak logic based on system date (could "cheat" but unlikely)

**Expected:**
- No tampering detection
- Uses system date as-is (player could cheat but unlikely in practice)

**Actual:** _[Fill in after testing]_

---

## Test 7: Consecutive 7+ Days

**Objective:** Verify streak continues correctly over 1 week

**Steps:**
1. Play once per day for 7 consecutive days
2. Check `currentStreak` after each day (1, 2, 3, 4, 5, 6, 7)
3. On day 7, verify milestone color (gold #FFD700)

**Expected:**
- Streak increments daily
- Day 7 shows gold color (milestone)

**Actual:** _[Fill in after testing]_

---

## Test 8: Break and Rebuild

**Objective:** Verify streak resets and rebuilds correctly

**Steps:**
1. Build streak to 10 days
2. Skip 2 days (break)
3. Play again → verify `currentStreak = 1`, `longestStreak = 10`
4. Play next day → verify `currentStreak = 2`, `longestStreak = 10`
5. Continue to 15 days → verify new record (longestStreak = 15)

**Expected:**
- Reset to 1 on break
- longestStreak preserved
- New record when surpassing previous peak

**Actual:** _[Fill in after testing]_

---
```

---

### 🎨 VISUAL SPECIFICATIONS

No visual changes in this story (testing only).

---

### 🧪 TESTING REQUIREMENTS

**Automated Tests (Run in Browser):**

1. Open `test/index.html`
2. Open browser console
3. Load `test/streak.test.js`
4. Verify all assertions pass

**Manual Tests (Time-Dependent):**

1. Follow `test/manual-test-plan.md` instructions
2. Fill in "Actual" results after each test
3. Verify all tests pass

**Edge Case Coverage:**

| Edge Case | Test | Pass? |
|-----------|------|-------|
| Multiple games per day | Automated + Manual | [ ] |
| Midnight crossover | Manual (Test 1) | [ ] |
| DST spring forward | Manual (Test 3) | [ ] |
| DST fall back | Manual (Test 4) | [ ] |
| Timezone change | Manual (Test 5) | [ ] |
| System clock tampering | Manual (Test 6) | [ ] |
| Consecutive 7+ days | Manual (Test 7) | [ ] |
| Break and rebuild | Manual (Test 8) | [ ] |

---

### 📚 CRITICAL DATA FORMATS

**Test Scenarios:**

```javascript
// Midnight crossover
// Play 11:58 PM Feb 15 → lastPlayedDate = "2026-02-15"
// Play 12:02 AM Feb 16 → lastPlayedDate = "2026-02-16", streak++

// Same-day multiple games
// Play 2 PM → streak = 5
// Play 5 PM (same day) → streak = 5 (unchanged)
// Play 9 PM (same day) → streak = 5 (unchanged)

// DST spring forward
// Play 1:50 AM → lastPlayedDate = "2026-03-10"
// Clock jumps 2 AM → 3 AM (DST)
// Play 3:10 AM → lastPlayedDate = "2026-03-10" (same day), no increment

// DST fall back
// Play 1:50 AM (first occurrence) → lastPlayedDate = "2026-11-03"
// Clock falls back 2 AM → 1 AM
// Play 1:10 AM (second occurrence) → lastPlayedDate = "2026-11-03" (same day), no increment
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **Testing Approach:** Unit tests for pure logic, manual for UI/time-dependent
2. **Test Coverage:** Core game logic modules (streak.js is pure, highly testable)
3. **Documentation:** Manual test instructions for time-dependent scenarios

**Streak Testing Rules:**
- Automated: Format, first game, same-day, consecutive, break, new record
- Manual: Midnight, DST, timezone changes (time-dependent)
- Coverage: 100% of edge cases documented

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Stories 17.1-17.6:**
- ✅ All streak logic must be implemented
- ✅ getTodayDateString(), checkAndUpdateStreak() must exist
- ✅ Storage methods functional

**If streak system incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR193, NFR50

**Detailed FR Mapping:**
- FR193: Only first game per day increments → Manual Test 2
- NFR50: DST/timezone accuracy → Manual Tests 3, 4, 5

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] test/streak.test.js created with all automated tests
- [ ] test/manual-test-plan.md created with all manual tests
- [ ] All automated tests pass
- [ ] All manual tests documented
- [ ] Midnight crossover tested
- [ ] Same-day multiple games tested
- [ ] DST spring forward tested (or plan documented for DST date)
- [ ] DST fall back tested (or plan documented for DST date)
- [ ] Timezone change tested
- [ ] System clock tampering tested
- [ ] Consecutive 7+ days tested
- [ ] Break and rebuild cycle tested
- [ ] All edge cases covered

**Test Coverage Checklist:**
- [ ] Multiple games per day (only first increments)
- [ ] Midnight crossover (new calendar day detected)
- [ ] DST spring forward (same calendar day)
- [ ] DST fall back (same calendar day)
- [ ] Timezone changes (uses new local timezone)
- [ ] System clock tampering (no special handling)

**Documentation Checklist:**
- [ ] Automated tests documented with comments
- [ ] Manual test plan has clear steps
- [ ] Expected results documented
- [ ] Space for actual results (filled in during testing)

**Common Mistakes to Avoid:**
- ❌ Not testing DST edge cases
- ❌ Not documenting manual test procedures
- ❌ Missing midnight crossover test
- ❌ Not testing timezone changes
- ❌ Assuming automated tests cover time-dependent scenarios

---
