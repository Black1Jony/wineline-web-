import React, { useState, useEffect } from "react";
import axios from "axios";
import { shopStore } from "../../utils/store/shopStore";
import { Modal, Input, Button, message as antdMessage } from "antd";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import MapModal from "../Map/Map";

const BuyingShop = ({ price, count, refProp, productsRef }) => {
  const deleteAll = shopStore((state) => state.clearProducts);

  const [modalOpen, setModalOpen] = useState(false);
  const [geoOpen, setGeoOpen] = useState(false);
  const [geo, setGeo] = useState(
    JSON.parse(localStorage.getItem("userGeoposition")) || null
  );
  const [promoCode, setPromoCode] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });
  const [amount, setAmount] = useState(price);

  const [messageApi, contextHolder] = antdMessage.useMessage();

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "number") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }

    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }

    if (name === "cvc") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardData({ ...cardData, [name]: value });
  };

  const handleInputFocus = (e) =>
    setCardData({ ...cardData, focus: e.target.name });

  const validateCard = () => {
    const { number, name, expiry, cvc } = cardData;

    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(number)) {
      messageApi.warning("Введите корректный номер карты (16 цифр)!");
      return false;
    }

    if (!name.trim()) {
      messageApi.warning("Введите имя владельца карты!");
      return false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      messageApi.warning("Введите корректный срок действия (MM/YY)!");
      return false;
    } else {
      const [mm, yy] = expiry.split("/").map(Number);
      const now = new Date();
      const expDate = new Date(2000 + yy, mm);
      if (expDate < now) {
        messageApi.error("Срок действия карты истёк!");
        return false;
      }
    }

    if (!/^\d{3,4}$/.test(cvc)) {
      messageApi.warning("Введите корректный CVC (3-4 цифры)!");
      return false;
    }

    return true;
  };

  const handleBuy = async () => {
    const userId = localStorage.getItem("user");
    if (!userId) {
      messageApi.error("Пожалуйста, авторизуйтесь!");
      return;
    }

    if (!validateCard()) return;

    try {
      const code = promoCode || `SHOP-${Date.now()}`;

      const response = await axios.post("http://localhost:3000/card", {
        code,
        amount,
        infinite: false,
        userId,
      });

      messageApi.success(
        `Покупка успешно оформлена! Код: ${response.data.code}`
      );

      // очистка корзины + localStorage
      deleteAll();
      localStorage.removeItem("shop-storage");

      // сброс данных
      setModalOpen(false);
      setCardData({ number: "", name: "", expiry: "", cvc: "", focus: "" });
      setPromoCode("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      messageApi.error(
        "Ошибка при оформлении: " + (err.response?.data?.error || err.message)
      );
    }
  };

  useEffect(() => {
    const payment = refProp.current;
    const products = productsRef.current;
    if (!payment || !products) return;

    const topOffset = 20;

    const onScroll = () => {
      const productsRect = products.getBoundingClientRect();
      const paymentHeight = payment.offsetHeight;
      const parent = payment.parentElement;
      const parentRect = parent.getBoundingClientRect();

      if (
        productsRect.top <= topOffset &&
        productsRect.bottom >= paymentHeight + topOffset
      ) {
        payment.style.position = "fixed";
        payment.style.top = `${topOffset}px`;
        payment.style.left = `${parentRect.left}px`;
        payment.style.width = `${parent.offsetWidth}px`;
        payment.style.zIndex = "1";
      } else if (productsRect.top > topOffset) {
        payment.style.position = "static";
        payment.style.width = "";
        payment.style.left = "";
        payment.style.zIndex = "";
      } else {
        payment.style.position = "absolute";
        payment.style.top = `${products.offsetHeight - paymentHeight}px`;
        payment.style.left = "0";
        payment.style.width = "100%";
        payment.style.zIndex = "";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [productsRef, refProp]);

  return (
    <>
      {contextHolder}
      <div
        ref={refProp}
        className="w-full flex flex-col gap-3 bg-white h-[400px] rounded-2xl p-4 sticky top-5"
      >
        <div
          className="text-2xl font-Arial !font-semibold text-[#c2c2c2] cursor-pointer"
          onClick={async () => {
            deleteAll();
            localStorage.removeItem("shop-storage");
            await axios.delete(
              `http://localhost:3000/shop/${localStorage.getItem("user")}`
            );
          }}
        >
          Очистить корзину
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            className="w-1/2 h-10 px-3 py-1 box-border rounded-2xl border border-[#9b9999]"
            placeholder="Промокод"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button
            className="w-1/2 bg-[#cfcfcf] text-white rounded-xl"
            onClick={() => messageApi.info("Промокод применён!")}
          >
            Применить
          </Button>
        </div>

        <div className="flex flex-col font-Arial border-b border-[#b4b4b4] gap-2 w-full text-[#a5a5a5]">
          <div className="flex justify-between w-full">
            <h1 className="text-xl">Всего Товаров</h1>
            <h3 className="text-[16px]">{count}</h3>
          </div>
          <div className="flex justify-between w-full">
            <h1 className="text-xl">Сумма</h1>
            <h3 className="text-[16px]">{price}</h3>
          </div>
        </div>

        <div className="flex justify-between">
          <h1 className="text-3xl font-arial !font-semibold">Итого</h1>
          <h1 className="text-3xl font-arial !font-semibold">{price} С</h1>
        </div>

        <Button
          className="flex justify-center items-center w-full rounded-2xl bg-[#3a3a3a] !font-Arial text-2xl text-white"
          onClick={() => setModalOpen(true)}
        >
          Купить
        </Button>
      </div>

      <Modal
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
        centered
        className="!p-0"
        title="Данные для оплаты"
      >
        <div className="text-center p-6 flex flex-col gap-4">
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
            />
            <Input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={cardData.cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>

          <div className="flex justify-between gap-2">
            <Button
              onClick={() => setGeoOpen(true)}
              className="bg-blue-600 text-white rounded-xl"
            >
              Указать геопозицию
            </Button>

            <Button
              type="primary"
              onClick={handleBuy}
              className="bg-green-600 text-white rounded-xl"
            >
              Оплатить
            </Button>
          </div>

          {geo && (
            <div className="mt-2 text-gray-700">
              <b>Геопозиция:</b> {geo.address} ({geo.lat}, {geo.lon})
            </div>
          )}
        </div>
      </Modal>

      {geoOpen && (
        <MapModal
          userId={localStorage.getItem("user")}
          onClose={() => setGeoOpen(false)}
        />
      )}
    </>
  );
};

export default BuyingShop;
