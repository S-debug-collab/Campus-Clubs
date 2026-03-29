import React, { useState } from "react";
import axios from "../utils/axios";

export default function SuggestEvent() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return; // 🚨 prevent double click

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    await axios.post(
      "/suggestions",
      { topic, description },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Suggestion submitted 🎉");
    setTopic("");
    setDescription("");

  } catch (err) {
    console.error(err);
    alert("Failed to submit");
  } finally {
    setLoading(false); // 🔥 re-enable
  }
};

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Suggest an Event 💡
      </h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Event Topic (e.g. AI Workshop)"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why this event?"
          className="w-full p-2 bg-zinc-900 border border-zinc-700"
        />

       <button
  type="submit"
  disabled={loading}
  className={`px-6 py-2 rounded ${
    loading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {loading ? "Submitting..." : "Submit Suggestion"}
</button>

      </form>
    </div>
  );
}
