// CrazySnakeLite - Skill Map Dashboard Module
// Story 16.1: Dashboard skeleton (rendering logic filled in 16.2-16.8)
// Story 16.9: Performance optimizations (DOM caching, batching, cleanup)
// Story 17.5: Streak display integration
// Story 18.4: Comedy.js integration for rotating quotes
import { getProfile, getStreak } from './storage.js';
import { CONFIG } from './config.js';
import { selectQuote } from './comedy.js';

// Story 16.9: Cached DOM references for performance
let barsContainer, calloutsContainer, statsContainer, quoteContainer;

/**
 * Initialize dashboard DOM cache
 * Story 16.9: Cache container references for fast access
 * Call once on app load to avoid repeated querySelector calls
 */
export function initDashboard() {
  barsContainer = document.getElementById('skill-map-bars-container');
  calloutsContainer = document.getElementById('skill-map-callouts');
  statsContainer = document.getElementById('skill-map-stats');
  quoteContainer = document.getElementById('skill-map-quote');

  console.log('[Story 16.9] Dashboard DOM cache initialized');
}

/**
 * Render the Skill Map screen.
 * Shows either calibration placeholder or full skill map based on profile state.
 * Story 16.1: Foundation rendering logic
 * Story 16.2-16.8: Full dashboard implementation
 */
export async function renderSkillMap() {
  const profile = await getProfile();

  // Validate profile has required data for full skill map
  const hasRequiredData = profile?.domainScores &&
                          profile?.sessionsCompleted !== undefined &&
                          profile?.currentStreak !== undefined;

  if (!profile || !profile.calibrationComplete || !hasRequiredData) {
    renderCalibrationPlaceholder(profile);
  } else {
    renderFullSkillMap(profile);
  }
}

/**
 * Render calibration placeholder screen.
 * Shown during sessions 1-5 before Skill Map is unlocked.
 * Story 16.1: Basic placeholder implementation
 * Story 16.2: Enhanced with empty block bars
 * @param {Object} profile - User profile data (may be null)
 */
function renderCalibrationPlaceholder(profile) {
  const barsContainer = document.getElementById('skill-map-bars-container');
  const calloutsContainer = document.getElementById('skill-map-callouts');
  const statsContainer = document.getElementById('skill-map-stats');

  // Story 16.2: Render empty block bars (all 5 blocks empty)
  barsContainer.innerHTML = '';

  const domains = [
    { key: 'decisionSpeed', label: 'Decision' },
    { key: 'spatialAwareness', label: 'Spatial' },
    { key: 'cognitiveFlexibility', label: 'Flexibility' },
    { key: 'dividedAttention', label: 'Attention' },
    { key: 'impulseControl', label: 'Impulse' },
    { key: 'workingMemory', label: 'Memory' }
  ];

  domains.forEach(domain => {
    const row = createBlockBarRow(domain.label, 0, {}, domain.key);  // 0 = all blocks empty
    barsContainer.appendChild(row);
  });

  // Calibration message (below bars)
  const sessionCount = profile?.sessionsCompleted || 0;
  calloutsContainer.innerHTML = `
    <p class="calibration-message">
      Warming up...<br>
      Session ${sessionCount}/5
    </p>
  `;

  // Story 16.4: Show session count during calibration (no streak until unlocked)
  statsContainer.innerHTML = `
    <div class="session-stats-row">
      <span class="session-count">Sessions: ${sessionCount}</span>
    </div>
  `;

  console.log('[Story 16.4] Calibration placeholder rendered - empty bars + session count:', sessionCount);
}

/**
 * Render full Skill Map dashboard with metrics.
 * Shown after calibration is complete (session 5+).
 * Story 16.1: Stub implementation
 * Story 16.2: Render pixel block bars
 * Story 16.3: Render callout cards (strongest domain, growth area)
 * Story 16.4: Render session count + streak
 * Story 16.5: Render rotating caller quote
 * Story 16.9: Performance optimization - DOM caching + batching
 * @param {Object} profile - User profile data
 */
