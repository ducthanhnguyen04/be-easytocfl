import db from '../models';
import { CreateLessonDto, UpdateLessonDto } from '../types';

const Lessons = db.Lessons;

class LessonService {
  async getAllLessons() {
    return await Lessons.findAll({
      order: [['id', 'ASC']]
    });
  }

  async createLesson(data: CreateLessonDto) {
    return await Lessons.create(data);
  }

  async updateLesson(id: string, data: UpdateLessonDto) {
    const lesson = await Lessons.findByPk(id);
    if (!lesson) return null;
    await lesson.update(data);
    return lesson;
  }

  async deleteLesson(id: string): Promise<boolean> {
    const deleted = await Lessons.destroy({ where: { id } });
    return deleted > 0;
  }

  async getLessonByLevelId(levelId: string | number) {
    return await Lessons.findAll({
      where: { levelId },
      order: [['id', 'ASC']]
    });
  }
}

export default new LessonService();