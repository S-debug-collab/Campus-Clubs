import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [clubs, setClubs] = useState([]);

  const [clubName, setClubName] = useState("");
  const [clubDesc, setClubDesc] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [editingClubId, setEditingClubId] = useState(null);

  // ✅ NEW STATE
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    fetchStats();
    fetchClubs();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get("/admin/stats");
    setStats(res.data);
  };

  const fetchClubs = async () => {
    const res = await axios.get("/clubs");
    setClubs(res.data);
  };

  // ✅ PROMOTE ADMIN
  const promoteToAdmin = async () => {
    if (!searchEmail || !searchEmail.includes("@")) {
      return alert("Enter valid email");
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "/admin/make-admin",
        { email: searchEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User promoted to Admin 🎉");
      setSearchEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ✅ CREATE / UPDATE CLUB
  const submitClub = async () => {
    if (clubDesc.length < 100) {
      return alert("Description must be at least 100 characters");
    }

    if (!editingClubId && !logoFile) {
      return alert("Logo is required");
    }

    try {
      const token = localStorage.getItem("token");

      if (editingClubId) {
        await axios.patch(
          `/clubs/update/${editingClubId}`,
          {
            name: clubName,
            description: clubDesc,
            leadEmail,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Club updated!");
      } else {
        const formData = new FormData();
        formData.append("name", clubName);
        formData.append("description", clubDesc);
        formData.append("leadEmail", leadEmail);
        if (logoFile) formData.append("logo", logoFile);

        await axios.post("/clubs/create", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Club created!");
      }

      setClubName("");
      setClubDesc("");
      setLeadEmail("");
      setLogoFile(null);
      setEditingClubId(null);

      fetchClubs();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const deleteClub = async (id) => {
    if (!window.confirm("Delete club?")) return;

    const token = localStorage.getItem("token");

    await axios.delete(`/clubs/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchClubs();
  };

  const editClub = (club) => {
    setEditingClubId(club._id);
    setClubName(club.name);
    setClubDesc(club.description);
    setLeadEmail(club.lead?.email || "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-8">

      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Admin Dashboard 🛠️
      </h1>

      {/* STATS */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 p-6 rounded-2xl">
            <p>Users</p>
            <h2 className="text-3xl">{stats.users}</h2>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl">
            <p>Clubs</p>
            <h2 className="text-3xl">{stats.clubs}</h2>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl">
            <p>Events</p>
            <h2 className="text-3xl">{stats.events}</h2>
          </div>
        </div>
      )}

      {/* CREATE CLUB */}
      <div className="bg-white/5 p-6 rounded-2xl mb-10">
        <h2 className="text-xl mb-4">
          {editingClubId ? "Update Club" : "Create Club"}
        </h2>

        <input
          className="w-full p-3 mb-3 bg-black/40 rounded"
          placeholder="Club name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />

        <textarea
          className="w-full p-3 mb-3 bg-black/40 rounded"
          placeholder="Description"
          value={clubDesc}
          onChange={(e) => setClubDesc(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 bg-black/40 rounded"
          placeholder="Lead Email"
          value={leadEmail}
          onChange={(e) => setLeadEmail(e.target.value)}
        />

        <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} />

        <button
          onClick={submitClub}
          className="mt-4 bg-purple-600 px-6 py-2 rounded"
        >
          {editingClubId ? "Update" : "Create"}
        </button>
      </div>

      {/* 👑 PROMOTE ADMIN */}
      <div className="bg-white/5 p-6 rounded-2xl mb-10">
        <h2 className="text-xl mb-4">Promote User to Admin 👑</h2>

        <div className="flex gap-3">
          <input
            type="email"
            placeholder="Enter user email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="flex-1 p-3 bg-black/40 rounded"
          />

          <button
            onClick={promoteToAdmin}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Promote
          </button>
        </div>
      </div>

      {/* CLUB LIST */}
     <div className="space-y-4">
  {clubs.map((club) => (
    <div
      key={club._id}
      className="bg-white/5 backdrop-blur-lg p-5 rounded-2xl border border-white/10 flex justify-between items-start gap-6"
    >

      {/* LEFT SIDE */}
      <div className="flex gap-4 max-w-[75%]">

        {club.logo && (
          <img
            src={`http://localhost:5000${club.logo}`}
            className="w-16 h-16 rounded-xl object-cover"
          />
        )}

        <div>
          <h3 className="text-xl font-semibold">{club.name}</h3>

          {/* ✅ LIMIT HEIGHT INSTEAD OF CLAMP */}
          <p className="text-gray-400 text-sm mt-1 max-h-[80px] overflow-hidden">
            {club.description}
          </p>
        </div>

      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="flex flex-col gap-3 min-w-[120px]">

        <button
          onClick={() => editClub(club)}
          className="bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg font-medium w-full"
        >
          Edit
        </button>

        <button
          onClick={() => deleteClub(club._id)}
          className="bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium w-full"
        >
          Delete
        </button>

      </div>

    </div>
  ))}
</div>

    </div>
  );
};

export default AdminDashboard;