import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import BannerCategory from "../../components/KatalogComponents/Banner/BannerCategory";
import Filter from "../../components/KatalogComponents/filter/Filter";
import Card from "../../components/cards/card";
import Footer from "../../components/Footer/Footer";
import OurPlusTwo from "../../components/MainPageComponets/OurPlus/OurPlusTwo";
import { useState, useEffect, useRef } from "react";
import { Pagination, Button } from "antd";
import { motion, useInView } from "framer-motion";
import { MenuOutlined } from "@ant-design/icons";
import axios from "axios";
import { useFilterStore } from "../../utils/store/filterstore";
import { useCountStore } from "../../utils/store/countTovarsstore";
import { hiddenStore } from "../../utils/store/hiddenStore";

const AnimatedCard = ({ data }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hiddenProduct = hiddenStore((state) => state.hiddenProduct);

  if (hiddenProduct.includes(data.id)) return null;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
    >
      <Card data={data} />
    </motion.div>
  );
};

const Katolog = () => {
  const { type } = useParams();
  const { filters } = useFilterStore();
  const { count, setCount } = useCountStore();

  const [catalog, setCatalog] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const containerRef = useRef(null);

  // Сброс при смене фильтров или типа
  useEffect(() => {
    window.scrollTo(0, 0)
    setPage(1);
    setCatalog([]);
  }, [filters, type]);

  // Получение товаров
  useEffect(() => {
    const getCatalog = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`http://localhost:3000/catalog/${type}`, {
          params: { ...filters, page },
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
  }, [type, filters, page, setCount]);

  // Бесконечный скролл
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
    <>
      <Header />
      <BannerCategory type={type} />

      <main className="w-[94%] mx-auto grid gap-12 relative lg:grid-cols-[1fr_2.8fr]">
        {/* Фильтры на планшетах и десктопе */}
        <div className="hidden md:block">
          <Filter type={type} />
        </div>

        <div ref={containerRef}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#5e5c5c]">{count} товаров</h3>

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

          {/* Сетка карточек */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {catalog.map((item) => (
              <AnimatedCard key={item.id} data={item} />
            ))}
          </motion.div>

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
    </>
  );
};

export default Katolog;
