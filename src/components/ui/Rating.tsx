import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  precision?: 0.5 | 1;
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
  color?: string;
}

const Rating = ({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  precision = 1,
  readonly = false,
  showValue = false,
  className,
  color = '#1E3A8A'
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readonly) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - left) / width;

    if (precision === 0.5) {
      setHoverValue(index + (percent > 0.5 ? 1 : 0.5));
    } else {
      setHoverValue(index + 1);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readonly) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - left) / width;
    let newValue: number;

    if (precision === 0.5) {
      newValue = index + (percent > 0.5 ? 1 : 0.5);
    } else {
      newValue = index + 1;
    }

    onChange?.(newValue);
  };

  const getRatingFill = (index: number) => {
    const currentValue = isHovering ? hoverValue : value;
    const fill = Math.max(0, Math.min(1, currentValue - index));
    return `${fill * 100}%`;
  };

  const StarIcon = ({ index }: { index: number }) => {
    const fill = getRatingFill(index);

    return (
      <div
        className={cn(
          'relative cursor-pointer',
          readonly && 'cursor-default',
          sizes[size]
        )}
        onMouseMove={(e) => handleMouseMove(e, index)}
        onClick={(e) => handleClick(e, index)}
      >
        {/* Background star */}
        <Star
          className={cn(
            'absolute',
            'text-gray-300 dark:text-gray-600',
            sizes[size]
          )}
        />
        {/* Filled star */}
        <div style={{ width: fill, overflow: 'hidden' }}>
          <Star
            className={cn(
              'text-current',
              sizes[size]
            )}
            style={{ color }}
          />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className={cn('inline-flex items-center gap-1', className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setHoverValue(null);
      }}
    >
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, index) => (
          <StarIcon key={index} index={index} />
        ))}
      </div>
      
      {showValue && (
        <span
          className={cn(
            'ml-2 font-medium',
            size === 'sm' && 'text-sm',
            size === 'lg' && 'text-lg'
          )}
          style={{ color }}
        >
          {isHovering && hoverValue !== null
            ? hoverValue.toFixed(precision === 0.5 ? 1 : 0)
            : value.toFixed(precision === 0.5 ? 1 : 0)}
        </span>
      )}
    </motion.div>
  );
};

export const RatingGroup = ({
  items,
  className
}: {
  items: { label: string; value: number }[];
  className?: string;
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between"
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {item.label}
          </span>
          <Rating
            value={item.value}
            readonly
            size="sm"
          />
        </div>
      ))}
    </div>
  );
};

export default Rating;
