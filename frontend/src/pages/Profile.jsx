import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../api";

import Dashboard from "../components/Dashboard";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

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

      setEditProfileUsername(res.data.user.username);
      setEditProfileEmail(res.data.user.email);
    } catch (err) {
      localStorage.clear();
      navigate("/login");
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

      setStats({
        files: Number(res.data.files || 0),
        vpn: Number(res.data.vpn || 0),
      });
    } catch (err) {
      console.log(err);
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
    return (
      <div className="container">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="container profile-page">

      <Dashboard
        profile={profile}
        stats={stats}
      />

      <div className="profile-card">

        <div className="profile-header">

          <img
            className="profile-avatar"
            src={
              profile.avatar
                ? `http://localhost:5000/uploads/${profile.avatar}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
          />

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

          <button
            className="primary-btn"
            onClick={uploadAvatar}
          >
            📷 Загрузить аватар
          </button>

        </div>

        <div className="profile-form">

          <h3>Редактировать профиль</h3>

          <input
            type="text"
            placeholder="Имя"
            value={editProfileUsername}
            onChange={(e) =>
              setEditProfileUsername(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={editProfileEmail}
            onChange={(e) =>
              setEditProfileEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Новый пароль"
            value={editProfilePassword}
            onChange={(e) =>
              setEditProfilePassword(e.target.value)
            }
          />

          <div className="profile-buttons">

            <button
              className="primary-btn"
              onClick={saveProfile}
            >
              💾 Сохранить
            </button>

            <button
              className="logout-btn-profile"
              onClick={logout}
            >
              🚪 Выйти
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;