const mongoose = require("mongoose");
const repo = require("../models/repoModel");
const issue = require("../models/issueModel");
const user = require("../models/userModel");

async function createRepo(req, res) {
    const { name, description, content, visibilty, owner, isuues } = req.body;

    if (!name) {
        return res.status(400).json("name does'nt exists");
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
        return res.status(400).json("user doesnt exists");
    }

    try {
        const newrepo = new repo({
            name, description, content, visibilty, owner, isuues
        });

        const result = await newrepo.save();
        return res.status(200).json({ message: "created", repoid: result._id });
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function getAllRepo(req, res) {
    try {
        let result = await repo.find({}).populate("owner").populate("isuues");
        res.json(result);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function fethRepoById(req, res) {
    const { id } = req.params;
    try {
        const result = await repo.findById(id).populate("owner").populate("isuues");
        res.json(result);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function fetchRepoByName(req, res) {
    const { name } = req.params;
    try {
        const result = await repo.find({ name: name }).populate("owner").populate("isuues");
        return res.json(result);
    } catch (err) {
        console.error("Error fetching repo by name:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function fetchRepoforCurrentUser(req, res) {
    const userId = req.params.userid || req.user;
    try {
        const userRepos = await repo.find({ owner: userId });
        if (!userRepos || userRepos.length === 0) {
            return res.status(404).json({ message: "repos not found" });
        }
        res.json(userRepos);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function updateRepo(req, res) {
    const { id } = req.params;
    const { content, description } = req.body;
    try {
        const newrepo = await repo.findById(id);
        if (!newrepo) {
            return res.status(400).json({ message: "repo not found" });
        }

        if (content) newrepo.content.push(content);
        if (description) newrepo.description = description;

        const result = await newrepo.save();
        res.json(result);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function TogglevisvibiltyById(req, res) {
    const { id } = req.params;
    try {
        const newrepo = await repo.findById(id);
        if (!newrepo) {
            return res.status(400).json({ message: "repo not found" });
        }

        newrepo.visibilty = !newrepo.visibilty;
        const result = await newrepo.save();
        res.json({ message: "succes toggle", visibilty: result.visibilty });
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function deleteRepo(req, res) {
    const { id } = req.params;
    try {
        const result = await repo.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "repo not found" });
        }
        res.json({ message: "succes deleted" });
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

module.exports = {
    createRepo,
    getAllRepo,
    fetchRepoforCurrentUser,
    fethRepoById,
    fetchRepoByName,
    updateRepo,
    TogglevisvibiltyById,
    deleteRepo
};