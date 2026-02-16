// CrazySnakeLite - Progression System Unit Tests
// Story 19.1: Test 8-field progression system with visual thresholds

import * as progression from '../js/progression.js';

// Test Results Tracker
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, fn) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    console.error(`❌ FAIL: ${name}`);
    console.error(`   ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\n   Expected: ${expected}\n   Actual: ${actual}`);
  }
}

function assertDefined(value, message) {
  if (value === undefined || value === null) {
    throw new Error(`${message}\n   Value is ${value}`);
  }
}

function assertObjectHasKeys(obj, keys, message) {
  for (const key of keys) {
    if (!(key in obj)) {
      throw new Error(`${message}\n   Missing key: ${key}`);
    }
  }
}

// ============================================================================
// Test Suite: getState() at key scores
// ============================================================================

test('getState() at score 0 returns tier 1 values for all 8 fields', () => {
  const state = progression.getState(0);

  assertDefined(state, 'getState should return an object');
  assertObjectHasKeys(state, [
    'speed', 'phoneFrequency', 'effectChance',
    'glowIntensity', 'gridOpacity', 'backgroundColor', 'gridLineColor', 'gridDotOpacity'
  ], 'getState should return object with all 8 fields');

  // Verify tier 1 visual values (score 0-14)
  assertEqual(state.glowIntensity, 3, 'Score 0: glowIntensity should be 3 (tier 1)');
  assertEqual(state.backgroundColor, '#E8E8E8', 'Score 0: backgroundColor should be #E8E8E8 (tier 1)');
  assertEqual(state.gridLineColor, '#A0A0A0', 'Score 0: gridLineColor should be #A0A0A0 (tier 1)');
  assertEqual(state.gridOpacity, 1.0, 'Score 0: gridOpacity should be 1.0 (tier 1)');
  assertEqual(state.gridDotOpacity, 0, 'Score 0: gridDotOpacity should be 0 (tier 1)');
});

test('getState() at score 50 returns tier 2/3 transition values', () => {
  const state = progression.getState(50);

  assertDefined(state, 'getState should return an object');

  // Verify tier transitions (score 50-79)
  assertEqual(state.glowIntensity, 5, 'Score 50: glowIntensity should be 5 (tier 2)');
  assertEqual(state.backgroundColor, '#808080', 'Score 50: backgroundColor should be #808080 (tier 4)');
  assertEqual(state.gridLineColor, '#606060', 'Score 50: gridLineColor should be #606060 (tier 4)');
  assertEqual(state.gridOpacity, 0.7, 'Score 50: gridOpacity should be 0.7 (tier 2)');
  assertEqual(state.gridDotOpacity, 0.15, 'Score 50: gridDotOpacity should be 0.15 (tier 2)');
});

test('getState() at score 100 returns max tier values (Neon Noir)', () => {
  const state = progression.getState(100);

  assertDefined(state, 'getState should return an object');

  // Verify max tier values (score 100+)
  assertEqual(state.glowIntensity, 8, 'Score 100: glowIntensity should be 8 (max tier)');
  assertEqual(state.backgroundColor, '#2A2A2A', 'Score 100: backgroundColor should be #2A2A2A (max tier)');
  assertEqual(state.gridLineColor, '#1A1A1A', 'Score 100: gridLineColor should be #1A1A1A (max tier)');
  assertEqual(state.gridOpacity, 0.3, 'Score 100: gridOpacity should be 0.3 (max tier)');
  assertEqual(state.gridDotOpacity, 0.35, 'Score 100: gridDotOpacity should be 0.35 (max tier)');
});

// ============================================================================
// Test Suite: Threshold Resolution (blur, colors, opacity)
// ============================================================================

test('Blur values resolve correctly (3, 5, 8)', () => {
  const state0 = progression.getState(0);
  const state50 = progression.getState(50);
  const state80 = progression.getState(80);

  assertEqual(state0.glowIntensity, 3, 'Score 0-49: blur should be 3');
  assertEqual(state50.glowIntensity, 5, 'Score 50-79: blur should be 5');
  assertEqual(state80.glowIntensity, 8, 'Score 80+: blur should be 8');
});

test('Color strings resolve correctly (hex codes)', () => {
  const state0 = progression.getState(0);
  const state15 = progression.getState(15);
  const state100 = progression.getState(100);

  // Background colors
  assertEqual(state0.backgroundColor, '#E8E8E8', 'Score 0-14: background tier 1');
  assertEqual(state15.backgroundColor, '#D0D0D0', 'Score 15-29: background tier 2');
  assertEqual(state100.backgroundColor, '#2A2A2A', 'Score 100+: background tier 6');

  // Grid line colors
  assertEqual(state0.gridLineColor, '#A0A0A0', 'Score 0-14: gridLine tier 1');
  assertEqual(state15.gridLineColor, '#909090', 'Score 15-29: gridLine tier 2');
  assertEqual(state100.gridLineColor, '#1A1A1A', 'Score 100+: gridLine tier 6');
});

