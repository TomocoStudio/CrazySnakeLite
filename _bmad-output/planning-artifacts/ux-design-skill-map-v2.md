# UX Design: Skill Map Screen V2
**Author:** Sally (UX Designer)
**Date:** 2026-02-18
**Status:** 🟢 IMPLEMENTED — 2026-02-18

---

## Problem Statement

The Skill Map is the game's **trophy room** — the one place where a player can step back from the motor frenzy and see their cognitive profile. It should feel like looking in a mirror and thinking *"that's actually me."*

Instead, the current V1 screen looks like a SaaS analytics dashboard from 2018. The data is there. The architecture is right. But the visual language belongs to a different product entirely.

### V1 Audit

| Element | V1 Problem | Severity |
|---|---|---|
| Container border | Generic lavender `rgb(157,178,221)` — same as every other modal. Zero sense of "reward" or "achievement." | 🔴 Critical |
| Block bars | All 6 domains rendered in **one flat color** (`rgb(157,178,221)`). No domain personality, no visual differentiation. Looks like a broken progress bar. | 🔴 Critical |
| Empty blocks | `#3A3A3A` with `#555` border — medium grey sits too close in contrast to the filled lavender. Hard to read. | 🟡 Major |
| Domain labels | 14px white — too small for a data screen. No visual hierarchy between "Decision" (3.4, top skill) and "Impulse" (1.7, growth area). Every row reads identically. | 🟡 Major |
| Rating text | Same 14px white as labels. "3.4/5" looks like metadata, not a score. Numerically correct; emotionally inert. | 🟡 Major |
| ★ / ↑ indicators | Tiny 14px glyphs floating to the right of the score. Easily missed. The ★ Top Skill should be the **hero** of the screen — it's the player's strongest cognitive trait. | 🟡 Major |
| Callout cards | `2px solid rgb(157,178,221)` border — generic lavender again. Quote text `#B0B0B0` at 14px italic — barely readable. Cards feel like Word documents. | 🟡 Major |
| Session stats | 12px `#AAAAAA` text. "Sessions: 223" is an achievement (223 games!) and it looks like a disabled caption. | 🟡 Major |
| Quote card | `1px solid rgba(157,178,221, 0.3)` — essentially invisible. Portrait is 32px (tiny vs 160px on phone screen). | 🟠 Moderate |
| PLAY NOW button | Uses `.menu-button` class — same as the main menu. No visual relationship to the game-over button system. Inconsistent. | 🟠 Moderate |
| Back to Menu | Raw `<a>` link element. Completely inconsistent with every other navigation element in the game. | 🟠 Moderate |
| No glow anywhere | The game is neon noir. Every object glows — snake, food, borders, popups. The Skill Map has zero glow effects. It looks like it belongs to a different game. | 🔴 Critical |

**Root cause:** The Skill Map was implemented to spec (blocks, bars, callouts) but without applying the retro neon noir visual language that defines everything else. It's correct data, wrong aesthetic.

---

## Design Principles Applied

### Five-Question Filter — V1 Failures

1. **Working Memory cost?** ❌ 6 identically-styled rows with no color differentiation. Player must read every label to decode hierarchy. High cognitive tax for what should be an instant visual scan.

2. **Competence feedback?** ❌ The ★ Top Skill — the player's *strongest cognitive trait* — is a 14px glyph that reads as punctuation. Decision Speed at 3.4/5 should feel like a badge of honor.

3. **Clarity for new players?** ❌ "1.7/5" in grey at 14px with a tiny ↑ does not communicate "this is your growth area." Nothing visually distinguishes the growth area from the top skill from the average domain.

4. **Flow preservation?** ❌ The lavender border breaks the neon noir contract. The player moved from a screen that uses gold and cyan and magenta glows to a screen that uses flat lavender. Visual whiplash.

5. **Emotional impact?** ❌ No emotional arc. The screen doesn't say "look at what you've built." It says "here is a table."

### Design Axioms Applied

- **Axiom 1 (Score-based progression):** Block bars ARE the right metaphor — they're score-based. We're keeping them. Just making them *look* like they belong.
- **Axiom 3 (Comedy is a system):** The caller quote card is comedy infrastructure. It needs visibility, not a ghost border.
- **Axiom 4 (Two-choice maximum):** Keep exactly 2 actions: PLAY NOW (primary) / BACK TO MENU (secondary). No additions.
- **Axiom 7 (Emotional peaks are the product):** The Skill Map is a rare cool-moment emotional peak — the player at rest, seeing their growth. Design for that feeling.

