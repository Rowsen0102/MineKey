import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaFolder,
  FaUsersCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-top">

        <h2 className="logo">
          🔐 <span>MineKey</span>
        </h2>

        <nav>

          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            <FaHome />
            <span>Главная</span>
          </Link>

          <Link
            to="/profile"
            className={location.pathname === "/profile" ? "active" : ""}
          >
            <FaUser />
            <span>Профиль</span>
          </Link>

          <Link
            to="/files"
            className={location.pathname === "/files" ? "active" : ""}
          >
            <FaFolder />
            <span>Файлы</span>
          </Link>

          {role === "admin" && (
            <Link
              to="/admin"
              className={location.pathname === "/admin" ? "active" : ""}
            >
              <FaUsersCog />
              <span>Админ</span>
            </Link>
          )}

        </nav>

      </div>

      <button
        className="logout-btn"
        onClick={logout}
      >
        <FaSignOutAlt />
        <span>Выход</span>
      </button>

    </aside>
  );
}

export default Sidebar;