import dotenv from 'dotenv';
dotenv.config();
import db from '../models';
import { up } from '../migrations/20260718110000-add-longest-streak-to-users';

async function run() {
  const queryInterface = db.sequelize.getQueryInterface();
  try {
    console.log("Running migration 20260718110000-add-longest-streak-to-users...");
    await up(queryInterface);
    console.log("Migration executed successfully!");
  } catch (err: any) {
    if (err.message && err.message.includes('Duplicate column name')) {
      console.log("Column longestStreak already exists.");
    } else {
      console.error("Migration error:", err);
    }
  }

  // Backfill longestStreak for existing users if user.longestStreak < user.streakCount
  try {
    const users = await db.User.findAll();
    for (const u of users) {
      const currentStreak = u.streakCount || 0;
      const longest = u.longestStreak || 0;
      if (currentStreak > longest || longest === 0) {
        u.longestStreak = Math.max(longest, currentStreak);
        await u.save();
        console.log(`Updated user ${u.id} (${u.userName}): longestStreak = ${u.longestStreak}`);
      }
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
