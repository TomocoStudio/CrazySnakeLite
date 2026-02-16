#!/usr/bin/env node
// Quick verification script for Story 14.1 highlight selection logic
// Tests core algorithm without browser APIs (IndexedDB, localStorage)

console.log('=== Story 14.1 Verification Script ===\n');

// Mock the highlight selection logic inline for testing
function selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, cognitiveStats, lastSessionPattern = []) {
  const METRIC_DISPLAY_NAMES = {
    reactionTime: 'Reaction Time',
    spatialAwareness: 'Spatial Awareness',
    cognitiveFlexibility: 'Cognitive Flexibility',
    dividedAttention: 'Divided Attention',
    impulseControl: 'Impulse Control',
    workingMemory: 'Working Memory'
  };

  const highlights = [];

  // PRIORITY 1: Personal Bests
  Object.keys(sessionMetrics).forEach(metric => {
    const sessionValue = sessionMetrics[metric];
    const allTimeHigh = allTimeHighs[metric];

    if (sessionValue > allTimeHigh && allTimeHigh > 0) {
      highlights.push({
        type: 'personal_best',
        metric: metric,
        value: sessionValue,
        text: `${METRIC_DISPLAY_NAMES[metric]}: NEW PERSONAL BEST!`,
        icon: '🎯',
        priority: 1
      });
    }
  });

  // PRIORITY 2: Biggest Improvements
  const improvements = [];
  Object.keys(sessionMetrics).forEach(metric => {
    const sessionValue = sessionMetrics[metric];
    const rollingAvg = rollingAverages[metric];

    if (!rollingAvg || rollingAvg === 0) return;

    const delta = (sessionValue - rollingAvg) / rollingAvg;

    if (delta >= 0.15) {
      const percentImprovement = Math.round(delta * 100);
      improvements.push({
        type: 'improvement',
        metric: metric,
        value: sessionValue,
        delta: delta,
        text: `${METRIC_DISPLAY_NAMES[metric]} up ${percentImprovement}% this session`,
        icon: '⬆',
        priority: 2
      });
    }
  });

  improvements.sort((a, b) => b.delta - a.delta);
  if (improvements.length > 0) {
    highlights.push(improvements[0]);
  }

  // PRIORITY 3: Notable Events
  const notableEvents = [];

  if (cognitiveStats.rcSurvived >= 3) {
    notableEvents.push({
      type: 'notable',
      subtype: 'rc_survived',
      value: cognitiveStats.rcSurvived,
      text: `Survived ${cognitiveStats.rcSurvived} Reverse Controls — brain on fire`,
      icon: '🔥',
      priority: 3
    });
  }

  if (cognitiveStats.comboMultipliers >= 1) {
    notableEvents.push({
      type: 'notable',
      subtype: 'combo',
      value: cognitiveStats.comboMultipliers,
      text: 'First combo survived! Welcome to the big leagues',
      icon: '🔥',
      priority: 3
    });
  }

  if (cognitiveStats.phoneCallsManaged >= 5) {
    notableEvents.push({
      type: 'notable',
      subtype: 'phone_calls',
      value: cognitiveStats.phoneCallsManaged,
      text: '5 phone calls managed — multitasking master',
      icon: '🔥',
      priority: 3
    });
  }

  if (cognitiveStats.mysteryFoodsEaten >= 10) {
    notableEvents.push({
      type: 'notable',
      subtype: 'mystery_foods',
      value: cognitiveStats.mysteryFoodsEaten,
      text: '10 mystery foods decoded — pattern recognition elite',
      icon: '🔥',
      priority: 3
    });
  }

  highlights.push(...notableEvents);

  // PRIORITY 4: Growth Opportunity
  const totalEngagement = (cognitiveStats.rcSurvived || 0) +
                          (cognitiveStats.comboMultipliers || 0) +
                          (cognitiveStats.phoneCallsManaged || 0) +
                          (cognitiveStats.mysteryFoodsEaten || 0);

  if (totalEngagement > 0 && Object.keys(rollingAverages).length > 0) {
    const lowestMetric = Object.entries(rollingAverages)
      .filter(([_, value]) => value > 0)
      .sort((a, b) => a[1] - b[1])[0];

    if (lowestMetric) {
      const [metric, value] = lowestMetric;
      highlights.push({
        type: 'growth',
        metric: metric,
        value: value,
        text: `${METRIC_DISPLAY_NAMES[metric]} — time to level up`,
        icon: '↑',
        priority: 4
      });
    }
  }

  highlights.sort((a, b) => a.priority - b.priority);

  let selectedHighlights = highlights.slice(0, 3);

  // VARIETY ENFORCEMENT
  if (selectedHighlights.length > 1 && lastSessionPattern.length > 0) {
    const currentPattern = selectedHighlights.map(h => h.type);
    const patternsMatch = currentPattern.every((type, index) => type === lastSessionPattern[index]);

    if (patternsMatch && highlights.length > 3) {
      selectedHighlights[selectedHighlights.length - 1] = highlights[3];
    }
  }

  // FALLBACK
  if (selectedHighlights.length === 0) {
    const score = cognitiveStats.score || 0;
    selectedHighlights = [{
      type: 'encouragement',
      text: `Score achieved: ${score} — Every session trains your brain`,
      icon: '🧠',
      priority: 5
    }];
  }

  return selectedHighlights;
}

