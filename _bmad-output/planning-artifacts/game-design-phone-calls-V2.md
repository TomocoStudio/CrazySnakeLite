# CrazySnakeLite: Phone Call "Pick Up vs End" Enhancement System
## Game Design Document v2.0

**Designer:** Tomoco
**Analyst:** Celia (Neuro-Game Design Expert)
**Date:** February 7, 2026
**Status:** Design Complete — Ready for Story Breakdown

---

## Executive Summary

This document defines the "Pick Up vs End" phone call enhancement system that transforms the phone call interruption mechanic from a reflex-only disruption into a strategic micro-decision point. The system introduces:

1. **Two-button phone overlay** (End for safety, Pick Up for risk/reward)
2. **Fibonacci-based Pick Up bonus** escalating per consecutive pickup per game
3. **Score-based progressive discovery** (no calls until score 5)
4. **Score-based call frequency tiers** (calls get more frequent as score rises)
5. **Variable Pick Up timer** (1–3s random blur duration)
6. **Caller portraits** (64x64 retro pixel art per caller)
7. **Caller one-liners** (unique joke per caller, revealed only on Pick Up)

**Core Design Philosophy:** Score-based, NOT time-based. All progression, difficulty, and rewards are gated by player achievement (score thresholds), not survival time. Reward what the player *achieves*.

---

## 1. Design Blueprint

### 1A. Two-Button Phone Overlay Layout

```
+-------------------------------+
|                               |
|    [Retro Pixel Portrait]     |   <- 64x64px caller-specific portrait
|                               |
|    "Incoming call..."         |   <- Changes to one-liner on Pick Up
|       AL GORITHM              |
|                               |
|  (Space=End / Enter=PickUp)   |
|                               |
|   [End]        [Pick Up +N]   |   <- Two buttons, bonus value shown
|   +1 pt                       |
|                               |
|        [||||||||....]         |   <- Countdown bar (Pick Up only)
|                               |
+-------------------------------+
```

**Desktop controls:**
- Space Bar = End (highest priority, same as current)
- Enter Key = Pick Up (new binding)

**Mobile controls:**
- Tap "End" button = End
- Tap "Pick Up" button = Pick Up

### 1B. Decision Matrix

| Action | Points Awarded | Blur Duration | Risk Level | Reversible? |
|--------|---------------|---------------|------------|-------------|
| **End** | +1 (flat, always) | 0s (instant dismiss) | None | N/A |
| **Pick Up** | +2 to +34 (Fibonacci, per pickup count) | 1-3s (random) | Snake keeps moving under blur | No — committed once tapped |

### 1C. Fibonacci Pick Up Bonus — Per-Game Escalation

The Pick Up bonus follows the Fibonacci sequence based on **how many calls the player has picked up this game**. End is always +1.

| Pick Up # | Bonus | Fibonacci Position | Cumulative Pick Up Points |
|-----------|-------|-------------------|--------------------------|
| End (any) | +1 | — | — |
| 1st Pick Up | +2 | F(3) | 2 |
| 2nd Pick Up | +3 | F(4) | 5 |
| 3rd Pick Up | +5 | F(5) | 10 |
| 4th Pick Up | +8 | F(6) | 18 |
| 5th Pick Up | +13 | F(7) | 31 |
| 6th Pick Up | +21 | F(8) | 52 |
| 7th Pick Up | +34 | F(9) | 86 |
| 8th+ Pick Up | +34 (cap) | F(9) max | — |

**Why cap at +34:** At this level, a single Pick Up rivals eating 4 Reverse Controls foods (+8 each). Going higher would warp the scoring economy and make food-eating feel irrelevant. The cap keeps phone bonuses as a strong supplement, not the primary scoring strategy.

**Visual indicator:** The `[Pick Up]` button displays the current bonus value (e.g., `Pick Up +5`), so the player always knows what's at stake before deciding.

### 1D. Fibonacci Bonus Calculation Logic

```javascript
function getPickUpBonus(pickUpCount) {
  const fibonacci = CONFIG.PHONE_PICKUP_FIBONACCI;
  if (pickUpCount >= fibonacci.length) {
    return CONFIG.PHONE_PICKUP_MAX_BONUS; // Cap at 34
  }
  return fibonacci[pickUpCount];
}
```

