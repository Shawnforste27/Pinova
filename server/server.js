
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const connectDb = require("./config/db.js");
const authRouter = require("./router/auth.router.js");
const userRouter = require("./router/user.router.js");
const pinRouter = require("./router/pin.router.js");

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "https://pinova-client-v2.netlify.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDb();


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/pin", pinRouter);


app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});


app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
