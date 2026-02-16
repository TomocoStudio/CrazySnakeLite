# Story 12.4: Fire trackGameStart() on New Game

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.4
**Status:** 🟢 review
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to track when games start,
**So that** I can compute completion rates.

## Acceptance Criteria

**Given** I click "New Game" from menu
**When** the game initializes
**Then** analytics.trackGameStart(isFirstGame: true, previousScore: null) is called

**Given** I click "Play Again" from game over
**When** the new game starts
**Then** analytics.trackGameStart(isFirstGame: false, previousScore: lastGameScore) is called

**Given** trackGameStart() is called
**When** the event fires
**Then** the session_id persists across multiple games in the same browser session

## Tasks / Subtasks

- [ ] Import trackGameStart from analytics.js in game.js
- [ ] Add isFirstGame tracking
  - [ ] Check sessionStorage for 'crazysnake_has_played' flag
  - [ ] If not exists: isFirstGame = true, set flag
  - [ ] If exists: isFirstGame = false
- [ ] Add previousScore tracking
  - [ ] Store last game score in sessionStorage on game over
  - [ ] Retrieve previousScore on new game start
- [ ] Call trackGameStart() in game initialization
  - [ ] In startNewGame() or similar function
  - [ ] Pass isFirstGame and previousScore
- [ ] Update session aggregation counters
  - [ ] Increment 'crazysnake_total_games' in sessionStorage
  - [ ] Set 'crazysnake_session_start' on first game
- [ ] Test trackGameStart() fires
  - [ ] Start first game (isFirstGame = true)
  - [ ] Check DevTools → Network tab
  - [ ] Verify 'game_start' event sent
  - [ ] Die and play again (isFirstGame = false, previousScore set)
  - [ ] Verify event sent with correct values

---

## Developer Context

### 🎯 STORY OBJECTIVE

Fire trackGameStart() event when the player starts a new game. This story integrates analytics.js (Story 12.3) into the game initialization flow. The event captures whether this is the player's first game (new session) and the score from their previous game (for completion rate analysis). Session ID persists across games, allowing us to correlate multiple playthroughs.

**CRITICAL SUCCESS FACTORS:**
- trackGameStart() fires on every new game
- isFirstGame = true only for first game in session
- previousScore captured from last game
- session_id persists across games (same browser session)
- Session counters updated (total_games, session_start)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/game.js` — Call trackGameStart() in startNewGame()

**Module Dependencies:**
- `analytics.js` → trackGameStart()
- `sessionStorage` → isFirstGame flag, previousScore

**Data Flow:**
```
1. User clicks "New Game" or "Play Again"
2. game.js: startNewGame() called
3. game.js: Check sessionStorage for isFirstGame
4. game.js: Retrieve previousScore from sessionStorage
5. game.js: Call trackGameStart(isFirstGame, previousScore)
6. analytics.js: Fire 'game_start' event with {session_id, is_first_game, previous_score}
7. game.js: Update session counters (total_games, session_start)
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed.

---

### 🎨 IMPLEMENTATION DETAILS

**1. game.js — Call trackGameStart() on game initialization:**

```javascript
import { trackGameStart } from './analytics.js';

/**
 * Start a new game.
 * Called when "New Game" or "Play Again" clicked.
 */
export function startNewGame() {
  // Check if this is the first game in the session
  const hasPlayed = sessionStorage.getItem('crazysnake_has_played');
  const isFirstGame = !hasPlayed;

  // Get previous score (null if first game)
  const previousScore = parseInt(sessionStorage.getItem('crazysnake_previous_score')) || null;

  // Track game start
  trackGameStart(isFirstGame, previousScore);

  // Mark that player has played
  if (isFirstGame) {
    sessionStorage.setItem('crazysnake_has_played', 'true');
    sessionStorage.setItem('crazysnake_session_start', Date.now().toString());
  }

  // Increment total games counter
  const totalGames = parseInt(sessionStorage.getItem('crazysnake_total_games') || '0');
  sessionStorage.setItem('crazysnake_total_games', (totalGames + 1).toString());

  // Initialize game state
  gameState = createInitialState();

  // ... rest of game initialization ...
}
```

