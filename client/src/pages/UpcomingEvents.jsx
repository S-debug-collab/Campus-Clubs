import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import EventCard from "../Components/EventCard";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null); // full modal
  const [posterImage, setPosterImage] = useState(null); // 🔥 ONLY IMAGE

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const storageKey = `myEvents_${user._id}`;

  // ✅ FETCH EVENTS
  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ LOAD REGISTERED EVENTS
  useEffect(() => {
    if (!user?._id) return;

    const data = JSON.parse(localStorage.getItem(storageKey)) || [];
    setRegisteredEvents(data);
  }, [user?._id]);

  // ✅ FETCH UPCOMING EVENTS
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events");

      const now = new Date();

      const upcoming = res.data.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && event.status !== "completed";
      });

      setEvents(upcoming);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SEARCH FILTER
  const filteredEvents = events.filter((event) => {
    const keyword = (search || "").toLowerCase();

    return (
      (event.title || "").toLowerCase().includes(keyword) ||
      (event.description || "").toLowerCase().includes(keyword) ||
      (event.category || "").toLowerCase().includes(keyword) ||
      event.tags?.some((tag) =>
        (tag || "").toLowerCase().includes(keyword)
      )
    );
  });

  // ✅ REGISTER FUNCTION
  const handleRegister = async (event) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `/events/${event._id}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let registered =
        JSON.parse(localStorage.getItem(storageKey)) || [];

      if (!registered.find((e) => e._id === event._id)) {
        registered.push(event);
        localStorage.setItem(storageKey, JSON.stringify(registered));
        setRegisteredEvents(registered);
      }

      alert("Registered 🎉");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // ✅ HANDLE CLICK (IMPORTANT 🔥)
  const handleClick = (payload) => {
    if (payload?.type === "poster") {
      setPosterImage(payload.data.poster); // 🔥 ONLY IMAGE
    } else {
      setSelectedEvent(payload); // full modal (optional)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-6">

      {/* 🔹 Heading */}
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Upcoming Events
      </h1>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search events (AI, hackathon, ML...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 p-3 mb-8 rounded-lg bg-white/10 border border-gray-700 text-white"
      />

      {/* 📦 EVENTS */}
      {filteredEvents.length === 0 ? (
        <p className="text-gray-400">No matching events found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              handleRegister={handleRegister}
              user={user}
              onClick={handleClick} // 🔥 FIXED
            />
          ))}
        </div>
      )}

      {/* ✅ POSTER ONLY MODAL 🔥 */}
      {posterImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setPosterImage(null)}
        >
          <img
            src={posterImage}
            alt="poster"
            className="max-h-[90vh] rounded-xl"
          />
        </div>
      )}

      {/* ✅ OPTIONAL FULL EVENT MODAL */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-40"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-black p-4 rounded-xl max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-white text-2xl"
              onClick={() => setSelectedEvent(null)}
            >
              ✖
            </button>

            <h2 className="text-xl mb-2">{selectedEvent.title}</h2>
            <p className="text-gray-400">{selectedEvent.description}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default UpcomingEvents;
