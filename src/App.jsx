import Login from "./page/loginPage/Login";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import MainPage from "./page/mainPages/main/MainPage";
import LoginPage from "./page/loginPage/Login";
import Katolog from "./page/Katalog/Katolog";
import Product from "./page/TovarPage/TovarPage";
import Shop from "./page/Shop/Shop";
import SearchPage from "./page/Search/SearchPage";
import Favorite from "./page/favorite/Favorite";
import AdminPage from "./page/Admin/AdminPage";
import axios from "axios";
import { shopStore } from "./utils/store/shopStore";
import { favoriteStore } from "./utils/store/favoriteStore";
import EventPage from "./page/EventPage/eventPage";
import Event from "./page/Event/Event";
import CardPage from "./page/Cards.jsx/CardPage";
function App() {
 useEffect(() => {
   const user = localStorage.getItem("user");
   if (!user) return;

   const fetchData = async () => {
     try {
       const resp = await axios.get(`http://localhost:3000/users/${user}`);
       favoriteStore.getState().setFavorite(resp.data.favorites || []);
       shopStore.getState().setProduct(resp.data.shop || []);
     } catch (err) {
       if (err.response?.status === 404) {
         shopStore.getState().clearProducts();
         favoriteStore.getState().clearFavorite();
         localStorage.removeItem("user");
         window.reload()
       }
     }
   };

   fetchData();
   const interval = setInterval(fetchData, 5000); 
   return () => clearInterval(interval);
 }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/catalog/:type" element={<Katolog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/Admin" element={<AdminPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/event/:id" element={<Event />} />
        <Route path="/cards" element={<CardPage/>}/>
      </Routes>
    </>
  );
}

export default App;
