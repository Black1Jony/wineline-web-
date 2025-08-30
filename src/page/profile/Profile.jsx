import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Avatar, Button, Card, Descriptions, Divider, Empty, Flex, message, Spin, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MotionConfig, motion as Motion } from "motion/react";

const { Title, Text } = Typography;

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const userId = useMemo(() => localStorage.getItem("user"), []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get(`/users/${userId}`);
        setUser(data);
      } catch {
        message.error("Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpload = async ({ file }) => {
    if (!userId) return message.warning("Необходима авторизация");
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("id", userId);
    try {
      setUploading(true);
      const { data } = await api.post(`/user/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, photo: data?.photo || data?.url || data }));
      message.success("Фото обновлено");
    } catch {
      message.error("Не удалось загрузить фото");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col gap-4 items-center justify-center">
        <Empty description="Профиль не найден" />
        <Button type="primary" onClick={() => navigate("/login")}>Войти</Button>
      </div>
    );
  }

  const activeCodes = user?.activeCode || [];
  const purchased = user?.shop || [];

  return (
    <>
      <Header />
      <MotionConfig reducedMotion="user">
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 mt-24 md:mt-28 lg:mt-32"
      >
      <Card className="shadow-sm">
        <Flex gap={16} align="center" className="flex-col md:flex-row">
          <Avatar
            size={96}
            src={user?.photo}
            style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
          >
            {!user?.photo && (user?.name?.[0] || "U")}
          </Avatar>

          <div className="flex-1 w-full text-center md:text-left">
            <Title level={3} className="!mb-1 text-2xl sm:text-3xl">{user?.name || "Пользователь"}</Title>
            <Text type="secondary" className="block text-sm sm:text-base">{user?.email}</Text>

            <div className="mt-3 flex justify-center md:justify-start">
              <Upload
                name="photo"
                customRequest={handleUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={uploading} size="middle">
                  {user?.photo ? "Обновить фото" : "Добавить фото"}
                </Button>
              </Upload>
            </div>
          </div>
        </Flex>

        <Divider />

        <Descriptions
          title={<span className="text-lg sm:text-xl">Данные профиля</span>}
          size="small"
          column={{ xs: 1, sm: 2 }}
          bordered
        >
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Роль">{user.role}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Избранное">{user.favorites?.length || 0}</Descriptions.Item>
          <Descriptions.Item label="Корзина">{purchased?.length || 0}</Descriptions.Item>
          <Descriptions.Item label="Промокоды активно">{activeCodes?.length || 0}</Descriptions.Item>
        </Descriptions>

        <div className="mt-4 grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
          <Button onClick={() => navigate("/shop")} type="primary" className="w-full sm:w-auto">Перейти в корзину</Button>
          <Button onClick={() => navigate("/favorite")} className="w-full sm:w-auto">
            Избранное
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <Card title={<span className="text-base sm:text-lg">Активные промокоды</span>} className="shadow-sm min-h-32">
          {activeCodes.length === 0 ? (
            <Empty description="Нет активных промокодов" />
          ) : (
            <ul className="list-disc ml-5 text-sm sm:text-base">
              {activeCodes.map((code, idx) => (
                <li key={idx} className="py-1">
                  <Text code>{typeof code === "string" ? code : JSON.stringify(code)}</Text>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={<span className="text-base sm:text-lg">Покупки</span>} className="shadow-sm min-h-32">
          {purchased.length === 0 ? (
            <Empty description="Пока нет покупок" />
          ) : (
            <ul className="divide-y">
              {purchased.map((item, idx) => (
                <li key={idx} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <span className="break-all">Товар ID: <Text strong>{item.product}</Text></span>
                  <span className="text-sm sm:text-base">Кол-во: <Text>{item.count}</Text></span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      </Motion.div>
      </MotionConfig>
      <Footer />
    </>
  );
}


