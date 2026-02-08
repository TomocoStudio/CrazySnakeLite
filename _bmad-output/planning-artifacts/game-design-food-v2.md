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

**Design Philosophy:** CrazySnakeLite is a **cognitive fitness tool disguised as an arcade game**. Transform the universally known Snake into a progressively demanding brain training system that targets cognitive flexibility, working memory, divided attention, and executive function — the faculties most threatened by AI-driven cognitive offloading. Every mechanic is a targeted cognitive exercise delivered through fun gameplay. See `game-ux-principles.md` for the complete vision and cognitive training map.

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
After score 15, food begins cycling through colors, hiding its effect type until consumed. Percentage of blinking food increases gradually with score, capping at 60% to maintain signal-to-noise ratio at high scores.

**Cognitive Training Target:** Decision-making under uncertainty. The player must act with incomplete information — exactly the skill that AI-assisted decision-making is eroding.

### Blinking Probability Curve

| Score Range | Blinking Food % | Player State | Cognitive Training |
|-------------|-----------------|--------------|-------------------|
| 0-14 | 0% | Learning phase - pattern recognition | Baseline motor + perception |
| 15-19 | 10% | Uncertainty introduction - occasional surprises | First uncertainty tolerance test |
| 20-29 | 20% | Strategic adaptation phase | Risk assessment with partial info |
| 30-39 | 30% | Increasing unpredictability | Comfort with ambiguity |
| 40-59 | 40% | Significant uncertainty - combo adds complexity | Multi-system uncertainty management |
| 60-79 | 50% | Equal predictability/chaos | Peak uncertainty challenge |
| 80+ | 60% | Maximum uncertainty (cap) | Sustained ambiguity management |

**Why cap at 60% (changed from 80%):** At 80% blinking, almost everything is mystery, and the player has so little information that decisions become effectively random — the brain enters reactive (amygdala-driven) mode rather than strategic (prefrontal-cortex-driven) mode. At 60%, 40% of food remains identifiable, preserving meaningful pattern recognition and strategic decision-making even at the highest scores. **A brain gym should always have a learnable skill dimension. Pure chaos is noise, not training.**

**Why start at score 15 (changed from 20):** The comfort zone must be shorter. By score 15, the player has eaten 15+ foods, encountered multiple types, and processed several phone calls (which now start at score 3). They have a solid mental model of the food system. Introducing uncertainty 5 points earlier shortens the "autopilot" window and engages the brain sooner. This follows the **progressive overload** principle — cognitive training requires working at the edge of capacity, not below it.

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
- First time blinking food appears (score 15), consider brief tooltip: "Mystery Food! Effect hidden until consumed"

---

## 🔥 PHASE 3: Combo Mode System

### Overview
At high scores, players can enter "Combo Mode" where two food effects combine for multiplicative scoring and visual transformation.

### Combo Trigger Mechanics

**Automatic Threshold-Based System:**

**Cognitive Training Target:** Working memory + multiplicative thinking under time pressure. Combo mode demands the player hold two effect types in mind, anticipate their interaction, and execute under the stress of a transformed environment.

| Score Range | Combo Probability per Food Eaten | Cognitive Load |
|-------------|----------------------------------|----------------|
| 0-39 | 0% (combos disabled) | N/A - other systems being learned |
| 40-59 | 10% | Introduction — learn the new system |
| 60-79 | 20% | Integration — manage combo with blinking + phone |
| 80-99 | 30% | Mastery — combo becomes a regular challenge |
| 100-119 | 35% | Expert — frequent but not dominant |
| 120+ | 40% (cap) | Peak — combo is regular but never the only challenge |

