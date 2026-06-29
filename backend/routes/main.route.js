const express = require("express");
const userRoute = require("./user.route")
const RepoRouter = require("./repo.routes")
const issueRoute = require("./issue.route")

const mainRoute = express.Router();

mainRoute.use(userRoute);
mainRoute.use(RepoRouter);
mainRoute.use(issueRoute);

mainRoute.get("/", (req, res) => {
    res.send("welcome");
});

module.exports = mainRoute;