import db from '../models';
import { CreateLevelDto } from '../types';

const Levels = db.Levels;
const Lessons = db.Lessons;

class LevelService {
  async getAllLevels() {
    return await Levels.findAll({
      order: [
        ['id', 'ASC'],
        [{ model: Lessons, as: 'lessons' }, 'id', 'ASC']
      ],
      include: [
        {
          model: Lessons,
          as: 'lessons'
        }
      ]
    });
  }

  async createLevel(data: CreateLevelDto) {
    return await Levels.create(data);
  }

  async updateLevel(id: string, data: Partial<CreateLevelDto>) {
    const [updated] = await Levels.update(data, { where: { id } });
    if (updated) {
      return await Levels.findByPk(id);
    }
    return null;
  }

  async deleteLevel(id: string): Promise<boolean> {
    const deleted = await Levels.destroy({ where: { id } });
    return deleted > 0;
  }
}

export default new LevelService();