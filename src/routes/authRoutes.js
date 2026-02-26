const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const userValidation = require('../validations/userValidation');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', validate(userValidation.register), authController.register);
router.post('/login', validate(userValidation.login), authController.login);
router.get('/profile', authMiddleware, authController.profile);

module.exports = router;

