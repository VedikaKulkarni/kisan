const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Place an order
router.post('/', auth, async (req, res) => {
    const { product_id, farmer_id, requested_quantity, original_price, negotiated_price, payment_method } = req.body;

    try {
        // Basic validation could go here
        const product = await Product.findById(product_id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        if (product.quantity < requested_quantity) {
            return res.status(400).json({ msg: 'Not enough quantity available' });
        }

        const effectiveNegotiatedPrice = negotiated_price || original_price;

        const order = new Order({
            product_id,
            farmer_id,
            consumer_id: req.user.id,
            requested_quantity,
            original_price,
            negotiated_price: effectiveNegotiatedPrice,
            payment_method,
            final_price: null, // To be set by farmer
            order_status: 'requested',
            order_date: Date.now()
        });

        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get My Orders (Consumer)
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ consumer_id: req.user.id })
            .populate('product_id', 'crop_name image_url')
            .populate('farmer_id', 'name phone')
            .sort({ order_date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Farmer Orders (Orders received by farmer)
router.get('/farmer-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ farmer_id: req.user.id })
            .populate('product_id', 'crop_name image_url')
            .populate('consumer_id', 'name phone')
            .sort({ order_date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('product_id')
            .populate('farmer_id', 'name');

        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Ensure user is related to order
        if (order.consumer_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Order Status (Dev/Farmer Action)
router.put('/:id/status', auth, async (req, res) => {
    const { status, final_price } = req.body;
    try {
        let updateFields = { order_status: status };
        if (final_price !== undefined) updateFields.final_price = final_price;
        // Also set approval_date if approved
        if (status === 'approved') updateFields.approval_date = Date.now();

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );

        // If approved, decrease product quantity
        if (status === 'approved') {
            const product = await Product.findById(order.product_id);
            if (product) {
                product.quantity -= order.requested_quantity;
                if (product.quantity < 0) product.quantity = 0; // Prevent negative
                if (product.quantity === 0) product.status = 'inactive';
                await product.save();
            }
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
