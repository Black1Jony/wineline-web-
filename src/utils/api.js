import axios from "axios";

// Базовый URL читается из переменной окружения VITE_API_URL
// Пример: VITE_API_URL=https://your-instance.example.com

const api = axios.create({
  baseURL: "https://actively-qualification-cleaners-rooms.trycloudflare.com/",
  withCredentials: false,
});

export default api;


