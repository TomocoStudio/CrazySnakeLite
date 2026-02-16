# Story 13.11: Test Metrics Accuracy and Edge Cases

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** developer,
**I want** comprehensive tests for all 6 metric calculations,
**So that** players trust the cognitive data is accurate.

---

## Acceptance Criteria

**Given** unit tests for reactionTime metric
**When** rawEvents contains only normal gameplay food consumption
**Then** reactionTime = average of valid response times (outliers removed)
**And** test cases cover: fast reactions (100ms), slow reactions (1000ms), outlier handling

**Given** unit tests for spatialAwareness metric
**When** snake dies at various lengths
**Then** spatialAwareness accurately reflects snake length / grid coverage ratio
**And** test cases cover: short snake (length 10), medium (50), long (100)

**Given** unit tests for cognitiveFlexibility metric
**When** rawEvents includes RC periods
**Then** cognitiveFlexibility = RC score rate / normal score rate
**And** test cases cover: no RC (default 1.0), RC performance better (> 1.0), RC performance worse (< 1.0)

**Given** unit tests for dividedAttention metric
**When** rawEvents includes phone calls with survival/death outcomes
**Then** dividedAttention composite score = (survival_rate × 0.7) + (decision_speed × 0.3)
**And** test cases cover: all survived, all died, mixed, fast decisions, slow decisions

**Given** unit tests for impulseControl metric
**When** rawEvents includes phone decisions with varying contexts
**Then** impulseControl accurately weights strategic vs. impulsive decisions
**And** test cases cover: combo mode Pick Up, low stakes End, high score Pick Up

**Given** unit tests for workingMemory metric
**When** rawEvents includes combo mode periods
**Then** workingMemory = combo score rate / normal score rate
**And** test cases cover: no combo (default 1.0), high combo performance (> 2.0), low combo performance

**Given** edge case: player completes session with zero food eaten
**When** metrics.endSession() is called
**Then** all metrics default to 0 or neutral values
**And** no division-by-zero errors occur

**Per NFR45-NFR46:** Cognitive metric calculations produce consistent results for identical gameplay sessions, data collection captures 100% of relevant events

---

## Development

### Files to Create/Modify

- **`test/metrics.test.js`** - 60+ comprehensive tests
- **`test/epic-13-test-runner.html`** - Test runner page

### Test Coverage

- Helper functions (average, stdDev, normalize, removeOutliers)
- All 6 metric calculations
- Edge cases (empty data, zero values, null handling)
- Determinism verification
- Range validation (all metrics return 0-1)

### Dependencies

- All Stories 13.1-13.10 must be complete

---

## Implementation Status

**✅ COMPLETED** - 2026-02-16 (Epic 13)

### What Was Built

**Files:**
- `test/metrics.test.js` - 60+ comprehensive test cases covering all metrics
- `test/storage.test.js` - IndexedDB and localStorage test suite
- `test/epic-13-test-runner.html` - Browser test runner with visual results

**Test Coverage:**
1. **Helper Functions** (Tests 1-9)
   - average, standardDeviation, normalize, removeOutliers
   - Edge cases: empty arrays, clamping, inversion
2. **Reaction Time** (Tests 10-18)
   - Valid event averaging, RC exclusion, phone exclusion, outlier handling
3. **Spatial Awareness** (Tests 19-21)
   - Short/medium/long snake length calculations, grid coverage ratio
4. **Cognitive Flexibility** (Tests 22-26)
   - RC score rate vs normal, no RC data handling, ratio clamping
5. **Divided Attention** (Tests 27-30)
   - Survival rate, decision speed, composite scoring (70/30 weight)
6. **Impulse Control** (Tests 31-35)
   - Weighted decisions by context (combo, high score, low stakes)
7. **Working Memory** (Tests 36-40)
   - Combo score rate vs normal, multiplier effects, no combo handling
8. **Rolling Averages** (Tests 41-43)
   - Recency weighting, normalization, < 10 sessions handling
9. **Storage System** (Tests in storage.test.js)
   - IndexedDB schema, session persistence, pruning, graceful degradation

### Acceptance Criteria Status

✅ Unit tests for all 6 metrics with multiple test cases per metric
✅ Edge cases covered: zero food, no RC, no combo, empty data
✅ Determinism verified: identical input → identical output
✅ No division-by-zero errors in any metric calculation
✅ All metrics return normalized 0-1 values
✅ Test runner provides visual pass/fail feedback

### Test Execution

Run tests by opening `test/epic-13-test-runner.html` in browser. All 60+ tests pass with current implementation.
