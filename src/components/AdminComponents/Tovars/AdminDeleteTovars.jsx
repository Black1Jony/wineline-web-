
import api from "../../../utils/api";
import { useState, useEffect } from "react";
import { Pagination } from "antd";
import Card from "../../cards/card";

const AdminDeleteTovars = () => {
  const [tovars, setTovars] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Вино");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 24;
  const allTypes = ["Вино", "шампанское", "Виски", "Коньяк", "Джин", "вода"];

  const getProduct = async (page = currentPage) => {
    const resp = await api.get(
      `/search?q=${query}&type=${type}&page=${page}`
    );
    setTovars(resp.data.data);
    setTotalItems(resp.data.total);
  };

  useEffect(() => {
    getProduct();
  }, [query, type, currentPage]);

 const handleDelete = async (id, category) => {
   try {
     const types = {
       Вино: "wine",
       шампанское: "shampage",
       Коньяк: "konyak",
       Виски: "whiskey",
       Джин: "gin",
       вода: "voda",
     };

     await api.delete(
       `/product/${types[category]}/${id}`
     );

     // после удаления обновляем список
     const resp = await api.get(
       `/search?q=${query}&type=${type}&page=${currentPage}`
     );
     setTovars(resp.data.data);
     setTotalItems(resp.data.total);

     // если страница пустая после удаления, возвращаемся на предыдущую
     if (resp.data.data.length === 0 && currentPage > 1) {
       setCurrentPage(currentPage - 1);
     }
   } catch (err) {
     console.error(err);
   }
 };
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full sm:w-4/5 md:w-3/5 xl:w-2/5">
        <input
          type="text"
          className="w-full h-10 border border-[#575757] rounded-2xl p-2 px-8"
          placeholder="Товары"
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="text-2xl flex gap-8 font-Arial !font-medium">
        {allTypes.map((i) => (
          <h1
            className={`${type === i ? "text-[#b62c2c]" : "text-[#3a3a3a]"}`}
            onClick={() => {
              setType(i);
              setCurrentPage(1);
              setQuery("");
            }}
            key={i}
          >
            {i}
          </h1>
        ))}
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {tovars.map((i) => (
          <Card
            data={i}
            key={i.id}
            showDelete={true}
            onDelete={() => handleDelete(i.id, i.category)}
          />
        ))}
      </div>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger={false}
      />
    </div>
  );
};

export default AdminDeleteTovars;
