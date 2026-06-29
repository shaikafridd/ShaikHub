const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { revert } = require("./controllers/revert");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");

yargs(hideBin(process.argv))
    .command("start", "start a new server", {}, startServer)
    .command("init", "Initialize a new repository", {}, initRepo)
    .command("add <file>", "add a file to the repository", (yargs) => { yargs.positional("file", { describe: "file addded to staging", type: "string" }); }, (argv) => {
        addRepo(argv.file)
    })
    .command("commit <message>", "add a message to your commit", (yargs) => {
        yargs.positional("message", {
            describe: "Added to message to commits", type: "string"
        });
    }, (argv) => {
        commitRepo(argv.message);
    })
    .command("revert <commitId>", "Reverting the specific commits", (yargs) => {
        yargs.positional("commitId", { describe: "reverting the specific commit", type: "string" });
    }, (argv) => {
        revert(argv.commitId);
    })
    .command("push", "push commits to s3", {}, pushRepo)
    .command("pull", "pull commits to s3", {}, pullRepo)
    .demandCommand(1, "You need at least one command before moving on")
    .help()
    .argv;

function startServer() {
    console.log("started");
}