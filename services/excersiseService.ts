import db from '../models';
import { CreateExcersiseDto } from '../types';

const Excersises = db.Excersises;

class ExcersiseService {
  async getAllExcersises() {
    return await Excersises.findAll({
      include: [
        {
          model: db.Grammars,
          as: 'grammar',
        },
      ],
    });
  }

  async createExcersise(data: CreateExcersiseDto) {
    return await Excersises.create(data);
  }

  async updateExcersise(id: string | number, data: Partial<CreateExcersiseDto>) {
    const excersise = await Excersises.findByPk(id);
    if (!excersise) return null;
    await excersise.update(data);
    return excersise;
  }

  async deleteExcersise(id: string | number): Promise<boolean> {
    const deleted = await Excersises.destroy({ where: { id } });
    return deleted > 0;
  }

  async getExcersisesByGrammarId(grammarId: string | number) {
    return await Excersises.findAll({
      where: { grammarId },
    });
  }
}

export default new ExcersiseService();
