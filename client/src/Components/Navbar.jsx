// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import axios from "../utils/axios";
// import React from "react";

// export default function Navbar() {
//   const [notifications, setNotifications] = useState([]);
//   const [visible, setVisible] = useState(false);

//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   /* ================= EVENT REMINDER ================= */
// useEffect(() => {
//   if (!user?._id) return;

//   const alreadyShown = sessionStorage.getItem("reminderShown");

//   // ✅ only once per login session
//   if (alreadyShown) return;

//   const fetchEvents = async () => {
//     try {
//       const res = await axios.get("/events");
//       const events = res.data;

//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const reminders = events
//         .filter((event) =>
//           event.registeredUsers?.some(
//             (u) => u === user._id || u?._id === user._id
//           )
//         )
//         .map((event) => {
//           const eventDate = new Date(event.date);
//           eventDate.setHours(0, 0, 0, 0);

//           const diffDays = Math.floor(
//             (eventDate - today) / (1000 * 60 * 60 * 24)
//           );

//           if (diffDays === 0)
//             return `🔔 ${event.title} is TODAY!`;

//           if (diffDays === 1)
//             return `⚡ ${event.title} is TOMORROW!`;

//           return null;
//         })
//         .filter(Boolean);

//       console.log("FINAL reminders:", reminders); // DEBUG

//       if (reminders.length > 0) {
//         setNotifications(reminders);
//         setVisible(true);

//         // ✅ mark as shown for this login session
//         sessionStorage.setItem("reminderShown", "true");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchEvents();
// }, [user]);

//   /* ================= AUTO CLOSE ================= */
//   useEffect(() => {
//     if (notifications.length > 0) {
//       const timer = setTimeout(() => {
//         setVisible(false);
//         setTimeout(() => setNotifications([]), 200);
//       }, 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [notifications]);

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const closeNotification = () => {
//     setVisible(false);
//     setTimeout(() => setNotifications([]), 200);
//   };

//   return (
//     <>
//       {/* ================= POPUP ================= */}
//       {notifications.length > 0 && (
//         <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          
//           {/* BACKDROP */}
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

//           {/* POPUP */}
//           <div
//             className={`relative w-[90%] max-w-md p-[2px] rounded-3xl transition-all duration-300 ${
//               visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
//             }`}
//           >
//             <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 p-[1px]">
              
//               <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
                
//                 {/* HEADER */}
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-bold text-gray-800">
//                     ⏰ Event Reminder
//                   </h2>

//                   <button
//                     onClick={closeNotification}
//                     className="text-gray-500 hover:text-black text-xl"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {/* MESSAGES */}
//                 <div className="space-y-3 text-sm">
//  {notifications.map((n, i) => (
//   <div
//     key={n}
//     className="bg-gradient-to-r from-indigo-50 to-purple-100 p-4 rounded-xl shadow-sm"
//   >
//     {n}
//   </div>
// ))}

//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= NAVBAR ================= */}
//       <nav className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-900/80 border-b border-white/10 px-6 py-3 flex justify-between items-center shadow-lg">
        
//         {/* LOGO */}
//         <Link
//           to={
//             !user
//               ? "/"
//               : user.role === "admin"
//               ? "/admin"
//               : user.role === "clubLead"
//               ? "/club-dashboard"
//               : "/dashboard"
//           }
//           className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
//         >
//           Campus Clubs
//         </Link>

//         {/* RIGHT SIDE */}
//         <div className="flex gap-4 items-center">
//           {!user ? (
//             <>
//               <Link to="/login" className="px-4 py-2 rounded-xl bg-indigo-500 text-white">
//                 Login
//               </Link>
//               <Link to="/register" className="px-4 py-2 rounded-xl bg-purple-600 text-white">
//                 Register
//               </Link>
//             </>
//           ) : (
//             <>
//               <div className="hidden sm:block text-right">
//                 <p className="text-sm text-zinc-300">{user.email}</p>
//                 <p className="text-xs text-zinc-500">{user.role}</p>
//               </div>

//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 rounded-xl bg-red-500 text-white"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </nav>
//     </>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import React from "react";

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* ================= EVENT REMINDER ================= */
useEffect(() => {
  if (!user?._id) return;

  // 🔥 unique key per user login
  const key = `reminderShown_${user._id}`;
  const alreadyShown = sessionStorage.getItem(key);

  if (alreadyShown === "true") return;

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events");
      const events = res.data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const reminders = events
        .filter((event) =>
          event.registeredUsers?.some(
            (u) => u === user._id || u?._id === user._id
          )
        )
        .map((event) => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);

          const diffDays = Math.floor(
            (eventDate - today) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 0)
            return `🔔 ${event.title} is TODAY!`;

          if (diffDays === 1)
            return `⚡ ${event.title} is TOMORROW!`;

          return null;
        })
        .filter(Boolean);

      if (reminders.length > 0) {
        setNotifications(reminders);
        setVisible(true);

        // ✅ mark as shown for THIS login
        sessionStorage.setItem(key, "true");
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchEvents();
}, [user]);

  /* ================= AUTO CLOSE ================= */
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setNotifications([]), 200);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

const handleLogout = () => {
  if (user?._id) {
    sessionStorage.removeItem(`reminderShown_${user._id}`);
  }

  logout();
  navigate("/");
};

  const closeNotification = () => {
    setVisible(false);
    setTimeout(() => setNotifications([]), 200);
  };

  return (
    <>
      {/* 🔥 POPUP (LOWER Z-INDEX → WILL NOT BLOCK MODALS) */}
      {notifications.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none">
          
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

          {/* POPUP */}
          <div
            className={`relative w-[90%] max-w-md p-[2px] rounded-3xl transition-all duration-300 pointer-events-auto ${
              visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 p-[1px]">
              
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
                
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    ⏰ Event Reminder
                  </h2>

                  <button
                    onClick={closeNotification}
                    className="text-gray-500 hover:text-black text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* MESSAGES */}
                <div className="space-y-3 text-sm">
                  {notifications.map((n) => (
                    <div
                      key={n}
                      className="bg-gradient-to-r from-indigo-50 to-purple-100 p-4 rounded-xl shadow-sm"
                    >
                      {n}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-900/80 border-b border-white/10 px-6 py-3 flex justify-between items-center shadow-lg">
        
        <Link
          to={
            !user
              ? "/"
              : user.role === "admin"
              ? "/admin"
              : user.role === "clubLead"
              ? "/club-dashboard"
              : "/dashboard"
          }
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Campus Clubs
        </Link>

        <div className="flex gap-4 items-center">
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl bg-indigo-500 text-white">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-xl bg-purple-600 text-white">
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="hidden sm:block text-right">
                <p className="text-sm text-zinc-300">{user.email}</p>
                <p className="text-xs text-zinc-500">{user.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}