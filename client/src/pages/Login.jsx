import { useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const user = res.data.user;
      const token = res.data.token;

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

      // Save using context
      login(user, token);

      // ✅ ROLE BASED REDIRECT
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "clubLead") {
        navigate("/club-dashboard");
      } else {
        navigate("/dashboard"); // student
      }

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 text-white p-6 rounded-xl w-80"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded text-black bg-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded text-black bg-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
