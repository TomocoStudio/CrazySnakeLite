# Bug Fix Documentation: Score Calculation

**Date:** 2026-02-01
**Fixed By:** Amelia (Developer Agent) + Bob (Technical Writer)
**Reported By:** Tomoco
**Commit:** c595673

---

## Summary

Fixed score calculation logic to count foods eaten instead of total snake length. This change improves game clarity and aligns with classic Snake game mechanics.

---

## The Bug

**Issue:** Score displayed snake segment count instead of foods eaten.

**Observed Behavior:**
- Game starts: Score shows 0 (correct)
- First food eaten: Score jumps to 6 (incorrect - should be 1)
- Second food eaten: Score shows 7 (should be 2)

**Root Cause:** Score calculation used `segments.length` directly instead of `segments.length - STARTING_LENGTH`.

**Why This Happened:** Original acceptance criteria specified "score = snake length" but this proved confusing in practice since the snake starts with 5 segments.

---

## The Fix

**File Changed:** `js/game.js:78`

**Before:**
```javascript
// Update score with validation (ensure it's a valid positive integer)
gameState.score = Math.max(0, gameState.snake.segments.length || 0);
```

**After:**
```javascript
// Update score: number of foods eaten (segments - starting length)
gameState.score = Math.max(0, (gameState.snake.segments.length - CONFIG.STARTING_LENGTH) || 0);
```

**Result:**
- Score starts at 0 (no foods eaten)
- First food: Score = 1
- Second food: Score = 2
- Nth food: Score = N

---

## Impact Assessment

### Code Changes
- ✅ `js/game.js` - Updated score calculation logic
- ✅ `js/state.js` - No change needed (score already initialized to 0)

### Documentation Updates
- ✅ `CHANGELOG.md` - Added bug fix entry under Unreleased section
- ✅ `_bmad-output/implementation-artifacts/stories/4-1-score-system-and-display.md` - Added change log entry noting AC deviation
- ✅ `_bmad-output/planning-artifacts/architecture.md` - Updated scoring system description
- ✅ `README.md` - No change needed (description remains accurate)

### Test Updates
- ✅ `test/score.test.js` - Updated 5 tests to reflect new behavior:
  - Test 1: Initial score = 0 (was 5)
  - Test 2: Score after first food = 1 (was 6)
  - Test 3: Score after 3 foods = 3 (was 8)
  - Test 4: Invariant now tests "score = foods eaten" (was "score = snake length")
  - Test 6: Initial display shows "Score: 0" (was "Score: 5")

---

## Requirements Change Notice

**Important:** This fix represents a **requirements change**, not just a bug fix.

**Original Requirement (Story 4-1 AC):**
- "score always equals the current snake length"
- "starting score equals starting snake length (5)"

**New Requirement (Post-Release):**
- Score counts foods eaten (starts at 0, increments by 1 per food)
- More intuitive for players
- Aligns with classic Snake game conventions

**Rationale:** While the original implementation met the stated acceptance criteria, user testing revealed that starting at 5 was confusing. The new approach provides clearer feedback about player progress.

---

## Testing Performed

### Manual Testing
- ✅ Game starts with score = 0
- ✅ First food increments score to 1
- ✅ Multiple foods increment correctly (2, 3, 4...)
- ✅ All food types increment score properly
- ✅ Score display updates in real-time

### Automated Testing
- ✅ Updated test suite runs successfully
- ✅ All 10 score tests pass with new behavior
- ✅ Integration tests confirmed compatible

---

## Affected Planning Artifacts

The following planning documents originally specified "score = snake length":

- `_bmad-output/planning-artifacts/prd.md` (FR42, line 227, 819)
- `_bmad-output/planning-artifacts/epics.md` (lines 71, 356, 1081, 1082)
- `_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md` (lines 50, 222)

**Decision:** These documents remain unchanged as historical planning artifacts. The change is documented in:
- CHANGELOG.md (user-facing)
- Story 4-1 change log (developer-facing)
- architecture.md (updated to current state)

---

## Credits

- **Bug Report:** Tomoco
- **Fix Implementation:** Amelia (Developer Agent)
- **Documentation:** Bob (Technical Writer Agent)
- **Commit:** c595673

---

## Lessons Learned

1. **User feedback matters:** Original AC met requirements but confused users
2. **Classic conventions:** Aligning with established game patterns improves UX
3. **Score clarity:** Starting at 0 provides clearer progress tracking
4. **Requirements evolution:** Post-release feedback can drive valuable changes

---

**Status:** ✅ Complete - All code, tests, and documentation updated
