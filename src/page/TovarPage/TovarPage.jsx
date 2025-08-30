import {  useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { MotionConfig, motion as Motion } from "motion/react";
import api from "../../utils/api";
import Header from "../../components/Header/Header";
import Zagalovak from "../../components/TovarComponent/Zagalovak";
import SwiperImg from "../../components/TovarComponent/SwiperImg";
import InfoTovar from "../../components/TovarComponent/infoTovar/InfoTovar";
import BuyTovar from "../../components/TovarComponent/infoTovar/BuyTovar/BuyTovar";
import Products from "../../components/MainPageComponets/Products/products";
import Tags from "../../components/TovarComponent/infoTovar/Tags";
import "../../components/TovarComponent/infoTovar/InfoTovarTwo.jsx";
import InfoTovarTwo from "../../components/TovarComponent/infoTovar/InfoTovarTwo.jsx";
import Tegi from "../../components/TovarComponent/infoTovar/Tegi/Tegi.jsx";
import Footer from "../../components/Footer/Footer.jsx";
const TovarPage = () => {
  const { id } = useParams();
  const [tovar, setTovar] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getProduct = async () => {
      try {
        const response = await api.get(`/product/${id}`);
        setTovar(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке продукта:", err);
      }
    };
    if (id) getProduct();
  }, [id]);

  const category = {
    Вино: "wine",
    шампанское: "shampage",
    Коньяк: "konyak",
    Виски: "whiskey",
    Вода: "voda",
    Джин: 'gin'
  };

  const fetchBrandItems = useCallback(
    async (params, name) => {
      const catKey = category[tovar?.category];
      const producer =
        tovar?.characteristics?.wineCharacteristics?.Производитель;

      if (!catKey || !producer) return [];

      try {
        const response = await api.get(
          `/catalog/${catKey}`,
          {
            params: params,
          }
        );

        const items = response.data?.data ?? [];

        return [
          {
            name,
            value: items,
          },
        ];
      } catch (error) {
        console.error("Ошибка при загрузке брендов:", error);
        return [];
      }
    },
    [
      tovar?.category,
      tovar?.characteristics?.wineCharacteristics?.Производитель,
    ]
  );

  if (!tovar?.id) {
    return <div className="text-center mt-24 md:mt-28 lg:mt-32 text-lg">Загрузка товара...</div>;
  }

  const seems = tovar?.tags.find((tag) => tag.type === "Вкус")?.items;

  

  return (
    <>
      <Header />
      <div>
        <Zagalovak article={tovar.article} name={tovar.fullName} />
      </div>

      <MotionConfig reducedMotion="user">
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-[92%] mx-auto mt-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8 xl:gap-12">
          <div className="lg:w-5/12 self-start lg:pr-2">
            <SwiperImg img={tovar?.images} />
          </div>
          <div className="lg:w-4/12 lg:px-4">
            <InfoTovar
              data={tovar?.characteristics?.wineCharacteristics}
              type={tovar?.category}
              rating={tovar?.rating}
            />
          </div>
          <div className="lg:w-3/12 self-start lg:pl-2">
            <BuyTovar price={tovar?.price?.meta} discount={tovar?.price?.sale} data={tovar} />
          </div>
        </div>
      </Motion.div>
      </MotionConfig>

      {tovar?.category &&
        tovar?.characteristics?.wineCharacteristics?.Производитель && (
          <Products
            items={() =>
              fetchBrandItems(
                {
                  taste: seems,
                },
                "Схожее по вкусу"
              )
            }
          />
        )}

      <div className="w-[92%] mx-auto mt-10 flex flex-col">
        <h1 className="text-2xl md:text-3xl font-Arial !font-semibold border-b px-4 md:px-6 py-4 md:py-6 border-b-[#7a7a7a]">
          Характеристика
        </h1>
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 mt-5 px-4 md:px-6">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Tags Tags={tovar?.characteristics.tasteProfile} />
            <InfoTovarTwo
              data={tovar?.characteristics?.wineCharacteristics}
              type={tovar.category}
            />
          </div>
          <div className="lg:col-span-7 flex flex-col gap-3">
            {tovar?.description &&
              tovar.description.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <h1 className="text-base md:text-[18px] font-Arial !font-semibold">
                    {item.title}
                  </h1>
                  <p className="text-[15px] md:text-lg font-Arial text-[#000] leading-relaxed">{item.text}</p>
                </div>
              ))}
          </div>
        </div>
       
      </div>

      {tovar?.tags && <div className="w-[92%] mx-auto mt-10 flex flex-col">
        <h1 className="text-2xl md:text-3xl font-Arial !font-meduim border-b px-4 md:px-6 py-4 md:py-6 border-b-[#7a7a7a] scale-y-110">
          Теги
        </h1>
        <Tegi tags={tovar?.tags} />
      </div>}
      <Products
        items={() =>
          fetchBrandItems(
            {
              Brend: tovar?.characteristics?.wineCharacteristics?.Производитель,
            },
            "Другие товары этого бренда"
          )
        }
        first={"Другие товары этого бренда"}
      />
      <Footer/>
    </>
  );
};

export default TovarPage;
