import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  count = 1,
}) => {
  const baseClasses = 'bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-deep-700 dark:via-deep-600 dark:to-deep-700 animate-shimmer bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  ));

  return <>{skeletons}</>;
};

// Skeleton for Blog Post Card
export const BlogPostSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-deep-800 rounded-2xl overflow-hidden shadow-lg">
      <Skeleton variant="rectangular" height="200px" />
      <div className="p-6 space-y-4">
        <Skeleton variant="text" width="60%" height="24px" />
        <Skeleton variant="text" width="100%" height="16px" count={3} className="mb-2" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width="80px" height="24px" />
          <Skeleton variant="rectangular" width="80px" height="24px" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for Project Card
export const ProjectSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-deep-800 rounded-2xl overflow-hidden shadow-lg">
      <Skeleton variant="rectangular" height="200px" />
      <div className="p-6 space-y-4">
        <Skeleton variant="text" width="70%" height="24px" />
        <Skeleton variant="text" width="100%" height="16px" count={2} className="mb-2" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton variant="rectangular" width="60px" height="24px" />
          <Skeleton variant="rectangular" width="70px" height="24px" />
          <Skeleton variant="rectangular" width="80px" height="24px" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for Experience Card
export const ExperienceSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-deep-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height="24px" />
          <Skeleton variant="text" width="40%" height="18px" />
        </div>
        <Skeleton variant="rectangular" width="100px" height="28px" />
      </div>
      <Skeleton variant="text" width="100%" height="16px" count={2} />
    </div>
  );
};

// Skeleton for Skill Card
export const SkillSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-deep-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" width="40px" height="40px" />
        <Skeleton variant="text" width="120px" height="20px" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width="80%" height="16px" />
          <Skeleton variant="rectangular" width="100%" height="8px" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
