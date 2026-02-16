# Story 16.3: Add Strongest Domain and Growth Area Callouts

**Epic:** 16 - Skill Map Dashboard (The Cognitive Mirror)

**As a** player,
**I want** to see my top skill and my growth opportunity highlighted,
**So that** I understand where I excel and where to focus.

---

## Acceptance Criteria

**Given** rolling averages are calculated for all 6 domains
**When** Skill Map displays
**Then** identify strongest domain: highestRollingAverage()
**And** identify growth area: lowestRollingAverage() OR biggestRecentImprovement()

**Given** strongest domain is determined
**When** rendering block bars
**Then** add gold star icon (★) next to that domain's rating:
```
Spatial          █████  5/5  ★
```
**And** star in gold color #FFC107, 14px

**Given** strongest domain is identified
**When** displaying callout card below bars
**Then** show:
```
★ Top Skill: Spatial Awareness
  "Your snake navigates like it has GPS."
```
**And** card uses purple border, dark background, Jersey20 font
**And** one-liner is domain-specific (different for each domain)

**Given** growth area is determined (lowest rolling average)
**When** rendering block bars
**Then** add up-arrow icon (↑) next to that domain's rating:
```
Working Memory   ██░░░  2/5  ↑
```
**And** arrow in light green #81C784, 14px

**Given** growth area is identified
**When** displaying callout card below bars
**Then** show:
```
↑ Level Up: Working Memory
  "Combo mode is your gym. Get in there."
```
**And** one-liner encourages engaging with that cognitive challenge

**Given** a domain improved by >=1 block since last session
**When** rendering that domain's bar
**Then** add green up-arrow (▲) next to rating:
```
Flexibility      ███░░  3/5  ▲
```
**And** arrow indicates recent improvement (per UX design)

**Per FR175-FR176:** Dashboard displays strongest domain callout and growth area callout (dynamically determined)

---

## Dev Section

### Technical Context

**Story Purpose:** Add narrative layer on top of raw block bars (from 16.2). Identifies strongest/weakest domains, adds visual indicators (★, ↑, ▲) to bars, and renders callout cards below bars. This transforms data into story per Knaflic's narrative arc.

**Architecture Pattern:** Pure calculation logic (`determineStrongestDomain()`, `determineGrowthArea()`) + DOM rendering. Callouts update dynamically on each Skill Map visit.

**Key UX Insight:** "Level Up" language, never "weakest" — ethical guardrails per Celia's input. Comedy one-liners are domain-contextual (see config.js DASHBOARD.DOMAIN_QUOTES).

### Files to Modify

**MODIFY:**
- `js/dashboard.js` — Add callout calculation + rendering logic, extend `createBlockBarRow()` to accept indicators
- `js/config.js` — Add DASHBOARD.DOMAIN_QUOTES (one-liners for each domain × context)
- `css/style.css` — Add callout card styles, indicator icon styles

### Implementation Guidance

#### 1. Domain Analysis Logic (js/dashboard.js)

**Add helper functions:**

```javascript
// dashboard.js — Domain analysis

/**
 * Determine strongest domain (highest block score)
 * @param {Object} domainScores - { reactionTime: 3, spatialAwareness: 5, ... }
 * @returns {string} - Domain key with highest score
 */
function determineStrongestDomain(domainScores) {
  let maxScore = -1;
  let strongestDomain = null;

  for (const [key, score] of Object.entries(domainScores)) {
    if (score > maxScore) {
      maxScore = score;
      strongestDomain = key;
    }
  }

  return strongestDomain;
}

/**
 * Determine growth area (lowest block score)
 * @param {Object} domainScores - { reactionTime: 3, spatialAwareness: 5, ... }
 * @returns {string} - Domain key with lowest score
 */
function determineGrowthArea(domainScores) {
  let minScore = Infinity;
  let growthDomain = null;

  for (const [key, score] of Object.entries(domainScores)) {
    if (score < minScore) {
      minScore = score;
      growthDomain = key;
    }
  }

  return growthDomain;
}

/**
 * Calculate improvement indicators (domains that improved >=1 block since last session)
 * @param {Object} currentScores - Current domain scores
 * @param {Object} previousScores - Previous session's domain scores (from storage)
 * @returns {Set<string>} - Set of domain keys that improved
 */
function calculateImprovementIndicators(currentScores, previousScores) {
  const improved = new Set();

  if (!previousScores) return improved;  // First session, no comparison

  for (const [key, currentScore] of Object.entries(currentScores)) {
    const prevScore = previousScores[key] || 0;
    if (currentScore >= prevScore + 1) {
      improved.add(key);
    }
  }

  return improved;
}
```

#### 2. Update Block Bar Rendering (js/dashboard.js)

**Extend `createBlockBarRow()` to accept indicators:**

