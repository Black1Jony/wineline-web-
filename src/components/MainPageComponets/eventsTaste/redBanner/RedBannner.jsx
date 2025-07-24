import React from "react";
import s from "./redBanner.module.css";

const RedBanner = () => {
  return (
    <div className={`${s.redBanner} flex rounded-2xl `}>
      <div className=" flex flex-col justify-center text-white max-w-xl z-10">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-serif font-semibold leading-tight mb-4">
          Мероприятия с дегустациями <br /> в винотеках
        </h1>
        <p className="text-lg mb-6">
          Попробуйте непривычное, получите новые знания <br />
          или отпразднуйте важное событие
        </p>
        <button className="bg-white !text-[#000] font-normal px-6 py-3 rounded-md w-fit hover:!text-red-600 transition-[200ms]">
        посмотреть и записатся
        </button>
      </div>

      <div className="">
        <img
          src="/assets/svgLogos/banner-degustation.png"
          alt="Glass of wine"
          className={s.bannerImage}
        />
      </div>
    </div>
  );
};

export default RedBanner;
