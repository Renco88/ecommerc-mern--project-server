const multer = require('multer')
const { ALLOWED_FILE_TYPE, MEX_FILE_SIZE } = require('../config');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error('only image files are allowd'), false);

    }
    if (file.size > MEX_FILE_SIZE) {
        return cb(new Error('file size exceeds the maximum limit'), false);
    }
    if (!ALLOWED_FILE_TYPE.includes(file.mimetype)) {
        return cb(new Error('File Type is not Allowed'), false);
    }
    cb(null,true);

};

const upload = multer({
    storage: storage,
    fileFilter:fileFilter,
});
module.exports = upload;