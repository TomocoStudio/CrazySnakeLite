/**
 * Comedy Module - Caller Quote Database with Performance Context
 * Story 18.1: Tech pun caller quotes for post-game highlights and Skill Map dashboard
 *
 * Module provides:
 * - CALLER_QUOTES: Database of 21 callers with 3+ contextual quotes each
 * - selectQuote(): Context-based quote selection with relevance scoring
 * - getAvailableContexts(): Helper to list all available context tags
 *
 * Context Tags:
 * - Performance: high_score, low_score, personal_best, improvement
 * - Cognitive: rc_survived, death_during_rc, combo_master, phone_ace
 * - Milestones: calibration_complete, streak_milestone_7, streak_milestone_30, session_50, session_100
 * - General: general, encouragement, celebration
 */

/**
 * Caller Quote Database
 * Maps all 21 callers from phone.js with performance-contextual quotes
 * Each quote has unique ID, text (< 80 chars), and 1+ context tags
 */
export const CALLER_QUOTES = [
  {
    callerId: 'al-gorithm',
    name: 'Al Gorithm',
    portrait: 'assets/pictures/01_AlGorithm.png',
    quotes: [
      { id: 'al-gorithm-high-score-1', text: 'Your sorting algorithm is on point. High score achieved!', context: ['high_score', 'personal_best'] },
      { id: 'al-gorithm-general-1', text: 'Have you tried sorting your priorities? Just checking.', context: ['general', 'encouragement'] },
      { id: 'al-gorithm-rc-1', text: 'Reverse Controls survived? Your algorithms adapt well.', context: ['rc_survived'] },
      { id: 'al-gorithm-calibration-1', text: 'Five sessions sorted. Your brain map just compiled!', context: ['calibration_complete', 'celebration'] }
    ]
  },
  {
    callerId: 'meg-a-byte',
    name: 'Meg A. Byte',
    portrait: 'assets/pictures/02_MegaByte.png',
    quotes: [
      { id: 'meg-a-byte-calibration-1', text: 'Five sessions in and your neurons are filing pull requests!', context: ['calibration_complete', 'celebration'] },
      { id: 'meg-a-byte-general-1', text: "I'm running out of space for compliments. You're crushing it!", context: ['general', 'encouragement'] },
      { id: 'meg-a-byte-combo-1', text: 'Combo mode? You just multiplied your brainpower.', context: ['combo_master', 'celebration'] }
    ]
  },
  {
    callerId: 'ali-sing',
    name: 'Ali Sing',
    portrait: 'assets/pictures/03_AliSing.png',
    quotes: [
      { id: 'ali-sing-streak-1', text: 'Seven days straight? Stop giving me mixed signals!', context: ['streak_milestone_7'] },
      { id: 'ali-sing-general-1', text: "I'm picking up on your brain waves. Looking strong!", context: ['general'] },
      { id: 'ali-sing-phone-1', text: 'You handled those calls like a pro. No dropped signals!', context: ['phone_ace'] }
    ]
  },
  {
    callerId: 'anna-log',
    name: 'Anna Log',
    portrait: 'assets/pictures/04_AnnaLog.png',
    quotes: [
      { id: 'anna-log-low-score-1', text: 'Back in my day, we all started somewhere. Keep going!', context: ['low_score', 'encouragement'] },
      { id: 'anna-log-general-1', text: 'Everything used to be simpler, but your brain is adapting!', context: ['general'] },
      { id: 'anna-log-improvement-1', text: "You're improving faster than I converted to digital!", context: ['improvement', 'celebration'] }
    ]
  },
  {
    callerId: 'ray-tracing',
    name: 'Ray Tracing',
    portrait: 'assets/pictures/05_RayTracing.png',
    quotes: [
      { id: 'ray-tracing-rc-1', text: 'I can see right through your strategy. Orange food survived!', context: ['rc_survived', 'celebration'] },
      { id: 'ray-tracing-general-1', text: 'Your neural pathways are rendering beautifully.', context: ['general'] },
      { id: 'ray-tracing-personal-best-1', text: 'New record! I traced every neuron firing. Impressive.', context: ['personal_best', 'celebration'] },
      { id: 'ray-tracing-calibration-1', text: 'Five sessions traced. Your Skill Map just rendered!', context: ['calibration_complete', 'celebration'] }
    ]
  },
  {
    callerId: 'pat-ch-notes',
    name: 'Pat Ch-Notes',
    portrait: 'assets/pictures/06_PatCh-Notes.png',
    quotes: [
      { id: 'pat-ch-notes-improvement-1', text: 'We fixed a few bugs in your gameplay. Looking sharp!', context: ['improvement'] },
      { id: 'pat-ch-notes-general-1', text: 'Your brain just got a performance patch. Nice!', context: ['general', 'encouragement'] },
      { id: 'pat-ch-notes-session-50-1', text: 'Fifty sessions? Time for a major version update!', context: ['session_50', 'celebration'] }
    ]
  },
  {
    callerId: 'mac-address',
    name: 'Mac Address',
    portrait: 'assets/pictures/07_MacAddress.png',
    quotes: [
      { id: 'mac-address-streak-1', text: "I'm calling from a very specific location: the streak zone!", context: ['streak_milestone_7', 'streak_milestone_30'] },
      { id: 'mac-address-general-1', text: 'Your brain has a unique address. And it works!', context: ['general'] },
      { id: 'mac-address-high-score-1', text: 'High score from your specific neural location. Tracked!', context: ['high_score'] }
    ]
  },
  {
    callerId: 'artie-ficial',
    name: 'Artie Ficial',
    portrait: 'assets/pictures/08_ArtieFicial.png',
    quotes: [
      { id: 'artie-ficial-combo-1', text: "I'm not a real combo, but I play one in your game. Nice!", context: ['combo_master'] },
      { id: 'artie-ficial-general-1', text: 'Your neurons are more real than my acting career!', context: ['general', 'encouragement'] },
      { id: 'artie-ficial-rc-death-1', text: 'Orange food got you? That scene deserved an Oscar.', context: ['death_during_rc', 'encouragement'] }
    ]
  },
  {
    callerId: 'floppy-phil',
    name: 'Floppy Phil',
    portrait: 'assets/pictures/09_FloppyPhil.png',
    quotes: [
      { id: 'floppy-phil-calibration-1', text: 'Only 1.44 MB to say: five sessions complete! Legendary!', context: ['calibration_complete', 'celebration'] },
      { id: 'floppy-phil-general-1', text: 'Quick update: your brain storage is looking good!', context: ['general'] },
      { id: 'floppy-phil-low-score-1', text: "I've crashed too. We all start somewhere. You got this!", context: ['low_score', 'encouragement'] }
    ]
  },
  {
    callerId: 'dot-matrix',
    name: 'Dot Matrix',
    portrait: 'assets/pictures/10_DotMatrix.png',
    quotes: [
      { id: 'dot-matrix-personal-best-1', text: 'New record! Pixel by pixel, you built greatness.', context: ['personal_best', 'celebration'] },
      { id: 'dot-matrix-general-1', text: "You're looking crisp today. Resolution: excellent!", context: ['general'] },
      { id: 'dot-matrix-streak-1', text: 'Thirty days? Your consistency is printer-perfect!', context: ['streak_milestone_30', 'celebration'] },
      { id: 'dot-matrix-calibration-1', text: 'Printing complete! Your brain map is ready. Check it out!', context: ['calibration_complete', 'celebration'] }
    ]
  },
  {
    callerId: 'gia-hertz',
    name: 'Gia Hertz',
    portrait: 'assets/pictures/11_GiaHertz.png',
    quotes: [
      { id: 'gia-hertz-high-score-1', text: "I'm vibrating with excitement! High score achieved!", context: ['high_score', 'celebration'] },
      { id: 'gia-hertz-general-1', text: 'Your brain frequency is dialed in today. Keep it up!', context: ['general', 'encouragement'] },
      { id: 'gia-hertz-rc-1', text: 'Reverse Controls survived? Your neural oscillations are strong!', context: ['rc_survived'] },
      { id: 'gia-hertz-calibration-1', text: 'Five sessions tuned! Your brain map frequency is locked in!', context: ['calibration_complete', 'celebration'] }
    ]
  },
  {
    callerId: 'perry-pheral',
    name: 'Perry Pheral',
    portrait: 'assets/pictures/12_PerryPheral.png',
    quotes: [
      { id: 'perry-pheral-phone-1', text: "I'm just on the side, but you handled those calls like a boss!", context: ['phone_ace', 'celebration'] },
      { id: 'perry-pheral-general-1', text: "Don't mind me. Just observing your neural greatness!", context: ['general'] },
      { id: 'perry-pheral-improvement-1', text: 'From the sidelines: your improvement is undeniable!', context: ['improvement', 'encouragement'] }
    ]
  },
  {
    callerId: 'terry-byte',
    name: 'Terry Byte',
    portrait: 'assets/pictures/13_TerryByte.png',
    quotes: [
      { id: 'terry-byte-session-100-1', text: "I've got a LOT of data: 100 sessions! You're a legend!", context: ['session_100', 'celebration'] },
      { id: 'terry-byte-general-1', text: 'Your brain data is looking massive. Impressive!', context: ['general', 'encouragement'] },
      { id: 'terry-byte-high-score-1', text: 'High score logged. Your data set is growing strong!', context: ['high_score'] }
    ]
  },
  {
    callerId: 'cade-ridger',
    name: 'Cade Ridger',
    portrait: 'assets/pictures/14_CadeRidger.png',
    quotes: [
      { id: 'cade-ridger-improvement-1', text: 'Let me bridge the gap: your improvement is phenomenal!', context: ['improvement', 'celebration'] },
      { id: 'cade-ridger-general-1', text: "Connecting the dots between games. You're leveling up!", context: ['general'] },
      { id: 'cade-ridger-combo-1', text: 'Combo mode bridged two effects perfectly. Well played!', context: ['combo_master'] }
    ]
  },
  {
    callerId: 'mona-tor',
    name: 'Mona Tor',
    portrait: 'assets/pictures/15_MonaTor.png',
    quotes: [
      { id: 'mona-tor-streak-1', text: "I've been watching your every move. Seven days strong!", context: ['streak_milestone_7'] },
      { id: 'mona-tor-general-1', text: 'Monitoring your progress. Neural activity: excellent!', context: ['general', 'encouragement'] },
      { id: 'mona-tor-personal-best-1', text: "I've tracked it all. New personal record confirmed!", context: ['personal_best', 'celebration'] },
      { id: 'mona-tor-calibration-1', text: "I've been monitoring all five sessions. Your Skill Map is ready!", context: ['calibration_complete', 'celebration'] }
    ]
  },
  {
    callerId: 'syd-ram',
    name: 'Syd Ram',
    portrait: 'assets/pictures/16_SydRam.png',
    quotes: [
      { id: 'syd-ram-calibration-1', text: 'I forgot... wait, no! Five sessions complete! Memory loaded!', context: ['calibration_complete', 'celebration'] },
      { id: 'syd-ram-general-1', text: 'Hold on... yep, your brain is working great!', context: ['general'] },
      { id: 'syd-ram-rc-death-1', text: 'Orange food scrambled your memory? Happens to me daily!', context: ['death_during_rc', 'encouragement'] }
    ]
  },
  {
    callerId: 'bessie-ios',
    name: 'Bessie IOS',
    portrait: 'assets/pictures/17_BessieIOS.png',
    quotes: [
      { id: 'bessie-ios-session-50-1', text: "Moo-ve over! Fifty sessions complete. You're updated!", context: ['session_50', 'celebration'] },
      { id: 'bessie-ios-general-1', text: "I'm updating my compliments. You're doing great!", context: ['general', 'encouragement'] },
      { id: 'bessie-ios-improvement-1', text: 'New version of you just dropped. Performance: upgraded!', context: ['improvement'] },
      { id: 'bessie-ios-calibration-1', text: 'Update complete! Five sessions done. Your Skill Map is live!', context: ['calibration_complete', 'celebration'] }
    ]
  },
  {
    callerId: 'dee-frag',
    name: 'Dee Frag',
    portrait: 'assets/pictures/18_DeeFrag.png',
    quotes: [
      { id: 'dee-frag-high-score-1', text: 'Let me help you organize this: HIGH SCORE achieved!', context: ['high_score', 'celebration'] },
      { id: 'dee-frag-general-1', text: 'Your mental file system is defragmented and optimized!', context: ['general'] },
      { id: 'dee-frag-phone-1', text: 'Six calls managed? Your multitasking is pristine!', context: ['phone_ace'] }
    ]
  },
  {
    callerId: 'buffy-ring',
    name: 'Buffy Ring',
    portrait: 'assets/pictures/19_BuffyRing.png',
    quotes: [
      { id: 'buffy-ring-streak-1', text: "Hold on, I'm buffering... thirty days?! Legend!", context: ['streak_milestone_30', 'celebration'] },
      { id: 'buffy-ring-general-1', text: 'No buffering needed. Your brain is streaming perfectly!', context: ['general', 'encouragement'] },
      { id: 'buffy-ring-low-score-1', text: "I'm buffering too. We all need a moment. Keep going!", context: ['low_score', 'encouragement'] }
    ]
  },
  {
    callerId: 'dj-snake',
    name: 'DJ Snake',
    portrait: 'assets/pictures/20_DJsnake.png',
    quotes: [
      { id: 'dj-snake-combo-1', text: 'Ssssomeone requested a combo remix. You delivered!', context: ['combo_master', 'celebration'] },
      { id: 'dj-snake-general-1', text: 'Your gameplay is dropping beats. Neural bass: strong!', context: ['general'] },
      { id: 'dj-snake-rc-1', text: 'Orange food survived? That remix was fire!', context: ['rc_survived'] },
      { id: 'dj-snake-calibration-1', text: 'Five sessions? Your brain map just dropped. Check it out!', context: ['calibration_complete', 'celebration'] }
    ]
  },
  {
    callerId: 'game-over',
    name: 'GAME OVER',
    portrait: 'assets/pictures/21_GAMEOVER.png',
    quotes: [
      { id: 'game-over-personal-best-1', text: "Just checking... you're still alive AND set a record!", context: ['personal_best', 'celebration'] },
      { id: 'game-over-general-1', text: 'Checking in. Your vitals: strong. Your neurons: firing!', context: ['general', 'encouragement'] },
      { id: 'game-over-death-rc-1', text: "You're not over yet. Orange food is tough for everyone!", context: ['death_during_rc', 'encouragement'] }
    ]
  }
];

