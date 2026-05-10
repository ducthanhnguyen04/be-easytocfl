const { Vocabularies } = require("../../models");

class VocabularyController {
    async getAllVocabularies(req, res) {
        try {
            const vocabularies = await Vocabularies.findAll();
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
            const newVocabulary = await Vocabularies.create({ vocabulary, meaning, pinyin, audioUrl, lessonId });
            return res.json({
                message: "Create vocabulary successfully",
                vocabulary: newVocabulary
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new VocabularyController();