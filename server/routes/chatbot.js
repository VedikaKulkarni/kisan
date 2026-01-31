const express = require('express');
const router = express.Router();
const searchReference = require('../utils/search');
const { askAI, extractLocation } = require('../utils/groq');
const { getWeather } = require('../utils/weather');
const { getMandiPrices } = require('../utils/mandi_bot');

router.post("/", async (req, res) => {
    try {
        const { question, role, language } = req.body;
        const lowerQ = question.toLowerCase();

        // 2. STATIC KNOWLEDGE SEARCH (RAG)
        // First, search local DB to ensure we have static content ready if needed.
        const matched = searchReference(question);

        // 3. INTENT ROUTING (Priority Check)

        // Priority 0: Navigation / Action Intent
        const navIntents = [
            { keywords: ["sell", "add product", "post", "bechna", "new product"], path: "/add-product", reply: "Navigating to [Add Product](/add-product)..." },
            { keywords: ["dashboard", "home", "main"], path: role === 'farmer' ? "/farmer-dashboard" : "/dashboard", reply: "Taking you to the [Dashboard](/dashboard)..." },
            { keywords: ["market", "mandi", "bhav", "rates", "prices", "live"], path: "/marketplace", reply: "Opening [Marketplace](/marketplace)..." },
            { keywords: ["orders", "order", "history", "bookings", "track"], path: role === 'farmer' ? "/farmer-orders" : "/my-orders", reply: "Opening your [Orders](/my-orders)..." },
            { keywords: ["profile", "account", "settings"], path: "/profile", reply: "Opening your [Profile](/profile)..." },
            { keywords: ["chat", "talk", "client", "buyer", "seller", "message", "baat", "conversation"], path: "/chats", reply: "Opening your [Chats](/chats)..." },
            { keywords: ["listings", "products", "items", "inventory", "stock", "mera mal", "my items"], path: "/my-products", reply: "Opening your [Listings](/my-products)..." }
        ];

        for (const intent of navIntents) {
            if (intent.keywords.some(k => lowerQ.includes(k))) {
                console.log(`Priority 0: Navigation Intent -> ${intent.path} (Role: ${role})`);
                return res.json({
                    answer: intent.reply,
                    action: { type: "navigate", payload: intent.path }
                });
            }
        }


        // Priority 1: Mandi Prices
        if (lowerQ.includes("price") || lowerQ.includes("rate") || lowerQ.includes("bhav") || lowerQ.includes("mandi")) {
            console.log("Priority 1: Mandi Price Intent");
            const mandiResponse = await getMandiPrices(question);
            const context = `LIVE MARKET DATA FROM API:\n${mandiResponse}`;

            // 4. Comparison & AI Generation (Special Intent)
            const answer = await askAI(context, question, language || "English");
            return res.json({ answer });
        }

        // Priority 2: Weather
        if (lowerQ.includes("weather") || lowerQ.includes("temperature") || lowerQ.includes("mausam") || lowerQ.includes("barish") || lowerQ.includes("climate")) {
            console.log("Priority 2: Weather Intent");
            const location = await extractLocation(question);
            if (location) {
                const weatherData = await getWeather(location);
                const context = `LIVE WEATHER DATA:\n${weatherData}`;

                // 4. Comparison & AI Generation (Special Intent)
                const answer = await askAI(context, question, language || "English");
                return res.json({ answer });
            }
        }

        // If NO special intent was found:
        if (matched.length > 0) {
            console.log("Using Static Knowledge (RAG)");
            const context = `OFFICIAL PORTAL INFORMATION:\n${matched.map(m => m.content).join("\n")}`;
            const answer = await askAI(context, question, language || "English");
            return res.json({ answer });
        }

        // General Fallback
        console.log("Using General AI Knowledge");
        const context = "You are KisanSetu AI, a helpful agricultural assistant. Keep answers short, practical, and direct. If asked about app features (like orders, chats), explain how to access them briefly. Do NOT lecture about being an AI.";
        const answer = await askAI(context, question, language || "English");
        res.json({ answer });

    } catch (error) {
        console.error("Error in chat route:", error);
        res.status(500).json({ answer: "I am facing some technical issues. Please try again later." });
    }
});

module.exports = router;
