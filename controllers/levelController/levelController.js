const levelService = require('../../services/levelService');

class LevelController {
    async getAllLevels(req, res) {
        try {
            const levels = await levelService.getAllLevels();
            return res.status(200).json({
                message: "Get all levels successfully",
                levels
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

    async createLevel(req, res) {
        try {
            const { levelName, level } = req.body;
            if (!levelName || !level) {
                return res.status(400).json({ message: "Level name and level are required" });
            }
            const newLevel = await levelService.createLevel({ levelName, level });
            return res.status(201).json({ 
                message: "Create level successfully",
                level: newLevel
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateLevel(req, res) {
        try {
            const { id } = req.params;
            const updatedLevel = await levelService.updateLevel(id, req.body);
            
            if (!updatedLevel) {
                return res.status(404).json({ message: "Level not found to update" });
            }

            return res.status(200).json({
                message: "Update level successfully",
                level: updatedLevel
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteLevel(req, res) {
        try {
            const { id } = req.params;
            const isDeleted = await levelService.deleteLevel(id);
            
            if (!isDeleted) {
                return res.status(404).json({ message: "Level not found to delete" });
            }

            return res.status(200).json({
                message: "Delete level successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }   
    }
}

module.exports = new LevelController();