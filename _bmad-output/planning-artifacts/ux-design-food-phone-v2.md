# CrazySnakeLite: Food v2 & Phone Calls v2 UX Design Specification
## Complete Visual Implementation Guide

**Author:** Sally (UX Designer) & Celia (Neuro-Game Design Expert)
**Date:** February 7, 2026
**Status:** Ready for Implementation
**Version:** 2.0

---

## Executive Summary

This document provides pixel-perfect UX specifications for integrating two major game system upgrades into CrazySnakeLite:

1. **Food v2 System:** Fibonacci scoring, progressive blinking food, and combo mode with multiplicative scoring
2. **Phone Calls v2 System:** Two-button decision mechanic (End vs Pick Up), Fibonacci pickup bonuses, and caller personality system

All specifications are grounded in cognitive psychology principles (from Celia's game design documents) and seamlessly integrated with CrazySnakeLite's existing visual design language (Jersey20 font, `rgb(157, 178, 221)` purple theme, retro pixel aesthetic).

**Design Philosophy:** Every visual element serves both **usability** (clear feedback, spatial clarity) and **engage-ability** (emotional impact, reward prediction error, flow state maintenance).

---

## Table of Contents

1. [Design Principles & Cognitive Foundation](#design-principles--cognitive-foundation)
2. [Score Popup System](#score-popup-system)
3. [Blinking Food Visual System](#blinking-food-visual-system)
4. [Combo Mode Visual System](#combo-mode-visual-system)
5. [Phone Call Enhancement UX](#phone-call-enhancement-ux)
6. [Cross-System Visual Interaction Rules](#cross-system-visual-interaction-rules)
7. [Audio Feedback Specifications](#audio-feedback-specifications)
8. [Accessibility & Reduced Motion Mode](#accessibility--reduced-motion-mode)
9. [Implementation Checklist](#implementation-checklist)

---

## Design Principles & Cognitive Foundation

### Core UX Principles (From Celia's Framework)

**1. Reward Prediction Error Scaling**
- Visual feedback intensity must match cognitive difficulty
- Fibonacci scoring progression requires proportional visual salience
- +8 score events trigger micro-celebration responses

**2. Temporal Contiguity (<200ms)**
- All feedback appears within 200ms of player action
- Brain links cause → effect for reward learning
- No perceptible delay between food consumption and popup

**3. Luminance Contrast Over Color**
- Spatial location uses brightness/shadow (fast processing via magnocellular pathway)
- Color identification uses hue (slower parvocellular pathway)
- Blinking food uses shadow for position, color for mystery

**4. Figure-Ground Segregation**
- Clear boundaries between visual elements (Gestalt psychology)
- Conditional borders when color similarity creates ambiguity
- Maintains retro aesthetic while ensuring clarity

**5. Autonomy Preservation (Self-Determination Theory)**
- Choice elements (buttons) must appear neutral in size
- Visual interest without coercion
- Equal physical dimensions, different visual weight through effects

**6. Context-Dependent Memory Encoding**
- Distinct visual states (combo mode canvas colors) create memory anchors
- Environmental cues aid recall of high-scoring moments
- Background color changes encode "stakes are higher" signal

---

## Score Popup System

### Overview

Five distinct popup types corresponding to Fibonacci food values: +1, +2, +3, +5, +8.
Each popup has escalating visual salience proportional to cognitive difficulty.

### Technical Architecture

**Popup Container:**
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

**Positioning Logic:**
- Spawn at food collision coordinates
- Float upward during animation (translateY)
- Fade out in final 200ms of duration

---

### +1 Score Popup (Growing Food)

**Visual Specifications:**
```css
.score-popup-1 {
  font-size: 16px;
  color: #FFFFFF; /* Pure white */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* Readability on light canvas */
  animation: popup-1 500ms ease-out;
}

@keyframes popup-1 {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  60% {
    opacity: 1;
    transform: translateY(-20px);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
}
```

**Content:** `"+1"`

**Duration:** 500ms

**Effects:** Simple fade-out while floating up

**Audio:** Soft beep (C note, 440Hz)

**Rationale:** Baseline snake gameplay - minimal visual interruption, acknowledges action without distraction.

---

### +2 Score Popup (Speed Decrease Food)

**Visual Specifications:**
```css
.score-popup-2 {
  font-size: 16px;
  color: #90EE90; /* Light green - "breathing room" color */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  animation: popup-2 600ms ease-out;
}

@keyframes popup-2 {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  60% {
    opacity: 1;
    transform: translateY(-22px);
  }
  100% {
    opacity: 0;
    transform: translateY(-35px);
  }
}
```

**Content:** `"+2"`

**Duration:** 600ms

**Effects:** Slightly longer visibility than +1 (acknowledges higher value)

**Audio:** Soft chime (D note, 494Hz)

**Rationale:** Relief reward - slightly more visible than baseline to reinforce "this helped you."

---

### +3 Score Popup (Wall Phase Food)

**Visual Specifications:**
```css
.score-popup-3 {
  font-size: 20px; /* 25% larger than +1/+2 */
  color: #FFD700; /* Gold yellow - noticeable value */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9);
  animation: popup-3 700ms ease-out;
}

@keyframes popup-3 {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  20% {
    transform: translateY(-5px) scale(1.1); /* Slight bounce */
  }
  40% {
    transform: translateY(-3px) scale(1);
  }
  70% {
    opacity: 1;
    transform: translateY(-25px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(1);
  }
}
```

**Content:** `"+3"`

**Duration:** 700ms

**Effects:** Slight bounce (5px translateY + scale 1.1) at start

**Audio:** Mid chime (E note, 523Hz)

**Rationale:** Mid-tier value - bounce animation creates memorable moment, signals "good job!"

---

### +5 Score Popup (Speed Boost Food)

**Visual Specifications:**
```css
.score-popup-5 {
  font-size: 28px; /* 75% larger than baseline */
  color: #FFA500; /* Orange - high energy */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9),
               0 0 8px rgba(255, 165, 0, 0.6); /* Subtle glow */
  animation: popup-5 800ms ease-out;
}

@keyframes popup-5 {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  15% {
    transform: translateY(-8px) scale(1.15); /* Bigger bounce */
  }
  30% {
    transform: translateY(-4px) scale(1);
  }
  70% {
    opacity: 1;
    transform: translateY(-30px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-50px) scale(1);
  }
}
```

**Content:** `"+5"`

**Duration:** 800ms

**Effects:**
- Pronounced bounce (8px translateY + scale 1.15)
- Subtle orange glow (outer text-shadow)

**Audio:** High chime (G note, 784Hz)

**Rationale:** High-value food - significant visual presence, glow adds excitement without overwhelming.

---

### +8 Score Popup (Reverse Controls Food)

**Visual Specifications:**
```css
.score-popup-8 {
  font-size: 40px; /* 150% larger than baseline - crosses JND threshold */
  font-weight: bold;
  color: #FF4500; /* Red-orange base */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 1),
               0 0 12px rgba(255, 215, 0, 0.8), /* Gold glow */
               0 0 20px rgba(255, 69, 0, 0.6);  /* Red outer glow */
  animation: popup-8 1000ms ease-out;
}

@keyframes popup-8 {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
  10% {
    transform: translateY(-10px) scale(1.2) rotate(-5deg); /* Big bounce + wiggle */
  }
  20% {
    transform: translateY(-6px) scale(1.1) rotate(5deg);
  }
  30% {
    transform: translateY(-8px) scale(1) rotate(0deg);
  }
  70% {
    opacity: 1;
    transform: translateY(-40px) scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(1) rotate(0deg);
  }
}
```

**Content:** `"+8"`

**Duration:** 1000ms (longest visibility)

**Effects:**
- **Dramatic bounce:** 10px translateY + scale 1.2
- **Rotation wiggle:** ±5° rotation during bounce (activates V5 motion-sensitive neurons)
- **Dual glow:** Gold inner (triumph) + red outer (intensity)
- **Particle system:** 5-7 star particles spawn at collision point
- **Screen shake:** 3px horizontal shake applied to canvas container

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
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--particle-x), var(--particle-y)) scale(0.3);
    /* --particle-x and --particle-y set per particle: radial spread pattern */
  }
}
```

**Screen Shake:**
```javascript
// Apply to #game-container element
function triggerScreenShake() {
  const container = document.getElementById('game-container');
  container.style.animation = 'screen-shake 200ms ease-in-out';
  setTimeout(() => {
    container.style.animation = '';
  }, 200);
}
```

```css
@keyframes screen-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}
```

**Audio:** Triumphant chord (C major: C-E-G, 523-659-784Hz played simultaneously)

**Rationale (Celia's Input):** Peak difficulty deserves micro-celebration. Rotation + particles + shake create multi-sensory reward prediction error. This should make players SMILE the first time they see it.

---

### Popup Positioning & Spawning

**Collision-Based Spawn:**
```javascript
function spawnScorePopup(value, x, y) {
  const popup = document.createElement('div');
  popup.className = `score-popup score-popup-${value}`;
  popup.textContent = `+${value}`;
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;

  document.getElementById('game-canvas-wrapper').appendChild(popup);

  // Spawn particles for +8
  if (value === 8) {
    spawnParticles(x, y);
    triggerScreenShake();
  }

  // Auto-remove after animation completes
  const duration = [500, 600, 700, 800, 1000][getPopupIndex(value)];
  setTimeout(() => popup.remove(), duration);
}
```

---

### Visual Feedback Priority Queue

**Problem:** When multiple popups fire within 500ms (e.g., combo score + phone bonus), prevent visual collision.

**Solution: 300ms Stagger Rule**

```javascript
let lastPopupTime = 0;
const POPUP_STAGGER_DELAY = 300; // ms

function queueScorePopup(value, x, y, label = '') {
  const now = Date.now();
  const timeSinceLastPopup = now - lastPopupTime;

  if (timeSinceLastPopup < POPUP_STAGGER_DELAY) {
    // Delay this popup
    setTimeout(() => {
      spawnScorePopup(value, x, y, label);
    }, POPUP_STAGGER_DELAY - timeSinceLastPopup);
  } else {
    spawnScorePopup(value, x, y, label);
  }

  lastPopupTime = Date.now();
}
```

**Stacking Behavior:**
- If two popups are visible simultaneously, stack vertically
- First popup: y position at collision point
- Second popup: y position + 50px below first

---

## Blinking Food Visual System

### Overview

At score 20+, a percentage of food items cycle through all 6 colors, hiding their effect type until consumed. Visual design must balance **mystery** (core mechanic) with **spatial findability** (usability).

### Color Cycling Animation

**Cycle Sequence:**
Green → Yellow → Purple → Red → Cyan → Orange → repeat

**Timing:**
- **Standard:** 200ms per color (5 colors/second)
- **Reduced Motion:** 500ms per color (2 colors/second) - see Accessibility section

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

**Animation Implementation:**
```javascript
function renderBlinkingFood(food, frameCount) {
  const cycleIndex = Math.floor((frameCount * 200 / 1000) % 6); // 200ms per color
  const currentColor = FOOD_COLORS[BLINK_SEQUENCE[cycleIndex]];

  // Draw food with current cycle color
  ctx.fillStyle = currentColor;
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

  // CRITICAL: Draw shadow for spatial anchoring (Celia's recommendation)
  drawFoodShadow(food.x, food.y);
}
```

---

### Spatial Anchoring: Drop Shadow

**Problem (From Celia):** At 200ms color cycling, spatial attention may lag behind color processing. Players need persistent visual anchor.

**Solution:** 2px drop shadow (luminance contrast for fast magnocellular pathway processing)

**Shadow Specifications:**
```javascript
function drawFoodShadow(x, y) {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Shadow renders BEFORE food fill
  // Creates persistent spatial anchor regardless of color
}
```

**Visual Result:**
- Food appears to "float" slightly above canvas
- Shadow position constant during color cycle
- Adds depth while maintaining retro aesthetic
- Brain processes shadow position faster than color identity

**Why This Works (Cognitive Science):**
- Luminance contrast (light/dark) processed 40-80ms faster than chromatic contrast
- Shadow provides spatial cue without revealing food type
- Preserves mystery mechanic while solving usability concern

---

### First-Time Tooltip (Score 20)

When the first blinking food appears (player reaches score 20), show brief tooltip:

**Tooltip Design:**
```css
.mystery-food-tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  border: 4px solid rgb(157, 178, 221); /* Standard purple */
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
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
```

**Content:**
```
Mystery Food!
Effect hidden until consumed
```

**Behavior:**
- Appears once per game session when score reaches 20
- Auto-dismisses after 3 seconds (fade-out)
- Game continues running underneath (no pause)
- Dismissed immediately if player presses any key

---

## Combo Mode Visual System

### Overview

At score 40+, combo mode can activate (probability-based). Visual system must communicate:
1. **Combo is active** (canvas color change)
2. **Current effects** (striped snake pattern)
3. **Stakes are higher** (environmental transformation)

---

### Canvas Background Color Change

**Purpose:** Context-dependent memory encoding - creates distinct visual state for "high stakes mode"

**Normal Mode Color:**
```css
#game-canvas {
  background-color: #E8E8E8; /* Light grey - standard */
}
```

**Combo Mode Colors (Rotate Randomly):**
```javascript
const COMBO_CANVAS_COLORS = [
  '#4A148C', // Dark purple
  '#0D47A1', // Dark blue
  '#B71C1C', // Dark red
  '#1B5E20'  // Dark green
];

function getRandomComboColor() {
  return COMBO_CANVAS_COLORS[Math.floor(Math.random() * 4)];
}
```

**Transition Animation:**
```css
#game-canvas {
  transition: background-color 500ms ease-in-out;
}
```

**Activation Sequence:**
1. Combo triggers after food consumption
2. Select random dark color from array
3. Apply 500ms smooth transition to canvas background
4. Canvas remains dark color until combo ends (third food eaten)
5. Transition back to #E8E8E8 on combo exit

**Why Dark Colors (From Celia):**
- Psychological signal: "stakes are higher"
- Increases contrast with light snake colors (improves visibility)
- Creates environmental cue for memory encoding
- Every combo feels visually unique (random color selection)

---

### Striped Snake Pattern

**Purpose:** Communicate dual-effect state (Effect A + Effect B) through visual encoding

**Pattern Specifications:**

**Head Color:** Effect B (most recent food consumed)

**Body Segments:** Alternating colors between Effect A and Effect B

**Example (Wall Phase +3, then Speed Boost +5):**
```
Effect A: Purple (Wall Phase)
Effect B: Red (Speed Boost)

Segment 0 (head):  RED    ← Effect B
Segment 1:         PURPLE ← Effect A
Segment 2:         RED    ← Effect B
Segment 3:         PURPLE ← Effect A
Segment 4:         RED    ← Effect B
... barber pole pattern continues
```

**Rendering Logic:**
```javascript
function renderComboSnake(snake, effectA, effectB) {
  snake.segments.forEach((segment, index) => {
    let color;

    if (index === 0) {
      // Head always shows Effect B (most recent)
      color = EFFECT_COLORS[effectB];
    } else {
      // Body alternates: odd = Effect A, even = Effect B
      color = (index % 2 === 1)
        ? EFFECT_COLORS[effectA]
        : EFFECT_COLORS[effectB];
    }

    // Draw segment with selected color
    ctx.fillStyle = color;
    ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // CONDITIONAL BORDER: Add if colors are similar
    if (shouldAddBorder(color, previousSegmentColor)) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
  });
}
```

---

### Conditional Segment Borders (Celia's Recommendation)

**Problem:** Adjacent similar colors (red + orange, cyan + purple) lose figure-ground segregation

**Solution:** Smart border system - only add borders when needed

**Color Similarity Detection:**
```javascript
function shouldAddBorder(color1, color2) {
  // Convert hex to RGB
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  // Calculate Euclidean distance in RGB space
  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );

  // If distance < threshold, colors are too similar
  const MAX_DISTANCE = 255 * Math.sqrt(3); // Max possible distance
  const similarity = 1 - (distance / MAX_DISTANCE);

  return similarity > 0.6; // Add border if >60% similar
}
```

**Border Specifications:**
```css
/* Applied conditionally via canvas strokeRect */
border: 1px solid #000000;
```

**Alternative (Simpler Implementation):**
If color similarity calculation is too complex, apply borders to **all segments during combo mode**:

```javascript
// Always border during combo = consistent visual signal
ctx.strokeStyle = '#000000';
ctx.lineWidth = 1;
ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);
```

**Rationale:** 1px black borders are retro-authentic (NES/SNES sprite pattern). Creates distinct "combo mode" rendering identity.

---

### Combo Entrance Visual Effects

**Sequence on Activation:**

1. **Canvas color transition** (500ms fade to dark color)
2. **Brief canvas flash** (optional - single white flash, 100ms)
3. **Audio fanfare** (8-bit orchestral hit - see Audio section)
4. **Snake re-renders with Effect A color** (solid, pre-stripe)

**Optional Flash Animation:**
```css
@keyframes combo-entrance-flash {
  0% { filter: brightness(1); }
  50% { filter: brightness(2); }
  100% { filter: brightness(1); }
}

#game-canvas.combo-entrance {
  animation: combo-entrance-flash 100ms ease-in-out;
}
```

---

### Combo Exit Visual Effects

**Sequence on Exit (Third Food Eaten):**

1. **Canvas color transition back** (500ms fade to #E8E8E8)
2. **Snake reverts to standard rendering** (solid color based on current effect)
3. **Audio cue** (deflating "wah wah" descending sound)

**No dramatic exit animation** - combo ending is return to normalcy, not celebration

---

### Combo + Phone Call Interaction

**Special Case:** Phone call arrives during active combo mode

**Visual Behavior:**
1. Combo mode state **preserved** (dark canvas color remains)
2. Phone overlay renders **on top** of dark combo canvas
3. Blur effect applies to combo-state game (blur + dark background stack)
4. After phone dismissal, combo resumes exactly where it left off
5. Canvas color, snake stripe pattern, all state intact

**CSS Stacking:**
```css
/* Combo canvas remains visible under phone overlay */
#game-canvas.combo-active {
  background-color: var(--combo-color); /* Dark color */
  filter: blur(4px); /* When phone overlay active */
}