/**
 * Select quote based on context tags with relevance scoring
 * @param {Array<string>} contextTags - Array of context tags to match
 * @param {string|null} excludeQuoteId - Quote ID to exclude (prevent repetition)
 * @returns {Object} - { callerId, callerName, portrait, text, id }
 */
export function selectQuote(contextTags, excludeQuoteId = null) {
  // 1. Filter quotes matching ANY context tag and flatten with caller info
  const matchingQuotes = CALLER_QUOTES.flatMap(caller =>
    caller.quotes
      .filter(q => q.context.some(tag => contextTags.includes(tag)))
      .map(q => ({
        ...q,
        callerId: caller.callerId,
        callerName: caller.name,
        portrait: caller.portrait
      }))
  );

  // 2. Prioritize multi-tag matches (relevance scoring)
  const scored = matchingQuotes.map(q => ({
    ...q,
    relevance: q.context.filter(tag => contextTags.includes(tag)).length
  }));
  scored.sort((a, b) => b.relevance - a.relevance);

  // 3. Exclude lastQuoteId to prevent repetition
  const available = excludeQuoteId
    ? scored.filter(q => q.id !== excludeQuoteId)
    : scored;

  // 4. Fallback to 'general' context if no matches
  if (available.length === 0) {
    // Prevent infinite recursion if 'general' is already in contextTags
    if (contextTags.includes('general')) {
      // Emergency fallback: return first general quote
      const generalQuote = CALLER_QUOTES[0].quotes.find(q => q.context.includes('general'));
      return {
        callerId: CALLER_QUOTES[0].callerId,
        callerName: CALLER_QUOTES[0].name,
        portrait: CALLER_QUOTES[0].portrait,
        text: generalQuote.text,
        id: generalQuote.id
      };
    }
    return selectQuote(['general'], excludeQuoteId);
  }

  // 5. Random selection from top-relevance tier
  const topRelevance = available[0].relevance;
  const topTier = available.filter(q => q.relevance === topRelevance);
  const selected = topTier[Math.floor(Math.random() * topTier.length)];

  // Return quote with all required fields
  return {
    callerId: selected.callerId,
    callerName: selected.callerName,
    portrait: selected.portrait,
    text: selected.text,
    id: selected.id
  };
}

