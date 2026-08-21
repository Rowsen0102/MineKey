import { useEffect, useState } from "react";
import axios from "axios";

import Stats from "../components/Stats";
import UserCard from "../components/UserCard";
import VpnAdmin from "../components/VpnAdmin";

function Admin() {
  const [profile, setProfile] = useState(null);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState(null);

  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("");

  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({
    users: 0,
    files: 0,
    vpn: 0,
  });
  const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/auth/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProfile(res.data.user);
  } catch (err) {
    console.log(err);
  }
};

const getUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/admin/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUsers(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.log(err);
  }
};

const getStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/admin/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStats({
      users: Number(res.data.users || 0),
      files: Number(res.data.files || 0),
      vpn: Number(res.data.vpn || 0),
    });
  } catch (err) {
    console.log(err);
  }
};
const deleteUser = async (id) => {
  if (!window.confirm("Удалить пользователя?")) return;

  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(
      `http://localhost:5000/api/admin/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessage(res.data.message);

    getUsers();
    getStats();

  } catch (err) {
    setMessage(
      err.response?.data?.message || "Ошибка удаления"
    );
  }
};
const blockUser = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/admin/block/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    getUsers();

  } catch (err) {
    console.log(err);
  }
};
const unblockUser = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/admin/unblock/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    getUsers();

  } catch (err) {
    console.log(err);
  }
};
const saveUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `http://localhost:5000/api/admin/users/${editingUser.id}`,
      {
        username: editUsername,
        email: editEmail,
        role: editRole,
        ...(editPassword && { password: editPassword }),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessage(res.data.message);

    setEditingUser(null);

    getUsers();
    getStats();

  } catch (err) {
    setMessage(
      err.response?.data?.message || "Ошибка"
    );
  }
};
useEffect(() => {
  getProfile();
  getUsers();
  getStats();
}, []);

  return (
  <div className="container">
    <h1>👑 Админ-панель</h1>

    <Stats stats={stats} />

    <hr />

    <h3>Все пользователи</h3>

    <input
      type="text"
      placeholder="Поиск по имени или Email"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <br />
    <br />

    {users.length === 0 ? (
      <p>Пользователей нет</p>
    ) : (
      users
        .filter(
          (user) =>
            user.username
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            user.email
              .toLowerCase()
              .includes(search.toLowerCase())
        )
        .map((user) => (
          <UserCard
            key={user.id}
            user={user}
            profile={profile}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            editUsername={editUsername}
            setEditUsername={setEditUsername}
            editEmail={editEmail}
            setEditEmail={setEditEmail}
            editPassword={editPassword}
            setEditPassword={setEditPassword}
            editRole={editRole}
            setEditRole={setEditRole}

            saveUser={saveUser}
            deleteUser={deleteUser}
            blockUser={blockUser}
            unblockUser={unblockUser}
          />
        ))
    )}

    <hr />

    <VpnAdmin />

    {message && <p>{message}</p>}
  </div>
);
}

export default Admin;