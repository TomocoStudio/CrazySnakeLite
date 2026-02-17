// CrazySnakeLite - Spatial Awareness Bug Fix Migration
// Recalculates spatialAwareness metric for all stored sessions
// Run once to fix the 131 sessions with incorrect spatial scores

import { calculateSpatialAwareness } from './metrics.js';
import { getSessions, getProfile, updateProfile } from './storage.js';
import { CONFIG } from './config.js';

/**
 * Update a session in IndexedDB (helper function since storage.js doesn't export this)
 */
async function updateSessionInDB(session) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CrazySnakeMetrics', 1);

    request.onsuccess = (event) => {
      try {
        const db = event.target.result;
        const transaction = db.transaction(['sessions'], 'readwrite');
        const store = transaction.objectStore('sessions');
        const putRequest = store.put(session); // put() updates existing or adds new

        putRequest.onsuccess = () => {
          db.close(); // Close DB connection
          resolve();
        };

        putRequest.onerror = () => {
          db.close(); // Close DB connection
          reject(new Error(`Put failed: ${putRequest.error?.message || 'unknown error'}`));
        };

        transaction.onerror = () => {
          db.close();
          reject(new Error(`Transaction failed: ${transaction.error?.message || 'unknown error'}`));
        };
      } catch (error) {
        reject(new Error(`Exception in updateSessionInDB: ${error.message}`));
      }
    };

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error?.message || 'unknown error'}`));
    };

    request.onblocked = () => {
      reject(new Error('IndexedDB open request blocked'));
    };
  });
}

/**
 * Recalculate domain scores from sessions
 * Simplified version of the logic from game.js onDeath()
 */
function calculateDomainScores(sessions) {
  const metrics = ['reactionTime', 'spatialAwareness', 'cognitiveFlexibility', 'dividedAttention', 'impulseControl', 'workingMemory'];
  const domains = {};

  metrics.forEach(metric => {
    // Get all non-null values for this metric
    const values = sessions
      .map(s => s.metrics?.[metric])
      .filter(v => v !== null && v !== undefined);

    if (values.length === 0) {
      domains[metric] = null; // No data
      return;
    }

    // Simple average for domain score
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

    // Convert to 0.0-5.0 scale
    domains[metric] = avg * 5.0;
  });

  return domains;
}

/**
 * Main migration function
 */
async function migrateSpatialAwareness() {
  console.log('🔧 Starting Spatial Awareness Migration...\n');

  try {
    // Step 1: Load all sessions
    console.log('📦 Loading all sessions from IndexedDB...');
    const allSessions = await getSessions(1000); // Get up to 1000 sessions (more than enough)
    console.log(`✅ Loaded ${allSessions.length} sessions\n`);

    if (allSessions.length === 0) {
      console.log('⚠️  No sessions found. Nothing to migrate.');
      return;
    }

    // Step 2: Recalculate spatialAwareness for each session
    console.log('🔄 Recalculating Spatial Awareness for all sessions...');
    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < allSessions.length; i++) {
      const session = allSessions[i];

      try {
        console.log(`  Processing session ${i + 1}/${allSessions.length}...`);

        // Extract parameters needed for spatial calculation
        // snakeLength = score + STARTING_LENGTH (since score = foods eaten)
        const snakeLength = session.score + CONFIG.STARTING_LENGTH;

        console.log(`    Parameters: snakeLength=${snakeLength}, gridW=${CONFIG.GRID_WIDTH}, gridH=${CONFIG.GRID_HEIGHT}, unitSize=${CONFIG.UNIT_SIZE}`);

        // Recalculate spatial awareness with FIXED formula
        const newSpatialScore = calculateSpatialAwareness(
          snakeLength,
          CONFIG.GRID_WIDTH,
          CONFIG.GRID_HEIGHT,
          CONFIG.UNIT_SIZE
        );

        console.log(`    calculateSpatialAwareness returned: ${newSpatialScore}`);

        const oldSpatialScore = session.metrics.spatialAwareness;
        console.log(`    Old: ${oldSpatialScore?.toFixed(4) || 'null'} → New: ${newSpatialScore.toFixed(4)}`);

        // Update the session's spatial awareness metric
        session.metrics.spatialAwareness = newSpatialScore;

        // Save updated session back to storage
        console.log(`    Saving to IndexedDB...`);
        await updateSessionInDB(session);
        console.log(`    ✓ Saved`);

        updatedCount++;
      } catch (error) {
        console.error(`  ❌ Error updating session ${i + 1}:`, error.message, error.stack);
        errorCount++;
      }
    }

    console.log(`\n✅ Updated ${updatedCount} sessions`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} sessions had errors`);
    }

    // Step 3: Recalculate domain scores
    console.log('\n📊 Recalculating domain scores...');
    const reloadedSessions = await getSessions(10); // Get last 10 for rolling average
    const newDomainScores = calculateDomainScores(reloadedSessions);

    console.log('New domain scores (0.0-5.0 scale):');
    Object.entries(newDomainScores).forEach(([domain, score]) => {
      if (score !== null) {
        console.log(`  ${domain}: ${score.toFixed(2)}`);
      } else {
        console.log(`  ${domain}: null (insufficient data)`);
      }
    });

    // Step 4: Update profile with new domain scores
    console.log('\n💾 Updating profile with corrected domain scores...');
    const profile = await getProfile();
    await updateProfile({
      ...profile,
      domainScores: newDomainScores,
      totalSessions: allSessions.length
    });

    console.log('✅ Profile updated\n');

    // Final summary
    console.log('═══════════════════════════════════════');
    console.log('🎉 Migration Complete!');
    console.log('═══════════════════════════════════════');
    console.log(`✅ ${updatedCount} sessions recalculated`);
    console.log(`✅ Domain scores updated`);
    console.log(`✅ Profile updated`);
    console.log('\n👉 Refresh the game and check your Skill Map!');
    console.log('   The Spatial domain should now show your real scores.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Export for execution from HTML page or console
export { migrateSpatialAwareness };
