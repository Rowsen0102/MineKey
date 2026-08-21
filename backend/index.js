
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_HOST =", process.env.DB_HOST);
console.log("DB_NAME =", process.env.DB_NAME);
console.log("DB_PASSWORD =", process.env.DB_PASSWORD);
console.log("DB_PORT =", process.env.DB_PORT);
console.log("FILE:", __filename);
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes"); 
const vpnRoutes = require("./routes/vpnRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");

console.log(fileRoutes);

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
app.get("/test", (req, res) => {
    res.send("TEST OK");
});
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/vpn", vpnRoutes);
app.use("/api/admin", adminRoutes);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
async function createTables() {
await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT
CURRENT_TIMESTAMP
    );
`);
await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
`);
await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS avatar TEXT;
`);
await pool.query(`
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    originalname VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS vpn_keys (
    id SERIAL PRIMARY KEY,
    vpn_key TEXT NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id)
);
`);

console.log("Таблица vpn_keys готова ✅");
   console.log("Таблица users готова ✅");
   console.log("Таблица files готова ✅");
}

createTables();

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            status: "MineKey API работает 🚀",
            database: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.listen(5000, () => {
    console.log("Сервер запущен на порту 5000");
});