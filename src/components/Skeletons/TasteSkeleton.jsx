import { Skeleton } from "antd"

const TasteSkeleton = () => {
  return (
    <div className="w-[100%] h-full">
      <Skeleton.Image
      style={{
        width: '200px',
        height: '120px',
      }}
      />
      <div className="mt-2"></div>
      <Skeleton
      paragraph={{
        rows: 2,
      }}
      active
      
      />
    </div>
  );
}

export default TasteSkeleton
