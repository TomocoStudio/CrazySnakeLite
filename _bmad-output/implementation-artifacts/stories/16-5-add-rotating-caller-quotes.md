# Story 16.5: Add Rotating Caller Quotes

**Epic:** 16 - Skill Map Dashboard (The Cognitive Mirror)

**As a** player,
**I want** to see funny tech-pun caller quotes on the Skill Map,
**So that** the dashboard feels like CrazySnake, not a clinical report.

---

## Acceptance Criteria

**Given** Skill Map displays
**When** rendering quotes
**Then** select a random caller quote from pool of ~20 general achievement quotes:
```
"Your neurons are doing the Electric Slide. Keep it up!"
                              — DJ Algorithm
```
**And** quote displayed below session count/streak
**And** caller portrait (32x32px) shown with quote
**And** quote text italicized, 14px Jersey20, light grey
**And** caller name right-aligned, 12px Jersey20

**Given** player closes and reopens Skill Map
**When** Skill Map initializes
**Then** rotate to different quote (pseudo-random from pool)
**And** never show same quote twice in a row
**And** quotes refresh on each Skill Map visit (per FR180)

**Given** player just hit a milestone (7-day streak, 30-day streak, 50 sessions, 100 sessions)
**When** Skill Map displays
**Then** prioritize milestone-appropriate quote:
```
"50 sessions in? Your brain is officially a gym regular."
                              — Cache Money
```

**Given** quote selection uses performance context
**When** strongest domain is Spatial Awareness
**Then** occasionally select domain-specific quote:
```
"Your spatial awareness is off the charts. Snake GPS installed."
                              — Ray Tracer
```

**Per FR180:** Rotating caller quote or achievement title displayed on each dashboard visit (refreshes on view, humor not clinical)

---

## Dev Section

### Technical Context

**Story Purpose:** Implement rotating comedy quotes on the Skill Map dashboard. Quotes refresh on each visit, never repeat consecutively, and prioritize milestone/domain-specific context when available. This is the final narrative layer that transforms data into story (Knaflic: Step 6).

**Architecture Pattern:** Quote pool lives in CONFIG.DASHBOARD.QUOTES. Selection algorithm in dashboard.js chooses quote based on profile state (milestone, strongest domain, recent improvement). Last-shown quote tracked in profile.lastQuote to prevent immediate repeats.

**Key UX Insight:** Comedy quotes are NOT clinical language — they're caller personality, retro humor, celebratory tone. This keeps the dashboard feeling like CrazySnake, not a health app.

### Files to Modify

**MODIFY:**
- `js/dashboard.js` — Add `selectDashboardQuote()` function, quote rendering logic
- `js/config.js` — Add CONFIG.DASHBOARD.QUOTES structure (3 context pools)
- `css/style.css` — Add quote display styles (italics, caller portrait, right-aligned name)

**READ (context):**
- `js/storage.js` — Understand profile.lastQuote field for variety enforcement

### Implementation Guidance

#### 1. Quote Selection Algorithm (js/dashboard.js)

**Add quote selection logic:**

```javascript
// dashboard.js — Quote selection with context prioritization

/**
 * Select a dashboard quote based on current profile state
 * Prioritizes: milestone > domain-specific > general
 * Never shows same quote twice in a row
 * @param {Object} profile - Player profile from storage
 * @returns {Object} - { text, caller, portrait }
 */
function selectDashboardQuote(profile) {
  const { totalSessions, currentStreak, domainScores, lastQuote } = profile;

  let quotePool = [];
  let context = 'general';

  // Priority 1: Milestone quotes (7-day, 30-day, 50/100 sessions)
  if (currentStreak === 7 || currentStreak === 30) {
    quotePool = CONFIG.DASHBOARD.QUOTES.milestone;
    context = 'milestone';
  } else if (totalSessions === 50 || totalSessions === 100) {
    quotePool = CONFIG.DASHBOARD.QUOTES.milestone;
    context = 'milestone';
  }
  // Priority 2: Domain-specific quotes (strongest domain)
  else {
    const strongestDomain = determineStrongestDomain(domainScores);
    const domainQuotes = CONFIG.DASHBOARD.QUOTES.domainSpecific[strongestDomain];

    // 30% chance to show domain-specific quote, 70% general
    if (domainQuotes && Math.random() < 0.3) {
      quotePool = domainQuotes;
      context = 'domain';
    }
  }

  // Fallback to general pool
  if (quotePool.length === 0) {
    quotePool = CONFIG.DASHBOARD.QUOTES.general;
    context = 'general';
  }

  // Select random quote, avoiding last shown
  let selectedQuote;
  if (quotePool.length === 1) {
    selectedQuote = quotePool[0];
  } else {
    const availableQuotes = quotePool.filter(q => q.text !== lastQuote);
    selectedQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  }

  return selectedQuote;
}
```

