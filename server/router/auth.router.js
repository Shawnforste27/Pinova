const express = require("express");
const { signUp, signIn, googleAuth } = require("../controllers/auth.controller.js");


const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/google", googleAuth)
module.exports = authRouter;
