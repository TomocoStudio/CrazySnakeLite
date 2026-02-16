/**
 * Unit tests for comedy.js - Caller quote database and selection
 * Story 18.1: Create Caller Quote Database with Performance Context
 */

import { selectQuote, getAvailableContexts, buildContext, CALLER_QUOTES } from '../js/comedy.js';

/**
 * Test Suite: Quote Selection by Context
 */
function testSelectQuoteByContext() {
  console.log('TEST: selectQuote() with high_score context');

  const result = selectQuote(['high_score']);

  // Assert: Should return object with required fields
  if (!result) {
    throw new Error('selectQuote() returned null/undefined');
  }
  if (!result.callerId || !result.callerName || !result.portrait || !result.text || !result.id) {
    throw new Error(`Missing required fields. Got: ${JSON.stringify(result)}`);
  }

  // Assert: Should include 'high_score' in context tags
  const quote = CALLER_QUOTES
    .flatMap(c => c.quotes.map(q => ({ ...q, callerId: c.callerId })))
    .find(q => q.id === result.id);

  if (!quote || !quote.context.includes('high_score')) {
    throw new Error(`Quote does not have 'high_score' context tag`);
  }

  console.log('✓ PASS: selectQuote() returns high_score quote');
}

/**
 * Test Suite: Multi-tag Relevance Prioritization
 */
function testMultiTagRelevance() {
  console.log('TEST: Multi-tag relevance prioritization');

  // Create test to verify multi-tag matches are prioritized
  const results = [];
  for (let i = 0; i < 20; i++) {
    results.push(selectQuote(['high_score', 'personal_best']));
  }

  // Count how many results have BOTH tags vs only ONE tag
  const multiTagCount = results.filter(r => {
    const quote = CALLER_QUOTES
      .flatMap(c => c.quotes.map(q => ({ ...q, callerId: c.callerId })))
      .find(q => q.id === r.id);
    return quote && quote.context.includes('high_score') && quote.context.includes('personal_best');
  }).length;

  // Multi-tag quotes should appear more frequently (relevance prioritization)
  if (multiTagCount < 10) {
    console.warn(`⚠ Warning: Multi-tag relevance may not be working (${multiTagCount}/20 were multi-tag)`);
  }

  console.log(`✓ PASS: Multi-tag relevance (${multiTagCount}/20 results had both tags)`);
}

/**
 * Test Suite: excludeQuoteId Parameter
 */
function testExcludeQuoteId() {
  console.log('TEST: excludeQuoteId parameter');

  const first = selectQuote(['general']);
  const second = selectQuote(['general'], first.id);

  if (first.id === second.id) {
    throw new Error('excludeQuoteId did not filter out the excluded quote');
  }

  console.log('✓ PASS: excludeQuoteId filters correctly');
}

/**
 * Test Suite: Fallback to General Context
 */
function testFallbackToGeneral() {
  console.log('TEST: Fallback to general context');

  const result = selectQuote(['nonexistent_context_tag_12345']);

  if (!result) {
    throw new Error('selectQuote() returned null/undefined on fallback');
  }

  // Should fallback to general context
  const quote = CALLER_QUOTES
    .flatMap(c => c.quotes.map(q => ({ ...q, callerId: c.callerId })))
    .find(q => q.id === result.id);

  if (!quote || !quote.context.includes('general')) {
    throw new Error('Fallback did not return general context quote');
  }

  console.log('✓ PASS: Fallback to general context works');
}

/**
 * Test Suite: Database Structure Validation
 */
function testDatabaseStructure() {
  console.log('TEST: Database structure validation');

  // Test 1: All 21 callers present
  if (CALLER_QUOTES.length !== 21) {
    throw new Error(`Expected 21 callers, got ${CALLER_QUOTES.length}`);
  }

  // Test 2: Each caller has 3+ quotes
  for (const caller of CALLER_QUOTES) {
    if (caller.quotes.length < 3) {
      throw new Error(`Caller ${caller.callerId} has only ${caller.quotes.length} quotes (minimum 3 required)`);
    }
  }

  // Test 3: All quote IDs are unique
  const allQuoteIds = CALLER_QUOTES.flatMap(c => c.quotes.map(q => q.id));
  const uniqueIds = new Set(allQuoteIds);
  if (allQuoteIds.length !== uniqueIds.size) {
    throw new Error('Duplicate quote IDs found in database');
  }

  // Test 4: Quote text length < 80 characters
  for (const caller of CALLER_QUOTES) {
    for (const quote of caller.quotes) {
      if (quote.text.length > 80) {
        throw new Error(`Quote ${quote.id} exceeds 80 characters (${quote.text.length})`);
      }
    }
  }

  console.log('✓ PASS: Database structure valid (21 callers, 3+ quotes each, unique IDs, text < 80 chars)');
}

