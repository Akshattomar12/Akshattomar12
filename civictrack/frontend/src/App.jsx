import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Report from "./pages/Report.jsx";
import Track from "./pages/Track.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { getToken, setToken } from "./services/api.js";

export default function App() {
  const [authed, setAuthed] = useState(!!getToken());
  const navigate = useNavigate();

  useEffect(() => {
    const handle = (e) => {
      if (e.detail?.token !== undefined) {
        setToken(e.detail.token);
        setAuthed(true);
        navigate("/report");
      }
    };
    window.addEventListener("auth:login", handle);
    return () => window.removeEventListener("auth:login", handle);
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between p-4 bg-white shadow">
        <Link to="/" className="font-semibold">CivicTrack</Link>
        <div className="space-x-3">
          <Link to="/report" className="text-sm">Report</Link>
          <Link to="/track" className="text-sm">Track</Link>
          <Link to="/admin" className="text-sm">Admin</Link>
        </div>
      </nav>
      <main className="p-4">
        <Routes>
          <Route path="/" element={authed ? <Report /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<Report />} />
          <Route path="/track" element={<Track />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
