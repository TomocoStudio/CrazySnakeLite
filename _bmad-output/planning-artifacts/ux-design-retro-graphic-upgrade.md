# UX Design Spec — Retro Graphic Design Upgrade

**Author:** Sally (UX Designer)
**For:** Tomoco
**Date:** 2026-02-16
**Status:** Draft for Review
**Foundations:** `game-ux-principles.md` (Hodent), `dataviz-principles.md` (DataViz), `80s Video Game Graphic Design Overview.pdf` (Tomoco Research), PRD, Architecture, Project Context
**Scope:** 8 graphic design enhancements inspired by 1980s arcade visual language

---

## Design Rationale

CrazySnakeLite already has strong retro DNA: Jersey20 pixel font, pixelated 64x64 caller portraits, color-coded food system, tiled background texture, and score-tiered popup drama. These elements are working.

However, cross-referencing the game's current visual implementation against the foundational principles documented in Tomoco's *"The Visual Language of 1980s Video Games"* reveals 8 specific areas where authentic 80s graphic design techniques would:

1. **Deepen retro authenticity** — align the visual language with the era CrazySnakeLite channels
2. **Strengthen cognitive training** — several techniques directly improve the visual information channels that feed the game's cognitive exercises
3. **Amplify emotional peaks** — the "game feel" micro-interactions that make players gasp, laugh, and hit Play Again (Axiom 7: "Emotional peaks are the product")

Every enhancement below has been validated against the **Five-Question Filter** from `game-ux-principles.md` to ensure it serves — not hinders — the cognitive fitness mission.

---

## Enhancement 1: Progressive Dark Playfield ("Neon Noir")

### 80s Design Principle

> "The 'off' state of a pixel was a pure, deep, luminous black. Graphic designers utilized this absolute blackness as a negative-space canvas, rendering the maze walls in electric, fluorescent blues and stark whites." — 80s Graphic Design Overview, Maze Chase section

The defining visual signature of the 80s arcade was **neon color against absolute black void**. CRT monitors physically made colored pixels glow against un-fired phosphor. This created the "Neon Noir" aesthetic that defines Pac-Man, Galaxian, and the entire arcade era.

### Current State

- **V4.1 Update (Feb 2026):** Full Neon Noir from start — constant dark background with inverse grid progression
- Background: Dark `#1a1a1a` constant throughout (no progression)
- Grid lines: White → Black progressive darkening as mastery increases
- Maximum contrast creates arcade void aesthetic immediately

### Design Specification

**Concept:** **Immediate arcade immersion** — the playfield is dark from first pixel, establishing the neon void aesthetic instantly. The **grid lines** provide the progression signal, starting as bright white spatial scaffolding and progressively fading to black as the player masters the space.

**Why inverse grid progression:** The dark void is earned through cognitive familiarity, not score. Starting players need MAXIMUM spatial scaffolding (white grid lines, high contrast). As mastery develops, the grid fades into the void — the player no longer needs the training wheels. This inverts the original "safe daylight → dangerous dark" progression to "supported navigation → mastery void."

#### Color Progression Table

| Score Range | Background | Grid Lines | Grid Opacity | Mood |
|---|---|---|---|---|
| 0-14 | `#1a1a1a` | `#FFFFFF` | 0.9 | Arcade void, max scaffolding |
| 15-29 | `#1a1a1a` | `#CCCCCC` | 0.75 | Grid begins to fade |
| 30-49 | `#1a1a1a` | `#999999` | 0.6 | Scaffolding removal begins |
| 50-79 | `#1a1a1a` | `#666666` | 0.5 | Half-visible grid |
| 80-99 | `#1a1a1a` | `#333333` | 0.4 | Ghost lines emerge |
| 100+ | `#1a1a1a` | `#000000` | 0.3 | Grid dissolved, mastery void |

- **Background:** Constant `#1a1a1a` (darkest tier from original spec) — Full Neon Noir from game start
- **Grid progression:** White → Black (inverse of original) — scaffolding fades as mastery increases
- **Grid opacity:** Still fades 0.9 → 0.3 (unchanged) — compounds with color darkening for ghost grid effect
- **Combo mode:** Canvas background still applies combo colors during combo state
- **Food/Snake glow:** Constant maximum intensity (blur 8) throughout — no score-based changes

#### Config Structure

```javascript
// config.js — V4.1 Update
BACKGROUND_THRESHOLDS: [
  { minScore: 0,   maxScore: 14,  background: '#1a1a1a' },  // Dark constant
  { minScore: 15,  maxScore: 29,  background: '#1a1a1a' },
  { minScore: 30,  maxScore: 49,  background: '#1a1a1a' },
  { minScore: 50,  maxScore: 79,  background: '#1a1a1a' },
  { minScore: 80,  maxScore: 99,  background: '#1a1a1a' },
  { minScore: 100, maxScore: Infinity, background: '#1a1a1a' }
],

GRID_LINE_THRESHOLDS: [
  { minScore: 0,   maxScore: 14,  gridLine: '#FFFFFF' },  // White → Black progression
  { minScore: 15,  maxScore: 29,  gridLine: '#CCCCCC' },
  { minScore: 30,  maxScore: 49,  gridLine: '#999999' },
  { minScore: 50,  maxScore: 79,  gridLine: '#666666' },
  { minScore: 80,  maxScore: 99,  gridLine: '#333333' },
  { minScore: 100, maxScore: Infinity, gridLine: '#000000' }
],

GLOW_INTENSITY_THRESHOLDS: [
  { minScore: 0,   maxScore: Infinity, blur: 8 }  // Constant maximum glow
],
```

#### Module Boundaries

- **config.js:** Owns the progression table (all tunable values)
- **progression.js:** Resolves `score → background/gridLine` via `getState()` (adds two new fields to the returned object, same pattern as `blinkProbability` and `comboProbability`)
- **render.js:** Reads the resolved colors from progression and applies them in `clearCanvas()` and `renderGrid()`. No scoring logic in render.
- **game.js:** No changes needed — render.js already receives `gameState` which contains `score`

#### Five-Question Filter

1. **Working Memory:** No WM cost. Grid fading is ambient/preattentive — the player doesn't consciously track it, they *feel* the scaffolding dissolve as mastery develops.
2. **Competence Feedback:** **Inverse feedback** — the grid's dissolution signals mastery, not danger. "The training wheels are coming off because I no longer need them." This is competence validation through scaffolding removal.
3. **Clarity:** Immediate arcade aesthetic. No "safe daylight" phase to overcome. The dark void establishes the tone from pixel one: "This is an arcade game." Maximum clarity through consistency.
4. **Flow Preservation:** Grid fades so gradually players don't notice individual transitions. The change is felt over sessions, not within a single game. No jarring shifts to break flow.
5. **Emotional Impact:** **Instant immersion** — the Full Neon Noir aesthetic from game start creates immediate emotional resonance with 80s arcade memory. No ramp-up period. The glowing neon objects against absolute black void is the emotional baseline, not the earned climax.

#### Accessibility

- Grid lines remain visible at all tiers (contrast ratio stays above 1.5:1 against background)
- Food colors maintain minimum 3:1 contrast ratio against the darkest background (`#2A2A2A`). All 6 food colors pass this check:
  - Green `#00FF00` on `#2A2A2A`: 9.2:1 pass
  - Yellow `#FFFF00` on `#2A2A2A`: 14.1:1 pass
  - Purple `#800080` on `#2A2A2A`: 2.1:1 — **needs glow halo (Enhancement 3) to compensate**
  - Red `#FF0000` on `#2A2A2A`: 3.9:1 pass
  - Cyan `#00CED1` on `#2A2A2A`: 8.1:1 pass
  - Orange `#FFA500` on `#2A2A2A`: 6.7:1 pass
