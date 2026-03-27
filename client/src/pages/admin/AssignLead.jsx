import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import React from "react";


export default function AssignLead() {
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedClub, setSelectedClub] = useState("");

  useEffect(() => {
    axios.get("/admin/users").then(res => setUsers(res.data));
    axios.get("/clubs").then(res => setClubs(res.data));
  }, []);

  const assignLead = async () => {
    try {
      await axios.post("/admin/assign-lead", {
        userId: selectedUser,
        clubId: selectedClub,
      });
      alert("Club lead assigned 🎯");
    } catch (err) {
      console.error(err);
      alert("Failed to assign lead");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Assign Club Lead</h1>

      <select onChange={(e) => setSelectedUser(e.target.value)} className="p-2 text-black w-full mb-4">
        <option value="">Select User</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedClub(e.target.value)} className="p-2 text-black w-full mb-4">
        <option value="">Select Club</option>
        {clubs.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <button onClick={assignLead} className="bg-green-600 px-4 py-2 rounded">
        Assign Lead
      </button>
    </div>
  );
}