### 1E. Score-Based Progressive Discovery

Aligned with the existing Fibonacci Scoring System design where Score 0-19 is the "Learning phase":

| Score Threshold | Phone Call Behavior | Rationale |
|----------------|-------------------|-----------|
| **Score 0-4** | No phone calls | Player is learning movement + food types. Cognitive load budget spent on base mechanics. |
| **Score 5+** | Phone calls active, End + Pick Up both available | Player has eaten 5+ foods, understands the food loop. Phone calls are the first "chaos layer" — introduced before blinking food (score 20). |

**Why score 5:** It's the Fibonacci value for Speed Boost — the player has likely encountered 2-3 different food types by this point and built a basic mental model. Introducing phones at this threshold means they arrive *after* food understanding but *before* blinking food (score 20), creating a clean progression of surprise:

```
Score 0-4:   Learn food -> movement -> scoring
Score 5-19:  Phone calls introduced (End + Pick Up)
Score 20+:   Blinking food introduced
Score 40+:   Combo mode introduced
```

Each new system arrives as the previous one becomes familiar — textbook scaffolded learning.

### 1F. Phone Call Frequency — Score-Based Intervals

All call frequency is driven by score thresholds, not game time:

| Score Range | Min Delay | Max Delay | Avg Calls/Min | Rationale |
|------------|-----------|-----------|---------------|-----------|
| 5-19 | 12s | 20s | ~3-4 | Introduction pace — learn the mechanic |
| 20-39 | 8s | 15s | ~4-6 | Blinking food coexists — moderate pressure |
| 40-59 | 6s | 12s | ~5-8 | Combo mode active — calls add to chaos |
| 60-99 | 5s | 10s | ~6-10 | Mastery zone — high pressure |
| 100+ | 4s | 8s | ~8-12 | Chaos mastery — relentless |

### 1G. Pick Up Timer — Variable Duration (1-3s)

When the player taps **Pick Up**:

1. Random duration generated: `1000 + Math.random() * 2000` (1-3 seconds)
2. Caller one-liner replaces "Incoming call..." text
3. Countdown bar appears (horizontal bar that shrinks left-to-right)
4. **Blur stays active** — snake continues moving
5. Timer expires -> auto-dismiss, Fibonacci bonus awarded, score updated
6. If player **dies during Pick Up** -> bonus **still awarded** (consolation reward)
7. Pick Up is **irreversible** — cannot End once committed
8. Pick Up button becomes disabled/hidden during the timer; replaced by the countdown bar

### 1H. Caller Portrait System

Each caller gets a unique retro pixel-art portrait (64x64px) displayed where the generic phone icon (`PhoneIcone01_256px.png`) currently renders.

**Fallback behavior:** If portrait asset not yet created, gracefully degrade to the generic phone icon via `onerror` handler on the `<img>` tag.

**Data structure:**

```javascript
const CALLERS = [
  {
    name: 'Al Gorithm',
    portrait: 'callers/al-gorithm.png',
    line: "Have you tried sorting your life out?"
  },
  // ... etc
];
```

### 1I. Caller One-Liner System

One-liners are **only displayed when the player Picks Up**. This makes humor a reward for risk-taking — players who always End never see the jokes, creating curiosity-driven motivation to Pick Up.

**Display behavior:**
- On Pick Up: `call-status` text changes from `"Incoming call..."` to the caller's one-liner
- Text appears with a brief fade-in (200ms) for readability
- Remains visible until the Pick Up timer expires

**Full One-Liner Roster (21 callers):**

