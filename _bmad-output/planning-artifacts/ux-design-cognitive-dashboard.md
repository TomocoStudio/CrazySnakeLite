# UX Design — CrazySnake Cognitive Dashboard

**Author:** Sally (UX Designer)
**For:** Tomoco
**Date:** 2026-02-15 (Updated: 2026-02-17)
**Status:** Implemented v2 (0.1 Precision Enhancement)
**Foundations:** `dataviz-principles.md` (DataViz), `game-ux-principles.md` (Hodent), PRD v2.1, Product Brief (2026-02-15), Party Mode Summary, Cognitive Analytics Requirements

---

## Version History

**v2 — 2026-02-17: 0.1 Precision Enhancement**
- **Change:** Enhanced block bars from integer-only (0-5) to 0.1 precision (0.0-5.0)
- **Implementation:** Horizontal fill bars show partial block fills (e.g., 3.7 shows as 3 full + 70% filled 4th block)
- **Rationale:** User feedback — integer scale too coarse for tracking meaningful progress between whole numbers
- **Impact:** Maintains grid-native aesthetic while providing fine-grained progress feedback
- **Technical:** 50 total segments (5 blocks × 10 segments each), text displays "3.7/5" format

**v1 — 2026-02-15: Original Design**
- Integer 5-block scale (0, 1, 2, 3, 4, 5)
- Filled/empty states only
- Text displays "3/5" format

---

## Player-Facing Vocabulary

The game's internal positioning is "brain gym for the age of AI" — but the player-facing language must feel like CrazySnake, not Lumosity. The word "brain" is reserved for marketing, product briefs, and caller comedy quotes (character voice). The UI itself uses game-native vocabulary.

| Touchpoint | Player-Facing Term | Replaces | Rationale |
|---|---|---|---|
| Dashboard screen title & menu item | **Skill Map** | Brain Map | Game-native. Players understand "skills" without clinical associations. |
| Post-game highlights header | **Recap** | Your Brain Today | Sports-broadcast energy. Quick, punchy, implies highlights. |
| Calibration messaging | **Warming up...** | Calibrating your brain... | Gym metaphor without "brain." Natural for fitness positioning. |
| Calibration complete | **Your Skill Map is ready!** | Your brain map is ready! | Consistent with Skill Map naming. Clean unlock moment. |
| Streak break message | **Rest day logged. Ready for another round?** | Your brain took a rest day... | Gym-native, zero guilt, factual tone. |
| Strongest domain callout | **Top Skill: [Domain]** | Strongest: [Domain] | Pure game language. Radar chart becomes a skill-tree vibe. |
| Growth opportunity callout | **Level Up: [Domain]** | Growth Edge: [Domain] | Implies progression. Every gamer understands "level up." |
| Phase constant | `'skillmap'` | `'brainmap'` | Code matches player-facing vocabulary. |

**Where "brain" IS allowed:** Caller comedy quotes ("Your prefrontal cortex just filed a pull request") — that's character voice, not UI labeling. The callers can be as nerdy as they want; the interface stays game-native.

---

## Design North Star

> The Cognitive Dashboard is the player's **cognitive mirror** — a place where raw gameplay transforms into a personal story of growth. It must answer one question instantly: **"Am I getting sharper?"**

The dashboard does NOT replace the game. It completes it. Without the dashboard, CrazySnake is a fun workout. With it, CrazySnake is a gym with a mirror — and a mirror changes how you train.

---

## The Three Surfaces

The dashboard lives across three distinct surfaces, each designed for a different emotional moment and cognitive state. Think of it like: **the locker room door** (Layer 1), **the mirror wall** (Layer 2), and **the training log** (Layer 3, future).

### Surface Overview

| Surface | When | Emotional State | Cognitive Budget | Design Goal |
|---------|------|-----------------|------------------|-------------|
| **Layer 1: Post-Game Highlights** | Immediately after death | Hot — adrenaline, frustration or triumph | Low (depleted from gameplay) | Celebrate, validate, motivate one more game |
| **Layer 2: Skill Map** | Between sessions, player-initiated | Cool — reflective, curious | Full (rested, exploratory) | Reveal growth, inspire targeted play |
| **Layer 3: Trends** *(future)* | Deep dive, player-initiated | Cool — analytical, invested | Full | Satisfy data curiosity, validate trajectory |

This is the **dual-moment architecture** from the Party Mode session — and it aligns perfectly with Knaflic's principle of designing for your audience's state. A hot-moment player needs a headline. A cool-moment player can handle a full skill profile.

---

## Surface 1: Post-Game Highlights (Layer 1 — Hot Moment)

### The User Story

Alex just died at score 67 during Reverse Controls. Heart rate elevated. The game-over screen fades in. Within 2 seconds, Alex should feel: *"My brain did something impressive"* — not *"I failed."*

### DataViz Principles Applied

| Principle | Application |
|-----------|-------------|
| **Cognitive Empathy** | Player just finished intense cognitive load. Working memory depleted. Present <= 3 chunks maximum. |
| **Narrative Integration** | Takeaway titles — the title IS the insight. "Survived 3 Reverse Controls" not "RC Stats." |
| **Signal-to-Noise** | Zero chartjunk. No charts at all. Pure text + icons. Every pixel celebrates. |
| **Aesthetic Affordance** | Retro pixel art style. Emotional warmth through comedy. This surface feels like CrazySnake, not a dashboard. |
| **Graphical Integrity** | Numbers shown are exact. "3 RC survived" means exactly 3. No rounding, no ambiguity. |

### Information Architecture

