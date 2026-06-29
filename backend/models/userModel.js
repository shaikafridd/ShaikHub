const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    repositories: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "repo",
        },
    ],
    followedUser: [
        {
            default: [],
            type: mongoose.Types.ObjectId,
            ref: "user",
        }
    ],
    followers: [
        {
            default: [],
            type: mongoose.Types.ObjectId,
            ref: "user",
        },
    ],
})

const user = mongoose.model("user", userSchema);
module.exports = user;