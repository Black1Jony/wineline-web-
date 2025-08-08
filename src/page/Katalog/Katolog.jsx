import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import BannerCategory from "../../components/KatalogComponents/Banner/BannerCategory";
import Filter from "../../components/KatalogComponents/filter/Filter";
import CatalogTovars from "../../components/KatalogComponents/CatalogTovars/CatalogTovars";
import Footer from "../../components/Footer/Footer";
import OurPlusTwo from "../../components/MainPageComponets/OurPlus/OurPlusTwo";

const Katolog = () => {
  const { type } = useParams();

  return (
    <>
      <Header />
      <BannerCategory type={type} />

      <main
        className="w-[94%] mx-auto grid gap-12 relative"
        style={{ gridTemplateColumns: "1fr 2.8fr" }}
      >
        <Filter type={type} />
        <CatalogTovars type={type} />
      </main>

      <OurPlusTwo />
      <Footer />
    </>
  );
};

export default Katolog;
