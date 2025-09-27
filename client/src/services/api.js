import axios from "axios";
const ROOT = (import.meta.env.VITE_API_URL || "https://mern-todo-wouy.onrender.com").replace(/\/+$/, "");

export const api = axios.create({
  baseURL: `${ROOT}/api`,
});