| # | Caller | Pick Up One-Liner | Portrait Concept |
|---|--------|------------------|-----------------|
| 1 | Al Gorithm | *"Have you tried sorting your life out?"* | Nerdy professor with wild hair, thick glasses |
| 2 | Meg A. Byte | *"I'm running out of space for this call!"* | Big-haired 80s lady with floppy disk earrings |
| 3 | Ali Sing | *"Stop giving me mixed signals!"* | Smooth-talking radio DJ with headphones |
| 4 | Anna Log | *"Everything used to be simpler in my day..."* | Grumpy grandma with a rotary phone |
| 5 | Ray Tracing | *"I can see right through your strategy."* | Detective in trenchcoat with magnifying glass |
| 6 | Pat Ch-Notes | *"We need to fix a few things between us."* | Frazzled mechanic with wrench and duct tape |
| 7 | Mac Address | *"I'm calling from a very specific location."* | Shady spy in sunglasses pointing at a map |
| 8 | Artie Ficial | *"I'm not a real person, but I play one on TV."* | Robot with a fake mustache and human wig |
| 9 | Floppy Phil | *"I only have 1.44 MB to talk, so quick!"* | Chubby retro guy shaped like a floppy disk |
| 10 | Dot Matrix | *"You're looking a bit pixelated today."* | Dot-faced lady made of tiny squares |
| 11 | Gia Hertz | *"I'm vibrating with excitement to talk to you!"* | Energetic fitness instructor mid-jumping-jack |
| 12 | Terry Byte | *"I've got a LOT of data to share with you."* | Massive bodybuilder bursting out of a phone booth |
| 13 | Perry Pheral | *"I'm just on the side... don't mind me."* | Shy guy half-hiding behind a USB cable |
| 14 | Cade Ridger | *"Let me bridge the gap in your gameplay."* | Construction worker on a tiny code bridge |
| 15 | Mona Tor | *"I've been watching your every move..."* | Creepy eye peeking through a screen frame |
| 16 | Syd Ram | *"I forgot what I was gonna say... hold on..."* | Confused old man holding too many sticky notes |
| 17 | Bessie IOS | *"Moo-ve over, I'm updating!"* | Pixel cow wearing an Apple Watch |
| 18 | Dee Frag | *"Let me help you get your life together."* | Neat-freak librarian organizing tiny colored blocks |
| 19 | Buffy Ring | *"Hold on, I'm buffering..."* | Frozen mid-sentence with a loading spinner for a head |
| 20 | DJ Snake | *"Ssssomeone requested a remix of your game!"* | Cool snake wearing sunglasses and headphones |
| 21 | GAME OVER | *"Just checking if you're still alive..."* | Grim Reaper holding a tiny pixel phone |

### 1J. State Changes

```javascript
phoneCall: {
  active: false,
  caller: null,
  callerData: null,         // Full caller object {name, portrait, line}
  nextCallTime: 0,
  pickedUp: false,          // Currently in "picked up" state?
  pickUpEndTime: 0,         // When does pick-up timer expire?
  pickUpBonus: 0,           // Calculated Fibonacci bonus for this pickup
  pickUpCount: 0,           // Total pickups THIS GAME (drives Fibonacci index)
  graceActive: true         // No calls until score >= PHONE_GRACE_SCORE
}
```

### 1K. Config Additions

```javascript
// Phone call enhancement - Score-based system
PHONE_GRACE_SCORE: 5,                              // No calls until player reaches this score
PHONE_END_BONUS: 1,                                // Points for ending a call (flat)
PHONE_PICKUP_FIBONACCI: [2, 3, 5, 8, 13, 21, 34],  // Bonus per pickup #
PHONE_PICKUP_MAX_BONUS: 34,                         // Cap at F(9)
PHONE_PICKUP_MIN_DURATION: 1000,                    // Min pick-up blur time (1s)
PHONE_PICKUP_MAX_DURATION: 3000,                    // Max pick-up blur time (3s)

// Score-based call frequency tiers
PHONE_CALL_TIERS: [
  { minScore: 5,   minDelay: 12000, maxDelay: 20000 },
  { minScore: 20,  minDelay: 8000,  maxDelay: 15000 },
  { minScore: 40,  minDelay: 6000,  maxDelay: 12000 },
  { minScore: 60,  minDelay: 5000,  maxDelay: 10000 },
  { minScore: 100, minDelay: 4000,  maxDelay: 8000  },
]
```

### 1L. Integration with Existing Fibonacci Scoring Economy

Phone bonuses add directly to the unified score. Economy balance:

