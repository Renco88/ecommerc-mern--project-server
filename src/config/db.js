const mongoose = require('mongoose');
const { mongoDB } = require('../secret');
const connectDB =async (opction = {}) =>{
    try{
        await mongoose.connect(mongoDB,opction);
        console.log('connection to mongodb seccessfull');

        mongoose.connection.on('error',(error)=>{
            console.error('DB connection error: ',error);
        })

    }catch(error){

 console.error('could not connected to Db: ',error.toString());
    }
};

module.exports = connectDB;