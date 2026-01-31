const referenceDB = [
    {
        id: 1,
        keywords: ["add product", "how to sell", "add item", "add items", "sell items", "list new", "upload", "farmer"],
        content: "Farmers can add products by entering crop name, quantity, price per unit, image, location, and pickup date."
    },
    {
        id: 2,
        keywords: ["how to buy", "search", "browse", "consumer", "filter"],
        content: "Consumers can browse products, search by crop name, filter by price and location, and place order requests."
    },
    {
        id: 3,
        keywords: ["order", "live orders", "accept order", "reject order"],
        content: "Orders sent by consumers appear as Live Orders for farmers, where they can accept, reject, or chat."
    },
    {
        id: 4,
        keywords: ["payment", "pay", "order confirm"],
        content: "After farmer approval, the consumer proceeds to payment. Successful payment confirms the order."
    },
    {
        id: 5,
        keywords: ["chat", "ai", "support", "help", "assistant"],
        content: "The Chat with Us feature is an AI-powered assistant available to farmers, consumers, and admins."
    }
];

module.exports = referenceDB;
