import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  // Backend is running on port 5000 (from .env)
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// In your components, you can now import and use 'api'
// Example: api.post('/auth/login', { email, password });