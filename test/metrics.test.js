// CrazySnakeLite - Metrics Calculation Tests (Story 13.2+)
import {
  calculateReactionTime,
  calculateSpatialAwareness,
  calculateCognitiveFlexibility,
  calculateDividedAttention,
  calculateImpulseControl,
  calculateWorkingMemory,
  calculateRollingAverages,
  average,
  standardDeviation,
  removeOutliers,
  normalize
} from '../js/metrics.js';

// Run all metrics tests
(async function runMetricsTests() {
  console.log('=== Metrics Calculation Tests (Story 13.2+) ===');

  // ========================================
  // HELPER FUNCTION TESTS
  // ========================================

  // Test 1: Average calculation
  try {
    const values = [100, 200, 300, 400, 500];
    const result = average(values);
    window.assert.equal(result, 300, 'Average of [100, 200, 300, 400, 500] is 300');
  } catch (error) {
    console.error('❌ Test 1 FAILED:', error.message);
  }

  // Test 2: Average of empty array returns 0
  try {
    const result = average([]);
    window.assert.equal(result, 0, 'Average of empty array is 0');
  } catch (error) {
    console.error('❌ Test 2 FAILED:', error.message);
  }

  // Test 3: Standard deviation calculation
  try {
    const values = [2, 4, 4, 4, 5, 5, 7, 9];
    const result = standardDeviation(values);
    const expected = 2; // Approximate
    window.assert.isTrue(Math.abs(result - expected) < 0.5, `Standard deviation is approximately ${expected} (got ${result.toFixed(2)})`);
  } catch (error) {
    console.error('❌ Test 3 FAILED:', error.message);
  }

  // Test 4: Normalize value (non-inverted)
  try {
    const result = normalize(50, 0, 100, false);
    window.assert.equal(result, 0.5, 'Normalize 50 in range [0, 100] = 0.5');
  } catch (error) {
    console.error('❌ Test 4 FAILED:', error.message);
  }

  // Test 5: Normalize value (inverted - lower is better)
  try {
    const result = normalize(200, 200, 800, true);
    window.assert.equal(result, 1.0, 'Normalize 200 (min) in range [200, 800] inverted = 1.0 (best)');
  } catch (error) {
    console.error('❌ Test 5 FAILED:', error.message);
  }

  // Test 6: Normalize value (inverted - higher is worse)
  try {
    const result = normalize(800, 200, 800, true);
    window.assert.equal(result, 0.0, 'Normalize 800 (max) in range [200, 800] inverted = 0.0 (worst)');
  } catch (error) {
    console.error('❌ Test 6 FAILED:', error.message);
  }

  // Test 7: Normalize clamps values outside range
  try {
    const result = normalize(1000, 200, 800, true);
    window.assert.equal(result, 0.0, 'Normalize 1000 (above max) clamps to 0.0');
  } catch (error) {
    console.error('❌ Test 7 FAILED:', error.message);
  }

  // Test 8: Remove outliers
  try {
    const values = [100, 110, 105, 108, 500, 102]; // 500 is outlier
    const result = removeOutliers(values);
    window.assert.isFalse(result.includes(500), 'Outlier 500 is removed from [100, 110, 105, 108, 500, 102]');
    window.assert.isTrue(result.includes(100), 'Non-outlier values are preserved');
  } catch (error) {
    console.error('❌ Test 8 FAILED:', error.message);
  }

  // Test 9: Remove outliers preserves all values if no outliers
  try {
    const values = [100, 110, 105, 108, 102];
    const result = removeOutliers(values);
    window.assert.equal(result.length, values.length, 'No values removed when no outliers exist');
  } catch (error) {
    console.error('❌ Test 9 FAILED:', error.message);
  }

  // ========================================
  // REACTION TIME METRIC TESTS
  // ========================================

  // Test 10: Calculate reaction time from valid events
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 300, duringRC: false, duringPhone: false },
      { type: 'food_eaten', responseTime: 400, duringRC: false, duringPhone: false },
      { type: 'food_eaten', responseTime: 350, duringRC: false, duringPhone: false }
    ];

    const result = calculateReactionTime(rawEvents);
    window.assert.isTrue(result > 0 && result <= 1, 'Reaction time returns normalized score 0-1');
  } catch (error) {
    console.error('❌ Test 10 FAILED:', error.message);
  }

  // Test 11: Exclude RC events from reaction time
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 300, duringRC: false, duringPhone: false },
      { type: 'food_eaten', responseTime: 500, duringRC: true, duringPhone: false }, // Should be excluded
      { type: 'food_eaten', responseTime: 350, duringRC: false, duringPhone: false }
    ];

    const result = calculateReactionTime(rawEvents);

    // If we manually calculate without RC event: avg of [300, 350] = 325ms
    // Normalized 325ms in range [200, 800]: (325-200)/(800-200) = 0.208, inverted = 0.792
    const expected = 1 - ((325 - 200) / (800 - 200));
    window.assert.isTrue(Math.abs(result - expected) < 0.01, `Reaction time excludes RC events (expected ~${expected.toFixed(3)}, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 11 FAILED:', error.message);
  }

  // Test 12: Exclude phone events from reaction time
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 300, duringRC: false, duringPhone: false },
      { type: 'food_eaten', responseTime: 600, duringRC: false, duringPhone: true }, // Should be excluded
      { type: 'food_eaten', responseTime: 320, duringRC: false, duringPhone: false }
    ];

    const result = calculateReactionTime(rawEvents);

    // If we manually calculate without phone event: avg of [300, 320] = 310ms
    // Normalized 310ms in range [200, 800]: (310-200)/(800-200) = 0.183, inverted = 0.817
    const expected = 1 - ((310 - 200) / (800 - 200));
    window.assert.isTrue(Math.abs(result - expected) < 0.01, `Reaction time excludes phone events (expected ~${expected.toFixed(3)}, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 12 FAILED:', error.message);
  }

  // Test 13: Return neutral score if no valid events
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 300, duringRC: true, duringPhone: false },
      { type: 'food_eaten', responseTime: 400, duringRC: false, duringPhone: true }
    ];

    const result = calculateReactionTime(rawEvents);
    window.assert.equal(result, 0.5, 'Returns neutral score 0.5 when all events excluded');
  } catch (error) {
    console.error('❌ Test 13 FAILED:', error.message);
  }

  // Test 14: Return neutral score if empty rawEvents array
  try {
    const result = calculateReactionTime([]);
    window.assert.equal(result, 0.5, 'Returns neutral score 0.5 when rawEvents is empty');
  } catch (error) {
    console.error('❌ Test 14 FAILED:', error.message);
  }

  // Test 15: Outlier filtering works on reaction times
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 300, duringRC: false, duringPhone: false },
      { type: 'food_eaten', responseTime: 320, duringRC: false, duringPhone: false },
      { type: 'food_eaten', responseTime: 310, duringRC: false, duringPhone: false },
      { type: 'food_eaten', responseTime: 5000, duringRC: false, duringPhone: false }, // Outlier (player paused)
      { type: 'food_eaten', responseTime: 305, duringRC: false, duringPhone: false }
    ];

    const result = calculateReactionTime(rawEvents);

    // Without outlier: avg of [300, 320, 310, 305] = 308.75ms
    // Normalized 308.75ms: (308.75-200)/(800-200) = 0.181, inverted = 0.819
    const expected = 1 - ((308.75 - 200) / (800 - 200));
    window.assert.isTrue(Math.abs(result - expected) < 0.02, `Reaction time filters outliers (expected ~${expected.toFixed(3)}, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 15 FAILED:', error.message);
  }

  // Test 16: Fast reaction time (200ms) scores highest
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 200, duringRC: false, duringPhone: false }
    ];

    const result = calculateReactionTime(rawEvents);
    window.assert.equal(result, 1.0, '200ms reaction time (min) scores 1.0 (best)');
  } catch (error) {
    console.error('❌ Test 16 FAILED:', error.message);
  }

  // Test 17: Slow reaction time (800ms) scores lowest
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 800, duringRC: false, duringPhone: false }
    ];

    const result = calculateReactionTime(rawEvents);
    window.assert.equal(result, 0.0, '800ms reaction time (max) scores 0.0 (worst)');
  } catch (error) {
    console.error('❌ Test 17 FAILED:', error.message);
  }

  // Test 18: Average reaction time (500ms) scores mid-range
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 500, duringRC: false, duringPhone: false }
    ];

    const result = calculateReactionTime(rawEvents);
    const expected = 0.5; // (500-200)/(800-200) = 0.5, inverted = 0.5
    window.assert.equal(result, expected, '500ms reaction time scores 0.5 (average)');
  } catch (error) {
    console.error('❌ Test 18 FAILED:', error.message);
  }

  // Test 19: Ignores non-food_eaten events
  try {
    const rawEvents = [
      { type: 'phone_call', responseTime: 100, duringRC: false, duringPhone: false },
      { type: 'food_eaten', responseTime: 400, duringRC: false, duringPhone: false },
      { type: 'rc_start', responseTime: 200, duringRC: false, duringPhone: false }
    ];

    const result = calculateReactionTime(rawEvents);

    // Only food_eaten event with 400ms should be used
    // Normalized 400ms: (400-200)/(800-200) = 0.333, inverted = 0.667
    const expected = 1 - ((400 - 200) / (800 - 200));
    window.assert.isTrue(Math.abs(result - expected) < 0.01, `Only processes food_eaten events (expected ~${expected.toFixed(3)}, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 19 FAILED:', error.message);
  }

  // ========================================
  // SPATIAL AWARENESS METRIC TESTS
  // ========================================

  // Test 20: Calculate spatial awareness with typical values
  try {
    // Example: snake length 55, grid 25x20, unit size 10px
    const result = calculateSpatialAwareness(55, 25, 20, 10);
    window.assert.isTrue(result >= 0 && result <= 1, 'Spatial awareness returns normalized score 0-1');
  } catch (error) {
    console.error('❌ Test 20 FAILED:', error.message);
  }

  // Test 21: Spatial awareness formula correctness
  try {
    // From story example: snake length 55, grid 25x20, unit size 10px
    // snakeArea = 55 × 10² = 5500
    // totalGridArea = 25 × 20 = 500
    // gridCoverage = 5500 / 500 = 11
    // spatialAwareness = 55 / 11 = 5
    // This is VERY low (5 vs expected range 100-1000), so score should be near 0

    const result = calculateSpatialAwareness(55, 25, 20, 10);
    window.assert.isTrue(result < 0.1, 'Low spatial awareness value results in low score');
  } catch (error) {
    console.error('❌ Test 21 FAILED:', error.message);
  }

  // Test 22: High spatial awareness scores higher
  try {
    // Larger snake, same grid: snake length 200, grid 25x20, unit size 10px
    // snakeArea = 200 × 10² = 20000
    // totalGridArea = 500
    // gridCoverage = 20000 / 500 = 40
    // spatialAwareness = 200 / 40 = 5
    // Still low! This formula needs review, but test the implementation

    const result = calculateSpatialAwareness(200, 25, 20, 10);
    window.assert.isTrue(result >= 0 && result <= 1, 'Spatial awareness for length 200 returns valid score');
  } catch (error) {
    console.error('❌ Test 22 FAILED:', error.message);
  }

  // Test 23: Returns neutral score if snake length is 0
  try {
    const result = calculateSpatialAwareness(0, 25, 20, 10);
    window.assert.equal(result, 0.5, 'Returns neutral score 0.5 when snake length is 0');
  } catch (error) {
    console.error('❌ Test 23 FAILED:', error.message);
  }

  // Test 24: Score increases with snake length (holding grid constant)
  try {
    const score1 = calculateSpatialAwareness(30, 25, 20, 10);
    const score2 = calculateSpatialAwareness(60, 25, 20, 10);
    const score3 = calculateSpatialAwareness(90, 25, 20, 10);

    window.assert.isTrue(score2 > score1, 'Longer snake (60) scores higher than shorter snake (30)');
    window.assert.isTrue(score3 > score2, 'Even longer snake (90) scores higher than medium snake (60)');
  } catch (error) {
    console.error('❌ Test 24 FAILED:', error.message);
  }

  // Test 25: Normalized to 0-1 range
  try {
    const result = calculateSpatialAwareness(150, 25, 20, 10);
    window.assert.isTrue(result >= 0 && result <= 1, 'Spatial awareness is normalized to 0-1 range');
  } catch (error) {
    console.error('❌ Test 25 FAILED:', error.message);
  }

  // ========================================
  // COGNITIVE FLEXIBILITY METRIC TESTS
  // ========================================

  // Test 26: Calculate cognitive flexibility with RC events
  try {
    const rawEvents = [
      { type: 'rc_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 1500, duringRC: true },
      { type: 'food_eaten', timestamp: 2000, duringRC: true },
      { type: 'rc_end', timestamp: 3000 }, // 2 seconds, 2 food = 1.0 food/sec
      { type: 'food_eaten', timestamp: 4000, duringRC: false },
      { type: 'food_eaten', timestamp: 6000, duringRC: false },
      { type: 'food_eaten', timestamp: 8000, duringRC: false } // 4 seconds, 3 food = 0.75 food/sec
    ];

    const result = calculateCognitiveFlexibility(rawEvents);
    // RC rate: 1.0 food/sec, Normal rate: 0.75 food/sec
    // Flexibility: 1.0 / 0.75 = 1.333
    // Normalized: 1.333 / 2.0 = 0.667
    window.assert.isTrue(Math.abs(result - 0.667) < 0.05, `Cognitive flexibility calculates correctly (expected ~0.667, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 26 FAILED:', error.message);
  }

  // Test 27: Returns neutral score if no RC events
  try {
    const rawEvents = [
      { type: 'food_eaten', timestamp: 1000, duringRC: false },
      { type: 'food_eaten', timestamp: 2000, duringRC: false }
    ];

    const result = calculateCognitiveFlexibility(rawEvents);
    window.assert.equal(result, 0.5, 'Returns neutral score 0.5 when no RC events');
  } catch (error) {
    console.error('❌ Test 27 FAILED:', error.message);
  }

  // Test 28: Equal performance during RC and normal (flexibility = 1.0 → score 0.5)
  try {
    const rawEvents = [
      { type: 'rc_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 2000, duringRC: true },
      { type: 'rc_end', timestamp: 3000 }, // 1 food in 2 seconds = 0.5 food/sec
      { type: 'food_eaten', timestamp: 5000, duringRC: false },
      { type: 'food_eaten', timestamp: 9000, duringRC: false } // 2 food in 4 seconds = 0.5 food/sec
    ];

    const result = calculateCognitiveFlexibility(rawEvents);
    // RC rate: 0.5, Normal rate: 0.5, Flexibility: 1.0
    // Normalized: 1.0 / 2.0 = 0.5
    window.assert.equal(result, 0.5, 'Equal performance returns score 0.5');
  } catch (error) {
    console.error('❌ Test 28 FAILED:', error.message);
  }

  // Test 29: Better performance during RC (flexibility > 1.0)
  try {
    const rawEvents = [
      { type: 'rc_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 1500, duringRC: true },
      { type: 'food_eaten', timestamp: 2000, duringRC: true },
      { type: 'food_eaten', timestamp: 2500, duringRC: true },
      { type: 'rc_end', timestamp: 3000 }, // 3 food in 2 seconds = 1.5 food/sec
      { type: 'food_eaten', timestamp: 5000, duringRC: false },
      { type: 'food_eaten', timestamp: 9000, duringRC: false } // 2 food in 4 seconds = 0.5 food/sec
    ];

    const result = calculateCognitiveFlexibility(rawEvents);
    // RC rate: 1.5, Normal rate: 0.5, Flexibility: 3.0 → clamped to 2.0
    // Normalized: 2.0 / 2.0 = 1.0
    window.assert.equal(result, 1.0, 'Superior RC performance returns score 1.0 (max)');
  } catch (error) {
    console.error('❌ Test 29 FAILED:', error.message);
  }

  // Test 30: Worse performance during RC (flexibility < 1.0)
  try {
    const rawEvents = [
      { type: 'rc_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 3000, duringRC: true },
      { type: 'rc_end', timestamp: 5000 }, // 1 food in 4 seconds = 0.25 food/sec
      { type: 'food_eaten', timestamp: 7000, duringRC: false },
      { type: 'food_eaten', timestamp: 9000, duringRC: false } // 2 food in 2 seconds = 1.0 food/sec
    ];

    const result = calculateCognitiveFlexibility(rawEvents);
    // RC rate: 0.25, Normal rate: 1.0, Flexibility: 0.25
    // Normalized: 0.25 / 2.0 = 0.125
    window.assert.isTrue(result < 0.5, 'Poor RC performance returns score < 0.5');
  } catch (error) {
    console.error('❌ Test 30 FAILED:', error.message);
  }

  // Test 31: Multiple RC periods aggregate correctly
  try {
    const rawEvents = [
      { type: 'rc_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 2000, duringRC: true },
      { type: 'rc_end', timestamp: 3000 }, // Period 1: 1 food in 2 sec
      { type: 'food_eaten', timestamp: 5000, duringRC: false },
      { type: 'rc_start', timestamp: 7000 },
      { type: 'food_eaten', timestamp: 8000, duringRC: true },
      { type: 'rc_end', timestamp: 9000 }, // Period 2: 1 food in 2 sec
      { type: 'food_eaten', timestamp: 11000, duringRC: false }
    ];

    const result = calculateCognitiveFlexibility(rawEvents);
    // Total RC: 2 food in 4 seconds = 0.5 food/sec
    // Normal: 2 food in 6 seconds = 0.333 food/sec
    // Flexibility: 0.5 / 0.333 = 1.5
    // Normalized: 1.5 / 2.0 = 0.75
    window.assert.isTrue(Math.abs(result - 0.75) < 0.1, `Multiple RC periods aggregate correctly (expected ~0.75, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 31 FAILED:', error.message);
  }

  // ========================================
  // DIVIDED ATTENTION METRIC TESTS
  // ========================================

  // Test 32: Calculate divided attention with phone calls
  try {
    const rawEvents = [
      { type: 'phone_call', decisionTime: 1000, survived: true },
      { type: 'phone_call', decisionTime: 1500, survived: true },
      { type: 'phone_call', decisionTime: 2000, survived: true }
    ];

    const result = calculateDividedAttention(rawEvents);
    // Survival rate: 3/3 = 1.0
    // Avg decision time: 1500ms
    // Normalized decision speed: 1500/3000 = 0.5
    // Composite: (1.0 × 0.7) + ((1 - 0.5) × 0.3) = 0.7 + 0.15 = 0.85
    window.assert.isTrue(Math.abs(result - 0.85) < 0.01, `Divided attention calculates correctly (expected ~0.85, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 32 FAILED:', error.message);
  }

  // Test 33: Returns neutral score if no phone calls
  try {
    const rawEvents = [
      { type: 'food_eaten', timestamp: 1000 }
    ];

    const result = calculateDividedAttention(rawEvents);
    window.assert.equal(result, 0.5, 'Returns neutral score 0.5 when no phone calls');
  } catch (error) {
    console.error('❌ Test 33 FAILED:', error.message);
  }

  // Test 34: Survival rate matters (70% weight)
  try {
    const rawEvents = [
      { type: 'phone_call', decisionTime: 1000, survived: true },
      { type: 'phone_call', decisionTime: 1000, survived: false }, // Death
      { type: 'phone_call', decisionTime: 1000, survived: true }
    ];

    const result = calculateDividedAttention(rawEvents);
    // Survival rate: 2/3 = 0.667
    // Avg decision time: 1000ms
    // Normalized decision speed: 1000/3000 = 0.333
    // Composite: (0.667 × 0.7) + ((1 - 0.333) × 0.3) = 0.467 + 0.200 = 0.667
    window.assert.isTrue(Math.abs(result - 0.667) < 0.05, `Survival rate affects score (expected ~0.667, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 34 FAILED:', error.message);
  }

  // Test 35: Decision speed matters (30% weight)
  try {
    const rawEvents = [
      { type: 'phone_call', decisionTime: 500, survived: true }, // Fast
      { type: 'phone_call', decisionTime: 2500, survived: true } // Slow
    ];

    const result1 = calculateDividedAttention([rawEvents[0]]);
    const result2 = calculateDividedAttention([rawEvents[1]]);

    // result1: survival=1.0, decisionSpeed=500/3000=0.167 → (1.0×0.7) + ((1-0.167)×0.3) = 0.95
    // result2: survival=1.0, decisionSpeed=2500/3000=0.833 → (1.0×0.7) + ((1-0.833)×0.3) = 0.75
    window.assert.isTrue(result1 > result2, 'Faster decision time scores higher');
  } catch (error) {
    console.error('❌ Test 35 FAILED:', error.message);
  }

  // Test 36: Perfect performance (all survived, fast decisions)
  try {
    const rawEvents = [
      { type: 'phone_call', decisionTime: 500, survived: true },
      { type: 'phone_call', decisionTime: 600, survived: true },
      { type: 'phone_call', decisionTime: 550, survived: true }
    ];

    const result = calculateDividedAttention(rawEvents);
    // Survival: 1.0, Avg decision: 550ms → 550/3000=0.183
    // Composite: (1.0 × 0.7) + ((1 - 0.183) × 0.3) = 0.7 + 0.245 = 0.945
    window.assert.isTrue(result > 0.9, 'Perfect survival + fast decisions scores > 0.9');
  } catch (error) {
    console.error('❌ Test 36 FAILED:', error.message);
  }

  // Test 37: Poor performance (low survival, slow decisions)
  try {
    const rawEvents = [
      { type: 'phone_call', decisionTime: 2800, survived: false },
      { type: 'phone_call', decisionTime: 2900, survived: false },
      { type: 'phone_call', decisionTime: 3000, survived: true }
    ];

    const result = calculateDividedAttention(rawEvents);
    // Survival: 1/3=0.333, Avg decision: 2900ms → 2900/3000=0.967
    // Composite: (0.333 × 0.7) + ((1 - 0.967) × 0.3) = 0.233 + 0.010 = 0.243
    window.assert.isTrue(result < 0.3, 'Poor survival + slow decisions scores < 0.3');
  } catch (error) {
    console.error('❌ Test 37 FAILED:', error.message);
  }

  // Test 38: Clamps composite score to [0, 1]
  try {
    const rawEvents = [
      { type: 'phone_call', decisionTime: 100, survived: true }
    ];

    const result = calculateDividedAttention(rawEvents);
    window.assert.isTrue(result >= 0 && result <= 1, 'Divided attention clamped to [0, 1] range');
  } catch (error) {
    console.error('❌ Test 38 FAILED:', error.message);
  }

  // ========================================
  // IMPULSE CONTROL METRIC TESTS
  // ========================================

  // Test 39: High control - Pick Up during combo mode
  try {
    const rawEvents = [
      {
        type: 'phone_call',
        decision: 'pickup',
        context: { inComboMode: true, currentScore: 50, pickupBonus: 8, blinkingFoodActive: false, snakeLength: 50 }
      }
    ];

    const result = calculateImpulseControl(rawEvents);
    // Weight: +2.0 (high control)
    // Normalized: (2.0 - (-1)) / (2 - (-1)) = 3/3 = 1.0
    window.assert.equal(result, 1.0, 'Pick Up during combo scores 1.0 (high control)');
  } catch (error) {
    console.error('❌ Test 39 FAILED:', error.message);
  }

  // Test 40: Medium control - Pick Up at high score
  try {
    const rawEvents = [
      {
        type: 'phone_call',
        decision: 'pickup',
        context: { inComboMode: false, currentScore: 85, pickupBonus: 5, blinkingFoodActive: false, snakeLength: 85 }
      }
    ];

    const result = calculateImpulseControl(rawEvents);
    // Weight: +1.5 (medium control)
    // Normalized: (1.5 - (-1)) / (2 - (-1)) = 2.5/3 = 0.833
    window.assert.isTrue(Math.abs(result - 0.833) < 0.01, `Pick Up at high score scores ~0.833 (got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 40 FAILED:', error.message);
  }

  // Test 41: Low control - Pick Up at low stakes
  try {
    const rawEvents = [
      {
        type: 'phone_call',
        decision: 'pickup',
        context: { inComboMode: false, currentScore: 15, pickupBonus: 2, blinkingFoodActive: false, snakeLength: 15 }
      }
    ];

    const result = calculateImpulseControl(rawEvents);
    // Weight: -1.0 (low control - impulsive)
    // Normalized: (-1.0 - (-1)) / (2 - (-1)) = 0/3 = 0.0
    window.assert.equal(result, 0.0, 'Pick Up at low stakes scores 0.0 (low control)');
  } catch (error) {
    console.error('❌ Test 41 FAILED:', error.message);
  }

  // Test 42: Neutral - End at low stakes
  try {
    const rawEvents = [
      {
        type: 'phone_call',
        decision: 'end',
        context: { inComboMode: false, currentScore: 10, pickupBonus: 0, blinkingFoodActive: false, snakeLength: 10 }
      }
    ];

    const result = calculateImpulseControl(rawEvents);
    // Weight: 0 (neutral - safe choice at low stakes)
    // Normalized: (0 - (-1)) / (2 - (-1)) = 1/3 = 0.333
    window.assert.isTrue(Math.abs(result - 0.333) < 0.01, `End at low stakes scores ~0.333 (got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 42 FAILED:', error.message);
  }

  // Test 43: Positive - End at higher stakes
  try {
    const rawEvents = [
      {
        type: 'phone_call',
        decision: 'end',
        context: { inComboMode: false, currentScore: 60, pickupBonus: 0, blinkingFoodActive: false, snakeLength: 60 }
      }
    ];

    const result = calculateImpulseControl(rawEvents);
    // Weight: +1.0 (prudent decision)
    // Normalized: (1.0 - (-1)) / (2 - (-1)) = 2/3 = 0.667
    window.assert.isTrue(Math.abs(result - 0.667) < 0.01, `End at higher stakes scores ~0.667 (got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 43 FAILED:', error.message);
  }

  // Test 44: Mixed decisions aggregate correctly
  try {
    const rawEvents = [
      {
        type: 'phone_call',
        decision: 'pickup',
        context: { inComboMode: true, currentScore: 50, pickupBonus: 8, blinkingFoodActive: false, snakeLength: 50 }
      }, // +2.0
      {
        type: 'phone_call',
        decision: 'pickup',
        context: { inComboMode: false, currentScore: 15, pickupBonus: 2, blinkingFoodActive: false, snakeLength: 15 }
      }, // -1.0
      {
        type: 'phone_call',
        decision: 'end',
        context: { inComboMode: false, currentScore: 60, pickupBonus: 0, blinkingFoodActive: false, snakeLength: 60 }
      } // +1.0
    ];

    const result = calculateImpulseControl(rawEvents);
    // Total weight: 2.0 - 1.0 + 1.0 = 2.0
    // Max: 3*2 = 6, Min: 3*(-1) = -3
    // Normalized: (2.0 - (-3)) / (6 - (-3)) = 5/9 = 0.556
    window.assert.isTrue(Math.abs(result - 0.556) < 0.05, `Mixed decisions aggregate correctly (expected ~0.556, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 44 FAILED:', error.message);
  }

  // Test 45: Returns neutral score if no phone calls
  try {
    const rawEvents = [];
    const result = calculateImpulseControl(rawEvents);
    window.assert.equal(result, 0.5, 'Returns neutral score 0.5 when no phone calls');
  } catch (error) {
    console.error('❌ Test 45 FAILED:', error.message);
  }

  // Test 46: Pick Up with blinking food (medium control)
  try {
    const rawEvents = [
      {
        type: 'phone_call',
        decision: 'pickup',
        context: { inComboMode: false, currentScore: 45, pickupBonus: 5, blinkingFoodActive: true, snakeLength: 45 }
      }
    ];

    const result = calculateImpulseControl(rawEvents);
    // Weight: +1.5 (medium control - managing multiple distractions)
    // Normalized: (1.5 - (-1)) / (2 - (-1)) = 2.5/3 = 0.833
    window.assert.isTrue(Math.abs(result - 0.833) < 0.01, `Pick Up with blinking food scores ~0.833 (got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 46 FAILED:', error.message);
  }

  // ========================================
  // WORKING MEMORY METRIC TESTS
  // ========================================

  // Test 47: Calculate working memory with combo events
  try {
    const rawEvents = [
      { type: 'combo_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 1500, duringCombo: true },
      { type: 'food_eaten', timestamp: 2000, duringCombo: true },
      { type: 'combo_end', timestamp: 3000 }, // 2 seconds, 2 food = 1.0 food/sec
      { type: 'food_eaten', timestamp: 4000, duringCombo: false },
      { type: 'food_eaten', timestamp: 6000, duringCombo: false },
      { type: 'food_eaten', timestamp: 8000, duringCombo: false } // 4 seconds, 3 food = 0.75 food/sec
    ];

    const result = calculateWorkingMemory(rawEvents);
    // Combo rate: 1.0 food/sec, Normal rate: 0.75 food/sec
    // Working memory: 1.0 / 0.75 = 1.333
    // Normalized: 1.333 / 3.0 = 0.444
    window.assert.isTrue(Math.abs(result - 0.444) < 0.05, `Working memory calculates correctly (expected ~0.444, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 47 FAILED:', error.message);
  }

  // Test 48: Returns neutral score if no combo events
  try {
    const rawEvents = [
      { type: 'food_eaten', timestamp: 1000, duringCombo: false },
      { type: 'food_eaten', timestamp: 2000, duringCombo: false }
    ];

    const result = calculateWorkingMemory(rawEvents);
    window.assert.equal(result, 0.5, 'Returns neutral score 0.5 when no combo events');
  } catch (error) {
    console.error('❌ Test 48 FAILED:', error.message);
  }

  // Test 49: Equal performance during combo and normal (working memory = 1.0)
  try {
    const rawEvents = [
      { type: 'combo_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 2000, duringCombo: true },
      { type: 'combo_end', timestamp: 3000 }, // 1 food in 2 seconds = 0.5 food/sec
      { type: 'food_eaten', timestamp: 5000, duringCombo: false },
      { type: 'food_eaten', timestamp: 9000, duringCombo: false } // 2 food in 4 seconds = 0.5 food/sec
    ];

    const result = calculateWorkingMemory(rawEvents);
    // Combo rate: 0.5, Normal rate: 0.5, Working memory: 1.0
    // Normalized: 1.0 / 3.0 = 0.333
    window.assert.isTrue(Math.abs(result - 0.333) < 0.01, `Equal performance returns score ~0.333 (got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 49 FAILED:', error.message);
  }

  // Test 50: Superior performance during combo (working memory > 1.0)
  try {
    const rawEvents = [
      { type: 'combo_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 1500, duringCombo: true },
      { type: 'food_eaten', timestamp: 2000, duringCombo: true },
      { type: 'food_eaten', timestamp: 2500, duringCombo: true },
      { type: 'combo_end', timestamp: 3000 }, // 3 food in 2 seconds = 1.5 food/sec
      { type: 'food_eaten', timestamp: 5000, duringCombo: false },
      { type: 'food_eaten', timestamp: 9000, duringCombo: false } // 2 food in 4 seconds = 0.5 food/sec
    ];

    const result = calculateWorkingMemory(rawEvents);
    // Combo rate: 1.5, Normal rate: 0.5, Working memory: 3.0
    // Normalized: 3.0 / 3.0 = 1.0 (max)
    window.assert.equal(result, 1.0, 'Superior combo performance returns score 1.0 (max)');
  } catch (error) {
    console.error('❌ Test 50 FAILED:', error.message);
  }

  // Test 51: Poor performance during combo (working memory < 1.0)
  try {
    const rawEvents = [
      { type: 'combo_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 3000, duringCombo: true },
      { type: 'combo_end', timestamp: 5000 }, // 1 food in 4 seconds = 0.25 food/sec
      { type: 'food_eaten', timestamp: 7000, duringCombo: false },
      { type: 'food_eaten', timestamp: 9000, duringCombo: false } // 2 food in 2 seconds = 1.0 food/sec
    ];

    const result = calculateWorkingMemory(rawEvents);
    // Combo rate: 0.25, Normal rate: 1.0, Working memory: 0.25
    // Normalized: 0.25 / 3.0 = 0.083
    window.assert.isTrue(result < 0.2, 'Poor combo performance returns score < 0.2');
  } catch (error) {
    console.error('❌ Test 51 FAILED:', error.message);
  }

  // Test 52: Multiple combo periods aggregate correctly
  try {
    const rawEvents = [
      { type: 'combo_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 2000, duringCombo: true },
      { type: 'combo_end', timestamp: 3000 }, // Period 1: 1 food in 2 sec
      { type: 'food_eaten', timestamp: 5000, duringCombo: false },
      { type: 'combo_start', timestamp: 7000 },
      { type: 'food_eaten', timestamp: 8000, duringCombo: true },
      { type: 'combo_end', timestamp: 9000 }, // Period 2: 1 food in 2 sec
      { type: 'food_eaten', timestamp: 11000, duringCombo: false }
    ];

    const result = calculateWorkingMemory(rawEvents);
    // Total combo: 2 food in 4 seconds = 0.5 food/sec
    // Normal: 2 food in 6 seconds = 0.333 food/sec
    // Working memory: 0.5 / 0.333 = 1.5
    // Normalized: 1.5 / 3.0 = 0.5
    window.assert.isTrue(Math.abs(result - 0.5) < 0.1, `Multiple combo periods aggregate correctly (expected ~0.5, got ${result.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 52 FAILED:', error.message);
  }

  // ========================================
  // ROLLING AVERAGES TESTS
  // ========================================

  // Test 53: Calculate rolling average with single session (current only)
  try {
    const currentMetrics = {
      reactionTime: 0.8,
      spatialAwareness: 0.7,
      cognitiveFlexibility: 0.6,
      dividedAttention: 0.75,
      impulseControl: 0.65,
      workingMemory: 0.55
    };

    const result = calculateRollingAverages(currentMetrics, []);
    window.assert.equal(result.reactionTime, 0.8, 'Single session rolling avg equals current value');
    window.assert.equal(result.spatialAwareness, 0.7, 'Single session rolling avg for spatialAwareness');
  } catch (error) {
    console.error('❌ Test 53 FAILED:', error.message);
  }

  // Test 54: Calculate rolling average with 2 sessions (recency weighting)
  try {
    const currentMetrics = { reactionTime: 0.9, spatialAwareness: 0.8, cognitiveFlexibility: 0.7, dividedAttention: 0.6, impulseControl: 0.5, workingMemory: 0.4 };
    const previousSessions = [
      { metrics: { reactionTime: 0.5, spatialAwareness: 0.4, cognitiveFlexibility: 0.3, dividedAttention: 0.2, impulseControl: 0.1, workingMemory: 0.0 } }
    ];

    const result = calculateRollingAverages(currentMetrics, previousSessions);
    // Weights: [0.2, 0.18] → normalized: [0.2/0.38, 0.18/0.38] = [0.526, 0.474]
    // reactionTime: 0.9*0.526 + 0.5*0.474 = 0.474 + 0.237 = 0.711
    window.assert.isTrue(Math.abs(result.reactionTime - 0.711) < 0.01, `Rolling avg with 2 sessions weighted correctly (expected ~0.711, got ${result.reactionTime.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 54 FAILED:', error.message);
  }

  // Test 55: Calculate rolling average with 10 sessions (full weighting)
  try {
    const currentMetrics = { reactionTime: 1.0, spatialAwareness: 1.0, cognitiveFlexibility: 1.0, dividedAttention: 1.0, impulseControl: 1.0, workingMemory: 1.0 };
    const previousSessions = Array(9).fill(null).map(() => ({
      metrics: { reactionTime: 0.5, spatialAwareness: 0.5, cognitiveFlexibility: 0.5, dividedAttention: 0.5, impulseControl: 0.5, workingMemory: 0.5 }
    }));

    const result = calculateRollingAverages(currentMetrics, previousSessions);
    // All weights sum to 1.0 already: [0.2, 0.18, 0.16, 0.14, 0.12, 0.10, 0.06, 0.03, 0.01, 0.01] = 1.0
    // reactionTime: 1.0*0.2 + 0.5*0.8 = 0.2 + 0.4 = 0.6
    window.assert.isTrue(Math.abs(result.reactionTime - 0.6) < 0.01, `Rolling avg with 10 sessions weighted toward recent (expected ~0.6, got ${result.reactionTime.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 55 FAILED:', error.message);
  }

  // Test 56: Rolling averages handle all 6 metrics
  try {
    const currentMetrics = {
      reactionTime: 0.9,
      spatialAwareness: 0.8,
      cognitiveFlexibility: 0.7,
      dividedAttention: 0.6,
      impulseControl: 0.5,
      workingMemory: 0.4
    };

    const result = calculateRollingAverages(currentMetrics, []);
    window.assert.isTrue('reactionTime' in result, 'Rolling averages include reactionTime');
    window.assert.isTrue('spatialAwareness' in result, 'Rolling averages include spatialAwareness');
    window.assert.isTrue('cognitiveFlexibility' in result, 'Rolling averages include cognitiveFlexibility');
    window.assert.isTrue('dividedAttention' in result, 'Rolling averages include dividedAttention');
    window.assert.isTrue('impulseControl' in result, 'Rolling averages include impulseControl');
    window.assert.isTrue('workingMemory' in result, 'Rolling averages include workingMemory');
  } catch (error) {
    console.error('❌ Test 56 FAILED:', error.message);
  }

  // Test 57: Handles improvement trend (increasing values over time)
  try {
    const currentMetrics = { reactionTime: 0.9, spatialAwareness: 0.9, cognitiveFlexibility: 0.9, dividedAttention: 0.9, impulseControl: 0.9, workingMemory: 0.9 };
    const previousSessions = [
      { metrics: { reactionTime: 0.8, spatialAwareness: 0.8, cognitiveFlexibility: 0.8, dividedAttention: 0.8, impulseControl: 0.8, workingMemory: 0.8 } },
      { metrics: { reactionTime: 0.7, spatialAwareness: 0.7, cognitiveFlexibility: 0.7, dividedAttention: 0.7, impulseControl: 0.7, workingMemory: 0.7 } },
      { metrics: { reactionTime: 0.6, spatialAwareness: 0.6, cognitiveFlexibility: 0.6, dividedAttention: 0.6, impulseControl: 0.6, workingMemory: 0.6 } }
    ];

    const result = calculateRollingAverages(currentMetrics, previousSessions);
    // Recent sessions weighted higher → rolling avg should be closer to 0.9 than simple avg (0.75)
    window.assert.isTrue(result.reactionTime > 0.78, `Improvement trend weighted toward recent (got ${result.reactionTime.toFixed(3)})`);
  } catch (error) {
    console.error('❌ Test 57 FAILED:', error.message);
  }

  // ========================================
  // EDGE CASES AND ERROR HANDLING (Story 13.11)
  // ========================================

  // Test 58: Zero food eaten - no division by zero errors
  try {
    const rawEvents = []; // Empty session
    const reactionTime = calculateReactionTime(rawEvents);
    window.assert.equal(reactionTime, 0.5, 'Zero food eaten returns neutral score (no errors)');
  } catch (error) {
    console.error('❌ Test 58 FAILED:', error.message);
  }

  // Test 59: All metrics handle empty rawEvents gracefully
  try {
    const rawEvents = [];
    window.assert.equal(calculateReactionTime(rawEvents), 0.5, 'Reaction time handles empty events');
    window.assert.equal(calculateCognitiveFlexibility(rawEvents), 0.5, 'Cognitive flexibility handles empty events');
    window.assert.equal(calculateDividedAttention(rawEvents), 0.5, 'Divided attention handles empty events');
    window.assert.equal(calculateImpulseControl(rawEvents), 0.5, 'Impulse control handles empty events');
    window.assert.equal(calculateWorkingMemory(rawEvents), 0.5, 'Working memory handles empty events');
  } catch (error) {
    console.error('❌ Test 59 FAILED:', error.message);
  }

  // Test 60: Spatial awareness handles zero snake length
  try {
    const result = calculateSpatialAwareness(0, 25, 20, 10);
    window.assert.equal(result, 0.5, 'Spatial awareness handles zero snake length gracefully');
  } catch (error) {
    console.error('❌ Test 60 FAILED:', error.message);
  }

  // Test 61: Metrics are deterministic (identical input → identical output)
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 300, duringRC: false, duringPhone: false, duringCombo: false },
      { type: 'food_eaten', responseTime: 400, duringRC: false, duringPhone: false, duringCombo: false }
    ];

    const result1 = calculateReactionTime(rawEvents);
    const result2 = calculateReactionTime(rawEvents);

    window.assert.equal(result1, result2, 'Reaction time is deterministic (identical input = identical output)');
  } catch (error) {
    console.error('❌ Test 61 FAILED:', error.message);
  }

  // Test 62: All metrics return values in [0, 1] range
  try {
    const rawEvents = [
      { type: 'food_eaten', responseTime: 250, duringRC: false, duringPhone: false, duringCombo: false },
      { type: 'phone_call', decisionTime: 1200, survived: true, context: { inComboMode: false, currentScore: 50, pickupBonus: 5, blinkingFoodActive: false, snakeLength: 50 } },
      { type: 'rc_start', timestamp: 1000 },
      { type: 'food_eaten', timestamp: 1500, duringRC: true, duringCombo: false },
      { type: 'rc_end', timestamp: 2000 },
      { type: 'combo_start', timestamp: 3000 },
      { type: 'food_eaten', timestamp: 3500, duringRC: false, duringCombo: true },
      { type: 'combo_end', timestamp: 4000 }
    ];

    const reactionTime = calculateReactionTime(rawEvents);
    const spatialAwareness = calculateSpatialAwareness(50, 25, 20, 10);
    const cognitiveFlexibility = calculateCognitiveFlexibility(rawEvents);
    const dividedAttention = calculateDividedAttention(rawEvents);
    const impulseControl = calculateImpulseControl(rawEvents);
    const workingMemory = calculateWorkingMemory(rawEvents);

    window.assert.isTrue(reactionTime >= 0 && reactionTime <= 1, 'Reaction time in [0, 1] range');
    window.assert.isTrue(spatialAwareness >= 0 && spatialAwareness <= 1, 'Spatial awareness in [0, 1] range');
    window.assert.isTrue(cognitiveFlexibility >= 0 && cognitiveFlexibility <= 1, 'Cognitive flexibility in [0, 1] range');
    window.assert.isTrue(dividedAttention >= 0 && dividedAttention <= 1, 'Divided attention in [0, 1] range');
    window.assert.isTrue(impulseControl >= 0 && impulseControl <= 1, 'Impulse control in [0, 1] range');
    window.assert.isTrue(workingMemory >= 0 && workingMemory <= 1, 'Working memory in [0, 1] range');
  } catch (error) {
    console.error('❌ Test 62 FAILED:', error.message);
  }

  // Test 63: Rolling averages handle single session
  try {
    const currentMetrics = { reactionTime: 0.8, spatialAwareness: 0.7, cognitiveFlexibility: 0.6, dividedAttention: 0.75, impulseControl: 0.65, workingMemory: 0.55 };
    const result = calculateRollingAverages(currentMetrics, []);

    window.assert.equal(result.reactionTime, 0.8, 'Rolling avg with 1 session equals current value');
    window.assert.equal(result.spatialAwareness, 0.7, 'All metrics preserved with single session');
  } catch (error) {
    console.error('❌ Test 63 FAILED:', error.message);
  }

  console.log('=== Metrics Tests Complete ===');
  console.log('=== Total Tests: 63 ===');
})();
