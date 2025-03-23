import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  className?: string;
  showToday?: boolean;
  locale?: string;
}

const Calendar = ({
  value,
  onChange,
  min,
  max,
  className,
  showToday = true,
  locale = 'fr-FR'
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleString(locale, { month: 'long' })
  );

  const isDateDisabled = (date: Date) => {
    if (min && date < new Date(min.setHours(0, 0, 0, 0))) return true;
    if (max && date > new Date(max.setHours(23, 59, 59, 999))) return true;
    return false;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (!isDateDisabled(selectedDate)) {
      onChange?.(selectedDate);
    }
  };

  const getDayClassName = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const isSelected = value && date.toDateString() === value.toDateString();
    const isToday = date.toDateString() === today.toDateString();
    const disabled = isDateDisabled(date);

    return cn(
      'w-8 h-8 rounded-full flex items-center justify-center text-sm',
      'transition-colors duration-200',
      'hover:bg-gray-100 dark:hover:bg-gray-700',
      'cursor-pointer',
      {
        'bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]': isSelected,
        'text-[#1E3A8A] font-semibold': isToday && !isSelected,
        'opacity-50 cursor-not-allowed hover:bg-transparent': disabled
      }
    );
  };

  return (
    <div className={cn('p-4 bg-white dark:bg-gray-800 rounded-lg', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {months[currentMonth]} {currentYear}
        </h2>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {new Date(2021, 2, i + 1).toLocaleString(locale, { weekday: 'narrow' })}
          </div>
        ))}

        {/* Empty cells for previous month */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => (
          <motion.div
            key={i + 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDateClick(i + 1)}
            className={getDayClassName(i + 1)}
          >
            {i + 1}
          </motion.div>
        ))}
      </div>

      {/* Today button */}
      {showToday && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange?.(today)}
          className="mt-4 w-full py-2 text-sm text-[#1E3A8A] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          Aujourd'hui
        </motion.button>
      )}
    </div>
  );
};

export default Calendar;
