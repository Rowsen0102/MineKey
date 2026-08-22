import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../api";
import Dashboard from "../components/Dashboard";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [vpn, setVpn] = useState(null);
  const [isVpnLoading, setIsVpnLoading] = useState(false);

  const [stats, setStats] = useState({
    files: 0,
    vpn: 0,
  });

  const [avatar, setAvatar] = useState(null);

  const [editProfileUsername, setEditProfileUsername] = useState("");
  const [editProfileEmail, setEditProfileEmail] = useState("");
  const [editProfilePassword, setEditProfilePassword] = useState("");

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data.user);

      if (res.data.user.vpn) {
        setVpn(res.data.user.vpn);
      }

      setEditProfileUsername(res.data.user.username);
      setEditProfileEmail(res.data.user.email);
    } catch (err) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const loadVpn = async () => {
    try {
      const res = await API.get("/vpn/get");
      setVpn(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Не удалось загрузить VPN"
      );
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/auth/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const vpnCount = Number(res.data.vpn || 0);

      setStats({
        files: Number(res.data.files || 0),
        vpn: vpnCount,
      });

      // Если VPN уже был выдан, загружаем его ключ без выдачи нового.
      if (vpnCount > 0) {
        await loadVpn();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getVpn = async () => {
    setIsVpnLoading(true);

    try {
      const res = await API.get("/vpn/get");

      setVpn(res.data);
      setStats((currentStats) => ({
        ...currentStats,
        vpn: 1,
      }));

      toast.success("VPN-ключ получен");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Не удалось получить VPN"
      );
    } finally {
      setIsVpnLoading(false);
    }
  };

  const copyVpnKey = async () => {
    if (!vpn?.vpn_key) {
      return;
    }

    try {
      await navigator.clipboard.writeText(vpn.vpn_key);
      toast.success("VPN-ключ скопирован");
    } catch (err) {
      toast.error("Не удалось скопировать ключ");
    }
  };

  const uploadAvatar = async () => {
    if (!avatar) {
      toast.error("Выберите изображение");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("avatar", avatar);

      await API.post("/auth/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Аватар обновлён");
      loadProfile();
    } catch (err) {
      toast.error("Ошибка загрузки");
    }
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        "/auth/profile",
        {
          username: editProfileUsername,
          email: editProfileEmail,
          password: editProfilePassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Профиль обновлён");
      setEditProfilePassword("");
      loadProfile();
    } catch (err) {
      toast.error("Ошибка сохранения");
    }
  };

  const logout = () => {
    localStorage.clear();
    toast.success("До встречи!");
    navigate("/login");
  };

  if (!profile) {
    return <div className="container">Загрузка...</div>;
  }

  const avatarUrl = profile.avatar
    ? `${
        import.meta.env.MODE === "development"
          ? "http://localhost:5000"
          : "https://minekey-backend.onrender.com"
      }/uploads/${profile.avatar}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="container profile-page">
      <Dashboard profile={profile} stats={stats} />

      <div className="profile-card">
        <div className="profile-header">
          <img className="profile-avatar" src={avatarUrl} alt="avatar" />

          <div className="profile-info">
            <h2>{profile.username}</h2>

            <p>{profile.email}</p>

            <p>
              <b>Роль:</b> {profile.role}
            </p>

            <p>
              <b>Дата регистрации:</b>{" "}
              {profile.created_at
                ? new Date(profile.created_at).toLocaleString("ru-RU")
                : "-"}
            </p>
          </div>
        </div>

        <div className="profile-upload">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />

          <button className="primary-btn" onClick={uploadAvatar}>
            📷 Загрузить аватар
          </button>
        </div>

        <section className="vpn-card">
          <div className="vpn-card-header">
            <div>
              <p className="vpn-card-label">Защищённое подключение</p>
              <h3>🔐 Мой VPN</h3>
            </div>

            <span className={`vpn-status ${vpn ? "vpn-status-active" : ""}`}>
              {vpn ? "Активен" : "Не получен"}
            </span>
          </div>

          {vpn ? (
            <>
              <div className="vpn-country">
                <span>Страна</span>
                <strong>{vpn.country || "Не указана"}</strong>
              </div>

              <p className="vpn-key-label">Ключ подключения</p>

              <code className="vpn-key">{vpn.vpn_key}</code>

              <button className="vpn-copy-btn" onClick={copyVpnKey}>
                📋 Скопировать ключ
              </button>
            </>
          ) : (
            <div className="vpn-empty-state">
              <p>
                У вас пока нет VPN-ключа. Получите свободный ключ в один клик.
              </p>

              <button
                className="primary-btn"
                onClick={getVpn}
                disabled={isVpnLoading}
              >
                {isVpnLoading ? "Получаем VPN..." : "🔑 Получить VPN"}
              </button>
            </div>
          )}
        </section>

        <div className="profile-form">
          <h3>Редактировать профиль</h3>

          <input
            type="text"
            placeholder="Имя"
            value={editProfileUsername}
            onChange={(e) => setEditProfileUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={editProfileEmail}
            onChange={(e) => setEditProfileEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Новый пароль"
            value={editProfilePassword}
            onChange={(e) => setEditProfilePassword(e.target.value)}
          />

          <div className="profile-buttons">
            <button className="primary-btn" onClick={saveProfile}>
              💾 Сохранить
            </button>

            <button className="logout-btn-profile" onClick={logout}>
              🚪 Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;