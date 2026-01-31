const axios = require('axios');

const PORT = process.env.PORT || 5000;
async function testChatbotIntent(question, role = 'consumer') {
    try {
        const res = await axios.post(`http://localhost:${PORT}/api/chatbot`, { question, role });
        console.log(`Q: "${question}" (Role: ${role})`);
        console.log(`A: "${res.data.answer}"`);
        if (res.data.action) {
            console.log(`Action: ${JSON.stringify(res.data.action)}`);
        } else {
            console.log("Action: None");
        }
        console.log('---');
    } catch (error) {
        console.error(`Error testing "${question}":`, error.message);
    }
}

async function runTests() {
    console.log("Testing Chatbot Navigation Intents...");
    await testChatbotIntent("I want to sell tomatoes");
    await testChatbotIntent("Show me the dashboard");
    await testChatbotIntent("Check mandi prices");
    await testChatbotIntent("where is live prices"); // Previously failing for user
    await testChatbotIntent("Go to my orders", "consumer");
    await testChatbotIntent("Go to my orders", "farmer"); // Should be /farmer-orders
    await testChatbotIntent("where is orders tab", "farmer");
    await testChatbotIntent("where is orders tab", "farmer");
    await testChatbotIntent("Show me the dashboard", "farmer"); // Should be /farmer-dashboard
    await testChatbotIntent("chat karna hai client ke sath");
    await testChatbotIntent("open chats tab");
    await testChatbotIntent("open my listings");
}

runTests();
