const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require('http-error');
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit');
const app = express();

const rateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: 'Too many requests from this IP, please try again later.',
});

app.use(rateLimit);
app.use(xssClean());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
    res.status(200).send({

        message: 'Api Working Fine'
    });

});


// clain error handle
app.use((req, res, next) => {
    createError(404, 'route not found'),
        next();
});
// server error handle
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message,
    });
});

module.exports = app;
