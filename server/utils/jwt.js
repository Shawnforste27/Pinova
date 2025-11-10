const jwt = require("jsonwebtoken");

const genToken = (id, res) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });

        res.cookie("token", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // 
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        return token;
    } catch (error) {
        console.error("Token generation error:", error);
        throw new Error("Failed to generate token");
    }
};

module.exports = { genToken };
