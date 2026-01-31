require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data (optional, but cleaner for a fresh start)
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing Users and Products');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Create Farmers
        const farmer1 = await User.create({
            name: 'Ramesh Patil',
            phone: '9876543210',
            email: 'ramesh@farmer.com',
            password: hashedPassword,
            role: 'farmer',
            village: 'Nashik Village',
            district: 'Nashik',
            state: 'Maharashtra'
        });

        const farmer2 = await User.create({
            name: 'Suresh Kumar',
            phone: '9876543211',
            email: 'suresh@farmer.com',
            password: hashedPassword,
            role: 'farmer',
            village: 'Khed',
            district: 'Pune',
            state: 'Maharashtra'
        });

        console.log('Farmers Created');

        // Create Consumers
        const consumer1 = await User.create({
            name: 'Amit Sharma',
            phone: '9876543220',
            email: 'amit@consumer.com',
            password: hashedPassword,
            role: 'consumer'
        });

        const consumer2 = await User.create({
            name: 'Priya Mehta',
            phone: '9876543221',
            email: 'priya@consumer.com',
            password: hashedPassword,
            role: 'consumer'
        });

        console.log('Consumers Created');

        // Create Products
        await Product.create([
            {
                farmer_id: farmer1._id,
                crop_name: 'Fresh Tomatoes',
                category: 'Vegetables',
                quantity: 500,
                price: 30,
                sell_date: new Date(),
                sell_location: { village: 'Nashik', district: 'Nashik', state: 'Maharashtra' },
                image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
                status: 'active'
            },
            {
                farmer_id: farmer1._id,
                crop_name: 'Organic Onions',
                category: 'Vegetables',
                quantity: 1000,
                price: 25,
                sell_date: new Date(),
                sell_location: { village: 'Nashik', district: 'Nashik', state: 'Maharashtra' },
                image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
                status: 'active'
            },
            {
                farmer_id: farmer2._id,
                crop_name: 'Basmati Rice',
                category: 'Grains',
                quantity: 200,
                price: 80,
                sell_date: new Date(),
                sell_location: { village: 'Khed', district: 'Pune', state: 'Maharashtra' },
                image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
                status: 'active'
            }
        ]);

        console.log('Products Seeded');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
