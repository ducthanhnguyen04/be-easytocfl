import db from '../models';
import { CreateRadicalDto } from '../types';

const Radical = db.Radical;

class RadicalService {
  async getAllRadicals() {
    return await Radical.findAll();
  }

  async createRadical(data: CreateRadicalDto) {
    return await Radical.create(data);
  }

  async updateRadical(id: string, data: Partial<CreateRadicalDto>) {
    const radical = await Radical.findByPk(id);
    if (!radical) return null;
    await radical.update(data);
    return radical;
  }

  async deleteRadical(id: string): Promise<boolean> {
    const deleted = await Radical.destroy({ where: { id } });
    return deleted > 0;
  }
}

export default new RadicalService();
