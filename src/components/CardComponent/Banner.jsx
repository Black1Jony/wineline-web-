import { motion } from "framer-motion";
import { Button } from "antd";

const CardBanner = ({ onBuyClick }) => {
  return (
    <div
      className="
        relative w-full flex flex-col items-center justify-center 
        bg-cover bg-center px-4 overflow-hidden
        sm:h-[290px] md:h-[340px] lg:h-[550px] xl:h-[575px]
      "
      style={{
        backgroundImage: "url('/assets/info/background_bottom_august.png')",
      }}
    >
      <div className="relative w-full h-full max-w-6xl flex justify-center items-center overflow-hidden">
        <motion.img
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          src="/assets/info/platform_august.png"
          alt="Platform"
          className="w-auto h-full object-contain"
        />
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          src="/assets/info/top_card_august.png"
          alt="Card"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 
                     w-2/5 min-w-[240px] md:w-1/3 max-w-[400px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-6 text-center text-white px-4 w-full"
      >
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-1">
          Удиви друзей и близких
        </h2>
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2">
          Электронные подарочные карты
        </h1>
        <p className="text-sm md:text-base lg:text-lg mb-5">
          Дарите новые винные впечатления
        </p>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="primary"
            size="large"
            onClick={onBuyClick}
            className="!bg-red-600 !border-red-600 !px-8 !py-2 !text-lg !rounded-2xl"
          >
            Купить сертификат
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CardBanner;
