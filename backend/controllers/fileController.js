const path = require("path");
const fs = require("fs");
const pool = require("../database/db");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Файл не выбран",
            });
        }

        await pool.query(
            "INSERT INTO files (filename, originalname, user_id) VALUES ($1, $2, $3)",
            [
                req.file.filename,
                req.file.originalname,
                req.user.id,
            ]
        );

        res.json({
            message: "Файл успешно загружен",
            file: req.file.filename,
        });

    } catch (err) {
        console.error("UPLOAD FILE ERROR:", err);

        res.status(500).json({
            message: "Ошибка загрузки файла",
        });
    }
};

const getFiles = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                filename,
                originalname,
                created_at
             FROM files
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (err) {
        console.error("GET FILES ERROR:", err);

        res.status(500).json({
            message: "Ошибка получения файлов",
        });
    }
};

const downloadFile = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM files WHERE id = $1 AND user_id = $2",
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Файл не найден",
            });
        }

        const file = result.rows[0];

        const filePath = path.join(
            __dirname,
            "../uploads",
            file.filename
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: "Файл отсутствует на сервере",
            });
        }

        res.download(filePath, file.originalname);

    } catch (err) {
        console.error("DOWNLOAD FILE ERROR:", err);

        res.status(500).json({
            message: "Ошибка скачивания файла",
        });
    }
};

const deleteFile = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM files WHERE id = $1 AND user_id = $2",
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Файл не найден",
            });
        }

        const file = result.rows[0];

        const filePath = path.join(
            __dirname,
            "../uploads",
            file.filename
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await pool.query(
            "DELETE FROM files WHERE id = $1",
            [req.params.id]
        );

        res.json({
            message: "Файл успешно удалён",
        });

    } catch (err) {
        console.error("DELETE FILE ERROR:", err);

        res.status(500).json({
            message: "Ошибка удаления файла",
        });
    }
};

module.exports = {
    uploadFile,
    getFiles,
    downloadFile,
    deleteFile,
};