#phone-overlay {
  z-index: 400; /* Above blurred combo canvas */
}
```

**Visual Priority:**
Phone overlay (z-index 400) > Blurred combo canvas (z-index 0) > Normal canvas

---

## Phone Call Enhancement UX

### Overview

Two-button overlay system transforms phone calls from simple interruption into strategic micro-decision. Visual design must communicate:
1. **Two distinct choices** (End vs Pick Up)
2. **Risk/reward values** (points visible before decision)
3. **Caller personality** (portraits + one-liners add humanity)
4. **Timer urgency** (countdown bar during Pick Up)

---

### Phone Overlay Container

**Base Overlay Structure:**
```css
#phone-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  padding: 30px;
  background: #C0C0C0; /* Nokia grey screen */
  border: 4px solid #000000;
  border-radius: 0; /* Sharp corners - Nokia aesthetic */
  text-align: center;
  z-index: 400;
  font-family: 'Jersey20', monospace;
}
```

**Background Blur:**
```css
#game-canvas.phone-active {
  filter: blur(4px);
  transition: filter 200ms ease-in-out;
}
```

---

### Caller Portrait Display

**Portrait Container:**
```html
<div id="phone-portrait-container">
  <img id="phone-portrait"
       src="assets/callers/[caller-name].png"
       alt="[Caller Name]"
       onerror="this.src='assets/PhoneIcone01_256px.png'">
