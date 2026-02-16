// CrazySnakeLite - Cognitive Metrics Module (Story 13.2+)
// Pure calculation module - NO storage imports (per V3 module boundaries)

// ========================================
// CENTRALIZED METRICS API (Story 13.10)
// ========================================

// In-memory session state (for current session only)
let currentSessionId = null;
let currentRawEvents = [];

/**
 * Start a new metrics session
 * @param {string} sessionId - Unique session identifier
 */
export function startSession(sessionId) {
  currentSessionId = sessionId || crypto.randomUUID();
  currentRawEvents = [];
  return currentSessionId;
}

/**
 * Record a gameplay event
 * @param {Object} event - Event object with type, timestamp, and event-specific data
 */
export function recordEvent(event) {
  if (!currentSessionId) {
    console.warn('[Metrics] No active session. Call startSession() first.');
    return;
  }

  currentRawEvents.push({
    timestamp: Date.now(),
    ...event
  });
}

/**
 * End current session and calculate metrics
 * @param {number} finalScore - Final game score
 * @param {number} snakeLength - Final snake length
 * @param {number} gridWidth - Grid width
 * @param {number} gridHeight - Grid height
 * @param {number} gridUnitSize - Grid unit size
 * @returns {Object} Calculated metrics object
 */
export function endSession(finalScore, snakeLength, gridWidth, gridHeight, gridUnitSize) {
  if (!currentSessionId) {
    console.warn('[Metrics] No active session to end.');
    return null;
  }

  // Calculate all 6 metrics
  const metrics = {
    reactionTime: calculateReactionTime(currentRawEvents),
    spatialAwareness: calculateSpatialAwareness(snakeLength, gridWidth, gridHeight, gridUnitSize),
    cognitiveFlexibility: calculateCognitiveFlexibility(currentRawEvents),
    dividedAttention: calculateDividedAttention(currentRawEvents),
    impulseControl: calculateImpulseControl(currentRawEvents),
    workingMemory: calculateWorkingMemory(currentRawEvents)
  };

  // Build session object
  const sessionData = {
    sessionId: currentSessionId,
    timestamp: Date.now(),
    score: finalScore,
    metrics: metrics,
    rawEvents: currentRawEvents
  };

  // Clear in-memory buffer
  currentSessionId = null;
  currentRawEvents = [];

  return sessionData;
}

// ========================================
// REACTION TIME METRIC (Story 13.2)
// ========================================

/**
 * Calculate reaction time metric from rawEvents
 * @param {Array} rawEvents - Array of gameplay events
 * @returns {number} Normalized reaction time score (0-1, higher = better)
 */
export function calculateReactionTime(rawEvents) {
  // Extract food_eaten events with response times
  const responseTimes = rawEvents
    .filter(event =>
      event.type === 'food_eaten' &&
      event.responseTime !== undefined &&
      event.responseTime > 0 &&
      !event.duringRC &&        // Exclude Reverse Controls periods
      !event.duringPhone        // Exclude phone call periods
    )
    .map(event => event.responseTime);

  if (responseTimes.length === 0) {
    return 0.5; // Neutral score if no valid data
  }

  // Remove outliers (> 2 standard deviations above mean)
  const filteredTimes = removeOutliers(responseTimes);

  if (filteredTimes.length === 0) {
    return 0.5; // Neutral score if all data was outliers
  }

  // Calculate average response time
  const avgResponseTime = average(filteredTimes);

  // Normalize to 0-1 scale (lower time = higher score)
  // Typical range: 200-800ms
  // 200ms = 1.0 (excellent), 500ms = 0.5 (average), 800ms+ = 0.0 (slow)
  const normalized = normalize(avgResponseTime, 200, 800, true); // true = invert (lower is better)

  return normalized;
}

// ========================================
// SPATIAL AWARENESS METRIC (Story 13.3)
// ========================================

/**
 * Calculate spatial awareness metric from final game state
 * @param {number} snakeLength - Final snake length at death
 * @param {number} gridWidth - Grid width in cells
 * @param {number} gridHeight - Grid height in cells
 * @param {number} gridUnitSize - Size of each grid cell in pixels
 * @returns {number} Normalized spatial awareness score (0-1, higher = better)
 */
