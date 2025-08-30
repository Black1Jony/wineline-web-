import api from "../../../utils/api";
import { useState, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const currentAdmin = localStorage.getItem("user");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get(
          `/users?key=qwaksfepaasncop239213x1mx9xm312xnqwex29&q=${query}`
        );
        setUsers(response.data);
      } catch (err) {
        console.error("Ошибка загрузки пользователей:", err);
      }
    };
    getUsers();
  }, [query]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Поиск */}
      <div className="w-full sm:w-4/5 md:w-3/5 xl:w-2/5">
        <input
          type="text"
          className="w-full h-10 border border-[#575757] rounded-2xl p-2 px-8"
          placeholder="пользователи"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Список пользователей */}
      {users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users
            .filter((u) => u.id !== currentAdmin)
            .map((u) => (
              <div
                className="flex flex-col gap-2 rounded-2xl bg-[#5f5f5f] p-2 px-4 relative"
                key={u.id}
              >
                <div className="w-12 h-12 flex items-center gap-4">
                  <img src="/assets/icons/profile-picture.png" alt="" />
                  <h2 className="text-2xl text-[#dddddd]">{u.name}</h2>
                </div>
                <div className="justify-between flex text-2xl Font-Arial">
                  <h2 className="text-[#dddddd]">{u.shop.length} в корзине</h2>
                  <h2 className="text-[#dddddd]">
                    {u.favorites.length} избранных
                  </h2>
                </div>
                <DeleteOutlined
                  className="absolute left-[88%] text-white text-3xl top-[4%]"
                  onClick={async () => {
                    await api.delete(
                      `/users/${u.id}?key=qwaksfepaasncop239213x1mx9xm312xnqwex29`
                    );
                    setUsers((prev) => prev.filter((item) => item.id !== u.id));
                  }}
                />
              </div>
            ))}
        </div>
      )}

      {/* Пустой результат */}
      {users.length === 0 && (
        <div className="self-center mt-36 justify-self-center flex flex-col gap-4">
          <div>
            <img
              src="/assets/logos/page-notfound.png"
              alt="Not found"
              className="w-72 md:w-108"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-[#1b1b1b] text-[34px]">УПС!</h1>
            <h2 className="text-[#1b1b1b] text-[28px]">
              Кажется пользователи не найдены
            </h2>
            <span className="text-3xl">🙁</span>
            <h2 className="text-[#1b1b1b] text-[28px]">Проверьте потом</h2>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-[#1b1b1b] w-full h-14 rounded-2xl p-3 text-white font-Arial transition-all hover:bg-[#e06969]"
          >
            Вернуться на Главную
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;
