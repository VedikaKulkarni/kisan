const express = require("express");
const router = express.Router();
const { fetchMandiPrice } = require("../utils/mandi");

const DEFAULT_COMMODITIES = ["Wheat", "Rice", "Onion", "Potato", "Tomato", "Maize", "Soybean", "Cotton"];

router.get("/", async (req, res) => {
    try {
        const commodity = req.query.commodity;

        if (commodity) {
            // Search mode: Get multiple markets for this crop
            const records = await fetchMandiPrice(commodity, 20);
            return res.json({ records: records });
        }

        // Default mode: Get 1 sample from each default crop
        const results = await Promise.all(
            DEFAULT_COMMODITIES.map(c => fetchMandiPrice(c, 1))
        );

        const validRecords = results.flat().filter(r => r);
        res.json({ records: validRecords });

    } catch (error) {
        console.error("MANDI ERROR 👉", error.message);
        res.status(500).json({ error: "Backend mandi error" });
    }
});

module.exports = router;
