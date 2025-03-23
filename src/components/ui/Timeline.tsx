import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: ReactNode;
  status?: 'completed' | 'current' | 'upcoming';
  content?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Timeline = ({
  items,
  orientation = 'vertical',
  size = 'md',
  className
}: TimelineProps) => {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      connector: orientation === 'vertical' ? 'w-px' : 'h-px',
      spacing: orientation === 'vertical' ? 'space-y-4' : 'space-x-4',
      text: 'text-sm'
    },
    md: {
      icon: 'w-8 h-8',
      connector: orientation === 'vertical' ? 'w-px' : 'h-px',
      spacing: orientation === 'vertical' ? 'space-y-6' : 'space-x-6',
      text: 'text-base'
    },
    lg: {
      icon: 'w-10 h-10',
      connector: orientation === 'vertical' ? 'w-px' : 'h-px',
      spacing: orientation === 'vertical' ? 'space-y-8' : 'space-x-8',
      text: 'text-lg'
    }
  };

  const getStatusColor = (status?: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#1E3A8A] text-white';
      case 'current':
        return 'bg-[#1E3A8A] text-white ring-4 ring-[#1E3A8A]/20';
      default:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500';
    }
  };

  const TimelineItemComponent = ({ item, isLast }: { item: TimelineItem; isLast: boolean }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative',
          orientation === 'vertical' ? 'pl-8' : ''
        )}
      >
        {/* Icon/Dot */}
        <div
          className={cn(
            'absolute',
            orientation === 'vertical' ? '-left-[13px]' : '-top-[13px]',
            'flex items-center justify-center rounded-full',
            getStatusColor(item.status),
            sizes[size].icon
          )}
        >
          {item.icon}
        </div>

        {/* Connector Line */}
        {!isLast && (
          <div
            className={cn(
              'absolute bg-gray-200 dark:bg-gray-700',
              orientation === 'vertical'
                ? 'left-0 top-0 h-full'
                : 'left-0 top-1/2 w-full',
              sizes[size].connector,
              item.status === 'completed' && 'bg-[#1E3A8A]'
            )}
          />
        )}

        {/* Content */}
        <div className={cn('pb-6', sizes[size].text)}>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {item.title}
              </h3>
              {item.date && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.date}
                </span>
              )}
            </div>
            {item.description && (
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            )}
            {item.content && (
              <div className="mt-3">
                {item.content}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={cn(
        orientation === 'vertical'
          ? 'relative pl-4'
          : 'flex items-start',
        className
      )}
    >
      <div
        className={cn(
          orientation === 'vertical'
            ? 'space-y-6'
            : 'flex space-x-6'
        )}
      >
        {items.map((item, index) => (
          <TimelineItemComponent
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
