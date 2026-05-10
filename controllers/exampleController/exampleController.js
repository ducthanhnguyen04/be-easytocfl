const { Examples } = require("../../models");
class ExampleController {
    async getAllExamples(req, res) {
        try {
            const examples = await Examples.findAll();
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
            const newExample = await Examples.create({ example, meaning, pinyin, audioUrl, vocabularyId, grammarId });
            return res.json({
                message: "Create example successfully",
                example: newExample
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new ExampleController();