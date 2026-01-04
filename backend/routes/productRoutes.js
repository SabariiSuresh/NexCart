
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protect = require('../middleware/security');
const adminOnly = require('../middleware/adminMiddleware');
const { productUpload } = require('../config/cloudinaryStorage');

router.post('/', protect, adminOnly, productUpload.array('images', 5), productController.createProduct);
router.put('/:id', protect, adminOnly, productUpload.array('images', 5), productController.updateProduct);
router.get('/', productController.getAllProducts);

router.get('/selections', productController.selections);
router.get('/recomended', protect, productController.recommended);
router.get('/search', productController.searchProduct);
router.get('/quick-search', productController.quickSearch);

router.get('/category/:id', productController.getProductsByCategory);
router.get('/:id', productController.getProductsById);
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

module.exports = router;