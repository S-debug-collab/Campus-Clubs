import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get("/events");

      const myEvents = res.data.filter((event) =>
        event.registeredUsers?.some(
          (u) => u === user?._id || u?._id === user?._id
        )
      );

      setEvents(myEvents);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ TIME LEFT FUNCTION
  const getTimeLeft = (date) => {
    const today = new Date();
    const eventDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    const diff = eventDate - today;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "🔔 Event Today!";
    if (days === 1) return "⚡ Tomorrow!";
    if (days < 0) return "🚫 Event Completed";

    return `${days} days left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        My Events
      </h1>

      {/* EVENTS GRID */}
      {events.length === 0 ? (
        <p>No registered events</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">

          {events.map((event) => (
            <div
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer flex flex-col bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden h-[460px] hover:scale-105 transition duration-300"
            >

              {/* IMAGE (FIXED SIZE) */}
              {event.poster && (
                <div className="w-full h-56 overflow-hidden">
                  <img
src={event.poster}                   alt={event.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                </div>
              )}

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-1">

                {/* TOP CONTENT */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1">
                    {event.title}
                  </h2>

                  {/* 2 LINE DESCRIPTION */}
                  <p className="text-gray-400 text-sm mb-2 two-line-ellipsis">
                    {event.description}
                  </p>

                  <div className="text-sm text-gray-300 space-y-0.5">
                    <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                    {event.time && <p>⏰ {event.time}</p>}
                    {event.venue && <p>📍 {event.venue}</p>}
                    {event.contacts?.length > 0 && (
                      <p>📞 {event.contacts[0].phone}</p>
                    )}
                  </div>
                </div>

                {/* STATUS (CLOSE TO CONTENT) */}
                <p className="mt-2 text-yellow-400 text-sm font-medium">
                  ⏳ {getTimeLeft(event.date)}
                </p>

              </div>
            </div>
          ))}

        </div>
      )}

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
            {/* CLOSE */}
            <button
              className="absolute top-2 right-3 text-white text-2xl"
              onClick={() => setSelectedEvent(null)}
            >
              ✖
            </button>

            {/* FULL POSTER */}
            {selectedEvent.poster && (
              <img
                src={selectedEvent.poster}
                alt={selectedEvent.title}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}

            {/* TITLE */}
            <h2 className="text-xl mt-4 font-semibold">
              {selectedEvent.title}
            </h2>

            {/* FULL DESCRIPTION */}
            <p className="text-gray-300 mt-2">
              {selectedEvent.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;