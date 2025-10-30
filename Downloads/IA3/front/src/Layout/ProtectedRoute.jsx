// src/Layout/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 1️⃣ If not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ If route has restricted roles and user doesn't match
  if (roles && !roles.includes(role)) {
    alert("Access denied. You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Authorized → render component
  return children;
};

export default ProtectedRoute;
