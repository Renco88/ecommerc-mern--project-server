const express = require('express');
const userRouter = express.Router();
const { getUsers, getUserById, deleteUserById, processRegister } = require('../controllers/userController'); 

userRouter.post('/process-register', processRegister); 
userRouter.get('/', getUsers); 
userRouter.get('/:id', getUserById); 
userRouter.delete('/:id', deleteUserById); 

module.exports = userRouter;
