# UX Design: Phone Call Screen V2
**Author:** Sally (UX Designer)
**Date:** 2026-02-18
**Status:** ✅ Approved for implementation

---

## Problem Statement

The phone call interrupt screen is the game's highest-stakes UI moment. Players have ~500ms to context-switch from motor control mode (avoiding walls) into a social decision mode (End vs Pick Up). The V1 screen failed on every axis of the Five-Question Filter.

### V1 Audit

| Dimension | Issue |
|---|---|
| **Working Memory** | 5+ elements to read simultaneously — portrait, status label, caller name, instruction text, two buttons, countdown bar |
| **Competence feedback** | Both buttons showed +1 at low score — no Fibonacci reward communicated visually |
| **Clarity** | Gray vs Green button language borrowed from generic UI, not the game's own color system |
| **Flow preservation** | Lavender card border (`rgb(157, 178, 221)`) breaks the neon noir contract established everywhere else |
| **Emotional impact** | Looks like a standard alert modal, not an arcade emergency |

**Additional bug discovered:** `.caller-name` CSS cascade conflict — dashboard definition at line 2653 (12px, grey) overrides phone screen definition at line 1075 (24px, white), rendering the caller name smaller and muted than intended.

---

## Design Principles Applied

### Five-Question Filter (game-ux-principles.md)

1. **Working Memory cost → REDUCE**: Strip to 4 elements. Portrait + Name + Two buttons. Everything else is secondary.
2. **Competence feedback → CLARIFY**: Gold Pick Up communicates "this is the reward channel." Dark End communicates "safe exit."
3. **Clarity → IMMEDIATE**: Portrait at 160px registers personality in one glance. Name at 32px registers in the next.
4. **Flow preservation → MATCH GAME LANGUAGE**: Gold border = phone ring state. Already established in the reactive border system.
5. **Emotional impact → ARCADE EMERGENCY**: The screen must feel electric. Neon card border, gold button glow, large portrait — this is a *moment*.

### Design Axioms Applied

- **Axiom 3 (Comedy is a system):** The caller's name IS the comedy. Pat Ch-Notes, Floppy Phil, Syd Ram. At 32px with glow they land. At 12px muted grey they don't.
- **Axiom 4 (Two-choice maximum):** End | Pick Up. No ambiguity.
- **Axiom 5 (Teach by encounter):** Remove the keyboard instruction text. After 2 games, players know Space = End, Enter = Pick Up. Showing it wastes attention budget.
- **Axiom 7 (Emotional peaks are the product):** The phone call is designed to be stressful and funny. The visual design must honour that intention.

---

## Visual Redesign Specification

### Color Language

All colors reference the existing game palette — no new colors introduced.

| Element | V1 Color | V2 Color | Rationale |
|---|---|---|---|
| Card border | `rgb(157,178,221)` lavender | `#FFD700` gold + 3-layer neon glow | Matches `border-phone-ring` state already on the canvas border |
| Card background | `rgba(0,0,0,0.6)` | `#0d0d0d` solid | Darker for better portrait contrast |
| Portrait ring | None (no border) | `3px solid #FFD700` + gold glow blur 12 | Echo of card border — visual unity |
| Portrait ring on Pick Up | n/a | `3px solid #28a745` + green glow | Matches `border-phone-pickup` on canvas — committed state |
| Caller name | `#FFFFFF` 24px (overridden to 12px by cascade bug) | `#FFFFFF` 32px, white neon glow | Fixed + promoted to hero |
| "INCOMING CALL" label | `#E8E8E8` 14px | `#666666` 11px, letter-spacing 3px | Demoted to secondary — status is obvious from context |
| One-liner text (post-Pick Up) | `#E8E8E8` 14px italic | `#FFD700` 18px italic, gold glow | Comedy reward deserves gold treatment |
| Keyboard hint text | `#E8E8E8` 12px | `display: none` | Teaches by encounter, frees attention budget |
| End button | `#888` grey | `#1a1a1a` bg, `#AAAAAA` text, `#444` border | Intentionally subdued — safe/quiet choice |
| Pick Up button | `#28a745` green | `#FFD700` bg, `#000` text, gold glow | Gold = reward signal. Matches ringing border state. |
| Countdown bar fill | `linear-gradient(#28a745, #FFD700)` green→yellow | `#FFD700` solid gold + glow blur 8 | Coherent with phone gold system |
| Countdown bar track | `rgba(0,0,0,0.3)` | `#1a1a1a` + 1px `#333` border | Matches game background |

### Layout & Visual Hierarchy

