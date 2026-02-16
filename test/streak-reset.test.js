// CrazySnakeLite - Streak Reset Verification
// Story 17.6: Manual testing guide for streak reset and new streak start behavior
// Verifies implementation from Stories 17.1 and 17.4

/**
 * STREAK RESET VERIFICATION GUIDE
 *
 * Story 17.6: Validates that streak reset behavior is gentle and optimistic:
 * - Resets to 1 (not 0) - new streak starts immediately
 * - Preserves longestStreak (never decreases)
 * - Optimistic messaging ("keep it going!" not "try again")
 * - Multiple cycles preserve all-time longestStreak
 *
 * All tests require manual execution with localStorage manipulation or time delays.
 */

/**
 * TEST 1: Basic Reset (5 → 1, preserve 5)
 *
 * Objective: Verify streak resets to 1 (not 0) and preserves longestStreak
 *
 * Setup:
 * 1. Build streak to 5 days (play 5 consecutive days)
 * 2. Check localStorage: currentStreak = 5, longestStreak = 5
 * 3. Skip 2 days (or manually set lastPlayedDate back 3 days)
 * 4. Play game on day 8
 *
 * Expected Results:
 * - currentStreak = 1 (reset to 1, NOT 0)
 * - longestStreak = 5 (preserved from peak)
 * - lastPlayedDate = today (updated)
 * - streakStartDate = today (new streak starts)
 * - Message on break: "Rest day logged. Ready for another round?"
 * - Next day message: "🔥 2-day streak" (normal progression from 1)
 *
 * Pass Criteria:
 * ✓ currentStreak never becomes 0 (resets to 1)
 * ✓ longestStreak = 5 (not decreased)
 * ✓ streakStartDate updated to today
 * ✓ Optimistic messaging (no guilt)
 */

/**
 * TEST 2: Preserve Peak When Current = Longest (12 → 1, preserve 12)
 *
 * Objective: Verify longestStreak preserved when currentStreak was the peak
 *
 * Setup:
 * 1. Build streak to 12 days
 * 2. Check localStorage: currentStreak = 12, longestStreak = 12
 * 3. Skip 3 days
 * 4. Play game
 *
 * Expected Results:
 * - currentStreak = 1 (reset)
 * - longestStreak = 12 (preserved, NOT decreased to 1)
 * - Message: "12-day streak complete! Ready for round 2?" (celebrate achievement)
 * - Next day: currentStreak = 2, message = "🔥 2-day streak"
 *
 * Pass Criteria:
 * ✓ longestStreak = 12 (peak preserved)
 * ✓ Math.max(currentStreak, longestStreak) used before reset
 * ✓ Achievement celebrated before reset
 */

/**
 * TEST 3: Multiple Streak Cycles (preserve all-time high)
 *
 * Objective: Verify longestStreak tracks all-time highest across multiple cycles
 *
 * Setup:
 * Cycle 1:
 * - Build to 10 days → skip 2 days → break
 * - Check: longestStreak = 10
 *
 * Cycle 2:
 * - Build to 7 days → skip 2 days → break
 * - Check: longestStreak = 10 (still 10, not decreased to 7)
 *
 * Cycle 3:
 * - Build to 15 days → new record! longestStreak = 15
 * - Skip 2 days → break
 * - Check: longestStreak = 15 (preserved after break)
 *
 * Cycle 4:
 * - Build to 8 days → skip 2 days → break
 * - Check: longestStreak = 15 (still all-time high)
 *
 * Expected Results:
 * - longestStreak always = all-time highest (15)
 * - longestStreak never decreases across cycles
 * - Each reset preserves peak correctly
 *
 * Pass Criteria:
 * ✓ longestStreak = 15 after all cycles
 * ✓ longestStreak never decreased
 * ✓ Multiple cycles work correctly
 */

/**
 * TEST 4: New Streak Progression (1 → 2 → 3 → 4 → 5)
 *
 * Objective: Verify new streak progresses normally from 1
 *
 * Setup:
 * 1. Reset on Feb 15 (currentStreak = 1)
 * 2. Play Feb 16 (next day)
 * 3. Play Feb 17
 * 4. Play Feb 18
 * 5. Play Feb 19
 * 6. Play Feb 20
 *
 * Expected Results:
 * - Feb 15: currentStreak = 1, message = break message
 * - Feb 16: currentStreak = 2, message = "🔥 2-day streak"
 * - Feb 17: currentStreak = 3, message = "🔥 3-day streak"
 * - Feb 18: currentStreak = 4, message = "🔥 4-day streak"
 * - Feb 19: currentStreak = 5, message = "🔥 5-day streak"
 * - Feb 20: currentStreak = 6, message = "🔥 6-day streak"
 *
 * Pass Criteria:
 * ✓ Streak increments normally from 1
 * ✓ No reference to previous break after first reset
 * ✓ Messages show normal progression
 */

