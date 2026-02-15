# Epic 13: Cognitive Metrics Data Engine

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-15
**Completed:** —

---

## Overview

Implement the foundational cognitive metrics data engine that silently tracks player performance across 6 gameplay-derived cognitive domains from session one. This is the invisible foundation for the entire Cognitive Dashboard — collecting raw gameplay data (input timing, snake length, RC performance, phone decisions, combo scores), calculating cognitive metrics using transparent formulas, and storing everything locally in IndexedDB with privacy-first architecture. No UI in this epic — purely the data layer that enables all future dashboard features.

**FRs covered:** FR150-FR160 (Metrics collection, rolling averages, localStorage/IndexedDB storage, privacy by default)

**NFRs covered:** NFR45-NFR50 (Data accuracy, reliability, deterministic calculations), NFR56-NFR61 (Storage, privacy, local-only operation)

**Value:** Foundation for the "brain gym mirror." Six metrics (Reaction Time, Spatial Awareness, Cognitive Flexibility, Divided Attention, Impulse Control, Working Memory) derived from actual gameplay — not abstract puzzles. Every snake movement, every phone decision, every RC survival becomes cognitive data. Stored 100% locally, zero server transmission, player owns their data.

---

## Stories

### Story 13.1: Define Metrics Data Model and Storage Schema

**As a** developer,
**I want** to define the cognitive metrics data model and IndexedDB schema,
**So that** all session data is structured, queryable, and efficient for 100+ sessions.

**Acceptance Criteria:**

**Given** the game initializes
**When** storage.js loads
**Then** IndexedDB database "CrazySnakeMetrics" is created with version 1
**And** object store "sessions" exists with keyPath "sessionId"
**And** index "timestamp" exists on sessions.timestamp for chronological queries
**And** index "score" exists on sessions.score for performance queries

**Given** a game session completes
**When** session data is stored
**Then** the session object contains:
```javascript
{
  sessionId: string,           // UUID
  timestamp: number,           // Date.now()
  score: number,               // Final score
  metrics: {
    reactionTime: number,      // Rolling avg input response time (ms)
    spatialAwareness: number,  // Snake length / grid coverage ratio
    cognitiveFlexibility: number, // RC score rate / normal score rate
    dividedAttention: number,  // Phone survival rate + decision speed composite
    impulseControl: number,    // Weighted Pick Up vs End ratio by context
    workingMemory: number      // Combo score rate / normal score rate
  },
  rawEvents: [                 // Array of gameplay events for metric calculation
    { type: 'food_eaten', timestamp, foodType, scoreGained },
    { type: 'phone_call', timestamp, decision, bonus },
    { type: 'rc_start', timestamp },
    { type: 'rc_end', timestamp, survived },
    { type: 'combo_start', timestamp },
    { type: 'combo_end', timestamp, multiplier },
    ...
  ]
}
```
**And** total storage footprint < 50KB per session (target < 5MB for 100 sessions per NFR57)

**Given** IndexedDB is unavailable (private browsing mode)
**When** storage initialization fails
**Then** graceful degradation: metrics still calculated but not persisted
**And** dashboard features show "local storage required" message
**And** game remains fully playable

---

### Story 13.2: Implement Reaction Time Metric Calculation

**As a** player,
**I want** the game to measure my reaction time during normal gameplay,
**So that** I can see how quickly I respond to food spawns.

**Acceptance Criteria:**

**Given** the game is running in normal mode (not RC, not phone call active)
**When** a food spawns
**Then** start measuring time until next directional input toward food
**And** record delta time in rawEvents array

**Given** multiple food consumption events occur in a session
**When** calculating reactionTime metric
**Then** compute rolling average of input response times
**And** exclude outliers > 2 standard deviations (removes pauses/distractions)
**And** store final reactionTime value in metrics object

**Given** player is in Reverse Controls mode
**When** food is consumed
**Then** do NOT include that response time in reactionTime calculation (per FR151 - excludes RC periods)

