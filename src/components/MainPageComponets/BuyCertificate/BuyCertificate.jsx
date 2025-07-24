import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const BuyCertificate = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-[92%] mt-16 mb-16 h-[400px] rounded-3xl overflow-hidden px-16 flex items-center justify-between self-center justify-self-center bg-gradient-to-br from-[#e7e7e7] to-[#d26b6b] shadow-2xl text-white">
      <div className="z-10 max-w-[100%] md:max-w-[48%]">
        <h2 className="text-3xl font-extrabold mb-4 drop-shadow-sm md:text-5xl">
          Подарочный сертификат
        </h2>
        <p className="text-lg leading-relaxed mb-6 text-white/90">
          Удивите своих близких — подарите им изысканный винный опыт! <br />
          Сертификат на покупку вина или винного тура — это идеальный подарок.
        </p>
        <Button
          type="primary"
          size="large"
          className="bg-white text-[#0f1f4d] hover:bg-gray-100 font-semibold px-6 py-1.5 rounded-lg shadow-md"
          onClick={() => navigate("/cards")}
        >
          Купить сертификат
        </Button>
      </div>

      <div className="absolute right-[-80px] bottom-0 z-0">
        <img
          src="/src/assets/logos/howto_card_july.png"
          alt="Сертификат"
          className="w-[700px] h-[420px] object-contain"
        />
      </div>

      <div className="absolute -right-40 -top-40 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl z-0"></div>
    </div>
  );
};

export default BuyCertificate;
