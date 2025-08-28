import Header from "../../components/Header/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Card from "../../components/cards/card";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { query } = useParams();
  const navigate = useNavigate();
  const [currentSearch, setCurrentSearch] = useState(query);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  // сброс при смене запроса
  useEffect(() => {
    setSearchResults([]);
    setCurrentPage(1);
  }, [query]);

  // загрузка данных
  useEffect(() => {
    const getSearch = async () => {
      setLoading(true);
      try {
        const responce = await axios.get(
          `http://localhost:3000/search?${query}&page=${currentPage}`
        );

        setSearchResults((prev) => [...prev, ...responce.data.data]);

        if (responce?.data?.data?.length === 1) {
          navigate(`/product/${responce.data.data[0].id}`);
        }

        if (query.includes("q=")) setCurrentSearch(query.slice(2));
        if (query.includes("country=")) setCurrentSearch(query.slice(8));

        setTotalPage(Math.ceil(responce?.data?.total / 24));
        setTotal(responce.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getSearch();
  }, [query, navigate, currentPage]);

  // observer для infinite scroll
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPage) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, currentPage, totalPage]);

  return (
    <>
      <Header />

      {searchResults.length > 0 ? (
        <div className="flex flex-col w-[92%] p-4 gap-4 mt-[20vh] justify-self-center self-center">
          <div className="flex justify-between items-center">
            <h1 className="font-Arial text-3xl !font-semibold">
              {currentSearch}
            </h1>
            <h3 className="font-Arial !text-2xl !font-semibold text-[#a5a4a4]">
              {total} товаров
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
            {searchResults?.map((i, index) => (
              <Card data={i} key={index} />
            ))}
          </div>

          <div
            ref={loaderRef}
            className="h-10 flex justify-center items-center"
          >
            {loading && <p className="text-gray-500">Загрузка...</p>}
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-[92%] p-4 gap-4 mt-[20vh] justify-self-center self-center text-center">
          <h1 className="text-[#1b1b1b] text-[34px]">УПС!</h1>
          <h2 className="text-[#1b1b1b] text-[28px]">
            Кажется такого вкуса у нас нет
          </h2>
          <span className="text-3xl">🙁</span>
          <h2 className="text-[#1b1b1b] text-[28px]">
            Но у нас много других вкусов!
          </h2>

          <button
            onClick={() => navigate("/")}
            className="bg-[#1b1b1b] w-full h-14 rounded-2xl p-3 !text-white transition-all hover:bg-[#e06969]"
          >
            Вернуться в Каталог
          </button>
        </div>
      )}

      <Footer />
    </>
  );
};

export default SearchPage;
