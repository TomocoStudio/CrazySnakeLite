# Story 14.1: Implement Highlight Selection Algorithm

**Epic:** 14 - Enhanced Post-Game Summary ("Recap")

**As a** player,
**I want** the post-game summary to show my most impressive cognitive achievements from the session,
**So that** I feel validated and motivated to play again.

---

## Acceptance Criteria

**Given** a game session ends
**When** game-over screen appears
**Then** cognitive-feedback.js queries metrics.js for current session data
**And** runs highlight selection algorithm with 4-tier priority:

**Priority 1: Personal Best (Highest)**
```javascript
if (sessionMetric > allTimeHighForMetric) {
  highlights.push({
    type: 'personal_best',
    metric: metricName,
    value: sessionMetric,
    text: `${metricDisplayName}: NEW PERSONAL BEST!`,
    icon: '🎯'
  })
}
```

**Priority 2: Biggest Improvement**
```javascript
delta = sessionMetric - rollingAverage
if (delta > 0.15 * rollingAverage) {  // 15%+ improvement
  highlights.push({
    type: 'improvement',
    metric: metricName,
    delta: percentageChange,
    text: `${metricDisplayName} up ${delta}% this session`,
    icon: '⬆'
  })
}
```

**Priority 3: Notable Event**
```javascript
if (cognitiveStats.rcSurvived >= 3) {
  highlights.push({
    type: 'notable',
    metric: 'cognitiveFlexibility',
    value: cognitiveStats.rcSurvived,
    text: `Survived ${count} Reverse Controls — brain on fire`,
    icon: '🔥'
  })
}
// Similar checks for: first combo, 5+ phone calls managed, 10+ mystery foods, etc.
```

**Priority 4: Growth Opportunity**
```javascript
lowestMetric = findLowestRollingAverage()
if (sessionEngagedWithLowestMetric) {  // Player encountered that challenge
  highlights.push({
    type: 'growth',
    metric: lowestMetric,
    text: `${metricDisplayName} — time to level up`,
    icon: '↑'
  })
}
```

**Then** select top 2-3 highlights by priority
**And** enforce variety: if last session pattern was [P1, P2], this session must include at least one different priority (per FR163)

**Per FR162:** Highlight selection priority: Personal Best > Biggest Improvement > Notable Event > Growth Opportunity

---

## Development

### Files to Create/Modify

- **`js/cognitive-feedback.js`** - Extend with highlight selection logic (replace basic stat display)
- **`js/storage.js`** - Add `getAllTimeHighs()` and `getLastSessionPattern()` functions
- **`test/cognitive-feedback.test.js`** - Unit tests for highlight selection algorithm

### API Surface

```javascript
// cognitive-feedback.js (NEW exports for Epic 14)

/**
 * Select 2-3 highlights from session data using 4-tier priority algorithm
 * @param {Object} sessionData - Current session from metrics.js endSession()
 * @param {Object} rollingAverages - Rolling 10-session averages from metrics.js
 * @param {Object} allTimeHighs - All-time high for each metric from storage.js
 * @param {Object} cognitiveStats - Raw event counts from gameState
 * @param {Array} lastSessionPattern - Pattern from previous session for variety check
 * @returns {Array} Array of 2-3 highlight objects with {type, metric, value, text, icon}
 */
export function selectHighlights(sessionData, rollingAverages, allTimeHighs, cognitiveStats, lastSessionPattern)

/**
 * Generate display text for a highlight based on type and metric
 * @param {Object} highlight - Highlight object from selectHighlights()
 * @returns {string} Formatted display text (e.g., "Reaction Time: NEW PERSONAL BEST!")
 */
export function formatHighlightText(highlight)
```

```javascript
// storage.js (NEW exports for Epic 14)

/**
 * Get all-time high values for each metric across all sessions
 * @returns {Promise<Object>} Object with all-time highs for each of 6 metrics
 */
export async function getAllTimeHighs(): Promise<Object>

/**
 * Get highlight pattern from last session (for variety enforcement)
 * @returns {Promise<Array>} Array of highlight types from previous session
 */
export async function getLastSessionPattern(): Promise<Array>

/**
 * Save highlight pattern for current session (for variety enforcement)
 * @param {Array} pattern - Array of highlight types (e.g., ['personal_best', 'improvement'])
 */
export async function saveSessionPattern(pattern): Promise<void>
```

### Highlight Selection Algorithm

**Priority 1: Personal Best**
- Compare `sessionData.metrics[key]` to `allTimeHighs[key]`
- If current session exceeds all-time high, create Personal Best highlight
- Icon: 🎯
- Example: "Reaction Time: NEW PERSONAL BEST!"

**Priority 2: Biggest Improvement**
- Calculate delta: `sessionData.metrics[key] - rollingAverages[key]`
- If delta > 15% of rolling average, create Improvement highlight
- Icon: ⬆
- Example: "Spatial Awareness up 18% this session"

**Priority 3: Notable Event**
- Check `cognitiveStats` for notable achievements:
  - `rcSurvived >= 3` → "Survived 3 Reverse Controls — brain on fire"
  - `comboMultipliers >= 1` → "First combo survived! Welcome to the big leagues"
  - `phoneCallsManaged >= 5` → "5 phone calls managed — multitasking master"
  - `mysteryFoodsEaten >= 10` → "10 mystery foods decoded — pattern recognition elite"
