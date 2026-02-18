# CrazySnakeLite

**Snake just got complicated.**

Six food types. Phone calls from tech-pun legends like *Al Gorithm* and *Floppy Phil*. Mystery foods that hide what they do. Your controls suddenly reverse. Two effects stacking for combo chaos. Oh, and you get sharper while you laugh.

Welcome to the cognitive workout hiding inside an arcade fever dream.

## What Makes This Snake Crazy

### Six Wild Food Types

Not just "eat and grow." Every food does something different:

| Food | Color | What It Does | Challenge |
|------|-------|--------------|-----------|
| **Growing** | Green | Classic snake growth | Keep moving |
| **Speed Decrease** | Cyan | Slow down (breathing room) | Strategic safety |
| **Wall Phase** | Purple | Pass through walls | Spatial chaos |
| **Speed Boost** | Red | FAST mode | Pure reflexes |
| **Reverse Controls** | Orange | Up is down, left is right | Control override |
| **Invincibility** | Yellow | Temporary safety (but zero points) | Safety vs. score |

### Phone Calls from the Best (Worst?) Callers

Random interruptions while your snake keeps moving under blur. Two choices every time:

- **Hang Up** — Safe +1 point, instant relief
- **Pick Up** — Risky bonus (+2, +3, +5, +8, +13, +21...) + comedy one-liner

Pick Up to hear gems like:
- *"It's Al Gorithm. I'm calling to sort things out."*
- *"Floppy Phil here. This call won't take up much space."*
- *"DJ Snake in the house! Let's drop the bass... line."*

21 callers total. Comedy is your reward for courage.

### Progressive Mystery Food (Score 15+)

As you get better, some food starts **blinking through colors** — you won't know what it does until you eat it. Commit or avoid? Your call.

### Combo Mode (Score 40+)

Two effects at once. Multiplicative scoring. Striped snake. Transitioning canvas colors. Strategic heaven if you can handle it.

### The Crown Jewel: Reverse Controls

Orange food flips your controls. Up becomes down. Left becomes right. Worth the most points because it's the hardest thing your reflexes can do.

---

## The Secret Sauce (More Than Just a Snake Game)

Here's the part we didn't mention up front: **every mechanic targets a different cognitive faculty.**

- **Fibonacci scoring** trains pattern recognition and risk assessment
- **Phone calls** train divided attention and context-switching
- **Blinking food** trains decision-making under uncertainty
- **Combo mode** trains working memory and strategic thinking
- **Reverse controls** trains executive function override (the neurological equivalent of a heavy deadlift)

After you die, **"RECAP"** shows what you just pulled off. Not "you failed," but "look what you just did."

**Score gates unlock complexity as you prove mastery.** No timers. No grinding. Just achievement-based progression.

AI handles more of our thinking every day. CrazySnakeLite pushes back — and makes it fun.

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

**Fun first. Skill gains second.**

Comedy is a system (21 tech-pun callers), not a garnish. Difficulty unlocks through achievement, never timers. Every mechanic teaches itself through play. The cognitive challenge is what makes it replayable — but the laughs are what bring you back tomorrow.

**Score-based, never time-based.** Reward achievement, not survival.

**Targeted challenge over raw chaos.** A gym rotates muscle groups. CrazySnakeLite rotates cognitive demands.

**Comedy makes the workout stick.** Retro portraits, pun names, one-liners — you're leveling up, but you're having too much fun to notice.

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

TBD

---

*"Level up your game. Laugh while you do it. Come back tomorrow."*
