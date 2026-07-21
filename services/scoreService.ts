import db from '../models';
import { Op } from 'sequelize';

const User = db.User;
const ScoreLogs = db.ScoreLogs;
const Vocabularies = db.Vocabularies;
const Lessons = db.Lessons;

const EXAMS_ANSWERS: Record<string, Record<string, number>> = {
  bandA: { "1": 1, "2": 2, "3": 1 },
  bandB: { "1": 2, "2": 1 }
};

class ScoreService {
  // Check request speed cooldown (5 seconds)
  private async checkCooldown(userId: number) {
    const recentLog = await ScoreLogs.findOne({
      where: {
        userId,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 5000) // 5 seconds ago
        }
      }
    });

    if (recentLog) {
      const error: any = new Error('Thao tác quá nhanh! Vui lòng đợi 5 giây giữa các lượt gửi.');
      error.status = 429;
      throw error;
    }
  }

  async submitQuiz(userId: number, lessonId: number, answers: Array<{ vocabId: number, chosenTranslation: string }>, timeSpent: number) {
    // 1. Cooldown check
    await this.checkCooldown(userId);

    if (!answers || answers.length === 0) {
      const error: any = new Error('Danh sách câu trả lời không hợp lệ.');
      error.status = 400;
      throw error;
    }

    // 2. Minimum time spent check (1.5 seconds per question)
    const minTime = answers.length * 1.5;
    if (timeSpent < minTime) {
      const error: any = new Error('Thời gian làm bài quá ngắn! Vui lòng học tập trung hơn.');
      error.status = 400;
      throw error;
    }

    // 3. Check if quiz for this lesson was already completed (anti-cheat: only score quiz once per lesson)
    const activityId = `quiz_lesson_${lessonId}`;
    const existingQuizLog = await ScoreLogs.findOne({
      where: { userId, activityType: 'quiz', activityId }
    });

    if (existingQuizLog) {
      const error: any = new Error('Bạn đã nhận điểm cho bài trắc nghiệm này trước đó rồi.');
      error.status = 400;
      throw error;
    }

    // 4. Verify lesson exists
    const lesson = await Lessons.findByPk(lessonId);
    if (!lesson) {
      const error: any = new Error('Bài học không tồn tại.');
      error.status = 404;
      throw error;
    }

    // 5. Query correct translations from DB and compute score
    const vocabIds = answers.map(a => a.vocabId);
    const dbVocabs = await Vocabularies.findAll({
      where: {
        id: vocabIds,
        lessonId
      }
    });

    let correctCount = 0;
    answers.forEach(ans => {
      const vocab = dbVocabs.find(v => v.id === ans.vocabId);
      if (vocab && vocab.meaning === ans.chosenTranslation) {
        correctCount++;
      }
    });

    const pointsEarned = correctCount * 10;

    // 6. Save score log and update user score
    const user = await User.findByPk(userId);
    if (!user) {
      const error: any = new Error('Không tìm thấy người dùng.');
      error.status = 404;
      throw error;
    }

    await db.sequelize.transaction(async (t: any) => {
      await ScoreLogs.create({
        userId,
        activityType: 'quiz',
        activityId,
        points: pointsEarned,
        timeSpent
      }, { transaction: t });

      user.score = (user.score || 0) + pointsEarned;
      await user.save({ transaction: t });
    });

    return {
      pointsEarned,
      totalScore: user.score,
      correctCount,
      totalCount: answers.length
    };
  }

  async completeLesson(userId: number, lessonId: number, timeSpent: number) {
    // 1. Cooldown check
    await this.checkCooldown(userId);

    // 2. Minimum time spent check (10 seconds for reading a lesson)
    if (timeSpent < 10) {
      const error: any = new Error('Thời gian học bài quá ngắn! Vui lòng đọc kỹ nội dung bài học.');
      error.status = 400;
      throw error;
    }

    // 3. Verify lesson exists
    const lesson = await Lessons.findByPk(lessonId);
    if (!lesson) {
      const error: any = new Error('Bài học không tồn tại.');
      error.status = 404;
      throw error;
    }

    const activityId = `lesson_${lessonId}`;

    // 4. Check if lesson completed before (first time: 50 points, repeat: 10 points (20%))
    const existingLog = await ScoreLogs.findOne({
      where: { userId, activityType: 'lesson', activityId }
    });

    let pointsEarned = 50;
    if (existingLog) {
      pointsEarned = 10; // 20% of 50

      // Anti-cheat: prevent spamming repeat completion of same lesson (minimum 1 minute between repeat completions)
      const lastRepeatLog = await ScoreLogs.findOne({
        where: {
          userId,
          activityType: 'lesson',
          activityId
        },
        order: [['createdAt', 'DESC']]
      });

      if (lastRepeatLog && (Date.now() - new Date(lastRepeatLog.createdAt).getTime() < 60000)) {
        const error: any = new Error('Bạn vừa hoàn thành bài học này! Vui lòng đợi 1 phút trước khi học lại.');
        error.status = 400;
        throw error;
      }
    }

    // 5. Update user score and save log
    const user = await User.findByPk(userId);
    if (!user) {
      const error: any = new Error('Không tìm thấy người dùng.');
      error.status = 404;
      throw error;
    }

    await db.sequelize.transaction(async (t: any) => {
      await ScoreLogs.create({
        userId,
        activityType: 'lesson',
        activityId,
        points: pointsEarned,
        timeSpent
      }, { transaction: t });

      user.score = (user.score || 0) + pointsEarned;
      await user.save({ transaction: t });
    });

    return {
      pointsEarned,
      totalScore: user.score,
      isFirstTime: !existingLog
    };
  }

  async submitExam(userId: number, examId: string, answers: Record<string, number>, timeSpent: number) {
    // 1. Cooldown check
    await this.checkCooldown(userId);

    const examAnswers = EXAMS_ANSWERS[examId];
    if (!examAnswers) {
      const error: any = new Error('Đề thi thử không tồn tại.');
      error.status = 404;
      throw error;
    }

    // 2. Minimum time check (3 seconds per question)
    const questionIds = Object.keys(examAnswers);
    const minTime = questionIds.length * 3;
    if (timeSpent < minTime) {
      const error: any = new Error('Thời gian làm bài thi quá ngắn! Vui lòng tập trung suy nghĩ và không gian lận.');
      error.status = 400;
      throw error;
    }

    // 3. Verify only one score per exam (anti-cheat: only get points once per exam)
    const activityId = `exam_${examId}`;
    const existingLog = await ScoreLogs.findOne({
      where: { userId, activityType: 'exam', activityId }
    });

    if (existingLog) {
      const error: any = new Error('Bạn đã nhận điểm cho đề thi thử này trước đó rồi.');
      error.status = 400;
      throw error;
    }

    // 4. Calculate score
    let correctCount = 0;
    questionIds.forEach(qId => {
      if (answers[qId] === examAnswers[qId]) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questionIds.length) * 100);
    const pointsEarned = scorePercent;

    // 5. Update user score and save log
    const user = await User.findByPk(userId);
    if (!user) {
      const error: any = new Error('Không tìm thấy người dùng.');
      error.status = 404;
      throw error;
    }

    await db.sequelize.transaction(async (t: any) => {
      await ScoreLogs.create({
        userId,
        activityType: 'exam',
        activityId,
        points: pointsEarned,
        timeSpent
      }, { transaction: t });

      user.score = (user.score || 0) + pointsEarned;
      await user.save({ transaction: t });
    });

    return {
      pointsEarned,
      totalScore: user.score,
      correctCount,
      totalCount: questionIds.length,
      scorePercent
    };
  }

  async getLeaderboard() {
    // 1. Fetch top 100 users by score
    const topUsers = await User.findAll({
      attributes: ['id', 'userName', 'email', 'avatarUrl', 'score'],
      order: [['score', 'DESC']],
      limit: 100
    });

    // 2. Fetch vocabulary count and exam count for each user from ScoreLogs
    const leaderboardData = await Promise.all(topUsers.map(async (u) => {
      // a. Count mock exams done
      const examCount = await ScoreLogs.count({
        where: {
          userId: u.id,
          activityType: 'exam'
        },
        distinct: true,
        col: 'activityId'
      });

      // b. Calculate vocabulary count learned: SUM(lesson.vocabularies.length) for all completed lessons
      // Get all completed lesson IDs
      const completedLessonLogs = await ScoreLogs.findAll({
        where: {
          userId: u.id,
          activityType: 'lesson'
        },
        attributes: ['activityId'],
        group: ['activityId']
      });

      const lessonIds = completedLessonLogs.map(log => {
        const match = log.activityId.match(/^lesson_(\d+)$/);
        return match ? parseInt(match[1]) : null;
      }).filter(id => id !== null) as number[];

      let vocabCount = 0;
      if (lessonIds.length > 0) {
        // Query vocabulary count for these lessons
        vocabCount = await Vocabularies.count({
          where: {
            lessonId: lessonIds
          }
        });
      }

      return {
        id: u.id,
        userName: u.userName,
        avatarUrl: u.avatarUrl,
        score: u.score || 0,
        vocabCount,
        examCount
      };
    }));

    return leaderboardData;
  }
}

export default new ScoreService();
