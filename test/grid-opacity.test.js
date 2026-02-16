// CrazySnakeLite - Grid Opacity Progression Tests
// Story 20.3: Validate progressive grid dimming system

import { getState } from '../js/progression.js';
import { CONFIG } from '../js/config.js';

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    results.passed++;
    results.tests.push({ name: testName, status: 'PASS' });
    console.log(`✅ PASS: ${testName}`);
  } else {
    results.failed++;
    results.tests.push({ name: testName, status: 'FAIL', expected, actual });
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Expected: ${expected}, Got: ${actual}`);
  }
}

function assertTrue(condition, testName) {
  assertEqual(condition, true, testName);
}

function assertArrayEqual(actual, expected, testName) {
  const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
  assertEqual(isEqual, true, testName + ` (expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)})`);
}

// Test Suite: GRID_OPACITY_PROGRESSION Configuration
console.log('\n=== Testing GRID_OPACITY_PROGRESSION Config ===\n');

// Config existence
assertTrue(CONFIG.GRID_OPACITY_PROGRESSION !== undefined, 'GRID_OPACITY_PROGRESSION exists in CONFIG');
assertTrue(CONFIG.GRID_OPACITY_PROGRESSION.thresholds !== undefined, 'thresholds array exists');
assertTrue(CONFIG.GRID_OPACITY_PROGRESSION.values !== undefined, 'values array exists');

// Array lengths
assertEqual(CONFIG.GRID_OPACITY_PROGRESSION.thresholds.length, 6, 'thresholds array has 6 values');
assertEqual(CONFIG.GRID_OPACITY_PROGRESSION.values.length, 6, 'values array has 6 values');

// Equal lengths
const thresholdsLength = CONFIG.GRID_OPACITY_PROGRESSION.thresholds.length;
const valuesLength = CONFIG.GRID_OPACITY_PROGRESSION.values.length;
assertEqual(thresholdsLength, valuesLength, 'thresholds and values have equal length');

// Threshold values
assertArrayEqual(
  CONFIG.GRID_OPACITY_PROGRESSION.thresholds,
  [0, 15, 30, 50, 75, 100],
  'thresholds match specification'
);

// Opacity values
assertArrayEqual(
  CONFIG.GRID_OPACITY_PROGRESSION.values,
  [0.9, 0.75, 0.6, 0.5, 0.4, 0.3],
  'opacity values match specification'
);

// Type validation
assertTrue(
  CONFIG.GRID_OPACITY_PROGRESSION.values.every(v => typeof v === 'number'),
  'all opacity values are numbers'
);

// Range validation (0.3-0.9)
assertTrue(
  CONFIG.GRID_OPACITY_PROGRESSION.values.every(v => v >= 0.3 && v <= 0.9),
  'all opacity values in valid range 0.3-0.9'
);

// WCAG minimum (tier-5)
assertEqual(CONFIG.GRID_OPACITY_PROGRESSION.values[5], 0.3, 'tier-5 opacity is 0.3 (WCAG minimum)');

// Test Suite: progression.js getState() gridOpacity field
console.log('\n=== Testing progression.js getState() gridOpacity ===\n');

// Field existence
const state = getState(0);
assertTrue(state.gridOpacity !== undefined, 'getState() returns gridOpacity field');

// Type validation
assertTrue(typeof state.gridOpacity === 'number', 'gridOpacity is a number');

// Range validation
assertTrue(state.gridOpacity >= 0.3 && state.gridOpacity <= 0.9, 'gridOpacity in valid range');

// Tier resolution at specific scores
assertEqual(getState(0).gridOpacity, 0.9, 'Score 0 → tier-0 (0.9 opacity)');
assertEqual(getState(10).gridOpacity, 0.9, 'Score 10 → tier-0 (0.9 opacity)');
assertEqual(getState(14).gridOpacity, 0.9, 'Score 14 → tier-0 (0.9 opacity)');

assertEqual(getState(15).gridOpacity, 0.75, 'Score 15 → tier-1 (0.75 opacity)');
assertEqual(getState(20).gridOpacity, 0.75, 'Score 20 → tier-1 (0.75 opacity)');
assertEqual(getState(29).gridOpacity, 0.75, 'Score 29 → tier-1 (0.75 opacity)');

assertEqual(getState(30).gridOpacity, 0.6, 'Score 30 → tier-2 (0.6 opacity)');
assertEqual(getState(40).gridOpacity, 0.6, 'Score 40 → tier-2 (0.6 opacity)');
assertEqual(getState(49).gridOpacity, 0.6, 'Score 49 → tier-2 (0.6 opacity)');

assertEqual(getState(50).gridOpacity, 0.5, 'Score 50 → tier-3 (0.5 opacity)');
assertEqual(getState(60).gridOpacity, 0.5, 'Score 60 → tier-3 (0.5 opacity)');
assertEqual(getState(74).gridOpacity, 0.5, 'Score 74 → tier-3 (0.5 opacity)');

assertEqual(getState(75).gridOpacity, 0.4, 'Score 75 → tier-4 (0.4 opacity)');
assertEqual(getState(80).gridOpacity, 0.4, 'Score 80 → tier-4 (0.4 opacity)');
assertEqual(getState(99).gridOpacity, 0.4, 'Score 99 → tier-4 (0.4 opacity)');

assertEqual(getState(100).gridOpacity, 0.3, 'Score 100 → tier-5 (0.3 opacity)');
assertEqual(getState(150).gridOpacity, 0.3, 'Score 150 → tier-5 (0.3 opacity)');
assertEqual(getState(200).gridOpacity, 0.3, 'Score 200 → tier-5 (0.3 opacity)');

// Boundary testing
assertEqual(getState(14).gridOpacity, 0.9, 'Boundary: score 14 stays tier-0');
assertEqual(getState(15).gridOpacity, 0.75, 'Boundary: score 15 transitions to tier-1');

assertEqual(getState(29).gridOpacity, 0.75, 'Boundary: score 29 stays tier-1');
assertEqual(getState(30).gridOpacity, 0.6, 'Boundary: score 30 transitions to tier-2');

assertEqual(getState(49).gridOpacity, 0.6, 'Boundary: score 49 stays tier-2');
assertEqual(getState(50).gridOpacity, 0.5, 'Boundary: score 50 transitions to tier-3');

assertEqual(getState(74).gridOpacity, 0.5, 'Boundary: score 74 stays tier-3');
assertEqual(getState(75).gridOpacity, 0.4, 'Boundary: score 75 transitions to tier-4');

assertEqual(getState(99).gridOpacity, 0.4, 'Boundary: score 99 stays tier-4');
assertEqual(getState(100).gridOpacity, 0.3, 'Boundary: score 100 transitions to tier-5');

// Edge cases
assertEqual(getState(-5).gridOpacity, 0.9, 'Negative score normalized to tier-0');
assertEqual(getState(9999).gridOpacity, 0.3, 'Very high score stays tier-5');

// Progressive dimming validation
const opacity0 = getState(0).gridOpacity;
const opacity50 = getState(50).gridOpacity;
const opacity100 = getState(100).gridOpacity;

assertTrue(opacity0 > opacity50, 'Opacity decreases: tier-0 > tier-3');
assertTrue(opacity50 > opacity100, 'Opacity decreases: tier-3 > tier-5');
assertTrue(opacity0 > opacity100, 'Opacity decreases: tier-0 > tier-5');

// Synchronization with background
const bg0 = getState(0).background;
const bg100 = getState(100).background;
assertTrue(bg0 !== bg100, 'Background changes from tier-0 to tier-5');
assertTrue(opacity0 > opacity100, 'Grid opacity decreases as background darkens');

// Integration with other fields
assertTrue(state.background !== undefined, 'getState() still returns background');
assertTrue(state.glowIntensity !== undefined, 'getState() still returns glowIntensity');

// Summary
console.log('\n=== Test Summary ===\n');
console.log(`Total: ${results.passed + results.failed}`);
console.log(`Passed: ${results.passed}`);
console.log(`Failed: ${results.failed}`);

if (results.failed > 0) {
  console.log('\n❌ TESTS FAILED\n');
  process.exit(1);
} else {
  console.log('\n✅ ALL TESTS PASSED\n');
}
