import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { Navigation, Pagination } from "swiper/modules";
import './SwiperWine.css'
const SwiperWine = () => {
  return <>
<Swiper
    modules={[Navigation, Pagination]}
    spaceBetween={30}
    navigation
    pagination={{ clickable: true }}
    effect={"cards"}
    grabCursor={true}
    loop={true}
    autoplay={{
      delay: 8000,
      disableOnInteraction: false,
    }}
    className="w-[65%] h-[300px] hidden md:block rounded-2xl sm:h-[325px] ] lg:h-[325px]  xl:h-[470px]  2xl:h-[560px]"
    >
    <SwiperSlide>
      <img src="/src/assets/logos/3e462aa549a63fc26e940e2caeb675cc.webp" alt="Wine 1" className="w-full h-full rounded-2xl object-center" />
    </SwiperSlide>
    <SwiperSlide>
      <img src="/src/assets/logos/3afa48b6b8a26fc11c250bee03f85b94.webp" alt="Wine 2" className="w-full h-full object-cover rounded-2xl" />
    </SwiperSlide>
    <SwiperSlide>
      <img src="/src/assets/logos/ca6f54e8ece54918ae1b9eac9973b6f9.webp" alt="Wine 3" className="w-full h-full object-cover rounded-2xl" />
    </SwiperSlide>
    </Swiper>
  </>
}

export default SwiperWine
