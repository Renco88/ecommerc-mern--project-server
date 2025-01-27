const express = require('express');
const userRouter = express.Router();
const { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount } = require('../controllers/userController'); 

userRouter.post('/process-register', processRegister); 
userRouter.post('/verify',activeUserAccount); 
userRouter.get('/', getUsers); 
userRouter.get('/:id', getUserById); 
userRouter.delete('/:id', deleteUserById); 

module.exports = userRouter;