/**
 * TEST 5: New Streak Surpasses Old Peak (7 → 1 → 10, new record!)
 *
 * Objective: Verify new streak can surpass old longestStreak
 *
 * Setup:
 * 1. Build streak to 7 days, longestStreak = 7
 * 2. Skip 2 days, break (currentStreak = 1, longestStreak = 7)
 * 3. Build new streak to 10 days
 *
 * Expected Results:
 * - After reset: longestStreak = 7 (preserved)
 * - Building new streak: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 (NEW RECORD!)
 * - At 8 days: isNewRecord = true, longestStreak = 8
 * - At 10 days: longestStreak = 10, message includes "NEW RECORD! 🎉"
 *
 * Pass Criteria:
 * ✓ New streak can surpass old peak
 * ✓ isNewRecord flag set correctly
 * ✓ longestStreak updates when surpassed
 * ✓ NEW RECORD message displays
 */

/**
 * TEST 6: Edge Case - First Ever Game (0 → 1)
 *
 * Objective: Verify first-ever game initializes correctly
 *
 * Setup:
 * 1. Clear localStorage completely
 * 2. Play first game
 *
 * Expected Results:
 * - currentStreak = 1 (initialized to 1, not 0)
 * - longestStreak = 1
 * - streakStartDate = today
 * - lastPlayedDate = today
 * - Message: "🔥 Fresh start — let's build a new streak!"
 *
 * Pass Criteria:
 * ✓ Streak initializes to 1 (never 0)
 * ✓ Fresh start message shown
 * ✓ All fields initialized correctly
 */

/**
 * TEST 7: Reset Logic Math.max Verification
 *
 * Objective: Verify Math.max(currentStreak, longestStreak) logic
 *
 * Scenarios:
 * A) currentStreak = 12, longestStreak = 30 → preserve 30
 * B) currentStreak = 30, longestStreak = 30 → preserve 30
 * C) currentStreak = 5, longestStreak = 10 → preserve 10
 * D) currentStreak = 15, longestStreak = 10 → preserve 15 (new peak)
 *
 * Expected:
 * - preservedLongest = Math.max(streak.currentStreak, streak.longestStreak)
 * - longestStreak never decreases
 * - Current peak correctly preserved if higher than previous longest
 *
 * Pass Criteria:
 * ✓ All scenarios preserve correct peak
 * ✓ Math.max logic works correctly
 */

/**
 * VALIDATION CHECKLIST
 *
 * Before marking Story 17.6 complete:
 * [ ] TEST 1: Basic reset verified (5 → 1, preserve 5)
 * [ ] TEST 2: Preserve peak when current = longest (12 → 1, preserve 12)
 * [ ] TEST 3: Multiple cycles verified (all-time high preserved)
 * [ ] TEST 4: New streak progression verified (1 → 2 → 3...)
 * [ ] TEST 5: New streak surpasses old peak verified
 * [ ] TEST 6: First-ever game verified (0 → 1)
 * [ ] TEST 7: Math.max logic verified in all scenarios
 * [ ] Code review: Line 150 in streak.js uses Math.max correctly
 * [ ] Code review: Line 153 resets to 1 (not 0)
 * [ ] Code review: Line 156 updates streakStartDate
 * [ ] Messaging: Break messages are optimistic (no guilt)
 * [ ] Messaging: Achievement celebrated before reset (streak >= 7)
 */

/**
 * DEBUGGING HELPERS
 *
 * Check current streak state:
 * ```javascript
 * JSON.parse(localStorage.getItem('crazysnakeLite_streak'))
 * ```
 *
 * Simulate 2-day gap:
 * ```javascript
 * const streak = JSON.parse(localStorage.getItem('crazysnakeLite_streak'));
 * streak.lastPlayedDate = '2026-02-13'; // Set to 3 days ago if today is Feb 16
 * localStorage.setItem('crazysnakeLite_streak', JSON.stringify(streak));
 * // Now play game - should trigger reset
 * ```
 *
 * Build streak quickly for testing:
 * ```javascript
 * // Play game manually 10 times with dates going back
 * // Or manually set:
 * localStorage.setItem('crazysnakeLite_streak', JSON.stringify({
 *   currentStreak: 10,
 *   longestStreak: 10,
 *   lastPlayedDate: '2026-02-15',
 *   streakStartDate: '2026-02-06'
 * }));
 * ```
 *
 * Reset for fresh testing:
 * ```javascript
 * localStorage.removeItem('crazysnakeLite_streak')
 * ```
 */

/**
 * CODE VERIFICATION CHECKLIST
 *
 * Story 17.6 is a VERIFICATION story. Check that Stories 17.1 and 17.4
 * implemented the requirements correctly:
 *
 * In js/streak.js, checkAndUpdateStreak():
 * [ ] Line 150: const preservedLongest = Math.max(streak.currentStreak, streak.longestStreak);
 * [ ] Line 153: currentStreak: 1 (NOT 0)
 * [ ] Line 154: longestStreak: preservedLongest
 * [ ] Line 156: streakStartDate: today
 * [ ] Lines 163-167: Gentle messaging (achievement or break)
 *
 * In js/config.js:
 * [ ] STREAK_MESSAGES.break: "Rest day logged. Ready for another round?"
 * [ ] STREAK_MESSAGES.achievementBeforeBreak: "${days}-day streak complete! Ready for round 2?"
 * [ ] No guilt language (no "try again", "you broke", etc.)
 *
 * All checks should PASS without code changes.
 */
