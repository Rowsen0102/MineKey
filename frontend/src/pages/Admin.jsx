import { useEffect, useState } from "react";
import API from "../api";

import "./Admin.css";

import Stats from "../components/Stats";
import UserCard from "../components/UserCard";
import VpnAdmin from "../components/VpnAdmin";
import EditUserModal from "../components/EditUserModal";

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

  const token = localStorage.getItem("token");

  const auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getProfile = async () => {
    try {
      const res = await API.get("/auth/profile", auth);
      setProfile(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  const getUsers = async () => {
    try {
      const res = await API.get("/admin/users", auth);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const getStats = async () => {
    try {
      const res = await API.get("/admin/stats", auth);

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
      const res = await API.delete(`/admin/users/${id}`, auth);

      setMessage(res.data.message);

      getUsers();
      getStats();
    } catch (err) {
      setMessage(err.response?.data?.message || "Ошибка удаления");
    }
  };

  const blockUser = async (id) => {
    try {
      await API.put(`/admin/block/${id}`, {}, auth);

      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const unblockUser = async (id) => {
    try {
      await API.put(`/admin/unblock/${id}`, {}, auth);

      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const saveUser = async () => {
    try {
      const res = await API.put(
        `/admin/users/${editingUser.id}`,
        {
          username: editUsername,
          email: editEmail,
          role: editRole,
          ...(editPassword && { password: editPassword }),
        },
        auth
      );

      setMessage(res.data.message);

      setEditingUser(null);

      getUsers();
      getStats();
    } catch (err) {
      setMessage(err.response?.data?.message || "Ошибка");
    }
  };

  useEffect(() => {
    getProfile();
    getUsers();
    getStats();
  }, []);

  return (
    <div className="admin-page">
      <h1 className="admin-title">
        👑 Админ-панель
      </h1>

      <Stats stats={stats} />

      <hr />

      <h3>Все пользователи</h3>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Поиск пользователя..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <br />
      <br />

      {users.length === 0 ? (
        <p>Пользователей нет</p>
      ) : (
        <div className="users-grid">
          {users
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
            ))}
        </div>
      )}

      <hr />

      <VpnAdmin />

      {message && <p>{message}</p>}

      {editingUser && (
        <EditUserModal
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
        />
      )}
    </div>
  );
}

export default Admin;