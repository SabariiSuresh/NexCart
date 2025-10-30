
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

exports.dashboardStats = async (req, res) => {

    try {

        const revenueDate = await Order.aggregate([

            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }

        ]);

        const totalRevenue = revenueDate.length > 0 ? revenueDate[0].total : 0;

        const paidOrders = await Order.countDocuments({ isPaid: true });
        const allOrder = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const revenueLastWeek = await Order.aggregate([

            { $match: { isPaid: true , createdAt: { $gte: lastWeek } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
                    total: { $sum: "$totalPrice" },
                    orders : { $sum : 1}
                }
            },
            { $sort: { _id: 1 } }

        ]);

        const topProducts = await Order.aggregate([

            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    totalSold: { $sum: "$orderItems.qty" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    _id: 1,
                    name: "$productDetails.name",
                    price: "$productDetails.price",
                    totalSold: 1
                }
            }

        ]);

        const lowStockAlert = await Product.find({ stock: { $lt: 20 } }).select("name stock _id");

        const averageOrderValue = paidOrders > 0 ? (totalRevenue / paidOrders) : 0;

        const lastTwoWeeks = new Date();
        lastTwoWeeks.setDate(lastTwoWeeks.getDate() - 14);

        const revenueTwoWeeks = await Order.aggregate([

            { $match: { isPaid: true , createdAt: { $gte: lastTwoWeeks } } },
            {
                $group: {
                    _id: {
                        week: { $week: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    total: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } }

        ]);

        let revenueGrowth = 0;
        let revenuePrev = 0;
        let revenueCurr = 0;

        if (revenueTwoWeeks.length >= 2) {

            revenuePrev = revenueTwoWeeks[revenueTwoWeeks.length - 2].total || 0;
            revenueCurr = revenueTwoWeeks[revenueTwoWeeks.length - 1].total || 0;

            revenueGrowth = revenuePrev > 0 ? ((revenueCurr - revenuePrev) / revenuePrev) * 100 : 100;

        } else if (revenueTwoWeeks.length === 1) {

            revenueCurr = revenueTwoWeeks[0].total || 0;
            revenuePrev = 0;
            revenueGrowth = 100;
        }


        const userTwoWeeks = await User.aggregate([

            { $match: { createdAt: { $gte: lastTwoWeeks } } },
            {
                $group: {
                    _id: {
                        week: { $week: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } }

        ]);


        let userGrowth = 0;
        let userPrev = 0;
        let userCurr = 0;

        if (userTwoWeeks.length >= 2) {

            userPrev = userTwoWeeks[userTwoWeeks.length - 2].count || 0;
            userCurr = userTwoWeeks[userTwoWeeks.length - 1].count || 0;

            userGrowth = userPrev > 0 ? ((userCurr - userPrev) / userPrev) * 100 : 100;
            
        } else if (userTwoWeeks.length === 1) {

            userCurr = userTwoWeeks[0].count || 0;
            userPrev = 0;
            userGrowth = 100;
        }


        return res.status(200).json({

            totalRevenue, paidOrders, allOrder, totalUsers, totalProducts, averageOrderValue,
            revenue: {
                current: revenueCurr,
                previous: revenuePrev,
                growth: revenueGrowth.toFixed(2)
            },
            users: {
                current: userCurr,
                previous: userPrev,
                growth: userGrowth.toFixed(2)
            },
            revenueLastWeek, topProducts, lowStockAlert

        });

    } catch (err) {

        console.error(err)
        return res.status(500).json({ message: 'Error to get dashboard stats', error: err.message });
 
    }
}