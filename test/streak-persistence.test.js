// CrazySnakeLite - Streak Persistence Testing
// Story 17.3: Manual testing for localStorage persistence and private browsing
// These tests MUST be run manually in different browser modes

/**
 * STREAK PERSISTENCE TESTING GUIDE
 *
 * Story 17.3: Validates that streak data persists across browser sessions
 * and handles private browsing mode gracefully.
 *
 * All tests require manual execution in different browser contexts.
 */

/**
 * TEST 1: Normal Browser Persistence
 *
 * Objective: Verify streak persists across browser close/reopen
 *
 * Setup:
 * 1. Open game in normal browser mode (Chrome, Firefox, Safari)
 * 2. Complete a game session
 * 3. Open DevTools → Application → localStorage
 * 4. Verify key exists: 'crazysnakeLite_streak'
 * 5. Note values: currentStreak, longestStreak, lastPlayedDate
 * 6. Close browser COMPLETELY (quit application, not just tab)
 * 7. Reopen browser and navigate to game
 * 8. Open DevTools → Application → localStorage again
 *
 * Expected Results:
 * - localStorage key 'crazysnakeLite_streak' still exists after reopen
 * - Values unchanged: currentStreak, longestStreak, lastPlayedDate match step 5
 * - Complete another game: streak increments correctly (if consecutive day)
 *
 * Pass Criteria:
 * ✓ Streak data survives browser close/reopen
 * ✓ No data loss on application quit
 * ✓ Streak continues correctly after reload
 */

/**
 * TEST 2: Private Browsing Mode (Chrome Incognito)
 *
 * Objective: Verify graceful degradation when localStorage unavailable
 *
 * Setup:
 * 1. Open Chrome in Incognito mode (Cmd+Shift+N on macOS)
 * 2. Navigate to game
 * 3. Open DevTools Console
 * 4. Complete a game session
 * 5. Check console for warning message
 * 6. Try to access localStorage in Console: `localStorage.getItem('crazysnakeLite_streak')`
 *
 * Expected Results:
 * - Console warning: "[Story 17.3] localStorage unavailable (private browsing?) - streak not persisted"
 * - checkAndUpdateStreak() returns:
 *   - currentStreak: 0
 *   - longestStreak: 0
 *   - isNewRecord: false
 *   - message: null
 *   - privateBrowsingWarning: 'Private browsing: streak not saved across sessions'
 * - Game continues to function normally
 * - No JavaScript errors thrown
 *
 * Pass Criteria:
 * ✓ Warning logged to console
 * ✓ Function returns privateBrowsingWarning field
 * ✓ Game does NOT crash or break
 * ✓ User can still play normally
 */

/**
 * TEST 3: Firefox Private Window
 *
 * Objective: Verify Firefox private browsing behavior (localStorage available but not persistent)
 *
 * Background: Firefox allows localStorage in private windows BUT clears it when window closes
 *
 * Setup:
 * 1. Open Firefox in Private Window (Cmd+Shift+P on macOS)
 * 2. Navigate to game
 * 3. Open DevTools → Storage → Local Storage
 * 4. Complete a game session
 * 5. Check if 'crazysnakeLite_streak' key appears
 * 6. Complete another game same session (verify streak works)
 * 7. Close private window
 * 8. Open NEW private window
 * 9. Navigate to game again
 * 10. Check localStorage
 *
 * Expected Results:
 * - Step 5: Key DOES appear (Firefox allows writes in private mode)
 * - Step 6: Streak increments normally within same session
 * - Step 10: Key DOES NOT exist (cleared when window closed)
 * - New session starts fresh: currentStreak = 0
 *
 * Pass Criteria:
 * ✓ localStorage works within private session
 * ✓ Data cleared between private sessions
 * ✓ Each new private window starts fresh
 * ✓ No console errors
 */

/**
 * TEST 4: Safari Private Browsing
 *
 * Objective: Verify Safari private browsing behavior (localStorage throws exceptions)
 *
 * Background: Safari throws QuotaExceededError when attempting localStorage in private mode
 *
 * Setup:
 * 1. Open Safari in Private Browsing (Cmd+Shift+N on macOS)
 * 2. Navigate to game
 * 3. Open Web Inspector → Console
 * 4. Complete a game session
 * 5. Check console for warnings/errors
 *
 * Expected Results:
 * - isStorageAvailable() catches QuotaExceededError exception
 * - Console warning: "[Story 17.3] localStorage unavailable (private browsing?) - streak not persisted"
 * - checkAndUpdateStreak() returns privateBrowsingWarning field
 * - Game continues to function
 * - No unhandled exceptions
 *
 * Pass Criteria:
 * ✓ Exception caught by isStorageAvailable()
 * ✓ Graceful degradation (no crash)
 * ✓ User can still play
 * ✓ Warning logged appropriately
 */

