import React from "react";

const OurPlus = () => {
  return (
    <>
    <div className="flex flex-col items-center w-full mt-16 px-4">
      <div className="w-[105%] max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-semibold text-center mb-14 text-[#28282a]">
          Почему выбирают <span className="text-[#9e1c1c]">WineLine</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-[#28282a] flex flex-col justify-end relative shadow-xl rounded-2xl text-center text-white min-h-[460px] overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl duration-300">
            <img
              src="/assets/info/info-item1-desktop.png"
              alt="Каталог"
              className="w-full h-auto object-cover"
            />
            <div className="py-6 px-6">
              <h2 className="text-[26px] font-bold mb-3">Широкий каталог</h2>
              <p className="text-[18px] text-gray-300 leading-relaxed">
                Лучшие вина со всего мира — отборная продукция только от
                проверенных виноделен.
              </p>
            </div>
          </div>

          <div className="bg-[#28282a] flex flex-col justify-end relative shadow-xl rounded-2xl text-center text-white min-h-[460px] overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl duration-300">
            <img
              src="/assets/info/info-item2-desktop.png"
              alt="Поиск"
              className="w-full h-auto object-cover"
            />
            <div className="py-6 px-6">
              <h2 className="text-[26px] font-bold mb-3">Умный поиск</h2>
              <p className="text-[18px] text-gray-300 leading-relaxed">
                Удобный фильтр по названию, артикулу, стране, сорту винограда и
                другим параметрам. Найдите именно то, что нужно.
              </p>
            </div>
          </div>

          <div className="bg-[#28282a] flex flex-col justify-end relative shadow-xl rounded-2xl text-center text-white min-h-[460px] overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl duration-300">
            <img
              src="/assets/info/info-item3-desktop.png"
              alt="Бонусная система"
              className="w-full h-auto object-cover"
            />
            <div className="py-6 px-6">
              <h2 className="text-[26px] font-bold mb-3">Бонусная система</h2>
              <p className="text-[18px] text-gray-300 leading-relaxed">
                Получайте баллы за покупки и обменивайте их на скидки.
                Постоянные клиенты — в плюсе.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default OurPlus;
