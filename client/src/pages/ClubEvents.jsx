import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useParams } from "react-router-dom";

export default function ClubEvents() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ FETCH CLUB
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axios.get("/clubs");
        setClub(res.data.find((c) => c._id === id) || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClub();
  }, [id]);

  // ✅ FETCH EVENTS (ONLY ONE SOURCE)
  const loadEvents = async () => {
    try {
      const res = await axios.get(`/events?club=${id}`);

      // 🔥 REMOVE DUPLICATES SAFELY
      const uniqueEvents = Array.from(
        new Map(res.data.map((e) => [e._id, e])).values()
      );

      setEvents(uniqueEvents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [id]);

  // ✅ REGISTER
  const handleRegister = async (event) => {
    try {
      await axios.post(`/events/${event._id}/register`);
      alert(`You registered for "${event.title}" 🎉`);

      loadEvents(); // ✅ refresh correctly
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ✅ DELETE
  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      alert("Event deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  if (!club)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-2 text-center">{club.name}</h1>
      <p className="text-gray-400 mb-10 text-center">{club.description}</p>

      {events.length === 0 ? (
        <p className="text-gray-400 text-center">No events</p>
      ) : (
        <div className="space-y-12 max-w-7xl mx-auto">
          {events.map((event) => {
            const isRegistered = event.registeredUsers?.some(
              (u) => u?._id === user._id || u === user._id
            );

            const isCompleted = new Date(event.date) < new Date();

            const isCreator = event.createdBy?._id
              ? event.createdBy._id === user._id
              : String(event.createdBy) === String(user._id);

            return (
              <div
                key={event._id}
                className="flex flex-col md:flex-row bg-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition duration-300"
              >
                {/* IMAGE */}
                {event.poster && (
                  <img
                    src={event.poster}
                    alt="event"
                    className="md:w-1/2 h-[350px] object-cover"
                  />
                )}

                {/* CONTENT */}
                <div className="md:w-1/2 p-10 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold mb-3">
                      {event.title}
                    </h3>

                    <p className="text-gray-400 text-lg mb-4">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-md text-gray-300">
                      <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                      {event.time && <p>⏰ {event.time}</p>}
                      {event.venue && <p>📍 {event.venue}</p>}

                      {event.contacts?.length > 0 && (
                        <>
                          <p>👤 {event.contacts[0].name}</p>
                          <p>📞 {event.contacts[0].phone}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  {!isCompleted && (
                    <div className="mt-6 space-y-3">
                      {event.registrationLink && (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
                        >
                          🔗 Register Here
                        </a>
                      )}

                      <button
                        onClick={() => handleRegister(event)}
                        disabled={isRegistered}
                        className={`w-full py-3 text-lg rounded-xl ${
                          isRegistered
                            ? "bg-gray-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isRegistered
                          ? "✅ Registered"
                          : "I Have Registered"}
                      </button>

                      {isCreator && user.role === "clubLead" && (
                        <>
                          <button
                            onClick={async () => {
                              const newVenue = prompt(
                                "Enter new venue:",
                                event.venue
                              );
                              const newDate = prompt(
                                "Enter new date (YYYY-MM-DD):",
                                event.date
                              );
                              const newTime = prompt(
                                "Enter new time:",
                                event.time
                              );

                              if (!newVenue && !newDate && !newTime) return;

                              try {
                                const token = localStorage.getItem("token");

                                await axios.patch(
                                  `/events/${event._id}/update`,
                                  {
                                    venue: newVenue,
                                    date: newDate,
                                    time: newTime,
                                  },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );

                                alert("Event updated & users notified 🎉");

                                loadEvents(); // ✅ refresh correctly
                              } catch (err) {
                                console.error(err);
                                alert("Failed to update");
                              }
                            }}
                            className="w-full py-2 bg-yellow-500 rounded-lg text-black"
                          >
                            🔔 Notify Users / Update
                          </button>

                          <button
                            onClick={() => handleDelete(event._id)}
                            className="w-full py-2 bg-red-600 rounded-lg text-white"
                          >
                            🗑 Delete Event
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
