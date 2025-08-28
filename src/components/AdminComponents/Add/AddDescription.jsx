import { Form, Input } from "antd";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

const AddDescription = ({ onAdd, onDelete, descriptions }) => {
  const [description, setDescription] = useState({
    title: "",
    text: "",
  });

  const handleAdd = () => {
    if (!description.title && !description.text) return;
    onAdd(description);
    setDescription({ title: "", text: "" });
  };

  return (
    <div className="flex flex-col gap-2">
      <Form.Item className="!mb-1 !w-full sm:!w-3/5 lg:!w-2/5">
        <Input
          placeholder="Введите название"
          value={description.title}
          onChange={(e) =>
            setDescription({ ...description, title: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item className="!mb-1 !w-full sm:!w-3/5 lg:!w-2/5">
        <Input.TextArea
          rows={4}
          placeholder="Введите описание"
          value={description.text}
          onChange={(e) =>
            setDescription({ ...description, text: e.target.value })
          }
        />
      </Form.Item>

      {/* список описаний */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {descriptions.map((d, idx) => (
          <div
            className="rounded-2xl border border-[#202020] flex justify-between items-center p-2 px-3"
            key={idx}
          >
            <span>{d.title || "Без названия"}</span>
            <CloseOutlined
              onClick={() => onDelete(idx)}
              className="cursor-pointer text-red-500"
            />
          </div>
        ))}
      </div>

      <div
        className="bg-blue-500 w-full sm:w-3/5 lg:w-2/5 rounded-2xl text-white text-center py-2 cursor-pointer"
        onClick={handleAdd}
      >
        Добавить описание
      </div>
    </div>
  );
};

export default AddDescription;
