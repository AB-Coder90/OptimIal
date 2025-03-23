import { useState, useEffect, useCallback, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SplitterProps {
  direction?: 'horizontal' | 'vertical';
  defaultSizes?: number[];
  minSizes?: number[];
  maxSizes?: number[];
  children: ReactNode[];
  className?: string;
  gutterClassName?: string;
  gutterSize?: number;
  onChange?: (sizes: number[]) => void;
}

const Splitter = ({
  direction = 'horizontal',
  defaultSizes,
  minSizes = [],
  maxSizes = [],
  children,
  className,
  gutterClassName,
  gutterSize = 4,
  onChange
}: SplitterProps) => {
  const [sizes, setSizes] = useState<number[]>(() => {
    if (defaultSizes) return defaultSizes;
    const count = children.length;
    return Array(count).fill(100 / count);
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragIndex(index);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragIndex(null);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || dragIndex === null) return;

      const containerRect = document.getElementById('splitter-container')?.getBoundingClientRect();
      if (!containerRect) return;

      const containerSize = direction === 'horizontal' ? containerRect.width : containerRect.height;
      const mousePos = direction === 'horizontal' ? e.clientX : e.clientY;
      const containerStart = direction === 'horizontal' ? containerRect.left : containerRect.top;

      // Calculate new sizes based on mouse position
      const newPosition = ((mousePos - containerStart) / containerSize) * 100;
      const newSizes = [...sizes];
      
      // Calculate the size changes
      const sizeDiff = newPosition - (newSizes.slice(0, dragIndex + 1).reduce((a, b) => a + b, 0));
      
      // Apply size changes while respecting min/max constraints
      const applyNewSizes = (index: number, newSize: number) => {
        const minSize = minSizes[index] || 0;
        const maxSize = maxSizes[index] || 100;
        return Math.min(Math.max(newSize, minSize), maxSize);
      };

      newSizes[dragIndex] = applyNewSizes(dragIndex, sizes[dragIndex] + sizeDiff);
      newSizes[dragIndex + 1] = applyNewSizes(dragIndex + 1, sizes[dragIndex + 1] - sizeDiff);

      // Ensure total is still 100%
      const total = newSizes.reduce((a, b) => a + b, 0);
      if (Math.abs(total - 100) > 0.1) {
        const adjustment = (100 - total) / 2;
        newSizes[dragIndex] += adjustment;
        newSizes[dragIndex + 1] += adjustment;
      }

      setSizes(newSizes);
      onChange?.(newSizes);
    },
    [isDragging, dragIndex, sizes, direction, minSizes, maxSizes, onChange]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      id="splitter-container"
      className={cn(
        'flex',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {children.map((child, index) => (
        <div
          key={index}
          style={{
            [direction === 'horizontal' ? 'width' : 'height']: `${sizes[index]}%`,
            flexShrink: 0
          }}
        >
          {child}
          {index < children.length - 1 && (
            <motion.div
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
              onMouseDown={handleMouseDown(index)}
              className={cn(
                'flex items-center justify-center',
                direction === 'horizontal'
                  ? `w-[${gutterSize}px] cursor-col-resize -mx-[${gutterSize / 2}px]`
                  : `h-[${gutterSize}px] cursor-row-resize -my-[${gutterSize / 2}px]`,
                'relative z-10',
                gutterClassName
              )}
            >
              <div
                className={cn(
                  'rounded-full bg-gray-300 dark:bg-gray-600',
                  direction === 'horizontal'
                    ? 'h-8 w-1'
                    : 'w-8 h-1'
                )}
              />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Splitter;
