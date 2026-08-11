import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Props {
  showXP: number | null;
}

export function FeedbackPhase({ showXP }: Props) {
  return (
    <motion.div
      key="feedback"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 mx-auto mb-4 rounded-full bg-success flex items-center justify-center"
      >
        <Check className="h-10 w-10 text-success-foreground" />
      </motion.div>
      {showXP && (
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-warning"
        >
          +{showXP} XP!
        </motion.p>
      )}
    </motion.div>
  );
}
