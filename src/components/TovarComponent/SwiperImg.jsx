import { useState, useEffect, useRef } from "react";
import { MotionConfig, motion as Motion } from "motion/react";
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
    <MotionConfig reducedMotion="user">
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col-reverse md:flex-row md:justify-end items-center md:items-end gap-4"
      >
        <div className="flex md:flex-col gap-2">
          {slides.map((src, index) => (
            <Motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              key={index}
              className={`w-16 h-16 md:w-[70px] md:h-[70px] rounded-full overflow-hidden flex justify-center items-center border ${
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
            </Motion.div>
          ))}
        </div>

        <Motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="flex justify-center items-center overflow-hidden bg-white md:ml-4 w-full max-w-[360px] md:max-w-[340px]"
        >
          <Swiper
            modules={[Navigation]}
            loop={true}
            navigation
            className="w-full h-72 md:h-[500px]"
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
        </Motion.div>
      </Motion.div>
    </MotionConfig>
  );
};

export default SwiperImg;
