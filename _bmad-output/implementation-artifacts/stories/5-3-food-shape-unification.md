# Story 3: Food Shape Unification

**Epic:** Visual & Audio Polish v2.0
**Status:** Pending
**Priority:** High
**Complexity:** Low
**Created:** 2026-01-31

---

## User Story

As a player, I need all food types to be rendered as squares (like the growing food), so I can quickly identify food during fast gameplay without struggling to parse complex shapes.

---

## Description

Unify all food shapes to simple squares while preserving color-coding for different effect types. This improves visual clarity and gameplay speed.

**User Feedback:** "Difficult to see the various food shapes, better to visualise all foods as a square, like the growing food."

---

## Acceptance Criteria

### AC1: Square Shape for All Food Types
- [ ] All food types render as filled squares (10x10 pixels per CONFIG.FOOD_SIZE)
- [ ] Remove custom shapes:
  - [ ] Invincibility: Remove star shape
  - [ ] Wall Phase: Remove ring/donut shape
  - [ ] Speed Boost: Remove cross/plus shape
  - [ ] Speed Decrease: Remove hollow square (make filled)
  - [ ] Reverse Controls: Remove X shape
- [ ] Growing food remains square (no change)

### AC2: Color-Coding Preserved
- [ ] Each food type maintains its distinct color:
  - [ ] Growing: Green (#00FF00)
  - [ ] Invincibility: Yellow (#FFFF00)
  - [ ] Wall Phase: Purple (#800080)
  - [ ] Speed Boost: Red (#FF0000)
  - [ ] Speed Decrease: Cyan (#00CED1)
  - [ ] Reverse Controls: Orange (#FFA500)
- [ ] Colors remain consistent with snake effect colors

### AC3: Visual Consistency
- [ ] All food squares are the same size
- [ ] All food squares use the same rendering logic
- [ ] Food remains centered in grid cells

---

## Files to Modify

- `js/render.js` - Update `renderFood()` function to use square rendering for all types

---

## Implementation Notes

1. Current food rendering uses switch statement (lines 121-157 in render.js)
2. Simplify to render all food as filled squares
3. Remove helper functions: `renderStar()`, `renderRing()`, `renderCross()`, `renderHollowSquare()`, `renderX()`
4. Color mapping already exists in `colorMap` object

---

## Testing Checklist

- [ ] All food types render as squares
- [ ] Food colors are correct for each type
- [ ] Food remains visible and easy to identify
- [ ] No visual glitches or rendering issues
- [ ] Game playability improved (user validation)

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code simplified (shape functions removed)
- [ ] User validates improved visibility
- [ ] Ready to ship

---

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/epic-visual-audio-polish-v2.md`
- **Previous Story:** `story-2-score-display-redesign.md`
- **Next Story:** `story-4-snake-head-enhancement.md`
