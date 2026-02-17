# Decision Speed Metric Specification

**Author:** Sally (UX Designer)
**Date:** 2026-02-17
**Status:** Ready for Implementation
**Replaces:** "Reaction Time" metric (broken - penalized mastery)

---

## Problem Summary

The original "Reaction Time" metric measured `food.spawnedAt → food eaten`, which included entire navigation duration. This created a perverse outcome where better play (longer snake, higher score) resulted in worse metric scores due to increased navigation complexity.

**Score 114 game:** 6351ms average → 0.0 score (penalized for mastery)
**Score 6 game:** 2262ms average → 0.30 score (rewarded for failure)

---

## Cognitive Science Foundation

Per Hodent's framework (game-ux-principles.md), metrics must:
1. ✅ Measure a genuine cognitive skill
2. ✅ Provide competence feedback (better play = better score)
3. ✅ Be clear and understandable
4. ✅ Support flow state (not create dissonance)
5. ✅ Create positive emotional impact

**Decision Speed** measures: **Decision-making latency under perceptual load**

This is a trainable cognitive skill that aligns with the "Decision-making under uncertainty" faculty in CrazySnakeLite's cognitive training table.

---

## What Decision Speed Measures

**Definition:** Time from food spawn to first directional input change

**Why this works:**
- ✅ **Snake-length agnostic:** Long and short snakes can both make fast decisions
- ✅ **Measures reflex + perception:** How quickly does the brain process new information (food appears) and commit to action (input change)?
- ✅ **Aligns with mastery:** Expert players develop faster spatial heuristics
- ✅ **Respects autonomy:** Only measures when player DOES change direction (not changing is sometimes correct)

**What it excludes:**
- ❌ Navigation completion time (not a reflex measure)
- ❌ Path complexity (this is spatial awareness, already measured separately)
- ❌ Snake length effects (pure cognitive measure)

---

## Implementation Specification

### Data Collection (game.js)

**Current:** Track `food.spawnedAt` (timestamp when food spawns)

**New:** Track `firstInputAfterSpawn` (timestamp of first directional input change after food spawns)

```javascript
// When food spawns
food.spawnedAt = Date.now();
food.firstInputRecorded = false;

// In input handler (after food spawns)
if (food.exists && !food.firstInputRecorded && inputIsDirectionChange) {
  food.firstInputAfterSpawn = Date.now();
  food.firstInputRecorded = true;
}

// When food eaten
if (food.firstInputAfterSpawn) {
  const decisionTime = food.firstInputAfterSpawn - food.spawnedAt;

  metricsTracking.rawEvents.push({
    type: 'food_eaten',
    timestamp: Date.now(),
    decisionTime: decisionTime,  // NEW: renamed from responseTime
    // ... other fields
  });
}
```

### Calculation (metrics.js)

**Function rename:** `calculateReactionTime()` → `calculateDecisionSpeed()`

**Input:** `rawEvents` array

**Filters:**
- Extract `food_eaten` events with `decisionTime`
- Exclude reverse controls periods (`!duringRC`)
- Exclude phone call periods (`!duringPhone`)
- Remove outliers (> 2 SD above mean)

**Normalization range (based on perceptual/cognitive limits):**
- **200ms = 1.0** (excellent - near perceptual minimum, instant decision)
- **800ms = 0.5** (average - thoughtful decision under normal conditions)
- **2000ms = 0.0** (slow - hesitation, indecision, or distraction)

**Why this range:**
- 200ms: Approximate simple reaction time limit (visual stimulus → motor response)
- 800ms: Typical deliberate decision time (perception → evaluation → commitment)
- 2000ms: Threshold for hesitation (player is uncertain or distracted)

