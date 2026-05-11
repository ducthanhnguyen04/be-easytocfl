const { Lessons } = require("../../models");
const LessonService = require("../../services/lessonService");

class LessonController {
    async getAllLessons(req, res) {
        try {
            const lessons = await LessonService.getAllLessons();
            res.json({
                message: "Get all lessons successfully",
                lessons
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createLesson(req, res) {
        try {
            const { lessonName, title, slug, levelId } = req.body;
            if(!lessonName || !title || !slug || !levelId) {
                return res.status(400).json({ message: "Lesson name, title, slug and level ID are required" });
            }
            const newLesson = await LessonService.createLesson({ lessonName, title, slug, levelId });
            res.json({
                message: "Create lesson successfully",
                lesson: newLesson
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateLesson(req, res) {
        try {
            const { lessonName, title, levelId } = req.body;
            const lessonId = req.params.id;
            const lesson = await LessonService.updateLesson(lessonId, { lessonName, title, levelId });
            if(!lesson) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            res.json({
                message: "Update lesson successfully",
                lesson
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteLesson(req, res) {
        try {
            const lessonId = req.params.id;
            const deleted = await LessonService.deleteLesson(lessonId);
            if(!deleted) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            res.json({
                message: "Delete lesson successfully"
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getLessonByLevelId(req, res) {
        try {
            const levelId = req.query.levelId;
            const lessons = await LessonService.getLessonByLevelId(levelId);
            if(!lessons) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            res.json({
                message: "Get lesson by LevelID successfully",
                lessons
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new LessonController();