test('Opacity decimals resolve correctly (0, 0.15, 0.3, 0.7, 1.0)', () => {
  const state0 = progression.getState(0);
  const state50 = progression.getState(50);
  const state100 = progression.getState(100);

  // Grid opacity
  assertEqual(state0.gridOpacity, 1.0, 'Score 0-49: grid opacity 1.0');
  assertEqual(state50.gridOpacity, 0.7, 'Score 50-79: grid opacity 0.7');
  assertEqual(state100.gridOpacity, 0.3, 'Score 100+: grid opacity 0.3');

  // Grid dot opacity
  assertEqual(state0.gridDotOpacity, 0, 'Score 0-49: dot opacity 0');
  assertEqual(state50.gridDotOpacity, 0.15, 'Score 50-79: dot opacity 0.15');
  assertEqual(state100.gridDotOpacity, 0.35, 'Score 100+: dot opacity 0.35');
});

// ============================================================================
// Test Suite: Edge Cases
// ============================================================================

test('Score -1 fallbacks gracefully to tier 1', () => {
  const state = progression.getState(-1);

  assertDefined(state, 'getState should handle negative scores');
  // Should return first tier values
  assertEqual(state.glowIntensity, 3, 'Negative score should return tier 1 blur');
  assertEqual(state.backgroundColor, '#E8E8E8', 'Negative score should return tier 1 background');
});

test('Score 9999 returns max tier', () => {
  const state = progression.getState(9999);

  assertDefined(state, 'getState should handle very high scores');
  // Should return max tier values
  assertEqual(state.glowIntensity, 8, 'Very high score should return max blur');
  assertEqual(state.backgroundColor, '#2A2A2A', 'Very high score should return max background');
  assertEqual(state.gridOpacity, 0.3, 'Very high score should return min grid opacity');
});

// ============================================================================
// Test Suite: Backward Compatibility
// ============================================================================

test('Existing fields (speed, phoneFrequency, effectChance) still work', () => {
  const state = progression.getState(50);

  // These fields should exist (exact values depend on existing config)
  assertDefined(state.speed, 'speed field should exist');
  assertDefined(state.phoneFrequency, 'phoneFrequency field should exist');
  assertDefined(state.effectChance, 'effectChance field should exist');

  // Verify they are the expected types (numbers or objects)
  const speedType = typeof state.speed;
  const phoneType = typeof state.phoneFrequency;
  const effectType = typeof state.effectChance;

  if (speedType !== 'number' && speedType !== 'object') {
    throw new Error(`speed should be number or object, got ${speedType}`);
  }
  if (phoneType !== 'number' && phoneType !== 'object') {
    throw new Error(`phoneFrequency should be number or object, got ${phoneType}`);
  }
  if (effectType !== 'number' && effectType !== 'object') {
    throw new Error(`effectChance should be number or object, got ${effectType}`);
  }
});

// ============================================================================
// Test Suite: Boundary Score Testing
// ============================================================================

test('Boundary scores resolve correctly (0, 14, 15, 49, 50, 79, 80, 99, 100, 150)', () => {
  const boundaries = [0, 14, 15, 49, 50, 79, 80, 99, 100, 150];

  for (const score of boundaries) {
    const state = progression.getState(score);
    assertDefined(state, `getState should work at boundary score ${score}`);
    assertDefined(state.glowIntensity, `glowIntensity should be defined at score ${score}`);
    assertDefined(state.backgroundColor, `backgroundColor should be defined at score ${score}`);
    assertDefined(state.gridOpacity, `gridOpacity should be defined at score ${score}`);
  }

  // Specific boundary checks
  const state14 = progression.getState(14);
  const state15 = progression.getState(15);

  // Background should transition at 15
  assertEqual(state14.backgroundColor, '#E8E8E8', 'Score 14: should be tier 1 background');
  assertEqual(state15.backgroundColor, '#D0D0D0', 'Score 15: should be tier 2 background');

  // Glow should transition at 50
  const state49 = progression.getState(49);
  const state50 = progression.getState(50);
  assertEqual(state49.glowIntensity, 3, 'Score 49: should be tier 1 glow');
  assertEqual(state50.glowIntensity, 5, 'Score 50: should be tier 2 glow');
});

// ============================================================================
// Run All Tests
// ============================================================================

console.log('\n========================================');
console.log('🧪 Progression System Test Suite');
console.log('========================================\n');

// Export test runner function
export function runTests() {
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📝 Total:  ${results.passed + results.failed}`);
  console.log('========================================\n');

  if (results.failed === 0) {
    console.log('🎉 All tests passed!');
    return true;
  } else {
    console.log('⚠️  Some tests failed. See above for details.');
    return false;
  }
}

// Auto-run tests if this module is loaded
runTests();
