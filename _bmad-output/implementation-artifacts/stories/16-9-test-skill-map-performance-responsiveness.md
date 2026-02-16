# Story 16.9: Test Skill Map Performance and Responsiveness

**Epic:** 16 - Skill Map Dashboard (The Cognitive Mirror)

**As a** developer,
**I want** the Skill Map to load instantly and render smoothly,
**So that** players experience no lag when checking their profile.

---

## Acceptance Criteria

**Given** player clicks "Skill Map" from menu
**When** navigation occurs
**Then** Skill Map displays within 500ms (per NFR52)
**And** no perceptible delay or loading spinner needed

**Given** Skill Map renders with all 6 domains
**When** metrics are calculated
**Then** rolling average calculations complete within 200ms (per NFR55)
**And** block bar rendering happens synchronously (no flicker)

**Given** player has 100+ sessions in IndexedDB
**When** loading Skill Map
**Then** query only necessary data (last 10 sessions for rolling avg + totals)
**And** avoid loading all session rawEvents (query only metrics objects)
**And** maintain < 500ms load time

**Given** Skill Map UI elements animate (pulsing streak, button hover)
**When** animations run
**Then** maintain 60 FPS (per NFR53)
**And** no jank or dropped frames

**Given** player navigates away from Skill Map
**When** phase changes to 'menu' or 'playing'
**Then** clean up Skill Map DOM elements
**And** remove event listeners
**And** prevent memory leaks (dashboard doesn't persist in background)

**Per NFR52-NFR53:** Brain map dashboard loads within 500ms, renders smoothly at 60 FPS

---

## Dev Section

### Technical Context

**Story Purpose:** Performance validation and optimization for the Skill Map dashboard. Ensures fast load times (< 500ms per NFR52), smooth animations (60 FPS per NFR53), and proper cleanup on phase exit to prevent memory leaks. This is the final quality gate before Epic 16 completion.

**Architecture Pattern:** Manual performance testing using Chrome DevTools (Performance tab, Memory profiler). No automated perf tests for MVP — we validate against NFR budgets via browser tooling. If budgets exceeded, optimize before shipping.

**Key NFR Constraints:**
- NFR52: Dashboard loads within 500ms (from button click to full render)
- NFR53: All UI animations at 60 FPS (no jank)
- NFR55: Metric calculations complete within 200ms

### Files to Modify

**MODIFY:**
- `js/dashboard.js` — Add performance optimizations if needed (cache queries, batch DOM updates)
- `test/dashboard-performance.test.js` — Create manual performance testing script (NEW)

**READ (context):**
- `js/storage.js` — Understand IndexedDB query patterns (last 10 sessions only)
- `js/metrics.js` — Understand calculation complexity (rolling averages)

### Implementation Guidance

#### 1. Performance Budget Validation

**Target budgets (from NFRs):**

| Metric | Budget | Measurement Method |
|--------|--------|-------------------|
| Dashboard load time | < 500ms | DevTools Performance: click → full render |
| Metric calculation | < 200ms | DevTools Performance: calculate function duration |
| Animation FPS | 60 FPS | DevTools Performance: frame rate during animation |
| Memory usage | No leaks | DevTools Memory: heap snapshot before/after navigation |

**Critical paths to measure:**

1. **Load path:** Button click → storage query → metric calculation → DOM render
2. **Animation path:** Milestone pulse, button hover, screen fade-out
3. **Cleanup path:** Phase exit → DOM cleanup → event listener removal

#### 2. Optimization Techniques (Apply if budget exceeded)

**DOM Query Caching:**

```javascript
// dashboard.js — Cache DOM queries at module level
let barsContainer, calloutsContainer, statsContainer, quoteContainer;

export function initDashboard() {
  barsContainer = document.getElementById('skill-map-bars-container');
  calloutsContainer = document.getElementById('skill-map-callouts');
  statsContainer = document.getElementById('skill-map-stats');
  quoteContainer = document.getElementById('skill-map-quote');
}

// Call initDashboard() once on app load (main.js)
```

**Batch DOM Updates:**

```javascript
// BEFORE (slow — 6 individual reflows):
barsContainer.appendChild(row1);
barsContainer.appendChild(row2);
barsContainer.appendChild(row3);
barsContainer.appendChild(row4);
barsContainer.appendChild(row5);
barsContainer.appendChild(row6);

// AFTER (fast — 1 reflow):
const fragment = document.createDocumentFragment();
fragment.appendChild(row1);
fragment.appendChild(row2);
fragment.appendChild(row3);
fragment.appendChild(row4);
fragment.appendChild(row5);
fragment.appendChild(row6);
barsContainer.appendChild(fragment);
```

**Optimized `renderFullSkillMap()`:**

```javascript
function renderFullSkillMap(profile) {
  const { domainScores, totalSessions, currentStreak } = profile;

  // Clear all containers in one pass
  barsContainer.innerHTML = '';
  calloutsContainer.innerHTML = '';
  statsContainer.innerHTML = '';
  quoteContainer.innerHTML = '';

  // Pre-calculate all data (no redundant calls)
  const strongestDomain = determineStrongestDomain(domainScores);
  const growthArea = determineGrowthArea(domainScores);
  const improvedDomains = calculateImprovementIndicators(domainScores, profile.previousDomainScores);
  const quote = selectDashboardQuote(profile);

  // Batch render all 6 rows
  const barFragment = document.createDocumentFragment();
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
    barFragment.appendChild(row);
  });

  barsContainer.appendChild(barFragment);  // Single reflow

  // Render other sections
  renderCalloutCards(strongestDomain, growthArea);
  renderSessionStats(totalSessions, currentStreak);
  renderQuote(quote);

  // Store quote for next-visit variety enforcement
  storage.updateProfile({ lastQuote: quote.text });
}
```

#### 3. Storage Query Optimization

**IndexedDB query strategy (from storage.js):**

```javascript
// CORRECT (already implemented in storage.js from Epic 13):
// Query only last 10 sessions with metrics objects (no rawEvents)
async function getSessions(count = 10) {
  const db = await openDB();
  const tx = db.transaction('sessions', 'readonly');
  const store = tx.objectStore('sessions');
  const index = store.index('timestamp');

  const sessions = await index.getAll(null, count);  // Last 10 only
  await tx.done;

  return sessions.reverse();  // Newest first
}

// WRONG (would exceed budget):
// Loading all 100+ sessions with full rawEvents arrays → 500ms+ load time
```

**Critical:** Dashboard only queries last 10 sessions. Metrics.js calculates rolling averages from those 10. No full session history loaded.

#### 4. Cleanup on Phase Exit

**Memory leak prevention:**

```javascript
// dashboard.js — Cleanup function called on phase exit
export function cleanupDashboard() {
  // Clear DOM content
  if (barsContainer) barsContainer.innerHTML = '';
  if (calloutsContainer) calloutsContainer.innerHTML = '';
  if (statsContainer) statsContainer.innerHTML = '';
  if (quoteContainer) quoteContainer.innerHTML = '';

  // Remove any lingering event listeners (if added dynamically)
  // (None in current implementation — all listeners in main.js)
}

// main.js — Call cleanup when exiting skillmap phase
function handleUIUpdate(gameState) {
  const { phase } = gameState;

  if (phase !== 'skillmap' && previousPhase === 'skillmap') {
    dashboard.cleanupDashboard();  // Cleanup on exit
  }

  // ... rest of phase transition logic ...

  previousPhase = phase;
}
```

#### 5. Manual Performance Testing Script

**Create test/dashboard-performance.test.js:**

```javascript
// test/dashboard-performance.test.js
// Manual performance validation script — run in browser console

/**
 * Performance Test Suite for Skill Map Dashboard
 * Run in browser console with DevTools Performance tab open
 */

async function testDashboardLoadTime() {
  console.log('📊 Testing Dashboard Load Time (NFR52: < 500ms)');

  const startTime = performance.now();

  // Simulate button click
  document.getElementById('skill-map-menu-btn').click();

  // Wait for render complete
  await new Promise(resolve => setTimeout(resolve, 100));

  const endTime = performance.now();
  const loadTime = endTime - startTime;

  console.log(`✓ Load Time: ${loadTime.toFixed(2)}ms`);
  console.assert(loadTime < 500, `FAIL: Load time ${loadTime.toFixed(2)}ms exceeds 500ms budget`);

  return loadTime;
}

async function testMetricCalculation() {
  console.log('📊 Testing Metric Calculation (NFR55: < 200ms)');

  const { getSessions } = await import('../js/storage.js');
  const { calculateDomainScores } = await import('../js/metrics.js');

  const sessions = await getSessions(10);

  const startTime = performance.now();
  const domainScores = calculateDomainScores(sessions);
  const endTime = performance.now();

  const calcTime = endTime - startTime;

  console.log(`✓ Calculation Time: ${calcTime.toFixed(2)}ms`);
  console.assert(calcTime < 200, `FAIL: Calculation time ${calcTime.toFixed(2)}ms exceeds 200ms budget`);

  return calcTime;
}

function testAnimationFPS() {
  console.log('📊 Testing Animation FPS (NFR53: 60 FPS)');
  console.log('⚠️  Manual step: Open DevTools Performance tab, record 5 seconds during:');
  console.log('   1. Milestone streak pulsing animation');
  console.log('   2. Play Now button hover state');
  console.log('   3. Skill Map fade-out transition');
  console.log('   Verify: Frame rate stays at 60 FPS (green bar), no dropped frames (red)');
}

function testMemoryLeaks() {
  console.log('📊 Testing Memory Leaks');
  console.log('⚠️  Manual step: Open DevTools Memory tab, take heap snapshots:');
  console.log('   1. Take snapshot at menu');
  console.log('   2. Navigate to Skill Map → take snapshot');
  console.log('   3. Navigate back to menu → take snapshot');
  console.log('   4. Repeat 10 times');
  console.log('   Verify: Heap size returns to baseline (no growth trend)');
}

async function runAllTests() {
  console.log('🚀 Starting Dashboard Performance Tests\n');

  await testDashboardLoadTime();
  await testMetricCalculation();
  testAnimationFPS();
  testMemoryLeaks();

  console.log('\n✅ Automated tests complete. Run manual tests per instructions above.');
}

// Auto-run when script loaded
runAllTests();
```

### Testing Guidance

**Manual Testing Procedure:**

**1. Load Time Test (NFR52):**

1. Open Chrome DevTools → Performance tab
2. Start recording
3. Click "Skill Map" button on main menu
4. Stop recording when dashboard fully rendered
5. Find "Skill Map button click" event in timeline
6. Measure time from click → last DOM update
7. **Pass:** < 500ms | **Fail:** >= 500ms

**2. Metric Calculation Test (NFR55):**

1. Open Chrome DevTools → Console
2. Load `test/dashboard-performance.test.js` script
3. Script outputs: `Calculation Time: Xms`
4. **Pass:** < 200ms | **Fail:** >= 200ms

**3. Animation FPS Test (NFR53):**

1. Open Chrome DevTools → Performance tab
2. Start recording
3. Hover over Play Now button (scale animation)
4. Set streak to 7 (milestone pulse animation)
5. Click Back to Menu (fade-out transition)
6. Stop recording
7. Check frame rate graph (top of timeline)
8. **Pass:** Green bar at 60 FPS, no red (dropped frames) | **Fail:** Red bars or FPS < 60

**4. Memory Leak Test:**

1. Open Chrome DevTools → Memory tab
2. Take heap snapshot (Snapshot 1)
3. Navigate: Menu → Skill Map → Menu → Skill Map → Menu (repeat 10 times)
4. Take heap snapshot (Snapshot 2)
5. Compare snapshots: Heap size should return to baseline ± 5%
6. **Pass:** No growth trend | **Fail:** Heap grows each cycle

**5. Storage Query Test:**

1. Open Chrome DevTools → Network tab
2. Clear network log
3. Click "Skill Map" button
4. Verify: No network requests (IndexedDB is local)
5. Open Application tab → IndexedDB → sessions store
6. Verify: Only 10 sessions queried (not all 100+)
7. **Pass:** 10 sessions | **Fail:** > 10 sessions

### Definition of Done

- [ ] Dashboard load time < 500ms (NFR52) validated via DevTools Performance
- [ ] Metric calculation < 200ms (NFR55) validated via console timing
- [ ] Animations at 60 FPS (NFR53) validated via DevTools Performance
- [ ] No memory leaks: heap size stable after 10+ navigation cycles
- [ ] Storage queries last 10 sessions only (no full history load)
- [ ] DOM query caching implemented (containers queried once)
- [ ] Batch DOM updates (DocumentFragment for 6 block bars)
- [ ] Cleanup function removes DOM content on phase exit
- [ ] `test/dashboard-performance.test.js` script created
- [ ] All 5 manual tests passed
- [ ] No console errors or warnings

### Dependencies

**Blocked By:**
- Stories 16.1-16.8 complete (all dashboard features implemented)
- Epic 13 complete (storage.js, metrics.js performance characteristics known)

**Blocks:**
- None (final story in Epic 16)

### References

- [Source: NFR52 — Dashboard loads within 500ms]
- [Source: NFR53 — UI animations render smoothly at 60 FPS]
- [Source: NFR55 — Metric calculations complete within 200ms]
- [Source: project-context.md — V3 Async Storage Patterns, Performance Validation]
- [Source: storage.js — getSessions() query implementation]
- [Source: metrics.js — calculateDomainScores() complexity]
