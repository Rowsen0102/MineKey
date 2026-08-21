import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
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
    <div className="sidebar">
      <h2 className="logo">
        🔐 MineKey
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

        {role === "admin" && (
          <Link
            to="/admin"
            className={location.pathname === "/admin" ? "active" : ""}
          >
            <FaUsersCog />
            <span>Админ</span>
          </Link>
        )}

        <button onClick={logout}>
          <FaSignOutAlt />
          <span>Выход</span>
        </button>

      </nav>
    </div>
  );
}

export default Sidebar;