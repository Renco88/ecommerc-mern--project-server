const { body } = require('express-validator');


const validateUserRegistration = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, mex: 32 })
        .withMessage("Name should be at least 3-31 characters long"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .withMessage("Password must contain at least one letter, one number, and one special character (@$!%*?&)"),


    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ min: 3 })
        .withMessage("address should be at least 3 characters long"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone is required")
        .isLength({ min: 3 })
        .withMessage("phone should be at least 3 characters long"),

    body("image")
        .custom((value, { req }) => {
            if (!req.file || !req.file.buffer) {
                throw new Error('user image is required');
            }
            return true;
        })
        .withMessage('user image is required'),

];
const validateUserLogIn = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .withMessage("Password must contain at least one letter, one number, and one special character (@$!%*?&)"),




];


module.exports = { validateUserRegistration, validateUserLogIn };