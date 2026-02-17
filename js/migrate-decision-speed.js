// CrazySnakeLite - Decision Speed Metric Migration
// Resets decisionSpeed metric for all stored sessions (cannot retroactively calculate)
// Existing sessions have responseTime (navigation time) not decisionTime (first input latency)
// Per Sally's spec: Set to null, shows "Calibrating..." until 5 new games played

import { getSessions, getProfile, updateProfile } from './storage.js';

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
  const metrics = ['decisionSpeed', 'spatialAwareness', 'cognitiveFlexibility', 'dividedAttention', 'impulseControl', 'workingMemory'];
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
async function migrateDecisionSpeed() {
  console.log('🔧 Starting Decision Speed Migration...\n');
  console.log('📋 Context: Replacing broken "Reaction Time" metric');
  console.log('   Old metric measured navigation time (penalized mastery)');
  console.log('   New metric measures decision latency (snake-length agnostic)\n');

  try {
    // Step 1: Load all sessions
    console.log('📦 Loading all sessions from IndexedDB...');
    const allSessions = await getSessions(1000); // Get up to 1000 sessions (more than enough)
    console.log(`✅ Loaded ${allSessions.length} sessions\n`);

    if (allSessions.length === 0) {
      console.log('⚠️  No sessions found. Nothing to migrate.');
      return;
    }

    // Step 2: Reset decisionSpeed metric for each session
    console.log('🔄 Resetting Decision Speed for all sessions...');
    console.log('   (Cannot retroactively calculate - no firstInputAfterSpawn data)\n');
    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < allSessions.length; i++) {
      const session = allSessions[i];

      try {
        console.log(`  Processing session ${i + 1}/${allSessions.length}...`);

        // Reset decision speed to null (no data available)
        session.metrics.decisionSpeed = null;

        // Optional: Remove old reactionTime field (cleanup)
        if (session.metrics.reactionTime !== undefined) {
          console.log(`    Removing old reactionTime field: ${session.metrics.reactionTime?.toFixed(4) || 'null'}`);
          delete session.metrics.reactionTime;
        }

        // Save updated session back to storage
        console.log(`    Setting decisionSpeed = null, saving to IndexedDB...`);
        await updateSessionInDB(session);
        console.log(`    ✓ Saved`);

        updatedCount++;
      } catch (error) {
        console.error(`  ❌ Error updating session ${i + 1}:`, error.message);
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
    console.log('\n💾 Updating profile with new domain scores...');
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
    console.log(`✅ ${updatedCount} sessions reset (decisionSpeed = null)`);
    console.log(`✅ Domain scores updated`);
    console.log(`✅ Profile updated`);
    console.log('\n📈 Next Steps:');
    console.log('   1. Play 5 new games to calibrate Decision Speed');
    console.log('   2. Skill Map will show "Decision: Calibrating..." during calibration');
    console.log('   3. After 5 games, Decision Speed will display with real data\n');
    console.log('🎯 Expected Improvement:');
    console.log('   High-score games will no longer show 0.0 Decision Speed');
    console.log('   Metric now measures cognitive skill (decision latency)');
    console.log('   Better play → better scores (mastery properly rewarded)\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Export for execution from HTML page or console
export { migrateDecisionSpeed };
