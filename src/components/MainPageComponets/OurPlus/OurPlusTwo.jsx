import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const OurPlusTwo = () => {
  return (
    <div className="w-full py-12 bg-[#ffffff]">
      <Swiper
        className="w-full"
      
        spaceBetween={30}
        slidesPerView={2}
       
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
        }}
      >
        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-lg border border-[#e4e4e4] transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-4 p-6">
              <img
                src="/assets/logos/trust-block-bonuses.png"
                alt="Бонусы"
                className="w-20 h-20 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold mb-1">Бонусы</h3>
                <p className="text-gray-600 text-sm">
                  Получайте дополнительные бонусы за каждую покупку в нашем
                  магазине.
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-lg border border-[#e4e4e4] transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-4 p-6">
              <img
                src="/public/assets/logos/trust-block-collection.png"
                alt="Качество"
                className="w-20 h-20 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  Гарантия качества
                </h3>
                <p className="text-gray-600 text-sm">
                  Мы гарантируем подлинность продукции и лучшие условия
                  хранения.
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-lg border border-[#e4e4e4] transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-4 p-6">
              <img
                src="/public/assets/logos/trust-block-percent.png"
                alt="Бонусы"
                className="w-20 h-20 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold mb-1">Скидки</h3>
                <p className="text-gray-600 text-sm">
                 частые скидки вплоть до 35% за покупку.
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-lg border border-[#e4e4e4] transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-4 p-6">
              <img
                src="/public/assets/logos/trust-block-winestores.png"
                alt="Бонусы"
                className="w-20 h-20 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold mb-1">Доставка</h3>
                <p className="text-gray-600 text-sm">
                  Гарантируем доставку в течение 1-3 дней .
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default OurPlusTwo;
