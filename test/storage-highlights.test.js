// CrazySnakeLite - Storage Highlights Tests (Story 14.1)
import {
  initStorage,
  saveSession,
  getAllTimeHighs,
  getLastSessionPattern,
  saveSessionPattern
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
    rawEvents: [],
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
  localStorage.removeItem('crazysnakeLite_lastSessionPattern');
}

// Run all storage highlights tests
(async function runStorageHighlightsTests() {
  console.log('=== Storage Highlights Tests (Story 14.1) ===');

  // Clean up before starting
  await clearDatabase();
  clearLocalStorage();

  // Initialize database
  await initStorage();

  // Test 1: getAllTimeHighs() returns all zeros when no sessions exist
  try {
    const highs = await getAllTimeHighs();
    window.assert.isObject(highs, 'getAllTimeHighs returns object');
    window.assert.equal(highs.reactionTime, 0, 'reactionTime is 0 when no sessions');
    window.assert.equal(highs.spatialAwareness, 0, 'spatialAwareness is 0 when no sessions');
    window.assert.equal(highs.cognitiveFlexibility, 0, 'cognitiveFlexibility is 0 when no sessions');
    window.assert.equal(highs.dividedAttention, 0, 'dividedAttention is 0 when no sessions');
    window.assert.equal(highs.impulseControl, 0, 'impulseControl is 0 when no sessions');
    window.assert.equal(highs.workingMemory, 0, 'workingMemory is 0 when no sessions');
  } catch (error) {
    console.error('❌ Test 1 FAILED:', error.message);
  }

  // Test 2: getAllTimeHighs() returns correct max values across multiple sessions
  try {
    // Save 3 sessions with different metric values
    await saveSession(createTestSession({
      metrics: {
        reactionTime: 0.75,
        spatialAwareness: 0.82,
        cognitiveFlexibility: 0.68,
        dividedAttention: 0.71,
        impulseControl: 0.79,
        workingMemory: 0.65
      }
    }));

    await saveSession(createTestSession({
      metrics: {
        reactionTime: 0.90, // Highest
        spatialAwareness: 0.75,
        cognitiveFlexibility: 0.85, // Highest
        dividedAttention: 0.80, // Highest
        impulseControl: 0.70,
        workingMemory: 0.60
      }
    }));

    await saveSession(createTestSession({
      metrics: {
        reactionTime: 0.80,
        spatialAwareness: 0.88, // Highest
        cognitiveFlexibility: 0.70,
        dividedAttention: 0.75,
        impulseControl: 0.92, // Highest
        workingMemory: 0.78 // Highest
      }
    }));

    const highs = await getAllTimeHighs();
    window.assert.equal(highs.reactionTime, 0.90, 'reactionTime max is 0.90');
    window.assert.equal(highs.spatialAwareness, 0.88, 'spatialAwareness max is 0.88');
    window.assert.equal(highs.cognitiveFlexibility, 0.85, 'cognitiveFlexibility max is 0.85');
    window.assert.equal(highs.dividedAttention, 0.80, 'dividedAttention max is 0.80');
    window.assert.equal(highs.impulseControl, 0.92, 'impulseControl max is 0.92');
    window.assert.equal(highs.workingMemory, 0.78, 'workingMemory max is 0.78');
  } catch (error) {
    console.error('❌ Test 2 FAILED:', error.message);
  }

  // Test 3: getAllTimeHighs() handles invalid/missing metrics gracefully
  try {
    await saveSession(createTestSession({
      metrics: {
        reactionTime: NaN, // Invalid
        spatialAwareness: null, // Invalid
        cognitiveFlexibility: undefined, // Missing
        dividedAttention: 0.75,
        impulseControl: 0.80,
        workingMemory: 'invalid' // Invalid type
      }
    }));

    const highs = await getAllTimeHighs();
    // Should still return previous valid highs, not crash
    window.assert.isObject(highs, 'getAllTimeHighs handles invalid metrics');
    window.assert.equal(highs.dividedAttention, 0.80, 'dividedAttention from valid session');
  } catch (error) {
    console.error('❌ Test 3 FAILED:', error.message);
  }

  // Test 4: getLastSessionPattern() returns empty array when no pattern saved
  try {
    clearLocalStorage();
    const pattern = getLastSessionPattern();
    window.assert.isArray(pattern, 'getLastSessionPattern returns array');
    window.assert.equal(pattern.length, 0, 'Pattern is empty array when not saved');
  } catch (error) {
    console.error('❌ Test 4 FAILED:', error.message);
  }

  // Test 5: saveSessionPattern() and getLastSessionPattern() roundtrip
  try {
    const testPattern = ['personal_best', 'improvement', 'notable'];
    saveSessionPattern(testPattern);

    const retrieved = getLastSessionPattern();
    window.assert.isArray(retrieved, 'Retrieved pattern is array');
    window.assert.equal(retrieved.length, 3, 'Pattern has 3 items');
    window.assert.equal(retrieved[0], 'personal_best', 'First item is personal_best');
    window.assert.equal(retrieved[1], 'improvement', 'Second item is improvement');
    window.assert.equal(retrieved[2], 'notable', 'Third item is notable');
  } catch (error) {
    console.error('❌ Test 5 FAILED:', error.message);
  }

  // Test 6: saveSessionPattern() handles invalid input gracefully
  try {
    saveSessionPattern('not-an-array'); // Invalid
    // Should not crash or overwrite previous valid pattern
    const pattern = getLastSessionPattern();
    window.assert.isArray(pattern, 'Pattern remains valid after invalid save');
  } catch (error) {
    console.error('❌ Test 6 FAILED:', error.message);
  }

  // Test 7: saveSessionPattern() handles empty array
  try {
    saveSessionPattern([]);
    const pattern = getLastSessionPattern();
    window.assert.isArray(pattern, 'Empty array pattern is saved');
    window.assert.equal(pattern.length, 0, 'Empty array retrieved correctly');
  } catch (error) {
    console.error('❌ Test 7 FAILED:', error.message);
  }

  // Test 8: getAllTimeHighs() performance target (< 100ms for 100 sessions)
  try {
    // Clear and add 100 sessions
    await clearDatabase();
    await initStorage();

    for (let i = 0; i < 100; i++) {
      await saveSession(createTestSession({
        metrics: {
          reactionTime: Math.random(),
          spatialAwareness: Math.random(),
          cognitiveFlexibility: Math.random(),
          dividedAttention: Math.random(),
          impulseControl: Math.random(),
          workingMemory: Math.random()
        }
      }));
    }

    const startTime = performance.now();
    const highs = await getAllTimeHighs();
    const duration = performance.now() - startTime;

    window.assert.isTrue(duration < 100, `getAllTimeHighs completes in < 100ms (${duration.toFixed(2)}ms)`);
    window.assert.isObject(highs, 'getAllTimeHighs returns valid result after performance test');
  } catch (error) {
    console.error('❌ Test 8 FAILED:', error.message);
  }

  console.log('=== Storage Highlights Tests Complete ===');
})();
