

const express = require('express');
const router = express.Router();


const userRoute = require('./userRoutes');
const profileRoute = require('./profileRoutes');
const productRoute = require('./productRoutes');
const cartRoute = require('./cartRoutes');
const orderRoute = require('./orderRoutes');
const categoryRoute = require('./categoryRoutes');
const wishListRoute = require('./wishListRoutes');
const paymentRoute = require('./paymentRoutes');
const adminRoute = require('./adminRoutes');


router.get('/', function (req, res, next) {
    return res.json('App is redy now');
});

router.use('/auth', userRoute);
router.use('/profile', profileRoute);
router.use('/products', productRoute);
router.use('/carts', cartRoute);
router.use('/orders', orderRoute);
router.use('/categories', categoryRoute);
router.use('/wishlists', wishListRoute);
router.use('/payments', paymentRoute);
router.use('/admin', adminRoute);


module.exports = router;