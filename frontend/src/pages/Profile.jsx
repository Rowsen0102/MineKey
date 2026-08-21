import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
  files: 0,
  vpn: 0,
});
  const [message, setMessage] = useState("");

  const [avatar, setAvatar] = useState(null);

  const [editProfileUsername, setEditProfileUsername] = useState("");
  const [editProfileEmail, setEditProfileEmail] = useState("");
  const [editProfilePassword, setEditProfilePassword] = useState("");

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        "https://minekey-backend.onrender.com/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(res.data.user);
      setEditProfileUsername(res.data.user.username);
      setEditProfileEmail(res.data.user.email);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  const getStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://minekey-backend.onrender.com/api/admin/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStats({
      files: Number(res.data.files || 0),
      vpn: Number(res.data.vpn || 0),
    });
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
  getProfile();
  getStats();
}, []);

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  toast.success("Вы вышли из аккаунта 👋");

  setTimeout(() => {
    navigate("/login");
  }, 700);
};

  if (!profile) {
    return <div className="container">Загрузка...</div>;
  }
const uploadAvatar = async () => {
  if (!avatar) {
    toast.error("Выберите изображение");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", avatar);

    await axios.post(
      "https://minekey-backend.onrender.com/api/auth/avatar",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Аватар успешно загружен");

    getProfile();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Ошибка загрузки"
    );
  }
};
const saveProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      "https://minekey-backend.onrender.com/api/auth/profile",
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

    getProfile();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Ошибка сохранения"
    );
  }
};

  return (
    <div className="container">
        <Dashboard
  profile={profile}
  stats={stats}
/>
      <h2>Профиль</h2>

      <p><b>Имя:</b> {profile.username}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Роль:</b> {profile.role}</p>

      <p>
        <b>Дата регистрации:</b>{" "}
        {profile.created_at
          ? new Date(profile.created_at).toLocaleString("ru-RU")
          : "-"}
      </p>

      {profile.avatar && (
        <img
          src={`https://minekey-backend.onrender.com/uploads/${profile.avatar}`}
          alt="avatar"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            marginBottom: "15px",
          }}
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatar(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadAvatar}>
  Загрузить аватар
</button>

      <hr />

      <h3>Редактировать профиль</h3>

      <input
        type="text"
        value={editProfileUsername}
        onChange={(e) => setEditProfileUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        value={editProfileEmail}
        onChange={(e) => setEditProfileEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Новый пароль"
        value={editProfilePassword}
        onChange={(e) => setEditProfilePassword(e.target.value)}
      />

      <br /><br />

      <button onClick={saveProfile}>
  Сохранить профиль
</button>
      <br /><br />

      <button onClick={logout}>
        Выйти
      </button>

    </div>
  );
}

export default Profile;