import React, { lazy, Suspense } from "react";
import { FloatButton } from "antd";
import Header from "../../../components/Header/Header";
import SwiperWine from "../../../components/MainPageComponets/SwiperWine/SwiperWine";
import Category from "../../../components/MainPageComponets/reccomend/Category.jsx";
import Promotion from "../../../components/MainPageComponets/promotion/Promotion.jsx";
import {
  firstitems,
  secondItems,
  thirdItems,
} from "../../../components/MainPageComponets/Products/items.js";
import EventTaste from "../../../components/MainPageComponets/eventsTaste/EventTaste.jsx";
const LazyProduct = lazy(() =>
  import("../../../components/MainPageComponets/Products/products.jsx")
);
import OurPlus from "../../../components/MainPageComponets/OurPlus/OurPlus.jsx";
import BuyCertificate from "../../../components/MainPageComponets/BuyCertificate/BuyCertificate.jsx";
import OurBrends from "../../../components/MainPageComponets/OurBrends/OurBrends.jsx";
import OurPlusTwo from "../../../components/MainPageComponets/OurPlus/OurPlusTwo.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
const MainPage = () => {
  return (
    <>
      <div className="relative">
        <Header />

        <div className="w-[100%] md:w-full px-4 sm:px-8 md:px-12 xl:px-16 mt-40 mb-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
          <SwiperWine />

          <div className="hidden xl:flex flex-col gap-6">
            <Promotion
              promotion={{
                image: "/assets/logos/italia.png",
                title: "La Italian Wine",
                description: "Самые лучшие вина прямиком из Италии",
              }}
            />
            <Promotion
              promotion={{
                image: "/assets/logos/French.png",
                title: "Franzua Wine",
                description: "Франция — страна виноградников и виноделия",
              }}
            />
            <button className="w-full h-12 rounded-2xl bg-[#c4c3c3] text-sm">
              Каталог товаров
            </button>
          </div>
        </div>

        <Category />
        <Suspense fallback={<div>...loading</div>}>
          <LazyProduct items={firstitems} first="Рейтинг" />
        </Suspense>
        <EventTaste />
        <Suspense fallback={<div>...loadimg</div>}>
          <LazyProduct items={secondItems} first="Крепкие напитки" />
        </Suspense>
        <OurPlus />

        <Suspense fallback={<div>...loadimg</div>}>
          <LazyProduct items={thirdItems} />
        </Suspense>
        <BuyCertificate/>
        <OurBrends/>
        <OurPlusTwo/>
        <Footer/>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default React.memo(MainPage);
