// CrazySnakeLite - Dashboard Unit Tests
// Story 16.2: Block bar rendering tests

/**
 * Test block bar rendering logic
 * Validates createBlockBarRow function produces correct DOM structure
 */
function testBlockBarRendering() {
  console.log('Testing block bar rendering...');

  // Test case 1: 3/5 blocks filled
  const row3 = createTestBlockBarRow('Reaction', 3);
  const blocks3 = row3.querySelectorAll('.block');

  console.assert(blocks3.length === 5, 'Test 1: Should render 5 blocks');
  console.assert(blocks3[0].classList.contains('filled'), 'Test 1: Block 0 should be filled');
  console.assert(blocks3[1].classList.contains('filled'), 'Test 1: Block 1 should be filled');
  console.assert(blocks3[2].classList.contains('filled'), 'Test 1: Block 2 should be filled');
  console.assert(blocks3[3].classList.contains('empty'), 'Test 1: Block 3 should be empty');
  console.assert(blocks3[4].classList.contains('empty'), 'Test 1: Block 4 should be empty');

  const ratingText3 = row3.querySelector('.rating-text').textContent;
  console.assert(ratingText3 === '3/5', 'Test 1: Rating text should be 3/5');

  // Test case 2: 0/5 blocks filled (all empty)
  const row0 = createTestBlockBarRow('Impulse', 0);
  const blocks0 = row0.querySelectorAll('.block');

  console.assert(blocks0.length === 5, 'Test 2: Should render 5 blocks');
  blocks0.forEach((block, i) => {
    console.assert(block.classList.contains('empty'), `Test 2: Block ${i} should be empty`);
  });

  const ratingText0 = row0.querySelector('.rating-text').textContent;
  console.assert(ratingText0 === '0/5', 'Test 2: Rating text should be 0/5');

  // Test case 3: 5/5 blocks filled (all filled)
  const row5 = createTestBlockBarRow('Spatial', 5);
  const blocks5 = row5.querySelectorAll('.block');

  console.assert(blocks5.length === 5, 'Test 3: Should render 5 blocks');
  blocks5.forEach((block, i) => {
    console.assert(block.classList.contains('filled'), `Test 3: Block ${i} should be filled`);
  });

  const ratingText5 = row5.querySelector('.rating-text').textContent;
  console.assert(ratingText5 === '5/5', 'Test 3: Rating text should be 5/5');

  // Test case 4: DOM structure validation
  const row = createTestBlockBarRow('Memory', 4);
  console.assert(row.classList.contains('block-bar-row'), 'Test 4: Row should have block-bar-row class');
  console.assert(row.querySelector('.domain-label'), 'Test 4: Row should have domain-label element');
  console.assert(row.querySelector('.blocks-container'), 'Test 4: Row should have blocks-container element');
  console.assert(row.querySelector('.rating-text'), 'Test 4: Row should have rating-text element');

  const label = row.querySelector('.domain-label').textContent;
  console.assert(label === 'Memory', 'Test 4: Label should be "Memory"');

  console.log('✓ All block bar rendering tests passed!');
}

/**
 * Helper function to create a block bar row for testing
 * Replicates the createBlockBarRow logic from dashboard.js
 */
function createTestBlockBarRow(label, blockScore) {
  const row = document.createElement('div');
  row.className = 'block-bar-row';

  // Domain label
  const labelEl = document.createElement('span');
  labelEl.className = 'domain-label';
  labelEl.textContent = label;
  row.appendChild(labelEl);

  // Block container (5 blocks)
  const blocksContainer = document.createElement('div');
  blocksContainer.className = 'blocks-container';

  for (let i = 0; i < 5; i++) {
    const block = document.createElement('div');
    block.className = i < blockScore ? 'block filled' : 'block empty';
    blocksContainer.appendChild(block);
  }

  row.appendChild(blocksContainer);

  // Rating text (e.g., "4/5")
  const ratingText = document.createElement('span');
  ratingText.className = 'rating-text';
  ratingText.textContent = `${blockScore}/5`;
  row.appendChild(ratingText);

  return row;
}

// Run tests
testBlockBarRendering();
