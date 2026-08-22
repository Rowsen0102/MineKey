import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!loginEmail || !loginPassword) {
      toast.error("Заполните все поля");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/login",
        {
          email: loginEmail,
          password: loginPassword,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      toast.success("Добро пожаловать!");

      setLoginEmail("");
      setLoginPassword("");

      navigate("/profile");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Ошибка входа"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Вход</h2>

      <input
        type="email"
        placeholder="Email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Пароль"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={login} disabled={loading}>
        {loading ? "Вход..." : "Войти"}
      </button>

      <br />
      <br />

      <Link to="/register">
        Нет аккаунта? Зарегистрироваться
      </Link>
    </div>
  );
}

export default Login;