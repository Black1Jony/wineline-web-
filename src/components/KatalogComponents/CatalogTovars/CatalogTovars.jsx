import Card from "../../cards/card";
import {
  Pagination,
  Drawer,
  InputNumber,
  Collapse,
  Checkbox,
  Switch,
  Radio,
  Row,
  Col,
  Select,
  Button,
} from "antd";
import { useFilterStore } from "../../../utils/store/filterstore";
import { useCountStore } from "../../../utils/store/countTovarsstore";
import { useState, useEffect, useRef } from "react";
import api from "../../../utils/api";
import s from "./catalogtovars.module.css";
import getFiltersFromServer from "../filter/filters";

const { Panel } = Collapse;

const CatalogTovars = ({ type }) => {
  const { filters, setFilter, setType, resetFilters, sortBy, setSortBy } = useFilterStore();
  const { count, setCount } = useCountStore();

  // Опции сортировки
  const sortOptions = [
    { value: "default", label: "По умолчанию" },
    { value: "priceAsc", label: "Цена: по возрастанию" },
    { value: "priceDesc", label: "Цена: по убыванию" },
    { value: "ratingDesc", label: "Рейтинг: по убыванию" },
    { value: "ratingAsc", label: "Рейтинг: по возрастанию" }
  ];

  const [catalog, setCatalog] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [present, setPresent] = useState(false);

  const [nowFilter, setNowFilter] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [range, setRange] = useState({ min: "", max: "" });
  const [selectedPrice, setSelectedPrice] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    setType(type);
    resetFilters();
    setPresent(false);
    setSelectedValues({});
    setRange({ min: "", max: "" });
    setSelectedPrice(null);

    const fetchFilters = async () => {
      const filterData = await getFiltersFromServer(type);
      setNowFilter(filterData);
    };
    fetchFilters();
  }, [type, setType, resetFilters]);

  // Сброс при смене фильтров или сортировки
  useEffect(() => {
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

  // Цена
  const priceOptions = [
    { label: "до 1000 ₽", min: 0, max: 1000 },
    { label: "1 000–3 000 ₽", min: 1000, max: 3000 },
    { label: "3 000–5 000 ₽", min: 3000, max: 5000 },
    { label: "5 000–10 000 ₽", min: 5000, max: 10000 },
    { label: "от 10 000 ₽", min: 10000, max: null },
  ];

  const handlePriceRadio = (value) => {
    const option = priceOptions.find((o) => o.label === value);
    if (!option) return;
    setRange({ min: option.min, max: option.max ?? "" });
    setSelectedPrice(value);
    setFilter("startPrice", option.min);
    setFilter("finishPrice", option.max);
  };

  const handleRangeChange = (key, val) => {
    const sanitized = val ? +val : null;
    setRange((prev) => ({ ...prev, [key]: sanitized }));
    setSelectedPrice(null);
    setFilter(key === "min" ? "startPrice" : "finishPrice", sanitized);
  };

  const handleCheckboxChange = (filterName, value) => {
    setSelectedValues((prev) => ({ ...prev, [filterName]: value }));
    setFilter(filterName, value);
  };

  return (
    <main className="flex flex-col gap-6 h-full w-full">
      {/* Фильтры для мобильных */}
      <div className="md:hidden mb-4">
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Фильтры
        </Button>
        <Drawer
          title="Фильтры"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width="80%"
        >
          <div className="mb-4 flex justify-between items-center">
            <span>В подарочной упаковке</span>
            <Switch
              checked={present}
              onChange={(v) => {
                setPresent(v);
                setFilter("present", v);
              }}
            />
          </div>
          <Collapse ghost>
            <Panel header="Цена" key="1">
              <div className="flex gap-2 mb-4">
                <InputNumber
                  placeholder="от"
                  value={range.min}
                  onChange={(v) => handleRangeChange("min", v)}
                />
                <InputNumber
                  placeholder="до"
                  value={range.max}
                  onChange={(v) => handleRangeChange("max", v)}
                />
              </div>
              <Radio.Group
                onChange={(e) => handlePriceRadio(e.target.value)}
                value={selectedPrice}
              >
                {priceOptions.map((opt) => (
                  <Radio key={opt.label} value={opt.label}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Panel>
          </Collapse>
          {nowFilter.map((f, idx) => (
            <Collapse ghost key={idx}>
              <Panel header={f.label} key={idx}>
                <Checkbox.Group
                  value={selectedValues[f.name] ? [selectedValues[f.name]] : []}
                  onChange={(vals) =>
                    handleCheckboxChange(f.name, vals[vals.length - 1])
                  }
                >
                  {f.option.map((o) => (
                    <Checkbox key={o} value={o}>
                      {o}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Panel>
            </Collapse>
          ))}
        </Drawer>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className={`text-[#5e5c5c] ${s.Arial}`}>{count} товары</h3>
        <div className="w-full sm:w-64">
          <Select
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
            placeholder="Сортировка"
            className="w-full"
            size="large"
          />
        </div>
      </div>

      {/* Если товаров нет */}
      {!loading && !count && (
        <div className="self-center flex flex-col gap-4">
          <img
            src="/public/assets/logos/page-notfound.png"
            alt="Not found"
            className="w-72 md:w-108"
          />
          <h1 className="text-[34px] text-[#1b1b1b]">УПС!</h1>
          <h2 className="text-[28px] text-[#1b1b1b]">
            Кажется такого вкуса у нас нет
          </h2>
          <button
            onClick={() => window.location.reload()}
            className={`bg-[#1b1b1b] w-full h-14 rounded-2xl p-3 text-white ${s.Arial} hover:bg-[#e06969] transition-all`}
          >
            Вернуться в каталог
          </button>
        </div>
      )}

      {/* Сетка товаров */}
      <div ref={containerRef}>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {catalog.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card data={item} />
            </motion.div>
          ))}
        </motion.div>

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
