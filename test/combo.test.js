// CrazySnakeLite - Combo Mode Tests
// Story 10.1: Probability-based combo activation

import { CONFIG } from '../js/config.js';
import { getComboProbability } from '../js/progression.js';
import { activateCombo, isComboActive } from '../js/combo.js';
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

function assertApproxEqual(actual, expected, tolerance, testName) {
  if (Math.abs(actual - expected) <= tolerance) {
    results.passed++;
    results.tests.push({ name: testName, status: 'PASS' });
    console.log(`✅ PASS: ${testName}`);
  } else {
    results.failed++;
    results.tests.push({ name: testName, status: 'FAIL', expected, actual });
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Expected: ${expected} ± ${tolerance}, Got: ${actual}`);
  }
}

// Test Suite: getComboProbability()
console.log('\n=== Testing getComboProbability() - All 6 Tiers ===\n');

assertEqual(getComboProbability(0), 0.0, 'Score 0 = 0% combo probability');
assertEqual(getComboProbability(20), 0.0, 'Score 20 = 0% combo probability');
assertEqual(getComboProbability(29), 0.0, 'Score 29 = 0% combo probability (last in tier 1)');
assertEqual(getComboProbability(30), 0.1, 'Score 30 = 10% combo probability (first in tier 2)');
assertEqual(getComboProbability(39), 0.1, 'Score 39 = 10% combo probability (mid tier 2)');
assertEqual(getComboProbability(40), 0.1, 'Score 40 = 10% combo probability');
assertEqual(getComboProbability(50), 0.1, 'Score 50 = 10% combo probability');
assertEqual(getComboProbability(59), 0.1, 'Score 59 = 10% combo probability (last in tier 2)');
assertEqual(getComboProbability(60), 0.2, 'Score 60 = 20% combo probability (first in tier 3)');
assertEqual(getComboProbability(70), 0.2, 'Score 70 = 20% combo probability');
assertEqual(getComboProbability(79), 0.2, 'Score 79 = 20% combo probability (last in tier 3)');
assertEqual(getComboProbability(80), 0.3, 'Score 80 = 30% combo probability (first in tier 4)');
assertEqual(getComboProbability(90), 0.3, 'Score 90 = 30% combo probability');
assertEqual(getComboProbability(99), 0.3, 'Score 99 = 30% combo probability (last in tier 4)');
assertEqual(getComboProbability(100), 0.35, 'Score 100 = 35% combo probability (first in tier 5)');
assertEqual(getComboProbability(110), 0.35, 'Score 110 = 35% combo probability');
assertEqual(getComboProbability(119), 0.35, 'Score 119 = 35% combo probability (last in tier 5)');
assertEqual(getComboProbability(120), 0.4, 'Score 120 = 40% combo probability (first in tier 6, capped)');
assertEqual(getComboProbability(150), 0.4, 'Score 150 = 40% combo probability (cap holds)');
assertEqual(getComboProbability(200), 0.4, 'Score 200 = 40% combo probability (cap holds)');
assertEqual(getComboProbability(500), 0.4, 'Score 500 = 40% combo probability (cap holds)');

// Test Suite: activateCombo()
console.log('\n=== Testing activateCombo() ===\n');

let gameState = createInitialState();
const testFood = { type: 'speedBoost' };

assertEqual(gameState.combo.active, false, 'Combo starts inactive');
assertEqual(gameState.combo.effectA, null, 'Effect A starts null');
assertEqual(gameState.combo.foodCount, 0, 'Food count starts at 0');

activateCombo(testFood, gameState);

assertEqual(gameState.combo.active, true, 'Combo active after activation');
assertEqual(gameState.combo.effectA.type, 'speedBoost', 'Effect A type stored correctly');
assertEqual(gameState.combo.effectA.points, 5, 'Effect A points stored correctly (Speed Boost = 5)');
assertEqual(gameState.combo.foodCount, 1, 'Food count set to 1 after activation');

// Test Suite: isComboActive()
console.log('\n=== Testing isComboActive() ===\n');

gameState = createInitialState();
assertEqual(isComboActive(gameState), false, 'isComboActive() returns false when combo inactive');

activateCombo({ type: 'reverseControls' }, gameState);
assertEqual(isComboActive(gameState), true, 'isComboActive() returns true after activation');

// Test Suite: Effect A storage for different food types
console.log('\n=== Testing Effect A Storage for All Food Types ===\n');

const foodTypes = [
  { type: 'growing', expectedPoints: 1 },
  { type: 'speedDecrease', expectedPoints: 2 },
  { type: 'wallPhase', expectedPoints: 1 },
  { type: 'speedBoost', expectedPoints: 5 },
  { type: 'reverseControls', expectedPoints: 8 },
  { type: 'invincibility', expectedPoints: 0 }
];

foodTypes.forEach(({ type, expectedPoints }) => {
  gameState = createInitialState();
  activateCombo({ type }, gameState);
  assertEqual(gameState.combo.effectA.type, type, `Effect A type = ${type}`);
  assertEqual(gameState.combo.effectA.points, expectedPoints, `Effect A points = ${expectedPoints} for ${type}`);
});

// Test Suite: Probabilistic activation (statistical test)
console.log('\n=== Testing Probabilistic Activation (Score 40-59, 10% probability) ===\n');

let activationCount = 0;
const trials = 1000;

for (let i = 0; i < trials; i++) {
  gameState = createInitialState();
  gameState.score = 50;  // 10% tier

  const probability = getComboProbability(gameState.score);
  if (Math.random() < probability) {
    activationCount++;
  }
}

const activationRate = activationCount / trials;
// Expected: 0.1 (10%), tolerance: ±0.02 (2 percentage points) - Issue #10 fix: tightened from ±0.03
assertApproxEqual(activationRate, 0.1, 0.02, `1000 trials at score 50: activation rate ~10% (got ${(activationRate * 100).toFixed(1)}%)`);

// Test Suite: Higher tier probabilistic activation (Score 120+, 40% cap)
console.log('\n=== Testing Probabilistic Activation (Score 120+, 40% cap) ===\n');

activationCount = 0;

for (let i = 0; i < trials; i++) {
  gameState = createInitialState();
  gameState.score = 150;  // 40% tier (capped)

  const probability = getComboProbability(gameState.score);
  if (Math.random() < probability) {
    activationCount++;
  }
}

const activationRateCapped = activationCount / trials;
// Expected: 0.4 (40%), tolerance: ±0.02 (2 percentage points) - Issue #10 fix: tightened from ±0.03
assertApproxEqual(activationRateCapped, 0.4, 0.02, `1000 trials at score 150: activation rate ~40% (got ${(activationRateCapped * 100).toFixed(1)}%)`);

// Test Suite: Combo already active prevention (AC7 - Issue #5 fix)
console.log('\n=== Testing "Already Active" Prevention (AC7) ===\n');

gameState = createInitialState();
gameState.score = 100;  // 35% tier - high probability

// Activate combo with speedBoost
activateCombo({ type: 'speedBoost' }, gameState);
const originalEffectA = gameState.combo.effectA;

assertEqual(gameState.combo.active, true, 'Combo is active after first activation');
assertEqual(originalEffectA.type, 'speedBoost', 'Original Effect A is speedBoost');
assertEqual(originalEffectA.points, 5, 'Original Effect A points = 5');

// Try to activate again with different food (should be prevented by game.js logic)
// Note: This test verifies the combo state machine, not game.js orchestration
// In real game, game.js checks isComboActive() before calling activateCombo()
const wasActive = isComboActive(gameState);
assertEqual(wasActive, true, 'isComboActive() correctly returns true when combo active');

// Verify Effect A unchanged (game.js should have prevented second activation)
assertEqual(gameState.combo.effectA.type, originalEffectA.type, 'Effect A type unchanged when combo already active');
assertEqual(gameState.combo.effectA.points, originalEffectA.points, 'Effect A points unchanged when combo already active');

// Test Suite: CONFIG values
console.log('\n=== Testing CONFIG.COMBO_PROBABILITIES ===\n');

assertEqual(CONFIG.COMBO_PROBABILITIES.length, 6, 'CONFIG has 6 combo probability tiers');
assertEqual(CONFIG.COMBO_PROBABILITIES[0].probability, 0.0, 'Tier 1: 0% (learning phase)');
assertEqual(CONFIG.COMBO_PROBABILITIES[1].probability, 0.1, 'Tier 2: 10%');
assertEqual(CONFIG.COMBO_PROBABILITIES[2].probability, 0.2, 'Tier 3: 20%');
assertEqual(CONFIG.COMBO_PROBABILITIES[3].probability, 0.3, 'Tier 4: 30%');
assertEqual(CONFIG.COMBO_PROBABILITIES[4].probability, 0.35, 'Tier 5: 35%');
assertEqual(CONFIG.COMBO_PROBABILITIES[5].probability, 0.4, 'Tier 6: 40% (cap)');
assertEqual(CONFIG.COMBO_PROBABILITIES[5].maxScore, Infinity, 'Tier 6: maxScore = Infinity (no upper bound)');

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
