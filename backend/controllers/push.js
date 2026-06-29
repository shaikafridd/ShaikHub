const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".shaikHub");
    const commitsPath = path.join(repoPath, "commits");

    try {
        try {
            await fs.access(commitsPath);
        } catch {
            console.log("No commits found to push.");
            return;
        }

        const commitDirs = await fs.readdir(commitsPath);
        if (commitDirs.length === 0) {
            console.log("No commits found to push.");
            return;
        }

        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const stat = await fs.stat(commitPath);
            if (!stat.isDirectory()) continue;

            const files = await fs.readdir(commitPath);
            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);
                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent
                };
                await s3.upload(params).promise();
            }
        }
        console.log("commits are pushed to s3 bucket");
    } catch (err) {
        console.error("error:", err);
    }
}

module.exports = { pushRepo };