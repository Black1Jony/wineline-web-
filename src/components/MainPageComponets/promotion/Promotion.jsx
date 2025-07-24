import React from "react";
import './promotions.css'
const Promotion = (props) => {
  const { title, description, image } = props.promotion;
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${image})`,
        }}
        className="w-full h-46 rounded-3xl p-6 box-border flex gap-4 flex-col bg-cover justify-end "
      >
        <div className="w-[54%] flex flex-col gap-2">
          <h1 className="charter ">{title}</h1>
          <p className="InterAboutWine">{description}</p>
        </div>
      </div>
    </>
  );
};

export default Promotion;
