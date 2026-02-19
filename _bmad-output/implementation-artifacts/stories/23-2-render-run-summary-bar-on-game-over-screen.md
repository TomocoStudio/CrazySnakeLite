# Story 23.2: Render Run Summary Bar on Game Over Screen

**Epic:** 23 - Run Summary Bar (Post-Game Food Counter)

**As a** player,
**I want** to see a compact strip of food glyphs and counts when I die,
**So that** I can see at a glance exactly what kinds of food I ate during my run.

---

## Acceptance Criteria

**Given** the game transitions to `phase: 'gameover'`
**When** the Game Over screen renders
**Then** a Run Summary Bar is rendered as a DOM element (not canvas) between the score display area and the quote card
**And** vertical margin of 16px above and 16px below the bar

**Given** the Run Summary Bar is rendered
**When** determining which badges to show
**Then** only render badges where the count is greater than zero — strict zero suppression
**And** never render empty slots, placeholder badges, or greyed-out badges for uneaten food types
**And** the phone badge only appears if `phoneCallsManaged > 0`

**Given** one or more badges are shown
**When** ordering badges left to right
**Then** display in fixed order regardless of which are present:
`Growing → Speed Decrease → Wall Phase → Speed Boost → Reverse Controls → Invincibility → Phone`

**Given** the number of visible badges
**When** laying out the badge strip
**Then** ≤4 badges: single centered row
**And** 5–7 badges: two rows, each row centered independently
**And** horizontal gap between badges: 20px

**Given** each badge is rendered
**When** displaying badge anatomy
**Then** render the food's canonical CSS glyph at 14×14px
**And** render the count number at 18px Jersey20 font, 5px to the right of the glyph
**And** render NO label text — glyph + number only, nothing else
**And** render NO border, NO background pill, NO tooltip

**Given** badge colors are applied
**When** rendering glyphs and numbers
**Then** source all colors from `CONFIG.COLORS` — no hardcoded hex values in the render module
**And** apply matching neon glow to both glyph and number per food type:

| Food | Color | Glow |
|---|---|---|
| Growing | `#00FF00` | `0 0 8px rgba(0,255,0,0.8)` |
| Speed Decrease | `#00CED1` | `0 0 8px rgba(0,206,209,0.8)` |
| Wall Phase | `#800080` | `0 0 8px rgba(128,0,128,0.8)` |
| Speed Boost | `#FF0000` | `0 0 8px rgba(255,0,0,0.8)` |
| Reverse Controls | `#FF8C00` | `0 0 8px rgba(255,140,0,0.8)` |
| Invincibility | `#FFFF00` | `0 0 8px rgba(255,255,0,0.8)` |
| Phone | `#FFD700` | `0 0 8px rgba(255,215,0,0.8)` |

**Given** CSS glyphs are rendered
**When** implementing each food shape
**Then** use shapes matching in-game food visuals, rendered via CSS (not canvas):

| Food | CSS Shape |
|---|---|
| Growing | Filled square |
| Speed Decrease | Hollow square (2px stroke, `box-sizing: border-box`) |
| Wall Phase | Hollow circle / ring (2px stroke, `border-radius: 50%`) |
| Speed Boost | Plus / cross shape (two overlapping rectangles) |
| Reverse Controls | X shape (two rotated rectangles, `transform: rotate(45deg)`) |
| Invincibility | 4-point star (CSS `clip-path` or rotated square technique) |
| Phone | Unicode `☎` at 14px matching food color |

**Given** a run where the player ate zero food of all types and managed zero calls (instant death edge case)
**When** the Game Over screen renders
**Then** the Run Summary Bar container is hidden entirely — no empty row, no placeholder text, no vertical space reserved

---

## Development

### Files to Modify/Create

- **`js/main.js`** (or new **`js/run-summary.js`**) — Badge strip DOM render function, called on game-over phase transition. Dev to decide based on `main.js` current size — if main.js is already large, extract to `run-summary.js`.
- **`style.css`** — CSS classes for badge strip, glyph shapes, neon glow, layout
- **`index.html`** — Add `#run-summary-bar` container in game-over screen section, between score area and quote card

### Implementation Notes

**HTML structure (index.html):**
```html
<!-- inside game-over screen, between score area and quote card -->
<div id="run-summary-bar" class="hidden"></div>
```

