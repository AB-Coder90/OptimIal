import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string | number;
  title: string;
  description?: string;
  icon?: ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showNumbers?: boolean;
  className?: string;
}

const Stepper = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  size = 'md',
  showNumbers = true,
  className
}: StepperProps) => {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-sm',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      spacing: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4'
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-base',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      spacing: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6'
    },
    lg: {
      icon: 'w-10 h-10',
      text: 'text-lg',
      connector: orientation === 'horizontal' ? 'h-1' : 'w-1',
      spacing: orientation === 'horizontal' ? 'space-x-8' : 'space-y-8'
    }
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  const StepIcon = ({ step, index, status }: { step: Step; index: number; status: string }) => {
    return (
      <motion.div
        whileHover={onStepClick ? { scale: 1.1 } : {}}
        whileTap={onStepClick ? { scale: 0.95 } : {}}
        className={cn(
          'rounded-full flex items-center justify-center',
          sizes[size].icon,
          status === 'completed' && 'bg-[#1E3A8A] text-white',
          status === 'current' && 'bg-[#1E3A8A] text-white ring-4 ring-[#1E3A8A]/20',
          status === 'upcoming' && 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
        )}
      >
        {status === 'completed' ? (
          <Check className="w-5 h-5" />
        ) : (
          step.icon || (showNumbers && index + 1)
        )}
      </motion.div>
    );
  };

  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            'flex',
            orientation === 'horizontal' ? 'flex-col items-center' : 'flex-row items-start',
            index !== steps.length - 1 && sizes[size].spacing
          )}
        >
          {/* Step content */}
          <div
            className={cn(
              'flex',
              orientation === 'horizontal' ? 'flex-col items-center' : 'flex-row items-center space-x-4'
            )}
            onClick={() => onStepClick?.(index)}
          >
            <StepIcon
              step={step}
              index={index}
              status={getStepStatus(index)}
            />
            <div className={cn(
              'mt-2',
              orientation === 'horizontal' ? 'text-center' : 'text-left',
              sizes[size].text
            )}>
              <div className={cn(
                'font-medium',
                getStepStatus(index) === 'current' ? 'text-[#1E3A8A]' : 'text-gray-900 dark:text-white'
              )}>
                {step.title}
              </div>
              {step.description && (
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  {step.description}
                </div>
              )}
            </div>
          </div>

          {/* Connector */}
          {index !== steps.length - 1 && (
            <div
              className={cn(
                'flex-1',
                orientation === 'horizontal' ? 'w-full' : 'h-full',
                sizes[size].connector,
                'bg-gray-200 dark:bg-gray-700',
                getStepStatus(index) === 'completed' && 'bg-[#1E3A8A]'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
