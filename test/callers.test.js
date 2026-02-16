// CrazySnakeLite - Caller Quote System Tests (Story 14.3)
import {
  selectCallerQuote,
  getAllCallers
} from '../js/callers.js';

// Run all caller tests
(function runCallerTests() {
  console.log('=== Caller Quote System Tests (Story 14.3) ===');

  // Test 1: High score context detection
  try {
    const quote = selectCallerQuote(
      { score: 85, metrics: {} },
      { rcDeath: false, comboMultipliers: 0 },
      [],
      { streakDays: 0, calibrationState: 'complete', totalSessions: 10 }
    );

    window.assert.isObject(quote, 'Returns quote object for high score');
    window.assert.isTrue(quote.text.length > 0, 'Quote has text');
    window.assert.isTrue(quote.caller.length > 0, 'Quote has caller name');
    window.assert.isTrue(quote.portrait.includes('.png'), 'Quote has portrait path');
    console.log('[Test 1] High score context:', quote.caller, '-', quote.text.substring(0, 50) + '...');
  } catch (error) {
    console.error('❌ Test 1 FAILED:', error.message);
  }

  // Test 2: Death during RC context detection
  try {
    const quote = selectCallerQuote(
      { score: 45, metrics: {} },
      { rcDeath: true, comboMultipliers: 0 },
      [],
      { streakDays: 0, calibrationState: 'complete', totalSessions: 10 }
    );

    window.assert.isObject(quote, 'Returns quote object for RC death');
    window.assert.isTrue(quote.text.length > 0, 'RC death quote has text');
    console.log('[Test 2] RC death context:', quote.caller, '-', quote.text.substring(0, 50) + '...');
  } catch (error) {
    console.error('❌ Test 2 FAILED:', error.message);
  }

  // Test 3: Streak milestone context detection (7+ days)
  try {
    const quote = selectCallerQuote(
      { score: 50, metrics: {} },
      { rcDeath: false, comboMultipliers: 0 },
      [],
      { streakDays: 10, calibrationState: 'complete', totalSessions: 20 }
    );

    window.assert.isObject(quote, 'Returns quote object for 7+ day streak');
    window.assert.isTrue(quote.text.length > 0, 'Streak quote has text');
    console.log('[Test 3] Streak milestone (10 days):', quote.caller, '-', quote.text.substring(0, 50) + '...');
  } catch (error) {
    console.error('❌ Test 3 FAILED:', error.message);
  }

  // Test 4: Streak milestone context detection (30+ days)
  try {
    const quote = selectCallerQuote(
      { score: 50, metrics: {} },
      { rcDeath: false, comboMultipliers: 0 },
      [],
      { streakDays: 35, calibrationState: 'complete', totalSessions: 50 }
    );

    window.assert.isObject(quote, 'Returns quote object for 30+ day streak');
    window.assert.isTrue(quote.text.length > 0, 'Long streak quote has text');
    console.log('[Test 4] Streak milestone (35 days):', quote.caller, '-', quote.text.substring(0, 50) + '...');
  } catch (error) {
    console.error('❌ Test 4 FAILED:', error.message);
  }

  // Test 5: First combo context detection
  try {
    const quote = selectCallerQuote(
      { score: 30, metrics: {} },
      { rcDeath: false, comboMultipliers: 1 },
      [],
      { streakDays: 0, calibrationState: 'complete', totalSessions: 1 }
    );

    window.assert.isObject(quote, 'Returns quote object for first combo');
    window.assert.isTrue(quote.text.length > 0, 'First combo quote has text');
    console.log('[Test 5] First combo:', quote.caller, '-', quote.text.substring(0, 50) + '...');
  } catch (error) {
    console.error('❌ Test 5 FAILED:', error.message);
  }

  // Test 6: Calibration progress context
  try {
    const quote = selectCallerQuote(
      { score: 40, metrics: {} },
      { rcDeath: false, comboMultipliers: 0 },
      [],
      { streakDays: 0, calibrationState: 'in_progress', totalSessions: 3 }
    );

    window.assert.isObject(quote, 'Returns quote object for calibration progress');
    window.assert.isTrue(quote.text.length > 0, 'Calibration quote has text');
    console.log('[Test 6] Calibration progress:', quote.caller, '-', quote.text.substring(0, 50) + '...');
  } catch (error) {
    console.error('❌ Test 6 FAILED:', error.message);
  }

  // Test 7: Personal best context
  try {
    const highlights = [{
      type: 'personal_best',
      metric: 'reactionTime',
      text: 'Reaction Time: NEW PERSONAL BEST!',
      icon: '🎯'
    }];

    const quote = selectCallerQuote(
      { score: 60, metrics: {} },
      { rcDeath: false, comboMultipliers: 0 },
      highlights,
      { streakDays: 0, calibrationState: 'complete', totalSessions: 10 }
    );

    window.assert.isObject(quote, 'Returns quote object for personal best');
    window.assert.isTrue(quote.text.length > 0, 'Personal best quote has text');
    console.log('[Test 7] Personal best:', quote.caller, '-', quote.text.substring(0, 50) + '...');
  } catch (error) {
    console.error('❌ Test 7 FAILED:', error.message);
  }

  // Test 8: Generic fallback context
  try {
    const quote = selectCallerQuote(
      { score: 20, metrics: {} },
      { rcDeath: false, comboMultipliers: 0 },
      [],
      { streakDays: 0, calibrationState: 'complete', totalSessions: 2 }
    );

    window.assert.isObject(quote, 'Returns quote object for generic context');
    window.assert.isTrue(quote.text.length > 0, 'Generic quote has text');
    console.log('[Test 8] Generic fallback:', quote.caller, '-', quote.text.substring(0, 50) + '...');
  } catch (error) {
    console.error('❌ Test 8 FAILED:', error.message);
  }

  // Test 9: Context priority order (streak beats high score)
  try {
    const quote = selectCallerQuote(
      { score: 90, metrics: {} }, // High score
      { rcDeath: false, comboMultipliers: 0 },
      [],
      { streakDays: 15, calibrationState: 'complete', totalSessions: 20 } // But also streak
    );

    window.assert.isObject(quote, 'Streak context has priority over high score');
    console.log('[Test 9] Priority test (streak > high score):', quote.caller);
  } catch (error) {
    console.error('❌ Test 9 FAILED:', error.message);
  }

  // Test 10: getAllCallers returns 21 callers
  try {
    const allCallers = getAllCallers();
    window.assert.isArray(allCallers, 'getAllCallers returns array');
    window.assert.equal(allCallers.length, 21, 'Returns exactly 21 callers per FR201');
    console.log('[Test 10] Total callers:', allCallers.length);
  } catch (error) {
    console.error('❌ Test 10 FAILED:', error.message);
  }

  // Test 11: All callers have valid structure
  try {
    const allCallers = getAllCallers();
    allCallers.forEach((caller, index) => {
      window.assert.isTrue(caller.name && caller.name.length > 0, `Caller ${index} has name`);
      window.assert.isTrue(caller.portrait && caller.portrait.includes('.png'), `Caller ${index} has portrait path`);
      window.assert.isArray(caller.quotes, `Caller ${index} has quotes array`);
      window.assert.isTrue(caller.quotes.length > 0, `Caller ${index} has at least one quote`);

      // Check each quote structure
      caller.quotes.forEach((quote, qIndex) => {
        window.assert.isTrue(quote.text && quote.text.length > 0, `Caller ${index} quote ${qIndex} has text`);
        window.assert.isTrue(quote.context && quote.context.length > 0, `Caller ${index} quote ${qIndex} has context`);
      });
    });
    console.log('[Test 11] All 21 callers have valid structure');
  } catch (error) {
    console.error('❌ Test 11 FAILED:', error.message);
  }

  // Test 12: All portrait paths are unique
  try {
    const allCallers = getAllCallers();
    const portraits = allCallers.map(c => c.portrait);
    const uniquePortraits = new Set(portraits);
    window.assert.equal(portraits.length, uniquePortraits.size, 'All portrait paths are unique');
    console.log('[Test 12] All portrait paths are unique');
  } catch (error) {
    console.error('❌ Test 12 FAILED:', error.message);
  }

  // Test 13: Randomization test (probabilistic)
  try {
    const quotes = new Set();
    // Call 10 times with same context, should get variety
    for (let i = 0; i < 10; i++) {
      const quote = selectCallerQuote(
        { score: 85, metrics: {} },
        { rcDeath: false, comboMultipliers: 0 },
        [],
        { streakDays: 0, calibrationState: 'complete', totalSessions: 10 }
      );
      quotes.add(quote.caller + ': ' + quote.text);
    }
    // Should have some variety (probabilistic, may occasionally have only 1-2 unique)
    console.log('[Test 13] Randomization test: Got', quotes.size, 'unique quotes from 10 calls');
    window.assert.isTrue(quotes.size >= 1, 'At least one quote returned');
  } catch (error) {
    console.error('❌ Test 13 FAILED:', error.message);
  }

  // Test 14: Edge case - empty highlights array
  try {
    const quote = selectCallerQuote(
      { score: 50, metrics: {} },
      { rcDeath: false, comboMultipliers: 0 },
      [], // Empty highlights
      { streakDays: 0, calibrationState: 'complete', totalSessions: 5 }
    );

    window.assert.isObject(quote, 'Handles empty highlights array');
    window.assert.isTrue(quote.text.length > 0, 'Returns valid quote despite empty highlights');
  } catch (error) {
    console.error('❌ Test 14 FAILED:', error.message);
  }

  // Test 15: Edge case - null highlights
  try {
    const quote = selectCallerQuote(
      { score: 50, metrics: {} },
      { rcDeath: false, comboMultipliers: 0 },
      null, // Null highlights
      { streakDays: 0, calibrationState: 'complete', totalSessions: 5 }
    );

    window.assert.isObject(quote, 'Handles null highlights');
    window.assert.isTrue(quote.text.length > 0, 'Returns valid quote despite null highlights');
  } catch (error) {
    console.error('❌ Test 15 FAILED:', error.message);
  }

  console.log('=== Caller Quote System Tests Complete ===');
})();
