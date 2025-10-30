import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedRole = params.get("role");
    if (selectedRole) setRole(selectedRole);
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { email, password });
      const userRole = response.data.user.role;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", userRole);

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Invalid credentials or server error");
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
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <a href="/signup" className="text-decoration-none">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