function renderFullSkillMap(profile) {
  const { domainScores, previousDomainScores, sessionsCompleted, currentStreak } = profile;
  const totalSessions = sessionsCompleted || 0;  // Use sessionsCompleted as totalSessions

  // Story 16.9: Clear all containers (use cached references)
  barsContainer.innerHTML = '';
  calloutsContainer.innerHTML = '';
  statsContainer.innerHTML = '';
  quoteContainer.innerHTML = '';

  // Story 16.9: Pre-calculate all data (avoid redundant calls)
  const strongestDomain = determineStrongestDomain(domainScores);
  const growthArea = determineGrowthArea(domainScores);
  const improvedDomains = calculateImprovementIndicators(domainScores, previousDomainScores);
  const quote = selectDashboardQuote(profile);

  // Story 16.9: Batch render all 6 rows using DocumentFragment (single reflow)
  const barFragment = document.createDocumentFragment();
  const domains = [
    { key: 'decisionSpeed', label: 'Decision' },
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
    const row = createBlockBarRow(domain.label, blockScore, indicators, domain.key);
    barFragment.appendChild(row);
  });

  barsContainer.appendChild(barFragment);  // Story 16.9: Single DOM update (performance)

  console.log('[Story 16.3] Full Skill Map rendered with block bars and indicators');
  console.log('[Story 16.3] Strongest:', strongestDomain, '| Growth:', growthArea, '| Improved:', Array.from(improvedDomains));

  // Render other sections
  renderCalloutCards(strongestDomain, growthArea);
  renderSessionStats(totalSessions, currentStreak);
  renderQuote(quote);

  // Store quote text in profile for next-visit variety enforcement
  import('./storage.js').then(storage => {
    storage.updateProfile({ lastQuote: quote.text });
  });
}

/**
 * Create a single block bar row with optional indicators
 * Story 16.2: Core visualization component
 * Story 16.3: Added indicators support (★, ↑, ▲)
 * V2 Redesign 2026-02-18: Domain color system, left indicator slot, split rating
 * @param {string} label - Domain name (abbreviated)
 * @param {number} blockScore - Rating on 0-5 scale with 0.1 precision
 * @param {Object} indicators - { star: bool, growthArrow: bool, improvedArrow: bool }
 * @param {string} domainKey - e.g. 'decisionSpeed' — used to apply domain CSS color class
 * @returns {HTMLElement} - The row DOM element
 */
function createBlockBarRow(label, blockScore, indicators = {}, domainKey = '') {
  const row = document.createElement('div');
  row.className = 'block-bar-row';

  // Apply domain color CSS class
  const cssKeyMap = {
    decisionSpeed: 'decision',
    spatialAwareness: 'spatial',
    cognitiveFlexibility: 'flexibility',
    dividedAttention: 'attention',
    impulseControl: 'impulse',
    workingMemory: 'memory'
  };
  const cssKey = cssKeyMap[domainKey];
  if (cssKey) row.classList.add(`domain-${cssKey}`);

  // LEFT: Indicator slot (★ or ↑) — fixed width, anchors left column
  const indicatorSlot = document.createElement('span');
  indicatorSlot.className = 'indicator-slot';
  if (indicators.star) {
    indicatorSlot.textContent = '★';
    indicatorSlot.classList.add('has-star');
  } else if (indicators.growthArrow) {
    indicatorSlot.textContent = '↑';
    indicatorSlot.classList.add('has-growth');
  }
  row.appendChild(indicatorSlot);

  // Domain label
  const labelEl = document.createElement('span');
  labelEl.className = 'domain-label';
  labelEl.textContent = label;
  row.appendChild(labelEl);

  // Block container (5 blocks with partial fills)
  const blocksContainer = document.createElement('div');
  blocksContainer.className = 'blocks-container';

  for (let i = 0; i < 5; i++) {
    const blockValue = i + 1;
    const block = document.createElement('div');

    if (blockScore >= blockValue) {
      block.className = 'block filled';
    } else if (blockScore > i && blockScore < blockValue) {
      const fillPercentage = (blockScore - i) * 100;
      block.className = 'block partial';
      const fill = document.createElement('div');
      fill.className = 'block-fill';
      fill.style.width = `${fillPercentage}%`;
      block.appendChild(fill);
    } else {
      block.className = 'block empty';
    }

    blocksContainer.appendChild(block);
  }

  row.appendChild(blocksContainer);

  // Rating number (domain color) + suffix "/5" (muted) — split for separate styling
  const ratingNumber = document.createElement('span');
  ratingNumber.className = 'rating-number';
  ratingNumber.textContent = blockScore.toFixed(1);
  row.appendChild(ratingNumber);

  const ratingSuffix = document.createElement('span');
  ratingSuffix.className = 'rating-suffix';
  ratingSuffix.textContent = '/5';
  row.appendChild(ratingSuffix);

  // RIGHT: Improved arrow (▲) only — ★ and ↑ moved to left slot
  const indicatorsContainer = document.createElement('span');
  indicatorsContainer.className = 'indicators';

  if (indicators.improvedArrow) {
    const arrow = document.createElement('span');
    arrow.className = 'indicator improved-arrow';
    arrow.textContent = '▲';
    indicatorsContainer.appendChild(arrow);
  }

  row.appendChild(indicatorsContainer);

  return row;
}

