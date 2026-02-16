# Story 15.6: Implement Baseline Data Collection

**Epic:** 15 - Calibration Period System

**As a** system,
**I want** to use calibration period data to establish stable baselines,
**So that** subsequent metric displays are meaningful and trustworthy.

---

## Acceptance Criteria

**Given** player completes sessions 1-5
**When** each session saves to IndexedDB
**Then** metrics.js calculates raw session metrics
**And** storage.js accumulates data for baseline establishment

**Given** calibrationComplete === true (session 5 finished)
**When** Skill Map first displays
**Then** calculate baseline rolling averages using all 5 calibration sessions:
```javascript
baselineMetrics = {
  reactionTime: avg(sessions[0-4].reactionTime),
  spatialAwareness: avg(sessions[0-4].spatialAwareness),
  cognitiveFlexibility: avg(sessions[0-4].cognitiveFlexibility),
  dividedAttention: avg(sessions[0-4].dividedAttention),
  impulseControl: avg(sessions[0-4].impulseControl),
  workingMemory: avg(sessions[0-4].workingMemory)
}
```
**And** use these as reference points for improvement tracking

**Given** player completes session 6+ (post-calibration)
**When** rolling averages are calculated
**Then** include all sessions (1-N) with recency weighting (per Epic 13 Story 13.8)
**And** baseline provides stable reference for improvement deltas

**Given** calibration data shows high variance in a metric (e.g., player never encountered RC in 5 sessions)
**When** Skill Map displays
**Then** flag that metric as "insufficient data" with icon
**And** show tooltip: "Play more sessions to improve accuracy for this domain"

**Per FR189:** Calibration state prevents volatile early data from populating brain map (builds baseline first)

---

## Tasks / Subtasks

### Task 1: Ensure metrics.js captures all session data during calibration
- [ ] Verify `calculateSessionMetrics()` runs for ALL sessions (1-N), not just post-calibration
- [ ] Confirm all 6 domain metrics calculated: reactionTime, spatialAwareness, cognitiveFlexibility, dividedAttention, impulseControl, workingMemory
- [ ] Verify null propagation works correctly (null means "not applicable", not 0)
- [ ] Ensure session record includes all raw metrics before normalization

**Maps to AC:** "metrics.js calculates raw session metrics"

### Task 2: Verify storage.js saves session metrics during calibration
- [ ] In `saveSession()`, confirm no calibration gate prevents IndexedDB writes
- [ ] Sessions 1-5 saved with full metric data (even though Skill Map is hidden)
- [ ] Verify `sessionsCompleted` counter increments with each save
- [ ] Prune logic respects MAX_SESSIONS (100) even during calibration

**Maps to AC:** "storage.js accumulates data for baseline establishment"

### Task 3: Add baseline calculation to metrics.js
- [ ] Create `calculateBaselineMetrics(sessions)` function
- [ ] Input: array of session objects (first 5 sessions)
- [ ] For each metric domain, calculate simple average: `avg(sessions[0-4].metrics[domain])`
- [ ] Handle null values: skip null metrics in average calculation (per V3 null propagation pattern)
- [ ] Return object with 6 baseline values (one per domain)

**Maps to AC:** "calculate baseline rolling averages using all 5 calibration sessions"

### Task 4: Store baseline in profile after session 5
- [ ] In `game.js` onDeath flow (session 5 only), after `storage.saveSession()`
- [ ] Fetch first 5 sessions: `const sessions = await storage.getSessions(5)`
- [ ] Calculate baseline: `const baseline = metrics.calculateBaselineMetrics(sessions)`
- [ ] Save to profile: `await storage.updateProfile({ baselineMetrics: baseline })`
- [ ] This happens once, after calibration completes

**Maps to AC:** "Skill Map first displays using 5 calibration sessions"

### Task 5: Add insufficient data flagging to dashboard.js
- [ ] In dashboard render logic, check if any metric has all-null sessions
- [ ] If domain score is 0 due to no data (not due to poor performance), flag as "insufficient data"
- [ ] Display icon (⚠️ or similar) next to domain label
- [ ] Tooltip: "Play more sessions to improve accuracy for this domain"
- [ ] This handles edge cases (e.g., player never encountered RC food in 5 sessions)

**Maps to AC:** "flag that metric as 'insufficient data' with icon"

### Task 6: Integrate baseline with rolling averages
- [ ] In `metrics.js`, ensure rolling average calculation includes ALL sessions (1-N)
- [ ] Apply recency weighting per Story 13.8 (more recent sessions weighted higher)
- [ ] Baseline stored in profile serves as reference for improvement deltas (Epic 16)
- [ ] Growth indicators (▲/▽) compare current rolling avg to baseline avg

**Maps to AC:** "rolling averages include all sessions (1-N) with recency weighting"

---

## Dev Notes

### File Locations

