const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    consumer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    payment_method: { type: String, enum: ['Note', 'Mock', 'UPI', 'Card'], default: 'Mock' },
    payment_status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    transaction_id: String,
    payment_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
