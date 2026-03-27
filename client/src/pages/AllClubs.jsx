import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

const AllClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get("/clubs"); // GET /api/clubs
        setClubs(res.data);
      } catch (err) {
        console.error("Fetch clubs error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) return <p className="text-white p-6">Loading clubs...</p>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">All Clubs 👥</h1>

      {clubs.length === 0 ? (
        <p className="text-gray-400">No clubs created yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="bg-zinc-800 p-5 rounded-xl hover:bg-zinc-700 transition"
            >
              <h2 className="text-xl font-semibold">{club.name}</h2>
              <p className="text-gray-400 mt-1">
                Lead: {club.createdBy?.name || "Not assigned"}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                {club.description || "No description"}
              </p>

              <button className="mt-4 bg-blue-600 px-4 py-2 rounded">
                View Club
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllClubs;