- **metrics.js** (`/Users/anthonysalvi/code/CrazySnakeLite/js/metrics.js`): Add `calculateBaselineMetrics()` function
  - Pure function: takes sessions array, returns baseline object
  - No storage import (data passed as argument per V3 module pattern)
  - Null handling: `if (val !== null && val !== undefined)` explicit check

- **storage.js** (`/Users/anthonysalvi/code/CrazySnakeLite/js/storage.js`): No changes needed for baseline
  - `saveSession()` already saves all metrics during calibration
  - `updateProfile()` can store `baselineMetrics` field (generic merge)
  - `getProfile()` returns baseline when reading profile

- **game.js** (`/Users/anthonysalvi/code/CrazySnakeLite/js/game.js`): Add baseline calculation to onDeath flow
  - After session 5 only (check `profile.sessionsCompleted === 5`)
  - Call sequence: save session → get 5 sessions → calculate baseline → update profile
  - Async flow: all storage calls must be `await`ed

- **dashboard.js** (`/Users/anthonysalvi/code/CrazySnakeLite/js/dashboard.js`): Add insufficient data flagging
  - Check domain scores after calculation
  - If score === 0 AND all sessions have null for that metric → flag
  - Render ⚠️ icon with tooltip

### Baseline Calculation Logic

**Simple average for first 5 sessions:**

```javascript
// In metrics.js
export function calculateBaselineMetrics(sessions) {
  const domains = [
    'reactionTime',
    'spatialAwareness',
    'cognitiveFlexibility',
    'dividedAttention',
    'impulseControl',
    'workingMemory'
  ];

  const baseline = {};

  for (const domain of domains) {
    const values = [];

    for (const session of sessions) {
      const val = session.metrics[domain];
      // V3 null propagation: null means "not applicable", skip in average
      if (val !== null && val !== undefined) {
        values.push(val);
      }
    }

    // If no valid values, baseline is null (insufficient data)
    baseline[domain] = values.length > 0
      ? values.reduce((sum, v) => sum + v, 0) / values.length
      : null;
  }

  return baseline;
}
```

**Why simple average (not weighted)?**
- Baseline represents initial performance level across first 5 sessions
- No recency bias needed (all 5 sessions equally important for establishing baseline)
- Weighted average used for rolling averages (post-calibration tracking)

### Storage Flow (Session 5 Completion)

**Enhanced onDeath flow (game.js):**

```javascript
// After session record built
await storage.saveSession(sessionRecord);

// Increment session counter
const profile = storage.getProfile();
profile.sessionsCompleted += 1;

// If session 5, calculate and store baseline
if (profile.sessionsCompleted === 5) {
  profile.calibrationComplete = true;

  // Fetch first 5 sessions for baseline
  const sessions = await storage.getSessions(5);
  const baseline = metrics.calculateBaselineMetrics(sessions);
  profile.baselineMetrics = baseline;

  console.log('[Game] Calibration complete. Baseline established:', baseline);
}

// Save updated profile
storage.updateProfile(profile);
```

**Profile schema after session 5:**

```javascript
{
  calibrationComplete: true,
  sessionsCompleted: 5,
  celebrationShown: false,  // Story 15.4 sets to true after celebration
  lastPlayedDate: '2026-02-16',
  baselineMetrics: {
    reactionTime: 0.72,
    spatialAwareness: 0.45,
    cognitiveFlexibility: 0.68,
    dividedAttention: 0.53,
    impulseControl: 0.61,
    workingMemory: null  // Example: no combo encountered in first 5 sessions
  }
}
```

### Null Metric Propagation (V3 Pattern)

**Critical rule:** `null` means "not applicable", never coerce to 0.

**Example scenarios:**

1. **Player never encounters RC food in first 5 sessions:**
   - `session.metrics.impulseControl` = null (no data to calculate)
   - `baseline.impulseControl` = null (all values null)
   - Dashboard flags impulseControl as "insufficient data"

2. **Player encounters RC once in session 3:**
   - Sessions 1, 2, 4, 5: `impulseControl` = null
   - Session 3: `impulseControl` = 0.8 (survived 2 RC periods well)
   - Baseline: average of [0.8] = 0.8 (single data point)
   - Dashboard shows 0.8 but may add "limited data" indicator

3. **Normal case (data in 4 of 5 sessions):**
   - Values: [0.7, null, 0.8, 0.6, 0.75]
   - Baseline: avg([0.7, 0.8, 0.6, 0.75]) = 0.7125
   - Dashboard shows normal block bar

**Why this matters:**
- Showing 0 blocks for "insufficient data" misleads player (implies poor performance)
- Null + warning icon communicates "need more data" accurately
- Aligns with trust-building goals of calibration system

### Insufficient Data Flagging

**Dashboard render logic (dashboard.js):**

