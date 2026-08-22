require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// ================= Добавить VPN =================

const addVpnKey = async (req, res) => {
    try {
        const { vpn_key, country } = req.body;

        await pool.query(
            `INSERT INTO vpn_keys (vpn_key, country)
             VALUES ($1,$2)`,
            [vpn_key, country]
        );

        res.json({
            message: "VPN-ключ успешно добавлен",
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Ошибка добавления VPN",
            error: err.message,
        });
    }
};

// ================= Получить VPN =================

const getFreeVpnKey = async (req, res) => {
    try {

        const myVpn = await pool.query(
            `SELECT *
             FROM vpn_keys
             WHERE user_id=$1
             LIMIT 1`,
            [req.user.id]
        );

        if (myVpn.rows.length > 0) {
            return res.json(myVpn.rows[0]);
        }

        const result = await pool.query(
            `SELECT *
             FROM vpn_keys
             WHERE is_used=false
             LIMIT 1`
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Свободных VPN нет",
            });
        }

        const vpn = result.rows[0];

        await pool.query(
            `UPDATE vpn_keys
             SET
             is_used=true,
             user_id=$1
             WHERE id=$2`,
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

// ================= Все VPN =================

const getAllVpnKeys = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
            vpn_keys.*,
            users.username

            FROM vpn_keys

            LEFT JOIN users
            ON users.id=vpn_keys.user_id

            ORDER BY vpn_keys.id ASC
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Ошибка",
            error: err.message,
        });

    }

};

// ================= Удалить =================

const deleteVpnKey = async (req, res) => {

    try {

        await pool.query(
            "DELETE FROM vpn_keys WHERE id=$1",
            [req.params.id]
        );

        res.json({
            message: "VPN удалён",
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Ошибка",
            error: err.message,
        });

    }

};

// ================= Обновить =================

const updateVpnKey = async (req, res) => {

    try {

        const { vpn_key, country } = req.body;

        await pool.query(
            `UPDATE vpn_keys
             SET
             vpn_key=$1,
             country=$2
             WHERE id=$3`,
            [vpn_key, country, req.params.id]
        );

        res.json({
            message: "VPN обновлён",
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Ошибка",
            error: err.message,
        });

    }

};

// ================= Освободить =================

const releaseVpnKey = async (req, res) => {

    try {

        await pool.query(
            `UPDATE vpn_keys
             SET
             is_used=false,
             user_id=NULL
             WHERE id=$1`,
            [req.params.id]
        );

        res.json({
            message: "VPN освобождён",
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Ошибка",
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