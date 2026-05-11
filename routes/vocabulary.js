var express = require('express');
var router = express.Router();
const VocabularyController = require("../controllers/vocabularyController/vocabularyController");
/* GET home page. */
router.get('/get-all', VocabularyController.getAllVocabularies);
router.post('/create', VocabularyController.createVocabulary);
router.put('/update/:id', VocabularyController.updateVocabulary);
router.delete('/delete/:id', VocabularyController.deleteVocabulary);
router.get('/get-vocabulary-by-lesson-id', VocabularyController.getVocabularyByLessonId);
module.exports = router;
