require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Заполните все поля"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
    "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
    [username, email, hashedPassword, "user"]
);
        res.json({
            message: "Пользователь зарегистрирован",
            user: {
                username,
                email,
                password: hashedPassword
            }
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
    return res.status(400).json({
        message: "Введите email и пароль"
    });
}
const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
);
if (result.rows.length === 0) {
    return res.status(401).json({
        message: "Пользователь не найден"
    });
}

const user = result.rows[0];
if (user.is_blocked) {
    return res.status(403).json({
        message: "Ваш аккаунт заблокирован"
    });
}

const isMatch = await
bcrypt.compare(password, user.password);
if (!isMatch) {
    return res.status(401).json({
        message: "Неверный пароль"
    });
}
const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

res.json({
    message: "Вход выполнен успешно",
    token,
    user: {
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
    }
});
    } catch (err) {
        res.status(500).json({
            error: err.message
        }); 

    }

};
const profile = async (req, res) => {
    try {
        const result = await pool.query(
    `SELECT
        id,
        username,
        email,
        role,
        avatar,
        created_at
     FROM users
     WHERE id = $1`,
    [req.user.id]
);

console.log(result.rows[0]);

        res.json({
            message: "Профиль пользователя",
            user: result.rows[0],
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Файл не выбран",
            });
        }

        const avatar = req.file.filename;

        await pool.query(
            "UPDATE users SET avatar = $1 WHERE id = $2",
            [avatar, req.user.id]
        );

        res.json({
            message: "Аватар успешно загружен",
            avatar,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
const updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            await pool.query(
                `UPDATE users
                 SET username = $1,
                     email = $2,
                     password = $3
                 WHERE id = $4`,
                [
                    username,
                    email,
                    hashedPassword,
                    req.user.id,
                ]
            );
        } else {
            await pool.query(
                `UPDATE users
                 SET username = $1,
                     email = $2
                 WHERE id = $3`,
                [
                    username,
                    email,
                    req.user.id,
                ]
            );
        }

        res.json({
            message: "Профиль успешно обновлён",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
module.exports = {
    register,
    login,
    profile,
    uploadAvatar,
    updateProfile,
};