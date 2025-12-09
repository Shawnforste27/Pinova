const express = require("express");
const {
    commentOnPin,
    createPin,
    deleteComment,
    deletePin,
    getAllPins,
    getSinglePin,
    updatePin,
} = require("../controllers/pin.controller.js");
const isAuth = require("../middleware/isAuth.js");
const uploadFile = require("../middleware/multer.js");

const pinRouter = express.Router();

pinRouter.post("/new", isAuth, uploadFile, createPin);
pinRouter.get("/all",  getAllPins);
pinRouter.get("/:id", isAuth, getSinglePin);
pinRouter.put("/:id", isAuth, updatePin);
pinRouter.delete("/:id", isAuth, deletePin);
pinRouter.post("/comment/:id", isAuth, commentOnPin);
pinRouter.delete("/comment/:id", isAuth, deleteComment);

module.exports = pinRouter;
