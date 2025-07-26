import React from "react";

const benefits = [
  {
    title: "Широкий каталог",
    image: "/assets/info/info-item1-desktop.png",
    text: "Лучшие вина со всего мира — отборная продукция только от проверенных виноделен.",
  },
  {
    title: "Умный поиск",
    image: "/assets/info/info-item2-desktop.png",
    text: "Удобный фильтр по названию, артикулу, стране, сорту винограда и другим параметрам. Найдите именно то, что нужно.",
  },
  {
    title: "Бонусная система",
    image: "/assets/info/info-item3-desktop.png",
    text: "Получайте баллы за покупки и обменивайте их на скидки. Постоянные клиенты — в плюсе.",
  },
];

const OurPlus = () => {
  return (
    <section className="w-full px-4 py-20 bg-[#f9f9f9] flex justify-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-semibold text-center text-[#28282a] mb-16">
          Почему выбирают <span className="text-[#9e1c1c]">WineLine</span>
        </h2>

        <div className="flex flex-col  justify-center gap-8 md:flex-row">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-white max-w-sm w-full rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-60 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#28282a] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed flex-1">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPlus;
