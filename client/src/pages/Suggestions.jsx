import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);



  useEffect(() => {
    fetchSuggestions();
  }, []);

const fetchSuggestions = async () => {
  const res = await axios.get("/suggestions", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // 🔥 SORT BY VOTES (DESC)
  const sorted = res.data.sort(
    (a, b) => b.votes.length - a.votes.length
  );

  setSuggestions(sorted);
};
const user = JSON.parse(localStorage.getItem("user"));
const userId = user?._id;
const token = localStorage.getItem("token");
const handleVote = async (id) => {
  try {
    const res = await axios.post(`/suggestions/${id}/vote`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setSuggestions((prev) =>
      prev.map((s) =>
        s._id === id
          ? {
              ...s,
              votes: res.data.voted
                ? [...s.votes, userId]
                : s.votes.filter((v) => v !== userId)
            }
          : s
      )
    );

  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="min-h-screen
    
    
    bg-black text-white p-8">

      <h1 className="text-3xl font-bold mb-6">
        Event Suggestions 💡
      </h1>

      <div className="space-y-6">

        {suggestions.map((s) => (

          <div
            key={s._id}
            className="bg-zinc-900 p-5 rounded-xl"
          >
               {/* 🔥 ADD HERE */}
    {s.votes.length >= 3 && (
      <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">
        🔥 Trending
      </span>
    )}

            <h2 className="text-xl font-semibold">
              {s.topic}
            </h2>

            <p className="text-gray-400 mt-2">
              {s.description}
            </p>

           <div className="flex justify-between items-center mt-4">

  <span className="text-sm text-gray-400">
    👍 {s.votes.length} votes
  </span>

  <button
    onClick={() => handleVote(s._id)}
    className={`px-4 py-1 rounded ${
      s.votes.includes(userId)
        ? "bg-red-600 hover:bg-red-700"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {s.votes.includes(userId) ? "Remove Vote" : "Vote 👍"}
  </button>

</div>

          </div>

        ))}

      </div>
    </div>
  );
}