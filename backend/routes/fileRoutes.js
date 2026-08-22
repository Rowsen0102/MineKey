const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

const { authMiddleware } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

router.get("/", authMiddleware, getFiles);

router.get("/download/:id", authMiddleware, downloadFile);

router.delete("/:id", authMiddleware, deleteFile);

module.exports = router;