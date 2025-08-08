import { bannersObj } from "./objCategory";
import { useState, useEffect } from "react";
import s from "./banner.module.css";

const BannerCategory = ({ type }) => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const found = bannersObj.find((i) => i.id === type);
    if (found) setBanner(found);
    else setBanner(null);
  }, [type]);

  if (!banner) return null;

  const bgImage = banner.image?.startsWith("/")
    ? banner.image
    : `${banner.image}`;

  return (
    <>
      {banner.id !== "gift" && (
        <section
          aria-label={`Баннер раздела ${banner.title}`}
          className={`w-full min-h-[360px] bg-no-repeat bg-right bg-contain flex px-6 md:px-20 py-6 items-center mt-10 ${s.responsiveBanner}`}
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        >
          <div className="w-full md:w-[65%] flex flex-col">
            <h1 className="text-[32px] md:text-[42px] text-white font-bold">
              {banner.title}
            </h1>
            {banner.description && (
              <p className="text-[16px] md:text-[20px] text-white font-medium mt-3 hidden lg:block">
                {banner.description}
              </p>
            )}
          </div>
        </section>
      )}
      <div className="flex px-6 md:px-14 mt-6">
        <p className="text-[16px] md:text-[20px] text-[#252424] font-medium hidden lg:hidden"></p>
      </div>
    </>
  );
};

export default BannerCategory;
