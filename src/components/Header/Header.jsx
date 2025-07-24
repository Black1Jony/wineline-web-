import { useState, useEffect } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import InputPlaceHolder from "../Input/InputPlaceHolder";

const Header = (props) => {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ismenu = !props.ismenu || false;
  const tovars = [
    { name: "В подарочной", path: "/catalog/gift" },
    { name: "Вино", path: "/catalog/wine" },
    { name: "Шампанское и игристое", path: "/catalog/champagne" },
    { name: "Виски", path: "/catalog/whiskey" },
    { name: "Коньяк", path: "/catalog/konyak" },
    { name: "бокалы", path: "/catalog/glasses" },
    { name: "джин", path: "/catalog/gin" },
    { name: "аксессуары", path: "/catalog/accessories" },
    { name: "дегустации", path: "/tastings" },
    { name: "акции%", path: "/promotions" },
  ];

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
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
              src="/src/assets/svg/burger-menu-svgrepo-com.svg"
              alt="Menu"
              className="w-6 h-6"
            />
          </button>

          <img
            src="/src/assets/icons/WineLineIconText.svg"
            alt="Logo"
            className="w-20 h-20 mx-auto md:mx-0 cursor-pointer"
            onClick={() => navigate("/")}
          />

          <div className="hidden md:flex items-center gap-2">
            <img
              src="/src/assets/svg/geo_icon_160074.svg"
              alt="Geo"
              className="w-5 h-5"
            />
          </div>

          <div className="hidden md:flex flex-1 mx-4 max-w-xl">
            <InputPlaceHolder />
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <div className="flex flex-col items-center cursor-pointer">
              <img
                src="/src/assets/svg/cart-svgrepo-com.svg"
                alt="Cart"
                className="w-5 h-5"
              />
              <span className="text-xs text-[#2d2d2d]">корзина</span>
            </div>

            <div className="flex flex-col items-center cursor-pointer">
              <img
                src="/src/assets/svg/heart-svgrepo-com.svg"
                alt="Heart"
                className="w-5 h-5"
              />
              <span className="text-xs text-[#2d2d2d]">избранное</span>
            </div>
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                if (!localStorage.getItem("token")) {
                  navigate("/login");
                } else {
                  navigate("/profile");
                }
              }}
            >
              <img
                src="/src/assets/svg/profile-svgrepo-com.svg"
                alt="Heart"
                className="w-5 h-5"
              />
              <span className="text-xs text-[#2d2d2d]">
                {localStorage.getItem("token") ? "Кабинет" : "Войти"}
              </span>
            </div>
          </div>

         
          <div className="flex md:hidden items-center gap-4">
            <div className="flex flex-col items-center cursor-pointer">
              <img
                src="/src/assets/svg/cart-svgrepo-com.svg"
                alt="Cart"
                className="w-5 h-5"
              />
            </div>
          </div>
        </div>

        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white p-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <InputPlaceHolder mobile />
              {tovars.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-base px-4 py-2 cursor-pointer ${
                    item.name === "акции%"
                      ? "text-red-500 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                  onClick={() => {
                    if (!localStorage.getItem("token")) {
                      navigate("/login");
                    } else {
                      navigate("/profile");
                    }
                    setMobileMenuOpen(false);
                  }}
                >
                  <img
                    src="/src/assets/svg/profile-svgrepo-com.svg"
                    alt="Profile"
                    className="w-5 h-5"
                  />
                  <span>
                    {localStorage.getItem("token") ? "Личный кабинет" : "Войти"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                  <img
                    src="/src/assets/svg/heart-svgrepo-com.svg"
                    alt="Favorites"
                    className="w-5 h-5"
                  />
                  <span>Избранное</span>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {ismenu && !mobileMenuOpen ? (
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
    </div>
  );
};

export default Header;
