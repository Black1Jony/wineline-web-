import { useEffect, useMemo, useState } from "react";
import { shopStore } from "../../utils/store/shopStore";
import Card from "../cards/card";
import api from "../../utils/api";
import BuyCrad from "./BuyCrad";

const MainShop = ({ count, refProp }) => {
  const productsInStore = shopStore((state) => state.products);
  const setProducts = shopStore((state) => state.setProduct);
  const [fullProducts, setFullProducts] = useState([]);
  const user = localStorage.getItem("user");
  const countComputed = useMemo(() => productsInStore.reduce((acc, p) => acc + (p.count || 0), 0), [productsInStore]);

  useEffect(() => {
    const hydrateFromApi = async () => {
      if (!user || productsInStore.length > 0) return;
      try {
        const resp = await api.get(`/users/${user}`);
        setProducts(resp.data?.shop || []);
      } catch (e) {
        // ignore
      }
    };
    hydrateFromApi();

    const fetchProducts = async () => {
      if (!user || productsInStore.length === 0) {
        setFullProducts([]);
        return;
      }
      const newProducts = await Promise.all(
        productsInStore.map(async (p) => {
          const exists = fullProducts.find((fp) => fp.id === p.product);
          if (exists) return { ...exists, count: p.count };
          const res = await api.get(
            `/product/${p.product}`
          );
          return { ...res.data, count: p.count };
        })
      );
      setFullProducts(newProducts);
    };

    fetchProducts();
  }, [productsInStore, user]);

  return (
    <div
      ref={refProp}
      className="flex flex-col gap-3 w-full rounded-2xl  bg-white p-4"
    >
      <div className="flex justify-between">
        <h1 className="font-Arial text-2xl text-[#acacac]">В наличии</h1>
        <h2>{count} товаров</h2>
      </div>
      {fullProducts?.map((item) => (
        <BuyCrad key={item.id} data={item} />
      ))}
    </div>
  );
};

export default MainShop;
