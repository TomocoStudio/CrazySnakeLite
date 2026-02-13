# Cognitive Analytics Requirements — CrazySnakeLite

**Authors:** Celia (Neuro-Game Design Expert) with Winston (Architect)
**For:** Tomoco
**Date:** February 8, 2026
**Status:** Ready for Implementation
**Context:** Behavioral analytics framework for validating the Brain Gym thesis. Defines *what* to measure and *why* — not technical implementation.

---

## Purpose

Track **cognitive engagement**, not just player engagement. John's analytics spec (Feb 1) measures whether players are playing and replaying. This document measures whether the five cognitive challenge systems are actually training the faculties they claim to train — and whether players perceive CrazySnakeLite as a cognitive workout.

**Reference Documents:**
- `game-ux-principles.md` — Cognitive science baseline (MANDATORY)
- `analytics-requirements.md` — John's technical analytics spec (Tier 1 events)
- `prd.md` — PRD v2.0 success criteria

**Philosophy:** "We improve only what we measure." But we must measure the *right things*. Not button clicks — behavioral signatures of cognitive engagement.

---

## The Seven Validation Questions

Each question tests whether a specific cognitive training layer is calibrated correctly. Together they form a complete validation framework for the Brain Gym thesis.

---

### Q1: "Is the Difficulty Curve Producing Flow?"

**Cognitive Basis:** Csikszentmihalyi's flow channel — challenge must scale with demonstrated skill. Too easy = boredom (no training effect). Too hard = frustration (player quits before reaching deeper layers).

**What to Measure:**

| Signal | What It Tells Us | Healthy Range |
|---|---|---|
| Score distribution across all games | Where players die most often | Bell curve centered around score 30-50, with a tail to 100+ |
| Death score by session number | Are players improving across sessions? | Median death score should increase session-over-session |
| Score milestone reach rates | What % of games reach each cognitive layer? | 90%+ reach score 3 (phones), 70%+ reach score 15 (blink), 50%+ reach score 40 (combo) |
| Time-to-death at each score range | Where do players slow down vs. speed through? | Even distribution = good. Sudden drops = difficulty spike |
| Immediate replay rate after death | Did the challenge feel compelling or frustrating? | 70%+ immediately hit Play Again |

