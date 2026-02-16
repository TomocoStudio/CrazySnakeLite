// CrazySnakeLite - BACKGROUND_PROGRESSION Configuration Tests
// Story 20.1: 6-tier background progression system

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

// Test Suite: BACKGROUND_PROGRESSION Configuration
console.log('\n=== Testing BACKGROUND_PROGRESSION Configuration (Story 20.1) ===\n');

// Existence check
assertTrue(CONFIG.BACKGROUND_PROGRESSION !== undefined, 'BACKGROUND_PROGRESSION exists in CONFIG');

// Array length checks
assertEqual(CONFIG.BACKGROUND_PROGRESSION.thresholds.length, 6, 'thresholds array has exactly 6 values');
assertEqual(CONFIG.BACKGROUND_PROGRESSION.colors.length, 6, 'colors array has exactly 6 values');

// Equal length check
const thresholdsLength = CONFIG.BACKGROUND_PROGRESSION.thresholds.length;
const colorsLength = CONFIG.BACKGROUND_PROGRESSION.colors.length;
assertEqual(thresholdsLength, colorsLength, 'thresholds and colors arrays have equal length');

// Threshold values
assertArrayEqual(
  CONFIG.BACKGROUND_PROGRESSION.thresholds,
  [0, 15, 30, 50, 75, 100],
  'thresholds are in correct ascending order'
);

// Color values
const expectedColors = [
  '#e8e8e8',  // tier-0: Safe daylight
  '#d0d0d0',  // tier-1: Slight tension
  '#b8b8b8',  // tier-2: Warm-up complete
  '#808080',  // tier-3: Building intensity
  '#505050',  // tier-4: Serious arcade
  '#1a1a1a'   // tier-5: Full Neon Noir
];
assertArrayEqual(CONFIG.BACKGROUND_PROGRESSION.colors, expectedColors, 'colors match expected progression');

// Individual tier checks (AC validation)
assertEqual(CONFIG.BACKGROUND_PROGRESSION.thresholds[0], 0, 'tier-0 threshold = 0');
assertEqual(CONFIG.BACKGROUND_PROGRESSION.thresholds[1], 15, 'tier-1 threshold = 15');
assertEqual(CONFIG.BACKGROUND_PROGRESSION.thresholds[2], 30, 'tier-2 threshold = 30');
assertEqual(CONFIG.BACKGROUND_PROGRESSION.thresholds[3], 50, 'tier-3 threshold = 50');
assertEqual(CONFIG.BACKGROUND_PROGRESSION.thresholds[4], 75, 'tier-4 threshold = 75');
assertEqual(CONFIG.BACKGROUND_PROGRESSION.thresholds[5], 100, 'tier-5 threshold = 100');

// Color format validation (hex strings)
const hexPattern = /^#[0-9a-fA-F]{6}$/;
CONFIG.BACKGROUND_PROGRESSION.colors.forEach((color, index) => {
  assertTrue(hexPattern.test(color), `tier-${index} color is valid hex format: ${color}`);
});

// Specific color checks
assertEqual(CONFIG.BACKGROUND_PROGRESSION.colors[0], '#e8e8e8', 'tier-0 color is light grey (#e8e8e8)');
assertEqual(CONFIG.BACKGROUND_PROGRESSION.colors[5], '#1a1a1a', 'tier-5 color is near-black (#1a1a1a)');

// Type validation
assertTrue(
  CONFIG.BACKGROUND_PROGRESSION.colors.every(c => typeof c === 'string'),
  'all colors are strings'
);
assertTrue(
  CONFIG.BACKGROUND_PROGRESSION.thresholds.every(t => typeof t === 'number'),
  'all thresholds are numbers'
);

// Emotional progression validation (brightness decreases)
const hexToBrightness = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r + g + b) / 3;  // Simple average for grey colors
};

const brightnesses = CONFIG.BACKGROUND_PROGRESSION.colors.map(hexToBrightness);
let brightnessDecreases = true;
for (let i = 1; i < brightnesses.length; i++) {
  if (brightnesses[i] >= brightnesses[i - 1]) {
    brightnessDecreases = false;
    break;
  }
}
assertTrue(brightnessDecreases, 'emotional progression: brightness decreases from tier-0 to tier-5');

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
