# CrazySnakeLite

A chaotic twist on the classic Nokia Snake game. Features 6 food types with special effects, phone call interruptions, and state-based audio feedback!

## Features

- **Classic Snake Gameplay** with modern chaos and retro aesthetics
- **6 Different Food Types** with unique visual and audio effects
- **Phone Call Interruptions** that blur the game and test your focus
- **Score System** with persistent high score tracking
- **Main Menu & Game Over Screens** with keyboard and mouse navigation
- **Looping Menu Music** - Immersive 8-bit background soundtrack
- **State-Based Movement Sounds** - 14 alternating 8-bit sounds (2 per state)
- **V3 Audio Quality** - All sounds upgraded to improved quality versions
- **Full Keyboard Support** - Enter, Esc, Arrow keys for complete navigation
- **Pause & Resume** - Press Esc during gameplay to pause
- **Retro 8-bit Pixel Art Aesthetic** throughout

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

## Project Structure

```
CrazySnakeLite/
├── index.html          # Entry point, game container
├── css/
│   └── style.css       # Retro styling, game board, overlays
├── js/
│   ├── main.js         # Entry point, game initialization
│   ├── config.js       # Tunable game parameters
│   ├── game.js         # Game loop, state management
│   ├── state.js        # State creation/reset
│   ├── snake.js        # Snake entity, movement
│   ├── food.js         # Food spawning, types
│   ├── collision.js    # Collision detection
│   ├── effects.js      # Effect system
│   ├── phone.js        # Phone call overlay
│   ├── input.js        # Keyboard/touch input
│   ├── render.js       # Canvas rendering
│   ├── audio.js        # Sound system
│   └── storage.js      # localStorage for high scores
├── assets/
│   └── sounds/         # 8-bit audio files
└── README.md
```

## Controls

### Gameplay
- **Arrow Keys** / **WASD** / **ZQSD** / **Numpad** - Move snake
- **Space** - Dismiss phone calls
- **Esc** - Pause game (press again to resume)
- **Swipe** - Touch controls for mobile

### Menu Navigation
- **Enter** - Activate selected button (New Game / Play Again)
- **Arrow Up/Down** - Navigate between menu options
- **Esc** - Return to menu (from game over) or Resume (from pause)
- **Mouse/Touch** - Click/tap any button

## Food Types & Effects

Each food type has unique visual effects, snake colors, and alternating movement sounds!

1. **Green (Growing)** - Classic food, snake grows, pleasant tones
2. **Yellow (Invincibility)** - Temporary invincibility, powerful shield sounds
3. **Purple (Wall Phase)** - Pass through walls, ethereal whoosh sounds
4. **Red (Speed Boost)** - Move faster, energetic high-pitch tones
5. **Cyan (Speed Decrease)** - Move slower, deep heavy tones
6. **Orange (Reverse)** - Controls reversed, dissonant warped sounds

## Audio System

- **Web Audio API** for zero-latency, synchronized sound playback
- **Menu Background Music** - Looping 8-bit soundtrack on menu screen (V3)
- **16 Total Sound Files** - All upgraded to V3 versions for improved quality
  - 14 Movement Sounds (7 states × 2 alternating sounds)
  - 1 Death Sound
  - 1 Menu Music Loop
- **Alternation Pattern** - Movement sounds alternate (1→2→1→2) for dynamic variation
- **State Change Reset** - New state always starts with Sound 1
- **60 FPS Performance** - Decoupled audio playback maintains smooth gameplay
- **Browser Autoplay Compliance** - Audio initializes on first user interaction (click/keypress)

## BMAD Development Support

This project includes **BMAD (Build-Measure-Analyze-Deploy)** framework integration for AI-assisted game development and design workflows.

### Custom Agent: Celia (Neuro-Game Designer) 🧠

A specialized AI agent that combines expertise from three industry-leading game design methodologies:

**Expertise Areas:**
- **Celia Hodent's Game UX Framework** - Cognitive psychology and player experience optimization
  - Usability: Signs/Feedback, Clarity, Form Follows Function, Consistency, Minimum Workload
  - Engage-Ability: Motivation (SDT), Emotion, Flow State
- **Jesse Schell's Art of Game Design** - Elemental Tetrad (Mechanics/Story/Aesthetics/Technology) and design "Lenses"
- **Tynan Sylvester's Designing Games** - Emergence engineering and emotional event design

**Capabilities:**
- 🔍 Full UX Audit (Usability + Engage-Ability)
- 🎯 Usability Review (Cognitive load, feedback loops, clarity)
- ⚡ Engage-Ability Review (Motivation, emotion, flow analysis)
- 🔬 Analyze Existing Mechanics (Tetrad + UX + Emergence)
- ✨ Design New Game Systems (B-MAD framework)
- 🎓 Onboarding/Tutorial Design (Learning by doing)
- 🧪 Dopamine Loop Design (Reward schedules, progression)
- 🌊 Flow State Analysis (Challenge vs. skill balance)
- 🧠 Cognitive Bias Check (Developer perspective audits)

**How to Use:**
```bash
# Invoke the neuro-game-designer agent
/neuro-game-designer
```

**Output Format:**
All responses follow the B-MAD structure:
1. **Design Blueprint** - Technical description of the system/mechanic
2. **Neuro-Psych Justification** - Cognitive science "why" (dopamine, working memory, SDT, etc.)
3. **The Lenses of Schell** - 2-3 specific design lenses used for validation
4. **UX Warning/Ethical Check** - Friction points, dark patterns to avoid

**Use Cases for CrazySnakeLite:**
- Analyze food effect mechanics for cognitive load and player motivation
- Design progression systems that maintain flow state
- Optimize phone call interruption mechanics for engagement without frustration
- Evaluate onboarding and tutorial effectiveness
- Audit control schemes for usability and cognitive workload
- Design new game modes or difficulty curves using neuroscience principles

### Other Available BMAD Agents

- **Analyst (Mary)** 📊 - Business analysis, research, requirements gathering
- **Architect** 🏗️ - System architecture and technical design decisions
- **Dev** 💻 - Implementation and coding workflows
- **UX Designer** 🎨 - User experience and interface design
- **PM (Product Manager)** 📋 - Product planning and roadmap management
- **SM (Scrum Master)** 🎯 - Agile workflow and sprint management
- **Tea (Test Engineer & Architect)** 🧪 - Testing strategies and quality assurance
- **Tech Writer** 📝 - Documentation and technical writing

For more information about BMAD agents and workflows, see `/_bmad/` directory.

## License

TBD
