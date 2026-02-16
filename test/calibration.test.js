// CrazySnakeLite - Calibration State Tests (Story 14.5)
import {
  getCalibrationState,
  isCalibrationComplete,
  formatCalibrationCounter,
  formatCalibrationComplete
} from '../js/calibration.js';

// Run all calibration tests
(function runCalibrationTests() {
  console.log('=== Calibration State Tests (Story 14.5) ===');

  // Test 1: Session 1 - in_progress
  try {
    const state = getCalibrationState(1);
    window.assert.isObject(state, 'Returns state object for session 1');
    window.assert.equal(state.state, 'in_progress', 'Session 1 is in_progress');
    window.assert.equal(state.sessionCount, 1, 'Session count is 1');
  } catch (error) {
    console.error('❌ Test 1 FAILED:', error.message);
  }

  // Test 2: Session 3 - in_progress
  try {
    const state = getCalibrationState(3);
    window.assert.equal(state.state, 'in_progress', 'Session 3 is in_progress');
    window.assert.equal(state.sessionCount, 3, 'Session count is 3');
  } catch (error) {
    console.error('❌ Test 2 FAILED:', error.message);
  }

  // Test 3: Session 4 - in_progress
  try {
    const state = getCalibrationState(4);
    window.assert.equal(state.state, 'in_progress', 'Session 4 is in_progress');
    window.assert.equal(state.sessionCount, 4, 'Session count is 4');
  } catch (error) {
    console.error('❌ Test 3 FAILED:', error.message);
  }

  // Test 4: Session 5 - complete (one-time celebration)
  try {
    const state = getCalibrationState(5);
    window.assert.equal(state.state, 'complete', 'Session 5 is complete');
    window.assert.equal(state.sessionCount, 5, 'Session count is 5');
  } catch (error) {
    console.error('❌ Test 4 FAILED:', error.message);
  }

  // Test 5: Session 6 - unlocked
  try {
    const state = getCalibrationState(6);
    window.assert.equal(state.state, 'unlocked', 'Session 6 is unlocked');
    window.assert.equal(state.sessionCount, 6, 'Session count is 6');
  } catch (error) {
    console.error('❌ Test 5 FAILED:', error.message);
  }

  // Test 6: Session 10 - unlocked
  try {
    const state = getCalibrationState(10);
    window.assert.equal(state.state, 'unlocked', 'Session 10 is unlocked');
    window.assert.equal(state.sessionCount, 10, 'Session count is 10');
  } catch (error) {
    console.error('❌ Test 6 FAILED:', error.message);
  }

  // Test 7: Session 0 - in_progress (edge case)
  try {
    const state = getCalibrationState(0);
    window.assert.equal(state.state, 'in_progress', 'Session 0 is in_progress');
    window.assert.equal(state.sessionCount, 0, 'Session count is 0');
  } catch (error) {
    console.error('❌ Test 7 FAILED:', error.message);
  }

  // Test 8: isCalibrationComplete - session 5
  try {
    const isComplete = isCalibrationComplete(5);
    window.assert.isTrue(isComplete, 'Session 5 is calibration complete');
  } catch (error) {
    console.error('❌ Test 8 FAILED:', error.message);
  }

  // Test 9: isCalibrationComplete - session 4
  try {
    const isComplete = isCalibrationComplete(4);
    window.assert.isFalse(isComplete, 'Session 4 is not calibration complete');
  } catch (error) {
    console.error('❌ Test 9 FAILED:', error.message);
  }

  // Test 10: isCalibrationComplete - session 6
  try {
    const isComplete = isCalibrationComplete(6);
    window.assert.isFalse(isComplete, 'Session 6 is not calibration complete (already past)');
  } catch (error) {
    console.error('❌ Test 10 FAILED:', error.message);
  }

  // Test 11: formatCalibrationCounter - session 1
  try {
    const text = formatCalibrationCounter(1);
    window.assert.equal(text, 'Session 1/5 — Warming up...', 'Formats session 1 counter correctly');
  } catch (error) {
    console.error('❌ Test 11 FAILED:', error.message);
  }

  // Test 12: formatCalibrationCounter - session 3
  try {
    const text = formatCalibrationCounter(3);
    window.assert.equal(text, 'Session 3/5 — Warming up...', 'Formats session 3 counter correctly');
  } catch (error) {
    console.error('❌ Test 12 FAILED:', error.message);
  }

  // Test 13: formatCalibrationCounter - session 5
  try {
    const text = formatCalibrationCounter(5);
    window.assert.equal(text, 'Session 5/5 — Warming up...', 'Formats session 5 counter correctly');
  } catch (error) {
    console.error('❌ Test 13 FAILED:', error.message);
  }

  // Test 14: formatCalibrationComplete
  try {
    const text = formatCalibrationComplete();
    window.assert.equal(text, 'Your Skill Map is ready! 🎉', 'Formats completion message correctly');
    window.assert.isTrue(text.includes('🎉'), 'Completion message includes celebration emoji');
  } catch (error) {
    console.error('❌ Test 14 FAILED:', error.message);
  }

  // Test 15: State progression sequence
  try {
    const states = [1, 2, 3, 4, 5, 6, 7].map(n => getCalibrationState(n).state);
    window.assert.equal(states[0], 'in_progress', 'Session 1: in_progress');
    window.assert.equal(states[1], 'in_progress', 'Session 2: in_progress');
    window.assert.equal(states[2], 'in_progress', 'Session 3: in_progress');
    window.assert.equal(states[3], 'in_progress', 'Session 4: in_progress');
    window.assert.equal(states[4], 'complete', 'Session 5: complete');
    window.assert.equal(states[5], 'unlocked', 'Session 6: unlocked');
    window.assert.equal(states[6], 'unlocked', 'Session 7: unlocked');
    console.log('[Test 15] State progression verified:', states.join(' → '));
  } catch (error) {
    console.error('❌ Test 15 FAILED:', error.message);
  }

  console.log('=== Calibration State Tests Complete ===');
})();
