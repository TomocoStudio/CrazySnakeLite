# Story 16.2: Implement Pixel Block Bar Visualization

**Epic:** 16 - Skill Map Dashboard (The Cognitive Mirror)

**As a** player,
**I want** to see my 6 cognitive domains as simple block bars,
**So that** I understand my profile at a glance without needing to interpret complex charts.

---

## Acceptance Criteria

**Given** Skill Map displays
**When** rendering cognitive domains
**Then** show 6 horizontal rows with pixel block bars:
```
Reaction Time    ████░  4/5
Spatial          █████  5/5  ★
Flexibility      ███░░  3/5  ▲
Attention        ████░  4/5
Impulse          ███░░  3/5
Working Memory   ██░░░  2/5  ↑
```

**And** each row contains:
- Domain label (left-aligned, Jersey20 14px, white)
- 5 square blocks (16x16px each, 2px gap between)
- Rating text (right of blocks, "4/5" format, 12px Jersey20, light grey #B0B0B0)
- Optional indicator (★ for strongest, ▲ for improved, ↑ for growth area)

**Given** a metric has rolling average 0.83 (normalized 0-1 scale)
**When** converting to 5-block rating
**Then** calculate: blocks = Math.round(rollingAvg × 5) = round(0.83 × 5) = 4 blocks filled
**And** render 4 filled blocks (purple rgb(157, 178, 221)) + 1 empty block (dark grey #3A3A3A)

**Given** block bars render
**When** displaying filled vs empty blocks
**Then** filled blocks: solid purple rgb(157, 178, 221), no gradient
**And** empty blocks: dark grey #3A3A3A with 1px border #555555 (visible but receding)
**And** all blocks are perfect squares (16x16px, no rounded corners per pixel aesthetic)

**Given** domain labels display
**When** space is limited
**Then** abbreviate labels:
- "Reaction Time" → "Reaction"
- "Spatial Awareness" → "Spatial"
- "Cognitive Flexibility" → "Flexibility"
- "Divided Attention" → "Attention"
- "Impulse Control" → "Impulse"
- "Working Memory" → "Memory"

**Per FR172-FR174:** Brain Map displays radar chart (UPDATED: pixel block bars) with all 6 cognitive domains, pixel art styling

---

## Dev Section

### Technical Context

**Story Purpose:** Core visual rendering logic for the Skill Map. Transforms normalized 0-1 domain scores (from `metrics.js`) into 5-block visual ratings. This is the heart of Layer 2 (Cool Moment dashboard) per Sally's UX design.

**Architecture Pattern:** DOM-based rendering (NOT canvas). Each row is a flexbox containing label + 5 square divs + rating text. Filled/empty state controlled via CSS classes.

**Key Insight:** Pixel block bars replace radar chart per visual audit — grid-native, orthogonal, matches CrazySnake's square-everything aesthetic (see ux-design-cognitive-dashboard.md § "Why Pixel Block Bars").

### Files to Modify

**MODIFY:**
- `js/dashboard.js` — Add `renderBlockBars()` function called from `renderFullSkillMap()`
- `css/style.css` — Add block bar grid styles (rows, blocks, labels, rating text)

**READ (context):**
- `js/metrics.js` — Understand normalized score format (0-1 scale)
- `js/storage.js` — Understand profile.domainScores shape

### Implementation Guidance

#### 1. Block Bar Rendering Logic (js/dashboard.js)

**Add to `renderFullSkillMap()`:**

```javascript
// dashboard.js — renderFullSkillMap()
function renderFullSkillMap(profile) {
  const barsContainer = document.getElementById('skill-map-bars-container');
  const { domainScores } = profile;

  // Clear previous render
  barsContainer.innerHTML = '';

  // Render 6 domain rows
  const domains = [
    { key: 'reactionTime', label: 'Reaction' },
    { key: 'spatialAwareness', label: 'Spatial' },
    { key: 'cognitiveFlexibility', label: 'Flexibility' },
    { key: 'dividedAttention', label: 'Attention' },
    { key: 'impulseControl', label: 'Impulse' },
    { key: 'workingMemory', label: 'Memory' }
  ];

  domains.forEach(domain => {
    const blockScore = domainScores[domain.key] || 0;  // 0-5 scale
    const row = createBlockBarRow(domain.label, blockScore);
    barsContainer.appendChild(row);
  });
}

/**
 * Create a single block bar row: label + 5 blocks + rating text
 * @param {string} label - Domain name (abbreviated)
 * @param {number} blockScore - Rating on 0-5 scale (from metrics.js toBlockScale)
 * @returns {HTMLElement} - The row DOM element
 */
function createBlockBarRow(label, blockScore) {
  const row = document.createElement('div');
  row.className = 'block-bar-row';

  // Domain label
  const labelEl = document.createElement('span');
  labelEl.className = 'domain-label';
  labelEl.textContent = label;
  row.appendChild(labelEl);

  // Block container (5 blocks)
  const blocksContainer = document.createElement('div');
  blocksContainer.className = 'blocks-container';

  for (let i = 0; i < 5; i++) {
    const block = document.createElement('div');
    block.className = i < blockScore ? 'block filled' : 'block empty';
    blocksContainer.appendChild(block);
  }

  row.appendChild(blocksContainer);

  // Rating text (e.g., "4/5")
  const ratingText = document.createElement('span');
  ratingText.className = 'rating-text';
  ratingText.textContent = `${blockScore}/5`;
  row.appendChild(ratingText);

  return row;
}
```

**Critical:** Domain scores from `profile.domainScores` are already on the 5-block scale (0-5 integers). `metrics.js` calls `toBlockScale()` before storage. Do NOT re-normalize here.

#### 2. Calibration Placeholder (js/dashboard.js)

**Update `renderCalibrationPlaceholder()`:**

```javascript
function renderCalibrationPlaceholder(profile) {
  const barsContainer = document.getElementById('skill-map-bars-container');

  barsContainer.innerHTML = '';

  // Show empty block bars (all 5 blocks empty)
  const domains = [
    'Reaction', 'Spatial', 'Flexibility',
    'Attention', 'Impulse', 'Memory'
  ];

  domains.forEach(label => {
    const row = createBlockBarRow(label, 0);  // 0 = all blocks empty
    barsContainer.appendChild(row);
  });

  // Calibration message (below bars)
  const calloutsContainer = document.getElementById('skill-map-callouts');
  calloutsContainer.innerHTML = `
    <p class="calibration-message">
      Warming up...<br>
      Session ${profile?.totalSessions || 0}/5
    </p>
  `;
}
```

**UX Note:** Empty bars show structure during calibration — builds anticipation per Sally's design.

#### 3. CSS Styling (css/style.css)

**Add block bar grid styles:**

```css
/* === Skill Map Block Bars === */
.block-bar-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.domain-label {
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  color: #FFFFFF;
  min-width: 120px;
  text-align: left;
}

.blocks-container {
  display: flex;
  gap: 2px;
}

.block {
  width: 16px;
  height: 16px;
  border-radius: 0;  /* Perfect squares, no rounded corners */
}

.block.filled {
  background-color: rgb(157, 178, 221);  /* Purple theme */
  border: none;
}

.block.empty {
  background-color: #3A3A3A;  /* Dark grey */
  border: 1px solid #555555;  /* Subtle border */
}

.rating-text {
  font-family: 'Jersey20', sans-serif;
  font-size: 12px;
  color: #B0B0B0;  /* Light grey */
  margin-left: 8px;
  min-width: 30px;
}

/* Calibration placeholder message */
.calibration-message {
  font-family: 'Jersey20', sans-serif;
  font-size: 16px;
  color: #B0B0B0;
  text-align: center;
  margin-top: 30px;
  line-height: 1.6;
}
```

**Mobile responsive (optional for this story, formalized in 16.8):**

```css
@media (max-width: 768px) {
  .block-bar-row {
    gap: 8px;
  }

  .domain-label {
    min-width: 90px;
    font-size: 12px;
  }

  .block {
    width: 14px;
    height: 14px;
  }
}
```

### Testing Guidance

**Unit Tests:** (Create `test/dashboard.test.js`)

```javascript
// test/dashboard.test.js
import { createBlockBarRow } from '../js/dashboard.js';

// Test block count rendering
function testBlockBarRendering() {
  const row = createBlockBarRow('Reaction', 3);
  const blocks = row.querySelectorAll('.block');

  console.assert(blocks.length === 5, 'Should render 5 blocks');
  console.assert(blocks[0].classList.contains('filled'), 'Block 0 should be filled');
  console.assert(blocks[2].classList.contains('filled'), 'Block 2 should be filled');
  console.assert(blocks[3].classList.contains('empty'), 'Block 3 should be empty');

  const ratingText = row.querySelector('.rating-text').textContent;
  console.assert(ratingText === '3/5', 'Rating text should be 3/5');
}

testBlockBarRendering();
console.log('✓ Block bar rendering tests passed');
```

**Manual Testing Checklist:**

1. **Full Skill Map (after calibration):**
   - [ ] Open Skill Map with calibrationComplete = true
   - [ ] 6 rows render (Reaction, Spatial, Flexibility, Attention, Impulse, Memory)
   - [ ] Each row shows exactly 5 blocks
   - [ ] Filled blocks are purple rgb(157, 178, 221)
   - [ ] Empty blocks are dark grey #3A3A3A with subtle border
   - [ ] Rating text matches filled block count (e.g., 4 filled → "4/5")

2. **Calibration Placeholder:**
   - [ ] Open Skill Map with calibrationComplete = false
   - [ ] 6 rows render with all blocks empty (0/5)
   - [ ] "Warming up..." message displays below bars
   - [ ] Session counter shows correct progress (e.g., "Session 3/5")

3. **Block Proportions:**
   - [ ] Blocks are perfect 16x16px squares (no rounded corners)
   - [ ] 2px gap between blocks
   - [ ] No visual jank or misalignment

4. **Typography:**
   - [ ] Labels use Jersey20, 14px, white
   - [ ] Rating text uses Jersey20, 12px, light grey
   - [ ] Labels left-aligned, rating text right of blocks

5. **Edge Cases:**
   - [ ] Domain score = 0 → all 5 blocks empty, "0/5"
   - [ ] Domain score = 5 → all 5 blocks filled, "5/5"
   - [ ] Missing domainScores in profile → defaults to 0

### Definition of Done

- [ ] `renderBlockBars()` logic added to dashboard.js
- [ ] `createBlockBarRow()` helper function implemented
- [ ] Calibration placeholder shows empty bars + "Warming up..." message
- [ ] CSS styles for .block-bar-row, .block.filled, .block.empty added
- [ ] 6 domain rows render correctly (Reaction, Spatial, Flexibility, Attention, Impulse, Memory)
- [ ] Filled blocks use purple theme rgb(157, 178, 221)
- [ ] Empty blocks use dark grey #3A3A3A with 1px border #555555
- [ ] Rating text displays "X/5" format in light grey
- [ ] Blocks are 16x16px perfect squares, 2px gap
- [ ] Manual testing checklist passed (5/5 scenarios)
- [ ] No console errors during render
- [ ] Unit tests pass

### Dependencies

**Blocked By:**
- Story 16.1 complete (dashboard.js skeleton exists)
- Epic 13 complete (metrics.js produces normalized scores, storage.js has domainScores)

**Blocks:**
- Story 16.3 (callouts depend on block bar structure being stable)

### References

- [Source: ux-design-cognitive-dashboard.md — Pixel Block Bars Design Deep Dive, Why 5-Block Scale]
- [Source: project-context.md — V3 DOM Rendering Patterns]
- [Source: architecture.md — Decision 14: Skill Map Dashboard]
- [Source: metrics.js:toBlockScale() — Normalized 0-1 → 5-block scale mapping]
