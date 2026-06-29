const express = require("express");
const RepoRouter = express.Router();
const repoController = require("../controllers/repoController.js")

RepoRouter.post("/repo/create", repoController.createRepo);
RepoRouter.get("/repo/all", repoController.getAllRepo);
RepoRouter.get("/repo/:id", repoController.fethRepoById);
RepoRouter.get("/repo/name/:name", repoController.fetchRepoByName);
RepoRouter.get("/repo/user/:userid", repoController.fetchRepoforCurrentUser);
RepoRouter.put("/repo/update/:id", repoController.updateRepo);
RepoRouter.patch("/repo/toggle/:id", repoController.TogglevisvibiltyById);
RepoRouter.delete("/repo/delete/:id", repoController.deleteRepo);

module.exports = RepoRouter;
