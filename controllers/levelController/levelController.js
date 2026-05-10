const { Levels } = require('../../models');

class LevelController {
    async getAllLevels(req, res) {
        try {
            const levels = await Levels.findAll();
            return res.json({
                message: "Get all levels successfully",
                levels
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createLevel(req, res) {
        try {
            const { levelName, level } = req.body;
            if(!levelName || !level) {
                return res.status(400).json({ message: "Level name and level are required" });
            }
            const newLevel = await Levels.create({ levelName, level });
            return res.json({
                message: "Create level successfully",
                level: newLevel
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateLevel(req, res) {
        try {
            const { levelName, level } = req.body;
            const { id } = req.params;
            if(!levelName || !level) {
                return res.status(400).json({ message: "Level name and level are required" });
            }
            const updatedLevel = await Levels.update({ levelName, level }, { where: { id } });
            return res.json({
                message: "Update level successfully",
                level: updatedLevel
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteLevel(req, res) {
        try {
            const { id } = req.params;
            await Levels.destroy({ where: { id } });
            return res.json({
                message: "Delete level successfully",
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }   
    }
}
module.exports = new LevelController();