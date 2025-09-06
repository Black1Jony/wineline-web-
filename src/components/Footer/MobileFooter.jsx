import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUser, FaHeart, FaHome } from "react-icons/fa";
import { shopStore } from "../../utils/store/shopStore";
import { favoriteStore } from "../../utils/store/favoriteStore";
const MobileFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const products = shopStore((state) => state.products);
  const favorites = favoriteStore((state) => state.favorites);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#c94646] shadow-2xl z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-2">
        {/* Главная */}
        <button
          onClick={() => handleNavigation("/")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
            isActive("/") 
              ? "bg-[#c94646] text-white" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaHome className="text-xl" />
          <span className="text-xs font-medium">Главная</span>
        </button>

        {/* Корзина */}
        <button
          onClick={() => handleNavigation("/shop")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
            isActive("/cart") 
              ? "bg-[#c94646] text-white" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <div className="relative">
            <FaShoppingCart className="text-xl" />
            {/* Счетчик товаров в корзине - можно добавить из контекста */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
              {products.length}
            </span>
          </div>
          <span className="text-xs font-medium">Корзина</span>
        </button>

        {/* Избранные */}
        <button
          onClick={() => handleNavigation("/favorite")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
            isActive("/favorite") 
              ? "bg-[#c94646] text-white" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <div className="relative">
            <FaHeart className="text-xl" />
            {/* Счетчик избранных - можно добавить из контекста */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
              {favorites.length}
            </span>
          </div>
          <span className="text-xs font-medium">Избранные</span>
        </button>

        {/* Профиль */}
        <button
          onClick={() => handleNavigation("/profile")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
            isActive("/profile") 
              ? "bg-[#c94646] text-white" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaUser className="text-xl" />
          <span className="text-xs font-medium">Профиль</span>
        </button>
      </div>
    </div>
  );
};

export default MobileFooter;
