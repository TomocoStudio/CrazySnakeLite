# CrazySnakeLite

A chaotic twist on the classic Nokia Snake game. Features 6 food types with special effects, phone call interruptions, and state-based audio feedback!

## Features

- **Classic Snake Gameplay** with modern chaos and retro aesthetics
- **6 Different Food Types** with unique visual and audio effects
- **Phone Call Interruptions** that blur the game and test your focus
- **Score System** with persistent high score tracking
- **Main Menu & Game Over Screens** with keyboard and mouse navigation
- **State-Based Movement Sounds** - 14 alternating 8-bit sounds (2 per state)
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
- **14 Movement Sounds** - 7 states × 2 alternating sounds each
- **Alternation Pattern** - Sounds alternate (1→2→1→2) for dynamic variation
- **State Change Reset** - New state always starts with Sound 1
- **60 FPS Performance** - Decoupled audio playback maintains smooth gameplay

## License

MIT
