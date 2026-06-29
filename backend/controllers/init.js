const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

async function initRepo() {
    const repopath = path.resolve(process.cwd(), ".shaikHub");
    const commitspath = path.join(repopath, "commits");

    try {
        await fs.mkdir(repopath, { recursive: true });
        await fs.mkdir(commitspath, { recursive: true });

        await fs.writeFile(
            path.join(repopath, "config.json"),
            JSON.stringify({ bucket: process.env.S3_BUCKET || "shaikhubbucket" })
        )
        console.log("New repo is initialized!!");
    } catch (err) {
        console.error("error whiile creating repo", err);
    }
}

module.exports = { initRepo };