```javascript
/**
 * Create a single block bar row with optional indicators
 * @param {string} label - Domain name
 * @param {number} blockScore - 0-5 scale
 * @param {Object} indicators - { star: bool, growthArrow: bool, improvedArrow: bool }
 * @returns {HTMLElement}
 */
function createBlockBarRow(label, blockScore, indicators = {}) {
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

  // Rating text
  const ratingText = document.createElement('span');
  ratingText.className = 'rating-text';
  ratingText.textContent = `${blockScore}/5`;
  row.appendChild(ratingText);

  // Indicators
  const indicatorsContainer = document.createElement('span');
  indicatorsContainer.className = 'indicators';

  if (indicators.star) {
    const star = document.createElement('span');
    star.className = 'indicator star';
    star.textContent = '★';
    indicatorsContainer.appendChild(star);
  }

  if (indicators.growthArrow) {
    const arrow = document.createElement('span');
    arrow.className = 'indicator growth-arrow';
    arrow.textContent = '↑';
    indicatorsContainer.appendChild(arrow);
  }

  if (indicators.improvedArrow) {
    const arrow = document.createElement('span');
    arrow.className = 'indicator improved-arrow';
    arrow.textContent = '▲';
    indicatorsContainer.appendChild(arrow);
  }

  row.appendChild(indicatorsContainer);

  return row;
}
```

**Update `renderFullSkillMap()` to pass indicators:**

```javascript
function renderFullSkillMap(profile) {
  const barsContainer = document.getElementById('skill-map-bars-container');
  const { domainScores, previousDomainScores } = profile;

  barsContainer.innerHTML = '';

  const strongestDomain = determineStrongestDomain(domainScores);
  const growthArea = determineGrowthArea(domainScores);
  const improvedDomains = calculateImprovementIndicators(domainScores, previousDomainScores);

  const domains = [
    { key: 'reactionTime', label: 'Reaction' },
    { key: 'spatialAwareness', label: 'Spatial' },
    { key: 'cognitiveFlexibility', label: 'Flexibility' },
    { key: 'dividedAttention', label: 'Attention' },
    { key: 'impulseControl', label: 'Impulse' },
    { key: 'workingMemory', label: 'Memory' }
  ];

  domains.forEach(domain => {
    const blockScore = domainScores[domain.key] || 0;

    const indicators = {
      star: domain.key === strongestDomain,
      growthArrow: domain.key === growthArea,
      improvedArrow: improvedDomains.has(domain.key)
    };

    const row = createBlockBarRow(domain.label, blockScore, indicators);
    barsContainer.appendChild(row);
  });

  // Render callout cards
  renderCalloutCards(strongestDomain, growthArea);
}
```

#### 3. Callout Card Rendering (js/dashboard.js)

**Add callout rendering:**

```javascript
/**
 * Render callout cards below block bars
 * @param {string} strongestDomain - Key of strongest domain
 * @param {string} growthArea - Key of growth area domain
 */
function renderCalloutCards(strongestDomain, growthArea) {
  const calloutsContainer = document.getElementById('skill-map-callouts');
  calloutsContainer.innerHTML = '';

  // Top Skill card
  const topSkillCard = document.createElement('div');
  topSkillCard.className = 'callout-card top-skill';
  topSkillCard.innerHTML = `
    <div class="callout-header">
      <span class="callout-icon star">★</span>
      <span class="callout-title">Top Skill: ${getDomainFullName(strongestDomain)}</span>
    </div>
    <div class="callout-quote">
      "${CONFIG.DASHBOARD.DOMAIN_QUOTES.topSkill[strongestDomain]}"
    </div>
  `;
  calloutsContainer.appendChild(topSkillCard);

  // Level Up card
  const levelUpCard = document.createElement('div');
  levelUpCard.className = 'callout-card level-up';
  levelUpCard.innerHTML = `
    <div class="callout-header">
      <span class="callout-icon growth">↑</span>
      <span class="callout-title">Level Up: ${getDomainFullName(growthArea)}</span>
    </div>
    <div class="callout-quote">
      "${CONFIG.DASHBOARD.DOMAIN_QUOTES.levelUp[growthArea]}"
    </div>
  `;
  calloutsContainer.appendChild(levelUpCard);
}

/**
 * Get full domain name from key
 * @param {string} key - Domain key (e.g., 'reactionTime')
 * @returns {string} - Full name (e.g., 'Reaction Time')
 */
function getDomainFullName(key) {
  const names = {
    reactionTime: 'Reaction Time',
    spatialAwareness: 'Spatial Awareness',
    cognitiveFlexibility: 'Cognitive Flexibility',
    dividedAttention: 'Divided Attention',
    impulseControl: 'Impulse Control',
    workingMemory: 'Working Memory'
  };
  return names[key] || key;
}
```

#### 4. Domain Quote Config (js/config.js)

**Add to CONFIG.DASHBOARD:**

