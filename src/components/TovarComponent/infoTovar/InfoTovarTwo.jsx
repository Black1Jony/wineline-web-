import { extractCategoryWithOther } from "./getInfo/getInfo";

const InfoTovarTwo = ({ data, type }) => {
  const { other } = extractCategoryWithOther(data, type);
  
  if (!other || other.length === 0) return null;

  return (
    <div className="bg-[#f4f4f4] rounded-3xl p-6   flex flex-col gap-5">
      {other.map((item, index) => (
        <div key={index} className=" last:mb-0 font-Arial flex flex-col gap-1">
          <span className="text-[18px] !font-semibold  text-gray-800">
            {item.label}
          </span>
          <span className="text-[14px] text-gray-700 mt-0.5">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default InfoTovarTwo;
