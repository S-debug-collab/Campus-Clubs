import { Link } from "react-router-dom";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white px-4">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center overflow-hidden">
        
        {/* Glow layer */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-3xl blur-2xl opacity-20"></div>

        <h1 className="relative text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text text-transparent">
          College Clubs 
        </h1>

        <p className="relative text-gray-300 mb-8 text-lg">
          Explore campus clubs, join communities, and never miss an event.
        </p>

        <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl  bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold hover:scale-105 transition transform duration-200 shadow-xl"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-gradient-to-r bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold hover:scale-105 transition transform duration-200 shadow-xl"
          >
            Register
          </Link>
        </div>

        <p className="relative mt-8 text-lg text-gray-400">
          Built for students.
        </p>
      </div>
    </div>
  );
};

export default Home;
