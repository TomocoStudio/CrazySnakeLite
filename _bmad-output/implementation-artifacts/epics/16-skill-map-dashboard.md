# Epic 16: Skill Map Dashboard (The Cognitive Mirror)

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-15
**Completed:** —

---

## Overview

Build the full cognitive mirror — a player-initiated dashboard screen showing complete 6-domain cognitive profile using **pixel block bars** (NOT radar chart per UX audit). Displays rolling averages from Epic 13 as 5-block ratings (filled/empty squares), strongest domain callout with star icon, growth area callout with up-arrow, session count, current streak, rotating tech-pun caller quotes, and "Play Now" button. This is the **cool moment** — player is rested, curious, has full cognitive budget — so they can handle visual complexity. Accessible from main menu after calibration completes (Epic 15). The Skill Map becomes the pre-game ritual: "Let me check my profile before I play today."

**FRs covered:** FR171-FR182 (Skill Map screen, pixel block bars, strongest/growth callouts, session count, streak display, Play Now button, rotating quotes, pixel art aesthetic)

**NFRs covered:** NFR52 (loads in 500ms), NFR62-NFR63 (chart comprehensible in 10 seconds, dots intuitive)

**Value:** The complete brain gym mirror. Inspires targeted play ("I'll focus on Working Memory today"). Shows growth over time. Shareable brain map potential (future). Transforms CrazySnake from "fun game" to "my daily cognitive workout with receipts."

**Dependencies:** Requires Epic 13 (metrics.js for rolling averages), Epic 15 (calibration complete check)

---

## Stories

### Story 16.1: Create Skill Map Screen and Navigation

**As a** player,
**I want** to access my Skill Map from the main menu,
**So that** I can view my cognitive profile before or after gameplay.

**Acceptance Criteria:**

**Given** calibrationComplete === true
**When** main menu displays
**Then** show "Skill Map" menu option:
```
🎯 Skill Map
```
**And** clicking it navigates to Skill Map screen (new game phase: 'skillmap')

**Given** Skill Map screen loads
**When** skillmap.js initializes
**Then** query storage.js for:
- Rolling averages for all 6 metrics
- Total session count
- Current streak
- Last played date
**And** render complete dashboard within 500ms (per NFR52)

**Given** player is on Skill Map screen
**When** game phase is 'skillmap'
**Then** game loop pauses (no snake rendering, no gameplay)
**And** DOM-based dashboard overlay rendered on top of canvas
**And** background shows dimmed game canvas (last game state or idle state)

**Given** player clicks "Play Now" button on Skill Map
**When** button is pressed
**Then** transition back to main menu or directly to new game (phase: 'playing')
**And** Skill Map overlay fades out (300ms transition)

**Given** player presses Esc key on Skill Map
**When** Esc is detected
**Then** return to main menu
**And** Skill Map overlay closes gracefully

**Per FR171:** Brain Map accessible from main menu ("Brain Map" option)

---

### Story 16.2: Implement Pixel Block Bar Visualization

**As a** player,
**I want** to see my 6 cognitive domains as simple block bars,
**So that** I understand my profile at a glance without needing to interpret complex charts.

**Acceptance Criteria:**

**Given** Skill Map displays
**When** rendering cognitive domains
**Then** show 6 horizontal rows with pixel block bars:
```
Reaction Time    ████░  4/5
Spatial          █████  5/5  ★
Flexibility      ███░░  3/5  ▲
Attention        ████░  4/5
Impulse          ███░░  3/5
Working Memory   ██░░░  2/5  ↑
```

