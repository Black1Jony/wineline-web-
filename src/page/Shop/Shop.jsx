import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MainShop from "../../components/ShopComponent/MainShop";
import BuyingShop from "../../components/ShopComponent/BuyingShop";
import { shopStore } from "../../utils/store/shopStore";

const Shop = () => {
  const productsStore = shopStore((state) => state.products);
  const [shop, setShop] = useState(null);
  const user = localStorage.getItem("user");
  const [allProduct, setAllProduct] = useState(0);
  const [buyingProduct, setBuyingProduct] = useState(0);

  const productsRef = useRef(null);
  const paymentRef = useRef(null);
  if (!localStorage.getItem("user")) window.location.pathname = "/";
  useEffect(() => {
    if (user) {
      const getShop = async () => {
        const responce = await axios.get(
          `http://localhost:3000/users/${user}?key=${user}`
        );

        if (responce?.data?.shop) {
          const products = await Promise.all(
            responce.data.shop.map(async (i) => {
              const product = await axios.get(
                `http://localhost:3000/product/${i.product}`
              );
              return { ...i, ...product.data };
            })
          );
          const totalCount = productsStore.reduce(
            (acc, item) => acc + item.count,
            0
          );

          setAllProduct(totalCount);

          setShop(products);
        }
      };
      getShop();
      const totalPrice = shop?.reduce(
        (acc, item) => acc + +item.price.meta * +item.count,
        0
      );
      setBuyingProduct(totalPrice);
    }
  }, [user, productsStore]);

  return (
    <>
      <Header show={true} />
      <div className="min-h-full w-full bg-[#f5f5f5] flex justify-center items-center">
        {shop && productsStore.length > 0 ? (
          <div className="!mt-[40vh] w-[80%] flex gap-12 mb-25 relative ">
            <div className="flex-1 min-w-[60%] relative">
              <MainShop count={allProduct} refProp={productsRef} />
            </div>
            <div className="w-5/12 min-w-[300px] relative">
              <BuyingShop
                count={allProduct}
                price={buyingProduct}
                refProp={paymentRef}
                productsRef={productsRef}
              />
            </div>
          </div>
        ) : (
          <div className="self-center justify-self-center flex flex-col gap-4">
            <div>
              <img
                src="/public/assets/logos/page-notfound.png"
                alt="Not found"
                className="w-72 md:w-108"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className={`text-[#1b1b1b] text-[34px]`}>УПС!</h1>
              <h2 className={`text-[#1b1b1b] text-[28px]`}>
                кажется корзина пуста
              </h2>
              <span className="text-3xl">🙁</span>
              <h2 className={`text-[#1b1b1b] text-[28px]`}>
                Но вы можете это исправить !
              </h2>
            </div>
            <button
              onClick={() => {
                window.location.pathname = '/';
              }}
              className={`bg-[#1b1b1b] w-full h-14 rounded-2xl p-3 !text-white font-Arial transition-all hover:bg-[#e06969]`}
            >
              Вернуться на главную
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Shop;