| Source | Min Points | Max Points | Frequency |
|--------|-----------|-----------|-----------|
| Growing Food | +1 | +1 | ~40% of food |
| Speed Decrease Food | +2 | +2 | ~15% of food |
| Wall Phase Food | +3 | +3 | ~10% of food |
| Speed Boost Food | +5 | +5 | ~15% of food |
| Reverse Controls Food | +8 | +8 | ~10% of food |
| Invincibility Food | 0 | 0 | ~10% of food |
| Phone End | +1 | +1 | Every call |
| Phone Pick Up | +2 | +34 | Player choice |
| Combo Mode | Varies | 40 (8x5) | Score 40+ |

**Economy analysis:** A player eating mostly Growing food (+1) earns ~1 point per food. A player picking up their 6th call earns +21 — equivalent to eating ~21 Growing foods or ~2.6 Reverse Controls. This is significant but requires surviving 6 blurred risk windows. The risk/reward scales proportionally: by the 6th Pick Up, the player's snake is long, the grid is tight, and 1-3 seconds of blindness is genuinely dangerous. The Fibonacci reward compensates for the Fibonacci-level risk.

---

## 2. Neuro-Psych Justification

### Fibonacci Escalation & The Endowment Effect
Once a player has picked up 3 calls (earning +2, +3, +5 = 10 bonus points), they feel *invested* in their pickup streak. The next call is worth +8. Walking away (pressing End for +1) feels like *losing* 7 potential points. This is the **endowment effect** — the player mentally "owns" the escalating bonus and is reluctant to give it up. Unlike exploitative applications of this principle (e.g., sunk cost in gacha games), here the player retains full agency, and the "cost" is gameplay skill, not money.

