import "./Dashboard.css";

function Dashboard({ profile, stats }) {
  return (
    <div className="dashboard">

      <div className="welcome-card">
        <img
          src={
            profile.avatar
              ? `http://localhost:5000/uploads/${profile.avatar}`
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="avatar"
          className="dashboard-avatar"
        />

        <div>
          <h2>👋 Добро пожаловать, {profile.username}</h2>
          <p>{profile.email}</p>
          <p>Роль: <b>{profile.role}</b></p>
        </div>
      </div>

      <div className="dashboard-stats">

        <div className="dashboard-box">
          <h3>📁 Файлы</h3>
          <span>{stats.files}</span>
        </div>

        <div className="dashboard-box">
          <h3>🔑 VPN</h3>
          <span>{stats.vpn}</span>
        </div>

        <div className="dashboard-box">
          <h3>📅 Регистрация</h3>
          <span>
            {profile.created_at
              ? new Date(profile.created_at).toLocaleDateString("ru-RU")
              : "-"}
          </span>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;