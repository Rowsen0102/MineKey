require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Добавить VPN
const addVpnKey = async (req, res) => {
    try {
        const { vpn_key, country } = req.body;

        await pool.query(
            "INSERT INTO vpn_keys (vpn_key, country) VALUES ($1, $2)",
            [vpn_key, country]
        );

        res.json({
            message: "VPN-ключ добавлен",
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Ошибка добавления VPN-ключа",
            error: err.message,
        });
    }
};

// Получить свободный VPN
const getFreeVpnKey = async (req, res) => {
    try {
        // Проверяем, есть ли уже VPN у пользователя
        const myVpn = await pool.query(
            "SELECT * FROM vpn_keys WHERE user_id = $1 LIMIT 1",
            [req.user.id]
        );

        if (myVpn.rows.length > 0) {
            return res.json(myVpn.rows[0]);
        }

        // Ищем свободный VPN
        const result = await pool.query(
            "SELECT * FROM vpn_keys WHERE is_used = FALSE LIMIT 1"
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Свободных VPN-ключей нет",
            });
        }

        const vpn = result.rows[0];

        // Закрепляем VPN за пользователем
        await pool.query(
            `UPDATE vpn_keys
             SET is_used = TRUE,
                 user_id = $1
             WHERE id = $2`,
            [req.user.id, vpn.id]
        );

        res.json(vpn);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Ошибка получения VPN",
            error: err.message,
        });
    }
};

// Получить все VPN
const getAllVpnKeys = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT vpn_keys.*, users.username
             FROM vpn_keys
             LEFT JOIN users
             ON vpn_keys.user_id = users.id
             ORDER BY vpn_keys.id ASC`
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Ошибка получения списка VPN",
            error: err.message,
        });
    }
};

// Удалить VPN
const deleteVpnKey = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM vpn_keys WHERE id = $1",
            [id]
        );

        res.json({
            message: "VPN удалён",
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Ошибка удаления VPN",
            error: err.message,
        });
    }
};

// Обновить VPN
const updateVpnKey = async (req, res) => {
    try {
        const { id } = req.params;
        const { vpn_key, country } = req.body;

        await pool.query(
            `UPDATE vpn_keys
             SET vpn_key = $1,
                 country = $2
             WHERE id = $3`,
            [vpn_key, country, id]
        );

        res.json({
            message: "VPN обновлён",
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Ошибка обновления VPN",
            error: err.message,
        });
    }
};
// Освободить VPN
const releaseVpnKey = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE vpn_keys
             SET is_used = FALSE,
                 user_id = NULL
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "VPN не найден",
            });
        }

        res.json({
            message: "VPN освобождён",
            vpn: result.rows[0],
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Ошибка освобождения VPN",
            error: err.message,
        });
    }
};
module.exports = {
    addVpnKey,
    getFreeVpnKey,
    getAllVpnKeys,
    deleteVpnKey,
    updateVpnKey,
    releaseVpnKey,
};