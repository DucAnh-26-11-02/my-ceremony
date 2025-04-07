const {default: mongoose} = require("mongoose");

const AppSChema = new mongoose.Schema({
    openDate: {
        type: Date,
        required: true,
    },
    images: {
        type: Array,
        default: [],
    },
    name: {
        type: String,
        required: true,
    },
});

const AppModel = mongoose.model("App", AppSChema);

module.exports = AppModel;