- Snake (`#000000`) on dark backgrounds: requires a 1px outline highlight — see Enhancement 4
- `prefers-reduced-motion`: Transition still applies (it's a slow color shift, not motion)

#### Interaction with Existing Systems

- **Combo mode canvas colors** (`#4A148C`, `#0D47A1`, `#B71C1C`, `#1B5E20`): These override the progression background during combo. On combo exit, background returns to progression tier. The existing 500ms CSS transition handles this.
- **Phone overlay blur:** No interaction — blur applies to canvas regardless of background color.
- **Score display:** White text `#FFFFFF` remains readable against all progression backgrounds (lightest tier `#E8E8E8` has the score bar with its own `rgba(0,0,0,0.8)` background).

---

## Enhancement 2: Distinctive Food Shapes (Pixel Silhouette Economy)

### 80s Design Principle

> "Every single dot of glowing phosphor on a CRT monitor carried immense representational and semiotic weight. The visual economy required to render a recognizable human face within an 8x8 pixel grid necessitated a mastery of silhouette, contrast, and abstraction." — 80s Graphic Design Overview, Introduction

> "Pac-Man's protagonist is supreme graphic design minimalism: a solid yellow circle with a simple wedge removed. This iconic silhouette visually communicates the core gameplay loop (eating) instantaneously." — Maze Chase section

The 80s pixel economy demanded that **every shape carry maximum meaning**. Shape was the primary recognition channel; color was secondary. This is because CRT phosphor bleed and limited palettes meant colors could be ambiguous — but silhouettes were reliable.

### Current State

- ALL 6 food types render as identical 11x11 filled squares (Story 5-3)
- Color is the ONLY differentiator between food types
- Original distinct shapes (star, ring, cross, hollow square, X) were defined in project-context.md but removed from render.js for "visibility"

### Design Specification

**Concept:** Re-introduce distinctive pixel-art shapes for each food type, designed with 80s pixel economy principles: bold silhouettes, high contrast, 1px dark outlines for separation against any background.

**Why this matters cognitively:** Hodent's Principle 1 states "Food shapes must be instantly distinguishable" and "Shape + color must communicate type within a single glance (~200ms)." The current all-squares design violates this — it forces the player to decode color alone, which is a single-channel recognition task. Adding shape creates **dual-channel recognition** (shape + color), which is both faster and more robust. This directly trains pattern recognition and divided attention — two of the game's targeted cognitive faculties.

#### Shape Specifications

All shapes render within a 14x14 pixel canvas, centered in the 20x20 grid unit. Each shape has a 1px outline in a darker variant of its fill color for separation against any background (critical for Enhancement 1's dark playfield).

| Food Type | Shape | Fill Color | Outline Color | Pixel Art Description |
|---|---|---|---|---|
| **Growing** | Filled square | `#00FF00` | `#009900` | 12x12 solid square. The baseline. Simple, sturdy, "I'm food." |
| **Invincibility** | 4-point star | `#FFFF00` | `#B8B800` | Diamond rotated 45deg with 4 triangular points extending from center. Reads as "power-up / special." |
| **Wall Phase** | Ring (hollow circle) | `#800080` | `#550055` | 14px diameter circle, 3px stroke, hollow center. Reads as "pass through" — the hole IS the meaning. |
| **Speed Boost** | Cross / Plus (+) | `#FF0000` | `#B30000` | 4px-wide vertical + horizontal bars intersecting at center. Reads as "energy / medical / boost." |
| **Speed Decrease** | Hollow square | `#00CED1` | `#009199` | 14x14 outer edge, 2px stroke, hollow center. Square frame = "containment / slowdown." |
| **Reverse Controls** | X shape (diagonal cross) | `#FFA500` | `#B37400` | Two 3px-wide diagonal bars crossing at center. Reads as "warning / inversion / X marks danger." The crown jewel food gets the most aggressive shape. |

#### Rendering Approach

Each shape is drawn using canvas primitives (no image assets needed). The rendering function pattern:

```javascript
// render.js — renderFood() updated
function renderFoodShape(ctx, x, y, type, color, outlineColor) {
  const cx = x + CONFIG.UNIT_SIZE / 2;  // center x
  const cy = y + CONFIG.UNIT_SIZE / 2;  // center y

  ctx.fillStyle = color;
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 1;

  switch (type) {
    case 'growing':
      // Filled square (12x12, centered)
      ctx.fillRect(cx - 6, cy - 6, 12, 12);
      ctx.strokeRect(cx - 6, cy - 6, 12, 12);
      break;

    case 'invincibility':
      // 4-point star
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);     // top
      ctx.lineTo(cx + 3, cy - 3);
      ctx.lineTo(cx + 7, cy);     // right
      ctx.lineTo(cx + 3, cy + 3);
      ctx.lineTo(cx, cy + 7);     // bottom
      ctx.lineTo(cx - 3, cy + 3);
      ctx.lineTo(cx - 7, cy);     // left
      ctx.lineTo(cx - 3, cy - 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'wallPhase':
      // Hollow circle (ring)
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();
      // Outer outline
      ctx.beginPath();
      ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = outlineColor;
      ctx.stroke();
      break;

    case 'speedBoost':
      // Cross / Plus (+)
      ctx.fillRect(cx - 2, cy - 7, 4, 14);  // vertical bar
      ctx.fillRect(cx - 7, cy - 2, 14, 4);  // horizontal bar
      ctx.strokeRect(cx - 2, cy - 7, 4, 14);
      ctx.strokeRect(cx - 7, cy - 2, 14, 4);
      break;

    case 'speedDecrease':
      // Hollow square
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 7, cy - 7, 14, 14);
      // Outer outline
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 8, cy - 8, 16, 16);
      break;

    case 'reverseControls':
      // X shape (diagonal cross)
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 6);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.moveTo(cx + 6, cy - 6);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.stroke();
      // Thinner outline layer
      ctx.lineWidth = 5;
      ctx.strokeStyle = outlineColor;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 6);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.moveTo(cx + 6, cy - 6);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      break;
  }
}
```

#### Config Changes

```javascript
// config.js — updated FOOD_SIZE and new outline colors
FOOD_SIZE: 14,  // Increased from 11 for shape clarity

COLORS: {
  // ... existing colors ...
  // New: outline variants for food shapes
  foodGrowingOutline: '#009900',
  foodInvincibilityOutline: '#B8B800',
  foodWallPhaseOutline: '#550055',
  foodSpeedBoostOutline: '#B30000',
  foodSpeedDecreaseOutline: '#009199',
  foodReverseControlsOutline: '#B37400'
}
```

#### Blinking Food Interaction

When food is blinking (mystery mode), the shape cycles along with the color — each cycle step renders the shape AND color of a different food type. This is a deliberate cognitive challenge increase: the player must track both shape and color cycling simultaneously, or wait for a recognizable shape to appear. This creates a richer working memory exercise than color cycling alone.

**Reduced motion mode:** Alpha pulsing on the hidden type's shape (same behavior as current, but with shape instead of square).

#### Five-Question Filter

1. **Working Memory:** Reduces WM cost — dual-channel (shape+color) requires less conscious processing than single-channel (color only). This is Hodent Principle 1 in action.
2. **Competence Feedback:** Players who learn to recognize shapes feel smarter. "I saw the X shape and knew it was Reverse Controls before I even registered orange."
3. **Clarity:** Each shape is maximally distinct from every other. No two shapes share the same geometric family (square, star, circle, cross, hollow square, X).
4. **Flow Preservation:** Shape recognition becomes automatic after ~5 encounters (procedural learning). No disruption to flow state once learned.
5. **Emotional Impact:** The crown jewel food (Reverse Controls, +8) gets the most aggressive shape (X = danger). The safe food (Invincibility, +0) gets a friendly star. Shape-emotion mapping is intentional.

---

## Enhancement 3: CRT Phosphor Glow on Food Items & Snake

### 80s Design Principle

> "Colored pixels popped intensely against the pure black backgrounds of arcade CRT monitors... the colored pixels appeared to radiate with an almost fluorescent intensity." — 80s Graphic Design Overview, Triumph of Raster Graphics

CRT phosphor didn't just display color — it emitted light. Each colored pixel had a natural halo, a bleed of light into the surrounding dark void. This gave 80s arcade games their characteristic "glowing" food and character sprites.

### Current State

- **V4.1 Update (Feb 2026):** Maximum glow constant throughout — food AND snake radiate neon intensity from game start
- All game objects (food items, snake segments) render with strong phosphor glow
- Glow is constant (blur 8) regardless of score — no progression

### Design Specification

**Concept:** **Maximum neon intensity from first pixel** — every food item and snake segment radiates with full CRT phosphor glow (blur 8). Against the constant dark void background (Enhancement 1), this creates instant arcade aesthetic. The glow is no longer earned through score progression; it's the visual baseline that establishes the neon arcade world immediately.

#### Glow Parameters

| Parameter | Value | Rationale |
|---|---|---|
| `shadowColor` | Same as object color | Authentic CRT single-phosphor bleed |
| `shadowBlur` | `8` (constant) | Maximum neon glow from game start |
| `shadowOffsetX / Y` | `0` | Symmetrical halo, not directional shadow |
| **Applied to** | Food items + Snake segments | All game objects glow equally |

#### Implementation

```javascript
// render.js — Food rendering with glow
withShadow(ctx, { color, blur: 8 }, (ctx) => {
  renderFoodShape(ctx, x, y, foodType, color, outlineColor);
});

// render.js — Snake rendering with glow (both normal and striped modes)
withShadow(ctx, { color: snakeColor, blur: 8 }, (ctx) => {
  ctx.fillStyle = snakeColor;
  ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
  // Crisp 1px black border for visual definition
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
});
```

#### Config Structure

```javascript
// config.js — V4.1 Update
GLOW_INTENSITY_THRESHOLDS: [
  { minScore: 0, maxScore: Infinity, blur: 8 }  // Constant maximum glow
],
```

#### Module Boundaries

- **config.js:** Glow intensity constant (blur 8)
- **render.js:** Applies glow to ALL game objects (food + snake) using `withShadow()` helper
- **progression.js:** Returns constant glow value (no score dependency)

#### Blinking Food Glow

During blinking food color cycling, the glow color cycles with the fill color. This creates a pulsing rainbow halo effect on mystery food — visually striking and further emphasizes the "mystery" quality.

#### Performance Note

Canvas `shadowBlur` is GPU-accelerated on all modern browsers. A single food item with shadowBlur=8 has negligible performance impact (< 0.1ms per frame). No FPS concern.

#### Accessibility

- The glow is purely additive — it enhances visibility, never reduces it
- On light backgrounds, the glow is subtle enough to not create visual noise
- `prefers-reduced-motion`: Glow is a static effect (no animation), so no motion concern
- Purple food (`#800080`) on dark backgrounds: the glow halo provides the additional contrast needed (see Enhancement 1 accessibility note)

#### Five-Question Filter

1. **Working Memory:** Zero WM cost. Glow is preattentive — it makes food MORE visible without adding information to process.
2. **Competence Feedback:** Indirect — food is easier to spot, so near-miss saves feel more intentional.
3. **Clarity:** Directly improves clarity. Food items become more salient against any background.
4. **Flow Preservation:** No disruption. Amplifies flow by reducing the "didn't see the food" failure mode (Axiom 6: intended challenge only).
5. **Emotional Impact:** At high scores (dark background + bright glow), the game looks *gorgeous*. Beauty creates positive emotional association.

---

## Enhancement 4: Snake Head "Character Mascot" Enhancement

### 80s Design Principle

> "The graphic design of Mario is a direct, undeniable product of 8-bit technological constraints. Rendering a realistic mouth on a tiny 16x16 pixel sprite was impossible, so designer Shigeru Miyamoto gave him a prominent mustache... bright red and blue overalls were chosen to create high contrast against the green and brown backgrounds, ensuring the player never lost track of the avatar." — 80s Graphic Design Overview, Platformers section

The 80s taught us that character mascots are born from **bold silhouette choices within tight constraints**. Mario's cap, Pac-Man's wedge, the Space Invader's bilateral symmetry — these are icons forged by pixel economy. The character must be recognizable in the smallest possible form.

### Current State

- Snake head: black 20x20 square + two white circle eyes (2.5px radius) that rotate with direction
- Head has a subtle border (`#E8E8E8`, 2px) that matches the background
- During invincibility: yellow/black strobe on entire snake (including head)
- No tongue, no additional head features, no highlight

### Design Specification

**Concept:** Evolve the snake head into a more distinctive character mascot through three subtle additions that work within the existing 20x20 grid constraint. The goal is not to make the snake cute — it's to make it *iconic*. A silhouette so distinct that a player could identify "that's CrazySnake" from a screenshot of just the head.

#### 4A: Eye Pupils (Directional Gaze)

**What:** Add a 1.5px black pupil dot to each white eye, offset toward the direction of movement. The eyes currently rotate position with direction — now the pupils within the eyes also track direction, creating a "looking where I'm going" effect.

**Why:** The 80s Mega Man technique: layering detail within minimal space. Pupils add personality without increasing the head's footprint. The directional gaze creates a subtle sense of agency — the snake is *looking* at where it's heading, not just moving there.

```javascript
// After drawing white eye circles, add pupils:
const pupilRadius = 1.5;
const pupilOffset = 1.5; // offset toward movement direction

// Calculate pupil offset based on direction
let pupilDx = 0, pupilDy = 0;
switch (direction) {
  case 'right': pupilDx = pupilOffset; break;
  case 'left':  pupilDx = -pupilOffset; break;
  case 'up':    pupilDy = -pupilOffset; break;
  case 'down':  pupilDy = pupilOffset; break;
}

ctx.fillStyle = '#000000';
// Pupil on eye 1
ctx.beginPath();
ctx.arc(eye1X + pupilDx, eye1Y + pupilDy, pupilRadius, 0, Math.PI * 2);
ctx.fill();
// Pupil on eye 2
ctx.beginPath();
ctx.arc(eye2X + pupilDx, eye2Y + pupilDy, pupilRadius, 0, Math.PI * 2);
ctx.fill();
```

#### 4B: Head Highlight Line (Top-Light Reflection)

**What:** A 1px semi-transparent white line along the leading edge of the head (top edge when moving up, right edge when moving right, etc.). This simulates a light reflection — the Mega Man "sprite layering" technique for adding depth to flat pixel art.

**Why:** At darker background tiers (Enhancement 1), the black snake head can visually merge with the void. The highlight provides a constant-contrast silhouette edge that maintains head visibility regardless of background brightness.

```javascript
// After drawing head square, add highlight:
ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
ctx.lineWidth = 1;

switch (direction) {
  case 'right':
    // Highlight on right edge
    ctx.beginPath();
    ctx.moveTo(headX + CONFIG.UNIT_SIZE - 0.5, headY + 2);
    ctx.lineTo(headX + CONFIG.UNIT_SIZE - 0.5, headY + CONFIG.UNIT_SIZE - 2);
    ctx.stroke();
    break;
  case 'left':
    ctx.beginPath();
    ctx.moveTo(headX + 0.5, headY + 2);
    ctx.lineTo(headX + 0.5, headY + CONFIG.UNIT_SIZE - 2);
    ctx.stroke();
    break;
  case 'up':
    ctx.beginPath();
    ctx.moveTo(headX + 2, headY + 0.5);
    ctx.lineTo(headX + CONFIG.UNIT_SIZE - 2, headY + 0.5);
    ctx.stroke();
    break;
  case 'down':
    ctx.beginPath();
    ctx.moveTo(headX + 2, headY + CONFIG.UNIT_SIZE - 0.5);
    ctx.lineTo(headX + CONFIG.UNIT_SIZE - 2, headY + CONFIG.UNIT_SIZE - 0.5);
    ctx.stroke();
    break;
}
```

#### 4C: Body Segment Outline on Dark Backgrounds

**What:** When the background progression reaches tier 3+ (score >= 50, background `#808080` or darker), all snake body segments gain a 1px outline in `rgba(255, 255, 255, 0.15)` — just enough to maintain the snake's silhouette against the darkening void.

**Why:** The snake body is `#000000`. On a `#2A2A2A` background, this is nearly invisible. Rather than changing the snake color (which would break visual identity), a ghostly outline preserves the silhouette while keeping the snake black. This is the 80s sprite outline technique.

```javascript
// config.js
SNAKE_DARK_OUTLINE_SCORE: 50,  // Score threshold for body outline
SNAKE_DARK_OUTLINE_COLOR: 'rgba(255, 255, 255, 0.15)',
```

#### Five-Question Filter

1. **Working Memory:** Zero WM cost. Pupils and highlight are subliminal character detail, not information to process.
2. **Competence Feedback:** Indirect — the snake feels more alive, more "mine." This strengthens relatedness (SDT).
3. **Clarity:** The highlight and outline directly serve visibility on dark backgrounds. Net clarity improvement.
4. **Flow Preservation:** No disruption. Character enhancement deepens immersion, which supports flow.
5. **Emotional Impact:** Pupils that track direction create a subtle sense of the snake being *alive*. This is the same trick that made Pac-Man's wedge-mouth feel intentional. Players will anthropomorphize the snake more, which means death hurts more, which means "Play Again" motivation increases.

---

## Enhancement 5: Typography Enhancements (Arcade Text Treatment)

### 80s Design Principle

> "Typography evolved from a purely functional UI element into an avenue for intense aesthetic experimentation and brand identity. Graphic designers implemented bold drop shadows, vertical color gradients, and simulated metallic chrome inlays directly into the baked character tiles." — 80s Graphic Design Overview, Color Anti-Aliasing section

> "Capcom's Street Fighter franchise utilized deeply stylized, multi-colored fonts that possessed an aggressive, graffiti-like aesthetic." — same section

In the 80s, text wasn't just readable — it was *dramatic*. The GAME OVER screen, the high score display, the title screen — these were the game's emotional punctuation marks, and designers treated them with the same artistry as character sprites.

### Current State

- All text uses Jersey20 (good retro font choice)
- Title "Crazy Snake": `rgb(157, 178, 221)`, `text-shadow: none`, `letter-spacing: 2px`
- "GAME OVER": same color, `text-shadow: none`
- "NEW HIGH SCORE": `#FFD700`, `text-shadow: none`
- **V4.1 Update (Feb 2026):** Score popups now have full multi-layer CRT phosphor glow matching food colors
- Overall: flat text with no depth, no drama, no brand treatment (except score popups)

### Design Specification

**Concept:** Apply 80s-authentic text treatments to the 4 highest-emotional-impact text elements: game title, GAME OVER, NEW HIGH SCORE, and the score display. These treatments use CSS-only techniques (text-shadow stacking) that are zero-cost performance-wise and dramatically amplify the retro arcade feel.

#### 5A: Title Treatment — "Crazy Snake"

The title is the game's logo. It should be the single most visually distinctive text element.

```css
.game-title {
  font-family: 'Jersey20', 'Courier New', monospace;
  font-size: 36px;
  font-weight: bold;
  color: #FFFFFF;  /* White base — brightest, cleanest */
  letter-spacing: 3px;
  text-transform: uppercase;
  /* 80s chrome/arcade treatment: multi-layer shadow stack */
  text-shadow:
    0 0 10px rgba(157, 178, 221, 0.8),   /* Soft blue glow (neon tube) */
    0 0 20px rgba(157, 178, 221, 0.4),   /* Wider glow halo */
    0 2px 0 #5A6A8A,                      /* Hard shadow bottom (bevel depth) */
    0 3px 0 #3A4A6A;                      /* Deeper shadow layer (3D effect) */
}
```

**Effect:** White text with a blue neon glow + a hard 2-layer drop shadow that creates a subtle 3D "extruded" look. This is the direct descendant of 80s arcade cabinet title art — bold, glowing, and unmistakable.

#### 5B: "GAME OVER" Treatment

GAME OVER is the most emotionally charged text in the game. It should feel heavy, dramatic, and final — but not punishing (Axiom: "Death must feel fair").

```css
#gameover-screen h2 {
  font-size: 36px;
  color: rgb(157, 178, 221);  /* Keep existing blue */
  letter-spacing: 4px;
  text-shadow:
    0 0 8px rgba(157, 178, 221, 0.6),   /* Soft glow */
    0 2px 0 rgba(0, 0, 0, 0.8),         /* Hard bottom shadow */
    0 4px 8px rgba(0, 0, 0, 0.4);       /* Soft depth shadow */
}
```

**Effect:** The existing blue color gets a subtle glow and depth. Heavy enough to feel significant, not so dramatic that it overwhelms the cognitive stats below it.

#### 5C: "NEW HIGH SCORE" Treatment

This is a celebration moment. It should SHINE.

```css
#gameover-screen .new-high-score {
  font-size: 20px;
  font-weight: bold;
  color: #FFD700;
  text-shadow:
    0 0 10px rgba(255, 215, 0, 0.8),   /* Gold glow */
    0 0 20px rgba(255, 215, 0, 0.4),   /* Wider gold halo */
    0 0 30px rgba(255, 165, 0, 0.2);   /* Faint orange outer glow */
  animation: highScorePulse 1.5s ease-in-out infinite;
}

@keyframes highScorePulse {
  0%, 100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4); }
  50% { text-shadow: 0 0 15px rgba(255, 215, 0, 1.0), 0 0 30px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 165, 0, 0.3); }
}
```

**Effect:** Gold text with pulsing neon glow. The pulse is slow (1.5s cycle) and gentle — celebratory, not distracting.

**Reduced motion:** Replace pulse animation with static glow (already defined in the `@media (prefers-reduced-motion)` section pattern).

#### 5D: Score Display Enhancement

```css
#current-score {
  color: #FFFFFF;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);  /* Subtle white glow */
}

#top-score {
  color: rgb(157, 178, 221);
  text-shadow: 0 0 6px rgba(157, 178, 221, 0.3);  /* Subtle blue glow */
}
```

**Effect:** Very subtle glow on the score display. Just enough to make the numbers feel "lit" rather than printed. This is the lowest-intensity treatment — the score display should be readable, not dramatic.

#### 5E: Score Popup Enhancement (V4.1 Implementation)

**Status:** ✅ Implemented Feb 2026

Score popups are the micro-celebration moments when the player eats food — they're small but emotionally high-impact. They need to match the intensity of the CRT phosphor glow on the food itself.

```css
/* Multi-layer glow pattern (applied to all food score popups) */
text-shadow:
  2px 2px 4px rgba(0, 0, 0, 1),        /* Black outline for definition */
  0 0 10px rgba(color, 1),              /* Inner glow at full opacity */
  0 0 20px rgba(color, 0.8);            /* Outer glow at 80% opacity */
```

**Applied to all food popups:**
- Growing food (+1): Green glow `rgba(0, 255, 0, ...)`
- Speed decrease (+2): Cyan glow `rgba(0, 206, 209, ...)`
- Wall phase (+1): Purple glow `rgba(128, 0, 128, ...)`
- Speed boost (+5): Red glow `rgba(255, 0, 0, ...)`
- Invincibility (+0): Yellow glow `rgba(255, 255, 0, ...)`
- Wall phase bonus (+2): Purple glow `rgba(128, 0, 128, ...)`
- Reverse controls (+8): Orange/gold glow (already had multi-layer)
- Phone call bonus: Gold glow (already had multi-layer)
- Combo bonuses: Magenta/gold/red glow (already had multi-layer)

**Size consistency:** All food popups now use 44-48px font-size for visual balance (speed boost was increased from 28px to 44px).

**Effect:** Every score popup now has the same intense CRT phosphor glow as the snake and food objects. The glow color matches the food type, creating instant visual association between the food eaten and the reward gained. The 3-layer shadow creates depth and luminosity — the numbers appear to glow *off* the screen, not just sit on it.

**Performance:** CSS text-shadow only — zero canvas rendering cost.

#### Five-Question Filter

1. **Working Memory:** Zero WM cost. Text treatments don't add information — they add *feeling*.
2. **Competence Feedback:** "NEW HIGH SCORE" pulsing gold glow = triumph. "GAME OVER" depth shadow = gravitas. The text treatment matches the emotional moment.
3. **Clarity:** All text remains fully readable. Glow effects increase text salience, not decrease it.
4. **Flow Preservation:** These only appear on non-gameplay screens (menu, game-over). Zero flow impact.
5. **Emotional Impact:** High. The title should make a player feel "this game has *style*." The GAME OVER should make them feel "that was significant." The HIGH SCORE should make them feel "I DID IT."

---

## Enhancement 6: CRT Scanline Overlay

### 80s Design Principle

> "The entire aesthetic of the era was inseparable from CRT display characteristics... the visual signature of vector games — glowing, infinitely sharp lines suspended in absolute blackness." — 80s Graphic Design Overview, throughout

The CRT monitor was not just a display device — it was a co-designer. Horizontal scanlines, phosphor persistence, slight blur, and the subtle curvature of the glass all contributed to the 80s visual identity. Modern retro games that recreate this effect (Shovel Knight, Celeste) use it sparingly for atmosphere.

### Current State

- Clean, crisp modern rendering on LCD/OLED screens
- No CRT simulation of any kind

### Design Specification

**Concept:** A CSS-only pseudo-element overlay on the game canvas that renders extremely subtle horizontal scanlines. This is a purely atmospheric enhancement — it adds zero information but dramatically increases the "this is an arcade game" feeling.

```css
/* CRT Scanline overlay — atmospheric retro effect */
#game-canvas {
  position: relative;
}

#game-container::after {
  content: '';
  position: absolute;
  top: 8px;     /* Inside the border */
  left: 8px;
  right: 8px;
  bottom: 8px;
  border-radius: 4px;  /* Match inner canvas corners */
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.03) 3px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;  /* Click-through */
  z-index: 50;           /* Above canvas, below all UI */
}
```

**Effect:** Near-invisible horizontal lines every 4px. At 3% opacity, they're felt more than seen — a subliminal texture that makes the playfield feel like a CRT screen rather than a clean LCD. They become more noticeable on the darker background tiers (Enhancement 1), which is correct — a CRT in a dark room shows its scanlines more.

#### Accessibility & Toggleability

- `prefers-reduced-motion`: No impact (scanlines are static, not animated)
- **Concern:** Players with visual sensitivity might find even subtle scanlines distracting. This should be toggleable via a CSS class on the game container.

```javascript
// config.js
CRT_SCANLINES_ENABLED: true,  // Toggleable
CRT_SCANLINE_OPACITY: 0.03,   // Very subtle default
```

```css
/* Disabled state */
#game-container.no-scanlines::after {
  display: none;
}
```

#### Performance

CSS pseudo-element with a repeating gradient is composited by the GPU. Zero CPU cost, zero impact on the 60 FPS game loop.

#### Five-Question Filter

1. **Working Memory:** Zero. Scanlines are subliminal texture.
2. **Competence Feedback:** None directly. Atmospheric.
3. **Clarity:** At 3% opacity, no readability impact. If any food color contrast is affected, reduce to 2%.
4. **Flow Preservation:** Supports flow by deepening immersion ("I'm in an arcade").
5. **Emotional Impact:** Subtle but cumulative. The scanlines make the entire experience feel more authentic. Combined with dark background + food glow, the effect is greater than the sum of its parts.

---

## Enhancement 7: Reactive Arcade Bezel Border

### 80s Design Principle

> "Arcade cabinets used physical colored overlays to fake colored zones on monochrome screens. The frame was part of the game's visual identity." — 80s Graphic Design Overview, Midway 8080 section

> "Physical tinted plastic screen overlays used to fake colored zones." — Hardware table

The arcade cabinet bezel wasn't just a frame — it was a design canvas. Different games had different bezel artwork, different colored overlays, different edge treatments. The border said "this is Pac-Man's world" or "this is Space Invaders' world" before a single pixel was drawn.

### Current State (V4.3 — 2026-02-18)

- **Background:** pure `#000000` (tiled image removed)
- **Canvas border:** 8px solid `#FFFFFF` (white wall)
- **Outer ring:** `0 0 0 8px #000000` (pure black, down from `#1A1A2E` 8px)
- **Default glow:** none
- **Reverse controls:** no border change (white wall stays neutral — orange was removed)
- **Invincibility blink:** yellow ↔ white (was yellow ↔ black)
- Border radius: 10px

### Design Specification

**🔄 V4.3 UPDATE (2026-02-18):** White wall, pure black outer ring, black background. See table below.

**🔄 V4.2 UPDATE (2026-02-17):** Border system simplified to universal semantic states.

**Concept:** The border communicates **immediate danger level** consistently across all game modes. It's a bold solid border (no gradients, no imagery — pixel economy principle) that uses color to signal wall safety state via peripheral vision.

**Primary Function:** The border's ONLY role is **danger state communication** — it tells the player whether the environment is safe or deadly. This is direct cognitive feedback, not decorative.

**Design Principle:** Border color = danger level, NOT game mode or events.

#### V4.2 Border State Table (Simplified)

| Game State | Border Color | Transition | Rationale |
|---|---|---|---|
| **Default (no effects)** | `#FFFFFF` (white) + `0 0 0 8px #000000` outer ring | — | White wall = clean arena boundary. Black outer ring separates canvas from page. |
| **Death flash** | `#FF0000` (red) | 100ms snap | Visceral death signal. |
| **Phone ringing** | `#FFD700` (gold) | 300ms | Reward opportunity — matches phone UI gold. |
| **Phone picked up** | `#28a745` (green) | 300ms | Committed state — call in progress. |
| **Combo mode** | `#FF00FF` (magenta) pulse | 1500ms cycle | Energy/danger — matches combo system magenta. |
| **Reverse controls** | `#FFFFFF` (white) — **no change** | — | Reverse is a control mechanic, not a danger state. Border stays neutral. |
| **Wall-phase effect** | `#800080` (purple) | 300ms | Walls safe to cross. Purple matches wall-phase food. |
| **Invincibility effect** | `#FFFF00` (yellow) | 400ms blink (yellow ↔ **white**) | Maximum power. Blinks back to white wall (not black). |

**V4.2 note:** Phone/combo/death/reverse borders were temporarily removed in V4.2 for simplification. Restored in V4.3 with the full 7-state system.

**Why removed:** These communicated game events or modes, not danger level. Created visual confusion (e.g., "Is purple border combo mode or wall-phase?"). Simplified to 3 universal states improves cognitive clarity.

#### Implementation

```css
/* V4.3: White wall + pure black outer ring */
#game-canvas {
  border: 8px solid #FFFFFF;  /* White wall */
  box-shadow: 0 0 0 8px #000000;  /* Black outer ring */
}

/* Reverse: no change — white wall stays neutral */
#game-canvas.border-reverse { border-color: #FFFFFF; box-shadow: 0 0 0 8px #000000; }

/* All active states prepend the 8px black outer ring */
#game-canvas.border-wallPhase {
  border-color: #800080;
  box-shadow: 0 0 0 8px #000000, 0 0 20px 4px rgba(128,0,128,1), 0 0 40px 8px rgba(128,0,128,0.9), 0 0 60px 12px rgba(128,0,128,0.7);
}
#game-canvas.border-invincibility {
  border-color: #FFFF00;
  animation: borderBlink 400ms steps(2, jump-none) infinite;
  box-shadow: 0 0 0 8px #000000, 0 0 20px 4px rgba(255,255,0,1), 0 0 40px 8px rgba(255,255,0,1), 0 0 60px 12px rgba(255,255,0,0.9), 0 0 80px 16px rgba(255,255,0,0.7);
}
@keyframes borderBlink {
  0%, 49%  { border-color: #FFFF00; }  /* Yellow */
  50%, 100% { border-color: #FFFFFF; }  /* White — matches default wall */
}
```

**Glow Specification:**
- **Multi-layered shadows** (3-4 layers per state) create intense neon radiance
- **Inner layer** (20px blur, full opacity): Bright core glow
- **Middle layer** (40px blur, 0.8-0.9 opacity): Strong radiance
- **Outer layer** (60px blur, 0.6-0.7 opacity): Soft diffuse halo
- **Invincibility extra layer** (80px blur): Maximum power visual
- Glow color matches border color for semantic consistency
- Smooth transitions (300ms) sync with border color changes

#### Config Structure

```javascript
// config.js — V4.2 UPDATE: Simplified to CSS-only (no BORDER_COLORS object needed)
// Border colors now managed purely via CSS classes

// V4.2: Border state managed by CSS classes only
// - Default: #000000 (black, CSS default on #game-canvas)
// - .border-wallPhase: #800080 (purple, safe to cross walls)
// - .border-invincibility: #FFFF00 (yellow blinking, protected)
  invincibility: '#FFFF00'   // Yellow (invincible, with blink animation)
}
```

#### Module Boundaries

- **config.js:** Owns all border color values
- **game.js:** Applies/removes border state CSS classes in the existing event handlers (onPhoneCallShow, onPhoneCallDismiss, onFoodEaten effect changes, onDeath). This is orchestration logic — correct place per architecture.
- **render.js:** No changes — border is CSS, not canvas.
- **phone.js:** No changes — game.js orchestrates.

#### Priority Resolution

When multiple states overlap (e.g., combo + phone + invincibility), the priority cascade:
1. **Phone ring** (highest priority — time-critical decision point, gold border)
2. **Phone pickup** (committed state, green border)
3. **Combo active** (environmental immersion, dynamic color)
4. **Invincibility** (player safety state, yellow blinking)
5. **Wall Phase** (player safety state, purple solid)
6. **Default** (black border — wall = death)

**Rationale:** Phone states take priority because they represent time-limited decision points. Combo mode is environmental. Effects (invincibility, wallPhase) are the primary cognitive feedback but yield to higher-priority game events. This cascade ensures the most critical information always wins.

#### Five-Question Filter

1. **Working Memory:** Near-zero WM cost. Border color is peripheral — processed preattentively without conscious attention allocation. The primary border function (wall safety communication) uses the simplest possible encoding: black = danger, color = safe. This is universal human association (darkness = threat, light/color = safety).
2. **Competence Feedback:** The border reacting to player-earned effects (eating wallPhase/invincibility food) makes the border feel *responsive* to player action. "I earned this safe state, and the world acknowledges it." Environmental responsiveness = competence validation.
3. **Clarity:** The wall safety encoding is maximally clear: **Black border = wall kills you. Colored border = wall is safe.** This binary signal is instant to decode. The blinking yellow for invincibility is the strongest possible attention signal (movement in peripheral vision = preattentive pop-out).
4. **Flow Preservation:** Peripheral wall safety signals support flow by eliminating the need to consciously track effect duration. "I know I can cross walls because the border is purple" — no mental math required. The player can focus entirely on spatial navigation.
5. **Emotional Impact:** The **purple border transformation** when eating wall phase food is a mini-victory moment: "The rules just changed in my favor." The **blinking yellow invincibility border** is maximum power fantasy — the entire playfield pulses with your temporary invincibility. These are emotional peaks that amplify the core gameplay loop.

---

## Enhancement 8: Grid Enhancement (Intersection Dots & Progressive Dimming)

### 80s Design Principle

> "The highly modular, geometric aesthetic seen in Super Mario Bros. is not simply an artistic choice; it is a direct visualization of the hardware's 16x16 palette assignment grid." — 80s Graphic Design Overview, Tyranny of the Tilemap

> "Backgrounds were constructed using individual 8x8 pixel tiles arranged on a rigid grid." — same section

The 80s tilemap grid was the foundational visual structure of every game. It wasn't hidden — it was *expressed*. The grid IS the world. But the best 80s designers made the grid feel organic by varying tile shading, using dot patterns, and playing with negative space within the grid structure.

### Current State

- Full grid lines (vertical + horizontal) at every unit boundary
- 0.5px line width, 0.9 opacity
- Dark grey `#A0A0A0` on light background (inverted in combo mode)
- Purely functional — no visual variation or personality

### Design Specification

**Concept:** Two independent grid enhancements that work together:

#### 8A: Intersection Dot Accent

**What:** In addition to the existing grid lines, render a small dot (2px radius) at every grid intersection point. The dot color matches the grid line color but at a slightly higher opacity — creating a subtle "node" pattern that makes the grid feel like a circuit board or graph paper with marked intersections.

**Why:** This is a Tufte data-ink optimization. The dots emphasize the spatial structure without adding full additional lines. They create a visual rhythm that helps the player's spatial awareness (the grid becomes a more legible coordinate system). And it looks like an arcade circuit board — perfectly thematic.

```javascript
// render.js — new function, called after renderGrid()
function renderGridDots(ctx, gameState) {
  const dotColor = isComboActive(gameState)
    ? CONFIG.COLORS.comboGridLine  // #FF00FF magenta neon during combo (V5 upgrade)
    : getCurrentGridDotColor(gameState.score);  // progression-aware

  ctx.fillStyle = dotColor;
  ctx.globalAlpha = CONFIG.GRID_DOT_OPACITY;

  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
      const px = x * CONFIG.UNIT_SIZE;
      const py = y * CONFIG.UNIT_SIZE;
      ctx.beginPath();
      ctx.arc(px, py, CONFIG.GRID_DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1.0;
}
```

#### Config Structure

```javascript
// config.js
GRID_DOT_RADIUS: 1.5,    // 1.5px radius
GRID_DOT_OPACITY: 0.5,   // 50% opacity — visible but subtle
```

#### 8B: Progressive Grid Dimming

**What:** As the background darkens (Enhancement 1), the grid lines progressively lose opacity — fading from the current 0.9 at score 0 to 0.3 at score 100+. The grid doesn't disappear; it recedes into the background, making the neon food items and snake the dominant visual elements.

**Why:** This is a cognitive training lever. At low scores, the grid is a helpful spatial reference (training wheels). At high scores, the fading grid forces the player to rely more on their internal spatial model — exercising spatial awareness without the external scaffold. The 80s document notes that arcade games used "absolute blackness as a negative-space canvas" — a fading grid moves toward that principle organically.

#### Grid Opacity Progression

| Score Range | Grid Line Opacity | Dot Opacity | Visual Feel |
|---|---|---|---|
| 0-14 | 0.9 (current) | 0.5 | Full support grid |
| 15-29 | 0.8 | 0.45 | Slightly receding |
| 30-49 | 0.7 | 0.4 | Grid becoming subtle |
| 50-79 | 0.5 | 0.3 | Grid as ghost lines |
| 80-99 | 0.4 | 0.25 | Grid barely visible |
| 100+ | 0.3 | 0.2 | Near-invisible grid, pure void |

```javascript
// config.js
GRID_OPACITY_PROGRESSION: [
  { minScore: 0,   maxScore: 14,  lineOpacity: 0.9, dotOpacity: 0.5 },
  { minScore: 15,  maxScore: 29,  lineOpacity: 0.8, dotOpacity: 0.45 },
  { minScore: 30,  maxScore: 49,  lineOpacity: 0.7, dotOpacity: 0.4 },
  { minScore: 50,  maxScore: 79,  lineOpacity: 0.5, dotOpacity: 0.3 },
  { minScore: 80,  maxScore: 99,  lineOpacity: 0.4, dotOpacity: 0.25 },
  { minScore: 100, maxScore: Infinity, lineOpacity: 0.3, dotOpacity: 0.2 }
],
```

#### Five-Question Filter

1. **Working Memory:** Grid dots: zero WM cost (subliminal spatial aid). Grid dimming: slightly increases spatial WM demand at high scores — this is intentional cognitive training, not UI failure.
2. **Competence Feedback:** The fading grid is a visual acknowledgment of skill. "The game trusts you to navigate without training wheels now."
3. **Clarity:** At minimum opacity (0.3), grid lines remain visible under careful inspection. The food glow (Enhancement 3) compensates by making food positions unambiguous.
4. **Flow Preservation:** Grid dimming is so gradual (6 tiers across the full score range) that no single transition is noticeable. The player adapts continuously.
5. **Emotional Impact:** At 100+ score with the full Neon Noir treatment — near-black background, ghost grid, glowing neon food, pulsing border — the game transforms into a completely different visual experience from where it started. That transformation IS the emotional payoff of mastery.

---

## System-Level Integration: The Full Neon Noir Experience

When all 8 enhancements work together, the visual progression tells a story:

### Score 0-14: "Welcome to Snake"
- Bright light grey background
- Full visibility grid with intersection dots
- Colored food shapes — easy to identify, learn the silhouettes
- Snake head with directional pupils
- Title glowing with neon blue treatment
- Familiar, safe, inviting

### Score 15-49: "Things Are Getting Interesting"
- Background starting to dim
- Grid slightly receding
- Food glow becoming noticeable
- Blinking food cycling shapes + colors
- Phone calls with gold border pulses
- The visual world is shifting

### Score 50-79: "Arcade Mode Engaged"
- Background solidly mid-grey
- Grid fading into support role
- Food items genuinely glowing against darker background
- Snake body outline appearing (dark bg compensation)
- Combo mode border sync intensifying the dark canvas colors
- CRT scanlines becoming more perceptible

### Score 80-99: "The Void Beckons"
- Background approaching dark
- Grid as ghost lines — spatial awareness test
- Food items are bright neon beacons in the gathering dark
- Wall Phase purple border against near-dark = clear safety signal
- Invincibility yellow border blinking against the void = *power fantasy*
- Every game system visual at peak intensity

### Score 100+: "Full Neon Noir"
- Near-black background (`#2A2A2A`)
- Ghost grid (0.3 opacity)
- Food items radiating CRT-phosphor neon glow (blur 8)
- Snake visible through white outline highlights
- Phone calls: gold border pulse against the void
- Wall Phase: purple border glowing in absolute darkness — "the walls are safe now"
- Invincibility: blinking yellow border illuminating the void in pulses
- **This is the 80s arcade. The player earned it.**

---

## Implementation Dependency Graph

```
Enhancement 3 (Food Glow) ← no dependencies, smallest change, do first
Enhancement 2 (Food Shapes) ← no dependencies, can parallel with 3
Enhancement 5 (Typography) ← no dependencies, CSS only, can parallel
Enhancement 6 (Scanlines) ← no dependencies, CSS only, can parallel
Enhancement 1 (Dark Playfield) ← depends on 3 (glow) + 2 (shapes) for contrast validation
Enhancement 4 (Snake Head) ← depends on 1 (dark bg) for outline threshold design
Enhancement 8 (Grid) ← depends on 1 (dark bg) for dimming curve alignment
Enhancement 7 (Reactive Border) ← depends on 1 (dark bg) for death flash contrast
```

**Recommended implementation order:**
1. Batch 1 (parallel): Enhancement 3 + 2 + 5 + 6
2. Batch 2: Enhancement 1 (dark playfield — integrates with batch 1)
3. Batch 3 (parallel): Enhancement 4 + 8 + 7

---

## Files Affected

| File | Enhancements | Change Type |
|---|---|---|
| `config.js` | 1, 2, 3, 4, 7, 8 | New config sections (thresholds, colors, sizes) |
| `progression.js` | 1, 3, 8 | New fields in `getState()` return object |
| `render.js` | 1, 2, 3, 4, 8 | Updated render functions + new `renderGridDots()` + `renderFoodShape()` |
| `game.js` | 7 | Border state CSS class management in event handlers |
| `css/style.css` | 5, 6, 7 | New text-shadow rules, scanline pseudo-element, border state classes |

No new files created. No new dependencies. All changes are additive to existing module boundaries.

---

## Cognitive Science Validation Summary

| Enhancement | Hodent Principle Served | Axiom Alignment |
|---|---|---|
| 1. Dark Playfield | Perception is Constructed (Sec 1) — visual world matches difficulty reality | Axiom 1 (score-based), Axiom 2 (difficulty is the product) |
| 2. Food Shapes | Perception (Sec 1) — dual-channel recognition; Attention (Sec 3) — instant identification | Axiom 6 (intended challenge only) |
| 3. Food Glow | Perception (Sec 1) — preattentive salience; Attention (Sec 3) — breaks through focus | Axiom 6 (intended challenge only) |
| 4. Snake Head | Emotion (Sec 5) — character attachment; Motivation (Sec 4) — relatedness | Axiom 7 (emotional peaks), Axiom 3 (comedy is a system) |
| 5. Typography | Emotion (Sec 5) — emotional punctuation for key moments | Axiom 7 (emotional peaks) |
| 6. Scanlines | N/A (purely atmospheric) | Axiom 7 (emotional peaks — immersion) |
| 7. Reactive Border | Attention (Sec 3) — peripheral state communication | Axiom 6 (intended challenge only — reduces UX ambiguity) |
| 8. Grid Dimming | WM (Sec 2) — scaffolding removal; Learning (Sec 6) — progressive challenge | Axiom 2 (difficulty is the product), Axiom 9 (targeted challenge) |

---

## V4.2 Post-Implementation Enhancement: Black Snake Visibility (2026-02-17)

### User Request

After V4.1 implementation, Tomoco identified a visibility issue with the black snake against the constant dark background (`#1a1a1a`). The black snake with black glow and black border was difficult to see, particularly at game start and during wall phase effect.

### Design Solution

**Adaptive glow and border system:** When the snake is black (`#000000`), use white glow and white border for maximum contrast. For all other snake colors, maintain the original colored glow + black border pattern.

### Specification

| Snake State | Fill | Glow | Border | Rationale |
|---|---|---|---|---|
| Black (game start, wall phase) | `#000000` | `#FFFFFF` (blur 6) | `#FFFFFF` 1px | Maximum visibility on dark BG |
| Yellow (invincibility) | `#FFFF00` | `#FFFF00` (blur 6) | `#000000` 1px | Original V4.1 behavior |
| Invincibility strobe (black phase) | `#000000` | `#FFFFFF` (blur 6) | `#FFFFFF` 1px | Adaptive during strobe |
| Combo striped (black segment) | `#000000` | `#FFFFFF` (blur 6) | `#FFFFFF` 1px | Per-segment adaptive |
| Combo striped (colored segment) | Effect color | Effect color (blur 6) | `#000000` 1px | Original V4.1 behavior |

### Visual Behavior Changes

1. **Glow blur reduced:** From 8px (V4.1) to 6px (V4.2) for subtler, crisper effect
2. **Adaptive glow color:** `color === '#000000' ? '#FFFFFF' : color`
3. **Adaptive border color:** `color === '#000000' ? '#FFFFFF' : '#000000'`

### Five-Question Filter Validation

**Q1. Working Memory Impact?**
✅ **Improves.** White glow on black snake creates instant visual pop against dark background, reducing cognitive load to locate the player's position at game start.

**Q2. Competence Feedback?**
✅ **Neutral.** Visibility enhancement doesn't change competence signals (score, effects, progression remain unchanged).

**Q3. Clarity of Purpose?**
✅ **Improves.** The white halo around the black snake at game start immediately signals "this is your character" without requiring the player to squint or search.

**Q4. Flow State?**
✅ **Improves.** Eliminates the micro-frustration of "where is my snake?" at game start, allowing faster entry into flow state.

**Q5. Emotional Impact?**
✅ **Positive.** The white-glowing black snake against the dark void has strong "neon ghost" aesthetic appeal, reinforcing the 80s arcade vibe.

**Verdict:** ✅ **Enhancement approved.** Improves visibility without sacrificing any cognitive training value, and amplifies the neon noir aesthetic.

### Axiom Alignment

- **Axiom 7 (Emotional peaks are the product):** White-glowing black snake creates a striking visual "wow" moment at game start
- **Axiom 6 (Intended challenge only):** Removes unintended challenge of locating the black snake against dark background

### Implementation Notes

- Implemented in `render.js` `renderSnake()` function (both striped and normal code paths)
- No new config values required (uses existing `CONFIG.COLORS.snakeDefault`)
- Backward compatible with Story 21.1 outline system (both can coexist at score 50+)
- See Technical Addendum for code patterns

### Testing Validation

- [x] Black snake visible at game start (score 0)
- [x] Black snake visible during wall phase effect
- [x] White glow/border during invincibility strobe (black phase)
- [x] Black segments in combo mode get white glow/border
- [x] Colored segments keep original glow/border behavior
- [x] No visual conflicts with Story 21.1 outline at score 50+
- [x] FPS stable (blur reduction from 8→6 maintains 60 FPS)

---

*This spec is designed to be consumed by the Architect for architecture integration, the Dev for implementation, and the PM for epic/story creation. All config values are provided so that implementation agents can copy them directly.*

*Source research: "The Visual Language of 1980s Video Games" (Tomoco, 2026), located at `tomoco-docs/80s Video Game Graphic Design Overview.pdf`.*

---

## Post-Implementation Record — Canvas Border & Grid Line Tuning (2026-02-18)

### Canvas Border Default Color — White `#FFFFFF` (Deliberate Semantic Choice)

**Decision:** Canvas default border stays `#FFFFFF` — NOT Electric Blue `#00B4FF`.

**Rationale:** The reactive border system is a semantic communication layer. Colored border = a specific game effect is active and the player's relationship to the wall has changed (gold = phone ringing, green = picked up, purple = wall phase safe to cross, etc.). **White = neutral wall = death if you touch it.** No behavior promise attached.

Changing the default to Electric Blue would pollute this semantic system — players could misread it as the speed-decrease food behavior (which is also blue). White is the correct neutral signal. It is intentionally the highest-contrast color to reinforce "this wall will kill you."

**CSS:** `border: 8px solid #FFFFFF` on `#game-canvas` (no glow — white wall is matte, not neon).

---

### Grid Line Color — Final Value: `rgba(255, 255, 255, 0.3)`

**Problem:** Original grid line color `#505050` (RGB 80/80/80) was too heavy against the `#1a1a1a` canvas background, creating a visual "cage" effect. This was compounded by the stark white border — the interior grid fought the exterior frame for attention.

**Tuning session results:**

| Value tested | Result |
|---|---|
| `rgba(255,255,255,0.05)` | Invisible |
| `rgba(255,255,255,0.07)` | Still invisible |
| `rgba(255,255,255,0.15)` | Too faint |
| `rgba(255,255,255,0.5)` | Too heavy |
| `rgba(255,255,255,0.9)` | Way too much |
| `rgba(0,180,255,0.3)` | Too much blue — rejected |
| **`rgba(255,255,255,0.3)`** | **✅ Approved — subtle spatial scaffold** |

**Final value:** `CONFIG.COLORS.gridLine = 'rgba(255, 255, 255, 0.3)'`

**Design rationale:** Grid lines are a spatial scaffold only — they should recede behind game elements (snake, food, effects), not compete with the white border frame. At `0.3` they are clearly visible for spatial orientation without creating visual noise. The progressive opacity system (`gridOpacity` from `getProgressionState`) further multiplies this value as score increases (effective opacity: ~0.27 at score 0, ~0.09 at score 100+).

**Note on Electric Blue grid:** Also tested `rgba(0,180,255,0.3)` — rejected. Too much blue coloring inside the canvas creates noise when combined with the snake's reactive halo and other neon elements.

---

## Post-Implementation Record — Snake Mosaic Page Background (2026-02-18)

### Concept

The entire page background (outside and behind the game canvas) is filled with a static packed mosaic of pixel-art snakes — the same visual language as the game itself. Every snake has the proper head (directional white eyes, black pupils, leading-edge highlight ported exactly from `render.js`). Snakes are 3–16 segments long, mostly straight with occasional bends.

### Final Design Decisions

| Property | Value | Rationale |
|---|---|---|
| Snake color | `#000000` black | Creates pure silhouette texture — lets the food-color halo bleed through dramatically |
| Segment border | `rgba(255,255,255,0.8)` white | Crisp grid separation, readable pixel art without color noise |
| Canvas opacity | `0.5` (CSS) | Half-visible — textural depth without competing with the game |
| Z-index | `-3` | Behind food halo (`-2`) and vignette (`-1`) so both effects layer correctly on top |
| Generation | Static, random per load | Zero runtime performance cost; fresh layout every session |

### Layer Stack (bottom → top)

```
z-index: -3  #snake-bg canvas        — black snake mosaic (base texture)
z-index: -2  .background-glow        — food-color radial halo pulses OVER snakes
z-index: -1  .background-vignette    — edge darkening focuses attention to center
z-index:  1  #game-container         — game canvas + all UI
z-index: 9999 body::after            — CRT scanline overlay (topmost)
```

### Key Design Insight

Black snakes at 0.5 opacity let the food-color halo (`background-glow`) colorize the entire background dynamically — the mosaic texture shifts color with every food spawn. The vignette then darkens the edges, pulling focus inward to the game canvas. Three layers working as one coherent system.

### Files

- `js/snake-background.js` — standalone module, called once on load (`initSnakeBackground()`)
- `index.html` — `<canvas id="snake-bg">` inserted before `#game-container`; module imported as separate `<script type="module">`
- `css/style.css` — `#snake-bg` rule + `z-index: 1` added to `#game-container`

### Tested Alternatives (Rejected)

- **Colored snakes (food palette)** — too noisy, competed with the game's own food colors and the halo effect
- **Full opacity (1.0)** — too loud, dominated the page
- **Electric Blue grid** — too much single-color saturation in background context
