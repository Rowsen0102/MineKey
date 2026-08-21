import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!username || !email || !password) {
      toast.error("Заполните все поля");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://minekey-backend.onrender.com/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      toast.success(res.data.message || "Регистрация успешна!");

      setUsername("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Ошибка регистрации"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <h2>Регистрация</h2>

      <input
        type="text"
        placeholder="Имя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button
        onClick={register}
        disabled={loading}
      >
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </button>

      <br /><br />

      <p>
        Уже есть аккаунт?{" "}
        <Link to="/login">
          Войти
        </Link>
      </p>

    </div>
  );
}

export default Register;