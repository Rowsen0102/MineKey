require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../database/db");

// ================================
// Получить всех пользователей
// ================================

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        username,
        email,
        role,
        avatar,
        is_blocked,
        created_at
      FROM users
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("GET USERS ERROR:", err);

    res.status(500).json({
      message: "Ошибка получения пользователей",
    });
  }
};

// ================================
// Удалить пользователя
// ================================

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (Number(req.user.id) === Number(id)) {
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
      message: "Пользователь успешно удалён",
    });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);

    res.status(500).json({
      message: "Ошибка удаления пользователя",
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

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `UPDATE users
         SET username=$1,
             email=$2,
             role=$3,
             password=$4
         WHERE id=$5`,
        [
          username,
          email,
          role,
          hashedPassword,
          id,
        ]
      );
    } else {
      await pool.query(
        `UPDATE users
         SET username=$1,
             email=$2,
             role=$3
         WHERE id=$4`,
        [
          username,
          email,
          role,
          id,
        ]
      );
    }

    const user = await pool.query(
      `SELECT
          id,
          username,
          email,
          role,
          avatar,
          is_blocked
       FROM users
       WHERE id = $1`,
      [id]
    );

    res.json({
      message: "Пользователь успешно обновлён",
      user: user.rows[0],
    });

  } catch (err) {
    console.error("UPDATE USER ERROR:", err);

    res.status(500).json({
      message: "Ошибка обновления пользователя",
    });
  }
};

// ================================
// Заблокировать
// ================================

const blockUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (Number(req.user.id) === Number(id)) {
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
    console.error("BLOCK USER ERROR:", err);

    res.status(500).json({
      message: "Ошибка блокировки",
    });
  }
};

// ================================
// Разблокировать
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
    console.error("UNBLOCK USER ERROR:", err);

    res.status(500).json({
      message: "Ошибка разблокировки",
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
    console.error("ADMIN STATS ERROR:", err);

    res.status(500).json({
      message: "Ошибка получения статистики",
    });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  getStats,
};