```
┌─────────────────────────────────────────────┐
│              YOUR SCORE                      │
│                  67                          │  ← 64px hero, neon white
│          ★ NEW HIGH SCORE ★                 │  ← gold, conditional
│ ──────────────── RECAP ─────────────────── │  ← 12px label, border-top
│ [icon] Reverse Controls survived: 3          │  ← left-aligned
│ [icon] Phone calls managed: 6                │  ← left-aligned
│ [icon] Best combo: x24                       │  ← left-aligned
│ ┌────────────────────────────────────────┐  │
│ │ "Your prefrontal cortex just filed a   │  │  ← quote card (border-left)
│ │  pull request. Merged without          │  │
│ │  conflicts."                           │  │
│ │ [portrait] — Kernel Sanders            │  │  ← 32px portrait, left-aligned
│ └────────────────────────────────────────┘  │
│  Session 4/5 — Warming up...                 │  ← calibration only (no streak)
│  ┌──────────────┐  ┌──────────────┐         │
│  │  PLAY AGAIN  │  │  SKILL MAP   │         │  ← appear immediately (no delay)
│  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────┘
```
_V5 redesign (2026-02-18): GAME OVER title removed, score is hero, streak removed from game-over, buttons appear immediately._

### Design Specifications

**Highlight Selection (FR162-163):**

The algorithm selects 2-3 highlights from a priority queue. This is a *narrative* decision, not just data sorting — we're telling the player the most interesting story about their brain this session.

| Priority | Trigger | Display Pattern | Narrative Purpose |
|----------|---------|-----------------|-------------------|
| 1. Personal Best | Any tracked stat exceeds all-time high | "[stat]: NEW PERSONAL BEST!" | Competence rush — SDT core need |
| 2. Biggest Improvement | Largest positive delta from rolling 10-session average | "[stat] up [%] this session" with up-arrow | Growth visibility — counter negativity instinct |
| 3. Notable Event | Threshold crossed (e.g., first combo, 5+ RC survived) | "[stat] — [achievement phrase]" | Surprise + delight — emotional peak |
| 4. Growth Opportunity | Weakest domain that the player engaged with | "[domain] — time to level up" | Gentle forward pull — autonomy nudge |

**Variety enforcement:** Never show the same priority pattern two sessions in a row. If last session was Personal Best + Notable Event, this session must include at least one different priority type. This prevents the highlights from feeling templated.

**Highlight Display — Visual Design:**

- **Font:** Jersey20, matching game aesthetic
- **Size:** 18-20px for highlight text. 14px for caller quote.
- **Color:** White text on dark semi-transparent overlay (game board visible behind, dimmed)
- **Icons:** Small pixel-art icons for each cognitive domain (16x16px):
  - RC survived = orange lightning bolt
  - Phone calls managed = phone icon
  - Mystery foods = question mark with sparkle
  - Combo multipliers = multiplication sign
  - Pick Up streak = ascending arrows
  - Peak combo = star burst
- **Caller quote:** Indented, italicized, caller name right-aligned with small portrait (32x32px, half the in-game size)

**Timing (FR168-169):**

```
t=0.0s    Score hero + buttons appear immediately
t=0.3s    "RECAP" header fades in
t=0.6s    Highlight 1 fades in (300ms stagger)
t=0.9s    Highlight 2 fades in
t=1.2s    Highlight 3 fades in (if 3 highlights)
t=1.5s    Caller quote fades in
t=1.8s    Calibration footer fades in (if applicable)
```
_V5 (2026-02-18): Buttons appear at t=0.0s (was t=3.3s). Streak counter removed from game-over screen._

Play Again is always the default-selected button (FR105). Skill Map disabled during calibration (sessions 1-4), enabled after.

**Streak Counter:**
- ~~Bottom of post-game screen~~ — **REMOVED from game-over (2026-02-18)**
- Streak data still tracked; visible in Skill Map dashboard only
- Format: flame icon + "12-day streak" in 12px Jersey20
- On streak break: "Rest day logged. Ready for another round?" (FR195)
- No red coloring, no warning visuals, no guilt (ethical guardrails per Celia)

**Calibration State (FR184):**
- During sessions 1-5: "Session 3/5 — Warming up..." in 12px below highlights
- Subtle pulsing animation on the progress counter (not flashy — just alive)
- After session 5: One-time celebration replacing calibration text — "Your Skill Map is ready!" with brief pixel-art fanfare (FR187-188)

### Responsive Behavior

- **Desktop:** Full-width within game container, centered
- **Mobile:** Stack all elements vertically. Buttons become full-width, stacked (Play Again on top per safe-choice priority). Touch targets minimum 44px (FR accessibility).

---

## Surface 2: Skill Map Dashboard (Layer 2 — Cool Moment)

### The User Story

Alex is about to start their daily session. Before hitting Play, they open the Skill Map from the main menu. They want to see: "What does my profile look like? Where have I improved? What should I focus on today?"

This is the *cool moment* — the player is rested, curious, and has their full cognitive budget available. They can handle more visual complexity here than on the hot-moment post-game screen.

### DataViz Principles Applied

| Principle | Application |
|-----------|-------------|
| **Graphical Integrity** | Block-based ratings with 0.1 precision (5 blocks, 10 segments each) are proportionally accurate. 3.7/5 shows as 3 full blocks + 70% fill on 4th block = 74% of max. No distortion. Horizontal fills are linear and proportional. |
| **Cognitive Empathy** | Full cognitive budget available, but still a casual gamer — not a data analyst. Max 6 data dimensions (the 6 domains). |
| **Signal-to-Noise** | No chart borders. No decorative elements. Bars + labels only. Background is the game's dark overlay, not a clinical white. |
| **Aesthetic Affordance** | Pixel block bars — grid-based, orthogonal, flat-color. Matches CrazySnake's square-everything visual language. Feels like an RPG stat screen, not a corporate dashboard. |
| **Narrative Integration** | Takeaway callouts: "Top Skill: Spatial Awareness" and "Level Up: Working Memory." The bars are the evidence; the callouts are the story. |

