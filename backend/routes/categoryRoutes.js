
const express = require('express');
const router = express.Router();
const protect = require('../middleware/security');
const adminOnly = require('../middleware/adminMiddleware');
const categoryController = require('../controllers/categoryController');
const { categoryUpload } = require('../config/cloudinaryStorage');

router.get('/public', categoryController.getCategoriesPublic);
router.post('/', protect, adminOnly, categoryUpload.single('image'), categoryController.createCategory);
router.get('/nested', protect, adminOnly, categoryController.getCategories);
router.get('/:id', protect, adminOnly, categoryController.getCategoryById);
router.put('/:id', protect, adminOnly, categoryUpload.single('image'), categoryController.updateCategory);
router.delete('/:id', protect, adminOnly, categoryController.deleteCategory);

module.exports = router;