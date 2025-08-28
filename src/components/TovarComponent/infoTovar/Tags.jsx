import './tags.css'
const Line = ({rate} ) =>{
  const num = rate.replace(/\D/g, "");
  const percent = 20 * num;
  const last = "\u00A0" + rate.slice(-1);
  const first = rate.slice(0, -1); + "  "
  return (
    <div className='w-full h-auto flex flex-col gap-2' >
      <div className='flex'>
      <span>{first}</span>
      <span className={`last-Leter ${last === 'а' ? 'bg-[#991919]' : ''}`}>{last}</span>
      </div>
    <div className="w-full h-3 bg-[#e2e2e2] rounded-full">
      <div
        className="h-full bg-[#a61d47] rounded-full"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
    </div>
  );
}

const Tags = ({Tags}) => {
  return (
    <>
      <div className="flex flex-col gap-2 w-full p-7 rounded-2xl bg-[#f4f4f4]">
        <h1 className='text-xl !font-semibold'>Вкус</h1>
        <div className="flex flex-wrap gap-4">
          {Tags?.map((tag, index) => (
            
              <Line key={index} rate={tag.name} />
            
          ))}
        </div>
      </div>
    </>
  );
}

export default Tags