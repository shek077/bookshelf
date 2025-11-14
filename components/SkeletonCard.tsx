
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="group perspective-1000">
      <div className="relative w-full aspect-[2/3] rounded-lg bg-white/60 shadow-lg overflow-hidden animate-pulse">
        <div className="w-full h-full bg-gray-300/50"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <div className="h-5 bg-gray-400/50 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-400/50 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
