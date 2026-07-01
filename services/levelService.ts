import db from '../models';
import { CreateLevelDto } from '../types';
import { deleteFromSupabase } from '../utils/supabase';

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
    const oldLevel = await Levels.findByPk(id);
    const [updated] = await Levels.update(data, { where: { id } });
    if (updated) {
      if (oldLevel && oldLevel.image && oldLevel.image !== data.image) {
        if (oldLevel.image.includes('supabase.co')) {
          await deleteFromSupabase(oldLevel.image);
        }
      }
      return await Levels.findByPk(id);
    }
    return null;
  }

  async deleteLevel(id: string): Promise<boolean> {
    const oldLevel = await Levels.findByPk(id);
    const deleted = await Levels.destroy({ where: { id } });
    if (deleted > 0 && oldLevel && oldLevel.image) {
      if (oldLevel.image.includes('supabase.co')) {
        await deleteFromSupabase(oldLevel.image);
      }
    }
    return deleted > 0;
  }
}

export default new LevelService();