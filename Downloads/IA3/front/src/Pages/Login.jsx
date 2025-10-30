import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const roleParam = query.get("role");
  const [role] = useState(roleParam || "user"); // fixed role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.user.role !== role) {
        alert(`This is not a ${role} account.`);
        return;
      }

      // Save token & user info
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user); // save in context

      // Redirect automatically to dashboard based on role
      navigate(role === "admin" ? "/admin" : "/user");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Invalid credentials or server error");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Student Tracker Login</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