**Given** phone call overlay is active
**When** player navigates snake
**Then** do NOT include that response time in reactionTime calculation (per FR151 - excludes phone periods)

**Formula (per FR151):**
```javascript
reactionTime = average(validResponseTimes.filter(t => t < mean + 2*stdDev))
// Lower = better. Typical range: 200-800ms
```

---

### Story 13.3: Implement Spatial Awareness Metric Calculation

**As a** player,
**I want** the game to measure how efficiently I use the game board space,
**So that** I can see my spatial navigation skill.

**Acceptance Criteria:**

**Given** the game ends (player dies)
**When** calculating spatialAwareness metric
**Then** record final snake length at death
**And** calculate grid coverage percentage: (snake.length × GRID_UNIT_SIZE²) / (GRID_WIDTH × GRID_HEIGHT)
**And** compute spatialAwareness = snakeLengthAtDeath / gridCoveragePercentage

**Given** player reaches score 50 with snake length 55
**When** death occurs
**Then** spatialAwareness = 55 / ((55 × 10²) / (250 × 200)) = 55 / 0.11 = 500
**And** store spatialAwareness value in metrics object

**Formula (per FR152):**
```javascript
spatialAwareness = snakeLengthAtDeath / (snakeArea / totalGridArea)
// Higher = better. Indicates efficient space usage before collision
```

---

### Story 13.4: Implement Cognitive Flexibility Metric Calculation

**As a** player,
**I want** the game to measure how well I adapt during Reverse Controls,
**So that** I can see my executive function override capability.

**Acceptance Criteria:**

**Given** player consumes Reverse Controls food
**When** RC effect is active
**Then** track all food consumed during RC period as "rcFoodCount"
**And** track time duration of RC period
**And** calculate RC score rate = rcFoodCount / rcDurationSeconds

**Given** player completes a full game session
**When** calculating cognitiveFlexibility metric
**Then** calculate normal score rate = (totalFoodEaten - rcFoodCount) / normalPlayDurationSeconds
**And** compute cognitiveFlexibility = rcScoreRate / normalScoreRate
**And** clamp value between 0.0 and 2.0 (performance ratio)

**Given** player never encounters Reverse Controls in a session
**When** calculating cognitiveFlexibility
**Then** use previous session's value or default to 1.0 (neutral)
**And** flag metric as "insufficient data" for that session

**Formula (per FR153):**
```javascript
cognitiveFlexibility = (RC_score_rate) / (normal_score_rate)
// Closer to 1.0 = stronger flexibility. < 0.5 = significant RC impact. > 1.0 = thrives under RC
```

---

### Story 13.5: Implement Divided Attention Metric Calculation

**As a** player,
**I want** the game to measure how well I manage phone calls during gameplay,
**So that** I can see my context-switching and divided attention skill.

**Acceptance Criteria:**

**Given** a phone call occurs during gameplay
**When** player responds (End or Pick Up)
**Then** track decision time (ms from call appearance to button press)
**And** track survival: did player die during Pick Up countdown? (boolean)
**And** record in rawEvents: { type: 'phone_call', decisionTime, survived, decision }

**Given** multiple phone calls occur in a session
**When** calculating dividedAttention metric
**Then** calculate survival rate = (calls survived / total calls)
**And** calculate avg decision speed = average(decisionTimes)
**And** compute composite score:
```javascript
dividedAttention = (survivalRate × 0.7) + ((1 - normalizedDecisionSpeed) × 0.3)
// 70% weight on survival, 30% on decision speed
// normalizedDecisionSpeed = avgDecisionTime / 3000ms (3s = max reasonable decision time)
```
**And** clamp final value between 0.0 and 1.0

**Formula (per FR154):**
```javascript
dividedAttention = (survival_rate × 0.7) + ((1 - decision_speed_normalized) × 0.3)
// Higher = better. Measures both survival under distraction and decision efficiency
```

---

### Story 13.6: Implement Impulse Control Metric Calculation

**As a** player,
**I want** the game to measure my risk-taking decisions with phone calls,
**So that** I can see my impulse control and strategic decision-making.

