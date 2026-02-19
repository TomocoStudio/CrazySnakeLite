# UX Design: Phone Call Screen V2
**Author:** Sally (UX Designer)
**Date:** 2026-02-18
**Last updated:** 2026-02-19 (zero-bonus badge suppression)
**Status:** ✅ Implemented & validated

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
- **Axiom 5 (Teach by encounter):** The full keyboard instruction paragraph is hidden. Instead, always-visible `[Space]` / `[Enter]` badge pills sit inside each button — present on every exposure without dominating visual hierarchy. Teaches association through repetition, not upfront instruction.
- **Axiom 7 (Emotional peaks are the product):** The phone call is designed to be stressful and funny. The visual design must honour that intention.

---

## Visual Redesign Specification

### Color Language

All colors reference the existing game palette — no new colors introduced.

| Element | V1 Color | V2 Color | Rationale |
|---|---|---|---|
| Card border | `rgb(157,178,221)` lavender | `#FFD700` gold + 3-layer neon glow | Matches `border-phone-ring` state already on the canvas border |
| Overlay backdrop | `rgba(0,0,0,0.8)` opaque | `rgba(0,0,0,0.45)` semi-transparent | Blurred snake bleeds through — cognitive pressure maintained |
| Card background | `rgba(0,0,0,0.6)` | `rgba(13,13,13,0.72)` semi-transparent | Card readable, underlying game visible |
| Portrait ring | None (no border) | `3px solid #FFD700` + gold glow blur 12 | Echo of card border — visual unity |
| Portrait ring on Pick Up | n/a | `3px solid #28a745` + green glow | Matches `border-phone-pickup` on canvas — committed state |
| Caller name | `#FFFFFF` 24px (overridden to 12px by cascade bug) | `#FFFFFF` 32px, white neon glow | Fixed + promoted to hero |
| "INCOMING CALL" label | `#E8E8E8` 14px | `#666666` 11px, letter-spacing 3px | Demoted to secondary — status is obvious from context |
| One-liner text (post-Pick Up) | `#E8E8E8` 14px italic | `#FFD700` 18px italic, gold glow | Comedy reward deserves gold treatment |
| Keyboard hint text | `#E8E8E8` 12px paragraph | Hidden (`display:none`) + replaced by inline badge | Paragraph removed; badge teaches by repetition, not instruction |
| End button | `#888` grey | `#1a1a1a` bg, `#AAAAAA` text, `#444` border | Intentionally subdued — safe/quiet choice |
| End keyboard badge | None | `[SPACE]` pill — `#AAAAAA` text, `rgba(255,255,255,0.20)` bg | Always visible; hidden on touch devices |
| Pick Up button | `#28a745` green | `#FFD700` bg, `#000` text, gold glow | Gold = reward signal. Matches ringing border state. |
| Pick Up keyboard badge | None | `[ENTER]` pill — `rgba(0,0,0,0.75)` text, `rgba(0,0,0,0.28)` bg | Dark-on-gold context; hidden on touch devices |
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
║  │  [ SPACE ]  │  │  [ ENTER ]        │  ║
║  └─────────────┘  └───────────────────┘  ║
║                                          ║
╚══════════════════════════════════════════╝
     ↑ blurred snake visible through transparent overlay
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
- `css/style.css` — phone overlay section (lines ~998–1230)
- `index.html` — added `.btn-key` badge spans inside End and Pick Up buttons

**Files NOT changed:**
- `js/phone.js` — logic unchanged, visual only
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
| Working Memory cost? | ✅ 3 elements to parse: face, name, two buttons. Keyboard badges subordinate — never compete for attention. All readable in <300ms. |
| Competence feedback? | ✅ Gold Pick Up = reward signal. Dark End = safe/quiet. Visual weight matches stake. |
| Clarity for first-time players? | ✅ Large portrait + name = immediate social context. Two buttons = binary choice. `[SPACE]`/`[ENTER]` badges teach keyboard shortcuts on every exposure without instruction. |
| Flow preservation? | ✅ Gold card matches the gold reactive border. Semi-transparent overlay keeps the blurred snake visible — player feels the danger of their situation through the phone screen. |
| Emotional impact? | ✅ Electric. The portrait is a character. The gold is urgent. The blurred game behind the overlay adds stakes — your snake is still moving. |

**All 5: PASS.**

---

---

## Post-Implementation Additions (2026-02-18)

### Keyboard Shortcut Badges
After hiding the instruction paragraph (Axiom 5), the question arose: how do players discover keyboard shortcuts during the split-second interrupt? Answer: always-visible badge pills inside each button.

- `.btn-key` span added to End (`[SPACE]`) and Pick Up (`[ENTER]`) in `index.html`
- 10px uppercase pill, subordinate styling — never competes with button label
- End badge: `#AAAAAA` text on `rgba(255,255,255,0.20)` dark background
- Pick Up badge: `rgba(0,0,0,0.75)` text on `rgba(0,0,0,0.28)` — dark-on-gold
- Hidden on touch devices via `@media (hover: none)` — no keyboard, no badge
- **Design rationale:** Hover tooltips rejected — the phone call window is too short (~500ms) and tooltips require deliberate interaction. Always-visible badge teaches through repeated exposure without consuming attention budget.

### Semi-Transparent Overlay
The overlay backdrop and card background were made semi-transparent so the blurred snake is faintly visible through the phone screen. This was a deliberate UX decision, not just aesthetics.

- Overlay backdrop: `rgba(0,0,0,0.85)` → `rgba(0,0,0,0.45)`
- Card background: `#0d0d0d` solid → `rgba(13,13,13,0.72)`
- **Design rationale:** The player's snake is still moving during the phone call. Making it *faintly visible* through the overlay preserves the cognitive pressure — you can sense your snake is in danger but cannot fully react. This heightens the End vs Pick Up stakes and makes the decision feel urgent rather than detached. It transforms the overlay from "pause menu" to "distraction."

---

---

## Post-Implementation Additions (2026-02-19)

### Zero-Bonus Badge Suppression

**Problem:** When invincibility is the active effect, `CONFIG.PHONE_BONUSES.invincibility = { end: 0, pickup: 0 }`. Both button badges displayed "+0", signalling to the player that their End vs Pick Up decision carries no value — a demotivating micro-friction identical to the +0 score popup that was already removed for invincibility food (Story 7.9).

**Design decision:** Hide the score badge entirely when it would show "+0". Same principle as the food popup removal: don't lie about a reward, but don't rub the player's nose in a zero either.

- `.btn-points.hidden` / `.btn-bonus.hidden` → `display: none` (CSS)
- `showPhoneCall()` in `phone.js` — badge shown + `.hidden` removed when bonus > 0; `.hidden` added when bonus = 0
- The End and Pick Up buttons remain fully functional. The choice retains strategic meaning (committing to blur during invincibility vs. ending safely). Only the score dimension is absent — and absent cleanly.

**Five-Question Filter check:**
- Working Memory: ✅ One less element to process when badge absent
- Competence feedback: ✅ Absence of badge is honest (no score reward here); no false signal
- Clarity: ✅ Buttons still clearly labeled End / Pick Up; function obvious
- Flow: ✅ No disruption — badge absence reads as "this call has no score stakes right now"
- Emotional impact: ✅ Removes negative signal without replacing it with noise

**Files modified:** `js/phone.js`, `css/style.css`

---

*This document is the complete implementation record for the Phone Call V2 visual redesign.*
*CSS/HTML changes documented above. Logic change (2026-02-19) limited to badge visibility in `phone.js`.*
