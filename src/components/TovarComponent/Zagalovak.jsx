import React from 'react'
import { message } from "antd";
const Zagalovak = ({name, article}) => {
  const [messageApi, contextHolder] = message.useMessage();
    const copyArt = () => {
      navigator.clipboard.writeText(article.replace(/\D/g, ""));
      messageApi.open({
        type: "success",
        content: "Артикуль скопирован",
      });
    };
  return (
    <>
      {contextHolder}
      <div className="w-full p-6 border-y-1 border-[#d4d4d4] mt-36">
        <h2 className="text-4xl font-black font-Arial text-[#272727]">
          {name}
        </h2>
        <h3
          className="font-Arial text-1xl font-normal cursor-pointer text-[#48484a] transition-all hover:text-[#2b2b2c]"
          onClick={copyArt}
        >
          {article}
        </h3>
      </div>
    </>
  );
}

export default Zagalovak
