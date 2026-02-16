// CrazySnakeLite - CSS/Canvas Hybrid Rendering Tests
// Story 20.2: Validate progression.js background field and event-driven updates

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

// Test Suite: progression.js getState() background field
console.log('\n=== Testing progression.js getState() background field ===\n');

// Test existence
const state = getState(0);
assertTrue(state.background !== undefined, 'getState() returns background field');

// Test type
assertTrue(typeof state.background === 'string', 'background field is a string');

// Test hex format
const hexPattern = /^#[0-9a-fA-F]{6}$/;
assertTrue(hexPattern.test(state.background), 'background is valid hex color format');

// Test tier resolution at specific scores
assertEqual(getState(0).background, '#e8e8e8', 'Score 0 → tier-0 (#e8e8e8)');
assertEqual(getState(10).background, '#e8e8e8', 'Score 10 → tier-0 (#e8e8e8)');
assertEqual(getState(14).background, '#e8e8e8', 'Score 14 → tier-0 (#e8e8e8)');

assertEqual(getState(15).background, '#d0d0d0', 'Score 15 → tier-1 (#d0d0d0)');
assertEqual(getState(20).background, '#d0d0d0', 'Score 20 → tier-1 (#d0d0d0)');
assertEqual(getState(29).background, '#d0d0d0', 'Score 29 → tier-1 (#d0d0d0)');

assertEqual(getState(30).background, '#b8b8b8', 'Score 30 → tier-2 (#b8b8b8)');
assertEqual(getState(40).background, '#b8b8b8', 'Score 40 → tier-2 (#b8b8b8)');
assertEqual(getState(49).background, '#b8b8b8', 'Score 49 → tier-2 (#b8b8b8)');

assertEqual(getState(50).background, '#808080', 'Score 50 → tier-3 (#808080)');
assertEqual(getState(60).background, '#808080', 'Score 60 → tier-3 (#808080)');
assertEqual(getState(74).background, '#808080', 'Score 74 → tier-3 (#808080)');

assertEqual(getState(75).background, '#505050', 'Score 75 → tier-4 (#505050)');
assertEqual(getState(80).background, '#505050', 'Score 80 → tier-4 (#505050)');
assertEqual(getState(99).background, '#505050', 'Score 99 → tier-4 (#505050)');

assertEqual(getState(100).background, '#1a1a1a', 'Score 100 → tier-5 (#1a1a1a)');
assertEqual(getState(150).background, '#1a1a1a', 'Score 150 → tier-5 (#1a1a1a)');
assertEqual(getState(200).background, '#1a1a1a', 'Score 200 → tier-5 (#1a1a1a)');

// Test threshold boundaries
assertEqual(getState(14).background, '#e8e8e8', 'Boundary test: score 14 stays tier-0');
assertEqual(getState(15).background, '#d0d0d0', 'Boundary test: score 15 transitions to tier-1');

assertEqual(getState(29).background, '#d0d0d0', 'Boundary test: score 29 stays tier-1');
assertEqual(getState(30).background, '#b8b8b8', 'Boundary test: score 30 transitions to tier-2');

assertEqual(getState(49).background, '#b8b8b8', 'Boundary test: score 49 stays tier-2');
assertEqual(getState(50).background, '#808080', 'Boundary test: score 50 transitions to tier-3');

assertEqual(getState(74).background, '#808080', 'Boundary test: score 74 stays tier-3');
assertEqual(getState(75).background, '#505050', 'Boundary test: score 75 transitions to tier-4');

assertEqual(getState(99).background, '#505050', 'Boundary test: score 99 stays tier-4');
assertEqual(getState(100).background, '#1a1a1a', 'Boundary test: score 100 transitions to tier-5');

// Test negative score handling
assertEqual(getState(-5).background, '#e8e8e8', 'Negative score normalized to tier-0');

// Test edge case: very high score
assertEqual(getState(9999).background, '#1a1a1a', 'Very high score stays tier-5');

// Test progression: brightness decreases as score increases
const score0 = getState(0).background;
const score50 = getState(50).background;
const score100 = getState(100).background;

const hexToBrightness = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r + g + b) / 3;
};

const b0 = hexToBrightness(score0);
const b50 = hexToBrightness(score50);
const b100 = hexToBrightness(score100);

assertTrue(b0 > b50, 'Brightness decreases: tier-0 > tier-3');
assertTrue(b50 > b100, 'Brightness decreases: tier-3 > tier-5');
assertTrue(b0 > b100, 'Brightness decreases: tier-0 > tier-5');

// Test integration with existing fields
assertTrue(state.glowIntensity !== undefined, 'getState() still returns glowIntensity');
assertTrue(state.gridOpacity !== undefined, 'getState() still returns gridOpacity');
assertTrue(state.backgroundColor !== undefined, 'getState() still returns backgroundColor');
assertTrue(state.gridLineColor !== undefined, 'getState() still returns gridLineColor');

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
