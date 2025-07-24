import { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import "./input.css";

const InputPlaceHolder = ({ mobile }) => {
  const [value, setValue] = useState("");
  const dynamicPlaceHolder = [
    "вино",
    "йегермейстер",
    "шампанское",
    "новинки",
    "джин",
    "красное вино",
    "игристое",
  ];
  const [placeHolderCount, setPlaceHolderCount] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setPlaceHolderCount((prev) => (prev + 1) % dynamicPlaceHolder.length);
        setAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full flex border-[#e5e5e5] border-[1px] ${
        mobile ? "h-10" : "h-12"
      } rounded-2xl gap-2 md:gap-4 py-2 md:py-4 items-center px-3 md:px-6 relative overflow-hidden`}
    >
      <div className="w-[70%] md:w-[75%] relative">
        <input
          type="text"
          className={`w-full ${
            mobile ? "h-8 text-sm" : "h-10 md:h-12"
          } focus:outline-0 bg-transparent`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {!value && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center pointer-events-none">
            <span
              className={`placeholder-text text-sm md:text-base transition-all duration-300 ${
                animating ? "slide-up" : "slide-down"
              }`}
            >
              {dynamicPlaceHolder[placeHolderCount]}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center">
        {value && (
          <CloseOutlined
            onClick={() => setValue("")}
            className="text-xs md:text-sm"
          />
        )}
      </div>
      <div className="bg-black text-white flex justify-center items-center w-16 md:w-24 h-7 md:h-9 rounded-[10px] text-xs md:text-sm">
        найти
      </div>
    </div>
  );
};

export default InputPlaceHolder;
