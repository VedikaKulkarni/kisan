require('dotenv').config();
const mongoose = require('mongoose');
const ChatMessage = require('./models/ChatMessage');
const User = require('./models/User');

async function testUnread() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Get a test user (Consumer or Farmer)
        const user = await User.findOne();
        if (!user) {
            console.log("No users found.");
            return;
        }
        console.log(`Testing for User: ${user.name} (${user._id})`);

        // 2. Count existing unread
        const initialCount = await ChatMessage.countDocuments({
            receiver_id: user._id,
            read: false
        });
        console.log(`Initial Unread Count: ${initialCount}`);

        // 3. Create a dummy unread message
        const sender = await User.findOne({ _id: { $ne: user._id } });
        if (sender) {
            console.log(`Creating test message from ${sender.name}...`);
            await ChatMessage.create({
                sender_id: sender._id,
                receiver_id: user._id,
                message: "Test Unread Message " + Date.now(),
                read: false
            });

            // 4. Count again
            const newCount = await ChatMessage.countDocuments({
                receiver_id: user._id,
                read: false
            });
            console.log(`New Unread Count: ${newCount}`);

            // 5. Mark as read
            console.log("Marking messages as read...");
            await ChatMessage.updateMany(
                { sender_id: sender._id, receiver_id: user._id, read: false },
                { $set: { read: true } }
            );

            // 6. Count final
            const finalCount = await ChatMessage.countDocuments({
                receiver_id: user._id,
                read: false
            });
            console.log(`Final Unread Count: ${finalCount}`);

        } else {
            console.log("No second user found to send message.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

testUnread();
