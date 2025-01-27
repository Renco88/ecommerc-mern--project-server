const createError = require('http-errors');
const multer = require('multer')
const path = require('path');
const { UPLOAD_USER_IMG_DIRECTORY, ALLOWED_FILE_TYPE, MEX_FILE_SIZE } = require('../config');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_USER_IMG_DIRECTORY)
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + "-" + file.originalname.replace(extname, '') + extname);

    },
});

const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname);
    if (!ALLOWED_FILE_TYPE.includes(extname.substring(1))) {
        return cb(new Error('File type not allowd'),false);
    }
    cb(null, true)
};

const upload = multer({
    storage: storage,
    limits: { fileSize: MEX_FILE_SIZE },
    fileFilter,
});
module.exports = upload;