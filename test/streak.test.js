// CrazySnakeLite - Streak System Timezone Testing
// Story 17.2: Manual testing instructions for timezone behavior
// These tests MUST be run manually due to time/timezone dependencies

/**
 * TIMEZONE TESTING GUIDE
 *
 * The streak system uses local timezone for calendar day detection.
 * This file documents manual testing procedures for:
 * - Midnight crossover (11:59 PM → 12:01 AM)
 * - DST transitions (spring forward, fall back)
 * - Timezone changes (travel simulation)
 *
 * All tests require manual execution at specific times or with timezone changes.
 */

/**
 * TEST 1: Midnight Crossover
 *
 * Objective: Verify 11:59 PM → 12:01 AM counts as 2 consecutive days
 *
 * Setup:
 * 1. Open game at 11:58 PM (2 minutes before midnight)
 * 2. Complete a game session
 * 3. Open DevTools → Application → localStorage
 * 4. Verify lastPlayedDate = today's date (e.g., "2026-02-15")
 * 5. Wait until 12:02 AM (after midnight)
 * 6. Complete another game session
 *
 * Expected Results:
 * - localStorage shows lastPlayedDate = "2026-02-16" (next day)
 * - currentStreak incremented by 1
 * - Streak message: "🔥 X-day streak"
 * - Treat as consecutive days, NOT same day
 *
 * Pass Criteria:
 * ✓ lastPlayedDate updates to new calendar day immediately after midnight
 * ✓ Streak increments (consecutive day detected)
 * ✓ No delay in date change detection
 */

/**
 * TEST 2: Same-Day Multiple Games
 *
 * Objective: Verify only first game per day increments streak
 *
 * Setup:
 * 1. Play game at 2:00 PM
 * 2. Check localStorage: streak increments, lastPlayedDate = today
 * 3. Play game at 5:00 PM (same day)
 * 4. Check localStorage again
 * 5. Play game at 9:00 PM (same day)
 * 6. Check localStorage again
 *
 * Expected Results:
 * - First game (2 PM): streak increments, lastPlayedDate = today
 * - Second game (5 PM): streak unchanged, lastPlayedDate unchanged
 * - Third game (9 PM): streak unchanged, lastPlayedDate unchanged
 * - Streak message on games 2-3: null (no message)
 *
 * Pass Criteria:
 * ✓ Only first game of the calendar day increments streak
 * ✓ Subsequent games same day do NOT increment
 * ✓ lastPlayedDate remains the same for all games on same day
 */

/**
 * TEST 3: DST Spring Forward (2 AM → 3 AM)
 *
 * Objective: Verify DST transition does NOT break calendar day detection
 *
 * Background: On DST transition night, clock jumps from 1:59 AM → 3:00 AM
 * Calendar day does NOT change during this transition (still same night)
 *
 * Setup (on DST transition night, typically second Sunday in March):
 * 1. Play game at 1:50 AM (10 minutes before DST transition)
 * 2. Check localStorage: lastPlayedDate = transition date (e.g., "2026-03-08")
 * 3. Wait for clock to jump to 3:00 AM
 * 4. Play game at 3:10 AM (after transition, same night)
 * 5. Check localStorage again
 *
 * Expected Results:
 * - Both games have same lastPlayedDate: "2026-03-08"
 * - Second game does NOT increment streak (same calendar day)
 * - Date.getDate() returns same day for both games
 * - JavaScript Date object handles DST automatically
 *
 * Pass Criteria:
 * ✓ Calendar day remains same despite clock jump
 * ✓ Streak does NOT increment (same day detected)
 * ✓ No errors or unexpected behavior during DST transition
 *
 * Note: This test can only be run on actual DST transition nights
 */

/**
 * TEST 4: DST Fall Back (2 AM → 1 AM)
 *
 * Objective: Verify fall-back DST does NOT create duplicate days
 *
 * Background: On fall-back night, 1:00-2:00 AM happens twice
 * Calendar day remains the same for both occurrences
 *
 * Setup (on DST fall-back night, typically first Sunday in November):
 * 1. Play game at 1:50 AM (first occurrence, before fall back)
 * 2. Check localStorage: lastPlayedDate = fall-back date (e.g., "2026-11-01")
 * 3. Wait for clock to fall back to 1:00 AM
 * 4. Play game at 1:10 AM (second occurrence of 1 AM)
 * 5. Check localStorage again
 *
 * Expected Results:
 * - Both games have same lastPlayedDate: "2026-11-01"
 * - Second game does NOT increment streak (same calendar day)
 * - Date.getDate() returns same day despite clock going backward
 * - No duplicate day detection
 *
 * Pass Criteria:
 * ✓ Calendar day remains same despite clock moving backward
 * ✓ Streak does NOT increment (same day detected)
 * ✓ No double-counting of the same calendar day
 *
 * Note: This test can only be run on actual DST fall-back nights
 */

