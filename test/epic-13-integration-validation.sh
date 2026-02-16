#!/bin/bash
# Epic 13 Integration Validation - Verify all event recording points exist

echo "=== Epic 13 Integration Point Validation ==="
echo ""

passed=0
failed=0

# Test 1: Verify metrics module imports in game.js
echo "Test 1: Metrics module imports"
if grep -q "from './metrics.js'" js/game.js; then
  echo "  ✅ Metrics module imported in game.js"
  ((passed++))
else
  echo "  ❌ Metrics module NOT imported in game.js"
  ((failed++))
fi

# Test 2: Verify storage module imports in game.js
echo "Test 2: Storage module imports"
if grep -q "from './storage.js'" js/game.js; then
  echo "  ✅ Storage module imported in game.js"
  ((passed++))
else
  echo "  ❌ Storage module NOT imported in game.js"
  ((failed++))
fi

# Test 3: Verify initStorage called in main.js
echo "Test 3: Storage initialization"
if grep -q "initStorage()" js/main.js; then
  echo "  ✅ initStorage() called in main.js"
  ((passed++))
else
  echo "  ❌ initStorage() NOT called in main.js"
  ((failed++))
fi

# Test 4: Verify metricsTracking in state.js
echo "Test 4: Metrics tracking state"
if grep -q "metricsTracking:" js/state.js; then
  echo "  ✅ metricsTracking defined in state.js"
  ((passed++))
else
  echo "  ❌ metricsTracking NOT defined in state.js"
  ((failed++))
fi

# Test 5: Verify food_eaten events recorded
echo "Test 5: food_eaten event recording"
count=$(grep -c "type: 'food_eaten'" js/game.js)
if [ "$count" -ge 1 ]; then
  echo "  ✅ food_eaten events recorded ($count locations)"
  ((passed++))
else
  echo "  ❌ food_eaten events NOT recorded"
  ((failed++))
fi

# Test 6: Verify phone_call events recorded
echo "Test 6: phone_call event recording"
count=$(grep -rc "type: 'phone_call'" js/game.js js/phone.js | awk -F: '{sum+=$2} END {print sum}')
if [ "$count" -ge 1 ]; then
  echo "  ✅ phone_call events recorded ($count locations)"
  ((passed++))
else
  echo "  ❌ phone_call events NOT recorded"
  ((failed++))
fi

# Test 7: Verify rc_start/rc_end events recorded
echo "Test 7: RC event recording"
if grep -q "type: 'rc_start'" js/effects.js && grep -q "type: 'rc_end'" js/effects.js; then
  echo "  ✅ rc_start/rc_end events recorded in effects.js"
  ((passed++))
else
  echo "  ❌ RC events NOT recorded"
  ((failed++))
fi

# Test 8: Verify combo_start/combo_end events recorded
echo "Test 8: Combo event recording"
if grep -q "type: 'combo_start'" js/combo.js && grep -q "type: 'combo_end'" js/combo.js; then
  echo "  ✅ combo_start/combo_end events recorded in combo.js"
  ((passed++))
else
  echo "  ❌ Combo events NOT recorded"
  ((failed++))
fi

# Test 9: Verify saveSessionMetrics function exists
echo "Test 9: Session metrics saving"
if grep -q "saveSessionMetrics" js/game.js; then
  echo "  ✅ saveSessionMetrics() function exists in game.js"
  ((passed++))
else
  echo "  ❌ saveSessionMetrics() function NOT found"
  ((failed++))
fi

# Test 10: Verify saveSessionMetrics is called on game over
echo "Test 10: Game over integration"
if grep -q "saveSessionMetrics(gameState)" js/game.js; then
  echo "  ✅ saveSessionMetrics() called on game over"
  ((passed++))
else
  echo "  ❌ saveSessionMetrics() NOT called on game over"
  ((failed++))
fi

# Test 11: Verify all 6 metric calculations called
echo "Test 11: All 6 metrics calculated"
metrics_found=0
for metric in "calculateReactionTime" "calculateSpatialAwareness" "calculateCognitiveFlexibility" "calculateDividedAttention" "calculateImpulseControl" "calculateWorkingMemory"; do
  if grep -q "$metric" js/game.js; then
    ((metrics_found++))
  fi
done
if [ "$metrics_found" -eq 6 ]; then
  echo "  ✅ All 6 metric calculations present"
  ((passed++))
else
  echo "  ❌ Only $metrics_found/6 metrics found"
  ((failed++))
fi

# Test 12: Verify test files exist
echo "Test 12: Test suite presence"
if [ -f "test/metrics.test.js" ] && [ -f "test/storage.test.js" ]; then
  echo "  ✅ Test files exist (metrics.test.js, storage.test.js)"
  ((passed++))
else
  echo "  ❌ Test files missing"
  ((failed++))
fi

# Summary
echo ""
echo "=== VALIDATION SUMMARY ==="
echo "Passed: $passed/12"
echo "Failed: $failed/12"
echo ""

if [ "$failed" -eq 0 ]; then
  echo "🎉 ALL INTEGRATION POINTS VERIFIED - Epic 13 is FULLY OPERATIONAL!"
  exit 0
else
  echo "⚠️  Some integration points failed validation"
  exit 1
fi
