// CrazySnakeLite - Combo Canvas Color Transition Tests
// Story 10.2: Canvas background color transitions

import { CONFIG } from '../js/config.js';
import { activateCombo, exitCombo, isComboActive } from '../js/combo.js';
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

function assertArrayContains(array, value, testName) {
  if (array.includes(value)) {
    results.passed++;
    results.tests.push({ name: testName, status: 'PASS' });
    console.log(`✅ PASS: ${testName}`);
  } else {
    results.failed++;
    results.tests.push({ name: testName, status: 'FAIL', expected: `array contains ${value}`, actual: array });
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Expected array to contain: ${value}`);
    console.error(`   Array: ${JSON.stringify(array)}`);
  }
}

// Test Suite: CONFIG values
console.log('\n=== Testing CONFIG.COMBO_CANVAS_COLORS ===\n');

assertEqual(CONFIG.COMBO_CANVAS_COLORS.length, 4, 'CONFIG has 4 combo canvas colors');
assertEqual(CONFIG.COMBO_CANVAS_COLORS[0], '#4A148C', 'Color 1: Dark purple (#4A148C)');
assertEqual(CONFIG.COMBO_CANVAS_COLORS[1], '#0D47A1', 'Color 2: Dark blue (#0D47A1)');
assertEqual(CONFIG.COMBO_CANVAS_COLORS[2], '#B71C1C', 'Color 3: Dark red (#B71C1C)');
assertEqual(CONFIG.COMBO_CANVAS_COLORS[3], '#1B5E20', 'Color 4: Dark green (#1B5E20)');

assertEqual(CONFIG.DEFAULT_CANVAS_COLOR, '#E8E8E8', 'CONFIG.DEFAULT_CANVAS_COLOR = #E8E8E8');

// Test Suite: activateCombo() color selection
console.log('\n=== Testing activateCombo() Color Selection ===\n');

// Create mock canvas element for testing
const mockCanvas = document.createElement('canvas');
mockCanvas.id = 'game-canvas';
document.body.appendChild(mockCanvas);

let gameState = createInitialState();
const testFood = { type: 'speedBoost' };

activateCombo(testFood, gameState);

assertTruthy(gameState.combo.canvasColor, 'Canvas color is set (not null)');
assertArrayContains(CONFIG.COMBO_CANVAS_COLORS, gameState.combo.canvasColor, 'Canvas color is one of the 4 valid colors');
assertEqual(mockCanvas.style.backgroundColor, gameState.combo.canvasColor, 'Canvas element background matches state.combo.canvasColor');
assertEqual(mockCanvas.style.transition, 'background-color 500ms ease-in-out', 'Canvas has correct transition property');

// Test Suite: exitCombo() canvas reset
console.log('\n=== Testing exitCombo() Canvas Reset ===\n');

exitCombo(gameState);

assertEqual(gameState.combo.active, false, 'Combo active = false after exit');
assertEqual(gameState.combo.canvasColor, null, 'Canvas color = null after exit');
assertEqual(gameState.combo.effectA, null, 'Effect A = null after exit');
assertEqual(gameState.combo.effectB, null, 'Effect B = null after exit');
assertEqual(gameState.combo.foodCount, 0, 'Food count = 0 after exit');
assertEqual(mockCanvas.style.backgroundColor, CONFIG.DEFAULT_CANVAS_COLOR, 'Canvas background reset to default color');
assertEqual(mockCanvas.style.transition, 'background-color 500ms ease-in-out', 'Canvas transition property persists');

// Test Suite: Random color selection distribution
console.log('\n=== Testing Random Color Selection (100 trials) ===\n');

const colorCounts = {
  '#4A148C': 0,  // Purple
  '#0D47A1': 0,  // Blue
  '#B71C1C': 0,  // Red
  '#1B5E20': 0   // Green
};

for (let i = 0; i < 100; i++) {
  gameState = createInitialState();
  activateCombo({ type: 'growing' }, gameState);
  colorCounts[gameState.combo.canvasColor]++;
}

// Verify all 4 colors appeared at least once (very high probability with 100 trials)
assertTruthy(colorCounts['#4A148C'] > 0, 'Dark purple appeared at least once');
assertTruthy(colorCounts['#0D47A1'] > 0, 'Dark blue appeared at least once');
assertTruthy(colorCounts['#B71C1C'] > 0, 'Dark red appeared at least once');
assertTruthy(colorCounts['#1B5E20'] > 0, 'Dark green appeared at least once');

console.log(`   Color distribution (100 trials):`);
console.log(`   Purple: ${colorCounts['#4A148C']}, Blue: ${colorCounts['#0D47A1']}, Red: ${colorCounts['#B71C1C']}, Green: ${colorCounts['#1B5E20']}`);

// Test Suite: Multiple activations change color
console.log('\n=== Testing Multiple Activations ===\n');

const colors = new Set();

for (let i = 0; i < 20; i++) {
  gameState = createInitialState();
  activateCombo({ type: 'speedDecrease' }, gameState);
  colors.add(gameState.combo.canvasColor);
}

// With 20 trials, very likely to see at least 2 different colors
assertTruthy(colors.size >= 2, `Multiple activations produce different colors (got ${colors.size} unique colors in 20 trials)`);

// Test Suite: Activate → Exit → Activate cycle
console.log('\n=== Testing Activate → Exit → Activate Cycle ===\n');

gameState = createInitialState();

// First activation
activateCombo({ type: 'reverseControls' }, gameState);
const firstColor = gameState.combo.canvasColor;
assertEqual(gameState.combo.active, true, 'Combo active after first activation');
assertTruthy(firstColor, 'First color selected');

// Exit
exitCombo(gameState);
assertEqual(gameState.combo.active, false, 'Combo inactive after exit');
assertEqual(gameState.combo.canvasColor, null, 'Color reset to null after exit');

// Second activation
activateCombo({ type: 'wallPhase' }, gameState);
const secondColor = gameState.combo.canvasColor;
assertEqual(gameState.combo.active, true, 'Combo active after second activation');
assertTruthy(secondColor, 'Second color selected');
assertArrayContains(CONFIG.COMBO_CANVAS_COLORS, secondColor, 'Second color is valid');

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
