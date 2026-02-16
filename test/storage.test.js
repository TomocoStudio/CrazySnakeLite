// CrazySnakeLite - Storage System Tests (Story 13.1)
import {
  initStorage,
  saveSession,
  getSessions,
  getProfile,
  updateProfile,
  getStreak,
  updateStreak,
  isStorageAvailable
} from '../js/storage.js';

// Helper to generate test session data
function createTestSession(overrides = {}) {
  return {
    sessionId: crypto.randomUUID(),
    timestamp: Date.now(),
    score: 42,
    metrics: {
      reactionTime: 0.75,
      spatialAwareness: 0.82,
      cognitiveFlexibility: 0.68,
      dividedAttention: 0.71,
      impulseControl: 0.79,
      workingMemory: 0.65
    },
    rawEvents: [
      { type: 'food_eaten', timestamp: Date.now(), foodType: 'normal', scoreGained: 1 },
      { type: 'phone_call', timestamp: Date.now() + 1000, decision: 'pickup', bonus: 2 }
    ],
    ...overrides
  };
}

// Helper to clear IndexedDB for clean tests
async function clearDatabase() {
  return new Promise((resolve) => {
    const request = indexedDB.deleteDatabase('CrazySnakeMetrics');
    request.onsuccess = () => resolve();
    request.onerror = () => resolve(); // Fail gracefully
  });
}

// Helper to clear localStorage for clean tests
function clearLocalStorage() {
  localStorage.removeItem('crazysnakeLite_profile');
  localStorage.removeItem('crazysnakeLite_streak');
}

