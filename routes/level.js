var express = require('express');
var router = express.Router();
const LevelController = require("../controllers/levelController/levelController");

/* GET home page. */
router.get('/get-all', LevelController.getAllLevels);
router.post('/create', LevelController.createLevel);
router.put('/update/:id', LevelController.updateLevel);
router.delete('/delete/:id', LevelController.deleteLevel);
module.exports = router;
