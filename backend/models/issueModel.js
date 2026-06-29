const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
    },
    repo:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "repo",
        required: true,
    },
})

const issue = mongoose.model("issue", IssueSchema);
module.exports = issue;