// Test Suite: streaks.js (Story 14.6)
// Tests streak calculation algorithm with consecutive day counting

import { getStreakData, formatStreakCounter, isStreakMilestone } from '../js/streaks.js';

// ========================================
// TEST 1: First session ever
// ========================================
export function test_firstSessionEver() {
  const sessions = [];
  const result = getStreakData(sessions);

  console.assert(result.streakDays === 1, 'First session should have 1-day streak');
  console.assert(result.isBroken === false, 'First session should not be broken');
  console.assert(result.milestoneReached === false, 'First session should not be milestone');

  console.log('✓ Test 1: First session ever');
}

// ========================================
// TEST 2: 3 consecutive days
// ========================================
export function test_threeConsecutiveDays() {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const sessions = [
    { timestamp: now },                    // Today
    { timestamp: now - oneDayMs },         // Yesterday
    { timestamp: now - (2 * oneDayMs) }    // 2 days ago
  ];

  const result = getStreakData(sessions);

  console.assert(result.streakDays === 3, `Expected 3-day streak, got ${result.streakDays}`);
  console.assert(result.isBroken === false, 'Streak should not be broken');
  console.assert(result.milestoneReached === false, '3 days is not a milestone');

  console.log('✓ Test 2: 3 consecutive days');
}

// ========================================
// TEST 3: Missed one day (streak broken)
// ========================================
export function test_missedOneDay() {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const sessions = [
    { timestamp: now - (2 * oneDayMs) },   // 2 days ago (no session today)
    { timestamp: now - (3 * oneDayMs) }
  ];

  const result = getStreakData(sessions);

  console.assert(result.streakDays === 0, `Expected 0 streak (broken), got ${result.streakDays}`);
  console.assert(result.isBroken === true, 'Streak should be broken');
  console.assert(result.milestoneReached === false, 'Broken streak cannot be milestone');

  console.log('✓ Test 3: Missed one day (streak broken)');
}

// ========================================
// TEST 4: 7-day milestone
// ========================================
export function test_sevenDayMilestone() {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const sessions = [];
  for (let i = 0; i < 7; i++) {
    sessions.push({ timestamp: now - (i * oneDayMs) });
  }

  const result = getStreakData(sessions);

  console.assert(result.streakDays === 7, `Expected 7-day streak, got ${result.streakDays}`);
  console.assert(result.isBroken === false, 'Streak should not be broken');
  console.assert(result.milestoneReached === true, '7 days should be milestone');

  console.log('✓ Test 4: 7-day milestone');
}

// ========================================
// TEST 5: 30-day milestone
// ========================================
export function test_thirtyDayMilestone() {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const sessions = [];
  for (let i = 0; i < 30; i++) {
    sessions.push({ timestamp: now - (i * oneDayMs) });
  }

  const result = getStreakData(sessions);

  console.assert(result.streakDays === 30, `Expected 30-day streak, got ${result.streakDays}`);
  console.assert(result.isBroken === false, 'Streak should not be broken');
  console.assert(result.milestoneReached === true, '30 days should be milestone');

  console.log('✓ Test 5: 30-day milestone');
}

// ========================================
// TEST 6: Timezone edge case (11:59pm and 12:01am = 2 days)
// ========================================
export function test_timezoneEdgeCase() {
  // Create timestamps for 11:59pm today and 12:01am today
  const today = new Date();
  today.setHours(23, 59, 0, 0);
  const lateTonight = today.getTime();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 1, 0, 0);
  const earlyTomorrow = tomorrow.getTime();

  // Mock Date.now() to return earlyTomorrow (so "today" is tomorrow)
  const originalNow = Date.now;
  Date.now = () => earlyTomorrow;

  const sessions = [
    { timestamp: earlyTomorrow },  // 12:01am tomorrow
    { timestamp: lateTonight }     // 11:59pm today
  ];

  const result = getStreakData(sessions);

  // Restore Date.now()
  Date.now = originalNow;

  console.assert(result.streakDays === 2, `Expected 2-day streak (timezone edge), got ${result.streakDays}`);
  console.assert(result.isBroken === false, 'Streak should not be broken');

  console.log('✓ Test 6: Timezone edge case');
}

// ========================================
// TEST 7: formatStreakCounter - 1 day
// ========================================
export function test_formatStreakCounter_oneDay() {
  const result = formatStreakCounter(1, false);
  const expected = '🔥 1-day streak — keep it going!';

  console.assert(result === expected, `Expected "${expected}", got "${result}"`);

  console.log('✓ Test 7: formatStreakCounter - 1 day');
}

// ========================================
// TEST 8: formatStreakCounter - 12 days
// ========================================
export function test_formatStreakCounter_twelveDays() {
  const result = formatStreakCounter(12, false);
  const expected = '🔥 12-day streak';

  console.assert(result === expected, `Expected "${expected}", got "${result}"`);

  console.log('✓ Test 8: formatStreakCounter - 12 days');
}

// ========================================
// TEST 9: formatStreakCounter - broken streak (ethical guardrails)
// ========================================
export function test_formatStreakCounter_broken() {
  const result = formatStreakCounter(0, true);
  const expected = 'Rest day logged. Ready for another round?';

  console.assert(result === expected, `Expected "${expected}", got "${result}"`);
  console.assert(!result.includes('lost'), 'Should not use guilt-inducing language');
  console.assert(!result.includes('broken'), 'Should not use guilt-inducing language');

  console.log('✓ Test 9: formatStreakCounter - broken streak (ethical guardrails)');
}

// ========================================
// RUN ALL TESTS
// ========================================
export function runStreakTests() {
  console.log('\n=== Streak Tests (Story 14.6) ===\n');

  test_firstSessionEver();
  test_threeConsecutiveDays();
  test_missedOneDay();
  test_sevenDayMilestone();
  test_thirtyDayMilestone();
  test_timezoneEdgeCase();
  test_formatStreakCounter_oneDay();
  test_formatStreakCounter_twelveDays();
  test_formatStreakCounter_broken();

  console.log('\n✓ All streak tests passed\n');
}