**Add to `renderFullSkillMap()`:**

```javascript
function renderFullSkillMap(profile) {
  const barsContainer = document.getElementById('skill-map-bars-container');
  const { domainScores, totalSessions, currentStreak } = profile;

  // ... existing block bar rendering ...
  // ... existing callout rendering ...
  // ... existing session stats rendering ...

  // NEW: Render rotating quote
  const quote = selectDashboardQuote(profile);
  renderQuote(quote);

  // Store quote text in profile for next-visit variety enforcement
  storage.updateProfile({ lastQuote: quote.text });
}

/**
 * Render caller quote with portrait and name
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
}
```

#### 2. Quote Pool Config (js/config.js)

**Add to CONFIG.DASHBOARD:**

```javascript
// config.js — DASHBOARD section
DASHBOARD: {
  // ... existing fields (DOMAIN_QUOTES from 16.3) ...

  QUOTES: {
    // General achievement quotes (~20 total, expand post-MVP)
    general: [
      {
        text: "Your neurons are doing the Electric Slide. Keep it up!",
        caller: "DJ Algorithm",
        portrait: "assets/callers/dj-algorithm.png"
      },
      {
        text: "This brain gym has better attendance than most actual gyms.",
        caller: "Cache Money",
        portrait: "assets/callers/cache-money.png"
      },
      {
        text: "Neural pathways strengthening detected. Status: impressive.",
        caller: "Mona Tor",
        portrait: "assets/callers/mona-tor.png"
      },
      {
        text: "Your cognitive flexibility is looser than a rubber band factory.",
        caller: "Al Gorithm",
        portrait: "assets/callers/al-gorithm.png"
      },
      {
        text: "Snake wrangling builds character. And synapses. Mostly synapses.",
        caller: "Kernel Sanders",
        portrait: "assets/callers/kernel-sanders.png"
      }
      // ... add 15 more for variety ...
    ],

    // Milestone-specific quotes (7-day, 30-day, 50/100 sessions)
    milestone: [
      {
        text: "7-day streak! Your brain has better habits than most people.",
        caller: "Cache Money",
        portrait: "assets/callers/cache-money.png"
      },
      {
        text: "30 days? That's not a streak, that's a neural revolution.",
        caller: "Floppy Phil",
        portrait: "assets/callers/floppy-phil.png"
      },
      {
        text: "50 sessions in? Your prefrontal cortex is officially jacked.",
        caller: "Ray Tracer",
        portrait: "assets/callers/ray-tracer.png"
      },
      {
        text: "100 sessions! You've unlocked: Permanent Brain Gains.",
        caller: "Ada Loopback",
        portrait: "assets/callers/ada-loopback.png"
      }
    ],

    // Domain-specific quotes (strongest domain context)
    domainSpecific: {
      reactionTime: [
        {
          text: "Your reaction time is clocking in faster than my compiler.",
          caller: "Kernel Sanders",
          portrait: "assets/callers/kernel-sanders.png"
        }
      ],
      spatialAwareness: [
        {
          text: "Spatial awareness off the charts. Snake GPS confirmed installed.",
          caller: "Ray Tracer",
          portrait: "assets/callers/ray-tracer.png"
        }
      ],
      cognitiveFlexibility: [
        {
          text: "Reverse Controls is your warm-up. Your brain flips like a pancake.",
          caller: "Floppy Phil",
          portrait: "assets/callers/floppy-phil.png"
        }
      ],
      dividedAttention: [
        {
          text: "Phone calls during gameplay? Multitasking level: legendary.",
          caller: "Mona Tor",
          portrait: "assets/callers/mona-tor.png"
        }
      ],
      impulseControl: [
        {
          text: "Risk assessment on point. Your impulse control is dialed in.",
          caller: "Cache Money",
          portrait: "assets/callers/cache-money.png"
        }
      ],
      workingMemory: [
        {
          text: "Working memory firing on all cylinders. Combo mode is your playground.",
          caller: "DJ Algorithm",
          portrait: "assets/callers/dj-algorithm.png"
        }
      ]
    }
  }
}
```

