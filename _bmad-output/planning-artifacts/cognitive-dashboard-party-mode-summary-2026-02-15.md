# CrazySnake Cognitive Dashboard — Party Mode Summary

**Date:** 2026-02-15
**Participants:** Mary (Analyst), Celia (Neuro-Game Designer), Sally (UX Designer)
**Facilitated for:** Tomoco
**Context:** Follow-up to Market Research on Player-Facing Cognitive Progress Tracking & Analytics

---

## Decisions Made

### 1. Six Cognitive Metrics — Tracked From Session One

| Metric | CrazySnake Mechanic | Measurement Approach |
|---|---|---|
| **Reaction Time** | Snake speed increases; wall/self avoidance | Rolling average of time between food spawn and first directional input toward it. Lower = better. |
| **Spatial Awareness** | Navigating growing snake in confined space | Ratio of max possible length vs. actual snake length at death. Higher = better. |
| **Cognitive Flexibility** | Reverse Controls effect — suppressing learned motor patterns | Performance ratio: RC score / normal score. Closer to 1.0 = stronger flexibility. |
| **Divided Attention** | Phone calls during gameplay — forced context switch | Composite: survival rate after phone + decision speed + score delta during calls. |
| **Impulse Control** | Pick Up vs End decision; Invincibility (0 pts) temptation | Weighted by context: picking up at high Fibonacci stakes = stronger impulse control. |
| **Working Memory** | Managing food + effect + combo + phone simultaneously | Score rate during combo vs. normal play. Accounts for simultaneous tracking demands. |

**Key principle:** These are real cognitive faculties exercised through actual gameplay — not abstract puzzles. The game itself IS the training.

**Ethical guardrail:** Never claim "scientifically proven brain training." Frame as: "See how your gameplay patterns reflect your cognitive strengths."

### 2. Dual-Moment Architecture

| | Post-Game (Hot Moment) | Dashboard (Cool Moment) |
|---|---|---|
| **Purpose** | Celebrate & reinforce | Reflect & motivate |
| **Tone** | Emotional, funny, fast | Analytical, inspiring, explorable |
| **Depth** | Layer 1 — 2-3 dynamic highlights | Layers 2-3 — full brain map + trends |
| **Trigger** | Automatic after game over | Player-initiated from menu |
| **Cognitive load** | Minimal — glanceable | Player-controlled depth |
| **Comedy** | Caller one-liners about performance | Achievement titles, milestone humor |
| **Retention hook** | "Play again?" impulse | "I want to improve X" pull |

### 3. Three-Layer Information Architecture

- **Layer 1 — Post-Game Summary (pushed):** 2-3 highlights max. Emotional, not analytical. Up/down arrows, personal bests, caller quotes.
- **Layer 2 — Brain Map (pulled):** Radar chart showing all 6 domains. Dot-based ratings (5 dots, filled/empty). Strongest/growth area callouts.
- **Layer 3 — Trends (deep dive):** Session-over-session graphs. Historical data. Streak tracking. Weekly reports.

**Design principle:** The game pushes Layer 1 to you, you pull Layers 2-3 when curious. Respects cognitive load while rewarding data-hungry players.

### 4. Calibration Period

- First 3-5 sessions build baseline before brain map unlocks
- Show "Calibrating..." state with session progress counter
- Brain map unlock is itself a motivational event (Lens of Curiosity)
- Avoids showing volatile early data that would undermine trust

### 5. Post-Game Dynamic Highlight Selection Logic

| Priority | Show When | Example |
|---|---|---|
| **Personal Best** | Any metric hits all-time high | "Reaction Time: NEW PERSONAL BEST!" |
| **Biggest Improvement** | Largest positive delta from rolling average | "Spatial Awareness up 15% this session" |
| **Notable Event** | Something remarkable happened | "Survived 4 phone calls — brain on fire" |
| **Growth Opportunity** | Weakest domain (gentle nudge) | "Working Memory is your growth edge" |

Never more than 3 highlights. Never the same pattern twice in a row.

### 6. Technical Approach

- **Local-first storage** — localStorage/IndexedDB, no account required
- **Privacy by default** — no server needed, no cloud data
- **Optional social sharing** — shareable brain map card

### 7. Comedy Integration

- Caller quotes in post-game AND dashboard
- Achievement titles with humor
- No clinical language anywhere
- Comedy is a primary engagement driver, not decoration

### 8. Social Sharing

- Shareable "Brain Map" card — CrazySnake's "Wordle grid" moment
- No competitor offers social brain map sharing
- Potential organic acquisition driver

---

## Competitive Positioning

- **Free** where Lumosity charges $14.99/mo
- **Fun** where BrainHQ feels medical
- **Transparent** where LPI is opaque
- **Social** where competitors are isolated
- **Six real gameplay-derived metrics** vs. abstract puzzle scores
- **Comedy + cognitive legitimacy** — unique positioning no competitor owns

---

## Ethical Guardrails (from Celia)

1. Never use the dashboard to create anxiety
2. No "Your brain is declining" messages
3. No red warning colors on weak domains
4. Frame everything as growth opportunity, never deficit
5. Streaks should offer "streak freeze" and gentle missed-day messaging
6. Motivate through curiosity and competence, never guilt or obligation
7. Never claim scientific proof — let the experience speak for itself

---

## SDT Alignment (Self-Determination Theory)

The dashboard satisfies all three intrinsic motivation pillars:
- **Competence**: "I can see I'm getting better"
- **Autonomy**: "I choose to explore my data, at my pace"
- **Relatedness**: "I can share my brain map with others"

---

## Recommended Next Steps

| Next Step | Agent | Description |
|---|---|---|
| Product Brief / PRD | Mary + John (PM) | Formalize dashboard requirements into product requirements document |
| UX Wireframes | Sally (UX) | Dashboard screens, post-game flow, share card designs |
| Technical Architecture | Winston (Architect) | Data model, localStorage schema, metric calculation engine |
| Metric Validation | Celia (Neuro-Game) | Verify calculation formulas against actual gameplay data |
| Epics & Stories | Bob (SM) | Break into implementable stories for development |

---

## Related Documents

- Market Research: `_bmad-output/planning-artifacts/research/market-player-cognitive-progress-tracking-research-2026-02-15.md`
- Game UX Principles: `_bmad-output/planning-artifacts/game-ux-principles.md`
