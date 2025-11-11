const jwt = require("jsonwebtoken");

const genToken = (id, res) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });

     res.cookie("token", token, {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  httpOnly: true,
         secure: true,   
  sameSite: "none", 
    
});

        return token;
    } catch (error) {
        console.error("Token generation error:", error);
        throw new Error("Failed to generate token");
    }
};

module.exports = { genToken };