**Ringing state (initial):**
```
┌══════════════════════════════════════════╗
║  [GOLD CARD BORDER — 4px + neon glow]    ║
║  ─────────────────────────────────────── ║
║  INCOMING CALL...                        ║
║  (11px, #666, letter-spacing 3px)        ║
║                                          ║
║     ╔════════════════════╗               ║
║     ║                    ║               ║
║     ║  [PORTRAIT 160px]  ║               ║
║     ║  circular, gold    ║               ║
║     ║  ring + glow       ║               ║
║     ║  wiggle animation  ║               ║
║     ╚════════════════════╝               ║
║                                          ║
║  PAT CH-NOTES                            ║
║  (32px, #FFFFFF, white neon glow)        ║
║                                          ║
║  ┌─────────────┐  ┌───────────────────┐  ║
║  │  END  +1    │  │  PICK UP  +5  ✦  │  ║
║  │ (dark/muted)│  │  (GOLD NEON)      │  ║
║  └─────────────┘  └───────────────────┘  ║
║                                          ║
╚══════════════════════════════════════════╝
```

**Picked Up state (after pressing Pick Up):**
```
╔══════════════════════════════════════════╗
║  [GREEN CARD BORDER — committed state]   ║
║  ─────────────────────────────────────── ║
║  INCOMING CALL...                        ║
║                                          ║
║     ╔════════════════════╗               ║
║     ║  [PORTRAIT 160px]  ║               ║
║     ║  GREEN ring + glow ║               ║
║     ║  (no animation —   ║               ║
║     ║  call-answered)    ║               ║
║     ╚════════════════════╝               ║
║                                          ║
║  PAT CH-NOTES                            ║
║                                          ║
║  "We need to fix a few things            ║
║   between us."                           ║
║  (18px, #FFD700 italic, gold glow)       ║
║                                          ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░               ║
║  [GOLD COUNTDOWN BAR — depleting]        ║
╚══════════════════════════════════════════╝
```

### Animation Spec

| Element | Animation | Notes |
|---|---|---|
| Portrait (ringing) | `phone-ring`: subtle ±8° rotation at 0.8s | Reduced from ±15° — less aggressive at 160px |
| Portrait (answered) | None — static with green glow | `call-answered` class removes animation |
| One-liner text | `fadeInOneLiner`: opacity 0→1 + translateY 4px→0, 300ms | Updated to include subtle rise |
| Countdown bar | CSS `width` linear transition (set by JS) | Gold bar depletes left-to-right |

### Element Sizing

| Element | V1 | V2 |
|---|---|---|
| Portrait | 80×80px | 160×160px |
| Caller name font | 24px (rendered 12px due to bug) | 32px (scoped selector fixes cascade) |
| "INCOMING CALL" font | 14px | 11px |
| Button min-height | 44px | 56px |
| Button font-size | 18px | 20px |
| Countdown bar height | 20px | 14px (slimmer, cleaner) |
| Card padding | 40px 30px | 28px 28px 20px |

### CSS Selector Fix (Bug)

**Before (broken):** `.caller-name` in phone section gets overridden by later `.caller-name` in dashboard section (line 2653).

**After (fixed):** All phone overlay style rules scoped to `.phone-screen .caller-name`, `.phone-screen .call-status`, `.phone-screen .call-instructions`.

---

## Implementation Notes

**Files affected:**
- `css/style.css` — phone overlay section only (lines ~998–1185)

**Files NOT changed:**
- `js/phone.js` — logic unchanged, visual only
- `index.html` — no DOM changes; CSS flex `order` property handles visual reordering
- `js/config.js` — no changes
- Any other JS module — untouched

**Visual element order** (via CSS `order` on flex column):
1. `.call-status` — order 0 (top: "INCOMING CALL...")
2. `.phone-icon` — order 1 (portrait hero)
3. `.phone-screen .caller-name` — order 2 (name)
4. `#phone-buttons` — order 3
5. `#phone-countdown-bar` — order 4
6. `.phone-screen .call-instructions` — order 5 (hidden)

---

## Five-Question Filter: V2 Validation

| Question | V2 Answer |
|---|---|
| Working Memory cost? | ✅ 3 elements to parse: face, name, two buttons. All readable in <300ms. |
| Competence feedback? | ✅ Gold Pick Up = reward signal. Dark End = safe/quiet. Visual weight matches stake. |
| Clarity for first-time players? | ✅ Large portrait + name = immediate social context. Two buttons = binary choice. No explanation needed. |
| Flow preservation? | ✅ Gold card matches the gold reactive border — one coherent visual language. |
| Emotional impact? | ✅ Electric. The portrait is a character. The gold is urgent. The wiggle demands attention. |

**All 5: PASS.**

---

*This document is the implementation contract for the Phone Call V2 visual redesign.*
*Dev agent should implement CSS changes from this spec exactly.*