export function calculateSpatialAwareness(snakeLength, gridWidth, gridHeight, gridUnitSize) {
  if (snakeLength === 0) return 0.5; // Neutral score if no data

  // Calculate grid coverage percentage
  const snakeArea = snakeLength * (gridUnitSize ** 2);
  const totalGridArea = gridWidth * gridHeight;
  const gridCoveragePercentage = snakeArea / totalGridArea;

  // Spatial awareness = snake length / grid coverage ratio
  // Higher score = more efficient space usage (longer snake relative to grid coverage)
  const spatialAwareness = snakeLength / gridCoveragePercentage;

  // Normalize to 0-1 scale
  // Typical range: 100-1000 (arbitrary based on 25x20 grid)
  // 100 = poor space usage, 500 = average, 1000+ = excellent
  const normalized = normalize(spatialAwareness, 100, 1000, false); // false = higher is better

  return normalized;
}

// ========================================
// COGNITIVE FLEXIBILITY METRIC (Story 13.4)
// ========================================

/**
 * Calculate cognitive flexibility metric from rawEvents
 * @param {Array} rawEvents - Array of gameplay events
 * @returns {number} Normalized cognitive flexibility score (0-1, closer to 1 = better)
 */
export function calculateCognitiveFlexibility(rawEvents) {
  // Extract RC periods
  const rcPeriods = [];
  let currentRC = null;

  rawEvents.forEach(event => {
    if (event.type === 'rc_start') {
      currentRC = { start: event.timestamp, foodCount: 0 };
    } else if (event.type === 'rc_end' && currentRC) {
      currentRC.end = event.timestamp;
      currentRC.duration = (currentRC.end - currentRC.start) / 1000; // Convert to seconds
      rcPeriods.push(currentRC);
      currentRC = null;
    } else if (event.type === 'food_eaten' && event.duringRC && currentRC) {
      currentRC.foodCount++;
    }
  });

  // If no RC periods occurred, return neutral score
  if (rcPeriods.length === 0) {
    return 0.5; // Neutral - insufficient data
  }

  // Calculate RC score rate
  const totalRCFoodCount = rcPeriods.reduce((sum, period) => sum + period.foodCount, 0);
  const totalRCDuration = rcPeriods.reduce((sum, period) => sum + period.duration, 0);

  if (totalRCDuration === 0 || totalRCFoodCount === 0) {
    return 0.5; // Neutral if no food eaten during RC
  }

  const rcScoreRate = totalRCFoodCount / totalRCDuration;

  // Calculate normal score rate (food eaten outside RC)
  const normalFoodEvents = rawEvents.filter(e => e.type === 'food_eaten' && !e.duringRC);
  const normalFoodCount = normalFoodEvents.length;

  if (normalFoodCount === 0) {
    return 0.5; // Neutral if no normal food data
  }

  // Estimate normal play duration (first to last normal food event)
  const normalTimestamps = normalFoodEvents.map(e => e.timestamp);
  const normalDuration = (Math.max(...normalTimestamps) - Math.min(...normalTimestamps)) / 1000;

  if (normalDuration === 0) {
    return 0.5; // Neutral if duration can't be calculated
  }

  const normalScoreRate = normalFoodCount / normalDuration;

  // Calculate flexibility ratio
  const flexibility = rcScoreRate / normalScoreRate;

  // Clamp between 0.0 and 2.0, then normalize to 0-1 scale
  // 0.0 = terrible during RC (score 0), 1.0 = equal performance (score 0.5), 2.0 = excels during RC (score 1.0)
  const clamped = Math.max(0, Math.min(2.0, flexibility));
  const normalized = clamped / 2.0; // Map [0, 2] to [0, 1]

  return normalized;
}

// ========================================
// DIVIDED ATTENTION METRIC (Story 13.5)
// ========================================

/**
 * Calculate divided attention metric from rawEvents
 * @param {Array} rawEvents - Array of gameplay events
 * @returns {number} Normalized divided attention score (0-1, higher = better)
 */
export function calculateDividedAttention(rawEvents) {
  // Extract phone call events
  const phoneEvents = rawEvents.filter(e => e.type === 'phone_call');

  if (phoneEvents.length === 0) {
    return 0.5; // Neutral score if no phone calls
  }

  // Calculate survival rate
  const callsSurvived = phoneEvents.filter(e => e.survived !== false).length;
  const survivalRate = callsSurvived / phoneEvents.length;

  // Calculate average decision speed
  const decisionTimes = phoneEvents
    .filter(e => e.decisionTime !== undefined && e.decisionTime > 0)
    .map(e => e.decisionTime);

  if (decisionTimes.length === 0) {
    // No valid decision times - use survival rate only
    return survivalRate;
  }

  const avgDecisionTime = average(decisionTimes);

  // Normalize decision time (0-3000ms range, lower is better)
  // 0ms = instant (1.0), 3000ms = slow (0.0)
  const normalizedDecisionSpeed = Math.min(1.0, avgDecisionTime / 3000);

  // Composite score: 70% survival, 30% decision speed
  const composite = (survivalRate * 0.7) + ((1 - normalizedDecisionSpeed) * 0.3);

  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, composite));
}

