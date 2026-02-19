// Story 23.1: Per-Food-Type Tracking Tests
import { createInitialState, resetGame } from '../js/state.js';

console.log('\n=== Story 23.1: Per-Food-Type Tracking Tests ===\n');

// Test 1: cognitiveStats.foodsEaten exists on initial state
const state1 = createInitialState();
assert.isObject(
  state1.cognitiveStats.foodsEaten,
  'cognitiveStats.foodsEaten should exist and be an object'
);

// Test 2: All 6 food type keys present and start at 0
const foodTypes = ['growing', 'speedDecrease', 'wallPhase', 'speedBoost', 'reverseControls', 'invincibility'];
const state2 = createInitialState();
foodTypes.forEach(type => {
  assert.equal(
    state2.cognitiveStats.foodsEaten[type],
    0,
    `foodsEaten.${type} should start at 0`
  );
});

// Test 3: foodsEaten resets to all zeros on resetGame()
const state3 = createInitialState();
state3.cognitiveStats.foodsEaten.growing = 5;
state3.cognitiveStats.foodsEaten.speedBoost = 3;
state3.cognitiveStats.foodsEaten.invincibility = 2;
resetGame(state3);
foodTypes.forEach(type => {
  assert.equal(
    state3.cognitiveStats.foodsEaten[type],
    0,
    `foodsEaten.${type} should reset to 0 on resetGame()`
  );
});

// Test 4: Other cognitiveStats fields still reset on resetGame() (regression check)
const state4 = createInitialState();
state4.cognitiveStats.rcSurvived = 7;
state4.cognitiveStats.phoneCallsManaged = 4;
state4.cognitiveStats.pickUpStreak = 3;
resetGame(state4);
assert.equal(state4.cognitiveStats.rcSurvived, 0, 'rcSurvived should reset to 0');
assert.equal(state4.cognitiveStats.phoneCallsManaged, 0, 'phoneCallsManaged should reset to 0');
assert.equal(state4.cognitiveStats.pickUpStreak, 0, 'pickUpStreak should reset to 0');

// Test 5: foodsEaten fields are independently incrementable (structure validation)
const state5 = createInitialState();
state5.cognitiveStats.foodsEaten.growing++;
state5.cognitiveStats.foodsEaten.speedBoost++;
state5.cognitiveStats.foodsEaten.speedBoost++;
assert.equal(state5.cognitiveStats.foodsEaten.growing, 1, 'growing should be 1 after one increment');
assert.equal(state5.cognitiveStats.foodsEaten.speedBoost, 2, 'speedBoost should be 2 after two increments');
assert.equal(state5.cognitiveStats.foodsEaten.reverseControls, 0, 'reverseControls should still be 0 (untouched)');

// Test 6: phoneCallsManaged still exists and starts at 0 (needed for Run Summary Bar phone badge)
const state6 = createInitialState();
assert.equal(
  state6.cognitiveStats.phoneCallsManaged,
  0,
  'phoneCallsManaged should start at 0 (no changes needed to phone tracking)'
);

// Test 7: Dynamic bracket notation works for all food type strings
const state7 = createInitialState();
foodTypes.forEach(type => {
  state7.cognitiveStats.foodsEaten[type]++;
  assert.equal(
    state7.cognitiveStats.foodsEaten[type],
    1,
    `foodsEaten[${type}] should be 1 after bracket-notation increment`
  );
});

console.log('\n=== Story 23.1 Tests Complete ===\n');
