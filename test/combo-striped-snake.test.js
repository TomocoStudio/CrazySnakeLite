// CrazySnakeLite - Combo Striped Snake Rendering Tests
// Story 10.3: Alternating Effect A/B colors (barber-pole pattern)

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

// Test Suite: Effect color mapping
console.log('\n=== Testing Effect Color Mapping ===\n');

// Note: getEffectColor is not exported, but we can verify CONFIG colors exist
assertTruthy(CONFIG.COLORS.foodGrowing, 'CONFIG has foodGrowing color');
assertTruthy(CONFIG.COLORS.foodInvincibility, 'CONFIG has foodInvincibility color');
assertTruthy(CONFIG.COLORS.foodWallPhase, 'CONFIG has foodWallPhase color');
assertTruthy(CONFIG.COLORS.foodSpeedBoost, 'CONFIG has foodSpeedBoost color');
assertTruthy(CONFIG.COLORS.foodSpeedDecrease, 'CONFIG has foodSpeedDecrease color');
assertTruthy(CONFIG.COLORS.foodReverseControls, 'CONFIG has foodReverseControls color');

assertEqual(CONFIG.COLORS.foodGrowing, '#00FF00', 'Growing = Green (#00FF00)');
assertEqual(CONFIG.COLORS.foodInvincibility, '#FFFF00', 'Invincibility = Yellow (#FFFF00)');
assertEqual(CONFIG.COLORS.foodWallPhase, '#800080', 'Wall Phase = Purple (#800080)');
assertEqual(CONFIG.COLORS.foodSpeedBoost, '#FF0000', 'Speed Boost = Red (#FF0000)');
assertEqual(CONFIG.COLORS.foodSpeedDecrease, '#00CED1', 'Speed Decrease = Cyan (#00CED1)');
assertEqual(CONFIG.COLORS.foodReverseControls, '#FFA500', 'Reverse Controls = Orange (#FFA500)');

// Test Suite: Striped pattern index logic
console.log('\n=== Testing Striped Pattern Index Logic ===\n');

// Simulate striped pattern logic
function getSegmentColor(index, colorA, colorB) {
  if (index === 0) return colorB; // Head
  if (index % 2 === 1) return colorA; // Odd
  return colorB; // Even
}

const colorA = '#800080'; // Purple (Effect A)
const colorB = '#FF0000'; // Red (Effect B)

assertEqual(getSegmentColor(0, colorA, colorB), colorB, 'Head (index 0) = Effect B');
assertEqual(getSegmentColor(1, colorA, colorB), colorA, 'Segment 1 (odd) = Effect A');
assertEqual(getSegmentColor(2, colorA, colorB), colorB, 'Segment 2 (even) = Effect B');
assertEqual(getSegmentColor(3, colorA, colorB), colorA, 'Segment 3 (odd) = Effect A');
assertEqual(getSegmentColor(4, colorA, colorB), colorB, 'Segment 4 (even) = Effect B');
assertEqual(getSegmentColor(5, colorA, colorB), colorA, 'Segment 5 (odd) = Effect A');
assertEqual(getSegmentColor(10, colorA, colorB), colorB, 'Segment 10 (even) = Effect B');
assertEqual(getSegmentColor(11, colorA, colorB), colorA, 'Segment 11 (odd) = Effect A');

// Test Suite: Combo state integration
console.log('\n=== Testing Combo State Integration ===\n');

let gameState = createInitialState();

assertEqual(gameState.combo.active, false, 'Combo starts inactive');
assertEqual(gameState.combo.effectA, null, 'Effect A starts null');
assertEqual(gameState.combo.effectB, null, 'Effect B starts null');

// Simulate combo activation (Effect A set)
gameState.combo.active = true;
gameState.combo.effectA = { type: 'speedBoost', points: 5 };
gameState.combo.foodCount = 1;

const isStripedBeforeEffectB = gameState.combo.active && gameState.combo.effectB !== null;
assertEqual(isStripedBeforeEffectB, false, 'Striped rendering OFF when effectB is null (solid Effect A color)');

// Simulate second food eaten (Effect B set)
gameState.combo.effectB = { type: 'reverseControls', points: 8 };
gameState.combo.foodCount = 2;

const isStripedAfterEffectB = gameState.combo.active && gameState.combo.effectB !== null;
assertEqual(isStripedAfterEffectB, true, 'Striped rendering ON when effectB is set');
assertEqual(gameState.combo.effectA.type, 'speedBoost', 'Effect A type preserved');
assertEqual(gameState.combo.effectB.type, 'reverseControls', 'Effect B type set correctly');

// Test Suite: Food count progression
console.log('\n=== Testing Food Count Progression ===\n');

gameState = createInitialState();

// First food (combo activation)
gameState.combo.active = true;
gameState.combo.effectA = { type: 'wallPhase', points: 1 };
gameState.combo.foodCount = 1;

assertEqual(gameState.combo.foodCount, 1, 'Food count = 1 after combo activation');
assertEqual(gameState.combo.effectB, null, 'Effect B = null after first food');

// Second food
gameState.combo.effectB = { type: 'speedDecrease', points: 2 };
gameState.combo.foodCount = 2;

assertEqual(gameState.combo.foodCount, 2, 'Food count = 2 after second food');
assertTruthy(gameState.combo.effectB, 'Effect B set after second food');

// Test Suite: Striped pattern barber-pole verification (long snake)
console.log('\n=== Testing Long Snake Striped Pattern ===\n');

const longSnakePattern = [];
for (let i = 0; i < 20; i++) {
  longSnakePattern.push(getSegmentColor(i, 'A', 'B'));
}

// Verify pattern: B, A, B, A, B, A, B, A, B, A, ...
const expectedPattern = ['B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A'];
assertEqual(JSON.stringify(longSnakePattern), JSON.stringify(expectedPattern), '20-segment snake: correct barber-pole pattern (B, A, B, A, ...)');

// Test Suite: Multiple effect combinations
console.log('\n=== Testing Multiple Effect Combinations ===\n');

const combinations = [
  { effectA: 'speedBoost', effectB: 'reverseControls', name: 'Red + Orange' },
  { effectA: 'wallPhase', effectB: 'speedDecrease', name: 'Purple + Cyan' },
  { effectA: 'growing', effectB: 'invincibility', name: 'Green + Yellow' },
  { effectA: 'speedDecrease', effectB: 'speedBoost', name: 'Cyan + Red' }
];

combinations.forEach(({ effectA, effectB, name }) => {
  gameState = createInitialState();
  gameState.combo.active = true;
  gameState.combo.effectA = { type: effectA, points: 1 };
  gameState.combo.effectB = { type: effectB, points: 1 };

  const isStriped = gameState.combo.active && gameState.combo.effectB !== null;
  assertEqual(isStriped, true, `${name}: Striped rendering active`);
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
