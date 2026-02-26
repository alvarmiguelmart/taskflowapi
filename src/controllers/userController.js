const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

const userController = {
  getMe: catchAsync(async (req, res) => {
    const user = await userService.getMe(req.user.id);

    res.json({
      status: 'success',
      data: { user }
    });
  }),

  updateMe: catchAsync(async (req, res) => {
    const user = await userService.updateMe(req.user.id, req.body);

    res.json({
      status: 'success',
      data: { user }
    });
  }),

  searchUsers: catchAsync(async (req, res) => {
    const users = await userService.searchUsers(req.query.search);

    res.json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  })
};

module.exports = userController;

