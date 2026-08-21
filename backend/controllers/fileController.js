const path = require("path");
const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "minekey",
    password: "Rowsen2005",
    port: 5432,
});
const uploadFile = async (req, res) => {
    console.log("uploadFile вызван");
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
        req.user.id
    ]
);
    res.json({
        message: "Файл успешно загружен",
        file: req.file.filename,
    });
        } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Ошибка загрузки файла",
        });
    }
};
const getFiles = async (req, res) => {
    try {
        const result = await pool.query(
    "SELECT * FROM files WHERE user_id = $1",
    [req.user.id]
);
    res.json(result.rows);
} catch (err) {
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

    res.download(
        path.join(__dirname, "../uploads", file.filename),
        file.originalname
    );
} catch (err) {
    res.status(500).json({
        message: "Ошибка скачивания",
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

        const fs = require("fs");

        fs.unlinkSync(path.join(__dirname, "../uploads", file.filename));

        await pool.query(
            "DELETE FROM files WHERE id = $1",
            [req.params.id]
        );

        res.json({
            message: "Файл удалён",
        });

    } catch (err) {
        console.log(err);

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