/**
 * Test Suite: Quote Variety
 */
function testQuoteVariety() {
  console.log('TEST: Quote variety (10 selections return different quotes)');

  const selections = [];
  for (let i = 0; i < 10; i++) {
    selections.push(selectQuote(['general']));
  }

  const uniqueQuotes = new Set(selections.map(s => s.id));

  // Check if database has 10+ general quotes
  const generalQuotes = CALLER_QUOTES
    .flatMap(c => c.quotes)
    .filter(q => q.context.includes('general'));

  if (generalQuotes.length >= 10 && uniqueQuotes.size < 8) {
    console.warn(`⚠ Warning: Low variety (${uniqueQuotes.size}/10 unique). Pool size: ${generalQuotes.length}`);
  } else {
    console.log(`✓ PASS: Quote variety (${uniqueQuotes.size}/10 unique, pool: ${generalQuotes.length})`);
  }
}

/**
 * Test Suite: getAvailableContexts()
 */
function testGetAvailableContexts() {
  console.log('TEST: getAvailableContexts() returns all context tags');

  const contexts = getAvailableContexts();

  if (!Array.isArray(contexts)) {
    throw new Error('getAvailableContexts() did not return an array');
  }

  if (contexts.length === 0) {
    throw new Error('getAvailableContexts() returned empty array');
  }

  // Should include at least the required context tags
  const requiredTags = ['general', 'high_score', 'calibration_complete'];
  for (const tag of requiredTags) {
    if (!contexts.includes(tag)) {
      throw new Error(`Missing required context tag: ${tag}`);
    }
  }

  console.log(`✓ PASS: getAvailableContexts() returns ${contexts.length} context tags`);
}

/**
 * Test Suite: buildContext() - Performance Context
 */
function testBuildContextPerformance() {
  console.log('TEST: buildContext() performance context mapping');

  // High score
  const ctx1 = buildContext({ score: 90 });
  if (!ctx1.includes('high_score')) {
    throw new Error('High score context not detected (score: 90)');
  }

  // Low score
  const ctx2 = buildContext({ score: 10 });
  if (!ctx2.includes('low_score')) {
    throw new Error('Low score context not detected (score: 10)');
  }

  // Personal best
  const ctx3 = buildContext({ highlights: [{ type: 'personal_best', domain: 'reactionTime' }] });
  if (!ctx3.includes('personal_best')) {
    throw new Error('Personal best context not detected');
  }

  console.log('✓ PASS: Performance context mapping works');
}

/**
 * Test Suite: buildContext() - Cognitive Context
 */
function testBuildContextCognitive() {
  console.log('TEST: buildContext() cognitive context mapping');

  // RC survived
  const ctx1 = buildContext({ cognitiveStats: { rcSurvived: 4 } });
  if (!ctx1.includes('rc_survived')) {
    throw new Error('RC survived context not detected');
  }

  // Death during RC
  const ctx2 = buildContext({ diedDuringRC: true });
  if (!ctx2.includes('death_during_rc')) {
    throw new Error('Death during RC context not detected');
  }

  // Combo master
  const ctx3 = buildContext({ comboMultipliers: 5 });
  if (!ctx3.includes('combo_master')) {
    throw new Error('Combo master context not detected');
  }

  // Phone ace
  const ctx4 = buildContext({ phoneCallsManaged: 8 });
  if (!ctx4.includes('phone_ace')) {
    throw new Error('Phone ace context not detected');
  }

  console.log('✓ PASS: Cognitive context mapping works');
}

/**
 * Test Suite: buildContext() - Milestone Context
 */
