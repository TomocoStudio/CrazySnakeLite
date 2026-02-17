// CrazySnakeLite - Reaction Time Calibration Fix Migration
// Recalculates reactionTime metric for all stored sessions with correct normalization range
// Run once to fix sessions with unrealistic 200-800ms range

import { calculateReactionTime } from './metrics.js';
import { getSessions, getProfile, updateProfile } from './storage.js';

/**
 * Update a session in IndexedDB
 */
async function updateSessionInDB(session) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CrazySnakeMetrics', 1);

    request.onsuccess = (event) => {
      try {
        const db = event.target.result;
        const transaction = db.transaction(['sessions'], 'readwrite');
        const store = transaction.objectStore('sessions');
        const putRequest = store.put(session);

        putRequest.onsuccess = () => {
          db.close();
          resolve();
        };

        putRequest.onerror = () => {
          db.close();
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
 */
function calculateDomainScores(sessions) {
  const metrics = ['reactionTime', 'spatialAwareness', 'cognitiveFlexibility', 'dividedAttention', 'impulseControl', 'workingMemory'];
  const domains = {};

  metrics.forEach(metric => {
    const values = sessions
      .map(s => s.metrics?.[metric])
      .filter(v => v !== null && v !== undefined);

    if (values.length === 0) {
      domains[metric] = null;
      return;
    }

    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    domains[metric] = avg * 5.0; // Convert to 0.0-5.0 scale
  });

  return domains;
}

/**
 * Main migration function
 */
async function migrateReactionTime() {
  console.log('🔧 Starting Reaction Time Calibration Migration...\n');

  try {
    // Step 1: Load all sessions
    console.log('📦 Loading all sessions from IndexedDB...');
    const allSessions = await getSessions(1000);
    console.log(`✅ Loaded ${allSessions.length} sessions\n`);

    if (allSessions.length === 0) {
      console.log('⚠️  No sessions found. Nothing to migrate.');
      return;
    }

    // Step 2: Recalculate reactionTime for each session
    console.log('🔄 Recalculating Reaction Time with new calibration (500-3000ms)...');
    let updatedCount = 0;
    let errorCount = 0;
    let improvements = [];

    for (let i = 0; i < allSessions.length; i++) {
      const session = allSessions[i];

      try {
        console.log(`  Processing session ${i + 1}/${allSessions.length}...`);

        // Recalculate reaction time from raw events using FIXED normalization
        const newReactionScore = calculateReactionTime(session.rawEvents || []);

        const oldReactionScore = session.metrics.reactionTime;
        const improvement = newReactionScore - (oldReactionScore || 0);

        console.log(`    Old: ${oldReactionScore?.toFixed(4) || 'null'} → New: ${newReactionScore.toFixed(4)} (${improvement >= 0 ? '+' : ''}${improvement.toFixed(4)})`);

        // Track improvements
        if (oldReactionScore !== null && oldReactionScore !== undefined) {
          improvements.push(improvement);
        }

        // Update the session's reaction time metric
        session.metrics.reactionTime = newReactionScore;

        // Save updated session back to storage
        await updateSessionInDB(session);

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

    // Step 3: Show improvement statistics
    if (improvements.length > 0) {
      const avgImprovement = improvements.reduce((sum, v) => sum + v, 0) / improvements.length;
      const maxImprovement = Math.max(...improvements);
      const minImprovement = Math.min(...improvements);

      console.log('\n📈 Score Improvements:');
      console.log(`  Average: ${avgImprovement >= 0 ? '+' : ''}${avgImprovement.toFixed(4)} (0-1 scale)`);
      console.log(`  Best case: ${maxImprovement >= 0 ? '+' : ''}${maxImprovement.toFixed(4)}`);
      console.log(`  Worst case: ${minImprovement >= 0 ? '+' : ''}${minImprovement.toFixed(4)}`);
      console.log(`  On 0-5 scale: ${(avgImprovement * 5).toFixed(2)} points higher on average`);
    }

    // Step 4: Recalculate domain scores
    console.log('\n📊 Recalculating domain scores...');
    const reloadedSessions = await getSessions(10);
    const newDomainScores = calculateDomainScores(reloadedSessions);

    console.log('New domain scores (0.0-5.0 scale):');
    Object.entries(newDomainScores).forEach(([domain, score]) => {
      if (score !== null) {
        console.log(`  ${domain}: ${score.toFixed(2)}`);
      } else {
        console.log(`  ${domain}: null (insufficient data)`);
      }
    });

    // Step 5: Update profile
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
    console.log(`✅ Reaction Time now uses realistic 500-3000ms range`);
    console.log(`✅ Domain scores updated`);
    console.log(`✅ Profile updated`);
    console.log('\n👉 Refresh the game and check your Skill Map!');
    console.log('   Your Reaction score should be much higher now.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Export for execution from HTML page or console
export { migrateReactionTime };
