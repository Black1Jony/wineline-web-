import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const SwiperImg = ({ img }) => {
  const [slides, setSlides] = useState([]);
  const [count, setCount] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    setSlides(Array.isArray(img) ? img : []);
    setCount(0);
  }, [img]);

  useEffect(() => {
    return () => {
      if (swiperRef.current?.destroy) {
        swiperRef.current.destroy(true, false);
      }
      swiperRef.current = null;
    };
  }, []);

  if (!slides.length) {
    return <div>Нет изображений</div>;
  }

  return (
    <div className="flex justify-end items-end">
      <div className="flex flex-col gap-2">
        {slides.map((src, index) => (
          <div
            key={index}
            className={`w-[70px] h-[70px] rounded-full overflow-hidden flex justify-center items-center border ${
              count === index ? "border-gray-600" : "border-transparent"
            } bg-white cursor-pointer`}
            onClick={() => {
              setCount(index);
              swiperRef.current?.slideToLoop(index);
            }}
          >
            <img
              src={src}
              alt={`thumb-${index}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center overflow-hidden bg-white ml-4">
        <Swiper
          modules={[Navigation]}
          loop={true}
          navigation
          className="w-[300px] h-[500px]"
          onSwiper={(instance) => {
            swiperRef.current = instance;
          }}
          onSlideChange={() => {
            if (!swiperRef.current) return;
            setCount(swiperRef.current.realIndex ?? 0);
          }}
        >
          {slides.map((src, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center items-center"
            >
              <img
                src={src}
                alt={`slide-${index}`}
                className="w-full h-full object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SwiperImg;
