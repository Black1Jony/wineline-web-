import { useState } from "react";
import {
  Input,
  InputNumber,
  Upload,
  Button,
  Typography,
  message,
  DatePicker,
  TimePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../utils/api";
import dayjs from "dayjs";

const { Title } = Typography;

const AddEvents = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [eventData, setEventData] = useState({
    date: "",
    time: "", // новое поле
    description: "",
    fullname: "",
    price: null,
    image: null,
    address: "",
  });

  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setEventData({
      ...eventData,
      image: newFileList[0]?.originFileObj || null,
    });
  };

  const handleSubmit = async () => {
    if (
      !eventData.fullname ||
      !eventData.date ||
      !eventData.price ||
      !eventData.address ||
      !eventData.time
    ) {
      messageApi.warning("Заполните все обязательные поля!");
      return;
    }

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify([
        {
          date: eventData.date,
          time: eventData.time,
          description: eventData.description,
          fullname: eventData.fullname,
          price: eventData.price,
          address: eventData.address,
        },
      ])
    );
    if (eventData.image) {
      formData.append("images", eventData.image);
    }

    try {
      const response = await api.post(
        "/event",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        messageApi.success("Событие успешно добавлено!");
        setEventData({
          date: "",
          time: "",
          description: "",
          fullname: "",
          price: null,
          image: null,
          address: "",
        });
        setFileList([]);
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Ошибка при добавлении события");
    }
  };

  return (
       <>
    {contextHolder}
    <div className="w-full flex flex-col gap-6 p-4">
      
      <Title level={4}>Добавление события</Title>

      <DatePicker
        format="DD.MM"
        placeholder="Выберите дату"
        value={eventData.date ? dayjs(eventData.date, "DD.MM") : null}
        onChange={(date, dateString) =>
          setEventData({ ...eventData, date: dateString })
        }
        className="!w-full sm:!w-3/5 lg:!w-2/5"
        disabledDate={(current) => current && current < dayjs().startOf("day")}
      />

      <TimePicker
        format="HH:mm"
        placeholder="Выберите время"
        value={eventData.time ? dayjs(eventData.time, "HH:mm") : null}
        onChange={(time, timeString) =>
          setEventData({ ...eventData, time: timeString })
        }
        className="!w-full sm:!w-3/5 lg:!w-2/5"
      />

      <Input
        placeholder="Название / ФИО"
        value={eventData.fullname}
        onChange={(e) =>
          setEventData({ ...eventData, fullname: e.target.value })
        }
        className="!w-full sm:!w-3/5 lg:!w-2/5"
      />

      <InputNumber
        placeholder="Цена"
        value={eventData.price}
        onChange={(value) => setEventData({ ...eventData, price: value })}
        className="!w-full sm:!w-3/5 lg:!w-2/5"
        min={0}
      />

      <Input
        placeholder="Адрес события"
        value={eventData.address}
        onChange={(e) =>
          setEventData({ ...eventData, address: e.target.value })
        }
        className="!w-full sm:!w-3/5 lg:!w-2/5"
      />

      <Input.TextArea
        rows={3}
        placeholder="Описание события"
        value={eventData.description}
        onChange={(e) =>
          setEventData({ ...eventData, description: e.target.value })
        }
        className="!w-full sm:!w-3/5 lg:!w-2/5"
      />

      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        maxCount={1}
      >
        {fileList.length >= 1 ? null : <PlusOutlined />}
      </Upload>

      <Button type="primary" onClick={handleSubmit}>
        Создать событие
      </Button>
    </div>
    </>
  );
};

export default AddEvents;