```javascript
// After calculating domain scores
const insufficientDataDomains = [];

for (const domain of Object.keys(domainScores)) {
  const score = domainScores[domain];
  const baselineVal = profile.baselineMetrics?.[domain];

  // Flag if baseline is null (no data in first 5 sessions)
  if (baselineVal === null) {
    insufficientDataDomains.push(domain);
  }
}

// Render with warning icons
for (const domain of insufficientDataDomains) {
  const domainLabel = document.querySelector(`[data-domain="${domain}"] .label`);
  const warningIcon = document.createElement('span');
  warningIcon.className = 'warning-icon';
  warningIcon.textContent = ' ⚠️';
  warningIcon.title = 'Play more sessions to improve accuracy for this domain';
  domainLabel.appendChild(warningIcon);
}
```

**Visual treatment:**
- Icon: ⚠️ (warning triangle emoji)
- Color: amber #FFB74D (matches growth decline indicator)
- Position: inline after domain label text
- Tooltip: Shows on hover (native `title` attribute)

### Baseline vs Rolling Average

**Two different concepts:**

1. **Baseline (stored once):**
   - Calculated after session 5
   - Simple average of first 5 sessions
   - Used as reference point for improvement tracking
   - Never recalculated (historical snapshot)

2. **Rolling Average (calculated on-demand):**
   - Calculated every session (sessions 1-N)
   - Last 10 sessions, recency-weighted
   - Used for current skill level display
   - Updates continuously

**Usage in dashboard:**
- Block bars show rolling average (current skill level)
- Growth indicators (▲/▽) compare rolling avg to baseline (improvement since calibration)

**Example:**
- Baseline (session 5): `spatialAwareness = 0.45`
- Rolling avg (session 20): `spatialAwareness = 0.68`
- Delta: +0.23 → show ▲ green indicator (improved since baseline)

### Integration with Other Epics

**Epic 13 (Metrics Engine):**
- Story 13.2-13.7: Calculate individual domain metrics (source data for baseline)
- Story 13.8: Rolling average with recency weighting (post-calibration tracking)
- Story 13.9: Storage persistence (baseline saved to profile)

**Epic 16 (Skill Map):**
- Story 16.2: Pixel block bars visualization (displays rolling avg, not baseline)
- Story 16.3: Growth indicators (compares rolling avg to baseline)
- Story 16.4: Session count display (shows total sessions, not just calibration)

**Data flow:**
```
Session 1-5 → metrics calculated → saved to IndexedDB
↓
Session 5 completes → baseline calculated → saved to localStorage profile
↓
Session 6+ → rolling avg calculated → compared to baseline → growth indicator
↓
Dashboard → renders rolling avg bars + growth indicators (▲/▽)
```

### Test Scenarios

**Manual test checklist for Story 15.6:**

1. **During calibration (sessions 1-4):**
   - Complete session, verify metrics saved to IndexedDB
   - Check DevTools → Application → IndexedDB → sessions store
   - Verify all 6 metrics present (null if not applicable)
   - Skill Map still hidden (Story 15.5)

2. **Session 5 completion:**
   - Complete session, verify `calibrationComplete = true`
   - Check localStorage → `crazysnakeLite_profile`
   - Verify `baselineMetrics` object with 6 domains
   - Verify any null baselines (if certain foods never encountered)

3. **Post-calibration (session 6+):**
   - Complete session, verify rolling avg calculated
   - Skill Map should show block bars based on rolling avg
   - Growth indicators compare rolling avg to baseline
   - If baseline is null for a domain, ⚠️ icon appears

4. **Edge case: All nulls in calibration:**
   - Use test scenario: player only eats Growing food (no special effects)
   - All non-trivial metrics will be null
   - Dashboard should show multiple ⚠️ icons
   - No block bars filled (insufficient data, not poor performance)

5. **Edge case: Partial data:**
   - Use test scenario: player encounters RC once in 5 sessions
   - `impulseControl` baseline = single value (not null)
   - Block bars render normally, but may show "limited data" indicator
   - Growth indicators compare to baseline value

---

## References

**Project Context (V3 patterns):**
- `project-context.md` lines 240-249: Null metric propagation pattern (never coerce to 0)
- `project-context.md` lines 227-238: Async storage patterns (all storage calls awaited)
- `project-context.md` lines 697-711: Session lifecycle onDeath flow (where baseline calculation fits)

**Architecture Document:**
- `architecture.md` V3 Evolution: Metrics engine pure functions, storage abstraction
- Session record schema: `{ sessionId, timestamp, score, metrics: { ...6 domains }, rawEvents }`

**UX Design Authority:**
- `ux-design-cognitive-dashboard.md`: Calibration prevents volatile early data display
- `dataviz-principles.md`: Data integrity principle (show "insufficient data" rather than misleading zeros)

**Epic 15 Context:**
- Epic 15 Story 15.1: Calibration state management (where baseline is stored)
- Epic 15 overview: 5-session calibration builds stable baseline before revealing full map

**Epic 13 Context:**
- Epic 13 Story 13.2-13.7: Individual metric calculations (source data for baseline)
- Epic 13 Story 13.8: Rolling average with recency weighting (post-calibration only)
- Epic 13 Story 13.9: Storage persistence (saves sessions during calibration)
