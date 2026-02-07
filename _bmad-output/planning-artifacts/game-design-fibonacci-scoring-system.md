# CrazySnakeLite: Fibonacci Scoring & Progressive Complexity System
## Game Design Document v1.0

**Designer:** Tomoko
**Analyst:** Celia (Neuro-Game Design Expert)
**Date:** February 6, 2026
**Status:** Ready for Implementation

---

## 📋 Executive Summary

This document defines a three-phase progression system for CrazySnakeLite that introduces:
1. **Fibonacci-based scoring** that rewards difficulty with mathematically elegant point values
2. **Progressive blinking food** that gradually introduces unpredictability as player skill increases
3. **Combo mode system** that creates peak emotional moments through multiplicative scoring

**Design Philosophy:** Transform Snake from a simple arcade game into a skill-based progression system with emergent depth, using cognitive psychology principles to maintain flow state while escalating challenge.

---

## 🎯 PHASE 1: Fibonacci Scoring System

### Overview
Replace flat scoring with a Fibonacci-based reward system that creates proportional difficulty-to-reward ratios.

### Score Values

| Food Type | Color | Points | Difficulty Rationale |
|-----------|-------|--------|---------------------|
| **Invincibility** | Yellow | **0** | Pure safety net - no skill required, no reward |
| **Growing** | Green | **+1** | Baseline snake gameplay - standard difficulty |
| **Speed Decrease** | Cyan | **+2** | Easier/relaxing - gives cognitive breathing room |
| **Wall Phase** | Purple | **+1** then **+3** | Default +1, requires active wall interaction to gain value +3|
| **Speed Boost** | Red | **+5** | Challenging - less control, requires better reflexes |
| **Reverse Controls** | Orange | **+8** | Extreme challenge - motor conflict, high cognitive load |

### Cognitive Justification

**Why Fibonacci?**
- Each ratio (2/1, 3/2, 5/3, 8/5) approximates the Golden Ratio (φ ≈ 1.618)
- Creates perceptually harmonious difficulty progression
- Pattern is easy to memorize (reduces cognitive load)
- Feels "organic" rather than arbitrary

**Key Design Decisions:**

1. **Invincibility = 0 Points (Safety Tax)**
   - Early game: Players choose safety over points
   - Late game: Skilled players avoid it, increasing risk-taking
   - Creates emergent difficulty scaling based on player confidence

2. **Speed Decrease = +2 (Relief, Not Punishment)**
   - At high scores (long snake, blinking food, phone calls), slowing down is a GIFT
   - Provides parasympathetic nervous system activation (rest-and-digest)
   - Gives cognitive breathing room for strategic planning

3. **Speed Boost = +5 (High Reflex Challenge)**
   - Faster movement = less reaction time
   - Becomes increasingly difficult as snake length grows
   - Rewards execution under pressure

4. **Reverse Controls = +8 (Peak Difficulty)**
   - Requires executive function override of procedural memory
   - High cognitive load + motor conflict = maximum challenge
   - Creates memorable emotional moments when conquered

### Visual Feedback Requirements

**CRITICAL:** Score values must be displayed with salience proportional to value.

#### Score Pop-up Specifications:

| Points | Font Size | Color | Effects | Duration |
|--------|-----------|-------|---------|----------|
| +1 | Small (16px) | White | None | 500ms |
| +2 | Small (16px) | Light Green | None | 600ms |
| +3 | Medium (20px) | Yellow | Slight bounce | 700ms |
| +5 | Large (28px) | Orange | Bounce | 800ms |
| +8 | X-Large (36px) | Red/Gold | Bounce + screen shake (subtle) + particle effect | 1000ms |

#### Audio Feedback:
- Each score value needs distinct sound pitch (musical progression)
- +1: Soft beep (C note)
- +2: Soft chime (D note)
- +3: Mid chime (E note)
- +5: High chime (G note)
- +8: Triumphant chord (C major chord)

**Neuroscience Principle:** Temporal contiguity (<200ms delay) + multisensory encoding (visual + audio) = stronger reward prediction error = more dopamine release.

