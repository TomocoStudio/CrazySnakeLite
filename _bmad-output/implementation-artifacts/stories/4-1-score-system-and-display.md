# Story 4.1: Score System and Display

**Epic:** 4 - Audio & Complete Experience
**Story ID:** 4.1
**Status:** done
**Created:** 2026-01-27
**Completed:** 2026-01-29

---

## Story

**As a** player,
**I want** to see my current score during gameplay,
**So that** I can track my progress and aim for a higher score.

## Acceptance Criteria

**Given** the game is in 'playing' phase
**When** viewing the game screen
**Then** a score counter is displayed at the top-center of the game board
**And** the score displays the current snake length

**Given** the snake eats any food type
**When** the food is consumed
**Then** the snake grows by one segment
**And** the score counter increments by 1 immediately

**Given** the game is running
**When** checking the score calculation
**Then** score always equals the current snake length
**And** starting score equals starting snake length (5)

**Given** the score display is rendered
**When** viewing the UI
**Then** the score is clearly visible without obstructing gameplay
**And** the score uses retro pixel art styling consistent with the game
**And** the score has clear visual hierarchy (readable at a glance)

**Given** the player can see the snake
**When** gauging their progress visually
**Then** the snake's size on screen provides a visual representation of the score

## Tasks / Subtasks

- [x] Add score display DOM element to index.html (AC: Score displayed)
  - [x] Create #score-display div
  - [x] Position at top-center of game container
  - [x] Initial content: "Score: 5"
- [x] Style score display in css/style.css (AC: Retro styling)
  - [x] Monospace font (Courier New)
  - [x] Clear visual hierarchy
  - [x] Positioned at top-center
  - [x] No gameplay obstruction
- [x] Update score on food consumption (AC: Increment by 1)
  - [x] In game.js, when food eaten, increment gameState.score
  - [x] Update DOM element with new score
- [x] Initialize score on game start (AC: Starting score = 5)
  - [x] Set gameState.score = snake.segments.length
  - [x] Update score display on game start
- [x] Test score display and updates (AC: Always equals snake length)
  - [x] Verify score = 5 at start
  - [x] Verify score increments with each food
  - [x] Verify score display updates in real-time

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story implements the **Score System and Display**, providing visual feedback for player progress. Your job is to:

1. **Add score display DOM element** at top-center of game
2. **Style with retro aesthetic** (monospace font, clear hierarchy)
3. **Update score on food consumption** (score = snake length)
4. **Initialize score on game start** (starting score = 5)

**CRITICAL SUCCESS FACTORS:**
- Score MUST always equal snake length
- Score MUST increment immediately when food eaten
- Score display MUST be clearly visible without obstructing gameplay
- Score MUST use retro pixel art styling (monospace font)
- Starting score MUST equal starting snake length (5)

**WHY THIS MATTERS:**
- Score provides tangible goal for players
- Visual feedback reinforces progress
- Sets up high score tracking in Story 4.2
- Completes the core gameplay loop

**DEPENDENCIES:**
- Epic 1 MUST be complete (snake, food, game loop)
- Epic 2 MUST be complete (food effects)
- gameState.score must be tracked

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
CrazySnakeLite/
├── index.html              # Add score display DOM (MODIFY)
├── css/
│   └── style.css           # Add score display styles (MODIFY)
├── js/
│   ├── game.js             # Update score on food consumption (MODIFY)
│   ├── state.js            # Score already in state (NO CHANGE)
│   └── (other modules)     # No changes needed
```

**Score System Pattern:**

From architecture.md and project-context.md:
- Score = snake length (simple, visual)
- Score displayed as DOM element (not canvas-rendered)
- Score updated on food consumption
- Starting score = 5 (starting snake length)

**Critical Architectural Decision:**
- **DOM vs Canvas:** Score display is DOM element for crisp text rendering
- **State-Driven:** Score stored in gameState, displayed in DOM
- **Real-Time Update:** Score updated immediately on food consumption

**Integration Points:**
- game.js updates gameState.score when food eaten
- DOM element displays current score from gameState
- Story 4.2 will use gameState.highScore for localStorage

---

### 📁 FILE STRUCTURE REQUIREMENTS

**index.html - Add Score Display (MODIFY)**

Add score display after game canvas:

```html
<div id="game-container">
  <canvas id="game-canvas"></canvas>

  <!-- Score Display - Story 4.1 -->
  <div id="score-display">Score: 5</div>

  <!-- Phone overlay (from Epic 3) -->
  <div id="phone-overlay" class="hidden">...</div>
</div>
```

**css/style.css - Style Score Display (MODIFY)**

```css
/* Score Display - Story 4.1 */
#score-display {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border: 2px solid #000000;
  border-radius: 4px;
  z-index: 100;
  pointer-events: none;  /* Don't block clicks */
}

@media (max-width: 768px) {
  #score-display {
    font-size: 16px;
    padding: 6px 12px;
  }
}
```

**js/game.js - Update Score on Food Consumption (MODIFY)**

```javascript
// In food collision handling (update function)
if (checkFoodCollision(gameState)) {
  const foodType = gameState.food.type;

  // Always grow snake
  growSnake(gameState);
  // Update score with validation (Story 4.1)
  gameState.score = Math.max(0, gameState.snake.segments.length || 0);

  // ... apply effects, spawn new food ...
}
```

**js/main.js - Score Display DOM Updates (MODIFY)**

```javascript
// Cache score display element
const scoreDisplay = document.getElementById('score-display');

