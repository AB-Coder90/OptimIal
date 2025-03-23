import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  presetColors?: string[];
  showInput?: boolean;
  disabled?: boolean;
  className?: string;
}

const ColorPicker = ({
  value = '#1E3A8A',
  onChange,
  presetColors = [
    '#1E3A8A', // Primary blue
    '#3B82F6', // Secondary cyan
    '#F3F4F6', // Light gray
    '#FFFFFF', // White
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#000000', // Black
  ],
  showInput = true,
  disabled = false,
  className
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = (color: string) => {
    setInputValue(color);
    onChange?.(color);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Validate hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange?.(newValue);
    }
  };

  const isColorLight = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block', className)}
    >
      <div className="flex items-center gap-2">
        {/* Color Preview Button */}
        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'w-10 h-10 rounded-lg',
            'border border-gray-200 dark:border-gray-700',
            'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ backgroundColor: value }}
        />

        {/* Hex Input */}
        {showInput && (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            className={cn(
              'px-3 py-2 w-28',
              'text-sm font-mono',
              'rounded-lg border border-gray-200 dark:border-gray-700',
              'bg-white dark:bg-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            placeholder="#000000"
          />
        )}
      </div>

      {/* Color Picker Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 mt-2',
              'p-4 rounded-lg',
              'bg-white dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'shadow-lg'
            )}
          >
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleColorChange(color)}
                  className={cn(
                    'w-8 h-8 rounded-lg',
                    'border border-gray-200 dark:border-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2',
                    'flex items-center justify-center'
                  )}
                  style={{ backgroundColor: color }}
                >
                  {color === value && (
                    <Check
                      className={cn(
                        'w-4 h-4',
                        isColorLight(color) ? 'text-gray-900' : 'text-white'
                      )}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Custom Color Picker */}
            <input
              type="color"
              value={value}
              onChange={(e) => handleColorChange(e.target.value)}
              className={cn(
                'mt-4 w-full h-10',
                'rounded border border-gray-200 dark:border-gray-700',
                'cursor-pointer'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
