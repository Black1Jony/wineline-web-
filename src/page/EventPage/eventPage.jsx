import { useEffect, useState, useCallback } from "react";
import api from "../../utils/api";
import { Card, Row, Col, DatePicker, InputNumber, Space } from "antd";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MobileFooter from "../../components/Footer/MobileFooter";
import dayjs from "dayjs";
import "dayjs/locale/ru.js";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
dayjs.locale("ru");
const { RangePicker } = DatePicker;

const EventPage = () => {
  const navigate = useNavigate()
  const [eventsByDate, setEventsByDate] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: null,
    minPrice: null,
    maxPrice: null,
  });

  const fetchEvents = useCallback(async () => {
    try {
      const params = { byDate: true };
      if (filters.dateRange) {
        params.fromDate = filters.dateRange[0].format("DD.MM");
        params.toDate = filters.dateRange[1].format("DD.MM");
      }
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const resp = await api.get("/event", { params });
      setEventsByDate(resp.data.data);
    } catch (err) {
      console.error("Ошибка при загрузке событий", err);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [filters, fetchEvents]);


  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month] = dateStr.split(".");
    const currentYear = new Date().getFullYear();
    const date = dayjs(`${currentYear}-${month}-${day}`, "YYYY-MM-DD");
    const formatted = date.format("dddd, D MMMM"); // "пятница, 28 марта"
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };
  
  return (
    <>
      <div className="pb-20 md:pb-0">
        <Header />
        <motion.div
        className="max-w-7xl mx-auto px-4 py-8 mt-[25vh]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          События
        </motion.h1>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Space wrap>
            <RangePicker
              format="DD.MM" // без года
              disabledDate={(current) => {
                if (!current) return false;
                return current < dayjs().startOf("day");
              }}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              value={filters.dateRange}
            />
            <InputNumber
              placeholder="Мин. цена"
              onChange={(value) => setFilters({ ...filters, minPrice: value })}
            />
            <InputNumber
              placeholder="Макс. цена"
              onChange={(value) => setFilters({ ...filters, maxPrice: value })}
            />
          </Space>
        </motion.div>

        {eventsByDate.map(({ date, events }, i) => (
          <motion.div
            key={date}
            className="mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold mb-4">{formatDate(date)}</h2>
            <Row gutter={[16, 16]}>
              {events.map((event) => (
                <Col xs={24} sm={12} lg={8} key={event.id}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Card
                      hoverable
                      onClick={() => navigate(`/event/${event.id}`)}
                      cover={
                        <motion.div
                          className="overflow-hidden rounded-lg"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            alt={event.fullname}
                            src={event.image}
                            className="w-full h-60 object-cover"
                          />
                        </motion.div>
                      }
                    >
                      <Card.Meta
                        title={event.fullname}
                        description={
                          <>
                            <p>{event.time}</p>
                            <p className="font-bold">{event.price} сом</p>
                            <p>{event.address}</p>
                          </>
                        }
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        ))}

        {eventsByDate.length === 0 && (
          <motion.div
            className="self-center justify-self-center flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <img
                src="/public/assets/logos/page-notfound.png"
                alt="Not found"
                className="w-72 md:w-108"
              />
            </div>
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-[#1b1b1b] text-[34px]">УПС!</h1>
              <h2 className="text-[#1b1b1b] text-[28px]">
                Кажется таких мероптиятие нету
              </h2>
              <span className="text-3xl">🙁</span>
              <h2 className="text-[#1b1b1b] text-[28px]">приходите позже</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/");
              }}
              className="bg-[#1b1b1b] w-full h-14 rounded-2xl p-3 text-white transition-all hover:bg-[#e06969]"
            >
              Вернуться на главную
            </motion.button>
          </motion.div>
        )}
        </motion.div>
        <Footer />
      </div>
      <MobileFooter />
    </>
  );
};

export default EventPage;
