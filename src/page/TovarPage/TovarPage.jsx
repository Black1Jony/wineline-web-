import {  useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
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
        const response = await axios.get(`http://localhost:3000/product/${id}`);
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
        const response = await axios.get(
          `http://localhost:3000/catalog/${catKey}`,
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
    return <div className="text-center mt-10 text-lg">Загрузка товара...</div>;
  }

  const seems = tovar?.tags.find((tag) => tag.type === "Вкус")?.items;

  

  return (
    <>
      <Header />
      <div>
        <Zagalovak article={tovar.article} name={tovar.fullName} />
      </div>

      <div className="flex justify-between w-[92%] self-center mt-5 justify-self-center">
        <SwiperImg img={tovar?.images} />
        <InfoTovar
          data={tovar?.characteristics?.wineCharacteristics}
          type={tovar?.category}
          rating={tovar?.rating}
        />
        <BuyTovar price={tovar?.price?.meta} discount={tovar?.price?.sale} data={tovar} />
      </div>

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

      <div className="w-[92%] self-center mt-10 flex flex-col justify-self-center">
        <h1 className="text-3xl font-Arial !font-semibold border-b p-6 border-b-[#7a7a7a]">
          Характеристика
        </h1>
        <div className="w-full flex justify-between mt-5 p-6 gap-5">
          <div className="w-2/5 flex flex-col gap-5">
            <Tags Tags={tovar?.characteristics.tasteProfile} />
            <InfoTovarTwo
              data={tovar?.characteristics?.wineCharacteristics}
              type={tovar.category}
            />
          </div>
          <div className="w-4/6 flex flex-col gap-3">
            {tovar?.description &&
              tovar.description.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                  {" "}
                  <h1 className="text-[18px] font-Arial !font-semibold">
                    {item.title}
                  </h1>
                  <p className="text-lg font-Arial text-[#000]">{item.text}</p>
                </div>
              ))}
          </div>
        </div>
       
      </div>

      {tovar?.tags && <div className="w-[92%] self-center mt-10 flex flex-col justify-self-center">
        <h1 className="text-3xl font-Arial !font-meduim border-b p-6 border-b-[#7a7a7a] scale-y-110">
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
