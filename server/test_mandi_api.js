require('dotenv').config();
const mongoose = require('mongoose');
const { getMandiPrices } = require('./utils/mandi_bot');

async function verifyChatbotMandi() {
    console.log("=== Chatbot Mandi Logic Verification ===");

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ DB Connection Failed", err);
        return;
    }

    // Test 1: Ask for Onion (Empty in API, should fetch DB)
    console.log("\nTest 1: Query 'What is price of onion?'");
    const responseOnion = await getMandiPrices("What is price of onion?");
    console.log("Response:\n" + responseOnion);

    if (responseOnion.includes("Pune") || responseOnion.includes("Lasalgaon")) {
        console.log("✅ Verified: Chatbot returned data (likely from DB).");
    } else {
        console.log("⚠️ Check output manually.");
    }

    // Test 2: Ask for invalid crop
    console.log("\nTest 2: Query 'Price of Macbooks'");
    const responseInvalid = await getMandiPrices("Price of Macbooks");
    console.log("Response:\n" + responseInvalid);

    await mongoose.disconnect();
}

verifyChatbotMandi();
