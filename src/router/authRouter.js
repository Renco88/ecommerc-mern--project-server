const express = require('express');
const runValidation = require('../validators');
const { handleLogin, handleLogout } = require('../controllers/authController');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post('/login', isLoggedOut, handleLogin);
authRouter.post('/logout',isLoggedIn, handleLogout);



module.exports = authRouter;
