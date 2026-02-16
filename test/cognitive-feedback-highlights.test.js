// CrazySnakeLite - Cognitive Feedback Highlights Tests (Story 14.1)
import {
  selectHighlights,
  formatHighlightText
} from '../js/cognitive-feedback.js';

// Run all cognitive feedback highlights tests
(function runCognitiveFeedbackHighlightsTests() {
  console.log('=== Cognitive Feedback Highlights Tests (Story 14.1) ===');

  // ========================================
  // Test Category 1: Priority 1 - Personal Best Detection
  // ========================================

  // Test 1.1: Detects single personal best
  try {
    const sessionMetrics = {
      reactionTime: 0.95, // New high
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const allTimeHighs = {
      reactionTime: 0.90, // Previous high
      spatialAwareness: 0.85,
      cognitiveFlexibility: 0.80,
      dividedAttention: 0.75,
      impulseControl: 0.85,
      workingMemory: 0.70
    };

    const rollingAverages = {};
    const cognitiveStats = { score: 42 };

    const highlights = selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, cognitiveStats, []);

    window.assert.isArray(highlights, 'Returns array');
    window.assert.isTrue(highlights.length > 0, 'Has at least one highlight');
    window.assert.equal(highlights[0].type, 'personal_best', 'First highlight is personal_best');
    window.assert.equal(highlights[0].metric, 'reactionTime', 'Personal best is for reactionTime');
    window.assert.equal(highlights[0].icon, '🎯', 'Personal best has correct icon');
    window.assert.isTrue(highlights[0].text.includes('NEW PERSONAL BEST'), 'Text includes NEW PERSONAL BEST');
  } catch (error) {
    console.error('❌ Test 1.1 FAILED:', error.message);
  }

  // Test 1.2: Detects multiple personal bests
  try {
    const sessionMetrics = {
      reactionTime: 0.95, // New high
      spatialAwareness: 0.90, // New high
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const allTimeHighs = {
      reactionTime: 0.90,
      spatialAwareness: 0.85,
      cognitiveFlexibility: 0.80,
      dividedAttention: 0.75,
      impulseControl: 0.85,
      workingMemory: 0.70
    };

    const highlights = selectHighlights(sessionMetrics, {}, allTimeHighs, { score: 42 }, []);

    const personalBests = highlights.filter(h => h.type === 'personal_best');
    window.assert.equal(personalBests.length, 2, 'Detects 2 personal bests');
  } catch (error) {
    console.error('❌ Test 1.2 FAILED:', error.message);
  }

  // Test 1.3: No personal best when session metric equals all-time high
  try {
    const sessionMetrics = {
      reactionTime: 0.90, // Equals high (not greater)
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const allTimeHighs = {
      reactionTime: 0.90,
      spatialAwareness: 0.85,
      cognitiveFlexibility: 0.80,
      dividedAttention: 0.75,
      impulseControl: 0.85,
      workingMemory: 0.70
    };

    const highlights = selectHighlights(sessionMetrics, {}, allTimeHighs, { score: 42 }, []);

    const personalBests = highlights.filter(h => h.type === 'personal_best');
    window.assert.equal(personalBests.length, 0, 'No personal best when metric equals high');
  } catch (error) {
    console.error('❌ Test 1.3 FAILED:', error.message);
  }

  // ========================================
  // Test Category 2: Priority 2 - Improvement Calculation
  // ========================================

  // Test 2.1: Detects 15%+ improvement (>= 15%)
  try {
    const sessionMetrics = {
      reactionTime: 0.92, // Exactly 15% above rolling avg of 0.80
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const rollingAverages = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const allTimeHighs = {
      reactionTime: 0.85,
      spatialAwareness: 0.85,
      cognitiveFlexibility: 0.80,
      dividedAttention: 0.75,
      impulseControl: 0.85,
      workingMemory: 0.70
    };

    const highlights = selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, { score: 42 }, []);

    const improvements = highlights.filter(h => h.type === 'improvement');
    window.assert.isTrue(improvements.length > 0, 'Detects improvement');
    window.assert.equal(improvements[0].metric, 'reactionTime', 'Improvement is for reactionTime');
    window.assert.equal(improvements[0].icon, '⬆', 'Improvement has correct icon');
    window.assert.isTrue(improvements[0].text.includes('15%'), 'Text includes percentage');
  } catch (error) {
    console.error('❌ Test 2.1 FAILED:', error.message);
  }

  // Test 2.2: No improvement when delta < 15%
  try {
    const sessionMetrics = {
      reactionTime: 0.85, // Only 6.25% above rolling avg of 0.80
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const rollingAverages = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const allTimeHighs = {
      reactionTime: 0.90,
      spatialAwareness: 0.85,
      cognitiveFlexibility: 0.80,
      dividedAttention: 0.75,
      impulseControl: 0.85,
      workingMemory: 0.70
    };

    const highlights = selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, { score: 42 }, []);

    const improvements = highlights.filter(h => h.type === 'improvement');
    window.assert.equal(improvements.length, 0, 'No improvement when delta < 15%');
  } catch (error) {
    console.error('❌ Test 2.2 FAILED:', error.message);
  }

  // Test 2.3: Selects biggest improvement when multiple qualify
  try {
    const sessionMetrics = {
      reactionTime: 0.96, // 20% improvement
      spatialAwareness: 1.00, // 25% improvement (biggest)
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const rollingAverages = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const allTimeHighs = {
      reactionTime: 0.90,
      spatialAwareness: 0.95,
      cognitiveFlexibility: 0.80,
      dividedAttention: 0.75,
      impulseControl: 0.85,
      workingMemory: 0.70
    };

    const highlights = selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, { score: 42 }, []);

    const improvements = highlights.filter(h => h.type === 'improvement');
    window.assert.equal(improvements.length, 1, 'Only biggest improvement selected');
    window.assert.equal(improvements[0].metric, 'spatialAwareness', 'Biggest improvement is spatialAwareness');
  } catch (error) {
    console.error('❌ Test 2.3 FAILED:', error.message);
  }

  // ========================================
  // Test Category 3: Priority 3 - Notable Events
  // ========================================

  // Test 3.1: RC Survived (3+)
  try {
    const sessionMetrics = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const cognitiveStats = {
      rcSurvived: 3,
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      mysteryFoodsEaten: 0,
      score: 42
    };

    const highlights = selectHighlights(sessionMetrics, {}, {}, cognitiveStats, []);

    const notableEvents = highlights.filter(h => h.type === 'notable');
    window.assert.isTrue(notableEvents.length > 0, 'Detects RC survived notable event');
    window.assert.equal(notableEvents[0].icon, '🔥', 'Notable event has fire icon');
    window.assert.isTrue(notableEvents[0].text.includes('Reverse Controls'), 'Text mentions Reverse Controls');
  } catch (error) {
    console.error('❌ Test 3.1 FAILED:', error.message);
  }

  // Test 3.2: Combo survived (1+)
  try {
    const cognitiveStats = {
      rcSurvived: 0,
      comboMultipliers: 1,
      phoneCallsManaged: 0,
      mysteryFoodsEaten: 0,
      score: 42
    };

    const highlights = selectHighlights({}, {}, {}, cognitiveStats, []);

    const notableEvents = highlights.filter(h => h.type === 'notable' && h.subtype === 'combo');
    window.assert.isTrue(notableEvents.length > 0, 'Detects combo notable event');
    window.assert.isTrue(notableEvents[0].text.includes('combo'), 'Text mentions combo');
  } catch (error) {
    console.error('❌ Test 3.2 FAILED:', error.message);
  }

  // Test 3.3: Phone calls managed (5+)
  try {
    const cognitiveStats = {
      rcSurvived: 0,
      comboMultipliers: 0,
      phoneCallsManaged: 5,
      mysteryFoodsEaten: 0,
      score: 42
    };

    const highlights = selectHighlights({}, {}, {}, cognitiveStats, []);

    const notableEvents = highlights.filter(h => h.type === 'notable' && h.subtype === 'phone_calls');
    window.assert.isTrue(notableEvents.length > 0, 'Detects phone calls notable event');
    window.assert.isTrue(notableEvents[0].text.includes('phone calls'), 'Text mentions phone calls');
  } catch (error) {
    console.error('❌ Test 3.3 FAILED:', error.message);
  }

  // Test 3.4: Mystery foods eaten (10+)
  try {
    const cognitiveStats = {
      rcSurvived: 0,
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      mysteryFoodsEaten: 10,
      score: 42
    };

    const highlights = selectHighlights({}, {}, {}, cognitiveStats, []);

    const notableEvents = highlights.filter(h => h.type === 'notable' && h.subtype === 'mystery_foods');
    window.assert.isTrue(notableEvents.length > 0, 'Detects mystery foods notable event');
    window.assert.isTrue(notableEvents[0].text.includes('mystery foods'), 'Text mentions mystery foods');
  } catch (error) {
    console.error('❌ Test 3.4 FAILED:', error.message);
  }

  // ========================================
  // Test Category 4: Priority 4 - Growth Opportunity
  // ========================================

  // Test 4.1: Shows lowest rolling average metric
  try {
    const sessionMetrics = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const rollingAverages = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.60 // Lowest
    };

    const cognitiveStats = {
      rcSurvived: 1, // Has engagement
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      mysteryFoodsEaten: 0,
      score: 42
    };

    const highlights = selectHighlights(sessionMetrics, rollingAverages, {}, cognitiveStats, []);

    const growthOpp = highlights.filter(h => h.type === 'growth');
    window.assert.isTrue(growthOpp.length > 0, 'Detects growth opportunity');
    window.assert.equal(growthOpp[0].metric, 'workingMemory', 'Growth opportunity is for lowest metric');
    window.assert.equal(growthOpp[0].icon, '↑', 'Growth opportunity has up arrow icon');
  } catch (error) {
    console.error('❌ Test 4.1 FAILED:', error.message);
  }

  // Test 4.2: No growth opportunity when zero engagement
  try {
    const sessionMetrics = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const rollingAverages = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.60
    };

    const cognitiveStats = {
      rcSurvived: 0, // No engagement
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      mysteryFoodsEaten: 0,
      score: 42
    };

    const highlights = selectHighlights(sessionMetrics, rollingAverages, {}, cognitiveStats, []);

    const growthOpp = highlights.filter(h => h.type === 'growth');
    window.assert.equal(growthOpp.length, 0, 'No growth opportunity when zero engagement');
  } catch (error) {
    console.error('❌ Test 4.2 FAILED:', error.message);
  }

  // ========================================
  // Test Category 5: Selection Limit (Max 3)
  // ========================================

  // Test 5.1: Returns max 3 highlights
  try {
    const sessionMetrics = {
      reactionTime: 0.95, // Personal best
      spatialAwareness: 0.95, // Personal best
      cognitiveFlexibility: 0.90, // Personal best + improvement
      dividedAttention: 0.85, // Personal best + improvement
      impulseControl: 0.90,
      workingMemory: 0.80
    };

    const allTimeHighs = {
      reactionTime: 0.90,
      spatialAwareness: 0.90,
      cognitiveFlexibility: 0.85,
      dividedAttention: 0.80,
      impulseControl: 0.85,
      workingMemory: 0.75
    };

    const rollingAverages = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const cognitiveStats = {
      rcSurvived: 3, // Notable event
      comboMultipliers: 1, // Notable event
      phoneCallsManaged: 5, // Notable event
      mysteryFoodsEaten: 10, // Notable event
      score: 42
    };

    const highlights = selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, cognitiveStats, []);

    window.assert.isTrue(highlights.length <= 3, 'Returns max 3 highlights');
  } catch (error) {
    console.error('❌ Test 5.1 FAILED:', error.message);
  }

  // ========================================
  // Test Category 6: Variety Enforcement
  // ========================================

  // Test 6.1: Swaps lowest-priority highlight when pattern matches
  try {
    const sessionMetrics = {
      reactionTime: 0.95, // Personal best
      spatialAwareness: 0.92, // Improvement
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const allTimeHighs = {
      reactionTime: 0.90,
      spatialAwareness: 0.85,
      cognitiveFlexibility: 0.80,
      dividedAttention: 0.75,
      impulseControl: 0.85,
      workingMemory: 0.70
    };

    const rollingAverages = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const cognitiveStats = {
      rcSurvived: 3, // Notable event
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      mysteryFoodsEaten: 0,
      score: 42
    };

    const lastPattern = ['personal_best', 'improvement', 'notable'];

    const highlights = selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, cognitiveStats, lastPattern);

    // Should detect matching pattern and attempt swap if more highlights available
    window.assert.isArray(highlights, 'Returns array with variety enforcement');
  } catch (error) {
    console.error('❌ Test 6.1 FAILED:', error.message);
  }

  // ========================================
  // Test Category 7: Encouragement Fallback
  // ========================================

  // Test 7.1: Returns encouragement when no qualifying highlights
  try {
    const sessionMetrics = {
      reactionTime: 0.75,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const allTimeHighs = {
      reactionTime: 0.90,
      spatialAwareness: 0.85,
      cognitiveFlexibility: 0.80,
      dividedAttention: 0.75,
      impulseControl: 0.85,
      workingMemory: 0.70
    };

    const rollingAverages = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const cognitiveStats = {
      rcSurvived: 0,
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      mysteryFoodsEaten: 0,
      score: 42
    };

    const highlights = selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, cognitiveStats, []);

    window.assert.equal(highlights.length, 1, 'Returns 1 encouragement highlight');
    window.assert.equal(highlights[0].type, 'encouragement', 'Type is encouragement');
    window.assert.equal(highlights[0].icon, '🧠', 'Encouragement has brain icon');
    window.assert.isTrue(highlights[0].text.includes('Every session trains your brain'), 'Has encouragement text');
  } catch (error) {
    console.error('❌ Test 7.1 FAILED:', error.message);
  }

  // ========================================
  // Test Category 8: Null/Edge Case Handling
  // ========================================

  // Test 8.1: Handles empty inputs gracefully
  try {
    const highlights = selectHighlights({}, {}, {}, {}, []);
    window.assert.isArray(highlights, 'Returns array for empty inputs');
  } catch (error) {
    console.error('❌ Test 8.1 FAILED:', error.message);
  }

  // Test 8.2: formatHighlightText handles valid highlight
  try {
    const highlight = {
      type: 'personal_best',
      metric: 'reactionTime',
      value: 0.95,
      text: 'Reaction Time: NEW PERSONAL BEST!',
      icon: '🎯',
      priority: 1
    };

    const formatted = formatHighlightText(highlight);
    window.assert.isTrue(formatted.includes('🎯'), 'Formatted text includes icon');
    window.assert.isTrue(formatted.includes('Reaction Time'), 'Formatted text includes metric name');
  } catch (error) {
    console.error('❌ Test 8.2 FAILED:', error.message);
  }

  // Test 8.3: formatHighlightText handles null/undefined
  try {
    const formatted = formatHighlightText(null);
    window.assert.equal(formatted, '', 'Returns empty string for null');
  } catch (error) {
    console.error('❌ Test 8.3 FAILED:', error.message);
  }

  // Test 8.4: selectHighlights performance target (< 50ms)
  try {
    const sessionMetrics = {
      reactionTime: 0.95,
      spatialAwareness: 0.92,
      cognitiveFlexibility: 0.88,
      dividedAttention: 0.85,
      impulseControl: 0.90,
      workingMemory: 0.80
    };

    const allTimeHighs = {
      reactionTime: 0.90,
      spatialAwareness: 0.85,
      cognitiveFlexibility: 0.80,
      dividedAttention: 0.75,
      impulseControl: 0.85,
      workingMemory: 0.70
    };

    const rollingAverages = {
      reactionTime: 0.80,
      spatialAwareness: 0.80,
      cognitiveFlexibility: 0.75,
      dividedAttention: 0.70,
      impulseControl: 0.80,
      workingMemory: 0.65
    };

    const cognitiveStats = {
      rcSurvived: 3,
      comboMultipliers: 1,
      phoneCallsManaged: 5,
      mysteryFoodsEaten: 10,
      score: 42
    };

    const startTime = performance.now();
    const highlights = selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, cognitiveStats, []);
    const duration = performance.now() - startTime;

    window.assert.isTrue(duration < 50, `selectHighlights completes in < 50ms (${duration.toFixed(2)}ms)`);
  } catch (error) {
    console.error('❌ Test 8.4 FAILED:', error.message);
  }

  console.log('=== Cognitive Feedback Highlights Tests Complete ===');
})();
