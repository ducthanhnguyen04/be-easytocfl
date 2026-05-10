var express = require('express');
var router = express.Router();
const ExampleController = require("../controllers/exampleController/exampleController");

/* GET home page. */
router.get('/get-all', ExampleController.getAllExamples);
router.post('/create', ExampleController.createExample);

module.exports = router;
