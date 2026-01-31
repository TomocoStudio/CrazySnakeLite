# Story 4: Snake Head Enhancement

**Epic:** Visual & Audio Polish v2.0
**Status:** Pending
**Priority:** Medium
**Complexity:** Low
**Created:** 2026-01-31

---

## User Story

As a player, I want the snake head to be more visible with white eyes and a border color matching the grid background, so I can clearly track the snake's direction during gameplay.

---

## Description

Enhance snake head visibility by:
1. Adding two white eyes to the head
2. Changing border color to match grid background (#E8E8E8)

**User Feedback:** "Snake head is not enough visible, please add with 2 white eyes will be better. I can provide an image reference. And the border color for the snake should be the same as the grid background color."

---

## Acceptance Criteria

### AC1: White Eyes on Snake Head
- [ ] Two white circular eyes added to snake head
- [ ] Eyes positioned symmetrically on head segment
- [ ] Eyes scale appropriately with UNIT_SIZE (20px)
- [ ] Eyes visible on all snake colors (default, growing, effects)
- [ ] Eyes maintain position during strobe effect (invincibility)

### AC2: Border Color Update
- [ ] Snake head border color changed from white (#FFFFFF) to grid background (#E8E8E8)
- [ ] Border remains visible but more subtle
- [ ] CONFIG.HEAD_BORDER_COLOR updated to match CONFIG.COLORS.background

### AC3: Visual Clarity
- [ ] Eyes provide clear directional indicator
- [ ] Head remains distinguishable from body segments
- [ ] No visual conflicts with strobe or color effects

---

## Files to Modify

- `js/render.js` - Update `renderSnake()` function to draw eyes
- `js/config.js` - Update HEAD_BORDER_COLOR to #E8E8E8

---

## Implementation Notes

1. Eyes should be rendered AFTER snake segment fills
2. Eye size suggestion: radius 2-3px each
3. Eye positioning: Calculate based on head segment center
4. Eye spacing: ~8-10px apart horizontally
5. User mentioned they can provide image reference if needed

---

## Testing Checklist

- [ ] Eyes render correctly on snake head
- [ ] Eyes visible on all snake colors
- [ ] Eyes maintain position during movement
- [ ] Border color matches grid background
- [ ] Head visibility improved (user validation)

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Visual design approved by user
- [ ] No rendering issues
- [ ] Ready to ship

---

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/epic-visual-audio-polish-v2.md`
- **Previous Story:** `story-3-food-shape-unification.md`
- **Next Story:** `story-5-phone-call-ux-improvement.md`
