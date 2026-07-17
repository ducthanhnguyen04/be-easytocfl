import dotenv from 'dotenv';
dotenv.config();
import db from '../models';

async function run() {
  const users = await db.User.findAll();
  console.log("USERS STREAK DETAILS:", users.map((u: any) => ({
    id: u.id,
    userName: u.userName,
    streakCount: u.streakCount,
    studyTimeToday: u.studyTimeToday,
    lastStudyDate: u.lastStudyDate,
    lastHeartbeatDate: u.lastHeartbeatDate
  })));
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
