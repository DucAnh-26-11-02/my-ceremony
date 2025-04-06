const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        alias: {
            type: String,
            required: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
        },
        invitationCards: {
            type: Array,
            default: [],
        },
        invitationQr: {
            type: String,
            required: true,
        },
        contents: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
