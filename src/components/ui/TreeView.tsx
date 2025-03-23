import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeItem {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeItem[];
}

interface TreeViewProps {
  items: TreeItem[];
  defaultExpanded?: string[];
  onSelect?: (item: TreeItem) => void;
  className?: string;
}

const TreeView = ({
  items,
  defaultExpanded = [],
  onSelect,
  className
}: TreeViewProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelect = (item: TreeItem) => {
    setSelectedItem(item.id);
    onSelect?.(item);
  };

  const TreeNode = ({ item, level = 0 }: { item: TreeItem; level?: number }) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedItem === item.id;

    return (
      <div>
        <motion.div
          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
          className={cn(
            'flex items-center py-1 px-2 rounded-lg cursor-pointer',
            'transition-colors duration-200',
            isSelected && 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
          )}
          style={{ paddingLeft: `${(level + 1) * 12}px` }}
          onClick={() => handleSelect(item)}
        >
          {hasChildren ? (
            <motion.button
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <span className="w-6" /> // Spacer for alignment
          )}

          <div className="flex items-center gap-2 ml-1">
            {item.icon || (hasChildren ? (
              <Folder className={cn(
                'w-5 h-5',
                isExpanded ? 'text-[#1E3A8A]' : 'text-gray-400'
              )} />
            ) : (
              <File className="w-5 h-5 text-gray-400" />
            ))}
            <span className="text-sm">{item.label}</span>
          </div>
        </motion.div>

        {hasChildren && (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.children?.map((child) => (
                  <TreeNode
                    key={child.id}
                    item={child}
                    level={level + 1}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'p-2 rounded-lg',
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {items.map((item) => (
        <TreeNode key={item.id} item={item} />
      ))}
    </div>
  );
};

export const TreeViewContext = ({
  items,
  onSelect,
  trigger,
  className
}: {
  items: TreeItem[];
  onSelect?: (item: TreeItem) => void;
  trigger: ReactNode;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute z-50 mt-2',
                'min-w-[200px]',
                'bg-white dark:bg-gray-800',
                'rounded-lg shadow-lg',
                'border border-gray-200 dark:border-gray-700',
                className
              )}
            >
              <TreeView
                items={items}
                onSelect={(item) => {
                  onSelect?.(item);
                  setIsOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreeView;
