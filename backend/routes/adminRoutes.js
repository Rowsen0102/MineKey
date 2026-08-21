const express = require("express");

const router = express.Router();

const {
    getUsers,
    deleteUser,
    getStats,
    updateUser,
    blockUser,
    unblockUser,
} = require("../controllers/adminController");

const {
    authMiddleware,
    isAdmin,
} = require("../middleware/authMiddleware");

// ===== Пользователи =====
router.get(
    "/users",
    authMiddleware,
    isAdmin,
    getUsers
);

router.delete(
    "/users/:id",
    authMiddleware,
    isAdmin,
    deleteUser
);

router.put(
    "/users/:id",
    authMiddleware,
    isAdmin,
    updateUser
);

// ===== Блокировка =====
router.put(
    "/block/:id",
    authMiddleware,
    isAdmin,
    blockUser
);

router.put(
    "/unblock/:id",
    authMiddleware,
    isAdmin,
    unblockUser
);

// ===== Статистика =====
router.get(
    "/stats",
    authMiddleware,
    isAdmin,
    getStats
);

module.exports = router;