**Red Flags:**
- Death clustering at a specific score threshold = difficulty spike (not a ramp)
- Replay rate drops sharply after deaths at certain scores = frustration, not challenge
- Score doesn't improve across sessions = player isn't learning (game isn't teaching)

**Tuning Levers:** Score thresholds in config.js, food probabilities, phone call intervals, blinking/combo percentages.

---

### Q2: "Is the Phone System Training Divided Attention?"

**Cognitive Basis:** Divided attention training requires that both tasks (navigating snake + making phone decision) demand genuine engagement. Self-Determination Theory requires that both choices (End and Pick Up) feel autonomous — neither should feel "wrong."

**What to Measure:**

| Signal | What It Tells Us | Healthy Range |
|---|---|---|
| Pick Up rate (Pick Ups / total calls) | Are players engaging with the risk? | 30-50% Pick Up rate |
| Pick Up rate by score range | Does risk appetite change with stakes? | Should increase as players gain confidence |
| Pick Up survival rate | Can players navigate blind? | 60-80% survive Pick Up |
| End reaction time | Are players panicking or deciding? | 800-1500ms = deliberate. <400ms = panic button |
| Pick Up → immediate death rate | Is Pick Up too punishing? | <15% die during the blur |
| Consecutive Pick Up streak distribution | Are players building confidence? | Mode at 2-3, tail to 5+ |
| Death during phone overlay (any action) | Is the phone mechanic itself unfair? | <20% of deaths occur with phone active |

**Red Flags:**
- Pick Up rate < 20% = reward doesn't justify risk → increase early Fibonacci values or reduce blur duration
- Pick Up rate > 60% = End feels like "losing" → End bonus too low or social pressure to maximize
- End reaction time < 400ms consistently = players aren't reading the caller → phone is noise, not engagement
- Death during Pick Up > 25% = blur too long or timing too harsh

**Tuning Levers:** Fibonacci Pick Up values, blur duration (1-3s), phone call frequency tiers, grace period score.

---

### Q3: "Is Blinking Food Training Uncertainty Tolerance?"

**Cognitive Basis:** Decision-making under uncertainty is one of the faculties most threatened by AI dependency. AI gives data-backed certainty; CrazySnakeLite gives "eat this thing and find out." Healthy uncertainty tolerance means engaging with ambiguity, not fleeing from it.

**What to Measure:**

| Signal | What It Tells Us | Healthy Range |
|---|---|---|
| Blinking food eat rate | Are players engaging with uncertainty? | 50-70% eaten (not avoided) |
| Blinking food eat rate by score | Does confidence with uncertainty grow? | Should increase from score 15 to 60+ |
| Avoidance behavior (died without eating available blinking food) | Are players so afraid of mystery they crash trying to avoid? | <10% of deaths with uneaten blink food |
| Time-to-eat blinking vs. normal food | Does uncertainty create hesitation? | Blinking food should take 1-3 more ticks to eat (slight deliberation) |

**Red Flags:**
- Eat rate < 40% = players avoid blinking food → mystery feels too punishing (too many bad outcomes)
- Eat rate > 80% = no hesitation → blinking food isn't creating genuine uncertainty
- Avoidance deaths > 15% = players crash trying to dodge blinking food → uncertainty creates harmful avoidance behavior

**Tuning Levers:** Blinking probability curve, food type distribution for blinking food, blinking food start score.

---

### Q4: "Is Combo Mode Training Working Memory?"

**Cognitive Basis:** Working memory holds ~4 items (Miller's Law, revised). During combo, the player manages: (1) snake navigation, (2) food position, (3) active effect, (4) combo state (which food am I on?). This is at the edge of WM capacity — the designed "managed overload."

**What to Measure:**

| Signal | What It Tells Us | Healthy Range |
|---|---|---|
| Combo completion rate (completed 3-food cycle / total combos triggered) | Can players manage the WM load? | 40-60% completion |
| Combo death rate (died during active combo) | Is combo overloading the brain? | <30% of combos end in death |
| Combo + phone simultaneous survival | Can players handle peak cognitive load? | 30-50% survive phone during combo |
| Combo score distribution | Are players getting meaningful multipliers? | Median combo score 6-16 points |
| Combo avoidance (player stops eating food to avoid combo activation) | Unhealthy fear response | Should be undetectable — combos are probabilistic, not avoidable |

**Red Flags:**
- Combo completion < 30% = too hard → extend combo food window or reduce phone overlap at combo learning phase
- Combo death rate > 40% = combo is a death sentence, not a challenge → reduce visual complexity
- Combo + phone survival < 20% = peak load exceeds WM capacity → extend combo pause during phone

**Tuning Levers:** Combo probability curve, combo canvas transition timing, combo pause behavior during phone.

---

### Q5: "Is Reverse Controls Training Executive Function?"

**Cognitive Basis:** Reverse Controls forces the prefrontal cortex to suppress learned motor patterns and remap — executive function override. This is the single most important cognitive faculty CrazySnakeLite trains, targeting the brain region most threatened by AI dependency.

**What to Measure:**

| Signal | What It Tells Us | Healthy Range |
|---|---|---|
| RC survival rate (ate next food / ate RC food) | Can players remap controls? | 30-50% survive (it's supposed to be hard) |
| RC survival rate over sessions | Is executive function improving? | Should increase 5-10% per session |
| RC avoidance rate (avoided orange food when visible) | Are players fleeing the hardest challenge? | <25% deliberate avoidance |
| Time-to-death after RC (ticks survived) | How long does the remap hold? | Median 5-10 ticks |
| RC survival rate by score range | Does mastery scale with progression? | Higher survival at score 50+ vs. score 10 |

**The Key Metric:** RC survival rate improvement across sessions is the single strongest indicator that CrazySnakeLite is genuinely training cognitive function. Track this carefully.

**Red Flags:**
- RC survival rate < 15% = too brutal → consider shorter RC effect duration
- RC survival rate > 60% = too easy → consider adding RC at higher speeds only
- RC avoidance > 40% = players are afraid of the best workout → need better reward signaling (+8 should feel worth it)
- No improvement across sessions = the mechanic isn't trainable → fundamental design issue

**Tuning Levers:** RC effect duration, RC food probability, +8 score value visibility, RC spawn frequency at different score ranges.

---

### Q6: "Does the Brain Gym Identity Land?"

**Cognitive Basis:** Metacognitive feedback (Flavell, 1979) — awareness of one's own cognitive processes improves learning and motivation. "Your Brain Today" exists to transform the death screen from failure into cognitive achievement recognition. If this identity doesn't land, we're just another arcade game.

**What to Measure:**

| Signal | What It Tells Us | Healthy Range |
|---|---|---|
| "Your Brain Today" view rate | Do players see the cognitive feedback? | 80%+ (when stats qualify for display) |
| Play Again delay after stats | Do players linger on the stats or rush past? | 1-3s extra dwell time = reading/absorbing |
| Session return rate (next day) | Did the experience create lasting engagement? | 30%+ return |
| Games per session | Do they come back for "one more workout"? | 2-4 games per session |
| Session timing patterns | When do players play? | Break-time clustering (10am, 2pm, 4pm) = cognitive break habit |

**The Holy Grail Signal:** If return rate is 30%+ AND session timing clusters around work breaks, CrazySnakeLite has become a **cognitive break habit** — players choosing Snake over scrolling because it makes their brain feel active. That validates the entire product thesis.

**Red Flags:**
- Stats view rate < 50% = players skipping cognitive feedback → framing doesn't resonate
- No return rate improvement = game is a novelty, not a habit
- Sessions only at lunch/end-of-day = entertainment break, not cognitive break (subtle but important)

**Tuning Levers:** Cognitive stats display timing, stat selection priority, stat framing language, Play Again button delay.

---

### Q7: "Is Comedy Driving Engagement or Just Decoration?"

**Cognitive Basis:** Humor functions as an epistemic reward (Kang et al., 2009) — satisfying curiosity activates the same dopamine pathways as monetary rewards. If one-liners are driving repeat Pick Ups, comedy is functioning as a dopamine loop that reinforces divided attention training. Players train their brains because they want to hear a joke.

**What to Measure:**

| Signal | What It Tells Us | Healthy Range |
|---|---|---|
| Pick Up rate for first call vs. subsequent calls | Does discovering one-liners drive future Pick Ups? | First call: lower Pick Up. Later calls: higher = curiosity loop working |
| Pick Up rate by caller | Do specific callers drive more engagement? | Some variation is healthy (favorites emerging) |
| One-liner dwell time (how long phone stays open after Pick Up completes) | Are players reading the comedy? | 500ms+ after countdown bar completes = reading |

**Red Flags:**
- Pick Up rate doesn't increase after first Pick Up = one-liners aren't compelling enough
- No caller variation in Pick Up rate = callers are interchangeable (no personality impact)
- Dwell time < 200ms = players aren't reading one-liners → comedy isn't landing

**Tuning Levers:** One-liner quality, caller personality diversity, one-liner display duration, portrait visual appeal.

---

## Priority Summary

**If you can only track three things, track these:**

1. **RC survival rate improvement across sessions** — direct evidence of executive function training
2. **Pick Up rate of 30-50%** — the autonomy and divided attention sweet spot
3. **Score milestone reach rates** (90% → 70% → 50%) — confirms the flow channel is working

If those three are healthy, the brain gym is working. Everything else is tuning.

---

## Relationship to John's Analytics Spec

John's `analytics-requirements.md` defines the technical event schema (5 core events + 1 optional). This document defines the *cognitive validation questions* those events must answer. The two documents are complementary:

| This Document | John's Document |
|---|---|
| Defines *what signals* to track and *why* | Defines *event schemas* and *implementation* |
| Cognitive science perspective | Engineering perspective |
| Organized by validation question | Organized by event type |
| Defines healthy ranges and red flags | Defines data schemas and dashboard queries |

**Next Step:** John's analytics spec needs updating to carry the additional context required by these 7 questions (e.g., isBlinking flag on food_eaten, action field on phone_call_dismissed, combo_active on game_over, RC encounter counts). Winston has architectural recommendations for this.

---

*"We measure not to judge the player, but to understand if the game is teaching what we designed it to teach."*
*— Celia, Neuro-Game Design Expert*
