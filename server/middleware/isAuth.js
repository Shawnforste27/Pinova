const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");

const isAuth = async (req, res, next) => {
    try {

      
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({
                message: "Please login",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(403).json({
                message: "Token expired",
            });
        }

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = isAuth;
