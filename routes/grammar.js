var express = require('express');
var router = express.Router();
const GrammarController = require("../controllers/grammarController/grammarController");

/* GET home page. */
router.get('/get-all', GrammarController.getAllGrammars);
router.post('/create', GrammarController.createGrammar);

module.exports = router;
