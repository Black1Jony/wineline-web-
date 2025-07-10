import { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import './input.css'

const InputPlaceHolder = () => {
  const [value, setValue] = useState("");
  const dynamicPlaceHolder = [
    "вино",
    "йегермейстер",
    "шампанское",
    "новинки",
    "джин",
    "красное вино",
    "игристое"
  ];
  const [placeHolderCount, setPlaceHolderCount] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true); // включаем анимацию
      setTimeout(() => {
        setPlaceHolderCount((prev) => (prev + 1) % dynamicPlaceHolder.length);
        setAnimating(false); // выключаем анимацию
      }, 300); // продолжительность анимации
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-[100%] flex border-[#e5e5e5] border-[1px] h-12 rounded-2xl gap-4 
      py-4 items-center px-6 relative overflow-hidden"
    >
      <div className="w-[75%] relative">
        <input
          type="text"
          className="w-full h-12 focus:outline-0 bg-transparent"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {!value && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center pointer-events-none">
            <span
              className={`placeholder-text transition-all duration-300 ${
                animating ? "slide-up" : "slide-down"
              }`}
            >
              {dynamicPlaceHolder[placeHolderCount]}
            </span>
          </div>
        )}
      </div>
      <div>{value && <CloseOutlined onClick={() => setValue("")} />}</div>
      <div className="bg-black text-white flex justify-center items-center w-24 h-9 rounded-[10px]">
        найти
      </div>
    </div>
  );
};

export default InputPlaceHolder;
