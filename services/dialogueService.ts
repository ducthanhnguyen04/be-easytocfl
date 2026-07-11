import db from '../models';
import { CreateDialogueDto, CreateDialogueLineDto } from '../types';

const Dialogues = db.Dialogues;
const DialogueLines = db.DialogueLines;

class DialogueService {
  async getAllDialogues() {
    return await Dialogues.findAll({
      include: [
        {
          model: DialogueLines,
          as: 'lines',
        }
      ],
      order: [
        ['id', 'ASC'],
        [{ model: DialogueLines, as: 'lines' }, 'lineOrder', 'ASC']
      ]
    });
  }

  async getDialogueByLessonId(lessonId: string | number) {
    return await Dialogues.findOne({
      where: { lessonId },
      include: [
        {
          model: DialogueLines,
          as: 'lines',
        }
      ],
      order: [
        [{ model: DialogueLines, as: 'lines' }, 'lineOrder', 'ASC']
      ]
    });
  }

  async createDialogue(data: CreateDialogueDto) {
    const transaction = await db.sequelize.transaction();
    try {
      const dialogue = await Dialogues.create({
        lessonId: data.lessonId,
        header: data.header,
        illustrationUrl: data.illustrationUrl
      }, { transaction });

      if (data.lines && data.lines.length > 0) {
        const parsedLines = data.lines.map((line: CreateDialogueLineDto) => ({
          ...line,
          dialogueId: dialogue.id
        }));
        await DialogueLines.bulkCreate(parsedLines, { transaction });
      }

      await transaction.commit();
      
      // Fetch the created dialogue with its lines
      return await Dialogues.findByPk(dialogue.id, {
        include: [{ model: DialogueLines, as: 'lines' }],
        order: [[{ model: DialogueLines, as: 'lines' }, 'lineOrder', 'ASC']]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateDialogue(id: string | number, data: Partial<CreateDialogueDto>) {
    const transaction = await db.sequelize.transaction();
    try {
      const dialogue = await Dialogues.findByPk(id, { transaction });
      if (!dialogue) {
        await transaction.rollback();
        return null;
      }

      await dialogue.update({
        lessonId: data.lessonId !== undefined ? data.lessonId : dialogue.lessonId,
        header: data.header !== undefined ? data.header : dialogue.header,
        illustrationUrl: data.illustrationUrl !== undefined ? data.illustrationUrl : dialogue.illustrationUrl
      }, { transaction });

      if (data.lines !== undefined) {
        // Clear all previous lines
        await DialogueLines.destroy({ where: { dialogueId: id }, transaction });
        
        if (data.lines.length > 0) {
          const parsedLines = data.lines.map((line: CreateDialogueLineDto) => ({
            ...line,
            dialogueId: dialogue.id
          }));
          await DialogueLines.bulkCreate(parsedLines, { transaction });
        }
      }

      await transaction.commit();

      return await Dialogues.findByPk(id, {
        include: [{ model: DialogueLines, as: 'lines' }],
        order: [[{ model: DialogueLines, as: 'lines' }, 'lineOrder', 'ASC']]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteDialogue(id: string | number): Promise<boolean> {
    const deleted = await Dialogues.destroy({ where: { id } });
    return deleted > 0;
  }
}

export default new DialogueService();
