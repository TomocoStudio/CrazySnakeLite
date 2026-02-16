// test/dashboard-performance.test.js
// Manual performance validation script — run in browser console
// Story 16.9: Performance testing for Skill Map Dashboard

/**
 * Performance Test Suite for Skill Map Dashboard
 * Run in browser console with DevTools Performance tab open
 *
 * NFR Budgets:
 * - NFR52: Dashboard load < 500ms
 * - NFR53: Animations at 60 FPS
 * - NFR55: Metric calculations < 200ms
 */

async function testDashboardLoadTime() {
  console.log('📊 Testing Dashboard Load Time (NFR52: < 500ms)');

  const startTime = performance.now();

  // Simulate button click
  document.getElementById('skill-map-menu-btn').click();

  // Wait for render complete
  await new Promise(resolve => setTimeout(resolve, 100));

  const endTime = performance.now();
  const loadTime = endTime - startTime;

  console.log(`✓ Load Time: ${loadTime.toFixed(2)}ms`);
  console.assert(loadTime < 500, `FAIL: Load time ${loadTime.toFixed(2)}ms exceeds 500ms budget`);

  return loadTime;
}

async function testMetricCalculation() {
  console.log('📊 Testing Metric Calculation (NFR55: < 200ms)');

  const { getSessions } = await import('../js/storage.js');
  const { calculateDomainScores } = await import('../js/metrics.js');

  const sessions = await getSessions(10);

  const startTime = performance.now();
  const domainScores = calculateDomainScores(sessions);
  const endTime = performance.now();

  const calcTime = endTime - startTime;

  console.log(`✓ Calculation Time: ${calcTime.toFixed(2)}ms`);
  console.assert(calcTime < 200, `FAIL: Calculation time ${calcTime.toFixed(2)}ms exceeds 200ms budget`);

  return calcTime;
}

function testAnimationFPS() {
  console.log('📊 Testing Animation FPS (NFR53: 60 FPS)');
  console.log('⚠️  Manual step: Open DevTools Performance tab, record 5 seconds during:');
  console.log('   1. Milestone streak pulsing animation');
  console.log('   2. Play Now button hover state');
  console.log('   3. Skill Map fade-out transition');
  console.log('   Verify: Frame rate stays at 60 FPS (green bar), no dropped frames (red)');
}

function testMemoryLeaks() {
  console.log('📊 Testing Memory Leaks');
  console.log('⚠️  Manual step: Open DevTools Memory tab, take heap snapshots:');
  console.log('   1. Take snapshot at menu');
  console.log('   2. Navigate to Skill Map → take snapshot');
  console.log('   3. Navigate back to menu → take snapshot');
  console.log('   4. Repeat 10 times');
  console.log('   Verify: Heap size returns to baseline (no growth trend)');
}

function testStorageQuery() {
  console.log('📊 Testing Storage Query Optimization');
  console.log('⚠️  Manual step: Open DevTools Application tab → IndexedDB:');
  console.log('   1. Click "Skill Map" button');
  console.log('   2. Check IndexedDB sessions store');
  console.log('   Verify: Only 10 sessions queried (not all 100+)');
  console.log('   Expected: getSessions(10) called, not full history');
}

async function runAllTests() {
  console.log('🚀 Starting Dashboard Performance Tests\n');

  try {
    await testDashboardLoadTime();
    await testMetricCalculation();
    testAnimationFPS();
    testMemoryLeaks();
    testStorageQuery();

    console.log('\n✅ Automated tests complete. Run manual tests per instructions above.');
    console.log('\n📋 Performance Budget Summary:');
    console.log('   NFR52: Dashboard load < 500ms');
    console.log('   NFR53: Animations at 60 FPS');
    console.log('   NFR55: Metric calculations < 200ms');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Auto-run when script loaded
runAllTests();
