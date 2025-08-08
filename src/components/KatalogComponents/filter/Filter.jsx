import { useFilterStore } from "../../../utils/store/filterstore";
import { useState, useEffect } from "react";
import { Switch, Collapse, Input, Radio, Row, Col, Checkbox } from "antd";
import getFiltersFromServer from "./filters";

const { Panel } = Collapse;

const Filter = ({ type }) => {
  const { setType, setFilter, resetFilters } = useFilterStore();
  const [nowfilter, setNowFilter] = useState([]);
  const [present, setPresent] = useState(false);
  const [selected, setSelected] = useState(null);
  const [range, setRange] = useState({ min: "", max: "" });
  const [selectedValues, setSelectedValues] = useState({});

  useEffect(() => {
    setType(type);
    resetFilters();
    setPresent(false);
    setSelected(null);
    setRange({ min: "", max: "" });
    setSelectedValues({});
    const nowfilterset = async () => {
      const filter = await getFiltersFromServer(type);
      setNowFilter(filter);
    };
    nowfilterset();
  }, [type, setType, resetFilters]);

  const price = [
    {
      label: "до 1000 ₽",
      value: "до1000",
      infilter: () => {
        setFilter("startPrice", 0);
        setFilter("finishPrice", 1000);
        setRange({ min: "0", max: "1000" });
      },
    },
    {
      label: "1 000–3 000 ₽",
      value: "1000-3000",
      infilter: () => {
        setFilter("startPrice", 1000);
        setFilter("finishPrice", 3000);
        setRange({ min: "1000", max: "3000" });
      },
    },
    {
      label: "3 000–5 000 ₽",
      value: "3000-5000",
      infilter: () => {
        setFilter("startPrice", 3000);
        setFilter("finishPrice", 5000);
        setRange({ min: "3000", max: "5000" });
      },
    },
    {
      label: "5 000–10 000 ₽",
      value: "5000-10000",
      infilter: () => {
        setFilter("startPrice", 5000);
        setFilter("finishPrice", 10000);
        setRange({ min: "5000", max: "10000" });
      },
    },
    {
      label: "от 10 000 ₽",
      value: "от10000",
      infilter: () => {
        setFilter("startPrice", 10000);
        setFilter("finishPrice", null);
        setRange({ min: "10000", max: "" });
      },
    },
  ];

  const handleRangeChange = (key, value) => {
    const sanitized = value.replace(/[^\d]/g, "");
    setRange((prev) => ({ ...prev, [key]: sanitized }));
    setSelected(null);

    setFilter(
      key === "min" ? "startPrice" : "finishPrice",
      sanitized ? +sanitized : null
    );
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    const option = price.find((opt) => opt.value === value);
    if (option) {
      option.infilter();
      setSelected(value);
    }
  };

  const handleSingleCheckboxChange = (filterName, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setFilter(filterName, value);
  };

  return (
    <main className="w-full flex flex-col gap-4 p-4 sticky">
      <div className="flex justify-between items-center rounded-3xl border border-gray-400 bg-white shadow-sm overflow-hidden">
        <div className="flex gap-4 items-center pl-4 py-2">
          <img
            src="/public/assets/svg/decoration_present.svg"
            alt="Present"
            className="w-12 h-12"
          />
          <h4 className="text-base font-medium text-gray-700">
            В подарочной упаковке
          </h4>
        </div>
        <div className="flex items-center pr-4">
          <Switch
            className="w-12 h-8"
            checked={present}
            onChange={(checked) => {
              setPresent(checked);
              setFilter("present", checked);
            }}
          />
        </div>
      </div>

      <Collapse
        defaultActiveKey={["1"]}
        ghost
        expandIconPosition="end"
        className="bg-white"
      >
        <Panel
          header={
            <span className="text-lg font-semibold text-gray-800">Цена</span>
          }
          key="1"
          className="border-b border-gray-200"
        >
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="от 540 ₽"
              value={range.min}
              onChange={(e) => handleRangeChange("min", e.target.value)}
            />
            <Input
              placeholder="до 1 999 990 ₽"
              value={range.max}
              onChange={(e) => handleRangeChange("max", e.target.value)}
            />
          </div>

          <Radio.Group
            onChange={handleRadioChange}
            value={selected}
            className="w-full"
          >
            <div className="flex flex-col gap-2">
              {price.map((option) => (
                <Row key={option.value} justify="start" align="middle">
                  <Col>
                    <Radio value={option.value}>{option.label}</Radio>
                  </Col>
                </Row>
              ))}
            </div>
          </Radio.Group>
        </Panel>
      </Collapse>

      {nowfilter.map((i, index) => (
        <Collapse
          ghost
          key={index}
          expandIconPosition="end"
          className="bg-white"
        >
          <Panel
            header={
              <span className="text-lg font-semibold text-gray-800">
                {i.label}
              </span>
            }
            key={1}
            className="border-b border-gray-200"
          >
            <Checkbox.Group
              value={[selectedValues[i.name]] || []}
              onChange={(vals) => {
                const last = vals[vals.length - 1];
                handleSingleCheckboxChange(i.name, last);
              }}
              className="w-full"
            >
              <div className="flex flex-col gap-2">
                {i.option.map((option) => (
                  <Checkbox key={option} value={option}>
                    {option}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Panel>
        </Collapse>
      ))}
    </main>
  );
};

export default Filter;