</div>
```

**Portrait Specifications:**
```css
#phone-portrait-container {
  width: 64px;
  height: 64px;
  margin: 0 auto 15px auto;
  border: 2px solid #000000;
  background: #FFFFFF; /* White background for portrait */
}

#phone-portrait {
  width: 64px;
  height: 64px;
  image-rendering: pixelated; /* Preserve pixel art crispness */
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
```

**Asset Specifications:**
- **Format:** PNG with transparency
- **Dimensions:** 64px × 64px exact
- **Style:** Retro pixel art, bold outlines, limited color palette
- **Fallback:** Generic phone icon (`PhoneIcone01_256px.png`) if portrait missing

**Portrait Note for Assets:**
21 unique caller portraits needed (see game design doc for full roster: Al Gorithm, Meg A. Byte, Ali Sing, etc.). Assets to be created separately - just note requirement in implementation.

---

### Caller Name & Status Text

**Caller Name Display:**
```css
#phone-caller-name {
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

**Status Text (Incoming / One-Liner):**
```css
#phone-status-text {
  font-size: 14px;
  color: #333333;
  margin-bottom: 20px;
  min-height: 40px; /* Prevent layout shift when text changes */
  line-height: 1.4;
}
```

**Text Behavior:**
- **Before Pick Up:** "Incoming call..."
- **After Pick Up:** Caller's one-liner (fade-in 200ms)

