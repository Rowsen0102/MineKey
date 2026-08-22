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

// Получить VPN
router.get(
    "/get",
    authMiddleware,
    getFreeVpnKey
);

// Добавить VPN
router.post(
    "/add",
    authMiddleware,
    isAdmin,
    addVpnKey
);

// Все VPN
router.get(
    "/all",
    authMiddleware,
    isAdmin,
    getAllVpnKeys
);

// Обновить
router.put(
    "/:id",
    authMiddleware,
    isAdmin,
    updateVpnKey
);

// Удалить
router.delete(
    "/:id",
    authMiddleware,
    isAdmin,
    deleteVpnKey
);

// Освободить
router.put(
    "/release/:id",
    authMiddleware,
    isAdmin,
    releaseVpnKey
);

module.exports = router;