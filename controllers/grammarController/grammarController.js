const { Grammars } = require("../../models");
const grammarService = require("../../services/grammarService");

class GrammarController {
    async getAllGrammars(req, res) {
        try {
            const grammars = await grammarService.getAllGrammars();
            return res.json({
                message: "Get all grammars successfully",
                grammars
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
     }
     async createGrammar(req, res) {
         try {
            const { grammar, structure, usage, notes, lessonId } = req.body;
            if(!grammar || !structure || !usage || !lessonId) {
                return res.status(400).json({ message: "All are required" });
            }
            const newGrammar = await grammarService.createGrammar({ grammar, structure, usage, notes, lessonId });
            return res.json({
                message: "Create grammar successfully",
                grammar: newGrammar
            })
         } catch (error) {
            res.status(500).json({ error: error.message });
         }
     }
     async updateGrammar(req, res) {
        try {
            const { grammar, structure, usage, notes, lessonId } = req.body;
            const { id } = req.params;
            if(!grammar || !structure || !usage || !lessonId) {
                return res.status(400).json({ message: "All are required" });
            }
            const updatedGrammar = await grammarService.updateGrammar(id, { grammar, structure, usage, notes, lessonId });
            return res.json({
                message: "Update grammar successfully",
                grammar: updatedGrammar
            })
         } catch (error) {
            res.status(500).json({ error: error.message });
         }
     }
     async deleteGrammar(req, res) {
        try {
            const { id } = req.params;
            const deleted = await grammarService.deleteGrammar(id);
            if(!deleted) {
                return res.status(404).json({ message: "Grammar not found" });
            }
            return res.json({
                message: "Delete grammar successfully",
            })
         } catch (error) {
            res.status(500).json({ error: error.message });
         }
     }
}

module.exports = new GrammarController();