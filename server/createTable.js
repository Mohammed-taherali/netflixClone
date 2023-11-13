const { MongoClient } = require("mongodb");

async function createDB(uri) {
    const client = new MongoClient(uri);
    const dbName = "netflixClone";
    try {
        await client.connect();
        const db = client.db(dbName);
        db.createCollection("myList");
        db.createCollection("previousViews");
        db.createCollection("userData");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { createDB };