### Why Pixel Block Bars (Not Radar Chart)

A visual audit of CrazySnake's codebase revealed that the game's entire visual language is **grid-based and orthogonal** — every game element is a square on a grid. No curves anywhere. Flat primary colors. Double-border frames. Simple geometric shapes.

A radar chart (circular paths, curved segments, axis labels at tiny font sizes) would be the **only curved element in the entire game** — a drastic aesthetic violation. It would feel like dropping a Google Analytics widget into a Game Boy screen.

Pixel block bars satisfy the same DataViz requirements while staying inside CrazySnake's visual vocabulary:

| Requirement | Radar Chart | Pixel Block Bars |
|-------------|-------------|------------------|
| **Profile shape at a glance** | Hexagonal silhouette | Bar length pattern (tall/short bars tell the same story) |
| **Proportional representation** (Tufte) | Axis distance = value | Bar length = value |
| **Direct labeling** (Knaflic) | Labels on axes | Labels left of bars — even closer proximity |
| **Aesthetic match** | Curves — foreign to the game | Grid squares — native to the game |
| **Read speed** | ~5 seconds for 6 axes | ~3 seconds for 6 rows (vertical scan is faster) |
| **Accessibility** | Requires shape + color perception | Filled/empty squares distinguishable by shape alone |
| **Rendering** | Canvas or SVG (complex) | DOM elements (simple, consistent with existing overlays) |

**What we lose:** The elegant hexagonal silhouette where balance is visible as shape symmetry.
**What we gain:** Perfect visual consistency, faster reading, simpler implementation, and honestly — for a casual player checking stats between rounds, six horizontal bars are more immediately useful than a radar.

### Information Architecture

```
┌─────────────────────────────────────────────┐
│           🎯 YOUR SKILL MAP                  │
│                                              │
│  Reaction Time    ████░  4/5                 │
│  Spatial          █████  5/5  ★              │
│  Flexibility      ███░░  3/5  ▲              │
│  Attention        ████░  4/5                 │
│  Impulse          ███░░  3/5                 │
│  Working Memory   ██░░░  2/5  ↑              │
│                                              │
│  ─────────────────────────────────────────   │
│                                              │
│  ★ Top Skill: Spatial Awareness              │
│    "Your snake navigates like it has GPS."   │
│                                              │
│  ↑ Level Up: Working Memory                  │
│    "Combo mode is your gym. Get in there."   │
│                                              │
│  ─────────────────────────────────────────   │
│                                              │
│  Sessions: 47     Streak: 12 days 🔥         │
│                                              │
│  "Your neurons are doing the Electric        │
│   Slide. Keep it up!"                        │
│                              — DJ Algorithm  │
│                                              │
│  ┌──────────────┐                            │
│  │   PLAY NOW   │                            │
│  └──────────────┘                            │
│                                              │
│  ← Back to Menu                              │
└─────────────────────────────────────────────┘
```

### Pixel Block Bars — Design Deep Dive

The pixel block bar grid is the heart of the Skill Map. Each domain is a horizontal row of 5 square blocks — each with horizontal fill capability — creating a visual pattern that's instantly readable and native to CrazySnake's grid-based world.

**Evolution: From Integer to 0.1 Precision**

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Continuous bar (0-100%) | Precise | False precision — our metrics don't validate to that granularity. Violates Tufte's dimensional constraint. Smooth gradients break the pixel aesthetic. | Reject |
| 5-block integer (original) | Honest granularity. Instantly readable. Grid-native. Feels like an RPG stat screen. | Too coarse — doesn't show meaningful progress between whole numbers. | Good foundation |
| 10-block scale | More range | Too wide for the layout. Blocks become tiny. | Reject |
| **5-block + horizontal fills (0.1 precision)** | Maintains grid aesthetic + shows fine-grained progress. Honest precision (10 segments). Visual clarity via partial fills. | Slightly more complex rendering | **Implemented** |

The **5-block scale with 0.1 precision** (50 total segments: 5 blocks × 10 segments each) balances honest granularity with meaningful feedback. Showing "3.7/5" with a 70%-filled fourth block provides progress visibility without false precision — our rolling averages validate to this level of confidence.

**Block Bar Visual Specifications (v2 — 0.1 Precision with Horizontal Fills):**

- **Layout:** 6 rows, each containing: domain label (left-aligned) → 5 square blocks with fill capability (right-aligned) → rating text (e.g., "3.7/5") → optional indicator
- **Block size:** 16x16px per block, 2px gap between blocks. Total bar width: ~90px (5 blocks + 4 gaps).
- **Block shape:** Square — matches food shapes, grid units, and snake segments. No rounded corners on outer blocks.
- **Score scale:** 0.0 to 5.0 with 0.1 precision (50 total segments: 5 blocks × 10 segments per block)
- **Filled blocks (100%):** Purple theme color `rgb(157, 178, 221)` — solid fill, no gradient, no shadow.
- **Empty blocks (0%):** Dark grey `#3A3A3A` with subtle 1px border `#555555` — visible but receding. Reads as "potential" not "missing."
- **Partial blocks (1%-99%):** Dark grey container with purple horizontal fill bar
  - Container: Same as empty block (`#3A3A3A` + `#555555` border)
  - Inner fill: Purple bar (`rgb(157, 178, 221)`) fills from left to right
  - Fill width: Proportional to decimal value (e.g., 0.3 = 30% fill, 0.7 = 70% fill)
  - Smooth transition: 300ms ease-out when score updates
  - **Example:** Score 3.7 shows: [■■■■■] [■■■■■] [■■■■■] [■■■■··] [·····] (3 full + 1 at 70% + 1 empty)