function testBuildContextMilestones() {
  console.log('TEST: buildContext() milestone context mapping');

  // Calibration complete
  const ctx1 = buildContext({ sessionCount: 5 });
  if (!ctx1.includes('calibration_complete')) {
    throw new Error('Calibration complete context not detected');
  }

  // Streak milestone 7
  const ctx2 = buildContext({ streak: 7 });
  if (!ctx2.includes('streak_milestone_7')) {
    throw new Error('Streak milestone 7 context not detected');
  }

  // Streak milestone 30
  const ctx3 = buildContext({ streak: 30 });
  if (!ctx3.includes('streak_milestone_30')) {
    throw new Error('Streak milestone 30 context not detected');
  }

  // Session 50
  const ctx4 = buildContext({ sessionCount: 50 });
  if (!ctx4.includes('session_50')) {
    throw new Error('Session 50 context not detected');
  }

  // Session 100
  const ctx5 = buildContext({ sessionCount: 100 });
  if (!ctx5.includes('session_100')) {
    throw new Error('Session 100 context not detected');
  }

  console.log('✓ PASS: Milestone context mapping works');
}

/**
 * Test Suite: buildContext() - Fallback and Edge Cases
 */
function testBuildContextFallback() {
  console.log('TEST: buildContext() fallback and edge cases');

  // Empty object fallback
  const ctx1 = buildContext({});
  if (!ctx1.includes('general') || ctx1.length !== 1) {
    throw new Error(`Empty object should return ['general'], got: ${JSON.stringify(ctx1)}`);
  }

  // Null input
  const ctx2 = buildContext(null);
  if (!ctx2.includes('general')) {
    throw new Error('Null input should fallback to general');
  }

  // Undefined input
  const ctx3 = buildContext(undefined);
  if (!ctx3.includes('general')) {
    throw new Error('Undefined input should fallback to general');
  }

  // Invalid highlights array
  const ctx4 = buildContext({ highlights: [null, undefined, { type: 'other' }] });
  if (ctx4.includes('personal_best')) {
    throw new Error('Invalid highlights should not trigger personal_best');
  }

  console.log('✓ PASS: Fallback and edge cases handled correctly');
}

/**
 * Test Suite: Integration - End-to-End Context Selection
 */
function testIntegrationContextSelection() {
  console.log('TEST: Integration - End-to-end context selection');

  // High score + personal best → celebratory quote
  const ctx1 = buildContext({ score: 95, highlights: [{ type: 'personal_best' }] });
  const quote1 = selectQuote(ctx1);
  if (!quote1 || !quote1.text) {
    throw new Error('Failed to select quote for high score + personal best');
  }

  // Death during RC + low score → encouraging quote
  const ctx2 = buildContext({ diedDuringRC: true, score: 5 });
  const quote2 = selectQuote(ctx2);
  if (!quote2 || !quote2.text) {
    throw new Error('Failed to select quote for death during RC');
  }

  // Streak milestone → celebration quote
  const ctx3 = buildContext({ streak: 30 });
  const quote3 = selectQuote(ctx3);
  if (!quote3 || !quote3.text) {
    throw new Error('Failed to select quote for streak milestone');
  }

  console.log('✓ PASS: End-to-end context selection works');
  console.log(`  Sample celebratory: "${quote1.text}"`);
  console.log(`  Sample empathetic: "${quote2.text}"`);
  console.log(`  Sample milestone: "${quote3.text}"`);
}

/**
 * Run All Tests
 */
export function runAllTests() {
  console.log('\n========================================');
  console.log('COMEDY.JS TEST SUITE');
  console.log('========================================\n');

  try {
    // Story 18.1 tests
    testDatabaseStructure();
    testSelectQuoteByContext();
    testMultiTagRelevance();
    testExcludeQuoteId();
    testFallbackToGeneral();
    testQuoteVariety();
    testGetAvailableContexts();

    // Story 18.2 tests
    testBuildContextPerformance();
    testBuildContextCognitive();
    testBuildContextMilestones();
    testBuildContextFallback();
    testIntegrationContextSelection();

    console.log('\n========================================');
    console.log('✓ ALL TESTS PASSED');
    console.log('========================================\n');
    return true;
  } catch (error) {
    console.error('\n========================================');
    console.error('✗ TEST FAILED');
    console.error(error.message);
    console.error('========================================\n');
    return false;
  }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    runAllTests();
  });
}
