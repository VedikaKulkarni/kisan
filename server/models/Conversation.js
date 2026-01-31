const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    last_message: { type: String },
    last_message_date: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure unique conversation between two participants (optional but good practice)
// For simplicity in this dev phase, we'll handle uniqueness in logic
module.exports = mongoose.model('Conversation', conversationSchema);
