import React from 'react'
import { useState } from "react";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


const handleSubmit = async (e) => {
  e.preventDefault();
try{
  const res = await API.post("/auth/register", { name, email, password });
  login(res.data.user, res.data.token);

  navigate("/dashboard");}
   catch (err) {
    console.log("ERROR 👉", err.response?.data); 
    alert(err.response?.data?.message || "Register failed");
  }

};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-80">
        <h2 className="text-xl mb-4">Register</h2>

        <input
          className="w-full p-2 mb-2 bg-white text-black"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-2 mb-2 bg-white text-black"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 bg-white text-black"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-2 rounded">
          Create Account
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white">Login</Link>
        </p>
      </form>
    </div>
  );
}

