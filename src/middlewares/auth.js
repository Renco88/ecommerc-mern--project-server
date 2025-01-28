const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { jwtAccessKew } = require('../secret');

const isLoggedIn = async (req, resizeBy, next) => {
    try {
        const token =req.cookies.access_token;
   if(!token){
    throw createError(401,'access token not found');
   }
   const decoded =jwt.verify(token,jwtAccessKew);
   if(!decoded){
    throw createError(401,'invalid access token . please login again');
   }
   req.body.userId =decoded._id;
   next();

    } catch (error) {
        return next(error);

    }
};

module.exports={isLoggedIn}