// ========================================
// IMPULSE CONTROL METRIC (Story 13.6)
// ========================================

/**
 * Calculate impulse control metric from rawEvents
 * @param {Array} rawEvents - Array of gameplay events
 * @returns {number} Normalized impulse control score (0-1, higher = better)
 */
export function calculateImpulseControl(rawEvents) {
  // Extract phone call events with context
  const phoneEvents = rawEvents.filter(e => e.type === 'phone_call' && e.context);

  if (phoneEvents.length === 0) {
    return 0.5; // Neutral score if no phone calls
  }

  // Calculate weighted decision scores
  let totalWeight = 0;

  phoneEvents.forEach(event => {
    const { decision, context } = event;
    let weight = 0;

    if (decision === 'pickup') {
      // Pick Up decisions - assess strategic risk-taking
      if (context.inComboMode) {
        weight = 2.0; // High control - risky but strategic in combo
      } else if (context.currentScore >= 80) {
        weight = 1.5; // Medium control - risky at high score
      } else if (context.blinkingFoodActive) {
        weight = 1.5; // Medium control - managing multiple distractions
      } else if (context.currentScore < 20) {
        weight = -1.0; // Low control - impulsive at low stakes
      } else {
        weight = 0.5; // Neutral - moderate risk
      }
    } else if (decision === 'end') {
      // End decisions - assess caution
      if (context.currentScore < 20 && !context.inComboMode) {
        weight = 0; // Neutral - safe choice at low stakes
      } else if (context.inComboMode) {
        weight = -0.5; // Slight negative - missed opportunity during combo
      } else {
        weight = 1.0; // Positive - prudent decision at higher stakes
      }
    }

    totalWeight += weight;
  });

  // Normalize to 0-1 scale
  // Theoretical range: -phoneEvents.length (all impulsive) to +2*phoneEvents.length (all strategic)
  const maxWeight = phoneEvents.length * 2;
  const minWeight = -phoneEvents.length;

  const normalized = (totalWeight - minWeight) / (maxWeight - minWeight);

  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, normalized));
}

// ========================================
// WORKING MEMORY METRIC (Story 13.7)
// ========================================

/**
 * Calculate working memory metric from rawEvents
 * @param {Array} rawEvents - Array of gameplay events
 * @returns {number} Normalized working memory score (0-1, higher = better)
 */
export function calculateWorkingMemory(rawEvents) {
  // Extract combo periods
  const comboPeriods = [];
  let currentCombo = null;

  rawEvents.forEach(event => {
    if (event.type === 'combo_start') {
      currentCombo = { start: event.timestamp, foodCount: 0 };
    } else if (event.type === 'combo_end' && currentCombo) {
      currentCombo.end = event.timestamp;
      currentCombo.duration = (currentCombo.end - currentCombo.start) / 1000; // Convert to seconds
      comboPeriods.push(currentCombo);
      currentCombo = null;
    } else if (event.type === 'food_eaten' && event.duringCombo && currentCombo) {
      currentCombo.foodCount++;
    }
  });

  // If no combo periods occurred, return neutral score
  if (comboPeriods.length === 0) {
    return 0.5; // Neutral - insufficient data
  }

  // Calculate combo score rate
  const totalComboFoodCount = comboPeriods.reduce((sum, period) => sum + period.foodCount, 0);
  const totalComboDuration = comboPeriods.reduce((sum, period) => sum + period.duration, 0);

  if (totalComboDuration === 0 || totalComboFoodCount === 0) {
    return 0.5; // Neutral if no food eaten during combo
  }

  const comboScoreRate = totalComboFoodCount / totalComboDuration;

  // Calculate normal score rate (food eaten outside combo)
  const normalFoodEvents = rawEvents.filter(e => e.type === 'food_eaten' && !e.duringCombo);
  const normalFoodCount = normalFoodEvents.length;

  if (normalFoodCount === 0) {
    return 0.5; // Neutral if no normal food data
  }

  // Estimate normal play duration (first to last normal food event)
  const normalTimestamps = normalFoodEvents.map(e => e.timestamp);
  const normalDuration = (Math.max(...normalTimestamps) - Math.min(...normalTimestamps)) / 1000;

  if (normalDuration === 0) {
    return 0.5; // Neutral if duration can't be calculated
  }

  const normalScoreRate = normalFoodCount / normalDuration;

  // Calculate working memory ratio
  const workingMemory = comboScoreRate / normalScoreRate;

  // Clamp between 0.0 and 3.0 (combo can be 3x due to multipliers), then normalize to 0-1 scale
  // 0.0 = terrible during combo (score 0), 1.0 = equal (score 0.33), 3.0 = excels (score 1.0)
  const clamped = Math.max(0, Math.min(3.0, workingMemory));
  const normalized = clamped / 3.0; // Map [0, 3] to [0, 1]

  return normalized;
}

