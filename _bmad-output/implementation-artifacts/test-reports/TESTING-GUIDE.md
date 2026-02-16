# Epic 20 Testing Guide

**Story 20.6: Test Visual Transformation and Performance**

This guide will help you execute the comprehensive test plan for Epic 20's Progressive Arcade Transformation system.

---

## Prerequisites

1. **Game Running:** Open `index.html` in your browser
2. **DevTools Open:** Press F12 or Cmd+Option+I (Mac)
3. **Console Visible:** Switch to Console tab to see log messages
4. **Test Report:** Have `epic-20-test-report.md` open to record results

---

## Quick Start Testing Checklist

### 1. Visual Verification (15 minutes)

**Goal:** Verify all 6 tiers display correctly

**Steps:**
1. Start new game (score 0)
2. Take screenshot at scores: 0, 15, 30, 50, 75, 100
3. Use DevTools color picker to verify background colors:
   - Tier 0 (0-14): #e8e8e8
   - Tier 1 (15-29): #d0d0d0
   - Tier 2 (30-49): #b8b8b8
   - Tier 3 (50-74): #808080
   - Tier 4 (75-99): #505050
   - Tier 5 (100+): #1a1a1a

4. Watch for smooth 2-second transitions when crossing thresholds

**How to verify color:**
- Right-click canvas → Inspect
- Click color picker icon in Styles panel
- Click on canvas background
- Compare hex value shown

---

### 2. Grid Opacity Testing (10 minutes)

**Goal:** Verify grid fades progressively

**Setup:**
Add this temporary logging to `js/render.js` in `renderGrid()` function:
```javascript
console.log('[Test] Grid opacity:', gridOpacity, 'at score:', gameState.score);
```

**Steps:**
1. Play game from score 0 → 100+
2. Watch console logs
3. Verify opacity values at each tier:
   - Tier 0: 0.9
   - Tier 1: 0.75
   - Tier 2: 0.6
   - Tier 3: 0.5
   - Tier 4: 0.4
   - Tier 5: 0.3

4. Visual check: Grid at score 100+ should be faint but still visible

---

### 3. Border States Testing (15 minutes)

**Goal:** Verify all 7 border colors and priority cascade

