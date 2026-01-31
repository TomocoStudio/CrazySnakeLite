# Story 5: Phone Call UX Improvement

**Epic:** Visual & Audio Polish v2.0
**Status:** Pending
**Priority:** Medium
**Complexity:** Low
**Created:** 2026-01-31

---

## User Story

As a player, I want clear instructions on how to dismiss the phone call screen, so I don't feel lost or confused during gameplay interruptions.

---

## Description

Add instruction text to phone call overlay: "Press space bar or click on End"

**User Feedback:** "Users are lost with the way to remove the phone call screen, please add text 'Presse space bar or click on End' for the phone call screen."

---

## Acceptance Criteria

### AC1: Instruction Text Added
- [ ] Text added to phone call overlay: "Press space bar or click on End"
- [ ] Text positioned clearly (suggest: below caller name, above End button)
- [ ] Text uses Jersey_20 font (from Story 1)
- [ ] Text color provides good contrast (suggest: #333333 or #000000)

### AC2: Text Styling
- [ ] Font size readable but not dominant (suggest: 12-14px)
- [ ] Text aligned center
- [ ] Consistent with phone screen aesthetic (Nokia retro style)

### AC3: Functionality Verification
- [ ] Space bar dismissal works (should already work)
- [ ] Click on End button works (should already work)
- [ ] Instructions match actual functionality

---

## Files to Modify

- `index.html` - Add instruction text to #phone-overlay
- `css/style.css` - Style instruction text

---

## Implementation Notes

1. Phone overlay structure in index.html lines 36-42
2. Space bar dismissal should already be implemented
3. Note: User feedback has typo "Presse" - should be "Press"

---

## Testing Checklist

- [ ] Instruction text displays on phone call
- [ ] Text is readable and clear
- [ ] Both dismissal methods work (space bar + click)
- [ ] User confirms clarity improvement

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] User validates UX improvement
- [ ] Ready to ship

---

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/epic-visual-audio-polish-v2.md`
- **Previous Story:** `story-4-snake-head-enhancement.md`
- **Next Story:** `story-6-branding-update.md`
