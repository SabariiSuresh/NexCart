
const express = require('express');
const router = express.Router();
const protect = require('../middleware/security');
const adminOnly = require('../middleware/adminMiddleware');
const profileController = require('../controllers/profileController');


router.get('/me', protect, profileController.getMyProfile);
router.put('/me', protect, profileController.updateMyProfile);

router.get('/', protect, adminOnly, profileController.getAllUsers);
router.get('/:id', protect, adminOnly, profileController.getUserById);
router.put('/:id', protect, adminOnly, profileController.updateUser);
router.delete('/:id', protect, adminOnly, profileController.deleteUser);

module.exports = router;