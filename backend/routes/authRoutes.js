const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

const { authMiddleware } = require("../middleware/authMiddleware");

const {
    register,
    login,
    profile,
    uploadAvatar,
    updateProfile,
} = require("../controllers/authController");
console.log("authMiddleware:", typeof authMiddleware);
console.log("profile:", typeof profile);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.put("/profile", authMiddleware, updateProfile);
router.post(
    "/avatar",
    authMiddleware,
    upload.single("avatar"),
    uploadAvatar
);

module.exports = router;