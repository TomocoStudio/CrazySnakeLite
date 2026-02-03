# Story 5: Phone Call UX Improvement

**Epic:** Visual & Audio Polish v2.0
**Status:** ✅ COMPLETE
**Priority:** Medium
**Complexity:** Low
**Created:** 2026-01-31
**Completed:** 2026-02-03

---

## User Story

As a player, I want clear instructions on how to dismiss the phone call screen, so I don't feel lost or confused during gameplay interruptions.

---

## Description

Add instruction text to phone call overlay: "Press space bar or click on End"

**User Feedback:** "Users are lost with the way to remove the phone call screen, please add text 'Presse space bar or click on End' for the phone call screen."

**Enhancement Beyond Scope:** During implementation, visual emphasis was significantly improved by adding a custom animated phone icon to make the interruption unmissable.

---

## Acceptance Criteria

### AC1: Instruction Text Added
- [x] Text added to phone call overlay: "Press space bar or click on End"
- [x] Text positioned clearly (below caller name, above End button)
- [x] Text uses Jersey_20 font (from Story 1)
- [x] Text color provides good contrast (#E8E8E8 light grey)

### AC2: Text Styling
- [x] Font size readable but not dominant (12px)
- [x] Text aligned center
- [x] Consistent with phone screen aesthetic (Nokia retro style)

### AC3: Functionality Verification
- [x] Space bar dismissal works
- [x] Click on End button works
- [x] Instructions match actual functionality

### AC4: Visual Enhancement (Added During Implementation)
- [x] Custom pixelated phone icon added (PhoneIcone01_256px.png)
- [x] Animated ringing effect (shake/wobble) for attention-grabbing
- [x] Icon maintains retro aesthetic with image-rendering: pixelated
- [x] No glow effects (aesthetic compliance)
- [x] Responsive sizing (80px desktop, 64px mobile)

---

## Files Modified

- `index.html` - Added phone icon image and instruction text
- `css/style.css` - Added phone icon styling and ringing animation
- `assets/PhoneIcone01_256px.png` - New custom phone icon asset

---

## Implementation Notes

1. Instructions text was already present in HTML
2. Major enhancement: Added custom animated phone icon for visual emphasis
3. Animation keyframes: phone-ring with rotation (-15° to +15°)
4. User confirmed improvement: "It's perfect, I love this"

---

## Testing Checklist

- [x] Instruction text displays on phone call
- [x] Text is readable and clear
- [x] Both dismissal methods work (space bar + click)
- [x] Phone icon displays and animates correctly
- [x] User confirms clarity improvement ✅

---

## Definition of Done

- [x] All acceptance criteria met
- [x] User validates UX improvement
- [x] Ready to ship

---

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/5-visual-audio-polish.md`
- **Previous Story:** `story-4-snake-head-enhancement.md`
- **Next Story:** `story-6-branding-update.md`
- **Commits:** 01456ad
