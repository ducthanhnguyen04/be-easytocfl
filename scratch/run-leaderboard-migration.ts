import dotenv from 'dotenv';
dotenv.config();
import db from '../models';
import { up as upAddScore } from '../migrations/20260722000000-add-score-to-users';
import { up as upCreateScoreLogs } from '../migrations/20260722000001-create-score-logs';

async function run() {
  const queryInterface = db.sequelize.getQueryInterface();
  
  try {
    console.log("Running migration 20260722000000-add-score-to-users...");
    await upAddScore(queryInterface);
    console.log("score column added to Users table successfully!");
  } catch (err: any) {
    if (err.message && err.message.includes('Duplicate column name')) {
      console.log("score column already exists on Users table.");
    } else {
      console.error("Add score column migration error:", err);
    }
  }

  try {
    console.log("Running migration 20260722000001-create-score-logs...");
    await upCreateScoreLogs(queryInterface);
    console.log("ScoreLogs table created successfully!");
  } catch (err: any) {
    if (err.message && (err.message.includes('already exists') || err.message.includes('Table \'ScoreLogs\' already exists'))) {
      console.log("ScoreLogs table already exists.");
    } else {
      console.error("ScoreLogs migration error:", err);
    }
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
