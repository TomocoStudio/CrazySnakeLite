# Story 15.2 Manual Test Plan

**Story:** Add Session Counter and Progress Tracking
**Date:** 2026-02-16

---

## Test Scenarios

### Test 1: Calibration Counter Display (Sessions 1-4)

**Setup:**
1. Clear localStorage: `localStorage.clear()`
2. Start new game and play until death
3. This will be session 1

**Expected Results:**
- [x] Post-game screen shows: "Session 1/5 — Warming up..."
- [x] Text is 12px Jersey20 font, color #B0B0B0
- [x] Counter has subtle pulsing animation (opacity 0.7 → 1.0 → 0.7, 2s cycle)
- [x] Counter positioned below highlights section with 16px margin-top

**Repeat for sessions 2, 3, 4:**
- [x] Session 2/5 shown correctly
- [x] Session 3/5 shown correctly
- [x] Session 4/5 shown correctly

---

### Test 2: Disabled Skill Map Button During Calibration

**Setup:**
1. Complete session during calibration (sessions 1-4)
2. On post-game screen, observe Skill Map button

**Expected Results:**
- [x] Skill Map button appears greyed out (opacity 0.5)
- [x] Cursor changes to "not-allowed" on hover
- [x] Button is clickable (not truly disabled)

---

### Test 3: Tooltip on Locked Skill Map Button

**Setup:**
1. During calibration (e.g., session 3), click the greyed-out Skill Map button on post-game screen

**Expected Results:**
- [x] Tooltip appears above button
- [x] Tooltip content shows:
  ```
  Complete 5 sessions to unlock your Skill Map
  Currently: Session 3/5
  ```
- [x] Tooltip background: #2A2A2A
- [x] Tooltip text: #E0E0E0, 11px, Jersey20 font
- [x] Tooltip has downward-pointing arrow
- [x] Tooltip auto-dismisses after 3 seconds
- [x] Tooltip fades in smoothly
- [x] Button does NOT navigate to Skill Map

---

### Test 4: Session 5 Behavior (Calibration Complete)

**Setup:**
1. Complete session 5

**Expected Results:**
- [x] Post-game counter shows celebration message: "Your Skill Map is ready! 🎉"
- [x] Counter text is gold (#FFD700), 14px, bold
- [x] Celebration flash animation plays
- [x] Confetti particles appear
- [x] Skill Map button is enabled (normal opacity, normal cursor)
- [x] No tooltip on Skill Map button click

---

### Test 5: Session 6+ Behavior (Post-Calibration)

**Setup:**
1. Complete session 6 or later

**Expected Results:**
- [x] Calibration counter is HIDDEN
- [x] Streak counter is displayed instead (from Story 14.6)
- [x] Skill Map button is fully functional (enabled)
- [x] No tooltip needed

---

### Test 6: CSS Styling Verification

**Manual CSS Check:**
- [x] `.calibration-counter` has font-family: 'Jersey20', monospace
- [x] `.calibration-counter` has font-size: 12px
- [x] `.calibration-counter` has color: #B0B0B0 (not #aaa)
- [x] `.calibration-counter` has text-align: center
- [x] `.calibration-counter` has margin-top: 16px
- [x] `@keyframes calibrationPulse` exists with 0.7 → 1.0 → 0.7 opacity
- [x] Animation duration is 2s, ease-in-out, infinite
- [x] `.calibration-tooltip` styles exist with correct properties
- [x] `button:disabled` has opacity: 0.5 and cursor: not-allowed

---

### Test 7: Reduced Motion Mode

**Setup:**
1. Enable reduced motion: `CONFIG.REDUCED_MOTION = true` or browser setting
2. Complete a session during calibration

**Expected Results:**
- [x] Calibration counter appears instantly (no fade-in)
- [x] NO pulsing animation
- [x] Opacity stays at 1.0
- [x] Celebration animation disabled (session 5)

---

### Test 8: Tooltip Multiple Clicks

**Setup:**
1. During calibration, click disabled Skill Map button multiple times

**Expected Results:**
- [x] First click shows tooltip
- [x] Subsequent clicks remove old tooltip and show fresh one
- [x] Only one tooltip visible at a time
- [x] Tooltip dismisses after 3s from most recent click

---

## Browser Compatibility

Test in:
- [x] Chrome 90+
- [x] Firefox 88+
- [x] Safari 14+
- [x] Edge 90+

---

## Edge Cases

### Edge Case 1: Private Browsing Mode
- [x] Calibration counter shows even if localStorage fails (graceful degradation)
- [x] Session count defaults to 0

### Edge Case 2: localStorage Corruption
- [x] If calibrationStatus returns undefined, defaults to 0 sessions
- [x] No JavaScript errors

### Edge Case 3: Button Spam
- [x] Clicking disabled button rapidly doesn't cause issues
- [x] Tooltip doesn't multiply
- [x] No memory leaks

---

## Acceptance Criteria Validation

| AC | Description | Status |
|----|-------------|--------|
| AC1 | Session 1 shows "Session 1/5 — Warming up..." | ✅ PASS |
| AC2 | Text is 12px Jersey20, light grey #B0B0B0 | ✅ PASS |
| AC3 | Session 3 shows "Session 3/5 — Warming up..." | ✅ PASS |
| AC4 | Subtle pulsing animation (0.7 → 1.0 → 0.7, 2s) | ✅ PASS |
| AC5 | Tooltip shows on disabled button click | ✅ PASS |
| AC6 | Tooltip content correct | ✅ PASS |
| AC7 | Button appears greyed out/disabled | ✅ PASS |
| AC8 | Main menu "Brain Map" option (PENDING Epic 16) | ⚠️ DEFERRED |

**Note:** AC8 (main menu lock state) requires Epic 16 to implement the menu Skill Map option first. Post-game functionality is complete.

---

## Story Completion Status

✅ **Tasks 1-5:** COMPLETE (post-game calibration counter + tooltip)
⚠️ **Tasks 6-7:** DEFERRED (requires Epic 16 menu implementation)

**Overall:** Story 15.2 core functionality complete. Main menu integration deferred to Epic 16.
