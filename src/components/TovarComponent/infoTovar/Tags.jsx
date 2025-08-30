import './tags.css'
import { MotionConfig, motion as Motion } from "motion/react";

const Line = ({ rate }) => {
  const num = String(rate).replace(/\D/g, "");
  const percent = Math.min(100, 20 * (parseInt(num || '0', 10)));
  const lastChar = String(rate).slice(-1);
  const first = String(rate).slice(0, -1);
  return (
    <div className='w-full h-auto flex flex-col gap-2'>
      <div className='flex items-baseline gap-1 text-sm sm:text-base'>
        <span>{first}</span>
        <span className={`last-Leter ${lastChar === 'а' ? 'bg-[#991919]' : ''}`}>{lastChar}</span>
      </div>
      <div className="w-full h-2 sm:h-3 bg-[#e2e2e2] rounded-full">
        <div
          className="h-full bg-[#a61d47] rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

const Tags = ({ Tags }) => {
  return (
    <>
      <MotionConfig reducedMotion="user">
        <Motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3 w-full p-5 sm:p-7 rounded-2xl bg-[#f4f4f4]"
        >
          <h1 className='text-lg sm:text-xl !font-semibold'>Вкус</h1>
          <div className="grid grid-cols-1 gap-4">
            {Tags?.map((tag, index) => (
              <Line key={index} rate={tag.name} />
            ))}
          </div>
        </Motion.div>
      </MotionConfig>
    </>
  );
}

export default Tags