- **Domain labels:** Jersey20, 14px, white, left-aligned. Abbreviated where needed:
  - "Reaction Time" → "Reaction" (or full if space allows)
  - "Spatial Awareness" → "Spatial"
  - "Cognitive Flexibility" → "Flexibility"
  - "Divided Attention" → "Attention"
  - "Impulse Control" → "Impulse"
  - "Working Memory" → "Memory"
- **Rating text:** "3.7/5" (one decimal place) in 12px Jersey20, light grey `#B0B0B0`, right of the bar. Min-width: 38px to accommodate decimal. This is the only numeric representation — one instance per row, not redundant (Tufte: one encoding per data point).
- **Row spacing:** 8px vertical gap between rows. Enough breathing room for readability without wasting vertical space.
- **No borders around the bar section.** The bars create their own visual boundary (Gestalt: closure).

**Growth Indicators (after calibration, session count > 5):**
- **Improved domain:** Small green up-arrow (▲) `#81C784` to the right of the rating text
- **Stable domain:** No indicator (absence = stability)
- **Declined domain:** Small amber arrow (▽) `#FFB74D` — never red. Ethical guardrail: amber means "growth opportunity," not failure.
- Arrow appears only if change is >= 1 full block since last session (prevents noise from tiny fluctuations)
- **Top Skill marker:** Star icon (★) next to the highest-rated domain row, in gold `#FFC107`

**Visual Pattern Reading:**

The power of this layout is that the *length pattern across all 6 bars* tells the profile story at a glance — just like a radar chart's hexagonal shape, but in a form native to the game:

```
████░  ← Strong
█████  ← Strongest (★ marker)
███░░  ← Mid
████░  ← Strong
███░░  ← Mid
██░░░  ← Growth area (↑ marker)
```

A player with all bars at 3 is "balanced." A player with one long bar and one short bar has a clear specialty and growth target. The visual is intuitive without requiring any explanation — affordance through form.

### Callout Cards