**One-Liner Fade Animation:**
```css
.one-liner-reveal {
  animation: fade-in-text 200ms ease-in;
}

@keyframes fade-in-text {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

### Two-Button Layout

**Container:**
```css
#phone-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}
```

**End Button Specifications:**
```css
#phone-btn-end {
  flex: 1;
  padding: 12px 20px;
  font-family: 'Jersey20', monospace;
  font-size: 18px;
  font-weight: bold;
  background: #A0A0A0; /* Nokia grey button */
  color: #000000;
  border: 3px solid #000000;
  border-radius: 0; /* Sharp corners */
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

#phone-btn-end:hover {
  background: #8A8A8A; /* Darker grey */
  transform: scale(1.05);
}

#phone-btn-end:active {
  transform: scale(0.98);
}

/* Small +1 indicator below button */
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

**Pick Up Button Specifications:**
```css
#phone-btn-pickup {
  flex: 1;
  padding: 12px 20px;
  font-family: 'Jersey20', monospace;
  font-size: 18px;
  font-weight: bold;
  background: #60A060; /* Green - implies "accept" */
  color: #FFFFFF;
  border: 3px solid #000000;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s;

  /* Subtle glow for visual interest (Celia's recommendation) */
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}

#phone-btn-pickup:hover {
  background: #50904F; /* Darker green */
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.5); /* Glow intensifies */
}

#phone-btn-pickup:active {
  transform: scale(0.98);
}
```

