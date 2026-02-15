import axios from "axios";



const api = axios.create({
  baseURL: "https://winelineback.onrender.com",
  withCredentials: false,
});

export default api;


