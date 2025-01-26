const express =require("express");
const userRouter =express.Router();
const gerUser =require('../controllers/userController');



userRouter.get('/', gerUser );


module.exports = userRouter;