const multer = require("multer");

// Define storage configuration (in memory)
const storage = multer.memoryStorage();

// ✅ Correct usage: call `.single("file")` after `multer()`
const uploadFile = multer({ storage }).single("file");

module.exports = uploadFile;
