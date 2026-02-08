# CrazySnakeLite — Brain Gym for the Age of AI

A **cognitive fitness tool disguised as an arcade game.** Five brain training systems layered on top of classic Snake — each targeting a different cognitive faculty, each unlocking as you demonstrate mastery.

AI handles more of our thinking every day. CrazySnakeLite makes your brain work hard — and makes it fun.

## The Five Cognitive Training Layers

| Layer | Mechanic | What It Trains | Score Gate |
|-------|----------|---------------|------------|
| 1 | **Fibonacci Scoring** — 6 food types with difficulty-proportional rewards | Pattern recognition, risk assessment | Score 0+ |
| 2 | **Phone Call Interruptions** — End (+1 safe) or Pick Up (+Fibonacci bonus, risky) | Divided attention, context-switching | Score 3+ |
| 3 | **Progressive Blinking Food** — Mystery food hides its type until consumed | Decision-making under uncertainty | Score 15+ |
| 4 | **Combo Mode** — Two effects combine for multiplicative scoring | Working memory, strategic thinking | Score 40+ |
| 5 | **Reverse Controls** — Up is down, left is right (the crown jewel) | Executive function override | Any time |

**Post-Game:** "Your Brain Today" shows 2-3 cognitive achievement stats after each death. Transforms "I failed" into "look what my brain just did."

## Food Types & Fibonacci Scoring

| Food | Color | Points | Effect | Cognitive Training |
|------|-------|--------|--------|-------------------|
| Growing | Green | +1 | Snake grows | Baseline motor control |
| Speed Decrease | Cyan | +2 | Slower movement | Cognitive breathing room |
| Wall Phase | Purple | +1/+3 | Pass through walls | Spatial reasoning |
| Speed Boost | Red | +5 | Faster movement | Reflexes under pressure |
| Reverse Controls | Orange | +8 | Controls inverted | Executive function (crown jewel) |
| Invincibility | Yellow | 0 | Temporary immunity | Impulse control (safety vs. score) |

## Phone Call System — 21 Tech-Pun Callers

Random phone calls interrupt gameplay while the snake keeps moving under blur. Two choices:
- **End** (+1 point, instant, safe)
- **Pick Up** (+Fibonacci bonus, 1-3s blur, risky) — bonus escalates per game: +2, +3, +5, +8, +13, +21, +34

Pick Up reveals the caller's comedy one-liner. Comedy is a reward for courage.

**Sample callers:** Al Gorithm, Meg A. Byte, Floppy Phil, Mona Tor, DJ Snake, GAME OVER...

## Getting Started

### Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- A local HTTP server (ES6 modules require http://, not file://)

### Running the Game

**Option 1: Python HTTP Server**
```bash
cd /path/to/CrazySnakeLite
python -m http.server 8000
```
Then open http://localhost:8000 in your browser.

**Option 2: VS Code Live Server**
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

**Option 3: Any Local Server**
Use any HTTP server that can serve static files (Node.js http-server, PHP built-in server, etc.)

## Controls

### Gameplay
- **Arrow Keys** / **WASD** / **ZQSD** / **Numpad** — Move snake
- **Space** — End phone call
- **Enter** — Pick Up phone call
- **Esc** — Pause game
- **Swipe** — Touch controls for mobile

### Menu Navigation
- **Enter** — Activate selected button
- **Arrow Up/Down** — Navigate options
- **Esc** — Return to menu / Resume
- **Mouse/Touch** — Click/tap any button

## Project Structure

```
CrazySnakeLite/
├── index.html          # Entry point, game container
├── css/
│   └── style.css       # Retro styling, overlays, cognitive feedback
├── js/
│   ├── main.js         # Entry point, game initialization
│   ├── config.js       # All tunable game parameters
│   ├── game.js         # Game loop, state management
│   ├── state.js        # State creation/reset (incl. cognitiveStats)
│   ├── snake.js        # Snake entity, movement
│   ├── food.js         # Food spawning, types, blinking system
│   ├── collision.js    # Collision detection
│   ├── effects.js      # Effect system (6 typed effects)
│   ├── phone.js        # Phone call overlay, Pick Up/End, callers
│   ├── input.js        # Keyboard/touch input (4 layouts)
│   ├── render.js       # Canvas rendering, combo mode visuals
│   ├── audio.js        # Web Audio API sound system
│   └── storage.js      # localStorage for high scores
├── assets/
│   ├── sounds/         # 8-bit audio files
│   └── callers/        # 21 caller portraits (64x64 pixel art)
└── _bmad-output/       # Design documents and planning artifacts
    └── planning-artifacts/
        ├── game-ux-principles.md          # Cognitive science foundation
        ├── game-design-food-v2.md         # Fibonacci scoring & progression
        ├── game-design-phone-calls-v2.md  # Phone call enhancement system
        ├── ux-design-food-phone-v2.md     # Visual implementation guide
        ├── product-brief-*.md             # Product brief
        ├── prd.md                         # Product requirements
        └── project-context.md             # AI agent implementation guide
```

## Audio System

- **Web Audio API** for zero-latency playback
- **Fibonacci Musical Progression** — Each score value has a distinct note (C, D, E, G, C-major chord for +8)
- **State-Based Movement Sounds** — 7 states × 2 alternating sounds per state
- **Combo Audio** — Entrance fanfare (rising arpeggio), exit deflation, jackpot sounds for high combos
- **Nokia-Style Phone Ring** — Retro ringtone loops until answered
- **Browser Autoplay Compliance** — Audio initializes on first user interaction

## Design Philosophy

**Score-based, never time-based.** All progression is gated by player achievement, not survival time.

**Difficulty is the product.** The cognitive challenge is what the player came for.

**Comedy is a system.** 21 tech-pun callers, retro portraits, funny one-liners — humor makes the workout enjoyable.

**Targeted challenge over raw chaos.** A gym rotates muscle groups. CrazySnakeLite rotates cognitive demands. Blinking food caps at 60%, combo at 40% — ensuring strategic thinking is always possible, even at peak difficulty.

**Teach by encounter.** Every mechanic is learned through play, not instruction.

## Cognitive Science Foundation

All game design decisions are grounded in cognitive psychology:
- **Hodent (2018)** — Usability + Engage-ability framework, working memory limits, temporal contiguity
- **Schell (2008)** — Elemental Tetrad, Lenses of Design (Surprise, Challenge, Flow, Skill, Risk)
- **Sylvester (2013)** — Emergence engineering, emotional event design, dopamine loops
- **Csikszentmihalyi** — Flow state (challenge must match rising skill)
- **Deci & Ryan** — Self-Determination Theory (competence, autonomy, relatedness)

See `_bmad-output/planning-artifacts/game-ux-principles.md` for the complete foundation.

## BMAD Development Support

This project uses the **BMAD (Build-Measure-Analyze-Deploy)** framework for AI-assisted game development.

### Key Agents

- **Celia (Neuro-Game Designer)** — Cognitive psychology, player experience optimization, B-MAD analysis framework
- **Mary (Analyst)** — Business analysis, product briefs, PRDs, market positioning
- **Sally (UX Designer)** — Visual specifications, interaction design, accessibility
- **Architect** — System architecture and technical design
- **Dev** — Implementation and coding workflows
- **Tea (Test Engineer)** — Testing strategies and quality assurance

For agent details, see `/_bmad/` directory.

## License

MIT

---

*"Train your brain. Laugh while you do it. Come back tomorrow."*