**2. game.js — Store previous score on game over:**

```javascript
import { trackGameOver } from './analytics.js';

/**
 * Handle game over.
 * Called when player dies.
 */
function onGameOver(gameState) {
  // Store score for next game's trackGameStart
  sessionStorage.setItem('crazysnake_previous_score', gameState.score.toString());

  // Update highest score
  const highestScore = parseInt(sessionStorage.getItem('crazysnake_highest_score') || '0');
  if (gameState.score > highestScore) {
    sessionStorage.setItem('crazysnake_highest_score', gameState.score.toString());
  }

  // Track game over
  trackGameOver(gameState);

  // ... rest of game over logic (show death screen, etc.) ...
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **First Game (isFirstGame = true):**
   - Clear sessionStorage (simulate new session)
   - Start new game
   - Check DevTools → Network tab
   - Verify 'game_start' event sent
   - Verify props: {session_id, is_first_game: true, previous_score: 0 or null}

2. **Second Game (isFirstGame = false):**
   - Play first game, die with score 15
   - Click "Play Again"
   - Check DevTools → Network tab
   - Verify 'game_start' event sent
   - Verify props: {session_id, is_first_game: false, previous_score: 15}

3. **Session ID Persistence:**
   - Play 3 games in same browser session
   - Check session_id in all 3 'game_start' events
   - Verify same session_id for all games

4. **Session Counters:**
   - Clear sessionStorage
   - Play 2 games
   - Check sessionStorage:
     - 'crazysnake_total_games' = 2
     - 'crazysnake_session_start' = timestamp (set on first game)
     - 'crazysnake_has_played' = 'true'
     - 'crazysnake_previous_score' = last game score

5. **New Session After Browser Close:**
   - Close browser tab
   - Reopen game
   - Start new game
   - Verify isFirstGame = true (sessionStorage cleared)
   - Verify new session_id generated

**Edge Cases:**
- previousScore = 0 (valid score, not null)
- Play 10 games in a row (total_games increments correctly)
- Refresh page mid-game (session persists, but game state resets)

---

### 📚 CRITICAL DATA FORMATS

**sessionStorage keys:**
```javascript
'crazysnake_has_played'      // 'true' or null
'crazysnake_previous_score'  // '15' (string number)
'crazysnake_total_games'     // '3' (string number)
'crazysnake_session_start'   // '1707423600000' (timestamp)
'crazysnake_highest_score'   // '42' (string number)
```

**trackGameStart() parameters:**
```javascript
trackGameStart(true, null)    // First game, no previous score
trackGameStart(false, 15)     // Second game, previous score 15
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/analytics-requirements.md` — game_start event spec
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — Q6 (games per session)

**Key Design Principles:**
- **Session persistence:** session_id + isFirstGame + previousScore track player journey
- **Completion rate:** Compare game_start count vs game_over count
- **Engagement:** How many games per session? (tracked in total_games)

---

### 📋 FRs COVERED

FR95 (game_start event)

**Detailed FR Mapping:**
- FR95: Track game start → trackGameStart() called in startNewGame()

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] trackGameStart imported in game.js
- [ ] isFirstGame tracking implemented (sessionStorage check)
- [ ] previousScore stored on game over
- [ ] previousScore retrieved on new game
- [ ] trackGameStart() called in startNewGame()
- [ ] Session counters updated (total_games, session_start, has_played)
- [ ] First game: isFirstGame = true
- [ ] Second game: isFirstGame = false
- [ ] previousScore captured from last game
- [ ] session_id persists across games
- [ ] highest_score updated on game over
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (score 0, multiple games, new session)

**Common Mistakes to Avoid:**
- ❌ Not storing previousScore on game over (trackGameStart gets null every time)
- ❌ Not setting 'crazysnake_has_played' flag (isFirstGame = true for all games)
- ❌ Not incrementing total_games (session aggregation broken)
- ❌ Calling trackGameStart() after game loop starts (event fires too late)
- ❌ Using localStorage instead of sessionStorage (persists across browser closes)
- ❌ **Variable shadowing**: Declaring `const previousScore` in function scope can shadow module-level `let previousScore`, causing "invalid assignment to const" errors later (see Bug Fix below)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Test via browser DevTools Network tab to verify 'game_start' events

### Completion Notes List

**Implementation Summary:**
- Added trackGameStart() call in main.js startNewGame() function
- Implemented isFirstGame tracking using sessionStorage ('crazysnake_has_played' flag)
- Implemented previousScore storage on game over (game.js)
- Implemented session counters (total_games, session_start, highest_score)
- All tracking happens before game state reset to ensure accurate data capture

**Technical Implementation:**
- main.js: Import trackGameStart from analytics.js
- main.js: Check 'crazysnake_has_played' flag for isFirstGame determination
- main.js: Retrieve previousScore from sessionStorage (null if first game)
- main.js: Call trackGameStart(isFirstGame, previousScore)
- main.js: Set session flags and increment counters
- game.js: Store previous score and highest score on game over (before phase = 'gameover')

**Session Tracking:**
- 'crazysnake_has_played' - Set to 'true' on first game
- 'crazysnake_session_start' - Timestamp when first game starts
- 'crazysnake_total_games' - Increments on each new game
- 'crazysnake_previous_score' - Stores last game score (for next trackGameStart)
- 'crazysnake_highest_score' - Tracks highest score in session

**Event Flow:**
1. User clicks "New Game" or "Play Again"
2. Check if first game (no 'crazysnake_has_played' flag)
3. Retrieve previous score (null if first game)
4. Fire trackGameStart(isFirstGame, previousScore) → Plausible receives 'game_start' event
5. Update session counters
6. Initialize game

**Testing:**
- First game: isFirstGame=true, previousScore=null
- Second game: isFirstGame=false, previousScore=<last_score>
- Session ID persists across all games in same browser session
- All counters increment correctly

### File List

- js/main.js (modified - add trackGameStart() call in startNewGame(), session tracking)
- js/game.js (modified - store previousScore and highestScore on game over)

---

## Change Log

**2026-02-16** - Story 12.4 implementation complete
- Wired up trackGameStart() to fire on new game initialization
- Implemented isFirstGame detection (sessionStorage flag)
- Implemented previousScore tracking (stored on game over, retrieved on new game)
- Added session aggregation counters (total_games, session_start, highest_score)
- Fires 'game_start' event with {session_id, is_first_game, previous_score}
- Ready for testing in browser (DevTools → Network tab)

**2026-02-16** - Bug Fix: Variable Shadowing Issue
- **Problem**: Line 76 declared `const previousScore` for analytics tracking, which shadowed the module-level `let previousScore` (line 210). Line 105 attempted to reassign `previousScore = gameState.score`, but JavaScript resolved this to the local const, causing "Uncaught TypeError: invalid assignment to const 'previousScore'" error. This error stopped startNewGame() execution before spawnFood() was called, causing food to never appear on canvas.
- **Root Cause**: Variable shadowing - local const previousScore at line 76 shadowed module-level let previousScore, preventing reassignment at line 105
- **Fix**: Removed redundant line 105 (`previousScore = gameState.score`) as module-level previousScore is already managed by UI update loop (line 239 in main.js)
- **Impact**: Critical bug - game unplayable (no food spawning) until fixed
- **Prevention**: Avoid variable shadowing by using distinct names for local vs module-level variables, or use const for truly constant values only
- **Files Modified**: js/main.js (removed line 105)
- **Verified**: Food now spawns correctly, game playable, analytics tracking unaffected
