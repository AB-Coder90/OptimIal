import { useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  items: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  infinite?: boolean;
  className?: string;
}

const Carousel = ({
  items,
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  infinite = true,
  className
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isPaused, setIsPaused] = useState(false);

  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right') => ({
      zIndex: 0,
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: 'left' | 'right') => {
    setDirection(newDirection);
    if (newDirection === 'right') {
      setCurrentIndex((prev) =>
        prev === items.length - 1 ? (infinite ? 0 : prev) : prev + 1
      );
    } else {
      setCurrentIndex((prev) =>
        prev === 0 ? (infinite ? items.length - 1 : prev) : prev - 1
      );
    }
  }, [items.length, infinite]);

  useEffect(() => {
    if (autoPlay && !isPaused) {
      const timer = setInterval(() => {
        paginate('right');
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, isPaused, paginate]);

  const NavigationButton = ({
    direction,
    onClick
  }: {
    direction: 'left' | 'right';
    onClick: () => void;
  }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'absolute top-1/2 -translate-y-1/2',
        'p-2 rounded-full',
        'bg-white/80 dark:bg-gray-800/80',
        'text-gray-800 dark:text-white',
        'hover:bg-white dark:hover:bg-gray-800',
        'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2',
        'shadow-lg backdrop-blur-sm',
        direction === 'left' ? 'left-4' : 'right-4'
      )}
      onClick={onClick}
    >
      {direction === 'left' ? (
        <ChevronLeft className="w-6 h-6" />
      ) : (
        <ChevronRight className="w-6 h-6" />
      )}
    </motion.button>
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate("right");
            } else if (swipe > swipeConfidenceThreshold) {
              paginate("left");
            }
          }}
          className="absolute w-full h-full"
        >
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <NavigationButton
            direction="left"
            onClick={() => paginate('left')}
          />
          <NavigationButton
            direction="right"
            onClick={() => paginate('right')}
          />
        </>
      )}

      {/* Dots Navigation */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                setDirection(index > currentIndex ? 'right' : 'left');
                setCurrentIndex(index);
              }}
              className={cn(
                'w-2 h-2 rounded-full',
                'transition-colors duration-200',
                index === currentIndex
                  ? 'bg-[#1E3A8A]'
                  : 'bg-white/50 hover:bg-white dark:bg-gray-600 dark:hover:bg-gray-500'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CarouselItem = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('w-full h-full', className)}>
      {children}
    </div>
  );
};

export default Carousel;
