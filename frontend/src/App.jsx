import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
  <>
    <Navbar />

    <Routes>

      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/profile" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          token ? (
            <Navigate to="/profile" replace />
          ) : (
            <Register />
          )
        }
      />

      <Route
        path="/profile"
        element={
          token ? (
            <Profile />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
  path="/admin"
  element={
    token && role === "admin" ? (
      <Admin />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  </>
);
}

export default App;