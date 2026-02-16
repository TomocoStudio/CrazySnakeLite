# Story 14.4: Add Variety Enforcement to Prevent Repetition

**Epic:** 14 - Enhanced Post-Game Summary ("Recap")

**As a** player,
**I want** each post-game summary to feel fresh and different,
**So that** highlights never feel templated or predictable.

---

## Acceptance Criteria

**Given** previous session used highlight pattern [Personal Best, Notable Event]
**When** current session selects highlights
**Then** current pattern MUST include at least one different priority type
**And** valid patterns: [Personal Best, Improvement], [Personal Best, Growth], [Improvement, Notable Event], etc.
**And** invalid pattern: [Personal Best, Notable Event] (exact repeat)

**Given** highlight selection algorithm runs
**When** top priorities are determined
**Then** check last session pattern from storage
**And** if current pattern matches last pattern exactly, replace lowest-priority highlight with next-best alternative priority

**Given** only 1 qualifying highlight exists (edge case)
**When** enforcing variety
**Then** show that single highlight (do not artificially add low-quality highlights)
**And** variety check skipped when insufficient highlights

**Given** player plays 5 consecutive sessions
**When** reviewing all post-game summaries
**Then** no two consecutive sessions show identical priority patterns
**And** player experiences diverse celebration types (PB, Improvement, Notable, Growth all represented)

**Per FR163:** Highlight selection algorithm ensures no repeated pattern in consecutive sessions (variety enforcement)

---

## Development

### Files to Create/Modify

- **`js/cognitive-feedback.js`** - Extend `selectHighlights()` with variety enforcement logic
- **`js/storage.js`** - Add `getLastSessionPattern()` and `saveSessionPattern()` functions
- **`test/cognitive-feedback.test.js`** - Unit tests for variety enforcement edge cases

### API Surface

```javascript
// cognitive-feedback.js (EXTEND Story 14.1 implementation)

/**
 * Enforce variety in highlight patterns (no consecutive duplicates)
 * @param {Array} candidateHighlights - Initial highlights from priority selection
 * @param {Array} lastPattern - Pattern from previous session (e.g., ['personal_best', 'notable'])
 * @returns {Array} Final highlights with variety enforced (2-3 items)
 */
export function enforceVariety(candidateHighlights, lastPattern)

/**
 * Extract pattern signature from highlights array
 * @param {Array} highlights - Array of highlight objects
 * @returns {Array} Pattern signature (e.g., ['personal_best', 'improvement', 'notable'])
 */
export function getPatternSignature(highlights)
```

```javascript
// storage.js (EXTEND existing IndexedDB schema)

/**
 * Get highlight pattern from last completed session
 * @returns {Promise<Array|null>} Array of highlight types or null if no previous session
 */
export async function getLastSessionPattern()

/**
 * Save highlight pattern for current session
 * @param {string} sessionId - Current session ID
 * @param {Array} pattern - Pattern signature (e.g., ['personal_best', 'improvement'])
 * @returns {Promise<void>}
 */
export async function saveSessionPattern(sessionId, pattern)
```

### Variety Enforcement Algorithm

```javascript
function enforceVariety(candidateHighlights, lastPattern) {
  // 1. Edge case: no last pattern (first session or data unavailable)
  if (!lastPattern || lastPattern.length === 0) {
    return candidateHighlights; // No variety enforcement possible
  }

  // 2. Extract current pattern signature
  const currentPattern = getPatternSignature(candidateHighlights);

  // 3. Check for exact match
  const isExactMatch =
    currentPattern.length === lastPattern.length &&
    currentPattern.every((type, i) => type === lastPattern[i]);

  if (!isExactMatch) {
    return candidateHighlights; // Pattern is already different, no enforcement needed
  }

  // 4. Pattern matches → swap lowest-priority highlight
  // Find next-best alternative that creates unique pattern
  const alternativePriorities = ['personal_best', 'improvement', 'notable', 'growth'];

  for (let i = candidateHighlights.length - 1; i >= 0; i--) {
    const currentType = candidateHighlights[i].type;

    // Find next priority type not already in current pattern
    const replacement = alternativePriorities.find(type =>
      type !== currentType && !currentPattern.includes(type)
    );

    if (replacement) {
      // Replace lowest-priority highlight with alternative
      candidateHighlights[i] = createAlternativeHighlight(replacement);
      break;
    }
  }

  // 5. Edge case: only 1 qualifying highlight exists
  if (candidateHighlights.length === 1) {
    return candidateHighlights; // Cannot enforce variety with single highlight
  }

  return candidateHighlights;
}

function getPatternSignature(highlights) {
  return highlights.map(h => h.type); // e.g., ['personal_best', 'improvement', 'notable']
}
```

