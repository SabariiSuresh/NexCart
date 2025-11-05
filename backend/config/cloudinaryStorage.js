
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

const categoryUpload = multer({ storage: categoryStorage });
const productUpload = multer({ storage: productStorage });


module.exports = { categoryUpload, productUpload }