/**
 * Render session count and streak as stat chips
 * Story 16.4: Session stats with milestone detection
 * V2 Redesign 2026-02-18: Pill chip design replacing plain text row
 * @param {number} totalSessions - Total games played (includes calibration)
 * @param {number} currentStreak - Current streak in days
 */
function renderSessionStats(totalSessions, currentStreak) {
  // Story 17.5: Get full streak data including longestStreak
  const streak = getStreak();

  const statsContainer = document.getElementById('skill-map-stats');
  statsContainer.innerHTML = '';

  const chipsRow = document.createElement('div');
  chipsRow.className = 'session-stats-row';

  // Sessions chip
  const sessionsChip = document.createElement('div');
  sessionsChip.className = 'stat-chip sessions';
  sessionsChip.textContent = `${totalSessions} SESSIONS`;
  chipsRow.appendChild(sessionsChip);

  // Streak chip
  const isMilestone = CONFIG.DASHBOARD.STREAK_MILESTONES.includes(currentStreak);
  const streakChip = document.createElement('div');
  streakChip.className = 'stat-chip streak';
  const dayLabel = currentStreak === 1 ? 'DAY' : 'DAYS';
  streakChip.textContent = `STREAK: ${currentStreak} ${dayLabel} 🔥`;
  if (isMilestone) streakChip.classList.add('milestone');
  chipsRow.appendChild(streakChip);

  // Best streak chip (only if different from current and > 0)
  if (streak.longestStreak > currentStreak && streak.longestStreak > 0) {
    const bestChip = document.createElement('div');
    bestChip.className = 'stat-chip best';
    const bestLabel = streak.longestStreak === 1 ? 'DAY' : 'DAYS';
    bestChip.textContent = `BEST: ${streak.longestStreak} ${bestLabel}`;
    chipsRow.appendChild(bestChip);
  }

  statsContainer.appendChild(chipsRow);

  console.log('[Story 16.4/17.5] Session stats rendered:', { totalSessions, currentStreak, longestStreak: streak.longestStreak, isMilestone });
}

/**
 * Select a dashboard quote based on current profile state
 * Story 18.4: Replaced old system with comedy.js integration
 * Uses comedy.js for quote selection with sessionStorage deduplication
 * @param {Object} profile - Player profile from storage
 * @returns {Object} - { text, caller, portrait }
 */
function selectDashboardQuote(profile) {
  const totalSessions = profile.sessionsCompleted || 0;
  const { currentStreak } = profile;

  // Build context tags for quote selection
  const context = ['general'];  // Always include general as fallback

  // Add milestone contexts
  if (currentStreak === 7) context.push('streak_milestone_7');
  if (currentStreak === 30) context.push('streak_milestone_30');
  if (currentStreak > 0) context.push('streak_active');

  if (totalSessions === 50) context.push('session_50');
  if (totalSessions === 100) context.push('session_100');

  // Get last Skill Map quote ID (separate from post-game)
  const lastQuoteId = sessionStorage.getItem('lastSkillMapQuoteId');

  // Select quote using comedy.js with deduplication
  const selectedQuote = selectQuote(context, lastQuoteId);

  // Store quote ID for next visit
  sessionStorage.setItem('lastSkillMapQuoteId', selectedQuote.id);

  // Map to expected format
  const quote = {
    text: selectedQuote.text,
    caller: selectedQuote.callerName,
    portrait: selectedQuote.portrait
  };

  console.log('[Story 18.4] Skill Map quote selected:', { context, text: quote.text, caller: quote.caller });
  return quote;
}

