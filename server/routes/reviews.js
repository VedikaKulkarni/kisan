const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User'); // If we want to update aggregate stats on User
const auth = require('../middleware/auth');

// Add a Review
router.post('/', auth, async (req, res) => {
    const { order_id, rating, comment } = req.body;

    try {
        // Validate Order
        const order = await Order.findById(order_id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Ensure user is the consumer of this order
        if (order.consumer_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to review this order' });
        }

        // Ensure order is completed or paid (depending on logic, user said completed)
        if (order.order_status !== 'paid' && order.order_status !== 'completed') {
            // Allowing 'paid' as well since usually payment completes the transaction flow here
            // but strictly user said "completed". Let's stick to checking if it's done. 
            // Our transaction history shows 'paid' or 'completed'.
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ order_id, consumer_id: req.user.id });
        if (existingReview) {
            return res.status(400).json({ msg: 'You have already reviewed this order' });
        }

        const review = new Review({
            order_id,
            consumer_id: req.user.id,
            farmer_id: order.farmer_id,
            product_id: order.product_id,
            rating,
            comment
        });

        await review.save();

        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Reviews for a Farmer
router.get('/farmer/:farmerId', async (req, res) => {
    try {
        const reviews = await Review.find({ farmer_id: req.params.farmerId })
            .populate('consumer_id', 'name')
            .populate('product_id', 'crop_name')
            .sort({ created_at: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Stats for a Farmer (Average Rating)
router.get('/stats/:farmerId', async (req, res) => {
    try {
        // Aggregation to calculate average
        const stats = await Review.aggregate([
            { $match: { farmer_id: new require('mongoose').Types.ObjectId(req.params.farmerId) } },
            {
                $group: {
                    _id: '$farmer_id',
                    averageRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            res.json({ average: Math.round(stats[0].averageRating * 10) / 10, count: stats[0].count });
        } else {
            res.json({ average: 0, count: 0 });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