**Button Content:**
- **End button:** "End"
- **Pick Up button:** "Pick Up +[N]" (dynamic Fibonacci value)

**Dynamic Bonus Display:**
```javascript
function updatePickUpButton(pickUpCount) {
  const bonus = getPickUpBonus(pickUpCount); // Fibonacci calculation
  document.getElementById('phone-btn-pickup').textContent = `Pick Up +${bonus}`;
}
```

---

### Button Layout Rationale (From Celia)

**Equal Size:** Both buttons `flex: 1` - preserves autonomy (SDT principle)

**End on Left:** Reading order priority + Space bar mapping consistency

**Pick Up Glow:** Visual interest without size-based coercion

**Why This Works:**
- Player perceives genuine choice (no dominance hierarchy)
- Bonus value visible before decision (informed consent)
- Glow creates magnetism through luminance, not size
- Maintains Nokia aesthetic while adding modern UX polish

---

### Mobile Touch Target Adjustments

**Problem:** Side-by-side buttons on small screens risk accidental taps

**Solution: Vertical Stacking on Mobile**

```css
@media (max-width: 768px) {
  #phone-buttons {
    flex-direction: column;
    gap: 12px;
  }

  /* End on TOP (thumb-friendly "safe" choice) */
  #phone-btn-end {
    order: 1;
  }

  #phone-btn-pickup {
    order: 2;
    min-height: 50px; /* Increase touch target */
  }
}
```

**Rationale:** Vertical stack prevents mis-taps, End on top maintains "safe choice" priority

---

### Pick Up Countdown Bar

**Display Behavior:**
- Hidden until Pick Up button pressed
- Appears in place of buttons during 1-3s timer
- Horizontal progress bar shrinking left-to-right

**Countdown Container:**
```css
#phone-countdown-container {
  width: 100%;
  height: 20px;
  background: #808080; /* Dark grey background */
  border: 2px solid #000000;
  margin-top: 20px;
  position: relative;
  display: none; /* Hidden by default */
}

#phone-countdown-bar {
  height: 100%;
  background: linear-gradient(90deg, #60A060, #FFD700); /* Green to gold */
  width: 100%; /* Starts full, shrinks to 0% */
  transition: width linear;
  /* Transition duration set dynamically based on random timer (1-3s) */
}
```

**Animation Logic:**
```javascript
function startPickUpCountdown(duration) {
  // Hide buttons, show countdown
  document.getElementById('phone-buttons').style.display = 'none';
  document.getElementById('phone-countdown-container').style.display = 'block';

  const bar = document.getElementById('phone-countdown-bar');
  bar.style.width = '100%';
  bar.style.transition = `width ${duration}ms linear`;

  // Trigger shrink animation
  setTimeout(() => {
    bar.style.width = '0%';
  }, 10); // Small delay for transition to register

  // Auto-dismiss after duration
  setTimeout(() => {
    dismissPhoneCall();
    awardPickUpBonus();
  }, duration);
}
```

**Visual Effect:**
Bar shrinks from 100% → 0% over random duration (1000-3000ms), creating urgency as time runs out.

