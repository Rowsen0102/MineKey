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

    const addVpn = async () => {

        if (!vpnKey || !country) {
            return alert("Заполните поля");
        }

        try {

            await API.post(
                "/vpn/add",
                {
                    vpn_key: vpnKey,
                    country,
                },
                auth
            );

            setVpnKey("");
            setCountry("");

            getVpnList();

        } catch (err) {

            console.log(err);

        }

    };

    const deleteVpn = async (id) => {

        if (!window.confirm("Удалить VPN?")) return;

        try {

            await API.delete(`/vpn/${id}`, auth);

            getVpnList();

        } catch (err) {

            console.log(err);

        }

    };

    const releaseVpn = async (id) => {

        if (!window.confirm("Освободить VPN?")) return;

        try {

            await API.put(`/vpn/release/${id}`, {}, auth);

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

    return (

        <div style={{ marginTop: 30 }}>

            <h2>🌍 Управление VPN</h2>

            <div
                style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 20,
                }}
            >

                <input
                    placeholder="Страна"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />

                <input
                    style={{ width: 400 }}
                    placeholder="VPN ключ"
                    value={vpnKey}
                    onChange={(e) => setVpnKey(e.target.value)}
                />

                <button onClick={addVpn}>
                    ➕ Добавить VPN
                </button>

            </div>

            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    textAlign: "center",
                    borderCollapse: "collapse",
                }}
            >

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Страна</th>

                        <th>VPN</th>

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

                                {editingId === vpn.id ?

                                    <input
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    />

                                    :

                                    vpn.country

                                }

                            </td>

                            <td>

                                {editingId === vpn.id ?

                                    <input
                                        value={vpnKey}
                                        onChange={(e) => setVpnKey(e.target.value)}
                                    />

                                    :

                                    vpn.vpn_key

                                }

                            </td>

                            <td>

                                {vpn.is_used ? "Да" : "Нет"}

                            </td>

                            <td>

                                {vpn.username || "-"}

                            </td>

                            <td>

                                {editingId === vpn.id ?

                                    <button onClick={saveVpn}>
                                        💾
                                    </button>

                                    :

                                    <button
                                        onClick={() => {

                                            setEditingId(vpn.id);

                                            setVpnKey(vpn.vpn_key);

                                            setCountry(vpn.country);

                                        }}
                                    >
                                        ✏️
                                    </button>

                                }

                                {" "}

                                <button
                                    onClick={() => deleteVpn(vpn.id)}
                                >
                                    🗑️
                                </button>

                                {" "}

                                {vpn.is_used && (

                                    <button
                                        onClick={() => releaseVpn(vpn.id)}
                                    >
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