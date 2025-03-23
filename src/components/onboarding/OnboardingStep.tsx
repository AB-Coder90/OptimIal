import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OnboardingStepProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
}

const OnboardingStep = ({
  step,
  title,
  description,
  icon,
  isActive,
  isCompleted,
  children,
  onNext,
  onBack,
}: OnboardingStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
      className={`w-full max-w-2xl mx-auto ${!isActive && 'hidden'}`}
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isCompleted
                ? 'bg-[#1E3A8A] text-white'
                : 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
            }`}
          >
            {isCompleted ? <Check className="w-6 h-6" /> : icon}
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {children}
      </div>

      <div className="flex justify-between mt-8">
        {onBack ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            Retour
          </motion.button>
        ) : (
          <div />
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="px-6 py-2 bg-[#1E3A8A] text-white text-sm font-medium rounded-lg hover:bg-[#1E3A8A]/90"
        >
          {isCompleted ? 'Suivant' : 'Continuer'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OnboardingStep;