---

## 🎲 PHASE 2: Progressive Blinking Food System

### Overview
After score 20, food begins cycling through colors, hiding its effect type until consumed. Percentage of blinking food increases gradually with score.

### Blinking Probability Curve

| Score Range | Blinking Food % | Player State |
|-------------|-----------------|--------------|
| 0-19 | 0% | Learning phase - pattern recognition |
| 20-24 | 10% | Uncertainty introduction - occasional surprises |
| 25-29 | 20% | Strategic adaptation phase |
| 30-39 | 30% | Increasing unpredictability |
| 40-59 | 40% | Major uncertainty - half visible, half mystery |
| 60-79 | 50% | Equal predictability/chaos |
| 80-99 | 60% | Majority mystery - strategic retreat difficult |
| 100-119 | 70% | High chaos - expert territory |
| 120+ | 80% | Maximum chaos - peak mastery required |

### Blinking Behavior

**Visual Cycling:**
- Food cycles through all 6 colors in sequence
- Cycle speed: 200ms per color (5 colors/second - safe for photosensitivity)
- Pattern: Green → Yellow → Purple → Red → Cyan → Orange → repeat
- Effect type is LOCKED at spawn, but HIDDEN until consumed

**Alternative (Accessibility):**
- For "Reduce Motion" mode: Slow cycle to 500ms per color (2 colors/second)
- Or use alpha pulsing instead of color cycling

### Cognitive Justification

**Why Gradual Escalation?**
- Maintains **Flow State** (Csikszentmihalyi) - challenge must match rising skill
- Abrupt difficulty spikes break flow (frustration)
- Gradual escalation maintains flow (engagement)

