import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { Navigation, Pagination } from "swiper/modules";
const SwiperWine = () => {
  return <>
<Swiper
    modules={[Navigation, Pagination]}
    spaceBetween={30}
    navigation
    pagination={{ clickable: true }}
    effect={"cards"}
    grabCursor={true}
    className="w-[65%] h-[450px] hidden md:block rounded-2xl"
    >
    <SwiperSlide>
      <img src="/src/assets/logos/3e462aa549a63fc26e940e2caeb675cc.webp" alt="Wine 1" className="w-full h-full object-cover rounded-2xl" />
    </SwiperSlide>
    </Swiper>
  </>
}

export default SwiperWine