Below the block bars, two callout cards provide the narrative layer (Knaflic's Step 6: Tell a Story):

**Top Skill Card:**
- Star icon (★) + "Top Skill: [Domain Name]"
- Comedy one-liner specific to that domain
- Purpose: competence validation (SDT)

**Level Up Card:**
- Up-arrow icon (↑) + "Level Up: [Domain Name]"
- Encouraging one-liner specific to that domain + the game mechanic that trains it
- Purpose: autonomy nudge — "here's what to focus on next" without mandating it
- NEVER say "weakest" — always "level up" or imply upward trajectory (ethical guardrails)

**Callout selection is dynamic** — recalculated each time the dashboard opens. If the player's profile changes between sessions, the callouts reflect the new state.

### Session & Streak Display

- Positioned below callouts, above the Play Now button
- Two metrics side by side: "Sessions: 47" and "Streak: 12 days" + flame icon
- Small, factual, not competing with the bars for attention
- Streak uses warm amber/gold color, not red (red = danger/failure in game context)

### Comedy Quote

- Rotating caller quote at the bottom, refreshes on each dashboard visit (FR200)
- Different quote pool than post-game highlights — dashboard quotes are reflective/motivational, not reactive
- Caller portrait (32x32px) + name + quote in italics
- Quote selection context-aware:
  - High overall profile → celebratory
  - Recent improvement → encouraging
  - Long streak → impressed
  - Returning after break → welcoming

### "Play Now" Button

- Always visible (FR179) — the dashboard is a launchpad, not a dead end
- Prominent, centered, same purple-blue active style as game buttons
- This is the critical call-to-action: the dashboard's job is to make the player want to play

### Calibration State (pre-unlock)

When Skill Map is accessed during calibration (sessions 1-5):

```
┌─────────────────────────────────────────────┐
│         🎯 YOUR SKILL MAP                    │
│                                              │
│  Reaction Time    ░░░░░                      │
│  Spatial          ░░░░░                      │
│  Flexibility      ░░░░░                      │
│  Attention        ░░░░░                      │
│  Impulse          ░░░░░                      │
│  Working Memory   ░░░░░                      │
│                                              │
│     Warming up...                            │
│                                              │
│     ████████░░░░░░░░░░  Session 3/5          │
│                                              │
│     "We're learning how you play.            │
│      A few more sessions and your map        │
│      will be ready."                         │
│                                              │
│  ┌──────────────┐                            │
│  │   PLAY NOW   │                            │
│  └──────────────┘                            │
│                                              │
│  ← Back to Menu                              │
└─────────────────────────────────────────────┘
```

- Progress bar uses the same purple theme color
- The empty block bars are visible as a placeholder — showing the structure of what's coming, with all blocks unfilled. Builds anticipation: "these will fill up once calibration completes."
- Tone is curious and warm, not clinical: "We're learning how you play."
- Play Now button still prominent — calibration is motivation to play, not a blocker

---

## Domain-Specific One-Liner Pools

Comedy quotes must be contextual to performance and domain. Here are example pools for each domain, organized by context:

### Top Skill Quotes

| Domain | Example Quotes |
|--------|---------------|
| Reaction Time | "Your reflexes have their own zip code — they arrive that fast." |
| Spatial Awareness | "Your snake navigates like it has GPS. No, wait — better than GPS." |
| Cognitive Flexibility | "Reverse Controls? Please. Your brain treats that like a warm-up." |
| Divided Attention | "Phone calls during gameplay? You multitask like you've got two brains." |
| Impulse Control | "You weigh risk like a Wall Street quant with nothing to lose." |
| Working Memory | "Combo mode? Your working memory eats those for breakfast." |

### Level Up Quotes

| Domain | Example Quotes |
|--------|---------------|
| Reaction Time | "Reaction Time is your next frontier — speed runs, here you come." |
| Spatial Awareness | "Spatial Awareness wants some love. Let that snake grow long and proud." |
| Cognitive Flexibility | "Reverse Controls is your gym. Get in there and flip some neurons." |
| Divided Attention | "Phone calls are your next level. Pick up more — you can handle it." |
| Impulse Control | "Impulse Control is cooking. A few more strategic Pick Ups and you'll level up." |
| Working Memory | "Working Memory is next on the list. Combo mode is calling your name." |

### Post-Game Performance Quotes (by context)

| Context | Example Quotes | Caller |
|---------|---------------|--------|
| High RC survival | "Your prefrontal cortex just filed a pull request. Merged without conflicts." | Kernel Sanders |
| Many phone calls managed | "Six calls managed? Your attention span just got a promotion." | Mona Tor |
| First combo survived | "First combo? That's your brain doing push-ups. It only gets stronger." | Al Gorithm |
| Died during RC | "Reverse Controls got you? That's the hardest exercise in this gym. Respect." | Floppy Phil |
| New personal best | "NEW PERSONAL BEST! Your neurons are doing a victory lap." | DJ Algorithm |
| Long Pick Up streak | "Five Pick Ups in a row? Your risk assessment cortex is JACKED." | Ada Loopback |
| Streak milestone | "12-day streak! Your brain has better attendance than most gym members." | Cache Money |

*(Full 21-caller quote pool to be expanded during implementation — minimum 3 quotes per context per caller for variety.)*

---

## Visual Design System Integration

### Color Palette

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary accent | Purple theme | `rgb(157, 178, 221)` / `#9DB2DD` | Block fills, borders, active buttons, streak flame |
| Background | Dark overlay | `rgba(0, 0, 0, 0.85)` | Dashboard/post-game background |
| Text primary | White | `#FFFFFF` | Headlines, stats, button text |
| Text secondary | Light grey | `#B0B0B0` | Caller quotes, session info, labels |
| Filled blocks | Purple theme | `#9DB2DD` | Achieved levels on skill bars |
| Empty blocks | Grey | `#3A3A3A` border `#555555` | Remaining potential on skill bars |
| Improvement arrow | Soft green | `#81C784` | Domain improvement indicator |
| Growth edge arrow | Amber | `#FFB74D` | Growth opportunity indicator (never red) |
| Streak flame | Warm gold | `#FFC107` | Streak counter icon |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Screen title | Jersey20 | 28px | Bold |
| Stat highlight | Jersey20 | 18-20px | Regular |
| Domain label | Jersey20 | 14px | Regular |
| Caller quote | Jersey20 | 14px | Italic |
| Session/streak info | Jersey20 | 12px | Regular |
| Calibration text | Jersey20 | 16px | Regular |
| Button text | Jersey20 | 18px | Bold |

### Z-Index Layers

Dashboard screens sit above the game canvas but below the phone overlay:

| Layer | Z-Index | Element |
|-------|---------|---------|
| Phone overlay | 400 | (unchanged) |
| Dashboard/Skill Map | 350 | New — above game, below phone |
| Tooltips | 300 | (unchanged) |
| Post-game overlay | 250 | Existing game-over screen, enhanced |
| Score popups | 200 | (unchanged) |
| Score display | 100 | (unchanged) |
| Game canvas | 0 | (unchanged) |

---

## Menu Integration with Current Game

### Current System Architecture

The game currently operates with three phases (`menu`, `playing`, `gameover`) managed by `game.js` and rendered by `main.js` via the `handleUIUpdate()` callback. All screens are DOM overlays over the game canvas, shown/hidden based on the active phase. Navigation uses Arrow Up/Down + Enter for keyboard, plus mouse/touch click.

**Current Main Menu** (`#menu-screen`):
```
┌─────────────────────────────────┐
│         Crazy Snake             │
│                                 │
│         [New Game]              │
│                                 │
│       Top Score: 78             │
└─────────────────────────────────┘
```
Single button. Top Score is a static display, not interactive.

**Current Game Over** (`#gameover-screen`) — V5 (2026-02-18):
```
┌─────────────────────────────────┐
│          YOUR SCORE             │
│              67                 │  ← 64px hero, neon white glow
│       ★ NEW HIGH SCORE ★       │  ← gold pulse, conditional
│ ───────── RECAP ─────────────  │  ← 12px, border-top rule
│  Reverse Controls survived: 4   │  ← left-aligned
│  Combo multipliers earned: 2    │  ← left-aligned
│  ┌─────────────────────────┐   │
│  │ "quote..." [portrait]   │   │  ← card treatment
│  └─────────────────────────┘   │
│   [Play Again]  [Skill Map]     │  ← visible immediately
└─────────────────────────────────┘
```
Two buttons visible immediately (no animation delay). Buttons were previously hidden until t=3.3s — removed per UX redesign.

### Phase System Extension

The dashboard adds one new phase: `'skillmap'`. The phase system becomes:

| Phase | Trigger | Screen | Exits To |
|-------|---------|--------|----------|
| `'menu'` | App load, Menu button | Main Menu | `'playing'`, `'skillmap'` |
| `'playing'` | New Game, Play Again, Play Now | Game Canvas | `'gameover'` |
| `'gameover'` | Snake death | Game Over + Highlights | `'playing'`, `'skillmap'`, `'menu'` |
| **`'skillmap'`** | **Skill Map button** | **Skill Map Dashboard** | **`'playing'`, `'menu'`** |

Phase transitions handled in `main.js` `handleUIUpdate()`, following the existing pattern: detect `phaseChanged`, show/hide the correct `#screen` DOM element.

### Updated Main Menu

```
┌─────────────────────────────────┐
│         Crazy Snake             │
│                                 │
│         [New Game]              │  ← Default selected (unchanged)
│         [Skill Map]             │  ← NEW (visible after calibration OR during calibration)
│                                 │
│       Top Score: 78             │
└─────────────────────────────────┘
```

**Skill Map button behavior:**
- **During calibration (sessions 1-5):** Button shows as "Skill Map (3/5)" — accessible but shows calibration placeholder screen. Creating curiosity: "what will my map look like?" This matches our design of calibration-as-anticipation-event.
- **After calibration:** Button shows as "Skill Map" — opens full pixel block bars dashboard.
- **Before first game ever:** Button shows as "Skill Map" — opens calibration screen showing "Session 0/5 — Play a game to start warming up!"

**Keyboard navigation:** Arrow Up/Down cycles through [New Game] → [Skill Map]. Enter activates. This uses the existing `navigateMenuOptions()` system in `input.js` — the button array for `phase === 'menu'` expands from 1 to 2 elements. No new navigation paradigm needed.

**DOM addition to `#menu-screen`:**
```html
<button id="skill-map-btn" class="menu-button">Skill Map</button>
```
Inserted between `#new-game-btn` and `#high-score-display`. Styled with the existing `.menu-button` class (purple-blue border, hover/active states identical to New Game).

### Updated Game Over Screen

```
┌─────────────────────────────────┐
│          YOUR SCORE             │  ← V5: no GAME OVER title
│              67                 │  ← 64px hero number
│       ★ NEW HIGH SCORE ★       │  ← conditional gold pulse
│ ────────── RECAP ────────────── │  ← border-top rule, 12px
│  ★ RC survived: 3 — NEW BEST!  │  ← left-aligned
│  ↑ Phone calls managed: 6      │  ← left-aligned
│  ✦ Best combo: x24             │  ← left-aligned
│  ┌──────────────────────────┐  │
│  │ "Your prefrontal cortex  │  │  ← quote card (border-left)
│  │  just filed a pull req." │  │
│  │ [portrait] — K. Sanders  │  │  ← 32px portrait, left-aligned
│  └──────────────────────────┘  │
│  Session 4/5 — Warming up...    │  ← calibration footer only
│   [Play Again]  [Skill Map]     │  ← immediate, no delay
└─────────────────────────────────┘
```
_Streak removed from game-over (2026-02-18). Streak visible in Skill Map only._

**Key changes to game over screen:**

1. **Skill Map replaces Menu as the second button.** Rationale: The game-over screen's purpose is to keep the player in the engagement loop — either playing again or checking their progress. "Menu" is a low-value exit; "Skill Map" is a high-value deepening. Menu is still reachable via ESC key (existing behavior) and from the Skill Map screen's "Back to Menu" link.

2. **Play Again remains the default-selected button** (FR105). The primary action is always "play again." Skill Map is the secondary action for the curious player.

3. **Enhanced cognitive stats section** builds on the existing `cognitive-feedback.js` implementation. The current system already:
   - Selects top 3 stats by priority
   - Formats into human-readable text
   - Animates with 300ms stagger per line

   What we enhance:
   - Add priority icons (★ for personal best, ↑ for improvement, ✦ for notable event)
   - Add comedy caller quote below stats (new element)
   - Add streak counter at screen bottom (new element)
   - Add calibration progress counter during sessions 1-5 (new element)
   - Variety enforcement: track last session's highlight pattern, ensure different mix

4. **Timing sequence** (updated from current):
   ```
   t=0.0s    Game over screen appears (score, high score indicator)
   t=0.3s    "RECAP" header fades in
   t=0.6s    Highlight 1 fades in
   t=0.9s    Highlight 2 fades in
   t=1.2s    Highlight 3 fades in (if applicable)
   t=1.5s    Caller quote fades in
   t=2.0s    [Play Again] and [Skill Map] buttons fade in
   t=2.0s    Streak counter and calibration text appear (no animation, just present)
   ```

**Keyboard navigation:** Arrow Up/Down cycles [Play Again] → [Skill Map]. Enter activates. ESC returns to menu (existing behavior preserved). The button array in `navigateMenuOptions()` for `phase === 'gameover'` changes from `[play-again-btn, menu-btn]` to `[play-again-btn, skill-map-gameover-btn]`.

**DOM changes to `#gameover-screen`:**
```html
<!-- Replace #menu-btn with #skill-map-gameover-btn -->
<button id="skill-map-gameover-btn" class="menu-button">Skill Map</button>

<!-- Add below buttons -->
<div class="post-game-footer">
  <span class="calibration-counter">Session 4/5 — Warming up...</span>
  <span class="streak-counter">🔥 12-day streak</span>
</div>
```

### Skill Map Screen (New)

```
┌─────────────────────────────────┐
│        🎯 YOUR SKILL MAP        │
│                                 │
│  Reaction Time    ████░  4/5    │
│  Spatial          █████  5/5  ★ │
│  Flexibility      ███░░  3/5  ▲ │
│  Attention        ████░  4/5    │
│  Impulse          ███░░  3/5    │
│  Working Memory   ██░░░  2/5  ↑ │
│                                 │
│  ★ Top Skill: Spatial Awareness │
│  ↑ Level Up: Working Memory     │
│                                 │
│  Sessions: 47    Streak: 12 🔥  │
│                                 │
│  "Your neurons are doing the    │
│   Electric Slide. Keep it up!"  │
│                 — DJ Algorithm   │
│                                 │
│          [Play Now]             │  ← Default selected
│        ← Back to Menu           │  ← Secondary action (text link or small button)
└─────────────────────────────────┘
```

**New DOM element** (`#skill-map-screen`):
Follows the same overlay pattern as `#menu-screen` and `#gameover-screen` — a full-screen `div` with `.hidden` class toggled by phase. Same dark background with purple-blue frame styling.

**Keyboard navigation:** Arrow Up/Down cycles [Play Now] → [Back to Menu]. Enter activates. ESC also returns to menu (consistent with existing ESC behavior across all phases).

**`handleUIUpdate()` addition for `phase === 'skillmap'`:**
- Hide `#menu-screen`, `#gameover-screen`, `#score-display`
- Show `#skill-map-screen`
- Trigger pixel block bars render and callout calculation
- Refresh comedy quote on each view

### Navigation Flow

```
┌──────────┐
│ MAIN     │
│ MENU     │──────────────────────────────────────────┐
│          │                                           │
│ New Game  │──→ [Gameplay] ──→ [Game Over]             │
│ Skill Map │──→ [Skill Map Dashboard]                 │
│           │     ↑     │         │    │               │
└───────────┘     │     │    Play Again │               │
     ↑            │     │         │    Skill Map        │
     │            │     │         ↓         │          │
     │            │     │    [Gameplay]      ↓          │
     │            │     │                [Skill Map]    │
     │           │     │                    │           │
     │           │     │               Play Now         │
     │           │     │                    │           │
     │           │     └────────────────────┘           │
     │           │                                     │
     └───────────┴──── ← Back to Menu ─────────────────┘
```

**ESC key behavior across phases:**

| Phase | ESC Action |
|-------|------------|
| `'menu'` | No action (already at menu) |
| `'playing'` | Pause game, show pause overlay (existing) |
| `'gameover'` | Return to menu (existing) |
| `'skillmap'` | Return to menu (new — consistent with existing pattern) |

### Key Navigation Rules

- Skill Map is accessible from Main Menu AND from post-game screen
- Skill Map always has "Play Now" (starts new game) and "Back to Menu"
- Post-game always has "Play Again" (default selected) and "Skill Map" (replaces Menu)
- Menu is always reachable via ESC from any non-playing phase, and via "Back to Menu" on Skill Map
- No dead ends — every screen leads back to gameplay or menu
- No deep nesting — maximum 1 click from any screen to start playing
- Skill Map button visible on main menu even during calibration (shows calibration placeholder — builds anticipation)

---

## Responsive Design

### Desktop (primary)

- Dashboard renders within the game container width (same as canvas)
- Pixel block bars left-aligned within container, full width
- Callout cards below bars, full width
- Buttons centered, standard game button sizing

### Mobile (secondary)

- Full-width vertical stack
- Pixel block bars scale to fit viewport width minus margins (max 90vw)
- Block bars and ratings switch from beside-label to below-label if needed
- Buttons become full-width, 44px minimum height (accessibility)
- Caller quote wraps naturally
- Touch-friendly: no hover states, large tap targets

---

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Color independence | Dots are shape-based (filled vs empty circle), not just color-coded. Improvement arrows use direction + color. |
| Contrast ratios | All text meets 4.5:1 minimum against dark overlay background. Dot fills meet 3:1 minimum. |
| No rotated text | All labels horizontal. Domain names left-aligned beside their block bars. |
| Reduced motion | `CONFIG.REDUCED_MOTION` flag: disable pulse animations, instant transitions, no fade-in stagger on highlights. |
| Screen reader (future) | Skill bar data available as hidden structured text. "Reaction Time: 3 out of 5. Spatial Awareness: 4 out of 5..." |
| Touch targets | All buttons minimum 44px. Callout cards not interactive (read-only). |

---

## Design Validation Checklist

Before shipping any dashboard surface, verify against the DataViz Principles checklist:

### Layer 1 (Post-Game Highlights)

- [ ] **Graphical Integrity:** All numbers are exact counts, not rounded or approximated
- [ ] **Data-Ink Maximized:** No decorative elements. Every pixel celebrates or informs.
- [ ] **Cognitive Load:** <= 3 highlights + 1 quote. Player grasps the key insight in < 3 seconds.
- [ ] **Takeaway Title:** Each highlight IS the insight ("Survived 3 RC" not "RC Stats")
- [ ] **No Separate Legend:** Icons are directly adjacent to their stat text
- [ ] **Single Accent:** Personal Best highlight gets visual emphasis (larger, different color) over other highlights
- [ ] **Context Provided:** Stats shown with context where meaningful (e.g., "3 RC survived" not just "3")
- [ ] **Narrative Flow:** Eye flows top-to-bottom: score → highlights → quote → buttons
- [ ] **McCandless Complete:** Information (stats) + Story (highlights narrative) + Goal (play again) + Form (pixel art aesthetic)
- [ ] **Emotional Design:** Tone is celebratory. Zero-value stats never shown. Deaths framed as cognitive events, not failures.
- [ ] **Ethical:** No guilt messaging. No red warning colors. Streak break is gentle.

### Layer 2 (Skill Map)

- [ ] **Graphical Integrity:** Block ratings with 0.1 precision map proportionally to metric calculations. 3.7/5 = 74% exactly. Horizontal fills are linear and proportional (0.3 = 30% fill width).
- [ ] **Data-Ink Maximized:** No decorative borders on bars. Filled/empty blocks + labels + rating text only.
- [ ] **Cognitive Load:** 6 domains displayed, but narrative callouts focus attention on 2 (Top Skill + Level Up). Player grasps profile shape in < 5 seconds.
- [ ] **Takeaway Title:** Callout cards state the insight ("Top Skill: Spatial Awareness")
- [ ] **Direct Labels:** Domain names directly beside their block bars. No separate legend.
- [ ] **Single Accent:** Top Skill domain gets visual emphasis (star icon, bolder text)
- [ ] **Context Provided:** Session count and streak provide temporal context for the profile
- [ ] **Narrative Flow:** Eye flows: title → block bar pattern (gestalt first) → callout cards → session info → Play Now
- [ ] **McCandless Complete:** Information (6 metrics) + Story (callouts) + Goal (play now) + Form (retro pixel block bars)
- [ ] **Emotional Design:** Level Up framed positively. No "weakest." Comedy quotes motivate.
- [ ] **Accessible:** Dots encode via shape (filled/empty), not just color. All text horizontal.

---

## Implementation Notes for Dev

### Data Flow

```
gameplay events → cognitiveStats (game.js) → session storage (storage.js)
                                                      ↓
                                            metric calculation (new: metrics.js)
                                                      ↓
                                            dashboard rendering (new: dashboard.js)
```

### New Modules Anticipated

| Module | Responsibility | Module Boundary |
|--------|---------------|-----------------|
| `metrics.js` | Calculate 6 cognitive domain scores from raw session data. Pure functions. | No DOM access, no state mutation. Input: session data. Output: domain scores. |
| `dashboard.js` | Render Skill Map screen. DOM manipulation for dashboard overlay. | DOM access allowed (like phone.js). Reads metrics, doesn't calculate them. |
| `highlights.js` | Select post-game highlights based on priority algorithm. Pure functions. | No DOM access. Input: current session stats + history. Output: ordered highlight list. |
| `streak.js` | Track and calculate streak data. | localStorage access (like storage.js). Pure date logic. |

### Storage Schema (localStorage/IndexedDB)

```javascript
// Per-session record (IndexedDB)
{
  sessionId: 'uuid',
  timestamp: 1708000000000,
  score: 67,
  metrics: {
    reactionTime: { raw: 340, normalized: 0.65 },
    spatialAwareness: { raw: 0.42, normalized: 0.72 },
    cognitiveFlexibility: { raw: 0.78, normalized: 0.58 },
    dividedAttention: { raw: 0.85, normalized: 0.70 },
    impulseControl: { raw: 0.60, normalized: 0.55 },
    workingMemory: { raw: 0.45, normalized: 0.40 }
  },
  events: {
    rcSurvived: 3,
    rcEncountered: 4,
    phoneCallsManaged: 6,
    pickUps: 4,
    ends: 2,
    mysteryFoodsEaten: 5,
    comboMultipliers: 2,
    peakComboScore: 24
  }
}

// Aggregated profile (localStorage)
{
  domainScores: {
    reactionTime: 3,        // 5-dot scale
    spatialAwareness: 4,
    cognitiveFlexibility: 4,
    dividedAttention: 3,
    impulseControl: 3,
    workingMemory: 2
  },
  totalSessions: 47,
  calibrationComplete: true,
  currentStreak: 12,
  lastPlayedDate: '2026-02-15',
  highlightHistory: ['personal_best', 'notable_event']  // last session pattern
}
```

### Metric → Dot Mapping

Each metric produces a normalized 0-1 value from the rolling 10-session average. Mapping to 5-dot scale:

| Normalized Range | Dots | Visual |
|------------------|------|--------|
| 0.00 - 0.19 | 1 | ●○○○○ |
| 0.20 - 0.39 | 2 | ●●○○○ |
| 0.40 - 0.59 | 3 | ●●●○○ |
| 0.60 - 0.79 | 4 | ●●●●○ |
| 0.80 - 1.00 | 5 | ●●●●● |

These ranges should be calibrated against real gameplay data during playtesting. The goal: most players land at 2-3 dots after calibration, with room to grow to 4-5 through sustained play. If 50%+ of players hit 5 dots in any domain within 10 sessions, the range needs widening.

---

## Resolved Decisions (formerly Open Questions)

1. ~~**Radar chart rendering:** Resolved — using DOM-based pixel block bars. Grid-native, accessible, no Canvas needed.~~
2. **Calibration length:** **5 sessions.** Creates genuine anticipation, gives stable initial metrics, satisfying round number. Calibration counter shows "Session X/5 — Warming up..."
3. **Skill Map menu placement:** **Keep Top Score visible.** Main menu shows: [New Game] → [Skill Map] → Top Score display. Top Score is arcade legacy, Skill Map is the new cognitive identity — they coexist.
4. **Quote pool size (MVP):** **3 quotes per context per caller** (63 quotes minimum for 21 callers). Expandable to 5-7 per context post-MVP.

---

*UX Design prepared by Sally (UX Designer) for Tomoco on 2026-02-15.*
*"See what you pulled off. Come back tomorrow and level up."*
