const mongoose = require("mongoose");
const { Schema } = mongoose;

const RepoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: [{
        type: String,
        required: true,
    }],
    visibilty:
    {
        type: Boolean,
    },
    owner:
    {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    isuues: [
        {
            type: mongoose.Types.ObjectId,
            ref: "issue",
        },
    ],
})

const repo = mongoose.model("repo", RepoSchema);
module.exports = repo;