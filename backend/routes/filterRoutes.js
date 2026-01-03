const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');

router.get('products/filter' , filterController.getFilteredProducts);

module.exports = router;