const express = require("express");
const { myProfile, userProfile, followAndUnfollowUser, logOutUser } = require("../controllers/user.controller.js");
const isAuth = require("../middleware/isAuth.js");

const userRouter = express.Router();


userRouter.get("/me", isAuth, myProfile);
userRouter.get("/logout", isAuth, logOutUser);
userRouter.post("/follow/:id", isAuth, followAndUnfollowUser);


userRouter.get("/:id", isAuth, userProfile);

module.exports = userRouter;
