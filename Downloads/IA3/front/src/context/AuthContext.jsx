// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // You have this dependency installed
import api from '../utils/api'; // This uses your configured API instance

// 1. Create the Context object
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores decoded user info (id, role, name, etc.)
  const [loading, setLoading] = useState(true);

  // Function to decode the token, set user state, and configure Axios
  const decodeAndSetUser = (token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Basic check for token expiration
        if (decoded.exp * 1000 < Date.now()) {
          // Token is expired
          logout(); 
        } else {
          setUser(decoded);
          localStorage.setItem('token', token);
          // Set Authorization header for all future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        // Invalid token format
        console.error("Invalid token:", e);
        logout();
      }
    } else {
      // No token present
      setUser(null);
      localStorage.removeItem('token');
      // Remove Authorization header
      delete api.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  };
  
  // Login function called by the Login component
  const login = async (email, password) => {
    // This calls the backend /api/auth/login endpoint
    const res = await api.post('/auth/login', { email, password });
    const newToken = res.data.token;
    decodeAndSetUser(newToken);
  };

  // Logout function
  const logout = () => {
    decodeAndSetUser(null);
    // After logging out, redirect to login page
    window.location.href = '/login'; 
  };

  // Runs once on mount to check if a token already exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    decodeAndSetUser(token);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);