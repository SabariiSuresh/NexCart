
const express = require('express');
const router = express.Router();
const protect = require('../middleware/security');
const adminOnly = require('../middleware/adminMiddleware');
const categoryController = require('../controllers/categoryController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'upload/categories'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.get('/public', categoryController.getCategoriesPublic);
router.post('/', protect, adminOnly, upload.single('image'), categoryController.createCategory);
router.get('/nested', protect, adminOnly, categoryController.getCategories);
router.get('/:id', protect, adminOnly, categoryController.getCategoryById);
router.put('/:id', protect, adminOnly, upload.single('image'), categoryController.updateCategory);
router.delete('/:id', protect, adminOnly, categoryController.deleteCategory);

module.exports = router;