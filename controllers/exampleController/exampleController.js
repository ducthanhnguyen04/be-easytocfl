const { Examples } = require("../../models");
const exampleService = require("../../services/exampleService");

class ExampleController {
    async getAllExamples(req, res) {
        try {
            const examples = await exampleService.getAllExamples();
            return res.json({
                message: "Get all examples successfully",
                examples
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
     }
    async createExample(req, res) {
        try {
            const { example, meaning, pinyin, audioUrl, vocabularyId, grammarId } = req.body;
            if(!example || !meaning || !pinyin) {
                return res.status(400).json({ message: "Example, meaning and pinyin are required" });
            }
            const newExample = await exampleService.createExample({ example, meaning, pinyin, audioUrl, vocabularyId, grammarId });
            return res.json({
                message: "Create example successfully",
                example: newExample
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateExample(req, res) {
        try {
            const { example, meaning, pinyin, audioUrl, vocabularyId, grammarId } = req.body;
            const { id } = req.params;
            if(!example || !meaning || !pinyin) {
                return res.status(400).json({ message: "Example, meaning and pinyin are required" });
            }
            const updatedExample = await exampleService.updateExample(id, { example, meaning, pinyin, audioUrl, vocabularyId, grammarId });
            return res.json({
                message: "Update example successfully",
                example: updatedExample
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteExample(req, res) {
        try {
            const { id } = req.params;
            const deleted = await exampleService.deleteExample(id);
            if(!deleted) {
                return res.status(404).json({ message: "Example not found" });
            }
            return res.json({
                message: "Delete example successfully",
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }   
    }
}
module.exports = new ExampleController();