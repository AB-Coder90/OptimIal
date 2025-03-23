import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  onChange?: (tabId: string) => void;
}

const Tabs = ({
  tabs,
  defaultTab,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  onChange
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const getTabStyle = (isActive: boolean) => {
    const baseStyles = 'flex items-center space-x-2 transition-colors duration-200';
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    };

    switch (variant) {
      case 'pills':
        return cn(
          baseStyles,
          sizes[size],
          'rounded-full',
          isActive
            ? 'bg-[#1E3A8A] text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        );
      case 'underline':
        return cn(
          baseStyles,
          sizes[size],
          'border-b-2',
          isActive
            ? 'border-[#1E3A8A] text-[#1E3A8A] dark:text-white'
            : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        );
      default:
        return cn(
          baseStyles,
          sizes[size],
          'rounded-lg',
          isActive
            ? 'bg-white dark:bg-gray-800 text-[#1E3A8A] shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        );
    }
  };

  return (
    <div className={className}>
      <div
        className={cn(
          'flex',
          variant === 'default' && 'bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg',
          variant === 'underline' && 'border-b border-gray-200 dark:border-gray-700',
          fullWidth ? 'w-full' : 'inline-flex',
          'mb-4'
        )}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            className={cn(
              getTabStyle(activeTab === tab.id),
              fullWidth && 'flex-1 justify-center',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </motion.div>
    </div>
  );
};

export default Tabs;
