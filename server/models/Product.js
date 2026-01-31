const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    crop_name: { type: String, required: true },
    category: { type: String, enum: ['Vegetables', 'Fruits', 'Grains', 'Others'], default: 'Vegetables' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Farmer's expected price per unit
    sell_date: { type: Date, required: true }, // Date when farmer will sell
    sell_location: {
        village: String,
        district: String,
        state: String
    },
    image_url: String,
    status: { type: String, enum: ['active', 'inactive', 'sold'], default: 'active' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
