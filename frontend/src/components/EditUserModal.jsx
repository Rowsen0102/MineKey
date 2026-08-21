import "./EditUserModal.css";

function EditUserModal({
  editUsername,
  setEditUsername,
  editEmail,
  setEditEmail,
  editPassword,
  setEditPassword,
  editRole,
  setEditRole,
  saveUser,
  setEditingUser,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>✏️ Редактировать пользователя</h2>

        <input
          type="text"
          value={editUsername}
          onChange={(e) => setEditUsername(e.target.value)}
          placeholder="Имя"
        />

        <input
          type="email"
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          type="password"
          value={editPassword}
          onChange={(e) => setEditPassword(e.target.value)}
          placeholder="Новый пароль (необязательно)"
        />

        <select
          value={editRole}
          onChange={(e) => setEditRole(e.target.value)}
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <div className="modal-buttons">

          <button
            className="green-btn"
            onClick={saveUser}
          >
            💾 Сохранить
          </button>

          <button
            className="delete-btn"
            onClick={() => setEditingUser(null)}
          >
            ❌ Отмена
          </button>

        </div>

      </div>
    </div>
  );
}

export default EditUserModal;