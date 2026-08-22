import { useEffect, useState } from "react";
import API from "../api";

function VpnAdmin() {
  const [vpnList, setVpnList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [vpnKey, setVpnKey] = useState("");
  const [country, setCountry] = useState("");

  const token = localStorage.getItem("token");

  const auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getVpnList = async () => {
    try {
      const res = await API.get("/vpn/all", auth);
      setVpnList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getVpnList();
  }, []);

  const deleteVpn = async (id) => {
    if (!window.confirm("Удалить VPN?")) return;

    try {
      await API.delete(`/vpn/${id}`, auth);
      getVpnList();
    } catch (err) {
      console.log(err);
    }
  };

  const saveVpn = async () => {
    try {
      await API.put(
        `/vpn/${editingId}`,
        {
          vpn_key: vpnKey,
          country,
        },
        auth
      );

      setEditingId(null);
      setVpnKey("");
      setCountry("");

      getVpnList();
    } catch (err) {
      console.log(err);
    }
  };

  const releaseVpn = async (id) => {
    if (!window.confirm("Освободить этот VPN?")) return;

    try {
      await API.put(`/vpn/release/${id}`, {}, auth);
      getVpnList();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>🌍 Все VPN</h3>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Страна</th>
            <th>VPN ключ</th>
            <th>Используется</th>
            <th>Пользователь</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {vpnList.map((vpn) => (
            <tr key={vpn.id}>
              <td>{vpn.id}</td>

              <td>
                {editingId === vpn.id ? (
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                ) : (
                  vpn.country
                )}
              </td>

              <td>
                {editingId === vpn.id ? (
                  <input
                    value={vpnKey}
                    onChange={(e) => setVpnKey(e.target.value)}
                  />
                ) : (
                  vpn.vpn_key
                )}
              </td>

              <td>{vpn.is_used ? "Да" : "Нет"}</td>

              <td>{vpn.username || "-"}</td>

              <td>
                {editingId === vpn.id ? (
                  <button onClick={saveVpn}>💾</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(vpn.id);
                      setVpnKey(vpn.vpn_key);
                      setCountry(vpn.country);
                    }}
                  >
                    ✏️
                  </button>
                )}

                {" "}

                <button onClick={() => deleteVpn(vpn.id)}>
                  🗑️
                </button>

                {" "}

                {vpn.is_used && (
                  <button onClick={() => releaseVpn(vpn.id)}>
                    🔓
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VpnAdmin;