**Why cap at 40% (changed from 50%):** At 50%, the player spends more time in combo mode than out of it, diluting the "special event" feeling and overloading working memory alongside blinking food (60% cap) and relentless phone calls. At 40%, combo mode remains a *distinct peak experience* — the player enters it often enough to develop mastery but not so often that it becomes background noise. **Targeted challenge over raw chaos (Design Axiom #9).**

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

### Phase 1: Learning (Score 0-14)
**Duration:** ~1 minute for new players

**Game State:**
- All food colors visible and consistent
- No blinking, no combos
- Phone calls begin at score 3 at relaxed 12-20s intervals (see game-design-phone-calls-v2.md)

**Player Experience:**
- Learning color-effect associations
- Building motor memory (arrow key → direction)
- Discovering Fibonacci scoring values
- First phone call at score 3: "Wait, what's this? End or Pick Up?"
- "Oh, orange gives +8 points! That's a lot!"

**Brain State:** Pattern recognition, procedural memory formation, first divided attention challenge (phone calls)

**Cognitive Training:** Motor control, basic pattern recognition, first real-time decision (End vs Pick Up)

**Emotion:** Curiosity, learning excitement

**Design Note (shorter comfort zone):** The brain doesn't grow in autopilot. Phone calls arrive at score 3 — only 3 foods into the game — ensuring the player's brain is *working* within the first 30 seconds. The pure "relaxed learning" window is deliberately short. This follows the progressive overload principle.

---

### Phase 2: Uncertainty (Score 15-39)
**Duration:** ~1-2 minutes for intermediate players

**Game State:**
- 10-30% blinking food (gradual increase from score 15)
- No combos yet
- Phone calls more frequent (8-15s at score 20+)

**Player Experience:**
- Strategic decision-making: "Should I risk that blinking food?"
- Can't rely on pure memorization anymore
- Learning to assess risk vs. reward in real-time
- Phone calls add decision pressure alongside food uncertainty

**Brain State:** Executive function, risk assessment, prefrontal cortex engagement

**Cognitive Training:** Decision-making under uncertainty, risk tolerance, dual-system management (food uncertainty + phone decisions)

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

### Phase 5: Peak Cognitive Demand (Score 100+)
**Duration:** Only the top 5-10% of players reach this

**Game State:**
- 60% blinking food (cap — significant mystery but 40% still identifiable)
- 35-40% combo chance (frequent but not dominant)
- Phone calls relentless (4-8s intervals)
- Snake very long (high collision risk)

**Player Experience:**
- Every cognitive faculty under sustained demand
- Pattern recognition still meaningful (40% visible food enables strategy)
- Combo mode creates peak scoring moments (8 × 5 = 40 points possible)
- Phone calls force rapid context-switching during already-demanding gameplay
- Reverse Controls at this stage = the "heavy deadlift" of the cognitive gym

**Brain State:** Sustained prefrontal cortex engagement, flow state for skilled players

**Cognitive Training:** Full cognitive workout — simultaneous demands on working memory, attention, executive function, risk assessment, and context-switching. Unlike pure chaos, each demand remains *manageable individually* — the challenge is managing them *together*.

**Emotion:** "This is incredibly hard but I'm DOING IT!" — peak experience

**Design Note (targeted challenge, not raw chaos):** The previous design had all systems at maximum simultaneously (80% blinking, 50% combo, relentless phones). This created cognitive *noise* rather than cognitive *training*. The brain in noise mode enters amygdala-driven reactivity — surviving, but not learning. The revised caps (60% blink, 40% combo) ensure the player's prefrontal cortex stays engaged. **A brain gym should always have a learnable skill dimension at every difficulty level.** The player at score 150 should still be making *strategic* decisions, not just reacting randomly.

---

## 🧠 Reverse Controls: The Crown Jewel Mechanic

### Why Reverse Controls Is Special

Of all food effects, Reverse Controls (+8) is the most cognitively demanding — and the most aligned with CrazySnakeLite's brain-gym mission. It requires **executive function override**: the player must consciously suppress a deeply ingrained motor response (press right → go right) and replace it with the opposite (press right → go left). This engages the **prefrontal cortex** — the brain region responsible for critical thinking, decision-making, impulse control, and cognitive flexibility.

These are precisely the faculties that AI dependency threatens most. Reverse Controls is the "heavy deadlift" of CrazySnakeLite's cognitive gym.

### Mastery Recognition

When the player **successfully navigates a Reverse Controls effect** (eats the next food without dying while controls are reversed), the existing +8 popup celebration (40px font, particles, screen shake, C major chord) already provides strong feedback. This moment should feel like the peak achievement of any game session.

**Additional recognition (subtle, no extra points):**
- After surviving Reverse Controls, a brief text flash: **"RC SURVIVED"** appears beneath the +8 popup (12px, white, 400ms fade). This is a cognitive acknowledgment — the game sees what the player's brain just accomplished.
- The post-game cognitive feedback screen (see below) tracks total RC survivals as a headline stat.

**No bonus points added** — the +8 Fibonacci reward already compensates the difficulty. Adding more would distort the scoring economy. The recognition is *informational*, not *monetary*.

### Cognitive Science Rationale

Executive function override is one of the highest-demand cognitive tasks the human brain can perform. It requires:
1. **Inhibition** — suppressing the automatic motor response
2. **Task switching** — activating the reversed mapping
3. **Monitoring** — continuously checking that the reversed mapping is being applied
4. **Error correction** — recovering when the automatic response slips through

This is the same cognitive circuitry used for: resisting impulses, adapting to new situations, considering alternative perspectives, and solving novel problems. Training it through gameplay has direct transfer to real-world cognitive flexibility.

---

## 🏋️ Post-Game Cognitive Feedback

### Overview

After each game over, before the "Play Again" prompt, display 2-3 brief cognitive achievement stats. These transform the death screen from "you failed" into "look what your brain just did" — reinforcing the brain-gym identity without clinical language.

### Design

**Display: 3-second overlay after death animation, before Play Again button appears.**

**Stats shown (pick the top 2-3 most impressive from the session):**

| Stat | Display Text | Cognitive Faculty |
|------|-------------|-------------------|
| Reverse Controls survived | "Reverse Controls survived: 4" | Executive function |
| Phone calls managed | "Phone calls managed: 7" | Divided attention |
| Mystery foods eaten | "Mystery foods decoded: 12" | Decision under uncertainty |
| Combo multipliers earned | "Combo multipliers: 3" | Working memory + strategy |
| Pick Up streak | "Pick Up streak: 5" | Risk assessment + impulse control |
| Peak combo score | "Best combo: ×24" | Peak cognitive performance |

**Selection logic:** Show the 2-3 stats where the player performed best relative to the session. If the player survived 0 reverse controls, don't show that stat — only show achievements, never failures.

**Visual style:**
- Same Jersey20 font, 14px, white text with dark shadow
- Appears centered below the score display
- Fades in over 300ms, holds for 2.5s, fades out over 500ms
- Play Again button appears after stats fade

**Tone:** Celebratory, not clinical. These are achievements, not a medical report. The player should feel: "My brain did that."

### Cognitive Science Rationale

**Metacognitive feedback** — awareness of one's own cognitive processes — has been shown to improve learning and motivation (Flavell, 1979). By naming what the player's brain accomplished, the game creates a **self-efficacy loop**: "I can do hard cognitive tasks" → increased confidence → willingness to attempt harder challenges → improved cognitive fitness.

This also directly combats the narrative of cognitive helplessness that AI dependency can create. The player sees concrete evidence that their brain is capable and active.

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
- [ ] Create probability curve based on score thresholds (starts at score 15, caps at 60% at score 80+)
- [ ] Lock effect type at spawn, hide until consumed
- [ ] Add "Reduce Motion" accessibility option (slower cycling or alpha pulse)
- [ ] First-time tooltip at score 15: "Mystery Food! Effect hidden until consumed"
- [ ] Test visual clarity at different cycle speeds

### Reverse Controls Recognition
- [ ] Add "RC SURVIVED" text flash after surviving Reverse Controls effect (12px, white, 400ms fade)
- [ ] Track RC survival count per game session in gameState

### Post-Game Cognitive Feedback
- [ ] Track cognitive stats during gameplay: RC survivals, phone calls managed, mystery foods eaten, combo multipliers, pick up streak, peak combo score
- [ ] After death: display top 2-3 cognitive achievement stats (300ms fade-in, 2.5s hold, 500ms fade-out)
- [ ] Selection logic: show most impressive stats, never show zero-value stats
- [ ] Play Again button appears after stats fade

### Combo Mode
- [ ] Implement probability-based trigger system (10% at 40, cap at 40% at 120+)
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
   - Is 60% blinking at score 80+ (cap) providing the right challenge level?
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
   - At high scores (60% blinking + 40% combo + relentless phone calls), is the cognitive demand targeted or just noise?
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

## Closing Notes

This system transforms CrazySnakeLite from a nostalgic Snake clone into a **cognitive fitness tool with emergent depth** — a brain gym for the age of AI. The five-phase structure (Learning → Uncertainty → Combo Introduction → Mastery → Peak Cognitive Demand) creates a natural progression that systematically engages deeper cognitive faculties as the player demonstrates mastery.

The Fibonacci scoring rewards cognitive difficulty proportionally. The blinking food system trains decision-making under uncertainty. The combo mode trains working memory and multiplicative thinking. The Reverse Controls mechanic trains executive function override — the crown jewel of the cognitive gym. And the post-game cognitive feedback tells the player what their brain just accomplished.

**Difficulty is the product. Comedy makes it fun. Together, they build stronger brains.**

---

*Document prepared by Celia*
*Neuro-Game Design Expert*
*"Respect the player's brain. Train it. Make it laugh."*