// Run all storage tests
(async function runStorageTests() {
  console.log('=== Storage System Tests (Story 13.1) ===');

  // Clean up before starting
  await clearDatabase();
  clearLocalStorage();

  // Test 1: IndexedDB availability check
  try {
    const available = isStorageAvailable('indexedDB');
    window.assert.isTrue(available, 'IndexedDB is available in browser');
  } catch (error) {
    console.error('❌ Test 1 FAILED:', error.message);
  }

  // Test 2: localStorage availability check
  try {
    const available = isStorageAvailable('localStorage');
    window.assert.isTrue(available, 'localStorage is available in browser');
  } catch (error) {
    console.error('❌ Test 2 FAILED:', error.message);
  }

  // Test 3: IndexedDB initialization creates database
  try {
    const db = await initStorage();
    window.assert.isTrue(db !== null, 'IndexedDB initializes successfully');
    window.assert.equal(db.name, 'CrazySnakeMetrics', 'Database name is CrazySnakeMetrics');
    window.assert.equal(db.version, 1, 'Database version is 1');
  } catch (error) {
    console.error('❌ Test 3 FAILED:', error.message);
  }

  // Test 4: Sessions object store exists with correct schema
  try {
    const db = await initStorage();
    const storeExists = db.objectStoreNames.contains('sessions');
    window.assert.isTrue(storeExists, 'Sessions object store exists');

    // Check indexes by attempting a transaction
    const transaction = db.transaction(['sessions'], 'readonly');
    const store = transaction.objectStore('sessions');

    const hasTimestampIndex = store.indexNames.contains('timestamp');
    const hasScoreIndex = store.indexNames.contains('score');

    window.assert.isTrue(hasTimestampIndex, 'Timestamp index exists on sessions store');
    window.assert.isTrue(hasScoreIndex, 'Score index exists on sessions store');
  } catch (error) {
    console.error('❌ Test 4 FAILED:', error.message);
  }

  // Test 5: Save session to IndexedDB
  try {
    const testSession = createTestSession();
    const success = await saveSession(testSession);
    window.assert.isTrue(success, 'Session saves successfully to IndexedDB');
  } catch (error) {
    console.error('❌ Test 5 FAILED:', error.message);
  }

  // Test 6: Retrieve sessions from IndexedDB
  try {
    const testSession = createTestSession();
    await saveSession(testSession);

    const sessions = await getSessions(10);
    window.assert.isTrue(sessions.length >= 1, 'getSessions retrieves saved sessions');
    window.assert.equal(sessions[0].sessionId, testSession.sessionId, 'Retrieved session matches saved session');
  } catch (error) {
    console.error('❌ Test 6 FAILED:', error.message);
  }

  // Test 7: Sessions returned in newest-first order
  try {
    await clearDatabase();
    await initStorage();

    const session1 = createTestSession({ timestamp: Date.now() - 2000 });
    const session2 = createTestSession({ timestamp: Date.now() - 1000 });
    const session3 = createTestSession({ timestamp: Date.now() });

    await saveSession(session1);
    await saveSession(session2);
    await saveSession(session3);

    const sessions = await getSessions(10);
    window.assert.equal(sessions[0].sessionId, session3.sessionId, 'Most recent session is first');
    window.assert.equal(sessions[1].sessionId, session2.sessionId, 'Second most recent session is second');
    window.assert.equal(sessions[2].sessionId, session1.sessionId, 'Oldest session is last');
  } catch (error) {
    console.error('❌ Test 7 FAILED:', error.message);
  }

  // Test 8: getSessions respects limit parameter
  try {
    const sessions = await getSessions(2);
    window.assert.isTrue(sessions.length <= 2, 'getSessions respects limit parameter');
  } catch (error) {
    console.error('❌ Test 8 FAILED:', error.message);
  }

  // Test 9: Profile initialization returns default values
  try {
    clearLocalStorage();
    const profile = getProfile();
    window.assert.equal(profile.calibrationComplete, false, 'Default calibrationComplete is false');
    window.assert.equal(profile.sessionsCompleted, 0, 'Default sessionsCompleted is 0');
    window.assert.isNull(profile.lastPlayedDate, 'Default lastPlayedDate is null');
  } catch (error) {
    console.error('❌ Test 9 FAILED:', error.message);
  }

  // Test 10: Profile update persists in localStorage
  try {
    clearLocalStorage();
    updateProfile({ calibrationComplete: true, sessionsCompleted: 5 });
    const profile = getProfile();
    window.assert.equal(profile.calibrationComplete, true, 'Profile update persists calibrationComplete');
    window.assert.equal(profile.sessionsCompleted, 5, 'Profile update persists sessionsCompleted');
  } catch (error) {
    console.error('❌ Test 10 FAILED:', error.message);
  }

  // Test 11: Profile update merges with existing data
  try {
    clearLocalStorage();
    updateProfile({ calibrationComplete: true, sessionsCompleted: 5 });
    updateProfile({ sessionsCompleted: 10 }); // Partial update
    const profile = getProfile();
    window.assert.equal(profile.calibrationComplete, true, 'Partial update preserves calibrationComplete');
    window.assert.equal(profile.sessionsCompleted, 10, 'Partial update merges sessionsCompleted');
  } catch (error) {
    console.error('❌ Test 11 FAILED:', error.message);
  }

  // Test 12: Streak initialization returns default values
  try {
    clearLocalStorage();
    const streak = getStreak();
    window.assert.equal(streak.currentStreak, 0, 'Default currentStreak is 0');
    window.assert.equal(streak.longestStreak, 0, 'Default longestStreak is 0');
    window.assert.isNull(streak.lastPlayedDate, 'Default lastPlayedDate is null');
    window.assert.isNull(streak.streakStartDate, 'Default streakStartDate is null');
  } catch (error) {
    console.error('❌ Test 12 FAILED:', error.message);
  }

  // Test 13: Streak update persists in localStorage
  try {
    clearLocalStorage();
    updateStreak({ currentStreak: 12, longestStreak: 30, lastPlayedDate: '2026-02-15' });
    const streak = getStreak();
    window.assert.equal(streak.currentStreak, 12, 'Streak update persists currentStreak');
    window.assert.equal(streak.longestStreak, 30, 'Streak update persists longestStreak');
    window.assert.equal(streak.lastPlayedDate, '2026-02-15', 'Streak update persists lastPlayedDate');
  } catch (error) {
    console.error('❌ Test 13 FAILED:', error.message);
  }

  // Test 14: Streak update merges with existing data
  try {
    clearLocalStorage();
    updateStreak({ currentStreak: 12, longestStreak: 30 });
    updateStreak({ currentStreak: 13 }); // Partial update
    const streak = getStreak();
    window.assert.equal(streak.longestStreak, 30, 'Partial update preserves longestStreak');
    window.assert.equal(streak.currentStreak, 13, 'Partial update merges currentStreak');
  } catch (error) {
    console.error('❌ Test 14 FAILED:', error.message);
  }

  // Test 15: Session data structure contains all required fields
  try {
    const testSession = createTestSession();
    await saveSession(testSession);
    const sessions = await getSessions(1);
    const session = sessions[0];

    window.assert.isTrue('sessionId' in session, 'Session contains sessionId');
    window.assert.isTrue('timestamp' in session, 'Session contains timestamp');
    window.assert.isTrue('score' in session, 'Session contains score');
    window.assert.isTrue('metrics' in session, 'Session contains metrics');
    window.assert.isTrue('rawEvents' in session, 'Session contains rawEvents');

    // Check metrics structure
    window.assert.isTrue('reactionTime' in session.metrics, 'Metrics contains reactionTime');
    window.assert.isTrue('spatialAwareness' in session.metrics, 'Metrics contains spatialAwareness');
    window.assert.isTrue('cognitiveFlexibility' in session.metrics, 'Metrics contains cognitiveFlexibility');
    window.assert.isTrue('dividedAttention' in session.metrics, 'Metrics contains dividedAttention');
    window.assert.isTrue('impulseControl' in session.metrics, 'Metrics contains impulseControl');
    window.assert.isTrue('workingMemory' in session.metrics, 'Metrics contains workingMemory');
  } catch (error) {
    console.error('❌ Test 15 FAILED:', error.message);
  }

  // Test 16: Storage footprint validation (< 50KB per session)
  try {
    const testSession = createTestSession();
    const sessionJSON = JSON.stringify(testSession);
    const sizeInBytes = new Blob([sessionJSON]).size;
    const sizeInKB = sizeInBytes / 1024;

    window.assert.isTrue(sizeInKB < 50, `Session size ${sizeInKB.toFixed(2)}KB is under 50KB limit`);
  } catch (error) {
    console.error('❌ Test 16 FAILED:', error.message);
  }

  console.log('=== Storage Tests Complete ===');
})();
