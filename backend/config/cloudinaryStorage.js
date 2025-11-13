
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('./cloudinary');

const categoryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'nexcart/categories',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    }
});

const productStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'nexcart/products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    }
});

const categoryUpload = multer({
    storage: categoryStorage,
    fileFilter: (req, file, cb) => {
        if (!file) cb(null, false)
        else cb(null, true)
    }
});

const productUpload = multer({
    storage: productStorage,
    fileFilter: (req, file, cb) => {
        if (!file) cb(null, false)
        else cb(null, true)
    }
});


module.exports = { categoryUpload, productUpload }