/**
 * TEST 5: Timezone Change (Travel Simulation)
 *
 * Objective: Verify system adapts to timezone changes (e.g., travel)
 *
 * Setup:
 * 1. Ensure system is in EST timezone (UTC-5)
 * 2. Play game at 6:00 PM EST
 * 3. Check localStorage: lastPlayedDate = today in EST
 * 4. Change system timezone to PST (UTC-8)
 *    - macOS: System Preferences → Date & Time → Time Zone
 *    - Windows: Settings → Time & Language → Date & Time → Time Zone
 * 5. Refresh browser to pick up new timezone
 * 6. Play game at new local time
 *
 * Expected Results (Scenario A: Same Calendar Day):
 * - First game: lastPlayedDate = "2026-02-15" (EST)
 * - Changed to PST at 6:00 PM EST = 3:00 PM PST (still Feb 15)
 * - Second game at 4:00 PM PST: same day, streak unchanged
 *
 * Expected Results (Scenario B: Next Calendar Day):
 * - First game: lastPlayedDate = "2026-02-15" (EST)
 * - Changed to PST at 11:00 PM EST = 8:00 PM PST (still Feb 15)
 * - Wait until midnight PST
 * - Second game at 12:10 AM PST (Feb 16): streak increments
 *
 * Pass Criteria:
 * ✓ System uses current browser timezone for calendar day
 * ✓ Streak logic adapts to new timezone correctly
 * ✓ No errors or unexpected behavior after timezone change
 */

/**
 * TEST 6: Browser DevTools Date Override
 *
 * Objective: Test streak behavior with simulated date changes
 *
 * Setup:
 * 1. Open DevTools Console
 * 2. Override Date object to simulate yesterday:
 *    ```javascript
 *    const originalDate = Date;
 *    Date = class extends originalDate {
 *      constructor(...args) {
 *        if (args.length === 0) {
 *          super();
 *          this.setDate(this.getDate() - 1); // Simulate yesterday
 *        } else {
 *          super(...args);
 *        }
 *      }
 *    };
 *    ```
 * 3. Play game (will record yesterday's date)
 * 4. Restore original Date: `Date = originalDate;`
 * 5. Play game again (will use today's date)
 *
 * Expected Results:
 * - First game: lastPlayedDate = yesterday
 * - Second game: lastPlayedDate = today, streak increments
 * - Consecutive day detected
 *
 * Pass Criteria:
 * ✓ Streak increments when moving from yesterday → today
 * ✓ calculateDaysDifference correctly detects 1-day gap
 *
 * Note: This is a development/testing technique only
 */

/**
 * VALIDATION CHECKLIST
 *
 * Before marking Story 17.2 complete:
 * [ ] TEST 1: Midnight crossover verified (11:59 PM → 12:01 AM)
 * [ ] TEST 2: Same-day multiple games verified (only first counts)
 * [ ] TEST 3: DST spring forward verified (OR documented as seasonal test)
 * [ ] TEST 4: DST fall back verified (OR documented as seasonal test)
 * [ ] TEST 5: Timezone change verified (travel simulation)
 * [ ] getTodayDateString() uses local timezone (NOT UTC) - code review
 * [ ] Enhanced documentation added to getTodayDateString() in streak.js
 *
 * DST tests (3-4) can be marked as "seasonal validation pending" if not currently
 * during DST transition period. Document in story notes to test during next DST.
 */

/**
 * DEBUGGING HELPERS
 *
 * Check current streak state:
 * ```javascript
 * JSON.parse(localStorage.getItem('crazysnakeLite_streak'))
 * ```
 *
 * Reset streak for testing:
 * ```javascript
 * localStorage.removeItem('crazysnakeLite_streak')
 * ```
 *
 * Check current date detection:
 * ```javascript
 * import('./js/streak.js').then(m => m.getCurrentStreak())
 * ```
 *
 * Simulate date change (DevTools console):
 * See TEST 6 above for Date override technique
 */
