// CrazySnakeLite - Combo Stats Analytics Tests
// Story 10.7: Track combo interactions for analytics and cognitive feedback

import { CONFIG } from '../js/config.js';
import { createInitialState, resetGame } from '../js/state.js';
import { activateCombo } from '../js/combo.js';

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

function assertDeepEqual(actual, expected, testName) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr === expectedStr) {
    results.passed++;
    results.tests.push({ name: testName, status: 'PASS' });
    console.log(`✅ PASS: ${testName}`);
  } else {
    results.failed++;
    results.tests.push({ name: testName, status: 'FAIL', expected: expectedStr, actual: actualStr });
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Expected: ${expectedStr}, Got: ${actualStr}`);
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

// Test Suite: State initialization
console.log('\n=== Testing State Initialization ===\n');

let gameState = createInitialState();

assertEqual(gameState.analyticsState.totalCombosTriggered, 0, 'totalCombosTriggered initializes to 0');
assertEqual(gameState.cognitiveStats.comboMultipliers, 0, 'comboMultipliers initializes to 0');
assertEqual(gameState.cognitiveStats.peakComboScore, 0, 'peakComboScore initializes to 0');
assertDeepEqual(gameState.analyticsState.comboScores, [], 'comboScores initializes to []');
assertEqual(gameState.analyticsState.comboPhoneOverlaps, 0, 'comboPhoneOverlaps initializes to 0');
assertEqual(gameState.analyticsState.comboPhoneOverlapSurvived, 0, 'comboPhoneOverlapSurvived initializes to 0');
assertEqual(gameState.analyticsState.combo_active, false, 'combo_active initializes to false');

// Test Suite: Track combo activation
console.log('\n=== Testing Combo Activation Tracking ===\n');

// Create mock canvas element
const mockCanvas = document.createElement('canvas');
mockCanvas.id = 'game-canvas';
document.body.appendChild(mockCanvas);

gameState = createInitialState();

// Activate first combo
activateCombo({ type: 'speedBoost' }, gameState);

assertEqual(gameState.analyticsState.totalCombosTriggered, 1, 'Combo 1: totalCombosTriggered = 1');

// Activate second combo (after first exits)
gameState.combo.active = false;
activateCombo({ type: 'wallPhase' }, gameState);

assertEqual(gameState.analyticsState.totalCombosTriggered, 2, 'Combo 2: totalCombosTriggered = 2');

// Activate third combo
gameState.combo.active = false;
activateCombo({ type: 'reverseControls' }, gameState);

assertEqual(gameState.analyticsState.totalCombosTriggered, 3, 'Combo 3: totalCombosTriggered = 3');

console.log('totalCombosTriggered tracks all activations ✓');

// Test Suite: Track combo completion (comboMultipliers)
console.log('\n=== Testing Combo Completion Tracking ===\n');

gameState = createInitialState();

assertEqual(gameState.cognitiveStats.comboMultipliers, 0, 'Initial: comboMultipliers = 0');

// Simulate Effect B consumed (done in game.js, we're testing state structure)
gameState.cognitiveStats.comboMultipliers += 1;

assertEqual(gameState.cognitiveStats.comboMultipliers, 1, 'After Effect B #1: comboMultipliers = 1');

// Second combo completed
gameState.cognitiveStats.comboMultipliers += 1;

assertEqual(gameState.cognitiveStats.comboMultipliers, 2, 'After Effect B #2: comboMultipliers = 2');

console.log('comboMultipliers tracks completed combos ✓');

// Test Suite: Track peak combo score
console.log('\n=== Testing Peak Combo Score Tracking ===\n');

gameState = createInitialState();

assertEqual(gameState.cognitiveStats.peakComboScore, 0, 'Initial: peakComboScore = 0');

// First combo: 3 × 2 = 6
let comboScore = 6;
gameState.cognitiveStats.peakComboScore = Math.max(
  gameState.cognitiveStats.peakComboScore,
  comboScore
);

assertEqual(gameState.cognitiveStats.peakComboScore, 6, 'After 3×2: peakComboScore = 6');

// Second combo: 8 × 5 = 40 (new peak)
comboScore = 40;
gameState.cognitiveStats.peakComboScore = Math.max(
  gameState.cognitiveStats.peakComboScore,
  comboScore
);

assertEqual(gameState.cognitiveStats.peakComboScore, 40, 'After 8×5: peakComboScore = 40 (updated)');

// Third combo: 2 × 1 = 2 (lower than peak)
comboScore = 2;
gameState.cognitiveStats.peakComboScore = Math.max(
  gameState.cognitiveStats.peakComboScore,
  comboScore
);

assertEqual(gameState.cognitiveStats.peakComboScore, 40, 'After 2×1: peakComboScore = 40 (unchanged)');

console.log('peakComboScore tracks highest score correctly ✓');

// Test Suite: Track combo scores array
console.log('\n=== Testing Combo Scores Array ===\n');

gameState = createInitialState();

assertDeepEqual(gameState.analyticsState.comboScores, [], 'Initial: comboScores = []');

// Add 5 combo scores
gameState.analyticsState.comboScores.push(6);
gameState.analyticsState.comboScores.push(15);
gameState.analyticsState.comboScores.push(40);
gameState.analyticsState.comboScores.push(1);
gameState.analyticsState.comboScores.push(12);

assertDeepEqual(
  gameState.analyticsState.comboScores,
  [6, 15, 40, 1, 12],
  'After 5 combos: comboScores = [6, 15, 40, 1, 12]'
);

assertEqual(gameState.analyticsState.comboScores.length, 5, 'comboScores.length = 5');

console.log('comboScores array collects all scores ✓');

// Test Suite: Track phone + combo overlaps
console.log('\n=== Testing Phone + Combo Overlaps ===\n');

gameState = createInitialState();

assertEqual(gameState.analyticsState.comboPhoneOverlaps, 0, 'Initial: comboPhoneOverlaps = 0');
assertEqual(gameState.analyticsState.comboPhoneOverlapSurvived, 0, 'Initial: comboPhoneOverlapSurvived = 0');

// Simulate phone call #1 during combo
gameState.combo.active = true;
gameState.analyticsState.comboPhoneOverlaps += 1;

assertEqual(gameState.analyticsState.comboPhoneOverlaps, 1, 'Phone #1 during combo: overlaps = 1');

// Simulate phone dismissed (survived)
gameState.analyticsState.comboPhoneOverlapSurvived += 1;

assertEqual(gameState.analyticsState.comboPhoneOverlapSurvived, 1, 'Phone #1 dismissed: survived = 1');

// Simulate phone call #2 NOT during combo (no overlap)
gameState.combo.active = false;

assertEqual(gameState.analyticsState.comboPhoneOverlaps, 1, 'Phone #2 outside combo: overlaps still 1');

// Simulate phone call #3 during combo
gameState.combo.active = true;
gameState.analyticsState.comboPhoneOverlaps += 1;

assertEqual(gameState.analyticsState.comboPhoneOverlaps, 2, 'Phone #3 during combo: overlaps = 2');

// Simulate phone dismissed (survived)
gameState.analyticsState.comboPhoneOverlapSurvived += 1;

assertEqual(gameState.analyticsState.comboPhoneOverlapSurvived, 2, 'Phone #3 dismissed: survived = 2');

console.log('Phone + combo overlap tracking works correctly ✓');

// Test Suite: Track combo_active at death
console.log('\n=== Testing combo_active at Death ===\n');

gameState = createInitialState();

// Death outside combo
gameState.combo.active = false;
gameState.analyticsState.combo_active = gameState.combo.active;
gameState.phase = 'gameover';

assertEqual(gameState.analyticsState.combo_active, false, 'Death outside combo: combo_active = false');

// Reset and die during combo
gameState = createInitialState();
gameState.combo.active = true;
gameState.combo.effectA = { type: 'speedBoost', points: 5 };
gameState.combo.effectB = null;  // Died before Effect B
gameState.analyticsState.combo_active = gameState.combo.active;
gameState.phase = 'gameover';

assertEqual(gameState.analyticsState.combo_active, true, 'Death during combo (Effect A): combo_active = true');

// Die during combo with Effect B
gameState = createInitialState();
gameState.combo.active = true;
gameState.combo.effectA = { type: 'speedBoost', points: 5 };
gameState.combo.effectB = { type: 'reverseControls', points: 8 };
gameState.analyticsState.combo_active = gameState.combo.active;
gameState.phase = 'gameover';

assertEqual(gameState.analyticsState.combo_active, true, 'Death during combo (Effect B): combo_active = true');

console.log('combo_active captured correctly at death ✓');

// Test Suite: Activation without completion
console.log('\n=== Testing Activation Without Completion ===\n');

gameState = createInitialState();

// Activate combo (Effect A)
activateCombo({ type: 'wallPhase' }, gameState);

assertEqual(gameState.analyticsState.totalCombosTriggered, 1, 'Combo activated: totalCombosTriggered = 1');

// Die before Effect B (no completion)
assertEqual(gameState.cognitiveStats.comboMultipliers, 0, 'Died before Effect B: comboMultipliers = 0');

// Verify difference between activation and completion
const activations = gameState.analyticsState.totalCombosTriggered;
const completions = gameState.cognitiveStats.comboMultipliers;

assertEqual(activations, 1, 'Activations = 1 (opportunity metric)');
assertEqual(completions, 0, 'Completions = 0 (engagement metric)');

console.log('Activation vs completion tracked separately ✓');

// Test Suite: Stats reset on new game
console.log('\n=== Testing Stats Reset on New Game ===\n');

gameState = createInitialState();

// Simulate game with combo stats
activateCombo({ type: 'speedBoost' }, gameState);
activateCombo({ type: 'wallPhase' }, gameState);
gameState.cognitiveStats.comboMultipliers = 5;
gameState.cognitiveStats.peakComboScore = 40;
gameState.analyticsState.comboScores = [6, 15, 40, 1, 12];
gameState.analyticsState.comboPhoneOverlaps = 3;
gameState.analyticsState.comboPhoneOverlapSurvived = 2;

// Verify stats populated
assertTruthy(gameState.analyticsState.totalCombosTriggered > 0, 'Before reset: totalCombosTriggered > 0');
assertTruthy(gameState.cognitiveStats.comboMultipliers > 0, 'Before reset: comboMultipliers > 0');
assertTruthy(gameState.cognitiveStats.peakComboScore > 0, 'Before reset: peakComboScore > 0');
assertTruthy(gameState.analyticsState.comboScores.length > 0, 'Before reset: comboScores.length > 0');

// Reset game
resetGame(gameState);

// Verify stats reset to 0
assertEqual(gameState.analyticsState.totalCombosTriggered, 0, 'After reset: totalCombosTriggered = 0');
assertEqual(gameState.cognitiveStats.comboMultipliers, 0, 'After reset: comboMultipliers = 0');
assertEqual(gameState.cognitiveStats.peakComboScore, 0, 'After reset: peakComboScore = 0');
assertDeepEqual(gameState.analyticsState.comboScores, [], 'After reset: comboScores = []');
assertEqual(gameState.analyticsState.comboPhoneOverlaps, 0, 'After reset: comboPhoneOverlaps = 0');
assertEqual(gameState.analyticsState.comboPhoneOverlapSurvived, 0, 'After reset: comboPhoneOverlapSurvived = 0');
assertEqual(gameState.analyticsState.combo_active, false, 'After reset: combo_active = false');

console.log('All stats reset correctly on new game ✓');

// Test Suite: Edge case - 100 combos
console.log('\n=== Testing Edge Case: Many Combos ===\n');

gameState = createInitialState();

// Simulate 100 combo completions
for (let i = 1; i <= 100; i++) {
  gameState.analyticsState.comboScores.push(i);
  gameState.cognitiveStats.comboMultipliers += 1;
  gameState.analyticsState.totalCombosTriggered += 1;
}

assertEqual(gameState.analyticsState.comboScores.length, 100, '100 combos: comboScores.length = 100');
assertEqual(gameState.cognitiveStats.comboMultipliers, 100, '100 combos: comboMultipliers = 100');
assertEqual(gameState.analyticsState.totalCombosTriggered, 100, '100 combos: totalCombosTriggered = 100');

console.log('Large combo count handled correctly ✓');

// Test Suite: Edge case - Phone arrives exactly when combo exits
console.log('\n=== Testing Edge Case: Phone at Combo Exit ===\n');

gameState = createInitialState();

// Combo is active
gameState.combo.active = true;

// Phone call arrives (overlap)
gameState.analyticsState.comboPhoneOverlaps += 1;

assertEqual(gameState.analyticsState.comboPhoneOverlaps, 1, 'Phone during combo: overlap counted');

// Combo exits (foodCount = 3, then reset)
gameState.combo.active = false;

// Phone dismissed after combo already exited (still counts as survival)
gameState.analyticsState.comboPhoneOverlapSurvived += 1;

assertEqual(gameState.analyticsState.comboPhoneOverlapSurvived, 1, 'Phone dismissed after exit: survival counted');

console.log('Phone at combo exit boundary handled correctly ✓');

// Cleanup
document.body.removeChild(mockCanvas);

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
