const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");

dotenv.config();
const dburi = process.env.MONGO_URI;
let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(dburi);
    }
    await client.connect();
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        await connectClient();
        const db = client.db();
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(400).json("Invalid credientials!!");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json("Invalid credientials!!");
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY_JWT, { expiresIn: "1h" });
        res.json({ token, userId: user._id });
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function signup(req, res) {
    const { Username, userName, password, email } = req.body;
    const targetUsername = userName || Username;

    try {
        await connectClient();
        const db = client.db();
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ userName: targetUsername });

        if (user) {
            return res.status(400).json("user already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = {
            Username: targetUsername,
            userName: targetUsername,
            password: hashedPass,
            email,
            repositories: [],
            followers: [],
            followedby: [],
            starredrepo: [],
        };

        const result = await userCollection.insertOne(newUser);

        const token = jwt.sign(
            { id: result.insertedId },
            process.env.SECRET_KEY_JWT,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "User created successfully",
            token
        });

    } catch (err) {
        console.error("error:", err);
        res.status(500).send("server error");
    }
}

async function getAllUser(req, res) {
    try {
        await connectClient();
        const db = client.db();
        const userCollection = db.collection("users");

        const users = await userCollection.find({}).toArray();
        res.json(users);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function UserProfile(req, res) {
    const currentId = req.params.id;
    try {
        await connectClient();
        const db = client.db();
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ _id: new ObjectId(currentId) });
        if (!user) {
            return res.status(404).json({ message: "user does'nt exixtsts" });
        }

        res.json(user);
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function updateUser(req, res) {
    let currId = req.params.id;
    let { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db();
        const userCollection = db.collection("users");

        let updateFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedpass = await bcrypt.hash(password, salt);
            updateFields.password = hashedpass;
        }
        const result = await userCollection.findOneAndUpdate(
            { _id: new ObjectId(currId) },
            { $set: updateFields },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({ message: "user does'nt exixtsts" });
        }
        res.json(result);

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

async function deleteUser(req, res) {
    const currId = req.params.id;
    try {
        await connectClient();
        const db = client.db();
        const userCollection = db.collection("users");

        let result = await userCollection.deleteOne({
            _id: new ObjectId(currId)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "user does'nt exixtsts" });
        }
        res.json({ message: "user deleted" });
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json("internal server error");
    }
}

module.exports = { getAllUser, login, signup, UserProfile, updateUser, deleteUser };