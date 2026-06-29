const mongoose = require("mongoose");
const repo = require("../models/repoModel");
const issue = require("../models/issueModel");
const user = require("../models/userModel");
async function createIssue(req, res) {
    const { title, description, repoId } = req.body;
    try {
        if (!title || !description || !repoId) {
            return res.status(400).json({ message: "title, description, and repoId are required" });
        }
        const repoObj = await repo.findById(repoId);
        if (!repoObj) {
            return res.status(404).json({ message: "Repository not found" });
        }
        const newIssue = new issue({ title, description, repo: repoId });
        await newIssue.save();

        repoObj.isuues.push(newIssue._id);
        await repoObj.save();

        return res.status(201).json(newIssue);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function updateIssuebyid(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const updatedIssue = await issue.findById(id);
        if (!updatedIssue) {
            return res.status(404).json({ message: "issue not found" });
        }
        if (title !== undefined) updatedIssue.title = title;
        if (description !== undefined) updatedIssue.description = description;
        if (status !== undefined) {
            if (!["open", "closed"].includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }
            updatedIssue.status = status;
        }

        await updatedIssue.save();
        return res.json(updatedIssue);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function deleteIssuebyid(req, res) {
    const { id } = req.params;
    try {
        const deletedIssue = await issue.findByIdAndDelete(id);
        if (!deletedIssue) {
            return res.status(404).json({ message: "issue not found" });
        }
        // Remove from repo's isuues array
        await repo.findByIdAndUpdate(deletedIssue.repo, {
            $pull: { isuues: id }
        });
        return res.json({ message: "issue deleted successfully" });
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function getAllIssue(req, res) {
    try {
        const issues = await issue.find({}).populate("repo");
        return res.json(issues);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function getIssueById(req, res) {
    const { id } = req.params;
    try {
        const foundIssue = await issue.findById(id).populate("repo");
        if (!foundIssue) {
            return res.status(404).json({ message: "issue not found" });
        }
        return res.json(foundIssue);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

module.exports = {
    createIssue,
    updateIssuebyid,
    deleteIssuebyid,
    getAllIssue,
    getIssueById,
}