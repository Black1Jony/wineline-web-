import api from "../../utils/api"
import Header from "../../components/Header/Header"
import Card from "../../components/cards/card"
import { favoriteStore } from "../../utils/store/favoriteStore"
import { useState, useEffect } from "react"
import Footer from "../../components/Footer/Footer"
import MobileFooter from "../../components/Footer/MobileFooter"
import { useNavigate } from "react-router-dom"
const Favorite = () => {
    const navigate = useNavigate()
const favorite = favoriteStore((state) => state.favorites);
if(!localStorage.getItem('user')) navigate('/')
    const [favorites, setFavorites] = useState([])
    useEffect(() => {
            if (favorite.length === 0) {
              setFavorites([]);
              return;
            }

            const fetchFavorites = async () => {
              try {
                const responses = await Promise.all(
                  favorite.map((id) =>
                    api.get(`/product/${id}`)
                  )
                );
                setFavorites(responses.map((r) => r.data));
              } catch (err) {
                console.error("Ошибка при загрузке избранных товаров:", err);
              }
            };

            fetchFavorites();
        
    }, [favorite]);
    console.log(favorites);
    
  return (
    <>
      <div className="pb-20 md:pb-0">
        <Header />
        {favorite.length >= 1 && (
        <div className="flex flex-col gap-4 mt-[30vh] w-[92%] justify-center self-center justify-self-center">
          <div className="flex !justify-between w-full font-Arial ">
            <div>
              <h1 className="text-[#aaa4a4] text-2xl">Избранные</h1>
            </div>
            <div>
              <h2 className="text-[#aaa4a4] text-2xl">
                {favorite.length} товаров
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {favorites?.map((i) => (
              <Card key={i.id} data={i} />
            ))}
          </div>
        </div>
      )}
      {favorite.length == 0 && (
        <div className="self-center mt-36 justify-self-center flex flex-col gap-4">
          <div>
            <img
              src="/public/assets/logos/page-notfound.png"
              alt="Not found"
              className="w-72 md:w-108"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className={`text-[#1b1b1b] text-[34px]`}>УПС!</h1>
            <h2 className={`text-[#1b1b1b] text-[28px]`}>
              Кажется у вас нет избранного
            </h2>
            <span className="text-3xl">🙁</span>
            <h2 className={`text-[#1b1b1b] text-[28px]`}>
              Добавьте что то 
            </h2>
          </div>
          <button
            onClick={() => {
              navigate('/')
            }}
            className={`bg-[#1b1b1b] w-full h-14 rounded-2xl p-3 !text-white font-Arial transition-all hover:bg-[#e06969]`}
          >
            Вернуться на Главную
          </button>
        </div>
        )}
        <Footer />
      </div>
      <MobileFooter />
    </>
  );
}

export default Favorite
