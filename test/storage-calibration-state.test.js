// CrazySnakeLite - Storage Calibration State Tests (Story 15.1)
// Tests for persistent calibration state management in localStorage

import {
  getProfile,
  updateProfile,
  getCalibrationStatus,
  setCelebrationShown
} from '../js/storage.js';

// Helper to clear test data
function clearTestData() {
  localStorage.removeItem('crazysnakeLite_profile');
}

// Run all storage calibration state tests
(function runStorageCalibrationTests() {
  console.log('=== Storage Calibration State Tests (Story 15.1) ===');

  // Test 1: First-ever player profile initialization
  try {
    clearTestData();
    const profile = getProfile();

    window.assert.equal(profile.calibrationComplete, false, 'calibrationComplete initializes to false');
    window.assert.equal(profile.sessionsCompleted, 0, 'sessionsCompleted initializes to 0');
    window.assert.isTrue(typeof profile.calibrationStartDate === 'number', 'calibrationStartDate is timestamp');
    window.assert.equal(profile.celebrationShown, false, 'celebrationShown initializes to false');
    window.assert.isTrue(profile.calibrationStartDate > 0, 'calibrationStartDate is valid timestamp');

    console.log('✅ Test 1 PASSED: First-ever player profile initialization');
  } catch (error) {
    console.error('❌ Test 1 FAILED:', error.message);
  }

  // Test 2: Profile persistence across getProfile calls
  try {
    clearTestData();
    const profile1 = getProfile();
    const startDate1 = profile1.calibrationStartDate;

    // Get profile again - should have same calibrationStartDate
    const profile2 = getProfile();

    window.assert.equal(profile2.calibrationStartDate, startDate1, 'calibrationStartDate persists and does not change');

    console.log('✅ Test 2 PASSED: calibrationStartDate persistence');
  } catch (error) {
    console.error('❌ Test 2 FAILED:', error.message);
  }

  // Test 3: Session counter increment
  try {
    clearTestData();

    // Simulate game.js onDeath logic (Story 15.1 Task 4)
    const profile = getProfile();
    const newSessionCount = profile.sessionsCompleted + 1;
    updateProfile({ sessionsCompleted: newSessionCount });

    const updated = getProfile();
    window.assert.equal(updated.sessionsCompleted, 1, 'sessionsCompleted increments to 1');

    console.log('✅ Test 3 PASSED: Session counter increment');
  } catch (error) {
    console.error('❌ Test 3 FAILED:', error.message);
  }

  // Test 4: Calibration threshold - sessions 1-4 stay incomplete
  try {
    clearTestData();

    for (let i = 1; i <= 4; i++) {
      const profile = getProfile();
      const newCount = profile.sessionsCompleted + 1;
      updateProfile({ sessionsCompleted: newCount });

      // Don't trigger calibrationComplete yet
      const updated = getProfile();
      window.assert.equal(updated.calibrationComplete, false, `Session ${i}: calibrationComplete stays false`);
    }

    const final = getProfile();
    window.assert.equal(final.sessionsCompleted, 4, 'After 4 sessions, count is 4');
    window.assert.equal(final.calibrationComplete, false, 'After 4 sessions, still not complete');

    console.log('✅ Test 4 PASSED: Sessions 1-4 stay incomplete');
  } catch (error) {
    console.error('❌ Test 4 FAILED:', error.message);
  }

  // Test 5: Calibration threshold - session 5 triggers completion
  try {
    clearTestData();

    // Simulate 4 sessions first
    for (let i = 1; i <= 4; i++) {
      const profile = getProfile();
      updateProfile({ sessionsCompleted: i });
    }

    // Simulate session 5 (Story 15.1 Task 4 logic)
    const profile = getProfile();
    const newSessionCount = profile.sessionsCompleted + 1; // 5
    updateProfile({ sessionsCompleted: newSessionCount });

    if (newSessionCount === 5 && !profile.calibrationComplete) {
      updateProfile({ calibrationComplete: true });
    }

    const completed = getProfile();
    window.assert.equal(completed.sessionsCompleted, 5, 'Session 5: count is 5');
    window.assert.equal(completed.calibrationComplete, true, 'Session 5: calibrationComplete flips to true');

    console.log('✅ Test 5 PASSED: Session 5 triggers calibration completion');
  } catch (error) {
    console.error('❌ Test 5 FAILED:', error.message);
  }

  // Test 6: Calibration never resets (one-way flag)
  try {
    clearTestData();

    // Set to complete
    updateProfile({ calibrationComplete: true, sessionsCompleted: 5 });

    // Simulate session 6+
    for (let i = 6; i <= 10; i++) {
      updateProfile({ sessionsCompleted: i });
      const profile = getProfile();
      window.assert.equal(profile.calibrationComplete, true, `Session ${i}: calibrationComplete stays true`);
    }

    const final = getProfile();
    window.assert.equal(final.sessionsCompleted, 10, 'Session count continues incrementing');
    window.assert.equal(final.calibrationComplete, true, 'calibrationComplete never resets');

    console.log('✅ Test 6 PASSED: Calibration never resets (one-way flag)');
  } catch (error) {
    console.error('❌ Test 6 FAILED:', error.message);
  }

  // Test 7: getCalibrationStatus() - incomplete state
  try {
    clearTestData();
    updateProfile({ calibrationComplete: false, sessionsCompleted: 3 });

    const status = getCalibrationStatus();

    window.assert.equal(status.isComplete, false, 'isComplete is false');
    window.assert.equal(status.sessionsCompleted, 3, 'sessionsCompleted is 3');
    window.assert.equal(status.shouldShowCelebration, false, 'shouldShowCelebration is false when incomplete');

    console.log('✅ Test 7 PASSED: getCalibrationStatus() incomplete state');
  } catch (error) {
    console.error('❌ Test 7 FAILED:', error.message);
  }

  // Test 8: getCalibrationStatus() - complete, celebration not shown
  try {
    clearTestData();
    updateProfile({ calibrationComplete: true, sessionsCompleted: 5, celebrationShown: false });

    const status = getCalibrationStatus();

    window.assert.equal(status.isComplete, true, 'isComplete is true');
    window.assert.equal(status.sessionsCompleted, 5, 'sessionsCompleted is 5');
    window.assert.equal(status.shouldShowCelebration, true, 'shouldShowCelebration is true');

    console.log('✅ Test 8 PASSED: getCalibrationStatus() complete + celebration pending');
  } catch (error) {
    console.error('❌ Test 8 FAILED:', error.message);
  }

  // Test 9: getCalibrationStatus() - complete, celebration already shown
  try {
    clearTestData();
    updateProfile({ calibrationComplete: true, sessionsCompleted: 6, celebrationShown: true });

    const status = getCalibrationStatus();

    window.assert.equal(status.isComplete, true, 'isComplete is true');
    window.assert.equal(status.sessionsCompleted, 6, 'sessionsCompleted is 6');
    window.assert.equal(status.shouldShowCelebration, false, 'shouldShowCelebration is false after shown');

    console.log('✅ Test 9 PASSED: getCalibrationStatus() complete + celebration shown');
  } catch (error) {
    console.error('❌ Test 9 FAILED:', error.message);
  }

  // Test 10: setCelebrationShown() marks celebration as displayed
  try {
    clearTestData();
    updateProfile({ calibrationComplete: true, sessionsCompleted: 5, celebrationShown: false });

    // Call setCelebrationShown (Story 15.1 Task 5)
    setCelebrationShown();

    const profile = getProfile();
    window.assert.equal(profile.celebrationShown, true, 'celebrationShown set to true');

    const status = getCalibrationStatus();
    window.assert.equal(status.shouldShowCelebration, false, 'shouldShowCelebration is now false');

    console.log('✅ Test 10 PASSED: setCelebrationShown() updates state');
  } catch (error) {
    console.error('❌ Test 10 FAILED:', error.message);
  }

  // Test 11: Backward compatibility - existing profiles get new fields
  try {
    clearTestData();

    // Simulate old profile format (without new Story 15.1 fields)
    const oldProfile = {
      calibrationComplete: false,
      sessionsCompleted: 2,
      lastPlayedDate: null
      // Missing: calibrationStartDate, celebrationShown
    };
    localStorage.setItem('crazysnakeLite_profile', JSON.stringify(oldProfile));

    // Get profile - should add missing fields
    const profile = getProfile();

    window.assert.isTrue(typeof profile.calibrationStartDate === 'number', 'calibrationStartDate added');
    window.assert.equal(profile.celebrationShown, false, 'celebrationShown added with default false');
    window.assert.equal(profile.sessionsCompleted, 2, 'Existing sessionsCompleted preserved');

    console.log('✅ Test 11 PASSED: Backward compatibility for existing profiles');
  } catch (error) {
    console.error('❌ Test 11 FAILED:', error.message);
  }

  // Test 12: Edge case - null/undefined sessionsCompleted
  try {
    clearTestData();
    updateProfile({ calibrationComplete: false, sessionsCompleted: undefined });

    const status = getCalibrationStatus();
    window.assert.equal(status.sessionsCompleted, 0, 'undefined sessionsCompleted defaults to 0');

    console.log('✅ Test 12 PASSED: Null safety for sessionsCompleted');
  } catch (error) {
    console.error('❌ Test 12 FAILED:', error.message);
  }

  console.log('=== Storage Calibration State Tests Complete ===');

  // Cleanup
  clearTestData();
})();
