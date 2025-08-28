import { useState, useEffect, useRef } from "react";
import s from "./product.module.css";
import Card from "../../cards/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { hiddenStore } from "../../../utils/store/hiddenStore";
const Products = ({ items, first }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nowType, setNowType] = useState(first);
  const [nowCard, setNowCard] = useState(0);
  const swiperRef = useRef(null);
  const hiddeProduct = hiddenStore((state) => state.hiddenProduct);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await items();

        setProducts(results);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [items]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);

      setTimeout(() => {
        swiperRef.current.update();
      }, 100);
    }
  }, [nowCard]);

const visibleItems =
  products[nowCard]?.value?.filter((i) => i.images?.[0]) || [];
  if (loading) {
    return <div className="text-center mt-10 text-lg">Загрузка...</div>;
  }

  console.log(hiddeProduct);
  
  
  return (
    <div className="flex flex-col gap-6 w-[92%] mt-16 mx-auto">
      <div className="flex gap-8 overflow-x-scroll scrollbar-hide">
        {products.length !== 1 ? (
          products.map((item, index) => (
            <div key={item.id} className="cursor-pointer">
              <span
                className={`text-[19px] font-medium leading-tight transition-all duration-200 ${
                  s.DM
                } ${
                  item.name === nowType
                    ? `text-red-600 ${s.redline}`
                    : "text-[#5a5a5a]"
                }`}
                onClick={() => {
                  setNowType(item.name);
                  setNowCard(index);
                }}
              >
                {item.name}
              </span>
            </div>
          ))
        ) : (
          <div className="cursor-pointer w-full p-2 pb-4 border-b border-b-[#d5d5d5]">
            <span
              className={`text-[26px] font-medium leading-tight transition-all duration-200 ${s.DM} font-bold text-[#212020]`}
            >
              {products[0].name}
            </span>
          </div>
        )}
      </div>

      <Swiper
        className="w-full relative"
        slidesPerView={2}
        spaceBetween={0}
        breakpoints={{
          1024: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
          disabledClass: "swiper-button-disabled",
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {visibleItems.map((i) => (
          <SwiperSlide key={i.id}>
            <Card data={i} />
          </SwiperSlide>
        ))}

        <div className="swiper-button-prev-custom swiper-button-prev" />
        <div className="swiper-button-next-custom swiper-button-next" />
      </Swiper>
    </div>
  );
};

export default Products;
