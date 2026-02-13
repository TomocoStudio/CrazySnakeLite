// CrazySnakeLite - Scoring Module Tests
// Story 7.1: Fibonacci scoring system

import { CONFIG } from '../js/config.js';
import { getFoodScore, getWallPhaseBonus } from '../js/scoring.js';

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

// Test Suite: getFoodScore()
console.log('\n=== Testing getFoodScore() ===\n');

assertEqual(getFoodScore('growing'), 1, 'Growing food = +1');
assertEqual(getFoodScore('speedDecrease'), 2, 'Speed Decrease food = +2');
assertEqual(getFoodScore('wallPhase'), 1, 'Wall Phase food = +1 (base)');
assertEqual(getFoodScore('speedBoost'), 5, 'Speed Boost food = +5');
assertEqual(getFoodScore('reverseControls'), 8, 'Reverse Controls food = +8');
assertEqual(getFoodScore('invincibility'), 0, 'Invincibility food = 0 (safety tax)');
assertEqual(getFoodScore('invalidType'), 0, 'Invalid food type = 0');

// Test Suite: getWallPhaseBonus()
console.log('\n=== Testing getWallPhaseBonus() ===\n');

assertEqual(getWallPhaseBonus(), 2, 'Wall Phase bonus = +2');

// Test Suite: Wall Phase Bonus (Story 7.1 - instant reward on wall crossing)
console.log('\n=== Testing Wall Phase Instant Bonus ===\n');

assertEqual(getWallPhaseBonus(), 2, 'Wall Phase bonus = +2 (awarded instantly when wall crossed)');

// Test CONFIG values match expected Fibonacci sequence
console.log('\n=== Testing CONFIG.SCORING values ===\n');

assertEqual(CONFIG.SCORING.FOOD.invincibility, 0, 'CONFIG: Invincibility = 0');
assertEqual(CONFIG.SCORING.FOOD.growing, 1, 'CONFIG: Growing = 1');
assertEqual(CONFIG.SCORING.FOOD.wallPhase, 1, 'CONFIG: Wall Phase base = 1');
assertEqual(CONFIG.SCORING.FOOD.speedDecrease, 2, 'CONFIG: Speed Decrease = 2');
assertEqual(CONFIG.SCORING.FOOD.speedBoost, 5, 'CONFIG: Speed Boost = 5');
assertEqual(CONFIG.SCORING.FOOD.reverseControls, 8, 'CONFIG: Reverse Controls = 8');
assertEqual(CONFIG.SCORING.WALL_PHASE_BONUS, 2, 'CONFIG: Wall Phase bonus = 2 (total 1+2=3)');

// Summary
console.log('\n=== Test Summary ===\n');
console.log(`Total: ${results.passed + results.failed}`);
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);

if (results.failed === 0) {
  console.log('\n🎉 All tests passed!');
} else {
  console.log('\n❌ Some tests failed. See details above.');
}

// Export results for test runner
export default results;
