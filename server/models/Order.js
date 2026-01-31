const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    consumer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requested_quantity: { type: Number, required: true },
    original_price: { type: Number, required: true },
    negotiated_price: { type: Number }, // Price offered by consumer
    final_price: { type: Number }, // Filled after farmer approval
    payment_method: { type: String, enum: ['Online', 'Cash'], required: true },
    order_status: {
        type: String,
        enum: ['requested', 'approved', 'payment_pending', 'paid', 'completed', 'rejected'],
        default: 'requested'
    },
    order_date: { type: Date, default: Date.now },
    approval_date: Date,
    payment_date: Date
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