**Acceptance Criteria:**

**Given** a phone call occurs during gameplay
**When** player makes a decision (End or Pick Up)
**Then** record decision context:
```javascript
{
  decision: 'end' | 'pickup',
  context: {
    inComboMode: boolean,
    currentScore: number,
    pickupBonus: number,     // Fibonacci value
    blinkingFoodActive: boolean,
    snakeLength: number
  }
}
```

**Given** multiple phone calls with varying contexts
**When** calculating impulseControl metric
**Then** compute weighted decision score:
- Pick Up during combo mode = high impulse control (+2 weight)
- Pick Up at high score (80+) = medium control (+1.5 weight)
- Pick Up with blinking food = medium control (+1.5 weight)
- End during low stakes (score < 20, no combo) = neutral (0 weight)
- Pick Up at low stakes = low control (-1 weight)
**And** normalize final score to 0.0-1.0 range

**Formula (per FR155):**
```javascript
impulseControl = weighted_pickup_decisions / total_phone_calls
// Higher = better. Measures strategic risk-taking vs. impulsive grabbing
```

---

### Story 13.7: Implement Working Memory Metric Calculation

**As a** player,
**I want** the game to measure my performance during combo mode,
**So that** I can see my working memory and multitasking capability.

**Acceptance Criteria:**

**Given** combo mode activates
**When** player is in combo state
**Then** track all food consumed during combo as "comboFoodCount"
**And** track combo duration in seconds
**And** calculate combo score rate = comboFoodCount / comboDurationSeconds

**Given** player completes a full game session
**When** calculating workingMemory metric
**Then** calculate normal score rate = (totalFoodEaten - comboFoodCount) / normalPlayDurationSeconds
**And** compute workingMemory = comboScoreRate / normalScoreRate
**And** clamp value between 0.0 and 3.0 (combo can be 3x normal rate due to multipliers)

**Given** player never enters combo mode in a session
**When** calculating workingMemory
**Then** use previous session's value or default to 1.0 (neutral)
**And** flag metric as "insufficient data" for that session

**Formula (per FR156):**
```javascript
workingMemory = (combo_score_rate) / (normal_score_rate)
// Higher = better. Measures ability to manage multiplicative scoring under cognitive load
```

---

### Story 13.8: Implement Rolling 10-Session Weighted Averages

**As a** player,
**I want** my metrics to reflect recent improvement,
**So that** I see responsive progress tracking, not just all-time averages.

**Acceptance Criteria:**

**Given** a new session completes
**When** storing metrics to IndexedDB
**Then** query previous 9 sessions (chronologically)
**And** compute rolling average for each metric with recency weighting:
```javascript
weights = [0.2, 0.18, 0.16, 0.14, 0.12, 0.10, 0.06, 0.03, 0.01] // most recent → oldest
rollingAvg = sum(sessionMetrics[i] × weights[i]) / sum(weights)
```
**And** store both raw session metric and rolling average

**Given** fewer than 10 sessions exist
**When** calculating rolling average
**Then** use all available sessions with proportional weights
**And** normalize weights to sum to 1.0

**Given** rolling average is displayed in Skill Map
**When** player views their profile
**Then** show the weighted rolling average (not raw single-session value)
**And** use rolling average for strongest/growth area determinations

**Per FR159:** Rolling averages weighted toward recent 10 sessions for responsive metrics that reflect improvement

---

### Story 13.9: Implement Storage Persistence and Retrieval

**As a** player,
**I want** my cognitive data to persist across browser sessions,
**So that** my progress is never lost.

**Acceptance Criteria:**

**Given** a game session completes
**When** metrics are calculated
**Then** save session object to IndexedDB "sessions" object store
**And** operation completes within 200ms (per NFR55)
**And** no gameplay interruption occurs during save

**Given** player reopens the game
**When** Skill Map is accessed
**Then** query IndexedDB for all sessions (or last 100 for performance)
**And** retrieve sessions in < 500ms (per NFR52)
**And** calculate current rolling averages for all 6 metrics

