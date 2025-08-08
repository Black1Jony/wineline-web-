import React from "react";

const BuyTovar = ({ price = "10990 ₽", discount }) => {
  const originalPriceNum = Math.max(
    0,
    parseFloat(String(price).replace(/[^\d.]/g, "")) || 0
  );

  const hasDiscount =
    discount !== undefined && discount !== null && !isNaN(parseFloat(discount));

  const discountValue = hasDiscount ? Math.abs(parseFloat(discount)) / 100 : 0;
  const finalPriceNum = originalPriceNum * (1 - discountValue);

  const formatPrice = (num) => {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  };

  const originalPrice = formatPrice(originalPriceNum);
  const finalPrice = formatPrice(finalPriceNum);

  return (
    <div className=" bg-[#f4f4f4] rounded-md p-4 h-[320px]">
      {hasDiscount && (
        <div className="w-1/5 rounded-2xl text-[#f75050] font-bold text-sm uppercase mb-1 bg-[#faa9a9]">
          СПЕЦЦЕНА
        </div>
      )}
      {" "}
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
      <button className="w-full bg-black text-white py-2 uppercase font-medium mb-4 hover:bg-gray-800 transition-colors">
        В корзину
      </button>
      <div className="text-xs">
        <p className="font-medium mb-1">Способы получения заказа:</p>
        <ul className="space-y-1">
          <li className="flex items-start">
            <span className="block w-1 h-1 bg-black rounded-full mt-1.5 mr-2"></span>
            Забрать сегодня из 93 винотек
          </li>
          <li className="flex items-start">
            <span className="block w-1 h-1 bg-black rounded-full mt-1.5 mr-2"></span>
            Самовывоз с завтрашнего дня из любой винотеки
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BuyTovar;