**Test Sequence:**
1. **Default:** Start game → purple border (#9D4EDD)
2. **Death:** Hit wall → red flash for ~500ms
3. **Phone Ring:** Wait for phone → gold border (#FFD700)
4. **Phone Pickup:** Press Enter → green border (#28a745)
5. **Combo:** Eat effect food twice → purple/blue/red/green border
6. **Reverse Controls:** Eat orange X food → orange border (#FFA500)
7. **Invincibility:** Eat yellow star → yellow border (#FFFF00)

**Priority Cascade Test:**
- Activate combo (border purple)
- Phone appears (border should change to gold - higher priority)
- Answer phone (border green)
- Timer expires (border back to purple combo)

---

### 4. Performance Testing (20 minutes)

#### Test 4.1: FPS Measurement

**Steps:**
1. Open DevTools → Performance tab
2. Click Record button (red circle)
3. Play game, reach score 49
4. Eat food to cross to score 50 (tier transition)
5. Let transition complete (2 seconds)
6. Stop recording
7. Look at FPS chart (top green line)
8. Verify FPS stays above 58 (ideally 60)

**Expected:** Smooth green line at ~60 FPS, no drops below 58

---

#### Test 4.2: GPU Compositing

**Steps:**
1. Open DevTools → More Tools → Rendering
2. Enable "Paint flashing" checkbox
3. Play game and cross tier threshold
4. Observe canvas element

**Expected:** Canvas should NOT flash green (green = CPU paint, no green = GPU-composited)

---

#### Test 4.3: Event-Driven Validation

**Steps:**
1. Open Console tab
2. Play complete game (score 0 → death)
3. Count console logs that say `[V4] Background changed to`
4. Record count

**Expected:** 5-6 logs total (one per tier crossing), NOT hundreds

---

#### Test 4.4: Memory Leak Check

**Steps:**
1. Open DevTools → Memory tab
2. Click "Take snapshot" button
3. Play 5 complete games
4. Click "Take snapshot" again
5. Compare heap sizes

**Expected:** Heap size should be similar (±5 MB), not growing significantly

---

### 5. Emotional Arc Testing (30 minutes)

**Goal:** Validate emotional progression feels right

**Method:** Playtest with 3+ people, gather subjective feedback

**Questions to ask testers:**

1. **Tier 0/1 (score 0-29):**
   - Does it feel bright and comfortable?
   - Does it feel like "safe daylight"?
   - Is tension low?

2. **Tier 2/3 (score 30-74):**
   - Does it feel like intensity is building?
   - Is the grey color contributing to challenge feel?
   - Is the grid getting harder to see?

3. **Tier 4/5 (score 75+):**
   - Does it feel dark and stark?
   - Does it feel like a "final boss arena"?
   - Is the Neon Noir aesthetic coming through?

4. **First time reaching tier 5:**
   - Does it feel like an achievement?
   - Is the grid at 0.3 opacity still usable?
   - Does it force stronger spatial awareness?

**Record feedback in test report**

---

### 6. Edge Case Testing (15 minutes)

#### Test 6.1: Rapid Tier Crossing

**Steps:**
1. Reach score 30 (tier 2)
2. Activate combo mode
3. Eat 2nd combo food for multiplier (e.g., 5 × 8 = 40 points)
4. Score jumps from 30 → 70 (crosses tier 2 and 3)
5. Observe transition

**Expected:** Background smoothly fades to tier-3 color, no tier-2 flashing

---

#### Test 6.2 & 6.3: Game Reset

**Steps:**
1. Play to score 100+ (tier 5, near-black)
2. Die
3. Click "Play Again"
4. Observe background

**Expected:** Background returns to #e8e8e8 (tier 0 light grey)

Repeat by clicking "Back to Menu" then "Play" instead of "Play Again"

---

#### Test 6.4: Overlapping Border States

**Steps:**
1. Activate combo mode (purple border)
2. Wait for phone call (border should change to gold)
3. Verify gold wins over purple

**Expected:** Phone ring (gold) has higher priority than combo

---

#### Test 6.5: Death During Transition

**Steps:**
1. Reach score 49
2. Eat food to trigger tier transition (49 → 50+)
3. Immediately die during the 2-second fade
4. Observe

**Expected:**
- Background CSS transition continues
- Border flashes red (death)
- No visual glitches

---

#### Test 6.6: Pause During Transition

**Steps:**
1. Reach score 49
2. Eat food (triggers tier transition)
3. Immediately pause game (if pause exists)
4. Observe background

**Expected:** CSS transition continues fading (browser native, independent of game loop)

---

### 7. Cross-Browser Testing (20 minutes)

**Browsers to test:** Chrome, Firefox, Safari

**For each browser:**
1. Open game
2. Verify tier 0, 3, and 5 display correctly
3. Check tier transition smoothness
4. Check border state changes
5. Record pass/fail in test report

---

## Common Issues and Debugging

### Issue: Background color wrong

**Debug:**
- Right-click canvas → Inspect
- Check Styles panel for `background-color`
- Verify `progression.js` is returning correct tier
- Check console for `[V4] Background changed to` logs

---

### Issue: Grid opacity not changing

**Debug:**
- Add console.log to `renderGrid()` to output opacity value
- Check `progression.js` returns `gridOpacity` field
- Verify `ctx.globalAlpha` is being set

---

### Issue: Border not changing

**Debug:**
- Check console for `[V4] Border →` logs
- Verify `updateBorderState()` is being called
- Check game state has correct values (phoneCall.active, combo.active, etc.)
- Verify border-color CSS transition exists

---

### Issue: FPS drops during transitions

**Debug:**
- Check DevTools Performance tab for long tasks
- Verify GPU compositing is active (Rendering tab)
- Check if canvas is using `clearRect()` not `fillRect()`
- Verify background transition is CSS, not JS animation

---

### Issue: Tier changes every frame

**Debug:**
- Check console log count (should be 5-6, not hundreds)
- Verify `updateCanvasBackground()` is NOT called in `update()` loop
- Verify it's only called on score change events

---

## Screenshot Naming Convention

Save to: `_bmad-output/implementation-artifacts/test-reports/screenshots/`

**Required screenshots:**
- `tier-0-score-0.png`
- `tier-1-score-15.png`
- `tier-2-score-30.png`
- `tier-3-score-50.png`
- `tier-4-score-75.png`
- `tier-5-score-100.png`
- `border-death.png`
- `border-phone-ring.png`
- `border-phone-pickup.png`
- `border-combo.png`
- `border-effects.png`

---

## Time Estimates

- Visual Verification: 15 minutes
- Grid Opacity: 10 minutes
- Border States: 15 minutes
- Performance: 20 minutes
- Emotional Arc: 30 minutes (with 3 testers)
- Edge Cases: 15 minutes
- Cross-Browser: 20 minutes

**Total: ~2 hours**

---

## After Testing

1. Fill in `epic-20-test-report.md` with all results
2. Calculate pass rate (passed / 46)
3. List any issues found
4. Add recommendations for fixes/improvements
5. Sign off if pass rate ≥ 95% (44/46 tests)
6. Move Story 20.6 to "review" status in sprint-status.yaml

---

## Questions?

- Check Story 20.6 for detailed test descriptions
- Check individual story files (20.1-20.5) for implementation details
- Use DevTools Console/Performance/Rendering tabs for debugging

Good luck testing! 🎮
