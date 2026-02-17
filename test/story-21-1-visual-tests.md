# Story 21.1 Visual Test Plan

## Test Environment
- Browser: Chrome/Firefox/Safari
- Local server: http://localhost:8000
- Test Date: 2026-02-17

## Test Cases

### Test 1: Directional Pupils (All 4 Directions)
**Objective:** Verify pupils track movement direction

**Steps:**
1. Start new game
2. Move snake RIGHT - verify pupils are offset to the right in both eyes
3. Move snake LEFT - verify pupils shift to the left
4. Move snake UP - verify pupils shift upward
5. Move snake DOWN - verify pupils shift downward

**Expected Result:**
- Pupils (small black circles) immediately shift to face the direction of movement
- "Looking where it's heading" effect visible (Pac-Man wedge-mouth technique)

**Status:** [ ] PASS / [ ] FAIL

---

### Test 2: Top-Light Reflection (All 4 Directions)
**Objective:** Verify highlight line appears on leading edge for each direction

**Steps:**
1. Start new game
2. Move snake RIGHT - verify subtle white line on RIGHT edge of head
3. Move snake LEFT - verify white line on LEFT edge
4. Move snake UP - verify white line on TOP edge
5. Move snake DOWN - verify white line on BOTTOM edge

**Expected Result:**
- Semi-transparent white highlight (1px) visible on leading edge
- Highlight changes edge based on direction
- Mega Man sprite layering technique visible

**Status:** [ ] PASS / [ ] FAIL

---

### Test 3: Body Outline at Score 50+ (Dark Background)
**Objective:** Verify outline appears when score threshold reached

**Steps:**
1. Start new game
2. Play until score < 50
3. Observe snake body - should have NO light outline
4. Continue playing until score >= 50
5. Observe snake body - should now have subtle white outline (1px)
6. Verify outline is visible against dark background (tier-4/5)

**Expected Result:**
- No outline at score < 50
- Light outline (rgba(255,255,255,0.15)) appears at score 50+
- Outline ensures visibility on near-black background

**Status:** [ ] PASS / [ ] FAIL

---

### Test 4: Outline Does NOT Appear Before Score 50
**Objective:** Verify outline is gated by score threshold

**Steps:**
1. Start new game
2. Play game keeping score below 50
3. Observe snake body throughout gameplay
4. Verify NO white outline at any point while score < 50

**Expected Result:**
- Snake body has NO light outline when score < 50
- Only existing visual elements visible (head border, eyes, pupils)

**Status:** [ ] PASS / [ ] FAIL

---

### Test 5: Pupils + Highlight During Invincibility Strobe
**Objective:** Verify head enhancements work with invincibility effect

**Steps:**
1. Start new game
2. Eat invincibility food (yellow star)
3. Observe snake head during yellow/black strobe effect
4. Change direction during invincibility
5. Verify pupils and highlight remain visible during strobe

**Expected Result:**
- Pupils visible and track direction during yellow strobe phase
- Pupils visible during black strobe phase
- Highlight line remains visible on leading edge
- No rendering glitches or state leaks

**Status:** [ ] PASS / [ ] FAIL

---

### Test 6: Outline with Combo Striped Snake Pattern
**Objective:** Verify outline works with combo mode striped pattern

**Steps:**
1. Start new game
2. Activate combo mode (eat 2 effect foods consecutively)
3. Reach score 50+ while in combo mode
4. Observe striped snake body during combo
5. Verify white outline visible on ALL segments (both stripe colors)

**Expected Result:**
- Outline applied to all body segments (both Effect A and Effect B colors)
- Outline visible on dark background even with existing black combo border
- No visual conflicts between outline and stripe pattern

**Status:** [ ] PASS / [ ] FAIL

---

## Additional Checks

### Visual Quality
- [ ] Pupils are properly sized (1.5px radius, not too large/small)
- [ ] Highlight is subtle (40% opacity, not too bright)
- [ ] Outline is subtle (15% opacity, ghostly effect)
- [ ] All enhancements feel cohesive with retro arcade aesthetic

### Performance
- [ ] No frame rate drops when rendering pupils/highlight/outline
- [ ] Smooth gameplay at 60 FPS maintained
- [ ] No canvas state leaks (stroke style reset properly)

### Accessibility
- [ ] Enhancements work in reduced motion mode
- [ ] Outline improves snake visibility on dark backgrounds
- [ ] No seizure-inducing flashing from new effects

---

## Notes
- Snake head enhancements inspired by 80s Mega Man sprite layering
- Outline ensures "ghostly silhouette" on near-black backgrounds (tier-4/5)
- Pupils add personality without cognitive load (subliminal character detail)
