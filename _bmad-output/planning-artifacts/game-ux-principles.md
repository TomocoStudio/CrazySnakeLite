# CrazySnakeLite: Game UX & Cognitive Design Principles

## Foundational Design Reference

**Author:** Dr. Celia Hodent (Neuro-Game Design Expert)
**For:** Tomoco
**Date:** February 8, 2026
**Status:** Active Baseline
**Source:** Derived from *The Gamer's Brain: How Neuroscience and UX Can Impact Video Game Design* (Hodent, 2018), applied to CrazySnakeLite's design context.

---

> **Purpose:** This document is the cognitive science and UX baseline for all game design decisions in CrazySnakeLite. Every new mechanic, system, or change should be evaluated against these principles before implementation. When principles conflict with each other, the resolution should be documented and justified.

---

## Vision: Cognitive Fitness for the Age of AI

### The Thesis

Multiple studies — from MIT, Anthropic, and broader cognitive science research — highlight a pattern: as AI handles more of our daily cognitive tasks (planning, writing, problem-solving, navigation, decision-making), the human brain regions responsible for those functions receive less activation. This is not speculation — it follows the established neuroscience principle of **use-dependent plasticity**: the brain allocates resources to functions that are regularly demanded and prunes those that aren't.

GPS dependency reduces hippocampal spatial reasoning. Calculator dependency reduces mental arithmetic. Autocomplete reduces creative language production. AI coding assistants may reduce problem-decomposition skills. The pattern is consistent: **when an external tool handles a cognitive function, the brain's capacity for that function atrophies.**

### The Mission

CrazySnakeLite is a **cognitive fitness tool disguised as an arcade game**.

The entry point is deliberately familiar — Snake is one of the most universally known games ever made. Every player already knows the base mechanic. This zero-barrier entry is the front door to a progressively demanding cognitive training system.

The "twists" that CrazySnakeLite layers on top of classic Snake are not random features — they are **targeted cognitive exercises**:

| Cognitive Faculty | Why AI Threatens It | CrazySnakeLite Mechanic |
|---|---|---|
| **Decision speed** | AI provides instant answers; humans lose practice making quick decisions under perceptual load | Food spawns → commit to direction change — trains rapid decision-making |
| **Cognitive flexibility** | AI provides one answer; humans stop considering alternatives | Reverse Controls — must suppress learned motor patterns and remap |
| **Sustained attention** | AI handles monitoring; human attention spans shrink | Continuous snake navigation — look away and you die |
| **Working memory** | AI remembers everything; humans offload to tools | Managing food + effect + combo + phone = 4-item WM training |
| **Impulse control** | AI recommendations reduce self-regulation practice | Invincibility (0 pts) — resist the safe option. End vs Pick Up — resist the reckless option |
| **Decision-making under uncertainty** | AI provides data-backed certainty; humans lose ambiguity practice | Blinking food. Variable Pick Up timer (1-3s). Random combo triggers |
| **Rapid context-switching** | AI handles sequential tasks; humans do less task-switching | Phone call during combo mode = forced context switch under pressure |
| **Risk assessment** | AI quantifies risk; humans stop practicing intuitive judgment | Pick Up Fibonacci stakes — escalating risk/reward with imperfect information |
| **Pattern recognition** | AI identifies patterns; humans delegate observation | Food type identification by shape + color. Blinking food removes color cue |
| **Executive function override** | AI reduces need for self-directed behavior | Reverse Controls (+8) — suppress procedural memory, engage prefrontal cortex |

### The Design Consequence

This mission has concrete implications for every design decision:

1. **Difficulty is the product, not the obstacle.** A brain gym that doesn't challenge you doesn't work. CrazySnakeLite should always make the player's brain *work* — and make that work feel rewarding.

2. **The comfort zone must be short.** The brain doesn't grow in autopilot mode. New cognitive challenges should arrive before the player settles into routine.

3. **Challenge must be targeted, not chaotic.** A gym rotates muscle groups. CrazySnakeLite should challenge different cognitive faculties at different score ranges, not overwhelm all of them simultaneously.

4. **The player should feel their brain working.** Not through clinical language — through game feedback that acknowledges cognitive effort. After each game, the player should see evidence of what their brain accomplished.

5. **"Not easy to win" is a feature.** High scores must be *earned* through genuine cognitive effort. Easy wins produce no training effect.

### The Framing

