/**
 * @fileoverview EmptyStateCard - Componente reutilizável para estados vazios
 * Com ilustrações SVG animadas e CTAs claros
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
  illustration: ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'minimal' | 'card';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const illustrationVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export function EmptyStateCard({
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  variant = 'default',
}: EmptyStateCardProps) {
  const content = (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === 'minimal' ? 'py-8' : 'py-12 px-6',
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Ilustração com animação */}
      <motion.div
        className="mb-6 cursor-pointer"
        variants={illustrationVariants}
        whileHover="hover"
      >
        {illustration}
      </motion.div>

      {/* Título */}
      <motion.h3
        className={cn(
          "font-semibold text-foreground mb-2",
          variant === 'minimal' ? 'text-base' : 'text-lg'
        )}
        variants={itemVariants}
      >
        {title}
      </motion.h3>

      {/* Descrição */}
      <motion.p
        className={cn(
          "text-muted-foreground max-w-md mb-6",
          variant === 'minimal' ? 'text-xs' : 'text-sm'
        )}
        variants={itemVariants}
      >
        {description}
      </motion.p>

      {/* Ações */}
      {(primaryAction || secondaryAction) && (
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          variants={itemVariants}
        >
          {primaryAction && (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button onClick={primaryAction.onClick} className="gap-2">
                {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
                {primaryAction.label}
              </Button>
            </motion.div>
          )}
          {secondaryAction && (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}

EmptyStateCard.displayName = 'EmptyStateCard';

export default EmptyStateCard;
