var express = require('express');
var router = express.Router();
const LessonController = require("../controllers/lessonController/lessonController");

/* GET home page. */
router.get('/get-all', LessonController.getAllLessons);
router.post('/create', LessonController.createLesson);
router.put('/update/:id', LessonController.updateLesson);
router.delete('/delete/:id', LessonController.deleteLesson);
router.get('/get-lesson-by-level-id', LessonController.getLessonByLevelId);
module.exports = router;
