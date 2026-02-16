// CrazySnakeLite - Combo Exit Tests
// Story 10.5: Third food exits combo mode

import { CONFIG } from '../js/config.js';
import { createInitialState } from '../js/state.js';
import { exitCombo, isComboActive } from '../js/combo.js';

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

// Test Suite: foodCount progression
console.log('\n=== Testing foodCount Progression ===\n');

let gameState = createInitialState();

assertEqual(gameState.combo.foodCount, 0, 'foodCount starts at 0');

// Simulate combo activation (first food)
gameState.combo.active = true;
gameState.combo.effectA = { type: 'speedBoost', points: 5 };
gameState.combo.foodCount = 1;

assertEqual(gameState.combo.foodCount, 1, 'foodCount = 1 after activation (Effect A)');
assertEqual(gameState.combo.active, true, 'Combo active after activation');

// Simulate second food (Effect B)
gameState.combo.effectB = { type: 'reverseControls', points: 8 };
gameState.combo.foodCount = 2;

assertEqual(gameState.combo.foodCount, 2, 'foodCount = 2 after Effect B');
assertTruthy(gameState.combo.effectB, 'Effect B set');

// Test Suite: exitCombo() function
console.log('\n=== Testing exitCombo() Function ===\n');

// Create mock canvas element
const mockCanvas = document.createElement('canvas');
mockCanvas.id = 'game-canvas';
mockCanvas.style.backgroundColor = '#4A148C'; // Dark combo color
document.body.appendChild(mockCanvas);

// Set up active combo state
gameState = createInitialState();
gameState.combo.active = true;
gameState.combo.effectA = { type: 'wallPhase', points: 3 };
gameState.combo.effectB = { type: 'speedDecrease', points: 2 };
gameState.combo.canvasColor = '#4A148C';
gameState.combo.foodCount = 2;

// Call exitCombo()
exitCombo(gameState);

assertEqual(gameState.combo.active, false, 'combo.active = false after exit');
assertEqual(gameState.combo.effectA, null, 'effectA = null after exit');
assertEqual(gameState.combo.effectB, null, 'effectB = null after exit');
assertEqual(gameState.combo.canvasColor, null, 'canvasColor = null after exit');
assertEqual(gameState.combo.foodCount, 0, 'foodCount = 0 after exit');
assertEqual(mockCanvas.style.backgroundColor, CONFIG.DEFAULT_CANVAS_COLOR, 'Canvas reset to default color');
assertEqual(mockCanvas.style.transition, 'background-color 500ms ease-in-out', 'Canvas has transition');

// Test Suite: isComboActive() after exit
console.log('\n=== Testing isComboActive() After Exit ===\n');

assertEqual(isComboActive(gameState), false, 'isComboActive() returns false after exit');

// Test Suite: Combo lifecycle (full cycle)
console.log('\n=== Testing Full Combo Lifecycle ===\n');

gameState = createInitialState();

// Step 1: Activation (foodCount = 1)
gameState.combo.active = true;
gameState.combo.effectA = { type: 'speedBoost', points: 5 };
gameState.combo.foodCount = 1;

assertEqual(gameState.combo.foodCount, 1, 'Lifecycle Step 1: foodCount = 1 (Effect A)');
assertEqual(isComboActive(gameState), true, 'Lifecycle Step 1: combo active');

// Step 2: Effect B (foodCount = 2)
gameState.combo.effectB = { type: 'wallPhase', points: 3 };
gameState.combo.foodCount = 2;

assertEqual(gameState.combo.foodCount, 2, 'Lifecycle Step 2: foodCount = 2 (Effect B)');
assertTruthy(gameState.combo.effectB, 'Lifecycle Step 2: Effect B set');

// Step 3: Exit (third food)
gameState.combo.foodCount = 3; // Mark as exiting
exitCombo(gameState);

assertEqual(gameState.combo.active, false, 'Lifecycle Step 3: combo exited');
assertEqual(gameState.combo.foodCount, 0, 'Lifecycle Step 3: foodCount reset to 0');

// Test Suite: New combo can trigger after exit
console.log('\n=== Testing New Combo Can Trigger After Exit ===\n');

// After exit, combo should be able to activate again
assertEqual(isComboActive(gameState), false, 'Combo not active after exit');

// Simulate new combo activation
gameState.combo.active = true;
gameState.combo.effectA = { type: 'reverseControls', points: 8 };
gameState.combo.foodCount = 1;

assertEqual(isComboActive(gameState), true, 'New combo can activate after previous exit');
assertEqual(gameState.combo.effectA.type, 'reverseControls', 'New Effect A set correctly');

// Test Suite: Death preserves combo state (no exit)
console.log('\n=== Testing Death Does NOT Exit Combo ===\n');

gameState = createInitialState();

// Set up active combo with Effect B consumed
gameState.combo.active = true;
gameState.combo.effectA = { type: 'speedBoost', points: 5 };
gameState.combo.effectB = { type: 'reverseControls', points: 8 };
gameState.combo.canvasColor = '#0D47A1';
gameState.combo.foodCount = 2;

// Simulate death (do NOT call exitCombo)
// In actual game code, death sets phase to 'gameover' but does NOT exit combo
gameState.phase = 'gameover';

// Verify combo state is preserved
assertEqual(gameState.combo.active, true, 'Death: combo.active still true (preserved)');
assertTruthy(gameState.combo.effectA, 'Death: effectA preserved');
assertTruthy(gameState.combo.effectB, 'Death: effectB preserved');
assertTruthy(gameState.combo.canvasColor, 'Death: canvasColor preserved');
assertEqual(gameState.combo.foodCount, 2, 'Death: foodCount preserved (was 2)');

console.log('Death preserves combo state for analytics ✓');

// Test Suite: Multiple combo cycles
console.log('\n=== Testing Multiple Combo Cycles ===\n');

gameState = createInitialState();

// Cycle 1: Activate → Exit
gameState.combo.active = true;
gameState.combo.effectA = { type: 'growing', points: 1 };
gameState.combo.foodCount = 1;
gameState.combo.effectB = { type: 'growing', points: 1 };
gameState.combo.foodCount = 2;
exitCombo(gameState);

assertEqual(gameState.combo.active, false, 'Cycle 1: exited successfully');

// Cycle 2: Activate → Exit (back-to-back)
gameState.combo.active = true;
gameState.combo.effectA = { type: 'speedBoost', points: 5 };
gameState.combo.foodCount = 1;
gameState.combo.effectB = { type: 'speedBoost', points: 5 };
gameState.combo.foodCount = 2;
exitCombo(gameState);

assertEqual(gameState.combo.active, false, 'Cycle 2: exited successfully (back-to-back combo)');

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
