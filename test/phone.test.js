// Test file for phone.js
import { showPhoneCall, dismissPhoneCall, isPhoneCallActive } from '../js/phone.js';

console.log('=== Running phone.js tests ===');

// Setup: Create mock DOM elements for testing
function setupMockDOM() {
  // Remove any existing test elements
  const existing = document.getElementById('phone-overlay');
  if (existing) {
    existing.remove();
  }
  const existingCanvas = document.getElementById('game-canvas');
  if (existingCanvas) {
    existingCanvas.remove();
  }

  // Create mock phone overlay structure
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

  // Create mock canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'game-canvas';
  document.body.appendChild(canvas);
}

// Test isPhoneCallActive() - initially hidden
console.log('\n--- isPhoneCallActive() Tests ---');
{
  setupMockDOM();
  const active = isPhoneCallActive();
  assert.isFalse(active, 'isPhoneCallActive() should return false when overlay is hidden');
}

// Test showPhoneCall() - displays overlay and blurs canvas
console.log('\n--- showPhoneCall() Tests ---');
{
  setupMockDOM();
  showPhoneCall('Test Caller');

  const overlay = document.getElementById('phone-overlay');
  const canvas = document.getElementById('game-canvas');
  const callerNameElement = overlay.querySelector('.caller-name');

  assert.isFalse(
    overlay.classList.contains('hidden'),
    'showPhoneCall() should remove .hidden class from overlay'
  );

  assert.isTrue(
    canvas.classList.contains('blurred'),
    'showPhoneCall() should add .blurred class to canvas'
  );

  assert.equal(
    callerNameElement.textContent,
    'Test Caller',
    'showPhoneCall() should set caller name to provided value'
  );

  assert.isTrue(
    isPhoneCallActive(),
    'isPhoneCallActive() should return true after showPhoneCall()'
  );
}

// Test showPhoneCall() with default caller name
{
  setupMockDOM();
  showPhoneCall();

  const overlay = document.getElementById('phone-overlay');
  const callerNameElement = overlay.querySelector('.caller-name');

  assert.equal(
    callerNameElement.textContent,
    'Unknown Caller',
    'showPhoneCall() should use "Unknown Caller" as default when no name provided'
  );
}

// Test dismissPhoneCall() - hides overlay and removes blur
console.log('\n--- dismissPhoneCall() Tests ---');
{
  setupMockDOM();

  // First show the call
  showPhoneCall('Test Caller');

  // Then dismiss it
  dismissPhoneCall();

  const overlay = document.getElementById('phone-overlay');
  const canvas = document.getElementById('game-canvas');

  assert.isTrue(
    overlay.classList.contains('hidden'),
    'dismissPhoneCall() should add .hidden class to overlay'
  );

  assert.isFalse(
    canvas.classList.contains('blurred'),
    'dismissPhoneCall() should remove .blurred class from canvas'
  );

  assert.isFalse(
    isPhoneCallActive(),
    'isPhoneCallActive() should return false after dismissPhoneCall()'
  );
}

// Test multiple show/dismiss cycles
console.log('\n--- Multiple Show/Dismiss Cycles ---');
{
  setupMockDOM();

  // First cycle
  showPhoneCall('Caller 1');
  assert.isTrue(isPhoneCallActive(), 'First cycle: should be active after show');

  dismissPhoneCall();
  assert.isFalse(isPhoneCallActive(), 'First cycle: should be inactive after dismiss');

  // Second cycle
  showPhoneCall('Caller 2');
  assert.isTrue(isPhoneCallActive(), 'Second cycle: should be active after show');

  dismissPhoneCall();
  assert.isFalse(isPhoneCallActive(), 'Second cycle: should be inactive after dismiss');
}

// Test changing caller name between calls
{
  setupMockDOM();

  showPhoneCall('First Caller');
  const overlay = document.getElementById('phone-overlay');
  const callerNameElement = overlay.querySelector('.caller-name');
  assert.equal(callerNameElement.textContent, 'First Caller', 'First caller name should be set');

  dismissPhoneCall();

  showPhoneCall('Second Caller');
  assert.equal(callerNameElement.textContent, 'Second Caller', 'Second caller name should replace first');
}

console.log('\n=== phone.js tests complete ===');
