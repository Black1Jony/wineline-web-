import { useState } from "react";
import { message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import s from "./card.module.css";
import { useNavigate } from "react-router-dom";
import { getinfo } from "./cardgetData";
const Card = ({ data }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const toggleLike = () => {
    if (!token) {
       messageApi.open({
         type: "warning",
         content: 'вы должны зарегистрироватся',
       });
    } else {
      setIsLiked(!isLiked);
      messageApi.open({
        type: "success",
        content: isLiked ? "Удалено из избранного" : "Добавлено в избранное",
      });
    }
  };

  const article = data.article?.replace(/\D/g, "");
  const image = data.images?.[0];
  const hasSale = data.price?.sale;
  const price = data.price?.current;

  const getoldPrice = () => {
    if (hasSale) {
      const str = hasSale.match(/\d+/)[0];
      const withSkidka = +data.price?.meta * 100;
      const percent = 100 - str;
      const oldprice = withSkidka / percent;
      return Math.ceil(oldprice);
    }
  };

  const copyArt = () => {
    navigator.clipboard.writeText(article);
    messageApi.open({
      type: "success",
      content: "Артикуль скопирован",
    });
  };

  return (
    <>
      {contextHolder}
      {data.images.length !== 0 && (
        <div
          className={`relative w-full h-[480px] flex flex-col text-center border border-[#c3c3c3] p-2 bg-white ${s.arial} md:border-[0px]`}
        >
          <div
            onClick={toggleLike}
            className="absolute top-0 right-0 p-2 cursor-pointer z-10"
          >
            {isLiked ? (
              <HeartFilled
                className="text-red-600 text-[20px]"
                style={{
                  color: "red",
                }}
              />
            ) : (
              <HeartOutlined className="text-[#ccc] hover:text-red-500 text-[20px]" />
            )}
          </div>

          <div className="flex flex-col flex-grow min-h-0">
            <div
              className="text-[14px] text-gray-400 self-start mb-1 hover:text-gray-500 cursor-pointer"
              onClick={copyArt}
            >
              {article}
            </div>

            {data.rating != 0.0 && (
              <div className="flex items-center text-[14px] text-gray-800 self-start mb-1">
                <span className="text-yellow-500 mr-1">★</span>
                {data.rating}
              </div>
            )}

            <img
              src={image}
              alt={data.fullName}
              className="w-full max-h-[190px] object-contain mb-2"
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
              {getinfo(data)}
            </div>

            <div className="mt-auto">
              {hasSale && (
                <div className="text-[12px] text-gray-400 line-through mb-[4px]">
                  {getoldPrice()} ₽
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="text-[26px] font-black text-[#e60000]">
                  {price}
                </div>
                <button className="w-full bg-black !text-white text-[11px] font-normal py-[9px] rounded-[6px] cursor-pointer">
                  В корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
