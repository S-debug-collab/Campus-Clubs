import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function ClubLeadRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "clubLead") {
    return <Navigate to="/" />;
  }

  return children;
}
