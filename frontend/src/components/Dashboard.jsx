import "./Dashboard.css";

function Dashboard({ profile, stats }) {
  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div className="dashboard-user">

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
            <h1>Добро пожаловать 👋</h1>
            <h2>{profile.username}</h2>

            <p>{profile.email}</p>

            <span className="role-badge">
              {profile.role.toUpperCase()}
            </span>
          </div>

        </div>
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card blue">
          <div className="emoji">📁</div>

          <h3>Файлы</h3>

          <span>{stats.files}</span>
        </div>

        <div className="dashboard-card green">
          <div className="emoji">🔑</div>

          <h3>VPN</h3>

          <span>{stats.vpn}</span>
        </div>

        <div className="dashboard-card orange">
          <div className="emoji">📅</div>

          <h3>Регистрация</h3>

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