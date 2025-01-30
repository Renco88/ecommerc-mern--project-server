const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount, updateUserById, handleBanUserById } = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.post('/process-register', upload.single("image"), isLoggedOut, validateUserRegistration, runValidation, processRegister);
userRouter.post('/active', isLoggedOut, activeUserAccount);
userRouter.get('/', isLoggedIn, isAdmin, getUsers);
userRouter.get('/:id', isLoggedIn, getUserById);
userRouter.delete('/:id', isLoggedIn, deleteUserById);
userRouter.put('/:id', upload.single("image"), isLoggedIn, updateUserById);
userRouter.put('/ban-user', isLoggedIn, isAdmin, handleBanUserById);

module.exports = userRouter;
