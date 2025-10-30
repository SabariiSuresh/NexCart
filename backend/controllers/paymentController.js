
const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const { v4: uuidv4 } = require('uuid');


exports.createPayment = async (req, res) => {

    try {

        const { orderId, method } = req.body;
        const { paymentDetails } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }


        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to pay for this order' });
        }


        const existingPayment = await Payment.findOne({ orderId });

        if (existingPayment) {
            return res.status(400).json({ message: 'Payment alredy exists this order' })
        }



        const paymentMethod = method || order.paymentMethod;

        if (!["Card", "Upi", "Netbanking", "COD"].includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }


        let paymentStatus = 'Pending';
        let markDelivered = false;

        if (paymentMethod === 'COD') {

            paymentStatus = 'Success';
            markDelivered = true;

        }


        let paymentInfo = {};


        if (paymentMethod === 'Upi') {
            paymentInfo.upiId = paymentDetails?.upiId;
        } else if (paymentMethod === 'Card') {
            paymentInfo = {
                cardNumber: paymentDetails?.cardNumber,
                cardName: paymentDetails?.cardName,
                expiry: paymentDetails?.expiry,
                cvv: paymentDetails?.cvv
            };
        } else if (paymentMethod === 'Netbanking') {
            paymentInfo = {
                bankName: paymentDetails?.bankName,
                transactionId: paymentDetails?.transactionId
            };
        }


        const payment = new Payment({
            orderId,
            amount: order.totalPrice,
            status: paymentMethod === 'COD' ? 'Success' : 'Pending',
            method: paymentMethod,
            transactionId: uuidv4(),
            details: paymentInfo
        });

        await payment.save();


        if (payment.status === 'Success' || payment.status === 'Paid') {

            order.isPaid = true;
            order.status = 'Pending';
            payment.status = 'Paid'
            order.paidAt = new Date();

        } else if (payment.status === 'Failed') {
            order.isPaid = false;
            order.status = 'Payment Failed';
            payment.status = 'Failed';
        }


        if (markDelivered) {

            order.status = 'Delivered';
            order.isDelivered = true;
            order.deliveredAt = new Date();

        }

        await order.save();

        return res.status(200).json({ message: 'Payment success', payment, order });


    } catch (err) {

        return res.status(500).json({ message: 'Failed to make payment', error: err.message });

    }
}


exports.getAllPayments = async (req, res) => {

    try {

        const payments = await Payment.find()
            .populate({
                path: 'orderId',
                populate: { path: 'user', select: 'name email' }
            })
            .sort('-createdAt');

        return res.status(200).json({ message: 'All payments', payments });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to fetch payments', error: err.message });

    }
}


exports.getMyPayments = async (req, res) => {

    try {

        const payments = await Payment.find().populate({ path: 'orderId', match: { user: req.user.id } }).sort('-createdAt').exec();

        const userPayments = payments.filter(payment => payment.orderId);

        return res.status(200).json({ message: 'My payments', userPayments });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to fetch my payments', error: err.message });

    }
}



exports.updatePaymentStatus = async (req, res) => {

    try {

        const { status } = req.body;

        if (!["Success", "Pending", "Failed"].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const payment = await Payment.findById(req.params.id).populate('orderId');

        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        payment.status = status;

        if (status === 'Success') {

            payment.orderId.isPaid = true;
            payment.status = 'Paid';
            payment.orderId.paidAt = new Date();

            await payment.orderId.save();
        }

        await payment.save();

        return res.status(200).json({ message: 'Payment status updated', payment });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to update payment', error: err.message });

    }
}


exports.deletePayment = async (req, res) => {

    try {

        const payment = await Payment.findByIdAndDelete(req.params.id);

        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        return res.status(200).json({ message: 'Payment deleted', payment });


    } catch (err) {

        return res.status(500).json({ message: 'Failed delete payment', error: err.message });

    }

}