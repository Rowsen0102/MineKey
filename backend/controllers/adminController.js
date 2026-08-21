const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "minekey",
    password: "Rowsen2005",
    port: 5432,
});

// ================================
// Получить всех пользователей
// ================================

const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                username,
                email,
                role,
                avatar,
                is_blocked
             FROM users
             ORDER BY id`
        );

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// ================================
// Удалить пользователя
// ================================

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        if (req.user.id == id) {
            return res.status(400).json({
                message: "Нельзя удалить самого себя",
            });
        }

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        res.json({
            message: "Пользователь удалён",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// ================================
// Обновить пользователя
// ================================

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;

        const {
            username,
            email,
            role,
            password,
        } = req.body;

        let query;
        let values;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            query = `
                UPDATE users
                SET username = $1,
                    email = $2,
                    role = $3,
                    password = $4
                WHERE id = $5
                RETURNING id, username, email, role, is_blocked
            `;

            values = [
                username,
                email,
                role,
                hashedPassword,
                id,
            ];
        } else {
            query = `
                UPDATE users
                SET username = $1,
                    email = $2,
                    role = $3
                WHERE id = $4
                RETURNING id, username, email, role, is_blocked
            `;

            values = [
                username,
                email,
                role,
                id,
            ];
        }

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        res.json({
            message: "Пользователь обновлён",
            user: result.rows[0],
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// ================================
// Заблокировать пользователя
// ================================

const blockUser = async (req, res) => {
    try {
        const id = req.params.id;

        if (req.user.id == id) {
            return res.status(400).json({
                message: "Нельзя заблокировать самого себя",
            });
        }

        await pool.query(
            "UPDATE users SET is_blocked = TRUE WHERE id = $1",
            [id]
        );

        res.json({
            message: "Пользователь заблокирован",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// ================================
// Разблокировать пользователя
// ================================

const unblockUser = async (req, res) => {
    try {
        const id = req.params.id;

        await pool.query(
            "UPDATE users SET is_blocked = FALSE WHERE id = $1",
            [id]
        );

        res.json({
            message: "Пользователь разблокирован",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// ================================
// Статистика
// ================================

const getStats = async (req, res) => {
    try {
        const users = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const files = await pool.query(
            "SELECT COUNT(*) FROM files"
        );

        const vpn = await pool.query(
            "SELECT COUNT(*) FROM vpn_keys"
        );

        res.json({
            users: Number(users.rows[0].count),
            files: Number(files.rows[0].count),
            vpn: Number(vpn.rows[0].count),
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = {
    getUsers,
    deleteUser,
    updateUser,
    getStats,
    blockUser,
    unblockUser,
};