### Score-Based Thresholds & Mastery Orientation
By tying all progression to score rather than time, the system creates a **mastery-oriented** reward structure (Dweck's Mindset Theory). Players who improve their skills earn faster access to new systems. A player who reaches score 40 in 90 seconds experiences the same progression as one who takes 3 minutes — but the faster player feels the *compression* of new systems arriving rapidly, creating exhilaration. Time-based systems punish skilled players by making them wait; score-based systems reward them with density.

### Variable Duration (1-3s) & Uncertainty Stacking
The player faces three layers of unpredictability on every Pick Up: (1) *When* the call arrives (variable interval), (2) *How long* the blur lasts (1-3s), and (3) *Who's calling* (which portrait/joke). This triple-variable system is extraordinarily resistant to habituation — the player can never fully predict or optimize the experience, keeping it fresh across hundreds of games.

### Caller One-Liners as Information Reward
The one-liners function as an **epistemic reward** — the player gains *knowledge* (the joke) alongside *points* (the Fibonacci bonus). Research on curiosity (Kang et al., 2009) shows that satisfying information gaps activates the same dopamine pathways as monetary rewards. Players will Pick Up partly to *discover* what each caller says — creating a collectible-like drive embedded in a risk mechanic.

### Commitment & Consistency (Cialdini)
Making Pick Up irreversible (can't End once committed) leverages the psychological principle that committed decisions feel more meaningful. If players could bail out mid-Pick Up, the choice would feel hollow. The irreversibility transforms it from a casual tap into a *moment of commitment*.

### Consolation Reward (Loss Mitigation)
Awarding bonus points even on death during Pick Up is critical. It reframes the death from "I made a terrible choice" to "At least I got +13 points and heard Dot Matrix's joke." This subtle difference dramatically reduces frustration and maintains the "one more try" motivation loop.

### Prospect Theory (Kahneman & Tversky, 1979)
Humans are loss-averse — they feel losses ~2x more intensely than equivalent gains. The Fibonacci scaling compensates for this by making the Pick Up reward *increasingly* attractive as the game progresses. At high pickup counts (+21, +34), the potential gain starts to overcome loss aversion, creating genuine internal conflict. This is precisely calibrated tension.

### Attentional Blink & Divided Attention
The human brain cannot efficiently process two demanding tasks simultaneously. By keeping the snake moving under blur while demanding the player process the overlay, the system creates genuine **dual-task interference**. The resumption lag after dismissal — reorienting to "Where is my snake? Which direction? Am I about to hit a wall?" — is where most deaths likely occur.

### Humor as Tension Release (Berlyne's Arousal Theory)
The tech-pun caller names and one-liners provide **micro-moments of comedic relief** during high-stress events. This humor-during-danger pattern transforms frustration ("I died!") into a story ("I died because Floppy Phil only had 1.44 MB to talk!"). Humor is a primary engagement driver in CrazySnakeLite, not a side feature.

---

## 3. The Lenses of Schell

### Lens #32 — The Lens of Meaningful Choices
*"Are the choices I offer meaningful? Do outcomes significantly differ?"*

The Fibonacci escalation transforms the Pick Up decision from "is +3 worth it?" into a *streak management* decision: "I've picked up 4 calls — the next one is +13. Can I survive 1-3 seconds of blur with this snake length?" The choice complexity deepens with each successive call. **Verdict: The decision gets harder and more meaningful as the game progresses — exactly when it should.**

### Lens #5 — The Lens of Curiosity
*"What questions does my game put in the player's mind?"*

21 unique portraits + 21 unique one-liners = 21 micro-discoveries locked behind the Pick Up action. "What does Mona Tor look like? What does GAME OVER say?" This creates lateral motivation beyond pure scoring. **Verdict: Strong curiosity driver that rewards repeat play and risk-taking simultaneously.**

### Lens #38 — The Lens of Challenge
*"Is my game challenging enough without being too hard?"*

The variable timer (1-3s) means the player can't develop a fixed "survival strategy" for Pick Up. Each one is a unique challenge with unique duration. Combined with the increasing stakes (Fibonacci bonus), this creates a challenge curve that *never flattens*. **Verdict: The challenge stays fresh because no two Pick Ups are identical.**

---

## 4. UX Warning / Ethical Check

### Usability Warnings

**Warning 1 — Fibonacci Bonus Visibility (CRITICAL)**
The player must always see what they'll earn *before* deciding. Display the current Pick Up bonus on the button itself (e.g., `[Pick Up +8]`). Without this, the player is making a blind gamble, which shifts from "strategic risk" to "uninformed gambling." The bonus value is what makes the choice *meaningful*.

**Warning 2 — Mobile Button Layout**
Two buttons side by side on a small phone screen risk **accidental taps** — the player might hit Pick Up when they meant End (or vice versa). Ensure minimum 16px gap between buttons. Consider placing them vertically stacked on mobile (End on top, Pick Up below). End should be the more accessible button (closer to natural thumb position) since it's the "safe" choice.

**Warning 3 — Variable Timer Frustration Ceiling**
A 3-second blur with a long snake near walls could feel unfair. Consider reducing the max duration at very high scores (e.g., after score 100, timer becomes 1-2s instead of 1-3s). The bonus is already capped at +34, so the trade is fair.

**Warning 4 — Score Counter Clarity**
When a phone bonus is awarded, the score jump (+13, +21) may confuse players who expect score = foods eaten. Consider a brief floating "+13 CALL BONUS" text near the score display to explain the source.

**Warning 5 — Button Width Stability**
With bonus values displayed on the Pick Up button, the text length changes ("+2" vs "+34"). Ensure the button width accommodates the longest value without layout shift. Consider a fixed-width button.

### Engage-Ability Warnings

**Warning 6 — Streak Pressure & Frustration**
At high pickup counts, the Fibonacci bonus becomes so large (+21, +34) that pressing End feels *punishing* even though it's the safe choice. If a player dies on their 7th Pick Up (+34 at stake), they may feel the loss is disproportionate. **Mitigation:** The consolation reward (bonus still awarded on death during Pick Up) is essential. Never remove this.

**Warning 7 — Economy Balance at Extreme Play**
A theoretical maximum game with 8+ Pick Ups could earn 86+ bonus points from calls alone. At score 100+, that's a significant chunk. Monitor whether phone points ever exceed food points in actual play. Prediction: most players won't survive past 4-5 Pick Ups at high scores, so the theoretical maximum rarely applies in practice.

### Ethical Check: PASS

No dark patterns detected. The Fibonacci escalation rewards *skill and courage*, not money or time. The streak pressure is opt-in (player can always End for +1). Consolation rewards prevent loss-aversion exploitation. Humor rewards curiosity. The risk/reward is transparent, outcomes are clear, and the choice is always genuinely optional.

---

## 5. Complete Player Progression — Phone Calls Integrated

| Score | Food System | Phone System | Combo System | Player State |
|-------|------------|-------------|-------------|--------------|
| 0-4 | All visible, Fibonacci scoring | **No calls** | None | Learning basics |
| 5-19 | All visible | **Calls active** (12-20s), End+PickUp | None | Learning phone mechanic |
| 20-39 | 10-30% blinking | Calls tighter (8-15s) | None | Managing uncertainty |
| 40-59 | 30-40% blinking | Calls tighter (6-12s) | 10-20% combo chance | Peak complexity intro |
| 60-99 | 50-60% blinking | Calls tighter (5-10s) | 30-40% combo chance | Mastery zone |
| 100+ | 70-80% blinking | **Relentless** (4-8s) | 40-50% combo chance | Chaos mastery |

---

## 6. Implementation Notes

### Files Requiring Modification

| File | Changes |
|------|---------|
| `js/config.js` | Add all new config params (grace score, Fibonacci array, tiers, durations) |
| `js/phone.js` | Refactor CALLERS to object array with portraits/lines, add Pick Up logic, timer, Fibonacci calculation |
| `js/state.js` | Extend `phoneCall` state with new fields (pickedUp, pickUpEndTime, pickUpBonus, pickUpCount, graceActive) |
| `js/game.js` | Integrate Pick Up timer check in game loop, score-based grace period, tier-based scheduling |
| `js/input.js` | Add Enter key binding for Pick Up |
| `index.html` | Add Pick Up button to phone overlay, add countdown bar element |
| `css/style.css` | Style Pick Up button, countdown bar, layout for two-button overlay, mobile responsive |

### Assets Required

- 21x retro pixel-art portraits (64x64px PNG) — one per caller
- Fallback: generic phone icon already exists (`PhoneIcone01_256px.png`)

### Test Coverage Required

- Fibonacci bonus calculation (all positions + cap)
- Score-based grace period (no calls below score 5)
- Score-based tier selection (correct intervals per score range)
- Pick Up timer lifecycle (start, countdown, auto-dismiss)
- Consolation reward on death during Pick Up
- Pick Up irreversibility (End disabled during Pick Up)
- Portrait fallback (missing asset graceful degradation)
- One-liner display (only on Pick Up, not on End)
- Mobile touch targets (both buttons accessible)
- State reset on new game (pickUpCount resets to 0)

---

## 7. Design Principles Achieved

### Hodent's UX Framework

**Usability:**
- Signs & Feedback: Bonus value on button, countdown bar, one-liner display, score popup
- Clarity: Clear two-button layout, visible timer, distinct button labels
- Form Follows Function: "End" = stop/safe, "Pick Up" = engage/risk
- Consistency: Fibonacci pattern matches food scoring system
- Minimum Workload: Bonus value displayed — no memorization required

**Engage-Ability:**
- Competence (SDT): Fibonacci streak rewards sustained skillful play
- Autonomy (SDT): Genuine End vs Pick Up choice every call
- Emotion: Humor one-liners, portrait discovery, escalating tension
- Flow State: Score-based frequency ensures calls match current challenge level

### Schell's Elemental Tetrad

- **Mechanics:** Two-button choice with Fibonacci scoring — clean risk/reward fork
- **Story/Theme:** Retro pixel portraits + tech pun one-liners reinforce "chaotic retro phone" narrative
- **Aesthetics:** Portraits add visual variety; one-liners add personality; countdown bar adds tension
- **Technology:** All changes fit within existing DOM overlay system, no canvas modifications needed

### Sylvester's Designing Games

- **Emergence:** Simple rules (End vs Pick Up) create complex emergent decisions based on snake length, score, position
- **Emotion Engineering:** "I survived a 3-second blur at +21 for the win!" — peak shareable moments
- **Dopamine Loops:** Variable interval + variable duration + Fibonacci escalation = triple-layered engagement

---

## Approval Status

**Designer Sign-off:** Tomoco
**Analyst Approval:** Celia

**Status:** Design Complete — Ready for Story Breakdown

---

*Document prepared by Celia*
*Neuro-Game Design Expert*
*"Respect the player's brain. Design for humans, not for your ego."*
