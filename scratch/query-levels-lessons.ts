import dotenv from 'dotenv';
dotenv.config();
import db from '../models';

async function run() {
  const levels = await db.Levels.findAll({
    include: [{ model: db.Lessons, as: 'lessons' }]
  });
  for (const l of levels) {
    console.log(`LEVEL id=${l.id}, levelName="${l.levelName}", level="${l.level}"`);
    for (const les of l.lessons) {
      console.log(`  -> LESSON id=${les.id}, lessonName="${les.lessonName}", title="${les.title}", slug="${les.slug}"`);
    }
  }
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
