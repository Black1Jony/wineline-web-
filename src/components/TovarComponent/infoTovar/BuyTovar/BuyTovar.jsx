import api from "../../../../utils/api";
import { shopStore } from "../../../../utils/store/shopStore";
import { message } from "antd";
import { useState } from "react";

const BuyTovar = ({ data, price = "10990 ₽", discount }) => {
  const token = localStorage.getItem("token");
  const currentUse = localStorage.getItem("user");
  const [pending, setPending] = useState(false);

  // Zustand store - реактивно подписываемся на массив products
  const addProduct = shopStore((state) => state.addProduct);
  const productPlus = shopStore((state) => state.productPlus);
  const productMinus = shopStore((state) => state.productMinus);
  const removeProduct = shopStore((state) => state.removeProduct);
  const products = shopStore((state) => state.products);

  const currentProduct = products.find((p) => p.product === data.id);
  const inShop = !!currentProduct;

  const originalPriceNum =
    parseFloat(String(price).replace(/[^\d.]/g, "")) || 0;
  const hasDiscount =
    discount !== undefined && discount !== null && !isNaN(parseFloat(discount));
  const discountValue = hasDiscount ? Math.abs(parseFloat(discount)) / 100 : 0;
  const finalPriceNum = originalPriceNum * (1 - discountValue);

  const formatPrice = (num) =>
    num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  const originalPrice = formatPrice(originalPriceNum);
  const finalPrice = formatPrice(finalPriceNum);

  const handleAdd = async () => {
    if (!data?.id) return message.error("Товар не найден");
    if (!token) return message.warning("Вы должны зарегистрироваться");
    if (pending) return;
    // debug
    console.log("ADD_TO_CART", { userId: currentUse, productId: data.id });
    addProduct({ product: data.id, count: 1, price: data?.price?.meta });
    const hide = message.loading({ content: "Добавляем в корзину...", key: "add-to-cart" });
    try {
      setPending(true);
      await api.post(`/shop/${currentUse}/add`, {
        product: data.id,
        count: 1,
      });
      message.success({ content: "Товар добавлен в корзину", key: "add-to-cart", duration: 1.2 });
    } catch (err) {
      console.error(err);
      message.error({ content: "Не удалось добавить в корзину", key: "add-to-cart" });
    } finally {
      hide && hide();
      setPending(false);
    }
  };

  const handleMinus = async () => {
    if (!currentProduct) return;
    if (pending) return;
    console.log("CART_MINUS", { userId: currentUse, productId: data.id });
    if (currentProduct.count > 1) {
      productMinus(data.id);
      try {
        setPending(true);
        await api.post(`/shop/${currentUse}/minus`, {
          product: data.id,
        });
        message.success({ content: "Количество уменьшено", duration: 0.8 });
      } catch (err) {
        console.error(err);
        message.error("Ошибка при уменьшении количества");
      } finally {
        setPending(false);
      }
    } else {
      removeProduct(data.id);
      try {
        setPending(true);
        await api.delete(
          `/shop/${currentUse}/${data.id}`
        );
        message.success("Товар удалён из корзины");
      } catch (err) {
        console.error(err);
        message.error("Ошибка при удалении из корзины");
      } finally {
        setPending(false);
      }
    }
  };

  const handlePlus = async () => {
    if (!currentProduct) return;
    if (pending) return;
    console.log("CART_PLUS", { userId: currentUse, productId: data.id });
    productPlus(data.id);
    try {
      setPending(true);
      await api.post(`/shop/${currentUse}/plus`, {
        product: data.id,
      });
      message.success({ content: "Количество увеличено", duration: 0.8 });
    } catch (err) {
      console.error(err);
      message.error("Ошибка при увеличении количества");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#ededed] p-4 md:p-5 shadow-sm lg:sticky lg:top-28">
      {hasDiscount ? (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff0f0] text-[#d73434] text-xs font-semibold mb-3">
          Спеццена
          <span className="text-[10px] uppercase bg-[#d73434] text-white px-1.5 py-[2px] rounded">
            -{Math.round(discount)}%
          </span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f5] text-[#6b7280] text-xs font-semibold mb-3">
          Обычная цена
        </div>
      )}

      <div className="mb-4">
        {hasDiscount ? (
          <>
            <div className="line-through text-gray-500 text-base">{originalPrice}</div>
            <div className="text-[26px] leading-none font-bold text-[#111] mt-1">{finalPrice}</div>
            <div className="text-[12px] text-gray-500 mt-1">Цена с учётом скидки</div>
          </>
        ) : (
          <div>
            <div className="text-[26px] leading-none font-bold text-[#111]">{originalPrice}</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[#16a34a] mb-3">
        <span className="font-semibold">В наличии</span>
        <span className="text-[#6b7280]">Доставка: 1–2 дня</span>
      </div>

      {!inShop ? (
        <button
          type="button"
          className="relative z-10 w-full bg-[#111] hover:bg-[#000] transition-colors !text-white text-[13px] font-medium py-3 rounded-lg cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed pointer-events-auto"
          onClick={handleAdd}
          disabled={pending}
        >
          {pending ? "Добавляем..." : "Добавить в корзину"}
        </button>
      ) : (
        <div className="w-full bg-[#f2f3f5] !text-black text-[18px] h-10 !font-semibold py-[2px] px-6 flex justify-between items-center rounded-lg cursor-pointer font-Arial border border-[#e6e6e6] pointer-events-auto">
          <div onClick={handleMinus} className="select-none cursor-pointer text-xl opacity-100" aria-label="Уменьшить" role="button" tabIndex={0}>
            −
          </div>
          <div className="text-sm" aria-live="polite">{currentProduct.count} шт.</div>
          <div onClick={handlePlus} className="select-none cursor-pointer text-xl" aria-label="Увеличить" role="button" tabIndex={0}>
            +
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-[#4b5563]">
        <div className="rounded-lg border border-[#eeeeee] px-2.5 py-2 bg-[#fafafa]">Безопасная оплата</div>
        <div className="rounded-lg border border-[#eeeeee] px-2.5 py-2 bg-[#fafafa]">Возврат 14 дней</div>
        <div className="rounded-lg border border-[#eeeeee] px-2.5 py-2 bg-[#fafafa]">Бонусы за покупку</div>
        <div className="rounded-lg border border-[#eeeeee] px-2.5 py-2 bg-[#fafafa]">Поддержка 24/7</div>
      </div>
    </div>
  );
};

export default BuyTovar;
