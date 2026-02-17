// Quick manual verification of progression.getState()
import { getState } from '../js/progression.js';

console.log('\n=== Manual Verification of progression.getState() ===\n');

// Test 1: Score 0 (tier 1)
const state0 = getState(0);
console.log('Score 0:', JSON.stringify(state0, null, 2));

console.log('\n✓ Checking score 0 values:');
console.log(`  glowIntensity: ${state0.glowIntensity} (expected: 3)`);
console.log(`  backgroundColor: ${state0.backgroundColor} (expected: #E8E8E8)`);
console.log(`  gridLineColor: ${state0.gridLineColor} (expected: #A0A0A0)`);
console.log(`  gridOpacity: ${state0.gridOpacity} (expected: 1.0)`);
console.log(`  gridDotOpacity: ${state0.gridDotOpacity} (expected: 0)`);

// Test 2: Score 50 (tier transitions)
const state50 = getState(50);
console.log('\n✓ Checking score 50 values:');
console.log(`  glowIntensity: ${state50.glowIntensity} (expected: 5)`);
console.log(`  backgroundColor: ${state50.backgroundColor} (expected: #808080)`);
console.log(`  gridOpacity: ${state50.gridOpacity} (expected: 0.7)`);
console.log(`  gridDotOpacity: ${state50.gridDotOpacity} (expected: 0.15)`);

// Test 3: Score 100 (max tier)
const state100 = getState(100);
console.log('\n✓ Checking score 100 values:');
console.log(`  glowIntensity: ${state100.glowIntensity} (expected: 8)`);
console.log(`  backgroundColor: ${state100.backgroundColor} (expected: #2A2A2A)`);
console.log(`  gridOpacity: ${state100.gridOpacity} (expected: 0.3)`);
console.log(`  gridDotOpacity: ${state100.gridDotOpacity} (expected: 0.35)`);

// Test 4: Edge case - negative score
const stateNeg = getState(-1);
console.log('\n✓ Checking score -1 (should fallback to tier 1):');
console.log(`  glowIntensity: ${stateNeg.glowIntensity} (expected: 3)`);
console.log(`  backgroundColor: ${stateNeg.backgroundColor} (expected: #E8E8E8)`);

// Test 5: Edge case - very high score
const state9999 = getState(9999);
console.log('\n✓ Checking score 9999 (should use max tier):');
console.log(`  glowIntensity: ${state9999.glowIntensity} (expected: 8)`);
console.log(`  backgroundColor: ${state9999.backgroundColor} (expected: #2A2A2A)`);

// Test 6: All 8 fields exist
console.log('\n✓ Verifying all 8 fields exist:');
const requiredFields = ['speed', 'phoneFrequency', 'effectChance', 'glowIntensity', 'gridOpacity', 'backgroundColor', 'gridLineColor', 'gridDotOpacity'];
const missingFields = requiredFields.filter(field => !(field in state0));
if (missingFields.length === 0) {
  console.log('  ✅ All 8 fields present!');
} else {
  console.log(`  ❌ Missing fields: ${missingFields.join(', ')}`);
}

console.log('\n=== Verification Complete ===\n');
