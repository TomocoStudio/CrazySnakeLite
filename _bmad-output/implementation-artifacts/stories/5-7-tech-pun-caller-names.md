# Story 7: Tech Pun Caller Names

**Epic:** Visual & Audio Polish v2.0
**Status:** Pending
**Priority:** Low
**Complexity:** Low
**Created:** 2026-01-31

---

## User Story

As a player, I want hilarious tech pun caller names for phone interruptions, so the chaotic gameplay experience has more personality and humor.

---

## Description

Replace current phone caller names with 21 tech pun names from user feedback.

**User Feedback:** "Current names for phone calls are not hilarous, please remove then and replace it by: The Tech Puns..."

---

## Acceptance Criteria

### AC1: Caller Names Updated
- [ ] Replace current caller names with new tech pun list:
  - Al Gorithm
  - Meg A. Byte
  - Ali Sing
  - Anna Log
  - Ray Tracing
  - Pat Ch-Notes
  - Mac Address
  - Artie Ficial
  - Floppy Phil
  - Dot Matrix
  - Gia Hertz
  - Terry Byte
  - Perry Pheral
  - Cade Ridger
  - Mona Tor
  - Syd Ram
  - Bessie IOS
  - Dee Frag
  - Buffy Ring
  - DJ Snake
  - GAME OVER

### AC2: Random Selection
- [ ] Phone calls randomly select from the 21 names
- [ ] All names have equal probability
- [ ] "GAME OVER" included as valid caller (humorous meta-reference)

### AC3: Display Format
- [ ] Names display correctly in phone overlay
- [ ] Names fit within phone screen UI
- [ ] Text wrapping handled if needed

---

## Files to Modify

- `js/phone.js` - Update caller name array
- Or wherever caller names are stored (check phone call implementation)

---

## Implementation Notes

1. Current phone call system location: js/phone.js
2. Find current caller names array
3. Replace with new 21-name list
4. Ensure random selection works correctly
5. Note: "GAME OVER" as caller name is intentionally funny

---

## Testing Checklist

- [ ] All 21 names can appear
- [ ] Names display correctly in phone overlay
- [ ] Random selection works
- [ ] No formatting issues with longer names
- [ ] User validates humor/personality improvement

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All names tested
- [ ] User validates the humor
- [ ] Ready to ship

---

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/epic-visual-audio-polish-v2.md`
- **Previous Story:** `story-6-branding-update.md`
- **Next Story:** `story-8-color-scheme-update.md`
