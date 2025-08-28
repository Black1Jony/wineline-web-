import { useState, useEffect} from "react";
import { message } from "antd";
import { HeartOutlined, HeartFilled, DeleteOutlined  } from "@ant-design/icons";
import s from "./card.module.css";
import { useNavigate } from "react-router-dom";
import { getinfo } from "./cardgetData";
import { useCountStore } from "../../utils/store/countTovarsstore";
import { shopStore } from "../../utils/store/shopStore";
import axios from "axios";
import { hiddenStore } from "../../utils/store/hiddenStore";

import { favoriteStore } from "../../utils/store/favoriteStore";
const Card = ({ data, showDelete = false, onDelete }) => {
  const { decrement } = useCountStore();
  const favorites = favoriteStore((state) => state.favorites);
  const [isLiked, setIsLiked] = useState(() => favorites.includes(data.id));
  const [messageApi, contextHolder] = message.useMessage();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const currentUse = localStorage.getItem("user");

  const article = data.article?.replace(/\D/g, "");
  const image = data?.images?.[0];

  const priceValue = data.price?.meta || 0;
  const saleValue = data.price?.sale || null;

  const price = priceValue + " С";
  const hasSale = saleValue;

  const [hiddenCard, setHiddenCard] = useState(false);

  const addProduct = shopStore((state) => state.addProduct);
  const productPlus = shopStore((state) => state.productPlus);
  const productMinus = shopStore((state) => state.productMinus);
  const removeProduct = shopStore((state) => state.removeProduct);
  const products = shopStore((state) => state.products);
  const addFavorite = favoriteStore((state) => state.addFavorite);
  const removeFavorite = favoriteStore((state) => state.removeFavorite);
  const hideAProduct = hiddenStore((state) => state.hideAProduct);
  useEffect(() => {
    if (hiddenCard) {
      hideAProduct(data.id);
    }
  }, [hiddenCard, data.id, hideAProduct]);

  if (hiddenCard) return null; // теперь безопасно, хуки уже вызваны

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
        await axios.post(`http://localhost:3000/favorite/${currentUse}`, {
          id: data.id,
        });
        messageApi.open({ type: "success", content: "Добавлено в избранное" });
      } else {
        removeFavorite(data.id);
        await axios.delete(`http://localhost:3000/favorite/${currentUse}`, {
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

  const copyArt = () => {
    navigator.clipboard.writeText(article);
    messageApi.open({
      type: "success",
      content: "Артикуль скопирован",
    });
  };

  const getoldPrice = () => {
    if (!hasSale) return null;
    const str = String(hasSale).match(/\d+/)?.[0];
    if (!str) return null;
    return Math.ceil((priceValue * 100) / (100 - Number(str)));
  };

  const currentProduct = products.find((p) => p.product === data.id);
  const inShop = !!currentProduct;

  return (
    <>
      {contextHolder}
      {!hiddenCard && image && (
        <div
          className={`relative w-full h-[480px] flex flex-col text-center border border-[#c3c3c3] p-2 bg-white ${s.arial} md:border-[0px] rounded-2xl `}
        >
          {showDelete && inShop && (
            <div
              className="absolute top-2 left-2 cursor-pointer text-red-500 font-bold text-xl z-10"
              onClick={async () => {
                removeProduct(data.id);
                await axios.delete(
                  `http://localhost:3000/shop/${currentUse}/${data.id}`
                );
                messageApi.open({ type: "success", content: "Товар удалён" });
              }}
            >
              ×
            </div>
          )}

          <div
            onClick={toggleLike}
            className="absolute top-0 right-0 p-2 cursor-pointer z-10 flex flex-col gap-2"
          >
            {isLiked ? (
              <HeartFilled className="!text-red-600 text-[20px]" />
            ) : (
              <HeartOutlined className="text-[#ccc] hover:!text-red-500 text-[20px]" />
            )}
            {showDelete && (
              <DeleteOutlined
                onClick={() => {
                  if (typeof onDelete === "function") onDelete();
                }}
              />
            )}
          </div>

          <div className="flex flex-col flex-grow min-h-0">
            <div
              className="text-[14px] text-gray-400 self-start mb-1 hover:text-gray-500 cursor-pointer"
              onClick={copyArt}
            >
              {article}
            </div>

            {data.rating !== 0.0 && (
              <div className="flex items-center text-[14px] text-gray-800 self-start mb-1">
                <span className="text-yellow-500 mr-1">★</span>
                {data.rating}
              </div>
            )}

            <img
              src={image}
              alt={data.fullName}
              className="w-full max-h-[190px] object-contain mb-2"
              onError={() => {
                decrement();
                setHiddenCard(true);
              }}
            />

            <div
              className={`text-[16px] font-[500] text-black !mb-2 !z-[1] leading-tight line-clamp-2 ${s.CharterItc} cursor-pointer`}
              onClick={() => navigate(`/product/${data.id}`)}
            >
              {data.fullName}
            </div>

            <div
              className="text-[14px] text-gray-400 mb-1 text-wrap text-center mt-2 cursor-pointer md:mt-4"
              onClick={() => navigate(`/product/${data.id}`)}
            >
              {String(getinfo(data))}
            </div>

            <div className="mt-auto">
              {hasSale && (
                <div className="text-[12px] text-gray-400 line-through mb-[4px]">
                  {getoldPrice() ? getoldPrice() + " ₽" : null}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="text-[26px] font-black text-[#e60000]">
                  {price}
                </div>

                {!inShop && (
                  <button
                    className="w-full bg-black !text-white text-[11px] font-normal py-[9px] rounded-[6px] cursor-pointer"
                    onClick={async () => {
                      if (!token) {
                        messageApi.open({
                          type: "warning",
                          content: "вы должны зарегистрироватся",
                        });
                        return;
                      }
                      addProduct({
                        product: data.id,
                        count: 1,
                        price: data?.price?.meta,
                      });
                      await axios.post(
                        `http://localhost:3000/shop/${currentUse}/add`,
                        { product: data.id, count: 1 }
                      );
                    }}
                  >
                    В корзину
                  </button>
                )}

                {inShop && (
                  <div className="w-full bg-[#f2f3f5] !text-black text-[19px] h-8  !font-semibold py-[2px] px-6 flex justify-between items-center rounded-[6px] cursor-pointer font-Arial">
                    <div
                      onClick={async () => {
                        if (currentProduct.count > 1) {
                          productMinus(data.id);
                          await axios.post(
                            `http://localhost:3000/shop/${currentUse}/minus`,
                            { product: data.id }
                          );
                        } else {
                          removeProduct(data.id);
                          await axios.delete(
                            `http://localhost:3000/shop/${currentUse}/${data.id}`
                          );
                          messageApi.open({
                            type: "success",
                            content: "Товар удалён из корзины",
                          });
                        }
                      }}
                    >
                      -
                    </div>
                    <div>{currentProduct.count} Шт. </div>
                    <div
                      onClick={async () => {
                        productPlus(data.id);
                        await axios.post(
                          `http://localhost:3000/shop/${currentUse}/plus`,
                          { product: data.id }
                        );
                      }}
                    >
                      +
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
