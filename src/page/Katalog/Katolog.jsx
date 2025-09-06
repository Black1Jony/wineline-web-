import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import BannerCategory from "../../components/KatalogComponents/Banner/BannerCategory";
import Filter from "../../components/KatalogComponents/filter/Filter";
import Card from "../../components/cards/card";
import Footer from "../../components/Footer/Footer";
import MobileFooter from "../../components/Footer/MobileFooter";
import OurPlusTwo from "../../components/MainPageComponets/OurPlus/OurPlusTwo";
import { useState, useEffect, useRef } from "react";
import { Pagination, Button, Select } from "antd";
import { useInView } from "framer-motion";
import { MenuOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import { useFilterStore } from "../../utils/store/filterstore";
import { useCountStore } from "../../utils/store/countTovarsstore";
import { hiddenStore } from "../../utils/store/hiddenStore";

const AnimatedCard = ({ data }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hiddenProduct = hiddenStore((state) => state.hiddenProduct);

  if (hiddenProduct.includes(data.id)) return null;
  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ease-out hover:scale-105 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <Card data={data} />
    </div>
  );
};

const Katolog = () => {
  const { type } = useParams();
  const { filters, sortBy, setSortBy } = useFilterStore();
  const { count, setCount } = useCountStore();

  // Опции сортировки
  const sortOptions = [
    { value: "default", label: "По умолчанию" },
    { value: "priceAsc", label: "Цена: по возрастанию" },
    { value: "priceDesc", label: "Цена: по убыванию" },
    { value: "ratingDesc", label: "Рейтинг: по убыванию" },
    { value: "ratingAsc", label: "Рейтинг: по возрастанию" },
    { value: "nameAsc", label: "Название: А-Я" },
    { value: "nameDesc", label: "Название: Я-А" },
    { value: "newest", label: "Сначала новые" },
    { value: "oldest", label: "Сначала старые" },
    { value: "popular", label: "Популярные" },
    { value: "discount", label: "Скидки" },
    { value: "alphabetical", label: "Алфавитный порядок" },
  ];

  const [catalog, setCatalog] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const containerRef = useRef(null);

  // Сброс при смене фильтров, сортировки или типа
  useEffect(() => {
    window.scrollTo(0, 0)
    setPage(1);
    setCatalog([]);
  }, [filters, sortBy, type]);

  // Получение товаров
  useEffect(() => {
    const getCatalog = async () => {
      setLoading(true);
      try {
        const resp = await api.get(`/catalog/${type}`, {
          params: { ...filters, sortBy, page },
        });
        setCatalog((prev) =>
          page === 1 ? resp.data.data : [...prev, ...resp.data.data]
        );
        setCount(resp.data.tovars);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getCatalog();
  }, [type, filters, sortBy, page, setCount]);

  // Бесконечный скролл
  useEffect(() => {
    const scrollHandler = () => {
      if (loading || page >= Math.ceil(count / 24)) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom - window.innerHeight < 100) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [loading, page, count]);

  return (
    <>
      <div className="pb-20 md:pb-0">
        <Header />
        <BannerCategory type={type} />

      <main className="w-[94%] mx-auto grid gap-12 relative lg:grid-cols-[1fr_2.8fr]">
        {/* Фильтры на планшетах и десктопе */}
        <div className="hidden md:block">
          <Filter type={type} />
        </div>

        <div ref={containerRef}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-[#5e5c5c]">{count} товаров</h3>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Селектор сортировки */}
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                placeholder="Сортировка"
                className="w-full sm:w-64"
                size="large"
              />

              {/* Кнопка + фильтры только на мобильных (<768px) */}
              <div className="block md:hidden">
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setShowFiltersMobile((prev) => !prev)}
                >
                  Фильтры
                </Button>
                {showFiltersMobile && (
                  <div className="mt-4">
                    <Filter type={type} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Сетка карточек */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
            {catalog.map((item) => (
              <AnimatedCard key={item.id} data={item} />
            ))}
          </div>

          {loading && <div className="text-center mt-4">Загрузка...</div>}

          {/* Пагинация */}
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

        <OurPlusTwo />
        <Footer />
      </div>
      <MobileFooter />
    </>
  );
};

export default Katolog;
