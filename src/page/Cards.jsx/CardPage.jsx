import Header from "../../components/Header/Header";
import CardBanner from "../../components/CardComponent/Banner";
import { Modal, Radio, Input, Button, message as antdMessage } from "antd";
import { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import api from "../../utils/api";
import {
  GiftOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Footer from "../../components/Footer/Footer";

const CardPage = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(3000);
  const [certificateName, setCertificateName] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });
  const [createdCode, setCreatedCode] = useState("");

  const [messageApi, contextHolder] = antdMessage.useMessage();

  const handleInputChange = (e) =>
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  const handleInputFocus = (e) =>
    setCardData({ ...cardData, focus: e.target.name });

  const handleBuy = async () => {
    if (!certificateName) {
      messageApi.warning("Введите название сертификата!");
      return;
    }

    const userId = localStorage.getItem("user");
    if (!userId) {
      messageApi.error("Зарегистрируйтесь, чтобы создать сертификат");
      return;
    }

    try {
      const code = `${certificateName}-${Date.now()}`;

      const response = await api.post("/card", {
        code,
        amount: value,
        infinite: false,
        userId,
      });

      setCreatedCode(response.data.code);

      messageApi.success(
        `Сертификат "${certificateName}" на ${value} успешно создан!`
      );

      // Закрываем модалку и очищаем поля
      setOpen(false);
      setCertificateName("");
      setCardData({ number: "", name: "", expiry: "", cvc: "", focus: "" });
      setValue(3000);
      setCreatedCode("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      messageApi.error(
        "Ошибка при создании сертификата: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Header show={true} />
      <CardBanner onBuyClick={() => setOpen(true)} />

      {/* Гайд / Информационные карточки */}
      <div className="max-w-6xl mx-auto mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-4">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <GiftOutlined style={{ fontSize: 40, color: "#f87171" }} />
          <h3 className="text-xl font-bold mt-4 mb-2">Выберите подарок</h3>
          <p className="text-gray-600">
            Определитесь с номиналом подарочного сертификата для ваших друзей
            или близких.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <CreditCardOutlined style={{ fontSize: 40, color: "#f87171" }} />
          <h3 className="text-xl font-bold mt-4 mb-2">Введите данные карты</h3>
          <p className="text-gray-600">
            Введите данные для оплаты. Карта отображается только визуально,
            реальной оплаты не происходит.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <CheckCircleOutlined style={{ fontSize: 40, color: "#f87171" }} />
          <h3 className="text-xl font-bold mt-4 mb-2">Получите код</h3>
          <p className="text-gray-600">
            После оплаты вы получите уникальный код сертификата, который можно
            подарить.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <InfoCircleOutlined style={{ fontSize: 40, color: "#f87171" }} />
          <h3 className="text-xl font-bold mt-4 mb-2">Используйте один раз</h3>
          <p className="text-gray-600">
            Сертификат действителен один раз, срок действия — 6 месяцев с
            момента покупки.
          </p>
        </div>
      </div>
      <Footer/>
      {/* Модалка */}
      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        centered
        className="!p-0"
      >
        <div className="text-center p-6">
          <h2 className="text-xl font-bold mb-4">Подарочный сертификат</h2>

          <Input
            placeholder="Название сертификата"
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
            className="mb-4"
          />

          {createdCode && (
            <div className="mb-4 text-green-700 font-semibold">
              Код сертификата: {createdCode}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <Cards
              number={cardData.number}
              name={cardData.name}
              expiry={cardData.expiry}
              cvc={cardData.cvc}
              focused={cardData.focus}
            />
          </div>

          <Input
            type="tel"
            name="number"
            placeholder="Номер карты"
            value={cardData.number}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            maxLength={19}
            className="mb-3"
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

          <div className="mb-4">
            <p className="text-gray-600 mb-2">Выберите номинал:</p>
            <Radio.Group
              onChange={(e) => setValue(e.target.value)}
              value={value}
              className="flex justify-center gap-4 flex-wrap"
            >
              <Radio.Button value={1000}>1000 с</Radio.Button>
              <Radio.Button value={3000}>3000 с</Radio.Button>
              <Radio.Button value={5000}>5000 с</Radio.Button>
              <Radio.Button value={10000}>10000 с</Radio.Button>
            </Radio.Group>
          </div>

          <p className="text-lg font-semibold text-gray-800 mb-4">
            Цена: {value} с
          </p>

          <Button
            type="primary"
            size="large"
            onClick={handleBuy}
            className="!bg-red-600 !border-red-600"
            block
          >
            Оплатить {certificateName ? `"${certificateName}"` : "сертификат"}{" "}
            на {value} с
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CardPage;
