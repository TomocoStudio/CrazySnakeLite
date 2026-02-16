// Story 19.6: Glow Tier Accuracy Test
// Verify glow intensity matches score thresholds

import { getState } from '../js/progression.js';

console.log('\n========================================');
console.log('🧪 Epic 19: Glow Tier Accuracy Test');
console.log('========================================\n');

const testScores = [
  { score: 0, expectedGlow: 3, tier: 'Tier 1' },
  { score: 14, expectedGlow: 3, tier: 'Tier 1 boundary' },
  { score: 49, expectedGlow: 3, tier: 'Tier 1 max' },
  { score: 50, expectedGlow: 5, tier: 'Tier 2' },
  { score: 79, expectedGlow: 5, tier: 'Tier 2 max' },
  { score: 80, expectedGlow: 8, tier: 'Tier 3' },
  { score: 100, expectedGlow: 8, tier: 'Tier 3 (Neon Noir)' },
  { score: 150, expectedGlow: 8, tier: 'Tier 3 max' }
];

let passed = 0;
let failed = 0;

testScores.forEach(({ score, expectedGlow, tier }) => {
  const { glowIntensity } = getState(score);
  const pass = glowIntensity === expectedGlow;

  if (pass) {
    passed++;
    console.log(`✅ Score ${score.toString().padEnd(3)} (${tier.padEnd(22)}): glow ${glowIntensity}px ✓`);
  } else {
    failed++;
    console.log(`❌ Score ${score.toString().padEnd(3)} (${tier.padEnd(22)}): glow ${glowIntensity}px (expected ${expectedGlow}px)`);
  }
});

console.log('\n========================================');
console.log(`📊 Results: ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed === 0) {
  console.log('🎉 All glow tier thresholds are accurate!');
} else {
  console.log('⚠️  Some tier thresholds failed validation');
}