**Quote format contract:**
- All quotes MUST include `text`, `caller`, `portrait` fields
- Portrait paths relative to project root: `assets/callers/{name}.png`
- Caller names match phone.js caller database (21 total callers)
- Text length: 60-120 characters (fits in dashboard width without wrapping excessively)

#### 3. CSS Styling (css/style.css)

**Add quote card styles:**

```css
/* === Dashboard Quote === */
#skill-map-quote {
  margin-top: 20px;
  margin-bottom: 20px;
}

.quote-card {
  background: rgba(26, 26, 46, 0.4);
  border: 1px solid rgba(157, 178, 221, 0.3);
  border-radius: 8px;
  padding: 16px;
}

.quote-text {
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  font-style: italic;
  color: #B0B0B0;
  line-height: 1.4;
  margin: 0 0 12px 0;
}

.caller-attribution {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.caller-portrait-small {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(157, 178, 221, 0.5);
}

.caller-name {
  font-family: 'Jersey20', sans-serif;
  font-size: 12px;
  color: #B0B0B0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .quote-text {
    font-size: 12px;
  }

  .caller-name {
    font-size: 10px;
  }

  .caller-portrait-small {
    width: 28px;
    height: 28px;
  }
}
```

### Testing Guidance

**Manual Testing Checklist:**

1. **Quote Rotation:**
   - [ ] Open Skill Map → quote displays
   - [ ] Close and reopen Skill Map → different quote (not same as last)
   - [ ] Repeat 5 times → variety confirmed (no immediate repeats)

2. **Milestone Prioritization:**
   - [ ] Set currentStreak to 7 → milestone quote appears
   - [ ] Set totalSessions to 50 → milestone quote appears
   - [ ] Milestone pool prioritized over general pool

3. **Domain-Specific Quotes:**
   - [ ] Strongest domain = Spatial → 30% chance of spatial-specific quote
   - [ ] Non-milestone context → mix of general + domain quotes
   - [ ] Domain quotes contextually correct

4. **Quote Display:**
   - [ ] Quote text italicized, light grey #B0B0B0
   - [ ] Caller portrait 32x32px, right-aligned with name
   - [ ] Portrait loads correctly (fallback if missing)
   - [ ] Caller name matches portrait

5. **Edge Cases:**
   - [ ] Empty quote pool → fallback to general
   - [ ] Single quote in pool → shows that quote (no error)
   - [ ] Missing portrait → img element handles gracefully

6. **Mobile Layout:**
   - [ ] Quote wraps naturally on narrow screens
   - [ ] Portrait + name stay right-aligned
   - [ ] Text remains readable (12px minimum)

### Definition of Done

- [ ] `selectDashboardQuote()` implemented with priority algorithm
- [ ] Milestone detection: 7/30-day streak, 50/100 sessions
- [ ] Domain-specific quotes: 30% chance when strongest domain exists
- [ ] Variety enforcement: never same quote twice in a row (via profile.lastQuote)
- [ ] `renderQuote()` displays text + portrait + caller name
- [ ] CONFIG.DASHBOARD.QUOTES added with 3 pools (general, milestone, domainSpecific)
- [ ] Minimum 5 quotes per pool (expandable post-MVP)
- [ ] CSS styles for .quote-card, .quote-text, .caller-attribution added
- [ ] Caller portraits load correctly (32x32px)
- [ ] Manual testing checklist passed (6/6 scenarios)
- [ ] No console errors

### Dependencies

**Blocked By:**
- Story 16.4 complete (stats render correctly, quote appears below)
- Epic 13 complete (profile structure with domainScores)

**Blocks:**
- Story 16.6 (Play Now button appears below quote)

### References

- [Source: ux-design-cognitive-dashboard.md — Comedy Quote Integration, Rotating Quotes]
- [Source: project-context.md — V3 Comedy Integration Patterns, Quote Data in config.js]
- [Source: config.js — DASHBOARD.QUOTES structure, caller database]