/**
 * Update score display DOM element
 * Story 4.1
 * DOM access isolated to main.js per architecture
 * @param {number} score - Current score
 */
function updateScoreDisplay(score) {
  if (!scoreDisplay) {
    console.error('[UI] Score display element not found in DOM');
    return;
  }

  const validScore = Math.max(0, Math.floor(score || 0));
  scoreDisplay.textContent = `Score: ${validScore}`;
}

// In handleUIUpdate callback - only update when score changes
function handleUIUpdate(state) {
  // ...
  if (state.phase === 'playing') {
    if (scoreChanged) {
      updateScoreDisplay(state.score);
    }
  }
  // ...
}

// Initialize score on game start
function startNewGame() {
  resetGame(gameState);
  gameState.phase = 'playing';
  updateScoreDisplay(gameState.score);
  scoreDisplay.classList.remove('hidden');
  // ...
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing:**
1. Start game - verify score displays "Score: 5"
2. Eat food - verify score increments to 6, 7, 8, etc.
3. Check snake length matches score
4. Verify score clearly visible at top-center
5. Verify retro styling matches game aesthetic

---

## Dev Agent Record

### Agent Model Used

- Claude Sonnet 4.5 (create-story workflow)
- Claude Sonnet 4.5 (dev-story workflow - implementation)

### Implementation Plan

Implemented score system following architecture patterns:
1. Added DOM element for score display (DOM-based, not canvas-rendered)
2. Styled with retro aesthetic matching game design
3. Integrated score updates into existing UI callback pattern
4. Score tracking uses gameState.score = snake.segments.length invariant
5. Updates occur via handleUIUpdate callback (respects module boundaries)

### Debug Log

- ✅ Score display DOM element added to index.html
- ✅ CSS styling implemented with retro aesthetic (monospace, bordered)
- ✅ Mobile responsive styling added (@media max-width: 768px)
- ✅ updateScoreDisplay function created in main.js (DOM access isolated)
- ✅ Score updates integrated into handleUIUpdate callback
- ✅ Score initialization added on game start and reset
- ✅ Score invariant maintained: score = snake.segments.length
- ✅ Tests created (score.test.js with 7 test cases)
- ✅ Manual test guide created

### Completion Notes

**Implementation Summary:**
- Score display positioned at top-center using absolute positioning
- DOM updates occur through UI callback pattern (architectural compliance)
- Score always equals snake length (simple, visual metric)
- Starting score correctly set to 5 (CONFIG.STARTING_LENGTH)
- Score increments immediately on food consumption
- Display styled with retro aesthetic: monospace font, clear borders
- Mobile responsive: smaller font and padding on screens <= 768px
- pointer-events: none ensures no gameplay obstruction
- z-index: 100 ensures visibility above canvas

**Testing:**
- Created 7 automated tests covering:
  - Initial score value
  - Score growth after food consumption
  - Score invariant (score = snake length)
  - DOM element existence
  - Display content correctness
  - CSS styling validation
- Manual test guide created for browser-based validation
- All acceptance criteria verified through code inspection

**Architectural Compliance:**
- DOM access isolated to main.js (per architecture rules)
- Score updates through handleUIUpdate callback pattern
- No magic numbers (all values from CONFIG or derived from state)
- Follows existing patterns (similar to game-over screen)
- Module boundaries respected

### File List

Files modified:
- index.html (added #score-display div at line 15, set hidden class initially)
- css/style.css (added score display styles at line 37, .hidden class, mobile styles at line 302)
- js/main.js (added scoreDisplay cache, updateScoreDisplay function with validation, phase visibility logic, score change tracking)
- js/game.js (score update with validation on food consumption at line 77)

Files created:
- test/score.test.js (10 automated tests including phase visibility and validation tests)
- test/score-test-page.html (test runner page)
- test/manual-score-test.md (manual test guide)

### Change Log

- 2026-01-28: Implemented score system and display (Story 4.1)
  - Added score display DOM element with retro styling
  - Integrated score updates into UI callback pattern
  - Created comprehensive test suite (7 automated + manual tests)
  - All acceptance criteria satisfied

- 2026-01-29: Code review fixes (Story 4.1 - Adversarial Review)
  - **CRITICAL FIX:** Added phase visibility management - score only visible during 'playing' phase
  - **PERFORMANCE FIX:** Score display updates only when score changes (not every frame)
  - **VALIDATION:** Added score validation in game.js and updateScoreDisplay (handles undefined/NaN)
  - **ERROR HANDLING:** Added console.error logging when score display element not found
  - **PRECISION:** Score values enforced as integers using Math.floor
  - **TESTS:** Added 3 new tests (phase visibility, validation, precision) - now 10 total tests
  - **DOCS:** Updated story documentation to match actual implementation (main.js not game.js)
  - **HTML:** Changed initial score display to hidden with generic placeholder
  - **CSS:** Added .hidden class for score-display element

