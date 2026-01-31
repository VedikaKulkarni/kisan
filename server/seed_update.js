require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const seedUpdates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for updates...');

        // Find our users
        const ramesh = await User.findOne({ email: 'ramesh@farmer.com' });
        const suresh = await User.findOne({ email: 'suresh@farmer.com' });
        const amit = await User.findOne({ email: 'amit@consumer.com' });
        const priya = await User.findOne({ email: 'priya@consumer.com' });

        if (!ramesh || !suresh || !amit || !priya) {
            console.error("Users not found. Please run seed.js first.");
            process.exit(1);
        }

        // 1. Add more products
        const moreProducts = await Product.create([
            {
                farmer_id: ramesh._id,
                crop_name: 'Alphonso Mangoes',
                category: 'Fruits',
                quantity: 100,
                price: 500,
                sell_date: new Date(),
                sell_location: { village: 'Nashik', district: 'Nashik', state: 'Maharashtra' },
                image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
                status: 'active'
            },
            {
                farmer_id: suresh._id,
                crop_name: 'Kesar Mangoes',
                category: 'Fruits',
                quantity: 150,
                price: 450,
                sell_date: new Date(),
                sell_location: { village: 'Khed', district: 'Pune', state: 'Maharashtra' },
                image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
                status: 'active'
            },
            {
                farmer_id: ramesh._id,
                crop_name: 'Organic Wheat',
                category: 'Grains',
                quantity: 2000,
                price: 40,
                sell_date: new Date(),
                sell_location: { village: 'Nashik', district: 'Nashik', state: 'Maharashtra' },
                image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
                status: 'active'
            }
        ]);
        console.log('Added 3 more products');

        // 2. Create "Requested" Orders
        const existingProducts = await Product.find({ status: 'active' });

        // Amit requests Tomatoes from Ramesh
        const tomato = existingProducts.find(p => p.crop_name === 'Fresh Tomatoes');
        if (tomato) {
            await Order.create({
                product_id: tomato._id,
                farmer_id: tomato.farmer_id,
                consumer_id: amit._id,
                requested_quantity: 10,
                original_price: tomato.price,
                negotiated_price: 28, // Amit offering slightly less
                payment_method: 'Online',
                order_status: 'requested'
            });
        }

        // Priya requests Rice from Suresh
        const rice = existingProducts.find(p => p.crop_name === 'Basmati Rice');
        if (rice) {
            await Order.create({
                product_id: rice._id,
                farmer_id: rice.farmer_id,
                consumer_id: priya._id,
                requested_quantity: 5,
                original_price: rice.price,
                negotiated_price: 75,
                payment_method: 'Cash',
                order_status: 'requested'
            });
        }

        // Priya requests Mangoes from Ramesh
        const mango = moreProducts[0]; // Alphonso
        await Order.create({
            product_id: mango._id,
            farmer_id: ramesh._id,
            consumer_id: priya._id,
            requested_quantity: 2,
            original_price: mango.price,
            negotiated_price: 500,
            payment_method: 'Online',
            order_status: 'requested'
        });

        console.log('Seeded 3 requested orders');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUpdates();
