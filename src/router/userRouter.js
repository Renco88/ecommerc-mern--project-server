const express =require("express");
const userRouter =express.Router();
const {gerUser} =require('../controllers');



userRouter.get('/', gerUser );



module.exports = userRouter;