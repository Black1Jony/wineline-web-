import { useState, useEffect } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import InputPlaceHolder from "../Input/InputPlaceHolder";

const Header = (props) => {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);
  const ismenu = !props.ismenu || false ;
  const tovars = [
    { name: "В подарочной", path: "/catalog/gift" },
    { name: "Вино", path: "/catalog/wine" },
    { name: "Шампанское и игристое", path: "/catalog/champagne" },
    { name: "Виски", path: "/catalog/whiskey" },
    { name: "Коньяк", path: "/catalog/konyak" },
    { name: "бокалы", path: "/catalog/glasses" },
    { name: "аксессуары", path: "/catalog/accessories" },
    { name: "дегустации", path: "/tastings" },
    { name: "акции%", path: "/promotions" },
  ];

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      let currentScroll = window.scrollY || document.documentElement.scrollTop;

      if (currentScroll > lastScrollTop) {
        setIsHidden(true);
      } else if (currentScroll < lastScrollTop) {
        setIsHidden(false);
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <div
        className={`fixed top-0 left-0 w-full z-50 translate-y-0 shadow-lg transition-transform duration-300 ease-in-out"
        `}
      >
        <div className="w-full h-16 flex justify-between items-center px-6 md:px-16 bg-white">
          <img
            src="/src/assets/icons/WineLineIconText.svg"
            alt="Logo"
            className="w-24 h-24 hidden md:block cursor-pointer"
            onClick={() => navigate("/")}
          />

          <img
            src="/src/assets/svg/geo_icon_160074.svg"
            alt="Geo"
            className="w-6 h-6 hidden md:block"
          />

          <div className="flex-1 mx-4 max-w-xl">
            <InputPlaceHolder />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex flex-col items-center cursor-pointer">
              <img
                src="/src/assets/svg/cart-svgrepo-com.svg"
                alt="Cart"
                className="w-6 h-6"
              />
              <span className="text-sm text-[#2d2d2d]">корзина</span>
            </div>

            <div className="flex flex-col items-center cursor-pointer">
              <img
                src="/src/assets/svg/heart-svgrepo-com.svg"
                alt="Heart"
                className="w-6 h-6"
              />
              <span className="text-sm text-[#2d2d2d]">избранное</span>
            </div>
            <div
              className="flex flex-col items-center cursor-pointer "
              onClick={() =>{
                
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
                className="w-6 h-6"
              />
              <span className="text-sm text-[#2d2d2d]">
                {localStorage.getItem("token") ? "Личный кабинет" : "Войти"}
              </span>
            </div>
          </div>

          <img
            src="/src/assets/svg/burger-menu-svgrepo-com.svg"
            alt="Menu"
            className="w-8 h-8 block md:hidden cursor-pointer"
          />
        </div>

        {ismenu ? (
          <div
            className={`w-full bg-white px-6 md:px-16 mt-1 hidden md:flex items-center gap-4 rounded-b-xl justify-between
    transition-[max-height] duration-200 ease-in-out overflow-hidden
    ${isHidden && ismenu ? "max-h-0" : "max-h-40 "}`}
          >
            {tovars.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className={`text-[15px] font-medium px-4 py-2 rounded-full mb-2 mt-2 cursor-pointer transition-all duration-200 hover:bg-[#eaeaea] hover:text-black ${
                  item.name === "акции%"
                    ? "text-red-500 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
