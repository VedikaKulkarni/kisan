const { fetchMandiPrice } = require('./mandi');

async function getMandiPrices(query) {
    // Extract commodity from query (simple heuristic)
    const commodities = ["Wheat", "Rice", "Onion", "Potato", "Tomato", "Maize", "Soybean", "Cotton", "Bajra", "Jowar", "Banana", "Grapes", "Pomegranate"];
    const commodity = commodities.find(c => query.toLowerCase().includes(c.toLowerCase()));

    if (!commodity) return "Please specify a valid crop (e.g. Wheat, Rice, Onion) to check prices.";

    try {
        // Use the shared utility which handles API + DB Fallback
        const records = await fetchMandiPrice(commodity, 5);

        if (records && records.length > 0) {
            return records.map(r =>
                `- ${r.market}, ${r.district}: ₹${r.modal_price}/quintal (${r.arrival_date})`
            ).join("\n");
        } else {
            return `No live data found for ${commodity} in Maharashtra right now.`;
        }
    } catch (e) {
        console.error("Bot Mandi Error", e);
        return "Sorry, unable to fetch market prices at the moment.";
    }
}

module.exports = { getMandiPrices };
