require('dotenv').config();
console.log("Env loaded:", {
    WEATHER_KEY_EXISTS: !!process.env.WEATHER_API_KEY,
    GROQ_KEY_EXISTS: !!process.env.GROQ_API_KEY,
    MONGO_URI_EXISTS: !!process.env.MONGO_URI
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// Attach io to requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Socket logic
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/mandi', require('./routes/mandi'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Serve Static Files (Uploads)
app.use('/uploads', express.static(require('path').join(__dirname, 'public/uploads')));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
