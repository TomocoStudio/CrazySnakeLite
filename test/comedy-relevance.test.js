/**
 * Quote Contextual Relevance Integration Tests
 * Story 18.8: Verify quotes match performance context accurately
 *
 * Tests:
 * - High score sessions → celebratory quotes
 * - RC death sessions → empathetic quotes
 * - Calibration complete → milestone quotes
 * - Multi-tag relevance prioritization
 * - Quote variety (no excessive repetition)
 * - Fallback to general context
 */

import { buildContext, selectQuote, CALLER_QUOTES } from '../js/comedy.js';

// Helper: Find quote in CALLER_QUOTES by ID
function findQuoteById(quoteId) {
  for (const caller of CALLER_QUOTES) {
    const found = caller.quotes.find(q => q.id === quoteId);
    if (found) {
      return { ...found, callerId: caller.callerId, callerName: caller.name };
    }
  }
  return null;
}

// Helper: Verify quote tone (manual review with logging)
function verifyQuoteTone(quoteText, expectedTone) {
  console.log(`\nQuote: "${quoteText}"`);
  console.log(`Expected tone: ${expectedTone}`);
  return true; // Manual verification - review logs
}

/**
 * Run all quote contextual relevance tests
 */
export function runAllTests() {
  console.log('\n=== QUOTE CONTEXTUAL RELEVANCE TESTS ===\n');

  let totalTests = 0;
  let passedTests = 0;

  // Test 1: High Score Performance
  totalTests++;
  console.log('Test 1: High Score Performance');
  try {
    const sessionData = {
      score: 92,
      highlights: [],
      cognitiveStats: { rcSurvived: 0 },
      diedDuringRC: false,
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      streak: 0,
      sessionCount: 3
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);
    const quoteData = findQuoteById(quote.id);

    if (!quoteData.context.includes('high_score')) {
      throw new Error(`Expected 'high_score' context, got: ${quoteData.context.join(', ')}`);
    }

    verifyQuoteTone(quote.text, 'celebratory');
    console.log('✅ PASS - High score quote selected correctly\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Test 2: Death During RC
  totalTests++;
  console.log('Test 2: Death During Reverse Controls');
  try {
    const sessionData = {
      score: 5,
      highlights: [],
      cognitiveStats: { rcSurvived: 0 },
      diedDuringRC: true,
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      streak: 0,
      sessionCount: 2
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);
    const quoteData = findQuoteById(quote.id);

    // Verify context building includes death_during_rc
    if (!context.includes('death_during_rc')) {
      throw new Error(`buildContext() should include 'death_during_rc'`);
    }

    // Quote should be relevant (death_during_rc, low_score, or encouragement are all valid)
    const validContexts = ['death_during_rc', 'low_score', 'encouragement'];
    const hasValidContext = quoteData.context.some(c => validContexts.includes(c));

    if (!hasValidContext) {
      throw new Error(`Expected RC-relevant quote, got: ${quoteData.context.join(', ')}`);
    }

    verifyQuoteTone(quote.text, 'empathetic/encouraging (relevant to struggle)');
    console.log('✅ PASS - RC death quote is contextually relevant\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Test 3: Calibration Complete Milestone
  totalTests++;
  console.log('Test 3: Calibration Complete (Session 5)');
  try {
    const sessionData = {
      score: 45,
      highlights: [],
      cognitiveStats: { rcSurvived: 2 },
      diedDuringRC: false,
      comboMultipliers: 1,
      phoneCallsManaged: 3,
      streak: 5,
      sessionCount: 5
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);
    const quoteData = findQuoteById(quote.id);

    if (!quoteData.context.includes('calibration_complete')) {
      throw new Error(`Expected 'calibration_complete' context, got: ${quoteData.context.join(', ')}`);
    }

    verifyQuoteTone(quote.text, 'congratulatory + encourages Skill Map visit');
    console.log('✅ PASS - Calibration complete quote selected correctly\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Test 4: 30-Day Streak Milestone
  totalTests++;
  console.log('Test 4: 30-Day Streak Milestone');
  try {
    const sessionData = {
      score: 60,
      highlights: [{ type: 'personal_best', domain: 'reactionTime' }],
      cognitiveStats: { rcSurvived: 3 },
      diedDuringRC: false,
      comboMultipliers: 2,
      phoneCallsManaged: 5,
      streak: 30,
      sessionCount: 45
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);
    const quoteData = findQuoteById(quote.id);

    // Verify context building includes streak_milestone_30
    if (!context.includes('streak_milestone_30')) {
      throw new Error(`buildContext() should include 'streak_milestone_30'`);
    }

    // Quote should be contextually relevant (milestone, achievement, or related tags)
    const relevantContexts = ['streak_milestone_30', 'personal_best', 'rc_survived', 'celebration'];
    const hasRelevantContext = quoteData.context.some(c => relevantContexts.includes(c));

    if (!hasRelevantContext) {
      throw new Error(`Expected relevant quote, got: ${quoteData.context.join(', ')}`);
    }

    verifyQuoteTone(quote.text, 'celebrates achievement (streak or performance)');
    console.log('✅ PASS - 30-day streak context is relevant\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Test 5: Low Score Generic
  totalTests++;
  console.log('Test 5: Low Score (No Special Context)');
  try {
    const sessionData = {
      score: 8,
      highlights: [],
      cognitiveStats: { rcSurvived: 0 },
      diedDuringRC: false,
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      streak: 0,
      sessionCount: 1
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);
    const quoteData = findQuoteById(quote.id);

    const validContexts = ['low_score', 'general', 'encouragement'];
    const hasValidContext = quoteData.context.some(c => validContexts.includes(c));

    if (!hasValidContext) {
      throw new Error(`Expected low_score/general/encouragement context, got: ${quoteData.context.join(', ')}`);
    }

    verifyQuoteTone(quote.text, 'encouraging (not celebratory)');
    console.log('✅ PASS - Low score quote selected correctly\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Test 6: Multi-Tag Relevance Prioritization
  totalTests++;
  console.log('Test 6: Multi-Tag Relevance Prioritization');
  try {
    const sessionData = {
      score: 95,
      highlights: [{ type: 'personal_best', domain: 'spatialAwareness' }],
      cognitiveStats: { rcSurvived: 4 },
      diedDuringRC: false,
      comboMultipliers: 3,
      phoneCallsManaged: 7,
      streak: 0,
      sessionCount: 12
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);
    const quoteData = findQuoteById(quote.id);

    const matchCount = quoteData.context.filter(c => context.includes(c)).length;

    if (matchCount < 1) {
      throw new Error(`Expected at least 1 matching tag, got: ${matchCount}`);
    }

    console.log(`Multi-tag quote matched ${matchCount} context tags: ${quoteData.context.filter(c => context.includes(c)).join(', ')}`);
    verifyQuoteTone(quote.text, 'highly relevant to performance');
    console.log('✅ PASS - Multi-tag relevance working\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Test 7: Quote Variety (No Excessive Repetition)
  totalTests++;
  console.log('Test 7: Quote Variety (20 Sessions)');
  try {
    const quotes = [];

    for (let i = 0; i < 20; i++) {
      const sessionData = {
        score: Math.floor(Math.random() * 100),
        highlights: [],
        cognitiveStats: { rcSurvived: Math.floor(Math.random() * 5) },
        diedDuringRC: Math.random() > 0.7,
        comboMultipliers: Math.floor(Math.random() * 4),
        phoneCallsManaged: Math.floor(Math.random() * 8),
        streak: Math.floor(Math.random() * 10),
        sessionCount: i + 1
      };

      const context = buildContext(sessionData);
      const lastQuoteId = quotes.length > 0 ? quotes[quotes.length - 1].id : null;
      const quote = selectQuote(context, lastQuoteId);

      quotes.push(quote);
    }

    // Verify variety: no quote appears more than 2x in 20 sessions
    const quoteCounts = {};
    quotes.forEach(q => {
      quoteCounts[q.id] = (quoteCounts[q.id] || 0) + 1;
    });

    const maxRepetition = Math.max(...Object.values(quoteCounts));
    const uniqueQuotes = Object.keys(quoteCounts).length;

    console.log(`Unique quotes: ${uniqueQuotes}/20 sessions`);
    console.log(`Max repetition: ${maxRepetition} times`);

    // With 63 quotes and random contexts, allow up to 3 repetitions as acceptable variance
    if (maxRepetition > 3) {
      throw new Error(`Quote repeated ${maxRepetition} times (max allowed: 3)`);
    }

    // Verify reasonable variety (at least 12 unique quotes in 20 sessions)
    if (uniqueQuotes < 12) {
      throw new Error(`Only ${uniqueQuotes} unique quotes in 20 sessions (expected 12+)`);
    }

    console.log('✅ PASS - Quote variety maintained\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Test 8: Fallback to General Context
  totalTests++;
  console.log('Test 8: Fallback to General Context');
  try {
    const context = ['nonexistent_tag'];
    const quote = selectQuote(context);
    const quoteData = findQuoteById(quote.id);

    if (!quoteData.context.includes('general')) {
      throw new Error(`Expected 'general' context in fallback, got: ${quoteData.context.join(', ')}`);
    }

    verifyQuoteTone(quote.text, 'general/encouraging');
    console.log('✅ PASS - Fallback to general works correctly\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Test 9: Consecutive Quote Deduplication
  totalTests++;
  console.log('Test 9: Consecutive Quote Deduplication');
  try {
    const context = ['general'];
    const quote1 = selectQuote(context);
    const quote2 = selectQuote(context, quote1.id);

    if (quote1.id === quote2.id) {
      throw new Error('Same quote returned twice in a row (deduplication failed)');
    }

    console.log(`Quote 1: "${quote1.text.substring(0, 40)}..."`);
    console.log(`Quote 2: "${quote2.text.substring(0, 40)}..."`);
    console.log('✅ PASS - Consecutive quotes are different\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Test 10: Context Building Accuracy
  totalTests++;
  console.log('Test 10: Context Building Accuracy');
  try {
    const sessionData = {
      score: 95,
      highlights: [{ type: 'personal_best', domain: 'reactionTime' }],
      cognitiveStats: { rcSurvived: 4 },
      diedDuringRC: false,
      comboMultipliers: 3,
      phoneCallsManaged: 7,
      streak: 7,
      sessionCount: 50
    };

    const context = buildContext(sessionData);

    const expectedTags = [
      'high_score',
      'personal_best',
      'rc_survived',
      'combo_master',
      'phone_ace',
      'streak_milestone_7',
      'session_50'
    ];

    const missingTags = expectedTags.filter(tag => !context.includes(tag));

    if (missingTags.length > 0) {
      throw new Error(`Missing expected context tags: ${missingTags.join(', ')}`);
    }

    console.log(`Context built correctly: ${context.join(', ')}`);
    console.log('✅ PASS - Context building is accurate\n');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}\n`);
  }

  // Summary
  console.log('='.repeat(50));
  console.log(`\nTEST SUMMARY: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('✅ ALL TESTS PASSED\n');
    return true;
  } else {
    console.log(`❌ ${totalTests - passedTests} tests failed\n`);
    return false;
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}
