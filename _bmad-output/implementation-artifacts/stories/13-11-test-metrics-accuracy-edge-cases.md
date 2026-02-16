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

- **`test/metrics.test.js`** - Comprehensive test suite covering all 6 metrics
- **`test/metrics-edge-cases.test.js`** - NEW file for edge case testing
- **`test/fixtures/metrics-test-data.js`** - NEW file with deterministic test sessions

### Test Structure

```javascript
// metrics.test.js - Organized by metric

describe('Reaction Time Metric', () => {
  test('calculates average from valid response times', () => { ... });
  test('excludes outliers > mean + 2*stdDev', () => { ... });
  test('excludes RC periods', () => { ... });
  test('excludes phone periods', () => { ... });
  test('returns null for < 3 valid events', () => { ... });
});

describe('Spatial Awareness Metric', () => {
  test('calculates from snake length and grid coverage', () => { ... });
  test('handles short snake (length 10)', () => { ... });
  test('handles long snake (length 100)', () => { ... });
});

// ... repeat for all 6 metrics
```

### Edge Case Test Coverage

**`metrics-edge-cases.test.js`:**
```javascript
describe('Edge Cases - All Metrics', () => {
  test('zero food eaten - all metrics default to 0 or null', () => {
    const record = metrics.endSession(0);
    expect(record.metrics.reactionTime).toBeNull();
    expect(record.metrics.spatialAwareness).toBe(0);
    expect(record.metrics.cognitiveFlexibility).toBeNull();
    expect(record.metrics.dividedAttention).toBeNull();
    expect(record.metrics.impulseControl).toBeNull();
    expect(record.metrics.workingMemory).toBeNull();
  });

  test('division by zero - normal period = 0 seconds', () => { ... });
  test('all nulls in rolling average', () => { ... });
  test('single session rolling average', () => { ... });
  test('1000+ events performance < 50ms', () => { ... });
  test('deterministic output - same input = same output', () => { ... });
});
```

### Test Fixtures

**`test/fixtures/metrics-test-data.js`:**
```javascript
// Deterministic test sessions for consistent testing

export const FAST_REACTIONS_SESSION = {
  rawEvents: [
    { type: 'food_eaten', responseTime: 200, duringRC: false, duringPhone: false },
    { type: 'food_eaten', responseTime: 220, duringRC: false, duringPhone: false },
    { type: 'food_eaten', responseTime: 210, duringRC: false, duringPhone: false }
  ],
  expectedReactionTime: 210  // Average
};

export const HIGH_COGNITIVE_FLEXIBILITY_SESSION = {
  rawEvents: [
    { type: 'rc_start', timestamp: 1000 },
    { type: 'food_eaten', timestamp: 1500, duringRC: true },   // 1 food in 2s
    { type: 'food_eaten', timestamp: 2000, duringRC: true },
    { type: 'food_eaten', timestamp: 2500, duringRC: true },
    { type: 'rc_end', timestamp: 3000 },
    { type: 'food_eaten', timestamp: 4000, duringRC: false },  // 2 food in 3s
    { type: 'food_eaten', timestamp: 5500, duringRC: false },
    { type: 'food_eaten', timestamp: 7000, duringRC: false }
  ],
  expectedCognitiveFlexibility: 2.25  // (3/2) / (2/3) = 2.25
};

// ... more fixture sessions for each metric
```

### Integration Points

- **Test runner:** Use existing test framework (likely Jest or similar)
- **Coverage target:** 95%+ code coverage for metrics.js
- **CI integration:** Tests run on every commit

### Test Strategy

**1. Unit Tests - Individual Metrics (Stories 13.2-13.7)**
- Test each metric calculation in isolation
- Use deterministic fixtures
- Verify formulas match specs exactly

**2. Unit Tests - Rolling Averages (Story 13.8)**
- Test weight normalization
- Test null handling
- Test < 10 sessions

**3. Edge Case Tests**
- Zero food eaten
- All nulls
- Division by zero scenarios
- Performance with large event counts

**4. Integration Tests**
- Full session lifecycle: startSession → events → endSession
- Verify all 6 metrics calculated
- Verify rawEvents preserved

**5. Performance Tests**
- 1000 events → endSession < 50ms (NFR47)
- Single event capture < 1ms (NFR48)

**6. Deterministic Tests**
- Same input → same output (±1% per NFR45)
- Run same test 10 times → verify identical results

### Dependencies

- **Stories 13.1-13.10** - All metric calculation logic must be implemented first
- **Test framework** - Existing test infrastructure

### Implementation Notes

1. **Fixtures over mocks** - Use real test data, not mocked functions
2. **Deterministic timestamps** - Use fixed timestamps in test data, not Date.now()
3. **Precision tolerance** - Allow ±1% variance for floating point calculations (NFR45)
4. **Test organization** - One describe block per metric for clarity
5. **Edge case file** - Separate file for cross-cutting edge cases
6. **Performance testing** - Use `performance.now()` to verify < 50ms calculations
7. **Coverage reporting** - Generate coverage report, aim for 95%+
8. **Snapshot testing** - Consider snapshots for session record structure
9. **Regression prevention** - Add test for any bug found in production
10. **CI gating** - All tests must pass before merge
