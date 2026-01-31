const mongoose = require('mongoose');

const MandiRecordSchema = new mongoose.Schema({
    commodity: { type: String, required: true, index: true },
    market: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, default: "Maharashtra" },
    variety: { type: String, default: "FAQ" },
    modal_price: { type: String, required: true }, // Storing as string to match API format roughly, or could be Number
    arrival_date: { type: String, required: true },
    min_price: { type: String },
    max_price: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MandiRecord', MandiRecordSchema);
