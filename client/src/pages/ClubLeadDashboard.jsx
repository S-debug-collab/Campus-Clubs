import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import EventCard from "../Components/EventCard";

export default function ClubLeadDashboard() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Storage key for registered events (students)
  const storageKey = `myEvents_${user._id}`;

  // Registered events state
  const [registered, setRegistered] = useState(
    JSON.parse(localStorage.getItem(storageKey)) || []
  );

  // 🔹 FETCH ON MOUNT
  useEffect(() => {
    fetchMyEvents();
    fetchClubs();
    fetchAllEvents();
  }, []);

  // 🔹 SYNC CLUB LEAD EVENTS TO LOCALSTORAGE FOR NOTIFICATIONS
  useEffect(() => {
    if (user.role === "clubLead" && events.length > 0) {
      localStorage.setItem(`clubEvents_${user._id}`, JSON.stringify(events));
    }
  }, [events, user._id, user.role]);

  // 🔹 UPDATE RECOMMENDED EVENTS
  useEffect(() => {
    if (allEvents.length) {
      const rec = getRecommendedEvents(allEvents, registered, events);
      setRecommended(rec);
    }
  }, [allEvents, registered, events]);

  // 🔹 FETCH FUNCTIONS
  const fetchMyEvents = async () => {
    try {
      const res = await axios.get("/events/my-events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClubs = async () => {
    try {
      const res = await axios.get("/clubs");
      setClubs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const res = await axios.get("/events");
      setAllEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 REGISTER FUNCTION
  const handleRegister = async (event) => {
    try {
      // Backend call
      await axios.post(
        `/events/${event._id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setRegistered((prev) => {
        if (!prev.find((e) => e._id === event._id)) {
          const updated = [...prev, event];
          localStorage.setItem(storageKey, JSON.stringify(updated));
          alert(`You registered for "${event.title}" 🎉`);
          return updated;
        }
        return prev;
      });

      // Update allEvents to include this user
      setAllEvents((prev) =>
        prev.map((e) =>
          e._id === event._id
            ? { ...e, registeredUsers: [...(e.registeredUsers || []), user._id] }
            : e
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // 🔹 RECOMMENDATION LOGIC
  const getUserTags = (registeredEvents) => {
    let tags = [];
    registeredEvents.forEach((event) => {
      if (event.tags) tags.push(...event.tags);
    });
    return [...new Set(tags)];
  };

  const getRecommendedEvents = (allEvents, registeredEvents, myCreatedEvents = []) => {
    const userTags = getUserTags(registeredEvents);
    const now = new Date();

    return allEvents
      .filter((event) => {
        const eventDate = new Date(event.date);

        // exclude completed events
        if (event.status === "completed" || eventDate < now) return false;

        // exclude already registered
        if (registeredEvents.some((e) => e._id === event._id)) return false;

        // exclude events created by this user
        if (myCreatedEvents.some((e) => e._id === event._id)) return false;

        // match tags if user has any
        if (userTags.length === 0) return true;
        return event.tags?.some((tag) => userTags.includes(tag));
      })
      .slice(0, 5); // optional: limit 5 recommendations
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* NAV BUTTONS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => navigate("/create-event")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded"
        >
          + Create Event
        </button>

        <button
          onClick={() => navigate("/notifications")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded"
        >
          🔔 Notifications
        </button>

        <button
          onClick={() => navigate("/suggestions")}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          🗳️ Suggestions
        </button>
      </div>

      {/* CLUBS */}
      <h2 className="text-2xl font-bold mb-4">Explore Clubs 🚀</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {clubs.map((club) => (
          <div
            key={club._id}
            className="bg-zinc-800 p-5 rounded-xl shadow hover:scale-105 transition flex flex-col justify-between h-full"
          >
            <div className="h-40 w-full overflow-hidden rounded-lg mb-4 bg-zinc-700 flex items-center justify-center">
              {club.logo ? (
                <img
src={club.logo} 
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Logo</span>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold">{club.name}</h2>
                <p className="text-gray-400 mt-2 line-clamp-3">{club.description}</p>
              </div>
              <button
                onClick={() => navigate(`/club/${club._id}`)}
                className="mt-4 px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 w-full"
              >
                Visit Club
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RECOMMENDED EVENTS */}
      {recommended.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">🔥 Recommended Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                handleRegister={handleRegister}
                registeredEvents={registered}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}