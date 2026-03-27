import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import EventCard from "../Components/EventCard";

const Dashboard = () => {
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // ✅ NEW

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchClubs();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length) {
      setRecommended(getRecommendedEvents(events));
    }
  }, [events]);

  const fetchClubs = async () => {
    try {
      const res = await axios.get("/clubs");
      setClubs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events");
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (event) => {
    try {
      await axios.post(`/events/${event._id}/register`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SMART RECOMMENDATION (SAFE)
  const getRecommendedEvents = (events) => {
    const now = new Date();

    const userRegisteredEvents = events.filter((event) =>
      event.registeredUsers?.some(
        (u) => u?._id === user?._id || u === user?._id
      )
    );

    const interestTags = new Set();

    userRegisteredEvents.forEach((event) => {
      event.tags?.forEach((tag) => {
        if (tag) interestTags.add(tag);
      });
    });

    return events.filter((event) => {
      const eventDate = new Date(event.date);

      const isNotCompleted = event.status !== "completed";
      const isFuture = eventDate >= now;

      const isNotJoined = !event.registeredUsers?.some(
        (u) => u?._id === user?._id || u === user?._id
      );

      const matchesInterest =
        event.tags?.some((tag) => interestTags.has(tag)) || false;

      return (
        isNotCompleted &&
        isFuture &&
        isNotJoined &&
        matchesInterest
      );
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* NAV */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button onClick={() => navigate("/upcoming-events")} className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-lg">
          Upcoming Events
        </button>
        <button onClick={() => navigate("/my-events")} className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-lg">
          My Events
        </button>
        <button onClick={() => navigate("/notifications")} className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-lg">
          Notifications
        </button>
        <button onClick={() => navigate("/suggest-event")} className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded">
          Suggest Event
        </button>
        <button onClick={() => navigate("/suggestions")} className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded">
          View Suggestions
        </button>
      </div>

      {/* CLUBS */}
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Explore Clubs 🚀
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {clubs.map((club) => (
          <div
            key={club._id}
            className="bg-white/5 backdrop-blur-lg p-5 rounded-2xl border border-white/10 hover:scale-105 transition"
          >
            <div className="h-40 mb-4 overflow-hidden rounded-xl">
              {club.logo ? (
                <img
                  src={`http://localhost:5000${club.logo}`}
                  className="w-full h-full object-cover"
                  alt={club.name}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No Logo
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold">{club.name}</h2>

            <p className="text-gray-400 text-sm mt-2 line-clamp-3">
              {club.description}
            </p>

            <button
              onClick={() => navigate(`/club/${club._id}`)}
              className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-2 rounded-lg"
            >
              Visit Club
            </button>
          </div>
        ))}
      </div>

      {/* RECOMMENDED */}
      {recommended.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">🔥 Recommended</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                handleRegister={handleRegister}
                user={user}
                onClick={setSelectedEvent} // ✅ modal trigger
              />
            ))}
          </div>
        </div>
      )}

      {/* ✅ MODAL */}
    {/* ✅ MODAL */}
{selectedEvent && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
    onClick={() => setSelectedEvent(null)}
  >
    <div
      className="relative bg-black p-4 rounded-xl max-w-3xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-3 text-white text-2xl"
        onClick={() => setSelectedEvent(null)}
      >
        ✖
      </button>

      {selectedEvent.poster && (
        <img
          src={`http://localhost:5000${selectedEvent.poster}`}
          alt={selectedEvent.title}
          className="w-full max-h-[80vh] object-contain rounded-lg"
        />
      )}

      <h2 className="text-xl mt-4 text-white">
        {selectedEvent.title}
      </h2>

      <p className="text-gray-300 mt-2">
        {selectedEvent.description}
      </p>
    </div>
  </div>
)}
    </div>
  );
};

export default Dashboard;