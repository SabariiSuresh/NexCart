
const express = require('express');
const router = express.Router();
const protect = require('../middleware/security');
const adminOnly = require('../middleware/adminMiddleware');
const orderController = require('../controllers/orderController');

router.post('/', protect, orderController.placeOrder);
router.get('/my', protect, orderController.getMyOrder);
router.get('/last-address', protect, orderController.getLastAddress);
router.get('/:id', protect, orderController.getOrderById);
router.post('/:id/cancel', protect, orderController.cancellOrder);

router.get('/', protect, adminOnly, orderController.getAllOrders);
router.delete('/:id/delete', protect, adminOnly, orderController.deleteOrder);
router.put('/:id/status', protect, adminOnly, orderController.updateStatus);
router.put('/:id/deliver', protect, adminOnly, orderController.updaterOrderToDelivered);



module.exports = router; 