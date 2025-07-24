import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";

const OurBrends = () => {
  const urls = [];

  for (let index = 1; index <= 27; index++) {
    if ([3, 4, 15, 20].includes(index)) {
      urls.push(`/assets/company/a${index}.jpg`);
    } else {
      urls.push(`/assets/company/a${index}.png`);
    }
  }

  return (
    <div className="mt-12 flex justify-center w-[92%] mx-auto">
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">Наши бренды</h1>
        <Swiper
          spaceBetween={20}
          slidesPerView={9}
          modules={[Grid, Pagination, Navigation]}
          grid={{ rows: 3, fill: "row" }}
          pagination={{ clickable: true }}
          navigation={true}
          slidesPerGroup={9}
          loop={true}
          breakpoints={{
            768: {
              slidesPerView: 3,
              grid: {
                rows: 1,
                fill: "row",
              },
            },
          }}
          className="our-brands-swiper"
        >
          {urls.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center items-center h-full">
                <img
                  src={url}
                  alt={`brand-${index + 1}`}
                  className="w-20 md:w-24 lg:w-28 object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OurBrends;
