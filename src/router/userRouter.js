const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount, updateUserById } = require('../controllers/userController'); 
const upload = require('../middlewares/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { isLoggedIn } = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.post('/process-register',upload.single("image"),validateUserRegistration, runValidation, processRegister); 
userRouter.post('/active',activeUserAccount); 
userRouter.get('/',isLoggedIn, getUsers); 
userRouter.get('/:id',isLoggedIn, getUserById); 
userRouter.delete('/:id',isLoggedIn, deleteUserById); 
userRouter.put('/:id',upload.single("image"),isLoggedIn, updateUserById); 

module.exports = userRouter;