/**
 * TEST 5: Storage Quota Exceeded
 *
 * Objective: Verify behavior when localStorage quota exceeded
 *
 * Setup:
 * 1. Open game in normal browser
 * 2. Open DevTools Console
 * 3. Fill localStorage to near quota:
 *    ```javascript
 *    try {
 *      for (let i = 0; i < 1000; i++) {
 *        localStorage.setItem('junk_' + i, 'x'.repeat(10000));
 *      }
 *    } catch (e) {
 *      console.log('Quota reached');
 *    }
 *    ```
 * 4. Complete a game session
 * 5. Check if streak update succeeds or fails gracefully
 *
 * Expected Results:
 * - updateStreak() may throw QuotaExceededError
 * - isStorageAvailable() may return false after quota exceeded
 * - Game continues to function
 * - User sees warning if storage fails
 *
 * Pass Criteria:
 * ✓ No unhandled exceptions
 * ✓ Game does not crash
 * ✓ Graceful handling of storage failure
 *
 * Note: Clean up after test: `localStorage.clear()`
 */

/**
 * TEST 6: Cross-Session Persistence (Normal Mode)
 *
 * Objective: Verify streak persists across multiple days/sessions
 *
 * Setup:
 * 1. Day 1, 3:00 PM: Play game, complete session
 * 2. Check localStorage: currentStreak = 1, lastPlayedDate = "2026-02-16"
 * 3. Close browser, wait 5 minutes
 * 4. Reopen browser, navigate to game
 * 5. Day 1, 3:10 PM: Play game again (same day)
 * 6. Check localStorage: currentStreak unchanged (same day)
 * 7. Close browser
 * 8. Day 2, 3:00 PM: Open browser, navigate to game
 * 9. Play game (next day)
 * 10. Check localStorage: currentStreak = 2 (incremented)
 *
 * Expected Results:
 * - Step 2: First game creates streak entry
 * - Step 4: Data persists after browser close/reopen
 * - Step 6: Same day does not increment (data persists)
 * - Step 10: Next day increments correctly (data persisted across days)
 *
 * Pass Criteria:
 * ✓ Data survives multiple browser restarts
 * ✓ Streak logic works correctly across sessions
 * ✓ lastPlayedDate persists and updates correctly
 */

/**
 * TEST 7: Mixed Mode Switching
 *
 * Objective: Verify switching between normal and private mode
 *
 * Setup:
 * 1. Normal mode: Play game, establish streak = 3
 * 2. Check localStorage: currentStreak = 3, longestStreak = 3
 * 3. Open private browsing window
 * 4. Navigate to game in private window
 * 5. Play game in private mode
 * 6. Check console for private browsing warning
 * 7. Close private window
 * 8. Return to normal mode window
 * 9. Check localStorage: should still be currentStreak = 3
 * 10. Play game in normal mode
 *
 * Expected Results:
 * - Step 5: Private mode shows privateBrowsingWarning, streak = 0
 * - Step 9: Normal mode localStorage unaffected by private session
 * - Step 10: Normal mode streak continues from 3 (not reset)
 * - Private and normal modes operate independently
 *
 * Pass Criteria:
 * ✓ Private mode does not corrupt normal mode data
 * ✓ Normal mode data persists through private mode usage
 * ✓ Modes operate independently
 */

/**
 * VALIDATION CHECKLIST
 *
 * Before marking Story 17.3 complete:
 * [ ] TEST 1: Normal browser persistence verified (Chrome/Firefox/Safari)
 * [ ] TEST 2: Chrome Incognito graceful degradation verified
 * [ ] TEST 3: Firefox Private Window behavior verified
 * [ ] TEST 4: Safari Private Browsing exception handling verified
 * [ ] TEST 5: Storage quota exceeded handling verified
 * [ ] TEST 6: Cross-session persistence verified (multi-day test)
 * [ ] TEST 7: Mixed mode switching verified
 * [ ] storage.js isStorageAvailable() correctly detects availability - code review
 * [ ] checkAndUpdateStreak() returns privateBrowsingWarning field - code review
 * [ ] Console warning logged when storage unavailable - code review
 *
 * Critical: Tests 1-5 can be run immediately, TEST 6 requires multi-day execution
 */

/**
 * DEBUGGING HELPERS
 *
 * Check localStorage availability:
 * ```javascript
 * import('./js/storage.js').then(m => console.log(m.isStorageAvailable('localStorage')))
 * ```
 *
 * Check current streak state:
 * ```javascript
 * JSON.parse(localStorage.getItem('crazysnakeLite_streak'))
 * ```
 *
 * Force private browsing simulation (DevTools console):
 * ```javascript
 * // Override isStorageAvailable to return false
 * import('./js/storage.js').then(m => {
 *   m.isStorageAvailable = () => false;
 * });
 * // Then play game to see private browsing behavior
 * ```
 *
 * Clear streak for testing:
 * ```javascript
 * localStorage.removeItem('crazysnakeLite_streak')
 * ```
 *
 * Fill localStorage to test quota (cleanup after!):
 * ```javascript
 * try {
 *   for (let i = 0; i < 1000; i++) {
 *     localStorage.setItem('junk_' + i, 'x'.repeat(10000));
 *   }
 * } catch (e) {
 *   console.log('Quota reached:', e);
 * }
 * // Cleanup: localStorage.clear()
 * ```
 */
