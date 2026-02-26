const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const userValidation = require('../validations/userValidation');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', userController.getMe);
router.patch('/me', validate(userValidation.updateProfile), userController.updateMe);
router.get('/', userController.searchUsers);

module.exports = router;

