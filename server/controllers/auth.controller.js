const User = require("../models/auth.model");
const bcrypt = require("bcrypt");
const { genToken } = require("../utils/jwt");

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        genToken(user._id, res);

        return res.status(201).json({
            message: "Signup successful",
            user
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        genToken(user._id, res);

        return res.status(200).json({
            message: "Signin successful",
            user
        });
    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const googleAuth = async (req, res) => {
    try {
        const { name, email, googleId } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId
            });
        }

        genToken(user._id, res);

        return res.status(200).json({
            message: "Google login successful",
            user
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ message: "Google auth failed" });
    }
};

module.exports = { signUp, signIn, googleAuth };
