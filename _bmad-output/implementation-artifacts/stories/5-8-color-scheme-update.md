# Story 8: Color Scheme Update

**Epic:** Visual & Audio Polish v2.0
**Status:** TBD - Needs Validation ⚠️
**Priority:** Low
**Complexity:** Medium
**Created:** 2026-01-31

---

## User Story

As a player, I want a new vibrant color scheme for food, walls, and snake, so the visual experience is more striking and cohesive.

---

## Description

Update color scheme across game elements with new vibrant palette from user feedback.

**User Feedback Status:** Marked as "TBD" - User is uncertain about this change and wants validation before implementation.

---

## Proposed Color Changes

### Food Colors (with named palette)
- Speed Increase: "Tech Red" #ff0004
- Wall Phase: "Patriarch" #7A0080
- Invincibility: "Digital Yellow" #FFFF00 (blinking with Deep Black #000000)
- Growing: "Lime Green" #30C030
- Speed Decrease: "Psychedelic Blue" #002CFF
- Reverse Control: "Orange" #FF7E00

### Snake Colors
- Default: "Deep Black" #000000

### Environment
- Walls: Dark grey RGB(25, 25, 25) = #191919

---

## Acceptance Criteria (PENDING VALIDATION)

### AC1: Food Color Updates
- [ ] Speed Boost food: #ff0004 (Tech Red)
- [ ] Wall Phase food: #7A0080 (Patriarch)
- [ ] Invincibility food: #FFFF00 (Digital Yellow)
- [ ] Growing food: #30C030 (Lime Green)
- [ ] Speed Decrease food: #002CFF (Psychedelic Blue)
- [ ] Reverse Controls food: #FF7E00 (Orange)

### AC2: Snake Color Updates
- [ ] Default snake: #000000 (Deep Black) - NO CHANGE from current
- [ ] Snake colors during effects match food colors

### AC3: Wall Color Update
- [ ] Wall/border color: #191919 (RGB 25,25,25 dark grey)
- [ ] Update CONFIG.COLORS.border from #9D4EDD to #191919

### AC4: Visual Validation
- [ ] Colors provide adequate contrast
- [ ] Food remains visible against background
- [ ] Snake remains visible against background
- [ ] Color scheme feels cohesive

---

## Files to Modify

- `js/config.js` - Update all color values in CONFIG.COLORS
- Potentially `css/style.css` - If border colors reference game colors

---

## IMPORTANT: Validation Required

**This story is marked TBD in user feedback.**

**Before implementation:**
1. User should validate the proposed color scheme
2. Consider creating visual mockup or prototype
3. Test color accessibility (contrast, colorblind-friendly)
4. Get explicit approval before proceeding

**Questions to resolve:**
- Are these exact hex values final?
- Should invincibility strobe use the new Deep Black?
- Does wall color change affect canvas border?
- Any concerns about color accessibility?

---

## Implementation Notes

1. This is purely configuration changes (no logic changes)
2. Color values in CONFIG.COLORS object
3. Test visual impact before committing
4. Consider A/B testing with user

---

## Testing Checklist (IF APPROVED)

- [ ] All colors updated correctly
- [ ] Food visible and distinguishable
- [ ] Snake visible at all times
- [ ] Wall/border color works aesthetically
- [ ] No readability issues
- [ ] User validates final appearance

---

## Definition of Done

- [ ] **User explicitly approves color scheme**
- [ ] All acceptance criteria met
- [ ] Visual testing completed
- [ ] No accessibility issues
- [ ] User validates final result
- [ ] Ready to ship

---

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/epic-visual-audio-polish-v2.md`
- **Previous Story:** `story-7-tech-pun-caller-names.md`
- **User Feedback:** `/UserFeedback.md` (marked as TBD)
