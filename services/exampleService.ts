import db from '../models';
import { CreateExampleDto } from '../types';

const Examples = db.Examples;

class ExampleService {
  async getAllExamples() {
    return await Examples.findAll();
  }

  async createExample(data: CreateExampleDto) {
    return await Examples.create(data);
  }

  async updateExample(id: string, data: Partial<CreateExampleDto>) {
    const example = await Examples.findByPk(id);
    if (!example) return null;
    await example.update(data);
    return example;
  }

  async deleteExample(id: string): Promise<boolean> {
    const deleted = await Examples.destroy({ where: { id } });
    return deleted > 0;
  }
}

export default new ExampleService();