
const express = require('express');
const router = express.Router();
const protect = require('../middleware/security');
const adminOnly = require('../middleware/adminMiddleware');
const paymentController = require('../controllers/paymentController');

router.get('/my', protect , paymentController.getMyPayments);
router.post('/', protect , paymentController.createPayment);

router.get('/', protect , adminOnly , paymentController.getAllPayments);
router.put('/:id/status', protect , adminOnly, paymentController.updatePaymentStatus );
router.delete('/:id', protect , adminOnly , paymentController.deletePayment);


module.exports = router;