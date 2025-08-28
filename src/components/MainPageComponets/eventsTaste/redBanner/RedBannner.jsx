import React from "react";
import s from "./redBanner.module.css";
import { useNavigate } from "react-router-dom";
const RedBanner = () => {
  const navigate = useNavigate()
  return (
    <div className={`${s.redBanner} flex flex-col md:flex-row rounded-2xl`}>
      <div className="flex flex-col justify-center text-white z-10 max-w-xl p-6 md:p-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-serif font-semibold leading-tight mb-4">
          Мероприятия с дегустациями <br /> в винотеках
        </h1>
        <p className="text-base md:text-lg mb-6">
          Попробуйте непривычное, получите новые знания <br />
          или отпразднуйте важное событие
        </p>
        <button className="bg-white !text-black font-normal px-6 py-3 rounded-md w-fit mx-auto md:mx-0 hover:!text-red-600 transition-[200ms]" onClick={()=> navigate('/event')}>
          посмотреть и записаться
        </button>
      </div>

      <div className="w-full md:w-auto">
        <img
          src="/assets/svgLogos/banner-degustation.png"
          alt="Glass of wine"
          className={`${s.bannerImage} w-full md:w-auto md:max-w-md object-contain`}
        />
      </div>
    </div>
  );
};

export default RedBanner;
