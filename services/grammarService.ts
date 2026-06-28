import db from '../models';
import { CreateGrammarDto } from '../types';

const Grammars = db.Grammars;

class GrammarService {
  async getAllGrammars() {
    return await Grammars.findAll();
  }

  async getGrammarsByLessonId(lessonId: string | number) {
    return await Grammars.findAll({
      where: { lessonId },
      include: [
        {
          model: db.Examples,
          as: 'examples',
        },
        {
          model: db.Excersises,
          as: 'excersises',
        },
      ],
    });
  }

  async createGrammar(data: CreateGrammarDto) {
    return await Grammars.create(data);
  }

  async updateGrammar(id: string, data: Partial<CreateGrammarDto>) {
    const grammar = await Grammars.findByPk(id);
    if (!grammar) return null;
    await grammar.update(data);
    return grammar;
  }

  async deleteGrammar(id: string): Promise<boolean> {
    const deleted = await Grammars.destroy({ where: { id } });
    return deleted > 0;
  }
}

export default new GrammarService();