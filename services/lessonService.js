const { Lessons } = require("../models");
class LessonService {
    async getAllLessons() {
        try {
            const allLessons = await Lessons.findAll();
            return allLessons;
        } catch (error) {
            throw error;
        }  
    }
    async createLesson(data) {
        try {
            const newLesson = await Lessons.create(data);
            return newLesson;
        } catch (error) {
            throw error;
        }
    }
    async updateLesson(id, data) {
        try {
            const lesson = await Lessons.findByPk(id);
            if(!lesson) {
                return null;
            }
            await lesson.update(data);
            return lesson;
        } catch (error) {
            throw error;
        }
    }
    async deleteLesson(id) {
        try {
            const deleted = await Lessons.destroy({ where: { id } });
            return deleted > 0; 
        } catch (error) {
            throw error;
        }
    }  
    async getLessonByLevelId(id) {
        try {
            const lessons = await Lessons.findAll({
                where: {
                    levelId: id
                }
            });
            return lessons;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new LessonService();