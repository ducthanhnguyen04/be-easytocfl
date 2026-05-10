const { Grammars } = require("../../models");

class GrammarController {
    async getAllGrammars(req, res) {
        try {
            const grammars = await Grammars.findAll();
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
            const newGrammar = await Grammars.create({ grammar, structure, usage, notes, lessonId });
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
            const updatedGrammar = await Grammars.update({ grammar, structure, usage, notes, lessonId }, { where: { id } });
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
            await Grammars.destroy({ where: { id } });
            return res.json({
                message: "Delete grammar successfully",
            })
         } catch (error) {
            res.status(500).json({ error: error.message });
         }
     }
}

module.exports = new GrammarController();