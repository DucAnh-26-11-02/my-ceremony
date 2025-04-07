const {default: mongoose} = require("mongoose");
const Configs = require("../config");

async function InitDatabase() {
    try {
        const connection = await mongoose.connect(Configs.database);

        console.log("[Info] Connected to MongoDB");
    } catch (err) {
        console.log("[Error] Error in InitDatabase: ", err);
    }
}

module.exports = InitDatabase;
