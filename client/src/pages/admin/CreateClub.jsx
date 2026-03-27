import { useState } from "react";
import axios from "../../utils/axios";
import React from "react";

export default function CreateClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/clubs", { name, description });
      alert("Club created successfully 🎉");
      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Failed to create club");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Create Club</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          className="w-full p-2 rounded text-black"
          placeholder="Club Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-2 rounded text-black"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-blue-600 px-4 py-2 rounded">
          Create Club
        </button>
      </form>
    </div>
  );
}
