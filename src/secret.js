require('dotenv').config();
const serverPort= process.env.SERVER_PORT || 3001;
const mongoDB= process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommercMern' ;

const jwtActivationKew = process.env.JWT_ACTIVATION_KEY || 'dkfjghfdj64hjfg';
const jwtAccessKew = process.env.JWT_ACCESS_KEY || 'dkfjghfdj64hjfg';

const smtpUsername =process.env.SMTP_USERNAME||'';
const smtpPassword =process.env.SMTP_PASSWORD||'';
const cliendUrl =process.env.CLIEND_URL||'';



module.exports={
    serverPort,
    mongoDB,
    jwtActivationKew,
    smtpUsername,
    smtpPassword,
    cliendUrl,
    jwtAccessKew,
   
}