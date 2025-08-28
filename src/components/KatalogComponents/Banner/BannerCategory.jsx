import { useState, useEffect } from "react";
import { bannersObj } from "./objCategory";
import s from "./banner.module.css";

const BannerCategory = ({ type }) => {
  const [banner, setBanner] = useState(null);
  const [hideBanner, setHideBanner] = useState(false);

  useEffect(() => {
    const found = bannersObj.find((i) => i.id === type);
    setBanner(found || null);
  }, [type]);

  const scrollHandler = () => {
    setHideBanner(window.scrollY > 200);
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  if (!banner) return null;

  const bgImage = banner.image?.startsWith("/")
    ? banner.image
    : `${banner.image}`;

  return (
    <section
      className={`relative transition-all duration-500 ${
        hideBanner ? "h-20" : "min-h-[360px]"
      }`}
    >
      {!hideBanner && (
        <div
          className={`w-full min-h-[360px] bg-no-repeat bg-right bg-contain flex px-6 md:px-20 py-6 items-center mt-10 ${s.responsiveBanner}`}
          style={{ backgroundImage: `url(${bgImage})` }}
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
        </div>
      )}
      {hideBanner && (
        <h2 className="absolute top-0 left-6 text-white font-bold text-xl">
          {banner.title}
        </h2>
      )}
    </section>
  );
};

export default BannerCategory;
