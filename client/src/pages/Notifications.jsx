import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ FORMAT ISO DATE INSIDE MESSAGE
  const formatMessage = (msg) => {
    if (!msg) return "";

    const isoRegex =
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/g;

    return msg.replace(isoRegex, (dateStr) => {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    });
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-6 font-semibold">
        🔔 Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id} // ✅ CORRECT
              className="bg-zinc-800 p-4 rounded-xl border border-white/10 shadow-md hover:bg-zinc-700 transition"
            >
              {/* ✅ MULTI-LINE MESSAGE FIX */}
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {formatMessage(n.message)}
              </p>

              {/* ✅ TIME */}
              <small className="text-gray-400 block mt-3 text-xs">
                {new Date(n.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
