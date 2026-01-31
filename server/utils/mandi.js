const Resource_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const MandiRecord = require('../models/MandiRecord');

async function fetchMandiPrice(commodity, limit = 10) {
    // Helper to get fallback data from DB
    const getFallback = async () => {
        try {
            let query = {};
            if (commodity) {
                // Case-insensitive regex search
                query.commodity = { $regex: new RegExp(commodity, "i") };
            }
            const records = await MandiRecord.find(query).limit(limit);
            if (records.length === 0 && commodity) {
                // If specific commodity not found, return random variety
                return await MandiRecord.find({}).limit(limit);
            }
            return records;
        } catch (dbError) {
            console.error("DB Fallback error:", dbError);
            return [];
        }
    };

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.warn("API_KEY missing. Using DB fallback.");
        return await getFallback();
    }

    try {
        if (!commodity) {
            // General fetch
            const url = `https://api.data.gov.in/resource/${Resource_ID}?api-key=${API_KEY}&format=json&filters[state]=Maharashtra&limit=${limit}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.records && data.records.length > 0) return data.records;
        } else {
            // Specific commodity
            const url = `https://api.data.gov.in/resource/${Resource_ID}?api-key=${API_KEY}&format=json&filters[commodity]=${encodeURIComponent(commodity)}&filters[state]=Maharashtra&limit=${limit}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.records && data.records.length > 0) return data.records;
        }

        console.log(`API returned 0 records for ${commodity || 'General'}. Fetching from DB.`);
        return await getFallback();

    } catch (e) {
        console.error("API Fetch failed:", e.message, "Using DB fallback.");
        return await getFallback();
    }
}

module.exports = { fetchMandiPrice };
