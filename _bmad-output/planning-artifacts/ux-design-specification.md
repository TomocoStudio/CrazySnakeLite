---
stepsCompleted: [1, 2]
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/game-design-food-v2.md'
  - '_bmad-output/planning-artifacts/game-design-phone-calls-v2.md'
  - '_bmad-output/planning-artifacts/game-ux-principles.md'
version: '2.0'
v2_rewrite: true
repositioning: 'Brain Gym for the Age of AI'
supersedes: 'ux-design-food-phone-v2.md (deleted — consolidated into this document)'
---

# UX Design Specification — CrazySnakeLite

**Author:** Sally (UX Designer) with Celia (Neuro-Game Design Expert)
**Date:** February 8, 2026
**Version:** 2.0 — Brain Gym Repositioning
**Status:** Ready for Implementation

---

## Executive Summary

This is the **single authoritative UX design document** for CrazySnakeLite. It defines every visual system, interaction pattern, animation, audio cue, and accessibility requirement that John (Dev) needs to implement.

**What this document covers:**

1. **Design System** — Color palette, typography, borders, buttons, overlays, animations, responsive breakpoints
2. **Score Popup System** — Five Fibonacci-scaled popup types with escalating visual salience
3. **Food Visual System** — Six food types with color + shape coding
4. **Blinking Food System** — Mystery food color cycling with spatial anchoring
5. **Combo Mode Visuals** — Canvas color change, striped snake, entrance/exit transitions
6. **Phone Call Enhancement UX** — Two-button overlay (End vs Pick Up), caller portraits, countdown bar
7. **Reverse Controls Recognition** — RC SURVIVED flash
8. **Post-Game Cognitive Feedback** — "Your Brain Today" stats display
9. **Cross-System Visual Interaction Rules** — Z-index hierarchy, popup priority, system stacking
10. **Audio Feedback** — Fibonacci musical progression, combo audio, phone sounds
11. **Accessibility** — Reduced motion mode, color-blind considerations

**Design Philosophy:** CrazySnakeLite is a **cognitive fitness tool disguised as an arcade game**. Every visual element serves both **usability** (clear feedback, spatial clarity) and **engage-ability** (emotional impact, reward prediction error, flow state) while reinforcing the brain-gym identity. See `game-ux-principles.md` for the complete cognitive science foundation.

**Reference documents:**
- `game-design-food-v2.md` — Fibonacci scoring, blinking food, combo mode game design (Celia)
- `game-design-phone-calls-v2.md` — Pick Up vs End phone system game design (Celia)
- `game-ux-principles.md` — Cognitive science baseline and design axioms (Celia)
- `prd.md` — Full requirements (Mary + Celia)

---

## Table of Contents

