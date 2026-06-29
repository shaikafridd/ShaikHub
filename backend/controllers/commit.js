const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message) {
    const repoPath = path.resolve(process.cwd(), ".shaikHub");
    const stagingPath = path.join(repoPath, "staging");
    const commitPath = path.join(repoPath, "commits");

    try {
        try {
            await fs.access(stagingPath);
        } catch {
            console.log("No files staged for commit.");
            return;
        }

        const files = await fs.readdir(stagingPath);
        if (files.length === 0) {
            console.log("No files staged for commit.");
            return;
        }

        const commitId = uuidv4();
        const commitDir = path.join(commitPath, commitId);
        await fs.mkdir(commitDir, { recursive: true });

        for (const file of files) {
            await fs.copyFile(path.join(stagingPath, file), path.join(commitDir, file));
        }

        await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify({ message, date: new Date().toISOString() }));

        for (const file of files) {
            await fs.unlink(path.join(stagingPath, file));
        }

        console.log(`commit ${commitId} is created with message ${message}`);
    } catch (err) {
        console.error("error:", err);
    }

}
module.exports = { commitRepo };