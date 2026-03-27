// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [clubName, setClubName] = useState("");
  const [clubDesc, setClubDesc] = useState("");
  const [clubs, setClubs] = useState([]);

  // 1️⃣ Fetch stats
  const fetchStats = async () => {
    try {
      const res = await axios.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats error:", err.response?.data || err.message);
    }
  };

  // 2️⃣ Fetch clubs (CHANGE URL if your backend route is different)
  const fetchClubs = async () => {
    try {
      const res = await axios.get("/clubs"); // <-- if your backend has /api/clubs
      setClubs(res.data);
    } catch (err) {
      console.error("Fetch clubs error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchClubs();
  }, []);

  // 3️⃣ Create club
  const createClub = async () => {
    try {
      await axios.post("/clubs/create", {
        name: clubName,
        description: clubDesc,
      });

      alert("Club created!");

      setClubName("");
      setClubDesc("");

      fetchClubs(); // 🔥 refresh list so admin sees new club instantly
    } catch (err) {
      console.error("Create club error:", err.response?.data || err.message);
      alert("Failed to create club");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard 🛠️</h1>

      {/* Stats */}
      {stats && (
        <div className="mb-6 bg-zinc-800 p-4 rounded">
          <p>Total Users: {stats.totalUsers}</p>
          <p>Total Clubs: {stats.totalClubs}</p>
          <p>Total Events: {stats.totalEvents}</p>
        </div>
      )}

      {/* Create Club */}
      <div className="bg-zinc-800 p-4 rounded mb-6">
        <h2 className="text-xl mb-2">➕ Create Club</h2>

        <input
          className="p-2 text-black w-full mb-2"
          placeholder="Club name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />

        <textarea
          className="p-2 text-black w-full mb-2"
          placeholder="Club description"
          value={clubDesc}
          onChange={(e) => setClubDesc(e.target.value)}
        />

        <button
          onClick={createClub}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Create Club
        </button>
      </div>

      {/* Club List */}
      <div className="bg-zinc-800 p-4 rounded">
        <h2 className="text-xl mb-4">🏫 All Clubs</h2>

        {clubs.length === 0 ? (
          <p className="text-gray-400">No clubs yet</p>
        ) : (
          <ul className="space-y-2">
            {clubs.map((club) => (
              <li
                key={club._id}
                className="bg-zinc-700 p-3 rounded"
              >
                <h3 className="font-semibold">{club.name}</h3>
                <p className="text-gray-300 text-sm">{club.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
