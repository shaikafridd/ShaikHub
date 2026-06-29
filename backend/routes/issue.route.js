const issueController = require("../controllers/issueControllelr.js");
const express = require("express");
const issueRoute = express.Router();

issueRoute.get("/issues/all", issueController.getAllIssue);
issueRoute.get("/issues/:id", issueController.getIssueById);
issueRoute.delete("/issues/:id", issueController.deleteIssuebyid);
issueRoute.put("/issues/:id", issueController.updateIssuebyid);
issueRoute.post("/issues/create", issueController.createIssue);

module.exports = issueRoute;