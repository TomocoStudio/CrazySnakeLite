// Story 11.1: RC SURVIVED Flash Tests
import { createInitialState } from '../js/state.js';
import { applyEffect, clearEffect } from '../js/effects.js';
import { spawnFlash } from '../js/score-popup.js';

console.log('\n=== Story 11.1: RC SURVIVED Flash Tests ===\n');

// Test 1: reverseControlsActive flag starts false
const state1 = createInitialState();
assert.isFalse(
  state1.effects.reverseControlsActive,
  'reverseControlsActive flag should start as false'
);

// Test 2: reverseControlsActive flag set to true when RC activates
const state2 = createInitialState();
applyEffect(state2, 'reverseControls');
assert.isTrue(
  state2.effects.reverseControlsActive,
  'reverseControlsActive flag should be true after RC activates'
);

// Test 3: reverseControlsActive flag set to false when effect clears
const state3 = createInitialState();
applyEffect(state3, 'reverseControls');
clearEffect(state3);
assert.isFalse(
  state3.effects.reverseControlsActive,
  'reverseControlsActive flag should be false after effect clears'
);

// Test 4: rcSurvived stat exists and starts at 0
const state4 = createInitialState();
assert.equal(
  state4.cognitiveStats.rcSurvived,
  0,
  'rcSurvived stat should start at 0'
);

// Test 5: Other effects do not set reverseControlsActive flag
const state5 = createInitialState();
applyEffect(state5, 'speedBoost');
assert.isFalse(
  state5.effects.reverseControlsActive,
  'reverseControlsActive should remain false for non-RC effects'
);

// Test 6: spawnFlash function exists and is callable
assert.isTrue(
  typeof spawnFlash === 'function',
  'spawnFlash should be a function'
);

// Test 7: reverseControlsActive resets when applying new effect
const state6 = createInitialState();
applyEffect(state6, 'reverseControls');
assert.isTrue(state6.effects.reverseControlsActive, 'RC should be active');
applyEffect(state6, 'invincibility'); // Apply new effect
assert.isFalse(
  state6.effects.reverseControlsActive,
  'reverseControlsActive should be false after new effect applied'
);

console.log('\n=== RC SURVIVED Tests Complete ===\n');
