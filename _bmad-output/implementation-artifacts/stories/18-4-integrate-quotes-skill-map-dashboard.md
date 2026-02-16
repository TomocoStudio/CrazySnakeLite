# Story 18.4: Integrate Quotes into Skill Map Dashboard

**Epic:** 18 - Dashboard Comedy Integration

**As a** player,
**I want** the Skill Map to show a funny quote on each visit,
**So that** checking my profile feels delightful, not dry.

---

## Acceptance Criteria

**Given** Skill Map displays
**When** rendering dashboard (Epic 16)
**Then** select rotating caller quote for this visit
**And** display below session count/streak:
```
┌─────────────────────────────────────┐
│  Sessions: 47     Streak: 12 days 🔥│
│                                     │
│  "Your neurons are doing the        │
│   Electric Slide. Keep it up!"      │
│                   — DJ Algorithm    │
└─────────────────────────────────────┘
```

**Given** player opens Skill Map multiple times
**When** quote selection runs each visit
**Then** rotate through different quotes (never same twice in a row per FR180)
**And** track lastSkillMapQuoteId in sessionStorage

**Given** player has active milestone (30-day streak, 100 sessions)
**When** Skill Map displays
**Then** prioritize milestone-tagged quotes:
```
"100 sessions in? Your brain is officially a gym legend."
                              — Cache Money
```

**Given** strongest domain is Spatial Awareness
**When** selecting Skill Map quote
**Then** occasionally select domain-specific quote:
```
"Your spatial awareness is off the charts. Snake GPS installed."
                              — Ray Tracer
```

**Given** no specific context matches
**When** fallback selection runs
**Then** choose general achievement/encouragement quote
**And** maintain humor tone (never clinical)

**Per FR180, FR200:** Rotating caller quote displayed on each dashboard visit (refreshes on view, humor not clinical)

---

## Development

### Files to Create/Modify

- **`js/dashboard.js`** - EXTEND - Add rotating quote to Skill Map rendering (Epic 16)
- **`css/style.css`** - EXTEND - Add Skill Map quote styling (reuse post-game quote patterns)
- **`test/dashboard.test.js`** - EXTEND - Add tests for quote rotation and milestone prioritization

### API Surface

```javascript
// dashboard.js (EXTENDED from Epic 16)

// Enhanced renderSkillMap() with rotating quote integration
export function renderSkillMap(playerProfile: Object): void
// Now includes: buildSkillMapContext() → selectQuote() → render quote UI
```

### HTML Structure (Skill Map Screen)

```html
<!-- Extend existing Skill Map overlay (Epic 16) -->
<div id="skill-map-overlay" class="overlay">
  <div class="skill-map-content">
    <h2>Skill Map</h2>

    <!-- Existing session count + streak (Epic 16) -->
    <div class="session-info">
      <span class="session-count">Sessions: 47</span>
      <span class="streak-display">Streak: 12 days 🔥</span>
    </div>

    <!-- NEW: Rotating caller quote -->
    <div class="skill-map-quote">
      <img class="quote-portrait" src="assets/pictures/06_PatCh-Notes.png" alt="Pat Ch-Notes">
      <p class="quote-text">"Your neurons are doing the Electric Slide. Keep it up!"</p>
      <p class="quote-attribution">— DJ Algorithm</p>
    </div>

    <!-- Existing 6 domain block bars (Epic 16) -->
    <div class="domain-bars">
      <!-- ... 6 pixel block bars ... -->
    </div>

    <!-- Existing strongest domain + growth area callouts (Epic 16) -->
    <div class="callouts">
      <div class="strongest-domain">Top Skill: Reaction Time</div>
      <div class="growth-area">Level Up: Impulse Control</div>
    </div>

    <!-- Existing buttons -->
    <div class="button-group">
      <button id="btn-play-now">PLAY NOW</button>
      <button id="btn-back-to-menu">BACK TO MENU</button>
    </div>
  </div>
</div>
```

### CSS Styling

```css
/* css/style.css - Skill Map quote styling */

.skill-map-quote {
  margin: 16px 0;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);  /* Subtle dark background */
  border-radius: 8px;  /* Minimal rounding per retro aesthetic */
  border: 1px solid rgba(157, 178, 221, 0.4);  /* Purple accent */
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.skill-map-quote .quote-portrait {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  flex-shrink: 0;
}

.skill-map-quote .quote-text {
  font-family: 'Jersey20', monospace;
  font-size: 14px;
  color: #ffffff;
  font-style: italic;
  margin: 0;
  flex-grow: 1;
  line-height: 1.3;
}

.skill-map-quote .quote-attribution {
  font-family: 'Jersey20', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  white-space: nowrap;
  align-self: flex-end;
}
```

### Skill Map Context Building

```javascript
// dashboard.js

import { buildContext, selectQuote } from './comedy.js';

function buildSkillMapContext(playerProfile) {
  const context = ['general'];  // Always include general as base

  // Add milestone contexts
  const { streak, sessionCount, strongestDomain } = playerProfile;

  if (streak === 7) context.push('streak_milestone_7');
  if (streak === 30) context.push('streak_milestone_30');
  if (streak > 0) context.push('streak_active');

  if (sessionCount === 50) context.push('session_50');
  if (sessionCount === 100) context.push('session_100');

  // Add domain-specific context (occasionally)
  if (strongestDomain && Math.random() < 0.3) {  // 30% chance
    const domainTag = `domain_${strongestDomain.toLowerCase()}`;
    context.push(domainTag);  // e.g., 'domain_reaction_time', 'domain_spatial'
  }

  return context;
}
```

