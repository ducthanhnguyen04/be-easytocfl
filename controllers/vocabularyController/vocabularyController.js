const { Vocabularies } = require("../../models");
const vocabularyService = require("../../services/vocabularyService");

class VocabularyController {
    async getAllVocabularies(req, res) {
        try {
            const vocabularies = await vocabularyService.getAllVocabularies();
            return res.json({
                message: "Get all vocabularies successfully",
                vocabularies
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createVocabulary(req, res) {
        try {
            const { vocabulary, meaning, pinyin, audioUrl, lessonId } = req.body;
            if(!vocabulary || !meaning || !pinyin) {
                return res.status(400).json({ message: "All are required" });
            }
            const newVocabulary = await vocabularyService.createVocabulary({ vocabulary, meaning, pinyin, audioUrl, lessonId });
            return res.json({
                message: "Create vocabulary successfully",
                vocabulary: newVocabulary
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateVocabulary(req, res) {
        try {
            const { vocabulary, meaning, pinyin, audioUrl, lessonId } = req.body;
            const { id } = req.params;
            if(!vocabulary || !meaning || !pinyin) {
                return res.status(400).json({ message: "All are required" });
            }
            const updatedVocabulary = await vocabularyService.updateVocabulary(id, { vocabulary, meaning, pinyin, audioUrl, lessonId });
            return res.json({
                message: "Update vocabulary successfully",
                vocabulary: updatedVocabulary
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteVocabulary(req, res) {
        try {
            const { id } = req.params;
            const deleted = await vocabularyService.deleteVocabulary(id);
            if (!deleted) {
                return res.status(404).json({ message: "Vocabulary not found" });
            }
            return res.json({
                message: "Delete vocabulary successfully",
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }   
    }
    async getVocabularyByLessonId(req, res) {
        try {
            const { lessonId } = req.query;
            if(!lessonId) {
                return res.status(400).json({ message: "Lesson ID is required" });
            }
            const vocabularies = await vocabularyService.getVocabularyByLessonId(lessonId);
            return res.json({
                message: "Get vocabularies by lesson ID successfully",
                vocabularies
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new VocabularyController();