import { category } from "./category";
import "./category.css";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full mt-24 px-4 md:px-[4%]">
      <h2 className="mb-6 DM text-xl font-semibold">Популярные категории</h2>

      <div className="relative">
        <div
          className="
            grid 
            gap-4 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5 
            overflow-x-auto 
            auto-cols-[minmax(200px,1fr)] 
            pb-4 
            hide-scrollbar
          "
        >
          {category.map((item) => (
            <article
              key={item.id}
              className="
                flex justify-between items-center 
                bg-[#f4f4f4] rounded-xl h-28 px-4 
                cursor-pointer hover:bg-[#e8e8e8] 
                transition-colors
              "
              onClick={() => navigate(item.path)}
              tabIndex={0}
              role="button"
              aria-label={`Перейти в категорию ${item.name}`}
              onKeyDown={(e) => e.key === "Enter" && navigate(item.path)}
            >
              <h3 className="text-base font-medium w-1/2">{item.name}</h3>
              <img
                src={item.image}
                alt={item.name}
                className={`object-contain ${
                  item.id === 5 ? "w-26 h-26" : "w-28 h-28"
                }`}
                loading="lazy"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
