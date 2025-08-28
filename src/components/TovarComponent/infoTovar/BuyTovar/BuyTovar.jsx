import axios from "axios";
import { shopStore } from "../../../../utils/store/shopStore";
import { message } from "antd";

const BuyTovar = ({ data, price = "10990 ₽", discount }) => {
  const token = localStorage.getItem("token");
  const currentUse = localStorage.getItem("user");

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
    if (!token) return message.warning("Вы должны зарегистрироватся");

    addProduct({ product: data.id, count: 1, price: data?.price?.meta });
    try {
      await axios.post(`http://localhost:3000/shop/${currentUse}/add`, {
        product: data.id,
        count: 1,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMinus = async () => {
    if (!currentProduct) return;

    if (currentProduct.count > 1) {
      productMinus(data.id);
      try {
        await axios.post(`http://localhost:3000/shop/${currentUse}/minus`, {
          product: data.id,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      removeProduct(data.id);
      try {
        await axios.delete(
          `http://localhost:3000/shop/${currentUse}/${data.id}`
        );
        message.success("Товар удалён из корзины");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePlus = async () => {
    if (!currentProduct) return;

    productPlus(data.id);
    try {
      await axios.post(`http://localhost:3000/shop/${currentUse}/plus`, {
        product: data.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#f4f4f4] rounded-md p-4 h-[320px]">
      {hasDiscount && (
        <div className="w-1/5 rounded-2xl text-[#f75050] font-bold text-sm uppercase mb-1 bg-[#faa9a9]">
          СПЕЦЦЕНА
        </div>
      )}

      <div className="mb-4">
        {hasDiscount ? (
          <>
            <div className="line-through text-gray-500 text-lg">
              {originalPrice}
            </div>
            <div className="text-2xl font-bold text-gray-900">{finalPrice}</div>
          </>
        ) : (
          <div className="text-2xl font-bold text-gray-900">
            {originalPrice}
          </div>
        )}
      </div>

      {!inShop ? (
        <button
          className="w-full bg-black !text-white text-[11px] font-normal py-[9px] rounded-[6px] cursor-pointer"
          onClick={handleAdd}
        >
          В корзину
        </button>
      ) : (
        <div className="w-full bg-[#f2f3f5] !text-black text-[19px] h-8 !font-semibold py-[2px] px-6 flex justify-between items-center rounded-[6px] cursor-pointer font-Arial">
          <div onClick={handleMinus} className="select-none cursor-pointer">
            -
          </div>
          <div>{currentProduct.count} Шт.</div>
          <div onClick={handlePlus} className="select-none cursor-pointer">
            +
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyTovar;
