// Test file for phone dismissal system (Story 3.3)
import { dismissPhoneCall, handlePhoneDismiss, initPhoneSystem, isPhoneCallActive, triggerPhoneCall } from '../js/phone.js';
import { createInitialState } from '../js/state.js';

console.log('=== Running phone dismissal tests (Story 3.3) ===');

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

// Test dismissPhoneCall() - clears state when gameState provided
console.log('\n--- dismissPhoneCall() State Clearing Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();
  gameState.phoneCall.active = true;
  gameState.phoneCall.caller = 'Test Caller';

  // Trigger phone to show overlay
  triggerPhoneCall(gameState);

  assert.isTrue(isPhoneCallActive(), 'Phone should be active before dismissal');
  assert.equal(gameState.phoneCall.caller, 'Test Caller', 'Caller should be set before dismissal');

  dismissPhoneCall(gameState);

  assert.isFalse(isPhoneCallActive(), 'Phone should not be active after dismissal');
  assert.isFalse(gameState.phoneCall.active, 'gameState.phoneCall.active should be false');
  assert.isNull(gameState.phoneCall.caller, 'gameState.phoneCall.caller should be null');
}

// Test dismissPhoneCall() - still works without gameState (backward compatibility)
{
  setupMockDOM();
  const gameState = createInitialState();
  triggerPhoneCall(gameState);

  assert.isTrue(isPhoneCallActive(), 'Phone should be active');

  dismissPhoneCall();  // No gameState parameter

  assert.isFalse(isPhoneCallActive(), 'Phone should be dismissed even without gameState');
}

// Test handlePhoneDismiss() - dismisses and schedules next call
console.log('\n--- handlePhoneDismiss() Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();
  gameState.phase = 'playing';
  triggerPhoneCall(gameState);

  assert.isTrue(gameState.phoneCall.active, 'Phone should be active before handlePhoneDismiss');

  const currentTime = 10000;
  handlePhoneDismiss(gameState, currentTime);

  assert.isFalse(gameState.phoneCall.active, 'handlePhoneDismiss should set active to false');
  assert.isNull(gameState.phoneCall.caller, 'handlePhoneDismiss should clear caller');
  assert.isTrue(
    gameState.phoneCall.nextCallTime > currentTime,
    'handlePhoneDismiss should schedule next call in the future'
  );
  assert.isFalse(isPhoneCallActive(), 'Phone overlay should be hidden');
}

// Test initPhoneSystem() - adds End button click handler
console.log('\n--- initPhoneSystem() Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();
  let getCurrentTimeCalled = false;
  const getCurrentTime = () => {
    getCurrentTimeCalled = true;
    return 5000;
  };

  initPhoneSystem(gameState, getCurrentTime);

  // Trigger phone first
  triggerPhoneCall(gameState);
  assert.isTrue(gameState.phoneCall.active, 'Phone should be active');

  // Simulate End button click
  const endButton = document.querySelector('.end-button');
  endButton.click();

  assert.isFalse(gameState.phoneCall.active, 'End button click should dismiss phone');
  assert.isNull(gameState.phoneCall.caller, 'End button click should clear caller');
  assert.isTrue(getCurrentTimeCalled, 'End button click should call getCurrentTime');
}

// Test initPhoneSystem() - does not dismiss if phone not active
{
  setupMockDOM();
  const gameState = createInitialState();
  const getCurrentTime = () => 5000;

  initPhoneSystem(gameState, getCurrentTime);

  gameState.phoneCall.active = false;
  const endButton = document.querySelector('.end-button');
  const beforeNextCallTime = gameState.phoneCall.nextCallTime;

  endButton.click();

  // Should not schedule new call if phone wasn't active
  assert.equal(
    gameState.phoneCall.nextCallTime,
    beforeNextCallTime,
    'Should not change nextCallTime if phone was not active'
  );
}

// Test dismissal clears blur effect
console.log('\n--- Blur Effect Removal Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();
  triggerPhoneCall(gameState);

  const canvas = document.getElementById('game-canvas');
  assert.isTrue(canvas.classList.contains('blurred'), 'Canvas should be blurred when phone active');

  dismissPhoneCall(gameState);

  assert.isFalse(canvas.classList.contains('blurred'), 'Canvas should not be blurred after dismissal');
}

// Test overlay visibility after dismissal
console.log('\n--- Overlay Visibility Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();
  triggerPhoneCall(gameState);

  const overlay = document.getElementById('phone-overlay');
  assert.isFalse(overlay.classList.contains('hidden'), 'Overlay should be visible when phone active');

  dismissPhoneCall(gameState);

  assert.isTrue(overlay.classList.contains('hidden'), 'Overlay should be hidden after dismissal');
}

// Test dismissal schedules next call correctly (updated to 5-15 seconds after user testing)
console.log('\n--- Next Call Scheduling Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();
  gameState.phase = 'playing';
  triggerPhoneCall(gameState);

  const currentTime = 20000;
  handlePhoneDismiss(gameState, currentTime);

  // Next call should be between currentTime + 5000 and currentTime + 15000
  const minExpected = currentTime + 5000;
  const maxExpected = currentTime + 15000;

  assert.isTrue(
    gameState.phoneCall.nextCallTime >= minExpected && gameState.phoneCall.nextCallTime <= maxExpected,
    `Next call should be scheduled between ${minExpected} and ${maxExpected}, got ${gameState.phoneCall.nextCallTime}`
  );
}

// Test auto-dismiss on game over (Story 3.3 AC)
console.log('\n--- Auto-Dismiss on Game Over Tests ---');
{
  setupMockDOM();
  const gameState = createInitialState();
  gameState.phase = 'playing';
  triggerPhoneCall(gameState);

  assert.isTrue(gameState.phoneCall.active, 'Phone should be active before game over');
  assert.isTrue(isPhoneCallActive(), 'Phone overlay should be visible');

  // Simulate game over auto-dismiss (as done in game.js)
  if (gameState.phoneCall.active) {
    dismissPhoneCall(gameState);
  }
  gameState.phase = 'gameover';

  assert.isFalse(gameState.phoneCall.active, 'Phone should be dismissed on game over');
  assert.isFalse(isPhoneCallActive(), 'Phone overlay should be hidden on game over');
  assert.equal(gameState.phase, 'gameover', 'Phase should be gameover');
}

console.log('\n=== phone dismissal tests complete ===');