```javascript
export function calculateDecisionSpeed(rawEvents) {
  // Extract decision times from food_eaten events
  const decisionTimes = rawEvents
    .filter(event =>
      event.type === 'food_eaten' &&
      event.decisionTime !== undefined &&
      event.decisionTime > 0 &&
      !event.duringRC &&
      !event.duringPhone
    )
    .map(event => event.decisionTime);

  if (decisionTimes.length === 0) {
    return 0.5; // Neutral score if no valid data
  }

  // Remove outliers
  const filteredTimes = removeOutliers(decisionTimes);

  if (filteredTimes.length === 0) {
    return 0.5;
  }

  // Calculate average decision time
  const avgDecisionTime = average(filteredTimes);

  // Normalize: 200-2000ms range, inverted (lower is better)
  const normalized = normalize(avgDecisionTime, 200, 2000, true);

  return normalized;
}
```

### Domain Scores Update

**Rename:** `reactionTime` → `decisionSpeed` throughout:
- Session metrics object
- Domain scores calculation
- Profile storage
- Dashboard rendering

### UI Labels

**Skill Map dashboard:**
- Old: "Reaction"
- New: "Decision" (6 characters, fits existing layout)

**Full label:**
- Old: "Reaction Time"
- New: "Decision Speed"

**Tooltip/description:**
- "How quickly you commit to directional changes after food appears. Measures decision-making speed under perceptual load."

---

## Migration Strategy

All existing sessions have `responseTime` data that measures navigation completion, NOT decision time.

**Problem:** We cannot retroactively calculate `decisionTime` from stored sessions because we don't have `firstInputAfterSpawn` timestamps.

**Solution:** Reset this metric for all existing sessions:

```javascript
// For each stored session:
session.metrics.decisionSpeed = null;  // Mark as "no data" (not 0)

// Domain score calculation handles null gracefully
```

**Player communication:**
- Skill Map shows "Decision: Calibrating..." (0-4 sessions)
- After 5 new games with proper tracking, shows real Decision Speed score
- This is consistent with the existing calibration UX pattern

---

## Expected Outcomes

**Player with consistent decision-making:**
- ~400ms average → 4.2/5.0 score (excellent reflexes)
- ~800ms average → 2.5/5.0 score (average decision speed)
- ~1200ms average → 1.6/5.0 score (slower, more thoughtful)

**Score 114 player example (Tomoco):**
- Before: 0.25/5.0 (penalized for long snake)
- After: ~3.0-4.0/5.0 (actual decision speed, not navigation complexity)

**Key improvement:** Better play (longer snake) no longer tanks this metric.

---

## Five-Question Filter Validation

### Q1: Working Memory Impact?
✅ **Improves**. "Decision Speed" clearly communicates what's measured. Players can form accurate mental model.

### Q2: Competence Feedback?
✅ **Improves**. Mastery (fast spatial heuristics) → better scores. No longer penalizes snake length.

### Q3: Clarity of Purpose?
✅ **Improves**. Label matches mechanic. "How fast do I decide?" is clear and actionable.

### Q4: Flow State?
✅ **Improves**. Post-game scores align with felt experience. No cognitive dissonance.

### Q5: Emotional Impact?
✅ **Positive**. Players who improve see it reflected in metrics. Competence properly recognized.

**Verdict:** ✅ Passes all five questions. Ready for implementation.

---

## Documentation Updates Required

1. **project-context.md**: Update V3 metric descriptions
2. **game-ux-principles.md**: Add Decision Speed to cognitive training table (if reaction time was listed)
3. **architecture.md**: Update metrics module specification
4. **config.js**: Update DASHBOARD.QUOTES references from "reactionTime" → "decisionSpeed"

---

## Testing Checklist

- [ ] New games record `decisionTime` in rawEvents
- [ ] `calculateDecisionSpeed()` returns scores in 0-1 range
- [ ] Domain scores show "decisionSpeed" (not "reactionTime")
- [ ] Skill Map shows "Decision" label
- [ ] Migration sets existing sessions to `null` (not 0)
- [ ] Calibration placeholder shows for first 5 games
- [ ] After 5 games, Decision score displays correctly
- [ ] Score 100+ games show improved metrics (not 0.0)

---

**Implementation Priority:** High - current metric actively harms player experience

**Complexity:** Medium - requires data collection changes + metric calculation + migration

**Risk:** Low - worst case is calibration reset (already have UX pattern for this)

---

*Spec complete. Ready for Dev handoff.* 🎨