/**
 * Render caller quote with portrait and name
 * Story 16.5: Quote card below session stats
 * @param {Object} quote - { text, caller, portrait }
 */
function renderQuote(quote) {
  const quoteContainer = document.getElementById('skill-map-quote');
  quoteContainer.innerHTML = '';

  const quoteCard = document.createElement('div');
  quoteCard.className = 'quote-card';

  // Portrait column (left) — bigger portrait, narrower text col forces 2-3 line wrap
  const portraitCol = document.createElement('div');
  portraitCol.className = 'quote-portrait-col';

  const callerPortrait = document.createElement('img');
  callerPortrait.className = 'caller-portrait-small';
  callerPortrait.src = quote.portrait;
  callerPortrait.alt = quote.caller;
  callerPortrait.width = 100;
  callerPortrait.height = 100;
  portraitCol.appendChild(callerPortrait);
  quoteCard.appendChild(portraitCol);

  // Text column (right) — quote + attribution stacked
  const textCol = document.createElement('div');
  textCol.className = 'quote-text-col';

  const quoteText = document.createElement('p');
  quoteText.className = 'quote-text';
  quoteText.textContent = `"${quote.text}"`;
  textCol.appendChild(quoteText);

  const callerName = document.createElement('span');
  callerName.className = 'caller-name';
  callerName.textContent = `— ${quote.caller}`;
  textCol.appendChild(callerName);

  quoteCard.appendChild(textCol);
  quoteContainer.appendChild(quoteCard);

  console.log('[Story 16.5] Quote rendered');
}

/**
 * Render callout cards below block bars
 * Story 16.3: Top Skill and Level Up cards with domain-specific quotes
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

  console.log('[Story 16.3] Callout cards rendered');
}

/**
 * Determine strongest domain (highest block score)
 * Story 16.3: Used for Top Skill callout and ★ indicator
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
 * Story 16.3: Used for Level Up callout and ↑ indicator
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
 * Story 16.3: Used for ▲ indicator on improved domains
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

/**
 * Get full domain name from key
 * Story 16.3: Used for callout card titles
 * @param {string} key - Domain key (e.g., 'decisionSpeed')
 * @returns {string} - Full name (e.g., 'Decision Speed')
 */
function getDomainFullName(key) {
  const names = {
    decisionSpeed: 'Decision Speed',
    spatialAwareness: 'Spatial Awareness',
    cognitiveFlexibility: 'Flexibility',
    dividedAttention: 'Attention',
    impulseControl: 'Impulse Control',
    workingMemory: 'Working Memory'
  };
  return names[key] || key;
}

/**
 * Hide the Skill Map screen.
 * Called when navigating away from Skill Map.
 * Story 16.1: Basic hide functionality
 */
export function hideSkillMap() {
  const skillMapScreen = document.getElementById('skill-map-screen');
  if (skillMapScreen) {
    skillMapScreen.classList.add('hidden');
    console.log('[Story 16.1] Skill Map screen hidden');
  }
}

/**
 * Cleanup dashboard on phase exit
 * Story 16.9: Prevent memory leaks by clearing DOM content
 * Called when navigating away from Skill Map to any other phase
 */
export function cleanupDashboard() {
  // Clear DOM content (prevent memory leaks)
  if (barsContainer) barsContainer.innerHTML = '';
  if (calloutsContainer) calloutsContainer.innerHTML = '';
  if (statsContainer) statsContainer.innerHTML = '';
  if (quoteContainer) quoteContainer.innerHTML = '';

  console.log('[Story 16.9] Dashboard cleanup complete');
}
