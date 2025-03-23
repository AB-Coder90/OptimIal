import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface ComboboxProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  clearable?: boolean;
  searchable?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Combobox = ({
  options,
  value,
  onChange,
  onInputChange,
  placeholder = 'Sélectionner...',
  disabled = false,
  loading = false,
  error,
  clearable = true,
  searchable = true,
  className,
  size = 'md'
}: ComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sizes = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !inputRef.current?.contains(event.target as Node) &&
        !listboxRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      if (!selectedOption) {
        setSearchQuery('');
      }
    }
  }, [isOpen, selectedOption]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onInputChange?.(query);
    if (!isOpen) setIsOpen(true);
  };

  const handleOptionSelect = (option: Option) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative flex items-center',
          sizes[size],
          'px-3 rounded-lg border',
          'bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-white',
          disabled && 'opacity-50 cursor-not-allowed',
          error
            ? 'border-red-500 focus-within:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/20',
        )}
      >
        {searchable ? (
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchQuery : selectedOption?.label ?? ''}
            onChange={handleInputChange}
            onFocus={() => !disabled && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex-1 bg-transparent outline-none',
              'placeholder-gray-400 dark:placeholder-gray-500'
            )}
          />
        ) : (
          <div className="flex-1 truncate">
            {selectedOption?.label || placeholder}
          </div>
        )}

        <div className="flex items-center gap-1">
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-gray-300 border-t-[#1E3A8A] rounded-full"
            />
          )}

          {clearable && value && !disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange?.('');
                setSearchQuery('');
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        </div>
      </div>

      {error && (
        <div className="mt-1 text-sm text-red-500">
          {error}
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={listboxRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 w-full mt-1',
              'max-h-60 overflow-auto',
              'bg-white dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'rounded-lg shadow-lg'
            )}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                Aucun résultat
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                  className={cn(
                    'flex items-center px-4 py-2',
                    'cursor-pointer select-none',
                    highlightedIndex === index && 'bg-gray-100 dark:bg-gray-700',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="flex-1">
                    <div className="text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-[#1E3A8A]" />
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Combobox;
