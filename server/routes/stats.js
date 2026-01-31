const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Get Dashboard Stats
router.get('/dashboard', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Total Orders
        const totalOrders = await Order.countDocuments({ consumer_id: userId });

        // 2. Pending Orders (status: requested, approved, payment_pending)
        const pendingOrders = await Order.countDocuments({
            consumer_id: userId,
            order_status: { $in: ['requested', 'approved', 'payment_pending'] }
        });

        // 3. Total Impact (Sum of amount paid to farmers)
        // We consider 'paid' and 'completed' orders
        const completedOrders = await Order.find({
            consumer_id: userId,
            order_status: { $in: ['paid', 'completed'] }
        });

        const totalImpact = completedOrders.reduce((sum, order) => {
            const price = order.final_price || order.negotiated_price || 0;
            return sum + (price * order.requested_quantity);
        }, 0);

        // 4. Recent Orders (Limit 5)
        const recentOrders = await Order.find({ consumer_id: userId })
            .sort({ order_date: -1 })
            .limit(5)
            .populate('product_id', 'crop_name')
            .populate('farmer_id', 'name');

        res.json({
            totalOrders,
            pendingOrders,
            totalImpact,
            recentOrders
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Farmer Dashboard Stats
router.get('/farmer-dashboard', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Total Earnings
        const completedOrders = await Order.find({
            farmer_id: userId,
            order_status: { $in: ['paid', 'completed'] }
        });

        const totalEarnings = completedOrders.reduce((sum, order) => {
            const price = order.final_price || order.negotiated_price || 0;
            return sum + (price * order.requested_quantity);
        }, 0);

        // 2. Active Listings
        const activeListings = await Product.countDocuments({ farmer_id: userId, status: 'active' });

        // 3. Pending Orders (for farmer to approve/deliver)
        const pendingOrders = await Order.countDocuments({
            farmer_id: userId,
            order_status: { $in: ['requested', 'approved', 'payment_pending'] }
        });

        // 4. Recent Products
        const recentProducts = await Product.find({ farmer_id: userId })
            .sort({ created_at: -1 })
            .limit(5);

        // 5. Rating and Reviews
        const statsRating = await Review.aggregate([
            { $match: { farmer_id: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$farmer_id',
                    averageRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const latestReviews = await Review.find({ farmer_id: userId })
            .sort({ created_at: -1 })
            .limit(3)
            .populate('consumer_id', 'name');

        console.log("Farmer Dashboard Stats Loaded for:", userId);

        res.json({
            totalEarnings,
            activeListings,
            pendingOrders,
            recentProducts,
            rating: statsRating.length > 0 ? {
                average: Math.round(statsRating[0].averageRating * 10) / 10,
                count: statsRating[0].count
            } : { average: 0, count: 0 },
            latestReviews
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
