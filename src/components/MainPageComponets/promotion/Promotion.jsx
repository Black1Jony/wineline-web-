import React from "react";
import './promotions.css'
import { useNavigate } from "react-router-dom";
const Promotion = (props) => {
  const navigate = useNavigate()
  const { title, description, image, country } = props.promotion;
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${image})`,
        }}
        className="w-full h-48 rounded-3xl p-6 box-border flex gap-4 flex-col bg-cover justify-end "
        onClick={()=> navigate(`search/country=${country}`)}
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
