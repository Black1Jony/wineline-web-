import React from 'react'

const Tegi = ({tags}) => {
    console.log("tags", tags);
    if (!tags || tags.length === 0) return null
  return <>
  <div className='flex flex-col gap-7 w-full mt-4'>
    {tags.map((i, index)=> (
      <div className='flex gap-2 w-full items-center h-full' key={index} >
        <div className='text-[18px] font-Arial !font-medium'>{i.type}</div>
        <div className='flex gap-2'>
          {i.items.map((i, ind) =>(
            <div className='text-[16px] font-Arial !font-normal rounded-2xl border border-[#666666] px-5  text-[#3f3f3f] h-8 flex justify-center items-center' key={ind} >
              {i}      
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  </>
}

export default Tegi