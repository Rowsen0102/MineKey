import "./Stats.css";

function Stats({ stats }) {
  return (
    <>
      <h2 className="stats-title">📊 Dashboard</h2>

      <div className="stats">

        <div className="stat-card">
          <div className="icon">👥</div>

          <h3>Пользователи</h3>

          <h1>{stats.users}</h1>
        </div>

        <div className="stat-card">
          <div className="icon">📁</div>

          <h3>Файлы</h3>

          <h1>{stats.files}</h1>
        </div>

        <div className="stat-card">
          <div className="icon">🔑</div>

          <h3>VPN</h3>

          <h1>{stats.vpn}</h1>
        </div>

      </div>
    </>
  );
}

export default Stats;