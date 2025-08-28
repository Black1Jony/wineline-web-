import { shopStore } from "../../utils/store/shopStore";
import { useState } from "react";
import { HeartOutlined, HeartFilled, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
const BuyCrad = ({ data }) => {
  console.log(data);
  
  const textData = data.characteristics.wineCharacteristics;
  const productPlus = shopStore((state) => state.productPlus);
  const productMinus = shopStore((state) => state.productMinus);
  const removeProduct = shopStore((state) => state.removeProduct);
  const [isLiked, setIsLiked] = useState(false);
  const allPrice = data.count * data.price.meta;
  const user = localStorage.getItem('user')
  return (
    <di>
      <div className="w-full flex flex-col gap-7 border-b border-[#c4c4c4] ">
        <div className="flex gap-2 ">
          <div>
            <img
              src={data.images[0]}
              alt=""
              className="w-[120px] max-h-[140px] object-contain mb-2"
            />
          </div>
          <div className="font-Arial flex flex-col gap-1 w-2/3">
            <h1 className="text-xl !font-semibold scale-y-110">
              {data.fullName}
            </h1>
            <div className="flex flex-wrap text-lg font-Arial text-[#a7a7a7]">
              {textData?.Вино}, {textData?.["Страна, регион"]} {textData?.Объем},
              {textData?.Класс}
              {textData?.Сахар}
            </div>
          </div>
          <div className="flex flex-col items-end text-[21px] w-1/3">
            <CloseOutlined
              onClick={async () => {
                removeProduct(data.id);
                await axios.delete(
                  `http://localhost:3000/shop/${user}/${data.id}`
                );
              }}
            />
            {isLiked && (
              <HeartFilled
                className="!text-red-700"
                onClick={() => setIsLiked(false)}
              />
            )}
            {!isLiked && (
              <HeartOutlined
                className="text-red-700"
                onClick={() => setIsLiked(true)}
              />
            )}
          </div>
        </div>
        <div className="flex justify-evenly items-center mb-2">
          <div>
            <h1 className="font-Arial text-xl !font-semibold">{allPrice} С</h1>
          </div>
          <div className="rounded-xl bg-[#f2f3f5] border border-[#414141] h-8 flex justify-between px-2 items-center w-1/5 font-Arial">
            <div
              onClick={async () => {
                if (data.count > 1) {
                  productMinus(data.id);
                  await axios.post(`http://localhost:3000/shop/${user}/minus`, {
                    product: data.id,
                  });
                } else {
                  removeProduct(data.id);
                  await axios.delete(
                    `http://localhost:3000/shop/${user}/${data.id}`
                  );
                }
              }}
            >
              -
            </div>
            <div>{data.count}</div>
            <div
              onClick={async () => {
                productPlus(data.id);
                await axios.post(`http://localhost:3000/shop/${user}/plus`, {
                  product: data.id,
                });
              }}
            >
              +
            </div>
          </div>
        </div>
      </div>
    </di>
  );
};

export default BuyCrad;
