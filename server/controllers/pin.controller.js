
const { Pin } = require("../models/pin.model.js");
const getDataUrl = require("../utils/urlGenerator.js");
const cloudinary = require("cloudinary").v2;


const createPin = async (req, res) => {
    try {
        const { title, pin } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "File is required" });
        }

        const fileUrl = getDataUrl(file);
        const cloud = await cloudinary.uploader.upload(fileUrl.content);

        await Pin.create({
            title,
            pin,
            image: {
                id: cloud.public_id,
                url: cloud.secure_url,
            },
            owner: req.user._id,
        });

        res.json({ message: "Pin Created" });
    } catch (error) {
        console.error("Create Pin Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const getAllPins = async (req, res) => {
    try {
        const pins = await Pin.find().sort({ createdAt: -1 });
        res.json(pins);
    } catch (error) {
        console.error("Get All Pins Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const getSinglePin = async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.id).populate("owner", "-password");

        if (!pin) {
            return res.status(404).json({ message: "Pin not found" });
        }

        res.json(pin);
    } catch (error) {
        console.error("Get Single Pin Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const commentOnPin = async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.id);

        if (!pin) {
            return res.status(400).json({ message: "No Pin with this ID" });
        }

        pin.comments.push({
            user: req.user._id,
            name: req.user.name,
            comment: req.body.comment,
        });

        await pin.save();
        res.json({ message: "Comment Added" });
    } catch (error) {
        console.error("Comment Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const deleteComment = async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.id);

        if (!pin) {
            return res.status(400).json({ message: "No Pin with this ID" });
        }

        if (!req.query.commentId) {
            return res.status(400).json({ message: "Please provide comment ID" });
        }

        const commentIndex = pin.comments.findIndex(
            (item) => item._id.toString() === req.query.commentId.toString()
        );

        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const comment = pin.comments[commentIndex];

        if (comment.user.toString() === req.user._id.toString()) {
            pin.comments.splice(commentIndex, 1);
            await pin.save();
            return res.json({ message: "Comment Deleted" });
        } else {
            return res.status(403).json({ message: "You are not the owner of this comment" });
        }
    } catch (error) {
        console.error("Delete Comment Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const deletePin = async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.id);

        if (!pin) {
            return res.status(400).json({ message: "No Pin with this ID" });
        }

        if (pin.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await cloudinary.uploader.destroy(pin.image.id);
        await pin.deleteOne();

        res.json({ message: "Pin Deleted" });
    } catch (error) {
        console.error("Delete Pin Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const updatePin = async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.id);

        if (!pin) {
            return res.status(400).json({ message: "No Pin with this ID" });
        }

        if (pin.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        pin.title = req.body.title || pin.title;
        pin.pin = req.body.pin || pin.pin;

        await pin.save();
        res.json({ message: "Pin Updated" });
    } catch (error) {
        console.error("Update Pin Error:", error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createPin,
    getAllPins,
    getSinglePin,
    commentOnPin,
    deleteComment,
    deletePin,
    updatePin,
};
