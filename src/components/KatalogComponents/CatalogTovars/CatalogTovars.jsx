import Card from "../../cards/card";
import { Pagination } from "antd";
import { useFilterStore } from "../../../utils/store/filterstore";
import { useCountStore } from "../../../utils/store/countTovarsstore";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import s from "./catalogtovars.module.css";

const CatalogTovars = ({ type }) => {
  const { filters, setFilter } = useFilterStore();
  const { count, setCount } = useCountStore();

  const [catalog, setCatalog] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    setPage(1);
    setCatalog([]);
  }, [filters, type]);

  useEffect(() => {
    const getCatalog = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/catalog/${type}`,
          { params: { ...filters, page } }
        );

        setCatalog((prev) =>
          page === 1 ? response.data.data : [...prev, ...response.data.data]
        );
        setCount(response.data.tovars);
      } catch (error) {
        console.error("Error fetching catalog:", error);
      } finally {
        setLoading(false);
      }
    };
    getCatalog();
  }, [type, filters, page, setCount]);

  const scrollHandler = () => {
    if (loading || page >= Math.ceil(count / 24)) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.bottom - window.innerHeight < 100) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [loading, page, count]);

  return (
    <main className="flex flex-col gap-6 h-full w-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`text-[#5e5c5c] ${s.Arial}`}>{count} товары</h3>
        </div>
        <div className="w-[15%]">
          <select
            name="sort"
            id="sort"
            onChange={(e) => {
              setFilter("orderBy", e.target.value);
            }}
          >
            <option>Сортировка</option>
            <option value="priceAsc">сначала дороже</option>
            <option value="priceDesc">сначала подешевле</option>
          </select>
        </div>
      </div>

      {!loading && !count && (
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
              Кажется такого вкуса у нас нет
            </h2>
            <span className="text-3xl">🙁</span>
            <h2 className={`text-[#1b1b1b] text-[28px]`}>
              Но у нас много других вкусов!
            </h2>
          </div>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className={`bg-[#1b1b1b] w-full h-14 rounded-2xl p-3 !text-white ${s.Arial} transition-all hover:bg-[#e06969]`}
          >
            Вернуться в каталог
          </button>
        </div>
      )}

      <div ref={containerRef}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-4">
          {catalog.map((item) => (
            <Card key={item.id} data={item} />
          ))}
        </div>

        {loading && <div className="text-center mt-4">Загрузка...</div>}

        <Pagination
          current={page}
          total={count}
          pageSize={24}
          showSizeChanger={false}
          onChange={(p) => {
            setCatalog([]);
            setPage(p);
            containerRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="mt-6 flex justify-center"
        />
      </div>
    </main>
  );
};

export default CatalogTovars;