- Icon: 🔥 (contextual to achievement)
- Multiple notable events possible → select highest-value one

**Priority 4: Growth Opportunity**
- Find lowest rolling average metric: `Math.min(...Object.values(rollingAverages))`
- If player engaged with that challenge during session (check rawEvents), show growth edge
- Icon: ↑
- Example: "Impulse Control — time to level up"

**Selection Rules:**
1. Collect all qualifying highlights across 4 priorities
2. Sort by priority order (P1 > P2 > P3 > P4)
3. Select top 2-3 highlights
4. Apply variety enforcement (Story 14.4) - if pattern matches last session, replace lowest-priority highlight
5. Return final 2-3 highlights for display

### Integration Points

- **`game.js`** - Call `selectHighlights()` in `onDeath()` lifecycle after metrics calculation
- **`metrics.js`** - Provides `sessionData` and `calculateRollingAverages()` output
- **`storage.js`** - Provides `allTimeHighs` and `lastSessionPattern` from IndexedDB
- **`cognitive-feedback.js`** - Existing `showCognitiveStats()` will be replaced/extended with highlights display (Story 14.2)

### Test Strategy

**Unit Tests (`cognitive-feedback.test.js`):**
1. Test Priority 1: Personal Best detection when session metric > all-time high
2. Test Priority 2: Improvement detection when delta > 15% threshold
3. Test Priority 3: Notable Event detection for rcSurvived >= 3, first combo, etc.
4. Test Priority 4: Growth Opportunity selection when lowest metric engaged
5. Test highlight limit: never more than 3 highlights returned
6. Test no qualifying highlights (first session, low engagement) → show encouragement highlight
7. Test metric null handling (data collection failure) → skip metric gracefully
8. Test formatHighlightText() for all 4 priority types

**Manual Testing:**
- Play session with new personal best → verify "NEW PERSONAL BEST!" appears
- Play session with 15%+ improvement → verify improvement highlight with percentage
- Survive 3+ Reverse Controls → verify Notable Event highlight
- Play 5+ consecutive sessions → verify variety enforcement (no repeated patterns)

### Dependencies

**BLOCKS:** Story 14.2 (UI rendering needs highlight data structure)
**BLOCKED BY:** Epic 13 Story 13.8 (rolling averages required for Improvement priority)

### Implementation Notes

1. **Metric display names** - Use human-friendly names:
   - `reactionTime` → "Reaction Time"
   - `spatialAwareness` → "Spatial Awareness"
   - `cognitiveFlexibility` → "Cognitive Flexibility"
   - `dividedAttention` → "Divided Attention"
   - `impulseControl` → "Impulse Control"
   - `workingMemory` → "Working Memory"

2. **Null handling** - If `sessionData.metrics[key]` is null or undefined, skip that metric in selection (graceful degradation per Architecture Pattern 7)

3. **First session edge case** - No rolling averages or all-time highs exist → only Notable Event and Growth Opportunity priorities available → show 1-2 highlights or generic encouragement

4. **Encouragement fallback** - If zero qualifying highlights (player ate only green food, no phone calls, no RC, no combo):
   ```javascript
   {
     type: 'encouragement',
     text: 'Score achieved: 15 — Every session trains your brain',
     icon: '🧠'
   }
   ```

5. **Variety enforcement integration** - Call `getLastSessionPattern()` from storage.js → compare to current pattern → swap lowest-priority highlight if exact match (see Story 14.4 for full logic)

6. **Performance target** - Selection algorithm must run in < 50ms (post-death hot path per NFR51)

---

## Implementation Status

**Status:** ✅ **COMPLETED**
**Date:** 2026-02-16

### Summary
Successfully implemented 4-tier highlight selection algorithm. Algorithm identifies 2-3 meaningful achievements per session by comparing current metrics against all-time highs and rolling averages.

### Files Modified/Created
- **`js/storage.js`** - Added `getAllTimeHighs()`, `getLastSessionPattern()`, `saveSessionPattern()`
- **`js/cognitive-feedback.js`** - Added `selectHighlights()`, `formatHighlightText()`, metric display names
- **`js/main.js`** - Integrated highlight selection in game-over handler
- **`js/game.js`** - Refactored `saveSessionMetrics()` to return metrics + rolling averages
- **`test/storage-highlights.test.js`** - 8 tests for storage functions
- **`test/cognitive-feedback-highlights.test.js`** - 20+ tests for selection algorithm
- **`test/verify-highlights.mjs`** - Standalone Node.js verification script

### Test Results
✅ All unit tests passing (8/8 storage, 20+ algorithm tests)
✅ Performance validated: `getAllTimeHighs()` < 100ms, `selectHighlights()` < 50ms
✅ Edge cases handled: first session, zero engagement, null metrics, IndexedDB unavailable

### Acceptance Criteria
✅ All acceptance criteria met - highlight selection runs 4-tier priority algorithm, selects 2-3 highlights, enforces variety vs last session pattern
