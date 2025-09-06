import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ru.js";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MobileFooter from "../../components/Footer/MobileFooter";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { Modal, Input, Button, message as antdMessage } from "antd";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

dayjs.locale("ru");

const Event = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [messageApi, contextHolder] = antdMessage.useMessage();

  useEffect(() => {
    const getData = async () => {
      const resp = await api.get(`/event/${id}`);
      setData(resp.data.data);
    };
    getData();
  }, [id]);

  const handleInputChange = (e) =>
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  const handleInputFocus = (e) =>
    setCardData({ ...cardData, focus: e.target.name });

  const handlePay = () => {
    if (
      !cardData.number ||
      !cardData.name ||
      !cardData.expiry ||
      !cardData.cvc
    ) {
      messageApi.warning("Заполните все данные карты!");
      return;
    }
    messageApi.success(
      `Оплата ${data.price} С успешно выполнена! Промокод: ${
        promoCode || "не применён"
      } ✅`
    );
    setOpenModal(false);
    setCardData({ number: "", name: "", expiry: "", cvc: "", focus: "" });
    setPromoCode("");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month] = dateStr.split(".");
    const currentYear = new Date().getFullYear();
    const date = dayjs(`${currentYear}-${month}-${day}`, "YYYY-MM-DD");
    let formatted = date.format("dddd, D MMMM");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const faq = [
    {
      title: "На какой уровень рассчитаны мероприятия?",
      text: "Все зависит от темы. У нас есть дегустации, где кависты рассказывают самые азы, а есть развлекательные форматы, которые объединяют как новичков, так и опытных дегустаторов.",
    },
    {
      title: "Сколько человек обычно",
      text: "Обычно не более 6-10",
    },
    {
      title: "Сколько длится мероприятие? Могу ли я опоздать или раньше уйти?",
      text: "В среднем дегустация идет 1,5—2 часа. Опаздывать можно, но лучше быть вовремя — так вы не пропустите первый сет и начало рассказа кависта. Уйти пораньше тоже можно.",
    },
    {
      title: "Могу я поменять или вернуть билет?",
      text: "Вы можете сдать билет не позднее чем за 24 часа до начала дегустации.",
    },
    {
      title: "Будут ли закуски?",
      text: "Все дегустации сопровождаются сыром, оливками и хлебными палочками гриссини.",
    },
    {
      title: "После мероприятия я получу какие-то материалы?",
      text: "Если вы были на дегустации с презентацией, мы отправим ее по запросу.",
    },
    {
      title: "Если мне понравится что-то на мероприятии, я смогу это купить?",
      text: "Да! После мероприятия (кроме формата «Салон вин») у вас будет скидка 20% на ассортимент винотеки, за исключением товаров с фиксированной ценой, упаковки, сувениров",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      {contextHolder}
      <div className="pb-20 md:pb-0">
        <Header />

        <div className="mt-[170px] flex flex-col gap-8 justify-center items-center w-full px-4 md:px-0">
        <h2 className="text-gray-600 text-lg md:text-xl text-center max-w-3xl">
          Главная - Мероприятия с дегустацией -{" "}
          <span className="font-semibold">
            {data.fullname || "Загрузка..."}
          </span>
        </h2>

        {/* Блок с изображением */}
        <div
          className="w-full md:w-[92%] md:rounded-2xl p-8 flex flex-col gap-4 shadow-lg"
          style={{
            aspectRatio: data.ratio || "12/4",
            backgroundImage: data.image
              ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.image})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <span className="text-white text-lg md:text-xl text-center font-medium drop-shadow-md">
            {data.date ? formatDate(data.date) : "Дата загрузки..."} |{" "}
            {data.time || ""}
          </span>
          <h1 className="text-2xl md:text-4xl xl:text-5xl text-white text-center font-bold drop-shadow-lg">
            {data.fullname}
          </h1>
          <p className="text-white text-md md:text-lg text-center drop-shadow-md">
            Длительность — 1,5-2 часа. Дегустации доступны гостям старше 18 лет.
          </p>
          <Button
            onClick={() => setOpenModal(true)}
            className="mx-auto mt-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 py-3 text-lg"
          >
            Оплатить {data.price} С
          </Button>
        </div>

        {/* Адрес и описание */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3.5 !mt-3 w-11/12">
          <div className="flex flex-col gap-1 ">
            <h1 className="text-2xl !font-semibold">Адресс</h1>
            <p>{data.address}</p>
            <p>+(996) 704 222 666</p>
          </div>
          <div className="flex flex-col gap-1 ">
            <h1 className="text-2xl !font-semibold">Описание</h1>
            <p className="text-lg">{data.description}</p>
          </div>
        </div>

        {/* Как проходит мероприятие */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3.5 !mt-3 w-11/12">
          <h1 className="h-full border-r !font-semibold text-xl">
            Как проходит мероприятие
          </h1>
          <p className="text-lg">
            Все мероприятия проходят в общем зале винотеки или в отдельной
            комнате. За 1,5–2 часа вы узнаете о разных винных регионах,
            терруарах, особенностях производства и хранения вина, а также о
            выборе гастрономических сочетаний. В программу входит дегустация 5–6
            винных позиций в сопровождении легких закусок. В завершение вечера
            мы предложим скидку 20% на ассортимент винотеки — она действует
            только в день мероприятия и не распространяется на сувениры,
            упаковку, товары с фиксированной ценой.
          </p>
        </div>

        {/* FAQ Swiper */}
        <div className="w-11/12 mt-7">
          <h1 className="text-[28px] !font-semibold mb-5">FAQ</h1>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation
          >
            {faq.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="bg-gray-100 p-5 rounded-xl shadow-sm h-72 flex flex-col"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                  <p className="text-gray-800 text-base">{item.text}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Модалка оплаты */}
      <Modal
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
        centered
        className="!p-0"
      >
        <div className="text-center p-6">
          <h2 className="text-xl font-bold mb-4">Оплата</h2>

          <Cards
            number={cardData.number}
            name={cardData.name}
            expiry={cardData.expiry}
            cvc={cardData.cvc}
            focused={cardData.focus}
          />

          <Input
            type="tel"
            name="number"
            placeholder="Номер карты"
            value={cardData.number}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            maxLength={19}
            className="mb-3 mt-4"
          />
          <Input
            type="text"
            name="name"
            placeholder="Имя владельца"
            value={cardData.name}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="mb-3"
          />
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={cardData.expiry}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              maxLength={5}
            />
            <Input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={cardData.cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              maxLength={4}
            />
          </div>

          <Input
            type="text"
            placeholder="Промокод (если есть)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="mb-4"
          />

          <Button
            type="primary"
            size="large"
            onClick={handlePay}
            className="!bg-red-600 !border-red-600"
            block
          >
            Оплатить {data.price} С
          </Button>
        </div>
      </Modal>

        <Footer />
      </div>
      <MobileFooter />
    </>
  );
};

export default Event;
