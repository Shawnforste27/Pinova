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

        const token = genToken(user._id, res);

        return res.status(201).json({
            message: "Signup successful",
            token,
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

        const token = genToken(user._id, res);

        return res.status(200).json({
            message: "Signin successful",
            token,
            user

        });
    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({ message: error.message });
    }
};



module.exports = { signUp, signIn, };
