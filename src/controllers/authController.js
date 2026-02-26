const authService = require('../services/authService');
const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

const authController = {
  register: catchAsync(async (req, res) => {
    const { user, token } = await authService.register(req.body);

    res.status(201).json({
      status: 'success',
      data: { user, token }
    });
  }),

  login: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.json({
      status: 'success',
      data: { user, token }
    });
  }),

  profile: catchAsync(async (req, res) => {
    const user = await userService.getMe(req.user.id);

    res.json({
      status: 'success',
      data: { user }
    });
  })
};

module.exports = authController;

