const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { jwtAccessKew } = require('../secret');

const isLoggedIn = async (req, resizeBy, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            throw createError(401, 'access token not found');
        }
        const decoded = jwt.verify(token, jwtAccessKew);
        if (!decoded) {
            throw createError(401, 'invalid access token . please login again');
        }
        // req.body.userId = decoded._id;
        req.user = decoded.user;
        next();

    } catch (error) {
        return next(error);

    }
};
const isLoggedOut = async (req, resizeBy, next) => {
    try {
        const token = req.cookies.access_token;
        if (token) {
            try {
                const decoded = jwt.verify(token, jwtAccessKew);
                if (decoded) {
                    throw createError(400, 'User is logged In');
                }
            } catch (error) {
                throw error;
            }
        }

        next();
    } catch (error) {
        return next(error);

    }
};
const isAdmin = async (req, resizeBy, next) => {
    try {
     if(!req.user.isAdmin){
        throw createError(403, 'Forbidden .You must be an admin to access this resource');
     }
      
        next();
    } catch (error) {
        return next(error);

    }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin }