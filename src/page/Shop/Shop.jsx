import { useRef, useState, useEffect } from "react";
import api from "../../utils/api";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MainShop from "../../components/ShopComponent/MainShop";
import BuyingShop from "../../components/ShopComponent/BuyingShop";
import BuyingShopNoScroll from "../../components/ShopComponent/BuyingShopNoScroll";
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
    if (!user) return;

    const getShop = async () => {
      try {
        const responce = await api.get(`/users/${user}`);
        if (responce?.data?.shop) {
          const products = await Promise.all(
            responce.data.shop.map(async (i) => {
              const product = await api.get(`/product/${i.product}`);
              return { ...i, ...product.data };
            })
          );
          const totalCount = productsStore.reduce((acc, item) => acc + item.count, 0);
          setAllProduct(totalCount);
          setShop(products);
        } else {
          setShop([]);
          setAllProduct(0);
        }
      } catch {
        setShop([]);
      }
    };
    getShop();
  }, [user, productsStore]);

  useEffect(() => {
    const totalPrice = shop?.reduce((acc, item) => acc + (+item?.price?.meta || 0) * (+item?.count || 0), 0) || 0;
    setBuyingProduct(totalPrice);
  }, [shop]);

  return (
    <>
      <Header show={true} />
      <div className="min-h-full w-full bg-[#f5f5f5] flex justify-center items-center px-3 md:px-6">
        {Array.isArray(shop) && shop.length > 0 && productsStore.length > 0 ? (
          <div className="!mt-[40vh] w-full lg:w-[80%] flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-12 mb-25 relative ">
            <div className="flex-1 min-w-full md:min-w-[60%] relative">
              <MainShop count={allProduct} refProp={productsRef} />
            </div>
            <div className="w-full md:w-5/12 min-w-[300px] relative">
              <BuyingShop
                count={allProduct}
                price={buyingProduct}
                refProp={paymentRef}
                productsRef={productsRef}
              />
              <BuyingShopNoScroll
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
