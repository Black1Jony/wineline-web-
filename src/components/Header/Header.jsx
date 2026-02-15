import { useState, useEffect } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import InputPlaceHolder from "../Input/InputPlaceHolder";
import MapModal from "../Map/Map";
import api from "../../utils/api";
import { message } from "antd";
import { shopStore } from "../../utils/store/shopStore";
import { favoriteStore } from "../../utils/store/favoriteStore";

const Header = (props) => {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const ismenu = !props.ismenu || false;
  
  // Получаем данные из stores
  const { products: cartProducts } = shopStore();
  const { favorites } = favoriteStore();
  
  // Вычисляем общее количество товаров в корзине
  const cartItemsCount = cartProducts.reduce((total, item) => total + (item.count || 0), 0);
  
  // Состояние для баллов пользователя
  const [userScore, setUserScore] = useState(0);
  const tovars = [
    { name: "В подарочной", path: "/catalog/gift" },
    { name: "Вино", path: "/catalog/wine" },
    { name: "Шампанское и игристое", path: "/catalog/shampage" },
    { name: "Виски", path: "/catalog/whiskey" },
    { name: "Коньяк", path: "/catalog/konyak" },
    { name: "джин", path: "/catalog/gin" },
    { name: "Води и соки", path: "/catalog/voda" },
    { name: "дегустации", path: "/event" },
  ];
  const [messageApi, contextHolder] = message.useMessage();
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      let currentScroll = window.scrollY || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop && currentScroll > 100) {
        setIsHidden(true);
      } else if (currentScroll < lastScrollTop) {
        setIsHidden(false);
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const resp = async () => {
      const isAdminResponce = await api.get(
        `/users/${localStorage.getItem("user")}`
      );
      if (isAdminResponce.data.role === "admin") {
        setIsAdmin(true);
      }
      // Загружаем баллы пользователя
      setUserScore(isAdminResponce.data?.score || 0);
    };
    resp();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const checkAuthAndNavigate = (path) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      messageApi.warning(
        "Для доступа к этой странице необходимо войти в систему"
      );
      return;
    }
    navigate(path);
  };

  const user = localStorage.getItem("user");

  return (
    <>
      {contextHolder}
      <div className="relative">
        <div
          className={`fixed top-0 left-0 w-full z-50 translate-y-0 ${
            isHidden ? "-translate-y-full" : "translate-y-0"
          } ${
            isHidden && "shadow-lg"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="w-full h-16 flex justify-between items-center px-4 sm:px-6 md:px-16 bg-white">
            <button className="block md:hidden p-2" onClick={toggleMobileMenu}>
              <img
                src="/public/assets/svg/hamburger-menu-svgrepo-com.svg"
                alt="Menu"
                className="w-6 h-6"
              />
            </button>

            <img
              src="/assets/icons/WineLineIconText.svg"
              alt="Logo"
              className="w-20 h-20 mx-auto md:mx-0 cursor-pointer"
              onClick={() => navigate("/")}
            />

            <div className="hidden md:flex items-center gap-2">
              <img
                src="/assets/svg/geo_icon_160074.svg"
                alt="Geo"
                className="w-5 h-5"
                onClick={() => setIsMapOpen(true)}
              />
            </div>

            <div className="hidden md:flex flex-1 mx-4 max-w-xl">
              <InputPlaceHolder />
            </div>

            {isAdmin && (
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => navigate("/Admin")}
              >
                <img
                  src="/public/assets/icons/wine-fill-svgrepo-com.svg"
                  alt="Cart"
                  className="w-5 h-5"
                />
                <span className="text-xs text-[#2d2d2d]">Админка</span>
              </div>
            )}

            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              
              <div
                className="flex flex-col items-center cursor-pointer relative group"
                onClick={() => checkAuthAndNavigate("/shop")}
              >
                <div className="relative">
                  <img
                    src="/assets/svg/cart-svgrepo-com.svg"
                    alt="Cart"
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                  />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#2d2d2d] group-hover:text-red-500 transition-colors">корзина</span>
              </div>

              <div
                className="flex flex-col items-center cursor-pointer relative group"
                onClick={() => checkAuthAndNavigate("/favorite")}
              >
                <div className="relative">
                  <img
                    src="/assets/svg/heart-svgrepo-com.svg"
                    alt="Heart"
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                  />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {favorites.length > 99 ? '99+' : favorites.length}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#2d2d2d] group-hover:text-pink-500 transition-colors">избранное</span>
              </div>

              <div
                className="hidden flex-col items-center cursor-pointer md:flex"
                onClick={() => {
                  if (!localStorage.getItem("token")) {
                    navigate("/login");
                  } else {
                    navigate("/profile");
                  }
                }}
              >
                <img
                  src="/assets/svg/profile-svgrepo-com.svg"
                  alt="Heart"
                  className="w-5 h-5"
                />
                <span className="text-xs text-[#2d2d2d]">
                  {localStorage.getItem("token") ? "Кабинет" : "Войти"}
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-4">
              <div
                className="flex flex-col items-center cursor-pointer relative group"
                onClick={() => checkAuthAndNavigate("/shop")}
              >
                <div className="relative">
                  <img
                    src="/assets/svg/cart-svgrepo-com.svg"
                    alt="Cart"
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                  />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 Улучшенное мобильное меню */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white p-4 shadow-lg">
              <div className="flex flex-col gap-4">
                {/* Поиск */}
                <InputPlaceHolder mobile />

                {/* Категории */}
                <div className="grid grid-cols-2 gap-3">
                  {tovars.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium text-center cursor-pointer hover:bg-gray-100"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>

                {/* Разделитель */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* Баллы пользователя */}
                {userScore > 0 && (
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      {userScore} баллов
                    </div>
                  </div>
                )}

                {/* Профиль + корзина + избранное */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div
                    onClick={() => {
                      if (!localStorage.getItem("token")) {
                        navigate("/login");
                      } else {
                        navigate("/profile");
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <img
                      src="/assets/svg/profile-svgrepo-com.svg"
                      alt="Profile"
                      className="w-6 h-6 mb-1"
                    />
                    <span className="text-xs">
                      {localStorage.getItem("token") ? "Кабинет" : "Войти"}
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      checkAuthAndNavigate("/shop");
                      setMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center cursor-pointer relative group"
                  >
                    <div className="relative">
                      <img
                        src="/assets/svg/cart-svgrepo-com.svg"
                        alt="Cart"
                        className="w-7 h-7 mb-2 transition-transform group-hover:scale-110"
                      />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                          {cartItemsCount > 99 ? '99+' : cartItemsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs group-hover:text-red-500 transition-colors">Корзина</span>
                  </div>

                  <div
                    onClick={() => {
                      checkAuthAndNavigate("/favorite");
                      setMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center cursor-pointer relative group"
                  >
                    <div className="relative">
                      <img
                        src="/assets/svg/heart-svgrepo-com.svg"
                        alt="Favorites"
                        className="w-7 h-7 mb-2 transition-transform group-hover:scale-110"
                      />
                      {favorites.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                          {favorites.length > 99 ? '99+' : favorites.length}
                        </span>
                      )}
                    </div>
                    <span className="text-xs group-hover:text-pink-500 transition-colors">Избранное</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {ismenu && !mobileMenuOpen && !props.show ? (
            <div
              className={`w-full bg-white px-6 md:px-16 transition-all duration-300 ease-in-out overflow-hidden ${
                isHidden
                  ? "h-0 opacity-0 pt-0 pb-0"
                  : "h-auto opacity-100 py-2 md:py-4"
              }`}
            >
              <div className="flex items-center gap-2 md:gap-4 justify-between overflow-x-auto hide-scrollbar">
                {tovars.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(item.path)}
                    className={`text-sm md:text-[15px] font-medium px-3 py-1 md:px-4 md:py-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-[#eaeaea] hover:text-black whitespace-nowrap ${
                      item.name === "акции%"
                        ? "text-red-500 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        {isMapOpen && (
          <MapModal onClose={() => setIsMapOpen(false)} userId={user} />
        )}
      </div>
    </>
  );
};

export default Header;
