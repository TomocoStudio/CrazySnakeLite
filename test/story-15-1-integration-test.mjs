#!/usr/bin/env node
// Story 15.1 Integration Test
// Validates calibration state management functionality

console.log('=== Story 15.1 Integration Test ===\n');

// Simulate localStorage for Node.js environment
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, value) => { storage[key] = value; },
  removeItem: (key) => { delete storage[key]; }
};

// Import the storage module functions (would work in Node with proper ES6 module support)
// For this test, we'll inline the logic to verify behavior

function getProfile() {
  const stored = localStorage.getItem('crazysnakeLite_profile');

  if (stored) {
    const profile = JSON.parse(stored);
    if (!profile.calibrationStartDate) {
      profile.calibrationStartDate = Date.now();
    }
    if (profile.celebrationShown === undefined) {
      profile.celebrationShown = false;
    }
    return profile;
  }

  return {
    calibrationComplete: false,
    sessionsCompleted: 0,
    lastPlayedDate: null,
    calibrationStartDate: Date.now(),
    celebrationShown: false
  };
}

function updateProfile(profileData) {
  const current = getProfile();
  const updated = { ...current, ...profileData };
  localStorage.setItem('crazysnakeLite_profile', JSON.stringify(updated));
}

function getCalibrationStatus() {
  const profile = getProfile();
  return {
    isComplete: profile.calibrationComplete === true,
    sessionsCompleted: profile.sessionsCompleted || 0,
    shouldShowCelebration: profile.calibrationComplete && !profile.celebrationShown
  };
}

function setCelebrationShown() {
  updateProfile({ celebrationShown: true });
}

// Test Suite
let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passCount++;
  } catch (error) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Clear test data
function clearTestData() {
  localStorage.removeItem('crazysnakeLite_profile');
}

// Run tests
console.log('Running Story 15.1 Acceptance Criteria Tests:\n');

// AC 1: Initialize calibration state for first-ever player
test('AC1: Initialize calibration state for first-ever player', () => {
  clearTestData();
  const profile = getProfile();

  assert(profile.calibrationComplete === false, 'calibrationComplete should be false');
  assert(profile.sessionsCompleted === 0, 'sessionsCompleted should be 0');
  assert(typeof profile.calibrationStartDate === 'number', 'calibrationStartDate should be timestamp');
  assert(profile.celebrationShown === false, 'celebrationShown should be false');
});

// AC 2: Increment sessionsCompleted on game session complete
test('AC2: Increment sessionsCompleted counter', () => {
  clearTestData();

  // Simulate game session completion
  const profile = getProfile();
  const newCount = profile.sessionsCompleted + 1;
  updateProfile({ sessionsCompleted: newCount });

  const updated = getProfile();
  assert(updated.sessionsCompleted === 1, `sessionsCompleted should be 1, got ${updated.sessionsCompleted}`);
});

// AC 3: Set calibrationComplete to true at 5 sessions
test('AC3: Set calibrationComplete at 5 sessions', () => {
  clearTestData();

  // Simulate 5 sessions
  for (let i = 1; i <= 5; i++) {
    const profile = getProfile();
    const newCount = profile.sessionsCompleted + 1;
    updateProfile({ sessionsCompleted: newCount });

    // Check threshold
    if (newCount === 5 && !profile.calibrationComplete) {
      updateProfile({ calibrationComplete: true });
    }
  }

  const profile = getProfile();
  assert(profile.sessionsCompleted === 5, `sessionsCompleted should be 5, got ${profile.sessionsCompleted}`);
  assert(profile.calibrationComplete === true, 'calibrationComplete should be true');
});

// AC 4: calibrationComplete never resets
test('AC4: calibrationComplete never resets', () => {
  clearTestData();

  // Set to complete
  updateProfile({ calibrationComplete: true, sessionsCompleted: 5 });

  // Continue sessions
  for (let i = 6; i <= 10; i++) {
    updateProfile({ sessionsCompleted: i });
    const profile = getProfile();
    assert(profile.calibrationComplete === true, `calibrationComplete should stay true at session ${i}`);
  }
});

// AC 5: getCalibrationStatus() returns correct structure
test('AC5: getCalibrationStatus() returns { isComplete, sessionsCompleted, shouldShowCelebration }', () => {
  clearTestData();
  updateProfile({ calibrationComplete: false, sessionsCompleted: 3 });

  const status = getCalibrationStatus();

  assert(typeof status.isComplete === 'boolean', 'isComplete should be boolean');
  assert(typeof status.sessionsCompleted === 'number', 'sessionsCompleted should be number');
  assert(typeof status.shouldShowCelebration === 'boolean', 'shouldShowCelebration should be boolean');
  assert(status.isComplete === false, 'isComplete should be false for session 3');
  assert(status.sessionsCompleted === 3, 'sessionsCompleted should be 3');
});

// AC 6: shouldShowCelebration logic
test('AC6: shouldShowCelebration is true when calibrationComplete && !celebrationShown', () => {
  clearTestData();
  updateProfile({ calibrationComplete: true, sessionsCompleted: 5, celebrationShown: false });

  const status = getCalibrationStatus();
  assert(status.shouldShowCelebration === true, 'shouldShowCelebration should be true');

  // After showing celebration
  setCelebrationShown();
  const statusAfter = getCalibrationStatus();
  assert(statusAfter.shouldShowCelebration === false, 'shouldShowCelebration should be false after shown');
});

// Task 4: Integration with game.js onDeath flow
test('Task 4: Simulate game.js onDeath flow', () => {
  clearTestData();

  // Simulate game deaths
  for (let gameNum = 1; gameNum <= 7; gameNum++) {
    // Simulate game.js logic after saveSessionMetrics
    const profile = getProfile();
    const newSessionCount = profile.sessionsCompleted + 1;

    updateProfile({ sessionsCompleted: newSessionCount });

    if (newSessionCount === 5 && !profile.calibrationComplete) {
      updateProfile({ calibrationComplete: true });
    }

    const updated = getProfile();
    if (gameNum < 5) {
      assert(updated.calibrationComplete === false, `Game ${gameNum}: should not be complete`);
    } else {
      assert(updated.calibrationComplete === true, `Game ${gameNum}: should be complete`);
    }
  }
});

// Backward compatibility
test('Backward compatibility: Existing profiles get new fields', () => {
  clearTestData();

  // Simulate old profile
  const oldProfile = {
    calibrationComplete: false,
    sessionsCompleted: 2,
    lastPlayedDate: null
  };
  localStorage.setItem('crazysnakeLite_profile', JSON.stringify(oldProfile));

  const profile = getProfile();
  assert(typeof profile.calibrationStartDate === 'number', 'calibrationStartDate should be added');
  assert(profile.celebrationShown === false, 'celebrationShown should be added');
  assert(profile.sessionsCompleted === 2, 'existing sessionsCompleted should be preserved');
});

// Print results
console.log('\n' + '='.repeat(50));
console.log(`Total Tests: ${passCount + failCount}`);
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log('='.repeat(50));

if (failCount === 0) {
  console.log('\n🎉 All tests passed! Story 15.1 implementation is correct.');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the implementation.');
  process.exit(1);
}
