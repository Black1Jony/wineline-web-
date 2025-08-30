import React from 'react'
import { message } from "antd";
import { MotionConfig, motion as Motion } from "motion/react";
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
      <MotionConfig reducedMotion="user">
        <Motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full p-6 border-y-1 border-[#d4d4d4] mt-36"
        >
          <h2 className="text-3xl md:text-4xl font-black font-Arial text-[#272727]">
            {name}
          </h2>
          <h3
            className="font-Arial text-base md:text-1xl font-normal cursor-pointer text-[#48484a] transition-all hover:text-[#2b2b2c]"
            onClick={copyArt}
          >
            {article}
          </h3>
        </Motion.div>
      </MotionConfig>
    </>
  );
}

export default Zagalovak
