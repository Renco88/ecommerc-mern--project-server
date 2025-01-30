const createError = require('http-errors');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const { successResponse } = require('./responseHandler');
const { findWithId } = require('../services/findItem');
const { deleteImage } = require('../helper/deleteUser');
const { createJSONWebToken } = require('../helper/jsonWebTocken');
const { jwtActivationKew, cliendUrl } = require('../secret');
const emailWithNodeMailer = require('../helper/email');
const runValidation = require('../validators');
const { Context } = require('express-validator/lib/context');



const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };



    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    if (!users) throw createError(404, 'no user found');

    return successResponse(res, {
      statusCode: 200,
      message: 'user were returened successfully',
      payload: {
        users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });

  } catch (error) {
    next(error)
  }
};
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const opction = { password: 0 };
    const user = await findWithId(User, id, opction);
    return successResponse(res, {
      statusCode: 200,
      message: 'user were returened successfully',
      payload: { user },
    });
  } catch (error) {
    next(error)
  }
};
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const opction = { password: 0 };
    const user = await findWithId(User, id, opction);

    const userImagePath = User.image;
    deleteImage(userImagePath);

    await User.findOneAndDelete({
      _id: id,
      isAdmin: false,
    });


    return successResponse(res, {
      statusCode: 200,
      message: 'user was delete successfully',
    });
  } catch (error) {
    next(error)
  }
};
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const image = req.file;
    if (!image) {
      throw createError(400, 'Image file is required');
    }
    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, 'Image file is too large.it must be less than 2 MB');
    }


    const imageBufferString = image.buffer.toString('base64');

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, 'user with this email already exist , please login')
    }

    //https://security.google.com/settings/security/apppasswords
    const token = createJSONWebToken({ name, email, password, phone, address, image: imageBufferString }, jwtActivationKew, '10m');

    const emailData = {
      email,
      subject: 'Acount Activation Email',
      html: `
      <h2>Hello ${name}</h2>
      <p>Please click here to <a href="${cliendUrl}/api/users/activate/${token}" target="_blank">activate your account</a></p>
      `
    }
    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(emailError(500, 'Failed to send verification email'));
      return;

    }

    return successResponse(res, {
      statusCode: 200,
      message: `please go to your ${email} for completing your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error)
  }
};
const activeUserAccount = async (req, res, next) => {
  try {
    const token =
      req.query.token ||
      req.body.token ||
      req.cookies.token;

    if (!token) throw createError(404, 'Token not found');
    try {
      const decoded = jwt.verify(token, jwtActivationKew);
      if (!decoded) throw createError(401, 'User not verified');

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(409, 'user with this email already exist , please login')
      }

      await User.create(decoded);
      return successResponse(res, {
        statusCode: 201,
        message: "User was registered successfully",
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createError(401, 'Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw createError(401, 'Invalid token');
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);

    const updateOpction = { new: true, runValidatiors: true, Context: 'query' };

    let update = {};
    for (let key in req.body) {
      if (['name', 'password', 'phone', 'address'].includes(key)) {
        update[key] = req.body[key];
      }
      else if (['email'].includes(key)) {
        throw createError(400, 'Email Can not be update');
      }

    }

    const image = req?.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, 'Image file is too large.it must be less than 2 MB');
      }
      update.image = image.buffer.toString('base64');
    }

    const updateUser = await User.findByIdAndUpdate(userId, update, updateOpction).select("-password");

    if (!updateUser) {
      throw createError(404, 'User With This Id does not exist');

    }

    return successResponse(res, {
      statusCode: 200,
      message: 'user was updated successfully',
      payload: { updateUser },
    });
  } catch (error) {
    next(error)
  }
};
const handleBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await findWithId(User, userId); // Fetch the user

    // Check if the user is already banned
    if (user.isBanned) {
      throw createError(400, 'User is already banned');
    }

    // Corrected options
    const updateOptions = { new: true, runValidators: true };

    const updateUser = await User.findByIdAndUpdate(userId, { isBanned: true }, updateOptions).select('-password');

    if (!updateUser) {
      throw createError(400, 'User was not banned successfully');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'User was banned successfully',
      payload: { updateUser },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, deleteUserById, processRegister, activeUserAccount, updateUserById, handleBanUserById };
