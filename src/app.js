const express = require("express");
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require('http-error');
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit');
const userRouter = require("./router/userRouter");
const seedRouter = require("./router/seedRouter");
const { errorResponse } = require("./controllers/responseHandler");
const authRouter = require("./router/authRouter");
const app = express();

const Limit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: 'Too many requests from this IP, please try again later.',
});

app.use(Limit);
app.use(cookieParser());
app.use(xssClean());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/user", userRouter);
app.use("/api/auth", authRouter );
app.use("/api/seed", seedRouter);

app.get("/test", (req, res) => {
    res.status(200).send({
        message: 'Api Working Fine',
    });
});

// clain error handle
app.use((req, res, next) => {
    createError(404, 'route not found'),
        next();
});
// server error handle
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    });
});

module.exports = app;
