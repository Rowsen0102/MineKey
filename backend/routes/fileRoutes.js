const express = require("express");
const router = express.Router();

const {
    addVpnKey,
    getFreeVpnKey,
    getAllVpnKeys,
    deleteVpnKey,
    updateVpnKey,
    releaseVpnKey,
} = require("../controllers/vpnController");

const {
    authMiddleware,
    isAdmin,
} = require("../middleware/authMiddleware");

// Пользователь
router.post("/add", authMiddleware, addVpnKey);
router.get("/get", authMiddleware, getFreeVpnKey);

// Администратор
router.get("/all", authMiddleware, isAdmin, getAllVpnKeys);
router.put("/:id", authMiddleware, isAdmin, updateVpnKey);
router.delete("/:id", authMiddleware, isAdmin, deleteVpnKey);

// Освободить VPN
router.put("/release/:id", authMiddleware, isAdmin, releaseVpnKey);

module.exports = router;