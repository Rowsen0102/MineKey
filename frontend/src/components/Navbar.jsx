import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">

      <div className="logo">
        🔐 MineKey
      </div>

      <div className="menu">

        <NavLink to="/">
          Главная
        </NavLink>

        {token && (
          <>
            <NavLink to="/profile">
              Профиль
            </NavLink>

            {role === "admin" && (
              <NavLink to="/admin">
                Админ
              </NavLink>
            )}

            <button
              className="logout-btn"
              onClick={logout}
            >
              🚪 Выход
            </button>
          </>
        )}

        {!token && (
          <>
            <NavLink to="/login">
              Вход
            </NavLink>

            <NavLink to="/register">
              Регистрация
            </NavLink>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;