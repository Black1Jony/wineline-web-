import RedBanner from "./redBanner/RedBannner";
import TasteSkeleton from "../../Skeletons/TasteSkeleton";
import { useState, useEffect } from "react";
import api from "../../../utils/api";
import dayjs from "dayjs";
import "dayjs/locale/ru.js";
import { useNavigate } from "react-router-dom";
dayjs.locale("ru");

const EventTaste = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // -------------------------------
  // Функция форматирования даты
  // -------------------------------
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [day, month] = dateStr.split(".");
    const currentYear = new Date().getFullYear();

    const date = dayjs(`${currentYear}-${month}-${day}`, "YYYY-MM-DD");
    let formatted = date.format("dddd, D MMMM"); // пример: "пятница, 30 августа"

    // первая буква с заглавной
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // -------------------------------
  // Загрузка данных
  // -------------------------------
  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await api.get("/event", {
          params: { byDate: false }, // получаем обычный массив событий
        });
        setData(resp.data.data.slice(0, 4)); // берем первые 4 события
      } catch (err) {
        console.error("Ошибка при загрузке событий:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // -------------------------------
  // Рендер
  // -------------------------------
  if (loading) {
    return <TasteSkeleton />;
  }
  return (
    <div className="w-[92%] min-h-[300px] md:min-h-[300px] flex flex-col justify-self-center self-center mt-12 mb-12">
      <RedBanner />
      <div className="w-full mt-8">
        <h1 className="text-2xl font-semibold">Винные мероприятия</h1>
      </div>
      <div className="min-w-full grid grid-cols-1 overflow-x-scroll scrollbar-hide mt-4 min-h-[380px] gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {data.length === 0 ? (
          <p>События не найдены</p>
        ) : (
          data.map((event) => (
            <div
              key={event.id}
              className="flex-shrink-0 w-full bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-2"
              onClick={()=> navigate(`/event/${event.id}`)}
            >
              <img
                src={event.image}
                alt={event.fullname}
                className="w-full h-[200px] object-cover rounded-lg"
              />
              <h2 className="mt-2 text-lg font-semibold line-clamp-2">
                {event.fullname}
              </h2>
              <p className="text-xl mt-1 font-bold text-red-600">
                {event.price} сом
              </p>

              <p className="text-sm mt-1 text-gray-600">
                {formatDate(event.date)} | {event.time}
              </p>
              <p className="text-sm mt-1 text-gray-500">{event.address}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventTaste;
