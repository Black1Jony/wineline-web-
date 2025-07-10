import { category } from "./category";
import './category.css';
import { useNavigate } from "react-router-dom";
const Category = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full mt-24 px-[4%]">
      <p className="  mb-6 DM">Популярные категории</p>

      <div className="grid grid-cols-5 gap-5">
        {category.map((item, index) => (
          <div
            key={index}
            className={"flex justify-between items-center bg-[#f4f4f4] rounded-xl h-28 px-4"}
            onClick={() => navigate(item.path)}
          >
            <h3 className="text-base font-medium w-1/2">{item.name}</h3>
            <img
              src={item.image}
              alt={item.name}
              className={` object-contain ${
                item.id === 5 ? "w-24 h-24 object-center" : "w-32 h-32"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
