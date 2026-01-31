# Story 2: Score Display Redesign

**Epic:** Visual & Audio Polish v2.0
**Status:** Pending
**Priority:** High
**Complexity:** Low
**Created:** 2026-01-31

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

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/epic-visual-audio-polish-v2.md`
- **Previous Story:** `story-1-visual-identity-overhaul.md`
- **Next Story:** `story-3-food-shape-unification.md`
