import "./UserCard.css";
import EditUserModal from "./EditUserModal";

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
    <div className="user-card">
      <div className="user-header">
        <img
          src={
            user.avatar
              ? `http://localhost:5000/uploads/${user.avatar}`
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="avatar"
          className="user-avatar"
        />

        <div className="user-info">
          <h3>{user.username}</h3>
          <p>{user.email}</p>

          <div className="badges">
            <span className={`role ${user.role}`}>
              {user.role}
            </span>

            <span
              className={
                user.is_blocked
                  ? "status blocked"
                  : "status active"
              }
            >
              {user.is_blocked
                ? "🔒 Заблокирован"
                : "🟢 Активен"}
            </span>
          </div>
        </div>
      </div>

      {profile.id !== user.id && (
        <>
          <div className="actions">
            <button
              className="edit-btn"
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

            <button
              className="delete-btn"
              onClick={() => deleteUser(user.id)}
            >
              🗑 Удалить
            </button>

            {user.is_blocked ? (
              <button
                className="green-btn"
                onClick={() => unblockUser(user.id)}
              >
                🔓 Разблокировать
              </button>
            ) : (
              <button
                className="orange-btn"
                onClick={() => blockUser(user.id)}
              >
                🔒 Заблокировать
              </button>
            )}
          </div>

          {editingUser?.id === user.id && (
            <EditUserModal
              editUsername={editUsername}
              setEditUsername={setEditUsername}
              editEmail={editEmail}
              setEditEmail={setEditEmail}
              editPassword={editPassword}
              setEditPassword={setEditPassword}
              editRole={editRole}
              setEditRole={setEditRole}
              saveUser={saveUser}
              setEditingUser={setEditingUser}
            />
          )}
        </>
      )}
    </div>
  );
}

export default UserCard;