---

### Phone Bonus Popup

When phone call rewards points (End +1 or Pick Up +N), spawn popup with distinct label:

**Popup Content:**
```
"+13 CALL BONUS"
```

**Styling:**
```css
.score-popup-phone {
  font-size: 24px;
  color: #FFD700; /* Gold - distinct from food popups */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9),
               0 0 10px rgba(255, 215, 0, 0.6);
  animation: popup-phone 800ms ease-out;
}
```

**Label Distinction:**
"CALL BONUS" suffix differentiates phone points from food points - player understands source of reward.

**Queuing:**
If phone bonus fires within 300ms of combo score popup, apply stagger rule (see Score Popup System).

---

### Keyboard & Mobile Controls

**Desktop Controls:**
```javascript
document.addEventListener('keydown', (e) => {
  if (phoneCall.active && !phoneCall.pickedUp) {
    if (e.code === 'Space') {
      endCall(); // End call, +1 point
    } else if (e.code === 'Enter') {
      pickUpCall(); // Pick Up call, start timer
    }
  }
});
```

**Mobile Touch:**
```javascript
document.getElementById('phone-btn-end').addEventListener('click', () => {
  endCall();
});

document.getElementById('phone-btn-pickup').addEventListener('click', () => {
  pickUpCall();
});
```

**Control Hints (Desktop):**
```html
<div id="phone-control-hint">
  (Space=End / Enter=Pick Up)
</div>
```

```css
#phone-control-hint {
  font-size: 12px;
  color: #666666;
  margin-top: 10px;
}
```

---

## Cross-System Visual Interaction Rules

### Z-Index Layer Hierarchy

**Complete Stacking Order:**
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

**Rule:** Higher layers always render above lower layers. Phone overlay > score popups > game canvas.

---

### Visual Feedback Priority Matrix

When multiple visual events fire simultaneously:

| Priority | Event | Behavior |
|----------|-------|----------|
| 1 (highest) | Phone overlay | Modal interruption - always on top, blurs everything underneath |
| 2 | Combo entrance/exit | Canvas transition delays 200ms if phone overlay is active |
| 3 | Score popups | 300ms stagger if multiple popups within 500ms window |
| 4 (lowest) | Snake color changes | Immediate, no queuing needed |

---

### Combo Mode + Phone Call Stacking

**Scenario:** Phone rings during active combo mode (dark canvas, striped snake)

**Visual Sequence:**
1. Combo mode state preserved (canvas color, snake stripes remain)
2. Canvas blur applied (4px) - dark combo background blurs
3. Phone overlay renders on top (z-index 400)
4. Player sees: blurred dark combo canvas + phone overlay
5. Player resolves call (End or Pick Up)
6. Phone overlay dismisses
7. Canvas blur removes (200ms transition)
8. Combo mode resumes - all state intact (Effect A, Effect B, stripe pattern, dark canvas)

**CSS:**
```css
#game-canvas.combo-active.phone-active {
  background-color: var(--combo-color); /* Dark color remains */
  filter: blur(4px);
}
```

---

### Combo Transition Delay Rule

**Problem:** Combo entrance/exit transitions (canvas color fade 500ms) can clash with phone overlay appearing

**Solution:** If phone overlay active, delay combo transition by 200ms

```javascript
function transitionComboCanvas(newColor) {
  if (phoneCall.active) {
    // Delay transition until phone resolves or 200ms buffer
    setTimeout(() => {
      applyCanvasColorTransition(newColor);
    }, 200);
  } else {
    // Immediate transition
    applyCanvasColorTransition(newColor);
  }
}
```

---

### Death During Combo + Pick Up

**Edge Case:** Player dies while combo active AND Pick Up timer running

**Visual Sequence:**
1. Death animation triggers (snake disappears, game freezes)
2. Phone countdown bar stops (if Pick Up active)
3. **Both rewards awarded:**
   - Combo multiplier points (A × B) if food B was eaten
   - Pick Up Fibonacci bonus (consolation reward)
4. Score popups spawn (may stack vertically):
   - Combo popup: "+24 COMBO"
   - Phone popup: "+13 CALL BONUS"
5. Game Over screen appears after popups fade (delay 1.5s)

**Popup Stacking:**
```javascript
function spawnDeathRewardPopups(comboPoints, phoneBonus) {
  // Spawn combo popup at center
  spawnScorePopup(comboPoints, canvasWidth / 2, canvasHeight / 2, 'COMBO');

  // Spawn phone popup 50px below
  setTimeout(() => {
    spawnScorePopup(phoneBonus, canvasWidth / 2, canvasHeight / 2 + 50, 'CALL BONUS');
  }, 300); // Stagger by 300ms
}
```

---

## Audio Feedback Specifications

### Score Popup Audio

**Fibonacci Musical Progression:**

| Score | Note | Frequency | Duration | Type |
|-------|------|-----------|----------|------|
| +1 | C4 | 261.63 Hz | 100ms | Sine wave beep |
| +2 | D4 | 293.66 Hz | 120ms | Sine wave chime |
| +3 | E4 | 329.63 Hz | 150ms | Triangle wave chime |
| +5 | G4 | 392.00 Hz | 180ms | Triangle wave chime |
| +8 | C5-E5-G5 | 523.25 / 659.25 / 783.99 Hz | 250ms | C major chord (3 sine waves) |

