const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all active products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ status: 'active' }).populate('farmer_id', 'name village district state');

        // Enrich with average rating
        const Review = require('../models/Review');
        const enrichedProducts = await Promise.all(products.map(async (p) => {
            const stats = await Review.aggregate([
                { $match: { farmer_id: p.farmer_id._id } },
                { $group: { _id: '$farmer_id', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
            ]);

            const plainProduct = p.toObject();
            plainProduct.rating = stats.length > 0 ? {
                average: Math.round(stats[0].avg * 10) / 10,
                count: stats[0].count
            } : { average: 0, count: 0 };

            return plainProduct;
        }));

        res.json(enrichedProducts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get My Products (Farmer)
router.get('/my-products', auth, async (req, res) => {
    try {
        const products = await Product.find({ farmer_id: req.user.id }).sort({ created_at: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('farmer_id', 'name village');
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add New Product
router.post('/', auth, async (req, res) => {
    const { crop_name, quantity, price, image_url, sell_date, sell_location } = req.body;
    try {
        const product = new Product({
            farmer_id: req.user.id,
            crop_name,
            quantity,
            price,
            image_url,
            sell_date: sell_date || Date.now(),
            sell_location: sell_location || {
                village: req.user.village || 'Unknown',
                district: req.user.district || 'Unknown',
                state: req.user.state || 'Unknown'
            }
        });
        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Update Product
router.put('/:id', auth, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Ensure user owns product
        if (product.farmer_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const { crop_name, quantity, price, image_url, status } = req.body;
        if (crop_name) product.crop_name = crop_name;
        if (quantity) product.quantity = quantity;
        if (price) product.price = price;
        if (image_url) product.image_url = image_url;
        if (status) product.status = status;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Product
router.delete('/:id', auth, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Ensure user owns product
        if (product.farmer_id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await product.deleteOne();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
