import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import React from "react";


export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/admin/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <div className="space-y-3">
        {users.map(user => (
          <div key={user._id} className="bg-zinc-800 p-4 rounded">
            <p>{user.name} – {user.email}</p>
            <p className="text-sm text-gray-400">Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