**Audio Implementation (Web Audio API):**
```javascript
function playScoreSound(value) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const now = audioContext.currentTime;

  if (value === 8) {
    // C major chord for +8
    [523.25, 659.25, 783.99].forEach(freq => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      oscillator.start(now);
      oscillator.stop(now + 0.25);
    });
  } else {
    // Single note for +1, +2, +3, +5
    const frequencies = {1: 261.63, 2: 293.66, 3: 329.63, 5: 392.00};
    const durations = {1: 0.1, 2: 0.12, 3: 0.15, 5: 0.18};

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequencies[value];
    oscillator.type = value >= 3 ? 'triangle' : 'sine';

    const duration = durations[value];
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}
```

---

### Combo Mode Audio

**Combo Entrance:**
- **Sound:** 8-bit orchestral hit / fanfare
- **Duration:** 400ms
- **Pitch:** Rising arpeggio (C-E-G-C)
- **Style:** Triumphant, attention-grabbing

**Combo Exit:**
- **Sound:** Descending "wah wah" / deflating sound
- **Duration:** 300ms
- **Pitch:** Descending slide (G → C, 1 octave down)
- **Style:** Return to normalcy, not celebration

**High-Value Combo (15+ points):**
- **Sound:** Extended "jackpot" fanfare
- **Duration:** 600ms
- **Pitch:** Full C major scale ascending
- **Style:** Major celebration

**Legendary Combo (30+ points):**
- **Sound:** Extended triumphant chord with echo
- **Duration:** 800ms
- **Style:** Peak emotional moment

---

### Phone Call Audio

**Incoming Call Ring:**
- **Sound:** Nokia-style ringtone (retro beep pattern)
- **Duration:** Loops until answered
- **Volume:** Moderate (not jarring)

**Pick Up Activation:**
- **Sound:** Click / accept tone
- **Duration:** 50ms
- **Style:** Confirmation beep

**End Call:**
- **Sound:** Hang-up click
- **Duration:** 30ms
- **Style:** Simple dismissal

---

## Accessibility & Reduced Motion Mode