/**
 * Get all available context tags from database
 * @returns {Array<string>} - Sorted array of unique context tags
 */
export function getAvailableContexts() {
  const allContexts = CALLER_QUOTES
    .flatMap(caller => caller.quotes)
    .flatMap(quote => quote.context);

  const uniqueContexts = [...new Set(allContexts)];
  return uniqueContexts.sort();
}

/**
 * Build context tag array from session data
 * Maps gameplay performance to contextual tags for quote selection
 * @param {Object} sessionData - Session performance data
 * @returns {Array<string>} - Array of context tags
 */
export function buildContext(sessionData) {
  const context = [];

  // Validate input
  if (!sessionData || typeof sessionData !== 'object') {
    return ['general'];
  }

  const {
    score,
    highlights,
    cognitiveStats,
    diedDuringRC,
    comboMultipliers,
    phoneCallsManaged,
    streak,
    sessionCount
  } = sessionData;

  // Performance context
  if (typeof score === 'number') {
    if (score > 80) {
      context.push('high_score');
    }
    if (score < 20) {
      context.push('low_score');
    }
  }

  // Personal best from highlights
  if (Array.isArray(highlights) && highlights.some(h => h && h.type === 'personal_best')) {
    context.push('personal_best');
  }

  // Cognitive context
  if (cognitiveStats && typeof cognitiveStats === 'object') {
    if (cognitiveStats.rcSurvived >= 3) {
      context.push('rc_survived');
    }
  }

  if (diedDuringRC === true) {
    context.push('death_during_rc');
  }

  if (typeof comboMultipliers === 'number' && comboMultipliers >= 3) {
    context.push('combo_master');
  }

  if (typeof phoneCallsManaged === 'number' && phoneCallsManaged >= 6) {
    context.push('phone_ace');
  }

  // Milestone context
  if (sessionCount === 5) {
    context.push('calibration_complete');
  }

  if (sessionCount === 50) {
    context.push('session_50');
  }

  if (sessionCount === 100) {
    context.push('session_100');
  }

  if (streak === 7) {
    context.push('streak_milestone_7');
  }

  if (streak === 30) {
    context.push('streak_milestone_30');
  }

  // Fallback to general if no context tags matched
  if (context.length === 0) {
    context.push('general');
  }

  return context;
}
