import React from 'react'
import Header from '../../../components/Header/Header'
import SwiperWine from '../../../components/MainPageComponets/SwiperWine/SwiperWine';
import Category from '../../../components/MainPageComponets/reccomend/Category.jsx';
const MainPage = () => {
  return (
    <>
      <div className="relative">
        <Header />
        <div className="w-[100%] px-16 flex gap-5 mt-40 justify-between items-center">
          <SwiperWine />
          <div>
            sometext
          </div>
        </div>
        <Category />
      </div>
    </>
  );
}

export default MainPage