1. [Design Principles & Cognitive Foundation](#design-principles--cognitive-foundation)
2. [Design System & Visual Consistency Standards](#design-system--visual-consistency-standards)
3. [Food Visual System](#food-visual-system)
4. [Score Popup System](#score-popup-system)
5. [Blinking Food Visual System](#blinking-food-visual-system)
6. [Combo Mode Visual System](#combo-mode-visual-system)
7. [Phone Call Enhancement UX](#phone-call-enhancement-ux)
8. [Reverse Controls Recognition](#reverse-controls-recognition)
9. [Post-Game Cognitive Feedback](#post-game-cognitive-feedback)
10. [Cross-System Visual Interaction Rules](#cross-system-visual-interaction-rules)
11. [Audio Feedback Specifications](#audio-feedback-specifications)
12. [Accessibility & Reduced Motion Mode](#accessibility--reduced-motion-mode)
13. [Implementation Checklist](#implementation-checklist)

---

## Design Principles & Cognitive Foundation

### Core UX Principles

**1. Reward Prediction Error Scaling**
Visual feedback intensity must match cognitive difficulty. Fibonacci scoring requires proportional visual salience — a +8 event deserves a micro-celebration, a +1 gets a quiet acknowledgment.

**2. Temporal Contiguity (<200ms)**
All feedback appears within 200ms of player action. The brain links cause to effect for reward learning. No perceptible delay between food consumption and popup.

**3. Luminance Contrast Over Color**
Spatial location uses brightness/shadow (fast magnocellular pathway processing). Color identification uses hue (slower parvocellular pathway). Blinking food uses shadow for position, color for mystery.

**4. Figure-Ground Segregation**
Clear boundaries between visual elements (Gestalt psychology). Conditional borders when color similarity creates ambiguity. Maintains retro aesthetic while ensuring clarity.

**5. Autonomy Preservation (Self-Determination Theory)**
Choice elements (End/Pick Up buttons) must appear neutral in size. Visual interest without coercion. Equal physical dimensions, different visual weight through effects.

**6. Context-Dependent Memory Encoding**
Distinct visual states (combo mode canvas colors) create memory anchors. Environmental cues aid recall of high-scoring moments. Background color changes encode "stakes are higher" signal.

---

## Design System & Visual Consistency Standards

**Purpose:** Unified visual language for all CrazySnakeLite UI. All elements must follow these standards.

**Design Philosophy:** Modern elegance meets retro gaming. Clean, harmonious, intentional.

**Core Principles:**
- **One Purple Shade:** `rgb(157, 178, 221)` throughout all UI
- **Rounded Elegance:** 12px corners on frames, 8px on buttons
- **Transparent Depth:** Layered opacity creates visual depth
- **Consistent Interaction:** All buttons scale identically — 1.05x hover, 0.98x click
- **White Always:** Button text never changes color — always crisp white
- **No Decoration:** Every visual element serves clarity and usability

**Visual Hierarchy:**
1. **Gameplay (Sharp & Bold):** Canvas and score use sharp corners (`border-radius: 0`) — retro gaming aesthetic
2. **UI Menus (Soft & Modern):** All menus/buttons use rounded corners — contemporary feel
3. **Result:** Nostalgic gameplay with polished modern UI

---

### Color Palette

**Primary Colors:**
- **Background Canvas:** `#E8E8E8` (Light grey — game area)
- **Primary Purple:** `#800080` (Deep purple — canvas border only)
- **UI Purple:** `rgb(157, 178, 221)` (Light purple-blue — ALL UI elements)
- **Background Dark:** `#1A1A2E` (Dark blue-grey — outer border layer)
- **Button Inactive Background:** `#000000` (Pure black)
- **Button Active Background:** `rgb(157, 178, 221)` (Same as UI Purple)

**Overlay & Container Backgrounds:**
- **Full-screen overlays:** `rgba(0, 0, 0, 0.8)` (80% black — modals)
- **Menu containers (no overlay):** `rgba(0, 0, 0, 0.9)` (90% black — Menu/Game Over)
- **Modal containers (with overlay):** `rgba(0, 0, 0, 0.6)` (60% black — transparent containers)

**Text Colors:**
- **Text Primary:** `#E8E8E8` (Light grey — readable on dark)
- **Text Secondary:** `#FFFFFF` (Pure white — all button text)
- **Text Dark:** `#000000` (Black — on light backgrounds)
- **Text Highlight:** `rgb(157, 178, 221)` (Purple-blue — scores, titles)
- **Success/Celebration:** `#FFD700` (Gold — new high score only)

**Nokia Phone Call Colors (Special Case):**
- **Phone Background:** `#C0C0C0` (Grey)
- **Phone Border:** `#000000` (Black)
- **Phone Text:** `#000000` and `#333333`

**Combo Mode Canvas Colors (Special Case):**
- **Dark Purple:** `#4A148C`
- **Dark Blue:** `#0D47A1`
- **Dark Red:** `#B71C1C`
- **Dark Green:** `#1B5E20`

**RULE:** Never introduce new colors without updating this palette.

---

### Typography

**Font Family:**
- **Primary:** `'Jersey20'` (Custom retro font)
- **Fallback:** `'Courier New', monospace`

**Font Sizes (Hierarchy):**
- **H1 (Game Title):** `36px` (Desktop), `28px` (Mobile)
- **H2 (Screen Titles):** `32px` (Desktop), `24px` (Mobile)
- **H3 (Section Headers):** `24px`
- **Body Text:** `20px` (Desktop), `16px` (Mobile)
- **Buttons:** `20px` (Primary), `16-18px` (Secondary)
- **Small Text:** `14px` (Labels, hints)
- **Score Display:** `20px` (Current), `24px` (High Score)

**Font Weight:** Bold for titles, buttons, scores. Normal for body text.

**RULE:** All text uses Jersey20. No exceptions. 2px letter-spacing on titles for retro aesthetic.

---

### Layout & Spacing

**Grid System:**
- **Canvas Grid:** 25 x 20 units (10px per unit)
- **UI Spacing:** Multiples of 8px (8, 16, 24, 32, 40)

**Positioning:**
- **Overlays:** Center with `position: absolute`, `transform: translate(-50%, -50%)`
- **Fixed Elements:** `position: fixed` for always-visible UI (feedback button)

**Z-Index Layer Hierarchy:**

```
z-index: 0    - Game canvas (base layer)
z-index: 100  - Score display (always visible)
z-index: 150  - Game Over screen
z-index: 200  - Score popups
z-index: 300  - Tooltips (mystery food)
z-index: 400  - Phone overlay
z-index: 500  - Feedback button (corner utility)
z-index: 1000 - Modal overlays (feedback form)
z-index: 1001 - Thank You screen
```

**RULE:** Respect the z-index hierarchy. Never create overlapping layers with conflicting depths.

---

### Frames & Borders

**Canvas Border (Game Area Only):**
```css
border: 8px solid #800080;           /* Deep purple - canvas only */
box-shadow: 0 0 0 8px #1A1A2E;      /* Outer dark border layer */
border-radius: 0;                    /* Sharp corners for game area */
```

**Standard Menu Frame Pattern (ALL UI Menus & Modals):**
```css
border: 8px solid rgb(157, 178, 221);  /* Light purple-blue border */
box-shadow: 0 0 0 8px #1A1A2E;        /* Outer dark border layer */
border-radius: 12px;                   /* Small rounded corners */
background-color: rgba(0, 0, 0, 0.9);  /* 90% black for menu/game over */
/* OR */
background-color: rgba(0, 0, 0, 0.6);  /* 60% black for modals over overlay */
```

**When to Use Standard Menu Frame:**
- Menu screen — `rgba(0, 0, 0, 0.9)` background (no overlay)
- Game Over screen — `rgba(0, 0, 0, 0.9)` background (no overlay)
- Feedback modal — `rgba(0, 0, 0, 0.6)` background (over 80% black overlay)
- Thank You screen — `rgba(0, 0, 0, 0.6)` background (over overlay)

**Special Case — Score Display:**
```css
border: 8px solid #800080;           /* Deep purple - matches canvas */
box-shadow: 0 0 0 8px #1A1A2E;
border-radius: 0;                    /* Sharp corners */
background: rgba(255, 255, 255, 0.9); /* White background */
```

**Special Case — Nokia Phone Overlay:**
```css
border: 4px solid #000000;           /* Black border */
border-radius: 0;                    /* Sharp corners */
background: #C0C0C0;                 /* Grey Nokia screen */
```
Phone calls represent a different "device" interrupting the game — distinct visual language is intentional.

**CRITICAL RULES:**
1. `border-radius: 12px` on ALL menu frames (Menu, Game Over, Feedback, Thank You)
2. Canvas and Score Display remain sharp (`border-radius: 0`)
3. ALWAYS use `rgb(157, 178, 221)` for menu frame borders
4. ALWAYS use double-border pattern (border + box-shadow)
5. Container transparency depends on overlay: 90% for direct screens, 60% for overlaid modals

---

### Buttons

**Standard Button Style (ALL Menu & Modal Buttons):**
```css
font-family: 'Jersey20', 'Courier New', monospace;
font-size: 20px;
font-weight: bold;
padding: 15px 40px;
border: 2px solid rgb(157, 178, 221);
border-radius: 8px;
background-color: #000000;
color: #FFFFFF;
transition: all 0.2s;
min-width: 200px;
```

**Hover State:**
```css
background-color: rgb(157, 178, 221);
border-color: rgb(157, 178, 221);
color: #FFFFFF;
transform: scale(1.05);
```

**Active State (Click/Press):**
```css
background-color: rgb(157, 178, 221);
border-color: rgb(157, 178, 221);
transform: scale(0.98);
```

**Special Case — Nokia Phone "End" Button:**
```css
border: 3px solid #000000;
border-radius: 0;
background: #A0A0A0;
color: #000000;
```

**Special Case — Nokia Phone "Pick Up" Button:**
```css
border: 3px solid #000000;
border-radius: 0;
background: #60A060;               /* Green - "accept" */
color: #FFFFFF;
box-shadow: 0 0 8px rgba(255, 215, 0, 0.3); /* Subtle gold glow */
```

**Special Case — Feedback Corner Button:**
```css
font-size: 13px;
padding: 9px 13px;
border: 2px solid rgb(157, 178, 221);
border-radius: 6px;
background-color: rgba(26, 26, 26, 0.9);
```

**CRITICAL RULES:**
1. ALL standard buttons use `border-radius: 8px`
2. Border color NEVER changes — always `rgb(157, 178, 221)` in all states
3. Text is ALWAYS white `#FFFFFF`
4. Background transitions: Black (inactive) -> Purple-blue (active)
5. Scale animation: `scale(1.05)` hover, `scale(0.98)` click
6. Consistent timing: `transition: all 0.2s`
7. NO gold borders on hover
8. NO default selected states
9. NO glow effects (exception: Pick Up button subtle gold glow)

---

### Modal Overlays & Screens

**1. Direct Screens (Menu, Game Over) — No Overlay:**
```css
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background-color: rgba(0, 0, 0, 0.9);
border: 8px solid rgb(157, 178, 221);
box-shadow: 0 0 0 8px #1A1A2E;
border-radius: 12px;
padding: 40px;
text-align: center;
min-width: 300px;
z-index: 150-200;
```

**2. Modal Overlays (Feedback, Thank You) — With Full-Screen Overlay:**
```css
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000-1001;
}

.modal-container {
  background-color: rgba(0, 0, 0, 0.6);
  border: 8px solid rgb(157, 178, 221);
  box-shadow: 0 0 0 8px #1A1A2E;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
}
```

---

### Animations & Transitions

**Standard Transition:**
```css
transition: all 0.2s ease;
```

**Transform Transitions:**
- **Hover lift:** `transform: translateY(-2px)`
- **Active press:** `transform: scale(0.98)`
- **Button grow:** `transform: scale(1.05)`

**Timing:**
- **Fast interactions:** `0.2s` (buttons, hovers)
- **Fade-ins:** `0.3s` (modals appearing)
- **Combo canvas transition:** `0.5s` (canvas color fade)

**RULES:**
1. NEVER use animations on static game elements (canvas, snake, food) — they render per frame
2. ALWAYS use transitions on interactive elements (buttons, modals)
3. NEVER exceed 0.5s transition duration (except combo canvas: 500ms)
4. Use `ease` or `ease-out` — feels natural

---

### Accessibility & Touch Targets

**Minimum Touch Targets:**
- **Mobile buttons:** `44px x 44px` minimum (iOS guideline)
- **Desktop buttons:** `200px x 48px` recommended

**Focus States:**
```css
:focus {
  outline: 2px solid #FFD700;
  outline-offset: 2px;
}
```

**Contrast Requirements:**
- Text on dark backgrounds: Use `#E8E8E8` or `#FFFFFF` (AAA contrast)
- Text on light backgrounds: Use `#000000` (AAA contrast)

**ARIA Labels:** Add `aria-label` to icon-only buttons (feedback button, close buttons).

---

### Visual Effects

**Blur Effect (Background during interruptions):**
```css
filter: blur(4px);
transition: filter 0.2s;
```
Use for: Canvas when phone overlay is active.

**Shadow Usage:**
- **Structural borders:** `box-shadow: 0 0 0 8px #1A1A2E` (double border)
- **Blinking food anchor:** `2px drop shadow` (spatial findability)
- **Depth/elevation:** AVOID — not retro aesthetic
- **Glows:** AVOID on primary UI (exception: Pick Up button)

---

### Responsive Breakpoints

**Mobile:** `max-width: 768px`

**Adjustments at mobile:**
- Reduce font sizes by 15-25%
- Increase touch targets to 44px minimum
- Reduce padding (40px -> 30px -> 20px)
- Phone buttons stack vertically (End on top)
- Simplify layouts (single column)

**RULE:** Desktop is primary platform. Mobile is secondary but fully functional.

---

### Design System Maintenance

**When adding new features:**
1. Read this Design System section FIRST
2. Match existing patterns before inventing new ones
3. Reference Menu Screen or Game Over Screen as "source of truth"
4. Test on desktop and mobile
5. Verify no new colors, fonts, or border patterns introduced

---

## Food Visual System

### Six Food Types (V2 — Fibonacci Scoring)

| Food Type | Color | Shape | Points | Effect |
|-----------|-------|-------|--------|--------|
| **Growing** | `#00FF00` Green | Circle | +1 | Baseline — snake grows, no special effect |
| **Invincibility** | `#FFFF00` Yellow | Star | 0 | Wall/self immunity until next food eaten; rapid strobe visual |
| **Speed Decrease** | `#00FFFF` Cyan | Square | +2 | Decreased movement speed until next food eaten |
| **Wall Phase** | `#800080` Purple | Diamond | +1/+3 | Pass through one wall (+3 on wall interaction, +1 default) |
| **Speed Boost** | `#FF0000` Red | Triangle | +5 | Increased movement speed until next food eaten |
| **Reverse Controls** | `#FFA500` Orange | Hexagon | +8 | Inverted directional controls until next food eaten |

**Design Rationale:**
- Color + shape dual-coding ensures food types are distinguishable within ~200ms
- Shapes are distinct silhouettes readable at pixel-art scale
- Fibonacci scoring (0, +1, +2, +3, +5, +8) rewards difficulty proportionally
- All timed effects end when next food is consumed (simple, consistent rule)

**Food Rendering:**
- One food item on the board at a time
- New food spawns immediately after consumption
- Probability distribution configurable in config.js (Growing 40%, Invincibility 10%, Wall-Phase 10%, Speed Boost 15%, Speed Decrease 15%, Reverse Controls 10%)

**Shape Implementation (Canvas Path Drawing):**
Draw shape icon at center of food grid cell. Keep shapes bold and simple — readable at high speed.

---

### Snake Color States

The snake's color reflects its current active effect:

| State | Snake Color | Visual Indicator |
|-------|------------|-----------------|
| Default | Black (dark) | Standard |
| Growing | Green | After eating green food |
| Invincibility | Yellow | Rapid strobe flash |
| Speed Decrease | Cyan | Solid color |
| Wall Phase | Purple | Solid color |
| Speed Boost | Red | Solid color |
| Reverse Controls | Orange | Solid color |
| Combo Mode | Striped (Effect A + B alternating) | See Combo Mode section |

**Principle:** The snake IS the status display — no separate HUD needed for active effects. Players always look at the snake, so it doubles as a diegetic UI element.

---

## Score Popup System

Five distinct popup types corresponding to Fibonacci food values. Each popup has escalating visual salience proportional to cognitive difficulty.

### Popup Container

```css
.score-popup {
  position: absolute;
  font-family: 'Jersey20', 'Courier New', monospace;
  font-weight: bold;
  pointer-events: none;
  z-index: 200;
  animation-timing-function: ease-out;
}
```

**Positioning:** Spawn at food collision coordinates. Float upward (translateY). Fade out in final 200ms.

---

### +1 Score Popup (Growing Food)

```css
.score-popup-1 {
  font-size: 16px;
  color: #FFFFFF;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  animation: popup-1 500ms ease-out;
}

@keyframes popup-1 {
  0%   { opacity: 1; transform: translateY(0); }
  60%  { opacity: 1; transform: translateY(-20px); }
  100% { opacity: 0; transform: translateY(-30px); }
}
```
**Content:** `"+1"` | **Duration:** 500ms | **Effects:** Simple fade-up

---

### +2 Score Popup (Speed Decrease Food)

```css
.score-popup-2 {
  font-size: 16px;
  color: #90EE90; /* Light green */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  animation: popup-2 600ms ease-out;
}

@keyframes popup-2 {
  0%   { opacity: 1; transform: translateY(0); }
  60%  { opacity: 1; transform: translateY(-22px); }
  100% { opacity: 0; transform: translateY(-35px); }
}
```
**Content:** `"+2"` | **Duration:** 600ms | **Effects:** Slightly longer visibility

---

### +3 Score Popup (Wall Phase Food)

```css
.score-popup-3 {
  font-size: 20px;
  color: #FFD700; /* Gold */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9);
  animation: popup-3 700ms ease-out;
}

@keyframes popup-3 {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  20%  { transform: translateY(-5px) scale(1.1); } /* Slight bounce */
  40%  { transform: translateY(-3px) scale(1); }
  70%  { opacity: 1; transform: translateY(-25px) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(1); }
}
```
**Content:** `"+3"` | **Duration:** 700ms | **Effects:** Slight bounce at start

---

### +5 Score Popup (Speed Boost Food)

```css
.score-popup-5 {
  font-size: 28px;
  color: #FFA500; /* Orange */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9),
               0 0 8px rgba(255, 165, 0, 0.6); /* Subtle glow */
  animation: popup-5 800ms ease-out;
}

@keyframes popup-5 {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  15%  { transform: translateY(-8px) scale(1.15); } /* Bigger bounce */
  30%  { transform: translateY(-4px) scale(1); }
  70%  { opacity: 1; transform: translateY(-30px) scale(1); }
  100% { opacity: 0; transform: translateY(-50px) scale(1); }
}
```
**Content:** `"+5"` | **Duration:** 800ms | **Effects:** Pronounced bounce + orange glow

---

### +8 Score Popup (Reverse Controls Food)

```css
.score-popup-8 {
  font-size: 40px;
  font-weight: bold;
  color: #FF4500; /* Red-orange */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 1),
               0 0 12px rgba(255, 215, 0, 0.8), /* Gold glow */
               0 0 20px rgba(255, 69, 0, 0.6);  /* Red outer glow */
  animation: popup-8 1000ms ease-out;
}

@keyframes popup-8 {
  0%   { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
  10%  { transform: translateY(-10px) scale(1.2) rotate(-5deg); } /* Big bounce + wiggle */
  20%  { transform: translateY(-6px) scale(1.1) rotate(5deg); }
  30%  { transform: translateY(-8px) scale(1) rotate(0deg); }
  70%  { opacity: 1; transform: translateY(-40px) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translateY(-60px) scale(1) rotate(0deg); }
}
```
**Content:** `"+8"` | **Duration:** 1000ms

**Effects:**
- **Dramatic bounce:** 10px translateY + scale 1.2
- **Rotation wiggle:** +/-5 degrees during bounce
- **Dual glow:** Gold inner + red outer
- **Particles:** 5-7 star particles spawn at collision point
- **Screen shake:** 3px horizontal shake on canvas container, 200ms

**Particle Specifications:**
```css
.particle-star {
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #FFD700, #FFA500);
  position: absolute;
  animation: particle-explode 600ms ease-out forwards;
}

@keyframes particle-explode {
  0%   { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(var(--particle-x), var(--particle-y)) scale(0.3); }
}
```

**Screen Shake:**
```css
@keyframes screen-shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-3px); }
  75%      { transform: translateX(3px); }
}
```

---

### Popup Spawning & Queue

**Spawn Logic:**
```javascript
function spawnScorePopup(value, x, y, label = '') {
  // Create popup at collision coordinates
  // For +8: also trigger particles + screen shake
  // Auto-remove after animation duration
}
```

**300ms Stagger Rule:**
If multiple popups fire within 500ms (e.g., combo score + phone bonus), stagger by 300ms. Stack vertically: first popup at collision point, second popup 50px below.

---

## Blinking Food Visual System

At score 15+, a percentage of food items cycle through all 6 colors, hiding their effect type until consumed. Caps at 60% at score 80+.

### Color Cycling Animation

**Cycle Sequence:** Green -> Yellow -> Purple -> Red -> Cyan -> Orange -> repeat

**Timing:**
- **Standard:** 200ms per color (5 colors/second)
- **Reduced Motion:** 500ms per color (2 colors/second)

**Color Values:**
```javascript
const FOOD_COLORS = {
  green: '#00FF00',    // Growing
  yellow: '#FFFF00',   // Invincibility
  purple: '#800080',   // Wall Phase
  red: '#FF0000',      // Speed Boost
  cyan: '#00FFFF',     // Speed Decrease
  orange: '#FFA500'    // Reverse Controls
};

const BLINK_SEQUENCE = ['green', 'yellow', 'purple', 'red', 'cyan', 'orange'];
```

**Key rule:** Effect type is LOCKED at spawn, but HIDDEN until consumed. The visual cycling is purely cosmetic — it does not reflect the actual food type.

---

### Spatial Anchoring: Drop Shadow

**Problem:** At 200ms cycling, spatial attention may lag behind color processing. Players need a persistent visual anchor.

**Solution:** 2px drop shadow (luminance contrast for fast magnocellular pathway processing).

```javascript
function drawFoodShadow(x, y) {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
}
```

- Food appears to "float" slightly above canvas
- Shadow position constant during color cycle
- Brain processes shadow position faster than color identity

---

### First-Time Tooltip (Score 15)

When the first blinking food appears, show brief tooltip:

```css
.mystery-food-tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  border: 4px solid rgb(157, 178, 221);
  border-radius: 8px;
  padding: 20px 30px;
  font-family: 'Jersey20', monospace;
  font-size: 20px;
  color: #FFFFFF;
  text-align: center;
  z-index: 300;
  animation: tooltip-fade 3000ms ease-in-out forwards;
}

@keyframes tooltip-fade {
  0%  { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
```

**Content:** `"Mystery Food! Effect hidden until consumed"`

**Behavior:**
- Appears once per game session at score 15
- Auto-dismisses after 3 seconds
- Game continues running (no pause)
- Dismissed immediately on any keypress

---

## Combo Mode Visual System

At score 40+, combo mode can activate (probability-based). Three visual signals communicate combo state.

### Canvas Background Color Change

**Normal Mode:** `#E8E8E8` (light grey)

**Combo Mode Colors (Random Selection):**
```javascript
const COMBO_CANVAS_COLORS = [
  '#4A148C', // Dark purple
  '#0D47A1', // Dark blue
  '#B71C1C', // Dark red
  '#1B5E20'  // Dark green
];
```

**Transition:**
```css
#game-canvas {
  transition: background-color 500ms ease-in-out;
}
```

**Why dark colors:** Psychological signal ("stakes are higher"), increases contrast with snake colors, creates environmental cue for memory encoding, every combo feels unique.

---

### Striped Snake Pattern

**Head Color:** Effect B (most recent food consumed)
**Body:** Alternating Effect A / Effect B colors

**Example (Wall Phase + Speed Boost):**
```
Segment 0 (head):  RED (Effect B)
Segment 1:         PURPLE (Effect A)
Segment 2:         RED (Effect B)
Segment 3:         PURPLE (Effect A)
... barber pole pattern
```

**Rendering Logic:**
```javascript
function renderComboSnake(snake, effectA, effectB) {
  snake.segments.forEach((segment, index) => {
    let color;
    if (index === 0) {
      color = EFFECT_COLORS[effectB]; // Head = most recent
    } else {
      color = (index % 2 === 1) ? EFFECT_COLORS[effectA] : EFFECT_COLORS[effectB];
    }

    ctx.fillStyle = color;
    ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // Conditional border: add if adjacent colors are similar
    if (shouldAddBorder(color, previousSegmentColor)) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
  });
}
```

**Simpler alternative:** Apply 1px black borders to ALL segments during combo mode (consistent visual signal, retro-authentic NES/SNES style).

---

### Combo Entrance/Exit Effects

**Entrance Sequence:**
1. Canvas color transition (500ms fade to dark color)
2. Optional brief canvas flash (100ms white, single flash)
3. Audio fanfare (8-bit rising arpeggio)
4. Snake re-renders with Effect A color (solid, pre-stripe)

**Exit Sequence (Third Food Eaten):**
1. Canvas color transition back to `#E8E8E8` (500ms fade)
2. Snake reverts to standard rendering
3. Audio cue (descending deflation sound)
4. No dramatic exit animation — return to normalcy

---

### Combo + Phone Call Interaction

When phone rings during active combo:
1. Combo state preserved (dark canvas, stripe pattern)
2. Canvas blur applied (4px)
3. Phone overlay renders on top (z-index 400)
4. Player sees: blurred dark combo canvas + phone overlay
5. After phone dismissal: blur removes, combo resumes with all state intact

```css
#game-canvas.combo-active.phone-active {
  background-color: var(--combo-color);
  filter: blur(4px);
}
```

---

## Phone Call Enhancement UX

Two-button overlay transforms phone calls into strategic micro-decisions: End (safe, +1) or Pick Up (risk, +Fibonacci bonus).

### Phone Overlay Layout

```
+-------------------------------+
|                               |
|    [64x64 Caller Portrait]    |
|                               |
|    "Incoming call..."         |   <- Changes to one-liner on Pick Up
|       AL GORITHM              |
|                               |
|  (Space=End / Enter=PickUp)   |
|                               |
|   [End]        [Pick Up +N]   |   <- Two buttons, bonus value shown
|   +1 pt                       |
|                               |
|        [||||||||....]         |   <- Countdown bar (Pick Up only)
|                               |
+-------------------------------+
```

### Phone Overlay Container

```css
#phone-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  padding: 30px;
  background: #C0C0C0;
  border: 4px solid #000000;
  border-radius: 0;           /* Sharp corners - Nokia aesthetic */
  text-align: center;
  z-index: 400;
  font-family: 'Jersey20', monospace;
}
```

**Background Blur (game continues underneath):**
```css
#game-canvas.phone-active {
  filter: blur(4px);
  transition: filter 200ms ease-in-out;
}
```

---

### Caller Portrait Display

```css
#phone-portrait-container {
  width: 64px;
  height: 64px;
  margin: 0 auto 15px auto;
  border: 2px solid #000000;
  background: #FFFFFF;
}

#phone-portrait {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

**Fallback:** If portrait asset missing, `onerror` handler falls back to `PhoneIcone01_256px.png`.

**Assets:** 21 unique caller portraits, 64x64px PNG, retro pixel art style.

---

### Caller Name & Status Text

```css
#phone-caller-name {
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

#phone-status-text {
  font-size: 14px;
  color: #333333;
  margin-bottom: 20px;
  min-height: 40px;  /* Prevent layout shift */
  line-height: 1.4;
}
```

**Text Behavior:**
- **Before Pick Up:** "Incoming call..."
- **After Pick Up:** Caller's one-liner (fade-in 200ms)

```css
.one-liner-reveal {
  animation: fade-in-text 200ms ease-in;
}
@keyframes fade-in-text {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

---

### Two-Button Layout

```css
#phone-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}
```

**End Button:**
```css
#phone-btn-end {
  flex: 1;
  padding: 12px 20px;
  font-family: 'Jersey20', monospace;
  font-size: 18px;
  font-weight: bold;
  background: #A0A0A0;
  color: #000000;
  border: 3px solid #000000;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

#phone-btn-end:hover { background: #8A8A8A; transform: scale(1.05); }
#phone-btn-end:active { transform: scale(0.98); }

/* +1 pt indicator below */
#phone-btn-end::after {
  content: '+1 pt';
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #000000;
  white-space: nowrap;
}
```

**Pick Up Button:**
```css
#phone-btn-pickup {
  flex: 1;
  padding: 12px 20px;
  font-family: 'Jersey20', monospace;
  font-size: 18px;
  font-weight: bold;
  background: #60A060;
  color: #FFFFFF;
  border: 3px solid #000000;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.3); /* Subtle gold glow */
}

#phone-btn-pickup:hover {
  background: #50904F;
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
}

#phone-btn-pickup:active { transform: scale(0.98); }
```

**Button Content:**
- End button: `"End"`
- Pick Up button: `"Pick Up +[N]"` (dynamic Fibonacci value)

**Layout Rationale:**
- **Equal size** (`flex: 1`): Preserves autonomy (SDT principle)
- **End on left:** Reading order priority + Space bar mapping consistency
- **Pick Up glow:** Visual interest without size-based coercion
- **Fixed width:** Pick Up button accommodates longest text (`Pick Up +34`) without layout shift

---

### Mobile Touch Target Adjustments

```css
@media (max-width: 768px) {
  #phone-buttons {
    flex-direction: column;
    gap: 12px;
  }

  #phone-btn-end { order: 1; }    /* End on TOP (thumb-friendly safe choice) */
  #phone-btn-pickup {
    order: 2;
    min-height: 50px;             /* Increase touch target */
  }
}
```

---

### Pick Up Countdown Bar

Appears after Pick Up pressed. Replaces buttons during 1-3s timer.

```css
#phone-countdown-container {
  width: 100%;
  height: 20px;
  background: #808080;
  border: 2px solid #000000;
  margin-top: 20px;
  position: relative;
  display: none; /* Hidden by default */
}

#phone-countdown-bar {
  height: 100%;
  background: linear-gradient(90deg, #60A060, #FFD700); /* Green to gold */
  width: 100%;
  transition: width linear;
  /* Duration set dynamically: 1000-3000ms */
}
```

**Behavior:**
1. Hide buttons, show countdown container
2. Bar starts at 100%, shrinks to 0% over random duration (1-3s)
3. Timer expires -> auto-dismiss, Fibonacci bonus awarded
4. If player dies during Pick Up -> bonus still awarded (consolation)
5. Pick Up is irreversible — cannot End once committed

---

### Phone Bonus Popup

```css
.score-popup-phone {
  font-size: 24px;
  color: #FFD700; /* Gold - distinct from food popups */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9),
               0 0 10px rgba(255, 215, 0, 0.6);
  animation: popup-phone 800ms ease-out;
}
```

**Content format:** `"+13 CALL BONUS"` — source label distinguishes phone points from food/combo points.

---

### Desktop & Mobile Controls

**Desktop:**
- **Space** = End call
- **Enter** = Pick Up call

**Mobile:**
- Tap End button
- Tap Pick Up button

**Control Hints (Desktop):**
```css
#phone-control-hint {
  font-size: 12px;
  color: #666666;
  margin-top: 10px;
}
```
Content: `"(Space=End / Enter=Pick Up)"`

---

## High-Value Food Recognition

When players consume high-difficulty foods, display celebratory victory message flashes to enhance the achievement feeling.

### Reverse Controls Survival Flash

When the player **survives** Reverse Controls (eats next food without dying while controls are reversed), display a celebratory victory message.

**Message Pool (7 messages):**
```javascript
const RC_VICTORY_MESSAGES = [
  "UNSTOPPABLE!",
  "BRILLIANT!",
  "LEGENDARY!",
  "AMAZING!",
  "YOU RULE!",
  "YOU ROCK!",
  "AWESOME!"
];
```

**CSS Styling:**
```css
.victory-flash {
  position: absolute;
  font-family: 'Jersey20', monospace;
  font-size: 48px;
  color: #FFA500; /* Orange - matches RC food color */
  font-weight: 900;
  text-shadow: 0 0 12px rgba(255, 165, 0, 0.8),
               2px 2px 4px rgba(0, 0, 0, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  pointer-events: none;
  z-index: 1000;
  animation: victoryFlashFadeUp 2500ms ease-out forwards;
}

@keyframes victoryFlashFadeUp {
  0%   { opacity: 0; transform: translateY(0); }
  30%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-15px); }
}
```

**Content:** Random selection from 7-message pool on each survival

**Positioning:** Spawns 20px below the +8 score popup at same x coordinate. Appears 200ms after the +8 popup (stagger rule).

**Duration:** 2500ms (bold celebration, long enough to register during gameplay)

**Rationale:** Cognitive acknowledgment with variety. Orange color matches RC food for visual consistency. No bonus points — the +8 already compensates. This tells the player: "The game saw what your brain just did." Random message selection keeps feedback fresh across multiple plays, increasing replay value.

---

### Speed Boost Flash

When the player **eats** a Speed Boost food (+5), display a speed-themed celebratory message.

**Message Pool (7 messages):**
```javascript
const SPEED_BOOST_MESSAGES = [
  "SO FAST!",
  "BLAZING!",
  "LIGHTNING!",
  "SPEED DEMON!",
  "SUPERSONIC!",
  "WARP SPEED!",
  "TURBO MODE!"
];
```

**CSS Styling:**
```css
.speed-flash {
  position: absolute;
  font-family: 'Jersey20', monospace;
  font-size: 48px;
  color: #FF0000; /* Red - matches Speed Boost food color */
  font-weight: 900;
  text-shadow: 0 0 12px rgba(255, 0, 0, 0.8),
               2px 2px 4px rgba(0, 0, 0, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  pointer-events: none;
  z-index: 1000;
  animation: speedFlashFadeUp 2500ms ease-out forwards;
}

@keyframes speedFlashFadeUp {
  0%   { opacity: 0; transform: translateY(0); }
  30%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-15px); }
}
```

**Content:** Random selection from 7-message pool on each Speed Boost consumption

**Positioning:** Spawns 20px below the +5 score popup at same x coordinate. Appears 200ms after the +5 popup (stagger rule).

**Duration:** 2500ms (energetic celebration matching speed theme)

**Rationale:** Speed Boost (+5) is a high-value food that creates exciting gameplay moments. The flash amplifies the "I'm going fast!" feeling and adds thematic variety to the feedback system. Red color matches Speed Boost food for visual consistency and reinforces the speed/energy theme.

---

### Wall Phase Flash

When the player **uses** Wall Phase (crosses through a wall while Wall Phase effect is active), display a spatial mastery celebration message.

**Message Pool (7 messages):**
```javascript
const WALL_PHASE_MESSAGES = [
  "PHASED!",
  "WALL CROSSED!",
  "NO LIMITS!",
  "PHASE MASTER!",
  "WALL BREAKER!",
  "GHOSTED IT!",
  "BOUNDARY BROKEN!"
];
```

**CSS Styling:**
```css
.phase-flash {
  position: absolute;
  font-family: 'Jersey20', monospace;
  font-size: 48px;
  color: #800080; /* Purple - matches Wall Phase food color */
  font-weight: 900;
  text-shadow: 0 0 12px rgba(128, 0, 128, 0.8),
               2px 2px 4px rgba(0, 0, 0, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  pointer-events: none;
  z-index: 1000;
  animation: phaseFlashFadeUp 2500ms ease-out forwards;
}

@keyframes phaseFlashFadeUp {
  0%   { opacity: 0; transform: translateY(0); }
  30%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-15px); }
}
```

**Content:** Random selection from 7-message pool on each wall crossing

**Positioning:** Spawns 20px below the +2 bonus score popup at same x coordinate. Appears 200ms after the +2 popup (stagger rule).

**Duration:** 2500ms (celebrates strategic spatial planning)

**Rationale:** Wall Phase requires strategic navigation - player must eat the food AND successfully navigate to a wall boundary to earn the +2 bonus. The flash celebrates this spatial planning achievement. Purple color matches Wall Phase food for visual consistency. Random message selection keeps feedback fresh across multiple wall crossings.

---

## Post-Game Cognitive Feedback

After each death, before Play Again prompt, display 2-3 cognitive achievement stats. Transforms death from "I failed" into "look what my brain just did."

### Layout

```
+-------------------------------+
|                               |
|        GAME OVER              |
|        Score: 87              |
|        Best: 124              |
|                               |
|   --- Your Brain Today ---    |
|                               |
|   Reverse Controls: 4         |
|   Phone Calls Managed: 7     |
|   Mystery Foods Decoded: 12  |
|                               |
|       [Play Again]            |
|                               |
+-------------------------------+
```

### Stat Display Specifications

**Container:**
```css
.cognitive-stats {
  margin-top: 20px;
  padding: 15px;
  text-align: center;
}

.cognitive-stats-header {
  font-family: 'Jersey20', monospace;
  font-size: 14px;
  color: rgb(157, 178, 221); /* Purple theme */
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.cognitive-stat-line {
  font-family: 'Jersey20', monospace;
  font-size: 16px;
  color: #FFFFFF;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  margin: 5px 0;
  opacity: 0;
  animation: stat-line-appear 300ms ease-out forwards;
}

.cognitive-stat-line:nth-child(2) { animation-delay: 300ms; }
.cognitive-stat-line:nth-child(3) { animation-delay: 600ms; }
.cognitive-stat-line:nth-child(4) { animation-delay: 900ms; }

@keyframes stat-line-appear {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Header

`"Your Brain Today"` — celebratory, not clinical.

### Stat Selection Logic

**Track during gameplay:**

| Internal Key | Display Text | Show When |
|---|---|---|
| `rcSurvived` | "Reverse Controls survived: N" | N > 0 |
| `phoneCallsManaged` | "Phone calls managed: N" | N > 0 |
| `mysteryFoodsEaten` | "Mystery foods decoded: N" | N > 0 |
| `comboMultipliers` | "Combo multipliers earned: N" | N > 0 |
| `pickUpStreak` | "Pick Up streak: N" | N >= 2 |
| `peakComboScore` | "Best combo: xN" | N >= 6 |

**Selection rule:** Show top 2-3 stats with highest values. Never show zero-value stats. If only 1 stat qualifies, show only 1.

**Priority (if tied):** rcSurvived > comboMultipliers > pickUpStreak > mysteryFoodsEaten > phoneCallsManaged > peakComboScore

### Timing

1. Death animation plays
2. Game Over text + score appears
3. Cognitive stats fade in (300ms after score, stats stagger 300ms each)
4. Stats hold for 2.5 seconds
5. Stats fade out (500ms)
6. Play Again button appears

**Total time before Play Again:** ~3.3 seconds

### State Requirements

```javascript
cognitiveStats: {
  rcSurvived: 0,
  phoneCallsManaged: 0,
  mysteryFoodsEaten: 0,
  comboMultipliers: 0,
  pickUpStreak: 0,
  peakComboScore: 0
}
```

All stats reset on new game.

---

## Cross-System Visual Interaction Rules

### Visual Feedback Priority Matrix

When multiple visual events fire simultaneously:

| Priority | Event | Behavior |
|----------|-------|----------|
| 1 (highest) | Phone overlay | Modal interruption — always on top, blurs everything |
| 2 | Combo entrance/exit | Canvas transition delays 200ms if phone overlay active |
| 3 | Score popups | 300ms stagger if multiple within 500ms window |
| 4 (lowest) | Snake color changes | Immediate, no queuing |

### Combo Mode + Phone Call Stacking

1. Combo state preserved (canvas color, stripe pattern)
2. Canvas blur applied (4px)
3. Phone overlay on top (z-index 400)
4. Player resolves call (End or Pick Up)
5. Phone dismissed, blur removes (200ms transition)
6. Combo resumes — all state intact

### Combo Transition Delay Rule

If phone overlay is active, delay combo canvas transition by 200ms:

```javascript
function transitionComboCanvas(newColor) {
  if (phoneCall.active) {
    setTimeout(() => applyCanvasColorTransition(newColor), 200);
  } else {
    applyCanvasColorTransition(newColor);
  }
}
```

### Death During Combo + Pick Up (Edge Case)

If player dies while combo active AND Pick Up timer running:

1. Death triggers
2. Countdown bar stops
3. **Both rewards awarded:**
   - Combo multiplier (A x B) if food B was eaten
   - Pick Up Fibonacci bonus (consolation reward)
4. Score popups stack vertically:
   - Combo popup: `"+24 COMBO"` (center)
   - Phone popup: `"+13 CALL BONUS"` (50px below, 300ms stagger)
5. Game Over screen appears after popups fade (~1.5s delay)

---

## Audio Feedback Specifications

### Score Popup Audio — Fibonacci Musical Progression

| Score | Note | Frequency | Duration | Type |
|-------|------|-----------|----------|------|
| +1 | C4 | 261.63 Hz | 100ms | Sine wave beep |
| +2 | D4 | 293.66 Hz | 120ms | Sine wave chime |
| +3 | E4 | 329.63 Hz | 150ms | Triangle wave chime |
| +5 | G4 | 392.00 Hz | 180ms | Triangle wave chime |
| +8 | C5-E5-G5 | 523/659/784 Hz | 250ms | C major chord (3 sine waves) |

### State-Based Movement Sounds

Each snake state has distinct movement sounds (7 states x 2 alternating sounds):
- **Default (black):** Neutral blip
- **Green (growing):** Pleasant tone
- **Yellow (invincibility):** Powerful tone
- **Purple (wall phase):** Ethereal tone
- **Red (speed boost):** Energetic tone
- **Cyan (speed decrease):** Heavy/slow tone
- **Orange (reverse controls):** Dissonant tone

### Combo Mode Audio

- **Entrance:** 8-bit fanfare / rising arpeggio (C-E-G-C), 400ms
- **Exit:** Descending "wah wah" slide (G -> C, 1 octave down), 300ms
- **High-value combo (15+ pts):** Extended "jackpot" fanfare, 600ms
- **Legendary combo (30+ pts):** Extended triumphant chord with echo, 800ms

### Phone Call Audio

- **Incoming ring:** Nokia-style retro ring (loops until answered)
- **Pick Up activation:** Click / accept tone, 50ms
- **End call:** Hang-up click, 30ms

### Game Over

- **Sound:** 8-bit short melody

### Menu

- **Sound:** 8-bit looping background music

---

## Accessibility & Reduced Motion Mode

### Detection

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Reduced Motion Adjustments

| Element | Standard | Reduced Motion |
|---------|----------|---------------|
| Blinking food | 200ms per color | 500ms per color OR alpha pulse |
| Score popups | Bounce + rotation | Simple fade-up, no bounce/rotation |
| Screen shake (+8) | 3px, 200ms | Disabled entirely |
| Combo canvas transition | 500ms smooth fade | Instant color change |
| Stat line stagger | 300ms per line | Instant appearance |

**Alpha Pulse Alternative (Blinking Food):**
```javascript
function renderBlinkingFoodReducedMotion(food) {
  const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 500);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = food.hiddenColor;
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  ctx.globalAlpha = 1.0;
}
```

### Color Blindness Considerations (Post-V2)

Food shapes already provide secondary coding (circle, star, diamond, triangle, square, hexagon). For explicit colorblind mode, draw shape icons at center of food cells using canvas path drawing.

---

## Implementation Checklist

### Score Popup System
- [ ] Create 5 popup classes (score-popup-1 through score-popup-8)
- [ ] Implement keyframe animations for each value
- [ ] Add particle system for +8 (5-7 star particles, radial spread)
- [ ] Implement screen shake (3px, 200ms)
- [ ] Add Web Audio API generation for Fibonacci musical progression
- [ ] Implement popup queue system (300ms stagger rule)
- [ ] Verify temporal contiguity (<200ms popup spawn delay)

### Food Visual System
- [ ] Implement 6 food types with color + shape rendering
- [ ] Snake color changes based on active effect
- [ ] Food spawning with probability-based distribution

### Blinking Food System
- [ ] Implement color cycling animation (200ms per color)
- [ ] Add drop shadow rendering (2px offset, 50% opacity)
- [ ] Create reduced motion mode (500ms cycle OR alpha pulse)
- [ ] Implement first-time tooltip at score 15
- [ ] Verify shadow improves spatial findability

### Combo Mode Visual System
- [ ] Implement canvas background color transition (500ms fade)
- [ ] Create 4 dark combo colors array (random selection)
- [ ] Build striped snake rendering (alternating segment colors)
- [ ] Implement segment borders (conditional or always-on during combo)
- [ ] Create combo entrance/exit transitions
- [ ] Implement combo + phone pause behavior (state preservation)

### Phone Call Enhancement UX
- [ ] Create phone overlay container (Nokia grey aesthetic)
- [ ] Implement caller portrait display (64x64, fallback to generic icon)
- [ ] Build two-button layout (End left, Pick Up right)
- [ ] Add dynamic Pick Up bonus text (`Pick Up +[N]`)
- [ ] Implement subtle glow on Pick Up button
- [ ] Create mobile vertical stacking (End top, Pick Up bottom)
- [ ] Build countdown bar animation (1-3s linear width shrink)
- [ ] Add one-liner fade-in animation (200ms after Pick Up)
- [ ] Implement canvas blur when phone active (4px)
- [ ] Create phone bonus popup with "CALL BONUS" label
- [ ] Add keyboard controls (Space=End, Enter=Pick Up)
- [ ] Test touch targets on mobile (minimum 44px)

### Reverse Controls Recognition
- [ ] Implement "RC SURVIVED" flash (12px, white, 400ms)
- [ ] Position 20px below +8 popup, 200ms stagger
- [ ] Track rcSurvived count in cognitiveStats

### Post-Game Cognitive Feedback
- [ ] Add cognitiveStats object to gameState (6 stats)
- [ ] Implement stat tracking in game event handlers
- [ ] Build "Your Brain Today" display with stat selection logic
- [ ] Stat line stagger animation (300ms per line)
- [ ] 3.3s delay before Play Again button appears
- [ ] Reduced motion: instant appearance
- [ ] Reset all cognitiveStats on new game

### Cross-System Integration
- [ ] Implement z-index layer hierarchy
- [ ] Create combo transition delay rule (200ms if phone active)
- [ ] Build death reward popup stacker (combo + phone vertical)
- [ ] Test combo + phone visual stacking
- [ ] Verify popup queue across all systems

### Audio System
- [ ] Generate score audio for all Fibonacci values
- [ ] State-based movement sounds (7 states x 2 alternating)
- [ ] Combo entrance fanfare + exit deflation
- [ ] High-value combo sounds (15+ and 30+ points)
- [ ] Nokia-style phone ring loop
- [ ] Pick Up accept tone + End hang-up click
- [ ] Game over melody
- [ ] Menu background music

### Accessibility
- [ ] Implement reduced motion detection
- [ ] Create reduced motion blinking food
- [ ] Disable screen shake in reduced motion
- [ ] Simplify popup animations
- [ ] Verify keyboard navigation for all interactions
- [ ] Add ARIA labels for screen readers

---

*UX Design Specification prepared by Sally (UX Designer) with Celia (Neuro-Game Design Expert)*
*"Every pixel serves the player. Every animation trains the brain. Every choice respects autonomy."*
