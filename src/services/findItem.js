const createError = require('http-errors');
const User = require("../models/userModel");
const mongoose =require('mongoose');


const findWithId = async (model,id,opction ={}) => {
   try {

    const item= await model.findById(id,opction);

    if (!item) throw createError(404, `${model.modelName} does not exist with this id`)
    return item;
   } catch (error) {
    if(error instanceof mongoose.Error ){
        throw createError(400,'Invalid item Id');
      }
      throw error;

   }
};

module.exports = { findWithId };
