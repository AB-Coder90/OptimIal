import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

const Avatar = ({
  src,
  alt,
  initials,
  size = 'md',
  status,
  className,
  onClick
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const showInitials = !src || imageError;
  const AvatarWrapper = onClick ? motion.button : motion.div;

  return (
    <AvatarWrapper
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center flex-shrink-0',
        'rounded-full',
        'bg-[#1E3A8A] dark:bg-[#3B82F6]',
        sizes[size],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {showInitials ? (
        <span className="font-medium text-white">
          {initials || (alt ? alt.charAt(0).toUpperCase() : '?')}
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0',
            'rounded-full ring-2 ring-white dark:ring-gray-800',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </AvatarWrapper>
  );
};

interface AvatarGroupProps {
  avatars: Array<Omit<AvatarProps, 'size'>>;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export const AvatarGroup = ({
  avatars,
  max,
  size = 'md',
  className
}: AvatarGroupProps) => {
  const displayAvatars = max ? avatars.slice(0, max) : avatars;
  const remainingCount = max ? Math.max(0, avatars.length - max) : 0;

  const getOffset = () => {
    switch (size) {
      case 'xs':
        return '-ml-1.5';
      case 'sm':
        return '-ml-2';
      case 'md':
        return '-ml-2.5';
      case 'lg':
        return '-ml-3';
      case 'xl':
        return '-ml-4';
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            index !== 0 && getOffset(),
            'ring-2 ring-white dark:ring-gray-800 rounded-full'
          )}
        >
          <Avatar {...avatar} size={size} />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            getOffset(),
            'ring-2 ring-white dark:ring-gray-800 rounded-full',
            'bg-gray-100 dark:bg-gray-700',
            'flex items-center justify-center',
            sizes[size]
          )}
        >
          <span className="font-medium text-gray-600 dark:text-gray-300">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