**Given** IndexedDB storage exceeds 4.5MB (approaching 5MB limit)
**When** new session is stored
**Then** delete oldest sessions beyond 100 total
**And** maintain chronological order via timestamp index

**Given** browser is in private browsing mode
**When** IndexedDB write fails
**Then** catch error gracefully
**And** display "Private browsing: metrics not saved" in Skill Map
**And** current session metrics still available until page refresh

**Per NFR56-NFR58:** localStorage/IndexedDB stores minimum 100 sessions, < 5MB total, persists across restarts

---

### Story 13.10: Create metrics.js Module with Event Capture

**As a** developer,
**I want** a centralized metrics.js module that captures gameplay events,
**So that** all cognitive calculations happen in one testable module.

**Acceptance Criteria:**

**Given** the game initializes
**When** metrics.js loads
**Then** expose public API:
```javascript
metrics.startSession(sessionId)
metrics.recordEvent({ type, timestamp, ...data })
metrics.endSession(finalScore) → returns calculated metrics object
metrics.getSessionHistory(limit) → returns array of past sessions
metrics.getRollingAverages() → returns current rolling averages for 6 metrics
```

**Given** gameplay events occur (food eaten, phone call, RC, combo)
**When** game.js fires events
**Then** metrics.recordEvent() appends to rawEvents array
**And** no performance impact (< 1ms per event)
**And** events queued in memory until session ends

**Given** session ends (game over)
**When** metrics.endSession() is called
**Then** calculate all 6 metrics from rawEvents array
**And** save session to IndexedDB via storage.js
**And** clear in-memory rawEvents buffer
**And** return metrics object for immediate use (post-game highlights)

**Given** metrics.js unit tests run
**When** deterministic rawEvents are provided
**Then** calculated metrics match expected values within ±1% (per NFR45)
**And** identical input produces identical output (deterministic formulas)

**Per NFR43-NFR44:** Dashboard metric calculations unit testable in isolation, cognitive data engine separable from UI rendering

---

### Story 13.11: Test Metrics Accuracy and Edge Cases

**As a** developer,
**I want** comprehensive tests for all 6 metric calculations,
**So that** players trust the cognitive data is accurate.

**Acceptance Criteria:**

**Given** unit tests for reactionTime metric
**When** rawEvents contains only normal gameplay food consumption
**Then** reactionTime = average of valid response times (outliers removed)
**And** test cases cover: fast reactions (100ms), slow reactions (1000ms), outlier handling

**Given** unit tests for spatialAwareness metric
**When** snake dies at various lengths
**Then** spatialAwareness accurately reflects snake length / grid coverage ratio
**And** test cases cover: short snake (length 10), medium (50), long (100)

**Given** unit tests for cognitiveFlexibility metric
**When** rawEvents includes RC periods
**Then** cognitiveFlexibility = RC score rate / normal score rate
**And** test cases cover: no RC (default 1.0), RC performance better (> 1.0), RC performance worse (< 1.0)

**Given** unit tests for dividedAttention metric
**When** rawEvents includes phone calls with survival/death outcomes
**Then** dividedAttention composite score = (survival_rate × 0.7) + (decision_speed × 0.3)
**And** test cases cover: all survived, all died, mixed, fast decisions, slow decisions

**Given** unit tests for impulseControl metric
**When** rawEvents includes phone decisions with varying contexts
**Then** impulseControl accurately weights strategic vs. impulsive decisions
**And** test cases cover: combo mode Pick Up, low stakes End, high score Pick Up

**Given** unit tests for workingMemory metric
**When** rawEvents includes combo mode periods
**Then** workingMemory = combo score rate / normal score rate
**And** test cases cover: no combo (default 1.0), high combo performance (> 2.0), low combo performance

**Given** edge case: player completes session with zero food eaten
**When** metrics.endSession() is called
**Then** all metrics default to 0 or neutral values
**And** no division-by-zero errors occur

**Per NFR45-NFR46:** Cognitive metric calculations produce consistent results for identical gameplay sessions, data collection captures 100% of relevant events

---
