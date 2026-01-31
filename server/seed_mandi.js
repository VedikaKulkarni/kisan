require('dotenv').config();
const mongoose = require('mongoose');
const MandiRecord = require('./models/MandiRecord');

const MOCK_DATA = [
    // Onions
    { commodity: "Onion", market: "Pune", district: "Pune", variety: "Red", modal_price: "2200", min_price: "1800", max_price: "2500" },
    { commodity: "Onion", market: "Lasalgaon", district: "Nashik", variety: "Summer", modal_price: "2100", min_price: "1500", max_price: "2400" },
    { commodity: "Onion", market: "Solapur", district: "Solapur", variety: "Red", modal_price: "2050", min_price: "1600", max_price: "2300" },
    { commodity: "Onion", market: "Ahmednagar", district: "Ahmednagar", variety: "Gavran", modal_price: "2300", min_price: "1900", max_price: "2600" },

    // Wheat
    { commodity: "Wheat", market: "Rahata", district: "Ahmednagar", variety: "Lokwan", modal_price: "2800", min_price: "2600", max_price: "3000" },
    { commodity: "Wheat", market: "Amravati", district: "Amravati", variety: "Sharban", modal_price: "2900", min_price: "2700", max_price: "3100" },
    { commodity: "Wheat", market: "Latur", district: "Latur", variety: "Medium", modal_price: "2750", min_price: "2500", max_price: "2900" },

    // Rice
    { commodity: "Rice", market: "Karad", district: "Satara", variety: "Indrayani", modal_price: "4500", min_price: "4200", max_price: "4800" },
    { commodity: "Rice", market: "Ratnagiri", district: "Ratnagiri", variety: "Basmati", modal_price: "6000", min_price: "5500", max_price: "6500" },
    { commodity: "Rice", market: "Bhandara", district: "Bhandara", variety: "Kolam", modal_price: "3800", min_price: "3500", max_price: "4100" },

    // Vegetables
    { commodity: "Potato", market: "Kolhapur", district: "Kolhapur", variety: "Local", modal_price: "1800", min_price: "1500", max_price: "2000" },
    { commodity: "Tomato", market: "Nashik", district: "Nashik", variety: "Hybrid", modal_price: "1200", min_price: "900", max_price: "1500" },
    { commodity: "Spinach", market: "Mumbai", district: "Mumbai", variety: "Green", modal_price: "1500", min_price: "1000", max_price: "2000" },

    // Fruits
    { commodity: "Banana", market: "Jalgaon", district: "Jalgaon", variety: "Basrai", modal_price: "1500", min_price: "1200", max_price: "1800" },
    { commodity: "Pomegranate", market: "Sangola", district: "Solapur", variety: "Bhagwa", modal_price: "8500", min_price: "7000", max_price: "9500" },
    { commodity: "Grapes", market: "Nashik", district: "Nashik", variety: "Thompson", modal_price: "6500", min_price: "5000", max_price: "7500" },

    // Cash Crops
    { commodity: "Soybean", market: "Latur", district: "Latur", variety: "Yellow", modal_price: "4600", min_price: "4400", max_price: "4900" },
    { commodity: "Cotton", market: "Yavatmal", district: "Yavatmal", variety: "Long Staple", modal_price: "7200", min_price: "6800", max_price: "7500" },
    { commodity: "Maize", market: "Aurangabad", district: "Aurangabad", variety: "Hybrid", modal_price: "2100", min_price: "1900", max_price: "2300" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing mock records
        await MandiRecord.deleteMany({});
        console.log('Existing records cleared');

        const currentDate = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY

        const records = MOCK_DATA.map(item => ({
            ...item,
            state: "Maharashtra",
            arrival_date: currentDate
        }));

        await MandiRecord.insertMany(records);
        console.log(`Successfully seeded ${records.length} mandi records`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
