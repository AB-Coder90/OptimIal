import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  disabled?: boolean;
  showTooltip?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

const Slider = ({
  min,
  max,
  step = 1,
  value: controlledValue,
  defaultValue = min,
  onChange,
  onChangeEnd,
  disabled = false,
  showTooltip = true,
  showValue = false,
  formatValue = (value) => value.toString(),
  className
}: SliderProps) => {
  const [value, setValue] = useState(controlledValue ?? defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== value) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMove = (clientX: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const width = rect.width;
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offset / width));
    const rawValue = min + (max - min) * percentage;
    const steppedValue = Math.round(rawValue / step) * step;
    const boundedValue = Math.min(max, Math.max(min, steppedValue));

    setValue(boundedValue);
    onChange?.(boundedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleMove(e.clientX);

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onChangeEnd?.(value);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleMove(e.touches[0].clientX);

    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      onChangeEnd?.(value);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className={cn('relative w-full pt-6 pb-2', className)}>
      {/* Track */}
      <div
        ref={sliderRef}
        className={cn(
          'h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Active Track */}
        <motion.div
          className="absolute h-1.5 rounded-full bg-[#1E3A8A]"
          style={{ width: `${percentage}%` }}
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Thumb */}
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
            'w-4 h-4 rounded-full bg-white border-2 border-[#1E3A8A]',
            'shadow-sm cursor-grab active:cursor-grabbing',
            'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2',
            disabled && 'cursor-not-allowed'
          )}
          style={{ left: `${percentage}%` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Tooltip */}
          {showTooltip && isDragging && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: -30 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                        px-2 py-1 rounded bg-[#1E3A8A] text-white text-sm
                        whitespace-nowrap"
            >
              {formatValue(value)}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Value display */}
      {showValue && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {formatValue(value)}
        </div>
      )}
    </div>
  );
};

export default Slider;
