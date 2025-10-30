
const Order = require('../models/order.model');
const Product = require('../models/product.model');

const calcTotals = (items) => {

    let itemPrice = 0;
    let taxPrice = 0;
    let shippingPrice = 0;
    let deliveryPrice = 0;
    let isDiscountApplied = false;

    items.forEach(i => {
        const oldPrice = i.oldPrice || i.price;
        if (oldPrice > i.price) {
            isDiscountApplied = true;
        }

        itemPrice += i.price * i.qty;

        shippingPrice += i.price * 0.02 * i.qty;
    });

    taxPrice = Number((itemPrice * 0.18).toFixed(2));

    if (itemPrice > 2000) {
        shippingPrice = 50;
        deliveryPrice = 20;
    } else {
        shippingPrice = 0;
        deliveryPrice = 0;
    }

    const totalPrice = Number((itemPrice + taxPrice + shippingPrice + deliveryPrice).toFixed(2));

    return { itemPrice, taxPrice, shippingPrice, deliveryPrice, totalPrice, isDiscountApplied };
};



exports.placeOrder = async (req, res) => {
    try {

        const { cartItems, shippingAddress, paymentMethod } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const orderItems = [];

        for (const ci of cartItems) {

            const prod = await Product.findById(ci.productId);

            if (!prod) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (prod.stock < ci.qty) {
                return res.status(400).json({ message: `Insufficient stock for ${prod.name}` })
            }

            orderItems.push({

                product: prod._id,
                name: prod.name,
                qty: ci.qty,
                price: prod.price,
                oldPrice: prod.oldPrice,

            });
        }

        const totals = calcTotals(orderItems);

        const order = await Order.create({
            user: req.user.id,
            orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            ...totals
        });

        for (const item of orderItems) {

            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty, salesCount: item.qty } });

        };


        return res.status(201).json({ message: 'Order placed', order: order });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to place order', error: err.message }),
            console.error("failed to place order", err);

    }
}


exports.getMyOrder = async (req, res) => {

    try {

        const orders = await Order.find({ user: req.user.id }).sort('-createdAt').populate('orderItems.product', 'name images price')

        return res.status(200).json({ message: 'My orders', order: orders });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });

    }
}


exports.getOrderById = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'images category');

        if (!order) return res.status(404).json({ message: 'Order not found', order: order });


        if (req.user.role !== 'admin' && order.user._id?.toString() !== req.user.id?.toString()) {

            return res.status(403).json({ message: 'Not allowed' });

        } else {

            return res.status(200).json({ message: 'Your order', order: order });

        }

    } catch (err) {

        return res.status(500).json({ message: 'Failed to fetch your order', error: err.message }),
            console.error(err);

    }
}


exports.updateStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        const valid = ['Shipped', 'Delivered', 'Cancelled'];

        if (!valid.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' })
        }

        order.status = status;

        if (status === 'Delivered') {

            order.isDelivered = true;
            order.deliveredAt = new Date();

        }

        if (status === 'Cancelled') {
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
            }
        }

        const orderUpdated = await order.save();

        return res.status(201).json({ message: 'Status updated', order: orderUpdated })

    } catch (err) {

        return res.status(500).json({ message: 'Failed to update status', error: err.message });

    }
}


exports.cancellOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id.toString()) {

            return res.status(403).json({ message: 'Not allowed' });

        }


        if (['Shipped', 'Delivered'].includes(order.status)) {

            return res.status(400).json({ message: 'Canot cancel shipped/delivered order', order: order });

        }

        order.status = 'Cancelled';

        for (const item of order.orderItems) {

            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });

        }

        const orderCancel = await order.save();

        return res.status(200).json({ message: 'Order calcelled', order: orderCancel });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to cancel order', error: err.message });

    }
}



exports.deleteOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete orders' });
        }

        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to delete order', error: err.message });

    }
}



exports.updaterOrderToDelivered = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({ message: 'Order not found' });

        } else {

            order.status = 'Delivered';
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updateOrder = await order.save();

            return res.status(200).json({ message: 'Order updated to delivered', order: updateOrder });

        }

    } catch (err) {

        return res.status(500).json({ message: 'Failed to update', error: err.message });

    }

}


exports.getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find().populate('user', 'name email').sort('-createdAt');

        return res.status(200).json({ message: 'All orders', order: orders });

    } catch (err) {

        return res.status(500).json({ message: 'Failed to fetch order', error: err.message });

    }

}


exports.getTopProducts = async (req, res) => {

    try {

    } catch (err) {

        return res.status(500).json({ message: 'Failed to fetch order', error: err.message });

    }
}



exports.getLastAddress = async (req, res) => {
    try {
        const lastOrder = await Order.findOne({ user: req.user.id })
            .sort({ createdAt: -1 });

        if (!lastOrder) {
            return res.json({ shippingAddress: null });
        }

        return res.json({ shippingAddress: lastOrder.shippingAddress });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch last address', error: err.message });
    }
};