```javascript
// config.js — DASHBOARD section
DASHBOARD: {
  // ... existing fields ...

  DOMAIN_QUOTES: {
    topSkill: {
      reactionTime: "Your reflexes have their own zip code — they arrive that fast.",
      spatialAwareness: "Your snake navigates like it has GPS. No, wait — better than GPS.",
      cognitiveFlexibility: "Reverse Controls? Please. Your brain treats that like a warm-up.",
      dividedAttention: "Phone calls during gameplay? You multitask like you've got two brains.",
      impulseControl: "You weigh risk like a Wall Street quant with nothing to lose.",
      workingMemory: "Combo mode? Your working memory eats those for breakfast."
    },
    levelUp: {
      reactionTime: "Reaction Time is your next frontier — speed runs, here you come.",
      spatialAwareness: "Spatial Awareness wants some love. Let that snake grow long and proud.",
      cognitiveFlexibility: "Reverse Controls is your gym. Get in there and flip some neurons.",
      dividedAttention: "Phone calls are your next level. Pick up more — you can handle it.",
      impulseControl: "Impulse Control is cooking. A few more strategic Pick Ups and you'll level up.",
      workingMemory: "Working Memory is next on the list. Combo mode is calling your name."
    }
  }
}
```

#### 5. CSS Styling (css/style.css)

**Add indicator styles:**

```css
/* === Skill Map Indicators === */
.indicators {
  display: inline-flex;
  gap: 6px;
  margin-left: 8px;
}

.indicator {
  font-size: 14px;
  font-weight: bold;
}

.indicator.star {
  color: #FFC107;  /* Gold */
}

.indicator.growth-arrow {
  color: #81C784;  /* Light green */
}

.indicator.improved-arrow {
  color: #81C784;  /* Green */
}

/* === Callout Cards === */
#skill-map-callouts {
  margin-top: 30px;
  margin-bottom: 20px;
}

.callout-card {
  background: rgba(26, 26, 46, 0.6);
  border: 2px solid rgb(157, 178, 221);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.callout-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.callout-icon {
  font-size: 18px;
  font-weight: bold;
}

.callout-icon.star {
  color: #FFC107;
}

.callout-icon.growth {
  color: #81C784;
}

.callout-title {
  font-family: 'Jersey20', sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
}

.callout-quote {
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  font-style: italic;
  color: #B0B0B0;
  padding-left: 26px;  /* Indent quote */
  line-height: 1.4;
}
```

### Testing Guidance

**Manual Testing Checklist:**

1. **Strongest Domain Indicator:**
   - [ ] Domain with highest block score shows gold star (★) next to rating
   - [ ] Star is 14px, gold #FFC107
   - [ ] Top Skill callout card displays correct domain name
   - [ ] One-liner from CONFIG.DASHBOARD.DOMAIN_QUOTES.topSkill matches domain

2. **Growth Area Indicator:**
   - [ ] Domain with lowest block score shows green up-arrow (↑) next to rating
   - [ ] Arrow is 14px, light green #81C784
   - [ ] Level Up callout card displays correct domain name
   - [ ] One-liner from CONFIG.DASHBOARD.DOMAIN_QUOTES.levelUp matches domain

3. **Improvement Indicator:**
   - [ ] Domain that improved >=1 block shows green triangle (▲) next to rating
   - [ ] Triangle is 14px, green #81C784
   - [ ] Works correctly when comparing to previousDomainScores

4. **Callout Cards:**
   - [ ] Top Skill card renders with purple border, dark background
   - [ ] Level Up card renders with purple border, dark background
   - [ ] Quote text is italicized, light grey #B0B0B0
   - [ ] Quotes are contextually correct per domain

5. **Edge Cases:**
   - [ ] All domains tied → first domain alphabetically gets star/arrow
   - [ ] First session (no previousScores) → no improvement indicators
   - [ ] Single domain at 5/5, others at 0 → correct star placement

### Definition of Done

- [ ] `determineStrongestDomain()`, `determineGrowthArea()`, `calculateImprovementIndicators()` implemented
- [ ] `createBlockBarRow()` extended to accept indicators object
- [ ] Star (★), growth arrow (↑), improved arrow (▲) render correctly on bars
- [ ] Callout cards render below bars with domain-specific quotes
- [ ] CONFIG.DASHBOARD.DOMAIN_QUOTES added with 6 domains × 2 contexts (12 total quotes)
- [ ] CSS styles for indicators and callout cards added
- [ ] Manual testing checklist passed (5/5 scenarios)
- [ ] No console errors
- [ ] Callouts update dynamically when Skill Map reopened

### Dependencies

**Blocked By:**
- Story 16.2 complete (block bars render correctly)

**Blocks:**
- Story 16.4 (session count below callouts)

### References

- [Source: ux-design-cognitive-dashboard.md — Callout Cards, Domain-Specific One-Liner Pools]
- [Source: project-context.md — V3 DOM Rendering Patterns, Comedy Quote System]
- [Source: config.js — DASHBOARD.DOMAIN_QUOTES structure]
