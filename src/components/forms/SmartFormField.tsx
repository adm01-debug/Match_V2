/**
 * @fileoverview Smart Form Field Component
 * Enhanced form field with auto-save, validation, and accessibility
 */

import { useState, useCallback, useEffect, useRef, forwardRef, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid';

interface SmartFormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onAutoSave?: (value: string) => Promise<void>;
  autoSaveDelay?: number;
  validate?: (value: string) => string | null | Promise<string | null>;
  validateDebounce?: number;
  helperText?: string;
  tooltip?: string;
  showCharCount?: boolean;
  maxLength?: number;
  required?: boolean;
  error?: string;
}

export const SmartFormField = forwardRef<HTMLInputElement, SmartFormFieldProps>(({
  label,
  name,
  value,
  onChange,
  onAutoSave,
  autoSaveDelay = 1500,
  validate,
  validateDebounce = 500,
  helperText,
  tooltip,
  showCharCount = false,
  maxLength,
  required = false,
  error: externalError,
  className,
  disabled,
  ...props
}, ref) => {
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  
  const autoSaveTimeoutRef = useRef<number | null>(null);
  const validateTimeoutRef = useRef<number | null>(null);
  const lastSavedValueRef = useRef(value);

  const error = externalError || internalError;

  // Auto-save logic
  useEffect(() => {
    if (!onAutoSave || value === lastSavedValueRef.current || !isTouched) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = window.setTimeout(async () => {
      try {
        setIsSaving(true);
        await onAutoSave(value);
        lastSavedValueRef.current = value;
        setSavedSuccessfully(true);
        setTimeout(() => setSavedSuccessfully(false), 2000);
      } catch {
        // Handle error silently or show toast
      } finally {
        setIsSaving(false);
      }
    }, autoSaveDelay);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [value, onAutoSave, autoSaveDelay, isTouched]);

  // Validation logic
  useEffect(() => {
    if (!validate || !isTouched) return;

    if (validateTimeoutRef.current) {
      clearTimeout(validateTimeoutRef.current);
    }

    setValidationState('validating');

    validateTimeoutRef.current = window.setTimeout(async () => {
      try {
        const result = await validate(value);
        if (result) {
          setInternalError(result);
          setValidationState('invalid');
        } else {
          setInternalError(null);
          setValidationState('valid');
        }
      } catch {
        setValidationState('idle');
      }
    }, validateDebounce);

    return () => {
      if (validateTimeoutRef.current) {
        clearTimeout(validateTimeoutRef.current);
      }
    };
  }, [value, validate, validateDebounce, isTouched]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    setIsTouched(true);
  }, []);

  const getStatusIcon = () => {
    if (isSaving) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
    if (savedSuccessfully) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (validationState === 'validating') {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
    if (validationState === 'valid' && isTouched) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (validationState === 'invalid' || error) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label 
            htmlFor={name}
            className={cn(
              "text-sm font-medium",
              error && "text-destructive"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showCharCount && maxLength && (
            <span className={cn(
              "text-xs",
              value.length > maxLength * 0.9 ? "text-warning" : "text-muted-foreground",
              value.length >= maxLength && "text-destructive"
            )}>
              {value.length}/{maxLength}
            </span>
          )}
          <AnimatePresence mode="wait">
            {getStatusIcon() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                {getStatusIcon()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative">
        <Input
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          className={cn(
            "transition-all duration-200",
            error && "border-destructive focus-visible:ring-destructive",
            validationState === 'valid' && isTouched && "border-green-500 focus-visible:ring-green-500",
            className
          )}
          {...props}
        />
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            id={`${name}-error`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-destructive flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </motion.p>
        ) : helperText ? (
          <motion.p
            key="helper"
            id={`${name}-helper`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

SmartFormField.displayName = "SmartFormField";

export default SmartFormField;