### Reduced Motion Settings Detection

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  enableReducedMotionMode();
}
```

---

### Reduced Motion Adjustments

**Blinking Food:**
- **Standard:** 200ms per color (5 colors/second)
- **Reduced Motion:** 500ms per color (2 colors/second)
- OR: Use alpha pulse instead of color cycling

**Alpha Pulse Alternative:**
```javascript
function renderBlinkingFoodReducedMotion(food) {
  const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 500); // Slow sine wave
  ctx.globalAlpha = alpha;
  ctx.fillStyle = food.hiddenColor; // Show actual color, just pulse opacity
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  ctx.globalAlpha = 1.0;
}
```

**Score Popups:**
- **Standard:** Bounce + rotation animations
- **Reduced Motion:** Simple fade-up, no bounce, no rotation

**Combo Canvas Transition:**
- **Standard:** 500ms smooth fade
- **Reduced Motion:** Instant color change (no transition)

**Screen Shake (+8 score):**
- **Standard:** 3px horizontal shake, 200ms
- **Reduced Motion:** Disabled entirely

---

### Color Blindness Considerations

**Food Colors:**
Current palette relies heavily on color distinction. Consider adding **shape coding** for color-blind players:

**Shape Icons (Optional Enhancement):**
```
Green (Growing):       Circle
Yellow (Invincibility): Star
Purple (Wall Phase):    Diamond
Red (Speed Boost):      Triangle
Cyan (Speed Decrease):  Square
Orange (Reverse):       Hexagon
```

**Implementation:**
Draw small icon shape in center of food square using canvas path drawing.

---

## Implementation Checklist

### Score Popup System
- [ ] Create 5 popup classes (score-popup-1 through score-popup-8)
- [ ] Implement keyframe animations for each value (+1, +2, +3, +5, +8)
- [ ] Add particle system for +8 (5-7 star particles, radial spread)
- [ ] Implement screen shake effect (3px, 200ms)
- [ ] Add audio generation for Fibonacci musical progression
- [ ] Implement popup queue system (300ms stagger rule)
- [ ] Test popup spawning at collision coordinates
- [ ] Verify temporal contiguity (<200ms popup spawn delay)

### Blinking Food System
- [ ] Implement color cycling animation (200ms per color)
- [ ] Add drop shadow rendering (2px offset, 50% opacity)
- [ ] Create reduced motion mode (500ms cycle OR alpha pulse)
- [ ] Implement first-time tooltip at score 20
- [ ] Test visual clarity at various snake speeds
- [ ] Verify shadow improves spatial findability (user testing)

### Combo Mode Visual System
- [ ] Implement canvas background color transition (500ms fade)
- [ ] Create 4 dark combo colors array (random selection)
- [ ] Build striped snake rendering (alternating segment colors)
- [ ] Implement conditional border system (color similarity detection)
- [ ] Add combo entrance flash animation (optional 100ms white flash)
- [ ] Create combo exit transition (fade back to light grey)
- [ ] Implement combo + phone pause behavior (state preservation)
- [ ] Test visual clarity of striped pattern at high speeds

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

### Cross-System Integration
- [ ] Implement z-index layer hierarchy (phone > popups > canvas)
- [ ] Create combo transition delay rule (200ms if phone active)
- [ ] Build death reward popup stacker (combo + phone vertical stack)
- [ ] Test combo + phone visual stacking (blur + dark canvas)
- [ ] Verify popup queue works across systems (food + combo + phone)

### Audio System
- [ ] Generate score audio for all Fibonacci values (C-D-E-G-Chord)
- [ ] Create combo entrance fanfare (rising arpeggio)
- [ ] Create combo exit sound (descending wah wah)
- [ ] Add high-value combo sound (15+ points jackpot)
- [ ] Add legendary combo sound (30+ points epic fanfare)
- [ ] Implement phone ring loop (Nokia-style retro beep)
- [ ] Test audio mixing (prevent overlapping sound clutter)

### Accessibility
- [ ] Implement reduced motion detection (prefers-reduced-motion)
- [ ] Create reduced motion blinking food (500ms cycle or alpha pulse)
- [ ] Disable screen shake in reduced motion mode
- [ ] Simplify popup animations (no bounce/rotation)
- [ ] Test color-blind accessibility (consider shape coding)
- [ ] Verify keyboard navigation (all interactions accessible)
- [ ] Add ARIA labels for screen readers

### Testing & Validation
- [ ] Test all systems at score 20 (blinking food introduction)
- [ ] Test all systems at score 40 (combo mode introduction)
- [ ] Test edge case: death during combo + Pick Up (both rewards awarded)
- [ ] Test visual clarity under maximum chaos (80% blinking, active combo, phone call)
- [ ] User test: Can players find blinking food with shadow anchor?
- [ ] User test: Do +8 popups feel like micro-celebrations?
- [ ] User test: Is combo mode striped snake immediately recognizable?
- [ ] User test: Are phone button choices perceived as neutral (autonomy test)?
- [ ] Performance test: Frame rate stable with particles + popups + stripes?

---

## Design System Integration Verification

**Consistency Check with Existing CrazySnakeLite Design:**

✅ **Typography:**
- All text uses Jersey20 font family
- Font sizes follow established hierarchy
- Letter-spacing consistent (2px on titles)

✅ **Color Palette:**
- Purple theme maintained: `rgb(157, 178, 221)` for UI elements
- New colors (score popups, combo canvas) complement existing palette
- Phone overlay uses distinct Nokia aesthetic (intentional differentiation)

✅ **Borders & Frames:**
- Standard double-border pattern (border + box-shadow)
- Phone overlay uses sharp corners (matches Nokia aesthetic exception)
- Combo snake segments use conditional 1px borders (retro-authentic)

✅ **Animations:**
- All transitions ≤0.3s duration (feels responsive)
- Button interactions consistent (scale 1.05 hover, 0.98 active)
- Smooth easing (ease-out, ease-in-out)

✅ **Spacing:**
- 8px multiple grid maintained
- Padding consistent with existing screens
- Z-index hierarchy respected

✅ **Responsive:**
- Mobile breakpoint at 768px
- Touch targets minimum 44px (iOS guideline)
- Vertical stacking for phone buttons on mobile

---

## Closing Notes

### For Developers

This specification provides pixel-perfect implementation details for all Food v2 and Phone Calls v2 visual systems. Every measurement, color value, timing, and animation has been carefully considered to balance:

1. **Usability** (Hodent's framework): Clear feedback, spatial clarity, cognitive load management
2. **Engage-ability** (Hodent's framework): Emotional impact, reward prediction error, flow state maintenance
3. **Cognitive Psychology** (Celia's principles): Temporal contiguity, luminance contrast, autonomy preservation, memory encoding

**Key Success Metrics:**
- Score popups feel proportional to achievement (especially +8 micro-celebration)
- Blinking food remains findable despite color cycling (shadow anchor)
- Combo mode immediately recognizable (striped snake, dark canvas)
- Phone call choices feel genuinely neutral (equal button size, informed decision)
- Systems interact gracefully (no visual collisions, smooth stacking)

### For Future UX Iterations

**Potential Enhancements (Post-Launch):**
1. Shape coding for food types (color-blind accessibility)
2. Haptic feedback on mobile (vibration for +8 scores, phone rings)
3. Combo streak counter (visual indicator of consecutive combos)
4. Caller "favorites" system (portraits unlock as discovered)
5. Custom color themes (let players choose combo canvas colors)

**Playtest Questions:**
1. Do players understand combo mode within 5 seconds of activation?
2. Does the +8 popup make players smile?
3. Can players locate blinking food without frustration?
4. Do players feel the Pick Up vs End choice is genuinely optional?
5. At score 100+ (maximum chaos), is the game exciting or overwhelming?

---

**This specification is ready for implementation. Let's build something beautiful that players will love! 🎨✨**

---

*Document prepared by Sally (UX Designer) with Celia (Neuro-Game Design Expert)*
*"Every pixel serves the player. Every animation tells a story. Every choice respects autonomy."*
