const User = require("../models/auth.model.js");


const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user,
            message: "Profile fetched successfully",
        });
    } catch (e) {
        console.error("Profile fetch error:", e);
        return res.status(500).json({ message: e.message });
    }
};


const userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            user,
            message: "User profile fetched successfully",
        });
    } catch (e) {
        console.error("User profile error:", e);
        return res.status(500).json({ message: e.message });
    }
};


const followAndUnfollowUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({ message: "No user with this ID" });
        }

        if (user._id.toString() === loggedInUser._id.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }


        if (!Array.isArray(loggedInUser.following)) loggedInUser.following = [];
        if (!Array.isArray(user.followers)) user.followers = [];


        if (user.followers.includes(loggedInUser._id)) {
            const indexFollowing = loggedInUser.following.indexOf(user._id);
            const indexFollowers = user.followers.indexOf(loggedInUser._id);

            if (indexFollowing > -1) loggedInUser.following.splice(indexFollowing, 1);
            if (indexFollowers > -1) user.followers.splice(indexFollowers, 1);

            await loggedInUser.save();
            await user.save();

            return res.status(200).json({ message: "User unfollowed" });
        }


        loggedInUser.following.push(user._id);
        user.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await user.save();

        return res.status(200).json({ message: "User followed" });
    } catch (error) {
        console.error("Follow/Unfollow error:", error);
        return res.status(500).json({ message: error.message });
    }
};


const logOutUser = async (req, res) => {
    try {
       res.cookie("token", "", { 
  maxAge: 0,
  httpOnly: true,
  secure: true,      
  sameSite: "none",    
});
        
        res.json({
            message: "Logged Out Successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: error.message });
    }
};


module.exports = { myProfile, userProfile, followAndUnfollowUser, logOutUser };
