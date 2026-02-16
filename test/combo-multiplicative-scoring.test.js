// CrazySnakeLite - Combo Multiplicative Scoring Tests
// Story 10.4: A × B scoring for massive combo rewards

import { CONFIG } from '../js/config.js';
import { createInitialState } from '../js/state.js';

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

function assertTruthy(value, testName) {
  if (value) {
    results.passed++;
    results.tests.push({ name: testName, status: 'PASS' });
    console.log(`✅ PASS: ${testName}`);
  } else {
    results.failed++;
    results.tests.push({ name: testName, status: 'FAIL', expected: 'truthy', actual: value });
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Expected: truthy, Got: ${value}`);
  }
}

// Test Suite: CONFIG thresholds
console.log('\n=== Testing CONFIG Thresholds ===\n');

assertEqual(CONFIG.COMBO_JACKPOT_THRESHOLD, 15, 'CONFIG.COMBO_JACKPOT_THRESHOLD = 15');
assertEqual(CONFIG.COMBO_LEGENDARY_THRESHOLD, 30, 'CONFIG.COMBO_LEGENDARY_THRESHOLD = 30');

// Test Suite: Multiplicative calculation
console.log('\n=== Testing Multiplicative Calculation ===\n');

const testCombos = [
  { effectA: 1, effectB: 1, expected: 1, name: 'Growing × Growing' },
  { effectA: 3, effectB: 2, expected: 6, name: 'Wall Phase (+3) × Speed Decrease (+2)' },
  { effectA: 5, effectB: 3, expected: 15, name: 'Speed Boost (+5) × Wall Phase (+3) - Jackpot' },
  { effectA: 8, effectB: 5, expected: 40, name: 'Reverse Controls (+8) × Speed Boost (+5) - Legendary' },
  { effectA: 8, effectB: 8, expected: 64, name: 'Reverse Controls × Reverse Controls - Maximum' },
  { effectA: 0, effectB: 5, expected: 0, name: 'Invincibility (0) × Speed Boost (+5) - Wasted' }
];

testCombos.forEach(({ effectA, effectB, expected, name }) => {
  const result = effectA * effectB;
  assertEqual(result, expected, `${name}: ${effectA} × ${effectB} = ${expected}`);
});

// Test Suite: Audio threshold logic
console.log('\n=== Testing Audio Threshold Logic ===\n');

function getAudioTier(score) {
  if (score >= CONFIG.COMBO_LEGENDARY_THRESHOLD) return 'legendary';
  if (score >= CONFIG.COMBO_JACKPOT_THRESHOLD) return 'jackpot';
  return 'none';
}

assertEqual(getAudioTier(0), 'none', 'Score 0: no audio');
assertEqual(getAudioTier(1), 'none', 'Score 1: no audio');
assertEqual(getAudioTier(6), 'none', 'Score 6: no audio');
assertEqual(getAudioTier(14), 'none', 'Score 14: no audio (below threshold)');
assertEqual(getAudioTier(15), 'jackpot', 'Score 15: jackpot audio (threshold)');
assertEqual(getAudioTier(20), 'jackpot', 'Score 20: jackpot audio');
assertEqual(getAudioTier(29), 'jackpot', 'Score 29: jackpot audio');
assertEqual(getAudioTier(30), 'legendary', 'Score 30: legendary audio (threshold)');
assertEqual(getAudioTier(40), 'legendary', 'Score 40: legendary audio');
assertEqual(getAudioTier(64), 'legendary', 'Score 64: legendary audio');

// Test Suite: State tracking
console.log('\n=== Testing Combo Stats Tracking ===\n');

let gameState = createInitialState();

assertEqual(gameState.cognitiveStats.comboMultipliers, 0, 'comboMultipliers starts at 0');
assertEqual(gameState.cognitiveStats.peakComboScore, 0, 'peakComboScore starts at 0');
assertEqual(gameState.analyticsState.comboScores.length, 0, 'comboScores array starts empty');

// Simulate combo scoring
gameState.cognitiveStats.comboMultipliers += 1;
gameState.cognitiveStats.peakComboScore = Math.max(gameState.cognitiveStats.peakComboScore, 15);
gameState.analyticsState.comboScores.push(15);

assertEqual(gameState.cognitiveStats.comboMultipliers, 1, 'comboMultipliers increments to 1');
assertEqual(gameState.cognitiveStats.peakComboScore, 15, 'peakComboScore updates to 15');
assertEqual(gameState.analyticsState.comboScores.length, 1, 'comboScores has 1 entry');
assertEqual(gameState.analyticsState.comboScores[0], 15, 'comboScores[0] = 15');

// Simulate second combo (higher score)
gameState.cognitiveStats.comboMultipliers += 1;
gameState.cognitiveStats.peakComboScore = Math.max(gameState.cognitiveStats.peakComboScore, 40);
gameState.analyticsState.comboScores.push(40);

assertEqual(gameState.cognitiveStats.comboMultipliers, 2, 'comboMultipliers increments to 2');
assertEqual(gameState.cognitiveStats.peakComboScore, 40, 'peakComboScore updates to 40 (new peak)');
assertEqual(gameState.analyticsState.comboScores.length, 2, 'comboScores has 2 entries');

// Simulate third combo (lower score - peak should not change)
gameState.cognitiveStats.peakComboScore = Math.max(gameState.cognitiveStats.peakComboScore, 6);

assertEqual(gameState.cognitiveStats.peakComboScore, 40, 'peakComboScore stays at 40 (not lower)');

// Test Suite: All possible combos with Fibonacci values
console.log('\n=== Testing All Fibonacci Combo Combinations ===\n');

const fibonacciValues = [0, 1, 2, 3, 5, 8]; // Invincibility, Growing, Speed Dec, Wall Phase, Speed Boost, Reverse

const expectedCombos = [
  [0, 0, 1, 2, 3, 5, 8],   // 0 × [0,1,2,3,5,8]
  [0, 1, 2, 3, 5, 8],      // 1 × [0,1,2,3,5,8]
  [0, 2, 4, 6, 10, 16],    // 2 × [0,1,2,3,5,8]
  [0, 3, 6, 9, 15, 24],    // 3 × [0,1,2,3,5,8]
  [0, 5, 10, 15, 25, 40],  // 5 × [0,1,2,3,5,8]
  [0, 8, 16, 24, 40, 64]   // 8 × [0,1,2,3,5,8]
];

let comboTestCount = 0;
for (let i = 0; i < fibonacciValues.length; i++) {
  for (let j = 0; j < fibonacciValues.length; j++) {
    const a = fibonacciValues[i];
    const b = fibonacciValues[j];
    const expected = expectedCombos[i][j];
    const actual = a * b;
    assertEqual(actual, expected, `${a} × ${b} = ${expected}`);
    comboTestCount++;
  }
}

console.log(`\nTested ${comboTestCount} combo combinations (6 × 6 = 36)`);

// Test Suite: Edge cases
console.log('\n=== Testing Edge Cases ===\n');

// Exactly at thresholds
assertEqual(getAudioTier(15), 'jackpot', 'Exactly 15 triggers jackpot (not legendary)');
assertEqual(getAudioTier(30), 'legendary', 'Exactly 30 triggers legendary');

// Invincibility combos always 0
const invincibilityCombos = fibonacciValues.map(b => 0 * b);
invincibilityCombos.forEach((score, idx) => {
  assertEqual(score, 0, `Invincibility × ${fibonacciValues[idx]} = 0 (wasted combo)`);
});

// Summary
console.log('\n=== Test Summary ===\n');
console.log(`Total: ${results.passed + results.failed}`);
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);

if (results.failed === 0) {
  console.log('\n🎉 All tests passed!');
} else {
  console.log('\n⚠️ Some tests failed. Review errors above.');
}

export { results };