### DataViz Principles Applied

- **Signal-to-noise:** Remove color noise (all-same lavender) → add signal (domain-specific colors).
- **Preattentive attributes:** Use COLOR and SIZE to pre-communicate hierarchy before the player reads a word.
- **Graphical integrity:** Block bars remain proportional (0.1 precision with partial fills). No distortion.
- **Aesthetic affordance:** Beauty as clarity. Glowing blocks tell you "this bar has data that matters."

---

## Design Concept: "NEURAL ARCADE"

The Skill Map is the **neon scoreboard of your brain.** Each cognitive domain gets its own color — a visual fingerprint that's uniquely yours. The screen should feel like walking up to an arcade leaderboard and seeing your name at the top. The data is the trophy.

### Domain Color System

Each domain is assigned a distinct neon color drawn from the existing game palette (food colors and effect colors). No new colors introduced.

| Domain | Display Name | Color | Hex | Rationale |
|---|---|---|---|---|
| `decision` | DECISION | Cyan | `#00FFFF` | Speed, sharpness, decisiveness |
| `spatial` | SPATIAL | Purple | `#CC44FF` | Echoes wall-phase food (#800080), elevated |
| `flexibility` | FLEXIBILITY | Orange | `#FF8C00` | Echoes reverse-controls food color |
| `attention` | ATTENTION | Red | `#FF4444` | Focus, urgency — echoes speed-boost food |
| `impulse` | IMPULSE | Green | `#00FF88` | Growth, control, positive progression |
| `memory` | MEMORY | Gold | `#FFD700` | Gold standard — working memory as the crown jewel |

These 6 colors are visually distinct, span the warm/cool spectrum, and all exist in the game's established neon palette.

---

## Visual Redesign Specification

### ASCII Wireframe

```
┌══════════════════════════════════════════════════════════╗
║  [GOLD BORDER — 8px #FFD700 + 3-layer neon glow]         ║
║                                                           ║
║              YOUR                                         ║
║          SKILL MAP          (Jersey20, 32px, white glow)  ║
║                                                           ║
║  ── COGNITIVE PROFILE ──  (12px, #666, letter-spaced)     ║
║                                                           ║
║  ★  DECISION    ████████░░  [cyan]   3.4  /5  ★          ║
║     SPATIAL     ██████░░░░  [purple] 2.2  /5              ║
║     FLEXIBILITY ███████░░░  [orange] 2.8  /5              ║
║     ATTENTION   ███████░░░  [red]    2.9  /5              ║
║  ↑  IMPULSE     █████░░░░░  [green]  1.7  /5  ↑          ║
║     MEMORY      ██████░░░░  [gold]   2.5  /5              ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │  ★  TOP SKILL: DECISION SPEED                       │  ║
║  │  [GOLD BORDER — 2px #FFD700 + subtle glow]          │  ║
║  │  "Your decisions arrive before your brain           │  ║
║  │   finishes thinking. That's talent."                │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │  ↑  LEVEL UP: IMPULSE CONTROL                       │  ║
║  │  [GREEN BORDER — 2px #00FF88 + subtle glow]         │  ║
║  │  "Impulse Control is cooking. A few more strategic  │  ║
║  │   Pick Ups and you'll level up."                    │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                           ║
║  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐   ║
║  │ 223 SESSIONS │  │ STREAK: 0🔥  │  │ BEST: 3 DAYS  │   ║
║  └──────────────┘  └──────────────┘  └───────────────┘   ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │  "Your gameplay is dropping beats. Neural bass:     │  ║
║  │   strong!"                                          │  ║
║  │                        [portrait]  — DJ Snake       │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                           ║
║  ┌───────────────────────────────────────────────────┐    ║
║  │               ▶  PLAY NOW                        │    ║
║  └───────────────────────────────────────────────────┘    ║
║           [← BACK TO MENU]  (secondary button)            ║
║                                                           ║
╚══════════════════════════════════════════════════════════╝
```

---

### Element-by-Element Spec

#### 1. Screen Container

| Property | V1 | V2 |
|---|---|---|
| Border color | `rgb(157, 178, 221)` lavender | `#FFD700` gold |
| Border width | `8px solid` | `8px solid` |
| Box shadow | `0 0 0 8px #1A1A2E` | 3-layer gold neon glow (see below) |
| Background | `rgba(0, 0, 0, 0.85)` | `rgba(0, 0, 0, 0.92)` |
| Border radius | `12px` | `12px` |

**Gold neon glow (box-shadow):**
```css
box-shadow:
  0 0 0 1px #FFD700,
  0 0 20px rgba(255, 215, 0, 0.6),
  0 0 40px rgba(255, 215, 0, 0.3),
  0 0 60px rgba(255, 215, 0, 0.15);
```

#### 2. Title Section

**Two-line treatment (matching game-over screen's "YOUR SCORE" pattern):**

| Element | Spec |
|---|---|
| "YOUR" label | 11px, `#888888`, `letter-spacing: 3px`, uppercase, text-align center |
| "SKILL MAP" | 32px Jersey20, `#FFFFFF`, text-shadow: `0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.4)` |
| Section divider | 12px, `#555555`, `letter-spacing: 4px`, `── COGNITIVE PROFILE ──`, margin-top: 12px |

Remove the 🎯 emoji — it doesn't belong in the retro pixel system.

#### 3. Domain Block Bar Rows

**Row structure (per domain):**
```
[indicator-slot] [domain-label] [blocks × 5] [rating-number] [/5]
```

| Property | V1 | V2 |
|---|---|---|
| Block size | 16×16px | 20×20px |
| Block gap | 2px | 3px |
| Filled block color | `rgb(157, 178, 221)` (all domains) | Domain-specific neon color |
| Filled block glow | None | `box-shadow: 0 0 4px {color}, 0 0 8px {color}40` |
| Empty block bg | `#3A3A3A` | `#111111` (darker for better contrast) |
| Empty block border | `1px solid #555555` | `1px solid #2a2a2a` |
| Partial block | `rgb(157, 178, 221)` fill | Domain color fill + glow |
| Domain label font | 14px Jersey20, white | 16px Jersey20, `#CCCCCC` |
| Domain label width | 120px min | 130px min |
| Rating number | 14px white | 20px Jersey20, domain color |
| "/5" suffix | Part of same text | 14px `#444444` (muted) |
| Row bottom margin | 12px | 14px |

**Indicator slot** (left of domain label, 24px wide):
- Empty: `24px` reserved (rows with no indicator have blank space — alignment preserved)
- ★ (Top Skill): `#FFD700`, 18px, `text-shadow: 0 0 8px #FFD700`
- ↑ (Growth Area): `#00FF88`, 18px, `text-shadow: 0 0 8px #00FF88`

**Per-domain CSS classes** (added to the `.block-bar-row`):
```css
.domain-decision  { --domain-color: #00FFFF; }
.domain-spatial   { --domain-color: #CC44FF; }
.domain-flexibility { --domain-color: #FF8C00; }
.domain-attention { --domain-color: #FF4444; }
.domain-impulse   { --domain-color: #00FF88; }
.domain-memory    { --domain-color: #FFD700; }
```

Filled blocks and partial fills inherit `background-color: var(--domain-color)`.
Rating number inherits `color: var(--domain-color)`.

#### 4. Callout Cards

Two cards — Top Skill and Level Up. Both get proper neon card treatment.

**Top Skill Card:**

| Property | V1 | V2 |
|---|---|---|
| Border | `2px solid rgb(157, 178, 221)` | `2px solid #FFD700` |
| Box shadow | None | `0 0 8px rgba(255,215,0,0.3), 0 0 16px rgba(255,215,0,0.15)` |
| Background | `rgba(26, 26, 46, 0.6)` | `rgba(13, 13, 13, 0.8)` |
| Icon (★) | 18px gold `#FFC107` | 20px `#FFD700`, `text-shadow: 0 0 8px #FFD700` |
| Header text | 16px bold white | 18px Jersey20 `#FFD700` |
| Quote text | 14px italic `#B0B0B0` | 14px italic `#CCCCCC` (higher contrast) |
| Padding | 16px | 16px 18px |

**Level Up Card:**

| Property | V1 | V2 |
|---|---|---|
| Border | `2px solid rgb(157, 178, 221)` | `2px solid #00FF88` |
| Box shadow | None | `0 0 8px rgba(0,255,136,0.25), 0 0 16px rgba(0,255,136,0.1)` |
| Background | `rgba(26, 26, 46, 0.6)` | `rgba(13, 13, 13, 0.8)` |
| Icon (↑) | 18px green `#81C784` | 20px `#00FF88`, `text-shadow: 0 0 8px #00FF88` |
| Header text | 16px bold white | 18px Jersey20 `#00FF88` |
| Quote text | 14px italic `#B0B0B0` | 14px italic `#CCCCCC` |
| Padding | 16px | 16px 18px |

#### 5. Session Stats — "Stat Chips"

Replace the faint text row with three distinct pill-shaped stat chips.

| Chip | Label | Color | Spec |
|---|---|---|---|
| Sessions | `{N} SESSIONS` | White | `#FFFFFF`, `text-shadow: 0 0 6px rgba(255,255,255,0.5)` |
| Streak | `STREAK: {N} 🔥` | Fire orange `#FF8C00` | `text-shadow: 0 0 6px rgba(255,140,0,0.6)` |
| Best | `BEST: {N} DAYS` | Gold `#FFD700` | `text-shadow: 0 0 6px rgba(255,215,0,0.5)` |

Each chip:
```css
.stat-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 6px 14px;
  font-family: 'Jersey20', sans-serif;
  font-size: 13px;
  letter-spacing: 1px;
}
```

Chips arranged in a single flex row, centered, gap: 12px.

**Streak milestone styling** (7, 14, 30, 60 days): Border color matches streak count milestone glow. Text gets stronger glow. Same ethical guardrails apply (no guilt on 0 days).

#### 6. Quote Card

The caller quote gets proper card treatment — no more ghost borders.

| Property | V1 | V2 |
|---|---|---|
| Border | `1px solid rgba(157,178,221,0.3)` (nearly invisible) | `1px solid rgba(255,255,255,0.15)` |
| Background | `rgba(26, 26, 46, 0.4)` | `rgba(13, 13, 13, 0.6)` |
| Left accent | None | `3px solid rgba(157,178,221,0.5)` left border (matches game-over quote style) |
| Quote text color | `#B0B0B0` | `#C8C8C8` |
| Quote font size | 14px | 15px |
| Portrait size | 32×32px | 48×48px |
| Portrait border | None | `2px solid rgb(157,178,221)` with `0 0 6px rgba(157,178,221,0.6)` glow |
| Attribution color | `#B0B0B0` | `rgb(157,178,221)` |

#### 7. Action Buttons

Both buttons switch to the **`.game-over-btn` system** for visual consistency with the game-over screen.

| Button | V1 | V2 |
|---|---|---|
| PLAY NOW | `.menu-button` (generic) | `.game-over-btn.selected` — full purple fill, prominent |
| BACK TO MENU | `<a>` raw text link | `.game-over-btn` — dark bg, purple border, secondary |

Button container: `display: flex; flex-direction: column; gap: 12px; align-items: center; margin-top: 24px;`

PLAY NOW gets full width treatment (matches the "Play Again" button feel from game-over).

**HTML structure:**
```html
<div class="skill-map-actions">
  <button id="play-now-btn" class="game-over-btn selected">▶ PLAY NOW</button>
  <button id="back-to-menu-btn" class="game-over-btn">← BACK TO MENU</button>
</div>
```

Note: `back-to-menu-link` (`<a>` tag) → `back-to-menu-btn` (`<button>` element). ID change required in `main.js` navigation handler.

---

### Animation Spec

| Element | Animation | Notes |
|---|---|---|
| Screen fade-in | `opacity 300ms ease-in-out` | Already implemented — keep |
| Block bars | Stagger fill animation: each row fills L→R with 80ms delay per row | NEW — dramatic reveal effect |
| Block fill animation | `@keyframes blockFill`: `width 0 → 100%` over 400ms cubic-bezier | Per block |
| Callout cards | `fadeInStats 400ms ease-out` with 50ms stagger between cards | Match game-over style |
| Stat chips | `fadeInStats 300ms` with stagger | |
| Quote card | `fadeInStats 400ms` delayed (after chips) | Last to appear — natural read order |
| Glow pulse on ★ domain row | Subtle `box-shadow` pulse (1.5s loop, amplitude ±20% on blur radius) | Draws eye to top skill |

**Reduced motion:** All animations disabled. Elements appear at final state. Glow pulse disabled.

---

## Screen Layout — Full CSS Spec

### Structural changes from V1

1. **Title section**: Replace `<h2 class="skill-map-title">🎯 YOUR SKILL MAP</h2>` with a two-element treatment:
   ```html
   <div class="skill-map-title-block">
     <span class="skill-map-label">YOUR</span>
     <h2 class="skill-map-title">SKILL MAP</h2>
     <div class="skill-map-divider">── COGNITIVE PROFILE ──</div>
   </div>
   ```

2. **Domain rows**: Add domain CSS class (`domain-decision`, etc.) to each `.block-bar-row`. Indicators move to a fixed-width **left slot** before the label. Rating number and "/5" split into two separate `<span>` elements.

3. **Stats container**: Replace existing stats HTML with three `.stat-chip` elements in a flex row.

4. **Buttons**: Replace `<button id="play-now-btn" class="menu-button">` with `class="game-over-btn selected"`. Replace `<a href="#" id="back-to-menu-link">` with `<button id="back-to-menu-btn" class="game-over-btn">`.

### Z-index
No change — remains `z-index: 500` (above everything).

---

## Five-Question Filter — V2 Validation

| Question | V2 Answer |
|---|---|
| **Working Memory cost?** | ✅ Color alone differentiates domains — no label-reading required for hierarchy. The gold ★ row registers as "winner" preattentively. Cognitive load reduced from "read 6 rows" to "scan color + glow pattern." |
| **Competence feedback?** | ✅ The ★ indicator in gold neon, next to a glowing cyan bar, next to a gold rating number — three simultaneous signals that say "this is your strongest cognitive trait." Unmissable. |
| **Clarity for new players?** | ✅ Domain colors are assigned once and consistent. After 5 sessions the player knows "my orange bar is Flexibility." The chip stats make "223 SESSIONS" feel like an achievement, not a footnote. |
| **Flow preservation?** | ✅ Gold border matches the reactive border system's gold state (phone ringing = opportunity/reward). Player subconsciously registers "this is a reward screen." Visual language is continuous. |
| **Emotional impact?** | ✅ Glowing color-coded bars in a neon noir context look like a neural fingerprint. The block reveal animation (staggered fill) adds dramatic ceremony. The screen says: "look at what you've built." |

**All 5: PASS.**

---

## Implementation Notes

### Files Affected

- `css/style.css` — skill map dashboard section (lines ~2345–2868)
- `index.html` — title block HTML, button element changes, domain classes on bar rows
- `js/dashboard.js` — add domain CSS class to each row, split rating/suffix spans, update `back-to-menu-link` → `back-to-menu-btn`
- `js/main.js` — update `back-to-menu-link` event listener to `back-to-menu-btn`

### Files NOT Changed

- `js/config.js` — no changes
- `js/metrics.js`, `js/highlights.js`, `js/streak.js` — pure modules, untouched
- `js/storage.js` — untouched
- All game logic — untouched

### Domain Color CSS Architecture

Use CSS custom properties (`--domain-color`) on the row element. This eliminates 6 repetitive CSS rules for `.block.filled` and instead resolves via inheritance:

```css
/* One rule for all domains */
.block-bar-row .block.filled,
.block-bar-row .block-fill {
  background-color: var(--domain-color);
  box-shadow: 0 0 4px var(--domain-color), 0 0 8px color-mix(in srgb, var(--domain-color) 40%, transparent);
}

.block-bar-row .rating-number {
  color: var(--domain-color);
}
```

`color-mix()` supported in Chrome 111+, Firefox 113+, Safari 16.2+ — all within the target range (Chrome 90+ stated in project-context.md is the only concern; use `rgba(var(--domain-rgb), 0.4)` fallback if needed).

### dashboard.js Changes (minimal)

In `createBlockBarRow()`:
1. Add `row.classList.add('domain-' + domainKey)` to inject the CSS custom property context
2. Split `ratingText` into `<span class="rating-number">${score.toFixed(1)}</span><span class="rating-suffix">/5</span>`
3. Indicator: Move from right-side to left-side slot — add `indicatorSlot` div before `domainLabel`

In `renderCalloutCards()`:
1. No logic changes — only class names for styling updated

### main.js Change

```javascript
// Change:
document.getElementById('back-to-menu-link').addEventListener('click', ...)
// To:
document.getElementById('back-to-menu-btn').addEventListener('click', ...)
```

---

## Design Checklist (DataViz 12-Point)

- [x] Data is the hero (block bars are front and center)
- [x] Graphical integrity (bars proportional, 0.1 precision maintained)
- [x] Every element earns its place (no decorative clutter added)
- [x] Pre-attentive attributes used (color differentiates domains before reading)
- [x] Gestalt: proximity (chips grouped), similarity (same-style cards), enclosure (card borders group content)
- [x] Color meaningful not decorative (domain colors map to cognitive traits)
- [x] Typography hierarchy clear (32px title → 16px labels → 13px chips → 14px quotes)
- [x] Narrative arc (title → profile → top skill → growth → history → quote → action)
- [x] Accessibility: contrast ratios maintained, reduced motion supported
- [x] Color independence: ★ and ↑ indicators provide non-color hierarchy backup
- [x] Mobile responsive (block bars stack gracefully at ≤768px)
- [x] Emotional resonance: screen communicates "achievement" not "report"

---

*This document supersedes the Skill Map visual design section of `ux-design-cognitive-dashboard.md` (v2, 2026-02-17).*
*Game logic, data architecture, and metrics calculations are unchanged.*

---

## Post-Implementation Record
**Implemented:** 2026-02-18 | **Validated by:** Tomoco (iterative testing)

### Iterations Beyond Original Spec

#### Round 1 — Core V2 Redesign (from spec)
Implemented as specified. Tomoco feedback revealed 3 issues not caught in the spec:
- Block size inconsistency (filled vs empty/partial were visually different sizes)
- Portrait too small
- Gold color conflict with phone call screen

#### Round 2 — Block Fix + Color + Portrait
- **Block fix (first attempt):** `box-sizing: border-box` + `border: 1px solid transparent` on `.filled` — INCORRECT, still 2px off due to background-color vs padding-edge difference
- **Portrait:** 48px → 80px
- **Color:** Gold `#FFD700` → **Electric Blue `#00B4FF`** (distinct from phone gold, combo magenta, all domain colors)

#### Round 3 — Final Block Fix + Layout + Buttons
- **Block fix (correct):** Removed all CSS `border` from block elements. Used `box-shadow: inset 0 0 0 1px #2a2a2a` — inset shadow has ZERO box-model impact. All 3 block states (filled/empty/partial) are exactly 20×20px.
- **Bars centering:** `width: fit-content; margin: 0 auto` on `#skill-map-bars-container` + `width: 130px` fixed on `.domain-label`
- **Buttons side by side:** `.skill-map-actions { flex-direction: row }`
- **ALL CAPS:** `text-transform: uppercase` on `.menu-button` and `.game-over-btn` globally
- **Electric Blue extended:** Applied to `#menu-screen`, `#gameover-screen`, `.feedback-container` borders + neon glow

#### Round 4 — Global Neon System ("Full Neons")
Tomoco: *"I want to see Crazy Game full neons."*

- **Global color migration:** All `rgb(157, 178, 221)` → `#00B4FF` (28 instances), all `rgba(157, 178, 221, ...)` → `rgba(0, 180, 255, ...)` throughout `style.css`
- **Neon glow on all buttons** (hover + selected + active states):
  - Default: `box-shadow: 0 0 6px rgba(0, 180, 255, 0.25)` — always-on ambient halo
  - Hover/Selected: 3-layer burst `0 0 12px 0.9, 0 0 24px 0.5, 0 0 40px 0.2`
  - Applies to: `.menu-button`, `.game-over-btn`, `.btn-primary`, `#back-to-game-btn`, `.gate-close-btn`, `.feedback-button` *(`.feedback-button` fully aligned in Round 8)*
- **Score display:** Upgraded to 3-layer neon glow matching screen frames
- **Zero legacy lavender** remaining in live source (docs/specs retain historical values)

#### Round 5 — Quote Card Redesign
Tomoco: *"write the message in 2 or 3 lines, put the portrait image bigger, reduce the block height"*

Changed from stacked layout (text top, portrait bottom-right) to **two-column layout**:
- LEFT: portrait `100px` circular (up from 80px) with enhanced electric blue ring + double-layer neon glow
- RIGHT: `flex: 1` text column — narrower width forces quote to wrap naturally to 2-3 lines; name attribution right-aligned below
- Card height reduced: parallel layout = max(portrait, text) instead of portrait + text stacked
- **dashboard.js** `renderQuote()` restructured: `.quote-portrait-col` + `.quote-text-col` flex children
- Mobile: portrait shrinks to 72px (was 56px)

#### Round 6 — Keyboard Navigation Fixes
Four bugs found and fixed in `input.js`:

| Bug | Location | Fix |
|-----|----------|-----|
| `skill-map-menu-btn` missing from menu navigation | `navigateMenuOptions()` menu case | Added second button to array |
| Wrong game over button ID `menu-btn` | `navigateMenuOptions()` + `activateSelectedButton()` | Fixed to `skill-map-btn` |
| `activateSelectedButton()` hardcoded `new-game-btn` | `activateSelectedButton()` menu case | Check actual `.selected` class |
| No Left/Right support for horizontal button layouts | `handleKeyboardInput()` | Added `ArrowLeft`/`ArrowRight` for `gameover` + `skillmap` phases |

Navigation schema implemented:
- **Menu** (vertical): Up/Down only
- **Game Over** (horizontal): Left/Right primary, Up/Down also accepted
- **Skill Map** (horizontal): Left/Right primary, Up/Down also accepted
- All 4 directions unified: Down/Right = next, Up/Left = previous

Also: `NEW GAME` button carries `selected` class by default in HTML. `main.js` `handleUIUpdate()` resets menu selection to `new-game-btn` on every menu phase transition.

### Final Implementation Files
- `css/style.css` — global neon system, block fix, layout, quote card, `.menu-button.selected`
- `js/dashboard.js` — `renderQuote()` two-column restructure
- `js/input.js` — keyboard navigation fixes (all 4 bugs)
- `js/main.js` — menu selection reset on phase transition
- `index.html` — `new-game-btn` default `selected` class
*All changes are visual only (CSS + minimal HTML/JS class updates).*

#### Round 7 — Quote Card Extended to Game Over Screen (2026-02-18)
Tomoco: *"apply the same graphic design as in the SKILL MAP for the caller messages — bigger caller images"*

The `.quote-card` two-column system (portrait LEFT 100px, text RIGHT) is now shared across both screens:
- **Game Over** `.caller-quote` element: added `quote-card` class + inner structure updated to match (`quote-portrait-col` + `caller-portrait-small` + `quote-text-col`)
- **`cognitive-feedback.js`** `renderCallerQuote()`: portrait selector updated from `.caller-portrait` (32px) to `.caller-portrait-small` (100px)
- **`css/style.css`**: old `.caller-quote` layout rules removed (handled by `.quote-card`); fade-in animation + `.hidden` state preserved
- Net: −30 lines (CSS cleanup from removing dead `.quote-attribution` / `.caller-portrait` / layout rules)

**Files changed:** `index.html`, `js/cognitive-feedback.js`, `css/style.css`

#### Round 8 — Feedback Button Fully Aligned to Design System (2026-02-18)
Tomoco: *"Feedback button is not following our new design — uppercase, electric blue glow, extra border not needed"*

Round 4 listed `.feedback-button` in the global neon system scope but the implementation was incomplete. Fixed:
- **Removed** `box-shadow: 0 0 0 6px rgb(26, 26, 46)` — fake outer ring acting as a double-border
- **Added** `text-transform: uppercase` + `font-weight: bold` — matches all other buttons
- **Default** `box-shadow` → `0 0 6px rgba(0, 180, 255, 0.25)` ambient halo (was solid dark ring)
- **Hover** → `scale(1.05)` + 3-layer neon burst (was `translateY(-2px)` + ring + glow)
- **Active** → `scale(0.98)` + neon glow (was bare `transform: none`)

**Files changed:** `css/style.css`
