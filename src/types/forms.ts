/**
 * @fileoverview Form type definitions and schemas
 * @module types
 */

export interface FormField {
  readonly name: string;
  readonly  label: string;
  readonly  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  readonly  required?: boolean;
  readonly  placeholder?: string;
  readonly  options?: { value: string; label: string }[];
  readonly  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface FormState {
  readonly isSubmitting: boolean;
  readonly  isValid: boolean;
  readonly  isDirty: boolean;
  readonly  errors: Record<string, string>;
}
