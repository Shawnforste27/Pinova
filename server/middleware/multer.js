const multer = require("multer");

// Define storage configuration (in memory)
const storage = multer.memoryStorage();


const uploadFile = multer({ storage }).single("file");

module.exports = uploadFile;
