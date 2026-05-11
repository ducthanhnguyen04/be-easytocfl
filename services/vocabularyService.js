const { Vocabularies } = require("../models");

class VocabularyService {
    async getAllVocabularies() {
        try {
            const allVocabularies = await Vocabularies.findAll();
            return allVocabularies;
        } catch (error) {
            throw error;
        }  
    }
    async createVocabulary(data) {
        try {
            const newVocabulary = await Vocabularies.create(data);
            return newVocabulary;
        } catch (error) {
            throw error;
        }
    }
    async updateVocabulary(id, data) {
        try {
            const vocabulary = await Vocabularies.findByPk(id);
            if(!vocabulary) {
                return null;
            }
            await vocabulary.update(data);
            return vocabulary;
        } catch (error) {
            throw error;
        }
    }
    async deleteVocabulary(id) {
        try {
            const deleted = await Vocabularies.destroy({ where: { id } });
            return deleted > 0; 
        } catch (error) {
            throw error;
        }
    }
    async getVocabularyByLessonId(lessonId) {
        try {
            const vocabularies = await Vocabularies.findAll({ where: { lessonId } });
            return vocabularies;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new VocabularyService();