### Quote Rendering Logic

```javascript
// dashboard.js

export function renderSkillMap(playerProfile) {
  // 1. Render existing Skill Map elements (Epic 16 logic)
  renderSessionInfo(playerProfile);
  renderDomainBars(playerProfile.domains);
  renderCallouts(playerProfile.strongestDomain, playerProfile.growthArea);

  // 2. Build Skill Map context
  const context = buildSkillMapContext(playerProfile);

  // 3. Get last Skill Map quote ID (separate from post-game)
  const lastQuoteId = sessionStorage.getItem('lastSkillMapQuoteId');

  // 4. Select quote
  const quote = selectQuote(context, lastQuoteId);

  // 5. Store quote ID for next visit
  sessionStorage.setItem('lastSkillMapQuoteId', quote.id);

  // 6. Render quote UI
  const quoteSection = document.querySelector('.skill-map-quote');
  if (quoteSection) {
    const portrait = quoteSection.querySelector('.quote-portrait');
    const text = quoteSection.querySelector('.quote-text');
    const attribution = quoteSection.querySelector('.quote-attribution');

    portrait.src = quote.portrait;
    portrait.alt = quote.callerName;
    text.textContent = `"${quote.text}"`;
    attribution.textContent = `— ${quote.callerName}`;
  }
}
```

### Player Profile Data Contract

```javascript
// Expected playerProfile structure (from storage.js/metrics.js)
const playerProfile = {
  sessionCount: number,              // Total sessions played
  streak: number,                    // Current daily streak
  strongestDomain: string,           // e.g., 'Reaction Time', 'Spatial Awareness'
  growthArea: string,                // Lowest scoring domain
  domains: [
    { name: 'Reaction Time', score: 0.75, blocks: 8 },
    { name: 'Spatial Awareness', score: 0.62, blocks: 6 },
    // ... 4 more
  ]
};
```

### Domain-Specific Quote Tags

```javascript
// Extend CALLER_QUOTES in comedy.js with domain-specific quotes

// Example domain tags:
// - 'domain_reaction_time'
// - 'domain_spatial'
// - 'domain_flexibility'
// - 'domain_attention'
// - 'domain_impulse'
// - 'domain_memory'

// Example quotes:
{
  text: "Your spatial awareness is off the charts. Snake GPS installed.",
  context: ['domain_spatial', 'general']
},
{
  text: "Lightning reflexes detected. Your neurons are on espresso today.",
  context: ['domain_reaction_time', 'high_score']
}
```

### Integration Points

- **`comedy.js`** - Import buildContext() and selectQuote()
- **`storage.js`** - Provide playerProfile data (sessionCount, streak)
- **`metrics.js`** - Provide domain scores for strongestDomain calculation
- **sessionStorage** - Track lastSkillMapQuoteId separately from post-game quotes
- **`main.js`** - Call renderSkillMap() when Skill Map button clicked

### Test Strategy

**Unit Tests (`dashboard.test.js`):**
1. Test buildSkillMapContext() includes 'general' always
2. Test buildSkillMapContext({ streak: 7 }) includes 'streak_milestone_7'
3. Test buildSkillMapContext({ streak: 30 }) includes 'streak_milestone_30'
4. Test buildSkillMapContext({ sessionCount: 50 }) includes 'session_50'
5. Test buildSkillMapContext({ sessionCount: 100 }) includes 'session_100'
6. Test domain-specific tag added ~30% of the time (probabilistic)
7. Test renderSkillMap() calls selectQuote() with built context
8. Test lastSkillMapQuoteId stored in sessionStorage
9. Test quote UI elements populated correctly

**Manual Testing:**
- Open Skill Map → verify quote appears
- Close and reopen Skill Map 5 times → verify different quote each time
- Achieve 30-day streak → open Skill Map → verify milestone quote prioritized
- Play 100 sessions → open Skill Map → verify session milestone quote
- Verify quote fits in container (no overflow)
- Verify portrait 32x32px, pixelated rendering

### Dependencies

**BEFORE this story:**
- Story 18.1 (CALLER_QUOTES database)
- Story 18.2 (buildContext + selectQuote functions)
- Epic 16 (Skill Map screen and domain bar rendering)
- Story 18.3 (post-game quote integration provides pattern reference)

**AFTER this story:**
- Story 18.5 (calibration celebration uses similar quote integration)

### Implementation Notes

1. **Separate quote tracking** - lastSkillMapQuoteId ≠ lastPostGameQuoteId (independent rotation)
2. **Quote refreshes on view** - New quote selected each time Skill Map opens (per FR180)
3. **Milestone prioritization** - 30-day streak quote on first visit after achieving milestone, then rotate
4. **Domain-specific quotes optional** - Only 30% chance to include domain tag (keeps variety high)
5. **Fallback to general** - If no milestone/domain quotes match → 'general' quotes always available
6. **No animation** - Quote visible immediately (unlike post-game fade-in)
7. **Horizontal layout** - Portrait left, text middle, attribution right (fits Skill Map aesthetic)
8. **Domain tag naming** - Use lowercase + underscore (e.g., 'domain_reaction_time', not 'domain_Reaction Time')