**And** each row contains:
- Domain label (left-aligned, Jersey20 14px, white)
- 5 square blocks (16x16px each, 2px gap between)
- Rating text (right of blocks, "4/5" format, 12px Jersey20, light grey #B0B0B0)
- Optional indicator (★ for strongest, ▲ for improved, ↑ for growth area)

**Given** a metric has rolling average 0.83 (normalized 0-1 scale)
**When** converting to 5-block rating
**Then** calculate: blocks = Math.round(rollingAvg × 5) = round(0.83 × 5) = 4 blocks filled
**And** render 4 filled blocks (purple rgb(157, 178, 221)) + 1 empty block (dark grey #3A3A3A)

**Given** block bars render
**When** displaying filled vs empty blocks
**Then** filled blocks: solid purple rgb(157, 178, 221), no gradient
**And** empty blocks: dark grey #3A3A3A with 1px border #555555 (visible but receding)
**And** all blocks are perfect squares (16x16px, no rounded corners per pixel aesthetic)

**Given** domain labels display
**When** space is limited
**Then** abbreviate labels:
- "Reaction Time" → "Reaction"
- "Spatial Awareness" → "Spatial"
- "Cognitive Flexibility" → "Flexibility"
- "Divided Attention" → "Attention"
- "Impulse Control" → "Impulse"
- "Working Memory" → "Memory"

**Per FR172-FR174:** Brain Map displays radar chart (UPDATED: pixel block bars) with all 6 cognitive domains, pixel art styling

---

### Story 16.3: Add Strongest Domain and Growth Area Callouts

**As a** player,
**I want** to see my top skill and my growth opportunity highlighted,
**So that** I understand where I excel and where to focus.

**Acceptance Criteria:**

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

### Story 16.4: Display Session Count and Streak

**As a** player,
**I want** to see how many sessions I've played and my current streak,
**So that** I understand my engagement level and habit consistency.

**Acceptance Criteria:**

**Given** Skill Map displays
**When** session metadata renders
**Then** show below callout cards:
```
Sessions: 47     Streak: 12 days 🔥
```
**And** text in 14px Jersey20, light grey
**And** centered or left-aligned below growth area callout

**Given** sessionsCompleted is retrieved from storage
**When** displaying session count
**Then** show total sessions played (includes calibration sessions)
**And** format: "Sessions: {count}"

**Given** currentStreak is retrieved from storage
**When** displaying streak
**Then** show current streak in days
**And** format: "Streak: {days} day{s} 🔥"
**And** flame emoji only if streak >= 1 day

**Given** streak is 7 days or 30 days (milestone)
**When** displaying streak
**Then** use gold color #FFD700 instead of light grey
**And** subtle pulsing animation (scale 1.0 → 1.05 → 1.0, 2s cycle)

**Given** streak is 0 (just broken)
**When** displaying streak
**Then** show: "Streak: 0 days — ready to start fresh?"
**And** no flame emoji
**And** gentle tone (no guilt per ethical guardrails)

**Per FR177-FR178:** Session count displayed prominently, current streak displayed prominently

---

### Story 16.5: Add Rotating Caller Quotes

**As a** player,
**I want** to see funny tech-pun caller quotes on the Skill Map,
**So that** the dashboard feels like CrazySnake, not a clinical report.

**Acceptance Criteria:**

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

### Story 16.6: Implement Play Now Button

**As a** player,
**I want** a clear "Play Now" button on the Skill Map,
**So that** I can quickly jump into a game after checking my profile.

**Acceptance Criteria:**

**Given** Skill Map displays
**When** rendering action buttons
**Then** show "Play Now" button prominently:
```
┌──────────────┐
│   PLAY NOW   │
└──────────────┘
```
**And** button uses standard style: 8px rounded corners, purple border, Jersey20 20px, white text
**And** positioned below caller quote, centered

**Given** player clicks "Play Now" button
**When** button is pressed
**Then** transition directly to new game (phase: 'playing')
**And** Skill Map overlay fades out (300ms)
**And** game initializes immediately (no menu screen)

**Given** player hovers over "Play Now" button
**When** mouse enters button area
**Then** button background changes to purple rgb(157, 178, 221)
**And** scale animation: transform: scale(1.05)
**And** cursor: pointer

**Given** mobile viewport (< 768px)
**When** "Play Now" button renders
**Then** increase button size to full-width (within padding)
**And** minimum 44px height for touch target

**Per FR179:** "Play Now" button always visible on dashboard (dashboard is launchpad, not dead end)

---

### Story 16.7: Add Back to Menu Navigation

**As a** player,
**I want** to return to the main menu from the Skill Map,
**So that** I can access other menu options without playing.

**Acceptance Criteria:**

**Given** Skill Map displays
**When** bottom of screen renders
**Then** show "← Back to Menu" link:
```
← Back to Menu
```
**And** text in 14px Jersey20, light grey, left-aligned
**And** positioned at bottom-left of screen

**Given** player clicks "Back to Menu" link
**When** link is pressed
**Then** transition to main menu (phase: 'menu')
**And** Skill Map overlay fades out (300ms)

**Given** player presses Esc key
**When** Esc is detected on Skill Map
**Then** same behavior as "Back to Menu" (return to menu)

**Given** player uses keyboard navigation
**When** Tab key is pressed
**Then** focus cycles through: block bars (for accessibility) → Play Now → Back to Menu
**And** Enter key activates focused element

---

### Story 16.8: Apply Consistent Dashboard Styling

**As a** player,
**I want** the Skill Map to match CrazySnake's visual aesthetic,
**So that** it feels like part of the game, not a separate analytics tool.

**Acceptance Criteria:**

**Given** Skill Map renders
**When** applying visual styling
**Then** use design system consistently:
- Background overlay: rgba(0, 0, 0, 0.9) (90% black, same as game over screen)
- Border: 8px solid rgb(157, 178, 221) (purple theme)
- Outer shadow: 0 0 0 8px #1A1A2E (dark border layer)
- Border radius: 12px (rounded menu frame style)
- Font: Jersey20 throughout
- Text colors: White #FFFFFF for primary, light grey #B0B0B0 for secondary

**And** all UI elements follow retro 8-bit pixel art aesthetic (per FR205)
**And** no smooth gradients, no drop shadows (except structural borders), no modern effects

**Given** Skill Map container renders
**When** positioning on screen
**Then** center horizontally and vertically
**And** max-width: 600px (desktop), full-width minus padding (mobile)
**And** padding: 40px (desktop), 20px (mobile)

**Given** mobile viewport (< 768px)
**When** Skill Map displays
**Then** stack all elements vertically
**And** reduce font sizes by 15% for readability
**And** block bars scale proportionally (maintain 16x16px blocks or scale to 14x14px)

**Per FR181:** Dashboard uses purple theme color rgb(157, 178, 221) for borders and accents

---

### Story 16.9: Test Skill Map Performance and Responsiveness

**As a** developer,
**I want** the Skill Map to load instantly and render smoothly,
**So that** players experience no lag when checking their profile.

**Acceptance Criteria:**

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
