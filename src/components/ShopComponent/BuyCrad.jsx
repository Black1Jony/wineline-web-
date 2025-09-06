import { shopStore } from "../../utils/store/shopStore";
import { useState } from "react";
import { HeartOutlined, HeartFilled, CloseOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import { message } from "antd";
import { favoriteStore } from "../../utils/store/favoriteStore";
const BuyCrad = ({ data }) => {
  const textData = data?.characteristics?.wineCharacteristics || {};
  const productPlus = shopStore((state) => state.productPlus);
  const productMinus = shopStore((state) => state.productMinus);
  const removeProduct = shopStore((state) => state.removeProduct);
  const [isLiked, setIsLiked] = useState(false);
  const allPrice = (+data?.count || 0) * (+data?.price?.meta || 0);
  const user = localStorage.getItem("user");
  const [messageApi, contextHolder] = message.useMessage();
  const token = localStorage.getItem("token");
  const addFavorite = favoriteStore((state) => state.addFavorite);
  const removeFavorite = favoriteStore((state) => state.removeFavorite);
  const currentUse = localStorage.getItem("user")
  const favorites = favoriteStore((state) => state.favorites);
  useState(() => {
    setIsLiked(favorites.includes(data.id));
  });
   const toggleLike = async () => {
     if (!token) {
       messageApi.open({
         type: "warning",
         content: "вы должны зарегистрироватся",
       });
       return;
     }

     const newLikedState = !isLiked;
     setIsLiked(newLikedState);

     try {
       if (newLikedState) {
         addFavorite(data.id);
         await api.post(`/favorite/${currentUse}`, {
           id: data.id,
         });
         messageApi.open({ type: "success", content: "Добавлено в избранное" });
       } else {
         removeFavorite(data.id);
         await api.delete(`/favorite/${currentUse}`, {
           data: { id: data.id },
         });
         messageApi.open({ type: "success", content: "Удалено из избранного" });
       }
     } catch (err) {
       console.error(err);
       messageApi.open({
         type: "error",
         content: "Ошибка при обновлении избранного",
       });
       setIsLiked(!newLikedState);
     }
   };
  return (
    <div>
      <div className="w-full flex flex-col gap-7 border-b border-[#c4c4c4] ">
        <div className="flex gap-2 ">
          <div>
            <img
              src={data?.images?.[0] || ""}
              alt=""
              className="w-[120px] max-h-[140px] object-contain mb-2"
            />
          </div>
          <div className="font-Arial flex flex-col gap-1 w-2/3">
            <h1 className="text-xl !font-semibold scale-y-110">
              {data?.fullName || ""}
            </h1>
            <div className="flex flex-wrap text-lg font-Arial text-[#a7a7a7]">
              {textData?.Вино}, {textData?.["Страна, регион"]} {textData?.Объем}
              ,{textData?.Класс}
              {textData?.Сахар}
            </div>
          </div>
          <div className="flex flex-col items-end text-[21px] w-1/3">
            <CloseOutlined
              onClick={async () => {
                if (data?.id) {
                  removeProduct(data.id);
                  await api.delete(`/shop/${user}/${data.id}`);
                }
              }}
            />
            {isLiked && (
              <HeartFilled
                className="!text-red-700"
                onClick={toggleLike}
              />
            )}
            {!isLiked && (
              <HeartOutlined
                className="text-red-700"
                onClick={() => toggleLike()}
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
                if ((data?.count || 0) > 1 && data?.id) {
                  productMinus(data.id);
                  await api.post(`/shop/${user}/minus`, {
                    product: data.id,
                  });
                } else if (data?.id) {
                  removeProduct(data.id);
                  await api.delete(`/shop/${user}/${data.id}`);
                }
              }}
            >
              -
            </div>
            <div>{data?.count || 0}</div>
            <div
              onClick={async () => {
                if (data?.id) {
                  productPlus(data.id);
                  await api.post(`/shop/${user}/plus`, {
                    product: data.id,
                  });
                }
              }}
            >
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCrad;
