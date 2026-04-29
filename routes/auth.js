var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController/authController');

/* GET users listing. */
// router.post('/login-google',  authController.loginWithGoogle);
// router.get('/current-user', authController.getCurrentUser);
// router.get('/current-user', authController.getCurrentUser);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);


module.exports = router;
