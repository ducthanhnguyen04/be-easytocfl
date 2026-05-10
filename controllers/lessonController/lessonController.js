const { Lessons } = require("../../models");

class LessonController {
    async getAllLessons(req, res) {
        try {
            const lessons = await Lessons.findAll();
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
            const { lessonName, title, levelId } = req.body;
            if(!lessonName || !levelId) {
                return res.status(400).json({ message: "Lesson name and level ID are required" });
            }
            const newLesson = await Lessons.create({ lessonName, title, levelId });
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
            if(!lessonName || !levelId) {
                return res.status(400).json({ message: "Lesson name and level ID are required" });
            }
            const lesson = await Lessons.findByPk(lessonId);
            if(!lesson) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            await lesson.update({ lessonName, title, levelId });
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
            const lesson = await Lessons.findByPk(lessonId);
            if(!lesson) {
                return res.status(404).json({ message: "Lesson not found" });
            }
            await lesson.destroy();
            res.json({
                message: "Delete lesson successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new LessonController();