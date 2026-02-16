# Streak System - Manual Test Plan

**Story 17.7: Time-Dependent Edge Case Testing**

This document provides step-by-step manual testing procedures for time-dependent streak system edge cases that cannot be automated.

---

## Test 1: Midnight Crossover

**Objective:** Verify midnight crossing creates new calendar day and increments streak

**Prerequisites:**
- Active streak (any value)
- Ability to test near midnight

**Steps:**
1. Play game at 11:58 PM (2 minutes before midnight)
2. Open DevTools → Application → localStorage
3. Find key: `crazysnakeLite_streak`
4. Note values:
   - `currentStreak`: _____
   - `lastPlayedDate`: _____ (should be today's date, e.g., "2026-02-15")
5. Wait until 12:02 AM (after midnight)
6. Play another game
7. Check localStorage again:
   - `currentStreak`: _____ (should be +1 from step 4)
   - `lastPlayedDate`: _____ (should be next day, e.g., "2026-02-16")

**Expected Results:**
- `lastPlayedDate` updates to new calendar date immediately after midnight
- `currentStreak` increments by 1 (consecutive days)
- Streak message shows normal progression (e.g., "🔥 X-day streak")

**Pass Criteria:**
- ✅ Midnight = new calendar day (no delay)
- ✅ Streak increments (treats as consecutive days)
- ✅ No errors or unexpected behavior

**Actual Results:** _[Fill in after testing]_

---

## Test 2: Same-Day Multiple Games

**Objective:** Verify only first game per calendar day increments streak

**Prerequisites:**
- Any active streak
- Ability to play multiple games in one day

**Steps:**
1. Play game at 2:00 PM
   - Note `currentStreak` in localStorage: _____
   - Note streak message shown: _____
2. Play game at 5:00 PM (same day)
   - Check `currentStreak` in localStorage: _____
   - Check streak message (should be null or empty): _____
3. Play game at 9:00 PM (same day)
   - Check `currentStreak` in localStorage: _____
   - Check `lastPlayedDate` (should be unchanged): _____

**Expected Results:**
- First game (2 PM): Streak increments normally
- Second game (5 PM): Streak unchanged, no message
- Third game (9 PM): Streak unchanged, `lastPlayedDate` unchanged
- Only first game of the calendar day counts

**Pass Criteria:**
- ✅ Only first game increments streak
- ✅ Games 2-3 show no streak message
- ✅ `lastPlayedDate` unchanged for games 2-3
- ✅ FR193 compliance: "Only first game per day increments"

**Actual Results:** _[Fill in after testing]_

---

## Test 3: DST Spring Forward (2 AM → 3 AM)

**Objective:** Verify calendar day unchanged during "spring forward" DST transition

**Prerequisites:**
- **MUST be run on DST transition night** (e.g., March 10, 2026 in US)
- Active streak

**Background:**
On DST spring forward night, clocks jump from 1:59 AM → 3:00 AM. The hour 2:00-2:59 AM doesn't exist. However, the calendar day remains the same throughout this transition.

**Steps:**
1. Play game at 1:50 AM (10 minutes before DST transition)
   - Note `lastPlayedDate` in localStorage: _____ (e.g., "2026-03-10")
   - Note `currentStreak`: _____
2. Wait for 2:00 AM → 3:00 AM clock jump (DST spring forward)
3. Verify system clock now shows 3:00 AM+ (hour 2 was skipped)
4. Play game at 3:10 AM (after transition, same night)
   - Check `lastPlayedDate` in localStorage: _____ (should still be "2026-03-10")
   - Check `currentStreak`: _____ (should be UNCHANGED)
   - Check streak message: _____ (should be null - same day)

**Expected Results:**
- Both games have same `lastPlayedDate` ("2026-03-10")
- Streak does NOT increment (same calendar day)
- No streak message on second game (same-day logic)
- JavaScript Date object handles DST automatically

**Pass Criteria:**
- ✅ Calendar day unchanged despite clock jump
- ✅ Streak does NOT increment (same day detected)
- ✅ No errors during DST transition
- ✅ NFR50 compliance: "DST-aware"

**Actual Results:** _[Fill in after testing]_

**Note:** If not currently DST transition period, document as "Pending seasonal validation - next test date: [DST date]"

---

## Test 4: DST Fall Back (2 AM → 1 AM)

**Objective:** Verify calendar day unchanged during "fall back" DST transition

**Prerequisites:**
- **MUST be run on DST fall-back night** (e.g., November 3, 2026 in US)
- Active streak

**Background:**
On DST fall back night, clocks jump from 1:59 AM → 1:00 AM. The hour 1:00-1:59 AM happens twice. However, the calendar day remains the same for both occurrences.

**Steps:**
1. Play game at 1:50 AM (first occurrence, before fall back)
   - Note `lastPlayedDate` in localStorage: _____ (e.g., "2026-11-03")
   - Note `currentStreak`: _____
2. Wait for clock to fall back to 1:00 AM
3. Verify system clock now shows 1:00 AM again (hour repeats)
4. Play game at 1:10 AM (second occurrence of 1 AM, same night)
   - Check `lastPlayedDate` in localStorage: _____ (should still be "2026-11-03")
   - Check `currentStreak`: _____ (should be UNCHANGED)
   - Check streak message: _____ (should be null - same day)

**Expected Results:**
- Both games have same `lastPlayedDate` ("2026-11-03")
- Streak does NOT increment (same calendar day)
- No duplicate day counting
- Date.getDate() returns same day for both occurrences

**Pass Criteria:**
- ✅ Calendar day unchanged despite clock moving backward
- ✅ Streak does NOT increment (same day detected)
- ✅ No double-counting of same calendar day
- ✅ NFR50 compliance: "DST-aware"

**Actual Results:** _[Fill in after testing]_

**Note:** If not currently DST fall-back period, document as "Pending seasonal validation - next test date: [DST date]"

---

## Test 5: Timezone Change (Travel Simulation)

**Objective:** Verify streak system adapts to timezone changes (e.g., travel)

**Prerequisites:**
- Active streak
- Ability to change system timezone settings

**Steps:**
1. Ensure system is in EST timezone (UTC-5)
2. Play game at 6:00 PM EST
   - Note `lastPlayedDate` in localStorage: _____ (e.g., "2026-02-15")
   - Note `currentStreak`: _____
3. Change system timezone to PST (UTC-8)
   - macOS: System Preferences → Date & Time → Time Zone
   - Windows: Settings → Time & Language → Date & Time → Time Zone
4. Refresh browser to pick up new timezone
5. Verify system clock shows PST time (3 hours earlier than EST)
6. **Scenario A: Same Calendar Day in New Timezone**
   - Play game at 4:00 PM PST (still Feb 15 in PST)
   - Check `lastPlayedDate`: _____ (should still be "2026-02-15")
   - Check `currentStreak`: _____ (should be UNCHANGED - same day)
7. **Scenario B: Next Calendar Day in New Timezone**
   - Wait until midnight PST (new day begins)
   - Play game at 12:10 AM PST (Feb 16 in PST)
   - Check `lastPlayedDate`: _____ (should update to "2026-02-16")
   - Check `currentStreak`: _____ (should INCREMENT - consecutive day)

**Expected Results:**
- System uses current browser timezone for calendar day detection
- Scenario A: Same calendar day in new timezone = no increment
- Scenario B: Next calendar day in new timezone = streak increments
- Streak logic adapts to new timezone correctly

**Pass Criteria:**
- ✅ Uses current browser timezone (not original)
- ✅ Calendar day based on new timezone
- ✅ Streak continues correctly after timezone change
- ✅ NFR50 compliance: "Browser timezone changes"

**Actual Results:** _[Fill in after testing]_

---

## Test 6: System Clock Tampering

**Objective:** Verify system trusts OS clock (no tampering detection)

**Prerequisites:**
- Active streak
- Ability to manually change system clock

**Background:**
The streak system trusts the operating system's clock. It does NOT detect tampering or validate dates against a server. This means a player *could* theoretically "cheat" by changing their system clock, but this is considered unlikely and acceptable.

**Steps:**
1. Play game normally
   - Note `currentStreak`: _____
   - Note `lastPlayedDate`: _____ (e.g., "2026-02-16")
2. Manually change system clock backward 1 day
   - Set date to previous day (e.g., "2026-02-15")
3. Refresh browser
4. Play game
   - Check `lastPlayedDate`: _____ (should use system date "2026-02-15")
   - Check `currentStreak`: _____ (behavior based on date comparison)
   - Note: System may interpret this as going backward in time
5. Change system clock back to correct date
6. Play game again
   - Verify streak resumes normal behavior

**Expected Results:**
- System uses OS clock as-is (no tampering detection)
- Backward clock change may cause unexpected behavior (system date < lastPlayedDate)
- System does NOT prevent or warn about clock changes
- Player could "cheat" but unlikely in practice

**Pass Criteria:**
- ✅ Uses system date without validation
- ✅ No special tampering detection code
- ✅ Behavior is deterministic based on date comparison

**Actual Results:** _[Fill in after testing]_

**Design Note:** No anti-tampering is intentional. Streak is for player motivation, not competitive integrity. Trust-based system is simpler and sufficient.

---

## Test 7: Consecutive 7+ Days (Milestone)

**Objective:** Verify streak continues correctly over 1 week and shows milestone

**Prerequisites:**
- Ability to play daily for 7 consecutive days

**Steps:**
1. Day 1: Play game → verify `currentStreak = 1`
2. Day 2: Play game → verify `currentStreak = 2`
3. Day 3: Play game → verify `currentStreak = 3`
4. Day 4: Play game → verify `currentStreak = 4`
5. Day 5: Play game → verify `currentStreak = 5`
6. Day 6: Play game → verify `currentStreak = 6`
7. Day 7: Play game → verify `currentStreak = 7`
   - Check post-game streak display: _____ (should be gold color)
   - Check for pulsing animation: _____ (should pulse if no reduced motion)
   - Message should include "7-day streak"

**Expected Results:**
- Streak increments daily from 1 to 7
- Day 7 shows milestone styling:
  - Gold color (#FFD700)
  - Pulsing animation (scale 1.0 → 1.05, 2s cycle)
- Skill Map shows streak with milestone indicator

**Pass Criteria:**
- ✅ Normal daily progression (1 → 2 → 3 → ... → 7)
- ✅ Day 7 shows gold color (milestone)
- ✅ Pulsing animation on day 7 (if not reduced motion)
- ✅ CONFIG.DASHBOARD.STREAK_MILESTONES includes 7

**Actual Results:** _[Fill in after testing]_

---

## Test 8: Break and Rebuild Cycle

**Objective:** Verify streak resets, preserves longestStreak, and rebuilds correctly

**Prerequisites:**
- Existing streak (any value)

**Steps:**
1. **Build Phase:** Build streak to 10 days
   - Verify `currentStreak = 10`, `longestStreak = 10`
2. **Break Phase:** Skip 2 days (don't play for 48+ hours)
3. **Reset Phase:** Play game after break
   - Check `currentStreak`: _____ (should be 1, NOT 0)
   - Check `longestStreak`: _____ (should be 10, preserved)
   - Check message: _____ (should be break message or achievement)
4. **Rebuild Phase:** Play next day
   - Check `currentStreak`: _____ (should be 2)
   - Message: _____ (should be "🔥 2-day streak")
5. **Continue Rebuild:** Play for 5 more days
   - Day 3: `currentStreak = 3`
   - Day 4: `currentStreak = 4`
   - Day 5: `currentStreak = 5`
   - Day 6: `currentStreak = 6`
   - Day 7: `currentStreak = 7` (milestone again!)
6. **Surpass Old Peak:** Continue to 15 days
   - Check `currentStreak = 15`, `longestStreak = 15`
   - Message at day 11: _____ (should show "NEW RECORD!")

**Expected Results:**
- Reset to 1 on break (NOT 0)
- longestStreak = 10 preserved after reset
- Normal progression from 1 → 2 → 3 → ...
- No reference to previous break after first reset message
- New streak can surpass old longestStreak
- New record detected when surpassing previous peak

**Pass Criteria:**
- ✅ Reset to 1, not 0
- ✅ longestStreak preserved (never decreases)
- ✅ Normal rebuild progression
- ✅ New record detected when surpassing old peak

**Actual Results:** _[Fill in after testing]_

---

## Test 9: Private Browsing Mode

**Objective:** Verify graceful degradation when localStorage unavailable

**Prerequisites:**
- Browser with private/incognito mode

**Steps:**
1. Open browser in private/incognito mode
   - Chrome: Cmd+Shift+N (macOS) or Ctrl+Shift+N (Windows)
   - Firefox: Cmd+Shift+P (macOS) or Ctrl+Shift+P (Windows)
   - Safari: Cmd+Shift+N (macOS)
2. Navigate to game
3. Open DevTools Console
4. Play game
5. Check console for warnings: _____
6. Check for `privateBrowsingWarning` in streak result: _____
7. Verify game continues to function normally
8. Close private window
9. Open new private window
10. Navigate to game again
11. Check if streak data persists: _____ (should NOT persist)

**Expected Results:**
- Console warning: "[Story 17.3] localStorage unavailable (private browsing?)"
- `checkAndUpdateStreak()` returns `privateBrowsingWarning` field
- Game continues to function (no crash)
- Streak data does NOT persist between private windows

**Pass Criteria:**
- ✅ Warning logged to console
- ✅ Graceful degradation (no crash)
- ✅ Game playable in private mode
- ✅ Clear communication to user (Story 17.3)

**Actual Results:** _[Fill in after testing]_

---

## Summary Checklist

**Edge Cases Tested:**

- [ ] TEST 1: Midnight crossover (11:59 PM → 12:01 AM)
- [ ] TEST 2: Same-day multiple games (only first increments)
- [ ] TEST 3: DST spring forward (2 AM → 3 AM)
- [ ] TEST 4: DST fall back (2 AM → 1 AM)
- [ ] TEST 5: Timezone change (EST → PST)
- [ ] TEST 6: System clock tampering
- [ ] TEST 7: Consecutive 7+ days (milestone)
- [ ] TEST 8: Break and rebuild cycle
- [ ] TEST 9: Private browsing mode

**FR/NFR Coverage:**

- [ ] FR193: Only first game per day increments (TEST 2)
- [ ] NFR50: DST-aware (TEST 3, TEST 4)
- [ ] NFR50: Timezone changes (TEST 5)
- [ ] NFR50: Accurate tracking (all tests)

**Test Status:**

- Tests 1, 2, 5, 6, 7, 8, 9: Can be run anytime
- Tests 3, 4: Require DST transition dates (seasonal)

**Next DST Dates (US):**
- Spring Forward: March 9, 2025 (2:00 AM → 3:00 AM)
- Fall Back: November 2, 2025 (2:00 AM → 1:00 AM)

---

## Debugging Helpers

**Check current streak state:**
```javascript
JSON.parse(localStorage.getItem('crazysnakeLite_streak'))
```

**Reset streak for fresh testing:**
```javascript
localStorage.removeItem('crazysnakeLite_streak')
```

**Simulate yesterday for testing:**
```javascript
const streak = JSON.parse(localStorage.getItem('crazysnakeLite_streak'));
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
streak.lastPlayedDate = yesterdayString;
localStorage.setItem('crazysnakeLite_streak', JSON.stringify(streak));
console.log('Set lastPlayedDate to:', yesterdayString);
```

**Check if localStorage available:**
```javascript
try {
  const test = '__test__';
  localStorage.setItem(test, test);
  localStorage.removeItem(test);
  console.log('localStorage: AVAILABLE');
} catch (e) {
  console.log('localStorage: UNAVAILABLE (private browsing?)');
}
```