// ========================================
// ROLLING AVERAGES (Story 13.8)
// ========================================

// Recency weights for rolling 10-session average (most recent → oldest)
const ROLLING_WEIGHTS = [0.2, 0.18, 0.16, 0.14, 0.12, 0.10, 0.06, 0.03, 0.01, 0.01];

/**
 * Calculate rolling weighted averages for all metrics
 * @param {Object} currentSessionMetrics - Metrics for current session
 * @param {Array} previousSessions - Array of previous session objects (newest first)
 * @returns {Object} Rolling averages for all 6 metrics
 */
export function calculateRollingAverages(currentSessionMetrics, previousSessions = []) {
  const metricKeys = ['reactionTime', 'spatialAwareness', 'cognitiveFlexibility', 'dividedAttention', 'impulseControl', 'workingMemory'];
  const rollingAverages = {};

  metricKeys.forEach(key => {
    // Build array: [current, ...previous] (newest first)
    const sessionValues = [currentSessionMetrics[key]];

    previousSessions.slice(0, 9).forEach(session => {
      if (session.metrics && session.metrics[key] !== undefined) {
        sessionValues.push(session.metrics[key]);
      }
    });

    // Calculate weighted average
    const numSessions = sessionValues.length;
    const weights = ROLLING_WEIGHTS.slice(0, numSessions);

    // Normalize weights to sum to 1.0
    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    const normalizedWeights = weights.map(w => w / weightSum);

    // Compute weighted average
    const weightedSum = sessionValues.reduce((sum, value, i) => sum + (value * normalizedWeights[i]), 0);

    rollingAverages[key] = weightedSum;
  });

  return rollingAverages;
}

/**
 * Calculate baseline metrics from calibration sessions (first 5 sessions).
 * Story 15.6: Establishes stable baseline for improvement tracking.
 *
 * Simple average of first 5 sessions (no recency weighting for baseline).
 * Null propagation: null means "not applicable" (e.g., never encountered RC food).
 * If all sessions have null for a metric, baseline is null (insufficient data).
 *
 * @param {Array<Object>} sessions - Array of session objects (first 5 sessions)
 * @returns {Object} Baseline metrics for all 6 domains
 */
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
      const val = session.metrics?.[domain];
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

// ========================================
// HELPER FUNCTIONS (Statistical)
// ========================================

/**
 * Calculate average of an array
 * @param {Array<number>} values
 * @returns {number}
 */
function average(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate standard deviation
 * @param {Array<number>} values
 * @returns {number}
 */
function standardDeviation(values) {
  if (values.length === 0) return 0;
  const avg = average(values);
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  const variance = average(squaredDiffs);
  return Math.sqrt(variance);
}

/**
 * Remove outliers beyond 2 standard deviations above mean
 * @param {Array<number>} values
 * @returns {Array<number>} Filtered values
 */
function removeOutliers(values) {
  if (values.length < 3) return values; // Need at least 3 data points

  const mean = average(values);
  const stdDev = standardDeviation(values);
  const threshold = mean + (2 * stdDev);

  return values.filter(val => val <= threshold);
}

/**
 * Normalize value to 0-1 scale
 * @param {number} value - Value to normalize
 * @param {number} min - Minimum expected value (maps to 1.0 if inverted, 0.0 if not)
 * @param {number} max - Maximum expected value (maps to 0.0 if inverted, 1.0 if not)
 * @param {boolean} invert - True if lower values are better (reaction time)
 * @returns {number} Normalized score 0-1
 */
function normalize(value, min, max, invert = false) {
  // Clamp value within range
  const clamped = Math.max(min, Math.min(max, value));

  // Linear normalization
  const normalized = (clamped - min) / (max - min);

  // Invert if lower is better
  return invert ? 1 - normalized : normalized;
}

// ========================================
// EXPORT HELPERS FOR TESTING
// ========================================

export { average, standardDeviation, removeOutliers, normalize };
