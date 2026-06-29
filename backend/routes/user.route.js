const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/userController");

userRoute.get("/allUser", userController.getAllUser);
userRoute.post("/login", userController.login);
userRoute.post("/signup", userController.signup);
userRoute.get("/userprofile/:id", userController.UserProfile);
userRoute.put("/updateUser/:id", userController.updateUser);
userRoute.delete("/deleteUser/:id", userController.deleteUser);

module.exports = userRoute;