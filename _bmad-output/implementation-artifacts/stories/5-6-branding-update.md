# Story 6: Branding Update

**Epic:** Visual & Audio Polish v2.0
**Status:** Pending
**Priority:** Low
**Complexity:** Low
**Created:** 2026-01-31

---

## User Story

As a player, I want the game title to be "Crazy Snake" instead of "CrazySnakeLite", so the branding feels more polished and intentional.

---

## Description

Update game title from "CrazySnakeLite" to "Crazy Snake" across all instances.

**User Feedback:** "Title should be 'Crazy Snake' instead of 'CrazySankeLite'."

---

## Acceptance Criteria

### AC1: HTML Title Updates
- [ ] index.html `<title>` tag updated to "Crazy Snake"
- [ ] Menu screen h1.game-title updated to "Crazy Snake"
- [ ] Meta description updated (if references game name)

### AC2: Code References
- [ ] Check for any game name references in comments
- [ ] Update if needed for consistency

### AC3: Visual Consistency
- [ ] Title displays correctly with Jersey_20 font (from Story 1)
- [ ] Title styling remains consistent

---

## Files to Modify

- `index.html` - Update title tag and h1.game-title
- Any code comments referencing game name (optional cleanup)

---

## Implementation Notes

1. Simple find/replace operation
2. Consider if "Lite" suffix had specific meaning
3. User feedback confirms this is desired change

---

## Testing Checklist

- [ ] Browser tab shows "Crazy Snake"
- [ ] Menu screen shows "Crazy Snake"
- [ ] No broken references

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Visual consistency maintained
- [ ] Ready to ship

---

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/epic-visual-audio-polish-v2.md`
- **Previous Story:** `story-5-phone-call-ux-improvement.md`
- **Next Story:** `story-7-tech-pun-caller-names.md`
