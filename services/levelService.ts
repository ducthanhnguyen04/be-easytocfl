import db from '../models';
import { CreateLevelDto } from '../types';
import { deleteFromSupabase } from '../utils/supabase';

const Levels = db.Levels;
const Lessons = db.Lessons;

export function generateLevelSlug(levelName: string, level: string): string {
  let baseName = levelName || '';
  if (baseName.includes('時代華語')) {
    baseName = 'shi-dai-hua-yu';
  } else if (baseName.includes('當代中文')) {
    baseName = 'dang-dai-zhong-wen';
  } else {
    baseName = baseName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  const levelSuffix = level ? level.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
  return levelSuffix ? `${baseName}-${levelSuffix}` : baseName;
}

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
    if (!data.slug) {
      data.slug = generateLevelSlug(data.levelName, data.level);
    }
    return await Levels.create(data as any);
  }

  async updateLevel(id: string, data: Partial<CreateLevelDto>) {
    const oldLevel = await Levels.findByPk(id);
    if (oldLevel && (!data.slug && (data.levelName || data.level))) {
      data.slug = generateLevelSlug(data.levelName || oldLevel.levelName, data.level || oldLevel.level);
    }
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