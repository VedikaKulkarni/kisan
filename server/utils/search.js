const referenceDB = require("./referenceDB.js");

function searchReference(question) {
    const qLower = question.toLowerCase();
    // Check if any of the entry's defined keywords appear in the user's question string
    return referenceDB.filter(entry =>
        entry.keywords && entry.keywords.some(k => qLower.includes(k.toLowerCase()))
    );
}

module.exports = searchReference;
