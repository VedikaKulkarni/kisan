const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');

// Get all conversations for current user
router.get('/conversations', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user.id] }
        })
            .populate('participants', 'name')
            .sort({ last_message_date: -1 });

        res.json(conversations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Get unread count for current user
router.get('/unread/count', auth, async (req, res) => {
    try {
        const count = await ChatMessage.countDocuments({
            receiver_id: req.user.id,
            read: false
        });
        res.json({ count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Mark messages as read from a specific user
router.put('/read/:senderId', auth, async (req, res) => {
    try {
        await ChatMessage.updateMany(
            { sender_id: req.params.senderId, receiver_id: req.user.id, read: false },
            { $set: { read: true } }
        );

        // Notify the user to update unread count
        if (req.io) {
            console.log(`Emitting 'messages_read' to user: ${req.user.id}`);
            req.io.to(req.user.id).emit('messages_read');
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get messages between current user and another user (farmer)
router.get('/:userId', auth, async (req, res) => {
    try {
        const messages = await ChatMessage.find({
            $or: [
                { sender_id: req.user.id, receiver_id: req.params.userId },
                { sender_id: req.params.userId, receiver_id: req.user.id }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Send message
router.post('/', auth, async (req, res) => {
    const { receiver_id, order_id, message } = req.body;
    try {
        const newMsg = new ChatMessage({
            sender_id: req.user.id,
            receiver_id,
            order_id,
            message
        });
        await newMsg.save();

        // Update or Create Conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, receiver_id] }
        });

        if (conversation) {
            conversation.last_message = message;
            conversation.last_message_date = Date.now();
            await conversation.save();
        } else {
            conversation = new Conversation({
                participants: [req.user.id, receiver_id],
                last_message: message,
                last_message_date: Date.now()
            });
            await conversation.save();
        }

        // Real-time: emit to receiver
        if (req.io) {
            req.io.to(receiver_id).emit('new_message', newMsg);
        }

        res.json(newMsg);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
