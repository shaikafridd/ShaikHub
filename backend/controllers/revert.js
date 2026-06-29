const fs = require("fs").promises;
const path = require("path");

async function revert(commitId) {
    const repoPth = path.resolve(process.cwd(), ".shaikHub");
    const commitsPath = path.join(repoPth, "commits");

    try {
        const commitDir = path.join(commitsPath, commitId);
        const files = await fs.readdir(commitDir);
        const parentDir = path.resolve(repoPth, "..");

        for (const file of files) {
            await fs.copyFile(path.join(commitDir, file), path.join(parentDir, file));
        }

        console.log(`Files reverted successfully to commit: ${commitId}`);
    } catch (err) {
        console.error("Error reverting files:", err);
    }
}

module.exports = { revert };