**Render function pattern:**
```javascript
function renderRunSummaryBar(cognitiveStats) {
  const bar = document.getElementById('run-summary-bar');
  bar.innerHTML = '';

  const FOOD_ORDER = [
    'growing', 'speedDecrease', 'wallPhase',
    'speedBoost', 'reverseControls', 'invincibility'
  ];

  const badges = [];

  for (const foodType of FOOD_ORDER) {
    const count = cognitiveStats.foodsEaten[foodType];
    if (count > 0) badges.push({ foodType, count });
  }

  if (cognitiveStats.phoneCallsManaged > 0) {
    badges.push({ foodType: 'phone', count: cognitiveStats.phoneCallsManaged });
  }

  if (badges.length === 0) {
    bar.classList.add('hidden');
    return;
  }

  bar.classList.remove('hidden');

  badges.forEach(({ foodType, count }) => {
    const badge = document.createElement('span');
    badge.className = `run-badge run-badge--${foodType}`;
    badge.dataset.finalValue = count;

    const glyph = document.createElement('span');
    glyph.className = 'run-badge__glyph';

    const number = document.createElement('span');
    number.className = 'run-badge__count';
    number.textContent = count; // Story 23.3 will animate this

    badge.appendChild(glyph);
    badge.appendChild(number);
    bar.appendChild(badge);
  });
}
```

**CSS — badge strip layout:**
```css
#run-summary-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 16px 0;
}

.run-badge {
  display: flex;
  align-items: center;
  gap: 5px;
}

.run-badge__count {
  font-family: 'Jersey20', monospace;
  font-size: 18px;
}
```

**DOM access rule:** Only `main.js` or `run-summary.js` may touch DOM. If extracting to `run-summary.js`, export a single `renderRunSummaryBar(cognitiveStats)` function and import it in `main.js`.

**Screen visibility rule:** Use `.hidden` class to show/hide the bar — never `element.style.display`.

**Call site:** Invoke `renderRunSummaryBar(gameState.cognitiveStats)` in the game-over phase transition handler in `main.js`, after `cognitiveStats` is finalized.

### Dependencies

**BLOCKS:** Stories 23.3, 23.4
**BLOCKED BY:** Story 23.1

---

## Implementation Status

**Status:** 🟢 DONE

---

## Dev Agent Record

### Implementation Plan
1. Extract to `js/run-summary.js` (main.js already large at 860 lines)
2. Add `#run-summary-bar` div in `index.html` between `#new-high-score-indicator` and `.cognitive-stats`
3. Add CSS in `style.css` for badge strip layout + all 7 glyph shapes + neon glow
4. Import and call `renderRunSummaryBar(state.cognitiveStats)` in `main.js` gameover transition

### Completion Notes
- Created `js/run-summary.js` — exports `renderRunSummaryBar(cognitiveStats)`. Zero hardcoded hex in JS; all colors applied via CSS classes. Includes Story 23.3 animation logic in same module.
- Added `<div id="run-summary-bar" class="hidden"></div>` in `index.html` at line 50, between `#new-high-score-indicator` and `.cognitive-stats`
- Added ~170 lines of CSS in `style.css` (bottom) covering: container layout, `.run-badge`, `.run-badge__glyph` shapes for all 7 types, `.run-badge__count` per-type neon glow, animation keyframes
- Added import + `renderRunSummaryBar(state.cognitiveStats)` call in `main.js` inside `if (phaseChanged)` gameover block, before `setTimeout` for highlights
- Color note: Reverse Controls uses `#FFA500` (matches `CONFIG.COLORS.foodReverseControls`); story table showed `#FF8C00` but rule "source from CONFIG.COLORS" takes precedence
- Phone glyph: unicode `\u260E` (☎), styled gold matching `CONFIG.COLORS.phoneRing`
- Zero-count suppression: strict `count > 0` check, empty runs hide bar entirely via `.hidden` class

---

## File List
- `js/run-summary.js` — New: render function + animation (Stories 23.2 + 23.3)
- `index.html` — Added `#run-summary-bar` div in game-over screen
- `css/style.css` — Added Run Summary Bar CSS section (~170 lines)
- `js/main.js` — Added import + call site in gameover phase transition
- `_bmad-output/implementation-artifacts/stories/23-2-render-run-summary-bar-on-game-over-screen.md` — Status updated
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Status: review

---

## Change Log
- 2026-02-19: Story 23.2 implemented — Run Summary Bar DOM rendering with badge strip, CSS glyph shapes, neon glow