CrazySnakeLite should **never** claim to be "scientifically proven brain training" (that's a claim we can't make and an ethical line we won't cross). Instead, the game communicates its identity through *experience*: "This game will challenge your brain in ways you don't expect." The player should *feel* the cognitive workout. The comedy, the scoring, the emotional peaks — these make the workout enjoyable. The difficulty makes it effective.

---

## Part I: Cognitive Foundations

These are the constraints of the human brain. They are not suggestions — they are biological realities that the game must design around.

### 1. Perception Is Constructed, Not Received

The brain does not passively record what is on screen. It actively constructs a mental image based on expectations, context, and prior experience.

**Implications for CrazySnakeLite:**

- **Food shapes must be instantly distinguishable.** Players moving at speed cannot afford to consciously decode what a food item is. Shape + color must communicate type within a single glance (~200ms). The current system (square, star, ring, cross, hollow square, X) leverages distinct silhouettes — this is correct and must be preserved.
- **Gestalt principles apply.** Similar-looking elements will be grouped mentally. Food items must contrast against the grid background. The snake must never visually merge with food or borders.
- **Blinking food intentionally violates perception.** The mystery food mechanic (cycling colors) deliberately removes the color cue, forcing reliance on shape alone. This is a designed difficulty increase — it must only appear after the player has had enough exposure to learn shape-type associations (score >= 20 is the current threshold, which is appropriate).
- **Affordances must be obvious.** Every interactive element (phone buttons, food items, directional inputs) must visually suggest its function without explanation. The Pick Up and End buttons on the phone overlay must look and feel like distinct, consequential choices.

**Principle:** If a player misreads a visual element, the failure is in the design, not the player. Playtest iconography and visual feedback with fresh eyes.

---

### 2. Working Memory Holds ~4 Items

Miller's Law (revised): humans can actively hold approximately 4 chunks of information in working memory at once. Exceed this and players drop information, make errors, and feel overwhelmed — all without understanding why.

**Implications for CrazySnakeLite:**

- **During active gameplay, the player's working memory is already occupied by:**
  1. Snake direction + upcoming turn
  2. Food position + type identification
  3. Active effect status (what's currently happening to me?)
  4. Score awareness / risk assessment

  This is already at capacity. Any additional cognitive demand competes for these slots.

- **Phone calls are a deliberate working memory interrupt.** The phone overlay forces a decision (Pick Up vs End) while the game continues running. This is the core tension — and it works precisely because it overloads working memory. But: the decision itself must be simple (two clear buttons, one clear trade-off). Never add a third phone option.
- **Combo mode adds visual complexity, not cognitive complexity.** The canvas color change and striped snake are *ambient* signals — they communicate combo state through aesthetics, not through information the player must actively process. This is correct. Never add combo-specific decisions or UI during active combo.
- **Score popups must be fast and disposable.** Players should feel the reward without needing to read it. The tiered visual system (size, color, particles) communicates magnitude pre-attentively. The 300ms stagger prevents popup pile-up that would demand sequential reading.

**Principle:** Every element added to the active gameplay screen must justify its working memory cost. If it doesn't serve one of the 4 slots above, it shouldn't be there.

---

### 3. Attention Is Selective and Fragile

Humans cannot attend to everything simultaneously. Attention is a spotlight — and it has a narrow beam. Inattentional blindness means players will literally not see things that are visible on screen if their attention is directed elsewhere.

**Implications for CrazySnakeLite:**

- **Players will miss food spawns if they're focused on navigating.** This is acceptable — it creates natural discovery moments. But critical information (active effect expiring, phone call arriving) must use salient cues that break through focused attention: sound, animation, screen-level visual change (blur for phone, canvas color for combo).
- **The phone ring must be a genuine attention interrupt.** It needs to cut through gameplay focus. Audio is the correct channel for this — sound bypasses visual attention filtering.
- **Misdirection is a valid design tool.** The blur effect during Pick Up is a perceptual challenge (reduced visual clarity) layered on an attention challenge (game still running). This double-load is intentional difficulty — it should feel daring, not unfair.
- **Consistency builds automaticity.** When controls and visual conventions are consistent, they become automatic and stop consuming attention. Never change the meaning of a visual cue, sound, or control mapping mid-game.

**Principle:** Guide attention deliberately. Use sound for interrupts, visual salience for spatial awareness, and consistency to reduce attention cost over time.

---

### 4. Intrinsic Motivation Outlasts Extrinsic Rewards

Self-Determination Theory (Deci & Ryan) identifies three psychological needs that drive lasting engagement:

| Need | Definition | CrazySnakeLite Expression |
|------|-----------|---------------------------|
| **Competence** | Feeling skilled, mastering challenges | Fibonacci scoring rewards harder foods proportionally. Combo mode rewards high-risk play. Score-gated progression ensures challenge scales with demonstrated ability. |
| **Autonomy** | Having meaningful choice | Pick Up vs End is a genuine risk/reward decision. Players choose their own risk tolerance. No forced paths. |
| **Relatedness** | Social connection, belonging | Comedy callers create a "cast of characters" the player develops affinity for. High score sharing (future). |

**The Undermining Effect:** Excessive extrinsic rewards (points, unlocks, badges) can actually *kill* intrinsic motivation. If a player is only chasing the next Fibonacci bonus and stops enjoying the snake movement itself, the reward system has backfired.

**Implications for CrazySnakeLite:**

- **Score is feedback, not the goal.** The score system should help the player feel how well they're doing. It should not become the only reason to play. The Fibonacci ratios are designed to feel *fair* and *earned* — not to create anxiety about missing points.
- **The comedy layer protects intrinsic motivation.** When a player picks up a call and reads "I've got a stack overflow... of pancakes!" from Floppy Phil, that moment is intrinsically rewarding regardless of the Fibonacci bonus. The humor is the real reward; the points are the mechanical justification.
- **Never punish the player for safe play.** Ending a call (+1) is always valid. It's less lucrative than Pick Up, but it must never feel like a wrong answer. The design respects player autonomy.

**Principle:** Design systems that make the *activity itself* feel good. Points and bonuses are the scorekeeper, not the entertainment.

---

### 5. Emotion Drives Memory and Decision-Making

Players don't remember mechanics — they remember how the game made them feel. Emotional events create lasting memories. The somatic markers theory (Damasio) shows that emotional associations guide future decisions before conscious reasoning engages.

**Implications for CrazySnakeLite:**

- **Peak emotional moments are the game's real product.** The moment a player picks up a call during combo mode, survives the blur, and sees a massive combo + call bonus stack — that is the story they tell. Design for these peaks.
- **Comedy creates positive emotional association.** Tech pun callers, silly one-liners, retro pixel portraits — these create warmth and affection for the game. A player who laughs will come back. A player who only scores will eventually stop.
- **Death must feel fair.** When a player dies, the emotional response should be "I messed up" (ownership) not "that was unfair" (blame). This requires: clear collision feedback, consistent rules, and no ambiguous edge cases. The consolation reward (Pick Up bonus awarded even on death during blur) softens death without removing its sting.
- **Near-misses are emotionally powerful.** A snake narrowly avoiding a wall, a combo expiring one food before completion — these create tension, relief, and "I'll try again" motivation. They are emergent and should not be artificially generated, but the systems should make them possible.

**Principle:** Design for emotional events. The feelings a player has during play are more important than the systems that generate them.

---

### 6. Learning Happens by Doing, Not by Reading

Behavioral psychology (operant conditioning), cognitive psychology (scaffolding), and constructivist learning all agree: people learn best through action with immediate feedback, not through instruction.

**Implications for CrazySnakeLite:**

- **No tutorial screens.** The game should be learnable through play. The first few foods should be growing (green, +1) — the simplest type. Effects introduce themselves one at a time as score increases.
- **Score-gated progression IS the onboarding system.** By unlocking phone calls at score 3, blinking food at score 15, and combo mode at score 40, the game naturally scaffolds complexity. The player learns each system by encountering it after they've begun mastering the previous layer. The comfort zone is deliberately short — the brain should start working within the first 30 seconds.
- **First-time tooltips for genuinely novel mechanics.** The mystery food tooltip ("Mystery Food!") on first encounter is correct — it labels a new concept without explaining it. The player then learns by eating it. One tooltip, one concept, at the moment of encounter.
- **Spacing effect for retention.** Concepts should recur at intervals, not be frontloaded. A player who encounters their second combo mode 30 seconds after the first will retain the mechanic better than if they read about combos in a help screen.

**Principle:** Teach through the game itself. If you need to explain a mechanic with text, the mechanic's feedback isn't clear enough.

---

## Part II: UX Framework

Two pillars must be satisfied for a compelling player experience. Both are necessary; neither is sufficient alone.

### Pillar A: Usability — "Can I Use This?"

Usability ensures the player struggles with *intended* challenges, not *unintended* friction. A usable game is one where the controls, interface, and feedback are transparent — the player thinks about what to do, never about how to do it.

#### Seven Usability Standards for CrazySnakeLite

| Standard | Definition | Application |
|----------|-----------|-------------|
| **Signs & Feedback** | Every action has a clear, immediate response | Food eaten = score popup + sound + visual change. Direction change = immediate snake response. Phone Pick Up = caller reveal + blur + timer bar. |
| **Clarity** | Information is easily perceptible | Food shapes are distinct silhouettes. Score is always visible. Effect status is communicated through snake color, not UI text. |
| **Form Follows Function** | Appearance suggests behavior | Red food (speed boost) = danger color = high risk/reward. Yellow food (invincibility) = caution/safety color. Purple border = constant visual anchor. |
| **Consistency** | Same inputs always produce same outputs | Arrow keys always move the snake. Space always ends a call. Enter always picks up. No context-dependent control remapping. |
| **Minimum Workload** | Reduce unnecessary cognitive/motor burden | No inventory management. No menus during gameplay. Two-button phone decision. Score calculated automatically. |
| **Error Prevention** | Prevent unrecoverable mistakes | 180-degree turn prevention (can't reverse into yourself). Grace period before first phone call. Consolation bonus on death during Pick Up. |
| **Flexibility** | Accommodate different players and contexts | Four keyboard layouts (Arrow, WASD, ZQSD, Numpad) + mobile touch. Reduced motion mode. Future: difficulty settings. |

**The Usability Test:** If a player fails because they didn't understand the controls, couldn't see the food, or didn't realize a phone call was ringing — that is a usability failure, not a skill failure. Fix it.

---

### Pillar B: Engage-Ability — "Do I Want to Keep Playing?"

Engage-ability is the emotional and motivational pull that keeps a player in the game. It is built on three sub-pillars:

#### B1: Motivation (SDT Applied)

- **Competence:** The Fibonacci scoring system creates a clear skill-to-reward mapping. Higher-risk foods yield more points. Combo mode amplifies skilled play. The player feels "I'm getting better" as their score naturally increases with mastery.
- **Autonomy:** Pick Up vs End. Risk appetite is the player's choice. No forced difficulty spikes. Score-gated progression means the player self-selects their difficulty through their own performance.
- **Relatedness:** The caller roster creates parasocial engagement. Players develop favorites. Comedy creates shared experience ("did you get the Al Gorithm call?"). Future: leaderboards, shared high scores.

#### B2: Emotion (Game Feel)

- **Game feel is in the details.** The snake's movement speed, the screen shake on big scores, the sound design, the particle effects on combo multipliers — these micro-interactions create the *feel* of the game. They are not cosmetic; they are core.
- **Comedy as emotional anchor.** The tech pun callers exist to make the player smile. A game that makes you smile during a tense moment creates emotional complexity — and emotional complexity creates memorable experiences.
- **Surprise and novelty.** Mystery food, random callers, unexpected combo activations — controlled unpredictability keeps the experience fresh across replays.

#### B3: Flow State

Flow (Csikszentmihalyi) is the state where challenge perfectly matches skill. The player is fully absorbed, loses track of time, and performs at their peak.

**CrazySnakeLite's Flow Architecture:**

```
Score 0-2:    Pure snake. Learning movement. Low challenge, building skill.
Score 3-14:   Phone calls begin. First decision layer. Brain starts working.
Score 15-39:  Blinking food appears. Uncertainty management layer.
Score 40-79:  Combo mode activates. Working memory + multiplicative thinking.
Score 80-99:  All systems active. Blinking caps at 60%. Flow state zone.
Score 100+:   Peak cognitive demand. Phone relentless. Combo at 35-40%.
              Targeted challenge across all cognitive faculties.
```

**Flow Disruption Signals (design must avoid):**

| Signal | Meaning | Fix |
|--------|---------|-----|
| Player dies repeatedly at same score | Difficulty spike | Smooth the progression curve at that threshold |
| Player ignores phone calls (always End) | Phone risk feels too high | Adjust blur duration or Fibonacci values |
| Player seems bored at low scores | Early game too simple | Comfort zone is already short (phone at 3, blink at 15) — investigate if food variety is sufficient |
| Player stops playing after one game | First session didn't hook | Ensure first phone call + comedy moment happens within 30 seconds |

---

## Part III: Design Decision Checklist

Use this checklist when evaluating any new mechanic, system change, or feature proposal.

### The Five-Question Filter

1. **Working Memory:** Does this add to the player's cognitive load during gameplay? If yes, what does it replace?
2. **Competence Feedback:** Does the player feel more skilled after engaging with this? Does the reward match the difficulty?
3. **Clarity:** Can a first-time player understand this within 3 seconds of encountering it?
4. **Flow Preservation:** Does this maintain the challenge-skill balance, or does it create a spike/valley?
5. **Emotional Impact:** What does the player *feel* when this happens? Is that the feeling we want?

### The Bias Check

Before finalizing any design decision, ask:

- **Curse of Knowledge:** "Am I assuming the player knows something they don't?"
- **Confirmation Bias:** "Am I only looking for evidence that supports this idea?"
- **Sunk Cost:** "Am I keeping this feature because we already built it, not because it's good?"
- **Ego-Centered Design:** "Am I designing for *my* enjoyment or the *player's* enjoyment?"

---

## Part IV: CrazySnakeLite Design Axioms

These are non-negotiable design rules derived from the principles above and the game's cognitive fitness mission. They override feature requests, personal preferences, and trend-chasing.

1. **Score-based, never time-based.** All progression, difficulty gating, and reward scheduling uses score thresholds. Time-based mechanics are prohibited. Reward what the player *achieves*, not how long they survive.

2. **Difficulty is the product.** CrazySnakeLite is a brain gym. The cognitive challenge *is* what the player came for — it just happens to be delivered through an incredibly fun game. Never soften difficulty without a cognitive science justification. Easy wins produce no training effect.

3. **Comedy is a system, not decoration.** The caller roster, one-liners, and tech puns are core engagement drivers. They receive the same design rigor as scoring or collision detection. Comedy makes the cognitive workout enjoyable. Cutting comedy to save scope is cutting a load-bearing wall.

4. **Two-choice maximum for real-time decisions.** During active gameplay, the player should never face more than a binary choice (Pick Up vs End, eat this food vs avoid it). Three-way decisions in real-time exceed working memory capacity under speed pressure.

5. **Teach by encounter, not by instruction.** Every mechanic must be learnable through a single encounter with clear feedback. If a mechanic requires a text explanation, it needs redesign, not better documentation.

6. **Intended challenge only.** Every player death should be attributable to a skill failure, not a UX failure. If a player dies because they misread the UI, that's a bug, not difficulty.

7. **Emotional peaks are the product.** The game ships memorable moments, not feature lists. A perfectly balanced scoring system that produces no emotional response has failed. A messy system that makes players gasp, laugh, and immediately hit "Play Again" has succeeded.

8. **Respect player autonomy.** Never force a player into a decision. Never punish a player for choosing safety. The risk/reward trade-off must always feel like *their* choice, not the game's demand.

9. **Targeted challenge over raw chaos.** A gym rotates muscle groups; CrazySnakeLite rotates cognitive demands. At high scores, each system should reach its peak at different score ranges, not all simultaneously. The player should always face a *dominant* cognitive challenge with supporting background challenges — never uniform maximum noise across all systems.

10. **The player should see what their brain accomplished.** After each game, provide brief cognitive feedback — not clinical metrics, but game-language acknowledgment of the cognitive effort: how many reverse control switches survived, how many phone calls managed, how many mystery foods decoded. This transforms death from "I failed" to "look what my brain just did."

---

## References

- Hodent, C. (2018). *The Gamer's Brain: How Neuroscience and UX Can Impact Video Game Design.* CRC Press.
- Csikszentmihalyi, M. (1990). *Flow: The Psychology of Optimal Experience.*
- Deci, E. L., & Ryan, R. M. (2000). Self-Determination Theory and the facilitation of intrinsic motivation. *American Psychologist, 55*(1), 68-78.
- Damasio, A. (1994). *Descartes' Error: Emotion, Reason, and the Human Brain.*
- Schell, J. (2008). *The Art of Game Design: A Book of Lenses.*
- Sylvester, T. (2013). *Designing Games: A Guide to Engineering Experiences.*

---

*This document is a living baseline. Update it when new cognitive science insights are validated through playtesting, or when design axioms are refined through development experience. Every update should cite the principle it modifies and the evidence for the change.*