**Why Mixed Predictability?**
- 100% predictable = habituation = boredom (no dopamine)
- 100% unpredictable = chaos = anxiety (can't learn)
- 50/50 at mid-scores = optimal arousal state

**Replayability:**
- Players discover new percentage thresholds each playthrough
- "How high does this go?" creates curiosity-driven replay

### Implementation Notes

- No UI indicator needed (players "feel" the escalation naturally)
- Blinking food uses same spawning probabilities as visible food (40% growing, 10% invincibility, etc.)
- First time blinking food appears (score 20), consider brief tooltip: "Mystery Food! Effect hidden until consumed"

---

## 🔥 PHASE 3: Combo Mode System

### Overview
At high scores, players can enter "Combo Mode" where two food effects combine for multiplicative scoring and visual transformation.

### Combo Trigger Mechanics

**Automatic Threshold-Based System:**

| Score Range | Combo Probability per Food Eaten |
|-------------|----------------------------------|
| 0-39 | 0% (combos disabled) |
| 40-59 | 10% |
| 60-79 | 20% |
| 80-99 | 30% |
| 100-119 | 40% |
| 120+ | 50% (cap) |

**Activation Sequence:**
1. When probability triggers after eating a food, **Combo Mode Activates**
2. Canvas background color changes (500ms smooth fade transition)
3. Current effect becomes "Effect A" (first effect)
4. Next food eaten becomes "Effect B" (second effect)
5. Score for food B = A × B (multiplicative)
6. Third food eaten = **Exit Combo Mode**, return to normal

**Example:**
```
Player at Score 85 (30% combo chance)
Eats Purple Wall Phase (+3) → RNG triggers (30% success!)
→ COMBO MODE ACTIVATED
→ Canvas fades to dark blue
→ Snake becomes solid purple
→ Player eats Orange Reverse (+8)
→ Snake becomes purple/orange striped
→ Score: 3 × 8 = 24 points! (huge "+24" popup)
→ Player eats Green Growing (+1)
→ Combo ends, canvas returns to light gray, snake returns to green
```

### Multiplicative Scoring Matrix

#### High-Value Combos:
| Food A | Food B | Score | Difficulty |
|--------|--------|-------|------------|
| Reverse (8) | Speed Boost (5) | **40** | Extreme - motor conflict + high speed |
| Reverse (8) | Wall Phase (3) | **24** | High - motor conflict + positioning |
| Reverse (8) | Speed Decrease (2) | **16** | High - motor conflict with slow timing |
| Speed Boost (5) | Wall Phase (3) | **15** | High - fast + positioning |
| Speed Boost (5) | Speed Decrease (2) | **10** | Medium - speed fluctuation |

#### Medium-Value Combos:
| Food A | Food B | Score | Difficulty |
|--------|--------|-------|------------|
| Wall Phase (3) | Speed Decrease (2) | **6** | Medium |
| Wall Phase (3) | Growing (1) | **3** | Low-Medium |
| Speed Boost (5) | Growing (1) | **5** | Medium |

#### Low-Value Combos:
| Food A | Food B | Score | Difficulty |
|--------|--------|-------|------------|
| Speed Decrease (2) | Growing (1) | **2** | Low |
| Growing (1) | Growing (1) | **1** | Lowest |

#### Zero-Point Combos:
| Food A | Food B | Score | Notes |
|--------|--------|-------|-------|
| Invincibility (0) | Any | **0** | Wasted combo opportunity |

**Design Note:** Zero-point combos are intentionally possible to create strategic tension. Players will learn to manage what food they eat before combo mode.

**Optional Mitigation:** Add flat +5 "Combo Entrance Bonus" to all combos so minimum combo = 5 points (even 0 × 1 becomes 5). This prevents "wasted combo" frustration. **Recommendation: Playtest both versions.**

### Visual Design: Striped Snake (Recommended Implementation)

**Pattern: Alternating Segment Colors**

```
Effect A (First food): Body stripe color 1
Effect B (Second food): Head color + Body stripe color 2

Example (Reverse + Speed Boost):
Head: RED (Effect B - most recent)
Segment 1: ORANGE (Effect A)
Segment 2: RED (Effect B)
Segment 3: ORANGE (Effect A)
Segment 4: RED (Effect B)
...barber pole pattern
```

**Why This Visual?**
- ✅ No flicker/strobe (photosensitivity safe)
- ✅ Persistent visibility (recognizable at a glance)
- ✅ Semantic meaning (head = current scoring effect)
- ✅ Distinctive (no other state looks like this)
- ✅ Fast pattern recognition (spatial frequency detection ~50ms)

**Alternative Options (Not Recommended):**
- Option 1: Use invincibility blink speed → Too fast, causes eye strain
- Option 2: Change color each movement → Works, but striping is clearer

### Canvas Color Change

**Purpose:** Environmental state cue (context-dependent memory encoding)

**Color Options (Rotate randomly per combo):**
```
Normal Mode:  Light Gray (#E8E8E8) - current
Combo Mode:   Dark Purple (#4A148C)
              Dark Blue (#0D47A1)
              Dark Red (#B71C1C)
              Dark Green (#1B5E20)
```

**Transition:** 500ms smooth fade (not instant - respects visual cortex adaptation)

**Why Dark Colors?**
- Psychological signal: "Stakes are higher"
- Increases contrast with light snake colors (improves visibility)
- Creates visual variety (every combo feels different)

### Audio Feedback

**Combo Activation:**
- Dramatic SFX (8-bit orchestral hit or fanfare)
- Higher pitched than normal food sounds

**Combo Exit:**
- Deflating SFX (descending "wah wah" sound)
- Signals return to normal mode

**Combo Score Popup:**
- Use same audio principles as regular scoring but amplified
- 15+ points: Play special "jackpot" sound
- 30+ points: Play extended triumphant chord

---

## 🔗 Cross-System Interaction Rules

### Combo Mode + Phone Call Collision

When a phone call arrives during an active Combo Mode:

1. **Combo timer pauses** — the "third food exits combo" rule is suspended while the phone overlay is active
2. Phone overlay renders on top of the dark combo canvas (blur + dark background stack)
3. Player resolves the phone call (End or Pick Up) normally
4. After phone dismissal, combo mode resumes — the player still needs to eat food B (or food C to exit)
5. Combo canvas color remains visible *under* the phone blur as an ambient reminder

**Why pause combo during calls:** At score 40-60, combos are being *learned*. Forcing the player to manage a brand-new combo system AND a phone call simultaneously exceeds working memory limits (Miller's 4±1 chunks). Pausing the combo respects the player's cognitive budget. At score 100+, the phone calls are frequent enough that combo pauses create natural micro-breathers — this is a feature, not a bug.

### Visual Feedback Priority Hierarchy

When multiple visual events fire within 500ms of each other, apply this z-order:

| Priority | Event | Behavior |
|----------|-------|----------|
| 1 (highest) | Phone overlay | Always renders on top; is a modal interruption |
| 2 | Combo entrance/exit transition | Canvas fade delays 200ms if a phone call is active |
| 3 | Score popups | Queue with 300ms stagger — never show two popups simultaneously |
| 4 (lowest) | Snake color changes | Immediate, no queuing needed |

**Popup stagger rule:** If a combo score popup (+24) and a phone bonus popup (+13 CALL BONUS) would fire within 500ms, the phone bonus popup waits until the combo popup has been visible for at least 300ms. Popups stack vertically (combo above, phone below) if both are still visible.

### Death During Combo + Pick Up (Edge Case)

If the player dies while in Combo Mode AND during an active Pick Up blur:

- **Combo points: AWARDED** — if food B was eaten before death, the multiplicative score (A × B) is granted
- **Pick Up bonus: AWARDED** — consolation reward applies as normal
- **Both stack** — the player earns combo points + Pick Up Fibonacci bonus

**Rationale:** The player took maximum simultaneous risk (combo stakes + blur blindness). Rewarding courage even in death is consistent with the consolation reward philosophy and reinforces the unified risk/reward identity of the game.

---

## 🎮 Complete Player Progression Arc

### Phase 1: Learning (Score 0-20)
**Duration:** ~1-2 minutes for new players

**Game State:**
- All food colors visible and consistent
- No blinking, no combos
- No phone calls until score 5, then introduced at relaxed 12-20s intervals (see Phone Calls V2 design doc)

**Player Experience:**
- Learning color-effect associations
- Building motor memory (arrow key → direction)
- Discovering Fibonacci scoring values
- "Oh, orange gives +8 points! That's a lot!"

**Brain State:** Pattern recognition, procedural memory formation

**Emotion:** Curiosity, learning excitement

---

### Phase 2: Uncertainty (Score 20-40)
**Duration:** ~1-2 minutes for intermediate players

**Game State:**
- 10-30% blinking food (gradual increase)
- No combos yet
- Phone calls more frequent

**Player Experience:**
- Strategic decision-making: "Should I risk that blinking food?"
- Can't rely on pure memorization anymore
- Learning to assess risk vs. reward in real-time

**Brain State:** Executive function, risk assessment, prefrontal cortex engagement

**Emotion:** Tension, excitement, calculated risk

---

### Phase 3: Combo Introduction (Score 40-60)
**Duration:** ~1-2 minutes for skilled players

**Game State:**
- 30-40% blinking food
- 10-20% combo chance
- Phone calls frequent
- Canvas occasionally changes color
- Striped snake appears unexpectedly

**Player Experience:**
- "Wait, what just happened?! My snake is striped!"
- Discovery moment: "I'm in a different mode!"
- Learning combo mechanics through play
- Realizing multiplicative scoring potential

**Brain State:** Surprise, exploration, pattern discovery

**Emotion:** Surprise → excitement → mastery pursuit

---

### Phase 4: Mastery (Score 60-100)
**Duration:** ~2-3 minutes for expert players

**Game State:**
- 50-60% blinking food (half are mysteries)
- 30-40% combo chance
- Phone calls every 5-15 seconds
- Frequent canvas changes
- Long snake (collision risk high)

**Player Experience:**
- Juggling multiple variables simultaneously:
  - Mystery food (can't predict)
  - Combo opportunities (multiplicative scoring)
  - Phone interruptions (blur effect)
  - Long snake body (self-collision risk)
  - Speed/reverse effects (motor challenges)
- Peak skill expression
- Flow state (if skilled) or overwhelm (if not)

**Brain State:** Flow state, peak performance, high arousal

**Emotion:** Intense focus, flow, triumph when successful

---

### Phase 5: Chaos Mastery (Score 100+)
**Duration:** Only the top 5-10% of players reach this

**Game State:**
- 70-80% blinking food (almost everything is mystery)
- 40-50% combo chance (almost always in combo mode)
- Canvas changes constantly
- Phone calls relentless
- Snake very long (high collision risk)

**Player Experience:**
- Pure chaos management
- Survival mode with scoring optimization
- Cannot predict anything - pure adaptation
- High-stakes combo multipliers (8 × 5 = 40 points possible)
- Every food matters enormously

**Brain State:** Peak arousal, flow + emergence, mastery

**Emotion:** "This is impossibly hard but I'm DOING IT!" - peak experience

---

## 🛠️ Implementation Checklist

### Fibonacci Scoring
- [ ] Update CONFIG.js with new scoring values
- [ ] Implement score popup system with variable sizes/colors/effects
- [ ] Create audio files for each score value (C, D, E, G notes + chord)
- [ ] Add screen shake effect for +8 scores
- [ ] Test visual timing (<200ms from food consumption to popup)

### Blinking Food System
- [ ] Implement color cycling animation (200ms per color)
- [ ] Create probability curve based on score thresholds
- [ ] Lock effect type at spawn, hide until consumed
- [ ] Add "Reduce Motion" accessibility option (slower cycling or alpha pulse)
- [ ] First-time tooltip at score 20: "Mystery Food! Effect hidden until consumed"
- [ ] Test visual clarity at different cycle speeds

### Combo Mode
- [ ] Implement probability-based trigger system (10% at 40, cap at 50% at 120+)
- [ ] Create canvas color change system (4 dark colors, random selection)
- [ ] Implement 500ms smooth fade transition
- [ ] Code striped snake rendering (alternating segment colors)
- [ ] Set head color to Effect B (second food)
- [ ] Implement multiplicative scoring (A × B)
- [ ] Create combo entrance SFX (dramatic fanfare)
- [ ] Create combo exit SFX (deflating sound)
- [ ] Large score popup for combo results (15+ points needs special treatment)
- [ ] Third food eaten = exit combo mode logic
- [ ] Test combo interaction with blinking food (Does mystery + mystery combo work?)

### Optional: Combo Entrance Bonus
- [ ] DECISION: Add flat +5 bonus to all combos, or keep pure multiplication?
- [ ] If added: Update scoring display to show "(3 × 8) + 5 = 29"
- [ ] Playtest both versions, compare player feedback

### Optional: 1-Second Combo Grace Period
- [ ] DECISION: Keep fully automatic, or add player agency?
- [ ] If added: Canvas flash + "COMBO READY!" text
- [ ] If added: 1-second timer before activation
- [ ] If added: Allow player to dodge food to skip combo

### Audio System
- [ ] Create distinct sounds for each Fibonacci value
- [ ] Create combo activation fanfare
- [ ] Create combo exit sound
- [ ] Create "jackpot" sound for 15+ point combos
- [ ] Create "legendary" sound for 30+ point combos
- [ ] Test audio mixing (doesn't clash with movement sounds)

### Visual Polish
- [ ] Particle effects for +5 and +8 scores
- [ ] Subtle screen shake for +8 scores (test intensity)
- [ ] Glow effect on snake head during combo mode
- [ ] Test striped snake visibility at high speeds
- [ ] Test canvas color readability (snake must remain visible)
- [ ] Color-blind accessibility check (add shape coding if needed)

### Cross-System Interactions
- [ ] Implement combo timer pause when phone overlay is active
- [ ] Resume combo mode after phone dismissal (preserve combo state: Effect A, canvas color)
- [ ] Visual feedback queue system (300ms stagger for overlapping popups)
- [ ] Phone overlay z-order: always render above combo canvas transition
- [ ] Combo entrance/exit transition delays 200ms when phone call is active
- [ ] Death during combo + Pick Up: award both combo multiplier and Pick Up consolation bonus
- [ ] Test: phone call during combo at score 40-60 (combo learning phase)
- [ ] Test: rapid phone + combo + blinking food cascade at score 100+
- [ ] Test: visual popup stacking when combo score and phone bonus fire simultaneously

---

## 🧪 Playtesting Priorities

### Critical Questions to Answer:

1. **Fibonacci Scoring Feel**
   - Does Speed Decrease (+2) feel appropriately rewarding given it's "easier"?
   - Do players actively chase Reverse Controls (+8) at high skill levels?
   - Does Invincibility (0) create strategic trade-offs as intended?

2. **Blinking Food Balance**
   - Is 80% blinking at score 120+ exciting or overwhelming?
   - Do players notice the gradual escalation (10% → 80%)?
   - Is 200ms cycle speed comfortable, or does it need to be slower?

3. **Combo Mode Clarity**
   - Do players understand they're in combo mode immediately?
   - Is the striped snake visual clear enough?
   - Does the canvas color change effectively signal the state change?

4. **Combo Mode Emotion**
   - Does combo mode feel rewarding or frustrating when triggered unexpectedly?
   - Do "bad combos" (0 × 1, 1 × 1) feel like wasted opportunities?
   - Are 40-point combos (8 × 5) creating memorable peak moments?

5. **Difficulty Curve**
   - Is there a "wall" where players consistently die (score 40? 60? 80?)?
   - Does the progression feel smooth or does one phase feel too hard/easy?
   - Are expert players (120+ score) still engaged, or is it just chaos?

6. **Cognitive Load**
   - At high scores (80% blinking + 40% combo + phone calls), is it exciting or overwhelming?
   - Do players need breaks, or is the pacing manageable?
   - Does Speed Decrease food provide the intended "breathing room"?

### Metrics to Track:

- **Score Distribution:** What % of players reach 40? 60? 100? 120+?
- **Death Causes:** Wall, self-collision, or giving up?
- **Combo Frequency:** How many combos per game at different score ranges?
- **High-Value Combo Rate:** How often do players achieve 15+ point combos?
- **Replay Rate:** Do players immediately retry after death?
- **Session Length:** How long do players play before stopping?

---

## 🎯 Design Principles Achieved

### Hodent's UX Framework

**Usability (System Image Clarity):**
- ✅ Signs & Feedback: Score popups, canvas color, snake stripes, audio cues
- ✅ Clarity: Color coding, size scaling, sound pitch progression
- ✅ Form Follows Function: Fibonacci scoring matches difficulty perception
- ✅ Consistency: Pattern-based escalation (predictable unpredictability)
- ✅ Minimum Workload: Fibonacci sequence is easy to memorize

**Engage-Ability (Motivation & Emotion):**
- ✅ Competence (SDT): High scores reward skill, not luck
- ✅ Autonomy (SDT): Players choose safety vs. risk (invincibility vs. +8 reverse)
- ✅ Relatedness (SDT): Leaderboard potential (social comparison)
- ✅ Emotion: Combo mode creates peak emotional moments
- ✅ Flow State: Gradual difficulty curve maintains challenge-skill balance

### Schell's Elemental Tetrad

**Mechanics:**
- ✅ Core loop: Move → Eat → Score (unchanged)
- ✅ Risk-reward: Fibonacci scoring creates meaningful choices
- ✅ Emergence: Combo system creates unpredictable moments

**Story:**
- ✅ Implicit narrative: Player's journey from beginner (visible food) → master (chaos mode)
- ✅ Progression: Three distinct "acts" (learning → uncertainty → combos)

**Aesthetics:**
- ✅ Visual: Striped snake, canvas color changes, score popups
- ✅ Audio: Musical score progression, combo fanfares
- ✅ Retro: Maintains 8-bit aesthetic throughout

**Technology:**
- ✅ Scalable: Probability curves can be tuned post-launch
- ✅ Accessible: Reduce motion mode, color-blind considerations

### Schell's Lenses Applied

- **Lens of Surprise (#16):** Blinking food + random combo triggers
- **Lens of Challenge (#38):** Fibonacci scoring + escalating percentages
- **Lens of Flow (#14):** Gradual difficulty curve matches skill growth
- **Lens of Skill (#34):** High scores require execution, not luck
- **Lens of Risk Mitigation (#59):** Invincibility trade-off creates strategic depth
- **Lens of Meaningful Choices (#40):** Safety vs. score, chase vs. avoid

### Sylvester's Designing Games

**Emergence:**
- ✅ Simple rules (eat food, get points) → Complex outcomes (combo chains, multiplicative scoring)
- ✅ Player stories: "I got a 40-point combo during a phone call with reverse controls!"

**Emotion Engineering:**
- ✅ Peak moments: 40-point combos, surviving chaos mode
- ✅ Pacing: Tension (combo mode) → release (exit combo) rhythm

**Dopamine Loops:**
- ✅ Variable reward schedule: Fibonacci scoring + RNG combo triggers
- ✅ Surprise bonuses: Unexpected combos, high-value multipliers
- ✅ Ethical design: No monetization exploitation, pure skill-based progression

---

## 📚 Cognitive Psychology References

### Core Principles Applied:

1. **Flow State (Csikszentmihalyi)**
   - Challenge must match skill level
   - Clear goals (score milestones)
   - Immediate feedback (score popups)

2. **Self-Determination Theory (Deci & Ryan)**
   - Competence: Skill-based scoring
   - Autonomy: Strategic choices (invincibility vs. points)
   - Relatedness: Leaderboard comparison

3. **Loss Aversion (Kahneman & Tversky)**
   - Reframed "negative" effects (speed decrease) as rewards (+2)
   - Prevents frustration from "punishment" mechanics

4. **Variable Ratio Schedule (Skinner)**
   - Combo triggers use probability-based rewards
   - Most effective reinforcement schedule for sustained engagement

5. **Context-Dependent Memory**
   - Canvas color changes encode "combo mode" as distinct mental state
   - Improves recall of high-scoring moments

6. **Working Memory Limits (Miller)**
   - 2-effect combo limit respects 4 ± 1 chunk capacity
   - Prevents cognitive overload

7. **Temporal Contiguity**
   - Score popups <200ms after food consumption
   - Brain links cause → effect for reward learning

8. **Golden Ratio (Fechner)**
   - Fibonacci ratios approximate φ ≈ 1.618
   - Perceptually harmonious difficulty progression

---

## ✅ Final Approval Status

**Designer Sign-off:** Tomoko ✅
**Analyst Approval:** Celia ✅

**Status:** ✅ **READY FOR IMPLEMENTATION**

**Priority:** High (Core gameplay enhancement)

**Estimated Complexity:** Medium (2-3 week sprint)
- Week 1: Fibonacci scoring + blinking food
- Week 2: Combo mode mechanics + visuals
- Week 3: Polish, audio, playtesting

**Risk Assessment:** Low
- Builds on existing food system
- No new controls required
- Scalable difficulty curves (can tune post-launch)

---

## 🎮 Closing Notes

This system transforms CrazySnakeLite from a nostalgic Snake clone into a **skill-based progression game with emergent depth**. The three-phase structure (Learning → Uncertainty → Mastery) creates a natural narrative arc that respects player skill development.

The Fibonacci scoring is mathematically elegant and psychologically sound. The blinking food system prevents habituation. The combo mode creates peak emotional moments.

**This is player-centered game design at its finest.**

Now go build something beautiful. 🧠✨

---

*Document prepared by Celia*
*Neuro-Game Design Expert*
*"Respect the player's brain. Design for humans, not for your ego."*
