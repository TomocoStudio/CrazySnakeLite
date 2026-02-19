# Border Color Simplification Fix (V4.2)
**Date:** 2026-02-17
**Issue:** Combo Mode was showing colored borders (red/purple) that violated the new canvas color management rules

## Problem
- Combo Mode applied colored borders (red, purple, blue, green) regardless of game state
- Phone calls applied gold (ring) and green (pickup) borders
- This created visual confusion and violated the "black unless wall-phase" rule

## Solution - Simplified Universal Border System

**New rules apply to ALL game modes (Normal, Combo, etc.):**

1. **🟣 Purple border** = Wall-phase effect active (safe to cross walls)
2. **🟡 Yellow blinking border** = Invincibility effect active (protected)
3. **⚫ Black border (default)** = Walls are dangerous (normal state)

## Changes Made

### File: `js/game.js`

**Function: `updateBorderState(gameState)` (lines 122-191)**

**Removed:**
- ❌ Phone ring border (gold) - priority #1
- ❌ Phone pickup border (green) - priority #2
- ❌ Combo border (dynamic colors) - priority #3
- ❌ Reverse controls border (orange) - was never implemented

**Kept:**
- ✅ Wall Phase border (purple with glow)
- ✅ Invincibility border (yellow blinking)
- ✅ Default border (black)

**New priority cascade:**
1. Wall Phase (purple) - highest priority
2. Invincibility (yellow)
3. Default (black) - fallback

## Impact

### Combo Mode
- Border is now **black** by default during combo
- Border turns **purple** if player eats wall-phase food during combo
- Border turns **yellow blinking** if player eats invincibility food during combo
- No more confusing red/purple/blue/green combo borders

### Phone Calls
- No more gold ring border when phone is ringing
- No more green border during pickup timer
- Border stays consistent with effect state (black/purple/yellow only)

### All Game Modes
- Consistent visual language: black = danger, purple = safe walls, yellow = protected
- Simpler mental model for players
- Better visual clarity

## Testing

To verify the fix:
1. Start a game
2. Verify border is **black** by default
3. Eat a wall-phase food → border should turn **purple**
4. Eat an invincibility food → border should turn **yellow blinking**
5. Trigger combo mode → border should stay **black** (unless wall-phase/invincibility active)
6. Answer a phone call → border should stay **black** (unless wall-phase/invincibility active)

## Files Modified
- `js/game.js` - Updated `updateBorderState()` function (lines 122-164)

## Version
- V4.2 - Border Simplification
