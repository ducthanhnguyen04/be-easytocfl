import dotenv from 'dotenv';
dotenv.config();
import db from '../models';
import { up } from '../migrations/20260719000000-add-slug-to-levels';
import { generateLevelSlug } from '../services/levelService';

async function run() {
  const queryInterface = db.sequelize.getQueryInterface();
  try {
    console.log("Running migration 20260719000000-add-slug-to-levels...");
    await up(queryInterface);
    console.log("Migration executed successfully!");
  } catch (err: any) {
    if (err.message && (err.message.includes('Duplicate column name') || err.message.includes('already exists'))) {
      console.log("Column slug already exists on Levels.");
    } else {
      console.error("Migration error:", err);
    }
  }

  // Backfill slug for all levels in DB
  try {
    const levels = await db.Levels.findAll();
    for (const l of levels) {
      const slug = generateLevelSlug(l.levelName, l.level);
      l.slug = slug;
      await l.save();
      console.log(`Updated Level id=${l.id} (${l.levelName} - Level ${l.level}): slug="${l.slug}"`);
    }
  } catch (err) {
    console.error("Backfill error:", err);
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
