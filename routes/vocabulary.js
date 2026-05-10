var express = require('express');
var router = express.Router();
const VocabularyController = require("../controllers/vocabularyController/vocabularyController");
/* GET home page. */
router.get('/get-all', VocabularyController.getAllVocabularies);
router.post('/create', VocabularyController.createVocabulary);

module.exports = router;
