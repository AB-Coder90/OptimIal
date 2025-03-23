import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) => {
  const getAnimationClass = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-shimmer';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded',
        variant === 'rectangular' && 'rounded-lg',
        getAnimationClass(),
        className
      )}
      style={{
        width: width,
        height: height
      }}
    />
  );
};

export const SkeletonText = ({
  lines = 1,
  lastLineWidth = '100%',
  spacing = 'tight',
  className
}: {
  lines?: number;
  lastLineWidth?: string | number;
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}) => {
  const spacingClasses = {
    tight: 'space-y-1',
    normal: 'space-y-2',
    loose: 'space-y-4'
  };

  return (
    <div className={cn('w-full', spacingClasses[spacing], className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height={12}
          className="rounded"
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({
  className,
  hasImage = true,
  lines = 3
}: {
  className?: string;
  hasImage?: boolean;
  lines?: number;
}) => {
  return (
    <div
      className={cn(
        'w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {hasImage && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          className="mb-4"
        />
      )}
      <Skeleton
        variant="text"
        width="60%"
        height={24}
        className="mb-4"
      />
      <SkeletonText
        lines={lines}
        lastLineWidth="80%"
        spacing="normal"
      />
    </div>
  );
};

export const SkeletonAvatar = ({
  size = 40,
  className
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const SkeletonButton = ({
  width = 100,
  height = 36,
  className
}: {
  width?: number;
  height?: number;
  className?: string;
}) => {
  return (
    <Skeleton
      variant="rectangular"
      width={width}
      height={height}
      className={cn('rounded-lg', className)}
    />
  );
};

export default Skeleton;
