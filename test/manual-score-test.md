# Manual Score System Test - Story 4.1

## Test Environment
- Browser: Chrome/Firefox/Safari (any modern browser)
- URL: http://localhost:8000/

## Test Scenarios

### ✅ Test 1: Initial Score Display
**Steps:**
1. Open http://localhost:8000/
2. Look at the top-center of the game canvas

**Expected Results:**
- Score display shows "Score: 5"
- Display is clearly visible
- Display doesn't obstruct gameplay
- Display uses monospace font (Courier New)
- Display has white background with black border

**Status:** ⏸️ Pending manual verification

---

### ✅ Test 2: Score Increments on Food Consumption
**Steps:**
1. Start the game (it should start automatically)
2. Move the snake (Arrow keys or WASD)
3. Eat a food item (green square or any special food)
4. Watch the score display

**Expected Results:**
- Score increments by 1 immediately when food is eaten
- Score changes from "Score: 5" to "Score: 6"
- Snake grows by one segment
- Score always equals snake length

**Status:** ⏸️ Pending manual verification

---

### ✅ Test 3: Score Equals Snake Length
**Steps:**
1. Play the game and eat multiple foods
2. Count the snake segments visually
3. Compare with the displayed score

**Expected Results:**
- Score always equals current snake length
- After eating 3 foods: Score = 8, Snake length = 8
- After eating 10 foods: Score = 15, Snake length = 15

**Status:** ⏸️ Pending manual verification

---

### ✅ Test 4: Score Display Styling
**Steps:**
1. Open browser DevTools
2. Inspect the #score-display element
3. Check computed styles

**Expected Results:**
- Font: 'Courier New', monospace
- Position: absolute
- Top: 10px
- Transform: translateX(-50%)
- Z-index: 100
- Pointer-events: none
- Background: rgba(255, 255, 255, 0.9)
- Border: 2px solid #000000

**Status:** ⏸️ Pending manual verification

---

### ✅ Test 5: Score Persists Through Effects
**Steps:**
1. Eat special food items (invincibility, speed boost, etc.)
2. Verify score increments
3. Eat another food while effect is active
4. Verify score increments again

**Expected Results:**
- Score increments regardless of active effect
- Score display updates in real-time
- Effects don't interfere with score tracking

**Status:** ⏸️ Pending manual verification

---

### ✅ Test 6: Score Reset on Game Over
**Steps:**
1. Die in the game (hit wall or self)
2. View game over screen
3. Click "Play Again"
4. Check score display

**Expected Results:**
- Game over screen shows final score
- After "Play Again", score resets to "Score: 5"
- Score display remains visible during new game

**Status:** ⏸️ Pending manual verification

---

### ✅ Test 7: Mobile Responsive Styling
**Steps:**
1. Open browser DevTools
2. Toggle device emulation (mobile view)
3. View score display

**Expected Results:**
- On screens <= 768px:
  - Font size: 16px (smaller than desktop 20px)
  - Padding: 6px 12px (smaller than desktop 8px 16px)
- Score remains visible and readable

**Status:** ⏸️ Pending manual verification

---

## Automated Tests

Run automated tests:
```bash
# Start server if not running
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/test/score-test-page.html
```

Check console for test results.

---

## Acceptance Criteria Validation

**AC 1:** Score counter displayed at top-center ✅
- [x] Element exists at top-center
- [x] Position is absolute with left: 50%, transform: translateX(-50%)

**AC 2:** Score displays current snake length ✅
- [x] Score = snake.segments.length
- [x] Verified in game.js line 68

**AC 3:** Score increments by 1 when food consumed ✅
- [x] Score updates in game.js when food eaten
- [x] updateScoreDisplay called via handleUIUpdate

**AC 4:** Starting score equals starting snake length (5) ✅
- [x] Initial state sets score = CONFIG.STARTING_LENGTH
- [x] Verified in state.js line 49

**AC 5:** Score is clearly visible without obstructing gameplay ✅
- [x] z-index: 100 (above canvas)
- [x] pointer-events: none (doesn't block clicks)
- [x] Position at top-center (not over play area)

**AC 6:** Retro pixel art styling ✅
- [x] Monospace font: 'Courier New'
- [x] Clear visual hierarchy (bold, 20px)
- [x] Consistent with game aesthetic (black/white, bordered)

---

## Implementation Checklist

- [x] DOM element added to index.html
- [x] CSS styling added to style.css
- [x] Mobile responsive styles added
- [x] updateScoreDisplay function created in main.js
- [x] Score updates on food consumption via handleUIUpdate
- [x] Score initializes on game start
- [x] Score resets on Play Again
- [x] Tests created (score.test.js)
- [x] Test page created (score-test-page.html)

---

## Files Modified

1. **index.html** - Added score-display div
2. **css/style.css** - Added score-display styles + mobile responsive
3. **js/main.js** - Added updateScoreDisplay function and calls
4. **test/score.test.js** - New test file
5. **test/score-test-page.html** - New test page
6. **test/manual-score-test.md** - New manual test guide (this file)
