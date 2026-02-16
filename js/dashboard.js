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

  if (!profile || !profile.calibrationComplete) {
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
    'Reaction', 'Spatial', 'Flexibility',
    'Attention', 'Impulse', 'Memory'
  ];

  domains.forEach(label => {
    const row = createBlockBarRow(label, 0);  // 0 = all blocks empty
    barsContainer.appendChild(row);
  });

  // Calibration message (below bars)
  const sessionCount = profile?.totalSessions || 0;
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
  const { domainScores, previousDomainScores, totalSessions, currentStreak } = profile;

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
 * @param {string} label - Domain name (abbreviated)
 * @param {number} blockScore - Rating on 0-5 scale (from metrics.js toBlockScale)
 * @param {Object} indicators - { star: bool, growthArrow: bool, improvedArrow: bool }
 * @returns {HTMLElement} - The row DOM element
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

  // Rating text (e.g., "4/5")
  const ratingText = document.createElement('span');
  ratingText.className = 'rating-text';
  ratingText.textContent = `${blockScore}/5`;
  row.appendChild(ratingText);

  // Indicators (Story 16.3)
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

/**
 * Render session count and streak below callouts
 * Story 16.4: Session stats with milestone detection
 * @param {number} totalSessions - Total games played (includes calibration)
 * @param {number} currentStreak - Current streak in days
 */
function renderSessionStats(totalSessions, currentStreak) {
  // Story 17.5: Get full streak data including longestStreak
  const streak = getStreak();

  const statsContainer = document.getElementById('skill-map-stats');
  statsContainer.innerHTML = '';

  const statsRow = document.createElement('div');
  statsRow.className = 'session-stats-row';

  // Session count
  const sessionsEl = document.createElement('span');
  sessionsEl.className = 'session-count';
  sessionsEl.textContent = `Sessions: ${totalSessions}`;
  sessionsEl.style.color = '#AAAAAA';
  sessionsEl.style.fontSize = '12px';
  sessionsEl.style.fontFamily = 'Jersey20';
  statsRow.appendChild(sessionsEl);

  // Spacing (5 spaces)
  const spacer = document.createElement('span');
  spacer.textContent = '     ';
  statsRow.appendChild(spacer);

  // Streak
  const streakEl = document.createElement('span');
  streakEl.className = 'streak-count';

  // Story 17.5: Use CONFIG.DASHBOARD.STREAK_MILESTONES
  const isMilestone = CONFIG.DASHBOARD.STREAK_MILESTONES.includes(currentStreak);

  const dayLabel = currentStreak === 1 ? 'day' : 'days';
  streakEl.textContent = `Streak: ${currentStreak} ${dayLabel} 🔥`;
  streakEl.style.color = '#AAAAAA';
  streakEl.style.fontSize = '12px';
  streakEl.style.fontFamily = 'Jersey20';

  if (isMilestone) {
    streakEl.classList.add('milestone');
  }

  statsRow.appendChild(streakEl);

  // Story 17.5: Longest streak (if different from current and > 0)
  if (streak.longestStreak > currentStreak && streak.longestStreak > 0) {
    const longestEl = document.createElement('span');
    longestEl.className = 'longest-streak';
    longestEl.textContent = ` / Longest: ${streak.longestStreak} ${streak.longestStreak === 1 ? 'day' : 'days'}`;
    longestEl.style.color = '#FFD700'; // Gold (celebrate peak)
    longestEl.style.fontSize = '10px';
    longestEl.style.fontFamily = 'Jersey20';
    longestEl.style.marginLeft = '8px';
    statsRow.appendChild(longestEl);
  }

  statsContainer.appendChild(statsRow);

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
  const { totalSessions, currentStreak } = profile;

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

  // Quote text
  const quoteText = document.createElement('p');
  quoteText.className = 'quote-text';
  quoteText.textContent = `"${quote.text}"`;
  quoteCard.appendChild(quoteText);

  // Caller attribution (portrait + name)
  const callerAttribution = document.createElement('div');
  callerAttribution.className = 'caller-attribution';

  const callerPortrait = document.createElement('img');
  callerPortrait.className = 'caller-portrait-small';
  callerPortrait.src = quote.portrait;
  callerPortrait.alt = quote.caller;
  callerPortrait.width = 32;
  callerPortrait.height = 32;
  callerAttribution.appendChild(callerPortrait);

  const callerName = document.createElement('span');
  callerName.className = 'caller-name';
  callerName.textContent = `— ${quote.caller}`;
  callerAttribution.appendChild(callerName);

  quoteCard.appendChild(callerAttribution);

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
 * @param {string} key - Domain key (e.g., 'reactionTime')
 * @returns {string} - Full name (e.g., 'Reaction Time')
 */
function getDomainFullName(key) {
  const names = {
    reactionTime: 'Reaction Time',
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
