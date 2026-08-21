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

// ==================== Пользователь ====================

// Добавить VPN
router.post(
    "/add",
    authMiddleware,
    addVpnKey
);

// Получить свободный VPN
router.get(
    "/get",
    authMiddleware,
    getFreeVpnKey
);

// ==================== Администратор ====================

// Получить все VPN
router.get(
    "/all",
    authMiddleware,
    isAdmin,
    getAllVpnKeys
);

// Обновить VPN
router.put(
    "/:id",
    authMiddleware,
    isAdmin,
    updateVpnKey
);

// Удалить VPN
router.delete(
    "/:id",
    authMiddleware,
    isAdmin,
    deleteVpnKey
);

// Освободить VPN
router.put(
    "/release/:id",
    authMiddleware,
    isAdmin,
    releaseVpnKey
);

module.exports = router;