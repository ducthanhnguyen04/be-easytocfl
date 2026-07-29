import dotenv from 'dotenv';
dotenv.config();
import db from '../models';
import { up } from '../migrations/20260730000000-add-description-to-levels';

async function run() {
  const queryInterface = db.sequelize.getQueryInterface();
  try {
    console.log("Running migration 20260730000000-add-description-to-levels...");
    await up(queryInterface);
    console.log("Migration executed successfully!");
  } catch (err: any) {
    if (err.message && (err.message.includes('Duplicate column name') || err.message.includes('already exists'))) {
      console.log("Column description already exists on Levels.");
    } else {
      console.error("Migration error:", err);
    }
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
