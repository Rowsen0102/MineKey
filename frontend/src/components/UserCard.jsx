function UserCard({
  user,
  profile,
  editingUser,
  setEditingUser,
  editUsername,
  setEditUsername,
  editEmail,
  setEditEmail,
  editPassword,
  setEditPassword,
  editRole,
  setEditRole,
  saveUser,
  deleteUser,
  blockUser,
  unblockUser,
}) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <p><b>ID:</b> {user.id}</p>
      <p><b>Имя:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Роль:</b> {user.role}</p>

      <p>
        <b>Статус:</b>{" "}
        {user.is_blocked ? "🔒 Заблокирован" : "🟢 Активен"}
      </p>

      {profile.id !== user.id && (
        <>
          <button
            onClick={() => {
              setEditingUser(user);
              setEditUsername(user.username);
              setEditEmail(user.email);
              setEditPassword("");
              setEditRole(user.role);
            }}
          >
            ✏️ Редактировать
          </button>

          {" "}

          <button onClick={() => deleteUser(user.id)}>
            🗑 Удалить
          </button>

          {" "}

          {user.is_blocked ? (
            <button onClick={() => unblockUser(user.id)}>
              🔓 Разблокировать
            </button>
          ) : (
            <button onClick={() => blockUser(user.id)}>
              🔒 Заблокировать
            </button>
          )}

          {editingUser?.id === user.id && (
            <div style={{ marginTop: "10px" }}>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Имя"
              />

              <br /><br />

              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email"
              />

              <br /><br />

              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Новый пароль (необязательно)"
              />

              <br /><br />

              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>

              <br /><br />

              <button onClick={saveUser}>
                💾 Сохранить
              </button>

              {" "}

              <button onClick={() => setEditingUser(null)}>
                ❌ Отмена
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserCard;