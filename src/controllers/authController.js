const createError = require('http-errors');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is installed
const { successResponse } = require('./responseHandler');
const { createJSONWebToken } = require('../helper/jsonWebTocken'); // Correct spelling: "jsonWebToken"
const User = require('../models/userModel');
const { jwtAccessKew } = require('../secret');

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw createError(400, 'Email and password are required');
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(404, 'User does not exist with this email. Please register first.');
        }

        // Check if the user is banned
        if (user.isBanned) {
            throw createError(403, 'Your account is banned. Please contact support.');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw createError(401, 'Invalid credentials. Please try again.');
        }

        // Generate JWT token
        const accessToken = createJSONWebToken({ id: user._id, email: user.email }, jwtAccessKew, '10m');
        res.cookie('access_token', accessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        // Success response with token
        return successResponse(res, {
            statusCode: 200,
            message: 'User logged in successfully',
            payload: { user },
        });
    } catch (error) {
        next(error);
    }
};
const handleLogout = async (req, res, next) => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        
        // Success response with token
        return successResponse(res, {
            statusCode: 200,
            message: 'User logged Out successfully',
            payload: {  },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { handleLogin, handleLogout };
