/**
 * @fileoverview Form Progress Component
 * Shows step indicator and progress for multi-step forms
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface FormStep {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
}

interface FormProgressProps {
  steps: FormStep[];
  currentStep: number;
  completedSteps: number[];
  variant?: 'horizontal' | 'vertical';
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
  className?: string;
}

export function FormProgress({
  steps,
  currentStep,
  completedSteps,
  variant = 'horizontal',
  onStepClick,
  allowNavigation = false,
  className
}: FormProgressProps) {
  const handleStepClick = (index: number) => {
    if (allowNavigation && onStepClick) {
      // Only allow navigating to completed steps or the next step
      if (completedSteps.includes(index) || index <= Math.max(...completedSteps, -1) + 1) {
        onStepClick(index);
      }
    }
  };

  if (variant === 'vertical') {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          const isClickable = allowNavigation && (isCompleted || index <= currentStep);

          return (
            <div
              key={step.id}
              className={cn(
                "flex gap-4",
                isClickable && "cursor-pointer"
              )}
              onClick={() => handleStepClick(index)}
              role={allowNavigation ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
                  handleStepClick(index);
                }
              }}
            >
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && !isCompleted && "border-primary text-primary bg-primary/10",
                    !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground"
                  )}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : undefined}
                  transition={{ duration: 0.5 }}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </motion.div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      "w-0.5 h-12 mt-2",
                      completedSteps.includes(index) ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "font-medium",
                    isCurrent && "text-primary",
                    !isCurrent && !isCompleted && "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                  {step.isOptional && (
                    <span className="text-xs text-muted-foreground">(Opcional)</span>
                  )}
                </div>
                {step.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          const isClickable = allowNavigation && (isCompleted || index <= currentStep);

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle and label */}
              <div
                className={cn(
                  "flex flex-col items-center gap-2",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => handleStepClick(index)}
                role={allowNavigation ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
                    handleStepClick(index);
                  }
                }}
              >
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && !isCompleted && "border-primary text-primary bg-primary/10 shadow-lg shadow-primary/20",
                    !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground"
                  )}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : undefined}
                  transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 2 }}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </motion.div>
                
                <div className="text-center">
                  <p className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-primary",
                    !isCurrent && !isCompleted && "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                  {step.isOptional && (
                    <span className="text-xs text-muted-foreground">(Opcional)</span>
                  )}
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center justify-center px-4 -mt-8">
                  <div 
                    className={cn(
                      "h-0.5 w-full transition-colors",
                      isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                  <ChevronRight className={cn(
                    "h-4 w-4 -ml-0.5 transition-colors",
                    isCompleted ? "text-primary" : "text-muted-foreground/30"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Simple progress bar for forms
 */
interface FormProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning';
}

export function FormProgressBar({
  progress,
  className,
  showPercentage = true,
  color = 'primary'
}: FormProgressBarProps) {
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500'
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progresso do formulário</span>
        {showPercentage && (
          <span className="font-medium">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/**
 * Hook for managing multi-step form state
 */
export function useMultiStepForm(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  return {
    currentStep,
    completedSteps,
    goToStep,
    nextStep,
    prevStep,
    completeStep,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((completedSteps.length) / totalSteps) * 100
  };
}

export default FormProgress;
