// CrazySnakeLite - Render Defensive Pattern Unit Tests
// Story 19.4: Test withShadow() defensive rendering pattern

// Test Results Tracker
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, fn) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    console.error(`❌ FAIL: ${name}`);
    console.error(`   ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\n   Expected: ${expected}\n   Actual: ${actual}`);
  }
}

function assertColorEqual(actual, expected, message) {
  // Normalize colors for comparison (canvas may convert to lowercase or rgba format)
  const normalizeColor = (color) => {
    if (typeof color !== 'string') return color;

    // Convert to lowercase for hex comparison
    const lower = color.toLowerCase();

    // 'transparent' is equivalent to 'rgba(0, 0, 0, 0)'
    if (lower === 'transparent' || lower === 'rgba(0, 0, 0, 0)') {
      return 'transparent';
    }

    return lower;
  };

  const normalizedActual = normalizeColor(actual);
  const normalizedExpected = normalizeColor(expected);

  if (normalizedActual !== normalizedExpected) {
    throw new Error(`${message}\n   Expected: ${expected}\n   Actual: ${actual}`);
  }
}

// ============================================================================
// Helper: withShadow (duplicated from render.js since it's not exported)
// ============================================================================

function withShadow(ctx, shadowConfig, drawFn) {
  const { color, blur } = shadowConfig;

  // Apply shadow properties
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  try {
    // Execute drawing function (may throw)
    drawFn(ctx);
  } finally {
    // ALWAYS cleanup, even if drawFn throws
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
}

// ============================================================================
// Test Suite: withShadow() defensive pattern
// ============================================================================

test('withShadow() applies shadow properties before calling drawFn', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let capturedBlur, capturedColor;

  withShadow(ctx, { color: '#FF0000', blur: 5 }, (ctx) => {
    capturedBlur = ctx.shadowBlur;
    capturedColor = ctx.shadowColor;
  });

  assertEqual(capturedBlur, 5, 'shadowBlur should be 5 inside drawFn');
  assertColorEqual(capturedColor, '#FF0000', 'shadowColor should be #FF0000 inside drawFn');
});

test('withShadow() resets shadow properties after drawFn completes', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  withShadow(ctx, { color: '#FF0000', blur: 8 }, () => {
    // Draw something
  });

  assertEqual(ctx.shadowBlur, 0, 'shadowBlur should be 0 after withShadow completes');
  assertColorEqual(ctx.shadowColor, 'transparent', 'shadowColor should be transparent after withShadow completes');
});

test('withShadow() resets shadow even if drawFn throws error', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  try {
    withShadow(ctx, { color: '#FF0000', blur: 8 }, () => {
      throw new Error('Test error');
    });
  } catch (e) {
    // Error expected
  }

  // Shadow MUST be reset despite error
  assertEqual(ctx.shadowBlur, 0, 'shadowBlur should be 0 even after error');
  assertColorEqual(ctx.shadowColor, 'transparent', 'shadowColor should be transparent even after error');
});

test('withShadow() multiple calls do not leak state', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  withShadow(ctx, { color: '#FF0000', blur: 8 }, () => {});
  withShadow(ctx, { color: '#00FF00', blur: 3 }, () => {});
  withShadow(ctx, { color: '#0000FF', blur: 5 }, () => {});

  // Final state should be clean
  assertEqual(ctx.shadowBlur, 0, 'shadowBlur should be 0 after multiple calls');
  assertColorEqual(ctx.shadowColor, 'transparent', 'shadowColor should be transparent after multiple calls');
});

test('withShadow() sets shadowOffset to 0 for symmetrical halo', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let capturedOffsetX, capturedOffsetY;

  withShadow(ctx, { color: '#FFFF00', blur: 8 }, (ctx) => {
    capturedOffsetX = ctx.shadowOffsetX;
    capturedOffsetY = ctx.shadowOffsetY;
  });

  assertEqual(capturedOffsetX, 0, 'shadowOffsetX should be 0 for symmetrical halo');
  assertEqual(capturedOffsetY, 0, 'shadowOffsetY should be 0 for symmetrical halo');
});

// ============================================================================
// Run All Tests
// ============================================================================

console.log('\n========================================');
console.log('🧪 Render Defensive Pattern Test Suite');
console.log('========================================\n');

// Export test runner function
export function runTests() {
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📝 Total:  ${results.passed + results.failed}`);
  console.log('========================================\n');

  if (results.failed === 0) {
    console.log('🎉 All tests passed!');
    return true;
  } else {
    console.log('⚠️  Some tests failed. See above for details.');
    return false;
  }
}

// Auto-run tests if this module is loaded
runTests();
