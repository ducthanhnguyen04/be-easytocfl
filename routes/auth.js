var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkSingleDevice = require('../middlewares/checkSingleDevice');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/check', authMiddleware, (req, res) => {
    res.json({message: 'Authenticated', user: req.user});
})


module.exports = router;
