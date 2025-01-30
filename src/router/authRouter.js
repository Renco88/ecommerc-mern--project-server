const express = require('express');
const runValidation = require('../validators');
const { handleLogin, handleLogout } = require('../controllers/authController');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const { validateUserLogIn } = require('../validators/auth');

const authRouter = express.Router();

authRouter.post('/login',validateUserLogIn, isLoggedOut, handleLogin);
authRouter.post('/logout',isLoggedIn, handleLogout);



module.exports = authRouter;
