import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api",
  // No Authorization header added for admin
});

export default adminApi;
