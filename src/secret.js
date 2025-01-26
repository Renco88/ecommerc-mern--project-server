require('dotenv').config();
const serverPort= process.env.SERVER_PORT || 3001;
const mongoDB= process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommercMern' ;

module.exports={
    serverPort,
    mongoDB
}