import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { shopStore } from "../../utils/store/shopStore";
import { Modal, Input, Button, message as antdMessage } from "antd";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

const BuyingShopNoScroll = ({ price, count, refProp, productsRef }) => {
  const deleteAll = shopStore((state) => state.clearProducts);

  const [modalOpen, setModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [isPayingWithPoints, setIsPayingWithPoints] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });

  const [messageApi, contextHolder] = antdMessage.useMessage();

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "number") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
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

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    try {
      const response = await api.post(
        `/apply/${localStorage.getItem("user")}`,
        {
          code: promoCode.trim(),
        }
      );

      setAppliedPromo(response.data);
      setDiscount(Number(response.data.amount) || 0);
      messageApi.success(
        `Промокод "${promoCode}" применён! Скидка: ${response.data.amount} ₽`
      );
    } catch (err) {
      messageApi.error(
        err.response?.data?.error || "Ошибка при применении промокода"
      );
    }
  };

  const handlePayWithPoints = async () => {
    const uid = localStorage.getItem("user");
    if (!uid) {
      messageApi.error("Пользователь не найден");
      return;
    }
    if (userScore <= 0) {
      messageApi.warning("Недостаточно баллов");
      return;
    }
    if (userScore < Number(amount)) {
      messageApi.warning(`Недостаточно баллов. Доступно: ${userScore}, требуется: ${Number(amount)}`);
      return;
    }
    setIsPayingWithPoints(true);
    try {
      if (!(Number(amount) > 0)) {
        messageApi.error("Сумма должна быть положительной");
        return;
      }
      
      // Списываем баллы через специальный эндпоинт
      await api.post(`/user/score/minus`, { id: uid, amount: Number(amount) });
      
      // Получаем обновленное количество баллов
      const userResp = await api.get(`/users/${uid}`);
      const newScore = userResp.data?.score || 0;
      
      messageApi.success(`Оплата баллами прошла успешно! Потрачено баллов: ${Number(amount)}. Остаток: ${newScore}`);

      // Показываем уведомление о доставке
      setTimeout(() => {
        messageApi.success({
          content: (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <div className="font-bold text-green-600">Спасибо за покупку!</div>
                <div className="text-sm">Ожидайте курьера в течение 3 дней</div>
              </div>
            </div>
          ),
          duration: 8,
        });
      }, 1000);

      // Очистка корзины
      deleteAll();
      localStorage.removeItem("shop-storage");
      await api.delete(`/shop/${uid}`);
      
      // Обновляем количество баллов
      setUserScore(newScore);
      
    } catch (err) {
      messageApi.error(
        err?.response?.data?.message || "Ошибка при оплате баллами"
      );
    } finally {
      setIsPayingWithPoints(false);
    }
  };

  const handleBuy = async () => {
    if (!validateCard()) return;
    if (!(Number(amount) > 0)) {
      messageApi.error("Сумма должна быть положительной");
      return;
    }

    try {
      const payload = {
        amount: Number(amount),
        infinite: false,
        userId: localStorage.getItem("user"),
        code: appliedPromo?.code || "SHOP",
      };
      const response = await api.post("/card", payload);

      // Начисляем баллы за покупку
      try {
        await api.post("/user/score", { 
          id: localStorage.getItem("user"), 
          amount: Number(amount) 
        });
        
        // Получаем обновленное количество баллов
        const userResp = await api.get(`/users/${localStorage.getItem("user")}`);
        const newScore = userResp.data?.score || 0;
        
        messageApi.success(
          `Покупка успешно оформлена! Код: ${response.data.code}. Начислено баллов: ${Math.round(Number(amount) / 25)}. Всего баллов: ${newScore}`
        );
        
        // Показываем уведомление о доставке сразу
        messageApi.success({
          content: (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <div className="font-bold text-green-600">Спасибо за покупку!</div>
                <div className="text-sm">Ожидайте курьера в течение 3 дней</div>
              </div>
            </div>
          ),
          duration: 8,
        });
      } catch (scoreErr) {
        messageApi.warning("Покупка прошла успешно, но не удалось начислить баллы");
        console.error("Score update error:", scoreErr);
        
        // Показываем уведомление о доставке даже если не удалось начислить баллы
        messageApi.success({
          content: (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <div className="font-bold text-green-600">Спасибо за покупку!</div>
                <div className="text-sm">Ожидайте курьера в течение 3 дней</div>
              </div>
            </div>
          ),
          duration: 8,
        });
      }

      // Убираем товары сразу после успешной покупки
      deleteAll();
      localStorage.removeItem("shop-storage");
      await api.delete(`/shop/${localStorage.getItem("user")}`);

      // Закрываем модалку с задержкой, чтобы уведомление успело показаться
      setTimeout(() => {
        setModalOpen(false);
        setCardData({ number: "", name: "", expiry: "", cvc: "", focus: "" });
        setPromoCode("");
        setAppliedPromo(null);
        setDiscount(0);
        setAmount(0);
      }, 2000);
      
      // Обновляем количество баллов пользователя
      const userResp = await api.get(`/users/${localStorage.getItem("user")}`);
      setUserScore(userResp.data?.score || 0);
      
    } catch (err) {
      messageApi.error(
        "Ошибка при оформлении: " + (err.response?.data?.error || err.message)
      );
    }
  };

  useEffect(() => {
    const fetchUserScore = async () => {
      try {
        const uid = localStorage.getItem("user");
        if (!uid) return;
        const resp = await api.get(`/users/${uid}`);
        setUserScore(Number(resp?.data?.score || 0));
      } catch {
        setUserScore(0);
      }
    };
    fetchUserScore();
  }, []);

  useEffect(() => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    const next = Math.max(0, p - d);
    setAmount(next);
  }, [price, discount]);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {contextHolder}
      {isVisible && (
        <div
          ref={refProp}
          className="w-full flex flex-col gap-3 bg-white h-auto rounded-2xl p-4"
        >
          <div
            className="text-2xl font-Arial !font-semibold text-[#c2c2c2] cursor-pointer"
            onClick={() => {
              deleteAll();
              localStorage.removeItem("shop-storage");
            }}
          >
            Очистить корзину
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              className="w-full sm:w-1/2 h-10 px-3 py-1 box-border rounded-2xl border border-[#9b9999]"
              placeholder="Промокод"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button
              className="w-full sm:w-1/2 bg-[#cfcfcf] text-white rounded-xl"
              onClick={applyPromoCode}
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
              <h3 className="text-[16px]">{price} ₽</h3>
            </div>
            {discount > 0 && (
              <div className="flex justify-between w-full text-green-600">
                <h1 className="text-xl">Скидка</h1>
                <h3 className="text-[16px]">-{discount} ₽</h3>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <h1 className="text-3xl font-arial !font-semibold">Итого</h1>
            <h1 className="text-3xl font-arial !font-semibold">{Number(amount) || 0} ₽</h1>
          </div>

          {userScore > 0 && (
            <Button
              disabled={isPayingWithPoints || amount <= 0 || userScore < Number(amount)}
              className={`flex justify-center items-center w-full rounded-2xl !font-Arial text-xl text-white ${
                userScore >= Number(amount) && Number(amount) > 0 
                  ? "bg-[#8a2be2] hover:bg-[#7a1be2]" 
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handlePayWithPoints}
            >
              {isPayingWithPoints ? (
                "Обработка..."
              ) : userScore < Number(amount) ? (
                `Недостаточно баллов (${userScore}/${Number(amount)})`
              ) : (
                `Оплатить баллами (${userScore} баллов)`
              )}
            </Button>
          )}

          <Button
            className="flex justify-center items-center w-full rounded-2xl bg-[#3a3a3a] !font-Arial text-2xl text-white"
            onClick={() => setModalOpen(true)}
          >
            Купить
          </Button>
        </div>
      )}

      {/* Render modal */}
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

          <Button
            type="primary"
            onClick={handleBuy}
            className="bg-green-600 text-white rounded-xl"
          >
            Оплатить
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BuyingShopNoScroll;