// Test scenarios
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test 1: Personal Best Detection
test('Detects personal best', () => {
  const highlights = selectHighlights(
    { reactionTime: 0.95, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.65 },
    {},
    { reactionTime: 0.90, spatialAwareness: 0.85, cognitiveFlexibility: 0.80, dividedAttention: 0.75, impulseControl: 0.85, workingMemory: 0.70 },
    { score: 42 },
    []
  );
  assert(highlights.length > 0, 'Should have highlights');
  assert(highlights[0].type === 'personal_best', 'First should be personal_best');
  assert(highlights[0].icon === '🎯', 'Should have trophy icon');
});

// Test 2: 15% Improvement Detection
test('Detects 15%+ improvement', () => {
  const highlights = selectHighlights(
    { reactionTime: 0.92, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.65 },
    { reactionTime: 0.80, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.65 },
    { reactionTime: 0.85, spatialAwareness: 0.85, cognitiveFlexibility: 0.80, dividedAttention: 0.75, impulseControl: 0.85, workingMemory: 0.70 },
    { score: 42 },
    []
  );
  const improvements = highlights.filter(h => h.type === 'improvement');
  assert(improvements.length > 0, 'Should detect improvement');
  assert(improvements[0].icon === '⬆', 'Should have up arrow icon');
});

// Test 3: Notable Event - RC Survived
test('Detects RC survived notable event', () => {
  const highlights = selectHighlights(
    { reactionTime: 0.80, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.65 },
    {},
    {},
    { rcSurvived: 3, comboMultipliers: 0, phoneCallsManaged: 0, mysteryFoodsEaten: 0, score: 42 },
    []
  );
  const notable = highlights.filter(h => h.type === 'notable');
  assert(notable.length > 0, 'Should detect notable event');
  assert(notable[0].icon === '🔥', 'Should have fire icon');
  assert(notable[0].text.includes('Reverse Controls'), 'Should mention Reverse Controls');
});

// Test 4: Growth Opportunity
test('Detects growth opportunity', () => {
  const highlights = selectHighlights(
    { reactionTime: 0.80, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.65 },
    { reactionTime: 0.80, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.60 },
    {},
    { rcSurvived: 1, comboMultipliers: 0, phoneCallsManaged: 0, mysteryFoodsEaten: 0, score: 42 },
    []
  );
  const growth = highlights.filter(h => h.type === 'growth');
  assert(growth.length > 0, 'Should detect growth opportunity');
  assert(growth[0].metric === 'workingMemory', 'Should be lowest metric');
  assert(growth[0].icon === '↑', 'Should have up arrow icon');
});

// Test 5: Max 3 Highlights
test('Returns max 3 highlights', () => {
  const highlights = selectHighlights(
    { reactionTime: 0.95, spatialAwareness: 0.95, cognitiveFlexibility: 0.90, dividedAttention: 0.85, impulseControl: 0.90, workingMemory: 0.80 },
    { reactionTime: 0.80, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.65 },
    { reactionTime: 0.90, spatialAwareness: 0.90, cognitiveFlexibility: 0.85, dividedAttention: 0.80, impulseControl: 0.85, workingMemory: 0.75 },
    { rcSurvived: 3, comboMultipliers: 1, phoneCallsManaged: 5, mysteryFoodsEaten: 10, score: 42 },
    []
  );
  assert(highlights.length <= 3, 'Should return max 3 highlights');
});

// Test 6: Encouragement Fallback
test('Shows encouragement when no qualifying highlights', () => {
  const highlights = selectHighlights(
    { reactionTime: 0.75, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.65 },
    { reactionTime: 0.80, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.65 },
    { reactionTime: 0.90, spatialAwareness: 0.85, cognitiveFlexibility: 0.80, dividedAttention: 0.75, impulseControl: 0.85, workingMemory: 0.70 },
    { rcSurvived: 0, comboMultipliers: 0, phoneCallsManaged: 0, mysteryFoodsEaten: 0, score: 42 },
    []
  );
  assert(highlights.length === 1, 'Should have 1 encouragement');
  assert(highlights[0].type === 'encouragement', 'Should be encouragement type');
  assert(highlights[0].icon === '🧠', 'Should have brain icon');
});

// Test 7: Performance Test
test('Completes in < 50ms', () => {
  const start = performance.now();
  selectHighlights(
    { reactionTime: 0.95, spatialAwareness: 0.92, cognitiveFlexibility: 0.88, dividedAttention: 0.85, impulseControl: 0.90, workingMemory: 0.80 },
    { reactionTime: 0.80, spatialAwareness: 0.80, cognitiveFlexibility: 0.75, dividedAttention: 0.70, impulseControl: 0.80, workingMemory: 0.65 },
    { reactionTime: 0.90, spatialAwareness: 0.85, cognitiveFlexibility: 0.80, dividedAttention: 0.75, impulseControl: 0.85, workingMemory: 0.70 },
    { rcSurvived: 3, comboMultipliers: 1, phoneCallsManaged: 5, mysteryFoodsEaten: 10, score: 42 },
    []
  );
  const duration = performance.now() - start;
  assert(duration < 50, `Should complete in < 50ms (took ${duration.toFixed(2)}ms)`);
});

// Test 8: Empty Inputs
test('Handles empty inputs gracefully', () => {
  const highlights = selectHighlights({}, {}, {}, {}, []);
  assert(Array.isArray(highlights), 'Should return array');
  assert(highlights.length > 0, 'Should have at least encouragement');
});

console.log(`\n=== Results ===`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failed} test(s) failed`);
  process.exit(1);
}
