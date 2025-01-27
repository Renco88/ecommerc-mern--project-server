const express = require('express');
const userRouter = express.Router();
const { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount } = require('../controllers/userController'); 
const upload = require('../middlewares/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');

userRouter.post('/process-register',upload.single("image"),validateUserRegistration, runValidation, processRegister); 
userRouter.post('/verify',activeUserAccount); 
userRouter.get('/', getUsers); 
userRouter.get('/:id', getUserById); 
userRouter.delete('/:id', deleteUserById); 

module.exports = userRouter;
