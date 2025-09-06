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

  const isGift = type === "gift";

  return (
    <section
      className={`relative transition-all duration-500 ${
        hideBanner ? "h-20" : "min-h-[360px]"
      }`}
    >
      {!hideBanner && (
        <div
          className={`w-full min-h-[360px] bg-no-repeat bg-right bg-cover flex px-6 md:px-20 py-6 items-center mt-10 rounded-2xl overflow-hidden ${s.responsiveBanner}`}
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        >
          {/* затемняющая подложка для читаемости текста */}
          {isGift && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          )}

          <div className="w-full md:w-[65%] flex flex-col relative z-10">
            <h1
              className={`font-bold ${
                isGift
                  ? "text-4xl md:text-5xl text-yellow-200 drop-shadow-lg"
                  : "text-[32px] md:text-[42px] text-white"
              }`}
            >
              {banner.title}
            </h1>
            {banner.description && (
              <p
                className={`mt-3 ${
                  isGift
                    ? "text-lg md:text-xl text-white/90 font-medium"
                    : "text-[16px] md:text-[20px] text-white font-medium hidden lg:block"
                }`}
              >
                {banner.description}
              </p>
            )}
          </div>
        </div>
      )}
      {hideBanner && (
        <h2
          className={`absolute top-0 left-6 font-bold text-xl ${
            isGift ? "text-yellow-200 drop-shadow" : "text-white"
          }`}
        >
          {banner.title}
        </h2>
      )}
    </section>
  );
};

export default BannerCategory;
