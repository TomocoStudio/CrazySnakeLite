# Story 2: Score Display Redesign

**Epic:** Visual & Audio Polish v2.0
**Status:** ✅ COMPLETE (with additional enhancements)
**Priority:** High
**Complexity:** Low
**Created:** 2026-01-31
**Completed:** 2026-01-31 (Initial) / 2026-02-03 (Enhancements)

---

## User Story

As a player, I want to see both my current score and top score simultaneously in different colors, positioned clearly above the game canvas, so I can track my progress and goals at a glance.

---

## Description

Redesign score display to show dual scores:
- Current score (left-aligned)
- Top score (right-aligned)
- Two distinct colors for visual differentiation
- Clean positioning above canvas

---

## Acceptance Criteria

### AC1: Dual Score Layout
- [ ] Display format: `Score: XXXX     Top Score: XXXXX`
- [ ] Current score positioned on the left (left-aligned or left-positioned)
- [ ] Top score positioned on the right (right-aligned or right-positioned)
- [ ] Adequate spacing between the two scores
- [ ] Both scores visible simultaneously during gameplay

### AC2: Color Differentiation
- [ ] Current score uses one distinct color (suggest: #000000 or #9D4EDD)
- [ ] Top score uses a different distinct color (suggest: #FF0000 or #FFD700)
- [ ] Colors provide clear visual separation
- [ ] Colors maintain readability against background

### AC3: Positioning
- [ ] Score display remains above canvas (Bug fix already positioned at top: -50px)
- [ ] Refine positioning if needed for dual-score layout
- [ ] Does not block gameplay visibility
- [ ] Responsive on mobile devices

---

## Files to Modify

- `css/style.css` - Score display styling
- `index.html` - Update score display HTML structure
- `js/main.js` or relevant UI update code - Update score rendering logic

---

## Implementation Notes

1. Current score display at `#score-display` may need restructuring
2. Consider using flexbox or grid for dual-score layout
3. High score already tracked in `gameState.highScore`
4. Update UI callback function to render both scores

---

## Testing Checklist

- [ ] Both scores display correctly during gameplay
- [ ] Colors are visually distinct
- [ ] Layout works on desktop and mobile
- [ ] Scores update correctly during gameplay
- [ ] High score persists and displays accurately

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Tested across devices
- [ ] User validates the design
- [ ] Ready to ship

---

## Additional Enhancements (2026-02-03)

### Background Styling Update
**User Request:** "Change the background color for the score box to black with transparency"

**Implemented:**
- Changed score display background from white `rgba(255, 255, 255, 0.9)` to black `rgba(0, 0, 0, 0.8)`
- Adjusted transparency level to 0.8 for optimal visibility
- Updated current score text color from black to white (#FFFFFF) for readability
- Kept top score color as light purple-blue rgb(157, 178, 221) for visual hierarchy

**Rationale:** Black semi-transparent background provides better contrast against gameplay while maintaining retro aesthetic and ensuring score visibility.

**Files Modified:** `css/style.css`
**Commit:** 01456ad

### Menu High Score Text Sizing
**User Request:** "Control the text size for the top score in the menu screen"

**Implemented:**
- Unified high score display text sizing to 24px (was 18px for label, 24px for value)
- Both "Top Score:" label and score number now consistent at 24px
- Improves visual balance and readability

**Files Modified:** `css/style.css`
**Commit:** faf53cc

---

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/5-visual-audio-polish.md`
- **Previous Story:** `story-1-visual-identity-overhaul.md`
- **Next Story:** `story-3-food-shape-unification.md`
