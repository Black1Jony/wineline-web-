import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MobileFooter from "../../components/Footer/MobileFooter";
import { Avatar, Button, Card, Descriptions, Divider, Empty, Flex, message, Spin, Typography, Upload } from "antd";
import { UploadOutlined, LogoutOutlined } from "@ant-design/icons";
import { MotionConfig, motion as Motion } from "motion/react";
import { shopStore } from "../../utils/store/shopStore";
import { favoriteStore } from "../../utils/store/favoriteStore";


const { Title, Text } = Typography;

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const userId =  localStorage.getItem("user") ;
   const deleteShop = shopStore((state) => state.clearProducts);
   const deleteFavorite = favoriteStore((state) => state.clearFavorite);
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

  const handleLogout = async() => {
    await api.delete(`/shop/${userId}`);
    await api.delete(`/favoriteAll/${userId}`);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
   
    deleteShop();
    deleteFavorite();
    
    localStorage.removeItem("shop-storage");
    localStorage.removeItem("favorite-storage");
    
    message.success("Вы успешно вышли из системы");
    navigate("/login");
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
      <div className="pb-20 md:pb-0">
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
                src={user?.imgUrl && `${user.imgUrl}`}
                style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
              >
                {!user?.photo && (user?.name?.[0] || "U")}
              </Avatar>

              <div className="flex-1 w-full text-center md:text-left">
                <Title level={3} className="!mb-1 text-2xl sm:text-3xl">
                  {user?.name || "Пользователь"}
                </Title>
                <Text type="secondary" className="block text-sm sm:text-base">
                  {user?.email}
                </Text>

                {/* Карточка с баллами */}
                <div className="mt-4 mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg">
                    <span className="text-lg font-bold">💰</span>
                    <span className="font-bold text-lg">{user.score || 0}</span>
                    <span className="text-sm">баллов</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {user.score > 0 ? "Доступно для оплаты покупок" : "Накапливайте баллы при покупках"}
                  </div>
                </div>

                <div className="mt-3 flex justify-center md:justify-start">
                  <Upload
                    name="photo"
                    customRequest={handleUpload}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button
                      icon={<UploadOutlined />}
                      loading={uploading}
                      size="middle"
                    >
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
              <Descriptions.Item label="Баллы">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  {user.score || 0} баллов
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Избранное">
                {user.favorites?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Корзина">
                {purchased?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Промокоды активно">
                {activeCodes?.length || 0}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-4 grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
              <Button
                onClick={() => navigate("/shop")}
                type="primary"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700"
              >
                🛒 Перейти в корзину
              </Button>
              {user.score > 0 && (
                <Button
                  onClick={() => navigate("/shop")}
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 border-none text-white hover:from-yellow-500 hover:to-orange-600"
                >
                  💰 Потратить баллы ({user.score})
                </Button>
              )}
              <Button
                onClick={() => navigate("/favorite")}
                className="w-full sm:w-auto"
              >
                ❤️ Избранное
              </Button>
              <Button
                onClick={handleLogout}
                danger
                icon={<LogoutOutlined />}
                className="w-full sm:w-auto"
              >
                Выйти
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
            <Card
              title={
                <span className="text-base sm:text-lg">Активные промокоды</span>
              }
              className="shadow-sm min-h-32"
            >
              {activeCodes.length === 0 ? (
                <Empty description="Нет активных промокодов" />
              ) : (
                <ul className="list-disc ml-5 text-sm sm:text-base">
                  {activeCodes.map((code, idx) => (
                    <li key={idx} className="py-1">
                      <Text code>
                        {typeof code === "string" ? code : JSON.stringify(code)}
                      </Text>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              title={<span className="text-base sm:text-lg">Покупки</span>}
              className="shadow-sm min-h-32"
            >
              {purchased.length === 0 ? (
                <Empty description="Пока нет покупок" />
              ) : (
                <ul className="divide-y">
                  {purchased.map((item, idx) => (
                    <li
                      key={idx}
                      className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2"
                    >
                      <span className="break-all">
                        Товар ID: <Text strong>{item.product}</Text>
                      </span>
                      <span className="text-sm sm:text-base">
                        Кол-во: <Text>{item.count}</Text>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Карточка с информацией о баллах */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <span className="text-base sm:text-lg">Система баллов</span>
              </div>
            }
            className="shadow-sm mt-6"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-lg">✅</span>
                <div>
                  <Text strong>Начисление баллов:</Text>
                  <Text className="block text-sm text-gray-600">
                    При покупке на сумму свыше 1000₽ вы получаете баллы (1 балл = 25₽)
                  </Text>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg">💳</span>
                <div>
                  <Text strong>Оплата баллами:</Text>
                  <Text className="block text-sm text-gray-600">
                    Используйте накопленные баллы для оплаты покупок в магазине
                  </Text>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-purple-500 text-lg">🎯</span>
                <div>
                  <Text strong>Ваши баллы:</Text>
                  <Text className="block text-sm text-gray-600">
                    У вас {user.score || 0} баллов. {user.score > 0 ? 'Можете потратить их в магазине!' : 'Сделайте первую покупку, чтобы начать накапливать баллы.'}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Motion.div>
        </MotionConfig>
        <Footer />
      </div>
      <MobileFooter />
    </>
  );
}


