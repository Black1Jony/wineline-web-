import { useState, useEffect } from "react";
import {
  Drawer,
  Button,
  InputNumber,
  Collapse,
  Radio,
  Row,
  Col,
  Checkbox,
  Switch,
} from "antd";
import { motion } from "framer-motion";
import { useFilterStore } from "../../../utils/store/filterstore";
import getFiltersFromServer from "./filters";

const { Panel } = Collapse;

const Filter = ({ type }) => {
  const { setType, setFilter, resetFilters } = useFilterStore();

  const [nowFilter, setNowFilter] = useState([]);
  const [present, setPresent] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [range, setRange] = useState({ min: "", max: "" });
  const [selectedValues, setSelectedValues] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setType(type);
    resetFilters();
    setPresent(false);
    setSelectedPrice(null);
    setRange({ min: "", max: "" });
    setSelectedValues({});

    const fetchFilters = async () => {
      const filtersFromServer = await getFiltersFromServer(type);
      setNowFilter(filtersFromServer);
    };
    fetchFilters();
  }, [type]);

  // Цены
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

  const handleCheckboxChange = (filterName, val) => {
    setSelectedValues((prev) => ({ ...prev, [filterName]: val }));
    setFilter(filterName, val);
  };

  // Анимация появления фильтров (опционально)
  const motionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Desktop фильтры */}
      <div className="hidden md:flex flex-col gap-4 p-4 sticky top-20">
        <div className="flex justify-between items-center rounded-3xl border border-gray-400 bg-white shadow-sm overflow-hidden p-3">
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
                value={[selectedValues[f.name]] || []}
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
      </div>

      {/* Мобильные фильтры через Drawer */}
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={motionVariants}
          >
            <div className="flex justify-between items-center mb-4">
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
                    value={[selectedValues[f.name]] || []}
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
          </motion.div>
        </Drawer>
      </div>
    </>
  );
};

export default Filter;
