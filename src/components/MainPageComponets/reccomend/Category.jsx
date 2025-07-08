import { category } from "./category"
const Category = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-24">
        <div className="w-[92%]">
          <h1 className=" !font-medium text-2xl">популярные категории</h1>
        </div>
        <div className="w-[92%] gap-6 grid grid-cols-5 grid-rows-2 justify-self-center self-center">
          {category.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center bg-[#f4f4f4] gap-2 rounded-[12px] h-28"
            >
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Category
