const { Levels } = require("../models");

class LevelService {
    async getAllLevels() {
        try {
            return await Levels.findAll({ raw: true });
        } catch (error) {
            throw error; 
        }
    }

    async createLevel(data) {
        try {
            return await Levels.create(data);
        } catch (error) {
            throw error;
        }
    }

    async updateLevel(id, data) {
        try {
            const [updated] = await Levels.update(data, { where: { id } });
            if (updated) {
                return await Levels.findByPk(id);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    async deleteLevel(id) {
        try {
            const deleted = await Levels.destroy({ where: { id } });
            return deleted > 0; 
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LevelService();