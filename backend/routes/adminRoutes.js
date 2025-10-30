
const express = require('express');
const router = express.Router();
const protect = require('../middleware/security');
const adminOnly = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController')

router.get('/' , protect , adminOnly , adminController.dashboardStats );

module.exports = router;