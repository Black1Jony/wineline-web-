import RedBanner from './redBanner/RedBannner'
import TasteSkeleton from '../../Skeletons/TasteSkeleton';
const EventTaste = () => {
  const elements = []
  for (let index = 1; index <= 6; index++) {
    elements.push(index)
  }
  return (
    <div className="w-[92%] min-h-[300px] md:min-h-[300px] flex flex-col justify-self-center self-center mt-12 mb-12">
      <RedBanner />
      <div className="w-full mt-8">
        {" "}
        <h1 className='text-2xl '>Винные меропртиятие</h1>
      </div>
      <div className="min-w-full flex  overflow-x-scroll scrollbar-hide mt-4 min-h-[380px] gap-6">
        {elements.map((i) => (
          <TasteSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default EventTaste;
