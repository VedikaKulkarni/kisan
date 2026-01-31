const Groq = require("groq-sdk");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function askAI(context, question, language = "English") {
    try {
        const systemPrompt = `
You are KisanSetu AI, an expert agricultural assistant for Indian farmers. 
Your goal is to provide accurate, helpful, and practical advice in **${language}**.
Tone: Professional, empathetic, encouraging.

Use the provided CONTEXT to answer the question. 
If the context has specific local data (like weather or prices), PRIORITIZE IT.
If the context is generic, use your general expert knowledge.

CONTEXT:
${context}

USER QUESTION:
${question}

Keep the answer concise (under 150 words) unless detailed explanation is needed.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 500
        });

        return completion.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    } catch (e) {
        console.error("Groq AI Error:", e);
        return "I am facing some technical issues connecting to the AI brain. Please try again later.";
    }
}

async function extractLocation(text) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Extract the city or district name from the user's text. Return ONLY the name. If none, return null." },
                { role: "user", content: text }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0
        });
        const loc = completion.choices[0]?.message?.content?.trim();
        return (loc && loc !== "null") ? loc : null;
    } catch (e) {
        return null; // fallback
    }
}

module.exports = { askAI, extractLocation };
