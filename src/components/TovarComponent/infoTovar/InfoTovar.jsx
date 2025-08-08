import { extractCategoryWithOther } from "./getInfo/getInfo";
import { useEffect, useState } from "react";
import Rating from "react-rating";

const starFull = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#a3003b"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="#a3003b"
    className="w-5 h-5"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const starEmpty = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="#a3003b"
    className="w-5 h-5"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const VerticalRating = ({ value }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Rating
        initialRating={value}
        emptySymbol={starEmpty}
        fullSymbol={starFull}
        fractions={10} 
        readonly
      />
    </div>
  );
};

const InfoTovar = ({ data, type, rating }) => {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (data && type) {
      const extractedCategory = extractCategoryWithOther(data, type).main;
      setCategory(extractedCategory);
    }
  }, [data, type]);

  return (
    <div className="font-sans text-sm text-gray-800">
      <div className="text-gray-500 mb-1">Рейтинг SW</div>

      <div className="flex items-start gap-4 mb-4">
        <span className="text-[#a3003b] text-2xl font-semibold leading-none">
          {rating ? rating : "0.0"}
        </span>

        <VerticalRating value={rating ? rating : "0.0"} />
      </div>

      <div className="space-y-1">
        {category.map((item, index) => (
          <div key={index} className="flex gap-1 text-[15px]">
            <span className="font-medium text-gray-500">{item.label}:</span>
            <span className="text-gray-700 ">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoTovar;
