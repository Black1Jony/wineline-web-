import { Drawer, Button, InputNumber, Collapse, Checkbox, Switch } from "antd";
import { useState, useEffect } from "react";
import { useFilterStore } from "../../../utils/store/filterstore";
import getFiltersFromServer from "./filters";

const { Panel } = Collapse;

const FilterDrawer = ({ type }) => {
  const { setType, setFilter, resetFilters } = useFilterStore();
  const [nowFilter, setNowFilter] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [range, setRange] = useState({ min: null, max: null });
  const [selectedValues, setSelectedValues] = useState({});

  useEffect(() => {
    setType(type);
    resetFilters();
    const fetchFilters = async () => {
      const data = await getFiltersFromServer(type);
      setNowFilter(data);
    };
    fetchFilters();
  }, [type]);

  const handleRangeChange = (key, value) => {
    setRange(prev => ({ ...prev, [key]: value }));
    setFilter(key === "min" ? "startPrice" : "finishPrice", value ? +value : null);
  };

  const handleCheckbox = (filterName, val) => {
    setSelectedValues(prev => ({ ...prev, [filterName]: val }));
    setFilter(filterName, val);
  };

  return (
    <>
      <Button type="primary" onClick={() => setDrawerOpen(true)}>Фильтры</Button>
      <Drawer
        title="Фильтры"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width="80%"
      >
        <div className="mb-4 flex justify-between items-center">
          <span>В подарочной упаковке</span>
          <Switch checked={present} onChange={(v) => { setPresent(v); setFilter("present", v); }} />
        </div>

        <Collapse ghost>
          <Panel header="Цена" key="1">
            <div className="flex gap-2 mb-4">
              <InputNumber placeholder="от" value={range.min} onChange={(val) => handleRangeChange("min", val)} />
              <InputNumber placeholder="до" value={range.max} onChange={(val) => handleRangeChange("max", val)} />
            </div>
          </Panel>
        </Collapse>

        {nowFilter.map((f, idx) => (
          <Collapse ghost key={idx}>
            <Panel header={f.label} key={idx}>
              <Checkbox.Group
                value={[selectedValues[f.name]] || []}
                onChange={(vals) => {
                  const last = vals[vals.length - 1];
                  handleCheckbox(f.name, last);
                }}
              >
                {f.option.map(o => <Checkbox key={o} value={o}>{o}</Checkbox>)}
              </Checkbox.Group>
            </Panel>
          </Collapse>
        ))}
      </Drawer>
    </>
  );
};

export default FilterDrawer;
