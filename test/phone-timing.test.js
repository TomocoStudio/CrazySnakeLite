// Test file for phone timing system (Story 3.2)
import { scheduleNextCall, triggerPhoneCall, checkPhoneCallTiming } from '../js/phone.js';
import { createInitialState } from '../js/state.js';
import { CONFIG } from '../js/config.js';

console.log('=== Running phone timing tests (Story 3.2) ===');

// Setup: Create mock DOM elements
function setupMockDOM() {
  const existing = document.getElementById('phone-overlay');
  if (existing) {
    existing.remove();
  }
  const existingCanvas = document.getElementById('game-canvas');
  if (existingCanvas) {
    existingCanvas.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'phone-overlay';
  overlay.className = 'hidden';

  const phoneScreen = document.createElement('div');
  phoneScreen.className = 'phone-screen';

  const callerName = document.createElement('p');
  callerName.className = 'caller-name';
  callerName.textContent = 'Mom';

  const endButton = document.createElement('button');
  endButton.className = 'end-button';
  endButton.textContent = 'End';

  phoneScreen.appendChild(callerName);
  phoneScreen.appendChild(endButton);
  overlay.appendChild(phoneScreen);
  document.body.appendChild(overlay);

  const canvas = document.createElement('canvas');
  canvas.id = 'game-canvas';
  document.body.appendChild(canvas);
}

// Test scheduleNextCall() - sets nextCallTime within expected range
console.log('\n--- scheduleNextCall() Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();
  const currentTime = 10000;

  scheduleNextCall(gameState, currentTime);

  const minExpected = currentTime + CONFIG.PHONE_MIN_DELAY;
  const maxExpected = currentTime + CONFIG.PHONE_MAX_DELAY;
  const nextCallTime = gameState.phoneCall.nextCallTime;

  assert.isTrue(
    nextCallTime >= minExpected && nextCallTime <= maxExpected,
    `scheduleNextCall() should set nextCallTime between ${minExpected} and ${maxExpected}, got ${nextCallTime}`
  );
}

// Test scheduleNextCall() randomness - multiple calls produce different times
{
  setupMockDOM();
  const gameState = createInitialState();
  const currentTime = 10000;

  const times = [];
  for (let i = 0; i < 5; i++) {
    scheduleNextCall(gameState, currentTime);
    times.push(gameState.phoneCall.nextCallTime);
  }

  // Check that not all times are identical (very unlikely with random)
  const allSame = times.every(t => t === times[0]);
  assert.isFalse(allSame, 'scheduleNextCall() should produce varied random intervals');
}

// Test triggerPhoneCall() - sets state and displays overlay
console.log('\n--- triggerPhoneCall() Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();

  assert.isFalse(gameState.phoneCall.active, 'Phone should not be active initially');
  assert.isNull(gameState.phoneCall.caller, 'Caller should be null initially');

  triggerPhoneCall(gameState);

  assert.isTrue(gameState.phoneCall.active, 'triggerPhoneCall() should set active to true');
  assert.notEqual(gameState.phoneCall.caller, null, 'triggerPhoneCall() should set a caller name');

  const overlay = document.getElementById('phone-overlay');
  const callerNameElement = overlay.querySelector('.caller-name');

  assert.isFalse(
    overlay.classList.contains('hidden'),
    'triggerPhoneCall() should display overlay'
  );

  assert.equal(
    callerNameElement.textContent,
    gameState.phoneCall.caller,
    'triggerPhoneCall() should display caller name on overlay'
  );
}

// Test triggerPhoneCall() randomness - produces varied caller names
{
  setupMockDOM();
  const gameState = createInitialState();

  const callers = [];
  for (let i = 0; i < 10; i++) {
    gameState.phoneCall.active = false;
    triggerPhoneCall(gameState);
    callers.push(gameState.phoneCall.caller);
    // Reset overlay
    document.getElementById('phone-overlay').classList.add('hidden');
  }

  // Check that not all callers are identical (very unlikely with 23 callers)
  const allSame = callers.every(c => c === callers[0]);
  assert.isFalse(allSame, 'triggerPhoneCall() should select varied random callers');
}

// Test checkPhoneCallTiming() - triggers when time elapses
console.log('\n--- checkPhoneCallTiming() Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();
  gameState.phase = 'playing';
  gameState.phoneCall.nextCallTime = 5000;

  // Time before trigger
  checkPhoneCallTiming(gameState, 4000);
  assert.isFalse(gameState.phoneCall.active, 'Should not trigger before nextCallTime');

  // Time at trigger
  checkPhoneCallTiming(gameState, 5000);
  assert.isTrue(gameState.phoneCall.active, 'Should trigger at nextCallTime');
}

// Test checkPhoneCallTiming() - does not trigger when already active
{
  setupMockDOM();
  const gameState = createInitialState();
  gameState.phase = 'playing';
  gameState.phoneCall.active = true;
  gameState.phoneCall.caller = 'Existing Caller';
  gameState.phoneCall.nextCallTime = 5000;

  const originalCaller = gameState.phoneCall.caller;
  checkPhoneCallTiming(gameState, 10000);

  assert.equal(
    gameState.phoneCall.caller,
    originalCaller,
    'Should not trigger new call when phone already active'
  );
}

// Test checkPhoneCallTiming() - does not trigger when not in 'playing' phase
{
  setupMockDOM();
  const gameState = createInitialState();
  gameState.phase = 'gameover';
  gameState.phoneCall.nextCallTime = 5000;

  checkPhoneCallTiming(gameState, 10000);
  assert.isFalse(gameState.phoneCall.active, 'Should not trigger when phase is not "playing"');
}

{
  setupMockDOM();
  const gameState = createInitialState();
  gameState.phase = 'menu';
  gameState.phoneCall.nextCallTime = 5000;

  checkPhoneCallTiming(gameState, 10000);
  assert.isFalse(gameState.phoneCall.active, 'Should not trigger when phase is "menu"');
}

// Test timing ranges match config (updated after user testing to 5-15 seconds)
console.log('\n--- Config Validation Tests ---');
{
  assert.equal(CONFIG.PHONE_MIN_DELAY, 5000, 'PHONE_MIN_DELAY should be 5000ms (5 seconds)');
  assert.equal(CONFIG.PHONE_MAX_DELAY, 15000, 'PHONE_MAX_DELAY should be 15000ms (15 seconds)');
}

console.log('\n=== phone timing tests complete ===');
