import {
  Select,
  Input,
  InputNumber,
  Upload,
  Button,
  Space,
  Typography,
  message,
} from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useState } from "react";
import fields from "./addfiels.json";
import AddDescription from "./AddDescription";
import axios from "axios";

const { Title } = Typography;

const Add = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [alldata, setAllData] = useState({
    category: "",
    fullName: "",
    price: null,
    images: [],
    characteristics: { wineCharacteristics: {} },
    tasteProfile: [{ name: "Сладость", value: 0 }],
    tags: [{ type: "Гастрономия", items: [] }],
    description: [],
  });

  const [fileList, setFileList] = useState([]);
  const fieldsByType = fields[alldata.category] || [];

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setAllData({
      ...alldata,
      images: newFileList.map((f) => f.url || f.thumbUrl || f.name),
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    const imgWindow = window.open(file.url || file.preview);
    imgWindow.document.write(`<img src="${file.url || file.preview}" />`);
  };

  const handleFieldChange = (key, value) => {
    setAllData((prev) => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        wineCharacteristics: {
          ...prev.characteristics.wineCharacteristics,
          [key]: value,
        },
      },
    }));
  };

  const handleTasteChange = (idx, key, value) => {
    const newTaste = [...alldata.tasteProfile];
    newTaste[idx][key] = value;
    setAllData({ ...alldata, tasteProfile: newTaste });
  };

  const addTasteRow = () =>
    setAllData({
      ...alldata,
      tasteProfile: [...alldata.tasteProfile, { name: "", value: 0 }],
    });

  const removeTasteRow = (idx) => {
    const newTaste = [...alldata.tasteProfile];
    newTaste.splice(idx, 1);
    setAllData({ ...alldata, tasteProfile: newTaste });
  };

  const handleTagChange = (idx, value) => {
    const newItems = [...alldata.tags[0].items];
    newItems[idx] = value;
    setAllData({ ...alldata, tags: [{ ...alldata.tags[0], items: newItems }] });
  };

  const addTagRow = () => {
    const newItems = [...alldata.tags[0].items, ""];
    setAllData({ ...alldata, tags: [{ ...alldata.tags[0], items: newItems }] });
  };

  const removeTagRow = (idx) => {
    const newItems = [...alldata.tags[0].items];
    newItems.splice(idx, 1);
    setAllData({ ...alldata, tags: [{ ...alldata.tags[0], items: newItems }] });
  };

  const handleAddDescription = (desc) => {
    setAllData((prev) => ({
      ...prev,
      description: [...prev.description, desc],
    }));
  };

  const handleDeleteDescription = (idx) => {
    setAllData((prev) => {
      const newDescs = [...prev.description];
      newDescs.splice(idx, 1);
      return { ...prev, description: newDescs };
    });
  };

  // 🔹 Валидация
  const validateData = () => {
    if (!alldata.category) return "Выберите категорию";
    if (!alldata.fullName.trim()) return "Введите название продукта";
    if (!alldata.price?.meta) return "Введите цену";
    if (fileList.length === 0) return "Загрузите хотя бы одно фото";

    if (
      fieldsByType.length > 0 &&
      fieldsByType.some(
        (f) => !alldata.characteristics.wineCharacteristics[f.name]
      )
    ) {
      return "Заполните все характеристики";
    }

    if (
      alldata.tasteProfile.some(
        (t) => !t.name.trim() || t.value === null || t.value === undefined
      )
    ) {
      return "Заполните дегустационные характеристики";
    }

    if (alldata.tags[0].items.length === 0) return "Добавьте хотя бы один тег";
    if (alldata.tags[0].items.some((t) => !t.trim()))
      return "Заполните все теги";

    if (alldata.description.length === 0) return "Добавьте описание";

    return null;
  };

  return (
    <>
      {contextHolder}
      <div className="w-full flex flex-col gap-6 p-4">
        <Title level={4}>Добавление продукта</Title>

        {/* Категория */}
        <Select
          options={[
            { value: "Вино", label: "Вино" },
            { value: "шампанское", label: "шампанское" },
            { value: "Коньяк", label: "Коньяк" },
            { value: "Виски", label: "Виски" },
            { value: "вода", label: "вода" },
            { value: "Джин", label: "Джин" },
          ]}
          className="!w-full sm:!w-3/5 lg:!w-2/5"
          placeholder="Выберите категорию"
          value={alldata.category}
          onChange={(value) => setAllData({ ...alldata, category: value })}
        />

        {alldata.category && (
          <>
            {/* Название */}
            <Input
              placeholder="Название продукта"
              value={alldata.fullName}
              onChange={(e) =>
                setAllData({ ...alldata, fullName: e.target.value })
              }
              className="!w-full sm:!w-3/5 lg:!w-2/5"
            />

            {/* Цена */}
            <InputNumber
              placeholder="Цена"
              value={alldata.price?.meta || null}
              onChange={(value) =>
                setAllData({
                  ...alldata,
                  price: value
                    ? { current: `${value} ₽`, meta: value.toString() }
                    : null,
                })
              }
              className="!w-full sm:!w-3/5 lg:!w-2/5"
            />

            {/* Фото */}
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              onPreview={handlePreview}
              beforeUpload={() => false}
              className="max-w-full sm:max-w-md"
            >
              {fileList.length >= 5 ? null : <PlusOutlined />}
            </Upload>

            {/* Характеристики */}
            {fieldsByType.length > 0 && (
              <div className="flex flex-col gap-3">
                <Title level={5}>Характеристики</Title>
                {fieldsByType.map((field, idx) => {
                  const commonClass = "!w-full sm:!w-3/5 lg:!w-2/5";
                  if (field.type === "input") {
                    return (
                      <Input
                        key={idx}
                        placeholder={field.placeholder}
                        className={commonClass}
                        onChange={(e) =>
                          handleFieldChange(field.name, e.target.value)
                        }
                      />
                    );
                  }
                  if (field.type === "inputNumber") {
                    return (
                      <InputNumber
                        key={idx}
                        placeholder={field.placeholder}
                        className={commonClass}
                        onChange={(value) =>
                          handleFieldChange(field.name, value)
                        }
                      />
                    );
                  }
                  if (field.type === "select") {
                    const options = (field.options || []).map((opt) => ({
                      label: opt,
                      value: opt,
                    }));
                    return (
                      <Select
                        key={idx}
                        options={options}
                        placeholder={field.placeholder}
                        className={commonClass}
                        onChange={(value) =>
                          handleFieldChange(field.name, value)
                        }
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* Дегустационные характеристики */}
            <div>
              <Title level={5}>Дегустационные характеристики</Title>
              {alldata.tasteProfile.map((tp, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 !w-full sm:!w-3/5 lg:!w-2/5"
                >
                  <Input
                    placeholder="Название"
                    value={tp.name}
                    onChange={(e) =>
                      handleTasteChange(idx, "name", e.target.value)
                    }
                    className="w-full sm:w-1/3"
                  />
                  <InputNumber
                    placeholder="Значение"
                    value={tp.value}
                    onChange={(value) => handleTasteChange(idx, "value", value)}
                    min={0}
                    max={5}
                    className="w-full sm:w-1/6"
                  />
                  <Button
                    type="text"
                    icon={<MinusOutlined />}
                    danger
                    onClick={() => removeTasteRow(idx)}
                    className="w-full sm:w-auto"
                  />
                </div>
              ))}
              <Button
                type="dashed"
                onClick={addTasteRow}
                icon={<PlusOutlined />}
                className="w-full sm:w-auto"
              >
                Добавить характеристику
              </Button>
            </div>

            <div>
              <Title level={5}>Гастрономия</Title>
              {alldata.tags[0].items.map((item, idx) => (
                <Space
                  key={idx}
                  direction="vertical"
                  className="w-full sm:flex-row sm:items-center sm:gap-4 mb-2"
                >
                  <Input
                    placeholder="Гастрономический тег"
                    value={item}
                    onChange={(e) => handleTagChange(idx, e.target.value)}
                    className="!w-full sm:!w-3/5 lg:!w-2/5"
                  />
                  <Button
                    type="text"
                    icon={<MinusOutlined />}
                    danger
                    onClick={() => removeTagRow(idx)}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={addTagRow}
                icon={<PlusOutlined />}
                className="!w-full sm:!w-auto"
              >
                Добавить гастрономию
              </Button>
            </div>

            <AddDescription
              onAdd={handleAddDescription}
              onDelete={handleDeleteDescription}
              descriptions={alldata.description}
            />

            <Button
              type="primary"
              onClick={async () => {
                const error = validateData();
                if (error) {
                  messageApi.warning(error);
                  return;
                }

                const types = {
                  Вино: "wine",
                  шампанское: "shampage",
                  Коньяк: "konyak",
                  Виски: "whiskey",
                  Джин: "gin",
                  вода: "voda",
                };

                const formData = new FormData();
                formData.append("category", alldata.category);
                formData.append("fullName", alldata.fullName);
                formData.append("price", JSON.stringify(alldata.price));
                formData.append(
                  "characteristics",
                  JSON.stringify(alldata.characteristics)
                );
                const tasteProfile = alldata.tasteProfile.map((t) => ({
                  name: `${t.name} ${t.value}`,
                }));
                formData.append("tasteProfile", JSON.stringify(tasteProfile));
                formData.append("tags", JSON.stringify(alldata.tags));
                formData.append(
                  "description",
                  JSON.stringify(alldata.description)
                );
                fileList.forEach((file) => {
                  if (file.originFileObj) {
                    formData.append("images", file.originFileObj);
                  }
                });

                try {
                  const response = await axios.post(
                    `http://localhost:3000/add/${types[alldata.category]}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                  );

                  if (response.data.success) {
                    messageApi.success("Продукт успешно добавлен!");
                    setAllData({
                      category: "",
                      fullName: "",
                      price: null,
                      images: [],
                      characteristics: { wineCharacteristics: {} },
                      tasteProfile: [{ name: "Сладость", value: 0 }],
                      tags: [{ type: "Гастрономия", items: [] }],
                      description: [],
                    });
                    setFileList([]);
                  }
                } catch (err) {
                  console.error(err);
                  messageApi.error("Ошибка при добавлении");
                }
              }}
              className="!w-full sm:!w-auto mt-4"
            >
              Создать
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Add;
