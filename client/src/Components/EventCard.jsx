import React from "react";

const EventCard = ({ event, handleRegister, user, onClick }) => {

  const isRegistered = event.registeredUsers?.some((u) => {
    if (!u || !user?._id) return false;
    const userId = typeof u === "object" ? u._id : u;
    return userId === user._id;
  });

  const isCompleted =
    event.status === "completed" ||
    new Date(event.date) < new Date();

  return (
    <div
      className="cursor-pointer flex flex-col bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:scale-105 transition duration-300 h-[460px]"
      
      // ✅ SAFE CLICK HANDLER (FIX)
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(event);
      }}
    >

      {/* IMAGE */}
     {event.poster && (
  <div
    className="w-full h-56 overflow-hidden cursor-zoom-in"
    onClick={(e) => {
      e.stopPropagation(); // 🚨 VERY IMPORTANT
      if (onClick) {
        onClick({
          type: "poster",   // 🔥 tell parent it's poster click
          data: event,
        });
      }
    }}
  >
    <img
      src={event.poster}
      alt={event.title}
      className="w-full h-full object-cover hover:scale-110 transition duration-300"
    />
  </div>
)}

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">
            {event.title}
          </h3>

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

        <div className="mt-2 space-y-2">

          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block w-full text-center bg-blue-600 py-2 rounded-lg hover:bg-blue-700"
            >
              🔗 Register Here
            </a>
          )}

          {!isCompleted ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRegister(event);
              }}
              disabled={isRegistered}
              className={`w-full py-2 rounded-lg ${
                isRegistered
                  ? "bg-gray-600"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isRegistered ? "✅ Registered" : "Mark as Registered"}
            </button>
          ) : (
            <p className="text-red-400 text-center text-sm">
              🚫 Event Completed
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default EventCard;
