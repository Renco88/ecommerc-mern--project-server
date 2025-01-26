const createError = require('http-errors');
const User = require("../models/userModel");
const mongoose =require('mongoose');


const findUserById = async (id) => {
   try {
    const opction ={password: 0};
    const user= await User.findById(id,opction);

    if (!user) throw createError(404, 'user does not exist with this id')
    return user;
   } catch (error) {
    if(error instanceof mongoose.Error ){
        throw createError(400,'Invalid User Id');
      }
      throw error;

   }
};

module.exports=findUserById;