### Storage Schema Extension

Add `highlightPattern` field to session records in IndexedDB:

```javascript
// Extend session object schema in storage.js
{
  sessionId: string,
  timestamp: number,
  score: number,
  metrics: { ... },
  rawEvents: [ ... ],
  highlightPattern: ['personal_best', 'improvement'] // NEW FIELD
}
```

### Integration Points

- **`cognitive-feedback.js`** - Call `enforceVariety()` after initial `selectHighlights()` priority selection (Story 14.1)
- **`storage.js`** - Call `getLastSessionPattern()` when selecting highlights
- **`storage.js`** - Call `saveSessionPattern()` after highlights displayed (in `game.js onDeath()`)
- **`game.js`** - Orchestrate: `selectHighlights()` → `enforceVariety()` → `showHighlights()` → `saveSessionPattern()`

### Test Strategy

**Unit Tests (`cognitive-feedback.test.js`):**
1. Test no enforcement when no last pattern (first session)
2. Test no enforcement when current pattern differs from last
3. Test enforcement when patterns match exactly → lowest-priority highlight swapped
4. Test edge case: only 1 highlight → variety skipped (no artificial padding)
5. Test edge case: all 4 priority types exhausted → keep original pattern
6. Test pattern signature extraction: [h1, h2] → ['personal_best', 'improvement']
7. Test 5 consecutive sessions → verify no two consecutive sessions have identical patterns

**Manual Testing:**
- Play 2 sessions with identical qualifying highlights → verify second session shows different pattern
- Play session with only 1 highlight → verify no enforcement (highlight displayed as-is)
- Review 10 consecutive session patterns → verify diversity (no consecutive duplicates)

### Dependencies

**BLOCKS:** None (extends Story 14.1 selection logic)
**BLOCKED BY:** Story 14.1 (needs `selectHighlights()` base implementation)

### Implementation Notes

1. **Enforcement timing** - Call `enforceVariety()` AFTER initial priority selection but BEFORE display:
   ```javascript
   // game.js onDeath() sequence
   const candidateHighlights = selectHighlights(...);
   const lastPattern = await getLastSessionPattern();
   const finalHighlights = enforceVariety(candidateHighlights, lastPattern);
   await showHighlights(finalHighlights, ...);
   await saveSessionPattern(sessionId, getPatternSignature(finalHighlights));
   ```

2. **Alternative highlight creation** - When swapping lowest-priority highlight, create replacement using same algorithm as Story 14.1 but for the alternative priority type (e.g., if swapping out 'notable', find next-best 'growth' opportunity)

3. **Quality threshold** - Per acceptance criteria, "do not show low-quality highlights just for variety" → if no suitable alternative exists (e.g., no growth opportunities), keep original pattern (accept the repeat)

4. **Pattern comparison** - Use strict equality check (exact type order matters):
   - `['personal_best', 'improvement']` ≠ `['improvement', 'personal_best']` (different patterns, no enforcement)
   - `['personal_best', 'improvement']` === `['personal_best', 'improvement']` (exact match, enforce)

5. **Storage performance** - `getLastSessionPattern()` must query last session efficiently:
   ```javascript
   // Use IndexedDB timestamp index for fast retrieval
   const lastSession = await db.sessions
     .index('timestamp')
     .reverse()
     .limit(1)
     .get();
   return lastSession?.highlightPattern || null;
   ```

6. **Null handling** - If `lastPattern` is null or undefined (data corruption, first session, etc.) → skip enforcement gracefully

7. **Testing variety over time** - Create test that plays 10 consecutive sessions and verifies no consecutive duplicates (probabilistic test, may require seeded random data)
