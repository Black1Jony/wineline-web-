import { useNavigate } from "react-router-dom";
import { tovars } from "./items";
import { message } from "antd";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <footer className="bg-[#1b1b1c] text-white border-t-[3px] border-t-[#c94646] mt-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {tovars.map((i, index) => (
              <button
                onClick={() => navigate(i.path)}
                key={index}
                className="text-[16px] hover:text-[#c94646] transition-colors duration-200"
              >
                {i.name}
              </button>
            ))}
          </div>
          <hr className="w-full border-t border-[#8e8e93] max-w-4xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 font-serif">
          <div className="flex flex-col gap-4">
            <h3 className="text-[20px] font-semibold">WineLine</h3>
            <p
              onClick={() => navigate("/catalog/redwine")}
              className="cursor-pointer hover:text-[#c94646] transition"
            >
              Красные вина
            </p>
            <p
              onClick={() => navigate("/catalog/whitewine")}
              className="cursor-pointer hover:text-[#c94646] transition"
            >
              Белые вина
            </p>
            <p
              onClick={() =>
                messageApi.open({
                  type: "info",
                  content: "qwerty123456",
                })
              }
              className="cursor-pointer hover:text-[#c94646] transition"
            >
              Бесплатный промокод
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[20px] font-semibold">Для пользователей</h3>
            <ul className="text-gray-300 text-[15px] flex flex-col gap-2">
              <li>🕒 Время работы: Пн-Пт 9:00–21:00, Сб-Вс 11:00–20:00</li>
              <li>🚚 Бесплатная доставка</li>
              <li>🏷️ Накопительная система баллов</li>
              <li>🍷 Винные мероприятия</li>
              <li>📜 Сертификаты на все вина</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[20px] font-semibold">Контакты</h3>
            <p className="text-gray-300 text-[15px]">
              Email: info@wineline.com
            </p>
            <p className="text-gray-300 text-[15px]">
              Телефон: +(996) 704 222 666
            </p>
            <div className="flex gap-4 mt-2 flex-wrap">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-[#c94646] transition"
              >
                <FaFacebook size={18} /> Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-[#c94646] transition"
              >
                <FaInstagram size={18} /> Instagram
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-[#c94646] transition"
              >
                <FaTwitter size={18} /> X
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-[14px] py-4 border-t border-[#8e8e93] font-serif">
          © 2025 WineLine. Все права защищены.
        </div>
      </footer>
    </>
  );
};

export default Footer;
