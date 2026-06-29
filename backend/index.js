const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRoute = require("./routes/main.route");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { revert } = require("./controllers/revert");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { Socket } = require("dgram");

dotenv.config();

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
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongooseUri = process.env.MONGO_URI;

    mongoose.connect(mongooseUri).then(() => console.log("connected succefully")).catch((err) => console.log("error:", err));

    app.use(cors({ origin: "*" }));
    app.use("/", mainRoute);

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (Socket) => {
        Socket.on("join room", (userId) => {
            let user = userId;
            console.log("===");
            console.log(user);
            console.log("===");
            console.log(userId);
        });
    });
    const db = mongoose.connection;
    db.once("open", async () => {
        console.log("crud operation called");
    });
    httpServer.listen(port, () => {
        console.log(`port listeing at ${port}`);
    })
}