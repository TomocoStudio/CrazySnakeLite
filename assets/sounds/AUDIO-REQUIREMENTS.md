# CrazySnakeLite - Audio Asset Requirements

## Required Sound Files

All sound files must be placed in this directory (`assets/sounds/`).

### Movement Sounds (7 files)

| Filename | Purpose | Snake State | Color | Character |
|----------|---------|-------------|-------|-----------|
| `move-default.ogg` | Neutral blip | Default/neutral | Black (#000000) | Simple, clean 8-bit blip |
| `move-growing.ogg` | Pleasant tone | Ate growing food | Green (#00FF00) | Uplifting, positive tone |
| `move-invincibility.ogg` | Powerful tone | Invincible | Yellow (#FFFF00) | Bold, strong, confident |
| `move-wall-phase.ogg` | Ethereal tone | Phasing through walls | Purple (#800080) | Mysterious, otherworldly |
| `move-speed-boost.ogg` | Quick, high pitch | Speed increased | Red (#FF0000) | Fast, energetic, sharp |
| `move-speed-decrease.ogg` | Slow, low pitch | Speed decreased | Cyan (#00CED1) | Sluggish, deep, slow |
| `move-reverse.ogg` | Dissonant tone | Controls reversed | Orange (#FFA500) | Jarring, confusing, chaotic |

### Game Event Sounds (1 file)

| Filename | Purpose | Duration | Character |
|----------|---------|----------|-----------|
| `game-over.ogg` | Death melody | 2-4 seconds | Classic arcade game over, not too sad, slightly playful |

---

## Technical Specifications

**ALL sound files must meet these exact specifications:**

### Format Requirements

| Parameter | Specification |
|-----------|--------------|
| **File Format** | OGG Vorbis (.ogg) |
| **Sample Rate** | 44.1 kHz (44,100 Hz) |
| **Bit Depth** | 16-bit |
| **Channels** | Mono (1 channel) |
| **Bitrate** | 96-128 kbps (movement sounds), 128 kbps (game over) |
| **Target File Size** | < 50KB per movement sound, < 100KB for game over |
| **Duration** | ~100-500ms (movement), 2-4 seconds (game over) |

### Why OGG Vorbis?

- Best compression-to-quality ratio
- Excellent browser support (Chrome, Firefox, Edge, Opera)
- Smaller file sizes than MP3
- No licensing concerns
- Open source format

### Browser Compatibility

- **Supported:** Chrome, Firefox, Edge, Opera (95%+ coverage)
- **Fallback:** MP3 can be added later for Safari/older browsers if needed

---

## Audio Aesthetic Guidelines

**Theme:** Classic 8-bit retro arcade game (think Nokia Snake + 1980s arcade)

### Movement Sounds
- **Length:** Very short (100-500ms)
- **Style:** Classic 8-bit chip tune bleeps and bloops
- **Frequency:** Will play 8 times per second during gameplay
- **Variety:** Each state should have a distinct, recognizable character

### Game Over Melody
- **Length:** 2-4 seconds
- **Style:** Classic arcade "game over" sequence
- **Mood:** Not overly sad; slightly playful/nostalgic
- **Reference:** Think Pac-Man death sound, Space Invaders game over, etc.

---

## Creating/Sourcing Audio Files

### Option 1: Generate with Audio Tools
- **BeepBox** (https://www.beepbox.co/) - Browser-based 8-bit music maker
- **sfxr** / **jsfxr** - 8-bit sound effect generators
- **Audacity** - Export to OGG after creating/editing

### Option 2: Find Royalty-Free Assets
- **OpenGameArt.org** - Search for "8-bit sound effects"
- **Freesound.org** - Filter by CC0 license
- **itch.io** - Many free game asset packs

### Option 3: Commission Custom Audio
- Hire a chiptune/8-bit audio artist
- Provide this specification document

---

## Converting Existing Files to OGG

If you have WAV or MP3 files, convert using:

### Using FFmpeg (Command Line)
```bash
# Convert WAV to OGG (mono, 44.1kHz, 16-bit, 96kbps)
ffmpeg -i input.wav -ac 1 -ar 44100 -b:a 96k output.ogg

# Convert MP3 to OGG
ffmpeg -i input.mp3 -ac 1 -ar 44100 -b:a 96k output.ogg
```

### Using Audacity (GUI)
1. Open file in Audacity
2. Tracks → Mix → Mix Stereo Down to Mono
3. Tracks → Resample → 44100 Hz
4. File → Export → Export as OGG Vorbis
5. Set quality to ~3-4 (96-128 kbps)

---

## Testing Your Audio Files

### Quick Validation Checklist

- [ ] File format is `.ogg` (not .wav or .mp3)
- [ ] File size is < 50KB (movement) or < 100KB (game over)
- [ ] Sound plays correctly in browser (open in Chrome/Firefox)
- [ ] Duration is appropriate (short blips for movement, 2-4s for game over)
- [ ] Audio matches the 8-bit retro aesthetic
- [ ] No clipping, distortion, or pops/clicks
- [ ] Volume is consistent across all files

### Browser Test
```html
<!-- Quick test in browser console -->
<audio src="assets/sounds/move-default.ogg" controls></audio>
```

Or use JavaScript console:
```javascript
const sound = new Audio('assets/sounds/move-default.ogg');
sound.play();
```

---

## Integration Notes

These sound files will be:
- Pre-loaded on first user interaction (browser autoplay policy)
- Played via HTML5 Audio API (not Web Audio API)
- Mapped to snake states via color codes
- Reset and replayed rapidly during gameplay (8x/second)

**Performance Impact:**
- All files loaded into memory at game start
- Total audio footprint: ~400KB for all files
- No streaming or lazy loading needed
- Non-blocking playback (game continues if audio fails)

---

## Questions?

Refer to the main project documentation:
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/architecture.md`
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/project-context.md`

Or check the implementation stories:
- Story 4.5: State-Based Movement Sounds
- Story 4.6: Game Over Melody
