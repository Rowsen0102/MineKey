import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home">

      <div className="hero">

        <h1>🔐 MineKey</h1>

        <p>
          Современная система управления пользователями,
          файлами и VPN-ключами.
        </p>

        <div className="buttons">

          {!token ? (
            <>
              <Link to="/login" className="btn">
                🔑 Войти
              </Link>

              <Link to="/register" className="btn btn-outline">
                📝 Регистрация
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn">
                👤 Профиль
              </Link>

              <Link to="/admin" className="btn btn-outline">
                👑 Админ-панель
              </Link>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default Home;